/* Process page — The Fork loop (2026-06-10)
 * ====================================================================
 * Pattern B: scripted cursor story (engine Choreography + inline cursor
 * driven by raw eased transitions, per the ghost-thumb pattern).
 *
 * Thesis of the section: every decision is a fork. The AI lays out
 * options with a recommendation; Rotem locks one, sometimes overruling.
 * The loop shows the cursor consider A (the recommendation), B, C, then
 * lock B. A and C dim. The "rec" tag stays on A, dimmed, so the
 * overrule reads.
 *
 * Engine: Choreography timeline + LoopObserver gate + prefersReduced
 * static end-state. Positions are SET only inside beats, so elements
 * are stationary by construction outside them.
 * ==================================================================== */
import { Choreography, LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 6600;

function initFork(stage) {
  if (!stage || stage.__forkInit) return;
  stage.__forkInit = true;

  var optA = stage.querySelector('.fork-opt[data-opt="A"]');
  var optB = stage.querySelector('.fork-opt[data-opt="B"]');
  var optC = stage.querySelector('.fork-opt[data-opt="C"]');
  var cursor = stage.querySelector('.fork-cursor');
  if (!optA || !optB || !optC || !cursor) return;

  if (prefersReduced()) {
    /* Static end-state: B locked, A and C dimmed, cursor parked on B.
     * The thesis (recommendation overruled, one option locked) reads
     * with zero motion. */
    stage.classList.add('is-resolved');
    optB.classList.add('is-locked');
    cursor.classList.add('is-hidden');
    return;
  }

  var pos = {};
  function computePositions() {
    var sr = stage.getBoundingClientRect();
    if (!sr.width) return;
    function centerOf(el, biasX) {
      var r = el.getBoundingClientRect();
      return {
        x: r.left - sr.left + r.width * (biasX == null ? 0.5 : biasX),
        y: r.top - sr.top + r.height / 2
      };
    }
    pos.a = centerOf(optA, 0.5);
    pos.b = centerOf(optB, 0.5);
    pos.c = centerOf(optC, 0.5);
    pos.rest = { x: sr.width * 0.5, y: -28 };
  }
  computePositions();
  var resizeId = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(computePositions, 120);
  });

  function snapCursor(p) {
    if (!p) return;
    cursor.style.transition = 'none';
    cursor.style.left = p.x + 'px';
    cursor.style.top = p.y + 'px';
    void cursor.offsetWidth;
  }
  function moveCursor(p, ms) {
    if (!p) return;
    cursor.style.transition =
      'left ' + ms + 'ms cubic-bezier(0.77, 0, 0.175, 1), ' +
      'top ' + ms + 'ms cubic-bezier(0.77, 0, 0.175, 1)';
    cursor.style.left = p.x + 'px';
    cursor.style.top = p.y + 'px';
  }
  function clickStamp() {
    cursor.classList.remove('is-stamping');
    void cursor.offsetWidth;
    cursor.classList.add('is-stamping');
  }

  function resetAll() {
    stage.classList.remove('is-resolved');
    optA.classList.remove('is-considered', 'is-locked');
    optB.classList.remove('is-considered', 'is-locked');
    optC.classList.remove('is-considered', 'is-locked');
    cursor.classList.remove('is-stamping');
  }

  var timeline = [
    { at: 400,  do: function () { cursor.classList.remove('is-hidden'); moveCursor(pos.a, 560); } },
    { at: 1050, do: function () { optA.classList.add('is-considered'); } },
    { at: 1450, do: function () { optA.classList.remove('is-considered'); moveCursor(pos.b, 500); } },
    { at: 2050, do: function () { optB.classList.add('is-considered'); } },
    { at: 2450, do: function () { optB.classList.remove('is-considered'); moveCursor(pos.c, 500); } },
    { at: 3050, do: function () { optC.classList.add('is-considered'); } },
    /* Return to B and lock it. A keeps its dimmed "rec" tag: overruled. */
    { at: 3450, do: function () { optC.classList.remove('is-considered'); moveCursor(pos.b, 560); } },
    { at: 4100, do: function () {
      clickStamp();
      optB.classList.add('is-locked');
      stage.classList.add('is-resolved');
    } },
    /* Read hold, then cursor lifts away and the choice fades for the seam. */
    { at: 5500, do: function () { moveCursor(pos.rest, 700); } },
    { at: 5900, do: function () {
      stage.classList.remove('is-resolved');
      optB.classList.remove('is-locked');
    } }
  ];

  var choreo = new Choreography({ timeline: timeline, duration: LOOP_MS, onReset: resetAll });

  var loopTimerId = null;
  function startLoop() {
    resetAll();
    computePositions();
    cursor.classList.add('is-hidden');
    snapCursor(pos.rest);
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
    onExit: function () { stopLoop(); }
  });
  observer.start();
}

function init() {
  var stage = document.getElementById('forkDemo');
  if (stage) initFork(stage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
