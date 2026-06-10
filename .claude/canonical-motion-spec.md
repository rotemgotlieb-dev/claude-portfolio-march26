# Canonical Motion Specification

**The reference manual CC reads at the start of every demo sprint.**

This is the markdown twin of `master-report-v3-canonical-motion-specification.docx` (project root), distilled for AI agent consumption. It supersedes all previous master reports (V1 Benji-only, V2 cross-portfolio). Every parameter is triangulated across at least two independent research streams.

| Field | Value |
|-------|-------|
| Date | 2026-05-26 |
| Project | rotemgotlieb.com — portfolio animation discipline |
| Supersedes | V1 + V2 master reports |
| Research streams consolidated | CC HTML inspection + Strategist visual+design + Gemini Round 1 (May 24) + Gemini Round 2 (May 26, 3 reports + 4 follow-ups) |
| Reference designers | Benji Taylor, Rauno Freiberg, Raphael Salaja, Emil Kowalski, Vercel design team, Linear design team, Frigade engineering |
| Primary audience | Future AI agents continuing motion design work |
| Status | Canonical. All future demo sprints must hew to this specification. |

---

## Section 6 — How to read this document

Read in this order when starting a new demo sprint:

1. **Executive summary** below — internalize the six load-bearing insights before any decision
2. **Section 2 (Parameter envelope)** — bookmark for reference during build; every numeric parameter you'll need
3. **Section 1 (Hero-vs-body framework)** — read when planning case study composition
4. **Section 3 (Disney principles)** — reference when no numeric parameter governs the decision
5. **Section 4 (Single Unified Timeline architecture)** — read when implementing or refactoring orchestration
6. **Section 5 (Designer fingerprints + schools)** — read when choosing stylistic family for a new case study

**Critical reminders:**
- This specification is canonical for all motion design work on rotemgotlieb.com
- Hero-vs-body distinction is universal; never mix patterns in a single slot
- Cursor easing depends on motion context (entrance/exit/traversal), NOT designer personality
- Multi-step rhythm is snap-pause-snap, NEVER metronomic
- Architecture is Single Unified Timeline with label-based offsets
- Always include zero-position loop reset to prevent loop trap
- We operate in the **Spatial Choreographers** school — Freiberg/Benji over Salaja/Kowalski
- Document new findings honestly; update this specification rather than working around it

---

## Executive summary — six load-bearing insights

1. **The hero-vs-body framework is universal at the top tier.** Hero demos: full app chrome, 14–16s loops, 8–12 beats, ~1500ms slow opening. Body demos: stripped chrome, 6–10s loops OR interactive widgets, sub-500ms first action, 3–5 beats. Triangulated across all six reference portfolios.
2. **Cursor easing depends on motion context, not personality.** Ease-out for entrances. Ease-in for exits. Ease-in-out for on-screen elements moving between points. This is Disney's Slow-in/Slow-out principle applied to UI motion, codified by Emil Kowalski as a rule.
3. **Multi-step rhythm is snap-pause-snap, never metronomic.** The pause IS the work. A 600–1000ms artificial delay in the middle of an Apply-to-done flow is what makes the action feel premium. Uniform timing reads as robotic.
4. **Architecture is a single unified timeline with label-based offsets.** Not cascading useEffect chains. Not fragmented state machines. One master timeline owns cursor, popups, state changes, markers. Semantic labels (`"applyClick+=0.16"`) replace hardcoded absolute milliseconds. GSAP is canonical; vanilla CSS+JS works but requires building the orchestrator pattern.
5. **Loop seams are mathematical, not visual.** Pass the invisible boundary test: visual continuity 40%, timing continuity 30%, motion continuity 20%, narrative continuity 10%. Zero-position loop reset at the architectural level prevents the V2 "loop trap."
6. **Polish lives in the small things.** Cursor mid-flight skew based on velocity. Cursor stamping motion via shadow shift on click (NOT scale). Progressive step cascade with dimmed peripheral steps. 16px blur on major state transitions vs 2px blur on minor ones. The micro-decisions stack.

---

## Section 1 — The hero-vs-body framework

Structural foundation of every demo. Universal at the top tier (Benji, Freiberg, Salaja, Kowalski, Vercel, Linear).

### 1.1 The two patterns

| Dimension | Hero demo | Body demo |
|-----------|-----------|-----------|
| Slot in case study | Above the fold, immediately after title | Embedded between prose paragraphs at thesis beats |
| Job | Communicate "this is the product" in one glance | Demonstrate ONE interaction the prose argues |
| Height range | 300–600px (Benji 300, Linear 600+) | 200–450px (median 300–350) |
| Loop duration | 8–16s (Benji 14s mobile / 16s desktop) | 3–10s (median 6–9s) |
| Beat count | 8–12 beats | 3–5 beats |
| First action timing | ~1500ms slow opening (viewer commits before action) | Under 500ms (viewer is mid-scroll) |
| App chrome inclusion | Full (sidebar + nav + product UI) | Stripped — only the demonstrated component |
| Mockup fidelity | Pixel-perfect to wireframe-with-real-text | Wireframe + strategic real text (rare polish) |
| User-controllable? | No — pure autoplay | Frequently yes (interactive widgets at the top tier) |
| Cross-surface reuse | Treated as packaged component, byte-identical across surfaces | Bespoke per case study |

**Patterns NEVER mix in a single slot.** Hero density in a body slot is a structural error. Body density in a hero slot is undersignaled.

### 1.2 The earned animation test

Per zero-static-screenshots policy, a beat that doesn't earn animation becomes prose-only with no visual, never a static image.

**Animation IS earned when:**
- The interaction itself is the subject (cursor moves through steps, popups appear, state changes happen)
- Sequential states need to be visible (multi-step progress, mode switching, comparison reveals)
- The product's value depends on motion (real-time data, smoothness, responsiveness)

**Animation is NOT earned when:**
- The beat shows a final design or completed state (prose handles this)
- The beat summarizes or transitions between thesis acts (prose handles transitions)
- Decorative animation would distract from the prose argument

### 1.3 The 1+N distribution per case study

Linear's redesign case study shipped 5+ wedge-worthy demos. Vercel routinely ships 3–5. The "one wedge per case study" rule does NOT apply at the top tier. The actual rule is **1+N: one hero carries the wedge narrative, N body demos subordinate to it.**

Ghost as the worked example:

| Position | Slot | Demo type |
|----------|------|-----------|
| Top of case study | Hero | AI Fix Flow autoplay (full chrome, 14–16s) |
| Beat 2 | Body | Comparison Slider (user-driven drag) |
| Beat 3 | Body | Drift Detection autoplay (token row + flagged token) |
| Beat 4 | Body | View Modes interactive widget (user clicks chips) |

Total: 1 hero + 3 body demos. Within the top-tier 1+N range. Each demo argues one moment in the thesis.

---

## Section 2 — The polished parameter envelope

Every numeric parameter we operate by, with sources. **This is the headline deliverable of all the research.** CC reads this section at the start of every demo sprint.

### 2.1 Cursor mechanics

#### Cursor traversal — moving between targets already on screen

| Parameter | Value | Source |
|-----------|-------|--------|
| Easing curve (traversal) | `cubic-bezier(0.77, 0, 0.175, 1)` — ease-in-out | Disney Slow-in/Slow-out; Kowalski's rule for on-screen elements |
| Duration — short hop (< 200px) | 200–300ms | Frigade Interaction Curve range |
| Duration — medium move (200–600px) | 350–450ms | Composite envelope; matches Benji |
| Duration — long traversal (> 600px) | 500–600ms | Composite envelope |
| Path curvature | 10–25% deviation from linear | Disney Arcs principle; X/Y timing offset technique |
| Velocity-based skew during flight | scaleX/scaleY divided by 10 of velocity | Custom cursor patterns; Gemini Round 2 follow-up |

#### Cursor arrivals — moving from offscreen into the demo

| Parameter | Value | Source |
|-----------|-------|--------|
| Easing curve (arrival) | `cubic-bezier(0.23, 1, 0.32, 1)` — ease-out-snappy | Frigade Entrance Curve; Kowalski rule |
| Duration — first mount | 200ms fade-in only (cursor moves immediately after) | Continuous loop seam discipline |
| Anticipation/overshoot magnitude | 2–5% past target (~2–3px on 100px move) | Salaja spring bounce 0.2 |
| Spring approximation (CSS) | `cubic-bezier(0.34, 1.56, 0.64, 1)` at 600ms | Salaja iOS battery (verified) |

#### Cursor click mechanics

| Parameter | Value | Source |
|-----------|-------|--------|
| Cursor click — stamping motion | `translateY(5px)` + shadow shift to 0px (**NOT scale down**) | Custom cursor pattern; Gemini Round 2 follow-up |
| Cursor click duration | 100–150ms | Composite — under perceptible threshold |
| Click pulse on cursor (optional) | Radial shockwave or double-ring at click coordinate | Optional polish; not required |
| Click pulse on target element | `scale(0.97)` | Kowalski (verified, universal) |
| Click pulse easing | ease-out `cubic-bezier(0.23, 1, 0.32, 1)` at 160ms | Frigade Entrance Curve |
| Click pulse motion | Compression only — no Y-axis displacement on the TARGET | Kowalski rule |

**The cursor stamping insight:** our V2 hero compresses the target element with `scale(0.97)` but does NOTHING to the cursor itself during click. Top-tier portfolios add a cursor-side response — typically a stamping motion via shadow shift + 5px Y-translate. This is a missing polish detail we should add in the next recalibration sprint.

### 2.2 State transition mechanics

| Parameter | Value | Source |
|-----------|-------|--------|
| **Maximum UI duration ceiling** | **Under 300ms (strict)** | Kowalski (universal rule) |
| State transition — open (entrance) | 200–300ms ease-out | Composite, all sources |
| State transition — close (exit) | 100–200ms ease-in (faster than entrance) | Asymmetric timing rule (Kowalski) |
| Opening easing | `cubic-bezier(0.23, 1, 0.32, 1)` | Frigade Entrance Curve |
| Closing easing | `cubic-bezier(0.7, 0, 0.84, 0)` | Strong ease-in for exits |
| Entry scale (initial) | `scale(0.93)` — **never `scale(0)`** | Kowalski universal rule |
| Snappy UI target | 120–180ms | Salaja + Kowalski composite |
| Tooltip subsequent reveal | 0ms (instant after first tooltip triggered) | Kowalski rule |
| Sheet/drawer duration | 500ms | Kowalski |

#### Blur crossfades — masking layout shifts

| Use case | Blur amount | Duration |
|----------|-------------|----------|
| Subtle text crossfade (button-to-button) | `blur(2px)` | 200ms ease |
| Tab content swap | `blur(2px)` | 200ms ease |
| State transition between sub-states | `blur(2px)` | 200ms ease |
| **Major state transition (Apply → Done)** | **`blur(16px)`** | **250ms ease** |
| iOS-style modal background | `blur(16px)` + `backdrop-filter` | 250–300ms |

Our V2 hero uses `blur(16px)` correctly on the Apply→done transition. Our V2 step rows use light blur which is correct. **No change needed here — we got this right.**

### 2.3 Dwell time discipline

| Dwell type | Duration range | When |
|------------|----------------|------|
| Transit micro-dwell | 100–200ms | Cursor briefly hovers over element before continuing |
| Action dwell (post-click) | 300–500ms | Allows UI transition to fully resolve before cursor moves |
| Absorption dwell (content reveal) | 800–1500ms (or 2500ms max) | Viewer parses newly exposed content |
| Terminal dwell (pre-loop-restart) | 1500–2500ms | Exhale moment before iteration restarts |
| Mid-narrative compressed dwell | 150–200ms | Cursor in flow, dwell compresses to minimum |
| Culminating action dwell | 600–800ms | Final beat of sequence — emphasizes completion |

**POLYRHYTHMIC DWELL — NOT UNIFORM.** Uniform 800ms dwells across every beat read as robotic. Top-tier choreography varies dwell based on the cognitive weight of the preceding action.

- Quick toggle → 250–350ms dwell
- Heavy modal reveal → 700–800ms dwell
- Content absorption → 800–1500ms
- Loop terminal → 1500–2500ms

**The variation IS the polish.** A demo with 4 different dwell durations feels human; a demo with one uniform dwell feels scripted.

### 2.4 Multi-step rhythm — the snap-pause-snap pattern

**Resolved in Gemini Round 2 Report 2 follow-up. The most important parameter set we have.** Directly fixes the uniform-metronome problem we shipped in V2.

#### The Progressive Step Cascade for Apply→done flows

**Total processing window: 1000ms (minimum). The pause IS the work.** Even when the actual work is instant, top demos hold for ~1 second so the viewer registers "system is doing something premium."

| Beat | T (ms) | Action | Rhythm role |
|------|--------|--------|-------------|
| Apply click | 0 | Cursor click registers, button `scale(0.97)`, loading state appears | **Snap 1** — instant feedback |
| Step 1 | T+150 | First step indicator completes (instant — "transaction initiated") | Quick confirmation |
| Step 2 | T+750 | Second step indicator completes (the 600ms gap IS the load-bearing pause) | **Pause** — "heavy work" |
| Step 3 | T+900 | Third step indicator completes (quick wrap-up) | Rapid resolution |
| Done state | T+1000–1200 | Crossfade applying→done with `blur(16px)`, 200ms fade-in | **Snap 2** — resolution |

#### Visual restraint for step indicators (Linear calm-interface rule)

- Step rows in 11px or smaller font size
- Inactive steps at 30–40% opacity slate
- Active step animates soft transition to 100% opacity with micro-checkmark over 150ms
- No colorful state changes — stay near-monochrome
- Step row container should be inline with the trigger (Freiberg's trigger-feedback alignment rule), NOT a far-away toast

### 2.5 Loop seam craft

**Pass the invisible boundary test.** Four weighted criteria:

| Criterion | Weight | Check |
|-----------|--------|-------|
| Visual continuity | 40% | Final frame pixel values match first frame; no `scale(0)` resets |
| Timing/physics continuity | 30% | Easing curves consistent across boundary; no recalculation |
| Motion continuity | 20% | Cursor velocity continuous; same pixel-per-ms speed both sides of seam |
| Narrative continuity | 10% | Action at boundary makes logical sense as continuous behavior |

#### Two architectural patterns for invisible seams

**Mirror-action seam (most common, easier to implement):** the loop ends with an action that reverses the opening action. If the loop opens by clicking a button that opens a panel, the loop ends by clicking the close button. End state matches start state. **Mathematical rule: exit animation uses ease-in (accelerating away) and resolves 20% faster than the entrance animation.** If entrance is 300ms, exit is 200ms.

**Continuous-state seam (harder, most polished):** the loop never resets to a default state. Each iteration picks up from where the previous ended. Requires linear interpolation (lerp) across the boundary. Benji's Liveline charts use 8% lerp per frame — but note this applies to canvas data interpolation, NOT cursor pathing.

**For our use cases (Ghost case study), mirror-action seams are the right pattern.** Continuous-state seams are overkill for autoplay UI demos that aren't canvas-rendered.

### 2.6 Spring physics (when to use over CSS easing)

| Pattern | Parameters | When to use |
|---------|-----------|-------------|
| Snappy Apple-style spring | `type: spring, bounce: 0.2, duration: 0.6` | iOS-native fidelity, major state transitions (Salaja) |
| Stiff structural spring | `stiffness: 400, damping: 30, mass: 0.5` | Confident UI components, zero wobble (Freiberg) |
| Interruptible interaction spring | Spring-bound coordinates (not duration-bound) | Drag, mouse-track, anything user can interrupt |
| **CSS approximation of spring** | **`cubic-bezier(0.34, 1.56, 0.64, 1)` at 600ms** | **When you can't use Framer Motion / want vanilla** |

**Our current posture on springs:** we are vanilla CSS+JS. The Salaja CSS approximation `cubic-bezier(0.34, 1.56, 0.64, 1)` at 600ms is our canonical spring substitute. Future decision: if we adopt React or GSAP, we can migrate to true springs. Deferred until Pulse case study planning.

---

## Section 3 — Twelve principles applied

Disney's 12 Principles of Animation translated to UI motion. **Apply these when no numeric parameter governs the decision — the principles are the fallback when the envelope doesn't cover the case.**

### 3.1 Six principles directly applicable to cursor demos

#### Anticipation

Preparatory motion before the main action. Signals what is about to happen. In UI: the button scale-down to 0.97 ON `:active` before the resulting expansion. The press IS the anticipation.

```css
/* Anticipation — micro-reverse before expansion */
.action-trigger {
  transform: scale(1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.action-trigger:active {
  transform: scale(0.97);
  transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

#### Slow-in and Slow-out (the load-bearing principle)

Objects have mass. Motion never moves at constant velocity through its entire duration. **This is the principle that determines our easing choice based on context, not personality.**

| Context | Easing | Reasoning |
|---------|--------|-----------|
| Element entering viewport | ease-out `cubic-bezier(0.23, 1, 0.32, 1)` | Fast attack signals systemic responsiveness, decelerates to land softly |
| Element leaving viewport | ease-in `cubic-bezier(0.7, 0, 0.84, 0)` | Accelerating out — the viewer's attention has already decoupled |
| Element traversing on screen (cursor between targets) | ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)` | Already in motion — accelerates from rest, decelerates to rest |
| **Never use** | `ease` (CSS default) or `linear` | Generic; signals undisciplined motion |

**Our V2 hero error — diagnosed:** our V2 hero uses Penner easeOutQuad for cursor traversal between buttons. That's wrong. The cursor is already on screen moving between targets — the ease-in-out context. We should use `cubic-bezier(0.77, 0, 0.175, 1)`. This single change probably fixes 70% of the "mechanical feel" issue.

#### Follow-through and Overlapping Action

Secondary elements continue moving briefly after the primary element stops. Actions rarely resolve simultaneously. In UI: staggered list item entrances, modal container arriving before its internal contents settle.

| Stagger type | Delay between items | Use |
|--------------|---------------------|-----|
| Tight stagger (list items) | 30–60ms between items | Kowalski rule for rapid lists |
| Macro stagger (sequential UI blocks) | 100–200ms between blocks | Freiberg rule for distinct elements |
| Base delay multiplier | 160ms × index | Minimalist staggered reveal pattern |

#### Arcs

Natural motion follows curved paths, not straight lines. Cursor movement specifically must arc — pure diagonal moves signal a scripted bot. Implementation: apply different easings to X and Y axes simultaneously.

```css
/* Cursor arcs by easing the X axis differently from the Y axis */
.cursor {
  transition:
    left 450ms cubic-bezier(0.25, 1, 0.5, 1),
    top  500ms cubic-bezier(0.5, 0, 0.75, 0);
}
```

#### Secondary Action

Supplementary motion that supports the primary action. The cursor's shadow shifting slightly as it moves. Background elements subtly dodging or dimming as an expanding panel passes.

Our current demos don't use secondary action much. **This is a polish opportunity for future iterations** — small kinetic responses to cursor proximity in the environment around the active element.

#### Staging

Directing the viewer's attention to what matters. Suppressing competing motion. Linear's "calm interface" principle is this principle taken to its logical extreme.

**Our application:** when the deviation panel opens in the hero, the deviation list behind it should dim. The active step row in the Apply flow should be at 100% opacity while inactive steps are at 30–40%.

### 3.2 The six other principles (less critical for UI demos)

- **Squash and Stretch** — Limited application in UI; appears as button compression and the `scale(0.93)` entry rule.
- **Straight Ahead vs Pose to Pose** — Architectural choice; we operate Pose-to-Pose (label-based timeline).
- **Timing** — Already covered by parameter envelope; principle is the abstract version.
- **Exaggeration** — NOT applied at the top tier of UI motion; we operate with restraint, not exaggeration.
- **Solid Drawing** — Translates to consistent visual weight and grid; outside motion scope.
- **Appeal** — Holistic; emerges when other principles are applied correctly.

---

## Section 4 — Architecture and orchestration

**The Single Unified Timeline pattern.** Resolved in Gemini Round 2 Report 3 follow-up. The architectural decision that prevents the orchestration drift we hit in V2.

### 4.1 The pattern, in five rules

#### Rule 1: Separation of concerns

Animation logic never mixes with React component logic (or in our case, HTML markup logic). Architecture is strictly separated:

| File | Contents |
|------|----------|
| `demo-script.js` | Raw timing data, cursor path coordinates, scene definitions. Pure data. |
| `demo-markup.html` (partial) | Completely inert, stateless markup. No JavaScript references. |
| `demo-orchestrator.js` | Single master timeline. Reads script data, queries markup via data-attributes, animates. |
| `motion-provider.js` (optional) | Global play/pause/restart governance if multiple demos coexist. |

#### Rule 2: Single master timeline

Every action injected into ONE timeline. NOT arrays of sequences. NOT chained promises. NOT cascading `setTimeout` calls. ONE timeline that owns the cursor, the popups, the state changes, the markers.

**Why:** if the timeline pauses (browser tab switch, IntersectionObserver out-of-view), cursor and UI freeze simultaneously. Cursor cannot click on empty space because the click and the response are the same timeline.

- **GSAP implementation:** `gsap.timeline()` with `.to()` calls
- **Vanilla JS implementation:** a custom `Choreography` class with a `beats` array and a single `requestAnimationFrame` loop tracking elapsed time

The architectural pattern is the same regardless of library.

#### Rule 3: Data-attribute targeting (no ref threading)

Don't pass element references through nested functions. Use data attributes.

```html
<!-- Inert markup with semantic data attributes -->
<div data-demo-element="cursor"></div>
<button data-demo-element="apply-btn">Apply</button>
<div data-demo-element="fix-card-applying">Applying...</div>
```

```js
// Orchestrator queries at runtime
const cursor = root.querySelector('[data-demo-element="cursor"]');
const applyBtn = root.querySelector('[data-demo-element="apply-btn"]');
const applyingState = root.querySelector('[data-demo-element="fix-card-applying"]');
```

#### Rule 4: Label-based skeleton with offsets

Semantic labels for major beats. Subsequent UI reactions positioned relative to labels using offsets. If you change a duration earlier in the timeline, all downstream beats shift automatically.

**GSAP syntax (canonical):**

```js
timeline
  .to(cursor, { x: applyBtnX, y: applyBtnY, duration: 0.4 }, "0.5")
  .addLabel("applyClick", "1.5")
  .to(applyBtn, { scale: 0.97, duration: 0.16 }, "applyClick")
  .to(idleState, { opacity: 0, filter: "blur(16px)" }, "applyClick+=0.16")
  .to(applyingState, { opacity: 1, filter: "blur(0)" }, "applyClick+=0.16")
  .to(step1, { opacity: 1 }, "applyClick+=0.3")
  .to(step2, { opacity: 1 }, "applyClick+=0.9")
  .to(step3, { opacity: 1 }, "applyClick+=1.05")
  .addLabel("doneStart", "applyClick+=1.16")
  .to(applyingState, { opacity: 0, filter: "blur(16px)" }, "doneStart")
  .to(doneState, { opacity: 1, filter: "blur(0)" }, "doneStart");
```

**Vanilla JS equivalent pattern:**

```js
// Store beats as objects with label property; resolve absolute times at orchestration start
const beats = [
  { label: 'startMove',   at: 500,  fn: () => cursor.moveTo(applyBtnX, applyBtnY) },
  { label: 'applyClick',  at: 1500, fn: () => { applyBtn.classList.add('is-pressed'); idleOut(); applyingIn(); } },
  { label: 'step1',       at: '+applyClick+150', fn: () => stepCheck(1) },
  { label: 'step2',       at: '+applyClick+750', fn: () => stepCheck(2) },
  { label: 'step3',       at: '+applyClick+900', fn: () => stepCheck(3) },
  { label: 'doneStart',   at: '+applyClick+1160', fn: () => { applyingOut(); doneIn(); } },
];

// Orchestration start: resolve label-based offsets into absolute times
const labelTimes = {};
beats.forEach(b => {
  if (typeof b.at === 'number') {
    labelTimes[b.label] = b.at;
  } else {
    // "+labelName+offset" → labelTimes[labelName] + offset
    const m = b.at.match(/^\+(\w+)\+(\d+)$/);
    labelTimes[b.label] = labelTimes[m[1]] + parseInt(m[2], 10);
  }
});

// Schedule via setTimeout (or RAF-driven elapsedMs tracker for pause/resume)
beats.forEach(b => setTimeout(b.fn, labelTimes[b.label]));
```

#### Rule 5: Zero-position loop reset

Before the loop restarts, fire an explicit `set` command that forcefully restores every animated property to its origin. Prevents the **"loop trap"** — where end-state of iteration N becomes start-state of iteration N+1.

**GSAP syntax:**

```js
// At timeline position 0, before any animation runs
timeline.set(allAnimatedElements, {
  opacity: initialValues.opacity,
  transform: initialValues.transform,
  filter: initialValues.filter,
  // ... all properties that get animated during the loop
});

// Then the actual timeline begins
timeline.to(cursor, { x: firstTargetX, y: firstTargetY }, "0.5");
```

**Vanilla JS equivalent:** a `resetAllState()` function called as the FIRST action of `runIteration()`. Restores every modified CSS class + inline style to its initial value. (Our V2 hero already has this pattern; what's missing in V2 was completeness — some properties drifted.)

**Our V2 hero loop trap — diagnosed:** the V2 hero loop had occasional state drift between iterations (panel still visible, badges still in fixed state, etc.). Diagnosis from Gemini Round 2 Report 3: missing zero-position reset. The next recalibration sprint must add an explicit reset block at timeline position 0 that restores all animated properties.

### 4.2 Vanilla vs GSAP — the architecture decision

We currently use vanilla CSS+JS. GSAP is the canonical library for the Single Unified Timeline pattern. The decision is whether to migrate.

| Approach | Pros | Cons |
|----------|------|------|
| **Vanilla CSS+JS (current)** | Zero dependencies; full control; no React migration cost; engine code is part of portfolio | More boilerplate to implement timeline pattern; manual label/offset calculation; no built-in springs |
| **GSAP** | Industry standard for choreographed demos; timeline labels and offsets built-in; springs/plugins available; smaller mental model | ~30KB dependency; CSS+JS sometimes harder to understand for engineering interviews |

**Recommendation:** stay vanilla through Ghost. Migrate to GSAP if Pulse demands more complex orchestration. Decision deferred until Pulse planning.

Either way, the architectural pattern is the same: single timeline, label-based offsets, zero-position reset, data-attribute targeting, separation of concerns. **Vanilla or GSAP is an implementation detail.**

### 4.3 Reduced motion handling

All demos respect `prefers-reduced-motion`. Implementation:

- Detect via `window.matchMedia("(prefers-reduced-motion: reduce)")`
- If true: skip cursor mount, skip `timeline.play()`, set elements to their done/representative states statically
- Re-evaluate per page load (don't cache the value indefinitely)

This is an **improvement over Benji**, who doesn't honor reduced motion. Vercel and Linear do. We do.

### 4.4 IntersectionObserver pause/resume

Engine standard pattern. When demo scrolls out of viewport, pause timeline. When scrolls back in, resume from where paused.

**Critical detail:** pause must capture `elapsedMs` and resume must restart from that elapsed point. Cannot simply call `pause()` and `play()` without state preservation — that creates desync between cursor position and timeline position.

---

## Section 5 — Designer fingerprints and motion taxonomy

Polished motion is not a monolithic style. It is a family of styles, each with internally consistent parameters. Knowing each fingerprint helps when choosing what stylistic family to operate in for a specific demo or case study.

### 5.1 Six designer fingerprints at the parameter level

#### Benji Taylor

**Signature:** Build-point-wait choreography discipline + fluid morph aesthetics + AI-assisted iteration tooling (Agentation)

- Cursor pacing: strict "build → point → wait" cadence with intentional cognitive delays between each beat
- Vector morph interpolation: icons transform their underlying SVG paths rather than crossfading (3 SVG lines per icon enables morphing)
- Spring preference: Framer Motion springs for morph animations, not duration-based tweens
- Loop discipline: continuous-state seams where possible; `lerpSpeed 0.08` on canvas-level data interpolation

#### Rauno Freiberg

**Signature:** Spatial consistency + interruptibility + biological mass via spring kinematics

- Spring parameters: `stiffness 400, damping 30, mass 0.5` (high-tension, no wobble)
- Interruptibility: all motion built on spring-bound coordinates, not duration timelines
- Stagger discipline: 100–200ms between secondary elements (Follow-Through principle)
- Origin discipline: expanding elements anchor spatially to trigger coordinate (`var(--transform-origin)`)
- Fitts's Law application: infinite hit areas in corners, radial menus that spawn around pointer

#### Raphael Salaja

**Signature:** iOS-native fidelity + spring physics constrained to specific durations + heavy depth-of-field blur

- Spring parameters: `type spring, bounce 0.2, duration 0.6` (Apple iOS native pairing)
- Blur usage: `filter blur(16px)` on major state transitions; depth-of-field aesthetic
- Layout fluidity: AnimatePresence with `popLayout` for smooth boundary morphing
- Verified source: iOS battery notification recreation with documented spring values

#### Emil Kowalski

**Signature:** Snappy responsiveness + absolute parameter discipline + asymmetric timing

- Duration ceiling: strict under 300ms for all functional UI
- Asymmetric timing: exits 20% faster than entrances (e.g. 300ms open, 200ms close)
- Button press: `scale 0.97` universal, 160ms duration
- Entry scale: never `scale(0)`; minimum 0.93
- Tooltip behavior: 0ms subsequent reveal after first triggered
- Easing preference: custom cubic-beziers over springs; predictability over momentum

#### Vercel design team (Geist system)

**Signature:** Performance-driven minimalism + CSS-first + accessibility-rigorous

- Frigade dual-curve: `cubic-bezier(0.23, 1, 0.32, 1)` for macro (480–900ms) and `cubic-bezier(0.32, 0.72, 0, 1)` for micro (150–220ms)
- Performance discipline: `translate3d` for GPU acceleration; CSS over JS where possible
- Accessibility: `prefers-reduced-motion` respected; loading animations only after action starts
- WebReel orchestration: JSON schema with discrete pause/click/type actions and labels

#### Linear design team

**Signature:** Calm interface + animation suppression for high-frequency actions + visual restraint

- Anti-animation rule: zero motion on repeated actions (keyboard shortcuts, rapid list nav)
- Visual dimming: navigation sidebar dimmed when not focused; not every element carries equal weight
- Softened boundaries: lowered contrast on dividers, replacing harsh shifts with subtle borders
- Cognitive philosophy: animation serves usability first, delight second

### 5.2 The three schools of polished motion

Abstracting designer fingerprints into broader stylistic families:

#### School 1 — The iOS Naturalists (Physics School)

**Practitioners:** Raphael Salaja, Apple HIG, The Family App

- Heavy spring physics with duration/bounce syntax (bounce 0.2–0.3)
- Generous durations 400–600ms for full physics resolution
- Heavy blur crossfades for depth-of-field
- **Best for:** consumer apps, mobile-first products, interfaces requiring emotional resonance

#### School 2 — The Snappy Utilitarians (Cubic-Bezier School)

**Practitioners:** Emil Kowalski, Linear team, Vercel Geist

- Sub-300ms duration ceiling, ruthless
- Custom aggressive ease-out cubic-beziers
- Zero bounce in functional components
- Instant execution for high-frequency actions
- **Best for:** developer tools, enterprise SaaS, productivity environments

#### School 3 — The Spatial Choreographers (Structural School) ← **WE ARE HERE**

**Practitioners:** Rauno Freiberg, Benji Taylor

- High-stiffness traditional springs (`stiffness 400, damping 30`)
- Meticulous staggering with 100–200ms cascading delays
- Single-property vector morphs over opacity fades
- **Best for:** design tools, portfolio presentations, creative software

#### Which school fits our portfolio

Rotem's positioning is "systems thinker who builds tools." **The Spatial Choreographers school (Freiberg, Benji) aligns best** because it emphasizes structural fluidity and design-engineering capability over consumer delight or pure utility.

**Specifically:** high-stiffness springs (or our CSS approximation), meticulous staggering, single-property morphs. Less iOS-native depth-of-field, less ruthless under-300ms minimalism.

This frames every motion design decision: **when in doubt, hew to Freiberg/Benji's parameters over Salaja's or Kowalski's.**

---

## Appendix A — Applying this to our current portfolio state

The Ghost case study is partially built per V2 spec. This section maps the canonical specification onto what already exists and what needs to change.

### A.1 What is correct in the current build

- Hero-vs-body framework correctly applied — AI Fix Flow is the hero, Beats 2–4 are bodies
- Zero static screenshots policy enforced
- Engine architecture (primitives + namespaces) matches tier standard
- Reduced motion respected (improvement over Benji)
- Continuous loop seam discipline applied (cursor never fades out)
- Body demo heights at 330px (matches Benji)
- `blur(16px)` used correctly on Apply→done major state transition
- `scale(0.97)` button press applied

### A.2 What needs recalibration

| Issue | Current state | Canonical spec |
|-------|---------------|----------------|
| Cursor easing for traversal | Penner easeOutQuad `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)` — cursor is already on screen |
| Cursor click feedback | None — cursor does nothing on click | Stamping motion: `translateY(5px)` + shadow shift to 0px on click |
| Multi-step Apply→done rhythm | Uniform 333ms per step (V2) | Snap-pause-snap: T+150, T+750, T+900, done at T+1000–1200 |
| Step row visual treatment | Full-opacity progressive checks | Dimmed 30–40% inactive, 100% active with micro-checkmark |
| Zero-position loop reset | Incomplete — V2 had occasional state drift | Explicit reset at timeline position 0, restoring all animated properties |
| Cursor path curvature | Linear interpolation between X and Y | 10–25% deviation via asymmetric X/Y easing |
| Anticipation/overshoot | None | 2–5% past target via spring approximation `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### A.3 The recalibration sprint scope

A focused 2–3 hour sprint (NOT overnight). Apply the parameter envelope from Section 2 to the AI Fix Flow hero and Drift Detection Beat 3. Architectural changes (Single Unified Timeline pattern) are larger scope — defer to Pulse case study planning unless V3 sprint reveals architectural blockers.

**Sprint structure:**
1. Pre-sprint backup of current state
2. Apply Section 2.1 cursor parameters — change traversal easing, add cursor stamping motion on click
3. Apply Section 2.4 multi-step rhythm — restructure Apply→done as snap-pause-snap with progressive step cascade
4. Add Section 4.1 Rule 5 zero-position reset to prevent loop trap
5. Code-level verification, browser visual review
6. Vercel preview deploy if available
7. User morning review before production deploy

### A.4 Per-portfolio V3 deviations (rotemgotlieb.com Ghost case study)

**Added 2026-05-27 after V3 recalibration r2 + r2.1 sprints.**

After applying the canonical V3 envelope to the Ghost AI Fix Flow hero, two deliberate deviations remain. These are **per-portfolio calibrations, not framework overrides** — they apply to rotemgotlieb.com specifically because of the target audience (hiring managers in 30-second portfolio scans). Future portfolios (Pulse, LexisNexis) should default to V3 canonical ranges and only deviate with similarly explicit justification.

**Hero target loop duration: ~7.5s** (deviation from V3 §1.1 hero range 14–16s).
- Actual values: desktop 7600ms / mobile 6400ms
- Reasoning: V3's 14–16s range was set based on cross-portfolio research at the top tier (Benji, Linear, Salaja, etc.) where heroes carry richer narrative weight. For Rotem's portfolio specifically, hiring managers scanning portfolios in ~30 seconds need the hero to land faster — V3's 14–16s loop made the hero feel sluggish to the user during review.

**Terminal dwell ~600ms** (deviation from V3 §2.3 terminal dwell minimum 1500ms).
- Reasoning: V3's terminal dwell is positioned as the "exhale moment" before loop restart. In our specific case, the dense 7.5s hero doesn't need an exhale — the cursor returns to hover position above the first deviation row, brief pause, then re-clicks for the next iteration. This reads as **continuous browsing**, not as a punctuated loop-with-exhale. The 600ms gives the eye enough time to register the rest position without reading as hesitation.

**Apply→done middle pause 350ms** (deviation from V3 §2.4 600–1000ms load-bearing pause).
- Reasoning: user direction during r2 sprint — "quarter second of loading feels closer to the target." The snap-pause-snap rhythm structure is preserved (Step 1 fast, middle pause longer than Step 2→3 gap), just at faster tempo. The pause IS still the work; it's just compressed to match the overall faster hero.

**Beat 8 → Beat 9a dwell 600ms** (deviation from V3 §2.3 absorption dwell floor 800ms).
- Reasoning: user direction — viewer has already absorbed the major UI changes during the ripples cascade; extended absorption isn't needed before the close-panel action.

**Other V3 framework decisions remain intact** for this portfolio:
- Hero-vs-body framework (hero gets full chrome, bodies strip chrome)
- Continuous loop seam (no fade-out / fade-in)
- Cursor stratified easing (traversal ease-in-out, arrivals ease-out, exits ease-in)
- Cursor stamping motion (translateY + shadow shift on click)
- Snap-pause-snap rhythm structure (just at compressed tempo)
- Zero-position loop reset
- Step row visual restraint (Linear calm-interface dimming)
- Reduced-motion respected

**Mobile implementation note:** the 6400ms mobile LOOP_DURATION is achieved via MOBILE_DELTA = -1200ms applied to Beats 9a/9b/10 (the close-panel sequence). Beats 1–8 fire identically desktop and mobile; only the post-ripples sequence shifts up on mobile. This preserves the choreography proper while letting mobile end the loop earlier.

**When to revisit these deviations:**
- If user wants to ship a long-form case study (e.g., new product launch page) where dwell discipline matters more than scan-time density, default back to V3 14–16s loop with full V3 dwells.
- If a future portfolio iteration finds the 7.5s hero too tight (visitors miss the snap-pause-snap), extend selectively rather than across-the-board (e.g., restore Apply→done middle pause to 500ms while keeping total loop near 8s).

---

## Appendix B — Open questions and research gaps

### B.1 Unresolved from Gemini research (despite four sessions)

- Recruitment ROI telemetry — we cannot observe whether hiring managers spend more time on hero vs body demos
- Mobile autoplay completion rates — whether users skip past mobile loops faster than desktop is undocumented in public sources
- Internal asset generation pipelines — top designers' Figma-to-demo workflows are not public
- Variable refresh rate scaling — the 8% lerp constant at 60fps doesn't translate to 120Hz; correct scaling formula unknown
- Cognitive parsing thresholds for code — standard reading-time formulas don't apply to syntactical content; unclear what does

### B.2 Verification debts

- Frigade dual-curve parameters cited multiple times; verify against Frigade's actual published source before locking
- WebReel JSON schema details cited as authoritative; verify against Vercel's actual WebReel implementation
- Specific Linear blog quotes referenced; verify against published Linear design refresh posts
- 8% lerp constant attributed to Liveline; verify it's data-interpolation specific, NOT cursor pathing

### B.3 Architectural decisions deferred

- Vanilla CSS+JS vs GSAP migration — defer until Pulse case study planning
- React migration evaluation — defer until both Pulse and LexisNexis case studies are scoped
- Cross-surface hero reuse implementation — defer until first hero ships to production
- Audio cues for demos — none of our references use audio; deferred indefinitely

### B.4 Designers and patterns not yet investigated

- Pavlo (Linear or other) — Gemini Round 1 couldn't resolve; future research targets needed
- Charles Shin (ch.sh) — excluded for being directory-style; revisit if terminal-aesthetic portfolios become relevant
- Adam Ho (Stripe founding designer) — not in any research session; high-value target
- Mariana Velasquez (Mercury) — not investigated; high-value target
- Soleio Cuervo (Facebook/Dropbox) — historic founding-designer reference; not investigated

### B.5 Things this document deliberately doesn't cover

- Case study prose strategy — separate workstream
- Portfolio homepage structure — out of motion design scope
- Resume / cover letter / interview prep — out of scope
- Specific Pulse and LexisNexis case study planning — deferred to dedicated planning sessions

---

## Appendix C — File references

### C.1 Documents this synthesis consolidates

- `.claude/research/2026-05-21_benji-pattern-decomposition.md` — original pattern reference
- `.claude/research/2026-05-22_benji-autoplay-decomposition.md` — technical primitives reference
- `.claude/research/2026-05-25_benji-componentization-philosophy.md` — CC's deep HTML inspection (363 lines)
- `master-report-benji-portfolio-decomposition.docx` — V1 (Benji-only scope)
- `master-report-v2-portfolio-animation-discipline.docx` — V2 (CC + Strategist + Gemini Round 1)
- Gemini Round 1 Deep Research (May 24, 2026) — cross-portfolio benchmarking
- Gemini Round 2 Report 1 (May 26) — cursor and click mechanics
- Gemini Round 2 Report 2 (May 26) — dwell and loop seam craft
- Gemini Round 2 Report 3 (May 26) — principles framework and parameter envelope
- Gemini Round 2 Follow-ups (May 26) — cursor mid-flight, multi-step rhythm, timeline architecture

### C.2 Where this document lives

- **docx artifact:** `master-report-v3-canonical-motion-specification.docx` (project root)
- **Markdown copy for CC consumption:** `.claude/canonical-motion-spec.md` (this file)
- **Referenced from:** `.claude/design-decisions.md` ("Verified motion specifications" subsection)
- **Referenced from:** `.claude/CLAUDE.md` (three new standing rules — cursor easing by context, multi-step rhythm, Single Unified Timeline architecture)

---

## Appendix D — The Designer-Process Body Demo pattern

**Added 2026-05-27 after the Process Loops sprint** (replacement of Concept X/Z which had shipped as data-driven autopilot loops on the same day's morning). The user's reframe surfaced a categorical pattern that the canonical spec hadn't codified: body demos at the case study's rhetorical spine should show the *designer's process*, not the *product running*. This Appendix promotes that pattern to the canonical spec.

### D.1 The pattern in one paragraph

A cursor-as-agent body demo where the cursor represents the designer (not the user) making intentional design decisions on real product UI. Every cursor action is a judgment the viewer can FEEL: a click selects, a click decides, a click commits. The cursor's job is to TRANSFORM the canvas, not to narrate it. Between clicks, polyrhythmic cognition dwells (200–400ms varied) make the thinking visible. The continuous-state seam reverses every change before the loop boundary so each iteration restarts with the empty/initial state — the designer is starting the work over, not picking up mid-task.

### D.2 When this pattern is the right choice

Use the Designer-Process Body Demo pattern when:

- **The slot's rhetorical job is to argue HOW the work was done.** Design Process sections, Outcome sections, "how it works" beats. NOT when the slot's job is "this is what the product does" (that's the hero pattern).
- **The case study has real, observable product UI** the designer can act on. The cursor must manipulate ACTUAL components from the case study (deviation rows, severity legends, component cards, etc.), not abstract shapes.
- **There's a real design decision Rotem (or whichever designer's portfolio this is) made** that can be argued for 30 seconds in an interview. If the decision is fabricated or aestheticized, the pattern fails.

Don't use this pattern for:
- Hero demos — heroes show the product (cursor-as-user executing a fix), not the designer.
- Pure-data visualisations (charts, dashboards). Those argue what's true, not what was decided.
- Beats where animation isn't earned per V3 §1.2 — sometimes prose alone is right.

### D.3 The pattern's load-bearing mechanics

Five mechanics must all be present. Missing any one degrades the loop toward feature-tour or autopilot:

**1. The cursor IS the agent.** A DOM-rendered cursor (`Cursor` engine primitive) following scripted paths. Cursor click via `clickStamp()` (V3 stamping motion — translateY + shadow shift). NO cursor = no agent = product reads as running on its own.

**2. Build → point → wait, where the WAIT is the cognition.** Three-phase rhythm per cursor action:
- Build: prior beat's UI change resolves (or initial state)
- Point: cursor traverses to target (440ms ease-in-out engine default)
- Wait: hover dwell ON the target before clicking. This is the load-bearing beat — the viewer SEES the designer evaluating before deciding. Size by cognitive weight (per V3 §2.3 polyrhythmic dwell rule).

**3. Component manipulation is the substance.** Each cursor click produces a visible MATERIAL change — a popup opens, a marker lands, a color fills, a card gets a red border. The click is the decision; the change is the consequence. A click that produces no change reads as broken.

**4. Polyrhythmic dwells, never metronomic.** Three clicks at 333ms intervals read as scripted-bot. Vary the dwells per cognitive weight: decisive (200ms) → confirming pattern (350ms) → recognising pattern (280ms). Polyrhythm signals human cognition; uniformity signals automation.

**5. Continuous-state seam via mirror-action.** Every state change in iter N is reversed before T=LOOP_DURATION via an explicit cleanup beat. Cursor returns to rest position with SETTLE_MS=770ms. T=0 state ≡ T=LOOP state, mathematically. `resetAllState()` at iter start guards against drift.

### D.4 Two canonical examples shipped 2026-05-27

**DP-B "Severity Vocabulary Build"** ([js/demos/ghost-severity-build.js](../../js/demos/ghost-severity-build.js)) — cursor populates an empty 4-row severity legend (Breaking → red, Critical → orange, Minor → yellow; Resolved stays empty) via a small picker popup. As each legend row is defined, matching deviation rows below snap to the just-defined severity dot. **Additive build pattern.** 3 picks × ~1800ms each + settle + cleanup = 7000ms loop. Engine primitives: Cursor + Choreography + Marker × 3 (red/orange/yellow) + LoopObserver + prefersReduced.

**OC-E "The Critical Three"** ([js/demos/ghost-critical-three.js](../../js/demos/ghost-critical-three.js)) — cursor triages 21 real Ghost component cards by visiting Modal/Select/Banner in sequence, marking each critical (red border + red marker + counter tick). After the 3rd click the non-critical 18 fade to 30% opacity. **Subtractive triage pattern.** 3 picks × ~900ms each + cascade fade + 1830ms terminal absorption + cleanup = 7000ms loop. Engine primitives: Cursor + Choreography + Marker × 3 (red) + LoopObserver + prefersReduced.

The two demos demonstrate the pattern at categorically different abstraction levels: DP-B builds a vocabulary (small surface, 8 elements); OC-E wields that vocabulary at scale (large surface, 21 elements). Same five mechanics; different visual stories.

### D.5 Anti-patterns observed (Concept X + Concept Z, same-day teardown)

Patterns to avoid in body demos at the case study's rhetorical spine. Both shipped 2026-05-27 morning, both torn down same day after user review:

**Concept X — 21 sine-wave-fluctuating tiles + scanline sweep + periodic spikes.** No cursor. Implied actor = Ghost itself, scanning. Reads as "product running on its own." Failed the cursor-as-agent test.

**Concept Z — 4-stage pipeline (SCAN → DETECT → DIAGNOSE → FIX) with 4 tickets flowing via modular arithmetic.** No cursor. Implied actor = Ghost itself, processing tickets. Reads as "automated pipeline." Failed the cursor-as-agent test.

Both were technically clean (continuous-state seams via integer-cycle sines / modular ticket positions, IO pause/resume, reduced-motion paths). The flaw was rhetorical, not technical. They answered "what does Ghost do?" when the slot asked "how did the designer build Ghost?"

### D.6 Audit checklist for designer-process body demos

Before shipping any new body demo in a Design Process / Outcome / "how it works" slot:

1. **Cursor present?** ✓ DOM cursor mounts. Reads as the designer's hand.
2. **Decision per click?** ✓ Each click commits a real design judgment that Rotem could defend for 30 seconds.
3. **Material change per click?** ✓ Each click produces a visible UI consequence (popup, marker, color, fade, etc.). No clicks that "do nothing."
4. **Polyrhythmic dwells?** ✓ Varied 200–400ms dwells per click. NOT uniform intervals.
5. **Real Ghost components?** ✓ Subject elements (legend rows / component cards / etc.) are actual UI from the case study, not abstract shapes.
6. **Continuous-state seam?** ✓ T=0 ≡ T=LOOP via explicit cleanup beat reversing all changes.
7. **Reduced-motion path?** ✓ Static end state communicating the demo's argument without motion.
8. **Distinct from hero AND other body demos?** ✓ Layout, markers, pattern (additive/subtractive), and engine primitive composition each differ.

Any "no" answer is a structural failure. Fix before commit.

### D.7 Five-step template for future process loops

After visual approval of DP-B + OC-E on 2026-05-27 the user codified the working method as a five-step template. **This is the canonical operating procedure for every future process loop on this site** (Pulse, LexisNexis, any new case study body slot at the rhetorical spine). The five steps map onto the mechanics in §D.3 — concept-first design produces clean execution against locked specs.

**Step 1 — Decide the decision first.** Before any motion design, name in one sentence the judgment the loop demonstrates. If you can't write that sentence, you don't have a loop yet — you have an animation.

**Step 2 — Generate 2–3 concepts that all commit to that decision differently.** Grade against the four bars: decision-tension (not motion), distinct thinking-type vs other slots, interview-defensible (real call the designer made), real components (no fabricated UI). Recommend one with reasoning; offer alternatives.

**Step 3 — Resolve concept + honesty + distinctness at the spec level.** Beat-by-beat timeline with absolute T-stamps. Visual consistency checklist. Honesty audit per beat. Distinctness contract vs hero + other body demos. **Heavy upfront design predicts clean fast execution.**

**Step 4 — Build is pure execution.** Pre-phase backup. Markup + CSS + JS + cache-bust + script tag + verification. Match planned T-stamps EXACTLY. End-of-phase gate outputs planned-vs-implemented table.

**Step 5 — The cursor IS the agent making the decision.** Build → point → wait per beat. Polyrhythmic dwells (300/350/280 ms canonical: decisive / questioning / recognising). clickStamp at every commit. Real product components as subject. Mirror-action continuous-state seam.

The template is persistent at three layers:
- Codebase: this Appendix + the two worked examples ([js/demos/ghost-severity-build.js](../js/demos/ghost-severity-build.js), [js/demos/ghost-critical-three.js](../js/demos/ghost-critical-three.js))
- Project learnings: [.claude/learnings.md](learnings.md) — the "Why the severity-vocabulary loop landed" breakthrough-pattern entry (2026-05-27)
- User memory: `~/.claude/projects/.../memory/feedback_process_loop_template.md` (indexed in MEMORY.md, auto-loaded into future sessions)

### D.8 Pattern status

| Aspect | Status |
|--------|--------|
| Pattern shipped | ✓ 2026-05-27 (DP-B + OC-E in Ghost case study) |
| User visual review | ✓ Approved 2026-05-27 — both loops land, narrative arc reads, distinctness from hero confirmed |
| Bug surfaced at review | 1 (Marker 3 silent invisibility — fixed same session) |
| Engine hardening triggered | ✓ Marker primitive (KNOWN_VARIANTS + warnUnknownVariant + 6-constraint KNOWN CONSTRAINTS block) |
| Standing rule promoted | ✓ "Engine primitive self-documentation rule" in [.claude/CLAUDE.md](CLAUDE.md) |
| Canonical reference status | ✓ Established. Future portfolios (Pulse, LexisNexis) and future Ghost iterations apply this pattern at body slots that argue HOW the work was done. |

### D.9 Related standing rules

This Appendix is the **design** layer of the process-loop pattern. Two adjacent standing rules govern the **engineering** layer:

- **[Engine primitive self-documentation rule](CLAUDE.md)** in `.claude/CLAUDE.md` — every engine primitive (`cursor.js`, `marker.js`, `popup.js`, `choreography.js`, `observer.js`, `motion.js`, `reduced-motion.js`) carries a top-of-file `KNOWN CONSTRAINTS / GOTCHAS` block. Closed-set parameters use `KNOWN_X` module constants with `console.warn` on unknown values. Established 2026-05-27 after the Marker yellow-variant silent-invisibility bug.

- **[Body-demo discipline](CLAUDE.md)** in `.claude/CLAUDE.md` — body-slot demos (any slot between prose paragraphs, NOT heroes) at 300–350px height, strip ALL app chrome, wireframe fidelity with strategic real-text only, 6–10s loop OR interactive, first action within ~600ms when autoplay. DP-B and OC-E both satisfy this (330px, no chrome, wireframe with strategic real text, 7000ms loops, first action at T=740 — within tolerance per V3 §2.3 mid-narrative compressed dwell range).

The three rules together (Appendix D + engine self-documentation + body-demo discipline) form the operating envelope for every future process loop on this site.

### D.10 Gesture-signature catalogue (distinctness contract for multi-loop pages)

**Added 2026-05-28 after the Key Decisions Loop sprint** shipped K-A "The Editorial Strip" alongside the existing DP-B + OC-E + hero loops on the Ghost case study page. With four cursor-driven loops on one page, distinctness becomes load-bearing — each loop must read as a categorically different design activity, not as variations on the same theme.

This subsection catalogues the gesture signatures observed so far. **It is non-exhaustive — future demos may introduce signature #5 etc.** The discipline is: before building a new process loop on a page that already has process loops, name the gesture-signature category; if it's the same as an existing demo on the same page, distinguish on another axis (markers / popup / surface / dwell rhythm) explicitly.

#### The four observed gesture signatures

| # | Signature | Mechanism | Visual character | Worked example | Pattern type |
|---|-----------|-----------|-------------------|-----------------|---------------|
| 1 | **Action execution** | Cursor click → multi-step cascade → done-state crossfade | "Executing a known fix" | [ghost-ai-fix-flow-hero.js](../js/demos/ghost-ai-fix-flow-hero.js) (hero r2.6) | Cursor-as-user |
| 2 | **Additive build** | Picker-driven assembly; empty slot → filled slot with system reflecting downstream | "Building / defining vocabulary" | [ghost-severity-build.js](../js/demos/ghost-severity-build.js) (DP-B) | Cursor-as-designer |
| 3 | **Subtractive whole-element fade** | Cursor flags subset; non-flagged elements fade as system settles | "Triage / filtering signal from noise" | [ghost-critical-three.js](../js/demos/ghost-critical-three.js) (OC-E) | Cursor-as-designer |
| 4 | **Pointwise property-level edit** | Cursor edits ONE specific CSS property on a specific element while a SIBLING property holds | "Editorial restraint / removing what doesn't earn it" | [ghost-restraint-strip.js](../js/demos/ghost-restraint-strip.js) (K-A) | Cursor-as-designer |

#### How to distinguish a new loop from an existing signature

A new process loop on a page that already has, say, signature #3 (subtractive whole-element fade) cannot ship as a second whole-element-fade loop without failing distinctness. The new loop must either:

- **(a) Introduce a new gesture signature** — name it, add it to this catalogue.
- **(b) Use an existing signature on a categorically different surface AND/OR with distinct supporting primitives** — i.e., the LOOP differs on multiple axes simultaneously:
  - Markers used (0 / 1 / 3 / N; same-color / multi-color)
  - Popup used (yes / no)
  - Surface (deviation list / component grid / palette / legend / etc.)
  - Dwell rhythm (decisive / questioning / recognising — different cognitive arcs)
  - Loop duration (within body-demo 6–10s range)
  - End-state composition

K-A successfully shipped a NEW signature (#4) AND distinguished on every supporting axis: zero markers (vs hero's 1, DP-B's 3, OC-E's 3); no popup (vs DP-B's picker); deviation-list surface (overlapping with DP-B's split-panel layout — handled by the unique gesture signature carrying the distinctness); polyrhythmic dwells with edge-case-recheck (350/280/240/320 vs DP-B's 300/350/280 and OC-E's 300/350/280); zero blurCrossfade (the strip is a single-property CSS transition, not a blur-mediated swap).

#### The distinctness audit (run before any new process loop on a page that has process loops already)

1. **Name the gesture signature** the new loop will use. Check it against this catalogue.
2. **If it's already in the catalogue:** distinguish the new loop on at least three of (markers / popup / surface / dwell rhythm / end-state composition / loop duration). Document the distinctions in the design doc's distinctness audit section (Appendix D §D.6 step 8).
3. **If it's not in the catalogue:** add it. Reserve a new signature # in this section. Cite the worked example.
4. **In either case:** the design doc must include a distinctness table comparing the new loop against every existing process loop on the same page (matrix of axes — see this Appendix's worked examples for the format).

#### When to relax this discipline

When a page has 0 or 1 process loops, distinctness pressure is low — the new loop just needs to clear the four bars (decision-tension / distinct thinking-type vs hero / interview-defensible / real components). The signature catalogue is informational, not gating.

When a page has 2+ process loops, this catalogue becomes gating. By the time a page reaches 3 process loops (Ghost reached this on 2026-05-27), every new addition must clear the gesture-signature distinctness bar OR cut to prose-only / static visual.

### D.11 Horizontal-scroll continuous-state seam pattern (canonical)

**Added 2026-05-28 after the Beat 3 drift-detection carousel real-fix** closed a seam that had skipped through three prior sprints (two speed bumps + one structural fix that addressed gap/padding but left subpixel ambiguity). This subsection codifies the canonical pattern for any horizontal-scrolling continuous-state seam on this site — carousels, marquees, ticker rows, infinite scrollers.

#### The pattern (six steps)

**1. Render the list N ≥ 2 times end-to-end.** Each copy contains the identical children in identical order. The cleanest case is N=2 (one "real" list + one clone) when the viewport width is less than one list copy's width. If the viewport could exceed one list copy's width at any breakpoint, use N=3 so the seam transition has a "next" copy already in the viewport.

**2. Each child owns its trailing spacing.** Use `margin-right: Xpx` (or `margin-block-end` for vertical scrolls) on each item rather than `gap` on the container. This makes each half of the tile structurally identical including its trailing space; gap creates an asymmetric "between halves" connector that breaks the tile by half a gap.

**3. The container has zero padding** on the scroll axis. Padding adds asymmetric space inside the row that breaks the math. Visual edge softening (the gradient fade common to ticker rows) goes on the parent strip, not the scrolling row itself.

**4. Measure the exact pixel width of ONE list copy in JS at init.** Sum the children's outer widths (each child's `getBoundingClientRect().width` plus its computed `margin-right`). Write the total to a CSS custom property on the row: `row.style.setProperty('--list-width', LIST_WIDTH + 'px')`.

**5. The CSS keyframe translates by EXACTLY one list-copy width.** Use the custom property: `to { transform: translateX(calc(-1 * var(--list-width, 50%))); }`. The `50%` fallback covers the brief moment before JS runs (or the reduced-motion path). Modern browsers (Chrome / Safari / Firefox 2020+) interpolate `calc()` with custom properties correctly.

**6. Re-measure on resize.** Token widths change at responsive breakpoints (font scaling, smaller padding, different margin values). Without a resize listener, a desktop→mobile resize leaves the row translating by the wrong distance and breaks the seam at the new font scale. Debounce the resize listener (150ms typical) so the measurement runs after the layout settles.

#### Why this works

After N copies are rendered in identical order, each copy's children sit at positions `[0, LIST_WIDTH, 2*LIST_WIDTH, ...]` relative to the row's left edge. Translating the row by `-LIST_WIDTH` means child 0 of copy K+1 lands EXACTLY where child 0 of copy K started. Visible content at every screen-X position is mathematically identical at T=0 and T=cycle_end. The CSS animation's reset to `translateX(0)` is invisible because there is no content discontinuity.

#### Why percentage-based translation is NOT this pattern

`translateX(-50%)` is mathematically equivalent IFF row width is exactly 2 × LIST_WIDTH AND the browser rounds the percentage without subpixel artifacts. In practice: monospace fonts produce fractional token widths; 8+ of them plus margins compounds to a fractional row width; -50% lands at a subpixel position the browser may round to 0.5-1px off. The skip is small but perceptible at loop boundaries.

The pixel-precise pattern (this §D.11) eliminates that ambiguity by writing the exact translation distance in integer pixels. No rounding, no percentage interpretation.

#### Worked example: ghost-drift-detection.js + .dd-widget-row

- Markup: 16 `.dd-widget-token` children (8 originals + 8 clones, same content same order).
- Each token has `margin-right: 12px` (desktop) / `8px` (mobile @ 640px).
- Row has `display: flex`, no padding, no gap.
- JS: `measureListWidth()` sums `getBoundingClientRect().width + parseFloat(getComputedStyle.marginRight)` over the first 8 tokens. `applyListWidth()` writes the result to `--dd-list-width` on the row. Resize listener (150ms debounce) re-measures on viewport change.
- CSS keyframe: `to { transform: translateX(calc(-1 * var(--dd-list-width, 50%))); }`.
- Speed is independent of geometry (currently 13.04s linear infinite, tuned for visible cadence).

This is the reference implementation. Copy this pattern verbatim for any future horizontal-scroll seam on Pulse, LexisNexis, or new case studies.

#### Vertical-scroll equivalent

The same pattern applies for vertical infinite scrolls: replace `margin-right` with `margin-block-end` (or `margin-bottom`), measure column height instead of row width, translate `translateY` instead of `translateX`. The geometric guarantee is the same — N copies in identical structure, translate by one copy's height per cycle, pixel-precise via JS measurement + CSS custom property.

#### Related standing rule

The **Loop seam diagnosis rule** in [.claude/CLAUDE.md](CLAUDE.md) (added 2026-05-28) is the diagnostic discipline that protects this pattern from regressing. Before touching timing on a seam that skips, verify the geometry first. Speed cannot fix a geometric mismatch.

---

*End of canonical motion specification. Originally consolidated from four research streams, May 26 2026. Appendix D added 2026-05-27 after Process Loops sprint. Appendix D extended same-day with the five-step template + pattern status (§D.7-D.9) after visual approval + engine hardening. Appendix D extended 2026-05-28 with the gesture-signature catalogue (§D.10) after Key Decisions Loop sprint shipped a fourth distinct loop on the Ghost case study page. Appendix D §D.11 added 2026-05-28 after the Beat 3 carousel seam real-fix codified the horizontal-scroll continuous-state seam pattern. The reference standard for every future demo sprint.*
