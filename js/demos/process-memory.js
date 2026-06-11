/* Process page — Memory as a System loop (2026-06-10)
 * ====================================================================
 * Thesis: memory is engineered infrastructure. One bloated file read
 * every session (40k tokens) distills into a lean always-loaded core
 * plus topical rules pulled in on demand, plus a review-only immune
 * checklist. The loop morphs the before state into the after state and
 * back.
 *
 * Pattern A++ orchestrated by a single class toggle: .is-after on the
 * stage drives every coupled transition (before collapses, after fades
 * in) via CSS, so the two states cannot desync. Choreography only
 * toggles the class on a timeline; LoopObserver gates; prefersReduced
 * shows the after state.
 * ==================================================================== */
import { Choreography, LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 6000;
var LINE_COUNT = 14;

function initMemory(stage) {
  if (!stage || stage.__memInit) return;
  stage.__memInit = true;

  var lines = stage.querySelector('.mem-lines');
  if (!lines) return;

  /* Build the faint "many lines" fill once. Widths vary so it reads as
   * prose, not a progress bar. */
  if (!lines.childElementCount) {
    var widths = [92, 78, 86, 64, 90, 73, 81, 58, 88, 70, 84, 66, 79, 52];
    for (var i = 0; i < LINE_COUNT; i++) {
      var ln = document.createElement('span');
      ln.className = 'mem-line';
      ln.style.width = widths[i % widths.length] + '%';
      lines.appendChild(ln);
    }
  }

  if (prefersReduced()) {
    stage.classList.add('is-after');
    return;
  }

  function resetAll() {
    stage.classList.remove('is-after');
  }

  var timeline = [
    /* Hold the before state, then morph to the after state. */
    { at: 1600, do: function () { stage.classList.add('is-after'); } },
    /* Hold the after state, then morph back for a clean seam. */
    { at: 4400, do: function () { stage.classList.remove('is-after'); } }
  ];

  var choreo = new Choreography({ timeline: timeline, duration: LOOP_MS, onReset: resetAll });

  var loopTimerId = null;
  function startLoop() {
    resetAll();
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
  var stage = document.getElementById('memDemo');
  if (stage) initMemory(stage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
