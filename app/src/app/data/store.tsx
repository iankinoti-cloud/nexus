import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PROJECTS, EMPLOYEES, CLIENTS, NOTIFICATIONS, ENQUIRIES, USERS } from './mockData';
import { KNOWLEDGE_NOTES, type KnowledgeNote } from './knowledge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import type { Project, Employee, Client, Notification, Enquiry, NexusUser } from './types';

export type CoreAction =
  | { type: 'reassign'; fromEmployeeId: string; toEmployeeId: string; note?: string }
  | { type: 'contact_client'; clientId: string; draft?: string }
  | { type: 'extend_deadline'; projectId: string; days: number; note?: string }
  | { type: 'none' };

export interface ActivityEntry {
  id: string;
  label: string;
  timestamp: string;
}

interface NexusState {
  projects: Project[];
  employees: Employee[];
  clients: Client[];
  notifications: Notification[];
  knowledge: KnowledgeNote[];
  activity: ActivityEntry[];
  enquiries: Enquiry[];
  users: NexusUser[];
  currentUserId: string;
}

interface NexusStore extends NexusState {
  currentUser: NexusUser;
  applyAction: (action: CoreAction) => string | null;
  markRead: (id: string) => void;
  markAllRead: () => void;
  resetDemo: () => void;
  contextSnapshot: () => object;
  addEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => string;
  updateEnquiry: (id: string, patch: Partial<Enquiry>) => void;
  setCurrentUser: (id: string) => void;
}

const STORAGE_KEY = 'nexus-store-v1';

const initialState = (): NexusState => ({
  projects: PROJECTS,
  employees: EMPLOYEES,
  clients: CLIENTS,
  notifications: NOTIFICATIONS,
  knowledge: KNOWLEDGE_NOTES,
  activity: [],
  enquiries: ENQUIRIES,
  users: USERS,
  currentUserId: 'u1',
});

function load(): NexusState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...JSON.parse(raw) };
  } catch { /* corrupted state falls back to seed */ }
  return initialState();
}

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

const NexusContext = createContext<NexusStore | null>(null);

export function NexusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NexusState>(load);
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const remoteLoaded = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from Supabase when a user signs in; seed their row on first login.
  useEffect(() => {
    remoteLoaded.current = false;
    if (!supabase || !userId) return;
    supabase
      .from('workspaces')
      .select('state')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data?.state) {
          setState(s => ({ ...initialState(), ...data.state, knowledge: s.knowledge }));
        }
        remoteLoaded.current = true;
      });
  }, [userId]);

  useEffect(() => {
    const { knowledge: _k, ...persisted } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    // Debounced cloud sync — only after the remote row has been read,
    // so the seed state never clobbers a returning user's workspace.
    if (supabase && userId && remoteLoaded.current) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        supabase
          .from('workspaces')
          .upsert({ user_id: userId, state: persisted, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.warn('[nexus] cloud sync failed:', error.message);
          });
      }, 800);
    }
  }, [state, userId]);

  const store = useMemo<NexusStore>(() => {
    const log = (label: string): ActivityEntry => ({
      id: `a${Date.now()}`,
      label,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });

    const applyAction = (action: CoreAction): string | null => {
      switch (action.type) {
        case 'reassign': {
          const from = state.employees.find(e => e.id === action.fromEmployeeId);
          const to = state.employees.find(e => e.id === action.toEmployeeId);
          if (!from || !to) return null;
          const label = `Rebalanced workload: ${from.name} → ${to.name}`;
          setState(s => ({
            ...s,
            employees: s.employees.map(e => {
              if (e.id === from.id) {
                const workload = clamp(e.workload - 15);
                return {
                  ...e,
                  workload,
                  burnoutRisk: clamp(e.burnoutRisk - 20),
                  currentProjects: Math.max(0, e.currentProjects - 1),
                  availability: workload >= 90 ? 'at-capacity' : workload >= 70 ? 'busy' : 'available',
                };
              }
              if (e.id === to.id) {
                const workload = clamp(e.workload + 15);
                return {
                  ...e,
                  workload,
                  currentProjects: e.currentProjects + 1,
                  availability: workload >= 90 ? 'at-capacity' : workload >= 70 ? 'busy' : 'available',
                };
              }
              return e;
            }),
            activity: [log(label), ...s.activity],
          }));
          return label;
        }
        case 'contact_client': {
          const c = state.clients.find(cl => cl.id === action.clientId);
          if (!c) return null;
          const label = `Follow-up sent to ${c.name}`;
          setState(s => ({
            ...s,
            clients: s.clients.map(cl =>
              cl.id === c.id
                ? {
                    ...cl,
                    lastContact: 'Just now',
                    healthScore: clamp(cl.healthScore + 6),
                    status: cl.status === 'at-risk' && cl.healthScore + 6 >= 70 ? 'active' : cl.status,
                  }
                : cl,
            ),
            activity: [log(label), ...s.activity],
          }));
          return label;
        }
        case 'extend_deadline': {
          const p = state.projects.find(pr => pr.id === action.projectId);
          if (!p) return null;
          const label = `Extended ${p.name} deadline by ${action.days} days`;
          setState(s => ({
            ...s,
            projects: s.projects.map(pr =>
              pr.id === p.id
                ? {
                    ...pr,
                    deadline: shiftDeadline(pr.deadline, action.days),
                    risk: pr.risk === 'high' ? 'medium' : pr.risk === 'medium' ? 'low' : pr.risk,
                    status: pr.status === 'at-risk' ? 'active' : pr.status,
                  }
                : pr,
            ),
            activity: [log(label), ...s.activity],
          }));
          return label;
        }
        default:
          return null;
      }
    };

    const currentUser = state.users.find(u => u.id === state.currentUserId) ?? state.users[0];

    return {
      ...state,
      currentUser,
      applyAction,
      markRead: (id: string) =>
        setState(s => ({
          ...s,
          notifications: s.notifications.map(n => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        setState(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) })),
      resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState());
      },
      contextSnapshot: () => ({
        today: new Date().toDateString(),
        projects: state.projects.map(({ id, name, client, progress, deadline, risk, status, budget, team }) => ({
          id, name, client, progress, deadline, risk, status, budget, team,
        })),
        employees: state.employees.map(({ id, name, role, availability, workload, skills, performanceScore, burnoutRisk, currentProjects }) => ({
          id, name, role, availability, workload, skills, performanceScore, burnoutRisk, currentProjects,
        })),
        clients: state.clients.map(({ id, name, industry, activeProjects, revenue, lastContact, healthScore, status }) => ({
          id, name, industry, activeProjects, revenue, lastContact, healthScore, status,
        })),
        enquiries: state.enquiries.map(({ id, companyName, status, serviceInterest, budgetRange }) => ({
          id, companyName, status, serviceInterest, budgetRange,
        })),
        recentActions: state.activity.slice(0, 5).map(a => a.label),
      }),
      addEnquiry: (data) => {
        const id = `eq${Date.now()}`;
        setState(s => ({
          ...s,
          enquiries: [
            { ...data, id, status: 'new' as const, createdAt: new Date().toISOString() },
            ...s.enquiries,
          ],
        }));
        return id;
      },
      updateEnquiry: (id: string, patch: Partial<Enquiry>) =>
        setState(s => ({
          ...s,
          enquiries: s.enquiries.map(e => (e.id === id ? { ...e, ...patch } : e)),
        })),
      setCurrentUser: (id: string) =>
        setState(s => (s.users.some(u => u.id === id) ? { ...s, currentUserId: id } : s)),
    };
  }, [state]);

  return <NexusContext.Provider value={store}>{children}</NexusContext.Provider>;
}

function shiftDeadline(deadline: string, days: number): string {
  const parsed = new Date(`${deadline} 2026`);
  if (isNaN(parsed.getTime())) return deadline;
  parsed.setDate(parsed.getDate() + days);
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function useNexus(): NexusStore {
  const ctx = useContext(NexusContext);
  if (!ctx) throw new Error('useNexus must be used inside NexusProvider');
  return ctx;
}
