import { makeClient, hasKey, chatParams, guard } from '../server/core-logic.mjs';

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

  const { messages = [], context = {} } = body;
  const client = makeClient();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const msgStream = client.messages.stream(chatParams(messages, context));
        msgStream.on('text', (delta) => controller.enqueue(encoder.encode(delta)));
        await msgStream.finalMessage();
      } catch (err) {
        controller.enqueue(
          encoder.encode('\n\n[Core lost connection to the intelligence layer. Please retry.]'),
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
