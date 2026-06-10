/* Demo engine — motion utilities.
   Small DOM helpers shared across demos. No state of its own; pure
   functions over DOM nodes. CSS transitions do all easing — see
   .claude/research/2026-05-22_benji-autoplay-decomposition.md.
*/

/* Return the center {x, y} of `element`, expressed in `relativeTo`'s
   local coordinate space. Used by choreographies to point the cursor
   at any element inside the demo frame regardless of frame size. */
export function getCenterOf(element, relativeTo) {
  const targetRect = element.getBoundingClientRect();
  const refRect = relativeTo.getBoundingClientRect();
  return {
    x: targetRect.left - refRect.left + targetRect.width / 2,
    y: targetRect.top - refRect.top + targetRect.height / 2,
  };
}

/* Toggle .is-clicking on the cursor element for a single click pulse.
   CSS keyframe `demo-cursor-pulse` handles the scale animation. */
export function pulse(cursorEl) {
  cursorEl.classList.remove('is-clicking');
  // Force reflow so the next class re-add restarts the animation if
  // pulses come close together. Reading offsetWidth is the canonical
  // synchronous-reflow trigger.
  void cursorEl.offsetWidth;
  cursorEl.classList.add('is-clicking');
}

/* Opacity-only crossfade between two siblings. Both elements are
   present in the DOM at all times; only `.is-active` controls visibility.
   No transform or scale on the canvas swap — too busy at this density.
*/
export function crossfade(fromEl, toEl) {
  if (fromEl === toEl) return;
  if (fromEl) fromEl.classList.remove('is-active');
  if (toEl) toEl.classList.add('is-active');
}

/* Slide a pill background to sit behind the active chip in a chip group.
   Used by the View Modes switcher. Reads the active chip's offsetLeft
   and offsetWidth (which are relative to the chip's offsetParent) and
   writes them as CSS custom properties on the pill element. The pill's
   CSS transition handles the slide easing. */
export function setPillPosition(pillEl, activeChipEl) {
  if (!pillEl || !activeChipEl) return;
  pillEl.style.setProperty('--pill-x', activeChipEl.offsetLeft + 'px');
  pillEl.style.setProperty('--pill-w', activeChipEl.offsetWidth + 'px');
}

/* Blur values used by the two canonical blur-crossfade variants.
   LIGHT: button-to-button or single-element state swap (Kowalski pattern).
   HEAVY: full-card / major-state transition (Salaja pattern).
   These constants are exported so per-demo modules don't pass magic
   numbers to blurCrossfade(). See `.claude/design-decisions.md`
   "Verified motion specifications" for the cohort-validated values. */
export const BLUR_LIGHT = 2;
export const BLUR_HEAVY = 16;

/* Crossfade two sibling elements using opacity + filter:blur transitions.
   Used for state transitions where opacity-only fade is too sharp at this
   density (per Salaja iOS battery + Kowalski button morph references).

   Both elements MUST be present in the DOM as siblings sharing the same
   absolutely-positioned slot (parent has position: relative + the children
   have inset: 0). The function does NOT manipulate display or visibility —
   it only writes opacity + filter inline. CSS handles transition timing
   IF the children declare `transition: opacity ..., filter ...` in their
   rule. Caller is responsible for that CSS declaration; otherwise the
   crossfade snaps instantly.

   opts.blur: pixel blur radius for the leaving element's exit + the
     entering element's entry. Default BLUR_LIGHT (2px). Pass BLUR_HEAVY
     (16px) for major state transitions (AI Fix Flow idle→applying→done).
   opts.duration: per-element transition duration in ms (used to time the
     returned Promise's resolution — does NOT override CSS transition
     timing; that lives on the element's CSS rule). Default 200.

   Returns a Promise that resolves after `duration` ms — caller uses this
   to chain subsequent actions. The Promise does NOT await transitionend
   (would require listening on two elements + multiple property names);
   the duration-based timer is simpler and accurate enough for choreography
   sequencing.

   Pattern (in per-demo CSS):
     .fix-card { opacity: 0; filter: blur(2px); transition: opacity 200ms ease, filter 200ms ease; }
     .fix-card.is-active { opacity: 1; filter: blur(0); }
*/
export function blurCrossfade(elementOut, elementIn, opts) {
  const blur = (opts && typeof opts.blur === 'number') ? opts.blur : BLUR_LIGHT;
  const duration = (opts && typeof opts.duration === 'number') ? opts.duration : 200;
  if (elementOut === elementIn) return Promise.resolve();
  if (elementOut) {
    elementOut.style.opacity = '0';
    elementOut.style.filter = `blur(${blur}px)`;
    elementOut.classList.remove('is-active');
  }
  if (elementIn) {
    elementIn.style.opacity = '1';
    elementIn.style.filter = 'blur(0px)';
    elementIn.classList.add('is-active');
  }
  return new Promise(resolve => setTimeout(resolve, duration));
}
