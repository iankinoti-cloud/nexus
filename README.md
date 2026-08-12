# NEXUS — AI Operating System for Creative Businesses

**Live:** https://nexus-topaz-omega.vercel.app · Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

One workspace that orchestrates people, projects, clients, and decisions for creative agencies — with **Core**, a real AI intelligence engine, at the center.



## What's in this repo

| Folder | What it is |
|---|---|
| `app/` | The NEXUS web app (Vite + React 18 + React Router 7 + Tailwind 4 + shadcn/ui) with an Express AI proxy in `app/server/` |
| `slides/` | The 16-slide keynote pitch deck (its own Vite app — arrow keys to navigate) |
| `docs/` | Design constitution (brand rulebook) + emblem |

## Running the app

```bash
cd app
cp .env.example .env       # paste your Anthropic API key (console.anthropic.com)
npm install
npm run dev                # starts web (:5173) + Core AI server (:8787) together
```

No API key? The app still runs — Core drops into **offline local-analysis mode** and computes grounded answers from workspace data client-side. The demo never dies on stage.

Running the deck:

```bash
cd slides && npm install && npm run dev
```

## What makes the AI real (not a chat wrapper)

1. **Grounded chat** — Core receives a live JSON snapshot of the workspace (projects, team utilization, burnout risk, client health) with every message. Ask "who's closest to burnout?" and it answers with names and numbers from *your* data. Powered by Claude (`claude-opus-4-8`) with streaming and prompt caching.
2. **Executable recommendations** — Core's advice arrives as structured actions (`reassign`, `contact_client`, `extend_deadline`). Clicking **Apply Recommendation** mutates the real store: workloads rebalance on the Talent page, client health updates on the Clients page, deadlines shift on Projects. Closed loop, visible everywhere, persisted in localStorage.
3. **Knowledge** — organizational memory. Semantic Q&A over the agency's notes (project learnings, client preferences, process docs) with cited sources, via Claude structured outputs. Falls back to keyword search offline.

## Architecture

```
Browser (React) ── /api/* ──> Express proxy (server/index.mjs) ──> Claude API
     │                              (key stays server-side)
     └─ NexusProvider store: single source of truth, localStorage-persisted,
        mutated by AI actions and read by every page
```

## Demo script (5 min)

1. **Dashboard** — "This is Mission Control." Point at Core Intelligence panel → click **Apply Recommendation** → toast fires, go to **Talent**: Nina's workload visibly dropped, Sam's rose. *"The AI doesn't just advise — it operates."*
2. **Core** — ask *"Who is closest to burnout and what should I do?"* → streamed, data-grounded answer with an Apply button. Apply it. Ask *"Which client am I about to lose?"* → follow-up recommendation drafts the client email.
3. **Knowledge** — ask *"How do we prevent scope creep with Nexora?"* → answer with cited source notes highlighted. *"The agency never forgets."*
4. **Notifications / Clients / Projects** — show the applied actions reflected everywhere (activity is one shared store).
5. Close on the deck's line: **One platform. Infinite possibilities.**

If wifi fails: everything above still works — offline banner appears, local analysis takes over.
