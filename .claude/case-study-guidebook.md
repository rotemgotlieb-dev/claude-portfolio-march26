# Case Study Guidebook

**Established:** 2026-05-28, after the Ghost case study reached visual approval.
**Purpose:** the operating manual every future case study session reads first. Self-contained. A fresh Claude Code session in two months should be able to read this single file and run a new case study at the same standard as Ghost without grepping through old sprint reports.

**Scope:** Pulse is next. LexisNexis and GoteFigure are queued for the same treatment. Any new case study built or restructured on this site inherits the system documented here.

---

## A critical distinction this guidebook maintains throughout

Two categories of knowledge, kept separate:

**(A) The system.** Transferable to every case study. The engine primitives, the motion specification, the process-loop pattern, the four-bar evaluative framework, the gesture-signature catalogue, the composition rules, the writing principles, the banned words, the em-dash ban, the workflow discipline. **Universal.** Apply on every case study, every session.

**(B) Ghost-specific instances.** Reference only, not template. The DP-B / K-A / OC-E choreography timings, the severity vocabulary, the hero r2.6 beat values, the 21 components, the specific deviation rows. **Worked examples that prove the system works.** Pulse will generate its OWN versions of the same kinds of decisions. It will not copy Ghost's specifics.

When the guidebook says "the rule is X," that is the system. When it says "Ghost did X as a worked example," that is reference only. Future sessions must never confuse the two.

---

## 1. The North Star (one page)

### What every case study at this standard is doing

The portfolio sells one thing: **this person can decide, build, and ship at startup velocity.** The hiring target is founding designer / designer #1-3 at a Bay Area startup. Every case study is a 30-second proof point for that bar.

### The Benji insight (stated precisely)

Body demos at the case study's rhetorical spine show the **designer's process**, not the **product's features**. The cursor represents the designer. **Build, point, wait.** The viewer watches a designer think and build, not a system run on autopilot.

This was the breakthrough that defined the Ghost system. The original Concept X (token health dashboard) and Concept Z (remediation pipeline) shipped clean, mathematically correct data-driven loops. The user rejected them because nobody was visible in the frame doing the work. The replacement loops (DP-B, OC-E, K-A) put a cursor-as-agent at the center and the case study landed.

### The four bars (the universal gate)

Every concept for a process loop must clear all four:

1. **Decision-tension, not motion.** The cursor commits a real judgment. Each click is a choice a designer made. A cursor that visits elements in sequence without committing decisions is a feature tour with a pointer attached. Cut and rewrite.

2. **Distinct thinking-types across slots.** If two loops on the same page show the same kind of designer activity (both "vocabulary build" or both "triage"), they blur. Each loop on the page must demonstrate a categorically different cognitive activity.

3. **Interview-defensible honesty.** Every beat traces to a real design call the designer made. If a beat would make the designer uncomfortable explaining for 30 seconds to a hiring manager, cut it. No fabricated tooling, no implied process that did not happen, no invented metrics.

4. **Real product components as subject.** The cursor manipulates ACTUAL components from the case study (the deviation rows, the severity dots, the comparison slider). Not abstract swatches. Not generic placeholders. The viewer should recognize the pieces.

### The founding-designer framing

Every case study page should read so a startup founder (or designer hiring lead) thinks: "this person can own design, make systems decisions, and ship without hand-holding." That framing is structural (section order, demo placement, narrative arc) and verbal (first-person, technical vocabulary, named tools and decisions).

---

## 2. The system overview

Brief tour. One paragraph per part. Cross-references in brackets.

**The engine.** `js/demos/_engine/`. Eight primitives: `Cursor`, `Choreography`, `Marker`, `Popup`, `LoopObserver`, `prefersReduced`, plus `motion.js` (helpers including `getCenterOf`, `blurCrossfade`, `pulse`, `crossfade`, `setPillPosition`, `BLUR_LIGHT`, `BLUR_HEAVY`) and `reduced-motion.js`. Each primitive carries a `KNOWN CONSTRAINTS / GOTCHAS` comment block at the top of its file documenting failure modes and required CSS. Engine extensions document themselves inline. See §9.

**The canonical motion specification.** `.claude/canonical-motion-spec.md`. The authoritative reference for cursor easing, dwell discipline, loop seam math, multi-step rhythm, Single Unified Timeline architecture, and the process-loop pattern (Appendix D). Every motion design decision must be auditable against this spec.

**The process-loop pattern.** Appendix D of the spec. The five-step template (decide the decision first, generate concepts, resolve at spec level, build is execution, the cursor IS the agent). The gesture-signature catalogue (§D.10) and the horizontal-scroll continuous-state seam pattern (§D.11) extend it. See §5 and §6.

**The four-bar evaluative framework.** §1 above. Universal gate for every process loop concept.

**The composition rules.** `.claude/CLAUDE.md` "Case study page composition rule." Page-level layout discipline: prose introduces visuals (never trails them), no two looping visuals adjacent without text between them, every loop gets a framing line, the page must read polished for a founding-designer hire. See §7.

**The writing principles.** §8 below, codified across CLAUDE.md (banned words, em dash ban) and learnings.md. Voice, restraint, identity facts. The animations carry their own meaning; prose does not narrate them.

**The workflow discipline.** Design-first, diagnostic-first, concept gates, pre-phase backups, AskUserQuestion for ambiguity, end-of-phase verification gates with self-checks. See §3.

**The Ghost case study.** `work/ghost.html` and the seven demo modules (`ghost-ai-fix-flow-hero.js`, `ghost-slider.js`, `ghost-view-modes-widget.js`, `ghost-drift-detection.js`, `ghost-severity-build.js`, `ghost-critical-three.js`, `ghost-restraint-strip.js`). The worked-example proof that the system produces a case study at the founding-designer bar. See §10.

---

## 3. The workflow

The proven sequence, generalized from Ghost. Every case study runs these phases, in order.

### Phase 0: Pre-reading

Before any thinking on a new case study, read:

1. **This guidebook end to end.**
2. **`.claude/CLAUDE.md`**: every standing rule.
3. **`.claude/canonical-motion-spec.md`**: full spec, especially Appendix D (process-loop pattern), §D.10 (gesture-signature catalogue), §D.11 (horizontal-scroll seam pattern).
4. **`.claude/learnings.md`**: every entry, with particular weight on the meta-lesson entries (see §12).
5. **All engine primitives** in `js/demos/_engine/`, especially their `KNOWN CONSTRAINTS / GOTCHAS` blocks.
6. **The Benji research files** in `.claude/research/` (the three pattern decomposition files dated 2026-05-21, 2026-05-22, 2026-05-25).
7. **The case study's current state.** HTML, existing prose, any existing animations, any case-study-specific research brief.

If anything in the pre-reading is unclear or missing, document the gap in the sprint design doc rather than guessing. Honesty about what is not known is part of the system.

### Phase 1: Resolve the hard questions on paper before any code

Produce a sprint design doc at `.claude/sprint-reports/YYYY-MM-DD-<sprint-name>-design.md`. Cover:

- **The case study's narrative spine.** What does it argue overall? What are the section beats (Overview, Problem, Insight, Solution, Process, Decisions, Outcome, or whatever shape the case study takes)?
- **Real component inventory.** What actual product UI exists that loops can manipulate? List explicitly.
- **Candidate decisions for each loop slot.** What real design judgment does this slot's loop dramatize? Generate 2-3 concept candidates per slot. Beat-by-beat sketches.
- **Four-bar grading per concept.** Decision-tension, distinct thinking-type, interview-defensible, real components. Recommend one with reasoning. Show alternatives.
- **Distinctness audit.** If the case study will have 2+ process loops, name each loop's gesture-signature category (§6). No two loops on the same page may share a signature without explicit differentiation on supporting axes.
- **Honesty check per beat.** Every cursor action defensible in 30 seconds.
- **Risk surface.** Be honest about hard problems. Cite what could fail.
- **Visual consistency checklist.** Demo chrome, color tokens, typography all reuse existing site conventions.
- **Reduced-motion path** for each demo.
- **Mobile plan** for each demo.

Heavy upfront design produces clean fast execution. The right ratio is ~2:1 design:build time, not the reverse. The Ghost design docs ran 500-700 lines and Phase 3 build matched planned T-stamps with zero re-scoping.

### Phase 2: Concept gate

Present the design doc findings to the user via `AskUserQuestion`. Surface:

- The recommended concept per slot, with reasoning.
- The runner-up alternatives, with the trade-offs.
- Any risks the user should resolve before build (especially anything that affects scope or honesty).

**Wait for explicit approval before any code.** Do not start building on a guess. If the user picks a runner-up or rejects all concepts, regenerate.

### Phase 3: Build to spec

Implementation, with discipline:

- **Pre-phase backup.** Before any phase that modifies files, snapshot the about-to-change files to `_archive/_pre-<phase-name>-<date>/`.
- **Reuse engine primitives** verbatim. Do not reinvent. If a primitive needs a new variant or method, document the extension inline per §9.
- **Apply hero cursor discipline** to every cursor-driven loop: ease-in-out traversal `cubic-bezier(0.77, 0, 0.175, 1)` at 440ms for on-screen targets, `clickStamp()` for cursor click (translateY + shadow shift, never `scale`), true setTimeout-gated freezes between beats, polyrhythmic cognition dwells (never metronomic), continuous-state loop seam with zero-position reset at iteration boundary, reduced-motion early-exit, `LoopObserver` for IO pause/resume.
- **Match planned T-stamps exactly.** If the design doc says Beat 3B fires at T=2690, the implementation fires at T=2690. End-of-phase gate output is a "planned vs implemented" table.
- **Diagnostic-first when any value is unexpected.** If a parameter feels off, instrument before tweaking. The hero rhythm iterations and the carousel seam fix both started with rounds of speed/timing tweaks; both eventually closed only when the protocol switched to diagnostic-first.
- **Cache-bust lockstep.** When `styles.css` or any JS module changes, bump the cache-bust query string monotonically across all active HTML files in one pass.

### Phase 4: Visual review

Code-level verification is necessary but not sufficient.

Run code-level checks:
- Node syntax on every touched JS file.
- HTTP smoke on every critical endpoint.
- Grep for orphaned references after any structural change.
- Marker variant CSS rule audit (every variant string must have a matching `.demo-marker--{variant}` CSS rule).
- Identity facts intact (UC San Diego ICAM, San Jose, LexisNexis Risk Solutions ThreatMetrix, no PingCAP, no Canva on Ghost, no fabricated metrics).
- Banned word audit (zero in user-facing prose).
- Em dash audit (zero in user-facing copy, code comments exempt).

Then present to the user for visual review. Visual quality is the user's call. Do not claim "the loop lands" or "the rhythm reads correct" until the user has reviewed.

If the user flags an issue, diagnose at the right layer:
- **Geometry skip on a horizontal-scroll loop?** Geometry, not timing. See §D.11.
- **Rhythm feels robotic?** Polyrhythmic dwells, not metronomic. See canonical-motion-spec §2.3.
- **Loop seems to run on autopilot?** The cursor is not committing decisions. Audit against the four bars.
- **Page feels overwhelming?** Composition rules in §7.

### Phase 5: Synthesis

After each sprint that ships:

- **Sprint report** at `.claude/sprint-reports/YYYY-MM-DD-<sprint-name>.md`. What changed, every fork decision and why, code-level verification results, what to revisit at morning review.
- **Learnings entry** appended to `.claude/learnings.md`. What worked, what failed, what to apply going forward. Be specific. The next session reads these.
- **Engine documentation** if any primitive was extended. Update the `KNOWN CONSTRAINTS / GOTCHAS` block inline.
- **Canonical spec update** if a new reusable pattern emerged. Promote to canonical-motion-spec.md (Appendix D or new appendix).
- **CLAUDE.md update** if a new standing rule was established. Apply the rule format (provenance paragraph, numbered standing rules, audit checklist).
- **This guidebook update** if the rule generalizes beyond Ghost.

### Gate summary (when to pause, when to run)

- **Concept gate** (Phase 1 to Phase 2 transition): always pause, AskUserQuestion, wait for explicit approval.
- **Build gates** (end of each Phase 3 sub-phase if multi-loop): output planned-vs-implemented beat table, honesty self-check (one line), distinctness self-check (one line). No need to pause unless something is unclear; the gate output is for the morning visual review.
- **Visual review** (after build): the user always reviews before production work continues.
- **Overnight/unattended sprints**: explicitly framed as such by the user. No gates, document every fork. The morning visual review is the integrated approval.
- **Anything ambiguous**: use AskUserQuestion. The Ghost system's biggest wins came from surfacing the question rather than guessing.

---

## 4. The motion discipline

`.claude/canonical-motion-spec.md` is the authoritative source. Read it in full. The load-bearing rules, summarized for orientation:

- **Cursor easing by motion context.** On-screen to on-screen traversal: ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`. Arrival from off-screen: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`. Exit to off-screen: ease-in `cubic-bezier(0.7, 0, 0.84, 0)`. Never use generic `ease` or `linear`. (§2.1)
- **`clickStamp()` for cursor click.** translateY 5px + drop-shadow shift to 0 offset, 100ms. The CURSOR stamps; the TARGET compresses with `scale(0.97)`. Never `scale` the cursor. (§2.1)
- **True freeze discipline.** When the design calls for the cursor to dwell motionless, schedule the dwell as a discrete `setTimeout`-gated beat with NO motion queued in the gap. Not an easing tail. The motionlessness IS the cognition beat. (§2.3 + r2.5 learnings)
- **Build, point, wait.** Three-phase rhythm per cursor action. Build = prior beat resolves. Point = cursor traverses to target. Wait = hover dwell ON the target before clicking. The wait carries the cognition. The viewer SEES the designer evaluate before deciding. (Appendix D §D.3)
- **Polyrhythmic dwells, never metronomic.** The hover dwells across a multi-click sequence must vary. Canonical pattern: decisive (~300ms), questioning (~350ms), recognising-pattern (~280ms), edge-case-recheck (~320ms). Uniform dwells read as scripted. (§2.3, Appendix D §D.7)
- **Continuous-state loop seam.** End state mathematically equals start state. Either mirror-action (every change reverses before LOOP via an explicit cleanup beat, canonical for cursor-driven loops) or continuous-state-by-construction (periodic functions for data-driven loops, sine waves with integer cycles, modular arithmetic). (§2.5)
- **Geometry over timing for seam continuity.** When a loop visibly skips, verify content geometry is identical at T=0 and T=LOOP_DURATION before touching timing. Speed changes cannot fix a geometric mismatch. The Beat 3 drift-detection carousel is the worked example: three prior sprints tweaked speed (18s to 15.65s to 13.04s) before the real fix landed via pixel-precise translation. **For horizontal-scroll loops, the canonical pattern is `canonical-motion-spec.md` Appendix D §D.11** (render N≥2 copies, each item owns its trailing margin, zero container padding on scroll axis, measure exact list-copy width in JS, `translateX(calc(-1 * var(--list-width)))` in CSS, resize listener re-measures). The accompanying standing rule is `.claude/CLAUDE.md` "Loop seam diagnosis rule."
- **Zero-position reset at iteration boundary.** `resetAllState()` as the first action of `runIteration()`. Restores every modified CSS class and inline style. Defends against the V2 "loop trap." (Appendix D §D.3 mechanic 5, §4.1 Rule 5)
- **Reduced-motion path required** for every demo. Detect via `prefersReduced()` (the engine primitive). Render a static end-state that communicates the demo's argument without motion. Skip cursor mount, skip choreography, skip markers and popups.
- **IO pause/resume via `LoopObserver` required** for every autoplay loop. The dual-gate observer (viewport intersection + tab visibility) pauses the demo when out of view, resumes when back. Engine primitive is `js/demos/_engine/observer.js`.

The full parameter envelope (cursor durations by distance, dwell envelopes, blur values, spring approximations, snap-pause-snap for multi-step UI) lives in canonical-motion-spec.md §2. Read it before tuning any value.

---

## 5. The process-loop pattern (the breakthrough)

The five-step template that made the severity-vocabulary loop land. Generalized for every future process loop on any case study.

### Step 1: Decide the decision first

Before any motion design, name in one sentence the judgment the loop demonstrates. If you can't write that sentence cleanly, you don't have a loop yet, you have an animation. Motion serves the decision; the decision is the rhetorical payload.

### Step 2: Generate 2-3 concepts that commit to that decision differently

Not three variations of the same mechanism. Three categorically different ways the cursor could make the decision visible. Grade each against the four bars (§1). Recommend one with reasoning. Surface alternatives for the concept gate.

### Step 3: Resolve concept + honesty + distinctness at the spec level

Heavy upfront design doc. Beat-by-beat timeline with absolute T-stamps. Visual consistency checklist. Honesty audit per beat. Distinctness contract vs hero + other body demos on the same page. If the decision wasn't real (if the designer didn't actually make this call), stop and pick a different decision. Do not fabricate process.

### Step 4: Build is pure execution against the locked spec

Pre-phase backup. Markup + CSS + JS + cache-bust + script tag + verification. Match planned T-stamps exactly. End-of-phase gate outputs a planned-vs-implemented table. The build phase should be the shortest phase of the sprint when the design phase was done correctly.

### Step 5: The cursor IS the agent making the decision

Build, point, wait per beat. Polyrhythmic cognition dwells. `clickStamp()` at every commit. Real product components as subject. Mirror-action continuous-state seam. The cursor visibly does intentional work. No autopilot.

### Worked examples (Ghost-specific, reference only)

These are NOT templates. They are proof points that the five steps produce loops at the founding-designer bar.

- **DP-B "Severity Vocabulary Build"** (`js/demos/ghost-severity-build.js`): additive build signature. The cursor populates an empty severity legend via a small picker popup; matching deviation rows below snap to the just-defined severity. Three picks per 7000ms loop. Polyrhythmic dwells 300/350/280ms.
- **OC-E "The Critical Three"** (`js/demos/ghost-critical-three.js`): subtractive whole-element fade signature. The cursor triages 21 component cards by flagging three as critical; the non-critical 18 fade to 30% opacity. 1830ms terminal absorption freeze.
- **K-A "The Editorial Strip"** (`js/demos/ghost-restraint-strip.js`): pointwise property-level edit signature. The cursor strips text-label color from four deviation rows; severity dots beside each row hold. Polyrhythmic dwells 350/280/240/320ms.
- **Hero "AI Fix Flow"** (`js/demos/ghost-ai-fix-flow-hero.js`): action execution signature. The cursor executes a known fix (Apply, then a 3-step cascade, then done). Locked at r2.6 after six iterations of cursor rhythm tuning. 7190ms desktop / 5990ms mobile.

Pulse will produce its own loops in its own gesture-signature categories. The Ghost specifics are reference only.

---

## 6. The gesture-signature catalogue and the distinctness rule

When a case study has 2+ process loops, name each loop's gesture-signature category. If a new loop would share a category with an existing loop on the same page, distinguish on multiple supporting axes (markers vs no-markers, popup vs no-popup, surface, dwell rhythm) and document the distinctions explicitly. Otherwise the loops blur for the viewer.

### The catalogue so far

Four signatures observed across the Ghost case study:

1. **Action execution.** Cursor click, then multi-step cascade, then done-state crossfade. "Executing a known fix." Cursor-as-user pattern. Worked example: hero AI Fix Flow.
2. **Additive build.** Picker-driven assembly. Empty slot becomes filled slot with system reflecting downstream. "Building or defining vocabulary." Cursor-as-designer. Worked example: DP-B Severity Vocabulary Build.
3. **Subtractive whole-element fade.** Cursor flags a subset; non-flagged elements fade as system settles. "Triage, filtering signal from noise." Cursor-as-designer. Worked example: OC-E Critical Three.
4. **Pointwise property-level edit.** Cursor edits ONE specific CSS property on a specific element while a SIBLING property holds. "Editorial restraint, removing what doesn't earn it." Cursor-as-designer. Worked example: K-A Editorial Strip.

### The catalogue is open

Pulse may introduce signature #5. When it does, the loop must be:
- Categorically different from #1-4 (not a variant)
- Verifiable against the four bars (§1)
- Documented in `canonical-motion-spec.md` §D.10 with provenance (which sprint, which worked example) and the same shape as the existing entries

The catalogue is non-exhaustive by design. The discipline is: name the signature category before building, check it against the catalogue, and if it shares a category with an existing loop on the same page, either differentiate on supporting axes or pick a different concept.

### The distinctness audit

Run before any new process loop on a page that already has process loops:

- Name the gesture signature the new loop will use.
- Check against the catalogue.
- If shared with an existing loop on the same page: distinguish on at least three of (markers / popup / surface / dwell rhythm / end-state composition / loop duration). Document the distinctions in the design doc.
- If new: add to canonical-motion-spec.md §D.10 with provenance and worked example.

Run also: the design doc includes a distinctness table comparing the new loop against every existing process loop on the same page (matrix of axes). See `.claude/sprint-reports/2026-05-28-key-decisions-loop-design.md` §1E for the canonical format.

---

## 7. The composition rules

Page-level layout discipline. The standing rule lives in `.claude/CLAUDE.md` "Case study page composition rule." Apply to every case study built or restructured, every session.

### The five rules

1. **A section reorder is not complete until every element's position is verified relative to its new neighbors.** When sections move, walk the page top-to-bottom AFTER the move and check each element against the elements now above and below. Sequence may be right but composition may now be wrong. Reorders break composition silently; only an element-level audit catches it.

2. **Prose that introduces a visual MUST precede that visual, never trail it.** If a paragraph's content is "the slider does X" or "the demo shows Y," that paragraph belongs BEFORE the demo, framing it. Animation-narration (prose describing what the viewer just saw) is a structural error.

3. **No two looping visuals may be adjacent without a framing text beat between them.** The Benji rhythm rule: alternate text and visual. Two autoplay loops back-to-back (separated only by a caption) overwhelm the reader. The framing can be a full section (canonical pattern: `<section class="case-section">` + H2 + p) or a lead paragraph; either way, it sits in the prose slot before the demo.

4. **Every looping visual gets a short framing line before it.** Names what the demo argues. Demo demonstrates it. Optional caption after summarizes the takeaway in one line. Pattern: framing prose, then demo, then (optional) caption.

5. **The page must read polished and professional for a founding-designer hire.** Deliberate rhythm. Nothing overwhelming. Each section: setup, demo, takeaway. A hiring manager scanning in 30 seconds should feel "this person sequences their work deliberately."

### The audit checklist

Before shipping any case study restructure or new build:

- Walk top-to-bottom. For every element, name what's directly above and below it. Verify the relationship makes sense.
- Find every introducing-prose block. Confirm it sits BEFORE its visual.
- Find every pair of adjacent looping visuals. Confirm a framing text beat sits between them.
- Confirm every looping demo has a framing line above it (section prose or lead paragraph).
- No animation-narration in any prose.
- The reorder doesn't leave anchor links broken (section IDs stable; sidebar nav resolves).
- Cache-bust lockstep across all 11 active HTML files if any styles changed.

Reference for the audit format: `.claude/sprint-reports/2026-05-28-layout-audit.md` (element-by-element walkthrough).

---

## 8. The writing principles

### Voice

- **First-person where natural.** "I rebuilt the dashboard." "I added the AI Fix Flow." Founding-designer ownership signals come from first-person.
- **Technical vocabulary.** Name specific tools, specific decisions, specific failure modes. "WCAG 1.4.3 violation" beats "accessibility issue." "Figma-to-Storybook token pipeline" beats "design system." "Subpixel rounding on percentage-based translation" beats "the seam skips."
- **Zero marketing fluff.** State facts. Let the reader infer praise. No adjectives that don't earn their place. No hedging.
- **The animations carry their own meaning.** Do not narrate what they show. If the slider demo above demonstrates dragging to reveal drift, the prose does not say "drag to reveal drift." Prose adds what the demo can't show: the taxonomy, the competitor naming, the design rationale.

### Hard rules

- **Banned words** (zero tolerance, every user-facing surface): `leverage`, `ensure`, `passionate`, `seamless`, `intuitive`, `robust`, `holistic`. These read as marketing fluff. Replace with technical or first-person alternatives. Run a grep audit on first touch of any case study.

- **Em dash ban** (project-wide hard rule, `.claude/CLAUDE.md`): never use the em dash character (U+2014, or `&mdash;`) in user-facing copy. Reads as AI. Code comments and internal sprint reports are exempt. Replacement hierarchy: period > comma > parentheses > colon > rewrite. The shortest fix that preserves meaning wins. Verification: a grep for U+2014 across user-facing HTML files returns zero, and a grep for `&mdash;` returns zero. Title separator convention on this site: middle dot ` · ` (U+00B7).

- **No fabricated metrics.** Every claim interview-defensible in 30 seconds. If a number isn't real, it isn't on the page.

- **Identity facts intact.** UC San Diego Interdisciplinary Computing and the Arts (ICAM, not Santa Cruz, not Literature). San Jose. LexisNexis Risk Solutions ThreatMetrix. No PingCAP. No Canva on Ghost. If prose touches these, they stay correct.

### Page-level discipline

- **Founding-designer framing.** Every case study page should read so a startup founder thinks "this person can decide, build, and ship." That's structural (section order, where Process sits relative to Outcome) and verbal (first-person, named tools, named decisions).

- **Tight, not sparse.** Restraint over skimping. Cut what doesn't earn its place. Preserve what's load-bearing (the concrete failure examples, the named competitors, the specific design calls, the "what I'd do differently" reflection).

- **Animation-narration is the highest-yield trim target.** When a case study has multiple demos on the page, ANY prose that describes what a demo shows is structurally redundant. Cut without hesitation. Keep prose for what the demo CAN'T show.

- **When a hero demo carries the product overview, the Overview prose can be ruthlessly thin.** Don't restate what the hero shows. Don't narrate the upcoming demo. State the thing, name the signature interaction, stop. Move biographical or reflective context to the Outcome section.

---

## 9. The engine

Brief tour. `js/demos/_engine/`. Each primitive carries a `KNOWN CONSTRAINTS / GOTCHAS` comment block inline. Read those blocks before using the primitive in a new demo.

### Primitives

- **`Cursor`** (`cursor.js`): DOM-rendered scripted cursor. `mount`, `moveTo(x, y)`, `moveTo(x, y, { duration })` for slow settling moves, `clickStamp()` for V3 stamping motion, `snapTo` for teleport, `show`, `hide`, `destroy`. Default easing is ease-in-out at 440ms (traversal context). Per-move duration override available.

- **`Choreography`** (`choreography.js`): single timeline runner. Takes `{ timeline, duration, onReset }`. Timeline is an array of `{ at: ms, do: fn }` beats. `play`, `pause` (captures elapsed offset), `resume`, `reset`. The single master timeline pattern (canonical-motion-spec §4). Every demo's animated state derives from one timeline, not cascading setTimeouts.

- **`Marker`** (`marker.js`): numbered annotation pin. `mount`, `appear({ x, y })`, `disappear`, `destroy`. **KNOWN_VARIANTS** closed set: `default` / `green` / `orange` / `yellow` / `red`. Constructor checks against the set; unknown variants trigger `console.warn` with the canonical text noting the missing CSS rule. Adding a new variant requires both (a) appending to `KNOWN_VARIANTS` in `marker.js` AND (b) adding a `.demo-marker--{variant}` rule in `styles.css` under the existing variant block. Both steps ship together.

- **`Popup`** (`popup.js`): Benji-style annotation popup with header + input + Cancel/Submit. `mount`, `show({ x, y, header, submitVariant })`, `typeInto(text, { charDelay })`, `hide`, `destroy`. Submit variants: default / green / red.

- **`LoopObserver`** (`observer.js`): dual-gate viewport + tab visibility observer. `start`, `stop`. Fires `onEnter` when BOTH conditions are met (element in viewport AND tab is visible). Fires `onExit` when either flips false. Required for every autoplay loop.

- **`prefersReduced`** (`reduced-motion.js`): `matchMedia` query. Re-evaluated per call (not cached) so OS-level mid-session toggles take effect.

- **`motion.js`** helpers: `getCenterOf(element, container)` for container-local center coords, `pulse(cursorEl)` for click pulse animation, `crossfade(fromEl, toEl)` for opacity sibling swap, `blurCrossfade(fromEl, toEl, { blur, duration })` with `BLUR_LIGHT = 2` and `BLUR_HEAVY = 16` constants, `setPillPosition(pillEl, activeChipEl)` for chip-pill slide.

### The self-documentation rule

When you touch any engine primitive (bug fix, feature add, refactor):

- Update the `KNOWN CONSTRAINTS / GOTCHAS` block inline if the change creates a new constraint OR closes an old gotcha.
- For any new silent-failure mode, add a `console.warn` in the constructor or setter. The warning names the bad value, states the constraint that was violated, and lists valid values if the set is closed. Do NOT throw. Warn only.
- Closed sets get a `KNOWN_X` module-level constant. The constant is the single source of truth that the CSS rule list (or other dependent list) mirrors. Adding to the set requires updating both.
- Apply retroactively when you touch a primitive. If the file is missing a `KNOWN CONSTRAINTS` section, add one in the same session.

The canonical example: `marker.js` was hardened after the DP-B Minor marker silent-invisibility bug (the yellow variant was accepted by the constructor but had no CSS rule, producing an invisible marker). The 6-constraint block at the top of marker.js is the template for every other engine primitive.

### Engine extensions

Extend primitives when a real demo needs functionality the engine doesn't have. Don't extend for hypothetical futures. Don't extend for one-off use; if only one demo will use the feature, build it inline in the demo, not in the engine.

When you do extend:
- Update the file-header API description.
- Update the `KNOWN CONSTRAINTS / GOTCHAS` block.
- If a new closed set is introduced, add a `KNOWN_X` constant.
- Document the extension in the sprint report.
- Bump the demo scripts that import from the engine via `?v=N` cache-bust query string so the import graph re-evaluates.

---

## 10. The Ghost-specific reference (worked examples only)

**DO NOT copy these specifics to other case studies.** They are Ghost-specific worked examples that prove the system works. Pulse, LexisNexis, GoteFigure, and any new case study will generate their own equivalents.

### The seven demos on the Ghost page (final order, post-layout-audit)

| Position | Demo | Pattern | Signature | Notes |
|---|---|---|---|---|
| 1 (above the fold) | Hero AI Fix Flow | autoplay 7190ms desktop / 5990ms mobile | Action execution | Locked at r2.6 after six rhythm iterations. Do not move. Do not retune. |
| 2 (between Problem and Insight) | Comparison Slider | user-driven drag | Not a process loop | Annotation-revealing comparison |
| 3 (Solution, Design Process, DP-B, drift detection framing prose, then Beat 3) | Drift Detection carousel | autoplay 5000ms JS loop + 13.04s linear infinite CSS scroll | Not a process loop (token row with popup) | Geometric seam fix worked example. See §D.11. |
| 4 (after Beat 3) | View Modes chip toolbar | user-driven chip click | Not a process loop | blurCrossfade between modes |
| 5 (Design Process body) | DP-B Severity Vocabulary Build | autoplay 7000ms | Additive build | Three picks. Polyrhythmic 300/350/280ms. Three different-colored markers (red/orange/yellow). |
| 6 (Key Decisions body) | K-A Editorial Strip | autoplay 7000ms | Pointwise property-level edit | Four strips. Polyrhythmic 350/280/240/320ms. Zero markers (the strip itself is the gesture). |
| 7 (Outcome body) | OC-E Critical Three | autoplay 7000ms | Subtractive whole-element fade | Three triage picks across 21 cards. 1830ms terminal absorption freeze. Three red markers. |

### Ghost-specific decisions that taught us system lessons

- **Severity vocabulary (Breaking / Critical / Minor / Resolved, mapped to red / orange / yellow / green).** Worked example of "decide the decision first." DP-B dramatizes the moment this taxonomy was defined.
- **21 components tracked.** Worked example of system-wide triage. OC-E uses this exact count.
- **Three deviation rows + dot color contract** (Color Deviation, Spacing, Radius, Font weight, mapped to red/orange/orange/yellow). The same four rows appear in the hero, DP-B, and K-A for narrative continuity. Worked example of "real product components as subject."
- **Hero r2.6 timings** (T=1160 first clickStamp, T=3420 Apply clickStamp, 350ms middle pause). The result of six rhythm iterations. Worked example of polyrhythmic dwell discipline and snap-pause-snap rhythm at compressed tempo.
- **K-A polyrhythmic dwells 350/280/240/320ms.** Worked example of "decisive, then questioning, then recognising, then edge-case-recheck" arc.
- **OC-E 1830ms terminal absorption.** Worked example of the "rhetorical payoff window" for a subtractive triage loop.
- **The K-A markers removal.** The numbered markers added in the overnight sprint were removed in the layout audit because they crowded a loop ABOUT restraint. Worked example of "apply the loop's own argument to its own surrounding elements."

### Ghost-specific page section order

Hero, Overview, Problem, Insight (moved before slider in the layout audit), Comparison Slider, Solution (rewritten to remove animation-narration), Design Process + DP-B, Detection runs at the token level (framing) + Drift Detection, Four view modes (framing) + View Modes, Key Decisions, Color where it carries meaning (framing) + K-A, Outcome + OC-E, Other Work.

Pulse will produce its own section order based on Pulse's narrative spine.

### Reference sprint reports

For the full design rationale per loop, read in order:
- `2026-05-26-v3-recalibration-design.md` (hero r2.1 to r2.6 lineage)
- `2026-05-27-process-loops-design.md` (DP-B + OC-E design)
- `2026-05-27-process-loops.md` (the breakthrough sprint report)
- `2026-05-28-key-decisions-loop-design.md` (K-A design)
- `2026-05-28-key-decisions-loop.md` (K-A sprint report + fourth gesture-signature codified)
- `2026-05-28-finishing-sprint.md` (K-A polish + section reorder + carousel +20% + copy trim; the overnight sprint)
- `2026-05-28-layout-audit.md` (the element-by-element audit format)
- `2026-05-28-layout-fix.md` (composition fixes + K-A markers removal + carousel geometric fix)

---

## 11. Starting a new case study: the first-session checklist

The literal checklist a future session uses to begin Pulse, LexisNexis, GoteFigure, or any new case study. Run in order.

1. **Read this guidebook end to end.** The system lives here. Section 1-9 is universal. Section 10 is Ghost-specific reference (do not copy).
2. **Read `.claude/CLAUDE.md`** in full, every standing rule.
3. **Read `.claude/canonical-motion-spec.md`** in full, especially Appendix D + §D.10 (gesture-signature catalogue) + §D.11 (horizontal-scroll seam pattern).
4. **Read `.claude/learnings.md`** every entry, with weight on the meta-lesson entries listed in §12.
5. **Read the engine primitives** in `js/demos/_engine/` with attention to the `KNOWN CONSTRAINTS / GOTCHAS` block at the top of each file.
6. **Read the Benji research files** in `.claude/research/` (the three pattern decomposition files dated 2026-05-21, 2026-05-22, 2026-05-25).
7. **Read the case study's current state.** HTML, existing prose, any existing animations. For Pulse: `work/pulse.html`, plus any V2 sprint reports if they exist.
8. **Read any case-study-specific research** (Pulse will have its own brief and component inventory; Pulse V2 master report exists from a prior sprint).
9. **Identify the case study's narrative spine.** What does it argue overall? What are the section beats? What is the wedge demo (the "this is the product" artifact above the fold)?
10. **For each section beat that warrants a visual loop, name the candidate decision the loop will dramatize.** One sentence per loop. If you can't write the sentence, you don't have a loop, you have a placeholder.
11. **Run the process-loop pattern (§5) for each candidate.** Generate 2-3 concept mechanisms per loop slot. Grade against the four bars (§1). Produce a sprint design doc.
12. **Concept gate.** AskUserQuestion. Wait for approval. Do not start code on a guess.
13. **Build to spec.** Reuse engine primitives. Hero cursor discipline. Match planned T-stamps exactly. End-of-phase gates output planned-vs-implemented tables.
14. **Apply the composition rules (§7) when laying out the page.** Walk top-to-bottom after any reorder. Every loop gets framing prose above it. No two loops adjacent without text between them.
15. **Apply the writing principles (§8) for every word of prose.** Banned word audit. Em dash audit. Identity facts intact. No animation-narration.
16. **After each loop ships, update the gesture-signature catalogue (§D.10)** if a new signature emerged. Add provenance and worked example.
17. **After the case study ships, update this guidebook** if a new generalizable rule emerged. Section 13 (Open questions) is the right place to flag things this guidebook didn't anticipate.

---

## 12. The hard-won meta-lessons

The lessons that took multiple sprints to learn. Inheriting these prevents future sessions from repeating the cycles.

### 1. Product-on-autopilot fails. Designer's-hand lands.

The Concept X (token health dashboard with sine-wave fluctuations) and Concept Z (remediation pipeline with modular ticket flow) shipped on 2026-05-27 morning and were rejected by the user the same day. They were technically clean (mathematically correct continuous-state seams, IO pause/resume, reduced-motion paths) but rhetorically broken: no cursor visible = no designer in the frame = "product running on autopilot" reading. The replacement loops (DP-B + OC-E + K-A) put a visible cursor as the agent and the case study landed. **Rule: if a loop's job is to argue HOW the work was done, the loop needs a visible designer doing it.** That is the four-bar gate, especially bar 1 (decision-tension, not motion).

### 2. Diagnostic-first beats implementation-then-revision.

The hero r2.6 lineage went through six iterations (r2.1 to r2.6) of cursor rhythm tuning over multiple sessions. Each iteration was implementation-then-revision: change a beat timestamp, ship, user reviews, change another. The breakthrough came when the protocol switched to diagnostic-first: surface the discrepancy via AskUserQuestion before committing. The r2.6 fix shipped in one session because the user picked the conservative option (-140ms on Beat 2b vs the more aggressive interpretation). Implementation matched the planned T-stamps exactly. **Rule: when a parameter feels off, instrument before tweaking.** Use AskUserQuestion to surface the ambiguity.

### 3. Geometry over timing for loop seams.

The Beat 3 drift-detection carousel ate three prior sprints that tweaked scroll speed (18s, then 15.65s, then 13.04s) on the assumption that the visible seam skip was a timing problem. Speed was never the lever. The real cause was geometry: `gap: 12px` + `padding: 0 20px` on the row produced a 6-14px content mismatch when `translateX(-50%)` reset. The layout audit caught the major geometric error and switched to `margin-right: 12px` on each token + zero row padding. The fourth sprint added pixel-precise translation (JS measures one list copy's exact width and writes it to a CSS custom property; the keyframe uses `calc(-1 * var(--list-width))`) to eliminate the residual subpixel ambiguity from percentage-based translation. **Rule: when a loop visibly skips, verify content geometry first, before touching timing.** Speed changes cannot fix a geometric mismatch. The "Loop seam diagnosis rule" in CLAUDE.md and `canonical-motion-spec.md` §D.11 codify this.

### 4. A reorder isn't done until every element is verified relative to its new neighbors.

The overnight finishing sprint moved the Design Process section up so DP-B sat higher in the page. The sequence was right. But the composition broke: The Insight + Solution prose ended up after the slider and narrated it (animation-narration). DP-B and drift detection ended up adjacent with no framing prose between them. The K-A markers added in the same sprint crowded a loop ABOUT restraint. The layout audit caught all three. **Rule: after any reorder, walk the page top-to-bottom and verify every element against its new neighbors before declaring done.** The Case study page composition rule in CLAUDE.md is the formalization.

### 5. Silent invisibility is the worst failure mode for visual primitives.

The DP-B Minor marker was supposed to be yellow. The constructor accepted `variant: 'yellow'` without erroring. But `styles.css` had no `.demo-marker--yellow` rule. The DOM element rendered with class `demo-marker demo-marker--yellow` and no background fill (a transparent circle with white "3" text against a near-white canvas). Invisible. The fix was one CSS rule. The lesson: silent failures consume sprints. **Rule: closed config sets become `KNOWN_X` module constants. Unknown values trigger `console.warn` (not throw) with the canonical text naming the bad value, the constraint, and the supported set. The CSS rule list mirrors the JS set; both ship together.** The Engine primitive self-documentation rule in CLAUDE.md and the marker.js KNOWN CONSTRAINTS block are the canonical examples.

### 6. Decide the decision first.

This is the breakthrough lesson from the Process Loops sprint. Every process loop on this site traces to a real design judgment the designer made. Before any motion design, name the decision in one sentence. If you can't, you don't have a loop yet. The five-step template in §5 is built around this. **Rule: motion serves the decision. The decision is the rhetorical payload. The cursor is the agent making it visible.** Without the decision-first step, loops default to feature-tours-with-a-cursor or product-running-on-autopilot, both of which fail the four bars.

### 7. Concepts get resolved on paper, before code.

The Phase 1 design doc for the Process Loops sprint ran ~720 lines and resolved every concept candidate, every honesty check, every distinctness audit, and every beat-by-beat T-stamp before any code. Phase 3 build matched the planned T-stamps exactly across 17 beats with zero re-scoping. The ratio of design time to build time was roughly 2:1. **Rule: heavy upfront design predicts clean fast execution. The five-step template in §5 is the discipline. Concept gates prevent expensive rebuilds.**

### 8. Banned words and em dashes are hard rules, not nice-to-haves.

Style discipline is part of the founding-designer bar. A page with `leverage` or `seamless` reads as marketing fluff. A page with em dashes (U+2014) reads as AI. Both signals dilute the technical-first-person ownership voice that makes a portfolio land. **Rule: zero tolerance, every user-facing surface. Run the audits on first prose touch.** The em dash ban and banned word standing rules in CLAUDE.md are the canonical references.

### 9. Approval without reading is a failure mode.

Watch for approve-by-summary: the user reads the report summary, says "looks good," and the gap between what was approved and what shipped grows. Design docs need real review at the concept gate, not skim-and-OK. **Rule: when the user is reviewing for approval, surface the specific decisions that need their judgment via AskUserQuestion. If a fork requires a real choice (which concept, which trade-off, which alternative), put it in front of them as a choice. Do not bury it in a summary.**

### 10. "Feels like it's working" is the worst false positive.

When a parameter change morphs the bug but doesn't eliminate it, the parameter is not the root cause. The carousel speed tweaks "felt like they did something" because each bump changed the skip duration proportionally. That false positive consumed three sprints. **Rule: if N consecutive parameter tweaks don't close the bug, the root cause is at a different layer. Stop. Reframe. Diagnose at a different layer.** The Loop seam diagnosis rule in CLAUDE.md formalizes this for seams; the principle applies broadly.

### 11. Restraint, applied recursively.

When K-A (the loop demonstrating editorial restraint) had four numbered markers added in the finishing sprint, they crowded the canvas and contradicted the loop's own argument. The layout audit removed them. **Rule: when a demo argues a principle, audit the demo's own surrounding elements against that principle.** The recursive application is the discipline.

---

## 13. Open questions and known unknowns

Honest about what the Ghost work did not resolve.

### What we have not yet tested

- **Pulse, LexisNexis, GoteFigure rebuild.** The system has shipped exactly one case study at this bar. The first time Pulse uses the system, expect surfaces the Ghost work did not anticipate. Things like: Pulse's narrative spine may not fit the Overview / Problem / Insight / Solution / Process / Decisions / Outcome shape Ghost used. Pulse may need fewer process loops than Ghost (which sits at 5 cursor-loops plus slider plus chip toolbar). Pulse may introduce a gesture-signature category not in §D.10.
- **Real-device mobile.** The Ghost demos render correctly at mobile breakpoints per code-level verification, but emotional landing on a real iPhone has not been the focus of visual review. Document any mobile-specific perception issues that Pulse surfaces.
- **Multi-page case study coherence.** Ghost is one page. The site's other case studies (LexisNexis, Pulse) are also one page each. The system has not been stress-tested on a case study that wants to span multiple pages.

### What we suspect but have not proven

- **Page saturation ceiling.** Ghost ships 5 cursor-driven autoplay loops + 1 user-driven slider + 1 user-driven chip toolbar on one page. We suspect that is the saturation ceiling for a single case study. Pulse may need fewer loops to read polished. If the audit checklist (§7) flags "this page feels saturated," cut to prose-only at the slot rather than adding a 6th loop.
- **First-person framing scope.** First-person reads well in technical Ghost prose (the Design Process pivots, the K-A framing line) but may read differently on a more reflective case study (Pulse has more strategic argument; LexisNexis has more team-context content). Pulse may need a mix.
- **The hero pattern vs body-demo discipline boundary.** The hero is allowed full app chrome at 7-16s loop duration; body demos strip chrome at 6-10s. Pulse's wedge demo (Living Observatory) is closer to a hero than a body demo. Treat as a hero unless the case study has multiple wedge candidates competing for the slot.

### What this guidebook itself does not cover

- **Pulse's specific narrative spine.** That's case-study-specific design work that happens in Pulse's Phase 1 design doc. The guidebook gives the system; Pulse's design doc gives the Pulse-specific instances.
- **The exact balance between explanatory prose and demo density on a strategy-heavy case study.** Ghost is product-mechanic-heavy (compares spec to production); Pulse is strategy-heavy (positions against competitors, frames the buyer / user split). Pulse may need more prose and fewer demos. Or it may need the same density at different proportions. Run the four-bar grading on each slot.
- **The handoff between case studies.** When a new case study ships, what gets cross-promoted on the Ghost page? The "Other Work" section convention exists but the editorial discipline for cross-promotion has not been codified beyond the Cross-Surface Thumbnail Consistency Rule.

### The guidebook updates itself

This document is not frozen. After Pulse ships, the meta-lessons (§12) get appended if new general-purpose rules emerged. The gesture-signature catalogue (§6 + canonical-motion-spec.md §D.10) gets appended if a new signature emerged. The open questions (§13) get updated as they get answered or as new ones surface.

The guidebook is the entry point. The case study work it enables is the output.

---

*End of case study guidebook. Established 2026-05-28 after Ghost reached visual approval. The system here is universal. The Ghost-specific examples are reference only. Pulse is next.*
