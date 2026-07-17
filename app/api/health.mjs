import { hasKey, MODEL } from '../server/core-logic.mjs';

export function GET() {
  return Response.json({ ok: true, ai: hasKey(), model: MODEL });
}
