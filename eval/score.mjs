// Scoring rubric — 10 criteria, 1 point each.
// Accepts the structured output from both baseline and agent pipeline.
// Returns { total: number, breakdown: Record<string, boolean> }

const AI_FILLER = /\b(as an ai|i cannot|i'm unable|please note that|it's important to|certainly!|absolutely!|i'd be happy to)\b/i;

export function score({ brief, proposal, quote }, budgetMidpoint) {
  const b = brief ?? {};
  const p = proposal ?? {};
  const q = quote ?? {};

  const c = {};

  // 1. Executive summary present and substantial (>80 chars)
  c.executiveSummary = typeof p.executiveSummary === 'string' && p.executiveSummary.length > 80;

  // 2. Brief has ≥3 objectives
  c.objectives = Array.isArray(b.objectives) && b.objectives.length >= 3;

  // 3. Brief has ≥4 deliverables
  c.briefDeliverables = Array.isArray(b.deliverables) && b.deliverables.length >= 4;

  // 4. Timeline is specific (contains a digit or time word)
  c.timelineSpecific =
    typeof b.timeline === 'string' &&
    /(\d+|week|month|january|february|march|april|may|june|july|august|september|october|november|december|q[1-4])/i.test(b.timeline);

  // 5. Quote has ≥5 line items
  c.quoteLineItems = Array.isArray(q.lineItems) && q.lineItems.length >= 5;

  // 6. Quote subtotal within ±30% of expected budget midpoint
  if (budgetMidpoint && typeof q.subtotal === 'number' && q.subtotal > 0) {
    const ratio = q.subtotal / budgetMidpoint;
    c.budgetAccuracy = ratio >= 0.7 && ratio <= 1.3;
  } else {
    c.budgetAccuracy = false;
  }

  // 7. Team notes present and non-trivial
  c.teamNotes = typeof p.teamNotes === 'string' && p.teamNotes.length > 20;

  // 8. Proposal has ≥3 sections
  c.proposalSections = Array.isArray(p.sections) && p.sections.length >= 3;

  // 9. Proposal deliverables list is ≥4 items (more specific than brief)
  c.proposalDeliverables = Array.isArray(p.deliverables) && p.deliverables.length >= 4;

  // 10. No obvious AI filler phrases in the proposal
  const proposalText = [p.executiveSummary ?? '', (p.sections ?? []).map((s) => s.body ?? '').join(' ')].join(' ');
  c.noFiller = !AI_FILLER.test(proposalText);

  const total = Object.values(c).filter(Boolean).length;

  return { total, max: 10, breakdown: c };
}
