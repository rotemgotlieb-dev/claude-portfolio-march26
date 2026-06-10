/* Demo engine — numbered marker pin primitive.
   Used by demos that need to annotate spatial points with a small
   numbered chip (1, 2, 3...). Matches the visual pattern documented
   in .claude/research/2026-05-25_benji-componentization-philosophy.md
   under Page 1 → hero-demo-marker / per-section markers.

   Easing curve per "Verified motion specifications"
   (.claude/design-decisions.md): ease-out-quint
   cubic-bezier(0.22, 1, 0.36, 1) at 300ms on appear; 150ms ease on
   disappear. Scale 0 → 1 on appear; 1 → 0 + opacity → 0 on disappear.

   Variants:
     default — dark fill (rgba(0,0,0,0.85)), white text
     green   — #22c55e fill, white text
     orange  — #f97316 fill, white text
     yellow  — #eab308 fill, white text (added 2026-05-27 for DP-B Minor marker)
     red     — #dc2626 fill, white text (added for drift detection demo)

   API:
     const marker = new Marker(container, { number: 1, variant: 'default' });
     marker.mount();
     await marker.appear({ x: 120, y: 80 });
     await marker.disappear();
     marker.destroy();

   Markers are absolutely-positioned inside container; container must
   be position: relative or absolute. x/y are container-local coords
   pointing to the marker's CENTER (not top-left); the CSS rule
   translates -50%/-50% to center on the coord.

   ========================================================================
   KNOWN CONSTRAINTS / GOTCHAS
   ========================================================================

   1. **Every variant string MUST have a matching `.demo-marker--{variant}`
      CSS rule in styles.css, OR the marker renders INVISIBLE.**
      Discovered 2026-05-27 (DP-B Minor marker bug): the constructor
      accepts ANY variant string and produces `class="demo-marker
      demo-marker--{variant}"`, but the base `.demo-marker` rule has no
      `background` of its own — the color comes from the variant rule
      alone. Passing `variant: 'yellow'` before `.demo-marker--yellow`
      existed in CSS produced a transparent 22px circle with white text
      against a near-white canvas: visually invisible. KNOWN_VARIANTS
      (below) now lists every supported value; unknown variants trigger
      a console.warn. **When adding a new variant: also add the CSS rule
      to styles.css under the existing variant block (search for
      `.demo-marker--red`).** No CSS rule = silent invisibility.

   2. **Variants only — colors not parameterized.** The Marker primitive
      deliberately does NOT accept arbitrary hex colors. The variant set
      is closed (default/green/orange/yellow/red) so the visual language
      stays consistent across demos. If a new severity level needs a new
      color, add it to KNOWN_VARIANTS + add the CSS rule + document here.

   3. **Container must be `position: relative` or `position: absolute`.**
      Markers are absolutely-positioned via inline `left`/`top` — if the
      container has the default `position: static`, markers will position
      relative to the nearest positioned ancestor (often the viewport),
      which is rarely what the demo wants.

   4. **x/y coords are container-LOCAL and point to the marker's CENTER.**
      The CSS `transform: translate(-50%, -50%)` is what does the
      centering. If a demo computes x/y via element-rect math, use
      `getCenterOf(element, container)` from motion.js — NOT
      `getBoundingClientRect()` directly (those are viewport coords).

   5. **`appear()` returns a Promise resolving after 300ms — but the
      promise resolves via setTimeout, NOT transitionend.** Chained beat
      sequences using `await marker.appear(...)` will block on the timer,
      not on visual completion. This is consistent with the rest of the
      engine but worth knowing when debugging timing drift.

   6. **`setVariant()` does NOT re-render the marker — it only swaps the
      class.** If the marker isn't mounted yet, setVariant is a no-op.
      Call sequence: `new Marker(...) → mount() → appear() → setVariant()
      if needed → disappear() → destroy()`. setVariant mid-loop is
      supported but rare; demos typically pass the final variant at
      construction.
*/

/* Closed set of supported marker variants. Each MUST have a matching
   `.demo-marker--{variant}` CSS rule in styles.css. See constraint #1
   above. Adding to this set requires both: (a) appending the variant
   here, (b) adding the CSS rule. Both steps must ship together. */
const KNOWN_VARIANTS = new Set(['default', 'green', 'orange', 'yellow', 'red']);

function warnUnknownVariant(variant) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Marker] Unknown variant "' + variant + '". ' +
    'A matching `.demo-marker--' + variant + '` CSS rule must exist in ' +
    'styles.css or the marker will render invisible. ' +
    'Supported variants: default, green, orange, yellow, red.'
  );
}

export class Marker {
  constructor(container, opts) {
    this.container = container;
    this.number = (opts && opts.number != null) ? opts.number : 1;
    this.variant = (opts && opts.variant) ? opts.variant : 'default';
    if (!KNOWN_VARIANTS.has(this.variant)) {
      warnUnknownVariant(this.variant);
    }
    this.el = null;
  }

  mount() {
    if (this.el) return;
    const el = document.createElement('div');
    el.className = 'demo-marker demo-marker--' + this.variant;
    el.setAttribute('aria-hidden', 'true');
    el.textContent = String(this.number);
    el.style.left = '-9999px';
    el.style.top = '-9999px';
    this.container.appendChild(el);
    this.el = el;
  }

  /* Position + appear. Returns Promise that resolves after the scale
     transition (300ms). */
  appear(opts) {
    if (!this.el) return Promise.resolve();
    if (opts && typeof opts.x === 'number') this.el.style.left = opts.x + 'px';
    if (opts && typeof opts.y === 'number') this.el.style.top = opts.y + 'px';
    void this.el.offsetWidth;
    this.el.classList.add('is-visible');
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  disappear() {
    if (!this.el) return Promise.resolve();
    this.el.classList.remove('is-visible');
    return new Promise(resolve => setTimeout(resolve, 150));
  }

  setNumber(n) {
    this.number = n;
    if (this.el) this.el.textContent = String(n);
  }

  setVariant(variant) {
    if (!this.el) return;
    if (!KNOWN_VARIANTS.has(variant)) {
      warnUnknownVariant(variant);
    }
    this.el.classList.remove(
      'demo-marker--default',
      'demo-marker--green',
      'demo-marker--orange',
      'demo-marker--yellow',
      'demo-marker--red'
    );
    this.el.classList.add('demo-marker--' + variant);
    this.variant = variant;
  }

  destroy() {
    if (!this.el) return;
    this.el.remove();
    this.el = null;
  }
}
