import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** null when Supabase isn't configured — the app then runs in local/guest mode. */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

export const cloudMode = Boolean(supabase);

/** Auth errors bounce back in the URL (#error=... or ?error=...) — surface them. */
export function authErrorFromUrl(): string | null {
  for (const raw of [window.location.hash.slice(1), window.location.search.slice(1)]) {
    const params = new URLSearchParams(raw);
    const desc = params.get('error_description') || params.get('error');
    if (desc) return desc.replace(/\+/g, ' ');
  }
  return null;
}
