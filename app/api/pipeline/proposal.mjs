import { makeClient, hasKey, proposalParams, guard, secLog, sanitizeInput } from '../../server/core-logic.mjs';

export async function POST(request) {
  if (!hasKey()) {
    return Response.json({ error: 'no_api_key' }, { status: 503 });
  }

  const body = await request.json();
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const blocked = await guard({
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    body,
    token,
    ip,
  });
  if (blocked) {
    return Response.json({ error: blocked.error }, { status: blocked.status });
  }

  const { brief, ideation, enquiry } = body;
  if (!brief || !ideation) {
    return Response.json({ error: 'brief_and_ideation_required' }, { status: 400 });
  }

  try {
    const client = makeClient();
    const safeIdeation = {
      ...ideation,
      bigIdea: sanitizeInput(ideation.bigIdea ?? ''),
      creativeDirection: sanitizeInput(ideation.creativeDirection ?? ''),
    };
    const response = await client.messages.create(proposalParams(brief, safeIdeation, enquiry ?? {}));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('no JSON in response');
    const proposal = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    proposal.generatedAt = new Date().toISOString();
    return Response.json(proposal);
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('pipeline/proposal', ref, err.message);
    return Response.json({ error: 'service_unavailable' }, { status: 502 });
  }
}
