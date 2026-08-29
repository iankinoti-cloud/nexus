import { makeClient, hasKey, analyticsParams, guard, secLog } from '../server/core-logic.mjs';

const VALID_PERSPECTIVES = new Set(['founder', 'operations', 'account_director']);

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

  const { perspective, context } = body;
  if (!VALID_PERSPECTIVES.has(perspective)) {
    return Response.json({ error: 'invalid_perspective' }, { status: 400 });
  }
  if (!context || typeof context !== 'object') {
    return Response.json({ error: 'missing_context' }, { status: 400 });
  }

  try {
    const client = makeClient();
    const response = await client.messages.create(analyticsParams(perspective, context));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    const parsed = JSON.parse(text);
    return Response.json({
      headline: parsed.headline ?? '',
      summary: parsed.summary ?? '',
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
    });
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('analytics', ref, err.message);
    return Response.json({ error: 'service_unavailable' }, { status: 502 });
  }
}
