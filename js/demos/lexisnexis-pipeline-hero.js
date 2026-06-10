/* LexisNexis Pipeline Hero — "The Bridge" (2026-06-09)
 * ====================================================================
 *
 * Hero demo for work/lexisnexis.html. Performs the case study's metric
 * ("palette update: full day with 3 people → 30 seconds with 1 designer")
 * by literally executing the design-to-code pipeline in 8 seconds.
 *
 * Choreography (8s loop):
 *   1. Cursor hovers a Figma color token row (primary-500 indigo)
 *   2. Cursor clicks — Figma edit popover opens, hex value updates
 *      from #4F46E5 → #0EA5E9 (indigo → cyan)
 *   3. Pulse dots flow down through the pipeline: JSON → CSS → JS →
 *      Storybook → React
 *   4. Production UI components on the right CASCADE update color
 *      in waterfall (header, button, badge, input, link — 80ms stagger)
 *   5. Bottom timer flashes "0:00:30 → 0:00:00"
 *   6. Held done state, then reset to original color, loop
 *
 * Engine pattern matches ghost-ai-fix-flow-hero.js + pulse-observatory-
 * hero.js: Cursor + Choreography + LoopObserver + prefersReduced.
 */

import {
  Cursor,
  Choreography,
  LoopObserver,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'lexisPipelineHero';
const root = document.getElementById(ROOT_ID);
if (root) initHero(root);

const LOOP_MS = 8400;

function initHero(rootEl) {
  if (prefersReduced()) {
    rootEl.classList.add('lxh-reduced');
    return;
  }

  const container = rootEl.querySelector('.lxh-container');
  if (!container) return;

  /* DOM refs */
  const tokenRow      = container.querySelector('.lxh-token--target');
  const tokenSwatch   = container.querySelector('.lxh-token--target .lxh-token-swatch');
  const tokenHex      = container.querySelector('.lxh-token--target .lxh-token-hex');
  const popover       = container.querySelector('.lxh-popover');
  const popoverSwatch = container.querySelector('.lxh-popover-swatch');
  const popoverHex    = container.querySelector('.lxh-popover-hex');
  const pipelinePulses = container.querySelectorAll('.lxh-pipe-pulse');
  const pipelineNodes  = container.querySelectorAll('.lxh-pipe-node');
  const cascadeEls    = container.querySelectorAll('[data-cascade]');
  const timer         = container.querySelector('.lxh-timer');
  const timerValue    = container.querySelector('.lxh-timer-value');

  const ORIG_HEX = '#4F46E5';
  const NEW_HEX  = '#0EA5E9';

  const cursor = new Cursor(container);
  cursor.mount();

  function resetAll() {
    tokenRow.classList.remove('is-hovered', 'is-clicked');
    popover.classList.remove('is-open');
    pipelinePulses.forEach(p => p.classList.remove('is-pulsing'));
    pipelineNodes.forEach(n => n.classList.remove('is-active', 'is-done'));
    cascadeEls.forEach(el => {
      el.classList.remove('is-updated');
      el.style.removeProperty('--cascade-stagger');
    });
    timer.classList.remove('is-counting', 'is-done');
    if (timerValue) timerValue.textContent = '0:00:30';
    if (tokenSwatch) tokenSwatch.style.background = ORIG_HEX;
    if (tokenHex) tokenHex.textContent = ORIG_HEX;
    if (popoverSwatch) popoverSwatch.style.background = ORIG_HEX;
    if (popoverHex) popoverHex.textContent = ORIG_HEX;
    container.style.setProperty('--lxh-brand', ORIG_HEX);
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
  }

  function getRestPosition() {
    const rect = container.getBoundingClientRect();
    return { x: rect.width * 0.32, y: rect.height * 0.12 };
  }

  function getAnchors() {
    return {
      rest: getRestPosition(),
      token: getCenterOf(tokenRow, container)
    };
  }

  let choreo = null;
  let loopTimerId = null;
  let isFirst = true;

  function buildTimeline() {
    const a = getAnchors();
    return [
      /* T=400 — cursor moves down to token row, adds hover state */
      { at: 400, do: () => {
        cursor.moveTo(a.token.x, a.token.y);
      }},
      /* T=950 — cursor reaches token, hover state */
      { at: 950, do: () => {
        tokenRow.classList.add('is-hovered');
      }},
      /* T=1300 — clickStamp + popover opens with current value */
      { at: 1300, do: () => {
        cursor.clickStamp();
        tokenRow.classList.add('is-clicked');
        popover.classList.add('is-open');
      }},
      /* T=1900 — color value updates in popover + token */
      { at: 1900, do: () => {
        if (popoverSwatch) popoverSwatch.style.background = NEW_HEX;
        if (popoverHex) popoverHex.textContent = NEW_HEX;
        if (tokenSwatch) tokenSwatch.style.background = NEW_HEX;
        if (tokenHex) tokenHex.textContent = NEW_HEX;
        container.style.setProperty('--lxh-brand', NEW_HEX);
      }},
      /* T=2100 — pipeline activates: pulses flow down through nodes */
      { at: 2100, do: () => {
        pipelinePulses.forEach((p, i) => {
          setTimeout(() => p.classList.add('is-pulsing'), i * 140);
        });
        pipelineNodes.forEach((n, i) => {
          setTimeout(() => n.classList.add('is-active'), i * 140 + 80);
        });
      }},
      /* T=2800 — first pulse arrives at production side; cascade starts.
       * Each cascade element gets its own stagger via --cascade-stagger
       * CSS custom property (80ms × index). */
      { at: 2800, do: () => {
        cascadeEls.forEach((el, i) => {
          el.style.setProperty('--cascade-stagger', (i * 90) + 'ms');
          el.classList.add('is-updated');
        });
      }},
      /* T=3200 — pipeline nodes flip to done */
      { at: 3200, do: () => {
        pipelineNodes.forEach(n => {
          n.classList.remove('is-active');
          n.classList.add('is-done');
        });
        popover.classList.remove('is-open');
      }},
      /* T=3500 — timer counts down */
      { at: 3500, do: () => {
        timer.classList.add('is-counting');
        animateTimer();
      }},
      /* T=5400 — held done state */
      { at: 5400, do: () => {
        timer.classList.remove('is-counting');
        timer.classList.add('is-done');
      }},
      /* T=6400 — cursor moves back toward rest, prepare for next loop */
      { at: 6400, do: () => {
        cursor.moveTo(a.rest.x, a.rest.y, { duration: 700 });
      }},
      /* T=7600 — reset state for next iteration */
      { at: 7600, do: () => {
        resetAll();
      }}
    ];
  }

  function animateTimer() {
    /* Tick from 30 → 0 over 1700ms. */
    if (!timerValue) return;
    const startMs = performance.now();
    const durMs = 1700;
    function tick() {
      if (!timer.classList.contains('is-counting')) return;
      const elapsed = performance.now() - startMs;
      const t = Math.min(1, elapsed / durMs);
      const seconds = Math.round(30 * (1 - t));
      timerValue.textContent = '0:00:' + (seconds < 10 ? '0' : '') + seconds;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function play() {
    const timeline = buildTimeline();
    choreo = new Choreography({ timeline, duration: LOOP_MS, onReset: resetAll });
    if (isFirst) {
      const a = getAnchors();
      cursor.el.style.transition = 'none';
      cursor.el.style.left = a.rest.x + 'px';
      cursor.el.style.top = a.rest.y + 'px';
      void cursor.el.offsetWidth;
      isFirst = false;
    }
    choreo.play();
    loopTimerId = setTimeout(play, LOOP_MS);
  }

  function stop() {
    if (loopTimerId) { clearTimeout(loopTimerId); loopTimerId = null; }
    if (choreo) choreo.pause();
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => play(),
    onExit:  () => stop()
  });
  observer.start();
}
