#!/usr/bin/env node
// Evaluation runner — runs all 10 cases through baseline AND the NEXUS pipeline.
// Usage: node eval/run.mjs
// Requires: ANTHROPIC_API_KEY in env (or app/.env)

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load env from app/.env before importing anything that reads process.env
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../app/.env');
try {
  const envFile = readFileSync(envPath, 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // env file not found — rely on process.env being set externally
}

import { cases } from './cases.mjs';
import { score } from './score.mjs';
import { runBaseline } from './baseline.mjs';
import { makeClient, briefParams, proposalParams, quoteParams } from '../app/server/core-logic.mjs';

const TRAJECTORIES_DIR = join(__dirname, 'trajectories');
mkdirSync(TRAJECTORIES_DIR, { recursive: true });

// Pricing constants (claude-opus-4-8 as of 2026)
const INPUT_PRICE_PER_M = 15;
const OUTPUT_PRICE_PER_M = 75;

function calcCost(inputTokens, outputTokens) {
  return ((inputTokens / 1_000_000) * INPUT_PRICE_PER_M + (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_M).toFixed(4);
}

async function runPipeline(enquiry, transcript, caseId) {
  const client = makeClient();
  const trajectory = { caseId, approach: 'agent-pipeline', steps: [] };
  let totalInput = 0, totalOutput = 0;
  const pipelineStart = Date.now();

  // Step 1: Brief extraction (Mira-equivalent)
  const step1Start = Date.now();
  const briefResp = await client.messages.create(briefParams(transcript, enquiry));
  const step1Latency = Date.now() - step1Start;
  const briefText = briefResp.content.find((b) => b.type === 'text')?.text ?? '{}';
  const briefJson = briefText.slice(briefText.indexOf('{'), briefText.lastIndexOf('}') + 1);
  let brief = {};
  try { brief = JSON.parse(briefJson); } catch { /* keep empty */ }
  brief.generatedAt = new Date().toISOString();

  totalInput += briefResp.usage?.input_tokens ?? 0;
  totalOutput += briefResp.usage?.output_tokens ?? 0;
  trajectory.steps.push({
    step: 1,
    agent: 'brief-extractor',
    systemRole: 'Extract structured project brief from discovery transcript',
    inputSummary: { company: enquiry.companyName, transcriptWords: transcript.split(' ').length },
    output: brief,
    inputTokens: briefResp.usage?.input_tokens ?? 0,
    outputTokens: briefResp.usage?.output_tokens ?? 0,
    latencyMs: step1Latency,
  });

  // Step 2: Proposal generation (Proposal Agent)
  const ideation = {
    bigIdea: brief.keyMessages?.[0] ?? 'Lead with the client\'s core value proposition',
    toneWords: ['professional', 'strategic', 'human'],
    creativeDirection: `Focus on ${brief.targetAudience ?? 'the client\'s audience'} and align with the key messages: ${(brief.keyMessages ?? []).slice(0, 2).join(', ')}.`,
    completedBy: 'NEXUS Pipeline',
  };
  const step2Start = Date.now();
  const propResp = await client.messages.create(proposalParams(brief, ideation, enquiry));
  const step2Latency = Date.now() - step2Start;
  const propText = propResp.content.find((b) => b.type === 'text')?.text ?? '{}';
  const propJson = propText.slice(propText.indexOf('{'), propText.lastIndexOf('}') + 1);
  let proposal = {};
  try { proposal = JSON.parse(propJson); } catch { /* keep empty */ }
  proposal.generatedAt = new Date().toISOString();

  totalInput += propResp.usage?.input_tokens ?? 0;
  totalOutput += propResp.usage?.output_tokens ?? 0;
  trajectory.steps.push({
    step: 2,
    agent: 'proposal-generator',
    systemRole: 'Generate professional proposal from structured brief + creative direction',
    inputSummary: { briefObjectives: brief.objectives?.length ?? 0, ideationBigIdea: ideation.bigIdea },
    output: { title: proposal.title, sections: proposal.sections?.length ?? 0, deliverables: proposal.deliverables?.length ?? 0 },
    inputTokens: propResp.usage?.input_tokens ?? 0,
    outputTokens: propResp.usage?.output_tokens ?? 0,
    latencyMs: step2Latency,
  });

  // Step 3: Quote generation (Quote Agent)
  const step3Start = Date.now();
  const quoteResp = await client.messages.create(quoteParams(brief, proposal, enquiry));
  const step3Latency = Date.now() - step3Start;
  const quoteText = quoteResp.content.find((b) => b.type === 'text')?.text ?? '{}';
  const quoteJson = quoteText.slice(quoteText.indexOf('{'), quoteText.lastIndexOf('}') + 1);
  let quote = {};
  try { quote = JSON.parse(quoteJson); } catch { /* keep empty */ }
  quote.generatedAt = new Date().toISOString();

  totalInput += quoteResp.usage?.input_tokens ?? 0;
  totalOutput += quoteResp.usage?.output_tokens ?? 0;
  trajectory.steps.push({
    step: 3,
    agent: 'quote-generator',
    systemRole: 'Generate line-item quotation from proposal deliverables + budget signal',
    inputSummary: { deliverables: proposal.deliverables?.length ?? 0, budgetSignal: brief.budgetSignal },
    output: { lineItems: quote.lineItems?.length ?? 0, subtotal: quote.subtotal, currency: quote.currency },
    inputTokens: quoteResp.usage?.input_tokens ?? 0,
    outputTokens: quoteResp.usage?.output_tokens ?? 0,
    latencyMs: step3Latency,
  });

  const totalLatency = Date.now() - pipelineStart;
  trajectory.totalLatencyMs = totalLatency;
  trajectory.totalInputTokens = totalInput;
  trajectory.totalOutputTokens = totalOutput;
  trajectory.costUsd = calcCost(totalInput, totalOutput);

  return { brief, proposal, quote, trajectory };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY not set. Add it to app/.env or export it before running.');
    process.exit(1);
  }

  const results = [];
  console.log('\nNEXUS × micro1 Hackathon — Evaluation\n');
  console.log('Running 10 cases through baseline and agent pipeline...\n');

  for (const c of cases) {
    process.stdout.write(`[${c.id}/10] ${c.label}... `);

    let baselineResult, pipelineResult;
    try {
      [baselineResult, pipelineResult] = await Promise.all([
        runBaseline(c.enquiry, c.transcript),
        runPipeline(c.enquiry, c.transcript, c.id),
      ]);
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
      continue;
    }

    const baselineScore = score(baselineResult, c.budgetMidpoint);
    const agentScore = score({ brief: pipelineResult.brief, proposal: pipelineResult.proposal, quote: pipelineResult.quote }, c.budgetMidpoint);

    // Save trajectory
    const trajectoryData = {
      caseId: c.id,
      label: c.label,
      enquiry: c.enquiry,
      baseline: { meta: baselineResult.meta, score: baselineScore },
      agent: { trajectory: pipelineResult.trajectory, score: agentScore },
    };
    writeFileSync(join(TRAJECTORIES_DIR, `case-${c.id}.json`), JSON.stringify(trajectoryData, null, 2));

    results.push({ case: c, baselineScore, agentScore, baselineMeta: baselineResult.meta, pipelineMeta: pipelineResult.trajectory });
    console.log(`baseline ${baselineScore.total}/10  agent ${agentScore.total}/10  delta +${agentScore.total - baselineScore.total}`);
  }

  // Summary table
  console.log('\n─────────────────────────────────────────────────────────────────────────────');
  console.log(`${'CASE'.padEnd(40)} ${'BASELINE'.padEnd(10)} ${'AGENT'.padEnd(8)} ${'DELTA'.padEnd(8)}`);
  console.log('─────────────────────────────────────────────────────────────────────────────');

  let sumBase = 0, sumAgent = 0, sumBaseLatency = 0, sumAgentLatency = 0;
  let sumBaseCost = 0, sumAgentCost = 0;

  for (const r of results) {
    const label = r.case.label.slice(0, 38).padEnd(40);
    const b = `${r.baselineScore.total}/10`.padEnd(10);
    const a = `${r.agentScore.total}/10`.padEnd(8);
    const d = `+${r.agentScore.total - r.baselineScore.total}`.padEnd(8);
    console.log(`${label} ${b} ${a} ${d}`);
    sumBase += r.baselineScore.total;
    sumAgent += r.agentScore.total;
    sumBaseLatency += r.baselineMeta.latencyMs ?? 0;
    sumAgentLatency += r.pipelineMeta.totalLatencyMs ?? 0;
    sumBaseCost += parseFloat(r.baselineMeta.costUsd ?? '0');
    sumAgentCost += parseFloat(r.pipelineMeta.costUsd ?? '0');
  }

  const n = results.length;
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log(`${'Average'.padEnd(40)} ${(sumBase / n).toFixed(1).padEnd(10)} ${(sumAgent / n).toFixed(1).padEnd(8)}`);
  console.log(`${'Time / case (avg ms)'.padEnd(40)} ${String(Math.round(sumBaseLatency / n)).padEnd(10)} ${String(Math.round(sumAgentLatency / n)).padEnd(8)}`);
  console.log(`${'Cost / case (avg USD)'.padEnd(40)} ${'$' + (sumBaseCost / n).toFixed(4)} ${'$' + (sumAgentCost / n).toFixed(4)}`);
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log(`\nTrajectories saved to eval/trajectories/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
