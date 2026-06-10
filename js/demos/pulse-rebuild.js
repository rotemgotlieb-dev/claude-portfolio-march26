/* Pulse Rebuild (Loop 2, Sprint Revamp build, 2026-05-30)

   Lives in the Pivot section. Replaces the prior Pivot subtractive-collapse
   loop, which was rejected for crossfade-based "transformation" that did
   not read as a real designer action — V1 surface faded out, V2 surface
   faded in, no shape genuinely became another shape.

   Decision dramatized: "Version one was a competent monitoring dashboard.
   I told it to become one canvas. It became one canvas." This is the
   strategic-direction beat of the whole case study, so the response beat
   is long (~1700ms) and is the rhetorical payoff.

   Surface: a designed-down vanilla recreation of the V1 Calm Command
   Center in a browser-bar frame. Dark sidebar (44px), dark canvas bg
   (#15171F), 4 sidebar nav-icon dots, dark accent navbar with 2 pills,
   health-ring donut top-left, severity-pills row top-right, sparkline
   along the bottom. Recognizable as the V1 contact-sheet's top-left tile,
   NOT a Next.js port of the actual V1 app. Browser-bar slug
   localhost:3000. V2 substrate (4 wireframe columns + friction heatmap
   ellipses) is pre-rendered beneath with scaleY(0) at T=0 — NOT opacity 0
   — so the columns extrude up from the bottom on response.

   Sprint spec: .claude/sprint-reports/2026-05-30-pulse-animation-revamp-spec.md §5
   Gesture signature: #5 Annotate-and-delegate (shared with AE + Compose,
   distinct at rhetorical scale — AE binds attribute on component identity,
   Compose materializes a visual layer on a canvas, Rebuild morphs a whole
   interface into a different interface).

   The loop (7000ms per spec §5):
     - Beat 1 (T=0):     cursor → V1 dashboard, lands near health-ring (440ms ease-in-out)
     - Beat 1' (T=440):  dwell 350ms (the designer's strategic-pause)
     - Beat 2 (T=790):   clickStamp; Popup.show anchored to the v1 target
     - Beat 3 (T=1040):  Popup.typeInto("make this one canvas") @ 50ms/char
                         (21 chars × 50ms = 1050ms)
     - Beat 3' (T=2090): typing complete; 200ms hold
     - Beat 4 (T=2290):  clickStamp commit + Popup.hide
     - Beat 5 (T=2590):  .is-rebuilt on root. CSS owns the morph cascade:
                          sidebar slides left (0ms), canvas bg dark→cream
                          (100ms), navbar morphs into prompt bar (200ms),
                          health-ring recedes (200ms), severity-pills recede
                          (280ms), sparkline stretches+fades (360ms), V2
                          columns extrude up from bottom (500/580/660/740ms),
                          heat ellipses bloom (1100ms). Total morph window
                          ~1700ms — load-bearing per snap-pause-snap labor
                          illusion. See spec §5 table.
     - Beat 6 (T=4290):  cursor → rest with 770ms SETTLE
     - Beat 6' (T=5060): arrive at rest. ~1300ms absorption on the V2 canvas
     - Beat 7 (T=6360):  .is-cleanup on root. Morph reverses: everything
                         transitions back to V1 state via the same CSS
                         transitions in reverse. Iter N+1 reset wipes both
                         classes.
     - LOOP (T=7000):    resetAllState() → T=0 state

   Cursor + Popup discipline (per .claude/canonical-motion-spec.md §2.1):
     - Cursor traversal: ease-in-out (engine default 440ms)
     - clickStamp at each commit (V3 stamping)
     - Popup.show: back-out cubic-bezier(0.34, 1.56, 0.64, 1) @ 250ms
     - Popup.typeInto: 50ms/char (Benji pace)
     - SETTLE_MS = 770ms on the loop-seam return

   Engine imports (6): Cursor + Choreography + LoopObserver + Popup +
   getCenterOf + prefersReduced. CSS owns every visual transition on
   .is-rebuilt and .is-cleanup. No blurCrossfade call. The class toggles
   ARE the contract.

   Real-transformation mechanism (spec §3, the load-bearing engineering bar):
   Every V1 element transitions a real property — transform (translateX,
   scale, scaleY), width, background-color, height, border, and SVG r —
   on .is-rebuilt. Opacity is paired with transform on the V1 furniture
   pieces ONLY as a secondary skin; the transform IS the load-bearing
   morph. No pure A→B opacity crossfade on whole-surface swaps. The V2
   columns extrude from scaleY(0) at parse, the sidebar collapses width
   to 0, the navbar's height + colors morph, the canvas bg color shifts —
   real silhouette + color changes, not substitutions.

   Mirror seam: T=0 == T=7000. The cleanup beat reverses every state
   class so iteration N+1 starts clean. resetAllState() is the first call
   of every iteration per Single Unified Timeline §4.1 Rule 4.
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  Popup,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'pulseRebuild';
const root = document.getElementById(ROOT_ID);
if (root) initRebuild(root);

function initRebuild(rootEl) {
  const stage = rootEl.querySelector('.rb-widget-stage');
  const v1Target = rootEl.querySelector('[data-rb-v1-target]');
  if (!stage || !v1Target) return;

  const LOOP_DURATION = 7500;
  const SETTLE_MS = 770;
  const ANNOTATION_TEXT = 'make this one canvas';

  /* Reduced-motion: static end-state per spec §5 ("the rebuild's outcome").
     CSS @media (prefers-reduced-motion: reduce) pins the widget to the V2
     end-state — sidebar gone, canvas cream, columns extruded, heatmap
     bloomed — with no transitions and no cursor. Early-return prevents the
     cursor mount and choreography schedule. */
  if (prefersReduced()) return;

  const cursor = new Cursor(stage);
  const popup = new Popup(stage);
  let loopTimer = null;
  let choreo = null;

  /* Coordinate cache (principles.md: never call getBoundingClientRect on
     animated elements). v1Target receives transform:scale(0.4) translateY(40px)
     during the .is-rebuilt cascade (T=2790ms onward) and reverses during
     cleanup. Computing rest or popup anchor from v1Target AFTER T=2790
     returns the transformed rect, which makes the cursor settle in the
     wrong place. Snapshot once at init (before any class is added) and
     reuse the cached values for every beat. */
  const _targetRect = v1Target.getBoundingClientRect();
  const _stageRect = stage.getBoundingClientRect();
  const _targetLocal = {
    x: _targetRect.left - _stageRect.left,
    y: _targetRect.top - _stageRect.top,
    w: _targetRect.width,
    h: _targetRect.height
  };
  const _targetCenter = {
    x: _targetLocal.x + _targetLocal.w / 2,
    y: _targetLocal.y + _targetLocal.h / 2
  };
  const _cachedRest = {
    x: Math.max(20, _targetCenter.x - 180),
    y: Math.max(20, _targetCenter.y - 70)
  };
  const _cachedPopupAnchor = {
    x: Math.max(8, _targetLocal.x + 16),
    y: _targetLocal.y + _targetLocal.h + 8
  };

  function getRestPosition() { return _cachedRest; }
  function getPopupAnchor() { return _cachedPopupAnchor; }
  function getTargetCenter() { return _targetCenter; }

  /* V2 prompt-bar cursor target (the dead-zone-fix per learnings.md
     "Cursor dead-zone rule"). During the morph (T=3090 to T=4790),
     the cursor moves to the post-morph navbar position so it can
     "examine the new prompt surface as it materializes." Position is
     the visual center of the navbar AFTER its height morphs from 8px
     to 28px — y = 18 + 14 (top + half of 28) = 32 from stage top.
     Horizontal center based on post-morph layout: sidebar collapses so
     the navbar fills (stageWidth - 36px right padding) from left:18px
     (sidebar gone). Cursor target is (stage center, navbar center y). */
  const _v2PromptCenter = {
    x: _stageRect.width / 2,
    y: 32
  };

  /* Heat-layer ellipses: JS RAF tween of `r` attribute. CSS r-transition
     and CSS transform:scale on SVG ellipses are inconsistent in our
     Chromium environment (diagnostic 2026-05-30 — fill-box transform-
     origin collapses to 0,0 when scale is 0). JS tween is browser-
     agnostic. Cache target r at init, snap to 0, tween at .is-rebuilt
     response beat with the spec §5 1100ms delay. */
  const heatEllipses = Array.from(rootEl.querySelectorAll('.rb-widget-v2-heat circle'));
  const heatTargetR = new Map();
  heatEllipses.forEach(el => {
    const r = parseFloat(el.getAttribute('r')) || 0;
    heatTargetR.set(el, r);
    el.setAttribute('r', '0');
  });
  const heatAnimIds = new WeakMap();

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function tweenHeatR(el, from, to, durationMs) {
    const prior = heatAnimIds.get(el);
    if (prior) cancelAnimationFrame(prior);
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeInOut(t);
      el.setAttribute('r', (from + (to - from) * eased).toFixed(2));
      if (t < 1) {
        heatAnimIds.set(el, requestAnimationFrame(tick));
      } else {
        heatAnimIds.delete(el);
      }
    }
    heatAnimIds.set(el, requestAnimationFrame(tick));
  }

  function snapAllHeatTo(value) {
    heatEllipses.forEach(el => {
      const id = heatAnimIds.get(el);
      if (id) cancelAnimationFrame(id);
      heatAnimIds.delete(el);
      el.setAttribute('r', String(value));
    });
  }

  /* Zero-position reset per Single Unified Timeline §4.1 Rule 5.
     Called at iteration start AND on stopLoop defensive cleanup.
     Removes every animation class so iter N+1 starts at T=0 visuals.
     The .is-rebuilt + .is-cleanup classes own the morph cascade; both
     must be removed for the next pass to start clean. */
  function resetAllState() {
    rootEl.classList.remove('is-rebuilt', 'is-cleanup');
    v1Target.classList.remove('is-hovered');
    snapAllHeatTo(0);
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
    if (popup.el) {
      popup.el.classList.remove('is-visible');
    }
  }

  /* Build the timeline against the spec §5 table. Absolute T-stamps;
     between beats no motion is queued (true freezes, not easing tails).
     CSS transitions on the V1 elements + V2 substrate fire from the
     class-toggle at T=2590; per-element stagger is in the CSS, not here. */
  function buildTimeline() {
    const beats = [];

    // Beat 1 (T=0): cursor → V1 dashboard (lands near the health-ring).
    // Uses cached target center, not getCenterOf, so the cursor lands on
    // the v1Target's ORIGINAL position even if reset/cleanup transitions
    // are still resolving on the element.
    beats.push({
      at: 0,
      do: () => {
        const center = getTargetCenter();
        v1Target.classList.add('is-hovered');
        cursor.moveTo(center.x, center.y - 14);
      }
    });

    // Beat 2 (T=790): clickStamp + popup.show (back-out 250ms)
    beats.push({
      at: 790,
      do: () => {
        cursor.clickStamp();
        v1Target.classList.remove('is-hovered');
        const anchor = getPopupAnchor();
        popup.show({
          x: anchor.x,
          y: anchor.y,
          header: 'Add direction',
          submitLabel: 'Add'
        });
      }
    });

    // Beat 3 (T=1040): popup.typeInto at Benji's 50ms/char pace.
    // 21 chars × 50ms = 1050ms — typing completes ~T=2090.
    beats.push({
      at: 1040,
      do: () => {
        popup.typeInto(ANNOTATION_TEXT, { charDelay: 50 });
      }
    });

    // Beat 4a (T=2290): cursor visibly moves to the popup's Add button.
    // Logical-causation + human-pacing rules (learnings.md 2026-05-30):
    // 500ms ease-in-out so the hop reads as deliberate, not glitched.
    beats.push({
      at: 2290,
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

    // Beat 4b (T=2990): cursor arrived at Add at T=2790; held for 200ms
    // hover dwell ("the human is about to click"); now clickStamps.
    // Popup dismisses on the visible click.
    beats.push({
      at: 2990,
      do: () => {
        cursor.clickStamp();
        popup.hide();
      }
    });

    // Beat 5 (T=3090): .is-rebuilt on root. CSS owns the morph cascade
    // for sidebar/bg/navbar/furniture/V2-columns. JS owns the heat-layer
    // bloom (r-tween). The full ~1700ms morph window plays per spec §5.
    beats.push({
      at: 3090,
      do: () => {
        rootEl.classList.add('is-rebuilt');
      }
    });

    // Beat 5b (T=3290): cursor → V2 prompt bar (top-center of the post-
    // morph navbar). Dead-zone-fix per learnings.md "Cursor dead-zone
    // rule" — cursor follows the morph instead of sitting idle at the
    // Add button position for 1700ms. The viewer reads "the designer
    // moves to examine the new prompt surface as it materializes."
    // 700ms slow move because it's a deliberate exploration, not a snap.
    beats.push({
      at: 3290,
      do: () => {
        cursor.moveTo(_v2PromptCenter.x, _v2PromptCenter.y, { duration: 700 });
      }
    });

    // Beat 5.heat (T=4190): heat-layer ellipses bloom via JS r-tween.
    beats.push({
      at: 4190,
      do: () => {
        heatEllipses.forEach(el => {
          const targetR = heatTargetR.get(el) || 0;
          tweenHeatR(el, 0, targetR, 600);
        });
      }
    });

    // Beat 5c (T=4790): cursor has been at the prompt bar since T=3990;
    // placeholder text faded in at T=3690 (.is-rebuilt + 600ms CSS delay);
    // the designer "examines the prompt surface" while heat blooms +
    // outcome label lands. Cursor settle now: move to top-left rest
    // position (clears the prompt bar so the V2 canvas reads cleanly
    // during absorption). 770ms SETTLE.
    beats.push({
      at: 4790,
      do: () => {
        const rest = getRestPosition();
        cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
      }
    });

    // Beat 6' (T=5560): arrive at rest. ~1340ms absorption on V2.

    // Beat 7 (T=6900): cleanup. .is-cleanup reverses CSS cascade + heat tween.
    beats.push({
      at: 6900,
      do: () => {
        rootEl.classList.remove('is-rebuilt');
        rootEl.classList.add('is-cleanup');
        heatEllipses.forEach(el => {
          const currentR = parseFloat(el.getAttribute('r')) || 0;
          tweenHeatR(el, currentR, 0, 400);
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
     captured elapsedMs when back in view. Mirrors AE + Compose pattern. */
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
