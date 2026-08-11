# NEXUS — Security Posture

## Red / Blue / Purple Team Methodology

NEXUS uses a layered security program:
- **Red team** — offensive: find the attack vectors, document them, write automated probes (`security/pentest.sh`)
- **Blue team** — defensive: implement controls, monitor via structured logs, keep deps patched
- **Purple team** — synthesis: red findings drive blue fixes; every new feature gets a mini red-team pass before shipping

Run `bash security/pentest.sh [BASE_URL]` against dev or prod to verify controls hold. All 10 probes must pass before any production deploy.

---

## Threat Model (STRIDE)

| Category | Attack Vector | Status | Control |
|---|---|---|---|
| **Spoofing** | Forge Origin/Referer → reach AI endpoints without auth | ✅ Fixed | Supabase JWT required; origin is secondary fallback only |
| **Spoofing** | Replay a valid JWT after logout | ✅ Mitigated | Supabase handles token expiry + revocation |
| **Tampering** | Malformed workspace JSON in Supabase | ✅ Mitigated | RLS: every policy is `auth.uid() = user_id` |
| **Tampering** | Inject malicious payload into AI prompts (transcript, query) | ✅ Fixed | Injection markers stripped (`sanitizeInput`) + canary directive in every system prompt |
| **Repudiation** | No audit trail for AI calls | ✅ Fixed | Structured `secLog(endpoint, ref, detail)` on every error + guard rejection; correlation ID in logs |
| **Info Disclosure** | `err.message` leaks API internals to callers | ✅ Fixed | All 5xx responses return `{ error: 'service_unavailable' }`; full error in server log with `ref` ID |
| **Info Disclosure** | API key or secrets in browser bundle | ✅ Safe | `ANTHROPIC_API_KEY` is server-only (never `VITE_`-prefixed); confirmed `grep sk-ant dist/` returns nothing |
| **Info Disclosure** | Supabase anon key exposure | ✅ Safe by design | Anon key is public by spec; RLS is the real guard |
| **Denial of Service** | Rapid-fire requests from one IP | ✅ Fixed | Per-IP sliding-window rate limit (15 req/60 s); resets on cold start (JWT is primary gate) |
| **Denial of Service** | Unbounded payload → large Anthropic bill | ✅ Fixed | Hard caps: 120 KB body, 24 messages, 24k chars, 40 notes, 2k query |
| **Elevation of Privilege** | Prompt injection via external transcript/query | ✅ Fixed | `sanitizeInput()` strips markers; injection canary at top of every system prompt |
| **Elevation of Privilege** | react-router CVEs (XSS/RCE/DoS) | ✅ Fixed | Upgraded to `^7.18.1` (patches GHSA-49rj, GHSA-8646, GHSA-8x6r, GHSA-rxv8) |
| **Elevation of Privilege** | Vite dev server vuln | ✅ Fixed | Upgraded to latest (0 audit vulns) |

---

## Security Controls Index

| Control | Location | What it does |
|---|---|---|
| `verifyJWT(token)` | `server/core-logic.mjs` | Validates Supabase access token via `/auth/v1/user`; returns user or null |
| `guard({ token, ip, origin, referer, body })` | `server/core-logic.mjs` | Ordered gate: JWT → rate limit → origin fallback → input caps |
| `sanitizeInput(s)` | `server/core-logic.mjs` | Strips 14 known injection marker patterns from external strings |
| `INJECTION_CANARY` | `server/core-logic.mjs` | First directive in every system prompt — instructs Claude to return `{"error":"injection_detected"}` on jailbreak attempt |
| `rateLimit(ip)` | `server/core-logic.mjs` | In-memory sliding window: 15 req/60 s per IP |
| `secLog(endpoint, ref, detail)` | `server/core-logic.mjs` | Structured server-side error log; `ref` is correlation ID for log lookup, never sent to client |
| `authHeader()` | `src/app/lib/ai.ts` | Gets Supabase session token and adds `Authorization: Bearer <token>` to every API fetch |
| Security headers | `app/vercel.json` | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| CORS lockdown | `server/index.mjs` | Express: only allows `localhost:5173`, `localhost:5174`, `nexus-topaz-omega.vercel.app`, `nexus-slides.vercel.app` |
| Input caps | `server/core-logic.mjs` | 120 KB payload, 24 messages, 24k chars, 40 notes, 2k query — unspoofable cost bound |
| RLS | Supabase `workspaces` table | `auth.uid() = user_id` on SELECT/INSERT/UPDATE — cross-user read impossible |
| `npm audit` | CI / pre-deploy | 0 HIGH or CRITICAL required; enforced via `pentest.sh` probe 10 |

---

## HTTP Security Headers (Vercel)

Applied to all responses via `app/vercel.json`:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## Secure Coding Checklist (mandatory for every new PR)

- [ ] All new AI endpoints call `await guard(...)` as the first step — no exceptions
- [ ] External string inputs (user text, transcripts, uploaded content) pass through `sanitizeInput()` before reaching Claude
- [ ] Error handlers use `secLog(endpoint, ref, err.message)` server-side and return `{ error: 'service_unavailable' }` to clients
- [ ] No `console.error(err.message)` directly in endpoints — use `secLog`
- [ ] No new `VITE_`-prefixed env vars that carry secrets — only public/publishable values
- [ ] `npm audit` in `app/` shows 0 HIGH or CRITICAL before merging
- [ ] New frontend fetch calls use `...await authHeader()` in headers
- [ ] `bash security/pentest.sh` all green before deploying

---

## Incident Response

**Suspected API key compromise:**
1. Rotate immediately at https://console.anthropic.com → API Keys
2. Update in Vercel dashboard → Environment Variables
3. Trigger redeploy
4. Review Anthropic usage dashboard for anomalous spend

**Suspected Supabase breach:**
1. Rotate service role key (anon key is public — no rotation needed for anon)
2. Review Supabase auth logs for suspicious sign-ins
3. Check `workspaces` table for unexpected rows

**Anomalous spend spike:**
1. Check Anthropic dashboard for endpoint + token count breakdown
2. Review server logs for guard rejections (look for `ref=` IDs in `[NEXUS:*]` lines)
3. Temporarily disable `ANTHROPIC_API_KEY` in Vercel if needed — app falls back to local analysis automatically

---

## Known Residual Risks (honest disclosure)

| Risk | Likelihood | Impact | Accepted? |
|---|---|---|---|
| Origin/Referer forgeable in guest mode (when Supabase not configured) | Low | Low (only affects dev without Supabase) | Yes — JWT gate is the real wall |
| In-memory rate limiter resets on Vercel cold start | Low | Low (JWT gate fires first; each warm instance still rate-limits) | Yes — acceptable for current scale |
| `unsafe-inline` in CSP (required for Tailwind/Radix animations) | Low | Low | Yes — no `dangerouslySetInnerHTML` with user-controlled data |
| `dangerouslySetInnerHTML` in `ui/chart.tsx` | Very Low | Very Low (injects CSS vars from config objects, not user input) | Yes — values are controlled config objects |

---

*Last red-team pass: 2026-07-23. Run `bash security/pentest.sh` to verify current posture.*
