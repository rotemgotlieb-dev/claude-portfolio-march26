/* Process page — Green Tests, Broken Pixel loop (2026-06-10)
 * ====================================================================
 * THE SIGNATURE LOOP. Thesis: passing tests are not a working product.
 * A test suite ticks to 116/116, build goes green, everything reads
 * clear. Then a flag snaps onto the compare readout, which says
 * "quiet, 0 issues" while the heat canvas beside it glows hot. The
 * readout was lying. Tests assert existence, not pixels.
 *
 * Pattern B: Choreography timeline + a cancellable count RAF.
 * LoopObserver gate + prefersReduced static end-state.
 * ==================================================================== */
import { Choreography, LoopObserver, prefersReduced } from './_engine/index.js';

var LOOP_MS = 7400;

/* Sample of real Pulse test names. The counter says 116; these six are
 * the visible slice. */
var TEST_ROWS = [
  'scrubber maps time to range',
  'heat peak renders at friction',
  'compare panel mounts in mode',
  'tour advances on next',
  'issue route resolves ISS-002',
  'brief drawer opens on param'
];

function initGreen(stage) {
  if (!stage || stage.__greenInit) return;
  stage.__greenInit = true;

  var rowsWrap = stage.querySelector('[data-gd-rows]');
  var countEl  = stage.querySelector('[data-gd-count]');
  var buildEl  = stage.querySelector('[data-gd-build]');
  var readout  = stage.querySelector('[data-gd-readout]');
  var statusEl = stage.querySelector('[data-gd-status]');
  var flag     = stage.querySelector('[data-gd-flag]');
  if (!rowsWrap || !countEl || !buildEl || !readout || !statusEl || !flag) return;

  /* Build the sample rows once. */
  if (!rowsWrap.childElementCount) {
    for (var i = 0; i < TEST_ROWS.length; i++) {
      var row = document.createElement('div');
      row.className = 'gd-row';
      row.innerHTML =
        '<span class="gd-row-check" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
        '</span>' +
        '<span class="gd-row-name">' + TEST_ROWS[i] + '</span>';
      rowsWrap.appendChild(row);
    }
  }
  var rows = rowsWrap.querySelectorAll('.gd-row');

  var QUIET = 'quiet &middot; 0 issues';
  var LIE = 'contradicts heatmap';

  if (prefersReduced()) {
    /* Static end-state: all green, but the contradiction is flagged. */
    for (var r = 0; r < rows.length; r++) rows[r].classList.add('is-shown');
    countEl.textContent = '116';
    buildEl.classList.add('is-pass');
    stage.classList.add('is-flagged', 'is-contradiction');
    statusEl.innerHTML = LIE;
    return;
  }

  var rafId = null;
  function animateCount(to, ms, done) {
    if (rafId) cancelAnimationFrame(rafId);
    var startVal = parseInt(countEl.textContent, 10) || 0;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms);
      var eased = 1 - Math.pow(1 - p, 3);
      countEl.textContent = Math.round(startVal + (to - startVal) * eased);
      if (p < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
        if (done) done();
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function resetAll() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    for (var i = 0; i < rows.length; i++) rows[i].classList.remove('is-shown');
    countEl.textContent = '0';
    buildEl.classList.remove('is-pass');
    stage.classList.remove('is-allclear', 'is-flagged', 'is-contradiction');
    statusEl.innerHTML = QUIET;
  }

  /* Stagger the row reveals across the first phase. */
  var rowBeats = [];
  for (var k = 0; k < TEST_ROWS.length; k++) {
    (function (idx) {
      rowBeats.push({ at: 300 + idx * 230, do: function () { rows[idx].classList.add('is-shown'); } });
    })(k);
  }

  var timeline = rowBeats.concat([
    { at: 360,  do: function () { animateCount(116, 1900); } },
    /* All green: counter lands, build passes, a brief clear flush. */
    { at: 2300, do: function () { countEl.textContent = '116'; buildEl.classList.add('is-pass'); stage.classList.add('is-allclear'); } },
    /* The catch: flag snaps onto the readout, contradiction revealed. */
    { at: 3400, do: function () {
      stage.classList.remove('is-allclear');
      stage.classList.add('is-flagged');
    } },
    { at: 3760, do: function () {
      stage.classList.add('is-contradiction');
      statusEl.innerHTML = LIE;
    } },
    /* Read hold, then fade back to the lie for the next loop. */
    { at: 5800, do: function () {
      stage.classList.remove('is-flagged', 'is-contradiction');
      statusEl.innerHTML = QUIET;
    } },
    { at: 6200, do: function () {
      for (var i = 0; i < rows.length; i++) rows[i].classList.remove('is-shown');
      buildEl.classList.remove('is-pass');
      countEl.textContent = '0';
    } }
  ]);

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
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  var observer = new LoopObserver({
    element: stage,
    onEnter: function () { startLoop(); },
    onExit: function () { stopLoop(); }
  });
  observer.start();
}

function init() {
  var stage = document.getElementById('greenDemo');
  if (stage) initGreen(stage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
