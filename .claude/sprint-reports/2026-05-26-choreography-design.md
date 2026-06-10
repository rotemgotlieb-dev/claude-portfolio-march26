# Choreography Design Document — 2026-05-26

**Purpose:** Frame-by-frame design of the Ghost case study's two motion demos AFTER the V2 sprint shipped their structural V1. This document is what a future designer or AI agent reads to rebuild these demos from scratch. Every beat must earn its place.

**Subjects covered:**
1. AI Fix Flow hero demo — rewrite for compressed Apply→done + crafted loop seam
2. Beat 3 drift detection demo — rewrite for center-locked flagging + token variation + autoplay bug fix

**Reference patterns:**
- `.claude/research/2026-05-25_benji-componentization-philosophy.md` — Benji body/hero discipline
- `.claude/design-decisions.md` "Hero-vs-body framework" + "Verified motion specifications"
- `.claude/CLAUDE.md` "Body-demo discipline" standing rule

---

## Part 1 — AI Fix Flow hero (rewrite)

### Total budget

- **Loop duration:** 14000ms mobile, 16000ms desktop (viewport-conditional, unchanged from V1)
- **Narrative beats:** 9 (down from 12 in V1 — every cut documented in §1.4)
- **Continuous loop seam:** YES — closes the detail panel as the final action; opens loop N+1 from the same cursor rest position
- **Opening cursor mount:** Only on first iteration (200ms fade-in); subsequent iterations skip mount

### 1.1 Beat-by-beat narrative (desktop, 16s)

#### Beat 1 — Rest (T=0 to T=700)
- **What:** Cursor at rest position, just above the first deviation row. This is where iteration N-1 settled at its loop seam.
- **Why this earns its place:** The eye needs a moment to register the panel context before motion begins. The cursor's positioning above the first row pre-signals "browsing the deviation list" — the next action is implied before it happens.
- **Motion:** Static. Cursor visible at fixed position from previous loop seam.
- **Dwell after:** N/A — cursor moves at T=700.

#### Beat 2 — Move to + click first row (T=700 to T=1500)
- **What:** Cursor moves from rest to first deviation row center. At T=1400, click pulse fires and the row enters `.is-clicked` state (background tint + green left border). Marker 1 appears beside the row at T=1500.
- **Why this earns its place:** This IS the central interaction — the user selecting a specific deviation to inspect. Without this beat, the rest of the demo has no subject.
- **Motion:** `cursor.moveTo(firstRowCenter)` at T=700 — default 400ms Penner easeOutQuad. Click pulse 150ms ease-in-out at T=1400. Marker appears T=1500 with 300ms ease-out-quint scale.
- **Dwell after:** 300ms (T=1500 → T=1800) — just enough for the click to register visually.

#### Beat 3 — Detail panel opens (T=1800 to T=4200)
- **What:** Detail panel fades in + scales from 0.98 to 1.0 with back-out easing. Reveals: Breaking + Critical badges (Fixed badge hidden), Expected/Found color swatches with hex values, Delta "−1.4:1 contrast" in red, AI recommendation card (indigo-tinted), Apply Fix button, idle-state fix-flow card.
- **Why this earns its place:** This is where the demo's PRODUCT thesis lands — "Ghost detects deviations and tells you exactly what to fix." 2.4 seconds of dwell here is the design's reading time budget. Cut this and the viewer doesn't learn what Ghost does.
- **Motion:** `.fix-hero-detail-panel.is-open` triggers CSS transition: 250ms opacity + 250ms cubic-bezier(0.34, 1.56, 0.64, 1) transform.
- **Dwell after:** 2400ms (T=1800 → T=4200) — the reading time. Long, but earned: the viewer needs to scan 5 distinct UI elements before the demo's next action.

#### Beat 4 — Cursor moves to Apply button (T=4200 to T=5000)
- **What:** Cursor moves from first-row position to Apply Fix button center. The cursor lands ON the button at T=4800 (small dwell on button before press at T=5000).
- **Why this earns its place:** Bridges "I've read the recommendation" to "I'm acting on it." Cutting this would make the Apply event feel disconnected from the user.
- **Motion:** `cursor.moveTo(applyBtnCenter)` — default 400ms Penner easeOutQuad. Settles by T=4800.
- **Dwell after:** 200ms (T=4800 → T=5000) — finger-hovers-button moment.

#### Beat 5 — Apply click + crossfade to applying state (T=5000 to T=5400)
- **What:** At T=5000: cursor.click() pulse + button.classList.add('is-pressed') (scale 0.97 per Kowalski). At T=5400: blurCrossfade(idle, applying, BLUR_HEAVY 250ms) — the fix card swaps from idle ("3 steps · ~2s") to the applying state with 3 spinner rows.
- **Why this earns its place:** This is the "commit" moment. The 400ms gap between cursor click and crossfade is intentional system-feedback latency — feels like a real API call lifecycle.
- **Motion:** Cursor pulse 150ms. Button press 150ms cubic-bezier(0.16, 1, 0.3, 1). Crossfade 250ms ease.
- **Dwell after:** 333ms (T=5400 → T=5733) — applying state is briefly visible (all 3 spinners spinning) before the first check fires.

#### Beat 6 — 3-step progress (T=5733 to T=6400)
- **What:** Three step rows transition spinner→check at 333ms intervals. Progress bar fills 0% → 33% → 66% → 100% in parallel.
  - T=5733: Step 1 (Patch token in Figma) checks. Progress 33%.
  - T=6066: Step 2 (Update var in production) checks. Progress 66%.
  - T=6400: Step 3 (Re-scan instances) checks. Progress 100%.
- **Why this earns its place:** Compressed from V1's 2000ms to 667ms. The V1 timing felt like a stalled loading bar; this reads as a confident, fast system. Cut all three steps and the user doesn't see WHAT Ghost does behind "Apply Fix"; cut the progress bar and the steps feel disconnected.
- **Motion:** Each step icon toggles `data-state="spinner" → "check"` (CSS handles the SVG swap). Progress bar uses 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) on width. NOTE: with 333ms intervals and 700ms transitions, the progress bar is still mid-transition when the next step fires — this is intentional, creates the "rapid cascade" reading.
- **Dwell after:** 300ms (T=6400 → T=6700) — final check briefly visible at 100% before done state.

#### Beat 7 — Crossfade to done state (T=6700 to T=7000)
- **What:** blurCrossfade(applying, done, BLUR_HEAVY 250ms). Fix card swaps to "Fix Applied" with green check icon + "21 instances updated · contrast restored" subtitle.
- **Why this earns its place:** The visual confirmation. Without it, the demo ends ambiguously ("did it work?"). With it, the demo lands: "fix applied, here's what changed."
- **Motion:** 250ms blur-crossfade matching V1.
- **Dwell after:** 300ms (T=7000 → T=7300) before ripples.

#### Beat 8 — Concurrent ripples (T=7000 to T=7300)
- **What:** Three simultaneous visual changes elsewhere in the detail panel:
  - `.fix-hero-compare-hex--found` gets `.is-struck` — strikethrough on "#6B7280" with red strikethrough color, hex text fades to muted gray
  - `.fix-hero-delta` gets `.is-resolved` — text updates "Delta: −1.4:1 contrast" → "Delta: 0 · contrast restored", color shifts red → green over 300ms
  - `.fix-hero-badge--fixed` becomes `.is-visible` — Fixed badge appears with back-out scale + opacity
- **Why this earns its place:** The "ripple effect" of the fix — multiple places in the UI all updating simultaneously to reflect the new state. This is the CORE narrative pillar (Ghost doesn't just fix one place — it cascades). Cut this and Ghost reads as a button that turns spinners into checkmarks.
- **Motion:** All three ripples fire at the same instant. Each has its own CSS transition (200-300ms ease). The simultaneity is the point — feels like a system snapping into a new coherent state.
- **Dwell after:** 3500ms (T=7000 → T=10500) — the LONG dwell. Viewer absorbs the resolved state. This is the "post-action breath" before the loop seam.

#### Beat 9 — Loop seam: cursor → X close (T=10500 to T=11200)
- **What:** Cursor moves from Apply Fix button location to the X close button in detail panel top-right. Hover state on X at T=11000 (background rgba(0,0,0,0.06)). At T=11200, click pulse + X click.
- **Why this earns its place:** This is the magic of the loop seam. The cursor doing the close action makes the loop seam feel like INTENTIONAL BROWSING — the user finished inspecting, closing the panel, moving to the next. Without this beat, the loop restart feels mechanical.
- **Motion:** `cursor.moveTo(closeBtnCenter)` 400ms default. Hover via class. Click pulse 150ms.
- **Dwell after:** 0 — panel slide-shut fires immediately on click.

#### Beat 10 — Panel slides shut + cursor returns (T=11200 to T=13000)
- **What:** At T=11200: `.fix-hero-detail-panel` loses `.is-open` class — reverses to opacity 0 + scale 0.98 over 600ms (back-in cubic-bezier(0.34, 1.56, 0.64, 1) creates an overshoot before closing, feeling tactile). Concurrent: cursor begins move to rest position (just above first deviation row). At T=13000, cursor settles at rest. The first row's `.is-clicked` class is removed, restoring its default state. Marker 1 fades.
- **Why this earns its place:** This is the half of the loop seam that BRIDGES iteration N to iteration N+1. The cursor's motion from X → above-first-row is the same motion that iteration N+1 starts with. From the viewer's perspective, the loop has no seam — it's one continuous "user browses, clicks, fixes, closes, browses again" flow.
- **Motion:** Panel close 600ms back-in. Cursor `moveTo(restPosition)` with duration 700ms easeOutQuad (slower than default, reads as "settling"). Marker disappear 150ms fade.
- **Dwell after:** 3000ms (T=13000 → T=16000 desktop / T=14000 mobile). The "rest" — cursor positioned, demo at neutral state, just before next iteration begins.

#### LOOP boundary (T=16000 desktop / T=14000 mobile)
- All state reset via `resetAllState()`. Cursor stays positioned at rest (does NOT teleport — it's already where iteration N+1 wants it).
- Iteration N+1 begins with `cursor.moveTo(firstRowCenter)` from the rest position — same motion as iteration N's Beat 2. Continuous.

### 1.2 Mobile timing (14s)

Mobile compresses all post-ripple beats proportionally. The Apply→done cascade stays at 333ms intervals — the compression budget comes from the post-ripple dwell.

| Beat | Desktop T | Mobile T |
|------|-----------|----------|
| 1 — Rest | 0 | 0 |
| 2 — Move to first row | 700 | 700 |
| 2 — Click first row | 1400 | 1400 |
| 3 — Detail panel opens | 1800 | 1800 |
| 4 — Move to Apply | 4200 | 4000 |
| 5 — Apply click | 5000 | 4800 |
| 5 — Crossfade applying | 5400 | 5200 |
| 6 — Step 1 check | 5733 | 5533 |
| 6 — Step 2 check | 6066 | 5866 |
| 6 — Step 3 check | 6400 | 6200 |
| 7 — Crossfade done | 6700 | 6500 |
| 8 — Ripples | 7000 | 6800 |
| 9 — Cursor to X | 10500 | 9500 |
| 9 — Click X | 11200 | 10200 |
| 10 — Panel slides shut + cursor settles | 13000 | 12000 |
| LOOP | 16000 | 14000 |

### 1.3 Cuts from V1 (what didn't earn its place)

**V1 beat 12: "Cursor moves toward second deviation row (deliberate browse, no click)"** — CUT. This was filler motion. The user has just absorbed the fix-applied state; making the cursor mosey to a second row that's never clicked teaches nothing. Replaced with the close-panel seam (Beat 9-10 above) which serves the same "continuous motion" goal while ADDING narrative content (the close action).

**V1 beat 13 (implicit): "Cursor moves to canvas center (continuous loop seam)"** — CUT. Moving cursor to canvas center was generic. The new seam moves cursor to the SPECIFIC position iteration N+1 starts from (above the first deviation row), making the cycle visually invisible.

**Net beat count:** V1 had 12. V2 has 10 distinct timestamps but 9 narrative beats (since Beat 6's three step checks are one narrative beat). The cut is real — 25% fewer narrative units, each earning its place.

### 1.4 The Apply→done compression details

**V1 timing (rejected):**
- Apply click T=5400 → Step 1 T=6000 (600ms gap) → Step 2 T=7000 (1000ms) → Step 3 T=8000 (1000ms) → Done T=8800 (800ms). Total: 3400ms.
- Reading: feels like a stalled progress bar. The 1000ms inter-step gaps make the system feel sluggish.

**V2 timing (this design):**
- Apply click T=5000 → Crossfade T=5400 (400ms feedback latency) → Step 1 T=5733 (333ms) → Step 2 T=6066 (333ms) → Step 3 T=6400 (333ms) → Done T=6700 (300ms). Total from Apply click to Done: **1700ms**.
- The 3-step cascade itself is **667ms** (Step 1 fire → Step 3 fire).
- Reading: feels like a confident, fast system. The viewer sees three checks rapid-fire, then immediate done state.

**Implementation note:** The progress bar's CSS transition is 700ms. With 333ms inter-step intervals, the progress bar is STILL TRANSITIONING when the next step fires. The progress visually overlaps — this is intentional. The viewer's brain perceives "very fast progress" rather than discrete steps.

---

## Part 2 — Beat 3 drift detection (rewrite)

### 2.1 The bug diagnosis (from code, not browser)

**SYMPTOM (as reported by user):** "The loop is not autoplaying anymore."

**ROOT CAUSE:**

Looking at the current implementation at `js/demos/ghost-drift-detection.js` lines 38-41 and 67-70:

```js
const targetToken = rootEl.querySelector('.dd-widget-token--target');
// ...
scheduleBeat(2200, () => {
  targetToken.classList.add('is-flagged');
  row.style.animationPlayState = 'paused';
});
```

The `targetToken` is the SINGLE element with `.dd-widget-token--target` class — the 4th token (`$text-secondary`) in the original 8-token sequence. The CSS animation `dd-widget-scroll 18s linear infinite` scrolls the row leftward by 50% over 18 seconds. Each 6s loop iteration, the row scrolls 6/18 = ~33% of its width (approximately 2.67 token widths).

By iteration 2, the target element has scrolled ~5.3 token widths past where it was at iteration 1. By iteration 3, it's been pushed off the visible canvas to the left. By iteration 4, the row has wrapped (via the duplicate-and-translateX(-50%) trick), but `.dd-widget-token--target` is still pointing to the SAME DOM element which is now in the OFFSCREEN portion of the row.

The `is-flagged` class is being added, the JavaScript is running, the loop IS autoplaying — but the target element is invisible. The user observes "loop not autoplaying" because the visible effect (red flag on a token) doesn't appear.

**Loop IS firing.** The visual symptom is "loop not autoplaying" but the actual state is "loop firing but flagging an offscreen element."

### 2.2 The fix (algorithm)

Replace the static `.dd-widget-token--target` reference with dynamic center-detection:

1. At Beat 3 of each iteration, query ALL `.dd-widget-token` elements (both original and clone — 16 total).
2. Calculate each token's horizontal center relative to canvas center.
3. Pick the token whose center is closest to canvas center AND visible (positive `left`, `left+width < canvas.width`).
4. Apply `.is-flagged` to that token.
5. Lookup popup content from a `tokenContentMap` keyed by token name (textContent).
6. Apply marker + popup near that centered token.

This produces:
- **Center-lock:** flagged token is ALWAYS at horizontal center (or closest to it within the visible area)
- **Token variation:** as the row scrolls between iterations, the token at center naturally cycles — different token gets flagged each time
- **Bug fix:** flagged token is GUARANTEED visible at flag time (we picked the centered one)

### 2.3 Beat-by-beat narrative (6s body demo)

#### Beat 1 — Token row scrolls (T=0 to T=2200)
- **What:** Token row scrolls via CSS animation. Edge-fade gradients on `.dd-widget-strip::before` + `::after` mask the harsh entry/exit at canvas edges. "Scanning tokens · 21 components" label at top.
- **Why this earns its place:** Sets up the metaphor — Ghost is continuously scanning. The motion IS the demonstration of background work.
- **Motion:** CSS `@keyframes dd-widget-scroll` — transform translateX(0 → -50%) over 18s linear infinite. Doubled token set (8 originals + 8 clones) creates seamless wrap.
- **Dwell after:** 2200ms — the row scrolls visibly before the first flag, establishing the scanning rhythm.

#### Beat 2 — Find centered token + flag it (T=2200)
- **What:** JavaScript queries all visible tokens, picks the one whose center X is closest to canvas center X. That token gets `.is-flagged` (red 2px outline, red text, scale 1.05, pulsing background animation 1.5s ease-out infinite). Row animation pauses (animationPlayState='paused').
- **Why this earns its place:** The detection moment. Without this beat, the demo is just a scrolling list — no Ghost-specific insight is communicated.
- **Motion:** Token state transition via `.is-flagged` class: background 250ms, border-color 250ms, color 250ms, transform 250ms cubic-bezier(0.22, 1, 0.36, 1) (ease-out-quint). Pulse keyframe `dd-widget-pulse` 1.5s ease-out infinite (box-shadow expanding/contracting).
- **Dwell after:** 300ms before marker arrives.

#### Beat 3 — Marker appears beside flagged token (T=2500)
- **What:** Red Marker pin (variant 'red') appears just above the flagged token's right shoulder.
- **Why this earns its place:** The marker says "look HERE." Without it, the popup that follows could feel unanchored. The marker is the spatial bridge.
- **Motion:** Marker.appear() — 300ms cubic-bezier(0.22, 1, 0.36, 1) scale 0→1 + 150ms opacity fade.
- **Dwell after:** 300ms before popup arrives.

#### Beat 4 — Popup with token-specific drift content (T=2800)
- **What:** Popup appears below the flagged token. Header + body content selected from `tokenContentMap` based on flagged token's name. Examples:
  - `$text-secondary` → "Color drift detected" / "−1.4:1 contrast"
  - `$spacing-2` → "Spacing drift detected" / "+4px from spec"
  - `$radius-md` → "Token renamed" / "Was $radius-6"
  - `$shadow-sm` → "Shadow drift detected" / "Opacity 0.10 → 0.18"
  - `$button-primary` → "Color drift detected" / "−2.1:1 contrast"
  - `$border-subtle` → "Border weight drift" / "1px → 1.5px"
  - `$surface-card` → "Surface drift detected" / "Card bg shifted"
  - `$text-body` → "Color drift detected" / "−0.6:1 contrast"
- **Why this earns its place:** The diagnosis. The popup adds the WHY behind the flag. Different content per token communicates that Ghost's detection covers MULTIPLE drift types (color, spacing, radius, shadow), not just one.
- **Motion:** Popup.show() — 250ms cubic-bezier(0.34, 1.56, 0.64, 1) (back-out scale + opacity). Then popup.typeInto() at 30ms/char — types the diagnosis text into the popup's input field.
- **Dwell after:** 2200ms while popup + flag are visible. This IS the demo's reading time.

#### Beat 5 — Cleanup + resume scroll (T=5000 to T=5200)
- **What:** At T=5000: popup.hide(), marker.disappear(), flagged token loses `.is-flagged` class. At T=5200 (200ms later): row.animationPlayState = 'running'. The 200ms gap lets the popup/marker fade complete cleanly before motion resumes.
- **Why this earns its place:** The reset. Without it, the demo can't loop cleanly.
- **Motion:** Popup hide 150ms ease. Marker disappear 150ms ease. Token transition class removal 250ms.
- **Dwell after:** 800ms of pure scrolling before next iteration's Beat 2 (T=6000+2200=8200).

#### LOOP boundary (T=6000)
- `runIteration()` called again. Iteration counter increments. The row continues scrolling (NEVER resets) — different token at center this time.

### 2.4 Token variation across iterations (4-iteration cycle, then repeats)

Given:
- Loop period: 6000ms
- Row scroll period: 18000ms
- Tokens per row half: 8 (then 8 clones)
- Tokens shifted per loop: 6/18 × 8 = ~2.67

| Iteration | Approx token at center | Popup content |
|-----------|------------------------|---------------|
| 1 | $text-secondary (index 3) | "Color drift detected" / "−1.4:1 contrast" |
| 2 | $shadow-sm (index ~5.7) | "Shadow drift detected" / "Opacity 0.10 → 0.18" |
| 3 | $spacing-2 (index ~7.3) | "Spacing drift detected" / "+4px from spec" (wrapping into clone set) |
| 4 | $text-body (index ~1.5 after wrap) | "Color drift detected" / "−0.6:1 contrast" |

Approximate — the EXACT token depends on starting phase. The center-detection algorithm picks whichever is closest, so the lookup map handles all 8 tokens.

**Critical design constraint:** the row NEVER resets to translateX(0) at iteration boundaries. The continuous scroll IS the variation mechanism. The only state reset is the flag class on the previously-flagged token.

### 2.5 What didn't earn its place

**V1 had Beat 4 (marker) and Beat 5 (popup) as separate beats — kept in V2.** These earn their place: marker = "look here," popup = "here's why." Without marker, the popup feels unanchored. Without popup, the marker says "look at this red thing" without explaining what drift means.

**V1 had a 200ms inner-setTimeout to resume scroll AFTER Beat 6's cleanup.** Kept in V2 — the brief pause lets popup/marker fade complete before motion resumes. Without it, fade + scroll happen simultaneously and feel rushed.

**V1's static `.dd-widget-token--target` HTML class.** CUT. Replaced with dynamic center-detection. This is the bug fix.

---

## Part 3 — Self-critique pass

### Hero (AI Fix Flow)

| Beat | Earns place? | Could be cut? | Dwell > 1000ms justified? |
|------|--------------|---------------|---------------------------|
| 1 — Rest | YES | No — sets up "browsing" context | Dwell = 700ms, OK |
| 2 — Move + click first row | YES | No — central selection action | Dwell = 300ms, OK |
| 3 — Detail panel opens | YES | No — IS the product thesis | Dwell = 2400ms, justified (5 UI elements to read) |
| 4 — Move to Apply | YES | No — bridges read→act | Dwell = 200ms, OK |
| 5 — Apply click + crossfade | YES | No — the commit | Dwell = 333ms, OK (applying state needs to be briefly visible) |
| 6 — 3-step progress | YES | No — communicates "what Ghost does" | Beat compressed to 667ms total |
| 7 — Crossfade to done | YES | No — visual confirmation | Dwell = 300ms, OK |
| 8 — Ripples | YES | No — CORE narrative (cascading fix) | Dwell = 3500ms, justified (post-action breath, biggest UI change moment) |
| 9-10 — Loop seam (X click + slide shut + cursor settles) | YES | No — makes the loop invisible | Dwell = 3000ms after settle, justified (rest before restart) |

**Cuts attempted but rejected:**
- Could Beat 4 be cut (cursor jumps straight from row click to Apply click without explicit move)? No — the move is the bridge. Without it, the Apply click feels disconnected from the user.
- Could the 3-step progress be cut to 2 steps? No — three steps communicate "this is a real multi-stage process," not just "loading."

**Total motion budget:** 16s desktop / 14s mobile. 9 narrative beats. Average ~1.7s per beat (large variance — some beats are 333ms transitions, some are 3500ms dwells, deliberately).

### Beat 3 (Drift detection)

| Beat | Earns place? | Could be cut? | Dwell > 1000ms justified? |
|------|--------------|---------------|---------------------------|
| 1 — Scroll | YES | No — establishes scanning metaphor | Dwell = 2200ms, OK (background scanning rhythm) |
| 2 — Flag centered token | YES | No — IS the detection moment | Dwell = 300ms before marker, OK |
| 3 — Marker | YES | No — spatial anchor for popup | Dwell = 300ms before popup, OK |
| 4 — Popup with content | YES | No — the diagnosis | Dwell = 2200ms, justified (reading the diagnosis) |
| 5 — Cleanup + resume | YES | No — required for loop | Dwell = 800ms before next iter, OK |

**Cuts attempted but rejected:**
- Could marker be cut (popup alone)? No — without the spatial anchor (marker pin), the popup feels placed arbitrarily.
- Could the popup typeInto be cut (popup just appears with full text)? Considered — kept the typeInto because it adds 30ms × ~30 chars = ~900ms of motion variation in an otherwise-static beat. Without it, the popup just snaps into existence and stares at the viewer.

**Total motion budget:** 6s loop, 4-iteration cycle covering different drift types via natural row scroll progression.

---

## Part 4 — Reference-pattern alignment

### Benji's hero pattern (`.claude/research/2026-05-25_benji-componentization-philosophy.md` §Page 1 hero demo)

- Loop duration: Benji's hero is 14s mobile / 16s desktop. ✓ MATCH.
- Beat count: Benji's hero has ~10-12 beats (5 marker positions × 2 beats each plus mode swaps). V2 hero has 10 timestamps / 9 narrative beats. ✓ WITHIN RANGE.
- Composition: Benji's hero has full app chrome (sidebar + nav + terminal). V2 hero has full app chrome (sidebar + header + deviation list + detail panel + fix-flow card). ✓ MATCH.
- Opening: Benji's hero opens with ~1500ms idle dwell to read the dashboard. V2 hero opens with 700ms cursor-already-in-position then move at T=700 — different but justified because V2's continuous loop seam means cursor pre-positions during iteration N-1's seam.

### Benji's body pattern (research file §Page 1 per-section demos)

- Height: Benji's `.demo-window` baseline is 330px. V2 Beat 3 is 330px. ✓ MATCH.
- Loop duration: Benji's body demos are 6-10s. V2 Beat 3 is 6s. ✓ MATCH.
- First action timing: Benji's body demos hit ~600ms. V2 Beat 3 first action (scroll) starts at T=0 (instant). ✓ MATCH (and improves on it — scroll IS the first action, no wait).
- Composition: Benji's body demos strip ALL app chrome. V2 Beat 3 has browser-bar + canvas only — no sidebar, no nav, no header strip. ✓ MATCH.
- Fidelity: Benji uses wireframe placeholders with strategic real-text. V2 Beat 3 uses real token names as real-text (Benji uses real text only in popup actions/labels — V2 uses real text in token names because tokens ARE the subject). ✓ MATCH on the "strategic real-text where it carries meaning" principle.

### Continuous loop seam requirement (CLAUDE.md JS-State Classes + design-decisions.md "Engine animation timing")

- Cursor never fades in/out mid-lifecycle. ✓ V2 hero: cursor mounts once on first iteration, persists across all loops.
- Cursor position pre-positions at end of iteration N to start of N+1. ✓ V2 hero: cursor settles above first row at T=13000, iteration N+1 begins from this position.
- No teleporting / snapping at iteration boundaries (except offscreen on initial mount). ✓ V2 hero satisfies this.
- V2 Beat 3 has no cursor — but the equivalent rule applies to the token row scroll: row NEVER resets translateX to 0 at iteration boundaries. ✓ V2 Beat 3: CSS keyframe handles continuous scroll, JS only flips animationPlayState during flag dwell.

### Reduced-motion handling (Mobile Video Standing Rule + design-decisions.md)

- V2 hero: `if (prefersReduced()) return;` early-exit before any cursor/marker mount. CSS `@media (prefers-reduced-motion: reduce)` paints static "Fix Applied" state. ✓
- V2 Beat 3: `if (prefersReduced()) return;` early-exit. CSS paints static flagged target token. ✓ (Note: CSS fallback flags the first 'target' candidate via `.dd-widget-token:nth-child(4)` since the static class is being removed — see implementation notes.)

---

## Part 5 — Implementation notes (for Phase 2 + Phase 3)

### Hero rewrite — must-haves

1. Replace the 12-beat timeline in `js/demos/ghost-ai-fix-flow-hero.js` with the 10-timestamp / 9-narrative-beat timeline from §1.1.
2. Apply→done section uses 333ms intervals for the 3 step checks.
3. Add the X close button click + panel slide-shut sequence at the loop seam.
4. Add CSS for `.fix-hero-detail-close:hover` and `.fix-hero-detail-close.is-clicked`.
5. Add CSS for panel slide-shut animation (reverse of open, 600ms cubic-bezier(0.34, 1.56, 0.64, 1)).
6. Preserve viewport-conditional duration (14s mobile / 16s desktop).
7. Preserve reduced-motion early-exit and `resetAllState` discipline.
8. Cursor rest position changes from "canvas center" (V1) to "just above first deviation row" (V2). Calculate as `firstRowCenter.y - 28` (28px above the row's vertical center).

### Beat 3 rewrite — must-haves

1. Remove `.dd-widget-token--target` HTML class from `work/ghost.html`. ALL 16 tokens are now equivalent candidates.
2. In `js/demos/ghost-drift-detection.js`, replace `const targetToken = rootEl.querySelector(...)` with a function `findCenteredToken()` that queries all 16 tokens and returns the one closest to canvas center within visible bounds.
3. Add `const tokenContentMap` with 8 token-name → popup-content entries.
4. At Beat 3 fire time, call `findCenteredToken()`, apply `.is-flagged` to result, lookup popup content from map.
5. Track which token was last flagged so cleanup correctly removes the class from the right element.
6. Preserve the 6s loop duration, the 2200ms first-flag timing, the 2.8s popup show timing, the 5s cleanup timing.
7. Preserve reduced-motion early-exit. CSS fallback flags `.dd-widget-token:nth-child(4)` statically.
8. The autoplay bug fix IS THE CENTER-DETECTION ALGORITHM. Diagnosing and fixing are one change.

### CSS additions

For hero:
```css
.fix-hero-detail-close {
  cursor: default;
  pointer-events: none;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 150ms ease, transform 100ms cubic-bezier(0.16, 1, 0.3, 1);
}
.fix-hero-detail-close.is-hovered {
  background: rgba(0, 0, 0, 0.06);
}
.fix-hero-detail-close.is-clicked {
  transform: scale(0.92);
}
```

For Beat 3 — no new CSS needed beyond removing the `--target` modifier rule (which only affected the @media (prefers-reduced-motion) fallback). Replace that selector with `.dd-widget-token:nth-child(4)` for the static flagged state.

### Cache-bust plan

- Hero rewrite → bump styles.css to v=40 (Phase 2)
- Beat 3 rewrite → bump styles.css to v=41 (Phase 3)
- Phase 4 final → bump styles.css to v=42 if any further CSS deltas
- JS module versions: `?v=2` on rewritten hero + drift modules

---

*End of design document. Implementation phases (Phase 2 + Phase 3) follow this design exactly. Any deviation discovered during implementation gets documented in `.claude/learnings.md` with a "why this changed" rationale.*
