import { makeClient, hasKey, chatParams, guard, secLog } from '../server/core-logic.mjs';

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

  const { messages = [], context = {}, agent = 'ops' } = body;
  const client = makeClient();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const msgStream = client.messages.stream(chatParams(messages, context, agent));
        msgStream.on('text', (delta) => controller.enqueue(encoder.encode(delta)));
        await msgStream.finalMessage();
      } catch (err) {
        secLog('chat', 'stream', err.message);
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
