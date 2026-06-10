const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log('[err]', m.text()); });
  page.on('pageerror', e => console.log('[pageerr]', e.message));
  await page.goto('http://localhost:8080/work/lexisnexis.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')));
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const c = document.querySelector('#lexisPipelineHero');
    if (c) c.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);
  for (let t = 0; t <= 9000; t += 500) {
    const fname = `/tmp/v8-lexis-${String(t).padStart(4,'0')}.png`;
    await page.locator('#lexisPipelineHero').screenshot({ path: fname });
    console.log(`  ${fname}`);
    if (t < 9000) await page.waitForTimeout(500);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(2); });
