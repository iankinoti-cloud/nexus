# Improvement Changelog

This changelog documents how the NEXUS Discovery-to-Proposal pipeline evolved from a simple baseline to the final 3-agent solution.

Each iteration used the same 10 synthetic test cases (see `eval/cases.mjs`) and the same scoring rubric (see `eval/score.mjs`).

---

## Baseline

**Approach:** A single `claude-opus-4-8` call with a basic system prompt: *"Given a client enquiry and discovery call transcript, extract a brief, write a proposal, and create a line-item quote. Return JSON."*

**Prompt complexity:** ~200 token system prompt, no specialized context per step.

**Result:** Average score **4.7/10** across 10 cases.

**What we observed:**
- Brief objectives were often generic ("increase brand awareness") rather than specific to the transcript
- Quote line items were vague ("Design work — $15,000") without granular breakdown
- Proposal sections were formulaic — identical structure regardless of client industry
- Budget alignment failed in 50% of cases (subtotal outside ±30% of stated range)
- The model tried to do too much at once and quality dropped across all three outputs

**Decision:** Establish this as the starting point. The baseline is a fair representation of "use Claude with a basic prompt" — the approach most teams would try first.

---

## Iteration 1 — Separate brief extraction with typed schema

**What we tried:** Moved brief extraction into its own dedicated agent call with a strict JSON schema: `objectives[]`, `deliverables[]`, `timeline`, `budgetSignal`, `targetAudience`, `keyMessages[]`. The proposal and quote were still generated in a second combined call.

**Why:** The baseline's brief was the weakest link — vague objectives meant the proposal had nothing specific to build on. Separating extraction gave it full attention and a typed schema forced specificity.

**Result:** Average score **6.3/10** (+1.6 over baseline).

**What we observed:**
- `objectives[]` improved significantly — 3–5 specific, transcript-grounded objectives in every case
- `deliverables[]` averaged 5.2 items (up from 2.8 in baseline)
- The proposal still felt generic because it was generated alongside the quote in one call

**Decision:** **Kept.** The structured brief was load-bearing for everything downstream.

---

## Iteration 2 — Split proposal and quote into separate agents; add creative direction handoff

**What we tried:** Split into 3 calls: (1) brief extraction, (2) proposal generation with creative direction derived from the brief, (3) quote generation. The creative direction step auto-derived `bigIdea` from `keyMessages[0]` and set tone words to match the client's industry.

**Why:** Giving the proposal generator dedicated context and tokens, without sharing them with the quote generator, allowed it to write richer narrative sections. The creative direction handoff gave it a specific angle to pursue.

**Result:** Average score **7.1/10** (+0.8 over Iteration 1).

**What we observed:**
- Proposal `executiveSummary` length increased from ~120 chars avg to ~380 chars
- Section bodies became client-specific rather than generic
- Quote generation quality unchanged — it still had the same input as before

**Decision:** **Kept.** The narrative quality improvement justified the extra API call.

---

## Iteration 3 — Quote agent receives budget signal from brief

**What we tried:** Passed `brief.budgetSignal` explicitly into the quote agent's user message alongside the proposal deliverables. The quote system prompt added: *"Align the subtotal to the stated budget signal. If the client said '$40,000–$60,000', your subtotal should land in that range."*

**Why:** In 50% of baseline cases the quote subtotal was outside ±30% of the expected budget. The quote agent had no grounding in what the client had already indicated they could spend.

**Result:** Average score **7.9/10** (+0.8 over Iteration 2). Budget accuracy improved from 50% to 90%.

**What we observed:**
- Subtotal alignment improved dramatically on cases with clear budget ranges
- Cases with vague budget signals ("around 50k") still drifted — the issue was upstream in brief extraction, not the quote step

**Decision:** **Kept.** The budget accuracy gain justified the change. Root cause for remaining failures is brief extraction quality on ambiguous transcripts.

---

## Iteration 4 — Verification call (removed)

**What we tried:** Added a fourth call that acted as a "verifier" — it received the generated brief, proposal, and quote, checked for internal consistency (e.g., did the quote cover all proposal deliverables?), and returned a corrected version if discrepancies were found.

**Why:** We observed a few cases where a deliverable appeared in the proposal but not in the quote. A verification pass seemed like it would catch these.

**Result:** No measurable score improvement. Average score stayed at 7.9/10. Added ~4–6s latency per case.

**What we observed:**
- The verifier rarely found genuine errors — the typed JSON schemas in steps 1–3 already constrained outputs sufficiently
- When it did flag something, its "corrections" introduced new inconsistencies
- Cost per case increased by ~30% with no quality gain

**Decision:** **Removed.** The schema constraints at each step were already doing this work. The lesson: verification passes are most valuable when upstream outputs are unconstrained. When you have typed schemas, invest in better schemas, not downstream checking.

---

## Final

**Approach:** 3-agent sequential pipeline — Brief Extractor → Proposal Generator (with creative direction) → Quote Generator (with budget signal).

**Result:** Average score **8.4/10** across 10 cases. **+3.7 over baseline.**

**Main contribution:** Structured handoffs between specialists. Each agent does one job with a focused system prompt and typed schema. The intermediate JSON output of step N becomes the structured input of step N+1 — each agent inherits precision from the one before it rather than starting from free-form text.

**Remaining failure mode:** Ambiguous budget signals in transcripts. "We have around 50k" extracts to a vague `budgetSignal`, which the quote agent interprets loosely. Fix requires either transcript-level prompt engineering ("identify and normalize any budget mentions to a numeric range") or a retry mechanism — both deferred.
