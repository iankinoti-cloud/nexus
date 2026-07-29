export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  const correct = process.env.GATE_PASSWORD;

  // No password configured → gate stays permanently closed on this deployment.
  if (!correct || password !== correct) {
    // Fixed-duration response to blunt timing attacks.
    await new Promise(r => setTimeout(r, 120));
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true });
}
