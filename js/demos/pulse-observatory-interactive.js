/* Pulse Observatory · Interactive Widget (Try the Observatory section, 2026-06-09)

   Lives between the Solution and Pivot sections of work/pulse.html. This
   is the page's only viewer-driven surface — the three other Pulse loops
   (Compose, Rebuild, Anchor) are cursor-as-designer autoplay. Here the
   real OS cursor drives every interaction.

   Decision dramatized: "The heatmap is an interface, not a visualization.
   Toggle each layer to see how component-level signals stack."

   Surface: a designed-down Living Observatory canvas in a browser-bar
   frame (~330px tall, body-demo discipline). Four heatmap layers:
   Friction (warm orange, baseline, visible at parse), Rage (hot red),
   Dead (cool slate), Attention (cool teal). Layer chips are real buttons
   wired up via this module. Hovering any visible blob surfaces a
   component-anchored data tooltip.

   Mechanics:
     - Click a chip → toggles .is-visible on the matching SVG layer group
       AND toggles .io-chip--active on the chip. Multiple layers can be
       visible at once; they stack. Friction stays on by default. The
       Reset button restores Friction-only.
     - Hover (or keyboard-focus) any visible blob → tooltip surfaces with
       layer eyebrow + main count + sub citation. Mouse leave / blur
       hides it. Esc keypress hides it.

   Why opacity-driven layer reveal here is an EXPLICIT EXCEPTION to the
   spec §3 "real transformation" rule: each layer is an entire SVG group
   the viewer turns on or off as a unit — this IS the "layer toggle"
   gesture, semantically a visibility switch rather than a property morph.
   The autoplay loops still follow the §3 rule for their state changes.

   Engine imports (1): prefersReduced only. No Cursor, no Choreography,
   no Popup, no LoopObserver — the viewport-pause concern is moot for an
   interactive widget, and the real OS cursor handles pointer feedback.

   Accessibility:
     - Chips are <button aria-pressed="true|false"> (proper toggle role)
     - Blobs have tabindex="0" + role="img" + aria-label, focus + blur
       drive the tooltip the same as mouseenter + mouseleave
     - Esc dismisses any open tooltip globally
     - Focus rings on chips + blobs via :focus-visible in CSS
     - prefersReduced: skip the hover/focus tooltip JS — CSS @media block
       handles the static end-state (all layers visible, no transitions)
*/

import { prefersReduced } from './_engine/index.js';

const ROOT_ID = 'pulseObservatoryTry';
const KNOWN_LAYERS = new Set(['friction', 'rage', 'dead', 'attention']);
const DEFAULT_ACTIVE_LAYER = 'friction';

const root = document.getElementById(ROOT_ID);
if (root) initObservatory(root);

function initObservatory(rootEl) {
  const stage = rootEl.querySelector('.io-widget-stage');
  const tooltip = rootEl.querySelector('[data-io-tooltip]');
  if (!stage || !tooltip) return;

  const chips = Array.from(rootEl.querySelectorAll('.io-chip'));
  const layers = Array.from(rootEl.querySelectorAll('.io-layer'));
  const blobs = Array.from(rootEl.querySelectorAll('.io-blob'));
  const resetBtn = rootEl.querySelector('[data-io-reset]');

  const tooltipParts = {
    eyebrow: tooltip.querySelector('.io-tooltip-eyebrow'),
    main: tooltip.querySelector('.io-tooltip-main'),
    sub: tooltip.querySelector('.io-tooltip-sub')
  };

  /* Reduced-motion early return. CSS @media block already pins every
     layer to .is-visible and disables transitions; chips remain visually
     accurate via the same media block. The hover-tooltip interactivity
     is the only thing JS needs to skip — without animation cues the
     tooltip feels jarring on hover. */
  if (prefersReduced()) {
    layers.forEach(layer => layer.classList.add('is-visible'));
    chips.forEach(chip => {
      chip.classList.add('io-chip--active');
      chip.setAttribute('aria-pressed', 'true');
    });
    return;
  }

  /* ---- Layer toggle ---- */

  function setLayerVisible(layerName, visible) {
    if (!KNOWN_LAYERS.has(layerName)) {
      console.warn('[Observatory] Unknown layer "' + layerName +
        '". Supported: friction, rage, dead, attention.');
      return;
    }
    const layerEl = rootEl.querySelector('.io-layer[data-io-layer="' + layerName + '"]');
    const chipEl = rootEl.querySelector('.io-chip[data-io-layer="' + layerName + '"]');
    if (!layerEl || !chipEl) return;

    if (visible) {
      layerEl.classList.add('is-visible');
      chipEl.classList.add('io-chip--active');
      chipEl.setAttribute('aria-pressed', 'true');
    } else {
      layerEl.classList.remove('is-visible');
      chipEl.classList.remove('io-chip--active');
      chipEl.setAttribute('aria-pressed', 'false');
      /* Hide tooltip if it was anchored to a blob in the layer we just hid. */
      if (tooltip.dataset.activeLayer === layerName) hideTooltip();
    }
  }

  function toggleLayer(layerName) {
    const layerEl = rootEl.querySelector('.io-layer[data-io-layer="' + layerName + '"]');
    if (!layerEl) return;
    const willShow = !layerEl.classList.contains('is-visible');
    setLayerVisible(layerName, willShow);
  }

  /* ---- Chip wiring ---- */

  chips.forEach(chip => {
    const layerName = chip.getAttribute('data-io-layer');
    if (!layerName) return;

    chip.addEventListener('click', () => toggleLayer(layerName));

    /* Keyboard: Space and Enter on a <button> already fire click in every
       modern browser, so no extra keydown wiring is needed. Listed here
       for the audit checklist: the <button> element + native click is
       the accessible pattern, not a custom keydown shim. */
  });

  /* ---- Reset button ---- */

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      KNOWN_LAYERS.forEach(name => {
        setLayerVisible(name, name === DEFAULT_ACTIVE_LAYER);
      });
      hideTooltip();
    });
  }

  /* ---- Tooltip ---- */

  function showTooltipForBlob(blob) {
    const layerEl = blob.closest('.io-layer');
    if (!layerEl || !layerEl.classList.contains('is-visible')) return;

    const eyebrow = blob.getAttribute('data-io-eyebrow') || '';
    const main = blob.getAttribute('data-io-main') || '';
    const sub = blob.getAttribute('data-io-sub') || '';
    const layerName = layerEl.getAttribute('data-io-layer') || '';

    if (tooltipParts.eyebrow) tooltipParts.eyebrow.textContent = eyebrow;
    if (tooltipParts.main) tooltipParts.main.textContent = main;
    if (tooltipParts.sub) tooltipParts.sub.textContent = sub;
    tooltip.dataset.activeLayer = layerName;

    /* Position above the blob in stage-local coords. getBoundingClientRect
       on a non-animated SVG circle is safe (cx/cy never change in this
       widget) and the tooltip is absolutely positioned within stage. */
    const blobRect = blob.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const x = blobRect.left - stageRect.left + blobRect.width / 2;
    const y = blobRect.top - stageRect.top - 12;

    /* Tooltip width depends on content length; measure after we set text.
       Clamp horizontal position so the tooltip never overflows stage.
       Vertical: if there's not enough room above the blob, flip below. */
    tooltip.classList.add('is-visible');
    requestAnimationFrame(() => {
      const tipRect = tooltip.getBoundingClientRect();
      const tipW = tipRect.width;
      const tipH = tipRect.height;
      const margin = 8;
      let left = x - tipW / 2;
      left = Math.max(margin, Math.min(left, stageRect.width - tipW - margin));
      let top = y - tipH;
      if (top < margin) {
        /* Flip below the blob. */
        top = blobRect.bottom - stageRect.top + 12;
      }
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
    delete tooltip.dataset.activeLayer;
  }

  blobs.forEach(blob => {
    blob.addEventListener('mouseenter', () => showTooltipForBlob(blob));
    blob.addEventListener('mouseleave', hideTooltip);
    blob.addEventListener('focus', () => showTooltipForBlob(blob));
    blob.addEventListener('blur', hideTooltip);
  });

  /* ---- Esc dismisses tooltip globally ---- */

  rootEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
  });
}
