/* Ghost Bento Thumbnail v9 — Miniature AI Fix Flow (2026-06-10)
 * ====================================================================
 *
 * Drastic rework per Rotem: the previous spec/prod slider thumb read
 * weak next to the case-study page. This version miniaturizes the
 * page's strongest artifact — the AI Fix Flow hero — into the bento
 * slot, reusing its REAL content (deviation rows, Expected/Found
 * swatches, the −1.4:1 delta, Apply fix, the Fixed badge) and its
 * canonical colors (#dc2626/#f97316/#eab308 severity dots, #15803d
 * fixed-green, indigo accents).
 *
 * The 7.2s loop tells Ghost's whole story:
 *   see the deviation -> open it -> Expected vs Found -> Apply fix ->
 *   watch production snap back to spec (swatch recolors, dot goes
 *   green, label strikes through) -> reset -> loop.
 *
 * Engine pattern: Choreography timeline + custom cursor (arrow SVG,
 * clickStamp feedback) + LoopObserver gating + prefersReduced static
 * end-state. JS-injection into .thumb-ghost wrappers (homepage bento +
 * Other Work cards) per the Cross-Surface Thumbnail Consistency Rule.
 *
 * Namespace: gft- (Ghost Fix-flow Thumbnail). Replaces the gdd- build.
 */

import { Choreography, LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 7200;

var ARROW_SVG =
  '<svg viewBox="0 0 16 16" width="100%" height="100%">' +
    '<path d="M2 1.5 L13.5 8.4 L8.2 9.2 L11 14.4 L8.7 15.6 L5.9 10.4 L2 13.6 Z" ' +
          'fill="#1f1d1a" stroke="#fafaf8" stroke-width="0.6" stroke-linejoin="round"/>' +
  '</svg>';

function initInstance(stage) {
  if (!stage || stage.__gftInitialized) return;
  stage.__gftInitialized = true;

  if (prefersReduced()) {
    /* Static end state: panel open, fix applied, row fixed. The thesis
     * (Ghost finds it AND fixes it) reads with zero motion. */
    stage.classList.add('gft-reduced');
    return;
  }

  var row1     = stage.querySelector('.gft-row[data-row="0"]');
  var panel    = stage.querySelector('.gft-panel');
  var applyBtn = stage.querySelector('.gft-apply');
  var progress = stage.querySelector('.gft-progress-fill');
  var cursor   = stage.querySelector('.gft-cursor');
  if (!row1 || !panel || !applyBtn || !cursor) return;

  var positions = {};
  function computePositions() {
    var sr = stage.getBoundingClientRect();
    if (!sr.width) return;
    var rr = row1.getBoundingClientRect();
    var ar = applyBtn.getBoundingClientRect();
    /* Panel hides via translateX(24px); subtract it so the cursor
     * lands on the button's OPEN position. */
    var panelHidden = !panel.classList.contains('is-open');
    var shift = panelHidden ? 24 : 0;
    positions.rest = { x: sr.width * 0.62, y: sr.height * 0.14 };
    positions.row1 = { x: rr.left - sr.left + rr.width * 0.45, y: rr.top - sr.top + rr.height / 2 };
    positions.apply = { x: ar.left - sr.left + ar.width / 2 - shift, y: ar.top - sr.top + ar.height / 2 };
  }
  computePositions();
  var resizeId = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(computePositions, 120);
  });

  function snapCursor(x, y) {
    cursor.style.transition = 'none';
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    void cursor.offsetWidth;
  }
  function moveCursor(x, y, ms) {
    cursor.style.transition =
      'left ' + ms + 'ms cubic-bezier(0.77, 0, 0.175, 1), ' +
      'top ' + ms + 'ms cubic-bezier(0.77, 0, 0.175, 1)';
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }
  function clickStamp() {
    cursor.classList.remove('is-stamping');
    void cursor.offsetWidth;
    cursor.classList.add('is-stamping');
  }

  function resetAll() {
    row1.classList.remove('is-hovered', 'is-clicked', 'is-fixed');
    panel.classList.remove('is-open', 'is-fixed');
    applyBtn.classList.remove('is-pressed');
    if (progress) progress.classList.remove('is-filling');
    cursor.classList.remove('is-stamping');
  }

  var timeline = [
    /* Cursor approaches the first (red, Breaking) deviation row. */
    { at: 500,  do: function () { moveCursor(positions.row1.x, positions.row1.y, 600); } },
    { at: 1100, do: function () { row1.classList.add('is-hovered'); } },
    /* Click: row selects, detail panel slides in. */
    { at: 1300, do: function () {
      clickStamp();
      row1.classList.remove('is-hovered');
      row1.classList.add('is-clicked');
      panel.classList.add('is-open');
    } },
    /* Cursor travels to Apply fix. */
    { at: 2200, do: function () { moveCursor(positions.apply.x, positions.apply.y, 600); } },
    /* Click: apply presses, progress fills. */
    { at: 2950, do: function () {
      clickStamp();
      applyBtn.classList.add('is-pressed');
      if (progress) progress.classList.add('is-filling');
    } },
    /* The fix lands: Found swatch snaps to Expected, badge pops,
     * row dot flips green + label strikes through. */
    { at: 3800, do: function () {
      applyBtn.classList.remove('is-pressed');
      panel.classList.add('is-fixed');
      row1.classList.add('is-fixed');
    } },
    /* Read hold, then the panel closes. */
    { at: 5400, do: function () { panel.classList.remove('is-open'); } },
    /* Cursor returns to rest. */
    { at: 5700, do: function () { moveCursor(positions.rest.x, positions.rest.y, 700); } },
    /* Row state fades back for the seam. */
    { at: 6500, do: function () {
      row1.classList.remove('is-clicked', 'is-fixed');
      panel.classList.remove('is-fixed');
      if (progress) progress.classList.remove('is-filling');
    } }
  ];

  var choreo = new Choreography({ timeline: timeline, duration: LOOP_MS, onReset: resetAll });

  var loopTimerId = null;
  function startLoop() {
    resetAll();
    computePositions();
    snapCursor(positions.rest.x, positions.rest.y);
    requestAnimationFrame(function () {
      choreo.play();
      loopTimerId = setTimeout(function loopFn() {
        choreo.reset();
        choreo.play();
        loopTimerId = setTimeout(loopFn, LOOP_MS);
      }, LOOP_MS);
    });
  }
  function stopLoop() {
    if (loopTimerId) { clearTimeout(loopTimerId); loopTimerId = null; }
    choreo.pause();
  }

  var observer = new LoopObserver({
    element: stage,
    onEnter: function () { startLoop(); },
    onExit:  function () { stopLoop(); }
  });
  observer.start();
}

/* Markup — single source of truth. Content lifted verbatim from the
 * case-study AI Fix Flow hero for cross-surface authenticity. */
var GFT_MARKUP = (
  '<div class="gft-stage" data-ghost-thumb aria-hidden="true">' +
    '<div class="gft-halo" aria-hidden="true"></div>' +
    '<div class="gft-body">' +
      '<div class="gft-list">' +
        '<div class="gft-row" data-row="0">' +
          '<span class="gft-dot gft-dot--red"></span>' +
          '<span class="gft-row-text"><span class="gft-row-label">Color · Table</span><span class="gft-row-meta">#text-secondary</span></span>' +
          '<span class="gft-row-check" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
          '</span>' +
        '</div>' +
        '<div class="gft-row" data-row="1">' +
          '<span class="gft-dot gft-dot--orange"></span>' +
          '<span class="gft-row-text"><span class="gft-row-label">Spacing · Card</span><span class="gft-row-meta">16 &rarr; 12</span></span>' +
        '</div>' +
        '<div class="gft-row" data-row="2">' +
          '<span class="gft-dot gft-dot--yellow"></span>' +
          '<span class="gft-row-text"><span class="gft-row-label">Radius · Button</span><span class="gft-row-meta">8 &rarr; 6</span></span>' +
        '</div>' +
      '</div>' +
      '<div class="gft-panel">' +
        '<div class="gft-panel-head">' +
          '<span class="gft-dot gft-dot--red"></span>' +
          '<span class="gft-panel-title">Color · Table</span>' +
          '<span class="gft-badge gft-badge--breaking">Breaking</span>' +
          '<span class="gft-badge gft-badge--fixed">Fixed</span>' +
        '</div>' +
        '<div class="gft-compare">' +
          '<div class="gft-compare-cell">' +
            '<span class="gft-compare-label">Expected</span>' +
            '<span class="gft-swatch" style="background:#9CA3AF"></span>' +
            '<span class="gft-hex">#9CA3AF</span>' +
          '</div>' +
          '<div class="gft-compare-cell">' +
            '<span class="gft-compare-label">Found</span>' +
            '<span class="gft-swatch gft-swatch--found"></span>' +
            '<span class="gft-hex gft-hex--found">#6B7280</span>' +
          '</div>' +
        '</div>' +
        '<div class="gft-delta">Delta: &minus;1.4:1 contrast</div>' +
        '<button class="gft-apply" type="button" tabindex="-1">' +
          '<span class="gft-apply-label">Apply fix</span>' +
          '<span class="gft-progress"><span class="gft-progress-fill"></span></span>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div class="gft-cursor" aria-hidden="true">' + ARROW_SVG + '</div>' +
  '</div>'
);

function injectIntoWrappers() {
  var wrappers = document.querySelectorAll('.bento-card-thumb.thumb-ghost, .project-thumbnail.thumb-ghost');
  for (var i = 0; i < wrappers.length; i++) {
    var w = wrappers[i];
    if (!w.querySelector('[data-ghost-thumb]')) {
      w.innerHTML = GFT_MARKUP;
    }
  }
}

function initAll() {
  injectIntoWrappers();
  var stages = document.querySelectorAll('[data-ghost-thumb]');
  for (var i = 0; i < stages.length; i++) {
    initInstance(stages[i]);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
