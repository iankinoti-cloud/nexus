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
