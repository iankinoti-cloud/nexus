# NEXUS — AI Operating System for Creative Businesses

> **Agentic Workflows**

**Live app:** https://nexus-topaz-omega.vercel.app · Reproduction guide: [REPRODUCTION.md](REPRODUCTION.md)

**Demo video:** https://nexus-topaz-omega.vercel.app/demo/

---

## The Problem

**Who has it:** Account managers and founders at boutique creative agencies (brand studios, production houses, content agencies with 5–30 people).

**The bottleneck:** Every new client starts with a discovery call. After that call, the account manager manually processes the conversation into three documents: a project brief, a creative proposal, and a line-item quote. This takes **2–4 hours of skilled time per client** — time spent context-switching between call notes, previous proposals, and pricing spreadsheets. Agencies that win on speed lose because their process is slow. Agencies that move fast produce inconsistent proposals that undersell the work.

**Why it matters:** A boutique agency handles 8–15 new enquiries per month. At 3 hours each, that is 24–45 hours of senior creative time spent on admin, not delivery. A single misquoted project can erase a month of margin.

---

## The Solution

NEXUS runs a **3-agent sequential pipeline** that turns a discovery call transcript into a ready-to-send brief, proposal, and quote in under 3 minutes.

```
Discovery call transcript
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  Step 1 · Brief Extractor                           │
│  Reads the transcript + enquiry context.            │
│  Outputs: objectives[], deliverables[], timeline,   │
│  budgetSignal, targetAudience, keyMessages[]        │
└──────────────────────┬──────────────────────────────┘
                       │ structured brief JSON
                       ▼
┌─────────────────────────────────────────────────────┐
│  Step 2 · Proposal Generator                        │
│  Takes brief + creative direction.                  │
│  Outputs: executiveSummary, sections[], deliverables│
│  [], timeline, teamNotes                            │
└──────────────────────┬──────────────────────────────┘
                       │ structured proposal JSON
                       ▼
┌─────────────────────────────────────────────────────┐
│  Step 3 · Quote Generator                           │
│  Takes proposal deliverables + budget signal.       │
│  Outputs: lineItems[], subtotal, tax, total,        │
│  validUntil, currency                               │
└──────────────────────┴──────────────────────────────┘
        │
        ▼
 Brief + Proposal + Quote — ready to review and send
```

Each agent has a **specialized system prompt** scoped to its role. The Brief Extractor focuses on extraction accuracy. The Proposal Generator focuses on narrative quality and structure. The Quote Generator focuses on budget alignment and line-item granularity. None of them tries to do everything at once.

The rest of NEXUS (4 live specialist AI agents, real-time workspace store, Supabase sync, signal analysis, analytics) provides the operational context those proposals feed into — so the full platform tracks what happens after a client says yes.

---

## Improvement Changelog

Starting from a single-prompt baseline and iterating to the final agent pipeline.

| Stage | What | Evidence | Decision |
|-------|------|----------|----------|
| **Baseline** | Single Claude call: "given this transcript, write a brief + proposal + quote as JSON" | Avg score: **4.7/10** · 1 API call · ~3s · $0.0037/case | Starting point — brief objectives shallow, quote line items vague, proposal sections generic |
| **Iteration 1** | Separate brief extraction into its own step with a typed JSON schema (objectives[], deliverables[], budgetSignal) | Avg score: **6.3/10** (+1.6) | **Kept.** Structured brief gave the proposal step better material to work with |
| **Iteration 2** | Added creative ideation handoff between brief and proposal — pipeline auto-derives tone words and big idea from the brief's key messages | Avg score: **7.1/10** (+0.8) | **Kept.** Proposal narrative became more specific to the client's audience and message |
| **Iteration 3** | Added workspace context to quote step — quote agent now sees the brief's budget signal and aligns subtotal to ±30% | Avg score: **7.9/10** (+0.8) | **Kept.** Budget accuracy jumped from 50% to 90% of cases |
| **Iteration 4** | Removed: tried adding a "verification" fourth call that re-checked deliverable count — added latency with no measurable score improvement | +0 pts · +4s latency | **Removed.** The schema constraints on the first three agents were already sufficient |
| **Final** | 3-agent pipeline with typed schemas and creative direction handoff | Avg score: **8.4/10** (+3.7 vs baseline) · 3 API calls · ~22s · $0.029/case | Main contribution: structured handoffs between specialists |

---

## Evaluation

Run it yourself: `node eval/run.mjs` (see [REPRODUCTION.md](REPRODUCTION.md))

| Metric | Baseline (1 call) | Agent Pipeline (3 calls) | Change |
|--------|-------------------|--------------------------|--------|
| Avg quality score (0–10) | 4.7 | 8.4 | **+3.7** |
| Avg time per case | ~3s | ~22s | +19s |
| Avg cost per case | ~$0.0037 | ~$0.029 | +$0.025 |
| Budget accuracy (±30%) | 50% | 90% | +40pp |
| Cases with ≥4 deliverables in brief | 40% | 100% | +60pp |

**Working rubric:**
executive summary present · ≥3 objectives in brief · ≥4 deliverables in brief · timeline specific · quote ≥5 line items · quote subtotal within ±30% of budget · team notes present · ≥3 proposal sections · proposal deliverables ≥4 items · no AI filler phrases

**Challenging case:** Roots Initiative (NGO documentary, case 8). The baseline scored 3/10 — it generated a commercial-sounding proposal with hourly rates that wildly exceeded a non-profit's $42k budget. The pipeline scored 8/10 — the brief extractor correctly identified "documentary style, no narrator" and "authentic, journalistic" as key signals, and the quote aligned to the stated budget range.

---
$5.80

## My Take

**The main failure mode:** When the discovery call transcript contains ambiguous budget signals ("around 50k" instead of a range), the quote generator drifts toward premium pricing regardless. The fix — a budget verification layer that compares the generated subtotal to the stated range and retries if it deviates by more than 30% — only marginally improved scores (Iteration 3 above). The real lesson is that the brief extractor's `budgetSignal` field is load-bearing: if it extracts vaguely, the quote inherits the vagueness. Structured extraction with a strict schema at step 1 does more work than any verification pass at step 3.

**What I would build next:** A memory layer that persists past proposal+quote pairs per client. The fourth Mira agent already tracks client relationship health — wiring that to the pipeline so repeat clients get proposals that reference prior work would close the context gap that currently makes every proposal feel like a first meeting.

---

## Agent Trajectories

Representative trajectories for all 10 eval cases are saved to `eval/trajectories/case-{n}.json` after running `node eval/run.mjs`. Each file contains:
- Full input context per step
- Output JSON produced by each agent
- Token counts and latency per step
- Baseline score and agent pipeline score side by side

---

## Running the App

```bash
cd app
cp .env.example .env       # add your Anthropic API key
npm install
npm run dev                # starts web (:5173) + AI server (:8787)
```

The app runs offline if no API key is provided — Core drops into local-analysis mode.

**Running the evaluation:**
```bash
node eval/run.mjs          # from the repo root
```

**Running the slides deck:**
```bash
cd slides && npm install && npm run dev
```

---

## Architecture

```
Browser (React 18 + Vite)
  ├── /api/pipeline/brief      → Brief Extractor (Claude)
  ├── /api/pipeline/proposal   → Proposal Generator (Claude)
  ├── /api/pipeline/quote      → Quote Generator (Claude)
  ├── /api/chat                → 4 Specialist Agents: Zara/Knox/Mira/Axel (streaming)
  ├── /api/signals             → Agency Digital Twin (Claude Haiku)
  └── /api/knowledge           → Semantic Q&A over org notes (Claude)

app/server/core-logic.mjs — shared AI logic (prompts, params, security guard)
Vercel Functions — production serverless deployment of all /api/* routes
Supabase — optional auth (Google OAuth) + workspace cloud sync
```

---

## What existed before this hackathon

The NEXUS codebase was built in (July 2026), trying to figure out the fragmentation behind most small scale creative agencies. The pipeline endpoints (`/api/pipeline/brief`, `/api/pipeline/proposal`, `/api/pipeline/quote`) and their system prompts existed before this submission. What was added for micro1:

- `eval/` directory — all evaluation infrastructure (cases, scoring rubric, baseline, runner)
- This README rewrite (hackathon framing, changelog, evaluation table)
- `REPRODUCTION.md` — clean reproduction guide
- `CHANGELOG.md` — detailed iteration log

The core claim — that a 3-agent pipeline outperforms a single-prompt baseline by 3.7 points on the defined rubric — is based on evaluation run against real Claude API calls using the eval infrastructure above.
