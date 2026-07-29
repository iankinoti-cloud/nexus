import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  makeClient,
  hasKey,
  chatParams,
  knowledgeParams,
  briefParams,
  proposalParams,
  quoteParams,
  guard,
  secLog,
  MODEL,
} from './core-logic.mjs';

const PORT = process.env.PORT || 8787;
const client = hasKey() ? makeClient() : null;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://nexus-topaz-omega.vercel.app',
  'https://nexus-slides.vercel.app',
];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: false }));
app.use(express.json({ limit: '1mb' }));

function extractGuardArgs(req) {
  return {
    origin: req.headers.origin,
    referer: req.headers.referer,
    body: req.body,
    token: req.headers.authorization?.replace(/^Bearer\s+/i, ''),
    ip: (req.headers['x-forwarded-for']?.split(',')[0].trim()) || req.ip,
  };
}

function safeError(res, status, error) {
  if (!res.headersSent) res.status(status).json({ error });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: hasKey(), model: MODEL });
});

app.post('/api/verify', async (req, res) => {
  const { password } = req.body || {};
  const correct = process.env.GATE_PASSWORD;
  await new Promise(r => setTimeout(r, 120));
  if (!correct || password !== correct) return res.status(401).json({ ok: false });
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  if (!client) return safeError(res, 503, 'no_api_key');
  const blocked = await guard(extractGuardArgs(req));
  if (blocked) return safeError(res, blocked.status, blocked.error);
  const { messages = [], context = {}, agent = 'ops' } = req.body || {};

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = client.messages.stream(chatParams(messages, context, agent));
    stream.on('text', (delta) => res.write(delta));
    await stream.finalMessage();
    res.end();
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('chat', ref, err.message);
    if (!res.headersSent) safeError(res, 502, 'service_unavailable');
    else res.end('\n\n[Core lost connection to the intelligence layer. Please retry.]');
  }
});

app.post('/api/knowledge', async (req, res) => {
  if (!client) return safeError(res, 503, 'no_api_key');
  const blocked = await guard(extractGuardArgs(req));
  if (blocked) return safeError(res, blocked.status, blocked.error);
  const { query, notes = [] } = req.body || {};

  try {
    const response = await client.messages.create(knowledgeParams(query, notes));
    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    res.json(JSON.parse(text));
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('knowledge', ref, err.message);
    safeError(res, 502, 'service_unavailable');
  }
});

async function pipelineJSON(params) {
  const stream = client.messages.stream(params);
  let full = '';
  stream.on('text', (t) => { full += t; });
  await stream.finalMessage();
  const jsonStart = full.indexOf('{');
  const jsonEnd = full.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('no JSON in response');
  return JSON.parse(full.slice(jsonStart, jsonEnd + 1));
}

app.post('/api/pipeline/brief', async (req, res) => {
  if (!client) return safeError(res, 503, 'no_api_key');
  const blocked = await guard(extractGuardArgs(req));
  if (blocked) return safeError(res, blocked.status, blocked.error);
  const { transcript, enquiry } = req.body || {};
  if (!transcript || typeof transcript !== 'string') {
    return safeError(res, 400, 'transcript_required');
  }
  try {
    const brief = await pipelineJSON(briefParams(transcript, enquiry ?? {}));
    brief.generatedAt = new Date().toISOString();
    res.json(brief);
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('pipeline/brief', ref, err.message);
    safeError(res, 502, 'service_unavailable');
  }
});

app.post('/api/pipeline/proposal', async (req, res) => {
  if (!client) return safeError(res, 503, 'no_api_key');
  const blocked = await guard(extractGuardArgs(req));
  if (blocked) return safeError(res, blocked.status, blocked.error);
  const { brief, ideation, enquiry } = req.body || {};
  if (!brief || !ideation) return safeError(res, 400, 'brief_and_ideation_required');
  try {
    const proposal = await pipelineJSON(proposalParams(brief, ideation, enquiry ?? {}));
    proposal.generatedAt = new Date().toISOString();
    res.json(proposal);
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('pipeline/proposal', ref, err.message);
    safeError(res, 502, 'service_unavailable');
  }
});

app.post('/api/pipeline/quote', async (req, res) => {
  if (!client) return safeError(res, 503, 'no_api_key');
  const blocked = await guard(extractGuardArgs(req));
  if (blocked) return safeError(res, blocked.status, blocked.error);
  const { brief, proposal, enquiry } = req.body || {};
  if (!brief || !proposal) return safeError(res, 400, 'brief_and_proposal_required');
  try {
    const quote = await pipelineJSON(quoteParams(brief, proposal, enquiry ?? {}));
    quote.generatedAt = new Date().toISOString();
    res.json(quote);
  } catch (err) {
    const ref = Math.random().toString(36).slice(2, 10).toUpperCase();
    secLog('pipeline/quote', ref, err.message);
    safeError(res, 502, 'service_unavailable');
  }
});

app.listen(PORT, () => {
  console.log(
    `NEXUS Core server on :${PORT} — AI ${hasKey() ? `live (${MODEL})` : 'OFFLINE (no ANTHROPIC_API_KEY, app will use local fallback)'}`,
  );
});
