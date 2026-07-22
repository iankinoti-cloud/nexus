// Renders the "Midnight Launch" compositing plates + title cards via Chromium.
// Uses the REAL NEXUS emblem (screen-blended white mark on black) and a
// deck-matched sans (Arial→Liberation, the closest offline stand-in for Geist).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

mkdirSync('assets', { recursive: true });
const W = 1920, H = 1080, TEAL = '#4FD1C5', BG = '#0B0B0F', KEY = '#00FF00';
const EMB = 'data:image/jpeg;base64,' + readFileSync('assets/emblem.jpeg').toString('base64');
const FONT = "Arial, 'Liberation Sans', 'Helvetica Neue', sans-serif";

const HOLES = {
  desktop: { x: 300, y: 150, w: 1320, h: 825 },
  phone:   { x: 806, y: 132, w: 344,  h: 745 },
};
writeFileSync('assets/holes.json', JSON.stringify(HOLES, null, 2));

const studioBg = `position:fixed;inset:0;background:${BG};overflow:hidden;`;
const glow = `
  <div style="position:fixed;left:50%;top:44%;width:1500px;height:1000px;transform:translate(-50%,-50%);
    background:radial-gradient(closest-side, rgba(79,209,197,0.16), rgba(79,209,197,0.045) 45%, transparent 72%);filter:blur(6px);"></div>
  <div style="position:fixed;inset:0;
    background-image:linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);background-size:54px 54px;
    mask-image:radial-gradient(closest-side at 50% 60%, black, transparent 78%);
    -webkit-mask-image:radial-gradient(closest-side at 50% 60%, black, transparent 78%);"></div>
  <div style="position:fixed;left:0;right:0;bottom:0;height:220px;
    background:linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>`;

// Real emblem, black dropped via screen blend so only the white mark shows.
const emblem = (px, glowPx) => `
  <div style="position:relative;width:${px}px;height:${px}px;">
    <div style="position:absolute;inset:-${glowPx}px;background:radial-gradient(closest-side, rgba(79,209,197,0.55), transparent 70%);filter:blur(${glowPx * 0.6}px);"></div>
    <img src="${EMB}" style="position:relative;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;" />
  </div>`;

const wordmark = `
  <div style="position:fixed;left:60px;top:46px;display:flex;align-items:center;gap:12px;
    font-family:${FONT};letter-spacing:.30em;color:#F4F4F5;font-weight:700;font-size:21px;">
    ${emblem(34, 8)}<span style="padding-left:.30em;">NEXUS</span>
  </div>`;

function deviceScene(kind) {
  const h = HOLES[kind];
  if (kind === 'desktop') {
    return `<div style="${studioBg}">${glow}${wordmark}
      <div style="position:fixed;left:${h.x-18}px;top:${h.y-18}px;width:${h.w+36}px;height:${h.h+36}px;
        border-radius:22px;background:#0d0d12;border:1px solid rgba(255,255,255,0.08);
        box-shadow:0 40px 120px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06);padding:18px;">
        <div style="width:100%;height:100%;border-radius:10px;background:${KEY};"></div></div>
      <div style="position:fixed;left:50%;top:${h.y+h.h+18}px;width:26px;height:60px;transform:translateX(-50%);background:linear-gradient(#15151b,#0d0d12);border-radius:0 0 6px 6px;"></div>
      <div style="position:fixed;left:50%;top:${h.y+h.h+74}px;width:260px;height:14px;transform:translateX(-50%);background:#101016;border-radius:50%;box-shadow:0 18px 40px -8px rgba(0,0,0,0.7);"></div>
    </div>`;
  }
  return `<div style="${studioBg}">${glow}${wordmark}
    <div style="position:fixed;left:${h.x-14}px;top:${h.y-14}px;width:${h.w+28}px;height:${h.h+28}px;
      border-radius:52px;background:#0d0d12;border:1px solid rgba(255,255,255,0.10);
      box-shadow:0 50px 130px -20px rgba(0,0,0,0.85), 0 0 60px rgba(79,209,197,0.10), inset 0 1px 0 rgba(255,255,255,0.07);padding:13px;">
      <div style="position:relative;width:100%;height:100%;border-radius:40px;background:${KEY};overflow:hidden;"></div></div>
    <div style="position:fixed;left:50%;top:${h.y+2}px;width:120px;height:26px;transform:translateX(-50%);background:#0d0d12;border-radius:0 0 16px 16px;z-index:5;"></div>
  </div>`;
}

function card(kind) {
  const common = `${studioBg}display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:${FONT};text-align:center;`;
  if (kind === 'intro') {
    return `<div style="${common}">${glow}
      <div style="margin-bottom:54px;">${emblem(150, 40)}</div>
      <div style="color:#F4F4F5;font-weight:200;font-size:72px;letter-spacing:.42em;padding-left:.42em;">NEXUS</div>
      <div style="color:${TEAL};font-weight:600;font-size:16px;letter-spacing:.30em;margin-top:26px;text-transform:uppercase;">The intelligent creative enterprise</div>
    </div>`;
  }
  return `<div style="${common}">${glow}
    <div style="margin-bottom:44px;">${emblem(120, 34)}</div>
    <div style="color:#F4F4F5;font-weight:200;font-size:58px;letter-spacing:.06em;line-height:1.15;">The intelligent<br/>creative enterprise.</div>
    <div style="color:${TEAL};font-weight:700;font-size:20px;letter-spacing:.34em;margin-top:40px;">NEXUS</div>
  </div>`;
}

const pages = {
  'plate-desktop': deviceScene('desktop'),
  'plate-phone':   deviceScene('phone'),
  'card-intro':    card('intro'),
  'card-outro':    card('outro'),
};

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || `${process.env.HOME}/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`,
});
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
for (const [name, html] of Object.entries(pages)) {
  await page.setContent(`<body style="margin:0">${html}</body>`);
  await page.waitForTimeout(140);
  await page.screenshot({ path: `assets/${name}.png` });
  console.log('rendered', name);
}
await browser.close();
console.log('plates done (real emblem)');
