// Baseline: a single Claude call that attempts the full brief+proposal+quote
// in one prompt with no pipeline structure or specialist agents.
// This represents the "reasonable basic approach" before building NEXUS.

import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.NEXUS_MODEL || 'claude-opus-4-8';

const BASELINE_SYSTEM = `You are a helpful assistant for a creative agency.

Given a client enquiry and discovery call transcript, do three things in one response:
1. Extract a project brief
2. Write a professional proposal
3. Create a line-item quotation

Return ONLY valid JSON with this structure — no markdown, no commentary:
{
  "brief": {
    "objectives": string[],
    "deliverables": string[],
    "timeline": string,
    "budgetSignal": string,
    "targetAudience": string,
    "keyMessages": string[]
  },
  "proposal": {
    "title": string,
    "executiveSummary": string,
    "sections": [{ "title": string, "body": string }],
    "deliverables": string[],
    "timeline": string,
    "teamNotes": string
  },
  "quote": {
    "lineItems": [{ "description": string, "quantity": number, "unit": string, "rate": number, "total": number }],
    "subtotal": number,
    "tax": number,
    "total": number,
    "currency": string,
    "validUntil": string,
    "notes": string
  }
}`;

export async function runBaseline(enquiry, transcript) {
  const client = new Anthropic();
  const start = Date.now();

  const userMessage = `Client: ${enquiry.companyName} (${enquiry.industry})
Contact: ${enquiry.contactName}
Service requested: ${enquiry.serviceInterest}
Budget: ${enquiry.budgetRange}
Timeline: ${enquiry.timeline}

Discovery call transcript:
${transcript}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: BASELINE_SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  });

  const latency = Date.now() - start;
  const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';

  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  let parsed = {};
  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch {
      parsed = {};
    }
  }

  const inputTokens = response.usage?.input_tokens ?? 0;
  const outputTokens = response.usage?.output_tokens ?? 0;

  return {
    brief: parsed.brief ?? {},
    proposal: parsed.proposal ?? {},
    quote: parsed.quote ?? {},
    meta: {
      approach: 'baseline',
      calls: 1,
      latencyMs: latency,
      inputTokens,
      outputTokens,
      costUsd: ((inputTokens / 1_000_000) * 15 + (outputTokens / 1_000_000) * 75).toFixed(4),
    },
  };
}
