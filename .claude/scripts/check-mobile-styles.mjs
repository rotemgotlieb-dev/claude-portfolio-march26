import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
const context = await browser.newContext(devices['iPhone 13']);
const page = await context.newPage();
await page.goto('http://localhost:8080/work/ghost.html#design-process', { waitUntil: 'networkidle' });
await page.evaluate(() => document.getElementById('ghostViewModes').scrollIntoView({block:'center'}));
await new Promise(r => setTimeout(r, 500));

const styles = await page.evaluate(() => {
  const frame = document.getElementById('ghostViewModes');
  const value = frame.querySelector('.vm-mockup-panel--design .mock-stat-value');
  const card = frame.querySelector('.vm-mockup-panel--design .mock-stat-card');
  const panel = frame.querySelector('.vm-mockup-panel--design');
  const body = frame.querySelector('.demo-frame-body');
  return {
    bodyWidth: body.getBoundingClientRect().width,
    panelWidth: panel.getBoundingClientRect().width,
    cardWidth: card.getBoundingClientRect().width,
    cardComputedPadding: getComputedStyle(card).padding,
    valueComputed: {
      fontSize: getComputedStyle(value).fontSize,
      width: value.getBoundingClientRect().width,
      whiteSpace: getComputedStyle(value).whiteSpace,
      overflow: getComputedStyle(value).overflow,
      textOverflow: getComputedStyle(value).textOverflow,
    },
    valueText: value.textContent,
  };
});
console.log(JSON.stringify(styles, null, 2));
await browser.close();
