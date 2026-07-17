import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, cloudMode } from '../lib/supabase';

interface AuthState {
  cloudMode: boolean;
  loading: boolean;
  session: Session | null;
  guest: boolean;
  displayName: string;
  avatarUrl: string | null;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const GUEST_KEY = 'nexus-guest-mode';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(cloudMode);
  const [guest, setGuest] = useState(() => localStorage.getItem(GUEST_KEY) === '1');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        localStorage.removeItem(GUEST_KEY);
        setGuest(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(() => {
    const meta = session?.user?.user_metadata as { full_name?: string; name?: string; avatar_url?: string } | undefined;
    return {
      cloudMode,
      loading,
      session,
      guest,
      displayName: meta?.full_name || meta?.name || session?.user?.email?.split('@')[0] || 'Sarah Chen',
      avatarUrl: meta?.avatar_url ?? null,
      signInWithGoogle: async () => {
        await supabase?.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
      },
      continueAsGuest: () => {
        localStorage.setItem(GUEST_KEY, '1');
        setGuest(true);
      },
      signOut: async () => {
        await supabase?.auth.signOut();
        localStorage.removeItem(GUEST_KEY);
        setGuest(false);
      },
    };
  }, [session, loading, guest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
