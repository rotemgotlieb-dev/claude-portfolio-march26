/* Pulse Compose (Loop 1, Sprint Revamp build, 2026-05-30)

   Lives in the Solution section. Replaces the prior wireframe-fidelity
   D1 loop, which was rejected for crossfade-based "transformation" that
   did not read as a real designer action on a real component.

   Decision dramatized: "I add the rage-click layer to the Observatory
   by telling it to. The heatmap materializes. The hot zone sharpens.
   That's how Pulse works AND how I built it."

   Surface: a designed-down vanilla recreation of the Living Observatory
   canvas in a browser-bar frame. Friction heatmap already present at
   T=0 (warm orange #ff7a2c blobs). Layer-chip strip at top reads
   Friction · Rage · Dead · Attention with only Friction active. The
   rage-click layer is what the designer adds: SVG ellipses with r=0 at
   parse, radius morphs to target on .is-composed via CSS transition.
   Real shape morph, not opacity crossfade — see spec §3.

   Sprint spec: .claude/sprint-reports/2026-05-30-pulse-animation-revamp-spec.md §4
   Gesture signature: #5 Annotate-and-delegate (shared with AE, distinct
   at the rhetorical layer — AE binds attribute on component identity;
   Compose materializes a visual layer on a canvas).

   The loop (7000ms):
     - Beat 1 (T=0):     cursor → hot-zone target (~440ms ease-in-out)
     - Beat 1' (T=440):  dwell 350ms (designer's noticing pause)
     - Beat 2 (T=790):   clickStamp; Popup.show anchored below target
     - Beat 3 (T=1040):  Popup.typeInto("add the rage-click layer") @ 50ms/char
                         (24 chars × 50ms = 1200ms)
     - Beat 3' (T=2240): typing complete; 200ms hold
     - Beat 4 (T=2440):  clickStamp commit + Popup.hide
     - Beat 5 (T=2740):  .is-composed on root. SVG rage ellipses morph
                         r=0 → target via CSS transition. Staggered
                         0/120/240/360/480ms per spec §4.
     - Beat 5'' (T=3740): center ellipse sharpens (radius contracts ~25%,
                          fill-opacity 0.65 → 0.85). Spec §4 step 6.
     - Beat 6 (T=4140):  cursor → rest with 770ms SETTLE
     - Beat 6' (T=4910): arrive at rest. ~1450ms absorption on new layer
     - Beat 7 (T=6360):  .is-cleanup on root. Ellipses contract back to
                         r=0. Iter N+1 reset wipes the class.
     - LOOP (T=7000):    resetAllState() → T=0 state

   Cursor + Popup discipline (per .claude/canonical-motion-spec.md §2.1):
     - Cursor traversal: ease-in-out (engine default 440ms)
     - clickStamp at each commit (V3 stamping)
     - Popup.show: back-out cubic-bezier(0.34, 1.56, 0.64, 1) @ 250ms
     - Popup.typeInto: 50ms/char (Benji pace)
     - SETTLE_MS = 770ms on the loop-seam return

   Engine imports (6): Cursor + Choreography + LoopObserver + Popup +
   getCenterOf + prefersReduced. CSS owns every visual transition on
   .is-composed / .is-cleanup / .cm-rage-sharpened — no blurCrossfade
   call. The class toggles ARE the contract.

   Real-transformation mechanism (spec §3, the load-bearing engineering bar):
   The rage-layer ellipses transition `r` (SVG presentation attribute) from
   0 to a per-ellipse target via CSS `transition: r 650ms`. SVG `r` is
   animatable in modern browsers (Chromium, Safari, Firefox). This is a
   genuine shape morph — the ellipses grow, they do not fade in.

   Mirror seam: T=0 == T=7000. The cleanup beat reverses every state
   class so iteration N+1 starts clean. resetAllState() is the first call
   of every iteration per Single Unified Timeline §4.1 Rule 4.
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  Popup,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'pulseCompose';
const root = document.getElementById(ROOT_ID);
if (root) initCompose(root);

function initCompose(rootEl) {
  const stage = rootEl.querySelector('.cm-widget-stage');
  const target = rootEl.querySelector('[data-cm-target]');
  if (!stage || !target) return;

  const LOOP_DURATION = 8500;
  const SETTLE_MS = 770;
  const ANNOTATION_TEXT = 'add the rage-click layer';

  /* Reduced-motion: static end-state per spec §4 reduced-motion clause.
     CSS @media block pins rage ellipses to their sharpened final state
     so viewer sees the designer's hand at work even without animation.
     Early-return prevents cursor mount + choreography schedule. */
  if (prefersReduced()) return;

  const cursor = new Cursor(stage);
  const popup = new Popup(stage);
  const rageEllipses = Array.from(rootEl.querySelectorAll('[data-rage]'));
  const centerRageEllipse = rootEl.querySelector('[data-rage-center]');
  let loopTimer = null;
  let choreo = null;

  /* Cache each ellipse's target radius from its initial r attribute, then
     snap r to 0 so the layer is invisible at parse. JS-driven RAF tween
     replaces the CSS r-attribute transition + CSS transform:scale path.
     Reason (diagnostic 2026-05-30): CSS r-transition is inconsistent in
     our Chromium build; CSS transform:scale on SVG ellipses computes
     transform-origin to 0,0 (fill-box quirk with bbox-collapsed-at-scale-0
     chicken-and-egg), scaling toward viewBox origin instead of the
     ellipse's own cx/cy. JS r-tween is browser-agnostic and pixel-precise. */
  const rageTargetR = new Map();
  /* Cache rendered position of each rage circle BEFORE we snap r to 0
     (after r=0, getBoundingClientRect returns 0×0). The cx/cy are stable
     across the entire loop (only r animates), so this position is the
     correct cursor target for the hover-tooltip beat regardless of when
     in the loop we reference it. */
  const _stageRectInit = stage.getBoundingClientRect();
  const rageRectAtInit = new Map();
  rageEllipses.forEach(el => {
    const r = parseFloat(el.getAttribute('r')) || 0;
    rageTargetR.set(el, r);
    const rect = el.getBoundingClientRect();
    rageRectAtInit.set(el, {
      x: rect.left - _stageRectInit.left + rect.width / 2,
      y: rect.top - _stageRectInit.top + rect.height / 2
    });
    el.setAttribute('r', '0');
  });
  const rageAnimIds = new WeakMap();

  /* Cache Friction chip center for the loop-tail "click Friction to
     reset" beat. Chip is static (not animated) so getBoundingClientRect
     is safe at any time, but caching at init is the discipline. */
  const _frictionChip = rootEl.querySelector('.cm-chip:first-child');
  const _frictionChipCenter = (() => {
    if (!_frictionChip) return null;
    const r = _frictionChip.getBoundingClientRect();
    return {
      x: r.left - _stageRectInit.left + r.width / 2,
      y: r.top - _stageRectInit.top + r.height / 2
    };
  })();

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function tweenR(el, from, to, durationMs) {
    const prior = rageAnimIds.get(el);
    if (prior) cancelAnimationFrame(prior);
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeInOut(t);
      el.setAttribute('r', (from + (to - from) * eased).toFixed(2));
      if (t < 1) {
        rageAnimIds.set(el, requestAnimationFrame(tick));
      } else {
        rageAnimIds.delete(el);
      }
    }
    rageAnimIds.set(el, requestAnimationFrame(tick));
  }

  function snapAllRageTo(value) {
    rageEllipses.forEach(el => {
      const id = rageAnimIds.get(el);
      if (id) cancelAnimationFrame(id);
      rageAnimIds.delete(el);
      el.setAttribute('r', String(value));
    });
  }

  /* Rest position: top-left of stage, outside the canvas hot zone.
     Continuous-state seam — cursor settles here at end of iter N,
     stays here for iter N+1 start. */
  function getRestPosition() {
    const center = getCenterOf(target, stage);
    return { x: Math.max(20, center.x - 220), y: Math.max(20, center.y - 90) };
  }

  /* Popup anchor: just below + slightly right of the hot-zone target.
     Stage-local coords because Popup container is the stage. */
  function getPopupAnchor() {
    const r = target.getBoundingClientRect();
    const cr = stage.getBoundingClientRect();
    return {
      x: Math.max(8, r.left - cr.left + 12),
      y: r.top - cr.top + r.height + 10
    };
  }

  /* Zero-position reset per Single Unified Timeline §4.1 Rule 4.
     Called at iteration start AND on stopLoop defensive cleanup.
     Removes every animation class so iter N+1 starts at T=0 visuals.
     The center-ellipse sharpened modifier also clears here. */
  function resetAllState() {
    rootEl.classList.remove('is-composed', 'is-cleanup', 'is-tooltip-visible');
    target.classList.remove('is-hovered');
    if (centerRageEllipse) {
      centerRageEllipse.classList.remove('cm-rage-sharpened');
    }
    snapAllRageTo(0);
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
    if (popup.el) {
      popup.el.classList.remove('is-visible');
    }
  }

  /* Build the timeline against the spec §4 table. Absolute T-stamps;
     between beats no motion is queued (true freezes, not easing tails). */
  function buildTimeline() {
    const beats = [];

    // Beat 1 (T=0): cursor → hot-zone target on canvas
    beats.push({
      at: 0,
      do: () => {
        const center = getCenterOf(target, stage);
        target.classList.add('is-hovered');
        cursor.moveTo(center.x, center.y - 18);
      }
    });

    // Beat 2 (T=790): clickStamp + popup.show anchored at the target
    beats.push({
      at: 790,
      do: () => {
        cursor.clickStamp();
        target.classList.remove('is-hovered');
        const anchor = getPopupAnchor();
        popup.show({
          x: anchor.x,
          y: anchor.y,
          header: 'Add layer',
          submitLabel: 'Add'
        });
      }
    });

    // Beat 3 (T=1040): popup.typeInto at Benji's 50ms/char pace
    // 24 chars × 50ms = 1200ms → typing complete at T=2240
    beats.push({
      at: 1040,
      do: () => {
        popup.typeInto(ANNOTATION_TEXT, { charDelay: 50 });
      }
    });

    // Beat 4a (T=2440): cursor visibly moves to the popup's Add button.
    // Logical-causation + human-pacing rules (learnings.md 2026-05-30):
    // 500ms ease-in-out move so the hop reads as deliberate, not glitched.
    beats.push({
      at: 2440,
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

    // Beat 4b (T=3140): cursor arrived at Add at T=2940; held for 200ms
    // hover dwell so the viewer registers "the human is about to click";
    // now clickStamps. Popup dismisses on the visible click.
    beats.push({
      at: 3140,
      do: () => {
        cursor.clickStamp();
        popup.hide();
      }
    });

    // Beat 5 (T=3240): rage-layer materializes. JS RAF tween of each
    // ellipse's `r` attribute from 0 to its cached target, staggered
    // per-ellipse via inline --rage-stagger. 650ms tween per ellipse;
    // total cluster materialization ~1130ms (480ms last stagger + 650ms
    // tween). The .is-composed class is still toggled so non-r state
    // (chip activation, fill-opacity, etc.) can react via CSS.
    beats.push({
      at: 3240,
      do: () => {
        rootEl.classList.add('is-composed');
        rageEllipses.forEach(el => {
          const targetR = rageTargetR.get(el) || 0;
          const stagger = parseFloat(el.style.getPropertyValue('--rage-stagger')) || 0;
          if (stagger > 0) {
            setTimeout(() => tweenR(el, 0, targetR, 650), stagger);
          } else {
            tweenR(el, 0, targetR, 650);
          }
        });
      }
    });

    // Beat 5'' (T=4240): central hotspot sharpens. r contracts to 0.75x
    // its target; fill-opacity 0.65 → 0.85. 400ms tween. Spec §4 step 6.
    beats.push({
      at: 4240,
      do: () => {
        if (centerRageEllipse) {
          const targetR = rageTargetR.get(centerRageEllipse) || 0;
          centerRageEllipse.classList.add('cm-rage-sharpened');
          tweenR(centerRageEllipse, targetR, targetR * 0.75, 400);
        }
      }
    });

    // Beat 6 (T=3700): cursor → central rage blob. Shifted EARLIER from
    // T=4640 per round-5 feedback (2026-05-30): the 1500ms idle window
    // between Add-click (T=3140) and cursor-move was reading as dead
    // time AND was costing tooltip-visible duration. Starting at T=3700:
    // - Cursor in motion T=3700 → T=4200 overlaps with the tail of the
    //   rage materialization cascade (which completes at T=4370) AND
    //   the sharpens beat (T=4240 → T=4640). Cursor visibly approaches
    //   the cluster as it finishes forming + sharpening — feels like
    //   the designer reaching for the data as it stabilizes.
    // - Tooltip appears 700ms later at T=4400, just before the sharpens
    //   beat completes. Stays visible until T=6840 — 2440ms of tooltip
    //   reading time (vs 1500ms before, 63% longer).
    // Position cached at init from the rendered SVG circle bounds since
    // cx/cy don't animate (only r does). Offset cursor above + left so
    // the arrow tip lands on the blob center.
    beats.push({
      at: 3700,
      do: () => {
        const pos = centerRageEllipse ? rageRectAtInit.get(centerRageEllipse) : null;
        if (!pos) return;
        cursor.moveTo(pos.x - 8, pos.y - 14, { duration: 500 });
      }
    });

    // Beat 6b (T=4400): cursor arrived at T=4200, held 200ms hover dwell
    // ("the designer reads the hot zone"). Data tooltip surfaces above-
    // right of the blob — real component-level data ("Drag target ·
    // 247 clicks · 38 users · WCAG 2.5.5"). CSS owns the tooltip entry.
    beats.push({
      at: 4400,
      do: () => {
        rootEl.classList.add('is-tooltip-visible');
      }
    });

    // Beat 6c (T=6840): tooltip held ~1500ms (viewer reads). Cursor →
    // Friction chip (top-left of canvas chip strip). Tooltip stays
    // visible during the cursor move so the data lingers as the cursor
    // exits — "the designer absorbed the insight and is now moving on."
    beats.push({
      at: 6840,
      do: () => {
        if (!_frictionChipCenter) return;
        cursor.moveTo(_frictionChipCenter.x, _frictionChipCenter.y, { duration: 500 });
      }
    });

    // Beat 6d (T=7540): cursor arrived at Friction chip at T=7340,
    // held 200ms hover dwell, now clickStamps. Tooltip dismisses on
    // the click (the "back to baseline" gesture removes the rage data).
    beats.push({
      at: 7540,
      do: () => {
        cursor.clickStamp();
        rootEl.classList.remove('is-tooltip-visible');
      }
    });

    // Beat 7 (T=7840): cleanup. The Friction click implies "reset to
    // baseline" rhetorically — rage layer recedes. JS tweens every rage
    // ellipse back to r=0, .is-cleanup class drives the CSS fill-opacity
    // reset for the sharpened-center modifier.
    beats.push({
      at: 7840,
      do: () => {
        rootEl.classList.remove('is-composed');
        if (centerRageEllipse) {
          centerRageEllipse.classList.remove('cm-rage-sharpened');
        }
        rootEl.classList.add('is-cleanup');
        rageEllipses.forEach(el => {
          const currentR = parseFloat(el.getAttribute('r')) || 0;
          tweenR(el, currentR, 0, 550);
        });
      }
    });
    // Remaining ~640ms until LOOP; resetAllState() at iter N+1 start
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
     captured elapsedMs when back in view. Mirrors AE pattern verbatim. */
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
