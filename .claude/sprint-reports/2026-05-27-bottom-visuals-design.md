# Bottom Visuals Sprint — Design Document

**Date:** 2026-05-27

**Sprint goal:** build two world-class autoplay loops that replace the bottom visuals of the Ghost case study. These are the rhetorical payoff of the case study — the last visuals hiring managers see before forming an impression. Both must land at hero-tier polish.

**The two demos:**
1. **Concept X — Live token health dashboard** — replaces `ghost-scan-complete.js` in Design Process section. Argues Pivot 3 (Detection became detection-to-remediation) by showing Ghost continuously monitoring 21 components in real-time.
2. **Concept Z — Live remediation pipeline** — ADDS a new visual to the Outcome section (currently has no visual). Argues the synthesis of the entire case study by visualizing Ghost's end-to-end Detect → Diagnose → Remediate flow.

**Design discipline:** every element earns its motion. Every value-change communicates something the prose argues. No decoration. Real Ghost product UI fidelity, not abstract infographic. Continuous-state loop seams that are mathematically invisible.

**Sprint phases:**
- Phase 1 (this doc): comprehensive design — PAUSE for user review
- Phase 2: teardown Scan Complete
- Phase 3: build Concept X — PAUSE for user visual review
- Phase 4: build Concept Z — PAUSE for user visual review
- Phase 5: final report + canonical-motion-spec.md Appendix update

---

## Section 1A — Translation framework: cursor demos → data-driven demos

The canonical motion specification was largely written for cursor-driven choreography (the hero is the worked example). Neither demo in this sprint has a cursor. Before any concept-level design, we need a one-page translation showing how V3 cursor principles map to data-driven motion. **This translation also lands as a permanent addition to canonical-motion-spec.md Appendix in Phase 5** so future Claude sessions inherit the framework.

### The seven translations

| Cursor demo principle (V3 source) | Data-driven demo equivalent | Application in this sprint |
|------------------------------------|-----------------------------|----------------------------|
| **Cursor easing by motion context** (canonical §2.1: ease-out for arrivals, ease-in for exits, ease-in-out for traversal) | **Data update easing by change type.** Score INCREASE (drift detected = problem appearing) uses ease-out — fast attack, lands softly. Score DECREASE (drift resolved = problem fading) uses ease-in — slow start, accelerates away. Score MICRO-FLUCTUATION (continuous monitoring noise) uses ease-in-out — gentle oscillation. | Concept X drift scores micro-animate with ease-in-out (continuous noise); when scanning line hits a tile and drift spikes, that update uses ease-out (drift "appearing"). Concept Z ticket transitions between stages use ease-in-out (in-flight motion). |
| **Freeze discipline** (canonical §2.3 + r2.5 learnings: when value should be stable, it is mathematically stable — no easing artifacts) | **Value-hold discipline.** Numbers stable between updates are EXACTLY stable. No subtle drift between micro-animations. The freeze IS the value-being-stable, not an easing curve ending. | Concept X tile scores hold EXACTLY between micro-fluctuation cycles. Concept Z ticket card values (component name, severity dot) hold EXACTLY while ticket is in a stage. |
| **Snap-pause-snap rhythm** (canonical §2.4: instant-fast / load-bearing-pause / quick-resolution for multi-step UI) | **Rhythmic update cadence, never metronomic.** When multiple values update in sequence (e.g., tiles updating as scanning line passes), the cadence is human-irregular, not uniform interval. Pause between updates corresponds to perceived "work being done." | Concept X scanning line crosses tiles at varying intervals (not perfectly uniform per-tile time) — the line moves at constant velocity, but tile crossing times vary because tile widths vary. Concept Z ticket stage-transitions fire at intervals that match the "stage work duration" (not all stages equal-duration). |
| **Continuous-state loop seam** (canonical §2.5: cursor velocity continuous across boundary) | **Mathematical continuity of data values across loop boundary.** Every animated value at T=LOOP_DURATION must equal its value at T=0 EXACTLY. Use periodic functions (sine waves, modular arithmetic) for trajectories. | Concept X tile scores use periodic functions: `score(t) = base + amplitude × sin(2π × t / LOOP_DURATION × cycles_per_loop)`. Concept Z ticket positions use modular arithmetic: `ticket_position(t) = ((ticket_offset + t) mod LOOP_DURATION) / LOOP_DURATION × pipeline_width`. |
| **Single Unified Timeline** (canonical §4: one master timeline owns all state, label-based offsets, IO pause/resume) | **Same — one master timeline owning all animated values.** RAF loop tracks elapsed time. All value updates derive from elapsed time via pure functions. IO pause/resume captures elapsed time at pause + restarts from same offset. | Both Concepts X and Z use a single RAF-driven elapsed-time tracker. All tile scores / scanning line position / ticket positions are pure functions of elapsed time. |
| **Zero-position reset** (canonical §4.1 Rule 5: restore all animated state at iteration boundary) | **Same — explicit initial-state restoration at iteration boundary.** Even with continuous-state seams (which SHOULD be mathematically clean), a defensive reset at loop start guards against floating-point drift over many iterations. | Both Concepts call `resetAllState()` at iteration boundary. For Concept X, this verifies scanning line is at left edge + all tile scores match their T=0 sine values. For Concept Z, ticket positions snap to T=0 mod values. |
| **Asymmetric timing** (canonical §2.2 + Kowalski rule: exits 20% faster than entrances; cursor entry/exit motion classes) | **Asymmetric data motion.** A score "surging" (drift detected) uses faster easing than a score "settling" (drift resolved). A ticket "entering" a stage uses faster easing than a ticket "exiting" (the stage work is in the middle, with entry/exit framing). | Concept X drift spikes use ~250ms ease-out (fast surge); micro-fluctuation cycles use 1500ms+ (slow ambient noise). Concept Z ticket stage-transitions use 400ms (fast — between-stage travel); ticket stage-occupancy uses ~2000ms (slow — work duration). |

### One implementation principle that doesn't translate

**Cursor mechanics (translateY stamping, drop-shadow shifts)** don't translate because there's no cursor. The equivalent "I am acting on this thing" gesture for data demos is the VALUE UPDATE itself — a number ticking, a dot changing color, a card moving. The data update IS the gesture.

---

## Section 1B — Concept X: Live token health dashboard

### Pitch (one sentence)

A live Ghost dashboard showing 21 component tiles, each with a drift score that micro-animates continuously while a scanning line sweeps across, periodically detecting new drift in real-time.

### What the viewer sees in 2 seconds

A real product UI: browser chrome, app header reading "● Live token health · 21 components · Scan 007", a grid of 21 tiles, each with a component name + drift score + severity color. Numbers are micro-fluctuating subtly. A vertical scanning line is sweeping left-to-right across the grid. As the viewer watches, the scanning line hits a tile and that tile's drift score animates dramatically — number ticks, color shifts. This communicates "Ghost monitors design tokens in real-time across the entire system" within 2 seconds without prose.

### The full visual

#### Browser chrome

- Standard mac dots (3) at left
- URL: `ghost.rotemgotlieb.com/scan/007/health`
- Same styling as hero, drift detection, view-modes browser bars (consistency)

#### App header

- 36px tall, white background, 1px bottom border
- Left: severity dot (small green) + "Live token health" (medium weight) + meta "21 components · Scan 007" (light)
- Right: small pill "All systems nominal" (medium green tint)

#### Grid of 21 tiles

- 7 columns × 3 rows on desktop (clean rectangle, fits horizontally)
- Tile dimensions: ~120px wide × ~70px tall, ~10px gap
- Each tile background: white, 1px border, 8px radius, subtle shadow (matches hero's deviation rows)
- Tile content (vertical stack inside):
  - Top: component name (12px, medium weight, e.g., "Button", "Modal")
  - Middle: drift score (24px, bold, JetBrains Mono, e.g., "94", "87")
  - Bottom right: severity dot (6px circle, color-coded)
- Severity colors:
  - Green (#22c55e): score 90-100 (clean)
  - Yellow (#eab308): score 70-89 (minor drift)
  - Orange (#f97316): score 50-69 (critical drift)
  - Red (#dc2626): score <50 (breaking)

#### The 21 components (with starting drift scores at T=0)

A realistic mix that totals to "21 components tracked":

| # | Component | Starting score | Severity |
|---|-----------|---------------|----------|
| 1 | Button | 96 | Green |
| 2 | Input | 94 | Green |
| 3 | Card | 92 | Green |
| 4 | Toggle | 89 | Yellow |
| 5 | Badge | 95 | Green |
| 6 | Modal | 78 | Yellow |
| 7 | NavBar | 91 | Green |
| 8 | Tooltip | 87 | Yellow |
| 9 | Dropdown | 84 | Yellow |
| 10 | Avatar | 93 | Green |
| 11 | Tab | 88 | Yellow |
| 12 | Progress | 96 | Green |
| 13 | Switch | 81 | Yellow |
| 14 | Slider | 85 | Yellow |
| 15 | Checkbox | 92 | Green |
| 16 | Radio | 90 | Green |
| 17 | Select | 77 | Yellow |
| 18 | Tag | 94 | Green |
| 19 | Banner | 83 | Yellow |
| 20 | Spinner | 97 | Green |
| 21 | Divider | 99 | Green |

Average: ~89 (the dashboard reads "mostly healthy with some watch items" — realistic for a maintained design system).

#### Scanning line

- Vertical line, 2px wide
- Color: `rgba(34, 197, 94, 0.4)` (translucent green — matches the "● Live" signal)
- Slight glow: `box-shadow: 0 0 12px rgba(34, 197, 94, 0.6)`
- Sweeps left-to-right across grid every 7 seconds
- Position: `translateX()` from `-2px` (just offscreen left) to `gridWidth + 2px` (just offscreen right)

#### Clarity signal

The app header text "● Live token health · 21 components · Scan 007" plus the pulsing green dot and the visible scanning line motion communicate "live scanning" within the first 1-2 seconds.

### The full choreography

**Loop duration:** 7000ms (matches V3 §1.1 body demo range 3–10s; matches Beat 3 drift detection loop length for rhythm consistency across Ghost demos).

**Timeline (7s loop, desktop):**

| Beat | T (ms) | Action |
|------|--------|--------|
| 1 | 0 | All 21 tiles visible at their starting scores. Scanning line at left edge (just offscreen). NOT an empty-fills-up animation — already running. |
| 1 → end | 0 → 7000 | Tile scores micro-animate continuously via per-tile sine waves. Each tile has unique phase + amplitude so the dashboard looks "alive" without being chaotic. |
| 2 | 0 → 7000 | Scanning line sweeps left-to-right at constant velocity over 7000ms via CSS `translateX` keyframe. |
| 3a | ~2300 | Scanning line crosses tile #6 (Modal, starting at score 78). Modal's drift score animates dramatically: 78 → 72 over 400ms ease-out. Color shifts: yellow → orange. Brief 800ms pulse on tile border. |
| 3b | ~4500 | Scanning line crosses tile #17 (Select, starting at score 77). Select's drift score animates 77 → 71 over 400ms ease-out. Color shifts: yellow → orange. Brief 800ms pulse on tile border. |
| 4 | 7000 | LOOP boundary. All values mathematically equal T=0 state. Scanning line back at left edge. Tile #6 Modal score back to 78 (the dramatic spike resolved back to baseline). Tile #17 Select score back to 77. |

**Why exactly 2 dramatic spikes per loop and not more?** Per the canonical-motion-spec §1.2 "earned animation test" — every motion has narrative purpose. Two dramatic spikes communicate "this happens periodically" without being overwhelming. More would feel chaotic (no rhythm); fewer would feel sparse.

### The math for continuous-state seam

**Per-tile micro-fluctuation:**
```js
score(t) = baseScore + amplitude × sin(2π × (t / LOOP_DURATION) × cyclesPerLoop + phase)
```
- `baseScore`: each tile's starting score (from the table above)
- `amplitude`: 0.5 to 1.5 (small fluctuation — looks "alive" without distracting)
- `cyclesPerLoop`: 2 to 4 (each tile completes 2-4 sine cycles per loop boundary, ensuring t=0 and t=LOOP_DURATION produce same value)
- `phase`: random per tile in [0, 2π] so tiles don't synchronize

**Per-tile dramatic spike (overlay on top of base micro-fluctuation):**
```js
// Only for tiles #6 (Modal) and #17 (Select)
spike(t) = scanLineCrossedThisTile ? max(0, dropAmount × spikeDecay(t - crossTime)) : 0
finalScore(t) = baseFluctuation(t) - spike(t)
```
- The spike is an additive overlay; spike returns to 0 within ~2500ms after the cross time
- This means by T=LOOP_DURATION, spike is back to 0, so finalScore equals baseFluctuation(LOOP_DURATION) = baseFluctuation(0). Continuous-state preserved.

**Scanning line position:**
```js
scanX(t) = (t / LOOP_DURATION) × (gridWidth + 4) - 2
```
- At t=0: scanX = -2 (just offscreen left)
- At t=LOOP_DURATION: scanX = gridWidth + 2 (just offscreen right)
- At t=LOOP_DURATION + small epsilon (= loop boundary + start of next iter): scanX wraps to -2 (just offscreen left again). Continuous.

**Severity color thresholds:**
- 90+: green
- 70-89: yellow
- 50-69: orange
- <50: red

Severity color is derived from current score, so it updates automatically as the score changes.

### Reduced motion path

Per V3 standing rule: respect `prefers-reduced-motion`.

CSS: scanning line `display: none`. All tile score animations disabled. Tiles show their T=0 baseline scores statically.

JS: `prefersReduced()` check at startup. If true, set each tile's `data-score` to baseline and `data-severity` to baseline severity, skip RAF loop, skip scanning line entirely.

### Implementation sketch

**Markup (~50 lines):**
```html
<div class="th-widget reveal" id="ghostTokenHealth" aria-label="Ghost live token health dashboard">
  <div class="th-widget-browser-bar">...</div>
  <div class="th-widget-header">
    <span class="th-widget-live-dot"></span>
    <span class="th-widget-title">Live token health</span>
    <span class="th-widget-meta">21 components · Scan 007</span>
    <span class="th-widget-pill">All systems nominal</span>
  </div>
  <div class="th-widget-grid">
    <!-- 21 tiles, each with data-component, data-base-score, data-cycles, data-phase, data-amp -->
    <div class="th-widget-tile" data-component="Button" data-base="96" data-cycles="3" data-phase="0" data-amp="1.0">
      <span class="th-widget-tile-name">Button</span>
      <span class="th-widget-tile-score">96</span>
      <span class="th-widget-tile-dot"></span>
    </div>
    <!-- ... 20 more tiles ... -->
  </div>
  <div class="th-widget-scanline" aria-hidden="true"></div>
</div>
<p class="demo-frame-caption">Ghost continuously monitors 21 components for design token drift.</p>
```

**CSS (~120 lines):**
- Browser chrome + header (~30 lines, reuses patterns from other Ghost demos)
- Grid layout: 7-column CSS grid, ~10px gap
- Tile styling: white bg, 1px border, 8px radius, subtle shadow
- Tile color states via CSS classes: `.th-widget-tile--green/yellow/orange/red` (matches severity dot color)
- Scanning line: 2px wide vertical bar, translucent green, box-shadow glow, position absolute
- Mobile @media at 640px: grid collapses to 3 columns × 7 rows, scan line still sweeps horizontally (but covers narrower distance)
- Reduced-motion: hide scanline, no animations

**JS (~120 lines):**
- Pure functions for `score(tileIdx, t)`, `severity(score)`, `scanX(t)`
- Single RAF loop: read elapsed time, update each tile's score textContent + severity class, update scanline transform
- Spike detection: for tiles #6 and #17 specifically, check if scanline X position crossed tile's center this frame; if yes, mark `spikeStartTime` for that tile; in subsequent frames, compute spike(t - spikeStartTime) as additive offset
- IO pause/resume via LoopObserver: capture elapsed time at pause, restart from same offset
- prefersReduced early-exit + static value initialization

**Bundle estimate:** ~4.5–5.5 KB gzipped.

### Concept X self-critique

| Question | Answer |
|----------|--------|
| Does the demo argue Pivot 3 (detection-to-remediation) in 2 seconds? | YES — the "Live token health" header + visible scanning + tile state changes communicate "continuous detection" immediately. The narrative pairing with the hero (this finds problems, hero shows fixing them) is the Pivot 3 argument. |
| Does every animated element earn its motion? | YES — micro-fluctuations communicate "Ghost is actively monitoring." Dramatic spikes communicate "Ghost detects new drift in real-time." Scanning line communicates the sweep pattern itself. No decoration. |
| Is the continuous-state seam mathematically invisible? | YES — sine waves with integer `cyclesPerLoop` and phase preservation guarantee score(0) == score(LOOP_DURATION). Spike overlay decays to 0 by loop boundary. Scan line position wraps cleanly. |
| Does the visual language match the hero? | YES — same browser chrome, same severity colors (green/yellow/orange/red matching fix-hero badges), same typography conventions (JetBrains Mono for numeric values, system font for labels). Tile styling matches hero deviation row styling. |
| Hiring manager glance: "real product thinking" or "decoration"? | REAL — the dashboard looks like an actual scan-results view, not an infographic. Component names are real (Button, Modal, etc.). Severity colors carry meaning. The scanning line is a known UX pattern for "active scan in progress." |

---

## Section 1C — Concept Z: Live remediation pipeline

### Pitch (one sentence)

A horizontal four-stage Ghost pipeline (Scan → Detect → Diagnose → Fix) with deviation "tickets" flowing through, communicating Ghost's end-to-end value proposition as a system.

### What the viewer sees in 2 seconds

A real product UI: browser chrome, four stage columns with labels at top, miniature Ghost UI inside each stage column, multiple "tickets" (small deviation cards) visible at different stages simultaneously, tickets advancing from left to right over time. This communicates "Ghost is end-to-end — find problems, fix them automatically" within 2 seconds.

### The full visual

#### Browser chrome

- Standard mac dots + URL `ghost.rotemgotlieb.com/scan/007/pipeline`
- Same styling as Concept X (consistency across the case study)

#### Stage column headers

- 24px tall row at top of canvas
- Four labels equally spaced: "SCAN", "DETECT", "DIAGNOSE", "FIX"
- 10px JetBrains Mono, uppercase, letter-spacing 0.1em
- Color: rgba(0,0,0,0.4) (muted)
- Subtle arrow connectors between labels (→ glyph)

#### The four stage columns

Each stage column is ~22% canvas width, separated by ~2% gaps. Each stage contains a miniature Ghost UI element representing what that stage does:

**Stage 1 — SCAN:**
- Miniature horizontal token row (mini version of Beat 3 drift detection)
- Tokens scroll continuously left within the stage frame
- 4-5 visible tokens at a time, small font (9px)
- A small "Scanning..." pulsing dot at top-left of stage frame

**Stage 2 — DETECT:**
- Miniature deviation card (mini version of hero's deviation list row)
- Card shows: severity dot (left) + component name (e.g., "Modal · Color") + small "Found" badge (right)
- When a ticket enters Stage 2, the card's "Found" badge appears with a small back-out animation

**Stage 3 — DIAGNOSE:**
- Miniature Figma component preview frame
- Shows: small icon + component name + a callout pointing to "→ #text-secondary"
- When a ticket enters Stage 3, the callout text types in (mini version of hero popup typing)

**Stage 4 — FIX:**
- Miniature success state
- Shows: green check icon + "Applied" text + small "+1 fixed" counter (cumulative count this loop)
- When a ticket enters Stage 4, the green check appears with a back-out scale, the counter increments

#### Tickets

A "ticket" is a small card representing one deviation being processed. It visually persists through the pipeline as it advances stages.

Each ticket: 50px wide × 22px tall, white background, 1px border, 4px radius, severity dot + abbreviated component name (e.g., "Mdl" for Modal). Position: absolute, animated horizontally as it advances through stages.

The pipeline shows 3-4 tickets visible simultaneously (one per stage), so the eye reads "many things flowing through, end-to-end."

#### Clarity signal

- Top: stage labels SCAN → DETECT → DIAGNOSE → FIX (the labels themselves communicate the pipeline pattern)
- A small "Live pipeline" header above the columns if space permits

### The full choreography

**Loop duration:** 7000ms (matches Concept X for rhythm consistency).

**Six tickets in rotation** so the loop cycles cleanly. At any given moment, 3-4 tickets visible.

**Ticket entry/exit timing:**

A new ticket enters Stage 1 every 1750ms (= 7000ms / 4 tickets visible). Each ticket spends 7000ms total in the pipeline (4 stages × 1750ms per stage), then exits.

**At T=0 (and every iteration boundary):**
- Ticket A: in Stage 4 (about to exit)
- Ticket B: in Stage 3
- Ticket C: in Stage 2
- Ticket D: in Stage 1 (just entered)
- Tickets E and F: not yet in pipeline (will enter in this iteration)

**Timeline (7s loop, desktop):**

| T (ms) | Action |
|--------|--------|
| 0 | State above. Stages animating per-frame (Stage 1 tokens scrolling, others static). |
| 0 → 1750 | Each visible ticket advances ⅒% of one stage per frame. Stage animations fire as tickets enter new stages: Ticket A's exit + counter increment, etc. |
| 1750 | Ticket A exits right side. Ticket B advances to Stage 4 (Fix animation fires). Ticket C → Stage 3 (callout types). Ticket D → Stage 2 (Found badge appears). Ticket E enters Stage 1. |
| 3500 | Ticket B exits. C → Stage 4. D → Stage 3. E → Stage 2. Ticket F enters Stage 1. |
| 5250 | Ticket C exits. D → Stage 4. E → Stage 3. F → Stage 2. Ticket A re-enters Stage 1 (recycled, now showing as Ticket "G" visually if we vary the component label per cycle, or just A again — discuss in implementation). |
| 7000 | LOOP. State exactly matches T=0 (modular arithmetic ensures this). |

### The math for continuous-state seam

**Position of ticket N at time t:**
```js
// Each ticket has a fixed phase offset (when it entered the pipeline relative to T=0)
const STAGE_DURATION = LOOP_DURATION / 4;  // 1750ms per stage
const TICKET_COUNT = 6;
const TICKET_PHASE_OFFSET = LOOP_DURATION / TICKET_COUNT;  // ~1167ms — no wait, this needs to be evenly divisible

// Actually with 4 tickets visible (one per stage) at any time, and the pipeline cycle being 7000ms,
// we need ticket phases at 0, 1750, 3500, 5250 ms (each entering at the start of a stage).
// We use TICKET_COUNT = 4 for clean math: phase offsets 0, LOOP/4, 2×LOOP/4, 3×LOOP/4.

const ticketPhase = ticketIndex * (LOOP_DURATION / 4);

function ticketProgress(ticketIndex, t) {
  return ((t + ticketPhase) % LOOP_DURATION) / LOOP_DURATION;  // 0 to 1
}

function ticketX(ticketIndex, t) {
  return ticketProgress(ticketIndex, t) * pipelineWidth;
}

function ticketStage(ticketIndex, t) {
  return Math.floor(ticketProgress(ticketIndex, t) * 4);  // 0, 1, 2, or 3
}
```

Since `ticketProgress(t=0) === ticketProgress(t=LOOP_DURATION)` (modular arithmetic), every ticket's position and stage at the loop boundary matches T=0. Continuous-state preserved.

**Stage animations triggered by stage transitions:**
```js
const prevStage = ticketStage(ticketIndex, prevTime);
const currStage = ticketStage(ticketIndex, currTime);
if (currStage !== prevStage) {
  // Ticket just transitioned. Fire the new stage's entry animation.
  triggerStageAnimation(currStage, ticketIndex);
}
```

This fires once per stage transition, regardless of frame rate.

### Reduced motion path

- Pipeline visible with one or two tickets in static positions
- No ticket movement
- No stage animations
- Stage labels visible
- Static counter in Stage 4 (e.g., "+1 fixed")

### Implementation sketch

**Markup (~60 lines):**
```html
<div class="pl-widget reveal" id="ghostPipeline" aria-label="Ghost live remediation pipeline">
  <div class="pl-widget-browser-bar">...</div>
  <div class="pl-widget-stages">
    <div class="pl-widget-stage" data-stage="0">
      <div class="pl-widget-stage-label">SCAN</div>
      <div class="pl-widget-stage-content pl-widget-stage--scan">
        <!-- mini scrolling token row -->
      </div>
    </div>
    <div class="pl-widget-arrow">→</div>
    <div class="pl-widget-stage" data-stage="1">
      <div class="pl-widget-stage-label">DETECT</div>
      <div class="pl-widget-stage-content pl-widget-stage--detect">
        <!-- mini deviation card -->
      </div>
    </div>
    <div class="pl-widget-arrow">→</div>
    <div class="pl-widget-stage" data-stage="2">
      <div class="pl-widget-stage-label">DIAGNOSE</div>
      <div class="pl-widget-stage-content pl-widget-stage--diagnose">
        <!-- mini Figma preview + callout -->
      </div>
    </div>
    <div class="pl-widget-arrow">→</div>
    <div class="pl-widget-stage" data-stage="3">
      <div class="pl-widget-stage-label">FIX</div>
      <div class="pl-widget-stage-content pl-widget-stage--fix">
        <!-- mini success state + counter -->
      </div>
    </div>
  </div>
  <!-- Tickets are JS-injected, positioned absolutely -->
  <div class="pl-widget-tickets-layer"></div>
</div>
<p class="demo-frame-caption">Detect → Diagnose → Remediate. Ghost end-to-end.</p>
```

**CSS (~150 lines):**
- Browser chrome (reused from Concept X)
- Stage grid: 4 columns + 3 small arrow columns (or use flex with explicit gaps)
- Each stage's content area: own styling matching its theme (token row, deviation card, Figma preview, success state)
- Ticket card styling: small, severity-color-coded, absolutely positioned
- Stage animation classes: `.pl-widget-stage--fix.is-firing` triggers check + counter animation, etc.
- Mobile @media: stages stack vertically on 640px (4 rows instead of 4 columns), arrows become ↓ instead of →
- Reduced motion: hide ticket layer, static counter display

**JS (~140 lines):**
- Single RAF loop reading elapsed time
- For each ticket index 0-3 (4 tickets visible): compute position and stage from elapsed time
- Detect stage transitions per frame; trigger stage entry animations
- Stage animation handlers: set classes, fire setTimeouts for animation completion
- Ticket data (component name, severity): cycle through a predefined array of 6 deviation types so each ticket has unique content but the loop returns to the same set
- IO pause/resume + prefersReduced

**Bundle estimate:** ~5.5–6.5 KB gzipped.

### Concept Z self-critique

| Question | Answer |
|----------|--------|
| Does the demo argue end-to-end remediation in 2 seconds? | YES — the stage labels SCAN → DETECT → DIAGNOSE → FIX read instantly. Tickets visibly moving through the pipeline communicate "this is a flow" within 2 seconds. |
| Does every animated element earn its motion? | YES — ticket transitions communicate "things are being processed." Stage entry animations (Found badge, callout typing, green check) communicate WHAT each stage does. The counter in Stage 4 communicates accumulated value. No decoration. |
| Is the continuous-state seam mathematically invisible? | YES — modular arithmetic on ticket positions ensures exact match at T=0 and T=LOOP_DURATION. Stage transition animations fire only on actual stage changes, so iteration boundary doesn't double-fire. |
| Does the visual language match the hero AND Concept X? | YES — same browser chrome, same color system (severity dots), same typography (JetBrains Mono for data values). Stage 1 token row is a deliberate echo of Beat 3 drift detection. Stage 2 deviation card is a mini version of hero's deviation list rows. |
| Hiring manager glance: "real product thinking" or "decoration"? | REAL — the pipeline structure is the actual architecture of a remediation tool (scan → detect → diagnose → fix is universal). Each stage shows real UI elements, not abstract shapes. Tickets carry real component names. |

---

## Section 1D — Visual language consistency checklist

Both demos + the rest of the Ghost case study must read as one coherent product. Checklist (applies to both Concept X and Concept Z):

| Element | Standard | Both demos comply? |
|---------|----------|---------------------|
| Browser chrome (mac dots + URL bar) | Reuse exact CSS from hero `.fix-hero-browser-bar` | YES — same `.th-widget-browser-bar` + `.pl-widget-browser-bar` styling |
| Container background | `#F6F5F4` | YES |
| Container border-radius | `12px` | YES |
| Container box-shadow | `0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)` | YES |
| Severity colors | green `#22c55e`, yellow `#eab308`, orange `#f97316`, red `#dc2626` (matches fix-hero-badge colors) | YES |
| Typography — labels | system font 11-12px, weight 500-600 | YES |
| Typography — numeric values | JetBrains Mono / SF Mono | YES |
| Typography — uppercase mono | letter-spacing 0.08em | YES |
| Tile/card border-radius | 8px (matches hero deviation rows) | YES |
| Caption styling | `.demo-frame-caption` class — italic, centered | YES — both demos use this |
| Voice ("Deviation detected" not "Violation found") | Yes — Concept X uses "Live token health"; Concept Z uses "Detect → Diagnose → Remediate" | YES |

---

## Section 1E — Reduced motion + accessibility

Per V3 standing rule, both demos respect `prefers-reduced-motion`:

**Concept X reduced motion:**
- `prefersReduced()` early-exit before RAF loop starts
- All 21 tiles render with their T=0 baseline scores (CSS or JS-set static)
- Severity colors set to T=0 baseline severity
- Scanning line: CSS `display: none` (since no point in showing it without motion)
- Header pulse dot: animation disabled via CSS `@media (prefers-reduced-motion: reduce)`

**Concept Z reduced motion:**
- `prefersReduced()` early-exit
- Pipeline visible with one ticket statically positioned in Stage 4 (Fix), showing "Applied" + "+1 fixed" counter
- Stage 1 token row: paused (no scroll)
- Other stages: static at their default visual state
- All ticket motion + stage animations: skipped

**ARIA:**
- Both demos have `aria-label` on the root container describing what the demo shows
- Decorative inner elements have `aria-hidden="true"` (scanning line, ticket cards, ornamental dots)
- No interactive elements (these are pure autoplay demos with no clickable content)

---

## Section 1F — Risk surface

### Risk 1 — Concept X 21 tiles at 330px canvas height

**Calculation:** Canvas height = 330 - 32 (browser bar) - 36 (app header) = 262px. With 3 rows × ~70px tiles + 2 gaps × 10px = ~230px. Fits with ~32px breathing room (16px top + 16px bottom padding). ✓

Mobile (640px viewport, canvas 240px tall → internal 172px after chrome+header): 21 tiles in 3 cols × 7 rows = 7 × ~22px + 6 gaps × 6px = 190px. Too tall. **Mobile mitigation:** drop to 6 tiles visible (2 cols × 3 rows = 6) with rest scroll-clipped. Or smaller tile heights (15px each). Mobile gets a compressed view. Document in mobile @media.

### Risk 2 — Continuous-state seam math correctness

For Concept X: with integer `cyclesPerLoop` per tile, sine wave guaranteed to return to starting value at T=LOOP_DURATION. Spike overlay decay function must be fully resolved by T=LOOP_DURATION (decay duration < LOOP_DURATION - last_spike_time).

For Concept Z: modular arithmetic guarantees ticket positions match. Risk: stage transition firing twice per iteration (once at end of iter N, once at start of iter N+1). **Mitigation:** track `lastFiredStage` per ticket; only fire animation when stage changes within a single frame's elapsed-time delta.

### Risk 3 — Bundle size

Both demos at ~5-6 KB gzipped. Combined: ~10-12 KB added to current 6.94 KB hero + 3.84 KB drift + 1.61 KB view-modes + 1.21 KB slider = currently 13.6 KB per-demo total. After this sprint: ~24-26 KB per-demo total. Engine stays at 10.24 KB. Total Ghost JS bundle: ~36 KB gz. **Acceptable** — well under any practical performance budget on a 297 MB project.

### Risk 4 — Visual density / overwhelm

Concept X has 21 tiles continuously animating. Risk: viewer's eye doesn't know where to look. **Mitigation:** the micro-fluctuations are SUBTLE (amplitude 0.5-1.5) — they're ambient texture, not focal points. The two dramatic spikes per loop ARE the focal points (clear visual hierarchy: static-ish tiles + obvious spikes).

Concept Z has 3-4 tickets + 4 stage animations firing. Risk: too many things happening at once. **Mitigation:** stage transitions are TEMPORALLY STAGGERED (every 1750ms, only one stage transition fires). Ticket movement is slow (linear position across 7000ms). The visual rhythm is one-event-per-1.75-seconds.

### Risk 5 — Performance (RAF on 21 elements)

Concept X RAF loop updates 21 tile DOM elements per frame. At 60fps, that's 1260 DOM writes per second. Risk: jank on lower-end devices. **Mitigation:** use `requestAnimationFrame` (browser-throttled when tab inactive); use `textContent` not `innerHTML` (no parsing); set `data-severity` attribute that drives CSS class via `[data-severity="yellow"]` selector (no JS class manipulation per frame). GPU-accelerate scanning line via `translate3d` + `will-change: transform`.

### Risk 6 — Mobile rendering

Both demos need explicit mobile plans:

**Concept X mobile:** 21 tiles in 3 cols × 7 rows = 7-row grid. Probably too tall. Alternative: 6 tiles visible (2×3) with horizontal scroll-clip for remainder. Decide in Phase 3 build based on visual testing.

**Concept Z mobile:** Pipeline horizontal stages doesn't translate to narrow mobile. **Decision:** stages stack VERTICALLY on mobile (4 rows instead of 4 columns). Tickets flow top-to-bottom instead of left-to-right. Stage labels rotate. This is a substantial structural difference between desktop and mobile.

Document mobile plans explicitly in CSS comments.

### Risk 7 — Surface area too large for one sprint

Realistic estimate: Concept X is ~3 hours build, Concept Z is ~4 hours build (more complex with ticket flow + 4 stage animations). Plus design doc (this) + teardown + final report. Total ~10 hours of focused work. **Mitigation:** the pause gates at Phase 1, Phase 3, Phase 4 give natural breakpoints. User can review and adjust scope at any of them.

---

## Section 1G — Self-critique pass (both concepts)

| Question (V3 §1.1 + earned-animation test) | Concept X | Concept Z |
|--------------------------------------------|-----------|-----------|
| Argues its case-study beat in 2 seconds? | YES — "live monitoring" reads instantly via header + scan + tiles | YES — pipeline structure + ticket flow reads instantly |
| Every animated element earns its motion? | YES — fluctuations = "monitoring active"; spikes = "new drift detected"; scan = sweep pattern | YES — ticket movement = "things being processed"; stage animations = "what each stage does" |
| Continuous-state seam mathematically invisible? | YES — sine waves + integer cycles + decayed spikes | YES — modular arithmetic on positions |
| Visual language matches hero + other demos? | YES — chrome, colors, typography all reused | YES — same as Concept X, plus Stage 1 echoes Beat 3 drift |
| Hiring manager: "real product thinking"? | YES — looks like an actual dashboard with realistic components | YES — pipeline structure mirrors actual remediation tooling architecture |
| Cuts considered and rejected | Considered cutting to 12 tiles (Risk 1 mitigation) — rejected because 21 IS the case-study's "21 components tracked" number from prose. Reducing breaks consistency with prose claim. | Considered showing only 3 tickets visible at a time (vs 4) — rejected because 4 = one per stage which makes the pipeline structure visually obvious. |

**Final critique result:** both concepts pass the world-class bar per principles 1-6. Implementation can proceed after user approval.

---

## Section 2 — User decision points for review

Before Phase 2 (teardown) begins, please confirm:

1. **Concept X approved as scoped?** 21 tiles, 7-col × 3-row grid, scanning line sweep, 2 dramatic spikes per 7s loop. Or any specific element to adjust (tile count, layout, content, color choices)?

2. **Concept Z approved as scoped?** Four stages SCAN → DETECT → DIAGNOSE → FIX, 4 visible tickets cycling through, 7s loop, mobile stacks vertically. Or any structural concern?

3. **Mobile structural divergence acceptable for Concept Z?** Stages stack vertically on mobile vs horizontally on desktop — this is a substantial layout difference. The alternative is horizontal scroll on mobile, which feels less polished. I propose vertical stack.

4. **Risk acknowledgements** — any of the 7 risks need pre-built mitigation rather than reactive handling during Phase 3/4?

5. **Phase 5 translation framework promotion** — the §1A translation framework gets added to `canonical-motion-spec.md` Appendix in Phase 5. Confirm this is the right destination (vs a separate doc).

If all points are confirmed, Phase 2 (teardown of `ghost-scan-complete.js`) begins immediately after approval.

---

## Section 3 — Implementation file map (preview for Phases 2-5)

### Phase 2 — teardown

- Delete `js/demos/ghost-scan-complete.js`
- Remove `/* DEMO: GHOST SCAN COMPLETE */` block from `styles.css`
- Remove `<div class="sc-widget">` markup from `work/ghost.html`
- Remove `<script>` tag for `ghost-scan-complete.js`
- Cache-bust `styles.css?v=51`

### Phase 3 — Concept X build

- Create `js/demos/ghost-token-health.js` (~120 lines, ~5KB gz)
- Add `/* DEMO: GHOST TOKEN HEALTH */` block to `styles.css` (~120 lines)
- Add `<div class="th-widget" id="ghostTokenHealth">` markup to Design Process section of `work/ghost.html`
- Wire `<script type="module" src="../js/demos/ghost-token-health.js?v=1">`
- Cache-bust `styles.css?v=52`

### Phase 4 — Concept Z build

- Create `js/demos/ghost-pipeline.js` (~140 lines, ~6KB gz)
- Add `/* DEMO: GHOST PIPELINE */` block to `styles.css` (~150 lines)
- Add `<div class="pl-widget" id="ghostPipeline">` markup INSIDE Outcome section of `work/ghost.html` (NEW visual — replaces nothing, ADDS to currently-image-less section)
- Wire `<script type="module" src="../js/demos/ghost-pipeline.js?v=1">`
- Cache-bust `styles.css?v=53`

### Phase 5 — final report + spec update

- Create `.claude/sprint-reports/2026-05-27-bottom-visuals.md` (final report)
- Update `.claude/canonical-motion-spec.md` — add new Appendix section "Translation framework: cursor demos → data-driven demos" containing the §1A table from this doc + the section header
- Append to `.claude/learnings.md`: lessons from this sprint (especially execution patterns for non-cursor demos)

---

*End of design document. Awaiting user review of decision points in §2 before Phase 2 begins.*
