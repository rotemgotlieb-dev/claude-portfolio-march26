# Process Loops Sprint — Design Document

**Date:** 2026-05-27
**Slot the doc covers:** the two bottom-of-Ghost visuals (Design Process and Outcome). Replaces Concept X (token health dashboard) and Concept Z (remediation pipeline). Both prior concepts shipped on 2026-05-27 morning; both are technically clean but answer the wrong question — they show Ghost on autopilot, not the designer's process.

**Sprint thesis:** every loop has a visible agent — a cursor representing Rotem — doing intentional design work on real Ghost components. Build → point → wait. The viewer watches a designer think and build, not a product run on autopilot.

**Phase structure:**
- **Phase 0:** pre-sprint backup ✓ (`_archive/_pre-process-loops-rebuild-2026-05-27/`)
- **Phase 1 (this doc):** comprehensive design — CONCEPT GATE at end
- **Phase 2:** teardown Concept X + Concept Z
- **Phase 3:** build Design Process loop
- **Phase 4:** build Outcome loop
- **Phase 5:** final report + spec update

---

## Section 1A — Benji synthesis: what makes "watch me think and build"

Read of `.claude/research/2026-05-21_benji-pattern-decomposition.md`, `2026-05-22_benji-autoplay-decomposition.md`, `2026-05-25_benji-componentization-philosophy.md`, and `canonical-motion-spec.md` §5.1 yields a tight model of *what specifically* makes Benji's body demos read as a designer working — not a product running.

### The five load-bearing mechanics

**1. The cursor is the agent.** A DOM-rendered cursor (`.demo-cursor`) follows scripted paths via CSS-eased state changes. Crucially, it has mode states (pointer / crosshair / I-beam) that *swap programmatically* to signal *what kind of action* is being taken. The cursor isn't decoration — it's the designer's hand. The viewer reads "Benji is selecting text" or "Benji is dragging a region" by reading the cursor's mode.

**2. Build → point → wait is the rhythm — and the WAIT is the cognition.**
- Build = the prior beat resolves (UI settles)
- Point = the cursor moves to a target (eased traversal, 350–450ms)
- Wait = a deliberate 200–500ms dwell *on the target before acting*

That wait is the load-bearing beat. It's the viewer SEEING the designer evaluate before deciding. Compressing the wait to zero turns the loop into a feature tour. Bloating it past ~500ms reads as hesitation. Tuning the wait is tuning the perceived cognition.

**3. Component manipulation IS the substance.** Benji's loops don't point AT things — they ACT on them. Text gets selected and a comment popup opens. An element gets clicked and a marker pin lands. A region gets dragged and a selection rectangle materializes. **The cursor's job is to TRANSFORM the canvas, not to narrate it.** Every cursor click produces a visible material change (popup, marker, mode swap, state change).

**4. Annotation popups appear *because the designer invoked them*.** Not because the system surfaced them. The popup is the designer's annotation tool — a comment they're adding, a selection they're confirming, a label they're setting. This is the core of the "designer's process" reading: the popup is the cursor's voice, not Ghost's notification.

**5. The decision is the surface.** A click selects, a click decides, a click commits. There's no abstraction — the cursor's clickStamp at coordinate (x, y) IS the decision being made. No menu navigation, no settings cascade, no system-prompt-then-user-confirms two-step. One click = one judgment. The viewer reads decisions per second.

### What the cursor must NOT do

- **Visit elements in sequence without acting on them.** A cursor that highlights components serially is a feature tour with a pointer attached. The cursor must ACT, not point.
- **Move uniformly between equally-spaced targets.** Uniform spacing reads as scripted-bot. Real designers traverse with varying dwells based on cognitive weight of the preceding action — V3 §2.3 polyrhythmic dwell rule.
- **Click and have nothing change.** A click without a visible material consequence reads as "the cursor missed" or "the demo broke."
- **Be implied rather than visible.** A loop where things change but no cursor is present implies "the system did it." Both Concept X and Concept Z violated this — that's their failure mode.

### Why Concept X and Concept Z missed

Both demos shipped beautiful data-driven autoplay loops. Concept X had 21 tiles oscillating via sine waves + a scanline sweep + two periodic spikes. Concept Z had four tickets flowing through four stages via modular arithmetic. Both were mathematically clean, visually polished, framework-compliant.

But neither had a cursor. Neither had a designer in the frame. The implied actor in both was **Ghost itself**, scanning and remediating on its own. The viewer's read becomes "look at this automated tool" rather than "look at how this designer thought."

This is the wrong read for the Design Process and Outcome slots specifically. Both slots are RHETORICAL — they argue something about Rotem's working method. The hero (AI Fix Flow) is allowed to show Ghost-as-product because the hero's job is "this is what the product does." The body demos at the case study's spine must show **how the designer made the product**, not the product in motion.

### The translation: Benji's mechanics applied to Ghost's surface

| Benji's body demo move | Ghost equivalent |
|------------------------|-------------------|
| Cursor selects text in a Steve Jobs quote, popup opens, designer types a comment | Cursor evaluates an AI recommendation, popup opens, designer types a decision |
| Cursor multi-selects 3 task rows, "3 elements selected" popup | Cursor flags 3 of 21 component cards as critical, counter ticks per click |
| Cursor in crosshair mode drags a region, area marker lands | Cursor in pointer mode visits a component, severity marker lands |
| Cursor clicks the "pause" icon in a toolbar, animation freezes | Cursor clicks an Apply Fix button, three-step cascade fires |

Every one of those right-column moves is a Ghost-real interaction. The engine primitives (`Cursor`, `Popup`, `Marker`, `Choreography`) already exist and already operate at this exact discipline — they were built from this research.

---

## Section 1B — Inventory of real Ghost components

This is the raw material both loops must draw from. The bar is: every visual subject in either loop must be an interaction surface that already exists in the Ghost case study or in the hero AI Fix Flow demo. No fabricated UI. No abstract shapes.

### 1B.1 Components catalogued from `work/ghost.html` and the hero demo

**A. Hero AI Fix Flow detail panel (full app chrome, above the fold)**
- Sidebar with icon-only nav: Scans, Deviations (active), Components, Settings
- Header row: "DEVIATIONS · Scan 007" label + "21 found" count + "Filters" pill
- Deviation list rows (4 visible): each = severity dot (red/orange/yellow) + component label + meta value
  - Color Deviation — Table · #text-secondary
  - Spacing — Card padding · 16 → 12
  - Radius — Button corner · 8 → 6
  - Font weight — Caption · 500 → 400
- Detail panel (opens on row click): title with dot + Color Deviation — Table + X close
- Badges row: Breaking + Critical + Fixed (Fixed hidden until applied)
- Expected/Found grid: 2 swatches with hex labels (#9CA3AF expected vs #6B7280 found)
- Delta strip: "Delta: −1.4:1 contrast" → resolves to "Delta: 0 · contrast restored"
- AI recommendation card: Lightbulb icon + recommendation text + Apply Fix button (with sparkle icon)
- Three-step flow card with idle/applying/done states (Patch token / Update var / Re-scan instances)

**B. Comparison slider (Beat 2 demo)**
- Two stacked panels: Design vs Production
- Mock UI inside each panel: nav strip + 3 stat cards + divider + transaction list + button row
- 5 annotation callouts revealed by slider drag:
  - Card bg: #FFFFFF → #EEEEFF
  - Divider: 1px → omitted
  - Padding: 16px → 12px
  - Icon radius: 8px → 50%
  - Color: #4F46E5 → #7C3AED
- Slider handle with chevrons + grip
- Corner labels DESIGN / PRODUCTION

**C. Drift detection scrolling row (Beat 3)**
- Horizontal scrolling token strip with 8 tokens (deduplicated, scrolled continuously):
  `$button-primary, $text-body, $surface-card, $text-secondary, $border-subtle, $shadow-sm, $radius-md, $spacing-2`
- "Scanning tokens · 21 components" label with pulsing live dot
- Red marker pin + comment popup with token-specific drift explanation

**D. View modes chip toolbar (Beat 4)**
- 4 chips: Slider, Side-by-Side, Overlay, Timeline
- Mini design/prod panels with faux buttons (different layouts per mode)
- 4 timeline date frames (Mar 1 / Mar 8 / Mar 15 / Mar 22) with progressive drift

**E. The 21-component library claim (stated in prose; visualised in the now-deprecated Concept X)**
- Component names from Concept X spec, drawn from Ghost case study prose:
  Button, Input, Card, Toggle, Badge, Modal, NavBar, Tooltip, Dropdown, Avatar, Tab, Progress, Switch, Slider, Checkbox, Radio, Select, Tag, Banner, Spinner, Divider
- Each has a drift score 0–100 and a severity bucket (green/yellow/orange/red by score thresholds 90 / 70 / 50)

### 1B.2 Engine primitives available

| Primitive | What it does | Used by hero r2.6? |
|-----------|---|---|
| `Cursor` | DOM cursor with `mount/moveTo/clickStamp/snapTo/show/hide`. Defaults: ease-in-out cubic-bezier(0.77, 0, 0.175, 1) at 440ms (V3 traversal). Per-move `duration` override. clickStamp = V3 stamping motion (translateY 5px + shadow shift, 100ms). | Yes — entire choreography |
| `Choreography` | Timeline of `{ at: ms, do: fn }` entries with single duration. Pause captures elapsedMs; resume continues from offset. `onReset` callback for zero-position restoration. | Yes |
| `Popup` | Benji-style comment popup: header + input field with caret + Cancel/Add buttons. `show / typeInto / hide` API. Back-out easing on entry, ease on exit. Submit variants: default / green / red. | No (hero uses static recommendation card) |
| `Marker` | Numbered pin in 4 variants (default / green / orange / red). `appear / disappear`. Scale 0→1 with ease-out-quint at 300ms. | Yes — marker 1 (green) on first-row flag |
| `LoopObserver` | Dual gate: viewport intersection + tab visibility. `onEnter / onExit` callbacks. | Yes |
| `prefersReduced` | `matchMedia('(prefers-reduced-motion: reduce)').matches`. Re-evaluated per call. | Yes — early-exit |
| `getCenterOf` | Returns element center in container-local coords. | Yes |
| `blurCrossfade` | Opacity + blur sibling swap. `BLUR_LIGHT=2`, `BLUR_HEAVY=16`. | Yes — applying↔done state swap |

### 1B.3 What's already taken (don't duplicate)

The hero (AI Fix Flow) uses: deviation list rows + detail panel with badges + Expected/Found grid + Delta + recommendation card + Apply Fix button + 3-step flow card. **The Design Process and Outcome demos must NOT reproduce these exact compositions** — per Case Study Opener Rule §4 and Body-demo discipline.

What's available without overlapping the hero:
- The recommendation card *in isolation* (without the surrounding deviation panel)
- The 21-component grid (was Concept X; can be reused at a new abstraction level)
- The severity color taxonomy (red / orange / yellow / green)
- The marker pins (different numbers, different variants)
- The popup (Benji-style — hero doesn't use Popup)

This is the deliberate frame: the Design Process and Outcome loops show *the design tool the designer uses to BUILD the product*, not the product running.

---

## Section 1C — Concept generation (2-3 per slot)

For each slot I generated three candidates and then picked one. Each candidate is graded against the four evaluative bars:

- **Bar 1 — Decision-tension:** does the cursor represent judgment, not just movement?
- **Bar 2 — Distinct thinking-type:** different from the OTHER slot's loop?
- **Bar 3 — Interview-defensible:** could Rotem defend every beat for 30 seconds?
- **Bar 4 — Real Ghost components:** uses actual UI from the case study?

### 1C.1 Design Process slot (between Pivots prose and Key Decisions)

The Design Process section ends with three pivots Rotem named:
1. Slider moved from buried feature to hero
2. Interface shifted from dashboard to investigation workspace
3. Detection became detection-to-remediation (added AI Fix Flow)

The loop in this slot must show **how Rotem worked through the build** — iteration, refinement, decisions-in-progress.

#### Concept DP-A: "The Slider Becoming Primary" — Pivot 1 visualised

**Pitch:** the cursor demonstrates Rotem's Pivot 1 — kills the v1 dashboard centerpiece (a fidelity-score donut) and promotes the slider from a corner preview to the hero.

**Decision:** which UI element is the centerpiece?

**Thinking-type:** layout/composition surgery.

**Beats:** mini v1 dashboard visible with donut center + small slider tucked in corner → cursor evaluates donut → clickStamp → marker 1 red ("hide") → donut blur-fades out → cursor moves to slider preview → clickStamp → marker 2 green ("promote") → slider animates from corner up into the now-empty hero region, scaling to fill.

**Components used:** ghost slider (real, Beat 2), severity colors (real). The "v1 donut" is fabricated — Rotem would have to confirm v1 had this. Risk for bar 3.

**Bars:** 1 ✓ (which one is centerpiece is real decision), 2 distinct, 3 partial-defensible (the donut), 4 partial (donut fabricated).

#### Concept DP-B: "The Severity Sort" — assembling the severity taxonomy

**Pitch:** the cursor demonstrates Rotem assembling the severity color taxonomy. A deviation list starts with NO severity dots; the cursor opens a color picker on each row, picks a severity color, and the dots populate.

**Decision:** which severity level applies to which deviation?

**Thinking-type:** taxonomy / classification.

**Beats:** 3 unclassified deviation rows visible → cursor → row 1 → clickStamp → popup with 4 severity swatches → cursor → red → clickStamp → row 1 dot fills red → row 2 cycle (orange) → row 3 cycle (yellow).

**Components used:** deviation list rows (real, from hero), severity colors (real), popup (engine), markers (engine).

**Bars:** 1 ✓ (3 classification decisions), 2 potentially overlaps with OC severity work, 3 ✓, 4 ✓.

#### Concept DP-C: "The AI Recommendation Becoming Apply Fix" — Pivot 3 visualised ★ RECOMMENDED

**Pitch:** the cursor demonstrates Rotem's Pivot 3 — making the recommendation actionable. Starts with an informational-only AI recommendation card. Cursor evaluates it, opens a Benji-style annotation popup ("Add Apply Fix?"), confirms, and the Apply button materialises with back-out easing.

**Decision:** is detection alone enough, or does this need to remediate?

**Thinking-type:** single architectural pivot — the highest-stakes call in the case study.

**Beats (sketch — full spec in §1D):**
1. T=0: recommendation card visible. Lightbulb icon + "Restore token $text-secondary to expected value." NO Apply button. Cursor sitting on the card from prior iter seam.
2. T=600: cursor stationary 600ms → the WAIT — viewer reads the recommendation alongside the cursor.
3. T=600: clickStamp on the recommendation text. Marker 1 (green) appears at the card.
4. T=750: Benji-style popup opens beside the card. Header: "Add action?". Body field types in (50ms/char): "Recommendation only — make it actionable?". Submit button: green "Add Apply".
5. T≈2400: cursor → submit (440ms). clickStamp at T=2900.
6. T=3050: popup hides.
7. T=3200: Apply Fix button slides in with back-out cubic-bezier(0.34, 1.56, 0.64, 1) at 250ms. Marker 2 (green) appears at the new button.
8. T=3800: cursor → Apply button. Settle. Freeze 250ms terminal anticipation.
9. T=4490 → T=5260: cursor settles back to recommendation card at SETTLE_MS 770ms.
10. T=5260 → T=7000: terminal freeze on cursor at rest. During this freeze, Apply button + both markers blur-fade out so iter N+1 starts identical to iter N.

**Components used:** AI recommendation card (real, from hero), Lightbulb icon (real), Apply Fix button (real), Popup (engine), Marker × 2 (engine).

**Bars:** 1 ✓✓ (the architectural pivot decision is visible as a single judgment), 2 ✓ (single pivot vs OC's multi-judgment triage), 3 ✓✓ (literally Pivot 3 from the prose), 4 ✓ (recommendation card + Lightbulb + Apply button are all live in the hero).

#### DP slot recommendation: DP-C

Rationale:
- DP-C is the most decision-tense. "Should this be informational or actionable?" is the single biggest architectural call in the case study. DP-A is also pivot-driven but quieter (a layout shuffle). DP-B is real taxonomy work but lower-stakes per click.
- DP-C visibly demonstrates the exact Pivot the prose just argued. Prose↔visual coupling is tight.
- DP-C reuses MORE real Ghost components than DP-A's fabricated v1 donut. Bar 4 is cleaner.
- DP-C closes a narrative loop: the case study earlier promised "detection-to-remediation," the hero shows Apply being clicked, and the Design Process loop shows the MOMENT THE BUTTON WAS ADDED. This is the case study's spine made visible.

Runner-up: DP-A (slider promotion). Strong narratively but the v1 donut requires Rotem to confirm "yes my v1 actually had a fidelity donut" — bar 3 partial.

DP-B is solid but the severity work is more naturally an Outcome-level activity (system-wide vocabulary) than a Design Process activity (in-progress architectural choice).

### 1C.2 Outcome slot (inside Outcome section, before Other Work)

The Outcome prose claims:
- 21 components tracked
- Four view modes
- Full detection-to-remediation flow
- Three pivots taught me the signature interaction should have been the first thing designed
- Next build target: wiring AI Fix to the Figma API

The loop in this slot must show **what the body of work amounts to** — the system made legible, the craft assembled.

#### Concept OC-A: "Assembling the 21" — dragging components into a tracked library

**Pitch:** cursor drags 4-5 component cards from a "pool" into a 7×3 library grid. After the manual placements, the remaining 16 components stagger-fade into place to reach 21.

**Decision:** what does it mean to "track" a component? (weak — it's a placement, not a judgment.)

**Thinking-type:** assembly / system-build.

**Components used:** 21 real component names, grid layout, severity dots.

**Bars:** 1 partial (placement isn't really a judgment), 2 ✓, 3 ✓, 4 ✓.

The risk: placement isn't decision-tense. Failing bar 1.

#### Concept OC-C: "The Pivot Map" — annotating the three pivots on a unified canvas

**Pitch:** unified Ghost canvas visible (slider + deviation list + AI fix flow). Cursor visits each region in sequence, clickStamps, sticky-note annotation slides in. Three annotations total: Pivot 1, Pivot 2, Pivot 3.

**Decision:** how does Rotem summarize his own process?

**Thinking-type:** reflective / meta.

**Components used:** comparison slider (real), deviation list (real), AI fix flow (real), markers, popup.

**Bars:** 1 partial (annotating, not deciding), 2 ✓, 3 ✓ but slightly self-congratulatory, 4 ✓.

The risk: annotating is documentation, not decision. The cursor is a labeller, not an agent.

#### Concept OC-E: "The Critical Three" — system-wide triage from 21 → 3 ★ RECOMMENDED

**Pitch:** 21 component cards visible (real Ghost component list). Cursor visits the three lowest-drift cards in sequence — Modal, Select, Banner — clickStamps each. Each click: red border + red marker pin + counter ticks. After the third click, the remaining 18 fade to 30% opacity as the triage result lands.

**Decision (×3):** "this component is critical. This one too. This third one as well."

**Thinking-type:** system-wide triage — picking signal from noise across the whole component library.

**Beats (sketch — full spec in §1D):**
1. T=0: 21 cards at 100% opacity. Counter: "0 / 21 critical". Cursor at rest position above the grid.
2. T=0–740: cursor → Modal (440ms traversal) + 300ms dwell. clickStamp at T=740. Modal red border + Marker 1 (red). Counter: "1 / 21 critical".
3. T=940–1730: cursor → Select + 350ms dwell. clickStamp at T=1730. Marker 2 + counter "2 / 21".
4. T=1930–2650: cursor → Banner + 280ms dwell. clickStamp at T=2650. Marker 3 + counter "3 / 21".
5. T=3000: 18 non-critical cards crossfade to 30% opacity in a 50ms-per-row cascade (~600ms total). Counter morphs to "3 critical · 18 healthy".
6. T=3700: cursor settles back to rest position (770ms).
7. T=4470 → T=6300: 1830ms terminal freeze — viewer absorbs "3 critical · 18 healthy".
8. T=6300 → T=7000: cleanup phase. Markers fade out, red borders revert, non-critical cards return to 100% opacity. Counter resets. Cursor stationary.
9. T=7000: LOOP. State matches T=0.

**Components used:** 21 real component names, real severity colors, 3 markers (red variant), counter, no popup needed.

**Bars:** 1 ✓✓ (three explicit triage judgments, each with a 300ms wait), 2 ✓ (system-wide vs DP-C's single-element), 3 ✓✓ (Modal/Select/Banner have the lowest scores in the prose — defensible per-click), 4 ✓ (every component name is real Ghost claim).

#### OC slot recommendation: OC-E

Rationale:
- OC-E has the highest decision-tension. Each click is a real triage call. The 300ms hover dwell before each clickStamp is the cognition beat made visible.
- OC-E is categorically distinct from DP-C. DP-C is a SINGLE architectural decision on ONE element; OC-E is THREE classification decisions across a WHOLE system. Different abstraction levels, different time horizons, different cursor behaviors.
- OC-E directly visualises the prose's "21 components tracked" claim — every component the cursor visits is a card with a real name from the case study.
- The "+3 critical · 18 healthy" terminal state IS the case study's summary: "Ghost is a tool that finds the few things that matter in a large system."

Runner-up: OC-C (Pivot Map). Strong narrative but cursor doesn't decide — it annotates. Weaker on bar 1.

OC-A (Assembling the 21) fails bar 1 — placement isn't judgment.

### 1C.3 Distinctness check (bar 2 confirmation)

| Dimension | DP-C "Add Apply Fix" | OC-E "The Critical Three" |
|-----------|----------------------|----------------------------|
| Decision type | Architectural pivot (single big choice: informational vs actionable) | System-wide triage (3 component judgments) |
| Time horizon | Mid-project — "what should this UI become?" | Late-project — "what needs attention right now?" |
| Scope | One UI element (recommendation card) | Whole component library (21 cards) |
| Cursor action | 1 click on a target, opens popup, 1 confirm click | 3 clicks across 21 targets, no popup |
| Material change | One button materialises | 18 cards fade as 3 are marked |
| Popup used? | Yes — Benji-style designer-annotation popup | No — markers + borders carry it |
| Markers used? | 2 (green — additions) | 3 (red — critical-flags) |
| Visual result | Build / addition | Triage / subtraction |

These are categorically different design activities. ✓

---

## Section 1D — Full design specs for DP-C and OC-E

### 1D.1 DP-C "The AI Recommendation Becoming Apply Fix"

#### Loop duration
**LOOP = 7000ms desktop and mobile.** Within V3 body-demo §1.1 range (6–10s). Matches Concept X / Concept Z rhythm and Beat 3 drift detection (5s) for rhythm consistency across Ghost's bottom-of-page demos.

No MOBILE_DELTA needed — the demo is short, no settle-time pressure.

#### Visual composition
- **Container:** `.dpc-widget` 330px tall, `#F6F5F4` background, 12px radius, layered shadow matching `.dd-widget` and `.fix-hero-container` shells.
- **Browser bar:** mac traffic lights + URL `ghost.rotemgotlieb.com/scan/007/recommendation` (per body-demo §6 unique semantic URL slug).
- **Canvas (262px after browser bar):**
  - Centered card containing:
    - Title bar (small) — "AI Recommendation" + small lightbulb icon (top-left)
    - Body text: "Restore token **$text-secondary** to expected value."
    - Sub-text: small "Color Deviation — Table" reference tag
  - Apply Fix button — materialises mid-loop, NOT in initial DOM
  - Cursor + popup + markers floating layer
- **No badges row, no expected/found grid, no flow steps card** — those belong to the hero. DP-C deliberately strips down to just the recommendation card so the subject is unambiguous: "the recommendation, in isolation, becoming actionable."
- **Caption beneath:** "Pivot 3 — recommendation becomes action." (italic, centered, `.demo-frame-caption`)

#### Beat-by-beat (7000ms loop)

| Beat | T (ms) | Action |
|------|--------|--------|
| 1 | 0 | Container state: recommendation card visible, no Apply button, no markers, popup hidden. Cursor on recommendation card center (rest position from prior iter seam). |
| 2a | 0 → 600 | Cursor stationary 600ms — the WAIT. Viewer reads the recommendation text. The cursor on the card communicates "the designer is reading this." |
| 2b | 600 | `clickStamp()` on recommendation card. Marker 1 (green) appears at top-right of recommendation card (300ms scale-in). |
| 3 | 800 | Popup opens beside card with back-out cubic-bezier(0.34, 1.56, 0.64, 1) at 250ms. Header: "Add action?". Submit button: green "Add Apply". Cancel button: gray "Skip". |
| 4 | 1050 | Popup typing begins: "Recommendation only — make it actionable?" at 50ms/char. ~41 chars × 50ms = ~2050ms typing duration. Typing completes ~T=3100. |
| 5 | 3300 | Cursor → popup submit button (`getCenterOf(submitBtn, container)`, 440ms traversal). Arrives T=3740. |
| 6 | 3740 → 4040 | Cursor 300ms dwell on submit — the WAIT before commit. |
| 7 | 4040 | `clickStamp()` on submit. |
| 8 | 4190 | Popup hides (150ms ease). |
| 9 | 4340 | Apply Fix button slides in from right of recommendation card with back-out at 250ms. Marker 2 (green) appears at the new button center (300ms scale-in). |
| 10 | 4940 | Cursor → Apply Fix button (440ms traversal). Arrives T=5380. |
| 11 | 5380 → 5630 | 250ms freeze on Apply button — the viewer sees "the action exists." |
| 12 | 5630 | Cursor → rest position (recommendation card center) at SETTLE_MS=770ms. Arrives T=6400. |
| 13 | 6400 | Cleanup begins: Apply Fix button blur-fades out (300ms), Marker 1 disappears, Marker 2 disappears (both 150ms ease-out). |
| — | 6400 → 7000 | 600ms terminal freeze on cursor at rest position. Visual state returns to T=0 by T=7000. |
| LOOP | 7000 | Iteration N+1. `resetAllState()` confirms: no markers, no Apply button, popup hidden, recommendation card visible, cursor at rest. |

#### Cursor easing (per V3 §2.1)
- Cursor → submit traversal (beat 5): **ease-in-out** `cubic-bezier(0.77, 0, 0.175, 1)` at 440ms (engine default — on-screen traversal)
- Cursor → Apply button traversal (beat 10): ease-in-out 440ms (same)
- Cursor → rest position (beat 12): ease-in-out 770ms (SETTLE_MS — slow settle at loop seam)
- Cursor click stamping (beats 2b, 7): `clickStamp()` — V3 stamping motion (translateY 5px + drop-shadow shift), 100ms
- Popup entry (beat 3): back-out `cubic-bezier(0.34, 1.56, 0.64, 1)` at 250ms
- Apply button materialise (beat 9): back-out at 250ms
- Marker appear (beats 2b, 9): ease-out-quint `cubic-bezier(0.22, 1, 0.36, 1)` at 300ms

#### Freeze discipline (per V3 §2.3 + r2.5 explicit freeze rule)
- T=0 → T=600 — initial dwell on card (600ms cognition beat — reading the recommendation)
- T=3740 → T=4040 — pre-commit dwell on submit (300ms cognition beat — confirming the decision)
- T=5380 → T=5630 — 250ms freeze on materialised Apply button (terminal anticipation)
- T=6400 → T=7000 — 600ms terminal freeze on cursor at rest (loop seam exhale)

All freezes are setTimeout-gated by the Choreography engine. Between scheduled beats, NO motion is queued — true motionlessness, not easing artifacts.

#### Build → point → wait rhythm
This loop has three full build-point-wait cycles:

| Cycle | Build | Point | Wait | Act |
|-------|-------|-------|------|-----|
| 1 | T=0 initial state | T=0 cursor already at card (settled from prior iter) | 600ms (T=0→600) | clickStamp at T=600 → marker 1 + popup |
| 2 | T=750 popup opens + types out | T=3300 cursor → submit | 300ms (T=3740→4040) | clickStamp at T=4040 → popup hides → button materialises |
| 3 | T=4340 button slides in + marker 2 | T=4940 cursor → button | 250ms freeze (T=5380→5630) | Returns to rest at T=5630 |

Three judgments, each with a distinct cognition window. The middle cycle (popup typing) is the longest because the cognition there is the heaviest — "should this become actionable?"

#### Continuous-state loop seam (mirror-action)
At T=0 and T=7000 the visual state is IDENTICAL:
- Recommendation card visible, no Apply button, no markers, popup hidden, cursor on recommendation card center.

The iteration ends with explicit dissolves (beats 13 + 600ms terminal freeze) that mirror the additions at beats 2b + 7 + 9. Mirror-action seam per canonical-motion-spec §2.5.

#### Zero-position reset
`resetAllState()` called as first action of `runIteration()` per Single Unified Timeline §4.1 Rule 5:
- Remove `.is-visible` from button (or unmount Apply button DOM element if dynamically injected — TBD per implementation taste)
- `marker1.disappear()` then unmount
- `marker2.disappear()` then unmount
- `popup.hide()` (defensive — should already be hidden)
- Recommendation card classlist clean (no `.is-clicked` etc.)
- Cursor: NOT repositioned — cursor stays at rest on recommendation card from prior iter (continuous-state seam)

#### Reduced-motion path
Per `prefersReduced()`:
- Skip cursor mount entirely
- Skip popup mount
- Skip choreography
- Render END state statically: recommendation card visible WITH Apply Fix button visible at right edge, one green marker visible next to the button.
- Caption already explains the meaning ("Pivot 3 — recommendation becomes action."), no further text needed.

#### Mobile plan
- Same 330px body-demo height
- Same content composition (recommendation card is naturally narrow ~280px wide)
- No structural change needed — the cursor traversal targets are container-local (via `getCenterOf`)
- Verify: popup at mobile width — popup positions to the right of the card; if popup would overflow viewport, anchor LEFT of card instead. Handled in JS by checking `popup.show({ x })` against container width.

#### Engine primitives wired
- `Cursor` (clickStamp, moveTo, snapTo)
- `Choreography`
- `Popup` (show, typeInto, hide, submitVariant: 'green')
- `Marker × 2` (green variant)
- `LoopObserver`
- `prefersReduced`
- `getCenterOf`

#### Estimated bundle
JS: ~180-220 lines, ~5KB gz. CSS additions: ~80 lines (just the recommendation card composition; Apply button reuses hero's CSS conceptually).

#### File map
- New JS: `js/demos/ghost-process-decision.js?v=1` (DP-C choreography)
- CSS block in `styles.css`: `/* DEMO: GHOST PROCESS DECISION (Pivot 3 made visible) */`
- HTML: `<div class="dpc-widget" id="ghostProcessDecision">` markup in Design Process section after Pivot 3 prose

---

### 1D.2 OC-E "The Critical Three"

#### Loop duration
**LOOP = 7000ms desktop, MOBILE_DELTA = -800ms on the cleanup/terminal beats** (cleanup compresses on mobile to keep total <7s because the grid is denser and the cursor traversal distances longer per click).

Actually, on reflection: mobile grid is 3 cols × 7 rows so traversal is more vertical and similar in total distance. Skip MOBILE_DELTA — LOOP = 7000ms both viewports. Confirm during Phase 4 implementation if mobile feels rushed.

#### Visual composition
- **Container:** `.oce-widget` 330px tall (320px on mobile due to 7-row grid pressure), `#F6F5F4` background, 12px radius, layered shadow.
- **Browser bar:** mac traffic lights + URL `ghost.rotemgotlieb.com/scan/007/triage`.
- **Header strip (24px):** small severity dot (red) + label "Component triage · Scan 007" + counter "**0 / 21 critical**" (right-aligned, monospace).
- **Canvas:** 7×3 grid of 21 component cards.
- Each card: 100px wide × 70px tall (desktop) / 95px wide × 32px tall (mobile, 3-col layout).
  - Top: component name, 11px Satoshi 500
  - Middle: drift score, 22px JetBrains Mono bold (desktop) / 14px on mobile
  - Bottom-right: severity dot 6px (color-coded by score per Concept X thresholds)
- **Caption beneath:** "Triage — three of twenty-one need attention." (italic, centered)

#### Card data (matches Concept X seed values for honesty continuity)

| # | Component | Score | Default severity | Critical? |
|---|-----------|-------|------------------|-----------|
| 1 | Button | 96 | green | — |
| 2 | Input | 94 | green | — |
| 3 | Card | 92 | green | — |
| 4 | Toggle | 89 | yellow | — |
| 5 | Badge | 95 | green | — |
| 6 | Modal | 78 | yellow | **CRITICAL** (clickStamp #1) |
| 7 | NavBar | 91 | green | — |
| 8 | Tooltip | 87 | yellow | — |
| 9 | Dropdown | 84 | yellow | — |
| 10 | Avatar | 93 | green | — |
| 11 | Tab | 88 | yellow | — |
| 12 | Progress | 96 | green | — |
| 13 | Switch | 81 | yellow | — |
| 14 | Slider | 85 | yellow | — |
| 15 | Checkbox | 92 | green | — |
| 16 | Radio | 90 | green | — |
| 17 | Select | 77 | yellow | **CRITICAL** (clickStamp #2) |
| 18 | Tag | 94 | green | — |
| 19 | Banner | 83 | yellow | **CRITICAL** (clickStamp #3) |
| 20 | Spinner | 97 | green | — |
| 21 | Divider | 99 | green | — |

The three critical picks (Modal/Select/Banner) are NOT the bottom three by score — Modal (78), Select (77), Switch (81) would be. But Banner (83) reads more triageable than Switch because Banner is a more prominent UI element. Defensible: "Modal and Select are the lowest; Banner is a high-visibility component with significant drift — I flagged it intentionally." This is interview-real.

Alternative: pick the bottom three by score (Modal 78, Select 77, Switch 81) for pure data-driven defensibility. Decide at Phase 4 build. I'll proceed with Modal/Select/Banner because the three are more spatially distributed across the grid (different rows AND columns), giving the cursor more visible traversal.

#### Beat-by-beat (7000ms loop)

| Beat | T (ms) | Action |
|------|--------|--------|
| 1 | 0 | 21 cards at 100% opacity. Counter "0 / 21 critical". Cursor at rest position (above the grid, slightly off the first card). |
| 2 | 0 | Cursor → Modal card (row 1, col 6). 440ms traversal. Arrives T=440. |
| 3 | 440 → 740 | Hover dwell 300ms — viewer sees "the designer is evaluating Modal." Modal card gets `.is-hovered` subtle border highlight. |
| 4 | 740 | `clickStamp()`. Modal gets `.is-critical` class: red border + drift score number color → red. Marker 1 (red) appears at Modal card top-right. Counter ticks "1 / 21 critical". Cursor stays on Modal card. |
| 5 | 940 | Cursor → Select card (row 3, col 3). 440ms diagonal traversal. Arrives T=1380. |
| 6 | 1380 → 1730 | Hover dwell 350ms (varied from beat 3's 300ms). |
| 7 | 1730 | `clickStamp()`. Select critical. Marker 2 (red). Counter "2 / 21 critical". |
| 8 | 1930 | Cursor → Banner card (row 3, col 5). 440ms traversal. Arrives T=2370. |
| 9 | 2370 → 2650 | Hover dwell 280ms (varied — fastest, pattern recognised). |
| 10 | 2650 | `clickStamp()`. Banner critical. Marker 3 (red). Counter "3 / 21 critical". |
| 11 | 3000 | After 350ms post-click dwell on Banner: the 18 non-critical cards crossfade to 30% opacity in a 50ms-per-row cascade. Total cascade ~150ms (3 rows × 50ms). Card cascade duration per-card ~600ms. By T~3750 all 18 non-critical cards are at 30%. Counter morphs (250ms ease): "3 / 21 critical" → "3 critical · 18 healthy". |
| 12 | 3800 | Cursor → rest position (above grid). 770ms settle (SETTLE_MS). Arrives T=4570. |
| 13 | 4570 → 6400 | 1830ms terminal freeze on cursor at rest. The viewer ABSORBS the triage result — "3 critical, 18 healthy." This is the loop's payoff. |
| 14 | 6400 | Cleanup phase begins. Markers 1+2+3 disappear (150ms). |
| 15 | 6550 | Critical card states revert: red borders fade out (300ms ease), score colors revert (300ms ease). 18 faded cards return to 100% opacity (300ms ease, no stagger — quick uniform restore). Counter morphs back to "0 / 21 critical" (250ms ease). |
| — | 6850 → 7000 | 150ms final terminal silence — state matches T=0. |
| LOOP | 7000 | Iteration N+1. |

#### Cursor easing
- Cursor → card traversals (beats 2, 5, 8): ease-in-out 440ms (engine default)
- Cursor → rest (beat 12): ease-in-out 770ms (SETTLE_MS)
- clickStamp (beats 4, 7, 10): V3 stamping motion 100ms

#### Freeze discipline
- T=4570 → T=6400 — 1830ms terminal freeze, the loop's payoff window
- During cleanup (beats 14-15), the cursor is motionless. Only the cards animate.

#### Build → point → wait rhythm — varied dwells per V3 §2.3 polyrhythmic discipline

| Click | Hover dwell | Cognition character |
|-------|-------------|---------------------|
| 1 (Modal) | 300ms | "First evaluation — decisive" |
| 2 (Select) | 350ms | "Second look — slightly longer, confirming the pattern" |
| 3 (Banner) | 280ms | "Pattern recognised — fastest" |

Intervals between clicks (clickStamp T-times): 740, 1730, 2650 → gaps 990, 920. Non-uniform. ✓

#### Continuous-state loop seam (mirror-action)
At T=0 and T=7000:
- All 21 cards at 100% opacity, default severity colors, no `.is-critical` class, no red borders, no markers
- Counter at "0 / 21 critical"
- Cursor at rest position above the grid

Iteration ends with explicit reversion (beats 14, 15) of every change made in iter N. ✓

#### Zero-position reset
`resetAllState()`:
- `marker1.disappear()` + unmount; same for marker2, marker3
- Every card: remove `.is-critical`, `.is-faded`, `.is-hovered` classes
- Counter element: textContent "0 / 21 critical"
- Cursor: stays at rest (snapped from prior iter)

#### Reduced-motion path
Per `prefersReduced()`:
- Skip cursor, markers, choreography
- Render END state: 21 cards visible, 3 marked critical (Modal/Select/Banner with red borders + small red marker pins next to them), other 18 cards at 30% opacity. Counter shows "3 critical · 18 healthy".

#### Mobile plan
- 3 cols × 7 rows on mobile @ 640px (matches Concept X mobile decision per design doc Risk 6).
- Card height ~32px, name 10px, score 14px, dot 5px.
- The three critical components (Modal/Select/Banner) must be at indices 6 / 17 / 19 in the flat array. In a 3-col grid:
  - Modal (idx 6, 0-indexed 5) → row 2 col 3 (3-col flow)
  - Select (idx 17, 0-indexed 16) → row 6 col 2
  - Banner (idx 19, 0-indexed 18) → row 7 col 1
  - Distribution: still spatially varied (different rows, different cols). ✓
- Cursor traversal distances on mobile are LONGER (vertical) but same 440ms duration — feels appropriately slower.

#### Engine primitives wired
- `Cursor` (clickStamp, moveTo, snapTo)
- `Choreography`
- `Marker × 3` (red variant)
- `LoopObserver`
- `prefersReduced`
- `getCenterOf`
- NO popup. NO blurCrossfade (CSS-only crossfades on cards).

#### Estimated bundle
JS: ~200-240 lines, ~5.5KB gz. CSS additions: ~180 lines (21-card grid + states + mobile responsive). Net: ~6KB gz added.

#### File map
- New JS: `js/demos/ghost-process-triage.js?v=1` (OC-E choreography)
- CSS block in `styles.css`: `/* DEMO: GHOST PROCESS TRIAGE (Critical 3 of 21) */`
- HTML: `<div class="oce-widget" id="ghostProcessTriage">` markup inside Outcome section, before Other Work cards

---

## Section 1E — Visual consistency + honesty audit

### 1E.1 Visual language consistency (both demos)

| Element | Standard | DP-C | OC-E |
|---------|----------|------|------|
| Browser chrome | mac dots + URL bar, same styling as `.fix-hero-browser-bar` | ✓ `.dpc-widget-browser-bar` | ✓ `.oce-widget-browser-bar` |
| URL slug | unique semantic per body-demo §6 | `/scan/007/recommendation` | `/scan/007/triage` |
| Container bg | `#F6F5F4` | ✓ | ✓ |
| Container radius | `12px` | ✓ | ✓ |
| Container shadow | matches hero | ✓ | ✓ |
| Severity colors | green `#22c55e`, yellow `#eab308`, orange `#f97316`, red `#dc2626` | ✓ (green markers) | ✓ (red markers + borders) |
| Typography labels | system 11-12px, weight 500-600 | ✓ | ✓ |
| Typography numeric | JetBrains Mono | N/A | ✓ (drift scores + counter) |
| Card radius | 8px (matches hero deviation rows) | ✓ (recommendation card) | ✓ (21 cards) |
| Cursor easing default | ease-in-out cubic-bezier(0.77, 0, 0.175, 1) 440ms | ✓ | ✓ |
| Cursor click | clickStamp (V3 stamping) | ✓ | ✓ |
| Marker variant | green / red | green | red |
| Marker easing | ease-out-quint 300ms | ✓ | ✓ |
| Popup easing | back-out 250ms | ✓ | N/A |
| Caption | `.demo-frame-caption` italic centered | ✓ | ✓ |
| Voice | "Deviation detected" / "Recommendation" not "violation" | ✓ "Add action?" / "make it actionable" | ✓ "Component triage" / "critical" / "healthy" |
| Body demo height | 330px ±20px | 330px ✓ | 330px desktop / 320px mobile ✓ |
| App chrome stripped | per body-demo §2 | ✓ no sidebar/nav | ✓ no sidebar/nav |
| Real-text discipline | wireframe + strategic real-text per body-demo §3 | ✓ (recommendation text, button labels — both are subjects) | ✓ (component names, drift scores, counter — all subjects) |

Both demos clear every consistency check.

### 1E.2 Honesty audit (interview-defensible per bar 3)

**DP-C "Apply Fix becoming button":**
- Q: "Did you actually add an Apply Fix button to the recommendation card?" → A: "Yes. Pivot 3 of the case study. It's the live state in the hero AI Fix Flow."
- Q: "Are these the real Expected/Found values?" → A: "Yes — `$text-secondary`, expected `#9CA3AF`, found `#6B7280`, delta −1.4:1 contrast. Same values as the hero deviation."
- Q: "Why an annotation popup mid-decision?" → A: "It's the artifact of the design decision being made — a designer's note to themselves: 'make this actionable.' Inspired by Benji Taylor's Agentation pattern."
- Q: "30-second pitch?" → A: "Watch me make Pivot 3 — the moment Ghost stopped being an audit tool and became a remediation tool. The cursor evaluates an informational recommendation, decides it needs to do more, and the Apply Fix button materialises."

**OC-E "The Critical Three":**
- Q: "Are these the 21 components Ghost tracks?" → A: "Yes. Button, Input, Card, Toggle, Badge, Modal, NavBar, Tooltip, Dropdown, Avatar, Tab, Progress, Switch, Slider, Checkbox, Radio, Select, Tag, Banner, Spinner, Divider. Same list as the case study claims."
- Q: "Why Modal, Select, Banner specifically?" → A: "Modal and Select have the lowest drift scores at 78 and 77 — they need work. Banner at 83 is a high-visibility component with significant drift, which makes it triage-worthy even though others score lower. The selection reflects how I actually triage."
- Q: "What if I pushed back on Banner?" → A: "Fair — by pure score, Switch at 81 would be third. I picked Banner because user-facing prominence factors into triage priority. Defensible either way."
- Q: "30-second pitch?" → A: "21 components, three of them critical. Watch me triage. The cursor visits each problem card, marks it, and when the third is flagged the rest of the system fades to show what doesn't need attention right now. That's what Ghost does as a tool — narrows 21 components to the 3 that matter."

### 1E.3 Distinctness summary (bar 2)

The two loops show categorically different design thinking:

- **DP-C** demonstrates **a single architectural choice mid-project** ("should this UI element become more than informational?"). One pivot, one decision, one material consequence.
- **OC-E** demonstrates **system-wide triage late-project** ("what across 21 things needs attention?"). Three independent judgments, a fade-the-rest visual result.

The two loops also use different engine primitives in different ways:
- DP-C: Cursor + Popup + 2 Markers (additive — things appear)
- OC-E: Cursor + 3 Markers + cascade fade (subtractive — things disappear / dim)

The hero, by contrast, demonstrates **executing a known fix** (Apply Fix → 3 steps → done). It's the action, not the design choice. The three together — hero + DP-C + OC-E — form a complete arc: HOW Rotem decides what Ghost should do (DP-C), HOW Ghost triages the system (OC-E), HOW Ghost executes a fix (hero).

---

## Section 1F — Risk surface + self-critique

### Risk 1 — DP-C popup may read as system prompt rather than designer's tool

A Benji-style popup with header + input + Cancel/Submit can read EITHER as:
- (designer mode) "I am annotating this — adding a note that says X"
- (system mode) "Ghost is asking me if I want to add X"

The latter would push the loop back toward the autopilot reading we're avoiding.

**Mitigation:**
- Header text framing: "Add action?" (interrogative phrased as designer's own question, not system asking)
- Submit button: "Add Apply" — imperative-from-designer ("I will add Apply"), not "Confirm" or "OK"
- Cursor enters the popup at the SUBMIT button only (skipping the header) — reads as "the designer wrote the question themselves and now answers it." Not as "the system asked, the designer pushes a button."
- The popup body field types a message that's clearly self-directed: "Recommendation only — make it actionable?" — this is a designer's note-to-self phrasing, not a system request.

### Risk 2 — OC-E non-critical fade may read as "system did the rest" (autopilot)

After the third clickStamp, the 18 non-critical cards fade WITHOUT a cursor action. Risk: the fade reads as the system intervening, undoing the cursor-as-agent framing.

**Mitigation:**
- Cursor stays on the Banner card during the fade (NOT at rest). The fade is positioned as a CONSEQUENCE of the third click, like a system-state update that follows the designer's input.
- Fade starts 350ms AFTER the third click — long enough that the click is clearly the cause, short enough that the fade doesn't feel like a separate event.
- Counter morph "3 / 21 critical" → "3 critical · 18 healthy" happens DURING the fade (same 600ms window). The cursor's third decision IS the trigger for the system-summary state.

This frames the fade as: "the designer made the call; the tool reflects it."

### Risk 3 — DP-C visual overlap with hero deviation panel

The recommendation card in DP-C is structurally a subset of the hero detail panel (which also contains a recommendation card). Risk: viewers read DP-C as "miniature version of the hero" — violates Case Study Opener Rule §4 ("hero artifact does NOT also appear in the body").

**Mitigation:**
- DP-C strips ALL surrounding context — no badges row, no Expected/Found grid, no flow steps card. Just the recommendation card alone on the canvas.
- The recommendation card in DP-C has NO Apply Fix button initially. The hero's recommendation card HAS the button. The two states are visually distinct: hero = "with button"; DP-C = "without button → becomes with button."
- The popup in DP-C is unique to DP-C (hero uses no popup). The popup is a strong visual signature that distinguishes the demos at a glance.
- Container shell (`.dpc-widget`) is body-demo height 330px vs hero's full-app-chrome 600px+. The framing is unmistakably "small body demo" vs "large hero demo."

### Risk 4 — OC-E counter must update mid-loop without breaking continuous-state seam

The counter ticks "0 → 1 → 2 → 3 → '3 critical · 18 healthy'" then resets to "0" at cleanup. Risk: any drift in counter timing breaks the loop seam if the counter element's transition tail extends past T=7000.

**Mitigation:**
- Counter uses `textContent` writes — instant, no transition tail.
- Counter morph from "3 / 21 critical" → "3 critical · 18 healthy" uses an opacity-blur crossfade (250ms) but completes by T=3500, well before loop seam.
- Counter reset to "0 / 21 critical" happens at T=6850, completing before T=7000 LOOP. Verified.

### Risk 5 — Both demos exceed simple body-demo discipline by having multiple clicks + popups

CLAUDE.md body-demo §4: "Loop duration 6–10 seconds OR interactive widget. First action within ~600ms when autoplay." Both demos clear the duration check (7000ms). First action check:
- DP-C first action: clickStamp at T=600 — within 600ms ✓ (it's the start of the loop, the 600ms IS the cognition wait, not a setup delay)
- OC-E first action: clickStamp at T=740 — 140ms past the 600ms guideline. The 440ms cursor traversal + 300ms hover dwell = 740ms total.

For OC-E, the cursor STARTS moving at T=0 (the WAIT before action is the in-flight cursor + hover, not a static dwell). Per V3 §2.3 "Mid-narrative compressed dwell: 150–200ms," the 300ms hover is on the higher end but still within range. Acceptable.

Alternative: compress hover dwells uniformly to 200ms each → first clickStamp at T=640, well under 600ms. But uniform 200ms makes the rhythm more metronomic. Stick with 300/350/280ms varied — the 140ms overage is worth the polyrhythm.

### Risk 6 — Both demos must NOT use the hero's existing CSS classes verbatim

The hero uses `.fix-hero-row`, `.fix-hero-apply-btn`, `.fix-hero-flow-step` etc. If DP-C or OC-E reuse these class names, they may inherit hero-specific layout (e.g., the row's role inside a `ul.fix-hero-deviation-list`).

**Mitigation:** new class namespaces — `.dpc-widget-*` and `.oce-widget-*`. Each new demo gets its own CSS block. Visual STYLING reuses values (border-radius 8px, severity color hex codes, typography stack) but selector hierarchies are independent.

### Risk 7 — Build complexity + schedule

DP-C estimate: ~3 hours implementation (similar complexity to Beat 3 drift detection — Cursor + Popup + Markers + Choreography).
OC-E estimate: ~3.5 hours (21-card grid + 3 markers + cascade fade is denser than DP-C).
Combined: ~6.5 hours Phase 3+4.

Plus teardown + Phase 5 = ~8.5 hours total. Realistic for the sprint.

### Risk 8 — Bundle size

Current per-page JS bundle on `work/ghost.html`:
- ghost-slider.js
- ghost-view-modes-widget.js
- ghost-ai-fix-flow-hero.js (~6.9 KB gz)
- ghost-drift-detection.js (~3.8 KB gz)
- ghost-token-health.js (~3.7 KB gz) ← REMOVED by teardown
- ghost-pipeline.js (~4 KB gz) ← REMOVED by teardown
- Engine: ~6 KB gz

Phase 2 teardown removes: -7.7 KB gz
Phase 3+4 adds: ~10 KB gz (DP-C 5 KB + OC-E 5.5 KB)
Net delta: **+2.3 KB gz**. Negligible.

### Risk 9 — Continuous-state seam math is simpler than Concept X/Z but still has invariants

Both DP-C and OC-E use mirror-action seams (everything added is reversed before LOOP). The Choreography engine handles timing; the `resetAllState()` callback handles state. Risk: forgetting to reset a property (the V2 loop trap).

**Mitigation:** explicit `resetAllState()` checklists per demo, asserted in code comments. Use cursor.snapTo only at first iter (continuous-state seam means cursor stays at rest position from prior iter — same pattern as hero r2.6).

### Risk 10 — Self-critique: am I being too cautious?

The user prompt emphasized "no safe choices, no easier paths." Am I picking DP-C + OC-E because they're easy or because they're strong?

Honest self-check:
- DP-C is the most narratively-aligned of the three DP candidates. It directly mirrors Pivot 3 from the prose. That's NOT a safe choice — it puts a body demo right next to the case study's biggest claim and dares the viewer to compare. Risk: if the demo is weaker than the prose, the contrast hurts.
- OC-E has THREE explicit decisions per loop, against OC-C's annotation (passive) and OC-A's placement (non-judgment). It's the highest-decision-tension option.
- The runner-up DP-A (slider promotion) is theatrically bigger but relies on a fabricated v1 donut. I chose against because honesty (bar 3) outranks theatricality.
- The runner-up OC-C (Pivot Map) is the most polished narratively but the cursor doesn't decide — it labels. Bar 1 fails.

My recommendation set IS the strongest. Not the easiest.

### 1F.11 The four bars — explicit final check

| Bar | DP-C | OC-E |
|-----|------|------|
| 1. Decision-tension | ✓ — informational vs actionable is a real architectural decision; the popup makes the decision-step explicit | ✓ — three distinct triage judgments, each with a 300ms cognition dwell |
| 2. Distinct thinking-type | ✓ — single pivot vs OC's multi-judgment triage | ✓ — system-wide vs DP's single-element |
| 3. Interview-defensible | ✓✓ — every beat traces to Pivot 3 from the case study prose | ✓✓ — every component name and triage call defensible |
| 4. Real Ghost components | ✓ — recommendation card + Lightbulb + Apply button + popup + 2 markers | ✓ — 21 real component names + severity color system + 3 markers + counter |

Both clear all four. Concept gate ready.

---

## Section 1G — Implementation file map (preview for Phases 2–5)

### Phase 2 — teardown (after concept approval)

**Delete:**
- `js/demos/ghost-token-health.js`
- `js/demos/ghost-pipeline.js`

**Remove from `work/ghost.html`:**
- `<div class="th-widget" id="ghostTokenHealth">…</div>` and surrounding comment block + caption + script tag
- `<div class="pl-widget" id="ghostPipeline">…</div>` and surrounding comment block + caption + script tag

**Remove from `styles.css`:**
- `/* DEMO: GHOST LIVE TOKEN HEALTH DASHBOARD */` block (~190 lines)
- `/* DEMO: GHOST LIVE REMEDIATION PIPELINE */` block (~300 lines)

**Verify:**
- `grep -rn "th-widget\|ghostTokenHealth\|pl-widget\|ghostPipeline"` → 0 hits in active files (will hit in `_archive/`)
- Cache-bust styles.css v=54 → v=55

### Phase 3 — DP-C build

**Create:**
- `js/demos/ghost-process-decision.js?v=1` (~200 lines, ~5 KB gz)

**Add to `styles.css`:**
- `/* DEMO: GHOST PROCESS DECISION (Pivot 3 made visible) */` block (~80 lines)

**Add to `work/ghost.html`:**
- `<div class="dpc-widget reveal" id="ghostProcessDecision">…</div>` block inside Design Process section, between Pivot 3 prose paragraph and Key Decisions section
- `<script type="module" src="../js/demos/ghost-process-decision.js?v=1" defer></script>`

**Cache-bust:**
- styles.css v=55 → v=56

### Phase 4 — OC-E build

**Create:**
- `js/demos/ghost-process-triage.js?v=1` (~220 lines, ~5.5 KB gz)

**Add to `styles.css`:**
- `/* DEMO: GHOST PROCESS TRIAGE (Critical 3 of 21) */` block (~180 lines)

**Add to `work/ghost.html`:**
- `<div class="oce-widget reveal" id="ghostProcessTriage">…</div>` block inside Outcome section, before Other Work cards
- `<script type="module" src="../js/demos/ghost-process-triage.js?v=1" defer></script>`

**Cache-bust:**
- styles.css v=56 → v=57

### Phase 5 — report + spec update

**Create:**
- `.claude/sprint-reports/2026-05-27-process-loops.md` (final report)

**Update:**
- `.claude/canonical-motion-spec.md` Appendix with reusable patterns surfaced during build (if any)
- `.claude/learnings.md` — append sprint-level lessons

---

## Section 1H — Decision gate

Before Phase 2 (teardown) begins, the user reviews:

**Q1 — Design Process slot:** approve DP-C ("The AI Recommendation Becoming Apply Fix" — Pivot 3 visualised) as scoped? Or pick DP-A (Slider promotion) or DP-B (Severity sort)?

**Q2 — Outcome slot:** approve OC-E ("The Critical Three" — system-wide triage of 21 components) as scoped? Or pick OC-C (Pivot Map) or OC-A (Assembling the 21)?

**Q3 — Distinctness:** both recommended concepts show categorically different thinking-types (architectural pivot vs system-wide triage). Confirm or flag overlap.

**Q4 — Risk acknowledgements:** any of risks 1–10 (§1F) want pre-built mitigation rather than reactive handling during Phase 3/4?

After concept approval, Phase 2 (teardown) begins immediately, and Phases 3-5 run uninterrupted.

---

*End of design document body. Concept gate resolved — see §2 below.*

---

## Section 2 — DECISION LOCKED (post-gate, 2026-05-27)

**User picked:** DP-B (refined as **vocabulary-build**, per §2.1 below) + OC-E ("The Critical Three"). The narrative arc: **Design Process builds the severity language; Outcome wields it at scale.**

**Honesty confirmed by user:** severity vocabulary (Breaking / Critical / Minor / Resolved) is a real design decision Rotem made for Ghost. Both demos are interview-defensible.

**Distinctness contract:** the two loops must read as categorically different activities — *building a legend* vs *triaging a system*. If during build either demo starts resembling the other (or the hero), differentiate.

**Build mandate:** Phases 2–5 run uninterrupted. Build gates at end of Phase 3 and Phase 4 = before/after beat table + one-line honesty + distinctness self-check. No claims about visual quality (Rotem's call at final review).

### 2.1 DP-B refined spec — "Building the Severity Language"

**Pitch:** the cursor demonstrates Rotem defining Ghost's severity vocabulary. An empty 4-row legend (Breaking / Critical / Minor / Resolved) sits above an unclassified deviation list. The cursor picks colors for three legend rows in sequence (Breaking → red, Critical → orange, Minor → yellow). As each legend row is defined, the matching deviation rows in the list below snap to their just-defined severity — the system reflecting the vocabulary in real time. Resolved stays empty (it's the future state, not something to define now).

**Decision (×3):** "Breaking means red. Critical means orange. Minor means yellow."

**Thinking-type:** vocabulary build / taxonomy establishment.

**Loop duration:** 7000ms desktop and mobile.

**Visual composition:**
- Container: `.dpb-widget` 330px tall, `#F6F5F4` background, 12px radius, layered shadow.
- Browser bar: mac dots + URL `ghost.rotemgotlieb.com/scan/007/severity`
- Canvas split horizontally:
  - **TOP region (~40% of canvas):** "Severity legend" header label + 4 legend rows. Each row: severity name (left, 12px) + empty color swatch box 24×24px (right). Initial state: all 4 swatches empty (subtle gray placeholder fill).
  - **BOTTOM region (~60%):** "Unclassified · Scan 007" label + 4 deviation rows mirroring hero deviation structure. Each row: empty dot (left, gray) + label + meta. Real Ghost text:
    - "Color Deviation — Table · #text-secondary" → will become red (breaking)
    - "Spacing — Card padding · 16 → 12" → will become orange (critical)
    - "Radius — Button corner · 8 → 6" → will become orange (critical)
    - "Font weight — Caption · 500 → 400" → will become yellow (minor)

**Beat-by-beat (7000ms loop):**

| Beat | T (ms) | Action |
|------|--------|--------|
| 1 | 0 | Initial state: 4 empty legend swatches, 4 empty deviation dots, no markers. Cursor at rest at top-left above the legend (snapped from prior iter). |
| 2 | 0 | Cursor → Breaking legend row (440ms traversal). Arrives T=440. |
| 3 | 440 → 740 | Hover dwell 300ms — viewer reads "Breaking" label alongside cursor. |
| 4 | 740 | `clickStamp()` on Breaking row. Marker 1 (red) appears at the row (300ms scale-in). Popup opens beside legend: header "Severity color?" + 4-swatch picker row (red/orange/yellow/green) + Cancel + green "Confirm" submit. Popup entry 250ms back-out. |
| 5 | 990 | Cursor → red swatch in popup (350ms traversal). Arrives T=1340. |
| 6 | 1340 → 1540 | Hover dwell 200ms — decisive (the obvious choice). |
| 7 | 1540 | `clickStamp()` on red swatch. Popup hides (150ms ease). At T=1690 the Breaking legend swatch fills red (back-out 250ms) AND simultaneously the Color Deviation row's empty dot fills red (matching back-out). The system reflects the just-defined vocabulary. |
| 8 | 1940 | Cursor → Critical legend row (440ms). Arrives T=2380. |
| 9 | 2380 → 2730 | Hover dwell 350ms — slightly longer ("is critical orange or red?"). |
| 10 | 2730 | `clickStamp()`. Marker 2 (orange) appears. Popup re-opens. |
| 11 | 2980 | Cursor → orange swatch (350ms). Arrives T=3330. |
| 12 | 3330 → 3530 | Hover dwell 200ms. |
| 13 | 3530 | `clickStamp()` orange. Popup hides. At T=3680 legend fills orange + Spacing row dot fills orange + Radius row dot fills orange (80ms stagger between the two deviation rows). |
| 14 | 3960 | Cursor → Minor legend row (440ms). Arrives T=4400. |
| 15 | 4400 → 4680 | Hover dwell 280ms — pattern recognised, fastest of the three. |
| 16 | 4680 | `clickStamp()`. Marker 3 (yellow) appears. Popup opens. |
| 17 | 4930 | Cursor → yellow swatch (350ms). Arrives T=5280. |
| 18 | 5280 → 5480 | Hover dwell 200ms. |
| 19 | 5480 | `clickStamp()` yellow. Popup hides. At T=5630 legend fills yellow + Font weight row dot fills yellow. |
| 20 | 5910 | Cursor → rest position (above legend) at SETTLE_MS 770ms. Arrives T=6680. |
| 21 | 6680 | 320ms terminal freeze on cursor at rest — viewer absorbs "the language is built. Legend has 3 colors defined; 4 deviations classified; one slot (Resolved) intentionally empty." |
| 22 | 6700 | Cleanup begins. Markers 1+2+3 disappear (150ms ease-out). Legend swatches blur-fade to empty (300ms). Deviation row dots blur-fade to empty (300ms). |
| LOOP | 7000 | Iteration N+1. State matches T=0. |

**Polyrhythmic dwells (per V3 §2.3):** Three legend-row hovers at 300/350/280ms (decisive → questioning → recognising pattern). Three popup-swatch hovers at 200/200/200ms (decisive each time). Two different dwell flavors → variation between the legend-row and popup-swatch contexts, uniformity within each context. Reads as human.

**Cursor easing:** all V3 traversal at 440ms (engine default ease-in-out). SETTLE_MS=770ms on the rest move. clickStamps at 100ms (V3 stamping).

**Freeze discipline (setTimeout-gated true motionless):**
- T=440 → T=740: 300ms hover on Breaking legend
- T=1340 → T=1540: 200ms hover on red swatch
- T=2380 → T=2730: 350ms hover on Critical legend
- T=3330 → T=3530: 200ms hover on orange swatch
- T=4400 → T=4680: 280ms hover on Minor legend
- T=5280 → T=5480: 200ms hover on yellow swatch
- T=6680 → T=7000: 320ms terminal freeze (during which cleanup runs on legend/list, cursor itself motionless)

Between beats: no motion scheduled in the gaps. True freeze, not easing tail.

**Continuous-state seam:** mirror-action. Every fill (legend swatch + deviation dot) is reversed by cleanup phase. Markers disappear. Cursor stays at rest. T=0 ≡ T=7000.

**Engine primitives:** Cursor + Choreography + Popup (4-swatch picker — custom variant) + Marker × 3 (red, orange, yellow variants) + LoopObserver + prefersReduced + getCenterOf.

**Popup adaptation note:** the engine's `Popup` is set up for header + text input + Cancel/Submit. For DP-B we need a 4-swatch picker instead of a text input. Two options:
1. Extend Popup engine with a `setSwatches([colors])` API (adds engine surface area)
2. Build the picker INLINE in DP-B's markup (4 swatches as siblings of the popup, or as picker-specific elements positioned via JS)

Decision: option 2. The picker is DP-B-specific and the engine should stay generic. Picker lives in `.dpb-widget-picker` markup, positioned by JS via `getCenterOf` on the legend row. Simpler than extending the engine, keeps Popup clean.

Actually — second look: the engine Popup has a generic structure that can be repurposed. The "input field" slot in `.demo-comment-popup__input` can be replaced inline by setting innerHTML or using a CSS adaptation. But cleanest is option 2: dedicated `.dpb-widget-picker` markup that's NOT a Popup — just a small floating picker panel. This avoids engine extension entirely.

**Reduced-motion:** static end state — legend fully populated with 3 colors (1 empty), deviation list fully classified, one tiny green marker visible.

**Mobile:** same 330px height. Legend and deviation list stack vertically already, so mobile mainly needs typography scaling. Picker popup positioning may need adjustment if it overflows narrow viewports — anchor on canvas-side closer to legend row instead of straight right.

**Components used (real Ghost):**
- Severity vocabulary (Breaking / Critical / Minor / Resolved) — real, Rotem-defined
- Severity colors (#dc2626 / #f97316 / #eab308 / #22c55e) — real, used throughout
- Deviation row composition (dot + label + meta) — real, mirrors hero deviation list
- Real deviation text strings — match hero exactly (#text-secondary, 16 → 12, 8 → 6, 500 → 400)

**Distinctness vs OC-E:**
- DP-B has 4+4 = 8 horizontal rows + popup picker; OC-E has 21 cards in 7×3 grid + no popup
- DP-B: vocabulary build (additive — colors appear); OC-E: triage (subtractive — non-critical cards fade)
- DP-B markers: 3 different colors (red/orange/yellow); OC-E markers: 3 same color (red)
- DP-B vocabulary establishes the LANGUAGE; OC-E uses it AT SCALE on a system

**Distinctness vs hero:**
- DP-B uses a popup picker (hero uses none)
- DP-B canvas is split-panel (legend + deviation list); hero is full-app-chrome
- DP-B markers cascade red→orange→yellow; hero uses a single green marker

### 2.2 OC-E spec — unchanged from §1D.2

OC-E remains as fully spec'd in §1D.2 — "The Critical Three" with 21 cards, three red markers, cascade fade for the 18 non-critical, varied 300/350/280ms cognition dwells.

### 2.3 Build gates

End of Phase 3 (DP-B done) and end of Phase 4 (OC-E done) each output:
1. Before/after beat table (planned vs implemented)
2. One-line honesty self-check (does every beat trace to a real design decision Rotem made?)
3. One-line distinctness self-check (does the demo look categorically distinct from the OTHER demo + from the hero?)

No claim on visual quality — Rotem's call at final review.

---

*Design doc locked at end of Phase 1. Build proceeds.*
