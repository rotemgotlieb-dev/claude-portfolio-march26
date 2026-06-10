/* GATE 2 verification for the Ghost View Modes demo (static layout).
   Phase 2 of the autoplay engine session. Throwaway.

   Loads http://localhost:8080/work/ghost.html and runs:
     - desktop 1440x900
     - mobile  iPhone 13 device profile
   For each, scrolls to the View Modes demo, captures a screenshot of
   the initial state (Slider mode active), then toggles each of the 4
   modes via DOM evaluate and captures a screenshot.

   Asserts:
     - Zero console errors on both viewports
     - All 4 .vm-canvas-mode layers exist in DOM
     - The Slider chip starts with .is-active
     - The 4 chips fit on one line at iPhone 13 (no wrap)
     - The Timeline strip exists and scrolls horizontally (scrollWidth > clientWidth)
     - The Mar 1 mini-panel has .vm-mini-panel--current
*/
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const URL = 'http://localhost:8080/work/ghost.html#design-process';
const OUT = path.resolve('.claude/scripts/screenshots');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function log(label, pass, detail) {
  const tag = pass ? 'PASS' : 'FAIL';
  results.push({ label, pass, detail });
  console.log(`[${tag}] ${label}${detail ? ' — ' + detail : ''}`);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runViewport({ name, deviceProfile, viewport }) {
  console.log(`\n=== ${name} ===`);
  const browser = await chromium.launch();
  const context = await browser.newContext(
    deviceProfile ? deviceProfile : { viewport }
  );
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push('console.error: ' + msg.text());
  });

  await page.goto(URL, { waitUntil: 'networkidle' });

  // Scroll into Beat 4 area
  await page.evaluate(() => {
    const el = document.getElementById('ghostViewModes');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await sleep(600);

  log(`${name}: zero console errors at parse`, consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.join(' | ') : '');

  // DOM existence checks
  const dom = await page.evaluate(() => {
    const frame = document.getElementById('ghostViewModes');
    const chips = frame ? frame.querySelectorAll('.vm-chip') : [];
    const modes = frame ? frame.querySelectorAll('.vm-canvas-mode') : [];
    // JS-State Classes compliance: .is-active should NOT ship in static
    // HTML. Initial visible state is established by CSS :not(:has(.is-
    // active)) fallback. Test verifies the user-visible behavior (opacity)
    // not the implementation detail (class).
    const staticIsActiveCount = frame ? frame.querySelectorAll('.is-active').length : -1;
    const modesByOpacity = frame
      ? Array.from(frame.querySelectorAll('.vm-canvas-mode')).map(m => ({
          mode: m.getAttribute('data-vm-canvas'),
          opacity: parseFloat(getComputedStyle(m).opacity),
        }))
      : [];
    const sliderChipColor = frame
      ? getComputedStyle(frame.querySelector('.vm-chip[data-vm-mode="slider"]')).color
      : '';
    const otherChipColor = frame
      ? getComputedStyle(frame.querySelector('.vm-chip[data-vm-mode="overlay"]')).color
      : '';
    return {
      frameExists: !!frame,
      chipCount: chips.length,
      modeCount: modes.length,
      staticIsActiveCount,
      modesByOpacity,
      sliderChipColor,
      otherChipColor,
      currentPanelExists: !!(frame && frame.querySelector('.vm-mini-panel--current')),
    };
  });

  log(`${name}: demo frame mounted`, dom.frameExists);
  log(`${name}: 4 chips rendered`, dom.chipCount === 4, `count=${dom.chipCount}`);
  log(`${name}: 4 canvas modes rendered`, dom.modeCount === 4, `count=${dom.modeCount}`);
  log(`${name}: JS-State compliance — no .is-active in static HTML`,
      dom.staticIsActiveCount === 0, `count=${dom.staticIsActiveCount}`);
  const sliderMode = dom.modesByOpacity.find(m => m.mode === 'slider');
  const others = dom.modesByOpacity.filter(m => m.mode !== 'slider');
  log(`${name}: Slider canvas visible at parse (opacity 1)`,
      sliderMode && sliderMode.opacity === 1, `opacity=${sliderMode?.opacity}`);
  log(`${name}: other canvases invisible at parse (opacity 0)`,
      others.every(m => m.opacity === 0),
      others.map(m => `${m.mode}=${m.opacity}`).join(' '));
  log(`${name}: Slider chip reads as active (darker text) at parse`,
      dom.sliderChipColor !== dom.otherChipColor,
      `slider=${dom.sliderChipColor} other=${dom.otherChipColor}`);
  log(`${name}: Mar 1 mini-panel has --current variant`, dom.currentPanelExists);

  // Chip group fit check — measure toolbar width vs frame body width
  const toolbarFit = await page.evaluate(() => {
    const toolbar = document.querySelector('#ghostViewModes .vm-toolbar');
    const body = document.querySelector('#ghostViewModes .demo-frame-body');
    if (!toolbar || !body) return { fit: false };
    const tRect = toolbar.getBoundingClientRect();
    const bRect = body.getBoundingClientRect();
    return {
      fit: tRect.width <= bRect.width - 8,
      toolbarWidth: tRect.width,
      bodyWidth: bRect.width,
      chips: Array.from(toolbar.querySelectorAll('.vm-chip')).map(c => c.getBoundingClientRect()),
    };
  });
  log(`${name}: chip toolbar fits on one line`, toolbarFit.fit,
      `toolbar=${Math.round(toolbarFit.toolbarWidth)}px body=${Math.round(toolbarFit.bodyWidth)}px`);
  // Confirm chips don't wrap (all chip rects share the same y)
  if (toolbarFit.chips && toolbarFit.chips.length > 1) {
    const tops = toolbarFit.chips.map(r => Math.round(r.top));
    const allSame = tops.every(t => t === tops[0]);
    log(`${name}: chips do not wrap (same y)`, allSame, `tops=${tops.join(',')}`);
  }

  // Timeline strip overflow check
  const timeline = await page.evaluate(() => {
    const strip = document.querySelector('#ghostViewModes .vm-timeline-strip');
    if (!strip) return null;
    return { scrollWidth: strip.scrollWidth, clientWidth: strip.clientWidth };
  });
  log(`${name}: Timeline strip overflows horizontally`,
      timeline && timeline.scrollWidth > timeline.clientWidth + 1,
      `scrollWidth=${timeline.scrollWidth} clientWidth=${timeline.clientWidth}`);

  // Capture initial state
  const frameBox = await page.evaluate(() => {
    const f = document.getElementById('ghostViewModes');
    const r = f.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.screenshot({
    path: path.join(OUT, `phase2-${name}-1-slider.png`),
    clip: { x: Math.max(0, frameBox.x - 8), y: Math.max(0, frameBox.y - 8),
            width: Math.min(2000, frameBox.width + 16),
            height: Math.min(2000, frameBox.height + 16) },
  });

  // Cycle through each mode by toggling .is-active via DOM evaluate
  const modes = ['side-by-side', 'overlay', 'slider', 'timeline'];
  let order = 2; // 1 already captured (slider)
  for (const mode of modes) {
    if (mode === 'slider') continue; // already captured
    await page.evaluate((m) => {
      const frame = document.getElementById('ghostViewModes');
      frame.querySelectorAll('.vm-canvas-mode').forEach(el => el.classList.remove('is-active'));
      frame.querySelectorAll('.vm-chip').forEach(el => el.classList.remove('is-active'));
      frame.querySelector('.vm-canvas-mode[data-vm-canvas="' + m + '"]').classList.add('is-active');
      const chip = frame.querySelector('.vm-chip[data-vm-mode="' + m + '"]');
      chip.classList.add('is-active');
    }, mode);
    await sleep(350);
    await page.screenshot({
      path: path.join(OUT, `phase2-${name}-${order}-${mode}.png`),
      clip: { x: Math.max(0, frameBox.x - 8), y: Math.max(0, frameBox.y - 8),
              width: Math.min(2000, frameBox.width + 16),
              height: Math.min(2000, frameBox.height + 16) },
    });
    order++;
  }

  await browser.close();
}

(async () => {
  await runViewport({
    name: 'desktop',
    viewport: { width: 1440, height: 900 },
  });
  await runViewport({
    name: 'mobile',
    deviceProfile: devices['iPhone 13'],
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
