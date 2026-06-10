# Key Decisions Loop Sprint — Design Document

**Date:** 2026-05-28
**Slot:** Key Decisions section of the Ghost case study, currently holding a large dark static screenshot (`img/ghost/process-05.png` — Scan Overlay mode, 1600×1000 RGB, 229 KB) at [work/ghost.html:691-693](work/ghost.html#L691-L693).
**Sprint goal:** replace that screenshot with a fourth cursor-as-agent loop arguing what the prose actually argues — *clinical precision: severity color only where it carries meaning. Restraint as an active editorial choice, not a default.*

**Why this replacement matters now.** The page already carries the comparison slider + four cursor-driven body demos (drift detection, view modes, DP-B severity vocabulary, OC-E critical three). Per the Process Loops sprint close, the page has a coherent light-system aesthetic shaped by hero r2.6 cursor discipline. The Overlay screenshot is the heaviest element on the page, static, dark — it hijacks the visual climax that the cursor-loops earn and breaks the system. Either replace it with prose-only (rejected — leaves a section void where an artifact is expected) or replace it with a loop that argues something the existing four don't.

**The decision the new loop dramatizes:** *what earns color in Ghost.* Hero applies a fix. DP-B builds the vocabulary. OC-E triages at scale. The Key Decisions slot needs the editorial layer underneath: the per-element judgment about whether a UI element earns the right to be colored in the first place. The prose says "severity colors only where they carry meaning" — the loop shows that judgment being applied, element by element, on a real Ghost surface.

**Sprint structure** (per the super-prompt):
- Phase 0 — backup ✓
- Phase 1 (this doc) — deep think + design doc + concept gate
- Phase 2 — teardown of the dark Overlay screenshot
- Phase 3 — build the approved concept
- Phase 4 — final report + learnings + canonical-motion-spec update if a new pattern emerged

The pattern from `.claude/canonical-motion-spec.md Appendix D` (designer-process body demo) applies. The five-step template from §D.7 governs the working method: decide the decision first → generate concepts → resolve at spec level → build is execution → cursor IS the agent making the decision.

---

## §1A — Restate the decision; how each beat makes the judgment legible

### The decision

Restated from the Key Decisions prose: **what earns color in Ghost.** Not which color (DP-B did that), not which components matter (OC-E did that). Per-element: does THIS thing carry meaning that color would amplify, or is its color decorative — and if decorative, strip it?

This was a real iterative call Rotem made during the design. First-draft palettes are always louder than the finished system. Restraint is *editorial work done over time* — the designer removed color from elements that didn't earn it, kept it on severity dots and primary actions, ended up at "clinical precision." The loop dramatizes the moment of that judgment being applied across several elements in a row — honest to the iterative process, not a single clean "aha."

### How each beat makes the judgment legible (the cursor-as-agent reading)

Per Appendix D §D.3 mechanic #2 (build → point → wait, where the WAIT carries the cognition):

- **Build (between picks):** the canvas holds the current state — one or more text labels already stripped, others still loud. The viewer reads "edits in progress."
- **Point (cursor traverses):** ease-in-out 440ms traversal to the next colored text label. The cursor is NOT visiting at random — it's targeting a specific element the designer is about to evaluate.
- **Wait (hover dwell on target):** 240–350ms polyrhythmic. This is the load-bearing beat — viewer sees the designer evaluating "does THIS earn its color?" The dwell variance (decisive → questioning → recognising) is the cognitive arc.
- **Act (clickStamp + color drains from text only):** the strip gesture. Text color transitions from severity-tinted to black over 250ms. The severity DOT beside it stays vivid. **This is the editorial signature** — color leaves one property (text) while another (dot) holds. Different from any whole-element fade.

The viewer's read across the loop: *Rotem is making a per-element editorial call, four times in a row. The text doesn't earn its color (the dot already says the severity). The dot does (it's the carrier of meaning). The end state is restrained.*

---

## §1B — Inventory + loud vs clinical end state

### What real Ghost UI is available to de-color (and what doesn't qualify)

| Element class | In the case study? | Carries meaning if colored? | Verdict for this loop |
|---------------|--------------------|------------------------------|------------------------|
| Severity dots (red / orange / yellow / green) on deviation rows | YES — hero deviation list, drift detection, DP-B, OC-E | YES — the dot IS the severity signal | **Keep colored in clinical state.** Editorial wins go to the dot. |
| Deviation row text labels ("Color Deviation — Table", etc.) | YES — hero deviation list | NO — the label is descriptive; the SEVERITY is on the dot | **Strip in clinical state.** This is the loop's per-element judgment. |
| Apply Fix button (indigo accent) | YES — hero recommendation card | YES — primary action, brand accent | Out of scope this loop (it's the hero's). |
| Meta text (#text-secondary, 16 → 12, etc.) | YES — hero, DP-B | NO — already neutral gray throughout case study | Already restrained. Don't touch. |
| Section header chrome | YES — case study sections | Depends — heading text reads black throughout | Already restrained. Out of scope. |
| Decorative dots / accents on list items | Could be added as a loud-state element | NO — decoration is the definition of "doesn't earn it" | Could be added but adds complexity. **Cut from scope.** |
| Background tints behind sections | Some neutral tints exist | NO — pure decoration | Could be added but adds a non-text editorial pick. **Cut from scope** (keep loop monosemantic). |

### The loud state (T=0) and the clinical end state

**Canvas:** a deviation-list panel showing 4 rows. Same 4 rows used in DP-B's deviation list — same text strings (Color Deviation — Table / Spacing — Card padding / Radius — Button corner / Font weight — Caption) and same severity mappings (red / orange / orange / yellow). This is deliberate continuity with the DP-B narrative arc (DP-B BUILDS the severity language on these same four deviations; K-A applies the editorial restraint to the same canvas). The viewer reads "same four deviations as before — now we're editing them."

**Loud state (T=0, also T=LOOP after cleanup):**
- 4 severity dots: red / orange / orange / yellow (each in their canonical color)
- 4 text labels: each TINTED to match its severity dot
  - "Color Deviation — Table" → red (#dc2626)
  - "Spacing — Card padding" → orange (#f97316)
  - "Radius — Button corner" → orange (#f97316)
  - "Font weight — Caption" → yellow (#eab308)
- 4 meta strings: gray throughout (#text-secondary / 16 → 12 / 8 → 6 / 500 → 400) — already clinical

This loud state is the "first-draft" version of the deviation list — where color was applied generously, on the assumption that more color = more legibility.

**Clinical state (T=4720 → T=6300, the terminal absorption window):**
- 4 severity dots: red / orange / orange / yellow (UNCHANGED — they hold their meaning)
- 4 text labels: all BLACK (#1A1A1A) — color stripped, severity signal carried by the dot alone
- Meta strings: gray (unchanged)

The contrast between loud and clinical states is the loop's argument: **same information; less color; better legibility.** The text gave up redundant color signal; the dot kept its load-bearing color.

### Why each remaining color "earns its place"

- **Severity dot color:** the dot IS the severity signal — drift level read at a glance. Without it the list is undifferentiated.
- **Black text:** body text is for *reading*, not for severity-tinting. Color on text + color on dot is redundant; the dot already carries the severity load.
- **Meta gray:** secondary information, not load-bearing — gray-tinted preserves the visual hierarchy without competing with the dot.

This per-element justification is the honesty contract. Rotem could defend each call: *"text gave up its tint because the dot already carries severity; dots kept their color because they ARE the severity signal."*

---

## §1C — Concept generation (mechanisms for "imposing restraint")

Three concepts considered. Each must clear the four bars: decision-tension, distinct thinking-type (vs hero / DP-B / OC-E), interview-defensible honesty, real Ghost components.

### Concept K-A — "The Editorial Strip" ★ RECOMMENDED

**Mechanism:** cursor visits a deviation row's text label, dwells (cognition), clickStamp commits the editorial call. The text label's color transitions from severity-tint (red/orange/yellow) to black over 250ms. The severity DOT beside the same row STAYS vivid. **Pointwise property-level color removal.**

**Decision per click:** "This text doesn't need to carry the severity signal — the dot already does. Strip it."

**Gesture signature (the load-bearing distinctness):** color leaves ONE specific property (text) while another (dot) holds. Not a whole-element fade. Not an opacity change. Not a card-level treatment. The cursor edits a specific style on a specific element — visually unmistakable from OC-E's whole-card fade pattern. The viewer sees "a hand reaching in and stripping" because the change is surgically scoped to one CSS property.

**Beat sketch (full spec in §1D):** 4 strips in a 7000ms loop. Polyrhythmic dwells 350/280/240/320ms (decisive / questioning / recognising / new-severity-edge-case). Terminal absorption freeze 1580ms holds the clinical end state. Cleanup re-tints back to loud for iter N+1.

**Components used:** real Ghost deviation list (4 rows from the hero, same strings used in DP-B). Severity dots in real canonical hex (#dc2626 / #f97316 / #eab308). No popup, no markers — the strip itself is the gesture.

**Bars cleared:**
1. Decision-tension ✓ — 4 explicit per-element judgments with cognition dwells
2. Distinct thinking-type ✓ — pointwise property-level edit, NOT picker-driven build (DP-B), NOT whole-card triage (OC-E), NOT fix-execution (hero)
3. Interview-defensible ✓ — restraint was a real iterative call Rotem made; the strip pattern is honest to the editorial process
4. Real components ✓ — same 4 deviations as the hero + DP-B, same severity dot colors used throughout

### Concept K-B — "Toning Down the Palette"

**Mechanism:** cursor visits a palette swatch panel showing Ghost's first-draft palette — 10–12 named swatches (Brand-Indigo, Accent-Light, Accent-Dark, Info-Blue, Surface-Tint, severity colors, etc.). Cursor clicks the ones that don't earn their place; they fade out of the palette grid until only the final 5 (severity reds/oranges/yellow/green + Brand-Indigo) remain.

**Decision per click:** "Does Ghost actually need this color? No — cut it."

**Gesture signature:** whole-swatch opacity fade. **Risk:** too close to OC-E's whole-card fade mechanism — viewer might read "this is the OC-E pattern but with swatches." Fails the distinctness bar.

**Components:** the palette is mildly fabricated (the case study doesn't currently expose a palette UI). Honesty: defensible-ish (Rotem did iterate the palette down) but the SURFACE is invented for the demo. Weaker on bar 4.

**Reject because:** mechanism overlap with OC-E + fabricated palette surface.

### Concept K-C — "Voice Trim — Surgical Tone in the Wild"

**Mechanism:** cursor edits prose phrases — "violation found" → "deviation detected", "fix required" → "recommendation available." Not about color, about language. The prose mentions both, so it's defensible.

**Decision per click:** "Replace the emotional word with the clinical word."

**Gesture signature:** text replacement via blur-crossfade. Completely different from the other three loops.

**Problem:** orthogonal to the COLOR claim the prose lead with. "Severity colors only where they carry meaning" is the prose's primary argument; "Deviation detected not violation" is the secondary argument. A voice-trim loop dramatizes the second argument and leaves the first un-dramatized.

**Reject because:** wrong argument. The dark screenshot was about the color/visual system (Overlay mode); the replacement should be too. Voice work could be a future loop somewhere else.

### Recommendation: K-A

K-A wins on all four bars. Its mechanism (pointwise text-color strip while dots hold) is categorically distinct from every existing loop on the page. It uses real Ghost UI verbatim. It dramatizes the prose's primary argument. The polyrhythmic strip rhythm reads as iterative editorial work — honest to how Rotem actually arrived at the restrained palette.

**Confirmed distinct from all four existing demos:**

| Demo | Argument | Mechanism | Gesture |
|------|----------|-----------|---------|
| Hero AI Fix Flow | Apply a known fix | Cursor click → 3-step cascade → done state | Action execution |
| DP-B Severity Vocabulary | Build the language | Picker popup + legend fills + system reflects | Additive build |
| OC-E Critical Three | Triage 21 → 3 | Card border + marker + counter; 18 fade | Whole-card subtractive |
| **K-A Editorial Strip** | **What earns color** | **Pointwise text-color strip; dot holds** | **Property-level edit** |

Four loops, four categorically different decisions, four distinct gesture signatures. K-A clears the distinctness contract.

---

## §1D — Full beat-by-beat spec for K-A "The Editorial Strip"

### Loop duration

**LOOP = 7000ms** desktop and mobile. Matches DP-B + OC-E body-demo rhythm. No MOBILE_DELTA needed — the loop is short and the cursor traversal distances are similar on both viewports.

### Visual composition

- **Container:** `.kd-widget` 330px tall, `#F6F5F4` background, 12px radius, layered shadow matching DP-B + OC-E shells.
- **Browser bar:** mac traffic lights + URL `ghost.rotemgotlieb.com/scan/007/restraint`.
- **Header strip:** 30px tall. Left: small dot (indigo brand accent — to anchor the "remaining colored element" thesis visually). Title text: "Color · what earns its place".
- **Canvas:** the 4-row deviation list, same rows as DP-B's bottom region, with the LOUD initial coloring on text labels.
- **Caption beneath:** "Restraint — color earns its place, element by element." (italic, centered, `.demo-frame-caption`).

### Beat-by-beat (7000ms loop)

| Beat | T (ms) | Action |
|------|-------:|--------|
| 1 | 0 | Initial state: 4 deviation rows visible. Each text label tinted to match its severity dot (red text + red dot / orange text + orange dot / orange text + orange dot / yellow text + yellow dot). Meta text gray (already clinical, unchanged throughout). Cursor at rest position above the list (continuous-state seam from prior iter). |
| 1A | 0 | Cursor → "Color Deviation — Table" text label (440ms ease-in-out traversal). |
| 1A' | 440 | Cursor arrives; hover dwell 350ms — **decisive cognition beat. The first edit. Designer weighs the editorial strategy.** Row gets `.is-hovered` subtle border highlight. |
| 1B | 790 | `clickStamp()`. Text label `data-text-colored` flips from `"red"` to `"stripped"` → CSS color transition red → #1A1A1A over 250ms ease-out-snappy. **Severity dot stays #dc2626.** Row hover clears. |
| 2A | 1040 | Cursor → "Spacing — Card padding" text (440ms traversal; 250ms post-strip linger allowed the strip animation to land). |
| 2A' | 1480 | Hover dwell 280ms — questioning ("does this also get stripped?"). |
| 2B | 1760 | `clickStamp()`. Text transitions orange → #1A1A1A. Dot stays #f97316. |
| 3A | 2010 | Cursor → "Radius — Button corner" text. |
| 3A' | 2450 | Hover dwell 240ms — **fastest** (pattern recognised: same severity as Spacing, same call). |
| 3B | 2690 | `clickStamp()`. Text orange → black. Dot stays orange. |
| 4A | 2940 | Cursor → "Font weight — Caption" text. |
| 4A' | 3380 | Hover dwell 320ms — slightly higher than 240/280 ("yellow's lighter — does it still need to be stripped? Yes — color on text still redundant with the dot."). |
| 4B | 3700 | `clickStamp()`. Text yellow → black. Dot stays #eab308. |
| 5 | 3950 | Cursor → rest position above the list, SETTLE_MS 770ms (engine `cursor.moveTo(x, y, { duration: 770 })`). |
| 5' | 4720 | Cursor arrives at rest. **TERMINAL FREEZE begins — 1580ms motionless absorption window.** Viewer absorbs the clinical end state: 4 black text labels + 4 colored dots. Restraint applied. |
| 6 | 6300 | Cleanup beat: 4 text labels' `data-text-colored` attributes flip back to their original severity values → CSS transitions re-tint over 300ms back to the loud state. |
| — | 6600 | Cleanup transitions complete. 400ms final freeze — cursor at rest, loud state restored. |
| LOOP | 7000 | Iteration N+1 begins. State matches T=0 exactly. |

### Polyrhythmic cognition dwells (per V3 §2.3, per Appendix D mechanic #4)

- Strip 1: **350ms** — decisive (first edit, evaluating the editorial strategy)
- Strip 2: **280ms** — questioning ("is this the same call?")
- Strip 3: **240ms** — **fastest** (same severity as Strip 2, immediate pattern application)
- Strip 4: **320ms** — slight uptick (different severity = yellow; brief re-evaluation)

Click intervals (clickStamp T-times): 790 → 1760 → 2690 → 3700 = gaps 970 / 930 / 1010 ms. Non-uniform ✓. Reads as a cognitive arc, not a metronome.

### Freeze discipline (setTimeout-gated true motionless windows)

| Window | Duration | Role |
|--------|---------:|------|
| Cursor hover dwells (×4) | 350 / 280 / 240 / 320 ms | Cognition beats — the WAIT carrying the decision weight |
| Post-strip lingers (×3) | ~250 ms (between clickStamp and next move) | Viewer absorbs the strip animation before cursor moves away |
| Terminal absorption | 1580 ms | **Load-bearing rhetorical payoff.** Viewer sees clinical end state hold. |
| Post-cleanup cushion | 400 ms | Loud state restored; brief silence before LOOP |

All freezes are absolute T-stamps via the Choreography engine. NO motion scheduled in the gaps — true freeze, not easing artifacts.

### Cursor easing (per V3 §2.1)

- Cursor → text label traversals (×4): ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)` at 440ms (engine default — on-screen traversal)
- Cursor → rest position (settle): ease-in-out 770ms via `cursor.moveTo(x, y, { duration: 770 })` (SETTLE_MS — slow settle at loop seam)
- Cursor click stamping (×4): `clickStamp()` — V3 stamping motion (translateY 5px + drop-shadow shift), 100ms
- Text color strip transition: ease-out-snappy `cubic-bezier(0.23, 1, 0.32, 1)` at 250ms (Frigade Entrance Curve — fast attack, lands soft)

### Continuous-state seam (mirror-action)

At T=0 and T=7000 the visual state is IDENTICAL: 4 colored text labels, 4 colored dots, cursor at rest. The iteration ends with explicit cleanup (Beat 6 at T=6300) that re-tints all 4 labels back to their original severity colors, mirroring the 4 strips. Mirror-action seam per canonical-motion-spec §2.5.

### Zero-position reset

`resetAllState()` called as first action of `runIteration()` per Single Unified Timeline §4.1 Rule 5:
- All 4 text labels: `data-text-colored` set to original severity (`"red"` / `"orange"` / `"orange"` / `"yellow"`)
- All inline filter/opacity styles cleared (in case cleanup transitions are mid-flight at LOOP)
- Row `.is-hovered` classes cleared
- Cursor: NOT repositioned — cursor stays at rest from prior iter (continuous-state seam)

### Reduced-motion path

Per `prefersReduced()`:
- Skip cursor mount
- Skip choreography entirely
- Render END state statically: all 4 text labels BLACK (`data-text-colored="stripped"`), all 4 dots colored, meta text gray.
- Caption explains the meaning: "Restraint — color earns its place, element by element."

The reduced-motion end state communicates the demo's argument WITHOUT motion: the viewer sees the clinical result and reads it as the system's resting state.

### Mobile plan

- Same body-demo height (330px) — the 4 deviation rows are already narrow-friendly (mirrors DP-B's deviation list on mobile).
- Text label font-size may scale down to 11px on mobile if needed (matches DP-B mobile breakpoint at 640px).
- Severity dots stay 10px (visible at all viewports).
- Cursor traversal targets are container-local via `getCenterOf` — automatic.
- No structural divergence needed.

### Engine primitive wiring

- `Cursor` — clickStamp, moveTo, snapTo, show, hide
- `Choreography` — single timeline with absolute T-stamps, `onReset` callback
- `LoopObserver` — dual viewport+visibility gate
- `prefersReduced` — early-exit
- `getCenterOf` — cursor target coords

**Primitives deliberately NOT used (distinctness signature):**
- **No `Marker`** — DP-B uses 3 multi-colored markers, OC-E uses 3 red markers, hero uses 1 green marker. K-A having ZERO markers is part of its distinctness signature (the strip itself is the editorial gesture, no numbered pin needed).
- **No `Popup`** — DP-B uses one (severity picker); K-A doesn't need one (the decision is "strip" — no parameter selection needed).
- **No `blurCrossfade`** — the text color transition is a single-property CSS animation, simpler and more surgical than blur. Blur would read as a "fade" — exactly what we're avoiding to stay distinct from OC-E.

### Estimated bundle

- JS: ~180–220 lines, ~5 KB gz (slightly smaller than DP-B because no popup logic)
- CSS additions: ~110 lines (deviation list + text-color states + container chrome)
- Net: ~6 KB gz added

### File map (preview for Phase 3)

- New JS: `js/demos/ghost-restraint-strip.js?v=1` (K-A choreography)
- CSS block in `styles.css`: `/* DEMO: GHOST RESTRAINT STRIP (Key Decisions) */`
- HTML: `<div class="kd-widget" id="ghostRestraintStrip">` markup inside Key Decisions section (replacing the dark Overlay screenshot at lines 691-693)
- Cache-bust: styles.css v=59 → v=60

---

## §1E — Distinctness + honesty audit

### Distinctness (per bar 2)

| Axis | K-A | Hero | DP-B | OC-E |
|------|-----|------|------|------|
| Decision type | Per-element editorial call (4 strips) | Apply known fix | Build vocabulary (3 picks) | Triage 21 → 3 |
| Cursor pattern | Click on text → text color leaves | Click Apply → 3-step cascade | Click legend row → picker → swatch → fill | Click card → border + marker |
| Gesture signature | Pointwise property-level edit | Action execution + state crossfade | Additive: colors appear on empty swatches + cascade | Subtractive: 18 cards fade as 3 are flagged |
| Markers used | 0 | 1 green | 3 different colors (red/orange/yellow) | 3 red |
| Popup used | NO | NO | YES (severity picker) | NO |
| Visual signature | Color leaves text while dot holds | Apply Fix → applying → done | Empty swatch → filled | Cards dim |
| What "color" means here | Editorial property being edited | Color is incidental | Color IS the subject being defined | Color IS the triage flag |

**One-line distinctness verdict:** K-A is the only loop on the page where the cursor edits a single CSS property on an existing element while a SIBLING property holds — a categorically different gesture from any whole-element or system-level treatment.

### Honesty (per bar 3)

| Beat / element | K-A honesty defense |
|----------------|--------------------|
| The 4 deviation rows | Same 4 deviations the hero shows (Color Deviation, Spacing, Radius, Font weight). Same text strings verbatim. Same severity colors. Continuity across the case study. |
| The loud start state | Plausible first-draft state — designers typically apply color generously in early drafts and pull back over iteration. |
| The strip decision | Real call Rotem made: severity-tinting on text labels was tried, then removed because it duplicated the dot's signal. The dot's color is the load-bearing severity carrier; text-tinting is redundant. |
| The clinical end state | Identical to the hero's deviation-list rendering — black text + colored dots — which is what shipped. |
| The polyrhythmic dwells | Honest to iterative work: first edit deliberate, subsequent edits accelerate as the pattern is recognised, yellow gets a brief recheck because it's a different severity context. |

**One-line honesty verdict:** every beat traces to a real editorial call Rotem made during the design system iteration; the clinical end state matches the live deviation-list rendering across the case study; no fabricated UI elements, no invented metrics, no implied process that didn't happen.

---

## §1F — Risk surface + self-critique

### Risk 1 — "Removing color" risks reading as decoration

The user's prompt named this explicitly. If the cursor visits a colored thing and the color leaves, viewers might read "an animation happens" rather than "a decision is committed."

**Mitigation in choreography:**
- The HOVER DWELL before each strip carries the cognition. 240–350ms is in the V3 polyrhythmic range — long enough to read as evaluation, short enough not to read as hesitation.
- The strip animation is FAST (250ms) and SURGICAL (single property). It doesn't drift; it commits.
- The CONTRAST with the dot staying vivid is the editorial signal. Without the dot retention, the strip would read as decoration. WITH it, the read is "I chose to remove color HERE; I chose to keep it THERE."
- Polyrhythmic dwells across the 4 strips create a cognitive arc (decisive → questioning → recognising → edge-check) — not a metronome.

**Residual risk:** if the dwells feel too short OR the strip animation feels too snappy, viewers may not register the decision. Tunable at visual review.

### Risk 2 — 4 strips × ~900ms intervals may still read as too uniform

The clickStamp intervals (790 / 1760 / 2690 / 3700 = gaps 970 / 930 / 1010 ms) are CLOSE to uniform even though the dwell durations vary. The cursor traversal at 440ms is a fixed default.

**Mitigation:** the dwell variance IS the polyrhythm (350 / 280 / 240 / 320). The interval variance is a secondary signal but smaller. If the loop reads metronomic at visual review, the dwell range can be widened (e.g., 400 / 240 / 200 / 360) to push the cognitive arc harder.

### Risk 3 — Page saturation: 5 cursor-loops + the slider = 6 dynamic elements on a single case-study page

Page inventory after this sprint ships:
1. Hero AI Fix Flow (above the fold)
2. Comparison slider (Beat 2, user-driven)
3. Drift detection (Beat 3, cursor-driven)
4. View modes (Beat 4, user-driven)
5. DP-B Severity Vocabulary Build (Design Process, cursor-driven)
6. **K-A Editorial Strip (Key Decisions, cursor-driven) ← THIS SPRINT**
7. OC-E Critical Three (Outcome, cursor-driven)

That's 5 cursor-driven loops + 1 user-driven slider + 1 user-driven chip toolbar. On a single case study page.

**Counterargument:** the Process Loops sprint review confirmed the narrative arc is what carries the page (DP-B builds → K-A strips → OC-E triages → Outcome). Each loop argues something the others don't. The page's coherent light-system aesthetic depends on every loop being cursor-driven and styled consistently. ADDING K-A to that arc makes it complete (currently the Key Decisions slot is the discontinuity — dark screenshot in a light-loop page). REMOVING the screenshot without replacing it leaves a section void.

The honest answer: a 5th cursor-loop is a real risk; it's justified IF the loop argues something the existing four don't. K-A's pointwise-property-strip gesture is genuinely distinct from the other four. If at visual review the page reads saturated, the right cut is K-A's terminal absorption freeze (currently 1580ms — could tighten to 800ms) so it consumes less attention.

### Risk 4 — The strip mechanism might LOOK like an opacity fade if the canvas background is too neutral

If the text starts red and transitions to "no color" (i.e., black), a casual viewer might read it as the text becoming "less visible" — closer to a fade than an edit.

**Mitigation:** the text MUST end up MORE LEGIBLE (darker, higher contrast against the white background) after the strip, not less. Red text on white has ~5:1 contrast; black text on white has ~21:1. The strip ENHANCES legibility — the opposite of a fade. The visual sensation should be "the text just got sharper," not "the text just got dimmer."

This matches the design system thesis: black text + colored dot = high-contrast information separated by channel.

### Risk 5 — Continuity with DP-B's deviation list might confuse the read

DP-B's bottom region is also a 4-row deviation list with the same text strings. K-A uses the SAME 4 rows in its single canvas. Viewers reaching K-A after DP-B might think "I've seen this before."

**Mitigation:** this is FEATURE, not bug. The continuity is part of the narrative arc — DP-B *defined* the severity language on these 4 rows; K-A *applies editorial restraint* to the same 4 rows. Same canvas, different operation. The repeated text strings reinforce "these are the same deviations across the whole case study."

If at visual review this reads as repetition rather than arc, K-A's canvas could use a different set of 4 deviations (e.g., from the drift detection token row: `$button-primary` color drift, `$shadow-sm` opacity drift, etc.). Tunable.

### Risk 6 — Restraint as a decision might genuinely not warrant a loop

This is the honest steelman the user's failure-protocol asked me to surface.

**Steelman:** the Key Decisions section's prose is dense and arguably self-sufficient. The dark Overlay screenshot was BAD (heavy, static, off-system), but the answer might be prose-only + a small static restrained-palette swatch sample. The case study doesn't NEED a 5th loop.

**Counter:** the page is already a sequence of cursor-loop demos. A prose-only section at this position would be a visual void in the rhythm. A small static palette sample would still clash with the loop aesthetic (static at a position where the eye expects motion). The page's coherence is the load-bearing argument; replacing the dark screenshot with a loop that argues the prose's thesis is the symmetric move.

**Final verdict on Risk 6:** the loop is warranted IF the mechanism is genuinely distinct (which K-A is) AND the editorial decision is interview-defensible (which restraint is — Rotem really did pull color back over iteration). If either bar slips, cut to prose-only + a small static palette.

### Self-critique pass (am I being safe?)

- **K-A is the most decision-tense of the three concepts.** K-B fails distinctness (mechanism overlap with OC-E); K-C fails relevance (wrong argument). K-A is the strongest, not the easiest.
- **The strip gesture is genuinely novel for this page.** It's not a fade, not a build, not a triage, not a fix-execution. The viewer's first read should be "wait, what's happening — oh, color is leaving the TEXT but staying on the dot. That's editorial."
- **The 4-strip cadence is tight but not metronomic.** Polyrhythmic dwells + slight click-interval variance.
- **Bar 3 (honesty) is the strongest bar for K-A.** Rotem really did make this call; the live case study renders deviation lists in exactly the clinical end state K-A arrives at.
- **The risk I'm most uncertain about:** Risk 4 (strip might look like fade). The mitigation (text ENDS more legible, not less) is structurally correct, but visual perception depends on canvas background contrast and viewer attention. Visual review is the only honest test.

### Final bars check

| Bar | K-A |
|-----|-----|
| 1. Decision-tension | ✓ — 4 explicit per-element editorial judgments with cognition dwells |
| 2. Distinct thinking-type | ✓ — pointwise property-level strip; categorically different from hero / DP-B / OC-E mechanisms |
| 3. Interview-defensible honesty | ✓✓ — real call Rotem made; clinical end state matches live case study rendering |
| 4. Real Ghost components | ✓ — same 4 deviations + same severity dot colors as hero + DP-B |

Both deeply enough resolved to lock spec and proceed to build after gate approval.

---

## §1G — Decision gate

Before Phase 2 (teardown of the dark Overlay screenshot) begins, the user reviews:

**Q1 — K-A approved as scoped?** "The Editorial Strip" — cursor strips text color from 4 deviation rows in sequence (Color Deviation / Spacing / Radius / Font weight), severity dots beside each stay vivid. Polyrhythmic dwells 350/280/240/320 ms. Terminal absorption freeze 1580 ms. 7000ms loop. Or pick K-B (palette toning) or K-C (voice trim).

**Q2 — Risk acknowledgements.** Any of risks 1–6 want pre-built mitigation before Phase 3, or are they acceptable as "tune at visual review" concerns?

**Q3 — Replacement scope.** Confirm: the dark Overlay screenshot (`img/ghost/process-05.png`) is removed from work/ghost.html only; the PNG asset stays in `img/ghost/` for Phase 0 backup-pointing AND in case it's needed for a future surface. Or fully delete the PNG too?

After concept approval, Phase 2 (teardown) begins immediately. Phases 3-4 follow with the Phase 3 end-of-build gate (before/after beat table + honesty + distinctness self-check) and the Phase 4 final report.

---

*Phase 1 design complete. Pausing for concept-gate approval before any code moves.*
