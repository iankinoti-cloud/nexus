import { makeClient, hasKey, signalParams, guard, secLog } from '../server/core-logic.mjs';

export async function POST(request) {
  if (!hasKey()) {
    return Response.json({ signals: [] }, { status: 200 });
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

  const { context } = body;
  if (!context || typeof context !== 'object') {
    return Response.json({ error: 'missing_context' }, { status: 400 });
  }

  try {
    const client = makeClient();
    const response = await client.messages.create(signalParams(context));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    const parsed = JSON.parse(text);
    const signals = Array.isArray(parsed.signals) ? parsed.signals : [];
    return Response.json({ signals });
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('signals', ref, err.message);
    return Response.json({ signals: [] }, { status: 200 });
  }
}
