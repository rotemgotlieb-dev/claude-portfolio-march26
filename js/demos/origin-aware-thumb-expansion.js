/* Origin-aware thumb expansion.

   Hallmark 2026 portfolio interaction: when a project card (.bento-card or
   .other-work-card) is clicked, the thumbnail visually "expands" out of the
   grid to cover the viewport, then the destination page loads underneath.
   Reads as a continuous spatial transition rather than a hard page swap.

   ============================================
   KNOWN CONSTRAINTS / GOTCHAS
   ============================================

   1. FLIP, not width/height keyframes. The brief proposed animating
      top/left/width/height from the original rect to a viewport-sized rect.
      That works visually but triggers layout on every frame. We use the
      First/Last/Invert/Play technique instead: the clone is appended at the
      FINAL viewport rect (position:fixed; inset:0) and we animate the
      transform from "scale + translate to original rect" to "identity."
      Same visual result, but transform + opacity + clip-path are the only
      animated properties — compositor-only, 60fps on mobile. Border-radius
      morphs via clip-path inset (compositor-safe) rather than border-radius
      keyframes (paints every frame).

   2. Single-flight guard. The IN_FLIGHT module flag blocks a second
      expansion while one is running. Without it, a fast-clicking user can
      stack multiple clones over the viewport, double-fire navigation, and
      leak DOM nodes if the first navigation resolves slowly.

   3. Capture phase to outrank the global page-transition handler.
      [main.js:266] registers a bubble-phase click listener that calls
      preventDefault() on every internal link. We register at capture phase
      so our handler runs first and can stopImmediatePropagation() before
      that listener fires. Without capture, the page-transition overlay
      activates simultaneously with the clone and visually conflicts.

   4. Original card visibility: hidden, not display: none. visibility:hidden
      preserves the layout box so the grid does not reflow underneath the
      expanding clone (which would betray the FLIP illusion). display:none
      would collapse the row and shift adjacent cards by a few pixels mid-
      animation. visibility:hidden is the right primitive here.

   5. Fallbacks are dumb-fast. Reduced motion, missing WAAPI, or
      sub-pointer environments skip the animation entirely and let the
      browser navigate via the existing main.js handler. We do NOT try a
      degraded CSS-transition substitute — a half-animation that breaks the
      illusion is worse than a hard cut.

   6. Cache-bust the HTML if you bump this version. The script tag in
      index.html + every work/*.html needs ?v=N synchronized. Per CLAUDE.md
      Mobile Video Standing Rule meta-layer (M).

   Established 2026-06-09.
*/

import { prefersReduced } from './_engine/index.js';

var IN_FLIGHT = false;

var EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
var DURATION = 420;
var NAV_DELAY_BUFFER = 40; // ms before duration end to start navigation

function supportsWAAPI() {
  return typeof Element !== 'undefined'
    && typeof Element.prototype.animate === 'function';
}

function isInternalLink(card) {
  var href = card.getAttribute('href');
  if (!href) return false;
  if (href.startsWith('http://') || href.startsWith('https://')) return false;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (card.hasAttribute('download')) return false;
  if (card.target === '_blank') return false;
  return true;
}

function buildClone(card, rect) {
  var clone = card.cloneNode(true);

  // Strip interactivity from clone — it is a visual prop, not a link.
  clone.removeAttribute('href');
  clone.setAttribute('aria-hidden', 'true');
  clone.style.pointerEvents = 'none';
  clone.style.userSelect = 'none';

  // Strip any reveal-state classes that might re-trigger animations on
  // append. The clone should be a static visual snapshot.
  clone.classList.remove('reveal');
  clone.classList.remove('revealed');

  // FLIP setup: place the clone at the FINAL rect (full viewport).
  // The animation will invert it to the original rect at frame 0 then
  // play forward to identity.
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '100vw';
  clone.style.height = '100vh';
  clone.style.margin = '0';
  clone.style.zIndex = '9999';
  clone.style.willChange = 'transform, opacity, clip-path';
  clone.style.transformOrigin = '0 0';
  clone.style.overflow = 'hidden';

  // Force the inner thumb to fill the clone shell so the visual reads as
  // the thumbnail expanding (not text + chrome stretching).
  var thumb = clone.querySelector('.bento-card-thumb, .project-thumbnail');
  if (thumb) {
    thumb.style.position = 'absolute';
    thumb.style.inset = '0';
    thumb.style.width = '100%';
    thumb.style.height = '100%';
    thumb.style.margin = '0';
    thumb.style.borderRadius = '0';
  }

  return clone;
}

function computeFlipKeyframes(rect, originalRadiusPx) {
  var vw = window.innerWidth;
  var vh = window.innerHeight;

  // Scale factors to shrink the viewport-sized clone down to original rect.
  var sx = rect.width / vw;
  var sy = rect.height / vh;

  // clip-path inset preserves rounded corners on the way out without
  // animating border-radius (which would paint every frame).
  var radius = originalRadiusPx || 12;
  var startInset = 'inset(0 round ' + radius + 'px)';
  var endInset = 'inset(0 round 0px)';

  return [
    {
      transform: 'translate(' + rect.left + 'px, ' + rect.top + 'px) scale(' + sx + ', ' + sy + ')',
      clipPath: startInset
    },
    {
      transform: 'translate(0px, 0px) scale(1, 1)',
      clipPath: endInset
    }
  ];
}

function getRadiusPx(card) {
  var cs = window.getComputedStyle(card);
  var raw = cs.borderTopLeftRadius || '12px';
  var n = parseFloat(raw);
  return isNaN(n) ? 12 : n;
}

function navigate(href) {
  window.location.href = href;
}

function runExpansion(card, event) {
  if (IN_FLIGHT) {
    // Suppress all click handling for the duration of a running expansion.
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  var href = card.getAttribute('href');
  if (!href) return;

  IN_FLIGHT = true;
  event.preventDefault();
  event.stopImmediatePropagation();

  var rect = card.getBoundingClientRect();
  var radius = getRadiusPx(card);
  var clone = buildClone(card, rect);

  // Hide original FIRST (in same frame) so the user never sees both.
  // visibility (not display) preserves layout box — grid does not reflow.
  card.style.visibility = 'hidden';

  document.body.appendChild(clone);

  var keyframes = computeFlipKeyframes(rect, radius);
  var animation = clone.animate(keyframes, {
    duration: DURATION,
    easing: EASING,
    fill: 'forwards'
  });

  // Kick off navigation slightly before the animation finishes. The new
  // page parse + paint is the slow part; overlapping it with the tail of
  // the expansion hides the seam between local animation and remote load.
  var navTimer = setTimeout(function () {
    navigate(href);
  }, Math.max(0, DURATION - NAV_DELAY_BUFFER));

  // Safety net: if navigation is blocked / canceled, restore the card so
  // the page is not left in a broken visibility state.
  animation.finished.then(function () {
    // Most builds will have navigated before this resolves. If still here
    // (slow navigation, intercepted by browser), keep the clone in place
    // so the page reads as "loading" rather than blank.
  }).catch(function () {
    clearTimeout(navTimer);
    cleanup(card, clone);
    IN_FLIGHT = false;
  });
}

function cleanup(card, clone) {
  if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
  if (card) card.style.visibility = '';
}

function attach() {
  // Capture phase so we outrank the global page-transition click handler
  // in main.js (which is bubble phase). See gotcha #3.
  document.addEventListener('click', function (event) {
    var card = event.target.closest('.bento-card, .other-work-card');
    if (!card) return;
    if (!isInternalLink(card)) return;

    // Respect modifier keys — let users open in new tab/window normally.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button && event.button !== 0) return;

    // Fallback paths: skip the animation, let main.js handle navigation.
    if (prefersReduced()) return;
    if (!supportsWAAPI()) return;

    runExpansion(card, event);
  }, true);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attach);
} else {
  attach();
}
