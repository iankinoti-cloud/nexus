import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { OnboardingState, OnboardingTrack, ChecklistItem } from './types';
import { CHECKLIST_DEFAULTS } from './types';

const STORAGE_KEY = 'nexus-onboarding-v1';

interface OnboardingActions {
  pickTrack: (track: OnboardingTrack) => void;
  advanceStep: () => void;
  goBack: () => void;
  updateSetupField: (field: 'workspaceName' | 'industry' | 'teamSize', value: string) => void;
  toggleUseCase: (id: string) => void;
  completeWizard: () => void;
  dismissSpotlight: () => void;
  skipAllGuidance: () => void;
  checklistDone: (id: string) => void;
  resetOnboarding: () => void;
}

export type OnboardingStore = OnboardingState & OnboardingActions;

const OnboardingContext = createContext<OnboardingStore | null>(null);

const SPOTLIGHTS = ['core', 'analytics'] as const;

function initialState(): OnboardingState {
  return {
    track: null,
    step: 0,
    dismissed: false,
    workspaceName: '',
    industry: '',
    teamSize: '',
    useCases: [],
    checklist: CHECKLIST_DEFAULTS.map(i => ({ ...i })),
    seenSpotlights: [],
    pendingSpotlight: null,
    allGuidanceDismissed: false,
  };
}

function load(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OnboardingState>;
      const base = initialState();
      return {
        ...base,
        ...parsed,
        checklist: parsed.checklist
          ? base.checklist.map(def => {
              const saved = (parsed.checklist as ChecklistItem[]).find(c => c.id === def.id);
              return saved ? { ...def, done: saved.done } : def;
            })
          : base.checklist,
      };
    }
  } catch { /* corrupted — start fresh */ }
  return initialState();
}

function save(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore quota errors */ }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(load);

  const store = useMemo<OnboardingStore>(() => {
    const update = (patch: Partial<OnboardingState>) => {
      setState(s => {
        const next = { ...s, ...patch };
        save(next);
        return next;
      });
    };

    return {
      ...state,

      pickTrack(track) {
        update({ track, step: 1 });
      },

      advanceStep() {
        update({ step: state.step + 1 });
      },

      goBack() {
        update({ step: Math.max(0, state.step - 1) });
      },

      updateSetupField(field, value) {
        update({ [field]: value });
      },

      toggleUseCase(id) {
        const useCases = state.useCases.includes(id)
          ? state.useCases.filter(u => u !== id)
          : [...state.useCases, id];
        update({ useCases });
      },

      completeWizard() {
        const firstSpotlight = state.track === 'exploration' ? SPOTLIGHTS[0] : null;
        update({ dismissed: true, pendingSpotlight: firstSpotlight });
      },

      dismissSpotlight() {
        const seen = [...state.seenSpotlights];
        if (state.pendingSpotlight) seen.push(state.pendingSpotlight);
        const remaining = SPOTLIGHTS.filter(s => !seen.includes(s));
        update({ seenSpotlights: seen, pendingSpotlight: remaining[0] ?? null });
      },

      skipAllGuidance() {
        update({
          allGuidanceDismissed: true,
          pendingSpotlight: null,
          seenSpotlights: [...SPOTLIGHTS],
        });
      },

      checklistDone(id) {
        const checklist = state.checklist.map(item =>
          item.id === id ? { ...item, done: true } : item,
        );
        update({ checklist });
      },

      resetOnboarding() {
        const fresh = initialState();
        save(fresh);
        setState(fresh);
      },
    };
  }, [state]);

  return <OnboardingContext.Provider value={store}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingStore {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
