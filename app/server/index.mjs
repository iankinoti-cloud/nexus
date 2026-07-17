import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const PORT = process.env.PORT || 8787;
const MODEL = process.env.NEXUS_MODEL || 'claude-opus-4-8';
const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
const client = hasKey ? new Anthropic() : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Stable persona block — kept byte-identical across requests so it prompt-caches.
// Volatile app context goes in a second system block after the cache breakpoint.
const CORE_SYSTEM = `You are Core, the AI intelligence engine inside NEXUS — an AI Operating System for creative businesses. You have live access to the agency's operational data (projects, team members, clients), injected below as JSON.

Personality: calm, precise, trustworthy. Information before decoration. You prioritize decisions over raw data.

Rules:
- Ground every claim in the injected data. Refer to people, projects, and clients by name. Never invent entities that are not in the data.
- Be concise: 2-5 sentences of analysis, then recommendations if warranted.
- When you have concrete, executable advice, end your reply with a single line containing exactly %%RECOMMENDATIONS%% followed immediately by a JSON array (no markdown fences). Each item: {"title": string, "description": string, "action": Action}.
- Action is one of:
  {"type":"reassign","fromEmployeeId":string,"toEmployeeId":string,"note":string}
  {"type":"contact_client","clientId":string,"draft":string}   // draft = a short ready-to-send follow-up message
  {"type":"extend_deadline","projectId":string,"days":number,"note":string}
  {"type":"none"}
- Only emit actions whose IDs exist in the injected data. At most 3 recommendations.
- If the question needs no action (a pure lookup or analysis), skip the %%RECOMMENDATIONS%% line entirely.`;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: hasKey, model: MODEL });
});

app.post('/api/chat', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'no_api_key' });
  const { messages = [], context = {} } = req.body || {};

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      system: [
        { type: 'text', text: CORE_SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `Current workspace data:\n${JSON.stringify(context)}` },
      ],
      messages: messages.map((m) => ({
        role: m.role === 'core' ? 'assistant' : 'user',
        content: m.content,
      })),
    });

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
  const { query, notes = [] } = req.body || {};

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: 'You are the organizational memory of a creative agency. Answer the question using ONLY the knowledge notes provided. Cite which notes you used. If the notes do not contain the answer, say so honestly.',
          cache_control: { type: 'ephemeral' },
        },
        { type: 'text', text: `Knowledge notes:\n${JSON.stringify(notes)}` },
      ],
      messages: [{ role: 'user', content: query }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              answer: { type: 'string' },
              sourceIds: { type: 'array', items: { type: 'string' } },
            },
            required: ['answer', 'sourceIds'],
            additionalProperties: false,
          },
        },
      },
    });

    const text = response.content.find((b) => b.type === 'text')?.text ?? '{}';
    res.json(JSON.parse(text));
  } catch (err) {
    console.error('[knowledge]', err.message);
    res.status(502).json({ error: 'upstream', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`NEXUS Core server on :${PORT} — AI ${hasKey ? `live (${MODEL})` : 'OFFLINE (no ANTHROPIC_API_KEY, app will use local fallback)'}`);
});
