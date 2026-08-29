export interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  deadline: string;
  team: string[];
  risk: 'low' | 'medium' | 'high';
  aiRecommendation: string;
  status: 'active' | 'review' | 'at-risk' | 'completed';
  budget: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  availability: 'available' | 'busy' | 'at-capacity';
  workload: number;
  skills: string[];
  performanceScore: number;
  burnoutRisk: number;
  compatibilityScore: number;
  currentProjects: number;
}

export interface ContactEntry {
  id: string;
  date: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  summary: string;
  by: string;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  industry: string;
  activeProjects: number;
  revenue: string;
  lastContact: string;
  healthScore: number;
  aiFollowUp: string;
  status: 'active' | 'at-risk' | 'churned';
  contactHistory?: ContactEntry[];
  dossierNotes?: string;
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  projectId: string;
  date: string;
  startTime: string;
  endTime: string;
  crew?: string[];
}

export interface Notification {
  id: string;
  category: 'project' | 'deadline' | 'client' | 'invoice' | 'risk';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  action?: string;
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'core';
  content: string;
  timestamp: string;
  recommendations?: { title: string; description: string }[];
}

export type AgentId = 'ops' | 'talent' | 'client' | 'production';

export interface DmfCandidate {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  primaryRole: string;
  skills: string[];
  experience: number;
  dmfRating: number;
  availability: 'available' | 'busy' | 'contract-ending';
  location: string;
  dayRate: number;
  lastProject: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  forecast: number;
}

export interface CompletionDataPoint {
  week: string;
  completed: number;
  target: number;
}

export interface UtilizationDataPoint {
  name: string;
  utilization: number;
  fill: string;
}

export interface SatisfactionDataPoint {
  month: string;
  score: number;
}

// --- Creative Services Pipeline ---

export interface NexusUser {
  id: string;
  name: string;
  role: 'owner' | 'creative_lead' | 'account_manager' | 'team_member';
  initials: string;
  avatarColor: string;
}

export type EnquiryStatus =
  | 'new'
  | 'transcript'
  | 'briefed'
  | 'ideation'
  | 'proposed'
  | 'quoted'
  | 'approved'
  | 'sent'
  | 'converted'
  | 'lost';

export interface ProjectBrief {
  objectives: string[];
  deliverables: string[];
  timeline: string;
  budgetSignal: string;
  targetAudience: string;
  keyMessages: string[];
  generatedAt: string;
}

export interface CreativeIdeation {
  bigIdea: string;
  toneWords: [string, string, string];
  creativeDirection: string;
  completedBy: string;
  completedAt: string;
}

export interface ProposalSection {
  title: string;
  body: string;
}

export interface Proposal {
  title: string;
  executiveSummary: string;
  sections: ProposalSection[];
  deliverables: string[];
  timeline: string;
  teamNotes: string;
  generatedAt: string;
}

export interface QuotationLineItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

export interface Quotation {
  lineItems: QuotationLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  validUntil: string;
  notes: string;
  generatedAt: string;
}

export type RfpStatus = 'new' | 'reviewing' | 'shortlisted' | 'submitted' | 'won' | 'lost';

export interface RfpTender {
  id: string;
  title: string;
  issuer: string;
  category: 'branding' | 'campaign' | 'film' | 'digital' | 'experiential' | 'print';
  estimatedValue: string;
  submissionDeadline: string;
  publishedAt: string;
  status: RfpStatus;
  fitScore: number;
  aiRecommendation: string;
  requirements: string[];
  source: 'government' | 'corporate' | 'ngo' | 'private';
}

export interface AgentEvent {
  id: string;
  type: 'message' | 'handoff' | 'action';
  agent: AgentId;
  toAgent?: AgentId;
  label: string;
  timestamp: string;
}

// ── Agency Digital Twin additions ────────────────────────────────────────────

export type SignalTier = 'critical' | 'attention' | 'opportunity';

export type SignalModule = 'projects' | 'talent' | 'clients' | 'pipeline' | 'production' | 'analytics';

export interface AgencySignal {
  id: string;
  tier: SignalTier;
  title: string;
  body: string;
  module: SignalModule;
  linkedId?: string;
  action?: string;
  generatedAt: string;
  acknowledgedAt?: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  description: string;
  requestedBy?: string;
  addedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TaskItem {
  id: string;
  title: string;
  assignee?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dependsOn: string[];
  dueDate?: string;
}

export type WorkflowStage = 'brief' | 'discovery' | 'ideation' | 'proposal' | 'production' | 'review' | 'delivery';

export interface ClientHealthDimensions {
  relationship: number;
  delivery: number;
  commercial: number;
  sentiment: number;
}

export type RoleView = 'founder' | 'operations' | 'account_director' | 'creative_director' | 'producer';

export interface Enquiry {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  industry: string;
  serviceInterest: string;
  budgetRange: string;
  timeline: string;
  source: 'website' | 'referral' | 'cold-outreach' | 'event' | 'social';
  status: EnquiryStatus;
  createdAt: string;
  meetingDate?: string;
  transcript?: string;
  brief?: ProjectBrief;
  ideation?: CreativeIdeation;
  proposal?: Proposal;
  quotation?: Quotation;
  assignedTo?: string;
  approvedBy?: string;
  approvedAt?: string;
  deliveryMethod?: 'nexus' | 'pdf' | 'stored';
  notes?: string;
}
