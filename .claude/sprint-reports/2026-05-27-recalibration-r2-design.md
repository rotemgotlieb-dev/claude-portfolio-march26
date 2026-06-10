# V3 Recalibration Sprint Round 2 — Design Document

**Date:** 2026-05-27

**Three workstreams:**
1. Hero dead-zone surgery (target ~10s total loop, **explicit deviation from V3 14–16s hero range**)
2. Beat 3 (drift detection) polish pass (smoothness + true centering + speed + clarity signal)
3. Image 1 (Design Process Pivot 3) replacement — NEW autoplay loop, NOT a screenshot

**Out of scope:** Image 2 (Overlay mode in Key Decisions section). Stays static. Redesigned later.

**Process:** design before code. Phase 2/3/4 implement to this doc exactly. Each phase has its own user-review gate.

---

## Section 1A — Hero recalibration r2 (dead-zone surgery)

### Current state diagnostic

Source: `js/demos/ghost-ai-fix-flow-hero.js` (V3-recalibrated this morning). The Apply→done snap-pause-snap structure is correct. The dead zones are in the dwells AROUND that block.

**Dwell audit — current 16s hero:**

| Beat | T (ms) | Action | Action ends ~ | Next beat T | Dwell after (ms) | V3 §2.3 classification |
|------|--------|--------|---------------|-------------|------------------|------------------------|
| 1 (rest) | 0 | Static | 0 | 700 | 700 | Pre-first-action — V3 §1.1 hero opens at ~1500ms but with continuous loop seam this is reduced — OK |
| 2a | 700 | Cursor → first row (400ms move) | 1100 | 1400 | 300 | Transit micro-dwell (100–200) — borderline |
| 2b | 1400 | clickStamp + .is-clicked + marker | 1700 | 1800 | 100 | Mid-narrative compressed (150–200) — snap, OK |
| 3 | 1800 | Panel opens (250ms back-out) | 2050 | 4200 | **2150** | Absorption dwell (800–1500, max 2500) — borderline acceptable (5 UI elements to scan) BUT user-flagged: "cursor sits for ~2s" |
| 4 | 4200 | Cursor → Apply (400ms move) | 4600 | 5000 | 400 | Action dwell (300–500) — OK (finger hovers button) |
| 5 | 5000 | clickStamp + press + crossfade idle→applying | 5250 | 5150 | overlap by design | Snap 1 per V3 §2.4 — OK |
| 6a | 5150 | Step 1 + progress 33% | instant | 5750 | 600 | **Load-bearing pause per V3 §2.4** — INTENTIONAL |
| 6b | 5750 | Step 2 + progress 66% | instant | 5900 | 150 | Rapid wrap-up — OK |
| 6c | 5900 | Step 3 + progress 100% | instant | 6000 | 100 | Snap to done — OK |
| 7 | 6000 | Crossfade applying→done | 6250 | 6300 | 50 | Snap to ripples — OK |
| 8 | 6300 | Concurrent ripples | 6600 | 10500 | **3900** | Absorption (max 2500) — **DEAD ZONE — user-flagged**: "Done state appears → cursor sits → finally moves to X" |
| 9a | 10500 | Cursor → X (400ms move) | 10900 | 11200 | 300 | Action dwell — OK |
| 9b | 11200 | clickStamp X + panel slide-shut (600ms) | 11800 | 11300 | overlap by design | OK |
| 10 | 11300 | Cursor → rest (700ms settling) | 12000 | LOOP | **4000** | Terminal dwell (1500–2500) — **DEAD ZONE — user-flagged**: terminal exhale too long |

**Three dead zones identified:**

1. **Beat 3 → Beat 4 = 2150ms.** Borderline. User flagged: "cursor sits for ~2 seconds before moving fast to Apply."
2. **Beat 8 → Beat 9a = 3900ms.** Significant dead zone. User: "after fixed badge appears, ~500ms is enough."
3. **Beat 10 settle → LOOP = 4000ms.** Terminal dwell at almost 2× V3 max.

**Total time savings available:** ~6 seconds (2150-800 + 3900-500 + 4000-2000 + minor compressions = ~5800ms).

### Recalibrated plan — ~9.5s loop

Target ~10s per user direction. The math lands at 9500ms with all V3 dwell ranges respected EXCEPT the Apply→done load-bearing pause (user-requested 350ms vs V3's 600–1000ms — explicitly approved deviation).

**Recalibrated timeline (desktop, 9500ms loop):**

| Beat | T (ms) | Action | Dwell after (ms) | V3 §2.3 classification |
|------|--------|--------|------------------|------------------------|
| 1 (rest) | 0 | Cursor at rest above first row | 700 | Pre-first-action — continuous loop seam justifies the short opening |
| 2a | 700 | Cursor → first row (400ms move) | 200 | Transit micro-dwell (100–200) — at top of range |
| 2b | 1300 | clickStamp + .is-clicked + marker | 100 | Mid-narrative compressed — snap |
| 3 | 1700 | Panel opens (250ms back-out) | **1050** | Absorption dwell (800–1500) — **mid-range, tight** |
| 4 | 3000 | Cursor → Apply (400ms move) | 300 | Action dwell (300–500) — at floor |
| 5 (Apply) | 3700 | clickStamp + press + crossfade idle→applying | T+150 to next | Snap 1 |
| 6a | 3850 | Step 1 + .is-active + progress 33% | 350 | **Load-bearing pause (V3 deviation)** — 350ms vs V3 600ms+ — explicitly user-approved |
| 6b | 4200 | Step 2 + .is-active + progress 66% | 250 | Rapid resolution |
| 6c | 4450 | Step 3 + .is-active + progress 100% | 250 | Pre-done |
| 7 | 4700 | Crossfade applying→done | 300 | Pre-ripples |
| 8 | 5000 | Concurrent ripples | **600** | **Compressed absorption** — user said "~500ms is enough"; 600ms gives breathing |
| 9a | 5600 | Cursor → X close (400ms move) | 300 | Action dwell — at floor |
| 9b | 6200 | clickStamp X + panel slide-shut (600ms) | 100 | Snap |
| 10 | 6300 | Cursor → rest (700ms settling) | settles ~7000 | — |
| Rest | 7000 | Cursor settled | **2500** | Terminal dwell (1500–2500) — **at V3 max** |
| LOOP | 9500 | Iteration N+1 begins | — | — |

**Mobile compression:** Desktop 9500ms / Mobile 8300ms. The 1200ms saved comes from a shorter terminal dwell on mobile (1300ms vs 2500ms desktop). Mobile terminal dwell at 1300ms is just under V3's 1500ms minimum but matches the user's intent of a tighter mobile experience. MOBILE_DELTA = -1200ms applied ONLY to LOOP_DURATION (not to individual beats — keeps the choreography identical desktop and mobile, just shortens terminal dwell on mobile).

**Why 9.5s instead of exactly 10s:** all dwells fit cleanly within V3 ranges at 9.5s. Pushing to 10s would either require extending absorption beyond V3's 1500ms max OR terminal beyond V3's 2500ms max. The user's "~10s" target gives wiggle room; 9.5s lands cleanly. If user wants exactly 10s, easy lever: extend Beat 3→4 absorption from 1050ms to 1550ms (just over V3 max of 1500ms by 50ms). I propose landing at 9.5s.

### V3 deviation documentation

**This recalibration targets ~9.5s total loop, deliberately deviating from V3's 14–16s hero range. Reasoning:** dead zones in the original 16s loop made the hero feel sluggish for hiring managers in 30-second portfolio scans. The other V3 framework decisions (hero-vs-body distinction, full chrome, autoplay, snap-pause-snap rhythm structure, continuous loop seam, cursor stratified easing) **remain intact**. This is a per-portfolio calibration, not a framework override.

**Additional V3 deviation:** Apply→done load-bearing pause compressed from V3's 600–1000ms range to 350ms. Reasoning: user direction — "quarter second of loading feels closer to the target." The snap-pause-snap structural integrity is preserved (Step 1 fast, middle pause longer than other gaps, Step 2/3 rapid) — the rhythm is identifiable at 350ms middle, just at a faster overall tempo. Documented in canonical-motion-spec.md Appendix A in Phase 5.

### Self-critique on hero plan

| Beat | Earns place? | Dwell justified? | V3-compliant? |
|------|--------------|-------------------|---------------|
| 1 — Rest | YES (loop seam continuity) | 700ms opening, OK for continuous seam | Deviation: V3 hero opens ~1500ms; ours is 700ms due to continuous loop. Documented. |
| 2a → 2b | YES (selection action) | 200ms snap before click | ✓ |
| 3 — Panel opens | YES (product thesis) | 1050ms absorption | ✓ (V3 range 800–1500) |
| 4 → 5 — Apply | YES (commit moment) | 300ms button hover | ✓ (V3 action dwell 300–500) |
| 6a/b/c — Steps | YES (snap-pause-snap) | 350ms middle pause | DEVIATION (V3 600–1000) — user-approved |
| 7 — Done crossfade | YES (resolution) | 300ms pre-ripples | ✓ |
| 8 — Ripples | YES (cascade narrative) | 600ms before close-out | Below V3 absorption min (800ms) by 200ms — flag |
| 9a → 9b — Close | YES (loop seam initiator) | 300ms cursor-on-X | ✓ |
| 10 — Settle | YES (loop seam closer) | 2500ms terminal | ✓ (V3 max) |

**One minor unflagged deviation:** Beat 8 → 9a dwell at 600ms is under V3's absorption minimum (800ms). User explicitly approved "~500ms is enough" so this is intentional. After ripples, the viewer has already absorbed the major UI changes during the prior cascading sequence — extended absorption isn't needed. Logged.

---

## Section 1B — Beat 3 polish pass

### Current state diagnostic

Source: `js/demos/ghost-drift-detection.js` + `styles.css` `/* DEMO: GHOST DRIFT DETECTION */` block.

**Issue 1 — Scroll smoothness (jank source identified):**

The scroll itself IS GPU-accelerated: CSS `animation: dd-widget-scroll 18s linear infinite` on `transform: translateX()` with `will-change: transform`. ✓

**Jank source:** when `.is-flagged` is applied, the CSS rule changes `border: 1px solid rgba(0,0,0,0.08)` (default) to `border: 2px solid #DC2626` (flagged). The border width change causes a 2px layout shift in the row. Other tokens in the row visibly bump position when the flagged one grows. **Confirmed visual jank.**

**Issue 2 — Centering algorithm:**

Current `findCenteredToken()` at js/demos/ghost-drift-detection.js:98–116 mathematically picks the token closest to canvas horizontal center. Algorithm is correct. **The visual off-center perception likely comes from:**

(a) **Race condition** — JS fires at T=2200 in the timeline, then calls `findCenteredToken()` BEFORE pausing the animation. Between the read and the pause-after-find, the row has scrolled a few more pixels. The "centered" token is now slightly off.

(b) **40px visible-margin too lax** — tokens within 40px of the canvas edge pass the visibility check but sit inside the 80px edge-fade gradient mask (they're visually faded). The algorithm might pick a faded-but-close token over a fully-visible-but-farther one.

**Issue 3 — Loop too slow at 6s:**

| Beat | T (ms) | Duration |
|------|--------|----------|
| 1 — Scrolling baseline | 0 | 2200ms |
| 2 — Flag + pause | 2200 | 300ms before marker |
| 3 — Marker | 2500 | 300ms before popup |
| 4 — Popup + typing | 2800 | 2200ms (popup-visible) |
| 5 — Cleanup | 5000 | 200ms before scroll resume |
| LOOP | 6000 | — |

Where to cut:
- Beat 1 baseline (2200ms): cut to 1500ms — still enough to register "scanning"
- Beat 4 popup-visible (2200ms): cut to 1900ms — popup typing ~480ms, reading time ~1400ms (sufficient for short label)
- Beat 5 → LOOP recovery (1000ms): cut to 700ms

New target: **5000ms loop**.

**Issue 4 — Clarity signal:**

Existing `.dd-widget-label` already says "Scanning tokens · 21 components" at top of canvas. Currently:
- `color: rgba(0, 0, 0, 0.4)` — 40% opacity (low)
- `font-size: 11px` — small
- Static text, no live indicator

This is too subtle. The viewer needs to know within 2 seconds: "this is a live scan, not a static label."

**Three clarity-signal options evaluated:**

| Option | Pros | Cons |
|--------|------|------|
| A. Animated scan-line sweep across canvas | Strong visual signal of "active scan" | Adds complexity; competes with token row motion |
| B. Visible progress counter ("scanning 14/21") that increments | Quantifies the scan, more "live" | Requires new JS state; updates conflict with flag detection timing |
| **C. Pulse dot on existing label + slight opacity boost** | **Minimal: ~10 lines CSS; pre-existing label gains "live" feel; doesn't compete with row motion** | **Smallest signal of the three** |

**Recommended: Option C.** Cheap, clean, signals "live" without competing with the main token row motion. The user can request more if it's still unclear after Phase 3 review.

### Recalibrated plan — four targeted fixes

**Fix 1 — Smoothness (border layout-shift jank):**

```css
/* BEFORE */
.dd-widget-token { border: 1px solid rgba(0, 0, 0, 0.08); }
.dd-widget-token.is-flagged { border: 2px solid #DC2626; /* layout shift */ }

/* AFTER */
.dd-widget-token { border: 2px solid transparent; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08); }
.dd-widget-token.is-flagged { border-color: #DC2626; box-shadow: none; }
```

The 2px transparent border is always there, so the layout box never changes size. The inset box-shadow provides the subtle default border visual. When `.is-flagged` lights up, only the border COLOR changes — no layout shift. ✓

**Fix 2 — Centering (pause-then-read):**

```js
// BEFORE (race condition)
scheduleBeat(2200, () => {
  const target = findCenteredToken();  // reads while animating
  if (!target) return;
  currentlyFlagged = target;
  target.classList.add('is-flagged');
  row.style.animationPlayState = 'paused';  // pauses AFTER
});

// AFTER (pause first)
scheduleBeat(2200, () => {
  row.style.animationPlayState = 'paused';  // freeze the row first
  const target = findCenteredToken();        // now read stable positions
  if (!target) return;
  currentlyFlagged = target;
  target.classList.add('is-flagged');
});
```

Additionally tighten the visible-margin in `findCenteredToken()`: change `+40` to `+80` (match the 80px edge-fade gradient width) so the algorithm only considers tokens in the fully-visible area, not the faded edges.

**Fix 3 — Speed tuning (5s loop):**

| Beat | T (ms) | Change |
|------|--------|--------|
| 1 — Scrolling baseline | 0 | unchanged |
| 2 — Flag + pause | **1800** (was 2200) | 400ms earlier |
| 3 — Marker | 2100 (was 2500) | proportional shift |
| 4 — Popup | 2400 (was 2800) | proportional shift |
| 5 — Cleanup | **4300** (was 5000) | popup-visible 1900ms (was 2200) |
| LOOP | **5000** (was 6000) | 700ms recovery after cleanup |

**Fix 4 — Clarity signal (pulse dot):**

```css
.dd-widget-label {
  /* unchanged base position + font */
  color: rgba(0, 0, 0, 0.55);  /* was 0.4 — boost visibility */
}
.dd-widget-label::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  margin-right: 8px;
  vertical-align: 1px;
  animation: dd-scanning-pulse 1.5s ease-in-out infinite;
}
@keyframes dd-scanning-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.2); }
}
```

The pulsing green dot signals "active live state" — universally readable. Combined with the existing "Scanning tokens · 21 components" label, the viewer reads "● Scanning tokens · 21 components" and immediately knows: live token scan in progress.

### Self-critique on Beat 3 plan

- All four fixes are surgical, don't touch the center-detection cycle (different tokens still cycle into center across iterations naturally).
- Loop compression preserves the snap structure (flag, marker, popup, cleanup) — just faster.
- The pulse dot is minimum-viable for clarity. If user pushes back ("still unclear"), we have options A and B as Phase 3 follow-up.
- Border-color transition: must verify the existing `transition` on `.dd-widget-token` covers `border-color`. Currently it has `background, border-color, color, transform` — ✓ already there.

---

## Section 1C — Image 1 replacement (new autoplay loop)

### The brief

- Replace static `<img src="../img/ghost/process-04.png">` at line 598–600 of `work/ghost.html`
- Currently illustrates Pivot 3: "Detection became detection-to-remediation"
- Must argue Pivot 3 WITHOUT duplicating the hero (AI Fix Flow is already there)
- Body-demo characteristics per V3 §1.1: 300–350px tall, 6–10s loop, 3–5 beats, no app chrome or partial chrome, sub-500ms first action

### Three concepts evaluated

#### Concept A — Scan Completion (RECOMMENDED)

**Pitch:** Watch a Ghost scan complete in real-time — the moment of detection that triggers remediation.

**Beats (4):**
1. T=0 — Idle scan view: circular progress ring at 0%, counter "0 deviations found"
2. T=300 — Progress ring fills 0% → 100% over 2200ms (with subtle pulse synchronizing). Counter rapidly increments toward final value.
3. T=2500 — Ring completes at 100%; counter lands on "21 deviations found"; severity breakdown row fades in: "4 breaking · 11 critical · 6 minor"
4. T=5500 — Terminal dwell while viewer reads the breakdown
- LOOP T=7000

**Pivot 3 argument:** The START of detection-to-remediation pipeline. Before AI Fix Flow can fix anything, a scan must complete and surface the aggregate. This demo shows that "complete picture" moment — Ghost as a tool that doesn't just find ONE drift, it finds ALL of them and surfaces them organized.

**Why it doesn't duplicate the hero:**
- Hero: ONE deviation being fixed (the remediation step)
- This: THE WHOLE SCAN aggregating (the detection-completes step that precedes remediation)
- Visually distinct: hero has cursor + clicks + UI states; this has a progress ring + numeric counter + severity row
- Narratively complementary: detection-to-remediation is a PIPELINE; hero shows the end, this shows the start

#### Concept B — Severity Sort (alternative)

**Pitch:** 21 deviation cards animate into severity buckets (Breaking / Critical / Minor).

**Beats:**
1. List of 21 small ungrouped deviation rows
2. Cards lift one-by-one and animate into 3 buckets (red / orange / yellow), staggered ~80ms
3. Each bucket counter increments as cards land
4. Hold final sorted state

**Pivot 3 argument:** detection produces actionable severity-tiered output — categorization IS part of the remediation pipeline (you can't remediate "stuff," you remediate the breaking changes first).

**Trade-off:** more visually busy than Concept A; risk of feeling decorative ("watching cards shuffle").

#### Concept C — Before/After Diff (alternative)

**Pitch:** Same component shown before fix → arrow → after fix.

**Beats:**
1. Component with red drift indicators (pulsing)
2. Arrow animates left-to-right
3. Component morphs to fixed state (drift markers fade)
4. Counter appears: "11 components remediated"

**Trade-off:** narratively close to the hero (both show "fixed state"); risk of feeling redundant.

### Recommended: Concept A — Scan Completion

**Reasoning:** strongest Pivot-3 argument (the moment that triggers remediation), maximum visual distinction from the hero (no cursor, no clicks — just a progress ring + counters), feasible implementation (~3 KB JS + ~1 KB CSS), respects body-demo discipline (no app chrome, ~330px tall, 7s loop).

### Implementation sketch for Concept A

**Markup outline:**

```html
<div class="sc-widget reveal" id="ghostScanComplete" aria-label="Ghost scan completion demo">
  <div class="sc-widget-browser-bar">
    <div class="sc-widget-traffic-lights">…</div>
    <div class="sc-widget-url">ghost.rotemgotlieb.com/scan/007</div>
  </div>
  <div class="sc-widget-canvas">
    <div class="sc-widget-ring-wrap">
      <svg class="sc-widget-ring" viewBox="0 0 100 100">
        <circle class="sc-widget-ring-track" cx="50" cy="50" r="45"/>
        <circle class="sc-widget-ring-fill"  cx="50" cy="50" r="45"/>
      </svg>
      <div class="sc-widget-percent">0<span class="sc-widget-percent-unit">%</span></div>
    </div>
    <div class="sc-widget-stats">
      <div class="sc-widget-stat-count">
        <span class="sc-widget-stat-value" data-counter="0">0</span>
        <span class="sc-widget-stat-label">deviations found</span>
      </div>
      <div class="sc-widget-stat-breakdown" aria-hidden="true">
        <span class="sc-widget-pill sc-widget-pill--red">4 breaking</span>
        <span class="sc-widget-pill sc-widget-pill--orange">11 critical</span>
        <span class="sc-widget-pill sc-widget-pill--yellow">6 minor</span>
      </div>
    </div>
  </div>
</div>
<p class="demo-frame-caption">A scan completes. 21 deviations surface in 2.5 seconds.</p>
```

**CSS approach:**
- 330px tall body-demo container per V3 body-demo discipline
- SVG progress ring: 120px diameter, `circle.sc-widget-ring-fill` with `stroke-dasharray` animated 0 → full circumference
- Percent text large (32px) centered inside ring
- Severity breakdown row initially `opacity: 0`; reveals at T=2500

**JS choreography (vanilla, ~70 lines):**
- 7s loop driven by `Choreography` engine primitive
- `IntersectionObserver` pause/resume per engine standard
- `prefersReduced()` early-exit → static "scan complete" state (ring at 100%, counter at 21, breakdown visible)
- RAF-driven counter increment synced with ring fill (counter accelerates toward 21 as ring progresses)
- Beat timeline:
  - T=0: idle (ring at 0%, counter 0)
  - T=300: ring fill begins (CSS transition stroke-dashoffset 2200ms ease-out)
  - T=300: counter RAF loop kicks off, easing toward 21 over 2200ms
  - T=2500: ring at 100%, counter at 21, breakdown row fades in (200ms)
  - T=5500: hold for read
  - T=7000: LOOP (reset ring to 0%, counter to 0, breakdown to opacity 0)

**Bundle estimate:** ~3.2 KB gzipped (similar to ghost-drift-detection.js).

---

## Section 1D — Self-critique (all three workstreams)

**Hero:**
- All beats earn their place (no cuts from morning sprint's 9-beat structure)
- Two V3 deviations (loop duration + load-bearing pause middle gap) — both explicitly user-approved and documented
- One minor under-spec dwell (Beat 8 → 9a at 600ms vs V3 absorption min 800ms) — user direction
- Snap-pause-snap rhythm structure preserved (just at faster tempo)

**Beat 3:**
- Centering fix preserves the natural token cycle (the row never resets; different tokens still cycle through center across iterations)
- 5s loop within V3 body-demo range (3–10s)
- Pulse dot clarity signal is minimum-viable; can iterate to options A/B if Phase 3 review reveals it's insufficient
- All four issues addressed surgically; no rebuild

**Image 1:**
- Concept A genuinely complements hero (different visual, different beat of the pipeline)
- 7s loop within body-demo range
- Earns its place vs deletion: WCAG screenshot was decorative; this shows live aggregate detection which is the trigger event for remediation (the argument the surrounding prose makes)
- Implementation feasible within sprint budget

---

## Section 1E — Risk surface

### Hero compression risks

1. **Beat 3 → 4 absorption dwell cut from 2150ms to 1050ms.** The viewer has 1050ms to scan 5 UI elements in the detail panel. Mitigation: the cursor moves at T=3000 (which is 1050ms AFTER panel-opens-complete at T=1950), giving 1050ms of focused scan. If this feels too rushed in Phase 2 review, easy lever: extend Beat 3→4 absorption to 1500ms (V3 max) by shifting Beat 4 to T=3450.

2. **Apply→done pause compressed to 350ms.** V3 deviation, user-approved. If the snap-pause-snap reads as metronomic in Phase 2 review, escalate the middle pause to 450ms (still V3-deviation but less so).

3. **Beat 8 → 9a dwell at 600ms.** Below V3 absorption min. User direction. If viewer feels rushed past the ripples in Phase 2 review, extend to 800ms (V3 floor).

### Beat 3 polish risks

4. **Pause-then-read fix might introduce a 1-frame visual stutter.** The animation pauses, JS reads positions, JS applies flag in the same tick. Browsers should batch this into one paint, but if `requestAnimationFrame` is needed for stability, add it.

5. **Tighter visible-margin (40 → 80) might filter ALL tokens during certain scroll positions** if the row's geometry produces a moment where no token is fully-visible-and-near-center. Mitigation: fallback to "closest visible" if the strict filter returns null.

6. **Pulse-dot clarity signal might still feel insufficient.** Cheapest mitigation: increase the label font-size from 11px → 13px in the same change. Larger mitigation: implement Concept A or B from §1B options.

### Image 1 risks

7. **New autoplay loop competes visually with hero.** Both above the fold + below; rapid-fire scrolling viewers might feel overwhelmed. Mitigation: keep concept A's visual vocabulary deliberately distinct from hero (no cursor, no popup, just ring + counter). The lack of cursor is the strongest differentiator.

8. **Concept A counter increment might feel like a "fake counter" trick.** Mitigation: ease the counter toward 21 over 2200ms with a natural deceleration (not linear), so it feels like data populating, not animation theater.

9. **Bundle growth.** Adding ~3.2 KB JS + ~1 KB CSS. Combined Ghost case study JS bundle was 19.9 KB gz this morning. Will land at ~23 KB. Acceptable for a 297 MB project.

### Cross-cutting risks

10. **Cache-bust scope.** This sprint touches: styles.css, ghost-ai-fix-flow-hero.js, ghost-drift-detection.js, NEW ghost-scan-complete.js, work/ghost.html. Cache-bust styles.css → v=43 across all 11 active HTML files; bump hero JS → v=4; bump drift JS → v=3; new scan-complete JS at ?v=1.

---

## Section 2 — User decision points for review

Before Phase 2 begins, please confirm:

1. **Hero loop target.** I propose **9500ms** (lands cleanly within V3 dwell discipline modulo the user-approved Apply→done pause deviation). The user said "~10s" — confirm 9500ms is OK, or push to exactly 10000ms (would require slight V3 dwell over-spec elsewhere).

2. **Beat 3 clarity signal.** I propose **Option C (pulse dot + opacity boost)**. Alternatives A (scan-line sweep) or B (progress counter) are heavier implementations. Confirm Option C is OK, or escalate.

3. **Image 1 concept choice.** I recommend **Concept A (Scan Completion)** with progress ring + counter + severity breakdown. Alternatives B (Severity Sort) and C (Before/After Diff). Confirm Concept A is the choice, or pick another.

4. **Risk acknowledgements.** Five risks have inline mitigations (compress further if needed). One risk (#10 cache-bust) is mechanical and will be handled. Surface any concerns about the others.

If all four points are confirmed, Phase 2 (hero surgery) implements exactly Section 1A.

---

## Section 3 — Implementation file map (preview for Phase 2/3/4)

### Phase 2 (hero surgery)
- `js/demos/ghost-ai-fix-flow-hero.js` — update timeline timestamps + LOOP_DURATION (9500ms) + MOBILE_DELTA (now applies to LOOP_DURATION only, not individual beats)
- `work/ghost.html` — cache-bust styles.css?v=43, hero JS?v=4
- All 11 active HTML files — cache-bust styles.css?v=43

### Phase 3 (Beat 3 polish)
- `styles.css` — border-color trick on `.dd-widget-token`, pulse dot on `.dd-widget-label`, opacity boost
- `js/demos/ghost-drift-detection.js` — pause-then-read order swap, tighter visible-margin (40→80) with fallback, beat timing compression (5s loop)
- `work/ghost.html` — cache-bust drift JS?v=3

### Phase 4 (Image 1 replacement)
- `js/demos/ghost-scan-complete.js` — NEW file (~70 lines)
- `styles.css` — NEW `/* DEMO: GHOST SCAN COMPLETE */` block (~80 lines)
- `work/ghost.html` — replace `<img src="../img/ghost/process-04.png">` with new demo markup; wire script tag

### Phase 5 (final report)
- `.claude/sprint-reports/2026-05-27-recalibration-r2.md` — final write-up
- `.claude/canonical-motion-spec.md` Appendix A — document the hero loop-duration deviation

---

*End of design document. Awaiting user review before Phase 2.*
