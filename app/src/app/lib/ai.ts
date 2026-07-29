import type { CoreAction } from '../data/store';
import type { KnowledgeNote } from '../data/knowledge';
import type { AgentId } from '../data/types';
import { supabase } from './supabase';

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
  agent: AgentId = 'ops',
): Promise<CoreReply> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...await authHeader() },
      body: JSON.stringify({ messages: history, context, agent }),
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
  } catch (err) {
    console.warn('[nexus/ai] chat error:', err instanceof Error ? err.message : err);
    const msg = "I'm having trouble connecting right now. Please try again in a moment.";
    onDelta(msg);
    return { text: msg, recommendations: [] };
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


// --- Creative Services Pipeline ---

import type { Enquiry, ProjectBrief, CreativeIdeation, Proposal, Quotation } from '../data/types';

export async function generateBrief(transcript: string, enquiry: Partial<Enquiry>): Promise<ProjectBrief> {
  try {
    const res = await fetch('/api/pipeline/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...await authHeader() },
      body: JSON.stringify({ transcript, enquiry }),
    });
    if (!res.ok) throw new Error(`brief ${res.status}`);
    aiLive = true;
    return await res.json();
  } catch {
    aiLive = false;
    return localBriefFallback(enquiry);
  }
}

export async function generateProposal(brief: ProjectBrief, ideation: CreativeIdeation, enquiry: Partial<Enquiry>): Promise<Proposal> {
  try {
    const res = await fetch('/api/pipeline/proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...await authHeader() },
      body: JSON.stringify({ brief, ideation, enquiry }),
    });
    if (!res.ok) throw new Error(`proposal ${res.status}`);
    aiLive = true;
    return await res.json();
  } catch {
    aiLive = false;
    return localProposalFallback(brief, ideation, enquiry);
  }
}

export async function generateQuotation(brief: ProjectBrief, proposal: Proposal, enquiry: Partial<Enquiry>): Promise<Quotation> {
  try {
    const res = await fetch('/api/pipeline/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...await authHeader() },
      body: JSON.stringify({ brief, proposal, enquiry }),
    });
    if (!res.ok) throw new Error(`quote ${res.status}`);
    aiLive = true;
    return await res.json();
  } catch {
    aiLive = false;
    return localQuoteFallback(brief, proposal, enquiry);
  }
}

function localBriefFallback(enquiry: Partial<Enquiry>): ProjectBrief {
  const company = enquiry.companyName ?? 'the client';
  const service = enquiry.serviceInterest ?? 'creative services';
  return {
    objectives: [
      `Deliver ${service} for ${company} that meets their stated goals`,
      'Create a cohesive visual system aligned with the client\'s brand positioning',
      'Complete all deliverables on schedule and within agreed budget',
      'Establish a foundation for ongoing creative collaboration',
    ],
    deliverables: [
      'Primary creative deliverables as discussed',
      'Brand asset files in all required formats',
      'Style guide and usage documentation',
      'Final handoff with revision rounds included',
    ],
    timeline: enquiry.timeline ?? 'To be confirmed',
    budgetSignal: enquiry.budgetRange ?? 'To be discussed',
    targetAudience: 'As defined by the client in discovery',
    keyMessages: [
      'Quality and craft as non-negotiables',
      'Timeline discipline and clear communication',
      'Creative work grounded in strategy',
    ],
    generatedAt: new Date().toISOString(),
  };
}

function localProposalFallback(brief: ProjectBrief, ideation: CreativeIdeation, enquiry: Partial<Enquiry>): Proposal {
  const company = enquiry.companyName ?? 'the client';
  return {
    title: `${company} — Creative Partnership Proposal`,
    executiveSummary: `We have reviewed your brief carefully and are excited by the opportunity to work with ${company}.\n\nOur proposal covers the full scope discussed: ${brief.deliverables.slice(0, 3).join(', ')}, and more. We will deliver a cohesive creative system built around the principle: ${ideation.bigIdea}.\n\nTimeline: ${brief.timeline}. Investment: ${brief.budgetSignal}.`,
    sections: [
      { title: 'Our Approach', body: `Guided by the creative direction: ${ideation.creativeDirection.slice(0, 200)}...` },
      { title: 'Scope of Work', body: brief.deliverables.join('\n') },
      { title: 'Timeline & Process', body: `${brief.timeline}. We work in two-week sprints with a formal review at each milestone.` },
      { title: 'Delivery & Handoff', body: 'All assets delivered in organised, documented files. A handoff session is included to ensure a smooth transition to your team.' },
    ],
    deliverables: brief.deliverables,
    timeline: brief.timeline,
    teamNotes: 'Led by our Creative Director with senior talent across design, motion, and strategy.',
    generatedAt: new Date().toISOString(),
  };
}

function localQuoteFallback(brief: ProjectBrief, proposal: Proposal, _enquiry: Partial<Enquiry>): Quotation {
  const deliverableCount = proposal.deliverables.length;
  const baseHours = Math.max(40, deliverableCount * 16);
  const rate = 225;
  const items = proposal.deliverables.slice(0, 6).map((d, i) => {
    const qty = Math.max(8, Math.round((baseHours / deliverableCount) * (i === 0 ? 1.5 : 1)));
    return { description: d, quantity: qty, unit: 'hrs', rate, total: qty * rate };
  });
  items.push({ description: 'Project Management & Handoff', quantity: 16, unit: 'hrs', rate: 175, total: 2800 });
  items.push({ description: 'Revisions Allowance (2 rounds)', quantity: 1, unit: 'unit', rate: 3500, total: 3500 });
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 30);
  return {
    lineItems: items,
    subtotal,
    tax: 0,
    total: subtotal,
    currency: 'USD',
    validUntil: validDate.toISOString().split('T')[0],
    notes: '50% deposit required to commence. Balance due on final delivery. Out-of-scope revisions billed at $225/hr. Rates locked for 30 days.',
    generatedAt: new Date().toISOString(),
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
      headers: { 'Content-Type': 'application/json', ...await authHeader() },
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
