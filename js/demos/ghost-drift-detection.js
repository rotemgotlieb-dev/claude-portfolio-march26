/* Ghost Drift Detection — Beat 3 body demo (V3 r2 polish, 2026-05-27)

   V3 r2 polish pass per `.claude/sprint-reports/2026-05-27-
   recalibration-r2-design.md` § 1B. Four surgical fixes applied to the
   2026-05-26 implementation:

   1. SMOOTHNESS — border layout-shift jank fixed in CSS (pre-allocated
      2px transparent border default; is-flagged changes only color).
   2. CENTERING — race condition fixed: pause animation FIRST, then call
      findCenteredToken() against stable layout positions.
   3. SPEED — loop compressed 6000ms → 5000ms (Beat 2 from 2200→1800ms;
      proportional cascade of marker/popup/cleanup).
   4. CLARITY — pulse dot + opacity boost on `.dd-widget-label` (CSS-only).
      The "● Scanning tokens · 21 components" signal reads as live within
      the first 2 seconds.

   Additionally: visible-margin in findCenteredToken() tightened from 40px
   to 80px to match the edge-fade gradient width. Tokens in the faded
   edge region no longer qualify as "centered candidates."

   Body-demo pattern per CLAUDE.md "Body-demo discipline":
   - 330px tall, no app chrome
   - 5s autoplay loop (V3 §1.1 body range 3–10s)
   - First action within ~600ms (scroll starts immediately at T=0)
   - Wireframe fidelity with strategic real-text (token names ARE the subject)

   Timeline (5s loop — V3 r2):
   | Beat | T (ms) | Action |
   |------|--------|--------|
   |  1   |    0   | Token row scrolling (continuous CSS animation) |
   |  2   |  1800  | Pause scroll FIRST, then find centered token + apply .is-flagged |
   |  3   |  2100  | Marker (red variant) appears |
   |  4   |  2400  | Popup with token-specific content + typing |
   |  5   |  4300  | Cleanup — popup/marker fade, flag removed |
   | seam |  4500  | Scroll resumes |
   | LOOP |  5000  | Iteration N+1; row continues scrolling seamlessly |
*/

import { Popup, Marker, LoopObserver, prefersReduced } from './_engine/index.js';

// Token-name → popup content map. Each token gets a distinct drift type
// so the demo communicates "Ghost detects MULTIPLE drift categories," not
// just one. Fallback at the end for any unmapped token name.
const TOKEN_CONTENT = {
  '$text-secondary':  { header: 'Color drift detected',   body: '−1.4:1 contrast' },
  '$shadow-sm':       { header: 'Shadow drift detected',  body: 'Opacity 0.10 → 0.18' },
  '$spacing-2':       { header: 'Spacing drift detected', body: '+4px from spec' },
  '$radius-md':       { header: 'Token renamed',          body: 'Was $radius-6' },
  '$button-primary':  { header: 'Color drift detected',   body: '−2.1:1 contrast' },
  '$border-subtle':   { header: 'Border weight drift',    body: '1px → 1.5px' },
  '$surface-card':    { header: 'Surface drift detected', body: 'Card bg shifted' },
  '$text-body':       { header: 'Color drift detected',   body: '−0.6:1 contrast' }
};
const FALLBACK_CONTENT = { header: 'Drift detected', body: 'Token deviates from spec' };

const ROOT_ID = 'ghostDriftDetection';
const root = document.getElementById(ROOT_ID);
if (root) initDriftDetection(root);

function initDriftDetection(rootEl) {
  if (prefersReduced()) {
    return; // CSS handles static flagged-state fallback
  }

  const canvas = rootEl.querySelector('.dd-widget-canvas');
  const strip = rootEl.querySelector('.dd-widget-strip');
  const row = rootEl.querySelector('.dd-widget-row');
  const allTokens = rootEl.querySelectorAll('.dd-widget-token');
  if (!canvas || !row || allTokens.length === 0) return;

  /* 2026-05-28 carousel real-fix: pixel-precise loop-seam continuity.

     The row contains 16 tokens (8 originals + 8 clones, same content in
     same order) — a 2× tile by construction. For the seam to be invisible,
     the row must translate by EXACTLY the pixel width of one list copy
     (the first 8 tokens including their margin-rights). The prior fix used
     `translateX(-50%)` which is mathematically equivalent BUT prone to
     subpixel rounding: monospace fonts produce fractional token widths;
     8 of them plus margins compounds to a fractional row width; -50% of
     a fractional width lands at a subpixel boundary that the browser may
     round to 0.5-1px off from where the first list copy ended.

     Fix: measure the exact pixel width of one list copy at init, set it
     as a CSS custom property `--dd-list-width` on the row, and the CSS
     keyframe translates by `calc(-1 * var(--dd-list-width))` — integer
     pixel precision, no rounding ambiguity. */
  function measureListWidth() {
    let total = 0;
    // First 8 tokens (originals). Each contributes its rendered width
    // (border-box) PLUS its computed margin-right.
    for (let i = 0; i < 8; i++) {
      const t = allTokens[i];
      if (!t) continue;
      const rect = t.getBoundingClientRect();
      const cs = window.getComputedStyle(t);
      const marginRight = parseFloat(cs.marginRight) || 0;
      total += rect.width + marginRight;
    }
    return total;
  }
  function applyListWidth() {
    const w = measureListWidth();
    if (w > 0) row.style.setProperty('--dd-list-width', w + 'px');
  }
  applyListWidth();
  // Re-measure on resize — token widths can change at the mobile breakpoint
  // (smaller font + reduced padding + 8px margin-right). Without re-measure,
  // a desktop→mobile resize would leave the row translating by the desktop
  // list width, breaking the seam at the new font scale.
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyListWidth, 150);
  });

  const LOOP_DURATION = 5000;

  const marker = new Marker(canvas, { number: 1, variant: 'red' });
  marker.mount();
  const popup = new Popup(canvas);
  popup.mount();

  let loopTimer = null;
  let beatTimers = [];
  // Track the currently-flagged token so cleanup can remove the class from
  // the right element (since we pick dynamically each iteration).
  let currentlyFlagged = null;

  function clearBeats() {
    beatTimers.forEach(id => clearTimeout(id));
    beatTimers = [];
  }

  function scheduleBeat(delay, fn) {
    beatTimers.push(setTimeout(fn, delay));
  }

  /* Find the token whose horizontal center is closest to canvas horizontal
     center AND is currently within the FULLY-VISIBLE area (not the edge-fade
     gradient zone). Returns the element, or null if no candidate qualifies
     under the strict filter — caller then falls back to the loosest visible
     candidate.

     V3 r2 polish (2026-05-27): visible-margin tightened from 40 → 80px to
     match the .dd-widget-strip::before/::after edge-fade gradient width.
     Tokens within 80px of the canvas edge are visually faded — flagging
     them reads as "off-center" to the viewer because the bright center area
     is canvas.left+80 to canvas.right-80. Fallback to "closest visible at
     40px margin" preserved if no token qualifies under the strict 80px
     filter. */
  function findCenteredToken() {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasCenterX = canvasRect.left + canvasRect.width / 2;
    let bestStrict = null;
    let bestStrictDist = Infinity;
    let bestLoose = null;
    let bestLooseDist = Infinity;
    allTokens.forEach(tok => {
      const r = tok.getBoundingClientRect();
      const tokCenterX = r.left + r.width / 2;
      const looseVisible = r.right > canvasRect.left + 40 && r.left < canvasRect.right - 40;
      if (!looseVisible) return;
      const dist = Math.abs(tokCenterX - canvasCenterX);
      // Track loose candidate (fallback)
      if (dist < bestLooseDist) {
        bestLooseDist = dist;
        bestLoose = tok;
      }
      // Track strict candidate (preferred — fully outside edge-fade)
      const strictVisible = r.right > canvasRect.left + 80 && r.left < canvasRect.right - 80;
      if (strictVisible && dist < bestStrictDist) {
        bestStrictDist = dist;
        bestStrict = tok;
      }
    });
    return bestStrict || bestLoose;
  }

  function runIteration() {
    // Defensive: clear any pending beats from a previous iteration. This
    // protects against rapid IO enter/exit + the prior fire scheduling
    // overlapping with the new iteration's beats.
    clearBeats();

    // Beat 1 — scrolling baseline (CSS handles motion; ensure it's running)
    row.style.animationPlayState = 'running';

    // Beat 2 (V3 r2, T=1800 was T=2200) — PAUSE FIRST, THEN find centered
    // token. The pause-then-read order eliminates the race condition where
    // findCenteredToken() runs against an in-flight scroll position. With
    // pause first, getBoundingClientRect reads stable layout positions.
    scheduleBeat(1800, () => {
      row.style.animationPlayState = 'paused';  // FIRST — freeze the row
      const target = findCenteredToken();        // THEN — read stable layout
      if (!target) {
        // Defensive: if no candidate qualifies (shouldn't happen with the
        // strict→loose fallback in findCenteredToken), resume scroll and
        // skip this iteration's flag rather than freezing forever.
        row.style.animationPlayState = 'running';
        return;
      }
      currentlyFlagged = target;
      target.classList.add('is-flagged');
    });

    // Beat 3 (V3 r2, T=2100 was T=2500) — marker appears beside flagged token
    scheduleBeat(2100, () => {
      if (!currentlyFlagged) return;
      const tokenRect = currentlyFlagged.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const x = tokenRect.left - canvasRect.left + tokenRect.width / 2;
      const y = tokenRect.top - canvasRect.top - 14;
      marker.appear({ x, y });
    });

    // Beat 4 (V3 r2, T=2400 was T=2800) — popup with token-specific content
    scheduleBeat(2400, () => {
      if (!currentlyFlagged) return;
      const tokenName = currentlyFlagged.textContent.trim();
      const content = TOKEN_CONTENT[tokenName] || FALLBACK_CONTENT;
      const tokenRect = currentlyFlagged.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      // Position popup below the flagged token. Popup is ~280px wide;
      // anchor by its left edge, offset slightly left of the token's left
      // so it doesn't overflow the canvas at narrow viewports.
      const popupX = Math.max(
        10,
        Math.min(
          tokenRect.left - canvasRect.left - 8,
          canvasRect.width - 290
        )
      );
      const popupY = tokenRect.top - canvasRect.top + tokenRect.height + 16;
      popup.show({
        x: popupX,
        y: popupY,
        header: content.header,
        cancelLabel: 'Ignore',
        submitLabel: 'Fix',
        submitVariant: 'red'
      });
      popup.typeInto(content.body, { charDelay: 30 });
    });

    // Beat 5 (V3 r2, T=4300 was T=5000) — cleanup
    scheduleBeat(4300, () => {
      popup.hide();
      marker.disappear();
      if (currentlyFlagged) {
        currentlyFlagged.classList.remove('is-flagged');
        currentlyFlagged = null;
      }
      // Seam — resume scrolling 200ms after cleanup so the popup/marker
      // fade completes cleanly before motion resumes. CRITICAL: the row's
      // animation NEVER resets — it picks up exactly where it paused, so
      // different tokens naturally cycle into center across iterations.
      setTimeout(() => {
        row.style.animationPlayState = 'running';
      }, 200);
    });

    // Schedule next iteration
    loopTimer = setTimeout(runIteration, LOOP_DURATION);
  }

  function stopLoop() {
    clearBeats();
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    row.style.animationPlayState = 'paused';
    if (currentlyFlagged) {
      currentlyFlagged.classList.remove('is-flagged');
      currentlyFlagged = null;
    }
    popup.hide();
    marker.disappear();
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => {
      runIteration();
    },
    onExit: () => {
      stopLoop();
    }
  });
  observer.start();
}
