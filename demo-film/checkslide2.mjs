import { chromium } from 'playwright';
const b = await chromium.launch({ headless:true, executablePath: process.env.HOME+'/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome' });
const p = await (await b.newContext({ viewport:{width:1440,height:810} })).newPage();
const errs=[]; p.on('pageerror', e=>errs.push('PAGEERROR '+e.message));
await p.goto('http://localhost:5174/', { waitUntil:'networkidle' });
await p.waitForTimeout(700);
for (let i=0;i<11;i++){ await p.keyboard.press('ArrowRight'); await p.waitForTimeout(260); }
await p.waitForTimeout(1000);
const src = await p.locator('video').first().getAttribute('src');
await p.screenshot({ path:'/tmp/nexframes/deck_short_slide.png' });
console.log('slide video src:', src, '| errors:', errs.length?errs.join('|'):'none');
await b.close();
