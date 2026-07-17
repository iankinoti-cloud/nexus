# Deploying NEXUS

Three dashboards, ~15 minutes total. Do them in this order.

## 1. Supabase (database + Google auth)

1. [supabase.com](https://supabase.com) → **New project** (name: `nexus`). Save the database password somewhere.
2. **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
3. **Authentication → Providers → Google** → Enable. It shows you a **Callback URL** (`https://<ref>.supabase.co/auth/v1/callback`) — copy it for step 2 below.
4. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

## 2. Google Cloud (OAuth client)

1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → **Credentials** → Create Credentials → **OAuth client ID** → Web application.
   (You already have an OAuth client from a previous project — reusing it works too; just add the URIs below to it.)
2. **Authorized JavaScript origins**: `http://localhost:5173` and your Vercel URL (`https://nexus-<...>.vercel.app`).
3. **Authorized redirect URIs**: the Supabase **Callback URL** from step 1.3.
4. Copy the **Client ID** and **Client Secret** into the Supabase Google provider form → Save.

## 3. Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import `iankinoti-cloud/nexus`.
2. **Root Directory: `app`** ← the one setting that matters. Framework preset: Vite.
3. Environment variables (all environments):

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your key from console.anthropic.com |
   | `VITE_SUPABASE_URL` | Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

4. Deploy. Then go back to:
   - **Supabase → Authentication → URL Configuration**: set Site URL to your Vercel URL, and add it to Redirect URLs.
   - **Google Cloud credentials**: add the final Vercel URL to JavaScript origins (step 2.2) if you guessed it earlier.

## Local development with cloud features

Add to `app/.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Without these the app runs in guest/local mode (no login screen) — which is also the on-stage fallback if anything upstream breaks.

## How it fits together

- **Prod**: Vercel serves the Vite build; `app/api/*.mjs` run as serverless functions (streaming chat included); Supabase handles Google OAuth + per-user workspace state (`workspaces` table, RLS so users only see their own row).
- **Dev**: `npm run dev` = Vite + the same logic via Express (`app/server/`).
- **State**: localStorage is always the cache; signed-in users get debounced sync to Supabase, so the same workspace follows them across devices.
