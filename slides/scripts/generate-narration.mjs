/**
 * generate-narration.mjs
 * Calls ElevenLabs TTS to produce a ~3-min storyteller narration for the NEXUS deck.
 * Run: node scripts/generate-narration.mjs
 * Reads API key from /home/khelan/Documents/Credentials/elevenlabs.env
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dir, "../public/audio/nexus-narration.mp3");
mkdirSync(dirname(OUT_PATH), { recursive: true });

// — Load API key from credentials file ——————————————————————————————————
const envPath = "/home/khelan/Documents/Credentials/elevenlabs.env";
const envLine = readFileSync(envPath, "utf8")
  .split("\n")
  .find((l) => l.startsWith("ELEVENLABS_API_KEY="));
if (!envLine) throw new Error("ELEVENLABS_API_KEY not found in elevenlabs.env");
const API_KEY = envLine.split("=")[1].trim();

// — Voice — "George": warm baritone, natural storytelling cadence ——————————
// Voice ID confirmed from ElevenLabs voice library
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

// — Narration script ————————————————————————————————————————————————————————
// ~300 words at ~100 wpm = ~3 minutes. Paced with ellipses for natural breath.
const NARRATION = `
Every creative business reaches a moment...
when the tools it relies on... start to work against it.

Seventeen platforms. None of them connected.
Decisions made from memory. Talent burning quietly before anyone sees the signs.
Revenue risk... hiding in plain sight.

The software that was supposed to help... doesn't.
Not really.
It manages tasks but misses meaning.
It stores files but never surfaces what matters.
It tracks time... but it can't see what's breaking your people.

What if there was one system... one intelligence...
that understood everything at once?
Your projects. Your people. Your clients.
All connected. All in motion. All visible.

That's NEXUS.

Mission Control gives leadership a living view of the entire business.
Active projects. Revenue at risk. Team utilization.
Not a report from last week... the truth, right now, before it becomes a problem.

At the center of NEXUS sits Core...
an intelligence layer that reads across every signal in your business,
and tells you what's happening... and what's about to.

Projects aren't just tracked. They're understood.
Your people aren't just managed. They're protected.
Client relationships aren't just logged...
they're scored, monitored, and surfaced before a small issue becomes a real one.

Everything your agency has ever learned...
about clients, about craft, about what works...
is now findable. Connected. Alive. Right when you need it.

Routine decisions that used to need a meeting?
NEXUS handles them automatically.
Trigger, condition, action, outcome.
Intelligence built into the rhythm of how your business runs.

Four specialized AI agents... Zara, Knox, Mira, and Axel...
each trained on a specific domain.
Working together as one coordinated intelligence.
Not four separate tools. One system.

Built on modern, production-grade infrastructure.
Fast, secure, and designed to scale.

The numbers are clear.
Forty-seven percent faster decisions.
Thirty-two percent less client churn.
Revenue risk that gets surfaced early... before it costs you.

We're not building software.
We're building the intelligence infrastructure
for the next generation of creative businesses...
ones that move faster, think clearer, and grow without burning their people.

This is NEXUS.
Intelligence at scale.
Built for the businesses that shape culture.

We'd love to show you... what it can do for yours.
`.trim();

// — ElevenLabs TTS request ——————————————————————————————————————————————————
console.log("Generating narration via ElevenLabs...");

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: NARRATION,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.72,
        similarity_boost: 0.82,
        style: 0.28,
        use_speaker_boost: true,
        speed: 0.82,
      },
    }),
  }
);

if (!res.ok) {
  const err = await res.text();
  throw new Error(`ElevenLabs API error ${res.status}: ${err}`);
}

const buffer = await res.arrayBuffer();
writeFileSync(OUT_PATH, Buffer.from(buffer));
console.log(`✓ Narration saved to ${OUT_PATH} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
