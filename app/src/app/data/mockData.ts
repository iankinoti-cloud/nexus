import type {
  Project, Employee, Client, Notification, ChatMessage,
  RevenueDataPoint, CompletionDataPoint, UtilizationDataPoint, SatisfactionDataPoint,
  NexusUser, Enquiry,
} from './types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Titan Brand Identity',
    client: 'Titan Ventures',
    progress: 78,
    deadline: 'Jul 28, 2026',
    team: ['AJ', 'MK', 'SR'],
    risk: 'low',
    aiRecommendation: 'Final review phase — schedule client walkthrough this week',
    status: 'active',
    budget: '$48K',
  },
  {
    id: 'p2',
    name: 'Pulse App Redesign',
    client: 'Pulse Health',
    progress: 43,
    deadline: 'Aug 12, 2026',
    team: ['LT', 'NC', 'AJ'],
    risk: 'medium',
    aiRecommendation: 'UX research phase delayed — consider parallel workstreams',
    status: 'active',
    budget: '$72K',
  },
  {
    id: 'p3',
    name: 'Verdant Campaign',
    client: 'Verdant Foods',
    progress: 91,
    deadline: 'Jul 20, 2026',
    team: ['SR', 'MK'],
    risk: 'low',
    aiRecommendation: 'On track — prepare handoff documentation early',
    status: 'review',
    budget: '$31K',
  },
  {
    id: 'p4',
    name: 'Nexora Web Platform',
    client: 'Nexora AI',
    progress: 22,
    deadline: 'Sep 5, 2026',
    team: ['NC', 'LT', 'AJ', 'SR'],
    risk: 'high',
    aiRecommendation: 'Scope creep detected — request scope sign-off immediately',
    status: 'at-risk',
    budget: '$120K',
  },
  {
    id: 'p5',
    name: 'Solara Motion Series',
    client: 'Solara Media',
    progress: 60,
    deadline: 'Aug 3, 2026',
    team: ['MK', 'AJ'],
    risk: 'low',
    aiRecommendation: 'Milestone 3 complete — begin client review cycle',
    status: 'active',
    budget: '$55K',
  },
  {
    id: 'p6',
    name: 'Crest Packaging Design',
    client: 'Crest Goods Co.',
    progress: 35,
    deadline: 'Aug 25, 2026',
    team: ['SR', 'NC'],
    risk: 'medium',
    aiRecommendation: 'Align on print specs before proceeding to final artwork',
    status: 'active',
    budget: '$28K',
  },
];

export const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Alex Johnson',
    role: 'Senior Designer',
    initials: 'AJ',
    avatarColor: '#4FD1C5',
    availability: 'busy',
    workload: 84,
    skills: ['Brand Identity', 'Motion', 'UI/UX'],
    performanceScore: 4.8,
    burnoutRisk: 62,
    compatibilityScore: 94,
    currentProjects: 3,
  },
  {
    id: 'e2',
    name: 'Maya Kim',
    role: 'Creative Director',
    initials: 'MK',
    avatarColor: '#A78BFA',
    availability: 'available',
    workload: 55,
    skills: ['Strategy', 'Art Direction', 'Branding'],
    performanceScore: 4.9,
    burnoutRisk: 28,
    compatibilityScore: 98,
    currentProjects: 2,
  },
  {
    id: 'e3',
    name: 'Sam Rivera',
    role: 'Motion Designer',
    initials: 'SR',
    avatarColor: '#22C55E',
    availability: 'busy',
    workload: 76,
    skills: ['After Effects', '3D', 'Illustration'],
    performanceScore: 4.6,
    burnoutRisk: 45,
    compatibilityScore: 87,
    currentProjects: 3,
  },
  {
    id: 'e4',
    name: 'Leo Tan',
    role: 'UX Researcher',
    initials: 'LT',
    avatarColor: '#FFB547',
    availability: 'available',
    workload: 40,
    skills: ['User Research', 'Wireframing', 'Usability Testing'],
    performanceScore: 4.7,
    burnoutRisk: 18,
    compatibilityScore: 91,
    currentProjects: 2,
  },
  {
    id: 'e5',
    name: 'Nina Chen',
    role: 'Product Designer',
    initials: 'NC',
    avatarColor: '#60A5FA',
    availability: 'at-capacity',
    workload: 95,
    skills: ['Figma', 'Prototyping', 'Design Systems'],
    performanceScore: 4.5,
    burnoutRisk: 81,
    compatibilityScore: 79,
    currentProjects: 4,
  },
  {
    id: 'e6',
    name: 'Omar Fathi',
    role: 'Brand Strategist',
    initials: 'OF',
    avatarColor: '#F472B6',
    availability: 'available',
    workload: 30,
    skills: ['Brand Strategy', 'Copywriting', 'Positioning'],
    performanceScore: 4.8,
    burnoutRisk: 12,
    compatibilityScore: 96,
    currentProjects: 1,
  },
];

export const CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Titan Ventures',
    initials: 'TV',
    avatarColor: '#4FD1C5',
    industry: 'Venture Capital',
    activeProjects: 2,
    revenue: '$148K',
    lastContact: '2 days ago',
    healthScore: 9.1,
    aiFollowUp: 'Send Q3 campaign proposal — interest signaled last call',
    status: 'active',
  },
  {
    id: 'c2',
    name: 'Pulse Health',
    initials: 'PH',
    avatarColor: '#22C55E',
    industry: 'HealthTech',
    activeProjects: 1,
    revenue: '$72K',
    lastContact: '5 days ago',
    healthScore: 7.4,
    aiFollowUp: 'UX research update overdue — schedule sync call',
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Verdant Foods',
    initials: 'VF',
    avatarColor: '#A78BFA',
    industry: 'FMCG',
    activeProjects: 1,
    revenue: '$31K',
    lastContact: '1 day ago',
    healthScore: 9.6,
    aiFollowUp: 'Request referral introduction — NPS score 10',
    status: 'active',
  },
  {
    id: 'c4',
    name: 'Nexora AI',
    initials: 'NA',
    avatarColor: '#FF6B6B',
    industry: 'Artificial Intelligence',
    activeProjects: 1,
    revenue: '$120K',
    lastContact: '8 days ago',
    healthScore: 4.2,
    aiFollowUp: 'Escalation risk — contact founder directly about scope concerns',
    status: 'at-risk',
  },
  {
    id: 'c5',
    name: 'Solara Media',
    initials: 'SM',
    avatarColor: '#FFB547',
    industry: 'Media & Entertainment',
    activeProjects: 1,
    revenue: '$55K',
    lastContact: '3 days ago',
    healthScore: 8.3,
    aiFollowUp: 'Pitch social content retainer post current project',
    status: 'active',
  },
  {
    id: 'c6',
    name: 'Crest Goods Co.',
    initials: 'CG',
    avatarColor: '#60A5FA',
    industry: 'Consumer Goods',
    activeProjects: 1,
    revenue: '$28K',
    lastContact: '6 days ago',
    healthScore: 6.8,
    aiFollowUp: 'Confirm packaging specs — deadline risk in 9 days',
    status: 'active',
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    category: 'project',
    title: 'Titan Brand Identity approved',
    message: 'Marcus Reid approved Phase 3 deliverables. Ready to proceed to final production.',
    read: false,
    timestamp: '12 minutes ago',
    action: 'View Project',
  },
  {
    id: 'n2',
    category: 'deadline',
    title: 'Verdant Campaign deadline in 4 days',
    message: 'Final assets are due Jul 20. Sam Rivera has 3 tasks remaining.',
    read: false,
    timestamp: '1 hour ago',
    action: 'Review Tasks',
  },
  {
    id: 'n3',
    category: 'client',
    title: 'Nexora AI replied to your message',
    message: 'Priya Sharma: "We need to discuss the revised timeline before signing off."',
    read: false,
    timestamp: '2 hours ago',
    action: 'Reply',
  },
  {
    id: 'n4',
    category: 'invoice',
    title: 'Invoice #2847 paid — $48,000',
    message: 'Titan Ventures completed payment for Brand Identity Phase 2.',
    read: true,
    timestamp: '4 hours ago',
    action: 'View Invoice',
  },
  {
    id: 'n5',
    category: 'risk',
    title: 'Nexora Web Platform — scope risk detected',
    message: 'Core detected a 34% scope increase. Recommend immediate client discussion.',
    read: false,
    timestamp: '6 hours ago',
    action: 'View Analysis',
  },
  {
    id: 'n6',
    category: 'project',
    title: 'Pulse App Redesign — milestone reached',
    message: 'Leo Tan completed user research synthesis. UX phase begins Monday.',
    read: true,
    timestamp: 'Yesterday',
    action: 'View Project',
  },
  {
    id: 'n7',
    category: 'deadline',
    title: 'Solara Motion Series check-in',
    message: 'Client review session scheduled for Jul 18. Prepare motion preview files.',
    read: true,
    timestamp: 'Yesterday',
    action: 'Open Calendar',
  },
  {
    id: 'n8',
    category: 'invoice',
    title: 'Invoice #2851 sent — $72,000',
    message: 'Pulse Health invoice for App Redesign Phase 1 sent successfully.',
    read: true,
    timestamp: '2 days ago',
    action: 'View Invoice',
  },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Which team members are at risk of burnout this week?',
    timestamp: '10:14 AM',
  },
  {
    id: 'm2',
    role: 'core',
    content: "I've analyzed workload patterns, calendar density, and recent performance signals across your team.",
    timestamp: '10:14 AM',
    recommendations: [
      {
        title: 'Nina Chen — High Burnout Risk (81%)',
        description: 'Carrying 4 active projects at 95% workload. Recommend removing from Crest Goods project and replacing with Omar Fathi.',
      },
      {
        title: 'Alex Johnson — Moderate Risk (62%)',
        description: 'Deadline cluster next 10 days across 3 projects. Recommend deferring Solara onboarding by 1 week.',
      },
      {
        title: 'Action Recommended',
        description: 'Reallocating Nina from Crest Goods reduces team burnout risk by 28% without impacting project timelines.',
      },
    ],
  },
  {
    id: 'm3',
    role: 'user',
    content: 'What is our revenue forecast for Q3?',
    timestamp: '10:18 AM',
  },
  {
    id: 'm4',
    role: 'core',
    content: "Based on current pipeline, active project values, and historical conversion rates, here's the Q3 forecast:",
    timestamp: '10:18 AM',
    recommendations: [
      {
        title: 'Q3 Revenue Forecast: $847K (+18.5%)',
        description: 'Confidence: 87%. Driven by Nexora AI expansion and two pipeline deals expected to close in August.',
      },
      {
        title: 'Risk Factors',
        description: 'Nexora scope dispute could reduce by $40K if unresolved. Recommend priority escalation this week.',
      },
      {
        title: 'Opportunity Signal',
        description: 'Verdant Foods NPS of 10 suggests high referral potential. Proactive outreach could unlock $60–80K.',
      },
    ],
  },
];

export const SUGGESTED_PROMPTS: string[] = [
  'Identify our highest burnout risk this week',
  'Forecast Q4 revenue based on pipeline',
  'Which clients need immediate attention?',
  'Optimize team allocation for Nexora project',
];

export const REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 180, forecast: 175 },
  { month: 'Feb', revenue: 210, forecast: 205 },
  { month: 'Mar', revenue: 195, forecast: 215 },
  { month: 'Apr', revenue: 240, forecast: 230 },
  { month: 'May', revenue: 258, forecast: 250 },
  { month: 'Jun', revenue: 272, forecast: 265 },
  { month: 'Jul', revenue: 284, forecast: 290 },
  { month: 'Aug', revenue: 0, forecast: 318 },
  { month: 'Sep', revenue: 0, forecast: 340 },
];

export const COMPLETION_DATA: CompletionDataPoint[] = [
  { week: 'W1 Jun', completed: 8, target: 10 },
  { week: 'W2 Jun', completed: 11, target: 10 },
  { week: 'W3 Jun', completed: 9, target: 10 },
  { week: 'W4 Jun', completed: 13, target: 12 },
  { week: 'W1 Jul', completed: 10, target: 11 },
  { week: 'W2 Jul', completed: 12, target: 11 },
];

export const UTILIZATION_DATA: UtilizationDataPoint[] = [
  { name: 'Design', utilization: 84, fill: '#4FD1C5' },
  { name: 'Strategy', utilization: 71, fill: '#22C55E' },
  { name: 'Motion', utilization: 76, fill: '#FFB547' },
  { name: 'Research', utilization: 40, fill: '#A78BFA' },
  { name: 'Production', utilization: 95, fill: '#FF6B6B' },
  { name: 'Brand', utilization: 30, fill: '#60A5FA' },
];

export const SATISFACTION_DATA: SatisfactionDataPoint[] = [
  { month: 'Jan', score: 4.2 },
  { month: 'Feb', score: 4.4 },
  { month: 'Mar', score: 4.3 },
  { month: 'Apr', score: 4.5 },
  { month: 'May', score: 4.6 },
  { month: 'Jun', score: 4.7 },
  { month: 'Jul', score: 4.8 },
];

// --- Creative Services Pipeline ---

export const USERS: NexusUser[] = [
  { id: 'u1', name: 'Sarah Chen', role: 'owner', initials: 'SC', avatarColor: '#C084FC' },
  { id: 'u2', name: 'Maya Kim', role: 'creative_lead', initials: 'MK', avatarColor: '#A78BFA' },
  { id: 'u3', name: 'Omar Fathi', role: 'account_manager', initials: 'OF', avatarColor: '#F472B6' },
  { id: 'u4', name: 'Alex Johnson', role: 'team_member', initials: 'AJ', avatarColor: '#4FD1C5' },
];

export const ENQUIRIES: Enquiry[] = [
  {
    id: 'eq1',
    companyName: 'Orbit Digital',
    contactName: 'Kwame Asante',
    contactEmail: 'kwame@orbitdigital.io',
    contactPhone: '+1 415 882 0041',
    industry: 'EdTech',
    serviceInterest: 'Brand identity + website design for Series A launch',
    budgetRange: '$35,000 – $50,000',
    timeline: '10 weeks',
    source: 'referral',
    status: 'new',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    assignedTo: 'u3',
    notes: 'Referred by Titan Ventures. Kwame is the co-founder. They have a pitch deck but no visual identity yet.',
  },
  {
    id: 'eq2',
    companyName: 'Bloom Botanics',
    contactName: 'Priya Sharma',
    contactEmail: 'priya@bloombotanics.co',
    industry: 'Wellness & Beauty',
    serviceInterest: 'Product launch campaign — social content, art direction, email',
    budgetRange: '$20,000 – $25,000',
    timeline: '6 weeks',
    source: 'website',
    status: 'transcript',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    meetingDate: '2026-07-19',
    assignedTo: 'u3',
    transcript: `Client Discovery Call — Bloom Botanics
Date: 19 July 2026, 09:30 AM
Duration: 18 minutes

Omar Fathi (NEXUS): Tell us about what you're launching.

Priya Sharma (Bloom Botanics): We've been developing our clean skincare range for two years. Three hero products — a face oil, a serum, and a moisturiser. We're finally ready to go to market. September launch, ideally around the 15th.

Omar: What do you need from us creatively?

Priya: The campaign. We need imagery direction — mood board level, art direction for the shoot, and then the actual social content rollout. Maybe 30 pieces across Instagram and email. We're targeting women 28 to 45, conscious consumers — they shop at Aesop, Byredo, that kind of brand. Clean but luxurious, not clinical.

Omar: Budget range?

Priya: We have £20,000 set aside. Could go to £25K if the work is exceptional.

Omar: Timeline for delivery?

Priya: We need everything — final assets, all copy, social calendar — by August 30th. Six weeks from now.

Omar: Who makes the final call on creative approvals?

Priya: Me and my business partner, Diane. We both need to sign off, but I'm the primary contact.

Omar: Perfect. We'll have a brief back to you within the hour.`,
  },
  {
    id: 'eq3',
    companyName: 'Skyline Properties',
    contactName: 'Marcus Reid',
    contactEmail: 'marcus.reid@skylineprops.com',
    contactPhone: '+44 207 946 0832',
    industry: 'Real Estate',
    serviceInterest: 'Brand refresh — logo, visual identity, marketing collateral',
    budgetRange: '$40,000 – $60,000',
    timeline: '14 weeks',
    source: 'event',
    status: 'ideation',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    meetingDate: '2026-07-18',
    assignedTo: 'u2',
    transcript: `Discovery Call — Skyline Properties
Date: 18 July 2026, 2:00 PM
Duration: 24 minutes

Sarah Chen (NEXUS): Marcus, you mentioned at the conference that your current brand is holding you back. Tell me more.

Marcus Reid (Skyline): Exactly. We started 12 years ago as a mid-market residential agent. Now we're doing commercial, development, and luxury residential — but our brand still looks like the 2014 agency we were. We're losing deals to younger firms whose aesthetics signal premium before the meeting even starts.

Sarah: So this is a repositioning.

Marcus: Full repositioning. New logo, updated color palette — we want to move from the navy and gold cliché. New photography direction, pitch deck templates, office signage, the works.

Sarah: Who's the new target client?

Marcus: High-net-worth individuals, family offices, and corporate occupiers in the £5M+ bracket. We want to feel like a boutique private bank, not a high-street agent.

Sarah: Timeline?

Marcus: We need to be live for our Q4 awards submission in October. So everything locked by end of September — 14 weeks.

Sarah: Budget?

Marcus: Board has signed off £45,000. Could release more if the strategic case is there.`,
    brief: {
      objectives: [
        'Reposition Skyline from mid-market agent to premium boutique property firm',
        'Create a brand identity that signals authority and discretion at the £5M+ client level',
        'Deliver a cohesive visual system across digital, print, and environmental touchpoints',
        'Complete all deliverables before October awards submission deadline',
      ],
      deliverables: [
        'New logo suite (primary, secondary, mono, reversed)',
        'Refined color palette and typography system',
        'Brand guidelines document (PDF + Figma)',
        'Photography art direction brief',
        'Pitch deck master template (PowerPoint + Keynote)',
        'Office signage specifications',
        'Digital asset pack (email signatures, social templates)',
      ],
      timeline: '14 weeks — delivery by 26 September 2026',
      budgetSignal: '£45,000 (approx. $57,000) — board-approved, potential flex',
      targetAudience: 'High-net-worth individuals, family offices, and corporate occupiers in the £5M+ property bracket',
      keyMessages: [
        'Boutique private bank aesthetic — not a high-street agent',
        'Authority and discretion as visual principles',
        'Move away from navy/gold toward a more sophisticated palette',
        'Premium feels effortless, not loud',
      ],
      generatedAt: '2026-07-18T15:12:00Z',
    },
  },
  {
    id: 'eq4',
    companyName: 'Fable Studio',
    contactName: 'James Okafor',
    contactEmail: 'james@fablestudio.co',
    contactPhone: '+1 646 203 7714',
    industry: 'Gaming & Interactive',
    serviceInterest: 'App redesign, brand identity, and launch trailer motion for Drift (mobile game)',
    budgetRange: '$65,000 – $75,000',
    timeline: '12 weeks',
    source: 'referral',
    status: 'quoted',
    createdAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    meetingDate: '2026-07-21',
    assignedTo: 'u2',
    transcript: `Discovery Call — Fable Studio (Drift mobile)
Date: 21 July 2026, 10:00 AM
Duration: 22 minutes

Sarah Chen (NEXUS): Walk me through what you're working on, James.

James Okafor (Fable Studio): We're an indie game studio — our first title launched on Steam last year and performed really well. Now we're preparing the mobile launch of our new game, Drift. It's a rhythm-based puzzle game. Very aesthetic — influenced by lo-fi music and Japanese minimalism.

Sarah: And what do you need from us?

James: The full creative package. App UI redesign — our current screens feel flat, they don't match the vibe of the game itself. We want motion sequences for the launch trailer. And brand identity work — logo refinement, color palette, the whole kit.

Sarah: Timeline?

James: We're targeting October. All assets by mid-September. About 12 weeks.

Sarah: Budget range?

James: We've set aside $65,000 for this phase. Could flex to $75K if the work is right.

Sarah: And the audience for Drift?

James: Primarily 18–34. Music lovers, people who play on commutes. We want to go after the same crowd that loves Spotify's visual identity — clean, emotive, modern. Every screen should feel like album art.

Sarah: Who's signing off on creative?

James: Me and our art director, Yuna Park. We both review, but I have final say.

Sarah: Perfect. We'll have a full proposal to you within the hour.`,
    brief: {
      objectives: [
        'Redesign Drift app UI to match the game\'s lo-fi, Japanese minimalism aesthetic',
        'Create a unified brand identity system (logo, palette, typography)',
        'Produce a launch trailer motion sequence for mobile release',
        'Deliver all assets App Store-ready by mid-September 2026',
      ],
      deliverables: [
        'App icon redesign (3 variants)',
        'UI kit: core screens, components, interaction states',
        'Refined logo suite (primary, secondary, icon mark)',
        'Color palette + typography guide',
        '30-second launch trailer (After Effects)',
        'Social media asset templates (5 formats)',
        'Brand style guide (PDF)',
      ],
      timeline: '12 weeks — delivery by 15 September 2026',
      budgetSignal: '$65,000–$75,000',
      targetAudience: '18–34 year-old music lovers and mobile gamers who value clean, emotive, premium visual design',
      keyMessages: [
        'Every screen should feel like album art',
        'Lo-fi, Japanese minimalism as the core design language',
        'Emotive and modern — never flat or generic',
        'Premium indie aesthetic that stands apart on the App Store',
      ],
      generatedAt: '2026-07-21T10:28:00Z',
    },
    ideation: {
      bigIdea: 'Drift as a living album — a game you don\'t just play, but inhabit',
      toneWords: ['Atmospheric', 'Refined', 'Emotive'],
      creativeDirection: 'Draw from Japanese lo-fi aesthetics and vinyl record culture. Muted earth tones — warm greys, bone white, deep charcoal — with one electric accent colour that pulses like a notification. Typography that breathes: generous leading, light weight. Motion that feels like music visualised — slow pulses, soft dissolves, never jarring. The app icon should feel like it belongs in a curated playlist.',
      completedBy: 'u2',
      completedAt: '2026-07-21T10:41:00Z',
    },
    proposal: {
      title: 'Drift Mobile — Creative Partnership Proposal',
      executiveSummary: 'Fable Studio has built something rare: a game with genuine soul. Drift deserves a visual identity that matches its depth — one that communicates atmosphere before a single note plays.\n\nOur proposal covers the full creative arc: brand identity refinement, complete app UI redesign, and launch motion. We will deliver a cohesive system where every touchpoint — App Store listing, onboarding, in-game menus — feels like part of the same world.\n\n12 weeks to final delivery. Investment within your confirmed range.',
      sections: [
        {
          title: 'Brand Identity',
          body: 'We will refine the Drift logo into a suite that works at every scale — from app icon to billboard. A defined colour system (muted earth tones with a single electric accent) and bespoke typography pairing form the foundation. Visual language: Japanese minimalism meets lo-fi music culture. The output: a brand that feels curated, not designed.',
        },
        {
          title: 'App UI Redesign',
          body: 'A complete redesign of Drift\'s interface — from first launch to core game screens. We deliver a full UI kit including all primary screens, component library with documented states, and interaction specifications ready for your engineering team. The governing principle: every screen is album art.',
        },
        {
          title: 'Launch Trailer Motion',
          body: 'A 30-second launch trailer crafted in After Effects, optimised for App Store preview and social distribution. Motion language: slow pulses, soft dissolves, music-synchronised rhythm. We deliver the master file plus cut-down versions for Instagram Reels and TikTok, with source files included.',
        },
        {
          title: 'Delivery & Handoff',
          body: 'All assets structured in a clean Figma workspace with organised component libraries. Brand style guide as a polished PDF. Motion deliverables as .mp4 masters and .aep source files. A 1-hour handoff session with your team is included in scope.',
        },
      ],
      deliverables: [
        'Logo suite (primary, secondary, icon mark) in all formats',
        'Colour palette + typography guide',
        'App icon redesign (3 variants)',
        'UI kit: all core screens + component library',
        '30-second launch trailer (.mp4 + .aep source)',
        'Social asset templates (5 formats)',
        'Brand style guide (PDF)',
        'Figma handoff + 1-hour session',
      ],
      timeline: '12 weeks — final delivery 15 September 2026',
      teamNotes: 'Led by Maya Kim (Creative Director) with Alex Johnson on UI design and Sam Rivera on motion. Leo Tan available for a UX research sprint in Week 2 to validate navigation patterns.',
      generatedAt: '2026-07-21T10:48:00Z',
    },
    quotation: {
      lineItems: [
        { description: 'Brand Identity System', quantity: 40, unit: 'hrs', rate: 250, total: 10000 },
        { description: 'App UI Redesign — Design', quantity: 80, unit: 'hrs', rate: 250, total: 20000 },
        { description: 'App UI Redesign — Interaction Spec', quantity: 16, unit: 'hrs', rate: 225, total: 3600 },
        { description: 'Launch Trailer — Motion Design', quantity: 60, unit: 'hrs', rate: 275, total: 16500 },
        { description: 'Social Asset Templates', quantity: 12, unit: 'hrs', rate: 200, total: 2400 },
        { description: 'Brand Style Guide', quantity: 16, unit: 'hrs', rate: 200, total: 3200 },
        { description: 'Project Management & Handoff', quantity: 20, unit: 'hrs', rate: 175, total: 3500 },
        { description: 'Revisions Allowance (2 rounds)', quantity: 1, unit: 'unit', rate: 5000, total: 5000 },
      ],
      subtotal: 64200,
      tax: 0,
      total: 64200,
      currency: 'USD',
      validUntil: '2026-08-20',
      notes: '50% deposit required to commence. Balance due on final delivery. Out-of-scope revisions billed at $225/hr. Rates locked for 30 days.',
      generatedAt: '2026-07-21T10:52:00Z',
    },
  },
  {
    id: 'eq5',
    companyName: 'Mesa Coffee',
    contactName: 'Leila Osman',
    contactEmail: 'leila@mesacoffee.com',
    industry: 'Food & Beverage',
    serviceInterest: 'Packaging design + brand identity for specialty coffee range',
    budgetRange: '$12,000 – $18,000',
    timeline: '8 weeks',
    source: 'social',
    status: 'lost',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'u3',
    notes: 'Went with a freelancer — decision based on budget. Follow up in Q1 2027 when they expand to retail.',
  },
];
