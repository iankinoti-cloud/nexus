import { makeClient, hasKey, knowledgeParams, guard, secLog } from '../server/core-logic.mjs';

export async function POST(request) {
  if (!hasKey()) {
    return Response.json({ error: 'no_api_key' }, { status: 503 });
  }
  const body = await request.json();
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

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

  const { query, notes = [] } = body;

  try {
    const client = makeClient();
    const response = await client.messages.create(knowledgeParams(query, notes));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    return Response.json(JSON.parse(text));
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('knowledge', ref, err.message);
    return Response.json({ error: 'service_unavailable' }, { status: 502 });
  }
}
