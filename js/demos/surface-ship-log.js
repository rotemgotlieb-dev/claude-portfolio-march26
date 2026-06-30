/* Surface Labs — Ship Log (the "shipped with discipline" beat)
 * ====================================================================
 * Plays the real maturity story at altitude: six merges land before
 * they were cleared (amber "merged early") -> a revert restores main
 * (the early rows strike out coral) -> the same work re-ships as three
 * clean, consolidated, reviewed PRs (cyan checks). No PR numbers, no
 * reviewer names (discretion); the gesture IS the argument.
 *
 * Timed loop gated by LoopObserver (+ tab visibility). prefersReduced
 * paints the end-state (the three consolidated rows). On-brand Surface
 * chrome, mono, square corners, one cyan + one coral signal.
 */

import { LoopObserver, prefersReduced } from './_engine/index.js';

const ROOT_ID = 'surfaceShipLog';
const LOOP_MS = 7400;

const root = document.getElementById(ROOT_ID);
if (root) initShipLog(root);

function initShipLog(rootEl) {
  const stage = rootEl.querySelector('[data-sl-stage]');
  if (!stage) return;
  const earlyRows = Array.from(rootEl.querySelectorAll('.sl-row'));
  const revert = rootEl.querySelector('[data-sl-revert]');
  const cleanRows = Array.from(rootEl.querySelectorAll('.sl-crow'));

  function clearAll() {
    earlyRows.forEach(r => r.classList.remove('is-in', 'is-struck'));
    if (revert) revert.classList.remove('is-in');
    cleanRows.forEach(r => r.classList.remove('is-in'));
  }

  /* Reduced motion: paint the end-state (three consolidated rows). */
  if (prefersReduced()) {
    rootEl.classList.add('sl-reduced');
    cleanRows.forEach(r => r.classList.add('is-in'));
    return;
  }

  let timers = [];
  let loopTimer = null;
  let playing = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  function runIteration() {
    timers.forEach(clearTimeout); timers = [];
    clearAll();
    // 1. six early merges land (stagger), amber dots
    earlyRows.forEach((r, i) => at(300 + i * 130, () => r.classList.add('is-in')));
    // 2. revert: restore main, strike the early merges coral
    at(1950, () => { if (revert) revert.classList.add('is-in'); earlyRows.forEach(r => r.classList.add('is-struck')); });
    // 3. clear the reverted set (drop is-struck too, or its opacity pins them visible)
    at(3250, () => { earlyRows.forEach(r => r.classList.remove('is-in', 'is-struck')); if (revert) revert.classList.remove('is-in'); });
    // 4. re-ship as three clean consolidated PRs (cyan checks)
    cleanRows.forEach((r, i) => at(3650 + i * 170, () => r.classList.add('is-in')));
    // 5. hold, then fade out for the seam
    at(6550, () => cleanRows.forEach(r => r.classList.remove('is-in')));
    loopTimer = setTimeout(runIteration, LOOP_MS);
  }

  function start() { if (playing) return; playing = true; runIteration(); }
  function stop() {
    playing = false;
    timers.forEach(clearTimeout); timers = [];
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    clearAll();
  }

  const obs = new LoopObserver({ element: rootEl, onEnter: start, onExit: stop });
  obs.start();
}
