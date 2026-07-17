import type { CoreAction } from '../data/store';
import type { KnowledgeNote } from '../data/knowledge';

export interface Recommendation {
  title: string;
  description: string;
  action: CoreAction;
}

export interface CoreReply {
  text: string;
  recommendations: Recommendation[];
}

const REC_MARKER = '%%RECOMMENDATIONS%%';

let aiLive: boolean | null = null;

export async function checkAI(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    aiLive = Boolean(data.ai);
  } catch {
    aiLive = false;
  }
  return aiLive;
}

export function isAILive(): boolean | null {
  return aiLive;
}

/**
 * Streams a Core chat reply. onDelta receives display-safe text (the
 * recommendations marker and everything after it is held back).
 * Falls back to a locally computed, data-grounded reply when the server
 * or API key is unavailable — the demo never dies on stage.
 */
export async function streamCoreChat(
  history: { role: 'user' | 'core'; content: string }[],
  context: object,
  onDelta: (visibleText: string) => void,
): Promise<CoreReply> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, context }),
    });
    if (!res.ok || !res.body) throw new Error(`chat ${res.status}`);
    aiLive = true;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      const visible = full.split(REC_MARKER)[0];
      onDelta(visible.trimEnd());
    }
    return parseReply(full);
  } catch {
    aiLive = false;
    const fallback = localFallback(history[history.length - 1]?.content ?? '', context);
    await typeOut(fallback.text, onDelta);
    return fallback;
  }
}

function parseReply(full: string): CoreReply {
  const [text, recPart] = full.split(REC_MARKER);
  let recommendations: Recommendation[] = [];
  if (recPart) {
    try {
      const start = recPart.indexOf('[');
      const end = recPart.lastIndexOf(']');
      if (start !== -1 && end > start) {
        recommendations = JSON.parse(recPart.slice(start, end + 1));
      }
    } catch { /* malformed recs — show text only */ }
  }
  return { text: text.trimEnd(), recommendations };
}

async function typeOut(text: string, onDelta: (t: string) => void) {
  const words = text.split(' ');
  let acc = '';
  for (const word of words) {
    acc += (acc ? ' ' : '') + word;
    onDelta(acc);
    await new Promise(r => setTimeout(r, 18));
  }
}

/**
 * Offline fallback: computes a real answer from the live store snapshot so
 * even without a network the reply is grounded in actual app state.
 */
function localFallback(query: string, context: object): CoreReply {
  const ctx = context as {
    employees?: { id: string; name: string; workload: number; burnoutRisk: number; availability: string }[];
    projects?: { id: string; name: string; risk: string; deadline: string; progress: number }[];
    clients?: { id: string; name: string; lastContact: string; healthScore: number }[];
  };
  const employees = ctx.employees ?? [];
  const projects = ctx.projects ?? [];
  const clients = ctx.clients ?? [];

  const q = query.toLowerCase();
  const stressed = [...employees].sort((a, b) => b.burnoutRisk - a.burnoutRisk)[0];
  const freest = [...employees].sort((a, b) => a.workload - b.workload)[0];
  const riskiest = projects.find(p => p.risk === 'high') ?? [...projects].sort((a, b) => a.progress - b.progress)[0];
  const coldest = [...clients].sort((a, b) => a.healthScore - b.healthScore)[0];

  if (q.includes('burn') || q.includes('workload') || q.includes('capacity') || q.includes('team')) {
    return {
      text: `Running in offline mode with local analysis. ${stressed?.name} is carrying the highest burnout risk on the team (${stressed?.burnoutRisk}%) at ${stressed?.workload}% utilization — past the 85% threshold our Q2 retro flagged. ${freest?.name} has the most available capacity (${freest?.workload}%).`,
      recommendations: stressed && freest ? [{
        title: `Rebalance ${stressed.name} → ${freest.name}`,
        description: `Shift one active workstream from ${stressed.name} to ${freest.name} to bring utilization back into the healthy 70–85% band.`,
        action: { type: 'reassign', fromEmployeeId: stressed.id, toEmployeeId: freest.id },
      }] : [],
    };
  }
  if (q.includes('client') || q.includes('follow') || q.includes('churn')) {
    return {
      text: `Running in offline mode with local analysis. ${coldest?.name} has the weakest relationship health (${coldest?.healthScore}%) and was last contacted ${coldest?.lastContact}. Silence gaps over two weeks correlate with churn in our client history.`,
      recommendations: coldest ? [{
        title: `Follow up with ${coldest.name}`,
        description: 'Send a check-in with a project status summary to re-open the conversation.',
        action: { type: 'contact_client', clientId: coldest.id },
      }] : [],
    };
  }
  if (q.includes('risk') || q.includes('project') || q.includes('deadline') || q.includes('behind')) {
    return {
      text: `Running in offline mode with local analysis. ${riskiest?.name} is the project most at risk — ${riskiest?.progress}% complete with a ${riskiest?.deadline} deadline and risk level "${riskiest?.risk}".`,
      recommendations: riskiest ? [{
        title: `Extend ${riskiest.name} deadline`,
        description: 'Add 7 days of buffer and notify the client with a revised timeline before it becomes a surprise.',
        action: { type: 'extend_deadline', projectId: riskiest.id, days: 7 },
      }] : [],
    };
  }
  return {
    text: `Running in offline mode with local analysis. Snapshot: ${projects.length} active projects (${projects.filter(p => p.risk === 'high').length} high-risk), team utilization peaks at ${stressed?.workload}% (${stressed?.name}), and ${coldest?.name} is the client most in need of attention (health ${coldest?.healthScore}%). Ask me about team capacity, project risk, or client health for a deeper cut.`,
    recommendations: [],
  };
}

export interface KnowledgeResult {
  answer: string;
  sourceIds: string[];
  offline: boolean;
}

export async function askKnowledge(query: string, notes: KnowledgeNote[]): Promise<KnowledgeResult> {
  try {
    const res = await fetch('/api/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, notes }),
    });
    if (!res.ok) throw new Error(`knowledge ${res.status}`);
    const data = await res.json();
    aiLive = true;
    return { answer: data.answer, sourceIds: data.sourceIds ?? [], offline: false };
  } catch {
    aiLive = false;
    const q = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const scored = notes
      .map(n => ({
        n,
        score: q.reduce(
          (acc, w) =>
            acc +
            (n.content.toLowerCase().includes(w) ? 2 : 0) +
            (n.title.toLowerCase().includes(w) ? 3 : 0) +
            (n.tags.some(t => t.includes(w)) ? 2 : 0),
          0,
        ),
      }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    if (scored.length === 0) {
      return { answer: 'No matching notes found in the knowledge base (offline keyword search). Try different terms.', sourceIds: [], offline: true };
    }
    return {
      answer: `Offline keyword match — top result: "${scored[0].n.title}". ${scored[0].n.content}`,
      sourceIds: scored.map(x => x.n.id),
      offline: true,
    };
  }
}
