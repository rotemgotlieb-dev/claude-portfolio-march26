/* Surface Labs — "Surface Wave" cross-surface thumbnail (Pattern A++)
 * ====================================================================
 * The case-study poster, leaning into the NAME: a tilted 3D plane of
 * dots — a surface — that bleeds past every edge and recedes into a
 * faded horizon, with a wave rippling across it, lifting the dots and
 * sweeping a band of brand colour (cool cyan in the troughs, a warm
 * pivot, then hot coral on the crest). The whole plane gently tilts.
 * On hover the pointer raises its own ripple that radiates out and
 * blends into the ambient wave.
 *
 * One driver: a single RAF advances time; every dot's lift (translateZ),
 * scale, opacity and colour is a pure function of a travelling sine plus
 * an optional pointer ripple, so nothing desyncs and the wave is
 * inherently seamless (periodic, no reset). Motion is compositor
 * transforms + opacity; the only per-frame paint is a colour on the
 * dots. LoopObserver gates to viewport + tab. prefersReduced paints one
 * static frame. Pointer interaction is a desktop progressive enhancement
 * (no hover on touch — the ambient wave still plays).
 *
 * Cross-surface: injected into both the bento card and the Other Work
 * cards (identical impl, multi-instance safe); sizes in cqw so it scales.
 *
 * Class prefix: "sfw-" (SurFace Wave).
 */
import { LoopObserver, prefersReduced } from './_engine/index.js';

var COLS = 14, ROWS = 18;           /* deep grid that recedes endlessly into the horizon */
var WAVES_X = 1.5, WAVES_Y = 1.2;
var SPEED = 0.0016;                 /* wave travel (rad/ms) */
var AMP = 0.044;                    /* lift as a fraction of stage width */
var FADE_ROWS = 8;                  /* far rows dissolve into atmospheric haze (no visible end) */

/* Visible-window remap for the pointer ripple: the plane bleeds well past
   the frame, so map screen coords into the dot grid's visible sub-range
   to keep the ripple under the cursor. */
var VIS_X0 = 0.12, VIS_X1 = 0.88, VIS_Y0 = 0.43, VIS_Y1 = 0.93;

var COOL  = [104, 186, 213];       /* trough — cyan (deepened so it reads on the light bg) */
var MID   = [42, 150, 184];        /* brand cyan #2a9bbb */
var PIVOT = [243, 226, 206];       /* warm light pivot — keeps cyan->coral bright */
var HOT   = [236, 102, 70];        /* crest — coral #EC6646 */

/* pointer ripple — gentle, broad, slow (a soft swell, not sharp rings) */
var P_RAD = 0.42, P_FREQ = 9, P_SPEED = 0.0055, P_STRENGTH = 0.7;

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function mix(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }
function rgb(c) { return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')'; }
function ramp(h) {
  if (h < 0.34) return mix(COOL, MID, h / 0.34);
  if (h < 0.60) return mix(MID, PIVOT, (h - 0.34) / 0.26);
  return mix(PIVOT, HOT, (h - 0.60) / 0.40);
}

function buildMarkup() {
  var dots = '';
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var x = COLS > 1 ? (c / (COLS - 1)) * 100 : 50;
      var y = ROWS > 1 ? (r / (ROWS - 1)) * 100 : 50;
      dots += '<span class="sfw-dot" style="left:' + x.toFixed(3) + '%;top:' + y.toFixed(3) + '%"></span>';
    }
  }
  return (
    '<div class="thumb-halo thumb-halo--surface" aria-hidden="true"></div>' +
    '<div class="sfw-stage" data-surface-thumb aria-hidden="true">' +
      '<div class="sfw-plane">' + dots + '</div>' +
    '</div>' +
    '<div class="sfw-label" aria-hidden="true">' +
      '<span class="sfw-label-eyebrow">Surface Labs</span>' +
      '<span class="sfw-label-hook">From Prompt to Production</span>' +
    '</div>'
  );
}

function applyFrame(dots, plane, stage, t, cur) {
  var W = stage.clientWidth || 300;
  var amp = AMP * W;
  var rx = 52 + Math.sin(t * 0.00045) * 2.5;
  var rz = -2 + Math.sin(t * 0.00072) * 4;
  plane.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateZ(' + rz.toFixed(2) + 'deg)';
  var ps = cur ? cur.strength : 0;
  for (var i = 0; i < dots.length; i++) {
    var c = i % COLS, r = (i / COLS) | 0;
    var nx = c / (COLS - 1), ny = r / (ROWS - 1);
    var phase = nx * Math.PI * 2 * WAVES_X + ny * Math.PI * 2 * WAVES_Y - t * SPEED;
    var h = Math.sin(phase);
    if (ps > 0.002) {
      var dx = nx - cur.x, dy = ny - cur.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      h += ps * P_STRENGTH * Math.cos(dist * P_FREQ - t * P_SPEED) * Math.exp(-(dist * dist) / (P_RAD * P_RAD));
    }
    var hn = clamp((h + 1) / 2, 0, 1);
    var z = h * amp;
    var s = 0.80 + hn * 0.42;
    var depthFade = 0.06 + 0.94 * Math.min(r / FADE_ROWS, 1);   /* back rows dissolve into the horizon */
    var op = (0.66 + hn * 0.34) * depthFade;
    var d = dots[i];
    d.style.transform = 'translate(-50%,-50%) translateZ(' + z.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
    d.style.opacity = op.toFixed(3);
    d.style.backgroundColor = rgb(ramp(hn));
  }
}

function initInstance(stage) {
  if (!stage || stage.__sfwInit) return;
  stage.__sfwInit = true;
  var dots = stage.querySelectorAll('.sfw-dot');
  var plane = stage.querySelector('.sfw-plane');
  var cur = { x: 0.5, y: 0.5, strength: 0, target: 0 };

  if (prefersReduced()) {
    stage.classList.add('sfw-reduced');
    applyFrame(dots, plane, stage, 900, cur);
    return;
  }

  /* pointer ripple (desktop) — record position; ramp strength in/out */
  function onMove(e) {
    var rect = stage.getBoundingClientRect();
    if (!rect.width) return;
    cur.x = VIS_X0 + ((e.clientX - rect.left) / rect.width) * (VIS_X1 - VIS_X0);
    cur.y = VIS_Y0 + ((e.clientY - rect.top) / rect.height) * (VIS_Y1 - VIS_Y0);
    cur.target = 1;
  }
  stage.addEventListener('pointermove', onMove, { passive: true });
  stage.addEventListener('pointerleave', function () { cur.target = 0; });

  var rafId = null, playing = false;
  function tick() {
    if (!playing) return;
    cur.strength += (cur.target - cur.strength) * 0.05;   /* gentle ease in/out */
    applyFrame(dots, plane, stage, performance.now(), cur);
    rafId = requestAnimationFrame(tick);
  }
  function start() { if (playing) return; playing = true; rafId = requestAnimationFrame(tick); }
  function stop() { playing = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

  applyFrame(dots, plane, stage, performance.now(), cur);
  var observer = new LoopObserver({ element: stage, onEnter: start, onExit: stop });
  observer.start();
}

function injectIntoWrappers() {
  var wrappers = document.querySelectorAll('.bento-card-thumb.thumb-surface, .project-thumbnail.thumb-surface');
  for (var i = 0; i < wrappers.length; i++) {
    if (!wrappers[i].querySelector('[data-surface-thumb]')) {
      wrappers[i].innerHTML = buildMarkup();
    }
  }
}

function initAll() {
  injectIntoWrappers();
  var stages = document.querySelectorAll('[data-surface-thumb]');
  for (var i = 0; i < stages.length; i++) initInstance(stages[i]);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
