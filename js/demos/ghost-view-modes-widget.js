/* Ghost View Modes — interactive widget (V2 sprint Phase 4, 2026-05-25)

   Replaces the prior autoplay choreography per Decision 2 of the V2
   master report. Control surfaces are interactive (user-driven),
   not autoplay-looped. Body-demo pattern per CLAUDE.md "Body-demo
   discipline" standing rule.

   Interaction model — ARIA tablist:
   - Click a chip: switch to that mode via blurCrossfade.
   - Arrow Left / Right: cycle through modes.
   - Tab into widget: focus lands on currently selected chip.
   - Only the selected chip has tabindex="0"; others -1.
   - aria-live region announces "View mode changed to <label>".

   Reduced motion: instant swap, no blur transition.
*/

import { blurCrossfade, BLUR_LIGHT, prefersReduced } from './_engine/index.js';

const ROOT_ID = 'ghostViewModesWidget';
const root = document.getElementById(ROOT_ID);
if (root) initViewModesWidget(root);

function initViewModesWidget(rootEl) {
  const chips = Array.from(rootEl.querySelectorAll('.vm-widget-chip'));
  const modes = Array.from(rootEl.querySelectorAll('.vm-widget-mode'));
  const liveRegion = rootEl.querySelector('.vm-widget-live');

  if (chips.length === 0 || modes.length === 0) return;

  // Activate the initial mode (slider) so opacity:1 + blur:0 are set.
  const initialChip = chips.find(c => c.getAttribute('aria-selected') === 'true') || chips[0];
  const initialMode = modes.find(m => m.dataset.vmCanvas === initialChip.dataset.vmMode);
  if (initialMode) {
    initialMode.classList.add('is-active');
    initialMode.style.opacity = '1';
    initialMode.style.filter = 'blur(0px)';
    initialMode.removeAttribute('hidden');
  }
  // Ensure non-active modes have hidden attribute removed but opacity 0
  modes.forEach(m => {
    if (m !== initialMode) {
      m.removeAttribute('hidden');
      m.classList.remove('is-active');
      m.style.opacity = '0';
      m.style.filter = 'blur(2px)';
    }
  });

  let currentMode = initialChip.dataset.vmMode;
  let currentChip = initialChip;
  let currentModePanel = initialMode;

  function switchTo(targetChip) {
    if (!targetChip || targetChip === currentChip) return;
    const newMode = targetChip.dataset.vmMode;
    const newModePanel = modes.find(m => m.dataset.vmCanvas === newMode);
    if (!newModePanel) return;

    // ARIA state sync
    chips.forEach(c => {
      c.setAttribute('aria-selected', c === targetChip ? 'true' : 'false');
      c.setAttribute('tabindex', c === targetChip ? '0' : '-1');
    });

    if (prefersReduced()) {
      // Instant swap — no blur
      if (currentModePanel) {
        currentModePanel.classList.remove('is-active');
        currentModePanel.style.opacity = '0';
        currentModePanel.style.filter = 'blur(0)';
      }
      newModePanel.classList.add('is-active');
      newModePanel.style.opacity = '1';
      newModePanel.style.filter = 'blur(0)';
    } else {
      blurCrossfade(currentModePanel, newModePanel, { blur: BLUR_LIGHT, duration: 200 });
    }

    // Announce
    if (liveRegion) {
      liveRegion.textContent = 'View mode changed to ' + targetChip.textContent.trim();
    }

    currentMode = newMode;
    currentChip = targetChip;
    currentModePanel = newModePanel;
  }

  // Click handlers
  chips.forEach(chip => {
    chip.addEventListener('click', () => switchTo(chip));
  });

  // Keyboard nav — ArrowLeft / ArrowRight cycles; Space / Enter activates
  rootEl.addEventListener('keydown', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (!e.target.classList.contains('vm-widget-chip')) return;
    const idx = chips.indexOf(e.target);
    if (idx === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = chips[(idx + 1) % chips.length];
      switchTo(next);
      next.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = chips[(idx - 1 + chips.length) % chips.length];
      switchTo(prev);
      prev.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      switchTo(chips[0]);
      chips[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      switchTo(chips[chips.length - 1]);
      chips[chips.length - 1].focus();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      switchTo(e.target);
    }
  });
}
