/* Ghost Bento Thumbnail (2026-06-09 revision)

   Lives in the homepage bento card .thumb-ghost AND the Other Work cards
   on Pulse + LexisNexis case studies. Replaces the prior slider+callouts
   build with a single focal element: a solid rounded-rectangle "component"
   with an outlined ghost twin drifting diagonally behind it.

   Decision dramatized: "production wandered. spec stayed put. ghost
   surfaces the deviation." One continuous meditative breath cycle — drift
   out, return to alignment, hold briefly, drift back out, loop. No labels,
   no UI scaffolding, no callouts. Two shapes, one drifting.

   Surface: two rounded rectangles inside .gbt-component-pair. The solid
   .gbt-component-solid is the SPEC (perfectly still). The outlined
   .gbt-component-ghost is the PRODUCTION twin that drifts via a CSS
   @keyframes animation (gbt-drift) on the underlying transform. JS does
   NOT animate per-frame here; CSS @keyframes own the drift entirely.

   Engine imports (2): LoopObserver + prefersReduced. No Choreography
   (single-property CSS keyframe loop), no Cursor (no designer-author
   narrative on a thumbnail), no Popup.

   The loop (8000ms, CSS-driven):
     - 0%   (T=0):   ghost at translate(12px, 6px)   — at-rest drift
     - 25%  (T=2000): ghost at translate(18px, 10px) — max drift
     - 50%  (T=4000): ghost at translate(0, 0)       — perfectly aligned
     - 60%  (T=4800): ghost held at translate(0, 0)  — hold aligned
     - 100% (T=8000): ghost back to translate(12px, 6px) — loop seam

   Mirror seam: 0% and 100% are the same transform — gbt-drift is a
   bona-fide continuous loop. No JS reset needed because no state
   accrues; the CSS @keyframes plays infinite and ends at start.

   Pause/resume: LoopObserver adds .is-paused on exit (offscreen or tab
   backgrounded) and removes it on enter. CSS animation-play-state on
   .gbt-component-ghost is toggled by the .is-paused class. The animation
   resumes from its paused offset — no choreography elapsed-ms math
   needed.

   Reduced-motion: @media (prefers-reduced-motion: reduce) in styles.css
   pins the ghost to its at-rest drift state translate(12px, 6px) and
   sets animation: none. JS early-returns to skip the LoopObserver mount.
*/

import {
  LoopObserver,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'ghostBentoThumb';
const root = document.getElementById(ROOT_ID);
if (root) initGhostBentoThumb(root);

function initGhostBentoThumb(rootEl) {
  /* Reduced-motion: CSS @media block pins the ghost to its at-rest drift
     position with animation:none. Early-return prevents the LoopObserver
     mount so we don't pay for an IntersectionObserver on a static element. */
  if (prefersReduced()) return;

  /* Pre-paused guard (matches pulse-bento-thumbnail.js pattern). For
     thumbnails parked below the fold at parse (Other Work cards), the
     CSS @keyframes would tick for one or more frames before the
     IntersectionObserver onExit fires. Setting .is-paused at init
     suppresses that race so the loop only animates while genuinely
     visible. Removed on the first onEnter. */
  rootEl.classList.add('is-paused');

  /* IO + tab visibility gate. Pause the CSS @keyframes when out of view;
     resume when back in. The .is-paused class flips
     animation-play-state on the ghost element. */
  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => {
      rootEl.classList.remove('is-paused');
    },
    onExit: () => {
      rootEl.classList.add('is-paused');
    }
  });
  observer.start();
}
