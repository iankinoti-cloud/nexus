// Shared AI logic used by both the local Express server (server/index.mjs)
// and the Vercel serverless functions (api/*.mjs).
import Anthropic from '@anthropic-ai/sdk';

export const MODEL = process.env.NEXUS_MODEL || 'claude-opus-4-8';

export const hasKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

export const makeClient = () => new Anthropic();

// --- Abuse guard -----------------------------------------------------------
// The AI endpoints spend money on every call, so they must not be freely
// callable by anonymous scripts. Two unspoofable layers + one cheap one:
//   1. Hard input caps  → bounds the cost of any single request (unspoofable).
//   2. Origin/Referer   → blocks the bare-curl attack that sends neither
//                          (a browser always sends one; a determined attacker
//                          can forge it, so this raises the bar, not a wall).
// The durable fix (verifying the Supabase JWT) is documented in SECURITY.md.

const ALLOWED = (process.env.NEXUS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function hostAllowed(value) {
  if (!value) return false;
  try {
    const host = new URL(value).host;
    if (host === 'localhost:5173' || host === '127.0.0.1:5173') return true;
    // Any NEXUS deployment on Vercel (production + preview URLs).
    if (/^nexus[\w-]*\.vercel\.app$/.test(host) || host === 'nexus-topaz-omega.vercel.app') return true;
    return ALLOWED.some((a) => {
      try { return new URL(a).host === host; } catch { return a === host; }
    });
  } catch {
    return false;
  }
}

/** Returns null if allowed, or an { status, error } to reject with. */
export function guard({ origin, referer, body }) {
  if (!hostAllowed(origin) && !hostAllowed(referer)) {
    return { status: 403, error: 'forbidden_origin' };
  }
  if (body && typeof body === 'object') {
    const size = JSON.stringify(body).length;
    if (size > 120_000) return { status: 413, error: 'payload_too_large' };
    if (Array.isArray(body.messages)) {
      if (body.messages.length > 24) return { status: 400, error: 'too_many_messages' };
      const chars = body.messages.reduce((n, m) => n + String(m?.content ?? '').length, 0);
      if (chars > 24_000) return { status: 400, error: 'messages_too_long' };
    }
    if (body.notes && Array.isArray(body.notes) && body.notes.length > 40) {
      return { status: 400, error: 'too_many_notes' };
    }
    if (body.query && String(body.query).length > 2_000) {
      return { status: 400, error: 'query_too_long' };
    }
  }
  return null;
}

// Stable persona block — kept byte-identical across requests so it prompt-caches.
// Volatile app context goes in a second system block after the cache breakpoint.
export const CORE_SYSTEM = `You are Core, the AI intelligence engine inside NEXUS — an AI Operating System for creative businesses. You have live access to the agency's operational data (projects, team members, clients), injected below as JSON.

Personality: calm, precise, trustworthy. Information before decoration. You prioritize decisions over raw data.

Rules:
- Ground every claim in the injected data. Refer to people, projects, and clients by name. Never invent entities that are not in the data.
- Be concise: 2-5 sentences of analysis, then recommendations if warranted.
- When you have concrete, executable advice, end your reply with a single line containing exactly %%RECOMMENDATIONS%% followed immediately by a JSON array (no markdown fences). Each item: {"title": string, "description": string, "action": Action}.
- Action is one of:
  {"type":"reassign","fromEmployeeId":string,"toEmployeeId":string,"note":string}
  {"type":"contact_client","clientId":string,"draft":string}   // draft = a short ready-to-send follow-up message
  {"type":"extend_deadline","projectId":string,"days":number,"note":string}
  {"type":"none"}
- Only emit actions whose IDs exist in the injected data. At most 3 recommendations.
- If the question needs no action (a pure lookup or analysis), skip the %%RECOMMENDATIONS%% line entirely.`;

export const KNOWLEDGE_SYSTEM =
  'You are the organizational memory of a creative agency. Answer the question using ONLY the knowledge notes provided. Cite which notes you used. If the notes do not contain the answer, say so honestly.';

export function chatParams(messages, context) {
  return {
    model: MODEL,
    max_tokens: 2048,
    system: [
      { type: 'text', text: CORE_SYSTEM, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `Current workspace data:\n${JSON.stringify(context)}` },
    ],
    messages: messages.map((m) => ({
      role: m.role === 'core' ? 'assistant' : 'user',
      content: m.content,
    })),
  };
}

export function knowledgeParams(query, notes) {
  return {
    model: MODEL,
    max_tokens: 1024,
    system: [
      { type: 'text', text: KNOWLEDGE_SYSTEM, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `Knowledge notes:\n${JSON.stringify(notes)}` },
    ],
    messages: [{ role: 'user', content: query }],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            sourceIds: { type: 'array', items: { type: 'string' } },
          },
          required: ['answer', 'sourceIds'],
          additionalProperties: false,
        },
      },
    },
  };
}

// --- Creative Services Pipeline ---

const BRIEF_SYSTEM = `You are Core, the intelligence engine of NEXUS. Extract a structured project brief from a client discovery call transcript.

Return ONLY valid JSON matching this exact schema — no markdown, no commentary:
{
  "objectives": string[],        // 3-5 clear project objectives
  "deliverables": string[],      // 4-7 specific deliverables
  "timeline": string,            // e.g. "10 weeks — delivery by 15 September 2026"
  "budgetSignal": string,        // inferred from conversation
  "targetAudience": string,      // the client's target audience
  "keyMessages": string[],       // 3-4 creative themes or key messages
  "generatedAt": string          // current ISO timestamp
}`;

const PROPOSAL_SYSTEM = `You are Core, the intelligence engine of NEXUS. Generate a professional creative agency proposal for a client.

Return ONLY valid JSON matching this exact schema — no markdown, no commentary:
{
  "title": string,
  "executiveSummary": string,    // 2-3 paragraphs, newline-separated
  "sections": [{ "title": string, "body": string }],  // 4 sections
  "deliverables": string[],      // 6-8 specific deliverables
  "timeline": string,
  "teamNotes": string,
  "generatedAt": string
}`;

const QUOTE_SYSTEM = `You are Core, the intelligence engine of NEXUS. Generate a detailed line-item quotation for a creative project.

Return ONLY valid JSON matching this exact schema — no markdown, no commentary:
{
  "lineItems": [{ "description": string, "quantity": number, "unit": string, "rate": number, "total": number }],
  "subtotal": number,
  "tax": number,
  "total": number,
  "currency": string,
  "validUntil": string,
  "notes": string,
  "generatedAt": string
}

Use hourly rates typical for a premium creative agency ($175–$300/hr). Include 6-8 line items covering all deliverables. tax should be 0. total = subtotal.`;

export function briefParams(transcript, enquiry) {
  return {
    model: MODEL,
    max_tokens: 1500,
    system: BRIEF_SYSTEM,
    messages: [{
      role: 'user',
      content: `Enquiry context: ${JSON.stringify({ company: enquiry.companyName, service: enquiry.serviceInterest, budget: enquiry.budgetRange, timeline: enquiry.timeline })}\n\nTranscript:\n${transcript}`,
    }],
  };
}

export function proposalParams(brief, ideation, enquiry) {
  return {
    model: MODEL,
    max_tokens: 2500,
    system: PROPOSAL_SYSTEM,
    messages: [{
      role: 'user',
      content: `Client: ${enquiry.companyName} (${enquiry.industry})\nContact: ${enquiry.contactName}\nService: ${enquiry.serviceInterest}\n\nProject Brief:\n${JSON.stringify(brief)}\n\nCreative Direction:\nBig Idea: ${ideation.bigIdea}\nTone: ${ideation.toneWords.join(', ')}\nDirection: ${ideation.creativeDirection}`,
    }],
  };
}

export function quoteParams(brief, proposal, enquiry) {
  return {
    model: MODEL,
    max_tokens: 1500,
    system: QUOTE_SYSTEM,
    messages: [{
      role: 'user',
      content: `Client: ${enquiry.companyName}\nBudget signal: ${brief.budgetSignal}\nTimeline: ${brief.timeline}\nDeliverables:\n${proposal.deliverables.join('\n')}\n\nToday's date: ${new Date().toISOString().split('T')[0]}`,
    }],
  };
}
