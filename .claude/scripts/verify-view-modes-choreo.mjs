/* GATE 3 verification for Ghost View Modes choreography.
   Phase 3 of the autoplay engine session. Throwaway.

   Covers all checks in the Phase 3 brief:
     1. Full-loop capture at T=0,1500,2400,5300,8200,11100,12500,14500
     2. Second iteration visual parity check
     3. Reduced-motion check
     4. LoopObserver pause/resume on scroll
     5. Resize handling (debounced 150ms)
     6. Mobile loop progression check
     7. Coexistence with Beat 2 slider
     8. Bundle measurement (reported separately via wc/gzip)
     9. Zero console errors
    10. Cache-bust verification (handled separately via grep)
*/
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const URL = 'http://localhost:8080/work/ghost.html';
const OUT = path.resolve('.claude/scripts/screenshots');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function log(label, pass, detail) {
  const tag = pass ? 'PASS' : 'FAIL';
  results.push({ label, pass, detail });
  console.log(`[${tag}] ${label}${detail ? ' — ' + detail : ''}`);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function gotoAndScroll(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('ghostViewModes');
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await sleep(400);
}

async function getActiveMode(page) {
  return await page.evaluate(() => {
    const frame = document.getElementById('ghostViewModes');
    const chip = frame.querySelector('.vm-chip.is-active');
    return chip ? chip.getAttribute('data-vm-mode') : null;
  });
}

async function getPillRect(page) {
  return await page.evaluate(() => {
    const pill = document.querySelector('#ghostViewModes .vm-pill');
    if (!pill) return null;
    const r = pill.getBoundingClientRect();
    return { x: r.x, width: r.width };
  });
}

async function shotFrame(page, name) {
  const box = await page.evaluate(() => {
    const f = document.getElementById('ghostViewModes');
    const r = f.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.screenshot({
    path: path.join(OUT, `phase3-${name}.png`),
    clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8),
            width: Math.min(2000, box.width + 16),
            height: Math.min(2000, box.height + 16) },
  });
}

/* ====== Run 1: Desktop full loop with timed captures ====== */
async function runDesktopLoop() {
  console.log('\n=== desktop full loop ===');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push('console.error: ' + m.text()); });

  await gotoAndScroll(page);

  // Wait briefly for the IO to fire and JS to take over CSS fallback
  await sleep(200);

  log('desktop: zero console errors at load', consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.join(' | ') : '');

  // T=0: Slider mode active, pill positioned at slider chip
  const t0Mode = await getActiveMode(page);
  const t0Pill = await getPillRect(page);
  log('desktop T=0: Slider mode active', t0Mode === 'slider', `active=${t0Mode}`);
  log('desktop T=0: pill positioned (width > 0)', t0Pill && t0Pill.width > 20,
      `pillW=${t0Pill?.width}`);
  await shotFrame(page, 'desktop-t0-slider');

  // T~1500: cursor mid-transit to side-by-side chip (after T+1500 step)
  await sleep(1700);
  await shotFrame(page, 'desktop-t1700-cursor-moving');

  // T~2500: just after click; pill slid; side-by-side active
  await sleep(800); // 1700 + 800 = 2500
  const tSbsMode = await getActiveMode(page);
  log('desktop T~2500: Side-by-Side mode active after first click',
      tSbsMode === 'side-by-side', `active=${tSbsMode}`);
  await shotFrame(page, 'desktop-t2500-sbs');

  // T~4800: overlay active (was 5400 before tweak 1)
  await sleep(2300); // 2500 + 2300 = 4800
  const tOverMode = await getActiveMode(page);
  log('desktop T~4800: Overlay mode active', tOverMode === 'overlay', `active=${tOverMode}`);
  await shotFrame(page, 'desktop-t4800-overlay');

  // T~7100: timeline active (was 8300)
  await sleep(2300); // 4800 + 2300 = 7100
  const tTimeMode = await getActiveMode(page);
  log('desktop T~7100: Timeline mode active', tTimeMode === 'timeline', `active=${tTimeMode}`);
  await shotFrame(page, 'desktop-t7100-timeline');

  // T~9400: back to slider (was 11200)
  await sleep(2300); // 7100 + 2300 = 9400
  const tSliderMode = await getActiveMode(page);
  log('desktop T~9400: Slider mode active (loop closing)',
      tSliderMode === 'slider', `active=${tSliderMode}`);
  await shotFrame(page, 'desktop-t9400-slider-return');

  // T~10500: in the middle of the return-to-rest move (T+9700, 700ms).
  // Cursor should still be VISIBLE (opacity > 0.9 — Tweak 3 removes fade-out)
  // and on its way to canvas center.
  await sleep(1100); // 9400 + 1100 = 10500
  const cursorMid = await page.evaluate(() => {
    const c = document.querySelector('#ghostViewModes .demo-cursor');
    if (!c) return null;
    const frame = document.getElementById('ghostViewModes');
    const fr = frame.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    return {
      opacity: parseFloat(getComputedStyle(c).opacity),
      relX: cr.left + cr.width / 2 - fr.left,
      relY: cr.top + cr.height / 2 - fr.top,
    };
  });
  log('desktop T~10500: cursor STILL VISIBLE (Tweak 3 — no fade-out)',
      cursorMid && cursorMid.opacity > 0.9, `opacity=${cursorMid?.opacity}`);
  await shotFrame(page, 'desktop-t10500-return-to-rest');

  // T~10900: return-to-rest complete (started 9700 + 700 = 10400).
  // Cursor should be parked at canvas center (within ~80px of true center).
  await sleep(400); // 10500 + 400 = 10900
  const seamA = await page.evaluate(() => {
    const c = document.querySelector('#ghostViewModes .demo-cursor');
    const body = document.querySelector('#ghostViewModes .demo-frame-body');
    if (!c || !body) return null;
    const cr = c.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    return {
      opacity: parseFloat(getComputedStyle(c).opacity),
      cursorCenterX: cr.left + cr.width / 2,
      cursorCenterY: cr.top + cr.height / 2,
      bodyCenterX: br.left + br.width / 2,
      bodyCenterY: br.top + br.height / 2,
    };
  });
  const dx = Math.abs(seamA.cursorCenterX - seamA.bodyCenterX);
  const dy = Math.abs(seamA.cursorCenterY - seamA.bodyCenterY);
  log('desktop T~10900: cursor at canvas center (within 30px)',
      dx < 30 && dy < 30, `dx=${dx.toFixed(0)} dy=${dy.toFixed(0)}`);
  log('desktop T~10900: cursor still opacity 1 (no mid-demo fade)',
      seamA.opacity > 0.9, `opacity=${seamA.opacity}`);
  await shotFrame(page, 'desktop-t10900-at-rest');

  // Cross the loop seam (T+11000). At iter 2 T+50, the cursor should
  // STILL be at canvas center with full opacity — verifying no fade-in
  // re-fires on subsequent iterations. New LOOP_DURATION = 11000.
  await sleep(150); // 10900 + 150 = 11050 — just past the seam
  const seamB = await page.evaluate(() => {
    const c = document.querySelector('#ghostViewModes .demo-cursor');
    return c ? {
      opacity: parseFloat(getComputedStyle(c).opacity),
      left: c.style.left,
      top: c.style.top,
    } : null;
  });
  log('desktop iter 2 T~50: cursor seamless (opacity stays 1, no re-mount)',
      seamB && seamB.opacity > 0.9, `opacity=${seamB?.opacity}`);
  await shotFrame(page, 'desktop-iter2-t50-seam');

  // Loop total duration check: iter 2 SBS active expected at iter1 T+11000 + 2500 = T~13500.
  // We're at T~11050, wait 2450ms.
  await sleep(2450);
  const iter2Sbs = await getActiveMode(page);
  log('desktop iter 2 T~2500: SBS active (loop total = 11s, parity preserved)',
      iter2Sbs === 'side-by-side', `active=${iter2Sbs}`);
  await shotFrame(page, 'desktop-iter2-sbs');

  await browser.close();
}

/* ====== Run 1b: Cursor easing timing (Tweak 2 verification) ======
   Verifies the new Penner easeOutQuad at 400ms by measuring a single
   transitionend event for left/top on the cursor. Should fire within
   400ms ± 30ms. */
async function runEasingTiming() {
  console.log('\n=== cursor easing timing (Tweak 2) ===');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await gotoAndScroll(page);
  await sleep(500);

  // Wait for the cursor to be mounted before we trigger a synthetic move.
  await sleep(1100); // cursor mounts at T+1000 via choreography

  // Hook the transitionend listener BEFORE triggering a move, then mutate
  // style.left manually to start the transition. We do this from inside a
  // single page.evaluate so the listener is wired before the move fires.
  const elapsed = await page.evaluate(() => {
    return new Promise((resolve) => {
      const cursor = document.querySelector('#ghostViewModes .demo-cursor');
      if (!cursor) return resolve(null);
      // Snap to a known starting position with transition disabled
      cursor.classList.add('is-snapping');
      cursor.style.left = '100px';
      cursor.style.top = '100px';
      // Force layout to commit the snap before clearing the class
      void cursor.offsetWidth;
      cursor.classList.remove('is-snapping');
      // Wait one rAF tick so the engine releases the snap class before
      // we start the timed move.
      requestAnimationFrame(() => {
        const startedAt = performance.now();
        let resolved = false;
        function onEnd(e) {
          if (e.propertyName !== 'left' && e.propertyName !== 'top') return;
          if (resolved) return;
          resolved = true;
          cursor.removeEventListener('transitionend', onEnd);
          resolve(performance.now() - startedAt);
        }
        cursor.addEventListener('transitionend', onEnd);
        // Trigger the timed move
        cursor.style.left = '400px';
        cursor.style.top = '300px';
        setTimeout(() => {
          if (!resolved) { resolved = true; resolve(null); }
        }, 800);
      });
    });
  });
  log('easing: transitionend fires within 400ms ± 30ms (370 < t < 430)',
      elapsed !== null && elapsed >= 370 && elapsed <= 430,
      `elapsed=${elapsed?.toFixed(0)}ms`);

  // Also verify the computed-style transition matches the new spec.
  // Computed style serializes `400ms` as `0.4s` — match either form.
  const transition = await page.evaluate(() => {
    const c = document.querySelector('#ghostViewModes .demo-cursor');
    return c ? getComputedStyle(c).transition : null;
  });
  const usesEaseOutQuad = transition && transition.includes('0.25, 0.46, 0.45, 0.94');
  const usesCorrectDuration = transition && /(\b400ms\b|\b0\.4s\b)/.test(transition);
  log('easing: computed style uses cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      !!usesEaseOutQuad, transition?.slice(0, 120));
  log('easing: computed style uses 400ms (0.4s)', !!usesCorrectDuration,
      transition?.slice(0, 120));

  await browser.close();
}

/* ====== Run 2: Reduced motion check ====== */
async function runReducedMotion() {
  console.log('\n=== reduced motion ===');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push('console.error: ' + m.text()); });

  await gotoAndScroll(page);
  await sleep(800);

  log('reduced-motion: zero console errors', consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.join(' | ') : '');

  // Wait beyond when the first move would happen if loop were running
  await sleep(2500);

  const state = await page.evaluate(() => {
    const frame = document.getElementById('ghostViewModes');
    const cursor = frame.querySelector('.demo-cursor');
    const active = frame.querySelector('.vm-chip.is-active');
    return {
      cursorPresent: !!cursor,
      activeMode: active ? active.getAttribute('data-vm-mode') : null,
    };
  });
  log('reduced-motion: no cursor mounted', !state.cursorPresent);
  log('reduced-motion: pinned to Slider mode', state.activeMode === 'slider',
      `active=${state.activeMode}`);
  await shotFrame(page, 'desktop-reduced-motion');

  await browser.close();
}

/* ====== Run 3: IntersectionObserver pause/resume ====== */
async function runIOPauseResume() {
  console.log('\n=== IO pause/resume ===');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await gotoAndScroll(page);
  await sleep(500);

  // Let the loop progress for ~3 seconds (we should be at SBS or just after)
  await sleep(3000);
  const beforeMode = await getActiveMode(page);

  // Scroll demo out of viewport
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(2000);

  // Scroll back to demo
  await page.evaluate(() => {
    const el = document.getElementById('ghostViewModes');
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await sleep(500);

  const afterMode = await getActiveMode(page);
  log('IO pause/resume: mode preserved across pause/resume',
      afterMode === beforeMode, `before=${beforeMode} after=${afterMode}`);

  await browser.close();
}

/* ====== Run 4: Resize handling ====== */
async function runResize() {
  console.log('\n=== resize handling ===');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await gotoAndScroll(page);
  await sleep(500);

  // Snapshot pill before resize
  const before = await getPillRect(page);

  // Resize across the mobile breakpoint (1440 → 600 forces mobile @media)
  // so chip widths actually change (font drops from 13px to 11px).
  await page.setViewportSize({ width: 600, height: 700 });
  await sleep(400); // debounce is 150ms; allow extra

  const after = await getPillRect(page);
  const activeChip = await page.evaluate(() => {
    const c = document.querySelector('#ghostViewModes .vm-chip.is-active');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: r.x, width: r.width };
  });

  // Pill should be roughly aligned with active chip (allow some px for the 3px container padding)
  const aligned = after && activeChip &&
                  Math.abs(after.width - activeChip.width) < 6 &&
                  Math.abs(after.x - activeChip.x) < 10;
  log('resize: pill re-aligned with active chip after resize', aligned,
      `pill=${after?.x.toFixed(0)},${after?.width.toFixed(0)} ` +
      `chip=${activeChip?.x.toFixed(0)},${activeChip?.width.toFixed(0)}`);
  log('resize: pill width changed crossing mobile breakpoint',
      before && after && Math.abs(before.width - after.width) > 1,
      `before=${before?.width.toFixed(0)} after=${after?.width.toFixed(0)}`);

  await browser.close();
}

/* ====== Run 5: Mobile loop progression ====== */
async function runMobile() {
  console.log('\n=== mobile loop ===');
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 13']);
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push('console.error: ' + m.text()); });

  await gotoAndScroll(page);
  await sleep(400);

  log('mobile: zero console errors', consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.join(' | ') : '');

  // T~2600 — SBS active
  await sleep(2600);
  const sbsMode = await getActiveMode(page);
  log('mobile T~2600: SBS active', sbsMode === 'side-by-side', `active=${sbsMode}`);
  await shotFrame(page, 'mobile-t2600-sbs');

  // T~7200 — Timeline active (was 8400 before tweak 1)
  await sleep(4600);
  const tlMode = await getActiveMode(page);
  log('mobile T~7200: Timeline active', tlMode === 'timeline', `active=${tlMode}`);
  await shotFrame(page, 'mobile-t7200-timeline');

  await browser.close();
}

/* ====== Run 6: Coexistence with Beat 2 slider ====== */
async function runCoexistence() {
  console.log('\n=== coexistence: Beat 2 slider + Beat 4 view modes ===');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push('console.error: ' + m.text()); });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await sleep(400);

  // Beat 2 slider exists and is interactive
  const beat2 = await page.evaluate(() => {
    const slider = document.querySelector('[data-slider]');
    const handle = slider ? slider.querySelector('[data-handle]') : null;
    return {
      sliderExists: !!slider,
      handleExists: !!handle,
      sliderHasInitialized: slider ? slider.classList.contains('is-initialized') : false,
      ariaValueNow: handle ? handle.getAttribute('aria-valuenow') : null,
    };
  });
  log('coexist: Beat 2 slider mounted', beat2.sliderExists);
  log('coexist: Beat 2 slider handle mounted', beat2.handleExists);
  log('coexist: Beat 2 slider initialized by JS', beat2.sliderHasInitialized);

  // Beat 4 view modes also mounted
  const beat4 = await page.evaluate(() => {
    const frame = document.getElementById('ghostViewModes');
    return {
      frameExists: !!frame,
      pillHasWidth: frame
        ? parseFloat(frame.querySelector('.vm-pill').style.width || '0') > 0
          || parseFloat(getComputedStyle(frame.querySelector('.vm-pill')).width) > 0
        : false,
    };
  });
  log('coexist: Beat 4 view modes mounted', beat4.frameExists);
  log('coexist: Beat 4 pill positioned by JS (width > 0)', beat4.pillHasWidth);

  log('coexist: zero console errors with both demos active', consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.join(' | ') : '');

  await browser.close();
}

(async () => {
  await runDesktopLoop();
  await runEasingTiming();
  await runReducedMotion();
  await runIOPauseResume();
  await runResize();
  await runMobile();
  await runCoexistence();

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
