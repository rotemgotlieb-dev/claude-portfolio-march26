/* v5.1 polish-elevation verification screenshots */
const { chromium } = require('playwright');
const errors = [];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, hasTouch: false, reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') errors.push(`[err] ${m.text()}`); });
  p.on('pageerror', e => errors.push(`[pageerr] ${e.message}`));

  console.log('=== Homepage bento — capturing rest + mid-loop ===');
  await p.goto('http://localhost:8080/index.html', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => sessionStorage.setItem('introShown', '1'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')));
  await p.waitForTimeout(800);
  await p.locator('.bento-card-b').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);

  // Pulse cycle: ~5500ms total
  await p.locator('.bento-card-b').screenshot({ path: '/tmp/v53-pulse-T0.png' });
  console.log('  /tmp/v53-pulse-T0.png');
  await p.waitForTimeout(2500);
  await p.locator('.bento-card-b').screenshot({ path: '/tmp/v53-pulse-T2500.png' });
  console.log('  /tmp/v53-pulse-T2500.png (peak)');
  await p.waitForTimeout(2500);
  await p.locator('.bento-card-b').screenshot({ path: '/tmp/v53-pulse-T5000.png' });
  console.log('  /tmp/v53-pulse-T5000.png (near seam)');

  // Ghost cycle
  await p.locator('.bento-card-d').screenshot({ path: '/tmp/v53-ghost-T0.png' });
  console.log('  /tmp/v53-ghost-T0.png');
  await p.waitForTimeout(2500);
  await p.locator('.bento-card-d').screenshot({ path: '/tmp/v53-ghost-T2500.png' });
  console.log('  /tmp/v53-ghost-T2500.png (peak)');
  await p.waitForTimeout(2500);
  await p.locator('.bento-card-d').screenshot({ path: '/tmp/v53-ghost-T5000.png' });
  console.log('  /tmp/v53-ghost-T5000.png (near seam)');

  // Full bento overview
  await p.locator('.bento-row-top').scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  await p.screenshot({ path: '/tmp/v53-bento-overview.png', clip: { x: 0, y: 0, width: 1440, height: 900 }});
  console.log('  /tmp/v53-bento-overview.png (full bento)');

  // Sibling-dim hover test (hover Pulse, check that others dim)
  await p.locator('.bento-card-b').hover();
  await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/v53-sibling-dim-pulse.png', clip: { x: 0, y: 0, width: 1440, height: 900 }});
  console.log('  /tmp/v53-sibling-dim-pulse.png (Pulse hovered, others should dim)');

  // Cross-surface: Pulse case study Other Work card (Ghost thumb)
  await p.goto('http://localhost:8080/work/pulse.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')));
  await p.waitForTimeout(400);
  await p.locator('.other-work').first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(2500);
  await p.locator('.other-work').first().screenshot({ path: '/tmp/v53-otherwork-pulse-page.png' });
  console.log('  /tmp/v53-otherwork-pulse-page.png');

  console.log('\n=== CONSOLE ===');
  if (errors.length === 0) console.log('  (zero errors)');
  else errors.forEach(e => console.log('  ' + e));

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(2); });
