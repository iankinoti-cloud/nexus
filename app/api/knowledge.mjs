import { makeClient, hasKey, knowledgeParams, guard } from '../server/core-logic.mjs';

export async function POST(request) {
  if (!hasKey()) {
    return Response.json({ error: 'no_api_key' }, { status: 503 });
  }
  const body = await request.json();
  const blocked = guard({
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    body,
  });
  if (blocked) return Response.json({ error: blocked.error }, { status: blocked.status });

  const { query, notes = [] } = body;

  try {
    const client = makeClient();
    const response = await client.messages.create(knowledgeParams(query, notes));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    return Response.json(JSON.parse(text));
  } catch (err) {
    return Response.json({ error: 'upstream', message: err.message }, { status: 502 });
  }
}
