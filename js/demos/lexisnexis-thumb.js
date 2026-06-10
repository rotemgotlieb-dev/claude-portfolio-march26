/* LexisNexis Bento Thumbnail — "Token Snap" (2026-06-10)
 * ====================================================================
 *
 * Chaos snapping into order: 24 color chips (the real LexisNexis
 * ramps) drift in two loose, mismatched clusters — two design systems
 * — then magnetize into a single ordered 6x4 token grid, sorted by hue
 * per row and light-to-dark per column. A stamp lands: ONE SOURCE ·
 * 180+ TOKENS. Hold, release back to scatter, loop.
 *
 * This executes the design intent pre-sanctioned in CLAUDE.md FUTURE
 * HOVER ENHANCEMENTS ("LexisNexis: chaotic nodes snapping into a
 * perfect grid") and tells the case study's core story (two
 * disconnected systems unified into one token architecture) with zero
 * prose. Deliberately the only chrome-free, cursor-free thumbnail on
 * the grid — the lead project reads as its own species.
 *
 * Architecture: ONE JS RAF loop owns the 6.5s cycle. Per-chip position
 * is interpolated between JS-measured scatter and grid coordinates
 * (pixel-precise per the Loop Seam rule — no percentage transforms).
 * Each chip gets a 40ms stagger on snap and a different (hashed)
 * stagger on release so the dissolve doesn't read as a rewind. A
 * subtle sine drift, scaled by (1 - progress), keeps the scatter state
 * alive and fades to zero as chips lock in.
 *
 * Loop phases (6500ms):
 *   0    -  600   scatter idle (drift only)
 *   600  - 2200   snap to grid (40ms stagger, ease-in-out per chip)
 *   2200 - 2600   stamp fades in
 *   2600 - 4200   ordered hold
 *   4200 - 5800   release to scatter (hashed stagger)
 *   5800 - 6500   scatter hold — seam (T=6500 == T=0 by construction:
 *                 scatter coords are constants, drift is time-continuous)
 *
 * Engine imports: LoopObserver + prefersReduced.
 * Reduced-motion: chips pinned at grid positions + stamp visible (the
 * ordered state IS the thesis — strictly better than the old PNG).
 *
 * Cross-surface: injects into .bento-card-thumb.thumb-lexisnexis
 * (homepage) AND .project-thumbnail.thumb-lexisnexis (Other Work
 * cards) per the Cross-Surface Thumbnail Consistency Rule.
 */

import { LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 6500;
var SNAP_START = 600;
var SNAP_STAGGER = 40;
var SNAP_DUR = 640;
var RELEASE_START = 4200;
var RELEASE_DUR = 640;

/* The real LexisNexis ramps (4 hues x 6 steps, light -> dark). */
var RAMPS = [
  ['#FBDADA', '#F4A9A9', '#E96666', '#C70E15', '#8E0A0F', '#5A0608'],
  ['#D6EBF7', '#A8D4EE', '#5FA8D8', '#0077C8', '#005590', '#003158'],
  ['#F2F1EE', '#D8D6D1', '#B5B2AC', '#8A8782', '#666666', '#2E2E2C'],
  ['#DDF0DD', '#A9DCA9', '#6FC36F', '#2CA02C', '#1F7A1F', '#124712']
];
var COLS = 6;
var ROWS = 4;
var N = COLS * ROWS;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* Deterministic pseudo-random in [0,1) from an integer — scatter must
 * be identical every loop iteration for the seam to hold. */
function hash01(i, salt) {
  var x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function initInstance(wrapper) {
  if (!wrapper || wrapper.__lxsInitialized) return;
  wrapper.__lxsInitialized = true;

  /* Build DOM: stage + 24 chips + stamp. */
  var stage = document.createElement('div');
  stage.className = 'lxs-stage';
  stage.setAttribute('aria-hidden', 'true');
  var chips = [];
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var chip = document.createElement('span');
      chip.className = 'lxs-chip';
      chip.style.background = RAMPS[r][c];
      stage.appendChild(chip);
      chips.push(chip);
    }
  }
  var stamp = document.createElement('span');
  stamp.className = 'lxs-stamp';
  stamp.textContent = 'ONE SOURCE · 180+ TOKENS';
  stage.appendChild(stamp);
  wrapper.appendChild(stage);

  /* Geometry: grid + scatter coordinates, JS-measured, recomputed on
   * resize (pixel-precise per Loop Seam rule). */
  var geo = { grid: [], scatter: [], chipW: 0, chipH: 0 };

  function computeGeometry() {
    var W = stage.clientWidth;
    var H = stage.clientHeight;
    if (!W || !H) return;
    var padX = W * 0.10;
    var padTop = H * 0.12;
    var padBottom = H * 0.24; /* room for the stamp */
    var gap = Math.max(4, W * 0.012);
    var chipW = (W - padX * 2 - gap * (COLS - 1)) / COLS;
    var chipH = (H - padTop - padBottom - gap * (ROWS - 1)) / ROWS;
    geo.chipW = chipW;
    geo.chipH = chipH;
    geo.grid = [];
    geo.scatter = [];
    for (var i = 0; i < N; i++) {
      var row = Math.floor(i / COLS);
      var col = i % COLS;
      geo.grid.push({
        x: padX + col * (chipW + gap),
        y: padTop + row * (chipH + gap)
      });
      /* Two loose clusters — left system + right system. Deterministic
       * per chip index so the loop seam holds across iterations. */
      var leftCluster = i % 2 === 0;
      var cx = leftCluster ? W * 0.26 : W * 0.72;
      var cy = H * 0.46;
      var spreadX = W * 0.20;
      var spreadY = H * 0.34;
      geo.scatter.push({
        x: cx + (hash01(i, 1) - 0.5) * 2 * spreadX - chipW / 2,
        y: cy + (hash01(i, 2) - 0.5) * 2 * spreadY - chipH / 2
      });
    }
    chips.forEach(function (chip) {
      chip.style.width = chipW + 'px';
      chip.style.height = chipH + 'px';
    });
  }
  computeGeometry();
  var resizeId = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(computeGeometry, 120);
  });

  /* Reduced-motion: pin the ordered grid + stamp. The settled state is
   * the thesis; no animation runs. */
  if (prefersReduced()) {
    requestAnimationFrame(function () {
      computeGeometry();
      chips.forEach(function (chip, i) {
        var g = geo.grid[i];
        chip.style.transform = 'translate3d(' + g.x + 'px,' + g.y + 'px,0)';
      });
      stamp.classList.add('is-visible');
    });
    return;
  }

  /* Per-chip schedules. Snap in reading order; release in hashed order
   * so the dissolve reads as dissolve, not rewind. */
  var releaseOrder = [];
  for (var i = 0; i < N; i++) releaseOrder.push((i * 7 + 3) % N);

  function chipProgress(i, t) {
    var snapAt = SNAP_START + i * SNAP_STAGGER;
    var relAt = RELEASE_START + releaseOrder[i] * SNAP_STAGGER;
    if (t < snapAt) return 0;
    if (t < snapAt + SNAP_DUR) return easeInOutCubic((t - snapAt) / SNAP_DUR);
    if (t < relAt) return 1;
    if (t < relAt + RELEASE_DUR) return 1 - easeInOutCubic((t - relAt) / RELEASE_DUR);
    return 0;
  }

  var rafId = null;
  var loopStart = 0;
  var isPlaying = false;

  function tick(now) {
    if (!isPlaying) return;
    var t = (now - loopStart) % LOOP_MS;
    var absT = now; /* continuous time for drift (no seam dependence) */
    for (var i = 0; i < N; i++) {
      var p = chipProgress(i, t);
      var s = geo.scatter[i];
      var g = geo.grid[i];
      var idle = 1 - p;
      var dx = Math.sin(absT / 900 + i * 1.7) * 3 * idle;
      var dy = Math.cos(absT / 1100 + i * 2.3) * 2.5 * idle;
      var x = s.x + (g.x - s.x) * p + dx;
      var y = s.y + (g.y - s.y) * p + dy;
      chips[i].style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }
    /* Stamp: in at 2200-2500, out at 4200-4500. Class toggles are
     * cheap; CSS owns the fade. */
    if (t >= 2200 && t < 4200) stamp.classList.add('is-visible');
    else stamp.classList.remove('is-visible');
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (isPlaying) return;
    isPlaying = true;
    computeGeometry();
    loopStart = performance.now();
    rafId = requestAnimationFrame(tick);
  }
  function stop() {
    isPlaying = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  var observer = new LoopObserver({
    element: wrapper,
    onEnter: function () { start(); },
    onExit: function () { stop(); }
  });
  observer.start();
}

function initAll() {
  var wrappers = document.querySelectorAll('.bento-card-thumb.thumb-lexisnexis, .project-thumbnail.thumb-lexisnexis');
  for (var i = 0; i < wrappers.length; i++) {
    /* Clear any legacy static content (the old PNG) before injecting. */
    if (!wrappers[i].querySelector('.lxs-stage')) {
      wrappers[i].innerHTML = '';
      initInstance(wrappers[i]);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
