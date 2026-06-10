# V3 Recalibration Sprint — Design Document

**Sprint scope:** apply four specific V3 canonical motion specification fixes from `.claude/canonical-motion-spec.md` Appendix A.2 to the existing AI Fix Flow hero and Drift Detection Beat 3. No new features, no architecture rewrites, no scope creep.

**The four fixes:**
1. Cursor traversal easing — Penner easeOutQuad → ease-in-out for on-screen-to-on-screen moves
2. Cursor click feedback — add stamping motion (translateY + drop-shadow shift), retire the scale-based pulse for hero clicks
3. Multi-step Apply→done rhythm — uniform 333ms → snap-pause-snap (T+150, T+750, T+900, done T+1000)
4. Zero-position loop reset — complete the existing resetAllState coverage

This document is the COMPLETE plan. Phase 2 implements EXACTLY this design. Any deviation discovered during implementation gets logged with rationale.

---

## Section 1 — Diagnostic pass on current hero

### 1A. Beat-by-beat audit table

Source: `js/demos/ghost-ai-fix-flow-hero.js` (the choreography-sprint output from earlier today, 14 timestamps for 9 narrative beats).

| # | Beat | T (ms) | Action | Click? | Motion class | Current easing |
|---|------|--------|--------|--------|--------------|----------------|
| — | Mount | (startLoop) | Cursor snaps to rest position + fades in (first iter only) | No | First mount only | opacity 200ms ease (correct for arrival) |
| 1 | Rest | 0 | Cursor stationary above first deviation row | No | None (stationary) | — |
| 2 | 2a | 700 | Cursor moves to first row + adds `.is-hovered` | No | **Traversal** (on-screen → on-screen) | Penner easeOutQuad 400ms (WRONG per V3) |
| 3 | 2b | 1400 | `cursor.click()` + first row gets `.is-clicked` + marker 1 appears | YES | Click only | `demo-cursor-pulse` scale keyframe (V3 wants stamping) |
| 4 | 3 | 1800 | Detail panel opens (`.is-open` triggers CSS transition) | No | UI state change | back-out 250ms (CSS — not cursor) |
| 5 | 4 | 4200 | Cursor moves to Apply button | No | **Traversal** | Penner easeOutQuad 400ms (WRONG per V3) |
| 6 | 5a | 5000 | `cursor.click()` + Apply button `.is-pressed` (scale 0.97) | YES | Click only | scale keyframe (V3 wants stamping) |
| 7 | 5b | 5400 | `blurCrossfade(idle, applying, BLUR_HEAVY)` | No | UI state change | 250ms ease (CSS — correct) |
| 8 | 6a | 5733 | Step 1 spinner→check + progress 33% | No | UI state change | data-attribute swap (instant) |
| 9 | 6b | 6066 | Step 2 spinner→check + progress 66% | No | UI state change | data-attribute swap (instant) |
| 10 | 6c | 6400 | Step 3 spinner→check + progress 100% | No | UI state change | data-attribute swap (instant) |
| 11 | 7 | 6700 | `blurCrossfade(applying, done, BLUR_HEAVY)` | No | UI state change | 250ms ease (correct) |
| 12 | 8 | 7000 | Concurrent ripples (strike + delta + Fixed badge) | No | UI state change | individual CSS transitions (correct) |
| 13 | 9a | 10500 | Cursor moves to X close button + `.is-hovered` | No | **Traversal** | Penner easeOutQuad 400ms (WRONG per V3) |
| 14 | 9b | 11200 | `cursor.click()` + X `.is-clicked` + panel slide-shut + cleanup | YES | Click only | scale keyframe (V3 wants stamping) |
| 15 | 10 | 11300 | Cursor moves to rest (settling, 700ms via `opts.duration`) | No | **Traversal** | `_moveWithDuration` hardcoded Penner easeOutQuad (WRONG per V3) |

**Summary of changes needed:**
- 4 cursor moves currently use Penner easeOutQuad — all four should switch to ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`
- 3 click events currently use scale-based pulse — all three should switch to stamping motion
- Apply→done section (rows 6–11) needs snap-pause-snap restructure

### 1B. Diagnostic pass on current Beat 3

Source: `js/demos/ghost-drift-detection.js` (choreography-sprint output, fixed and shipped earlier today).

**Animated properties in the 6s loop:**

| # | Property | Changes when | Currently reset by |
|---|----------|--------------|--------------------|
| 1 | `.dd-widget-row` `animationPlayState` | Pauses at Beat 2 (T=2200), resumes at Beat 5+200ms (T=5200) | `stopLoop()` (on IO exit) + `runIteration()` ALWAYS sets to 'running' at start |
| 2 | `currentlyFlagged.classList` `is-flagged` | Added Beat 2, removed Beat 5 | `stopLoop()` (on IO exit). NOT defensively cleared in `runIteration()` start. |
| 3 | Marker `.is-visible` (via marker.appear/disappear) | Added Beat 3, removed Beat 5 | `stopLoop()` (on IO exit). NOT defensively cleared. |
| 4 | Popup `.is-visible` (via popup.show/hide) | Added Beat 4, removed Beat 5 | `stopLoop()` (on IO exit). NOT defensively cleared. |
| 5 | Popup input text (typeInto target) | Set Beat 4, overwritten at next Beat 4 | Implicit — overwritten on next iteration |
| 6 | `currentlyFlagged` module variable | Set Beat 2, cleared Beat 5 | `stopLoop()` (on IO exit) + Beat 5 cleanup |

**Gap analysis:**
- `runIteration()` currently does `clearBeats()` (defensive timer clear) + `animationPlayState = 'running'`, but does NOT defensively clear `is-flagged`, marker, popup, or `currentlyFlagged`.
- In normal flow, Beat 5 cleans these up before the next `runIteration()` fires, so this works.
- In abnormal flow (mid-iteration tab switch where `onExit` fires `stopLoop` then `onEnter` fires `runIteration`), the stopLoop path already cleans state — so this is also covered.
- **The ONLY truly uncovered case:** if a beat's setTimeout fires AFTER stopLoop has cleared beatTimers (e.g., between the clearTimeout call and JS event loop, an in-flight callback could still execute). Defensive: add explicit state clear at runIteration start.

**Per V3 spec:** the zero-position reset should fire AT timeline position 0 (iteration start). The current Beat 3 implementation does NOT have this. Adding it is the Phase 3 fix.

---

## Section 2 — The recalibrated hero — beat-by-beat plan

Same 9 narrative beats. Same loop duration (16s desktop / 14s mobile). Changes are SURGICAL.

### 2A. Cursor easing — change global default + override mechanism

**CSS change:** `.demo-cursor` `transition` rule changes:

```css
/* BEFORE (V2) */
transition:
  left 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),  /* Penner easeOutQuad — wrong for traversal */
  top  400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
  opacity 200ms ease,
  transform 150ms cubic-bezier(0.16, 1, 0.3, 1);

/* AFTER (V3) */
transition:
  left 400ms cubic-bezier(0.77, 0, 0.175, 1),       /* ease-in-out — correct for traversal */
  top  400ms cubic-bezier(0.77, 0, 0.175, 1),
  opacity 200ms ease,                                /* unchanged — opacity = fade-in arrival is fine */
  transform 150ms cubic-bezier(0.16, 1, 0.3, 1);    /* unchanged — for the new stamp animation */
```

**JS change:** `Cursor._moveWithDuration()` mirrors the new curve. Hardcoded `cubic-bezier(0.25, 0.46, 0.45, 0.94)` → `cubic-bezier(0.77, 0, 0.175, 1)`.

**Future extensibility:** extend `moveTo()` to accept `opts.easing` for cases where a demo needs arrival or exit easing (cursor entering from offscreen, or leaving). Not used by the current hero (all moves are traversal), but documented for Pulse/LexisNexis demos.

**Rationale:** 100% of the current hero's cursor moves are traversal (cursor is on-screen for the entire loop). Changing the CSS default to ease-in-out is correct for the dominant case. No per-move overrides needed in the hero code. Beat 10's slower 700ms move keeps its duration override (`opts.duration`), but the easing in `_moveWithDuration` becomes ease-in-out automatically.

### 2B. Cursor click stamping motion

**CSS additions:**

```css
/* Heavier base shadow — implies cursor is elevated above surface */
.demo-cursor {
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.2));
}

/* New stamping animation — replaces scale-based pulse for V3-compliant click feedback */
.demo-cursor.is-stamping {
  animation: demo-cursor-stamp 200ms cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes demo-cursor-stamp {
  0%   { transform: translateY(0);   filter: drop-shadow(0 5px 8px rgba(0,0,0,0.2)); }
  40%  { transform: translateY(5px); filter: drop-shadow(0 0   4px rgba(0,0,0,0.2)); }
  100% { transform: translateY(0);   filter: drop-shadow(0 5px 8px rgba(0,0,0,0.2)); }
}
```

**JS additions to `Cursor` primitive:**

```js
clickStamp() {
  if (!this.el) return;
  this.el.classList.remove('is-stamping');
  void this.el.offsetWidth;  // force reflow to restart animation on rapid re-fire
  this.el.classList.add('is-stamping');
}
```

**Hero migration:** all three `cursor.click()` calls (Beats 2b, 5a, 9b) become `cursor.clickStamp()`. The existing `cursor.click()` method stays (backwards-compat) but is deprecated via JSDoc note. Existing scale-based `demo-cursor-pulse` keyframe stays in CSS (used only by deprecated `click()`).

**Rationale per V3 §2.1:** cursor depresses INTO the surface on click (biomechanically correct) — shadow flattens (lifted → planted), Y translates 5px down. The TARGET element still does `scale(0.97)` (Kowalski). Two distinct responses to one click event.

### 2C. The recalibrated Apply→done section (snap-pause-snap)

**Current V2 sub-timing (Apply click as T=0):**

| Beat | T (ms) | Action |
|------|--------|--------|
| 5a | 0 | Apply click + button press |
| 5b | 400 | Crossfade idle→applying |
| 6a | 733 | Step 1 |
| 6b | 1066 | Step 2 |
| 6c | 1400 | Step 3 |
| 7 | 1700 | Crossfade applying→done |
| 8 | 2000 | Ripples |

Block duration: 2000ms. Uniform 333ms inter-step intervals = metronomic.

**V3 sub-timing (Apply click as T=0):**

| Beat | T (ms) | Action | Rhythm role |
|------|--------|--------|-------------|
| 5a (merged with 5b) | 0 | Apply click + button press + crossfade idle→applying (no 400ms gap) | **Snap 1** |
| 6a | 150 | Step 1 spinner→check + progress 33% | Quick confirmation |
| 6b | 750 | Step 2 spinner→check + progress 66% | **Pause** — load-bearing 600ms |
| 6c | 900 | Step 3 spinner→check + progress 100% | Rapid wrap-up |
| 7 | 1000 | Crossfade applying→done | **Snap 2** |
| 8 | 1300 | Ripples | (300ms post-resolution beat) |

Block duration: 1300ms (vs 2000ms V2). 700ms saved.

**Absolute timeline (Apply click stays at T=5000):**

| Beat | T (ms) | Action |
|------|--------|--------|
| 5 (merged 5a+5b) | 5000 | `cursor.clickStamp()` + `applyBtn.is-pressed` + `blurCrossfade(flowIdle, flowApplying, BLUR_HEAVY)` simultaneously |
| 6a | 5150 | Step 1 check + progress 33% |
| 6b | 5750 | Step 2 check + progress 66% |
| 6c | 5900 | Step 3 check + progress 100% |
| 7 | 6000 | `blurCrossfade(flowApplying, flowDone, BLUR_HEAVY)` |
| 8 | 6300 | Concurrent ripples |

**Post-ripple beats stay at their current absolute times** (9a at 10500, 9b at 11200, 10 at 11300, loop at 16000). The 700ms savings from the compressed Apply→done block absorbs into a slightly longer pre-Beat-9a absorption dwell (6300→10500 = 4200ms vs prior 7000→10500 = 3500ms). The absorption dwell is a "scan the resolved state" period; longer is acceptable for portfolio demos. **No reduction of LOOP_DURATION.**

### 2D. Full recalibrated timeline (desktop 16s)

| # | Beat | T (ms) | Action | Motion class | Easing |
|---|------|--------|--------|--------------|--------|
| 1 | Rest | 0 | Cursor stationary above first row | — | — |
| 2 | 2a | 700 | Cursor → first row + `.is-hovered` | Traversal | **ease-in-out 400ms** ✓ |
| 3 | 2b | 1400 | `cursor.clickStamp()` + row `.is-clicked` + marker | Click | **Stamping** ✓ |
| 4 | 3 | 1800 | Detail panel opens | UI state | CSS 250ms back-out |
| 5 | 4 | 4200 | Cursor → Apply button | Traversal | **ease-in-out 400ms** ✓ |
| 6 | **5 (merged 5a+5b)** | **5000** | **`cursor.clickStamp()` + button press + crossfade idle→applying** | Click + UI | **Stamping + 250ms ease** ✓ |
| 7 | 6a | **5150** | **Step 1 check + progress 33%** | UI state | instant |
| 8 | 6b | **5750** | **Step 2 check + progress 66%** (load-bearing pause) | UI state | instant |
| 9 | 6c | **5900** | **Step 3 check + progress 100%** | UI state | instant |
| 10 | 7 | **6000** | **Crossfade applying→done** | UI state | 250ms ease |
| 11 | 8 | **6300** | **Concurrent ripples** | UI state | individual transitions |
| 12 | 9a | 10500 | Cursor → X close + `.is-hovered` | Traversal | **ease-in-out 400ms** ✓ |
| 13 | 9b | 11200 | **`cursor.clickStamp()`** + X `.is-clicked` + panel slide-shut + cleanup | Click + UI | **Stamping** ✓ |
| 14 | 10 | 11300 | Cursor → rest (700ms settling move) | Traversal | **ease-in-out 700ms** ✓ |
| — | Rest | ~12000 | Cursor settled at rest | — | — |
| LOOP | 16000 | Iteration N+1 begins; cursor already at rest |

**Mobile compression:** `MOBILE_DELTA = -200ms` continues to apply to Beats 9a, 9b, 10. LOOP_DURATION 14000ms on mobile.

**Beats in V3 hero: still 9 narrative beats.** Beats 5a + 5b merged into one (Snap 1), but the merged Beat 5 has two simultaneous effects so the narrative beat count is unchanged.

### 2E. Self-critique pass

| Beat | Earns place? | Easing correct per V3? | Duration in V3 range? | Dwell justified? |
|------|--------------|-------------------------|------------------------|-------------------|
| 1 — Rest | YES (sets context) | N/A | N/A | 700ms — short hop transit ✓ |
| 2a — Move + hover first row | YES (selection target) | ease-in-out 400ms ✓ | 350–450ms range ✓ | 700ms pre-click ✓ |
| 2b — Click first row | YES (the selection) | Stamping ✓ | 200ms stamp duration ✓ | 400ms before panel opens ✓ |
| 3 — Panel opens | YES (product thesis) | CSS 250ms back-out ✓ | 200–300ms range ✓ | 2400ms reading time — justified by 5 UI elements ✓ |
| 4 — Cursor to Apply | YES (bridges read→act) | ease-in-out 400ms ✓ | 350–450ms range ✓ | 800ms pre-click — natural hover dwell ✓ |
| 5 — Apply + crossfade (merged) | YES (commit moment, Snap 1) | Stamping + 250ms crossfade ✓ | 200ms stamp ✓ | 150ms before Step 1 — V3 spec ✓ |
| 6a/b/c — Steps | YES (process visible) | instant data-state swap ✓ | N/A | 150 → 600 → 150 ms intervals — snap-pause-snap ✓ |
| 7 — Crossfade done (Snap 2) | YES (resolution) | 250ms blur(16px) ✓ | V3 spec ✓ | 300ms before ripples — V3 wrap-up timing ✓ |
| 8 — Ripples | YES (cascade narrative) | individual CSS transitions ✓ | each under 300ms ✓ | 4200ms absorption — over V3 spec but acceptable for portfolio reading ✓ |
| 9a — Cursor to X | YES (loop seam initiator) | ease-in-out 400ms ✓ | 350–450ms range ✓ | 700ms hover before click ✓ |
| 9b — Click X | YES (close action) | Stamping ✓ | 200ms stamp ✓ | 100ms before cursor moves away (Beat 10) ✓ |
| 10 — Cursor to rest | YES (loop seam closer) | ease-in-out 700ms ✓ | settling move (V3 long traversal) ✓ | settles at ~12000ms, terminal dwell ~4000ms — over V3 spec, same as current |

**Result of critique:** all 9 narrative beats earn their place. No cuts. The four V3 fixes are surgical and don't disturb the narrative architecture.

### 2F. Cuts attempted but rejected

- Could Beat 5b's 400ms gap (V2's "system feedback latency") be partially preserved? Considered. Rejected because V3 §2.4 explicitly says "Snap 1 — instant feedback within 100ms of trigger." The 400ms gap WAS perceived as making the system feel deliberate, but V3 research shows it actually reads as lag. Merging Beat 5a+5b is the V3-correct call.
- Could the 4200ms absorption dwell post-ripples be tightened? Considered. Rejected for this sprint because it's not one of the four V3 fixes — V3 Section 2.3 is "polyrhythmic dwell discipline," a future polish target. Logged in §5 Future Polish below.

---

## Section 3 — Zero-position reset plan

### 3A. Current resetAllState() coverage

Already covered (per existing code at lines 103–124 of `ghost-ai-fix-flow-hero.js`):

- ✓ `rows[*]` — `is-hovered`, `is-clicked` classes removed
- ✓ `detailPanel` — `is-open` class removed
- ✓ `closeBtn` — `is-hovered`, `is-clicked` classes removed
- ✓ `applyBtn` — `is-pressed` class removed
- ✓ `flowIdle` — `is-active` class added, opacity 1, filter blur 0
- ✓ `flowApplying` — `is-active` removed, opacity 0, filter blur 16
- ✓ `flowDone` — `is-active` removed, opacity 0, filter blur 16
- ✓ `flowSteps[*]` — data-state set to 'spinner'
- ✓ `progressFill` — width 0%
- ✓ `foundHex` — `is-struck` removed
- ✓ `delta` — `is-resolved` removed, text content restored
- ✓ `fixedBadge` — `is-visible` removed
- ✓ `marker1` — disappear()

### 3B. Missing properties to add to reset

Per V3 canonical-motion-spec.md §4.1 Rule 5: "restore EVERY animated property to its origin."

| # | Property | Needs reset? | Reason |
|---|----------|--------------|--------|
| 1 | `cursor.el.classList.is-clicking` | YES (defensive) | Set by old `cursor.click()`. If hero migrates to `clickStamp()`, this should not be set, but defensive cleanup prevents stuck class if a code path slips through. |
| 2 | `cursor.el.classList.is-stamping` | YES (defensive) | NEW class from V3 stamping. Animation auto-completes in 200ms, but defensive cleanup prevents stuck class. |
| 3 | `cursor.el.style.transition` | YES (defensive) | `_moveWithDuration` sets inline `transition` and restores on transitionend. If iteration is interrupted (tab switch) mid-settling-move, the inline transition could remain. Defensive clear. |
| 4 | `cursor.el.style.transform` | NO | Stamping uses CSS animation keyframe, not inline transform. Animation lifecycle handles restoration. |
| 5 | `cursor` position (left/top) | NO | Continuous loop seam design — cursor position at end of iter N = rest position = start of iter N+1. Resetting position would break the seam. |
| 6 | `delta.textContent` | ALREADY DONE | Existing code restores to "Delta: −1.4:1 contrast" |
| 7 | `closeBtn.is-clicked` setTimeout cleanup | ALREADY DONE | Class added then setTimeout(remove, 200) inline at Beat 9b. resetAllState also removes defensively. |
| 8 | `applyBtn.is-pressed` setTimeout cleanup | ALREADY DONE | Same pattern. |
| 9 | Inline `style.opacity` and `style.filter` on flow cards | ALREADY DONE | resetAllState explicitly restores these inline values (set by blurCrossfade). |
| 10 | Inline `style.width` on progressFill | ALREADY DONE | Set to '0%'. |

**Three additions** to resetAllState():

```js
// Cursor defensive cleanup (V3 zero-position reset)
if (cursor.el) {
  cursor.el.classList.remove('is-clicking', 'is-stamping');
  cursor.el.style.transition = '';  // restore CSS default if overridden by _moveWithDuration
}
```

### 3C. Beat 3 (drift detection) reset plan

Per V3 spec — add an explicit reset block at `runIteration()` start, alongside the existing `clearBeats()` call. The reset is DEFENSIVE — normal Beat 5 cleanup is sufficient in happy-path flow, but iteration interruption could leave stuck state.

```js
function resetIterationState() {
  // Defensive zero-position reset — fires at iteration start.
  if (currentlyFlagged) {
    currentlyFlagged.classList.remove('is-flagged');
    currentlyFlagged = null;
  }
  popup.hide();
  marker.disappear();
  // animationPlayState='running' already set below; no need to duplicate
}
```

Called as the FIRST action of `runIteration()`, before `clearBeats()`. (Or right after `clearBeats()`; order doesn't matter for these properties.)

---

## Section 4 — Risk surface

### 4A. Cursor primitive changes

**Risk:** changing `.demo-cursor` CSS default easing to ease-in-out affects EVERY demo that uses the cursor.

**Inventory of cursor consumers:**
- `js/demos/ghost-ai-fix-flow-hero.js` — YES, uses cursor. THE recalibration target.
- `js/demos/ghost-drift-detection.js` — NO, no cursor.
- `js/demos/ghost-view-modes-widget.js` — NO, interactive widget without cursor.
- `js/demos/ghost-slider.js` — NO, interactive widget without cursor.
- The archived `ghost-view-modes.js` — N/A (deleted from live tree).

**Conclusion:** only the hero uses the cursor. Changing the CSS default is safe — no regression risk on other demos.

### 4B. Adding clickStamp() vs replacing click()

**Risk:** existing `cursor.click()` callers in the hero (3 sites). If we replace `click()` semantics, any other consumer of `click()` (sandbox files? archived demos?) breaks.

**Mitigation:** ADD `clickStamp()` as a NEW method. Keep `click()` unchanged (still does scale pulse). Hero migrates to `clickStamp()`. The old `demo-cursor-pulse` keyframe stays in CSS. Marked with JSDoc note that `click()` is the V2 pattern, `clickStamp()` is V3-canonical.

**Backward compatibility:** sandbox files (sandbox-engine.html, sandbox-engine-v2.html, sandbox-demo-frame.html) — none import `Cursor` directly for click testing. Engine sandbox v2 tests Popup, Marker, blurCrossfade only. Safe.

### 4C. Snap-pause-snap restructure

**Risk:** changing the Apply→done absolute timestamps shifts downstream timing. Beat 9a at T=10500 currently runs 3500ms after ripples; with snap-pause-snap, ripples shift up to T=6300, so the dwell becomes 4200ms.

**Assessment:** the increased dwell is over V3's 2500ms absorption-dwell cap but matches the pre-V3 timing character (V2 already had 3500ms here). Not a regression. Logged as a future polish item per §5.

**Mitigation:** if user prefers tightening to 2500ms in morning review, shift post-ripple beats up by 1700ms (9a → 8800, 9b → 9500, 10 → 9600, rest at 10300, terminal dwell 5700ms which would FURTHER exceed terminal cap). Trade-off: less absorption dwell vs more terminal dwell. NOT recommended — leave the absorption dwell at 4200ms.

### 4D. Zero-position reset additions

**Risk:** adding cursor.el.style.transition = '' could clobber an in-flight transition override. If runIteration() fires while _moveWithDuration is mid-flight, the inline transition is cleared mid-move, causing the CSS default to take over for the remaining duration.

**Mitigation:** runIteration() fires ONLY at iteration boundaries (LOOP_DURATION timer) or onEnter (after stopLoop). By design, no in-flight move at iteration start. The reset is purely defensive — clearing a state that should already be clean.

**Edge case:** if Beat 10's 700ms settling move (T=11300) is still in progress when LOOP_DURATION fires (T=16000), the cursor would be at rest position (11300+700=12000ms, well before 16000). Safe.

### 4E. Mobile compression interaction

**Risk:** MOBILE_DELTA = -200ms applies to Beat 9a, 9b, 10 currently. With timestamps unchanged for these beats, MOBILE_DELTA semantics are unchanged.

**Mitigation:** no change needed. MOBILE_DELTA continues to shift post-ripple beats up by 200ms on mobile (14s vs 16s desktop).

### 4F. Step row visual dimming (V3 §2.4 — IN SCOPE if simple, deferred otherwise)

**V3 spec calls for:** inactive step rows at 30–40% opacity slate; active step at 100% opacity with micro-checkmark over 150ms.

**Current implementation:** step icon uses `data-state="spinner"` or `data-state="check"` with CSS background-image swap. Step LABEL is always 100% opacity.

**Implementation cost assessment:**
- Adding opacity-based dimming on inactive step ROW (not just the icon) requires:
  - CSS rule: `.fix-hero-flow-step:not(.is-active) { opacity: 0.35; }` (or similar)
  - JS: each step row gets `.is-active` class added when its check fires
- This is ~5 lines of CSS and ~3 lines of JS. **Light enough to include in this sprint.**

**Decision:** INCLUDE this in Phase 2. Simple addition; aligns the demo with V3 §2.4 "Linear calm-interface" visual restraint rule.

---

## Section 5 — Future polish items NOT in this sprint

Documented for completeness. Out of scope per the four-fix charter.

1. **Cursor path curvature (V3 §2.1 Arcs).** 10–25% deviation via asymmetric X/Y easing. Requires applying different easings to `left` and `top` in CSS — straightforward but distinct from this sprint's traversal-easing fix.
2. **Cursor anticipation/overshoot (V3 §2.1).** 2–5% past target via spring approximation. Would require restructuring `moveTo()` to overshoot then snap back.
3. **Absorption dwell tightening.** Current 4200ms exceeds V3's 2500ms cap. Tightening means shifting Beat 9a earlier OR reducing LOOP_DURATION below 16000ms (which V3 allows — range is 8–16s).
4. **Polyrhythmic dwell (V3 §2.3).** Vary dwell across beats by cognitive weight (current dwells are mostly uniform 3500ms for absorption / 700ms for transits).
5. **Single Unified Timeline migration (V3 §4).** Replace `setTimeout`-chain orchestration with a master timeline + label-based offsets. Deferred to Pulse case study per V3 Appendix A.3.

---

## Section 6 — Implementation plan summary

### Files to modify in Phase 2

1. **`styles.css`** — three changes to the `.demo-cursor` block:
   - `transition` easing curves for `left`/`top`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` → `cubic-bezier(0.77, 0, 0.175, 1)`
   - `filter`: `drop-shadow(0 1px 2px rgba(0,0,0,0.2))` → `drop-shadow(0 5px 8px rgba(0,0,0,0.2))`
   - Add new `.is-stamping` rule + `demo-cursor-stamp` keyframe
   - (Step row dimming) — add `.fix-hero-flow-step` opacity rules
2. **`js/demos/_engine/cursor.js`** — three changes:
   - `_moveWithDuration` hardcoded curves: Penner → ease-in-out
   - Add new `clickStamp()` method
   - Update file header doc-comment to document the V3 easing stratification + stamping pattern
3. **`js/demos/ghost-ai-fix-flow-hero.js`** — three changes:
   - 3 sites: `cursor.click()` → `cursor.clickStamp()`
   - Apply→done timeline: merge 5a+5b at T=5000; shift 6a/6b/6c/7/8 to V3 snap-pause-snap timings; update header doc-comment timeline table
   - `resetAllState()` — add 3 cursor defensive cleanup lines
   - (Step row dimming) — toggle `.is-active` class on each `.fix-hero-flow-step` as its check fires; clear at reset
4. **`work/ghost.html`** — cache-bust references:
   - `styles.css?v=41` → `?v=42`
   - `ghost-ai-fix-flow-hero.js?v=2` → `?v=3`
5. **All 11 active HTML files** — cache-bust styles.css to v=42

### Phase 3 plan (Beat 3 reset only)

1. **`js/demos/ghost-drift-detection.js`** — add `resetIterationState()` function called at `runIteration()` start.
2. **`work/ghost.html`** — cache-bust `ghost-drift-detection.js?v=2` → `?v=3`.

### Verification per phase

- Phase 2: read modified files end-to-end; grep for orphaned old values (333ms intervals, old easing string, old filter shadow); Node syntax check; bundle measurement; PAUSE for user visual review.
- Phase 3: same plus confirm reset is called at iteration start.

---

## Section 7 — User decision points

If anything in this design needs adjustment, please flag during the review pause:

1. **Step row dimming inclusion (§4F):** I propose including it as part of Phase 2 (assessed as light: ~8 total lines added). User can defer to a separate sprint if preferred.
2. **Absorption dwell length (§4C):** 4200ms post-ripples is over V3's 2500ms spec but matches V2 character. User can request tightening (would shift Beat 9a from T=10500 to T=8800 and create a 5700ms terminal dwell — not recommended). I propose leaving as-is and logging as future polish.
3. **`click()` deprecation:** I propose KEEPING `click()` in the Cursor primitive (backward compat) and ADDING `clickStamp()` alongside. User can request full replacement if cleanliness > compatibility.

If you confirm these defaults, Phase 2 implements exactly Section 6.

---

*End of design document. Awaiting user review before Phase 2 implementation.*
