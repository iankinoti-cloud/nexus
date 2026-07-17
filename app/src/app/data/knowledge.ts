export interface KnowledgeNote {
  id: string;
  title: string;
  category: 'project-learnings' | 'client-preferences' | 'process' | 'retrospective';
  content: string;
  date: string;
  tags: string[];
}

export const KNOWLEDGE_NOTES: KnowledgeNote[] = [
  {
    id: 'k1',
    title: 'Titan rebranding — what worked',
    category: 'project-learnings',
    content:
      'Titan Ventures responded best to bold geometric marks with high contrast. Their board rejected all gradient-heavy directions in round one. Decision-maker is CMO Elena Titov — she prefers seeing 3 directions max, presented in person. Final identity shipped 2 weeks early because we locked typography before iterating on the mark.',
    date: 'May 2026',
    tags: ['branding', 'titan-ventures', 'presentation'],
  },
  {
    id: 'k2',
    title: 'Pulse Health compliance requirements',
    category: 'client-preferences',
    content:
      'All Pulse Health deliverables must pass WCAG 2.2 AA before client review — their legal team audits everything. Colors must hit 4.5:1 contrast. They use Figma dev mode for handoff and expect tokens named with their internal convention (ph-color-*, ph-space-*). Invoicing must reference PO numbers or accounts payable bounces it.',
    date: 'June 2026',
    tags: ['accessibility', 'pulse-health', 'handoff', 'invoicing'],
  },
  {
    id: 'k3',
    title: 'Nexora scope management history',
    category: 'retrospective',
    content:
      'Nexora AI has expanded scope on both previous engagements — average 30% growth after kickoff. Root cause: their product team joins reviews late and requests changes. Mitigation that worked: written sign-off gates at wireframe and visual design stages, plus a change-request log shared weekly. Do not start build phases without stage sign-off.',
    date: 'April 2026',
    tags: ['scope-creep', 'nexora', 'process'],
  },
  {
    id: 'k4',
    title: 'Motion pipeline: render farm settings',
    category: 'process',
    content:
      'For Solara-style motion series work: render at 2x target resolution, ProRes 4444 masters, H.264 previews for client review. Preview links via Frame.io only — Solara Media\'s IT blocks WeTransfer. Omar\'s AE project template (in /templates/motion-2026) cuts setup time roughly in half.',
    date: 'March 2026',
    tags: ['motion', 'solara-media', 'rendering', 'templates'],
  },
  {
    id: 'k5',
    title: 'Verdant Foods brand voice guide',
    category: 'client-preferences',
    content:
      'Verdant\'s voice: warm, grounded, never preachy about sustainability. Words to avoid: "eco-warrior", "guilt-free", "planet-saving". They loved the harvest-table photography direction from the spring campaign. Campaign approvals go through founder Jess Verde directly — allow 4-5 business days.',
    date: 'June 2026',
    tags: ['copywriting', 'verdant-foods', 'brand-voice', 'approvals'],
  },
  {
    id: 'k6',
    title: 'Q2 retrospective — team utilization',
    category: 'retrospective',
    content:
      'Q2 lesson: running designers above 85% utilization for more than 3 weeks correlated with rework spikes (Nina hit 92% in May and the Crest revisions doubled). Healthy band is 70-85%. Rebalancing early — before someone reports burnout — kept Pulse App Redesign on schedule. Reassignments work best when announced with context, not just calendar moves.',
    date: 'July 2026',
    tags: ['utilization', 'burnout', 'staffing'],
  },
  {
    id: 'k7',
    title: 'Crest Goods packaging print specs',
    category: 'project-learnings',
    content:
      'Crest\'s printer (Meridian Print Co.) requires PDF/X-4, 3mm bleed, spot colors as Pantone Coated. Their last run was delayed 9 days because files went out with RGB embeds — preflight in Acrobat before every handoff. Kraft stock spot-varnish tests looked great and the client wants that direction for the next SKU line.',
    date: 'May 2026',
    tags: ['print', 'crest-goods', 'packaging', 'preflight'],
  },
  {
    id: 'k8',
    title: 'New client onboarding checklist',
    category: 'process',
    content:
      'Standard onboarding: kickoff workshop (90 min), stakeholder map, comms plan (Slack Connect or email digest — ask, don\'t assume), invoicing schedule agreed in week 1, shared asset library set up in week 1. Clients onboarded with the full checklist have averaged 23-point higher health scores at the 3-month mark.',
    date: 'February 2026',
    tags: ['onboarding', 'process', 'client-health'],
  },
  {
    id: 'k9',
    title: 'Pitch learnings: AI-assisted concepting',
    category: 'retrospective',
    content:
      'In the last 4 pitches, showing process (moodboards → AI-assisted explorations → crafted finals) won over showing polished finals alone — clients asked to see "how you think". Pitch decks capped at 16 slides performed best. Live prototype demos beat video walkthroughs every time the wifi held.',
    date: 'June 2026',
    tags: ['pitching', 'new-business', 'ai-workflow'],
  },
  {
    id: 'k10',
    title: 'Solara Media contract terms',
    category: 'client-preferences',
    content:
      'Solara contracts include 2 revision rounds per deliverable; further rounds bill at 1.5x day rate — flag this to the client before starting round 3, never after. Their fiscal year ends in September, so budget approvals stall from mid-August. Get Q4 SOWs signed before August 10.',
    date: 'April 2026',
    tags: ['contracts', 'solara-media', 'revisions', 'billing'],
  },
];
