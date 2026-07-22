import { chromium } from 'playwright';
const b = await chromium.launch({ headless:true, executablePath: process.env.HOME+'/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome' });
const p = await (await b.newContext({ viewport:{width:1440,height:810} })).newPage();
const errs=[]; p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); }); p.on('pageerror', e=>errs.push('PAGEERROR '+e.message));
await p.goto('http://localhost:5174/', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
for (let i=0;i<11;i++){ await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300); }
await p.waitForTimeout(1200);
const hasVideo = await p.locator('video').count();
const vsrc = hasVideo? await p.locator('video').first().getAttribute('src') : null;
await p.screenshot({ path:'/tmp/nexframes/deck_demo_slide.png' });
console.log('video count:', hasVideo, 'src:', vsrc);
console.log('errors:', errs.length? errs.join(' | ') : 'none');
await b.close();
