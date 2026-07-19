import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { makeClient, hasKey, chatParams, knowledgeParams, guard, MODEL } from './core-logic.mjs';

const PORT = process.env.PORT || 8787;
const client = hasKey() ? makeClient() : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: hasKey(), model: MODEL });
});

app.post('/api/chat', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'no_api_key' });
  const blocked = guard({ origin: req.headers.origin, referer: req.headers.referer, body: req.body });
  if (blocked) return res.status(blocked.status).json({ error: blocked.error });
  const { messages = [], context = {} } = req.body || {};

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = client.messages.stream(chatParams(messages, context));
    stream.on('text', (delta) => res.write(delta));
    await stream.finalMessage();
    res.end();
  } catch (err) {
    console.error('[chat]', err.message);
    if (!res.headersSent) res.status(502).json({ error: 'upstream', message: err.message });
    else res.end('\n\n[Core lost connection to the intelligence layer. Please retry.]');
  }
});

app.post('/api/knowledge', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'no_api_key' });
  const blocked = guard({ origin: req.headers.origin, referer: req.headers.referer, body: req.body });
  if (blocked) return res.status(blocked.status).json({ error: blocked.error });
  const { query, notes = [] } = req.body || {};

  try {
    const response = await client.messages.create(knowledgeParams(query, notes));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    res.json(JSON.parse(text));
  } catch (err) {
    console.error('[knowledge]', err.message);
    res.status(502).json({ error: 'upstream', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`NEXUS Core server on :${PORT} — AI ${hasKey() ? `live (${MODEL})` : 'OFFLINE (no ANTHROPIC_API_KEY, app will use local fallback)'}`);
});
