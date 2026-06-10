/* Ghost Severity Vocabulary Build (DP-B, Process Loops Sprint, 2026-05-27)

   Body demo at the end of the Design Process section of work/ghost.html.
   Argues HOW Rotem defined Ghost's severity language — cursor as agent,
   build-point-wait rhythm, real Ghost components only.

   Design doc: .claude/sprint-reports/2026-05-27-process-loops-design.md §2.1

   The loop (7000ms):
     - 3 picks: Breaking→red, Critical→orange, Minor→yellow
     - Resolved stays empty (future state, intentional)
     - Each pick = (cursor → legend row, hover, clickStamp + marker + picker,
       cursor → swatch, hover, clickStamp + picker hides + fill cascade)
     - As each legend row is defined, the matching deviation rows below snap
       to their just-defined severity dot (the system reflecting the
       vocabulary in real time)

   Cursor discipline (mirrors hero r2.6):
     - Ease-in-out traversal (engine default 440ms)
     - clickStamp at each click point (V3 stamping motion)
     - Polyrhythmic dwells:
       * Legend-row hovers: 300/350/280 ms (decisive → questioning → fast)
       * Picker-swatch hovers: uniform 200 ms (decisive, the choice is obvious)
     - True setTimeout-gated freezes between beats — NO motion scheduled
       in the gaps. Choreography engine schedules absolute beat timestamps.
     - SETTLE_MS = 770ms on the loop-seam settle

   Build → point → wait per beat:
     - "Build" = prior beat's UI change resolves (or initial state)
     - "Point" = cursor traverses to target (440ms ease-in-out)
     - "Wait" = hover dwell on target. The wait IS the cognition beat —
       polyrhythmic to read as a designer thinking, not a system loading

   Continuous-state seam: mirror-action. Every fill (legend swatch +
   deviation dot) is reversed in the cleanup beat before LOOP. Markers
   disappear. Cursor stays at rest position. T=0 ≡ T=7000.

   Timeline (7000ms):
   | Beat | T (ms)  | Action                                                          |
   |------|---------|-----------------------------------------------------------------|
   |  1A  |    0    | Cursor → Breaking legend row (440ms ease-in-out traversal)      |
   |  1A' |  440    | Cursor arrives; hover dwell 300ms begins                        |
   |  1B  |  740    | clickStamp Breaking + Marker 1 (red) appears + picker opens     |
   |  1C  |  990    | Cursor → red swatch in picker (440ms traversal)                 |
   |  1C' | 1430    | Cursor arrives at red swatch; hover dwell 200ms                 |
   |  1D  | 1630    | clickStamp red + picker hides + legend fills red + Color Dev    |
   |      |         |   row dot fills red                                             |
   |  2A  | 1880    | Cursor → Critical legend row (250ms post-fill absorption + move)|
   |  2A' | 2320    | Cursor arrives; hover dwell 350ms (slightly longer)             |
   |  2B  | 2670    | clickStamp Critical + Marker 2 (orange) + picker opens          |
   |  2C  | 2920    | Cursor → orange swatch                                          |
   |  2C' | 3360    | Cursor arrives; hover dwell 200ms                               |
   |  2D  | 3560    | clickStamp orange + picker hides + legend fills orange +        |
   |      |         |   Spacing + Radius rows cascade (80ms stagger)                  |
   |  3A  | 3810    | Cursor → Minor legend row                                       |
   |  3A' | 4250    | Cursor arrives; hover dwell 280ms (fastest — pattern recognised)|
   |  3B  | 4530    | clickStamp Minor + Marker 3 (yellow) + picker opens             |
   |  3C  | 4780    | Cursor → yellow swatch                                          |
   |  3C' | 5220    | Cursor arrives; hover dwell 200ms                               |
   |  3D  | 5420    | clickStamp yellow + picker hides + legend fills yellow + Font   |
   |      |         |   weight row dot fills yellow                                   |
   |  4   | 5670    | Cursor → rest position (770ms ease-in-out settle)               |
   |  4'  | 6440    | Cursor arrives at rest; 100ms hover freeze                      |
   |  5   | 6540    | Cleanup beat: markers disappear, swatches + dots blur-fade out  |
   |  --  | 6840    | Cleanup transitions complete; 160ms terminal freeze              |
   | LOOP | 7000    | Iteration N+1 begins. State matches T=0 exactly.                |
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  Marker,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'ghostSeverityBuild';
const root = document.getElementById(ROOT_ID);
if (root) initSeverityBuild(root);

function initSeverityBuild(rootEl) {
  const canvas = rootEl.querySelector('.sb-widget-canvas');
  const legendRows = rootEl.querySelectorAll('.sb-widget-legend-row');
  const deviationRows = rootEl.querySelectorAll('.sb-widget-deviation-row');
  const picker = rootEl.querySelector('.sb-widget-picker');
  if (!canvas || legendRows.length !== 4 || deviationRows.length !== 4 || !picker) return;
  const pickerSwatches = picker.querySelectorAll('.sb-widget-picker-swatch');

  const LOOP_DURATION = 7000;
  const SETTLE_MS = 770;
  const CURSOR_TRAVERSAL_MS = 440; // matches CSS .demo-cursor transition

  /* The three picks Rotem makes — Resolved legend slot stays empty
     (future state, not defined in this loop). Each pick has its own
     polyrhythmic dwell to avoid metronomic feel: decisive → questioning
     → pattern-recognised. */
  const PICKS = [
    { key: 'breaking', color: 'red',    legendIdx: 0, legendHoverMs: 300, markerVariant: 'red'    },
    { key: 'critical', color: 'orange', legendIdx: 1, legendHoverMs: 350, markerVariant: 'orange' },
    { key: 'minor',    color: 'yellow', legendIdx: 2, legendHoverMs: 280, markerVariant: 'yellow' }
  ];
  const SWATCH_HOVER_MS = 200; // uniform across picks — the swatch choice is obvious once legend named

  /* Reduced-motion path: skip the loop, render the "language built" end state
     statically. Three legend swatches filled, deviation rows classified,
     Resolved swatch empty. No cursor, no markers, no popups. */
  if (prefersReduced()) {
    PICKS.forEach(p => {
      const sw = legendRows[p.legendIdx].querySelector('.sb-widget-legend-swatch');
      sw.setAttribute('data-swatch', p.color);
      deviationRows.forEach(devRow => {
        if (devRow.dataset.deviationSeverity === p.key) {
          devRow.querySelector('.sb-widget-deviation-dot').setAttribute('data-dot', p.color);
        }
      });
    });
    return;
  }

  // Engine instances — cursor lives on canvas; markers on canvas too
  const cursor = new Cursor(canvas);
  const markers = PICKS.map((p, i) => new Marker(canvas, { number: i + 1, variant: p.markerVariant }));

  let isFirstIteration = true;
  let loopTimer = null;
  let choreo = null;

  /* Rest position: top-left of canvas, above the first legend row.
     Continuous-state seam — cursor settles here at end of iter N, stays
     here for iter N+1 start. */
  function getRestPosition() {
    const firstLegendRow = legendRows[0];
    const center = getCenterOf(firstLegendRow, canvas);
    return { x: center.x - 90, y: center.y - 28 };
  }

  function pickerSwatchEl(color) {
    return picker.querySelector('.sb-widget-picker-swatch[data-color="' + color + '"]');
  }

  /* Position picker beside the legend row. Picker is ~140px wide; if it
     would overflow canvas width on narrow viewports, anchor LEFT of the row
     instead. Top-position centered vertically on the row. */
  function showPickerAt(rowEl) {
    const rowCenter = getCenterOf(rowEl, canvas);
    const rowRect = rowEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const halfRowW = rowRect.width / 2;
    const PICKER_W_APPROX = 150;
    const PICKER_H_APPROX = 64;
    let pickerX = rowCenter.x + halfRowW + 10;
    if (pickerX + PICKER_W_APPROX > canvasRect.width - 10) {
      pickerX = rowCenter.x - halfRowW - PICKER_W_APPROX - 10;
      if (pickerX < 10) pickerX = 10;
    }
    let pickerY = rowCenter.y - PICKER_H_APPROX / 2;
    // Clamp to canvas vertical bounds
    if (pickerY < 8) pickerY = 8;
    if (pickerY + PICKER_H_APPROX > canvasRect.height - 8) {
      pickerY = canvasRect.height - PICKER_H_APPROX - 8;
    }
    picker.style.left = pickerX + 'px';
    picker.style.top = pickerY + 'px';
    picker.setAttribute('data-picker-state', 'visible');
  }

  function hidePicker() {
    picker.setAttribute('data-picker-state', 'hidden');
    pickerSwatches.forEach(sw => sw.classList.remove('is-targeted'));
  }

  /* Fill legend swatch + simultaneously cascade matching deviation row dots.
     The cascade uses 80ms stagger so when multiple deviations share a
     severity (e.g. Spacing + Radius both → Critical), the viewer reads the
     reflection as visibly happening across the list. */
  function applyPick(pick) {
    const legendSwatch = legendRows[pick.legendIdx].querySelector('.sb-widget-legend-swatch');
    legendSwatch.setAttribute('data-swatch', pick.color);
    legendSwatch.classList.add('is-filling');
    setTimeout(() => legendSwatch.classList.remove('is-filling'), 280);

    let cnt = 0;
    deviationRows.forEach(devRow => {
      if (devRow.dataset.deviationSeverity === pick.key) {
        const dot = devRow.querySelector('.sb-widget-deviation-dot');
        const stagger = cnt * 80;
        setTimeout(() => {
          dot.setAttribute('data-dot', pick.color);
          dot.classList.add('is-filling');
          setTimeout(() => dot.classList.remove('is-filling'), 280);
        }, stagger);
        cnt++;
      }
    });
  }

  /* Zero-position reset per Single Unified Timeline §4.1 Rule 5.
     Called at iteration start AND on stopLoop defensive cleanup. */
  function resetAllState() {
    legendRows.forEach(r => {
      r.classList.remove('is-hovered');
      const sw = r.querySelector('.sb-widget-legend-swatch');
      sw.setAttribute('data-swatch', 'empty');
      sw.classList.remove('is-filling');
      sw.style.filter = '';
      sw.style.opacity = '';
    });
    deviationRows.forEach(r => {
      const dot = r.querySelector('.sb-widget-deviation-dot');
      dot.setAttribute('data-dot', 'empty');
      dot.classList.remove('is-filling');
      dot.style.filter = '';
      dot.style.opacity = '';
    });
    hidePicker();
    markers.forEach(m => {
      if (m.el) m.disappear();
    });
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
  }

  /* Build the timeline. Beats are scheduled at absolute T-times via the
     Choreography engine. Between beats: no motion is queued → true freeze. */
  function buildTimeline() {
    const beats = [];
    let t = 0;

    PICKS.forEach((pick, i) => {
      const legendRow = legendRows[pick.legendIdx];

      // Beat A: cursor → legend row
      beats.push({
        at: t,
        do: () => {
          const target = getCenterOf(legendRow, canvas);
          legendRow.classList.add('is-hovered');
          cursor.moveTo(target.x, target.y);
        }
      });
      t += CURSOR_TRAVERSAL_MS;   // cursor arrives
      t += pick.legendHoverMs;    // polyrhythmic hover dwell — the cognition beat

      // Beat B: clickStamp legend + marker + picker opens
      beats.push({
        at: t,
        do: () => {
          cursor.clickStamp();
          legendRow.classList.remove('is-hovered');
          // Marker appears at top-right of legend row, in pick's color
          const rowCenter = getCenterOf(legendRow, canvas);
          const rowRect = legendRow.getBoundingClientRect();
          const halfRowW = rowRect.width / 2;
          if (!markers[i].el) markers[i].mount();
          markers[i].appear({
            x: rowCenter.x + halfRowW - 8,
            y: rowCenter.y - 18
          });
          showPickerAt(legendRow);
        }
      });
      t += 250; // picker-open + cursor-linger absorption beat

      // Beat C: cursor → picker swatch
      const swatchEl = pickerSwatchEl(pick.color);
      beats.push({
        at: t,
        do: () => {
          const target = getCenterOf(swatchEl, canvas);
          swatchEl.classList.add('is-targeted');
          cursor.moveTo(target.x, target.y);
        }
      });
      t += CURSOR_TRAVERSAL_MS;   // cursor arrives at swatch
      t += SWATCH_HOVER_MS;       // 200ms decisive hover

      // Beat D: clickStamp swatch + picker hides + fill cascade
      beats.push({
        at: t,
        do: () => {
          cursor.clickStamp();
          hidePicker();
          applyPick(pick);
        }
      });
      t += 250; // post-fill absorption gap before next pick
    });

    // Settle beat — cursor returns to rest position (770ms SETTLE)
    beats.push({
      at: t,
      do: () => {
        const rest = getRestPosition();
        cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
      }
    });
    t += SETTLE_MS;   // cursor arriving at rest
    t += 100;         // 100ms hover-on-rest freeze (true motionless)

    // Cleanup beat — markers disappear, swatches + dots blur-fade out
    beats.push({
      at: t,
      do: () => {
        markers.forEach(m => m.disappear());
        legendRows.forEach(r => {
          const sw = r.querySelector('.sb-widget-legend-swatch');
          sw.style.filter = 'blur(4px)';
          sw.style.opacity = '0.3';
        });
        deviationRows.forEach(r => {
          const dot = r.querySelector('.sb-widget-deviation-dot');
          dot.style.filter = 'blur(4px)';
          dot.style.opacity = '0.3';
        });
      }
    });
    // Remaining ~160ms until LOOP — cursor still at rest, cleanup transitions
    // complete via CSS, then iter N+1's resetAllState snaps to T=0 state.

    return beats;
  }

  function ensureCursor() {
    if (!cursor.el) {
      cursor.mount();
      const rest = getRestPosition();
      cursor.snapTo(rest.x, rest.y);
      cursor.show();
    }
  }

  function startLoop() {
    resetAllState();
    ensureCursor();
    if (isFirstIteration) {
      isFirstIteration = false;
    }
    // First iter: cursor was just mounted at rest. Subsequent iters: cursor
    // is at rest from prior iter's settle (continuous-state seam).
    const timeline = buildTimeline();
    choreo = new Choreography({
      timeline,
      duration: LOOP_DURATION,
      onReset: resetAllState
    });
    choreo.play();

    loopTimer = setTimeout(() => {
      choreo.reset();
      startLoop();
    }, LOOP_DURATION);
  }

  function stopLoop() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (choreo) choreo.pause();
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => {
      if (choreo && choreo.state === 'paused') {
        const remaining = LOOP_DURATION - choreo.elapsedMs;
        choreo.resume();
        loopTimer = setTimeout(() => {
          choreo.reset();
          startLoop();
        }, Math.max(0, remaining));
      } else {
        startLoop();
      }
    },
    onExit: () => {
      stopLoop();
    }
  });
  observer.start();
}
