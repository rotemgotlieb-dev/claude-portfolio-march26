/* Pulse Bento Thumbnail (homepage + Other Work cards, 2026-06-09 build)

   Surface: the 16:9 bento-card-thumb container on the homepage Pulse
   card AND (via Cross-Surface Thumbnail Consistency Rule) the Other
   Work cards on Ghost + LexisNexis case studies. This is the FIRST
   motion a visitor sees of Pulse.

   Concept (LOCKED — single focal element):
     One warm-orange thermal heatmap blob on a clean cream canvas.
     The blob breathes — radius expands and contracts on a slow
     ~7.5s cycle. The core hue subtly shifts between warm orange and
     warm red across the breath (hotter at peak expansion, cooler at
     contraction). That is the entire animation.

   Why this composition:
     The Pulse case study's signature artifact is the friction heatmap
     overlay on the Living Observatory. The bento thumbnail distills
     that one visual to its purest form: a single warm bloom on a
     calm canvas. ~7.5s breath ≈ 8 breaths per minute (meditative,
     human). The hue desync against the breath cycle prevents the
     loop from reading as mechanical.

   Engineering:
     CSS @keyframes own the breath + hue cycles. JS does ONLY:
       - reduced-motion early-return (CSS handles end-state)
       - viewport + tab-visibility gating via LoopObserver
       - pause/resume by toggling .is-paused on root
       (CSS rule: .is-paused { animation-play-state: paused })

     No Choreography needed — a single sinusoidal breath is one
     CSS animation, not a multi-beat timeline.
     No Cursor / Popup primitives — this is a poster-style thumbnail,
     not a cursor-as-designer demo.
     No SVG geometry tween in JS — CSS-animatable SVG `r` on <circle>
     (per SVG primitive selection rule: circles use r, ellipses use
     rx/ry) carries the breath natively.

   Engine imports (2): LoopObserver, prefersReduced.

   Mirror seam: the breath keyframe is symmetric (70 → 110 → 70 px
   over one cycle), so T=0 == T=LOOP_DURATION by construction. The
   hue cycle runs at a slightly different duration so the two beats
   desync — over many cycles the loop never feels metronomic, but
   each individual cycle is internally seam-clean.
*/

import {
  LoopObserver,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'pulseBentoThumb';
const root = document.getElementById(ROOT_ID);
if (root) initBentoThumb(root);

function initBentoThumb(rootEl) {
  const stage = rootEl.querySelector('.pbt-stage');
  if (!stage) return;

  /* Reduced-motion: CSS @media (prefers-reduced-motion: reduce) block
     in styles.css pins the blob to its mid-radius static frame and
     disables animation. JS early-return prevents observer attachment
     so no pause/resume churn during scrolling. */
  if (prefersReduced()) return;

  /* Viewport + tab visibility gate. Pause the CSS keyframe animations
     when out of view; resume when back. The CSS animation continues
     from where it paused (animation-play-state contract) — no manual
     elapsed-time bookkeeping required, which is the whole reason this
     thumbnail uses pure CSS rather than the Choreography primitive. */
  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => {
      rootEl.classList.remove('is-paused');
    },
    onExit: () => {
      rootEl.classList.add('is-paused');
    }
  });

  /* Start paused — LoopObserver will fire onEnter immediately if the
     thumb is already in view at parse, removing .is-paused. This
     prevents the breath from racing in offscreen instances (e.g. the
     Other Work cards below the fold on a case-study page). */
  rootEl.classList.add('is-paused');
  observer.start();
}
