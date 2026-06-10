/* Video recording of both thumbs over a 7-second window so I can watch the full loop */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const videoDir = '/tmp/v8-videos';
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch();

  // Pulse capture - large viewport, record 7s
  const ctxP = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 800, height: 700 } }
  });
  const pageP = await ctxP.newPage();
  pageP.on('console', m => { if (m.type() === 'error') console.log('[err]', m.text()); });
  await pageP.goto('http://localhost:8080/index.html');
  await pageP.evaluate(() => sessionStorage.setItem('introShown', '1'));
  await pageP.reload({ waitUntil: 'networkidle' });
  await pageP.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')));
  await pageP.waitForTimeout(500);
  // Scroll Pulse card into center
  await pageP.evaluate(() => {
    const c = document.querySelector('.bento-card-b');
    if (c) c.scrollIntoView({ block: 'center' });
  });
  await pageP.waitForTimeout(7000);
  await pageP.close();
  await ctxP.close();

  // Ghost capture
  const ctxG = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 800, height: 700 } }
  });
  const pageG = await ctxG.newPage();
  pageG.on('console', m => { if (m.type() === 'error') console.log('[err]', m.text()); });
  await pageG.goto('http://localhost:8080/index.html');
  await pageG.evaluate(() => sessionStorage.setItem('introShown', '1'));
  await pageG.reload({ waitUntil: 'networkidle' });
  await pageG.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')));
  await pageG.waitForTimeout(500);
  await pageG.evaluate(() => {
    const c = document.querySelector('.bento-card-d');
    if (c) c.scrollIntoView({ block: 'center' });
  });
  await pageG.waitForTimeout(7000);
  await pageG.close();
  await ctxG.close();

  await browser.close();

  // Also do high-rate snapshot series of each
  const browser2 = await chromium.launch();
  const ctx = await browser2.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8080/index.html');
  await page.evaluate(() => sessionStorage.setItem('introShown', '1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')));
  await page.waitForTimeout(500);

  // Pulse: capture every 500ms for 6 seconds
  console.log('=== Pulse frame series ===');
  for (let t = 0; t <= 6000; t += 500) {
    const fname = `/tmp/v8-videos/pulse-${String(t).padStart(4, '0')}.png`;
    await page.locator('.bento-card-b').screenshot({ path: fname });
    console.log(`  ${fname}`);
    if (t < 6000) await page.waitForTimeout(500);
  }

  console.log('=== Ghost frame series ===');
  for (let t = 0; t <= 6000; t += 500) {
    const fname = `/tmp/v8-videos/ghost-${String(t).padStart(4, '0')}.png`;
    await page.locator('.bento-card-d').screenshot({ path: fname });
    console.log(`  ${fname}`);
    if (t < 6000) await page.waitForTimeout(500);
  }

  await browser2.close();

  const videos = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  console.log('=== Videos written ===');
  videos.forEach(v => console.log('  ' + path.join(videoDir, v)));
})().catch(e => { console.error(e); process.exit(2); });
