import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { makeClient, hasKey, chatParams, knowledgeParams, briefParams, proposalParams, quoteParams, guard, MODEL } from './core-logic.mjs';

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

async function pipelineJSON(params, res) {
  const stream = client.messages.stream(params);
  let full = '';
  stream.on('text', t => { full += t; });
  await stream.finalMessage();
  const jsonStart = full.indexOf('{');
  const jsonEnd = full.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('no JSON in response');
  return JSON.parse(full.slice(jsonStart, jsonEnd + 1));
}

app.post('/api/pipeline/brief', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'no_api_key' });
  const blocked = guard({ origin: req.headers.origin, referer: req.headers.referer, body: req.body });
  if (blocked) return res.status(blocked.status).json({ error: blocked.error });
  const { transcript, enquiry } = req.body || {};
  if (!transcript) return res.status(400).json({ error: 'transcript_required' });
  try {
    const brief = await pipelineJSON(briefParams(transcript, enquiry ?? {}), res);
    brief.generatedAt = new Date().toISOString();
    res.json(brief);
  } catch (err) {
    console.error('[pipeline/brief]', err.message);
    res.status(502).json({ error: 'upstream', message: err.message });
  }
});

app.post('/api/pipeline/proposal', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'no_api_key' });
  const blocked = guard({ origin: req.headers.origin, referer: req.headers.referer, body: req.body });
  if (blocked) return res.status(blocked.status).json({ error: blocked.error });
  const { brief, ideation, enquiry } = req.body || {};
  if (!brief || !ideation) return res.status(400).json({ error: 'brief_and_ideation_required' });
  try {
    const proposal = await pipelineJSON(proposalParams(brief, ideation, enquiry ?? {}), res);
    proposal.generatedAt = new Date().toISOString();
    res.json(proposal);
  } catch (err) {
    console.error('[pipeline/proposal]', err.message);
    res.status(502).json({ error: 'upstream', message: err.message });
  }
});

app.post('/api/pipeline/quote', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'no_api_key' });
  const blocked = guard({ origin: req.headers.origin, referer: req.headers.referer, body: req.body });
  if (blocked) return res.status(blocked.status).json({ error: blocked.error });
  const { brief, proposal, enquiry } = req.body || {};
  if (!brief || !proposal) return res.status(400).json({ error: 'brief_and_proposal_required' });
  try {
    const quote = await pipelineJSON(quoteParams(brief, proposal, enquiry ?? {}), res);
    quote.generatedAt = new Date().toISOString();
    res.json(quote);
  } catch (err) {
    console.error('[pipeline/quote]', err.message);
    res.status(502).json({ error: 'upstream', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`NEXUS Core server on :${PORT} — AI ${hasKey() ? `live (${MODEL})` : 'OFFLINE (no ANTHROPIC_API_KEY, app will use local fallback)'}`);
});
