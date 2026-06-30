/* Surface Labs — Hero: "typed data object becomes a shipped page"
 * ====================================================================
 * The page thesis performed: a typed data object on the left is what
 * the cursor-as-designer feeds an ASK SURFACE prompt; on Generate, the
 * on-brand Surface marketing page BUILDS ITSELF on the right, section by
 * section (scaleY grow + stat count-up), each section's source data line
 * lighting as it lands. "Designed in code and shipped" is literal.
 *
 * Pattern B (scripted cursor story) wrapping real JS tweens — the
 * pulse-compose hybrid. Engine: Cursor + Choreography + LoopObserver +
 * getCenterOf + prefersReduced. REAL transformation: each section is a
 * real box whose scaleY tweens 0->1 (compositor-only; no reflow, the
 * slots are scaffolded), and the stat numbers count up via RAF — never a
 * crossfade between two pre-made frames.
 *
 * Loop seam: resetAllState() is the first call of every iteration; the
 * cleanup beat reverses the build so T=0 == T=LOOP by construction.
 * Reduced motion: early-return paints the finished page + filled prompt
 * (the whole thesis as one static composition).
 */

import {
  Cursor, Choreography, LoopObserver, getCenterOf, prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'surfaceHero';
const PROMPT_TEXT = 'build the marketing-leaders page';
const LOOP_DURATION = 5800;

const root = document.getElementById(ROOT_ID);
if (root) initHero(root);

function initHero(rootEl) {
  const hero = rootEl.querySelector('.sf-hero');
  const stage = rootEl.querySelector('[data-sf-stage]');
  const promptText = rootEl.querySelector('[data-sf-prompt]');
  const generate = rootEl.querySelector('.sf-hero-generate');
  if (!hero || !stage || !promptText || !generate) return;

  const secs = {
    banner: rootEl.querySelector('[data-sf-sec="banner"]'),
    stats: rootEl.querySelector('[data-sf-sec="stats"]'),
    foot: rootEl.querySelector('[data-sf-sec="foot"]')
  };
  const dataLine = {};
  rootEl.querySelectorAll('[data-sf-dl]').forEach(el => { dataLine[el.getAttribute('data-sf-dl')] = el; });
  const statNums = Array.from(rootEl.querySelectorAll('[data-sf-num]'));

  function fmt(el, n) {
    const pre = el.getAttribute('data-sf-prefix') || '';
    const suf = el.getAttribute('data-sf-suffix') || '';
    return pre + n + suf;
  }
  function statFinal(el) { return fmt(el, parseInt(el.getAttribute('data-sf-num'), 10) || 0); }

  /* Reduced motion: paint the finished page + filled prompt, no loop. */
  if (prefersReduced()) {
    promptText.textContent = PROMPT_TEXT;
    Object.keys(dataLine).forEach(k => dataLine[k].classList.add('is-typed'));
    statNums.forEach(el => { el.textContent = statFinal(el); });
    Object.values(secs).forEach(s => { if (s) { s.style.transform = 'scaleY(1)'; s.style.opacity = '1'; } });
    return;
  }

  const cursor = new Cursor(stage);
  const rafIds = new WeakMap();
  let timers = [];
  let typeTimer = null;
  let choreo = null;
  let loopTimer = null;

  function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }
  function cancelRaf(el) { const id = rafIds.get(el); if (id) cancelAnimationFrame(id); rafIds.delete(el); }
  function later(fn, ms) { const id = setTimeout(fn, ms); timers.push(id); return id; }

  function tweenScale(el, from, to, dur) {
    if (!el) return;
    cancelRaf(el);
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * easeOutQuint(t);
      el.style.transform = 'scaleY(' + v.toFixed(3) + ')';
      el.style.opacity = v.toFixed(3);
      if (t < 1) rafIds.set(el, requestAnimationFrame(tick)); else rafIds.delete(el);
    })(performance.now());
  }

  function countUp(el, dur) {
    cancelRaf(el);
    const target = parseInt(el.getAttribute('data-sf-num'), 10) || 0;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = Math.round(target * easeOutQuint(t));
      el.textContent = fmt(el, v);
      if (t < 1) rafIds.set(el, requestAnimationFrame(tick));
      else { el.textContent = fmt(el, target); rafIds.delete(el); }
    })(performance.now());
  }

  function highlight(key) { if (dataLine[key]) dataLine[key].classList.add('is-typed'); }

  function typeInto(text, charDelay) {
    if (typeTimer) clearTimeout(typeTimer);
    let i = 0;
    promptText.textContent = '';
    (function step() {
      promptText.textContent = text.slice(0, i);
      if (i < text.length) { i++; typeTimer = setTimeout(step, charDelay); }
    })();
  }

  /* Zero-state reset (first call of every iteration). */
  function resetAllState() {
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    timers.forEach(clearTimeout); timers = [];
    promptText.textContent = '';
    hero.classList.remove('is-caret');
    generate.classList.remove('is-pressed');
    Object.keys(dataLine).forEach(k => dataLine[k].classList.remove('is-typed'));
    Object.values(secs).forEach(s => { if (s) { cancelRaf(s); s.style.transform = 'scaleY(0)'; s.style.opacity = '0'; } });
    statNums.forEach(el => { cancelRaf(el); el.textContent = fmt(el, 0); });
  }

  function centerOf(el) { return getCenterOf(el, stage); }
  function restPos() { const c = centerOf(rootEl.querySelector('.sf-hero-prompt')); return { x: c.x - 40, y: c.y }; }

  function buildTimeline() {
    const beats = [];

    beats.push({ at: 0, do: () => {
      hero.classList.add('is-caret');
      const c = centerOf(rootEl.querySelector('.sf-hero-prompt-text'));
      cursor.moveTo(c.x, c.y);
    }});

    beats.push({ at: 520, do: () => { typeInto(PROMPT_TEXT, 42); } });

    // typing ~32 chars * 42 = ~1340ms -> done ~1860
    beats.push({ at: 2000, do: () => {
      hero.classList.remove('is-caret');
      const c = centerOf(generate);
      cursor.moveTo(c.x, c.y, { duration: 500 });
    }});

    beats.push({ at: 2580, do: () => {
      cursor.clickStamp();
      generate.classList.add('is-pressed');
      later(() => generate.classList.remove('is-pressed'), 180);
      // build banner
      highlight('eyebrow'); highlight('title');
      tweenScale(secs.banner, 0, 1, 460);
      // cursor settles away from the page so it doesn't cover the build
      const r = restPos();
      cursor.moveTo(r.x, r.y, { duration: 700 });
    }});

    beats.push({ at: 2840, do: () => {
      highlight('stats');
      tweenScale(secs.stats, 0, 1, 460);
      statNums.forEach(el => countUp(el, 780));
    }});

    beats.push({ at: 3160, do: () => {
      highlight('tag'); highlight('cta');
      tweenScale(secs.foot, 0, 1, 460);
    }});

    // payoff hold, then cleanup
    beats.push({ at: 5000, do: () => {
      tweenScale(secs.foot, 1, 0, 420);
      tweenScale(secs.stats, 1, 0, 420);
      tweenScale(secs.banner, 1, 0, 420);
      Object.keys(dataLine).forEach(k => dataLine[k].classList.remove('is-typed'));
      statNums.forEach(el => countUpDown(el, 380));
      promptText.textContent = '';
    }});

    return beats;
  }

  function countUpDown(el, dur) {
    cancelRaf(el);
    const fromN = parseInt((el.textContent || '0').replace(/[^0-9]/g, ''), 10) || 0;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = Math.round(fromN * (1 - easeOutQuint(t)));
      el.textContent = fmt(el, v);
      if (t < 1) rafIds.set(el, requestAnimationFrame(tick));
      else { el.textContent = fmt(el, 0); rafIds.delete(el); }
    })(performance.now());
  }

  function startLoop() {
    resetAllState();
    if (!cursor.el) { cursor.mount(); const r = restPos(); cursor.snapTo(r.x, r.y); cursor.show(); }
    choreo = new Choreography({ timeline: buildTimeline(), duration: LOOP_DURATION, onReset: resetAllState });
    choreo.play();
    loopTimer = setTimeout(() => { choreo.reset(); startLoop(); }, LOOP_DURATION);
  }

  function stopLoop() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (choreo) choreo.pause();
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => { if (!choreo || choreo.state !== 'paused') startLoop(); else choreo.resume(); },
    onExit: () => { stopLoop(); }
  });
  observer.start();
}
