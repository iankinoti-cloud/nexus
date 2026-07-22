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
