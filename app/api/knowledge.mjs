import { makeClient, hasKey, knowledgeParams } from '../server/core-logic.mjs';

export async function POST(request) {
  if (!hasKey()) {
    return Response.json({ error: 'no_api_key' }, { status: 503 });
  }
  const { query, notes = [] } = await request.json();

  try {
    const client = makeClient();
    const response = await client.messages.create(knowledgeParams(query, notes));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    return Response.json(JSON.parse(text));
  } catch (err) {
    return Response.json({ error: 'upstream', message: err.message }, { status: 502 });
  }
}
