# Pulse Sprint 1 · Research, Narrative Spine, Concept Candidates

**Date:** 2026-05-28
**Sprint:** Pulse rebuild, Sprint 1 of 3 (research and spine; NO code)
**Predecessor:** Ghost reached visual approval 2026-05-28; case-study guidebook established same day
**Next:** Sprint 2 produces full design doc beat-by-beat; Sprint 3 builds

---

## How to read this document

Five sections. Read in order. §1A grounds everything that follows in what Pulse actually is. §1B proposes the rebuilt spine. §1C grades concept candidates per loop slot with explicit recommendations. §1D surfaces what Rotem must resolve at the concept gate. §1E previews Sprint 2.

The deliverable ends with an AskUserQuestion gate. No Sprint 2 work begins until Rotem approves.

---

## §1A · Research synthesis: what is Pulse, actually?

### A.1 What the current page claims Pulse is

Read [work/pulse.html](../../work/pulse.html) end to end. The current page argues:

- **Concept project, 2026.** A UX intelligence tool built for designers, not analysts.
- **Wedge:** Designers ship components; existing tools (Hotjar, FullStory, Contentsquare) report on pages.
- **Signature surface:** The Living Observatory. One canvas fusing a procedural wireframe of the analyzed page, a four-layer thermal heatmap, a 7-day time scrubber, and an AI prompt bar that flies a cursor across the canvas to land on the issue you asked about.
- **Hero artifact:** [ai-fly.mp4](../../img/pulse/v2/videos/ai-fly.mp4) (the prompt-driven cursor flight to the date-picker zone).
- **V1 → V2 pivot:** scrapped a polished "Calm Command Center" SaaS dashboard for the paper-on-cream Observatory after senior feedback ("not bad, but not interesting").
- **Two further pivots inside V2:** wireframes shifted from abstraction to "stylized-but-real" (real column headers, real task names, real assignee initials); "Show me the fix" split into two CTAs (primary routes to deep-dive, secondary "Apply fix here" triggers in-place morph).
- **Outcome counts:** "17 issues authored across five pages. 32 components tracked. Six procedural wireframes rendered in code. Four heatmap layers. Twelve build phases."
- **Tech:** Figma, Next.js 14, TypeScript, Tailwind v4, Framer Motion. Procedural SVG wireframes. Custom canvas-based heatmap renderer at 60fps.

### A.2 What Pulse actually is, per the project folder

I inspected every artifact in [img/pulse/v2/](../../img/pulse/v2/). The component inventory is richer than the current prose advertises. Verified artifacts:

**Surface 1 · The Living Observatory canvas** (verified: [home-task-board.png](../../img/pulse/v2/home-task-board.png), [home-onboarding.png](../../img/pulse/v2/home-onboarding.png), [layer-rage.png](../../img/pulse/v2/layer-rage.png), [layer-attention.png](../../img/pulse/v2/layer-attention.png))

Components rendered on the canvas:
- Thin left rail with 4 icon nav (analytics / layers / canvas-zoom / brief drawer)
- Top **ASK PULSE** prompt bar with 3 quick-prompt chips: "Worst issue right now", "What degraded this week?", "Show me the fix for the date picker"
- **Page chip toolbar** (5 pages confirmed visible: Task Board, Onboarding, Settings, Dashboard, Project View)
- **Layer chip toolbar** (4 layers confirmed: Friction · Rage Clicks · Dead Clicks · Attention; each has a visually distinct thermal palette per the screenshots)
- **Procedural wireframe** of the active page. Task Board view renders BACKLOG / IN PROGRESS / REVIEW / DONE columns with real task titles ("Refactor authentication flow", "Update onboarding copy", "Fix mobile nav overflow") and real assignee initials (FE, EL, JM). Onboarding renders a workspace setup form with stepper, fields, toggles. The rendering looks procedural (component density too uniform for screenshotted-then-traced).
- **Thermal heatmap overlay**: visible halos concentrated on real interaction targets: the column gutters on Task Board (the Fitts's Law violation the prose names), the Continue button on Onboarding.
- **Friction zones right rail**: top 3 issues per page (KanbanColumn / DatePicker / TaskCard for Task Board; SubmitButton / OnboardingForm / ProgressStepper for Onboarding). Each row: severity dot + name + one-line description + "Xk users affected".
- **"Connect your design system"** CTA button (Figma integration shown as a surface, named in prose as decision NOT to build).
- **7-day time scrubber** at the bottom (MON 20 → SUN 26, current day SUN 26 highlighted).

**Surface 2 · Diagnosis card** (verified: [card-broken.png](../../img/pulse/v2/card-broken.png), [card-fixed.png](../../img/pulse/v2/card-fixed.png))

An overlay card that opens when a hot zone (or a quick-prompt chip) is engaged. Composition:
- Component name + severity dot (KanbanColumn, red dot)
- Headline ("Drag targets on Task Board columns are too narrow for reliable interaction")
- 2-paragraph plain-English diagnosis (the prose mentions Fitts's Law)
- Metrics: "12.7k affected · 71% Trackpad · +23%"
- Sparkline trend
- **Three CTAs**: "Compare side-by-side" · "Show me the fix" · "Apply fix here"
- The `card-fixed.png` variant shows a "Recent" tag, "View change details" + "Revert" actions, surfacing that the fix has been applied.

**Surface 3 · Compare view** (verified: [compare.png](../../img/pulse/v2/compare.png), [compare.mp4](../../img/pulse/v2/videos/compare.mp4))

Synchronized BEFORE / AFTER split. Same wireframe rendered twice. Heatmap halos on the left fade out on the right after the fix. Shared 7-day scrubber along the bottom. This is the "Compare side-by-side" CTA's destination.

**Surface 4 · Deep-dive page** (verified: [deep-dive-top.png](../../img/pulse/v2/deep-dive-top.png), [deep-dive-diagnosis.png](../../img/pulse/v2/deep-dive-diagnosis.png), [deep-dive-fix-open.png](../../img/pulse/v2/deep-dive-fix-open.png), [deep-dive-wcag.png](../../img/pulse/v2/deep-dive-wcag.png), [deep-dive-recommendations.png](../../img/pulse/v2/deep-dive-recommendations.png), [deep-dive.mp4](../../img/pulse/v2/videos/deep-dive.mp4))

A routed page (not an overlay). The depth where Pulse pays off. Composition:
- Page header with component name + back-to-canvas
- Large headline with issue ID (`ISS-002`)
- 4-metric strip: Affected views (12.7k) · Sessions (1,247 / +228 week over week) · Confidence (High) · Est. impact if fixed (-84%)
- **Diagnosis prose** with Fitts's Law analysis, real technical reasoning ("drop zones between Task Board columns measure 4px wide... below the threshold of reliable acquisition... Fitts's Law puts the minimum reliable target for high-frequency interactions at 24px on desktop pointers")
- "via Fitts's Law" tag
- **Recommended fixes section**, ranked by projected impact. Each card includes:
  - Numbered ordering (1, 2, 3)
  - One-line recipe ("Widen drop zones to 24px minimum with invisible padding")
  - Effort tier badge (QUICK WIN / MEDIUM EFFORT)
  - Projected friction reduction (-84%)
  - Estimated dev hours (~2)
  - WCAG resolution tag (Resolves WCAG 2.5.5)
  - **Actual code diff** with `-` / `+` lines
  - "1 file changed · +4 lines, -1 line · Affects 247 component instances"
- **WCAG accessibility verification card** with CURRENT (4×52px fails 2.5.5) vs FIXED (24×52px passes 2.5.5) + chips for Contrast / Keyboard / Screen reader semantics preserved
- **Session evidence strip** with 5 mini session thumbnails (USER 2941 etc.) labelled TRACKPAD / MOUSE / TOUCH with success/abandoned outcomes
- **Related issues**, same-component-or-pattern cards (TaskCard, PriorityLabel)

**Surface 5 · Weekly Brief drawer** (verified: [brief-drawer.png](../../img/pulse/v2/brief-drawer.png))

Right-side drawer. Composition:
- "Weekly Brief · Week of April 19-25, 2026" header
- "Generated by Pulse · Auto-delivered every Monday"
- Health score: 78 (-4 from last week)
- Bulleted "What changed" summary (3 lines: a friction drop, an onboarding improvement, a regression callout)
- "Top priority next steps" card with a single action ("Fix KanbanColumn drag targets (ISS-002)") and projected impact
- "Component Spotlight" · ToggleSwitch · 1.2k instances
- "Accessibility timeline" · WCAG 2.1 AA 91% compliant · 4 active contrast violations

**Surface 6 · Component Health drawer** (verified: [components-drawer.png](../../img/pulse/v2/components-drawer.png))

Right-side drawer. Composition:
- "Component health" header with subtitle "10 components marked across 5 pages"
- Search input
- Sort/filter chips: Health · Issues · Usage
- Scrollable list. Each row: severity dot (red, orange, yellow) · component name + instance count ("DatePicker · 87 instances") · severity issue count · sparkline
- Components visible: DatePicker, SubmitButton, OnboardingForm, KanbanColumn, TaskCard, FilterDropdown, ProgressStepper, SettingsPanel, PriorityLabel, WidgetGrid
- Notice the current prose says "32 components tracked" but the drawer subtitle says "10 components marked across 5 pages". The 10-count is what's surfaced; 32 may be the total inventory. Honesty check flagged in §1D.

**Surface 7 · V1 Calm Command Center** (verified: [v1-calm-command-center.png](../../img/pulse/v2/v1-calm-command-center.png))

A complete artifact. Dark mode SaaS dashboard. Left sidebar (Dashboard, Issues, Components, Weekly Brief). "Page X-Ray" panel with 3-column wireframe overview. Right rail: Pages list with status pills (Task Board / Onboarding / Settings / Dashboard / Team Members), Issues on Task Board (2 critical / 2 high / 1 medium), 30-day trend sparkline, big metric "78", "Pages Monitored / 6", "Open Issues / 15", "Users Affected / 73.2k", "User Journey Flow" footer panel. This is what got scrapped.

**Scan sequence** (verified: [scan-input.png](../../img/pulse/v2/scan-input.png), [scan-running.png](../../img/pulse/v2/scan-running.png), [scan-results.png](../../img/pulse/v2/scan-results.png))

An onboarding flow that hooks Pulse into a deployed product. Three states: input the URL, scan running, results landed. Not currently featured on the live page; may be useful as supporting visual or cut.

### A.3 The wedge, in one sentence

Component-anchored UX intelligence in the designer's vocabulary, when every existing tool (Hotjar, FullStory, Contentsquare) reports on pages and speaks in conversion-rate-optimization terms.

This wedge is real and the artifacts back it up. The diagnosis-card surface and the deep-dive page both anchor every observation to a named component with instance count, and the recommended-fixes section ranks remediations by effort tier with code-level diffs. That last detail (code diffs in the diagnosis surface, not separate engineering tickets) is the strongest single signal that the design closes the loop from "what's broken" to "what to change" inside one product surface. Hotjar does not do this. Neither does FullStory or Contentsquare.

### A.4 Component inventory, condensed (for §1C concept generation)

When Sprint 2 designs loops, these are the real components the cursor can manipulate. Same-list discipline as Ghost's deviation rows + severity dots:

| # | Component / surface | Used in loop slot candidate |
|---|---|---|
| 1 | ASK PULSE prompt bar (input + 3 quick chips) | Hero (existing); Slot A candidates |
| 2 | Page chip toolbar (5 chips: Task Board / Onboarding / Settings / Dashboard / Project View) | Slot B candidates |
| 3 | Layer chip toolbar (4 chips: Friction / Rage Clicks / Dead Clicks / Attention) | Slot B (primary); Slot D fallback |
| 4 | Procedural wireframe (Task Board kanban; Onboarding form; etc.) | Slot D primary |
| 5 | Thermal heatmap overlay (per-layer palette) | Slot A; Slot B |
| 6 | Friction zones right rail (top-3 issues per page) | Slot A |
| 7 | Diagnosis card (KanbanColumn / DatePicker / etc.) | Slot A; Slot D (dual-CTA candidate) |
| 8 | Compare view (BEFORE/AFTER split) | Slot D (dual-CTA candidate); existing compare.mp4 |
| 9 | Deep-dive page (metrics + diagnosis prose + ranked fixes + WCAG + sessions) | Slot D (dual-CTA candidate); existing deep-dive.mp4 |
| 10 | Weekly Brief drawer | Outcome (static supporting visual) |
| 11 | Component Health drawer | Outcome or Solution (static supporting visual) |
| 12 | V1 Calm Command Center (full layout) | Slot C primary |

### A.5 Real design decisions, audited for interview-defensibility

For each decision: what it is, where it shows up, and the honest verdict on whether Rotem can defend it for 30 seconds without flinching. Decisions Sprint 2 can use to anchor process loops are marked **defensible**.

| # | Decision | Where it shows up | Defensible verdict |
|---|---|---|---|
| 1 | Scrap V1 (Calm Command Center) for V2 (Living Observatory) | V1 screenshot vs V2 canvas | **Defensible.** The artifacts are both real and the gap is dramatic. Rotem can name the senior reviewer's feedback ("not bad, but not interesting") as the trigger. THE pivot. |
| 2 | Rename "Page X-Ray" → "Living Observatory" | The Pivot section prose | **Defensible** but small. Rotem can name the reasoning (X-Ray is passive/medical; Observatory is exploratory/active). Probably prose-only, not a loop. |
| 3 | Wireframes shift from blueprint to stylized-but-real | Compare V1 wireframe (abstracted columns) vs V2 wireframe (real column headers, real tasks) | **Defensible.** Real call. The V2 screenshots show actual task titles + assignee initials that would not be present in a blueprint render. Slot D primary candidate. |
| 4 | Dual CTA split: "Show me the fix" (deep-dive route) + "Apply fix here" (in-place morph) | Diagnosis card | **Defensible.** Both surfaces exist as artifacts. The decision logic ("I built both, then realized the right answer was both") is interview-clean. Slot D candidate. |
| 5 | Layer taxonomy: Friction / Rage Clicks / Dead Clicks / Attention | Layer chip toolbar; verified palette differences in layer-rage vs layer-attention screenshots | **Defensible.** The four-layer choice is editorial. Could be 3 layers or 5; Rotem picked 4. Slot B candidate. |
| 6 | OKLab-interpolated thermal palette per layer | Prose claim, visible palette differences in layer screenshots | **Probably defensible.** OKLab is a specific perceptually uniform color space; using it for thermal interpolation is a real technical choice with real consequences (smoother gradient, avoids muddy intermediates). Honesty check: was OKLab the actual implementation choice, or marketing phrasing? Flagged §1D. |
| 7 | Component severity vocabulary (red / orange / yellow dots, instance counts) | Diagnosis card, components drawer, friction zones rail | **Honesty question.** This vocabulary maps almost 1:1 onto Ghost's Breaking / Critical / Minor severity dots. Were both designed by Rotem in parallel, or did Ghost's vocabulary inform Pulse retroactively? Affects what Pulse can claim. Flagged §1D. |
| 8 | Procedural canvas (drawn in code, not screenshotted) | Prose claim; visual consistency of wireframes across screenshots is consistent with procedural render | **Defensible** if the SVG render code exists. Worth confirming there's an actual `<svg>` component that takes data and renders, vs a `Frame.png`. Flagged §1D. |
| 9 | What NOT to build: no predictive heatmaps, no mobile responsive, no real Figma integration | Prose | **Defensible.** Restraint is the design. Each exclusion has a real reason. Worth keeping as prose. |
| 10 | Time scrubber as part of the canvas (not a separate panel) | Visible in all canvas screenshots | **Defensible** small decision. The scrubber is part of the canvas because time IS a dimension of the issue, not a filter on a list. |
| 11 | Diagnosis card → deep-dive page (route, not overlay) | Deep-dive screenshots are full-page; diagnosis card has back-to-canvas link | **Defensible.** The choice to route to a full page (vs expand the card in place) is a real architectural call: when depth becomes the subject, depth deserves its own surface. |
| 12 | 60fps custom canvas-based heatmap renderer | Prose claim | **Probably defensible** if the renderer was implemented. Worth confirming. Flagged §1D. |

### A.6 What current prose overclaims or underclaims

**Overclaims surfaced by the inventory audit:**

- **"32 components tracked."** The Component Health drawer screenshot says "10 components marked across 5 pages." 32 may refer to total inventory; 10 is what's surfaced. If 32 is unverifiable, the line becomes "Ten components tracked across five pages". Still strong, less brittle.
- **"Six procedural wireframes rendered in code."** Five pages confirmed in the page-chip toolbar. The 6th could be the home/landing or the V1 layout. If the 6th doesn't exist as an artifact, the count is 5.
- **"17 issues authored across five pages."** Three issues are visible per page (top-3 friction zones). Across 5 pages that's 15, not 17. The friction-zones rail surfaces top-3 only; perhaps 17 is the total inventory; perhaps not. Worth confirming.
- **"Twelve build phases on a single branch in a focused day."** Cannot verify from artifacts. Plausibly true; just unverifiable. Either Rotem confirms the count or trim.

**Underclaims surfaced by the inventory audit:**

- **Weekly Brief drawer.** A real artifact with health score, weekly diff, top priority, component spotlight, accessibility timeline. Not mentioned in current prose at all. Suggests Pulse has a "managed monitoring" surface beyond just the canvas. Strong material.
- **WCAG verification on every fix.** The deep-dive WCAG card (CURRENT 4×52px FAILS 2.5.5 → FIXED 24×52px PASSES 2.5.5) is a level of accessibility specificity that puts Pulse above any of the named competitors. Worth surfacing explicitly.
- **Code diffs inside the diagnosis surface.** The Recommended Fixes section shows actual diffs (`-width: 4px / +width: 4px / +padding-inline: 10px / +margin-inline: -10px / +cursor: col-resize`). That's the design-engineering close-the-loop signal that none of Hotjar / FullStory / Contentsquare get near. Currently barely mentioned in prose.
- **Effort tiers + dev hours estimates.** "QUICK WIN · ~2 dev hours" framing is shipping-team vocabulary. Designer credibility signal.

### A.7 Verdict: is Pulse rebuildable to Ghost-level quality?

**Yes.** The wedge is real, the components are real, the design decisions are real and interview-defensible, the artifacts back the prose. Pulse has more strategic substance than Ghost (named competitors, V1→V2 pivot, dual CTA decision, "what not to build" list) and a richer component surface. The current page underdelivers on the artifacts the project folder contains.

The honest gaps (§A.5 notes 6-8, 12; §A.6 over/underclaims) are surfacable and resolvable. None blocks the rebuild.

---

## §1B · The narrative spine for the rebuild

### B.1 Critique of the current page

Read top to bottom against the case-study guidebook (§7 composition rules, §8 writing principles).

**What's working:**
- The hero artifact (ai-fly.mp4) is the right strongest visual. Keep.
- The Problem section's wedge framing ("designers ship components; tools report on pages") is sharp and cites real WCAG-1.4.3 mechanics. Keep with edits.
- The Insight is a single declarative sentence followed by one more. Pure Ghost-style restraint. Keep.
- The Pivot section is excellent storytelling material with a real artifact (V1 screenshot) and a quotable trigger.

**What's structurally broken:**

1. **Overview overclaims the Solution section.** Two paragraphs in Overview. The second paragraph names the competitors (Hotjar / FullStory / Contentsquare). That belongs in The Problem. The Overview should be ~2-3 tight sentences.

2. **The Solution paragraph narrates the hero.** "Type 'show me the fix for the date picker' and the cursor flies across the canvas to the DatePicker zone." The hero ai-fly.mp4 already shows that. Per the composition rule, prose that describes what the demo shows is animation-narration: structural error. Cut and rewrite around what the demo CAN'T show: the layer taxonomy, the OKLab decision, the component-anchoring philosophy.

3. **The trio of static images** (home-task-board + layer-rage + card-broken) sits after the Solution prose without a framing line. Per Composition Rule 4, every visual cluster gets a short framing line. Either re-frame or replace.

4. **Two body videos back-to-back** without a framing prose beat between them (compare.mp4 inside Solution; deep-dive.mp4 inside Design Process). Composition Rule 3 is violated unless prose intervenes.

5. **The Pivot diptych** (V1 screenshot left, V2 screenshot right) is a perfectly serviceable static composition but it's a static side-by-side where a slider would land harder. Same artifacts, more interactive, lets the viewer DO the comparison.

6. **Outcome overclaims.** The numbered list ("17 issues · 32 components · 6 wireframes · 4 layers · 12 build phases") is the kind of metric paragraph that reads aspirational. Trim to what survives the honesty audit.

7. **Animation-narration leak in Design Process:** "**'Show me the fix' split into two CTAs.** The first version morphed the home canvas in place. The second routed to a deep-dive page. The right answer was both: primary CTA routes to the deep-dive for analytical depth, secondary 'Apply fix here' triggers the in-place morph for demo magic." This narrates compare.mp4 (which immediately follows). Restructure.

### B.2 Proposed rebuilt spine

Following Ghost's section pattern, adapted for Pulse's strategy-heavier subject. Each section gets a one-line "what this argues" and a visual treatment recommendation.

| # | Section | What this argues | Visual treatment |
|---|---|---|---|
| 1 | **Hero** | "This is Pulse. The canvas is the product." | Existing ai-fly.mp4 + caption (≤15 words). Keep as-is. |
| 2 | **Overview** | "A UX intelligence tool that speaks the designer's vocabulary." | Prose only. 3 sentences max. Cut competitor list (moves to Problem). |
| 3 | **The Problem** | "Designers ship components; their tools report on pages." | Prose only. Lead with the page-vs-component asymmetry. One sentence each disqualifying Hotjar / FullStory / Contentsquare. Close with the concrete failure example (WCAG 1.4.3 disabled-state). |
| 4 | **The Insight** | "Make the heatmap an interface, not a visualization." | Prose only. 2 sentences. Keep current wording. |
| 5 | **The Solution: Living Observatory** | "Four layers, one canvas, the designer's vocabulary throughout." | Framing prose (2 sentences) + **user-driven Layer chip widget** (Loop slot B). The widget argues the layer taxonomy decision: 4 chips swap thermal palettes over the same wireframe. |
| 6 | **Design Process** | "Two interior pivots got V2 the rest of the way." | Two-decision section. Lead with the wireframe fidelity decision (framing prose 2-3 sentences) + **wireframe-fidelity process loop** (Loop slot D). Then the dual-CTA decision (framing prose 2-3 sentences) + selectively keep deep-dive.mp4 OR cut. |
| 7 | **The Pivot: V1 → V2** | "Version one was competent and forgettable; I scrapped it." | Framing prose 2-3 sentences ("The trigger was a senior reviewer's feedback...") + **V1 vs V2 user-driven slider** (Loop slot C). Replaces current diptych. |
| 8 | **Key Decisions** | "What I chose not to build is part of the design." | Prose only. Three named exclusions (predictive heatmaps, mobile, real Figma integration), each with one sentence of reasoning. Founding-designer voice: "If I had three more weeks, the next thing I'd build is..." |
| 9 | **Outcome** | "What this concept argues, and what I'd do differently." | Prose + optional static supporting visual (Component Health drawer or Weekly Brief drawer as the "the canvas isn't the only surface" coda). Trimmed counts per the §A.6 honesty audit. Restraint version of current Outcome. |
| 10 | **Other Work** | Unchanged. | LexisNexis + Ghost cards. |

**Note on section ordering.** Current order is Overview → Problem → Insight → Solution → Pivot → Design Process → Outcome. Proposed reorder swaps Pivot and Design Process so the V1→V2 pivot lands as the dramatic close of the process arc rather than mid-stream. Rationale: the pivot is the BIG decision; placing it after the in-V2 process pivots (wireframe fidelity + dual CTA) makes the pivot section the apex of the case study before Outcome resolves. Open for debate at the gate.

### B.3 Section-by-section composition walk (top to bottom audit)

This is the §7 composition rule applied to the proposed spine. Every element has a name above and below it; every loop has a framing line; no two loops are adjacent without prose between.

| Position | Element | Above | Below | Composition check |
|---|---|---|---|---|
| 1 | Hero (ai-fly.mp4) | (top of page) | Overview prose | ✓ Strongest visual first. Caption ≤15 words. |
| 2 | Overview prose | Hero | Problem prose | ✓ Sets the wedge in 3 sentences. |
| 3 | Problem prose | Overview | Insight prose | ✓ Names competitors; states gap. |
| 4 | Insight prose | Problem | Solution framing prose | ✓ One declarative sentence. |
| 5 | Solution framing prose | Insight | Layer chip widget | ✓ Frames what the widget will demonstrate. |
| 6 | **Layer chip widget** (Loop slot B) | Solution prose | Design Process framing prose | ✓ Framed; not adjacent to another loop. |
| 7 | Design Process framing prose: wireframe fidelity | Layer widget | Wireframe-fidelity loop | ✓ Framing for the loop below. |
| 8 | **Wireframe-fidelity loop** (Loop slot D) | DP framing prose | DP secondary prose (dual CTA) | ✓ Framed; followed by prose, not another loop. |
| 9 | Design Process secondary prose: dual CTA | Wireframe loop | (deep-dive.mp4 OR Pivot section) | ✓ If deep-dive.mp4 kept: framed before it. |
| 9.5 | *(optional)* deep-dive.mp4 | DP secondary prose | Pivot framing prose | ✓ Framed above. Adjacent to wireframe loop above only via intervening prose. |
| 10 | Pivot framing prose | (deep-dive.mp4 or DP secondary prose) | V1 vs V2 slider | ✓ Framing for the slider. |
| 11 | **V1 vs V2 slider** (Loop slot C) | Pivot framing prose | Key Decisions prose | ✓ Framed. User-driven, not autoplay. |
| 12 | Key Decisions prose | Slider | Outcome prose | ✓ Pure prose buffer. |
| 13 | Outcome prose | Key Decisions | (optional static visual) | ✓ |
| 14 | *(optional)* Component Health drawer or Weekly Brief drawer static | Outcome prose | Other Work | ✓ Static end-piece coda. |
| 15 | Other Work cards | Outcome | (footer) | ✓ |

Page totals:
- 1 hero autoplay (ai-fly.mp4)
- 1 body process loop (wireframe-fidelity, Loop slot D)
- 2 user-driven widgets (Layer chip widget, Loop slot B; V1 vs V2 slider, Loop slot C)
- 0-1 supporting body autoplay (deep-dive.mp4 if kept; compare.mp4 cut by default)
- 0-1 static supporting visual (Component Health drawer or Weekly Brief drawer as Outcome coda)

Saturation check: 2-3 motion-bearing autoplays (hero + process loop + optional deep-dive.mp4), plus 2 user-driven interactives. That's under Ghost's 5-cursor-loop ceiling. Pulse is strategy-heavier, so prose carries more weight; that's the right density.

### B.4 Recommended cuts from current page

- **Cut compare.mp4 from Solution.** The compare functionality is already implied by the diagnosis card's "Compare side-by-side" CTA; the existing image-trio (home-task-board + layer-rage + card-broken) currently dramatizes the layer system; the proposed Layer chip widget supersedes both. Keep `compare.mp4` as an asset in case the loop concept changes at the gate.
- **Cut the existing image-trio.** Replaced by the Layer chip widget.
- **Cut the V1 vs V2 diptych.** Replaced by the V1 vs V2 slider.
- **Decision deferred at the gate: keep or cut deep-dive.mp4 in Design Process.** Lean cut if the wireframe-fidelity loop is built; lean keep if the loop is downscoped to prose. The loop and the video both serve "showing the depth" but the loop adds decision-tension while the video is a feature walkthrough.

---

## §1C · Concept candidates per loop slot

Per the case-study guidebook §5 (the process-loop pattern), each slot gets 2-3 concept candidates. Each candidate is graded against the four bars (§1 of the guidebook) and the gesture-signature distinctness rule (§6 + canonical-motion-spec §D.10).

The four bars:
1. **Decision-tension, not motion.** Cursor commits a real judgment.
2. **Distinct thinking-type vs hero AND other body loops on this page.**
3. **Interview-defensible.** Beat traces to a real call Rotem made.
4. **Real product components as subject.** Cursor manipulates ACTUAL Pulse UI.

Hero gesture signature (already shipped, do not change): the ai-fly.mp4 hero is currently a **product-running-on-its-own** sequence (AI is the agent flying the cursor; Rotem is offstage). This is rhetorically the WEAK spot of the hero, BUT it's a hero so the guidebook exempts it from body-demo discipline. It still falls in the **Action execution** gesture-signature family for distinctness purposes.

### Slot A · "The heatmap as interface" body demo (between Insight and Solution)

**Honest recommendation upfront: SKIP this slot.** Make it prose-only.

Rationale: the hero ai-fly.mp4 ALREADY shows the heatmap-as-interface. A body demo here would duplicate the hero's argument and overload the top of the page with motion. Pulse is strategy-heavier than Ghost; prose carries the load here.

For completeness, the candidates I considered:

**Concept A1 · Designer's hot-zone interrogation tour.**
Pitch: cursor visits three hot zones on the wireframe in sequence (KanbanColumn, DatePicker, TaskCard). Each click opens the diagnosis card; cursor dwells; cursor closes. Three components interrogated. Mirror-action close.

- Real decision: "I made hot zones interactive and component-anchored."
- Gesture signature: **Additive build** (#2) or arguably **Action execution** (#1).
- Components: heatmap layer + 3 hot zones + diagnosis card.
- Honesty: real but small; the decision is more architectural than editorial.
- Four-bar grading: Bar 1 weak (the click "opens a card" is closer to a feature tour than a judgment commit). Bar 2 weak (very close to what the hero shows). Bar 3 ok. Bar 4 ok.
- **Verdict: REJECT.** Bar 2 failure. Hero already does this rhetoric.

**Concept A2 · Hot-zone triage with severity rank.**
Pitch: cursor visits 3 hot zones, each click ranks the issue (red / orange / yellow severity dot lands on the friction-zones rail), so the right-rail builds top-3 across the loop.

- Real decision: "I ranked issues by user impact, not chronological detection."
- Gesture signature: **Additive build** (#2).
- Components: heatmap, friction-zones right rail, severity dots.
- Honesty: weak. The friction-zones rail is auto-generated by Pulse, not manually triaged by the designer. The loop would fabricate Rotem-as-triage when it's really Pulse-as-triage.
- **Verdict: REJECT.** Bar 3 failure (interview-defensible). The triage isn't Rotem's judgment; it's Pulse's algorithm.

**Recommendation for Slot A: SKIP.** No loop here. Replace with one tight prose paragraph that frames the heatmap-as-interface insight before the Solution section.

---

### Slot B · Layer chip widget (in The Solution section)

**Recommended: Concept B1 (user-driven Layer chip widget).** Argues the four-layer taxonomy decision. Mechanism is structurally similar to Ghost's View Modes widget; content carries the distinctness.

**Concept B1 · User-driven Layer chip widget.**
Pitch: 4 chips at the top of the demo frame (Friction · Rage Clicks · Dead Clicks · Attention). User clicks a chip → the heatmap layer over the same wireframe morphs via blurCrossfade to the new layer's thermal palette. Default: Friction layer active on mount.

- Real decision: "I picked these four signals and these four palettes."
- Gesture signature: N/A (user-driven widget, not autoplay process loop).
- Components: layer chip toolbar (4 chips), wireframe (any of the 5 pages, suggest Task Board for visual continuity with hero), thermal heatmap overlay.
- Honesty: the four-layer choice is real and editorial. The OKLab claim needs honesty-check (see §1D Q1).
- Four-bar grading: N/A (not a process loop). Body-demo discipline applies: ≤350px height, strip ALL app chrome (no sidebar, no ASK PULSE bar, no friction-zones rail; just chips + wireframe + heatmap), 6-10s if autoplay variant exists OR interactive, first action ≤600ms when autoplayed by default chip mount.
- Distinctness from Ghost View Modes widget: same mechanic (chip click → blurCrossfade between view states), different content category (layer/palette swap vs design-vs-production comparison). The visitor reading Pulse after Ghost may notice; reading Pulse first will not.
- **Verdict: RECOMMEND.**

**Concept B2 · Cursor-as-designer additive layer build.**
Pitch: empty wireframe (no heatmap). Cursor visits each of 4 layer chips in sequence; each click paints that layer's heatmap over the wireframe. After 4 clicks, all 4 layers are toggled on simultaneously, revealing the composite OKLab-blended map. Mirror-action: cursor strips layers in reverse.

- Real decision: "I picked these four signals AND I designed them to compose, not exclude."
- Gesture signature: **Additive build** (#2). Distinct from Ghost DP-B (which builds a severity vocabulary on a legend) by surface (wireframe heatmap vs legend list).
- Honesty: defensible. The compose-vs-exclude question is a real editorial call.
- Four-bar grading: Bar 1 ok; Bar 2 ok (different from hero AND different from any Ghost loop); Bar 3 ok; Bar 4 ok.
- Trade-off vs B1: B2 is a process loop with the cursor as agent; B1 is a user-driven widget. B2 carries more rhetorical weight ("here's the designer choosing the layer system") but adds a third cursor-driven autoplay to a strategy-heavy case study. B1 is the lighter footprint.
- **Verdict: RUNNER-UP.** Pick B2 if the gate decision is "Pulse should match Ghost's loop count and density." Pick B1 (recommended) if "Pulse is strategy-heavy and density should sit lower."

**Concept B3 · Layer-by-layer guided tour (rejected).**
Cursor visits each chip, each layer surfaces different content (specific hot zones light up per layer). Argues "each layer is a different UX truth."

- Gesture signature: closer to a **feature tour with a cursor attached** than a real decision. Bar 1 weak.
- **Verdict: REJECT.** Feature-tour pattern.

---

### Slot C · V1 vs V2 slider (in The Pivot section)

**Recommended: Concept C1 (user-driven slider).** Cleanly replaces the current diptych. Same artifacts (V1 + V2), more interactive composition.

**Concept C1 · V1 vs V2 comparison slider.**
Pitch: full-width comparison frame. Left: V1 Calm Command Center (the existing screenshot). Right: V2 Living Observatory (the existing Task Board screenshot). User drags slider to reveal the divergence. Default rest position 50%.

- Real decision: "I scrapped V1 and rebuilt." THE pivot.
- Gesture signature: N/A (user-driven slider, mechanically identical to Ghost's slider on Beat 2). Same mechanic, different content.
- Components: V1 screenshot + V2 screenshot. Both exist as artifacts. No new design work.
- Honesty: the V1 and V2 versions are both real and shippable as-is.
- Distinctness from Ghost slider: same mechanic, different content category (V1 reject vs V2 ship; comparison is design-history rather than design-vs-production). Reading Pulse after Ghost: the visitor will notice the slider pattern repeated. Reading Pulse first: it lands cleanly.
- Trade-off: reusing a Ghost mechanic is a calculated cost. The V1→V2 moment is THE highest-stakes editorial moment on the Pulse page; a slider lets the viewer DO the comparison rather than read it as a static diptych. Worth the mechanic reuse.
- **Verdict: RECOMMEND.**

**Concept C2 · Subtractive V1 burn-down.**
Pitch: V1 full layout in frame. Cursor visits 4 V1 elements that need to die: dark-mode chrome, sidebar nav, health ring, severity pills. Each click fades that element. As the last element dies, the V2 layout fades in beneath.

- Real decision: "I scrapped V1 element by element until V2 was what was left."
- Gesture signature: **Subtractive whole-element fade** (#3). Shares with Ghost OC-E; distinct surface (full-UI burn-down vs 21-component triage).
- Honesty: dramatic. The narrative ("I deleted 4 specific V1 elements deliberately") is closer to performance than process; the real V1→V2 transition was almost certainly more like "I rebuilt from scratch on a new branch" than "I subtracted 4 elements."
- Four-bar grading: Bar 1 ok in concept; Bar 3 weak (the 4-element subtraction is partially fabricated).
- Trade-off vs C1: C2 is dramatic and rhetorically rich. C1 is honest and lets the viewer drive.
- **Verdict: RUNNER-UP.** Considered only if the gate prefers higher drama and Rotem confirms a 4-element subtractive narrative is interview-defensible.

**Concept C3 · Naming pivot (rejected).**
Cursor edits "Page X-Ray" to "Living Observatory". One beat.

- Honesty: too small to earn a loop. Prose handles this.
- **Verdict: REJECT.**

---

### Slot D · Wireframe-fidelity build (in Design Process)

**Recommended: Concept D1 (cursor-as-designer wireframe-fidelity additive build).** The standout new process loop for Pulse. Dramatizes a category of designer judgment Ghost doesn't show: content fidelity in wireframe rendering.

**Concept D1 · Wireframe fidelity additive build.**
Pitch: wireframe canvas mounted with V1-style abstractions (gray bars for column headers, gray bars for task titles, no assignee initials). Cursor visits 4 elements in sequence:
1. Click column header → bar becomes "BACKLOG · 7"
2. Click first task card → bar becomes "Refactor authentication flow"
3. Click second task card → bar becomes "Update onboarding copy"
4. Click assignee zone → empty circles fill with "FE", "EL"

After the 4 clicks, the wireframe reads as the V2 stylized-but-real render. Mirror-action: cursor strips each in reverse for the loop seam.

- Real decision: "I shifted from blueprint to stylized-but-real because the heatmap stopped reading as decorative once the content felt real."
- Gesture signature: **Additive build** (#2). Distinctness from Ghost DP-B: DP-B builds a vocabulary list (severity legend rows); D1 builds wireframe content fidelity (text content in cells). Same signature, different surface, different cognitive activity (vocabulary definition vs content design).
- Components: wireframe (Task Board view), column headers, task title bars, assignee initials zones.
- Honesty: very defensible. Real call. The V2 screenshots show the result of this shift; the V1 screenshot shows the before; the interview question "what's the difference between V1 and V2 wireframes?" has a clean answer.
- Four-bar grading: Bar 1 strong (each click commits a content choice); Bar 2 strong (different cognitive activity from anything on Ghost OR the hero); Bar 3 strong; Bar 4 strong (real Pulse wireframe).
- Polyrhythmic dwell candidates: decisive (300ms) on first column header → questioning (350ms) on first task title (the cognitive heart of the decision) → recognising-pattern (280ms) on second task title → edge-case-recheck (320ms) on assignee circle (the smallest commitment).
- **Verdict: STRONG RECOMMEND.** Highest editorial value of any candidate in this sprint.

**Concept D2 · Dual CTA decision build.**
Pitch: diagnosis card mounted with one CTA button: "Show me the fix". Cursor clicks → routes to deep-dive page preview (small frame inset). Cursor returns. Cursor visits the card again, ADDS the second CTA: "Apply fix here". Cursor clicks the new CTA → triggers in-place morph preview. Mirror-action close.

- Real decision: "I built both, then realized the right answer was both."
- Gesture signature: **Action execution** (#1) twice; shares category with hero. Bar 2 risk.
- Components: diagnosis card, deep-dive route, in-place morph.
- Honesty: defensible; the decision is real.
- Trade-off: shares signature with hero. Possible to distinguish on surface (card vs canvas) and on rhythm (two-action vs one), but feels like a stretch.
- **Verdict: RUNNER-UP.** Consider if D1 is rejected at the gate.

**Concept D3 · The "what NOT to build" strike-through.**
Pitch: a list of 4 candidate features mounted (Predictive heatmaps · Mobile responsive · Real Figma integration · [TBD 4th]). Cursor strikes through 3 of them. The 4th stays standing.

- Real decision: "Restraint is the design."
- Gesture signature: **Pointwise property-level edit** (#4). Distinctness from Ghost K-A: different surface (feature list vs deviation rows).
- Honesty: weak. Only 3 exclusions are named in current prose. A 4th candidate would have to be fabricated. The loop would also imply "I considered building these and decided not to" when the real process may have been "these were never on the table."
- **Verdict: REJECT.** Bar 3 failure.

---

### C.5 Distinctness audit across all recommended elements

Per the gesture-signature distinctness rule, when a page has 2+ process loops, each must read as a categorically different design activity. Pulse's recommended set:

| Element | Type | Gesture signature | Cognitive activity | Cursor as |
|---|---|---|---|---|
| Hero (ai-fly.mp4, existing) | Autoplay | Action execution (#1) | "Watch AI find the fix" | AI agent |
| Layer chip widget (Slot B / B1) | User-driven | N/A | "Compare four UX signals" | User's hand |
| Wireframe-fidelity loop (Slot D / D1) | Autoplay | Additive build (#2) | "Watch the designer commit to content fidelity" | Designer |
| V1 vs V2 slider (Slot C / C1) | User-driven | N/A | "See the pivot for yourself" | User's hand |

Distinctness check:
- One autoplay process loop (D1) on the page besides the hero. Hero is Action execution (#1); D1 is Additive build (#2). No signature collision.
- Two user-driven widgets (B1 chip toolbar; C1 slider). Different mechanics, different content categories. No collision.
- Each motion element argues a categorically different thing:
  - Hero: "Pulse can answer 'show me the fix' in one click via AI."
  - Layer widget: "Pulse sees four UX signals, not one."
  - Wireframe-fidelity loop: "I designed the wireframes with content fidelity intentionally."
  - V1 vs V2 slider: "I scrapped V1 and rebuilt."

The set passes the four-bar gate and the distinctness audit. Total: 4 motion-bearing elements (hero + 1 process loop + 2 widgets). Below the Ghost saturation ceiling. Right density for strategy-heavy case study.

---

## §1D · Open questions for Rotem (resolve at the gate)

Sprint 2 cannot proceed until these are answered. Each question maps to a load-bearing claim in either the proposed prose or the proposed loops.

**Q1 · OKLab-interpolated thermal palette.** Current prose names "OKLab-interpolated thermal palette" as a specific technical choice. Is this the actual implementation? If yes, Sprint 2 surfaces it explicitly in the Layer-widget framing prose (high-credibility technical signal). If no, the line gets rewritten as "a thermal palette per layer" without the technical specificity.

**Q2 · Component severity vocabulary cross-project.** The red / orange / yellow severity dot system is visible across Pulse's diagnosis cards, components drawer, and friction-zones rail. Ghost uses the identical system (Breaking / Critical / Minor / Resolved → red / orange / yellow / green) and Ghost's K-A and DP-B loops dramatize the severity vocabulary as Ghost-originated decisions. Two questions:
- (a) Did Pulse's severity vocabulary precede Ghost's, or vice versa?
- (b) Whichever project came second, what's the honest framing? ("Reused the system I built for [Other]" or "the system was developed in parallel" or "Pulse adopted Ghost's vocabulary intentionally because consistent severity language across products is the point.")

The answer affects what each case study can claim about the vocabulary. Sprint 2 needs the answer before drafting any prose that touches severity.

**Q3 · Procedural wireframe rendering.** Current prose claims "procedural SVG wireframes" rendered in code. Is there actual SVG-rendering code (a component that takes data and outputs a wireframe)? If yes, surface it in the wireframe-fidelity loop's framing prose. If no, the line gets rewritten.

**Q4 · Component count honesty.** Current prose says "32 components tracked". Component Health drawer screenshot says "10 components marked across 5 pages". What's the honest count? Suggested replacement: "Ten components surfaced, each with instance count and trend, across five pages." Confirm.

**Q5 · Issue count honesty.** Current prose says "17 issues across five pages". Friction-zones rail surfaces top-3 per page (15 total visible). What's the honest count?

**Q6 · Wireframe count honesty.** Current prose says "six procedural wireframes". Page chip toolbar shows five (Task Board, Onboarding, Settings, Dashboard, Project View). Where's the 6th? Suggested replacement: "Five procedural wireframes" unless the 6th can be sourced.

**Q7 · Build phases / focused-day claim.** Current prose says "Twelve build phases on a single branch in a focused day". This is unverifiable from artifacts. Keep, trim, or replace with a verifiable detail?

**Q8 · 60fps custom canvas renderer.** Current prose says "custom canvas-based heatmap renderer at 60fps". Is this the actual implementation? If yes, surface it. If no, soften.

**Q9 · Live prototype shipability.** Current page links to `pulse.rotemgotlieb.com` with a "coming soon" caption. Will it ship in time for the relaunch? Affects the Outcome section's framing.

**Q10 · Dual CTA decision honesty.** Current prose says "the dual pattern only emerged after building both versions". Was this a real "I built both then merged" process, or a post-hoc rationalization? Affects whether the dual-CTA story belongs as a real Design Process decision (current placement) or as a smaller editorial note.

**Q11 · Wireframe-fidelity timing.** The wireframe-fidelity loop (D1) dramatizes the shift from blueprint abstractions to stylized-but-real content. Was this a single deliberate decision (e.g., "I sat down on day 8 and rebuilt the wireframes with real content") or did fidelity creep in incrementally over many work sessions? If incremental, D1 fabricates intentionality the process didn't have. If deliberate, D1 is honest. Confirm.

**Q12 · Section order: Pivot before or after Design Process?** Current order is Pivot → Design Process. Proposed reorder is Design Process → Pivot, placing the V1→V2 pivot at the apex of the process arc before Outcome. Or: keep current order (Pivot earlier so V1 is established before V2's process pivots get discussed). Both are defensible. Pick.

**Q13 · Cut compare.mp4 and the existing image-trio?** Proposed plan replaces both with the Layer chip widget. Confirm cut.

**Q14 · Keep or cut deep-dive.mp4 in Design Process?** If the wireframe-fidelity loop ships, deep-dive.mp4 risks redundancy. If the loop doesn't ship, deep-dive.mp4 is the Design Process visual. Pick.

**Q15 · Replace the V1 vs V2 diptych with the slider?** Proposed plan replaces. Confirm cut diptych.

**Q16 · Body demo height for the Layer chip widget and the wireframe-fidelity loop.** Per Body-demo discipline (§7 CLAUDE.md), 300-350px. Pulse's canvas content is denser than Ghost's deviation rows; 330px may need to be tested at design time and possibly stretched to 350. Flag for Sprint 2 design phase.

**Q17 · Outcome section visual coda.** Recommended optional static end-piece (Component Health drawer OR Weekly Brief drawer) as the "the canvas isn't the only surface" coda. Pick one, or skip both.

---

## §1E · What Sprint 2 will produce (preview)

Assuming concept approval at the gate:

**Sprint 2 deliverable:** `.claude/sprint-reports/2026-05-29-pulse-sprint-2-design.md`.

**Sprint 2 scope:**

1. **Full prose rewrite section by section**, applying the spine from §1B and resolving every honesty flag from §1D. Banned-word audit and em-dash audit baked in.

2. **Beat-by-beat choreography for the wireframe-fidelity loop (D1)** with absolute T-stamps. Polyrhythmic dwell assignments. clickStamp at every commit. Mirror-action seam. resetAllState() at iteration boundary. Reduced-motion path. Mobile plan.

3. **Markup + state design for the Layer chip widget (B1)**: 4 chips, blurCrossfade between layer states over the wireframe substrate, ARIA tablist treatment, keyboard nav, reduced-motion path, mobile plan. Pattern reuses Ghost's View Modes widget with content swap.

4. **Markup + state design for the V1 vs V2 slider (C1)**: full-width frame, draggable slider, default rest 50%, momentum handling, ARIA labels, mobile breakpoint behavior. Pattern reuses Ghost's Beat 2 slider.

5. **Distinctness table** comparing Pulse's loop set against itself AND against Ghost's loops (to make the inter-page distinctness audit-able by anyone reviewing the portfolio holistically).

6. **Visual consistency checklist**: chrome treatment, color tokens (the paper-on-cream palette already in styles.css), typography (Satoshi). The Pulse loops should feel visually continuous with Ghost's; engine primitives reused verbatim.

7. **Risk surface**: every concept's "what could fail" honestly named. Particularly: Layer chip widget's mechanism overlap with Ghost View Modes; V1 vs V2 slider's mechanism overlap with Ghost Beat 2 slider. Both are accepted costs unless Sprint 2 design surfaces a way to differentiate.

8. **End-of-Sprint-2 concept gate**: AskUserQuestion on any remaining ambiguity before Sprint 3 build begins.

**Sprint 3 scope (preview):** pre-phase backup; build the wireframe-fidelity loop module, the Layer chip widget module, the slider markup; CSS additions for each demo; integrate into work/pulse.html; cache-bust lockstep across all 11 HTML files; planned-vs-implemented T-stamp table at end-of-phase; visual review.

---

## Gate

Sprint 1 ends here. Sprint 2 does not begin until the AskUserQuestion gate below is resolved.

Three approvals needed:
1. **Narrative spine** (§1B): approve the proposed section structure, or specify which sections need adjustment.
2. **Concept selections** (§1C): approve the recommended candidates (Slot A skip; Slot B B1; Slot C C1; Slot D D1), or pick alternates.
3. **Open questions** (§1D): answer Q1-Q17.

The gate question follows.

---

## §1F · Gate resolution (2026-05-28)

Rotem resolved all gates across four AskUserQuestion rounds. Sprint 2 is cleared to write the design doc. The full resolved set, baked in for Sprint 2:

### Narrative spine

- **Approved with one adjustment.** Section order keeps the current page's ordering: Pivot → Design Process (not the proposed reorder). The V1 → V2 pivot is established BEFORE Design Process so V1 is the known precursor when the in-V2 process pivots get discussed.

### Concept selections (final per slot)

| Slot | Resolution | Note |
|---|---|---|
| Hero | Existing ai-fly.mp4 kept | No change |
| A (between Insight and Solution) | **SKIP** | Prose-only. Hero already carries the heatmap-as-interface rhetoric. |
| B (Solution) | **B1: user-driven Layer chip widget** | Argues the four-layer taxonomy and OKLab palette decision |
| C (Pivot) | **C1: V1 vs V2 user-driven slider** | Replaces current diptych |
| D first (Design Process) | **D1: wireframe-fidelity additive build loop** | Confirmed deliberate, one moment of rebuild (Q11). Honesty bar passes. |
| D second (Design Process) | **Diagnosis-card-to-deep-dive routing decision** (prose only) | Replaces dual-CTA as the second DP decision. The visual that goes with it is the existing deep-dive.mp4 (kept). |

Total motion-bearing elements on the rebuilt page: 1 hero autoplay + 1 process loop + 2 user-driven widgets + 1 body autoplay (deep-dive.mp4). Below Ghost saturation ceiling.

### Honesty resolutions (Q1 through Q17)

| Q | Resolution | Sprint 2 action |
|---|---|---|
| Q1 OKLab thermal palette | **Real implementation** | Surface explicitly in Layer-widget framing prose as a credibility signal |
| Q2 Severity vocabulary cross-project | **Parallel / shared system** | Name as Rotem's cross-product system decision; Pulse and Ghost share the vocabulary intentionally |
| Q3 Procedural SVG rendering | **Real procedural SVG** | Surface explicitly as design-engineering credibility signal |
| Q4 "32 components tracked" | **Keep as-is** | Verifiable in interview |
| Q5 "17 issues" | **Soften to "15 issues"** | 3 friction zones × 5 pages |
| Q6 "Six wireframes" | **Soften to "five wireframes"** | Page chip toolbar confirms 5 |
| Q7 "Twelve build phases on a single branch in a focused day" | **Cut / soften** | Not selected as defensible. Sprint 2 removes the phrase or rewrites without the count. |
| Q8 "60fps custom canvas-based heatmap renderer" | **Keep** | Real and defensible engineering claim |
| Q9 pulse.rotemgotlieb.com live prototype | **Stays "coming soon"** | Sprint 2 prose calibrates Outcome to not-yet-live state |
| Q10 "Dual pattern only emerged after building both versions" | **CUT entirely** | Dropped at Sprint 2 kickoff (2026-05-28). Reason: cut at the gate for honesty; reintroducing anywhere relitigates the same problem. Dual-CTA framing does NOT appear in Outcome, Key Decisions, or anywhere else in the rebuilt page. |
| Q11 Wireframe-fidelity decision timing | **Deliberate, one moment of rebuild** | D1 is honest. Full speed. |
| Q12 Section order | **Keep current (Pivot → DP)** | Sprint 2 uses current ordering |
| Q13 Cut compare.mp4 | **CUT** | Removed from Solution |
| Q14 Cut deep-dive.mp4 | **KEEP** | Survives as the visual for the diagnosis-to-deep-dive routing decision in DP |
| Q15 Cut V1 vs V2 diptych | **CUT** | Replaced by C1 slider |
| Q16 Body demo height for B1 and D1 | **Deferred to Sprint 2 design** | Pulse canvas density may push toward 350px ceiling; Sprint 2 designs and tests |
| Q17 Outcome coda | **Skip the coda** | No supporting static at Outcome; closes on prose |

### Final spine, baked in

1. **Hero** : existing ai-fly.mp4 + caption (≤15 words)
2. **Overview** : prose only, 3 sentences max, competitor list moved to Problem
3. **The Problem** : lifted-in competitor list (Hotjar / FullStory / Contentsquare disqualified one sentence each) + concrete WCAG 1.4.3 example
4. **The Insight** : prose only, current wording kept
5. **The Solution: Living Observatory** : framing prose surfaces OKLab thermal palette (Q1 real) + procedural SVG rendering (Q3 real) + cross-product severity vocabulary (Q2 parallel/shared) + **Layer chip widget (B1)**
6. **The Pivot** : framing prose ("not bad, but not interesting" trigger; V1 was competent and forgettable) + **V1 vs V2 slider (C1)**
7. **Design Process** : two decisions
   - 7a. Wireframe fidelity : framing prose (deliberate rebuild moment) + **wireframe-fidelity loop (D1)**
   - 7b. Diagnosis-card-to-deep-dive routing : framing prose ("when depth becomes the subject, depth deserves its own surface") + **existing deep-dive.mp4**
8. **Key Decisions** : prose only, three named exclusions (predictive heatmaps / mobile / real Figma integration) + restraint framing
9. **Outcome** : trimmed prose, no coda, no live link yet. Counts: 15 issues, 5 wireframes, 32 components, 4 layers, 10 components surfaced. Kept claims: 60fps custom renderer. Dropped claims (entirely, NOT relegated to small notes anywhere): "12 build phases in a focused day", "dual pattern emerged after building both". "I'd mock the most ambitious interaction first, not the most conventional one" reflection kept.
10. **Other Work** : unchanged

Sprint 2 begins from this resolved spine. Deliverable will be `.claude/sprint-reports/2026-05-29-pulse-sprint-2-design.md`.
