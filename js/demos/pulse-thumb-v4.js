/* Pulse Bento Thumbnail v8 (2026-06-09)
 * ====================================================================
 *
 * Architecture: ONE JS RAF loop drives a single CSS custom property
 * (--ploh-progress) from 0 → 1 → 0 across a 5500ms cycle. ALL coupled
 * visuals (scrubber handle, cursor, fill, every heat blob opacity) are
 * computed from this single variable via CSS calc(). Desync is
 * structurally impossible because there IS only one number.
 *
 * Why this approach after 7 failed CSS-keyframe iterations:
 *   Previous versions used separate CSS @keyframes for handle vs heat
 *   blobs on shared duration + shared easing. In theory they stay in
 *   lockstep. In practice subtle CSS cascade conflicts (animation-
 *   fill-mode, !important overrides in reduced-motion blocks leaking,
 *   per-element animation-delay micro-drift) repeatedly broke the
 *   coupling. See learnings.md 2026-06-09 retrospective for details.
 *
 * One-driver pattern guarantees: at every animation frame, --ploh-
 * progress has exactly one value. Every dependent property is a calc()
 * over that value. They cannot drift. The "heat at 100% at MAR /
 * 0% at JUL" requirement is literally expressed as `1 - var(--ploh-
 * progress)` and is mathematically guaranteed.
 *
 * Engine imports: LoopObserver + prefersReduced. No Cursor primitive —
 * Pulse cursor decoration is a static SVG that rides the scrubber handle
 * via parent-child transform. No Choreography primitive — single
 * continuous loop, no scripted beat sequence.
 *
 * Class prefix: "ploh-" (Pulse Living Observatory Heatmap). Markup
 * structure inherited from v7 — heat blobs, scrubber, time labels,
 * status dot, EVENTS counter. The visual composition is preserved;
 * only the animation driver changes.
 */

import { LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 5500;

/* Phase map for the scrubber drag cycle.
 * Single-direction ease-in-out cubic interpolation per drag segment.
 * Holds at MAR (0%-8%, 89.1%-100%) and JUL (45.5%-50.9%) are explicit
 * zero-derivative dwells — the snap-pause-snap rhythm at endpoints
 * gives the eye time to read the heat state at each extreme.
 *
 *   0.000 - 0.080 : held at MAR (progress = 0)
 *   0.080 - 0.455 : drag MAR → JUL (progress 0 → 1, eased)
 *   0.455 - 0.509 : held at JUL (progress = 1)
 *   0.509 - 0.891 : drag JUL → MAR (progress 1 → 0, eased)
 *   0.891 - 1.000 : held at MAR (progress = 0)
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computeProgress(elapsedMs) {
  var t = (elapsedMs % LOOP_MS) / LOOP_MS;
  if (t < 0.080) return 0;
  if (t < 0.455) {
    var pUp = (t - 0.080) / (0.455 - 0.080);
    return easeInOutCubic(pUp);
  }
  if (t < 0.509) return 1;
  if (t < 0.891) {
    var pDown = (t - 0.509) / (0.891 - 0.509);
    return 1 - easeInOutCubic(pDown);
  }
  return 0;
}

/* Format integer with comma thousands separator. Tabular-nums on the
 * CSS side keeps the digit columns from jittering. */
function formatCount(n) {
  var s = String(n);
  var out = '';
  for (var i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ',';
    out += s.charAt(i);
  }
  return out;
}

/* Time-seeded counter so each instance + each reload gets a fresh-
 * looking number. Bounded range keeps it in "system has been running a
 * while" sweet spot. */
function seedCounter() {
  return 12000 + Math.floor((Date.now() / 3000) % 2000);
}

function initInstance(stage) {
  if (!stage || stage.__plohInitialized) return;
  stage.__plohInitialized = true;

  /* Reduced-motion path: pin to MAR (progress 0) with full heat. The
   * static frame matches T=0 of the animated loop — communicates the
   * "issues present" starting state without any motion. */
  if (prefersReduced()) {
    stage.style.setProperty('--ploh-progress', '0');
    stage.classList.add('ploh-reduced');
    return;
  }

  stage.style.setProperty('--ploh-progress', '0');

  var rafId = null;
  var loopStart = 0;
  var isPlaying = false;

  function tick() {
    if (!isPlaying) return;
    var elapsed = performance.now() - loopStart;
    var p = computeProgress(elapsed);
    stage.style.setProperty('--ploh-progress', p.toFixed(4));
    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (isPlaying) return;
    isPlaying = true;
    loopStart = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    isPlaying = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* EVENTS counter — decoupled from the master loop. Ticks every
   * 2.2s (non-commensurate with the status-dot's 1.1s pulse so the
   * two ambient signals never phase-lock visibly). Gated by the same
   * LoopObserver so it stops when off-screen. */
  var counterEl = stage.querySelector('.ploh-counter-num');
  var counterValue = seedCounter();
  if (counterEl) counterEl.textContent = formatCount(counterValue);
  var counterIntervalId = null;
  var flashTimeoutId = null;

  function tickCounter() {
    if (!counterEl) return;
    if (prefersReduced()) return; /* OS toggle after load */
    counterValue += 1;
    counterEl.textContent = formatCount(counterValue);
    counterEl.classList.add('is-flash');
    if (flashTimeoutId) clearTimeout(flashTimeoutId);
    flashTimeoutId = setTimeout(function () {
      counterEl.classList.remove('is-flash');
      flashTimeoutId = null;
    }, 200);
  }
  function startCounter() {
    if (counterIntervalId !== null) return;
    counterIntervalId = setInterval(tickCounter, 2200);
  }
  function stopCounter() {
    if (counterIntervalId !== null) {
      clearInterval(counterIntervalId);
      counterIntervalId = null;
    }
    if (flashTimeoutId !== null) {
      clearTimeout(flashTimeoutId);
      flashTimeoutId = null;
    }
    if (counterEl) counterEl.classList.remove('is-flash');
  }

  /* LoopObserver gates BOTH the RAF tick AND the counter on viewport
   * visibility + tab visibility. No off-screen cycles. */
  var observer = new LoopObserver({
    element: stage,
    onEnter: function () {
      startLoop();
      startCounter();
    },
    onExit: function () {
      stopLoop();
      stopCounter();
    }
  });
  observer.start();
}

/* Markup — single source of truth. Injected into any wrapper without
 * an existing [data-pulse-thumb] child. Same structure as v7 (preserves
 * the visual composition that v5.2 established). */
var PLOH_MARKUP = (
  '<div class="thumb-halo thumb-halo--pulse" aria-hidden="true"></div>' +
  '<div class="ploh-stage" data-pulse-thumb aria-hidden="true">' +
    '<div class="ploh-bar"></div>' +
    '<div class="ploh-status" aria-hidden="true">' +
      '<span class="ploh-status-dot"></span>' +
    '</div>' +
    /* Real column labels + count badges (canonical Pulse kanban
     * vocabulary, matching the case-study hero). Authenticity upgrade
     * 2026-06-09: replaces the abstract header bars. */
    '<div class="ploh-grid">' +
      '<div class="ploh-col">' +
        '<span class="ploh-col-head"><span class="ploh-col-name">Backlog</span><span class="ploh-col-count">7</span></span>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:78%"></span></div>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:62%"></span></div>' +
      '</div>' +
      '<div class="ploh-col">' +
        '<span class="ploh-col-head"><span class="ploh-col-name">In Progress</span><span class="ploh-col-count">4</span></span>' +
        '<div class="ploh-task ploh-task--hot"><span class="ploh-task-bar" style="width:84%"></span></div>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:70%"></span></div>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:55%"></span></div>' +
      '</div>' +
      '<div class="ploh-col">' +
        '<span class="ploh-col-head"><span class="ploh-col-name">Review</span><span class="ploh-col-count">3</span></span>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:72%"></span></div>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:60%"></span></div>' +
      '</div>' +
      '<div class="ploh-col">' +
        '<span class="ploh-col-head"><span class="ploh-col-name">Done</span><span class="ploh-col-count">12</span></span>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:65%"></span></div>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:80%"></span></div>' +
        '<div class="ploh-task"><span class="ploh-task-bar" style="width:50%"></span></div>' +
      '</div>' +
    '</div>' +
    '<div class="ploh-heat ploh-heat--friction" aria-hidden="true">' +
      '<div class="ploh-heat-blob ploh-heat-blob--a"></div>' +
      '<div class="ploh-heat-blob ploh-heat-blob--b"></div>' +
      '<div class="ploh-heat-blob ploh-heat-blob--c"></div>' +
      '<div class="ploh-heat-blob ploh-heat-blob--right"></div>' +
    '</div>' +
    '<div class="ploh-heat ploh-heat--rage" aria-hidden="true">' +
      '<div class="ploh-heat-blob ploh-heat-blob--center"></div>' +
      '<div class="ploh-heat-blob ploh-heat-blob--left"></div>' +
      '<div class="ploh-heat-blob ploh-heat-blob--top"></div>' +
    '</div>' +
    '<div class="ploh-scrubber">' +
      '<div class="ploh-scrubber-labels" aria-hidden="true">' +
        '<span class="ploh-scrubber-label">MAR</span>' +
        '<span class="ploh-scrubber-label">APR</span>' +
        '<span class="ploh-scrubber-label">MAY</span>' +
        '<span class="ploh-scrubber-label">JUN</span>' +
        '<span class="ploh-scrubber-label">JUL</span>' +
      '</div>' +
      '<span class="ploh-scrubber-track"></span>' +
      '<span class="ploh-scrubber-ticks">' +
        '<span class="ploh-scrubber-tick"></span>' +
        '<span class="ploh-scrubber-tick"></span>' +
        '<span class="ploh-scrubber-tick"></span>' +
        '<span class="ploh-scrubber-tick"></span>' +
        '<span class="ploh-scrubber-tick"></span>' +
      '</span>' +
      '<span class="ploh-scrubber-fill"></span>' +
      '<span class="ploh-scrubber-handle"></span>' +
      '<div class="ploh-cursor" aria-hidden="true">' +
        '<svg viewBox="0 0 16 16" width="100%" height="100%">' +
          '<path d="M2 1.5 L13.5 8.4 L8.2 9.2 L11 14.4 L8.7 15.6 L5.9 10.4 L2 13.6 Z" ' +
                'fill="#1f1d1a" stroke="#fafaf8" stroke-width="0.6" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
    '</div>' +
  '</div>'
);

function injectIntoWrappers() {
  var wrappers = document.querySelectorAll('.bento-card-thumb.thumb-pulse, .project-thumbnail.thumb-pulse');
  for (var i = 0; i < wrappers.length; i++) {
    var w = wrappers[i];
    if (!w.querySelector('[data-pulse-thumb]')) {
      w.innerHTML = PLOH_MARKUP;
    }
  }
}

function initAll() {
  injectIntoWrappers();
  var stages = document.querySelectorAll('[data-pulse-thumb]');
  for (var i = 0; i < stages.length; i++) {
    initInstance(stages[i]);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
