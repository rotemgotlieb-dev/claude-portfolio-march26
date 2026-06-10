/* Ghost AI Fix Flow — hero demo choreography (V3 recalibration r2.6, 2026-05-27)

   V3 recalibration round 2.6 — two mid-loop pre-click hovers compressed
   per user direction (conservative interpretation). User feedback: end-
   of-loop discipline (r2.5) is correct, but mid-loop pre-click hovers
   still too long. Hero now 7.19s desktop / 5.99s mobile (was 7.47/6.27).

   r2.5 → r2.6 changes:
     - Beat 2b clickStamp first-row: T=1300 → T=1160 (-140ms). User-flagged
       pre-click hover at start of new iter compressed (conservative cut —
       user acknowledged Beat 2b's full pre-click hover is much longer than
       initially estimated; chose this conservative path for visual review).
     - Beat 5 clickStamp Apply: T=3700 → T=3420 (-280ms cumulative: -140 from
       Beat 2b cascade, -140 from own pre-click hover cut). Cursor arrives
       at Apply T=3300; clickStamp T=3420 = 120ms pre-click hover ✓
     - All beats 3, 4, 6a/b/c, 7, 8, 9a, 9b, 10, 10b shift -280ms cumulative.
     - LOOP_DURATION: 7470 → 7190 desktop / 6270 → 5990 mobile (-280ms each).

   r2.4 → r2.5 changes (preserved):
     - CSS `.demo-cursor` transition left/top: 400ms → 440ms (+10% global
       cursor slowdown applies to Beats 2a, 4, 9a — every standard move).
     - SETTLE_MS: 700ms → 770ms (+10% on the Beat 10 settling move).
     - X freeze: 400ms → 250ms (Beat 10 shifts T=6600 → T=6450).
     - Row freeze: 150ms → 250ms (terminal hover before LOOP, Beat 10b
       shifts T=7300 → T=7220 because cursor now arrives 80ms earlier
       despite 70ms slower travel — net effect of -150ms X shift + +70ms
       travel = -80ms arrival shift).
     - LOOP_DURATION: 7450 → 7470 desktop / 6250 → 6270 mobile (+20ms net).
   Per-move +10% slowdown shows up as compressed post-move hover dwells
   (Beat 4→5 hover 300→260ms; Beat 9a→9b hover 200→160ms), not as overall
   loop expansion. User decision (resolved Q): "Trust the math — LOOP=7470."

   r2.2 → r2.3 changes (hover-tuning, kept):
     - Beat 10 (cursor → row) shifts from T=6300 → T=6450 desktop
       (T=5100 → T=5250 mobile). 250ms linger on X after click before move.
     - Beat 10b (add is-hovered to row) shifts from T=7000 → T=7150 desktop
       (T=5800 → T=5950 mobile). Cursor still settles on row 700ms after
       Beat 10 fires; just shifted 150ms later.
     - Terminal hover on row reduced 1000ms → 250ms (the 250ms linger on X
       earlier already gave the natural anticipation beat).
     - LOOP_DURATION: 8000 → 7400 desktop / 6800 → 6200 mobile (-600ms each).

   r2.1 → r2.2 changes (hover-fix, kept):
     - Cursor's rest position changes from {y - 28} (above row) to {y} (ON row)
     - New Beat 10b at T=7000+MOBILE_DELTA adds is-hovered to firstRow when
       settling completes — row shows hover state during the terminal dwell
     - Terminal dwell extended 600ms → 1000ms (proper anticipation moment
       before the next iteration's click)
     - LOOP_DURATION: 7600 → 8000 desktop / 6400 → 6800 mobile (+400ms)
     - startLoop adds is-hovered to firstRow after resetAllState — covers the
       loop-boundary flicker case (cursor on row but hover class removed
       by reset) and the first-iteration case (cursor snapped to row)

   r2 → r2.1 changes (terminal-dwell cut, kept):
     - MOBILE_DELTA = -1200ms on Beats 9a/9b/10 to fit mobile within LOOP.

   r2 cuts (preserved in r2.1):
   | Dead zone           | Was (V3 r1) | Now (r2.1) | V3 §2.3 classification |
   |---------------------|-------------|------------|------------------------|
   | Beat 3 → Beat 4     | 2150ms      | 1050ms     | absorption (800–1500) — mid-range |
   | Beat 8 → Beat 9a    | 3900ms      | 600ms      | absorption — under V3 floor (user direction) |
   | Beat 10 → LOOP      | 4000ms      | 600ms      | terminal — V3 floor 1500ms (DEVIATION) |

   Apply→done middle pause: 350ms (was 600ms V3 floor). The snap-pause-snap
   structural rhythm preserved at faster tempo.

   V3 deviations (explicit, user-approved):
     - Hero loop duration 7600ms vs V3 §1.1 hero range 14000–16000ms.
       Per-portfolio calibration for hiring-manager 30s portfolio scans.
       Other V3 framework decisions intact.
     - Terminal dwell 600ms vs V3 §2.3 minimum 1500ms. Reasoning: V3's
       exhale moment reads as hesitation in our specific case (denser,
       faster hero). The cursor returns to hover position, brief pause,
       clicks first row → continuous browsing read, not punctuated
       loop-with-exhale read.
     - Apply→done middle pause 350ms vs V3 §2.4 600–1000ms. The pause IS
       still the work, just at faster tempo. Snap structure preserved.
     - Beat 8 → 9a dwell 600ms vs V3 absorption floor 800ms. User direction.

   Mobile compression (r2.1): MOBILE_DELTA = -1200ms applied to Beats 9a/9b/10
   ONLY. Beats 1–8 fire identically desktop and mobile. Mobile cursor settles
   at T=5800 (was T=7000 desktop); 600ms terminal dwell to LOOP=6400.

   Timeline (V3 r2.6):

   | Beat | T desktop | T mobile | Action |
   |------|-----------|----------|--------|
   |  1   |    0      |    0     | Cursor on first row (from prior iter seam), is-hovered ON |
   |  2a  |  700      |  700     | No-op move (cursor already on row); add is-hovered (idempotent) |
   |  2b  | 1160      | 1160     | clickStamp + first row .is-clicked + marker 1 (r2.6 cut -140) |
   |  3   | 1560      | 1560     | Detail panel opens with back-out |
   |  4   | 2860      | 2860     | Cursor moves to Apply button (CSS 440ms +10%) |
   |  5   | 3420      | 3420     | clickStamp + Apply press + crossfade — 120ms pre-click hover (r2.6) |
   |  6a  | 3570      | 3570     | Step 1 spinner→check + .is-active + progress 33% |
   |  6b  | 3920      | 3920     | Step 2 spinner→check + .is-active + progress 66% (350ms middle pause) |
   |  6c  | 4170      | 4170     | Step 3 spinner→check + .is-active + progress 100% |
   |  7   | 4420      | 4420     | Crossfade applying→done (Snap 2) |
   |  8   | 4720      | 4720     | Concurrent ripples (strike + delta + Fixed badge) |
   |  9a  | 5320      | 4120     | Cursor moves to X close button (CSS 440ms +10%) |
   |  9b  | 5920      | 4720     | clickStamp X + panel slide-shut begins |
   |  —   | (freeze)  | (freeze) | 250ms X freeze — cursor motionless at X coords (true freeze) |
   | 10   | 6170      | 4970     | Cursor moves to first row center (SETTLE_MS 770ms +10%) |
   | 10b  | 6940      | 5740     | Cursor on row — is-hovered added |
   |  —   | (freeze)  | (freeze) | 250ms row freeze — cursor motionless on row (true freeze) |
   | LOOP | 7190      | 5990     | Iteration N+1 begins; cursor on row with hover state |

   V3 r1→r2 timing deltas:
     Beat 2b: 1400 → 1300 (snap 100ms tighter after cursor arrival)
     Beat 3:  1800 → 1700 (snap 100ms tighter after click)
     Beat 4:  4200 → 3000 (absorption 2150 → 1050)
     Beat 5:  5000 → 3700 (cascaded shift)
     Beat 6a: 5150 → 3850 (cascaded shift)
     Beat 6b: 5750 → 4200 (cascaded shift; pause 600 → 350)
     Beat 6c: 5900 → 4450 (cascaded shift)
     Beat 7:  6000 → 4700 (cascaded shift)
     Beat 8:  6300 → 5000 (cascaded shift)
     Beat 9a: 10500 → 5600 (absorption 3900 → 600 — biggest cut)
     Beat 9b: 11200 → 6200 (cascaded shift)
     Beat 10: 11300 → 6300 (cascaded shift)
     LOOP:    16000 → 9500 desktop, 14000 → 8300 mobile
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  Marker,
  getCenterOf,
  blurCrossfade,
  BLUR_HEAVY,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'aiFixFlowHero';
const root = document.getElementById(ROOT_ID);
if (root) initFixFlowHero(root);

function initFixFlowHero(rootEl) {
  // Viewport-conditional duration — V3 r2.1 (2026-05-27 terminal-dwell cut):
  // hero compressed from 9.5s → 7.5s by cutting terminal dwell from 2500ms to
  // 600ms. SECOND deliberate deviation from V3 — V3 §2.3 specifies terminal
  // dwell 1500ms minimum, but the V3 exhale moment reads as hesitation in our
  // specific case (denser, faster hero for 30s portfolio scans).
  const isMobile = window.innerWidth <= 640;
  // V3 r2.5 explicit freeze discipline (2026-05-27):
  //   - X freeze: 400 → 250ms (Beat 10 shifts T=6600 → T=6450)
  //   - Row freeze: 150 → 250ms (terminal hover before LOOP)
  //   - SETTLE_MS: 700 → 770ms (+10% global cursor slowdown)
  //   - Net loop change: +20ms (250 cuts from X linger offset by 100ms row
  //     freeze addition + 70ms SETTLE_MS slowdown - 150ms Beat 10 shift)
  // User feedback: r2.4 cursor felt rushed throughout; end-of-loop freezes
  // weren't landing. The freezes ARE setTimeout-driven (Choreography engine
  // schedules beats at absolute timestamps; gap between beats = no motion
  // scheduled = true freeze). The user's concern about "easing artifacts"
  // doesn't apply to this implementation — but the explicit 250/250 freeze
  // values are now exactly per spec.
  const LOOP_DURATION = isMobile ? 5990 : 7190;
  // V3 r2.1: MOBILE_DELTA RE-INTRODUCED as per-beat shift on Beats 9a/9b/10.
  // Reasoning: with terminal dwell cut to 600ms, mobile LOOP=6400ms can only
  // be achieved by shifting the post-ripples beats up by 1200ms. The cursor's
  // 770ms settling move (Beat 10 + SETTLE_MS) alone takes until T=7220 on
  // desktop — mobile must compress earlier to fit. Beats 1–8 fire identically
  // desktop and mobile (the choreography proper is unchanged); only the
  // close-panel sequence (9a/9b/10) shifts up on mobile.
  const MOBILE_DELTA = isMobile ? -1200 : 0;
  // Settling cursor move duration at loop seam. V3 r2.5: 700 → 770ms (+10%).
  const SETTLE_MS = 770;

  // DOM refs
  const container = rootEl.querySelector('.fix-hero-container');
  const rows = container.querySelectorAll('.fix-hero-row');
  const firstRow = rows[0];
  const detailPanel = container.querySelector('.fix-hero-detail-panel');
  const closeBtn = container.querySelector('.fix-hero-detail-close');
  const applyBtn = container.querySelector('.fix-hero-apply-btn');
  const flowIdle = container.querySelector('.fix-hero-flow-card--idle');
  const flowApplying = container.querySelector('.fix-hero-flow-card--applying');
  const flowDone = container.querySelector('.fix-hero-flow-card--done');
  const flowSteps = container.querySelectorAll('.fix-hero-flow-step-icon');
  const flowStepRows = container.querySelectorAll('.fix-hero-flow-step');
  const progressFill = container.querySelector('.fix-hero-flow-progress-fill');
  const foundHex = container.querySelector('.fix-hero-compare-hex--found');
  const delta = container.querySelector('.fix-hero-delta');
  const fixedBadge = container.querySelector('.fix-hero-badge--fixed');

  // Reduced-motion: leave the CSS @media (prefers-reduced-motion) to
  // paint the static done state. Do not mount cursor / markers / loop.
  if (prefersReduced()) {
    return;
  }

  // Engine instances
  const cursor = new Cursor(container);
  const marker1 = new Marker(container, { number: 1, variant: 'green' });

  let isFirstIteration = true;
  let loopTimer = null;

  function ensureCursor() {
    if (!cursor.el) {
      cursor.mount();
      return true;
    }
    return false;
  }

  function resetAllState() {
    rows.forEach(r => r.classList.remove('is-hovered', 'is-clicked'));
    detailPanel.classList.remove('is-open');
    closeBtn.classList.remove('is-hovered', 'is-clicked');
    applyBtn.classList.remove('is-pressed');
    flowIdle.classList.add('is-active');
    flowIdle.style.opacity = '1';
    flowIdle.style.filter = 'blur(0px)';
    flowApplying.classList.remove('is-active');
    flowApplying.style.opacity = '0';
    flowApplying.style.filter = 'blur(16px)';
    flowDone.classList.remove('is-active');
    flowDone.style.opacity = '0';
    flowDone.style.filter = 'blur(16px)';
    flowSteps.forEach(s => s.setAttribute('data-state', 'spinner'));
    progressFill.style.width = '0%';
    foundHex.classList.remove('is-struck');
    delta.classList.remove('is-resolved');
    delta.querySelector('.fix-hero-delta-text').textContent = 'Delta: −1.4:1 contrast';
    fixedBadge.classList.remove('is-visible');
    if (marker1.el) marker1.disappear();
    // V3 step-row dimming reset (2026-05-26): clear is-active so each iteration
    // begins with all three step rows at 40% opacity.
    flowStepRows.forEach(r => r.classList.remove('is-active'));
    // V3 cursor defensive cleanup (2026-05-26, per canonical-motion-spec.md
    // §4.1 Rule 5 zero-position reset): clear any in-flight state classes and
    // inline transition override. Cursor POSITION is NOT reset — that would
    // break the continuous loop seam (cursor settles at rest at end of iter N
    // = start of iter N+1).
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
  }

  // Rest position — V3 r2.2 (2026-05-27): cursor lands ON the first deviation
  // row's center (not above it). The is-hovered class is added when settling
  // completes (Beat 10b at T=7000 desktop / T=5800 mobile), making the
  // terminal dwell a "hover-on-target" moment — natural anticipation before
  // the next iteration's click.
  function getRestPosition() {
    return getCenterOf(firstRow, container);
  }

  function buildTimeline() {
    const firstRowCenter = getCenterOf(firstRow, container);
    const markerPos = { x: firstRowCenter.x + 90, y: firstRowCenter.y - 4 };

    return [
      // Beat 2a — Cursor moves from rest to first row + hover state.
      // Rest position already above the row, so this is a SHORT move (~28px down).
      {
        at: 700,
        do: () => {
          firstRow.classList.add('is-hovered');
          cursor.moveTo(firstRowCenter.x, firstRowCenter.y);
        }
      },

      // Beat 2b (V3 r2.6, 2026-05-27) — clickStamp + first row .is-clicked +
      // marker 1. Tightened from T=1300 → T=1160 (-140ms). Conservative cut
      // per user direction: iter-N+1 pre-click hover compressed. All
      // downstream beats shift -140ms cumulative from this change.
      {
        at: 1160,
        do: () => {
          cursor.clickStamp();
          firstRow.classList.remove('is-hovered');
          firstRow.classList.add('is-clicked');
          if (!marker1.el) marker1.mount();
          marker1.appear({ x: markerPos.x, y: markerPos.y });
        }
      },

      // Beat 3 (V3 r2.6) — Detail panel opens. Shifted -140ms from r2.5
      // (T=1700 → T=1560) via Beat 2b cascade.
      {
        at: 1560,
        do: () => {
          detailPanel.classList.add('is-open');
        }
      },

      // Beat 4 (V3 r2.6) — Cursor moves to Apply button. Shifted -140ms
      // from r2.5 (T=3000 → T=2860) via Beat 2b cascade. Absorption dwell
      // unchanged (panel opens 1560+250=1810; cursor moves at 2860 = 1050ms
      // absorption dwell, mid-V3-range).
      {
        at: 2860,
        do: () => {
          const pos = getCenterOf(applyBtn, container);
          cursor.moveTo(pos.x, pos.y);
        }
      },

      // Beat 5 (V3 r2.6) — clickStamp Apply + crossfade. Shifted -280ms
      // total from r2.5 (T=3700 → T=3420): -140 from Beat 2b cascade,
      // -140 from own pre-click hover cut (260ms → 120ms). Cursor arrives
      // at T=2860+440=3300; clickStamp at T=3420 = 120ms pre-click hover ✓
      {
        at: 3420,
        do: () => {
          cursor.clickStamp();
          applyBtn.classList.add('is-pressed');
          setTimeout(() => applyBtn.classList.remove('is-pressed'), 150);
          blurCrossfade(flowIdle, flowApplying, { blur: BLUR_HEAVY, duration: 250 });
        }
      },

      // Beat 6a (V3 r2.6) — Step 1 +150 from Apply click. T=3570 (-280 r2.5).
      {
        at: 3570,
        do: () => {
          flowSteps[0].setAttribute('data-state', 'check');
          flowStepRows[0].classList.add('is-active');
          progressFill.style.width = '33%';
        }
      },

      // Beat 6b (V3 r2.6) — Step 2 +500 from Apply click. T=3920 (-280 r2.5).
      // 350ms middle pause preserved (load-bearing per V3 §2.4).
      {
        at: 3920,
        do: () => {
          flowSteps[1].setAttribute('data-state', 'check');
          flowStepRows[1].classList.add('is-active');
          progressFill.style.width = '66%';
        }
      },

      // Beat 6c (V3 r2.6) — Step 3 +750 from Apply click. T=4170 (-280 r2.5).
      {
        at: 4170,
        do: () => {
          flowSteps[2].setAttribute('data-state', 'check');
          flowStepRows[2].classList.add('is-active');
          progressFill.style.width = '100%';
        }
      },

      // Beat 7 (V3 r2.6) — Crossfade applying→done. T=4420 (-280 r2.5).
      {
        at: 4420,
        do: () => {
          blurCrossfade(flowApplying, flowDone, { blur: BLUR_HEAVY, duration: 250 });
        }
      },

      // Beat 8 (V3 r2.6) — Concurrent ripples. T=4720 (-280 r2.5).
      {
        at: 4720,
        do: () => {
          foundHex.classList.add('is-struck');
          delta.classList.add('is-resolved');
          delta.querySelector('.fix-hero-delta-text').textContent = 'Delta: 0 · contrast restored';
          fixedBadge.classList.add('is-visible');
        }
      },

      // Beat 9a (V3 r2.6) — Cursor → X close. T=5320 desktop (was 5600),
      // T=4120 mobile (MOBILE_DELTA=-1200). 600ms post-ripples dwell preserved.
      {
        at: 5320 + MOBILE_DELTA,
        do: () => {
          const pos = getCenterOf(closeBtn, container);
          closeBtn.classList.add('is-hovered');
          cursor.moveTo(pos.x, pos.y);
        }
      },

      // Beat 9b (V3 r2.6) — clickStamp X. T=5920 desktop / T=4720 mobile.
      {
        at: 5920 + MOBILE_DELTA,
        do: () => {
          cursor.clickStamp();
          closeBtn.classList.remove('is-hovered');
          closeBtn.classList.add('is-clicked');
          setTimeout(() => closeBtn.classList.remove('is-clicked'), 200);
          detailPanel.classList.remove('is-open');
          // Cleanup state during panel close — but DON'T touch cursor position.
          firstRow.classList.remove('is-clicked');
          if (marker1.el) marker1.disappear();
        }
      },

      // Beat 10 (V3 r2.5 explicit freeze discipline, 2026-05-27) — Cursor
      // moves to rest position ON first row, AFTER a 250ms X freeze
      // (T=6450 desktop / T=5250 mobile). The 250ms gap between Beat 9b
      // (clickStamp X at T=6200) and this beat is a TRUE freeze — the
      // Choreography engine schedules beats via setTimeout at absolute
      // timestamps; no motion is queued during the 250ms gap. SETTLE_MS
      // is now 770ms (+10% slowdown from r2.4's 700ms). Cursor arrives at
      // T=6450+770=7220 desktop / T=5250+770=6020 mobile.
      {
        at: 6170 + MOBILE_DELTA,
        do: () => {
          const rest = getRestPosition();
          cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
        }
      },

      // Beat 10b (V3 r2.5 explicit freeze discipline, 2026-05-27) — When
      // settling completes, add is-hovered to firstRow. Cursor on row for
      // the 250ms row freeze until LOOP fires (was 150ms in r2.4 — extended
      // to match user's r2.5 spec). The freeze IS a true motionless period
      // because no further cursor motion is scheduled between this beat
      // and LOOP.
      // Row freeze: T=7220 → LOOP=7470 = 250ms desktop.
      //             T=6020 → LOOP=6270 = 250ms mobile.
      {
        at: 6940 + MOBILE_DELTA,
        do: () => {
          firstRow.classList.add('is-hovered');
        }
      }
    ];
  }

  let choreo = null;

  function startLoop() {
    resetAllState();
    const newlyMounted = ensureCursor();
    if (newlyMounted || isFirstIteration) {
      // First iteration only: snap cursor to rest position (firstRow center
      // per V3 r2.2) + fade in. Subsequent iterations skip this — cursor is
      // already there from previous iteration's Beat 10.
      const rest = getRestPosition();
      cursor.snapTo(rest.x, rest.y);
      cursor.show();
      isFirstIteration = false;
    }
    // V3 r2.2 hover-fix (2026-05-27): cursor is at firstRow center (either
    // snapped on first iter, or settled there from prior iter's Beat 10).
    // Mark is-hovered immediately so the row stays in hover state from the
    // very start of the iteration. resetAllState() just removed it; this
    // line re-adds it. Covers BOTH first-iter (snap to row) and subsequent-
    // iter (settled from prior) cases — no visible flicker on loop boundary.
    firstRow.classList.add('is-hovered');

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
    if (choreo) { choreo.pause(); }
  }

  const observer = new LoopObserver({
    element: container,
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
