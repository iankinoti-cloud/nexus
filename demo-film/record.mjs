// NEXUS product film — deterministic capture harness.
// Drives the REAL running app (guest mode) with Playwright, records video,
// injects a branded cursor + click ripple, and logs every click timestamp so
// post-production can drop a "tock" SFX precisely on each real click.
//
// Usage:  node record.mjs desktop   |   node record.mjs phone
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const PASS = (process.argv[2] || 'desktop').toLowerCase();
const APP = process.env.APP_URL || 'http://localhost:5174';
const TEAL = '#4FD1C5';

const CFG = {
  desktop: { w: 1440, h: 900, dsf: 2, dir: 'raw/desktop', mobile: false },
  phone:   { w: 390,  h: 844, dsf: 3, dir: 'raw/phone',   mobile: true  },
}[PASS];
if (!CFG) { console.error('pass must be desktop|phone'); process.exit(1); }

mkdirSync(CFG.dir, { recursive: true });

// Injected before every document: a soft cursor that follows real mouse moves,
// plus a teal ripple on mousedown. Makes the headless capture read as a film.
const CURSOR_JS = `
(() => {
  if (window.__nexusCursor) return; window.__nexusCursor = true;
  const c = document.createElement('div');
  c.id = '__cur';
  c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;' +
    'width:22px;height:22px;margin:-3px 0 0 -3px;transition:transform .04s linear;' +
    'filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));will-change:transform';
  c.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none">' +
    '<path d="M4 2 L4 18 L8.5 13.7 L11.3 20 L14 18.8 L11.2 12.6 L18 12.4 Z" ' +
    'fill="#fff" stroke="#0B0B0F" stroke-width="1.1" stroke-linejoin="round"/></svg>';
  const attach = () => { (document.body||document.documentElement).appendChild(c); };
  if (document.body) attach(); else document.addEventListener('DOMContentLoaded', attach);
  addEventListener('mousemove', e => { c.style.transform = 'translate('+e.clientX+'px,'+e.clientY+'px)'; }, true);
  addEventListener('mousedown', e => {
    const r = document.createElement('div');
    r.style.cssText = 'position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;z-index:2147483646;' +
      'pointer-events:none;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;' +
      'border:2px solid ${TEAL};opacity:.9;transition:all .5s ease-out';
    (document.body||document.documentElement).appendChild(r);
    requestAnimationFrame(() => { r.style.width='54px'; r.style.height='54px';
      r.style.margin='-27px 0 0 -27px'; r.style.opacity='0'; });
    setTimeout(() => r.remove(), 520);
  }, true);
})();`;

const clicks = [];   // {t, label}
const markers = [];  // {t, label}
let t0 = 0;
const T = () => Date.now() - t0;
const wait = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH ||
      `${process.env.HOME}/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`,
    args: ['--force-color-profile=srgb'],
  });
  const context = await browser.newContext({
    viewport: { width: CFG.w, height: CFG.h },
    deviceScaleFactor: CFG.dsf,
    isMobile: CFG.mobile,
    hasTouch: CFG.mobile,
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
    recordVideo: { dir: CFG.dir, size: { width: CFG.w, height: CFG.h } },
  });
  await context.addInitScript(CURSOR_JS);
  const page = await context.newPage();

  let mx = CFG.w / 2, my = CFG.h / 2;
  // Glide the mouse so the injected cursor animates smoothly.
  async function glide(x, y, steps = 26) {
    await page.mouse.move(x, y, { steps });
    mx = x; my = y;
  }
  async function centerOf(locator) {
    const b = await locator.boundingBox();
    if (!b) throw new Error('no bounding box');
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  async function clickOn(locator, label) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    const { x, y } = await centerOf(locator);
    await glide(x, y);
    await wait(180);
    clicks.push({ t: T(), label });
    await page.mouse.down(); await wait(60); await page.mouse.up();
    await wait(120);
  }
  const marker = label => { markers.push({ t: T(), label }); };

  t0 = Date.now();
  await page.goto(APP, { waitUntil: 'domcontentloaded' });

  // Skip splash (it's a full-screen click-to-dismiss overlay), then land on login.
  await wait(900);
  await page.mouse.click(CFG.w / 2, CFG.h / 2).catch(() => {});
  const guest = page.getByText(/Enter demo workspace|Explore as guest/i).first();
  await guest.waitFor({ timeout: 15000 });
  await wait(500);
  marker('login');
  await clickOn(guest, 'enter-demo');
  await wait(1800); // shell mounts

  const k = { clickOn, glide, marker, clicks, T };
  if (PASS === 'desktop') await desktop(page, k);
  else await phone(page, k);

  await wait(800);
  const durationMs = T();
  // Close context flushes the video file to disk.
  await context.close();
  await browser.close();

  const manifest = { pass: PASS, size: { w: CFG.w, h: CFG.h }, durationMs, clicks, markers };
  writeFileSync(`${CFG.dir}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log(`[${PASS}] done — ${(durationMs/1000).toFixed(1)}s, ${clicks.length} clicks, ${markers.length} markers`);
  console.log(`[${PASS}] video + manifest in ${CFG.dir}/`);
}

// ── Desktop choreography: Dashboard → Projects → Talent → Core(live AI) → Analytics
async function desktop(page, k) {
  const nav = name => page.getByRole('link', { name, exact: false }).first();

  k.marker('dashboard');
  await page.waitForTimeout(6000); // count-ups + charts settle

  k.marker('projects');
  await k.clickOn(nav('Projects'), 'nav-projects');
  await page.waitForTimeout(5500);

  k.marker('talent');
  await k.clickOn(nav('Talent'), 'nav-talent');
  await page.waitForTimeout(5500);

  // Core — live AI beat
  k.marker('core');
  await k.clickOn(nav('Core'), 'nav-core');
  await page.waitForTimeout(1600);
  const box = page.getByPlaceholder(/Ask Core anything/i).first();
  await k.clickOn(box, 'focus-core-input');
  const q = 'Which project is most at risk right now, and why?';
  for (const ch of q) { await page.keyboard.type(ch); await page.waitForTimeout(34 + Math.random()*36); }
  await page.waitForTimeout(500);
  // Send button sits immediately to the right of the textarea.
  const sendBtn = page.locator('button:right-of(textarea)').first();
  try {
    await k.clickOn(sendBtn, 'send-core');
  } catch {
    k.clicks.push({ t: k.T(), label: 'send-core' });
    await page.keyboard.press('Control+Enter');
  }
  k.marker('core-thinking');
  // Live streaming: hold until the answer stops growing (stable 1.6s) or 24s cap.
  await page.waitForTimeout(1500);
  const started = Date.now();
  let last = 0, stableSince = Date.now();
  while (Date.now() - started < 24000) {
    const len = await page.evaluate(() => document.body.innerText.length);
    if (len > last) { last = len; stableSince = Date.now(); }
    else if (Date.now() - stableSince > 1600) break;
    await page.waitForTimeout(300);
  }
  k.marker('core-answered');
  await page.waitForTimeout(2500);

  k.marker('analytics');
  await k.clickOn(nav('Analytics'), 'nav-analytics');
  await page.waitForTimeout(7000);
  k.marker('end-desktop');
}

// ── Phone choreography: Clients → Notifications → Knowledge (real mobile layout)
async function phone(page, k) {
  const menuBtn = () => page.getByLabel('Open menu').first();
  const drawerLink = name => page.getByRole('link', { name, exact: false }).first();
  async function goto(name, mk) {
    k.marker(mk);
    await k.clickOn(menuBtn(), `menu-open-${mk}`);
    await page.waitForTimeout(650);           // drawer slides in
    await k.clickOn(drawerLink(name), `nav-${mk}`);
    await page.waitForTimeout(1200);          // route + drawer close
  }

  k.marker('phone-dashboard');
  await page.waitForTimeout(3200);

  await goto('Clients', 'clients');
  await page.mouse.wheel(0, 260); await page.waitForTimeout(3200);

  await goto('Notifications', 'notifications');
  await page.waitForTimeout(3400);

  await goto('Knowledge', 'knowledge');
  await page.waitForTimeout(900);
  // Try a live knowledge search if a search box exists.
  const search = page.getByPlaceholder(/search/i).first();
  if (await search.count().catch(() => 0)) {
    await k.clickOn(search, 'focus-knowledge-search');
    for (const ch of 'brand guidelines') { await page.keyboard.type(ch); await page.waitForTimeout(48 + Math.random()*40); }
    await page.waitForTimeout(2600);
  } else {
    await page.mouse.wheel(0, 240);
    await page.waitForTimeout(2600);
  }
  k.marker('end-phone');
}

run().catch(e => { console.error(e); process.exit(1); });
