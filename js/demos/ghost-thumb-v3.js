/* Ghost Bento Thumbnail v3 (2026-06-09)
   =========================================================
   Concept (per v3 brief): a miniature design-system inventory.
   Multiple component shapes in muted Ghost-purple sit composed
   on the canvas at REST. On animation (hover desktop / autoplay
   mobile), each shape grows a faint outlined ghost twin behind
   it. Ghosts drift to asymmetric off-spec positions. Drift
   indicator dots ping the worst offenders. Ghosts then snap
   back into perfect alignment with the spec. The choreography
   IS Ghost's thesis: scan the system, surface every deviation,
   snap to spec.

   Cross-surface deployment (per Cross-Surface Thumbnail
   Consistency Rule, 2026-05-06). The same markup is injected
   into BOTH .bento-card-thumb on the homepage AND
   .other-work-card .project-thumbnail on case-study pages.
   Multi-instance design: this module finds all instances via
   querySelectorAll('[data-ghost-thumb]') and wires each one
   with its own LoopObserver + own hover/autoplay state.

   Engineering:
     - CSS @keyframes own the ghost-twin choreography (drift +
       fade-in + return + dot ping). One named animation per
       layer. Container queries scale the composition for both
       the homepage bento (~520-1040px wide) AND the Other Work
       cards (~400-500px wide).
     - JS does only: reduced-motion early-return + viewport gate
       (LoopObserver pause/resume) + hover vs autoplay split.
       Hover-capable pointer (mouse / trackpad) waits for hover
       to add .is-animating; touch / coarse pointer autoplays
       on a loop via setInterval-driven class toggle.
     - .is-paused class on root pauses every CSS animation in
       the subtree via animation-play-state: paused. The
       LoopObserver starts paused (.is-paused baked-in via JS
       at init) so below-the-fold instances on case-study pages
       do NOT tick for one frame before pausing — important on
       Ghost / LexisNexis Other Work cards.

   Engine imports (2): LoopObserver, prefersReduced.
*/

import {
  LoopObserver,
  prefersReduced
} from './_engine/index.js';

const LOOP_DURATION = 8000;

const instances = document.querySelectorAll('[data-ghost-thumb]');
instances.forEach(initThumb);

function initThumb(root) {
  if (!root) return;

  /* Reduced-motion: CSS @media block pins ghosts visible at
     end-of-animation state (all-aligned), no animation. JS
     early-return prevents observer wiring + hover wiring so no
     pause/resume churn during scroll. */
  if (prefersReduced()) return;

  /* Detect hover capability. matchMedia is evaluated once at
     parse — a mid-session pointer-type change is rare enough
     to ignore (no listener cost on a thumbnail surface). */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let autoplayTimer = null;

  function startAutoplay() {
    if (autoplayTimer) return;
    root.classList.add('is-animating');
    autoplayTimer = setInterval(() => {
      /* Reset by removing then re-adding on next frame so the
         keyframe animation restarts cleanly (otherwise the
         single .is-animating toggle never re-triggers). */
      root.classList.remove('is-animating');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.add('is-animating');
        });
      });
    }, LOOP_DURATION);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    root.classList.remove('is-animating');
  }

  /* Hover devices: toggle .is-animating on enter / leave.
     The CSS animation runs ONCE per hover (animation-iteration-
     count: 1) and the loop repeats on each hover gesture. */
  if (canHover) {
    root.addEventListener('mouseenter', () => {
      root.classList.remove('is-paused');
      root.classList.add('is-animating');
    });
    root.addEventListener('mouseleave', () => {
      root.classList.remove('is-animating');
    });
  }

  /* Viewport + tab visibility gate via LoopObserver. On enter:
     for touch devices start the autoplay loop; for hover
     devices just unpause so a future hover plays smoothly. On
     exit: stop the autoplay loop and re-pause. */
  const observer = new LoopObserver({
    element: root,
    onEnter: () => {
      root.classList.remove('is-paused');
      if (!canHover) startAutoplay();
    },
    onExit: () => {
      stopAutoplay();
      root.classList.add('is-paused');
    }
  });

  /* Pre-paused guard: add .is-paused BEFORE observer.start() so
     below-the-fold instances on case-study pages do not tick
     for one frame between parse and observer.onExit firing.
     Per v3 brief and matches Pulse v3 pattern. */
  root.classList.add('is-paused');
  observer.start();
}
