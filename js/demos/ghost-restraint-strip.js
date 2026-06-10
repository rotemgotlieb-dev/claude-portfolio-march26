/* Ghost Restraint Strip (K-A, Key Decisions Loop Sprint, 2026-05-28)

   Body demo inside the Key Decisions section of work/ghost.html, replacing
   the dark static Overlay screenshot. Argues the Key Decisions prose's
   primary claim — "clinical precision — severity color only where it
   carries meaning. Restraint as an active editorial choice."

   Design doc: .claude/sprint-reports/2026-05-28-key-decisions-loop-design.md
   Pattern: designer-process body demo per canonical-motion-spec.md
   Appendix D. The fourth process-loop on the Ghost case study after DP-B,
   OC-E, and the hero AI Fix Flow.

   The decision the loop dramatizes:
     What earns color in Ghost? Per-element editorial judgment, applied
     four times in a row. Text labels lose their severity-tint (didn't
     carry meaning the dot wasn't already carrying). Severity dots keep
     their color (the dot IS the severity signal). Loud → clinical.

   The gesture signature (load-bearing distinctness vs DP-B / OC-E / hero):
     Pointwise property-level edit. Color leaves ONE specific CSS property
     (text color) on a specific element while a SIBLING property (severity
     dot background-color) holds. NOT a whole-element fade (OC-E). NOT a
     picker-driven build (DP-B). NOT an action execution (hero). The viewer
     reads "a hand reaching in and stripping" because the change is
     surgically scoped to one property.

   Cursor discipline (mirrors hero r2.6 + DP-B / OC-E):
     - Ease-in-out traversal (engine default 440ms)
     - clickStamp at each commit (V3 stamping motion)
     - Polyrhythmic dwells 350 / 280 / 240 / 320 ms (decisive →
       questioning → recognising → edge-case-recheck for yellow)
     - True setTimeout-gated freezes between beats
     - SETTLE_MS = 770ms on loop-seam settle
     - Mirror-action seam with explicit cleanup re-tinting text labels
       back to loud state before LOOP
     - Zero-position reset via Choreography.onReset callback

   Continuous-state seam: at T=0 and T=7000 the visual state is identical
   (4 colored text labels + 4 colored dots + cursor at rest). Cleanup beat
   at T=6300 reverses every strip back to loud.

   Engine primitives used: Cursor, Choreography, LoopObserver,
   prefersReduced, getCenterOf. **NO Marker, NO Popup, NO blurCrossfade** —
   the strip gesture is the editorial signature; the dot-holding + text-
   stripping IS the communication. Markers were added in the overnight
   sprint and removed 2026-05-28 (this audit) per user feedback that they
   read as confusing rather than reinforcing. The framing prose above the
   loop ("Color where it carries meaning.") now carries the decision
   legibility that markers were attempting to provide.

   Timeline (7000ms, post-2026-05-28 markers removed):
   | Beat | T (ms)  | Action                                                          |
   |------|---------|-----------------------------------------------------------------|
   |  1A  |    0    | Cursor → "Color Deviation — Table" text (440ms ease-in-out)     |
   |  1A' |  440    | Cursor arrives; hover dwell 350ms (decisive — first edit)       |
   |  1B  |  790    | clickStamp + text strip red → black                             |
   |      |         |   Severity dot STAYS #dc2626                                    |
   |  2A  | 1040    | Cursor → "Spacing — Card padding" text                          |
   |  2A' | 1480    | Hover dwell 280ms (questioning — also stripped?)                |
   |  2B  | 1760    | clickStamp + strip orange → black                               |
   |  3A  | 2010    | Cursor → "Radius — Button corner" text                          |
   |  3A' | 2450    | Hover dwell 240ms (FASTEST — pattern recognised, same severity) |
   |  3B  | 2690    | clickStamp + strip orange → black                               |
   |  4A  | 2940    | Cursor → "Font weight — Caption" text                           |
   |  4A' | 3380    | Hover dwell 320ms (yellow — different severity, brief recheck)  |
   |  4B  | 3700    | clickStamp + strip yellow → black                               |
   |  5   | 3950    | Cursor → rest position above the list (770ms SETTLE)            |
   |  5'  | 4720    | Cursor arrives at rest — TERMINAL ABSORPTION begins             |
   |  --  | 4720    | 1580ms motionless freeze; viewer absorbs clinical end state     |
   |      |         |   (4 black labels + 4 colored dots — restraint applied)         |
   |  6   | 6300    | Cleanup: text labels re-tint to original severity colors        |
   |  --  | 6600    | Cleanup transitions complete; 400ms final freeze                |
   | LOOP | 7000    | Iteration N+1 begins; state matches T=0 exactly                 |
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'ghostRestraintStrip';
const root = document.getElementById(ROOT_ID);
if (root) initRestraintStrip(root);

function initRestraintStrip(rootEl) {
  const canvas = rootEl.querySelector('.kd-widget-canvas');
  const rows = rootEl.querySelectorAll('.kd-widget-deviation-row');
  if (!canvas || rows.length !== 4) return;
  const labels = Array.from(rows).map(r => r.querySelector('.kd-widget-deviation-label'));
  if (labels.some(l => !l)) return;

  const LOOP_DURATION = 7000;
  const SETTLE_MS = 770;
  const CURSOR_TRAVERSAL_MS = 440;

  /* Per-row strip config. Polyrhythmic dwells per V3 §2.3:
       Row 1 (red):    350ms — decisive (first edit; designer evaluates strategy)
       Row 2 (orange): 280ms — questioning ("does this also get stripped?")
       Row 3 (orange): 240ms — fastest (same severity as row 2; pattern recognised)
       Row 4 (yellow): 320ms — slight uptick (different severity; brief recheck) */
  const STRIPS = [
    { rowIdx: 0, severity: 'red',    hoverMs: 350 },
    { rowIdx: 1, severity: 'orange', hoverMs: 280 },
    { rowIdx: 2, severity: 'orange', hoverMs: 240 },
    { rowIdx: 3, severity: 'yellow', hoverMs: 320 }
  ];

  /* Reduced motion path: render the "restraint applied" clinical end state
     statically. All 4 text labels black, all 4 dots in their severity color.
     No cursor, no markers, no choreography. Viewer reads the result without
     motion. (Markers would need DOM mounting at static position; skip the
     mount entirely in reduced-motion — the static text-stripped state is
     sufficient to communicate the argument.) */
  if (prefersReduced()) {
    STRIPS.forEach(s => {
      labels[s.rowIdx].setAttribute('data-text-colored', 'stripped');
    });
    return;
  }

  const cursor = new Cursor(canvas);

  let isFirstIteration = true;
  let loopTimer = null;
  let choreo = null;

  /* Rest position: above the deviation list, slightly off the first row's
     left edge — "ready to start editing" pose. Continuous-state seam:
     cursor settles here at end of iter N, stays here for iter N+1 start. */
  function getRestPosition() {
    const firstRow = rows[0];
    const center = getCenterOf(firstRow, canvas);
    return { x: center.x - 100, y: center.y - 30 };
  }

  function resetAllState() {
    /* Re-tint all 4 text labels to their original severity colors and clear
       any hover / transition residue. Cursor stays at rest position from
       prior iter (continuous-state seam — do NOT reposition cursor). */
    STRIPS.forEach(s => {
      labels[s.rowIdx].setAttribute('data-text-colored', s.severity);
    });
    rows.forEach(r => r.classList.remove('is-hovered'));
    labels.forEach(l => {
      l.style.filter = '';
      l.style.opacity = '';
    });
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
  }

  /* Strip a single label: flip its data-text-colored attribute to "stripped".
     The CSS rule for [data-text-colored="stripped"] sets color: #1A1A1A and
     the existing transition (color 250ms ease-out-snappy) animates the
     change. Severity dot is a SIBLING element, not affected. */
  function stripLabel(label) {
    label.setAttribute('data-text-colored', 'stripped');
  }

  function buildTimeline() {
    const beats = [];
    let t = 0;

    STRIPS.forEach((strip, i) => {
      const row = rows[strip.rowIdx];
      const label = labels[strip.rowIdx];

      // Beat A: cursor → text label
      beats.push({
        at: t,
        do: () => {
          const target = getCenterOf(label, canvas);
          row.classList.add('is-hovered');
          cursor.moveTo(target.x, target.y);
        }
      });
      t += CURSOR_TRAVERSAL_MS;
      t += strip.hoverMs;     // polyrhythmic cognition dwell — the WAIT

      // Beat B: clickStamp + strip (markers removed 2026-05-28 per audit —
      // the dot-holding + text-stripping IS the communication; numbered
      // pins read as confusing rather than reinforcing. The framing prose
      // above the loop now carries decision legibility.)
      beats.push({
        at: t,
        do: () => {
          cursor.clickStamp();
          row.classList.remove('is-hovered');
          stripLabel(label);
        }
      });
      // Inter-pick gap: 250ms — strip animation (250ms) lands as cursor
      // begins traversing to next label. No strict overlap; the cursor
      // dwells briefly on the just-stripped label before leaving.
      t += 250;
    });

    // Final settle: cursor → rest position via SETTLE_MS
    beats.push({
      at: t,
      do: () => {
        const rest = getRestPosition();
        cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
      }
    });
    t += SETTLE_MS;
    /* Terminal absorption freeze begins. No beats scheduled until cleanup.
       Cursor motionless at rest; the 4 stripped labels + 4 colored dots
       hold for the viewer to absorb. */
    t += 1580; // terminal absorption window → t = 6300

    // Cleanup beat: re-tint all 4 labels back to loud state (mirror-action
    // seam at the loop boundary). Markers removed in 2026-05-28 audit, so
    // this is now a pure label re-tint with no marker cleanup needed.
    beats.push({
      at: t,
      do: () => {
        STRIPS.forEach(s => {
          labels[s.rowIdx].setAttribute('data-text-colored', s.severity);
        });
      }
    });
    /* Remaining ~700ms (T=6300 → LOOP=7000): cleanup CSS transitions
       complete (300ms re-tint), then 400ms final freeze with cursor at
       rest before iter N+1 starts. */

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
