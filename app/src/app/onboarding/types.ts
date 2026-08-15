export type OnboardingTrack = 'exploration' | 'setup' | null;

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
}

export interface OnboardingState {
  track: OnboardingTrack;
  step: number;
  dismissed: boolean;
  workspaceName: string;
  industry: string;
  teamSize: string;
  useCases: string[];
  checklist: ChecklistItem[];
  seenSpotlights: string[];
  pendingSpotlight: string | null;
  allGuidanceDismissed: boolean;
}

export const CHECKLIST_DEFAULTS: ChecklistItem[] = [
  { id: 'agency',  label: 'Add agency info',      description: 'Set your workspace name and industry', href: '/settings?tab=organization', done: false },
  { id: 'core',    label: 'Try Core AI',           description: 'Ask Core a question about your team',  href: '/core',                      done: false },
  { id: 'client',  label: 'Add your first client', description: 'Track a real client relationship',     href: '/clients',                   done: false },
  { id: 'invite',  label: 'Invite a teammate',     description: 'Bring your team into the workspace',   href: '/settings?tab=security',     done: false },
  { id: 'slack',   label: 'Connect Slack',         description: 'Get alerts where your team works',     href: '/settings?tab=integrations', done: false },
];
