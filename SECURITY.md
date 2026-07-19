# NEXUS — Security Posture

Red-team pass run against the live deployment on 2026-07-19. Summary of what's safe, what was fixed, and the known residual risk.

## ✅ Safe (verified by live probes)

| Concern | Result | Why |
|---|---|---|
| **Anthropic API key leak** | Safe | Key is server-side only (Vercel env + serverless functions). Never `VITE_`-prefixed, so it is never in the browser bundle. Confirmed: `grep sk-ant dist/` finds nothing. |
| **Secrets in git** | Safe | Only `.env.example` is committed; real `.env` and `.vercel/` are gitignored. |
| **Cross-user data theft** | Safe | Supabase `workspaces` table has Row-Level Security: every policy is `auth.uid() = user_id`. Probed the REST API with the public key and got an empty array — a stranger cannot read anyone's workspace. |
| **Supabase anon/publishable key exposure** | Safe by design | This key is *meant* to be public; it only permits what RLS allows. |

## 🔴 Found & fixed: denial-of-wallet on the AI endpoints

**The vulnerability:** `/api/chat` and `/api/knowledge` proxy to the paid Anthropic API. Before the fix they accepted anonymous requests — a stranger with `curl` (no login, no cookie) got real answers, and **every call spent Anthropic credits**. An attacker could loop the endpoint and run up an unbounded bill. Data was never at risk; the wallet was.

**The fix (`server/core-logic.mjs` → `guard()`), applied to both the serverless functions and the local Express server:**

1. **Hard input caps (unspoofable):** max 24 messages, 24k chars of message content, 40 knowledge notes, 2k-char query, 120 KB total body. Bounds the cost of *any single request* regardless of who sends it. Output is already capped at 2048/1024 `max_tokens`.
2. **Origin/Referer allowlist:** the request must come from a NEXUS origin (`nexus-*.vercel.app` or `localhost:5173`). A browser always sends one of these headers; a bare `curl` sends neither, so the casual attack is blocked outright.

Post-fix probes: anonymous `curl` → **403**, oversized payload → **400**, the real app → **200**.

## ⚠️ Known residual risk (honest disclosure)

The Origin/Referer header **can be forged** by a determined attacker (it is not a cryptographic proof of origin). Such an attacker could still reach the endpoints — but the input caps mean each request is cost-bounded, so there is no cheap unbounded-spend path anymore.

**The durable fix, when you want it:** verify the Supabase JWT on the API routes. The client already holds a session token; send it as `Authorization: Bearer <token>` and have the function validate it against Supabase's `/auth/v1/user` endpoint before spending. That makes the endpoints *authenticated*, not just *origin-guarded* — guests would fall back to the built-in local analysis (already implemented). Deferred because it adds a round-trip per request and the hackathon demo signs in with Google anyway.

## Not applicable / out of scope

- **Prompt injection:** the chat/knowledge prompts inject the caller's *own* workspace data and notes, so injection only affects the caller's own session — no privilege boundary is crossed.
- **XSS:** all rendering is React text nodes; no `dangerouslySetInnerHTML` anywhere in the app.
- **CORS:** the serverless functions are same-origin (no permissive CORS header). The Express `cors()` is dev-only.
