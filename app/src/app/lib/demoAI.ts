// Demo-mode AI: deterministic, data-grounded stand-ins for every agent call.
// Nothing here touches the network — used when VITE_DEMO_MODE is not 'false'.
import type {
  AgentId, AgencySignal, CreativeIdeation, Enquiry, ProjectBrief, Proposal, Quotation, QuotationLineItem,
} from '../data/types';
import type { CoreReply, AnalyticsInsight } from './ai';

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Simulated model latency, so the UI's "Core is thinking" states still show. */
export const thinking = () => sleep(1200 + Math.random() * 1300);

// --- Context shape (subset of store.contextSnapshot) ------------------------

interface Ctx {
  projects?: { id: string; name: string; client: string; progress: number; deadline: string; risk: string; status: string; budget: string; team: string[] }[];
  employees?: { id: string; name: string; role: string; availability: string; workload: number; skills: string[]; performanceScore: number; burnoutRisk: number; currentProjects: number }[];
  clients?: { id: string; name: string; industry: string; activeProjects: number; revenue: string; lastContact: string; healthScore: number; status: string }[];
  enquiries?: { id: string; companyName: string; status: string; serviceInterest: string; budgetRange: string }[];
  dmfCandidates?: { id: string; name: string; primaryRole: string; skills: string[]; experience: number; dmfRating: number; availability: string; dayRate: number }[];
  productionResources?: { id: string; name: string; type: string; dailyRate: number }[];
  rfpTenders?: { id: string; title: string; fitScore: number; status: string; submissionDeadline: string; estimatedValue: string }[];
}

const fmtUSD = (n: number) => `$${n.toLocaleString('en-US')}`;
const isoDate = (d: Date) => d.toISOString().split('T')[0];
const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

// --- Pipeline: Brief ---------------------------------------------------------

const DELIVERABLE_RULES: { re: RegExp; items: string[] }[] = [
  { re: /brand identity|visual identity|rebrand|brand refresh|identity/i, items: ['Brand identity system — logo suite, colour palette, typography', 'Brand guidelines document (PDF + editable source)'] },
  { re: /\blogo\b/i, items: ['Primary logo, secondary marks and favicon set'] },
  { re: /website|web design|landing page|site\b/i, items: ['Responsive website design (up to 8 core page templates)', 'Developer handoff — Figma components and design tokens'] },
  { re: /\bapp\b|mobile|ui\/ux|ux\b|interface/i, items: ['App UI redesign — key user flows and component library'] },
  { re: /video|film|trailer|motion|animation/i, items: ['Hero film / trailer (60–90s) with 15s and 6s cutdowns', 'Motion design toolkit — logo animation and transitions'] },
  { re: /social|instagram|tiktok|content/i, items: ['Social content suite — 24 launch posts across 3 formats', 'Social templates for in-house team'] },
  { re: /campaign|launch|advert|ads?\b/i, items: ['Integrated launch campaign concept and key visual', 'Campaign rollout plan with channel-specific assets'] },
  { re: /packaging|label|pack\b/i, items: ['Packaging design for core range (dielines + print-ready files)'] },
  { re: /photo|shoot|art direction/i, items: ['Art-directed photography shoot (1 day, studio + lifestyle)'] },
  { re: /email|newsletter/i, items: ['Email template system (launch + nurture sequence)'] },
  { re: /collateral|print|brochure|deck/i, items: ['Marketing collateral — pitch deck, one-pager, business cards'] },
];

const AUDIENCE_RULES: { re: RegExp; text: string }[] = [
  { re: /gen ?z|young|students?|gamers?|game/i, text: 'Digitally native 18–30 year olds who discover brands through social and community channels' },
  { re: /b2b|enterprise|saas|investors?|series [a-c]/i, text: 'Decision-makers and investors evaluating credibility, clarity and growth potential' },
  { re: /coffee|food|drink|retail|shop|consumer/i, text: 'Quality-conscious consumers aged 25–45 who value provenance and design-led products' },
  { re: /health|wellness|clinic|medical/i, text: 'Health-aware adults seeking trustworthy, approachable expertise' },
];

function extractDeliverables(text: string): string[] {
  const out: string[] = [];
  for (const rule of DELIVERABLE_RULES) {
    if (rule.re.test(text)) for (const item of rule.items) if (!out.includes(item)) out.push(item);
  }
  if (out.length === 0) {
    out.push('Creative concept development (2 territories)', 'Core design deliverables as scoped in discovery', 'Asset library in all required formats');
  }
  return out.slice(0, 7);
}

/** Pull a few "quoted" or emphasised client phrases out of the transcript for key messages. */
function extractKeyMessages(transcript: string, service: string): string[] {
  const msgs: string[] = [];
  const quoted = transcript.match(/"([^"]{8,60})"/g)?.map(q => q.replace(/"/g, '')) ?? [];
  msgs.push(...quoted.slice(0, 2));
  const pool = [
    /premium|luxury|high[- ]end/i.test(transcript) && 'Premium, considered craft',
    /sustainab|eco|green/i.test(transcript) && 'Sustainability as a core value',
    /fun|playful|bold/i.test(transcript) && 'Bold and playful personality',
    /trust|credib|professional/i.test(transcript) && 'Credibility and trust',
    /simple|clean|minimal/i.test(transcript) && 'Clarity through simplicity',
    /community|people|human/i.test(transcript) && 'Human, community-first voice',
  ].filter(Boolean) as string[];
  msgs.push(...pool);
  if (msgs.length < 3) msgs.push(`Distinctive ${service.split(/[,+—-]/)[0].trim().toLowerCase()}`, 'Consistency across every touchpoint', 'Built to scale with the business');
  return [...new Set(msgs)].slice(0, 5);
}

export function demoBrief(transcript: string, enquiry: Partial<Enquiry>): ProjectBrief {
  const company = enquiry.companyName ?? 'the client';
  const service = enquiry.serviceInterest ?? 'creative services';
  const source = `${service}\n${transcript}`;
  const audience = AUDIENCE_RULES.find(r => r.re.test(source))?.text
    ?? `${enquiry.industry ? `${enquiry.industry} customers` : 'The client\'s core customers'} who expect a polished, consistent brand experience`;
  return {
    objectives: [
      `Position ${company} clearly and distinctively within ${enquiry.industry ?? 'its market'}`,
      `Deliver ${lowerFirst(service)} to a launch-ready standard`,
      'Create a flexible system the in-house team can extend after handoff',
      `Hit the ${enquiry.timeline ?? 'agreed'} timeline with clear review milestones`,
    ],
    deliverables: extractDeliverables(source),
    timeline: enquiry.timeline ?? 'To be confirmed',
    budgetSignal: enquiry.budgetRange ?? 'To be discussed',
    targetAudience: audience,
    keyMessages: extractKeyMessages(transcript, service),
    generatedAt: new Date().toISOString(),
  };
}

// --- Pipeline: Proposal ------------------------------------------------------

function phases(timeline: string): string {
  const weeks = Number(timeline.match(/(\d+)\s*week/i)?.[1] ?? 8);
  const a = Math.max(1, Math.round(weeks * 0.2));
  const b = Math.max(1, Math.round(weeks * 0.45));
  return [
    `Weeks 1–${a} · Discover — stakeholder interviews, audit, strategy sign-off`,
    `Weeks ${a + 1}–${a + b} · Create — concept territories, refinement, two review rounds`,
    `Weeks ${a + b + 1}–${weeks} · Deliver — production, QA, final handoff session`,
  ].join('\n');
}

export function demoProposal(brief: ProjectBrief, ideation: CreativeIdeation, enquiry: Partial<Enquiry>): Proposal {
  const company = enquiry.companyName ?? 'the client';
  const tone = ideation.toneWords.filter(Boolean).join(', ').toLowerCase();
  return {
    title: `${company} — ${ideation.bigIdea || 'Creative Partnership'}`,
    executiveSummary:
      `${company} needs ${lowerFirst(enquiry.serviceInterest ?? 'creative work')} that speaks directly to ${lowerFirst(brief.targetAudience)}.\n\n` +
      `Our answer is built around one idea: "${ideation.bigIdea || 'clarity with character'}". Every deliverable — from ${brief.deliverables[0]?.toLowerCase() ?? 'the core identity'} onwards — will feel ${tone || 'confident and considered'}.\n\n` +
      `We will deliver the full scope within ${brief.timeline}, working inside a budget of ${brief.budgetSignal}.`,
    sections: [
      { title: 'Creative Direction', body: ideation.creativeDirection || 'A focused visual and verbal system rooted in the client\'s strategy.' },
      { title: 'Objectives', body: brief.objectives.join('\n') },
      { title: 'Scope of Work', body: brief.deliverables.join('\n') },
      { title: 'Timeline & Process', body: phases(brief.timeline) },
      { title: 'Why Us', body: `We have shipped comparable work for clients in ${enquiry.industry ?? 'adjacent sectors'}, with a senior team that stays on the project from kickoff to handoff — no bait-and-switch.` },
    ],
    deliverables: brief.deliverables,
    timeline: brief.timeline,
    teamNotes: 'Creative Director (lead), Senior Designer, Motion Designer, Strategist, and a dedicated Account Manager as single point of contact.',
    generatedAt: new Date().toISOString(),
  };
}

// --- Pipeline: Quote ---------------------------------------------------------

/** Midpoint of a budget string like "$35,000 – $50,000" or "Under $10,000". */
function budgetTarget(budget: string | undefined): number {
  const nums = (budget ?? '').match(/\d[\d,]*/g)?.map(n => Number(n.replace(/,/g, ''))) ?? [];
  if (nums.length >= 2) return (nums[0] + nums[1]) / 2;
  if (nums.length === 1) return /under/i.test(budget!) ? nums[0] * 0.8 : nums[0] * 1.2;
  return 30000;
}

export function demoQuote(brief: ProjectBrief, proposal: Proposal, enquiry: Partial<Enquiry>): Quotation {
  const rate = 150;
  const target = budgetTarget(enquiry.budgetRange ?? brief.budgetSignal);
  const fixed: QuotationLineItem[] = [
    { description: 'Strategy & discovery workshop', quantity: 12, unit: 'hrs', rate, total: 12 * rate },
    { description: 'Project management & account lead', quantity: 1, unit: 'unit', rate: 0, total: 0 },
    { description: 'Revisions allowance (2 rounds)', quantity: 1, unit: 'unit', rate: 0, total: 0 },
  ];
  const deliverables = proposal.deliverables.slice(0, 7);
  // Split ~75% of the target budget across deliverables, weighting the first (hero) item.
  const weights = deliverables.map((_, i) => (i === 0 ? 2 : 1));
  const wsum = weights.reduce((a, b) => a + b, 0);
  const pool = target * 0.75 - fixed[0].total;
  const items: QuotationLineItem[] = deliverables.map((d, i) => {
    const qty = Math.max(8, Math.round((pool * weights[i]) / wsum / rate / 4) * 4);
    return { description: d, quantity: qty, unit: 'hrs', rate, total: qty * rate };
  });
  const pmHours = Math.max(12, Math.round((target * 0.12) / 125 / 4) * 4);
  fixed[1] = { ...fixed[1], quantity: pmHours, unit: 'hrs', rate: 125, total: pmHours * 125 };
  const rev = Math.round((target * 0.08) / 500) * 500 || 1500;
  fixed[2] = { ...fixed[2], rate: rev, total: rev };
  const lineItems = [fixed[0], ...items, fixed[1], fixed[2]];
  const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
  const valid = new Date();
  valid.setDate(valid.getDate() + 30);
  return {
    lineItems,
    subtotal,
    tax: 0,
    total: subtotal,
    currency: 'USD',
    validUntil: isoDate(valid),
    notes: `50% deposit to commence, 50% on final delivery. Additional revision rounds billed at ${fmtUSD(rate)}/hr. Quote valid for 30 days.`,
    generatedAt: new Date().toISOString(),
  };
}

// --- Core chat (4 agents) ----------------------------------------------------
// Fully hardcoded: each agent has a fixed set of scripted answers. A question
// that mentions a topic's keywords gets that answer; anything else cycles
// through the agent's answers in order, so every question gets a reply.
// Recommendation IDs refer to the seed data in data/mockData.ts.

interface Scripted extends CoreReply {
  keywords: RegExp;
}

const SCRIPTS: Record<AgentId, Scripted[]> = {
  ops: [
    {
      keywords: /week|focus|priorit|today|plan|summary|overview|status|how are/i,
      text: 'This week\'s priorities, in order:\n\n1. **Nexora Web Platform** — the only high-risk project (22% done). Lock the scope with the client.\n2. **Shamba Campaign** — 91% complete and in review. Push for final approval so it can close.\n3. **Pulse App Redesign** — on track at 43%, but watch the Aug 12 deadline.\n\nEverything else is green.',
      recommendations: [
        { title: 'Ask Mira to call Nexora AI', description: 'Client Success can lock the scope with Peter.', action: { type: 'handoff', toAgent: 'client', reason: 'Lock Nexora scope with the client' } },
      ],
    },
    {
      keywords: /risk|late|behind|deadline|delay|urgent|nexora|problem|wrong/i,
      text: 'One project needs attention now. **Nexora Web Platform** for Nexora AI is only 22% complete against a Sep 5 deadline, and the scope has grown three times since kickoff without sign-off. Faith Nyambura is on it at 95% workload, so the team has no slack. I recommend buying a week of buffer and moving some of Faith\'s load to Hassan Abdi, who is at 30%.',
      recommendations: [
        { title: 'Extend Nexora Web Platform by 7 days', description: 'Adds a QA buffer without cutting scope.', action: { type: 'extend_deadline', projectId: 'p4', days: 7, note: 'Buffer for scope growth' } },
        { title: 'Rebalance Faith → Hassan', description: 'Move a workstream from Faith Nyambura (95%) to Hassan Abdi (30%).', action: { type: 'reassign', fromEmployeeId: 'e5', toEmployeeId: 'e6', note: 'Workload rebalance' } },
      ],
    },
    {
      keywords: /capacity|workload|busy|overload|team|who|people|resourc/i,
      text: 'Team utilisation averages 65% across nine people, but it is uneven. **Faith Nyambura** (95%) and **Kevin Ochieng** (84%) are carrying the heaviest load, while **Lena Akinyi** (40%) and **Hassan Abdi** (30%) have room for more. Moving one workstream from Kevin to Lena evens things out without slowing any project.',
      recommendations: [
        { title: 'Rebalance Kevin → Lena', description: 'Shift research tasks on Pulse App Redesign to Lena Akinyi.', action: { type: 'reassign', fromEmployeeId: 'e1', toEmployeeId: 'e4', note: 'Even out workload' } },
      ],
    },
    {
      keywords: /budget|money|revenue|cost|profit/i,
      text: 'The six live projects are worth **$354K** in total. Nexora Web Platform is the largest at $120K and also the riskiest, because unpaid scope growth is eating into its margin. Savanna Brand Identity ($48K) and Shamba Campaign ($31K) are the healthiest — both on schedule with no scope changes.',
      recommendations: [],
    },
  ],
  talent: [
    {
      keywords: /.*/,
      text: 'Team health overall is fair. Seven of nine people are under 80% workload, and average performance is strong. The one risk is concentration: Faith Nyambura sits on three projects at once. Spreading her work is the single biggest improvement we can make this month.',
      recommendations: [
        { title: 'Hand off to Zara', description: 'Operations can replan Faith\'s project load.', action: { type: 'handoff', toAgent: 'ops', reason: 'Replan Faith Nyambura\'s project load' } },
      ],
    },
    {
      keywords: /burn|tired|stress|wellbeing|overwork|exhaust/i,
      text: 'Burnout watch: **Faith Nyambura** is at 81% burnout risk on 95% workload, across three projects. **Kevin Ochieng** is next at 62%. Faith needs relief this week — I recommend moving one project to Wanjiku Mwangi, who is at 55% and has the art-direction experience to pick it up.',
      recommendations: [
        { title: 'Move work from Faith to Wanjiku', description: 'Wanjiku Mwangi takes over Kilele Packaging Design reviews.', action: { type: 'reassign', fromEmployeeId: 'e5', toEmployeeId: 'e2', note: 'Burnout relief' } },
      ],
    },
    {
      keywords: /hire|freelanc|recruit|candidate|contract|extra|help|need/i,
      text: 'From the DMF talent pool, the best available match right now is **Amina Otieno** — a Nairobi-based Senior Brand Designer, rated 91/100, at $420/day. She can start immediately and would take pressure off Faith Nyambura on Nexora Web Platform. For a lower day rate, **Brian Kamau** (Motion Designer, 87/100, $350/day) is also free.',
      recommendations: [
        { title: 'Bring in Amina Otieno', description: 'Senior Brand Designer for Nexora Web Platform.', action: { type: 'recommend_hire', candidateId: 'dmf9', projectId: 'p4', note: 'Relieve Faith Nyambura' } },
        { title: 'Bring in Brian Kamau', description: 'Motion support for Jua Motion Series.', action: { type: 'recommend_hire', candidateId: 'dmf10', projectId: 'p5', note: 'Motion support' } },
      ],
    },
    {
      keywords: /skill|motion|design|ux|brand|strateg|who can/i,
      text: 'Here\'s who covers what in-house:\n\n• **Brand & strategy** — Wanjiku Mwangi, Hassan Abdi\n• **Motion & video** — Tevin Kiprono, Kevin Ochieng, Dennis Mutua\n• **UX & product** — Lena Akinyi, Faith Nyambura\n• **Copy (English & Swahili)** — Mercy Chebet\n• **Accounts** — Lilian Wairimu\n\nThe gap is senior packaging design. If Kilele Packaging Design grows, Ingrid Solvang from the DMF pool (97/100) is the specialist to call.',
      recommendations: [],
    },
  ],
  client: [
    {
      keywords: /.*/,
      text: 'Across six clients, the portfolio is healthy: five are active and scoring 6.8 or higher, with $454K in total revenue. Nexora AI (4.2/10) is the exception and needs attention this week. Everyone else is on a normal check-in rhythm.',
      recommendations: [],
    },
    {
      keywords: /risk|unhappy|churn|leav|nexora|kwame|problem|worr/i,
      text: '**Nexora AI** is the client at risk. Their health score has dropped to 4.2/10, and we last spoke 8 days ago. CEO Peter Kariuki keeps adding features verbally — the scope has tripled without written sign-off. A call this week to agree the scope in writing is the most important thing we can do for this account.',
      recommendations: [
        { title: 'Contact Nexora AI', description: 'Book a scope call with Peter Kariuki.', action: { type: 'contact_client', clientId: 'c4', draft: 'Hi Peter — thanks for all the ideas on the platform. To keep us on schedule, could we book 30 minutes this week to agree the updated scope in writing? — Amani' } },
      ],
    },
    {
      keywords: /follow|contact|email|call|reach|touch|message/i,
      text: 'Two clients are due a follow-up. **Kilele Goods Co.** hasn\'t heard from us in 6 days (health 6.8/10), and **Afya Pulse** in 5 days (7.4/10). A short check-in to each keeps them warm. I\'ve drafted a message for Kilele.',
      recommendations: [
        { title: 'Contact Kilele Goods Co.', description: 'Friendly progress check-in.', action: { type: 'contact_client', clientId: 'c6', draft: 'Hi team — a quick update: the packaging concepts are coming along well and we\'ll share first routes next week. Anything you\'d like us to keep in mind? — Amani' } },
        { title: 'Contact Afya Pulse', description: 'Check in ahead of the Aug 12 milestone.', action: { type: 'contact_client', clientId: 'c2', draft: 'Hi Pulse team — we\'re on track for the Aug 12 milestone. Could we book a short review call next week? — Amani' } },
      ],
    },
    {
      keywords: /best|happy|grow|upsell|opportun|renew|expan/i,
      text: 'Our strongest relationships are **Shamba Foods** (9.6/10) and **Savanna Ventures** (9.1/10). Savanna\'s James mentioned interest in a Q3 campaign during our last call, so that\'s a natural next project worth about the same as their brand identity work.',
      recommendations: [
        { title: 'Contact Savanna Ventures', description: 'Propose the Q3 campaign.', action: { type: 'contact_client', clientId: 'c1', draft: 'Hi James — following up on the Q3 campaign you mentioned. We\'d love to share a few early ideas. Does Thursday work? — Amani' } },
      ],
    },
  ],
  production: [
    {
      keywords: /.*/,
      text: 'Production is in good shape. All three studios have open days next week, and every piece of equipment is available. The only shoot on the horizon is **Jua Motion Series** — I suggest locking Studio A now so it doesn\'t get taken.',
      recommendations: [
        { title: 'Book Studio A', description: 'Next Monday for Jua Motion Series.', action: { type: 'book_studio', resource: 'studio-a', date: '2026-11-02', projectId: 'p5', note: 'Motion series shoot' } },
      ],
    },
    {
      keywords: /studio|book|space|shoot|film|room/i,
      text: '**Studio A — Large Cyclorama** is available next Monday at $2,800/day, which suits the Jua Motion Series shoot. For product work, **Studio B — Tabletop & Product** ($1,400/day) is a better fit for Kilele Packaging Design photography.',
      recommendations: [
        { title: 'Book Studio A', description: 'Next Monday for Jua Motion Series.', action: { type: 'book_studio', resource: 'studio-a', date: '2026-11-02', projectId: 'p5', note: 'Motion series shoot' } },
        { title: 'Book Studio B', description: 'Packaging shots for Kilele.', action: { type: 'book_studio', resource: 'studio-b', date: '2026-11-04', projectId: 'p6', note: 'Packaging photography' } },
      ],
    },
    {
      keywords: /crew|people|staff|team|who/i,
      text: 'For a one-day shoot on **Jua Motion Series**, I\'d crew a Director of Photography, a Gaffer and a Producer, with Kevin Ochieng leading motion. That covers camera, lighting and the schedule without overstaffing.',
      recommendations: [
        { title: 'Allocate crew to Jua Motion Series', description: 'DP, Gaffer, Producer.', action: { type: 'allocate_crew', projectId: 'p5', roles: ['Director of Photography', 'Gaffer', 'Producer'], note: 'One-day shoot' } },
      ],
    },
    {
      keywords: /equip|camera|gear|kit|drone|light/i,
      text: 'Available kit:\n\n• **RED Komodo 6K Package** — $850/day\n• **DJI Mavic 3 Cine Drone** — $420/day\n• **ARRI Lighting Package (4-head)** — $680/day\n\nFor Jua\'s motion series, the RED and ARRI lights together come to $1,530/day.',
      recommendations: [],
    },
  ],
};

// Questions clearly in another agent's area get handed off to that agent.
const AGENT_TOPICS: { agent: AgentId; name: string; area: string; keywords: RegExp }[] = [
  { agent: 'ops', name: 'Zara', area: 'projects and deadlines', keywords: /deadline|project|late|behind|budget|schedule/i },
  { agent: 'talent', name: 'Knox', area: 'people and hiring', keywords: /burn|hire|freelanc|recruit|candidate|talent|skill/i },
  { agent: 'client', name: 'Mira', area: 'client relationships', keywords: /client|customer|unhappy|churn|follow.?up/i },
  { agent: 'production', name: 'Axel', area: 'studios, crew and equipment', keywords: /studio|shoot|crew|equipment|camera|gear/i },
];

// Questions that match no topic rotate through an agent's answers, starting with its overview.
const nextFallback: Record<AgentId, number> = { ops: 0, talent: 0, client: 0, production: 0 };

export function demoChat(question: string, _context: object, agent: AgentId): CoreReply {
  const scripts = SCRIPTS[agent];
  const hit = scripts.find(s => s.keywords.source !== '.*' && s.keywords.test(question));
  if (hit) return { text: hit.text, recommendations: hit.recommendations };

  const other = AGENT_TOPICS.find(t => t.agent !== agent && t.keywords.test(question));
  if (other) {
    return {
      text: `That's one for **${other.name}**, who looks after ${other.area}. I'll pass it over so you get the full picture.`,
      recommendations: [
        { title: `Hand off to ${other.name}`, description: `Continue this question with ${other.name}.`, action: { type: 'handoff', toAgent: other.agent, reason: question } },
      ],
    };
  }

  const pick = scripts[nextFallback[agent]++ % scripts.length];
  return { text: pick.text, recommendations: pick.recommendations };
}

/** Streams text word-by-word to mimic a live model response. */
export async function streamText(text: string, onDelta: (t: string) => void): Promise<void> {
  const words = text.split(/(\s+)/);
  let out = '';
  for (const w of words) {
    out += w;
    onDelta(out);
    if (w.trim()) await sleep(18 + Math.random() * 30);
  }
}

// --- Signals & analytics -----------------------------------------------------

export function demoSignals(context: object): AgencySignal[] {
  const c = context as Ctx;
  const now = new Date().toISOString();
  const s: Omit<AgencySignal, 'id'>[] = [];
  for (const p of (c.projects ?? []).filter(p => p.risk === 'high' || p.status === 'at-risk').slice(0, 2)) {
    s.push({ tier: 'critical', title: `${p.name} at risk`, body: `${p.progress}% complete with deadline ${p.deadline} — review scope or extend the timeline today.`, module: 'projects', linkedId: p.id, generatedAt: now });
  }
  for (const e of (c.employees ?? []).filter(e => e.workload > 90 || e.burnoutRisk > 70).slice(0, 2)) {
    s.push({ tier: 'critical', title: `${e.name} over capacity`, body: `${e.workload}% workload and ${e.burnoutRisk}% burnout risk — rebalance their assignments.`, module: 'talent', linkedId: e.id, generatedAt: now });
  }
  for (const cl of (c.clients ?? []).filter(cl => cl.status === 'at-risk' || cl.healthScore < 7).slice(0, 2)) {
    s.push({ tier: 'attention', title: `${cl.name} health slipping`, body: `Health score ${cl.healthScore}/10, last contact ${cl.lastContact} — schedule a check-in.`, module: 'clients', linkedId: cl.id, generatedAt: now });
  }
  for (const p of (c.projects ?? []).filter(p => p.risk === 'medium').slice(0, 1)) {
    s.push({ tier: 'attention', title: `${p.name} needs review`, body: `Medium risk at ${p.progress}% progress — confirm next milestone with the team.`, module: 'projects', linkedId: p.id, generatedAt: now });
  }
  for (const r of (c.rfpTenders ?? []).filter(r => r.fitScore >= 80 && !['won', 'lost', 'submitted'].includes(r.status)).slice(0, 2)) {
    s.push({ tier: 'opportunity', title: `High-fit tender: ${r.title}`, body: `${r.fitScore}% fit, worth ${r.estimatedValue}, due ${r.submissionDeadline} — prioritise the response.`, module: 'pipeline', linkedId: r.id, generatedAt: now });
  }
  const cand = (c.dmfCandidates ?? []).filter(d => d.availability === 'available').sort((a, b) => b.dmfRating - a.dmfRating)[0];
  if (cand) s.push({ tier: 'opportunity', title: `${cand.name} available`, body: `${cand.primaryRole} rated ${cand.dmfRating}/100 is free now — good cover for peak workload.`, module: 'talent', linkedId: cand.id, generatedAt: now });
  const order = { critical: 0, attention: 1, opportunity: 2 };
  return s.sort((a, b) => order[a.tier] - order[b.tier]).slice(0, 8).map((x, i) => ({ ...x, id: `demo-sig-${i}` }));
}

export function demoAnalytics(perspective: 'founder' | 'operations' | 'account_director', context: object): AnalyticsInsight {
  const c = context as Ctx;
  const projects = c.projects ?? [];
  const emps = c.employees ?? [];
  const clients = c.clients ?? [];
  const risky = projects.filter(p => p.risk === 'high');
  const avgLoad = Math.round(emps.reduce((s, e) => s + e.workload, 0) / Math.max(1, emps.length));
  const weak = clients.filter(cl => cl.healthScore < 7);
  if (perspective === 'founder') {
    return {
      headline: `${projects.length} live projects, ${risky.length} at high risk`,
      summary: `The studio is running at ${avgLoad}% average utilisation across ${emps.length} people. ${c.enquiries?.length ?? 0} enquiries are in the pipeline, and ${weak.length} client relationship${weak.length === 1 ? '' : 's'} need founder attention.`,
      alerts: [...risky.map(p => `${p.name} is at high risk`), ...weak.map(cl => `${cl.name} health at ${cl.healthScore}/10`)].slice(0, 4),
    };
  }
  if (perspective === 'operations') {
    const hot = emps.filter(e => e.workload > 85);
    return {
      headline: `Average utilisation ${avgLoad}% — ${hot.length} over 85%`,
      summary: `Delivery capacity is ${avgLoad > 80 ? 'stretched' : 'healthy'}. ${risky.length ? `Prioritise ${risky[0].name} this week.` : 'No projects are in the red.'}`,
      alerts: hot.map(e => `${e.name} at ${e.workload}% workload`).slice(0, 4),
    };
  }
  return {
    headline: `${clients.length} clients, ${weak.length} below health target`,
    summary: weak.length ? `Focus on ${weak.map(cl => cl.name).join(', ')} — a proactive check-in this week reduces renewal risk.` : 'Every client is above the health threshold; look for expansion opportunities.',
    alerts: weak.map(cl => `${cl.name}: last contact ${cl.lastContact}`).slice(0, 4),
  };
}
