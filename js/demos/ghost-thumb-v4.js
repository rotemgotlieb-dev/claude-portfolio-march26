/* Ghost Bento Thumbnail v8 (2026-06-09)
 * ====================================================================
 *
 * Architecture: Choreography timeline drives a custom cursor + sets
 * --gdd-slider-pos in exactly TWO beats (drag-right T=1400, drag-left
 * T=3100). Outside those beats, --gdd-slider-pos is NOT touched, so
 * the slider IS structurally stationary. Slider transform/clip-path
 * have a fixed 1200ms cubic-bezier transition — they only animate when
 * the variable changes, which only happens in those two beats.
 *
 * This enforces the user's "slider only moves when cursor is on it"
 * contract at the architectural level: there is literally no code path
 * that changes the slider position outside the drag beats.
 *
 * Choreography (5500ms loop):
 *   T=0       Cursor (arrow) at start position above-right of handle.
 *             Slider at LEFT. Production layer dominant.
 *   T=400     Cursor moves down-left toward handle (800ms ease-in-out).
 *   T=1200    Cursor reaches handle. Swap SVG arrow → grab-hand.
 *             clickStamp feedback (cursor.is-stamping for 200ms).
 *   T=1400    Drag right: --gdd-slider-pos: 1 (1200ms transition);
 *             cursor moves to handle-right (1200ms, same duration so
 *             they appear locked).
 *   T=2600    Hold at right (500ms — user's "wait half a second").
 *   T=3100    Drag back left: --gdd-slider-pos: 0; cursor moves to
 *             handle-left (1200ms each, locked).
 *   T=4300    Slider arrives at left. Cursor swap grab-hand → arrow.
 *   T=4500    Cursor lifts up (200ms quick).
 *   T=4800    Cursor returns to start position (500ms ease).
 *   T=5300    Held at start. T=5500 == T=0 (seamless loop).
 *
 * Engine imports: Choreography, LoopObserver, prefersReduced.
 *
 * Cursor: custom DOM element managed in this file (NOT the engine's
 * Cursor primitive). Reason: we need to swap SVG state (arrow ↔ hand)
 * which the Cursor primitive's hardcoded arrow SVG doesn't support.
 * Same CSS-transition-on-left/top model as the Cursor primitive though.
 */

import { Choreography, LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 5500;
var DRAG_MS = 1200;
var APPROACH_MS = 800;
var LIFT_MS = 200;
var RETURN_MS = 500;
var GRAB_FEEDBACK_MS = 200;

var ARROW_SVG =
  '<svg viewBox="0 0 16 16" width="100%" height="100%">' +
    '<path d="M2 1.5 L13.5 8.4 L8.2 9.2 L11 14.4 L8.7 15.6 L5.9 10.4 L2 13.6 Z" ' +
          'fill="#1f1d1a" stroke="#fafaf8" stroke-width="0.6" stroke-linejoin="round"/>' +
  '</svg>';
var GRAB_HAND_SVG =
  '<svg viewBox="0 0 18 18" width="100%" height="100%">' +
    '<g fill="#1f1d1a" stroke="#fafaf8" stroke-width="0.5" stroke-linejoin="round">' +
      '<rect x="5" y="6" width="8" height="9" rx="2"/>' +
      '<rect x="5" y="5" width="2.2" height="3" rx="1"/>' +
      '<rect x="7.5" y="3.5" width="2.2" height="4.5" rx="1"/>' +
      '<rect x="10" y="4.2" width="2.2" height="3.8" rx="1"/>' +
      '<rect x="12.5" y="5.5" width="2" height="3" rx="1"/>' +
    '</g>' +
  '</svg>';

function initInstance(stage) {
  if (!stage || stage.__gddInitialized) return;
  stage.__gddInitialized = true;

  if (prefersReduced()) {
    stage.style.setProperty('--gdd-slider-pos', '0.5');
    stage.classList.add('gdd-reduced');
    return;
  }

  var cursor = stage.querySelector('.gdd-cursor');
  var cursorSvgEl = stage.querySelector('.gdd-cursor-svg');
  if (!cursor || !cursorSvgEl) return;

  var positions = {};
  function computePositions() {
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    var leftX = w * 0.08;
    var rightX = w * 0.92;
    var midY = h * 0.50;
    positions.start = { x: w * 0.55, y: h * 0.18 };
    positions.handleLeft = { x: leftX, y: midY };
    positions.handleRight = { x: rightX, y: midY };
    positions.lifted = { x: leftX, y: h * 0.26 };
  }
  computePositions();
  var resizeId = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(computePositions, 100);
  });

  function snapToStart() {
    cursor.style.transition = 'none';
    cursor.style.left = positions.start.x + 'px';
    cursor.style.top = positions.start.y + 'px';
    cursorSvgEl.innerHTML = ARROW_SVG;
    cursor.classList.remove('is-grabbing', 'is-stamping');
    void cursor.offsetWidth;
  }

  function moveCursor(x, y, durationMs) {
    cursor.style.transition =
      'left ' + durationMs + 'ms cubic-bezier(0.77, 0, 0.175, 1), ' +
      'top ' + durationMs + 'ms cubic-bezier(0.77, 0, 0.175, 1)';
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }

  function setCursorSvg(html, grabbing) {
    cursorSvgEl.innerHTML = html;
    if (grabbing) cursor.classList.add('is-grabbing');
    else cursor.classList.remove('is-grabbing');
  }

  function clickStamp() {
    cursor.classList.remove('is-stamping');
    void cursor.offsetWidth;
    cursor.classList.add('is-stamping');
    setTimeout(function () { cursor.classList.remove('is-stamping'); }, GRAB_FEEDBACK_MS);
  }

  function setSliderPos(p) {
    stage.style.setProperty('--gdd-slider-pos', String(p));
  }

  var timeline = [
    { at: 400,  do: function () { moveCursor(positions.handleLeft.x, positions.handleLeft.y, APPROACH_MS); } },
    { at: 1200, do: function () { setCursorSvg(GRAB_HAND_SVG, true); clickStamp(); } },
    { at: 1400, do: function () {
      setSliderPos(1);
      moveCursor(positions.handleRight.x, positions.handleRight.y, DRAG_MS);
    } },
    { at: 3100, do: function () {
      setSliderPos(0);
      moveCursor(positions.handleLeft.x, positions.handleLeft.y, DRAG_MS);
    } },
    { at: 4300, do: function () { setCursorSvg(ARROW_SVG, false); } },
    { at: 4500, do: function () { moveCursor(positions.lifted.x, positions.lifted.y, LIFT_MS); } },
    { at: 4800, do: function () { moveCursor(positions.start.x, positions.start.y, RETURN_MS); } }
  ];

  var choreo = new Choreography({
    timeline: timeline,
    duration: LOOP_MS,
    onReset: function () {
      snapToStart();
      setSliderPos(0);
    }
  });

  var loopTimeoutId = null;
  function startLoop() {
    snapToStart();
    setSliderPos(0);
    requestAnimationFrame(function () {
      choreo.play();
      loopTimeoutId = setTimeout(function loopFn() {
        choreo.reset();
        choreo.play();
        loopTimeoutId = setTimeout(loopFn, LOOP_MS);
      }, LOOP_MS);
    });
  }
  function stopLoop() {
    if (loopTimeoutId) {
      clearTimeout(loopTimeoutId);
      loopTimeoutId = null;
    }
    choreo.pause();
  }

  var observer = new LoopObserver({
    element: stage,
    onEnter: function () { startLoop(); },
    onExit:  function () { stopLoop(); }
  });
  observer.start();
}

var GDD_MARKUP = (
  '<div class="gdd-stage" data-ghost-thumb aria-hidden="true">' +
    '<div class="gdd-halo" aria-hidden="true"></div>' +
    '<div class="gdd-tag gdd-tag--spec">SPEC</div>' +
    '<div class="gdd-tag gdd-tag--diff"><span class="gdd-tag-dot"></span>DIFF</div>' +
    '<div class="gdd-tag gdd-tag--prod">PROD</div>' +
    '<div class="gdd-layer gdd-layer--spec">' +
      '<div class="gdd-nav">' +
        '<span class="gdd-nav-logo"></span>' +
        '<span class="gdd-nav-item"></span>' +
        '<span class="gdd-nav-item"></span>' +
        '<span class="gdd-nav-item"></span>' +
      '</div>' +
      '<div class="gdd-card">' +
        '<span class="gdd-card-title"></span>' +
        '<span class="gdd-card-subtitle"></span>' +
        '<span class="gdd-card-line gdd-card-line--1"></span>' +
        '<span class="gdd-card-line gdd-card-line--2"></span>' +
        '<button class="gdd-card-cta gdd-card-cta--spec"><span class="gdd-card-cta-label"></span></button>' +
      '</div>' +
      '<div class="gdd-sidebar">' +
        '<span class="gdd-sidebar-item"></span>' +
        '<span class="gdd-sidebar-item"></span>' +
        '<span class="gdd-sidebar-item"></span>' +
      '</div>' +
      '<div class="gdd-stats">' +
        '<div class="gdd-stat"><span class="gdd-stat-num"></span><span class="gdd-stat-label"></span></div>' +
        '<div class="gdd-stat"><span class="gdd-stat-num"></span><span class="gdd-stat-label"></span></div>' +
      '</div>' +
    '</div>' +
    '<div class="gdd-layer gdd-layer--prod">' +
      '<div class="gdd-nav">' +
        '<span class="gdd-nav-logo gdd-nav-logo--drift"></span>' +
        '<span class="gdd-nav-item"></span>' +
        '<span class="gdd-nav-item"></span>' +
      '</div>' +
      '<div class="gdd-card">' +
        '<span class="gdd-card-title gdd-card-title--drift"></span>' +
        '<span class="gdd-card-subtitle"></span>' +
        '<span class="gdd-card-line gdd-card-line--1 gdd-card-line--drift"></span>' +
        '<span class="gdd-card-line gdd-card-line--2"></span>' +
        '<button class="gdd-card-cta gdd-card-cta--amber"><span class="gdd-card-cta-label"></span></button>' +
      '</div>' +
      '<div class="gdd-sidebar">' +
        '<span class="gdd-sidebar-item gdd-sidebar-item--drift"></span>' +
        '<span class="gdd-sidebar-item"></span>' +
      '</div>' +
      '<div class="gdd-stats">' +
        '<div class="gdd-stat gdd-stat--amber"><span class="gdd-stat-num"></span><span class="gdd-stat-label"></span></div>' +
        '<div class="gdd-stat"><span class="gdd-stat-num"></span><span class="gdd-stat-label"></span></div>' +
      '</div>' +
    '</div>' +
    '<div class="gdd-slider-line" aria-hidden="true"></div>' +
    '<div class="gdd-slider-handle" aria-hidden="true">' +
      '<span class="gdd-slider-handle-bars"></span>' +
    '</div>' +
    '<div class="gdd-cursor" aria-hidden="true">' +
      '<span class="gdd-cursor-svg"></span>' +
    '</div>' +
  '</div>'
);

function injectIntoWrappers() {
  var wrappers = document.querySelectorAll('.bento-card-thumb.thumb-ghost, .project-thumbnail.thumb-ghost');
  for (var i = 0; i < wrappers.length; i++) {
    var w = wrappers[i];
    if (!w.querySelector('[data-ghost-thumb]')) {
      w.innerHTML = GDD_MARKUP;
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
