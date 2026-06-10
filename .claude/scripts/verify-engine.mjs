/* GATE 1 verification for the demo engine.
   Throwaway — remove in Phase 6 or after engine verification ships.

   Runs five checks against http://localhost:8080/sandbox-engine.html:
     1. Page loads, zero console errors at parse
     2. Cursor element mounts inside the demo body
     3. Cursor moves between anchors (left/top values change over time)
     4. IntersectionObserver pauses on scroll-out, resumes on scroll-back
     5. prefers-reduced-motion: reduce snaps cursor and skips the loop

   Captures one screenshot per viewport per state under
   .claude/scripts/screenshots/phase1-* for visual inspection.
*/
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const URL = 'http://localhost:8080/sandbox-engine.html';
const OUT = path.resolve('.claude/scripts/screenshots');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function log(label, pass, detail) {
  const tag = pass ? 'PASS' : 'FAIL';
  results.push({ label, pass, detail });
  console.log(`[${tag}] ${label}${detail ? ' — ' + detail : ''}`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runViewport({ name, viewport, reducedMotion }) {
  console.log(`\n=== ${name} ${reducedMotion ? '(reduced-motion: reduce)' : ''} ===`);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push('pageerror: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push('console.error: ' + msg.text());
  });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await sleep(300);

  log(`${name}: zero console errors at parse`, consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.join(' | ') : '');

  const cursorMounted = await page.evaluate(() => !!document.querySelector('.demo-cursor'));
  log(`${name}: .demo-cursor mounted in DOM`, cursorMounted);

  const pos1 = await page.evaluate(() => {
    const c = document.querySelector('.demo-cursor');
    return { left: c.style.left, top: c.style.top };
  });

  if (reducedMotion) {
    // Wait a beat to ensure no choreography fires
    await sleep(2500);
    const pos2 = await page.evaluate(() => {
      const c = document.querySelector('.demo-cursor');
      return { left: c.style.left, top: c.style.top };
    });
    log(`${name}: reduced-motion — cursor stays still`,
        pos1.left === pos2.left && pos1.top === pos2.top,
        `pos1=${JSON.stringify(pos1)} pos2=${JSON.stringify(pos2)}`);
    log(`${name}: reduced-motion — cursor snapped to a real position (not -40px)`,
        pos1.left !== '-40px' && pos1.left !== '',
        `left=${pos1.left}`);
    await page.screenshot({
      path: path.join(OUT, `phase1-${name}-reduced-motion.png`),
      fullPage: false,
    });
  } else {
    // Wait for at least one full cycle (4s) plus a margin
    await sleep(2000);
    const pos2 = await page.evaluate(() => {
      const c = document.querySelector('.demo-cursor');
      return { left: c.style.left, top: c.style.top };
    });
    log(`${name}: cursor moves between positions`,
        pos1.left !== pos2.left || pos1.top !== pos2.top,
        `pos1=${JSON.stringify(pos1)} pos2=${JSON.stringify(pos2)}`);
    await page.screenshot({
      path: path.join(OUT, `phase1-${name}-mid-loop.png`),
      fullPage: false,
    });

    // Scroll out of viewport, wait, check that the demo paused
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(800);
    const status = await page.textContent('#status');
    log(`${name}: pauses on scroll-out`,
        /paused/i.test(status || ''), `status="${status}"`);
    await page.screenshot({
      path: path.join(OUT, `phase1-${name}-scrolled-out.png`),
      fullPage: false,
    });

    // Scroll back, confirm resume
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1200);
    const status2 = await page.textContent('#status');
    log(`${name}: resumes on scroll-back`,
        /playing|moving/i.test(status2 || ''), `status="${status2}"`);
  }

  await browser.close();
}

(async () => {
  await runViewport({
    name: 'desktop',
    viewport: { width: 1280, height: 800 },
    reducedMotion: false,
  });
  await runViewport({
    name: 'mobile',
    viewport: { width: 390, height: 844 },
    reducedMotion: false,
  });
  await runViewport({
    name: 'desktop',
    viewport: { width: 1280, height: 800 },
    reducedMotion: true,
  });

  console.log('\n=== SUMMARY ===');
  const passed = results.filter(r => r.pass).length;
  const total = results.length;
  console.log(`${passed}/${total} checks passed`);
  if (passed !== total) {
    console.log('FAILURES:');
    results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.label}: ${r.detail}`));
    process.exit(1);
  }
})();
