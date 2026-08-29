# Reproduction Guide

This guide walks you through running both the NEXUS agent pipeline and the baseline from a clean environment, and reproducing the evaluation results.

## Prerequisites

- Node.js 20+
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com) → API Keys)
- Git

## Setup

```bash
git clone https://github.com/iankinoti-cloud/nexus.git
cd nexus/app
npm install
cp .env.example .env
```

Open `.env` and set:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Run the app

```bash
# from nexus/app/
npm run dev
```

- Web app: http://localhost:5173
- AI proxy server: http://localhost:8787

The app works without a key (offline mode). The Pipeline page requires a live key.

## Run the evaluation

```bash
# from nexus/ (repo root)
node eval/run.mjs
```

This runs all 10 synthetic test cases through both the baseline (1 Claude call) and the agent pipeline (3 Claude calls per case). Results print to stdout and trajectories are saved to `eval/trajectories/`.

**Expected runtime:** ~3–5 minutes (20 total API calls, subject to rate limits)

**Expected cost:** ~$0.35–$0.50 total (baseline + pipeline × 10 cases)

**Expected output:**
```
NEXUS × micro1 Hackathon — Evaluation
Running 10 cases through baseline and agent pipeline...

[1/10] Brand identity — fintech startup... baseline 5/10  agent 8/10  delta +3
[2/10] Social media campaign — fashion brand... baseline 4/10  agent 9/10  delta +5
...

───────────────────────────────────────────────────────────────────────────────
CASE                                     BASELINE   AGENT    DELTA
───────────────────────────────────────────────────────────────────────────────
Brand identity — fintech startup         5/10       8/10     +3
Social media campaign — fashion brand    4/10       9/10     +5
...
Average                                  4.7        8.4
Time / case (avg ms)                     3200       22000
Cost / case (avg USD)                    $0.0037    $0.0290
───────────────────────────────────────────────────────────────────────────────
Trajectories saved to eval/trajectories/
```

## Inspect a trajectory

```bash
cat eval/trajectories/case-1.json | python3 -m json.tool | less
```

Each trajectory contains the full input/output per agent step, token counts, latency, and scores for both baseline and pipeline.

## Run the Pipeline in-app

1. Open http://localhost:5173
2. Navigate to **Pipeline** (left sidebar)
3. Click **New Enquiry** → fill in company name, service, budget, timeline
4. On the enquiry detail, paste a discovery call transcript and click **Extract Brief**
5. Review the extracted brief → click **Generate Proposal** → **Generate Quote**
6. Download or preview the final proposal

## Versions

| Component | Version |
|-----------|---------|
| Node.js | 20+ |
| React | 18.3.1 |
| Vite | 6.3.5 |
| @anthropic-ai/sdk | 0.57.0 |
| Claude model | claude-opus-4-8 |
| Tailwind | 4.1.12 |
| React Router | 7.18.1 |

## Supabase (optional)

The app runs fully in local/guest mode without Supabase. To enable Google login and cloud workspace sync, see [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on creating a Supabase project and adding `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` to your `.env`.
