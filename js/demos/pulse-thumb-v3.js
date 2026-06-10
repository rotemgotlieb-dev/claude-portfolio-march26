/* Pulse Living Observatory thumbnail — v3 (2026-06-09)
 *
 * A multi-instance thumbnail that renders the same DOM in two surfaces
 * (homepage bento + case-study Other Work cards) and choreographs a
 * heatmap-layer materialization on hover (desktop) or autoplay (touch).
 *
 * Design vocabulary mirrors pulse-compose.js:
 *   - 4 wireframe kanban columns (faux tasks)
 *   - friction layer (warm-orange radial blobs, visible at rest)
 *   - rage layer (red SVG circles, scale 0 -> 1 on .is-animating)
 *   - cursor that drifts in from the right edge, parks at center, exits
 *
 * Cross-surface: container-type:inline-size on .plo-stage; CSS container
 * queries handle the smaller Other Work card width without separate markup.
 *
 * Pointer model:
 *   - (hover: hover) and (pointer: fine)  → hover-trigger (mouseenter/leave)
 *   - (hover: none)   or  (pointer: coarse) → autoplay loop on a timer
 *   - prefers-reduced-motion              → JS early-returns; CSS pins end-state
 *
 * LoopObserver gates the autoplay timer so off-screen instances don't tick.
 * Pre-paused guard prevents one wasted frame for below-fold instances.
 *
 * Engine imports kept lean: LoopObserver + prefersReduced. The choreography
 * is entirely CSS (transition + keyframes driven by the .is-animating class)
 * so no Choreography timeline is needed.
 */

import { LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 9000;          // total cycle duration (matches CSS keyframes)
var ANIMATING_HOLD_MS = 8500; // how long .is-animating sits on (mobile only)
var REST_BETWEEN_MS = 500;   // breathing room between cycles (mobile only)

function isHoverCapable() {
  // Hover-capable AND fine pointer — only true desktop / trackpad / pen.
  // Touch screens (even with a connected mouse) report hover:none here.
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function initInstance(stage) {
  if (!stage || stage.__ploInitialized) return;
  stage.__ploInitialized = true;

  // Reduced-motion path: skip JS entirely, CSS handles a static all-visible
  // end-state via @media (prefers-reduced-motion: reduce).
  if (prefersReduced()) {
    stage.classList.add('plo-reduced');
    return;
  }

  // Pre-paused guard (per CLAUDE.md JS-State Classes §): mark as paused
  // BEFORE the LoopObserver fires its first onEnter, so below-the-fold
  // instances don't tick for one frame at parse.
  stage.classList.add('is-paused');

  var hover = isHoverCapable();
  var timerId = null;
  var isInView = false;

  function startAnimating() {
    stage.classList.add('is-animating');
  }
  function stopAnimating() {
    stage.classList.remove('is-animating');
  }

  // ---- HOVER path (desktop) ----
  function attachHoverHandlers() {
    stage.addEventListener('mouseenter', function () {
      if (!isInView) return;        // gated by viewport
      startAnimating();
    });
    stage.addEventListener('mouseleave', function () {
      stopAnimating();
    });
  }

  // ---- AUTOPLAY path (touch / coarse pointer) ----
  function startAutoplayLoop() {
    if (timerId) return;
    // Kick off immediately, then on an interval matching LOOP_MS.
    startAnimating();
    function tick() {
      stopAnimating();
      // brief rest at the seam, then re-trigger
      setTimeout(function () {
        if (isInView && !prefersReduced()) startAnimating();
      }, REST_BETWEEN_MS);
    }
    timerId = setInterval(tick, ANIMATING_HOLD_MS + REST_BETWEEN_MS);
  }
  function stopAutoplayLoop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    stopAnimating();
  }

  if (hover) {
    attachHoverHandlers();
  }

  // ---- LoopObserver: gate playback by viewport + tab visibility ----
  var observer = new LoopObserver({
    element: stage,
    onEnter: function () {
      isInView = true;
      stage.classList.remove('is-paused');
      if (!hover) startAutoplayLoop();
      // hover path: nothing to do; the next mouseenter will animate.
    },
    onExit: function () {
      isInView = false;
      stage.classList.add('is-paused');
      if (!hover) stopAutoplayLoop();
      else stopAnimating();
    }
  });
  observer.start();
}

function initAll() {
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
