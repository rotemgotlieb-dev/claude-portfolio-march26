/* Pulse Annotate-Execute (Loop 3, Sprint 3 build, 2026-05-30)

   The centerpiece body demo at the end of the Design Process section.
   Dramatizes Rotem's two-Claude method: he annotates a component
   ("name the component"), Claude Code executes the change, and the
   diagnosis binds to the component identity. Anonymous diagnosis line
   ("Drag target too narrow · 24px") becomes component-attributed
   ("KanbanColumn · Drag target too narrow") — the wedge made visible.

   Sprint spec: .claude/sprint-reports/2026-05-29-pulse-animation-reconception-spec.md §6
   Gesture signature: #5 Annotate-and-delegate (new). Distinct from
   hero #1 on agent, cursor identity, and rhetoric (hero = product
   executing for user; this = designer directing build tool).

   The loop (7000ms):
     - Beat 1: cursor → anonymous diagnosis line, dwell 350ms (notice
       the gap), clickStamp.
     - Beat 2: Popup.show, then typeInto("name the component") at
       Benji's 50ms/char pace (~18 chars → 900ms).
     - Beat 2': 200ms hold, clickStamp on "Add" (annotation commits).
     - Beat 3: .is-executing on root → terminal slides up, code-diff
       visible, spinner spins. CSS owns the transitions.
     - Beat 4b: .is-applied on root → spinner → check, "Applied",
       diagnosis blur-crossfades to bound state. CSS owns it.
     - Beat 6: cursor returns to rest with 770ms SETTLE; Popup.hide.
     - Beat 7: .is-cleanup on root → terminal slides out, diagnosis
       reverts to anonymous. resetAllState at iter N+1 start.

   Cursor + Popup discipline:
     - Cursor traversal: ease-in-out (engine default 440ms)
     - clickStamp at each commit
     - Popup.show: back-out cubic-bezier(0.34, 1.56, 0.64, 1) @ 250ms
     - Popup.typeInto: 50ms/char (Benji pace)
     - SETTLE_MS = 770ms on the loop-seam return

   Timeline (7000ms per spec §6):
   | Beat | T (ms) | Action                                                |
   |------|--------|-------------------------------------------------------|
   |  1A  |    0   | Cursor → diagnosis line (440ms traversal)             |
   |  1A' |  440   | Arrives; hover dwell 350ms (designer notices gap)     |
   |  1B  |  790   | clickStamp; Popup.show (back-out 250ms)               |
   |   2  | 1040   | Popup.typeInto("name the component") @ 50ms/char      |
   |   2' | 1940   | Typing done; 200ms hold; clickStamp commit            |
   |   3  | 2390   | .is-executing on root. Terminal slides up; spinner    |
   |  4a  | 2690   | Spinner continues (CSS animation)                     |
   |  4b  | 3040   | .is-applied on root. Spinner → check; "Applied"       |
   |   5  | 3390   | Diagnosis bind animation (CSS, ~500ms blur-crossfade) |
   |   6  | 3890   | Cursor → rest (770ms SETTLE); Popup.hide              |
   |  6'  | 4660   | At rest; ~1700ms absorption on the bound diagnosis    |
   |   7  | 6360   | .is-cleanup on root. Terminal out; diagnosis reverts. |
   |      |        | Popup destroyed via resetAllState.                    |
   | LOOP | 7000   | resetAllState() → T=0 state                           |

   Engine imports (6): Cursor + Choreography + LoopObserver + Popup
   + getCenterOf + prefersReduced. CSS Block 15 + Block 16 own every
   visual transition (.is-executing, .is-applied, .is-cleanup); no
   blurCrossfade call needed — class toggles are the contract.
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  Popup,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'pulseAnnotateExecute';
const root = document.getElementById(ROOT_ID);
if (root) initAnnotateExecute(root);

function initAnnotateExecute(rootEl) {
  const stage = rootEl.querySelector('.ae-widget-stage');
  const diagnosis = rootEl.querySelector('[data-ae-target]');
  if (!stage || !diagnosis) return;

  const LOOP_DURATION = 7500;
  const SETTLE_MS = 770;
  const ANNOTATION_TEXT = 'name the component';

  /* Reduced-motion: static end-state per spec §6. Caption surface ("name
     the component") shown via the .ae-widget-static-annotation rule in
     styles.css Block 12 + Block 16. CSS @media block also pins the
     diagnosis to its bound state and the terminal to its applied state.
     Early-return prevents the cursor mount and choreography schedule. */
  if (prefersReduced()) return;

  const cursor = new Cursor(stage);
  const popup = new Popup(stage);
  let loopTimer = null;
  let choreo = null;

  /* Rest position: top-left of stage, outside the diagnosis card area.
     Continuous-state seam — cursor settles here at end of iter N,
     stays here for iter N+1 start. */
  function getRestPosition() {
    const center = getCenterOf(diagnosis, stage);
    return { x: Math.max(20, center.x - 200), y: Math.max(20, center.y - 80) };
  }

  /* Popup anchor: just below+right of the diagnosis headline.
     Stage-local coords because Popup container is the stage. */
  function getPopupAnchor() {
    const headline = diagnosis.querySelector('.ae-widget-diagnosis-headline') || diagnosis;
    const r = headline.getBoundingClientRect();
    const cr = stage.getBoundingClientRect();
    return {
      x: Math.max(8, r.left - cr.left + 16),
      y: r.top - cr.top + r.height + 8
    };
  }

  /* Zero-position reset per Single Unified Timeline §4.1 Rule 5.
     Called at iteration start AND on stopLoop defensive cleanup.
     Removes every animation class so iter N+1 starts at T=0 visuals. */
  function resetAllState() {
    rootEl.classList.remove('is-executing', 'is-applied', 'is-cleanup');
    diagnosis.classList.remove('is-hovered');
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
    if (popup.el) {
      popup.el.classList.remove('is-visible');
    }
  }

  /* Build the timeline against the spec §6 table. Absolute T-stamps;
     between beats no motion is queued (true freezes, not easing tails). */
  function buildTimeline() {
    const beats = [];

    // Beat 1A (T=0): cursor → diagnosis line
    beats.push({
      at: 0,
      do: () => {
        const center = getCenterOf(diagnosis, stage);
        diagnosis.classList.add('is-hovered');
        cursor.moveTo(center.x, center.y - 18);
      }
    });

    // Beat 1B (T=790): clickStamp + popup.show
    beats.push({
      at: 790,
      do: () => {
        cursor.clickStamp();
        diagnosis.classList.remove('is-hovered');
        const anchor = getPopupAnchor();
        popup.show({
          x: anchor.x,
          y: anchor.y,
          header: 'Add comment',
          submitLabel: 'Add'
        });
      }
    });

    // Beat 2 (T=1040): popup.typeInto at Benji's 50ms/char pace
    beats.push({
      at: 1040,
      do: () => {
        popup.typeInto(ANNOTATION_TEXT, { charDelay: 50 });
      }
    });

    // Beat 2'a (T=1940): cursor visibly moves to the popup's Add button.
    // Logical-causation + human-pacing rules (learnings.md 2026-05-30):
    // 500ms ease-in-out so the hop reads as deliberate, not glitched.
    beats.push({
      at: 1940,
      do: () => {
        const btn = popup.el && popup.el.querySelector('.demo-comment-popup__btn--submit');
        if (!btn) return;
        const btnRect = btn.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const x = btnRect.left - stageRect.left + btnRect.width / 2;
        const y = btnRect.top - stageRect.top + btnRect.height / 2;
        cursor.moveTo(x, y, { duration: 500 });
      }
    });

    // Beat 2'b (T=2640): cursor arrived at Add at T=2440; held for 200ms
    // hover dwell ("the human is about to click"); now clickStamps.
    beats.push({
      at: 2640,
      do: () => {
        cursor.clickStamp();
        popup.hide();
      }
    });

    // Beat 3 (T=2840): .is-executing on root. Terminal slides up; spinner.
    beats.push({
      at: 2840,
      do: () => {
        rootEl.classList.add('is-executing');
      }
    });

    // Beat 4b (T=3490): .is-applied on root. Spinner → check; "Applied";
    // diagnosis bind + cascading metadata pills + late diff lines run via
    // CSS Block 15 with per-element transition-delay (250 / 500 / 750ms
    // for pills; 350 / 600ms for late diff lines). Last cascade element
    // lands ~T=4520. Cursor settle at T=4340 overlaps the last pill
    // landing, which reads as "the designer's hand leaves as the system
    // finishes the cascade."
    beats.push({
      at: 3490,
      do: () => {
        rootEl.classList.add('is-applied');
      }
    });

    // Beat 6 (T=4340): cursor → rest with 770ms SETTLE.
    beats.push({
      at: 4340,
      do: () => {
        const rest = getRestPosition();
        cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
      }
    });

    // Beat 6' (T=5110): arrive at rest. ~1700ms absorption on the richly
    // anchored card (component identity + 3 metadata pills + 3 diff lines).

    // Beat 7 (T=6810): cleanup. .is-cleanup reverses terminal + diagnosis +
    // pills + late diff lines via CSS Block 15 cleanup rules.
    beats.push({
      at: 6810,
      do: () => {
        rootEl.classList.remove('is-executing', 'is-applied');
        rootEl.classList.add('is-cleanup');
      }
    });
    // Remaining ~690ms until LOOP; resetAllState() at iter N+1 start
    // removes .is-cleanup so transitions are armed for the next pass.

    return beats;
  }

  function ensureCursorAndPopup() {
    if (!cursor.el) {
      cursor.mount();
      const rest = getRestPosition();
      cursor.snapTo(rest.x, rest.y);
      cursor.show();
    }
    if (!popup.el) {
      popup.mount();
    }
  }

  function startLoop() {
    resetAllState();
    ensureCursorAndPopup();
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

  /* IO + tab visibility gate. Pause when out of view; resume from
     captured elapsedMs when back in view. Mirrors D1 + Pivot pattern. */
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
