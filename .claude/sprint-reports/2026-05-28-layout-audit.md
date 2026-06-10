# Ghost Layout Audit — element-by-element walkthrough + composition fixes

**Date:** 2026-05-28
**Trigger:** post-overnight-sprint review surfaced composition issues: prose ended up on the wrong side of its visual, two looping visuals stacked with no framing prose between them, K-A markers reading as confusing. Plus a long-standing carousel seam discontinuity not solved by the +20% speed bump.
**Scope:** deep element-by-element audit of the current case study order; identify every composition issue; propose corrected element order WITHIN the locked section sequence; diagnose the carousel seam at root; draft K-A description replacements.
**Gate:** Phase 1 ends with findings + proposed fixes presented via AskUserQuestion. No code moves until approval.

---

## Section 1 — Element-by-element walkthrough (current order, top to bottom)

Each entry: what it is + what it communicates + neighbors + composition verdict.

### Top of page (locked, untouched)

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 0 | Hero AI Fix Flow demo | Cursor-driven autoplay loop — shows the AI Fix Flow execution end-to-end. **Locked r2.6**, do not move. | (page top) | Case title + metadata | ✓ Correct |

### Section block 1: framing prose

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 1 | Case title `<h1>` + metadata grid | "Ghost — Design System Reality Scanner" + Context/Role/Timeline/Tools | Hero | Overview prose | ✓ |
| 2 | **Overview prose** (`<section id="overview">`) | Defines Ghost. Mentions "signature interaction is a comparison slider." LexisNexis origin story. | metadata | Problem prose | ✓ |
| 3 | **The Problem prose** (`<section id="the-problem">`) | The gap nobody else solves. Names competitors (Chromatic, Percy, Applitools). | Overview | Slider demo | ✓ |

### Section block 2: slider — **COMPOSITION ISSUE A**

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 4 | **Comparison slider demo** (`.demo-frame` wrapping `.ghost-slider`) | The case study's signature interaction. User drags handle; right side reveals 5 annotated drift callouts. | Problem prose | Slider caption | ✓ position but missing setup |
| 5 | Slider caption "Drag right to reveal production drift. Annotations name what changed." | One-line takeaway. | Slider | Insight prose | ✓ caption |
| 6 | **The Insight prose** (`<section id="the-insight">`) | "The comparison slider became the centerpiece because it mirrors how designers check work…" — past-tense reflective, **NARRATES the slider after it's been shown.** | Slider caption | Solution prose | ✗ **PROBLEM** |
| 7 | **The Solution prose** (`<section id="the-solution">`) | Two bolded sub-claims. First: "The Comparison Slider shows design spec against production reality." — **NARRATES the slider above.** Second: "The AI Fix Flow closes the loop." — references the hero. | Insight | Design Process prose | ✗ **PROBLEM** (first sub-claim narrates slider) |

**Issue A diagnosis:** the slider sits BEFORE its introducing prose. Insight reflects on the slider after showing it; Solution describes what the slider does after showing it. Inverted from the canonical pattern (prose introduces, then demo shows).

### Section block 3: Design Process + DP-B

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 8 | **Design Process prose** (`<section id="design-process">`) | Three pivots (slider promotion / dashboard→workspace / detection→remediation). | Solution | DP-B widget | ✓ Correct (frames DP-B) |
| 9 | **DP-B "Severity Vocabulary Build" demo** (`.sb-widget`) | Cursor-driven autoplay loop — additive build of severity legend. | Design Process prose | DP-B caption | ✓ |
| 10 | DP-B caption "Defining Ghost's severity language — breaking, critical, minor." | Takeaway. | DP-B widget | (HTML comment) → drift detection demo | ✓ caption |

### Section block 4: drift detection — **COMPOSITION ISSUE B**

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 11 | **Drift detection demo** (`.dd-widget`) | Token-row carousel scrolling continuously; a token center-flags and a popup explains the drift. Body-demo style. | DP-B caption | DD caption | ✗ **PROBLEM — no framing prose; two loops adjacent** |
| 12 | DD caption "Token-level drift surfaces what visual review misses." | Takeaway. | DD widget | "Four view modes" section | ✓ caption |

**Issue B diagnosis:** DP-B and drift detection are two looping visuals stacked back-to-back with only a caption between them. No prose framing the drift detection demo. The Benji rhythm rule (alternate text + visual; every loop gets a framing line before it) is violated.

### Section block 5: four view modes + view modes demo

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 13 | **"Four view modes" prose** (`<section class="case-section">`) | Names the four modes + WCAG + component health tracking. | DD caption | VM widget | ✓ Correct (frames VM) |
| 14 | **View modes demo** (`.vm-widget`) | User-driven interactive chip toolbar. | "Four view modes" prose | VM caption | ✓ |
| 15 | VM caption "Click any chip to compare design against production." | Takeaway. | VM widget | Key Decisions prose | ✓ |

### Section block 6: Key Decisions + K-A — **COMPOSITION ISSUE C**

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 16 | **Key Decisions prose** (`<section id="key-decisions">`) | Typography stack + color restraint + tone (clinical / not blame). | VM caption | K-A widget | ✓ frames K-A |
| 17 | **K-A "Editorial Strip" demo** (`.kd-widget`) | Cursor-driven autoplay loop — strips text color from 4 deviation labels; severity dots hold; **4 numbered markers (red/orange/orange/yellow) appear per strip.** | Key Decisions prose | K-A caption | ✗ **markers confusing per user feedback** |
| 18 | K-A caption "Restraint — color where it carries meaning." | Takeaway. | K-A widget | Outcome prose | ✓ |

**Issue C diagnosis:** the 4 numbered markers added in the overnight sprint don't communicate the decision the loop dramatizes. Per user feedback they read as confusing. Replace with a short framing line ABOVE the loop that makes the decision legible.

### Section block 7: Outcome + OC-E

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 19 | **Outcome prose** (`<section id="outcome">`) | Three paragraphs — prototype with mock data + market scan; "What I'd do differently"; "Built with" stack. | K-A caption | OC-E widget | ✓ frames OC-E |
| 20 | **OC-E "Critical Three" demo** (`.ct-widget`) | Cursor-driven autoplay loop — triages 21 cards → marks 3 critical → 18 fade. | Outcome prose | OC-E caption | ✓ |
| 21 | OC-E caption "Triage — three of twenty-one need attention." | Takeaway. | OC-E widget | Other Work | ✓ |

### Footer

| # | Element | What it is / communicates | Above | Below | Verdict |
|---|---------|---------------------------|-------|-------|---------|
| 22 | Other Work grid (2 cards: LexisNexis + Pulse) | Cross-project navigation. | OC-E caption | Footer | ✓ |

---

## Section 2 — Composition issues found (summary)

| # | Issue | Severity | Root cause |
|---|-------|----------|-----------|
| A | Insight + Solution sit AFTER slider, prose narrates the demo retrospectively | HIGH | Pre-existing structural inversion — slider was shown before its introducing prose. The overnight reorder didn't touch this; it's been wrong since the case study was first built. |
| B | DP-B → drift detection stacked back-to-back (two loops, no framing prose between) | HIGH | The overnight reorder moved Design Process + DP-B up; now they sit immediately above the drift detection demo with only DP-B's caption between them. No prose introduces drift detection. |
| C | K-A 4 numbered markers (added overnight) read as confusing | MEDIUM | Markers were added overnight to record per-strip editorial decisions. User feedback: they don't communicate; the dot-holding + text-stripping IS the communication. Markers crowd the canvas. |
| D | Drift detection carousel seam visibly skips at loop boundary | TECHNICAL | Layout math: `.dd-widget-row` uses `gap: 12px` between flex children + `padding: 0 20px` on the row. Together these create a 6–14px positional mismatch when CSS animation translates by -50%. Detailed math in §4. |

---

## Section 3 — Proposed composition fix

**Constraint from the brief:** "Section-level order stays as the overnight sprint set it unless a stronger option is explicitly proposed and approved at the gate."

The fix below requires ONE small section-level move (Insight section moves up; everything else stays). This is the smallest change that resolves Issue A without rewriting prose extensively. Explicitly surfacing for gate approval.

### Proposed new element order

| # | Element | Change from current |
|---|---------|---------------------|
| 0 | Hero | unchanged (locked) |
| 1 | Case title + metadata | unchanged |
| 2 | Overview prose | unchanged |
| 3 | Problem prose | unchanged |
| 4 | **Insight prose** ← MOVED from position 6 | **MOVE** |
| 5 | Slider demo | unchanged content; now PRECEDED by Insight |
| 6 | Slider caption | unchanged |
| 7 | **Solution prose** (rewrite first sentence — see §3.1) | content tweak |
| 8 | Design Process prose | unchanged |
| 9 | DP-B demo | unchanged |
| 10 | DP-B caption | unchanged |
| 11 | **NEW framing prose section: "Detection runs at the token level"** | **NEW BLOCK** between DP-B caption and drift detection demo |
| 12 | Drift detection demo | unchanged content; now PRECEDED by new framing prose |
| 13 | DD caption | unchanged |
| 14 | "Four view modes" prose | unchanged |
| 15 | View modes demo | unchanged |
| 16 | VM caption | unchanged |
| 17 | Key Decisions prose | unchanged |
| 18 | **NEW framing line above K-A** | **NEW** between Key Decisions section close and K-A widget |
| 19 | K-A demo | **REMOVE 4 numbered markers** (Marker import + array + appear/disappear calls all removed) |
| 20 | K-A caption (shortened or kept depending on framing-line choice) | content tweak |
| 21 | Outcome prose | unchanged |
| 22 | OC-E demo | unchanged |
| 23 | OC-E caption | unchanged |
| 24 | Other Work | unchanged |

### 3.1 Solution prose rewrite (so it doesn't narrate the slider above)

**Current Solution prose** (after slider, narrates):
> **The Comparison Slider** shows design spec against production reality. Deviation markers overlay the production side — red for breaking changes, amber for drift, blue for undocumented variants. Each marker carries the exact delta: 'Expected: padding 16px. Found: padding 12px. Off by 4.'
>
> **The AI Fix Flow closes the loop.** Detection, diagnosis, and remediation in a single workflow. No competitor offers this.

**Proposed rewrite** (after slider, summarizes without re-narrating):
> **Deviation markers carry the diagnosis.** Red for breaking, amber for drift, blue for undocumented variants. Each marker shows the exact delta — 'Expected: padding 16px. Found: padding 12px. Off by 4.'
>
> **The AI Fix Flow closes the loop.** Detection, diagnosis, and remediation in a single workflow. No competitor offers this.

The first sub-claim now leads with "Deviation markers carry the diagnosis" — a system-level claim about the marker taxonomy. No reference to "The Comparison Slider shows..." which was the narration. Same information; reframed to add value rather than restate.

### 3.2 New framing section between DP-B and drift detection

Inserted BETWEEN line 552 (DP-B caption) and line 553 (HTML comment for drift detection demo):

```html
<section class="case-section reveal">
  <h2>Detection runs at the token level.</h2>
  <p>Drift starts where designers don't look — at the token. Ghost scans every component on every push, surfacing the deviation before it ever ships.</p>
</section>
```

Two sentences. Matches the established `<section class="case-section">` + `<h2>` + `<p>` pattern used by Design Process, Key Decisions, Outcome, and "Four view modes." Provides framing prose for the drift detection demo; resolves the two-loops-adjacent rhythm violation.

### 3.3 New framing line above K-A + caption decision

Three options drafted. I recommend Option 1.

| Option | Text | Notes |
|--------|------|-------|
| **1 ★ recommend** | **"I keep color on what carries meaning. Severity dots hold the drift signal; text labels don't, so they go neutral."** | First-person, plain, names BOTH categories + the reason. ~22 words. Voice matches Design Process pivots' "I rebuilt the dashboard…" + "I added the AI Fix Flow." |
| 2 | "Color in Ghost lives on the severity dots — they carry the signal. Text labels stay neutral; the dot already says it." | Third-person, factual. Slightly more abstract. |
| 3 | "Severity dots earn color: they carry the drift signal. Text labels don't, so the cursor strips them to neutral." | Parallel structure. Mentions the cursor (animation-narration risk — viewer SEES this; prose doesn't need to). |

**Placement:** between the Key Decisions section close (line 689) and the K-A widget (line 706). Same structural position as the "Detection runs at the token level" insert. Wrapped in `<section class="case-section">` with an H2 + p, or as a simpler bolded lead paragraph — pick at gate.

Two structural sub-options:

| Sub-option | Structure | Reasoning |
|------------|-----------|-----------|
| 3.A ★ | New `<section class="case-section">` with H2 "Color where it carries meaning." + Option 1 prose | Matches Detection-runs-at-token-level insert pattern; consistent rhythm |
| 3.B | Standalone `<p class="demo-frame-lead">` paragraph (no section, no H2) | Lighter; relies on Key Decisions prose above as the section frame |

I recommend **3.A** for consistency with the new drift-detection framing.

**Caption decision:** with the new framing line above, the existing caption "Restraint — color where it carries meaning." becomes redundant. **Recommended: shorten the caption to a single word — "Restraint."** — preserves the page-wide demo→caption pattern without repeating the framing line.

If gate prefers no caption, drop it entirely. K-A becomes the only demo without a caption — minor inconsistency, acceptable if the framing line is doing the work.

---

## Section 4 — Carousel seam diagnosis + fix

### 4.1 Diagnosis (root cause, not speed)

**Carousel structure** at the time of audit:
- `.dd-widget-row`: `display: flex; gap: 12px; padding: 0 20px;`
- Contains 16 tokens: 8 originals (data-token-index 0–7) + 8 clones (data-token-clone 0–7) in the same order.
- CSS animation `dd-widget-scroll`: `from { translateX(0) } to { translateX(-50%) }`, 13.04s linear infinite.

For a TRULY seamless 50% wrap, the second half (tokens 8–15) must be positioned exactly where the first half (tokens 0–7) started. Translating -50% of the row's width should land Token 8 at the position Token 0 started.

**The math.** Assume tokenW is the average token width. With `gap: 12px` between 16 flex children (15 internal gaps) AND `padding: 0 20px` (40px total) on the row:

- Row width W = 20 (left padding) + 16·tokenW + 15·12 (internal gaps) + 20 (right padding) = 220 + 16·tokenW
- Token 0 position (left edge) = 20 (after left padding)
- Token 8 position (left edge) = 20 + 8·tokenW + 8·12 = 116 + 8·tokenW
- 50% of W = 110 + 8·tokenW

After translating by -(110 + 8·tokenW):
- Token 8's new position = (116 + 8·tokenW) − (110 + 8·tokenW) = **6**
- Token 0 was at position **20** at start.
- Mismatch: **14 pixels** — visible jump at seam.

Removing the padding alone doesn't fix it. With padding = 0 and gap = 12:
- Row width = 16·tokenW + 15·12 = 16·tokenW + 180
- Token 8 = 8·tokenW + 96
- 50% of W = 8·tokenW + 90
- After translation: Token 8 = 6
- Mismatch: **6 pixels** (= half a gap).

**Why half a gap?** The row has 16 items and 15 gaps. Each half (8 tokens) contains 7 internal gaps. The ONE gap connecting Token 7 → Token 8 is "between halves" — it's shared, not duplicated. Translating -50% bisects the row width, but that bisection lands 6px (= half of 12) off where Token 0 was.

### 4.2 The fix (real continuous-state, not a speed change)

**Switch from `gap: 12px` to `margin-right: 12px` on each token.** This gives EACH token a trailing margin (instead of sharing gaps between pairs). The row's structure becomes:

T0 [12px margin] T1 [12px margin] … T15 [12px margin]

- Each half (8 tokens) now contains 8 complete "token + trailing margin" units = 8·(tokenW + 12) wide
- Row total = 16·(tokenW + 12)
- 50% of row = 8·(tokenW + 12) = 8·tokenW + 96
- Token 8 at start position = 8·(tokenW + 12) = 8·tokenW + 96
- After -50% translation, Token 8 lands at position 0 = exactly where Token 0 started ✓

**Plus remove the row's `padding: 0 20px`** — the strip's existing `::before` and `::after` linear-gradient fades (80px wide each) already handle visual edge softening. Removing the row padding means the row's content origin matches the strip's left edge, so the math holds.

### 4.3 Required CSS changes

```css
/* CHANGED */
.dd-widget-row {
  display: flex;
  /* WAS: gap: 12px; */
  /* WAS: padding: 0 20px; */
  animation: dd-widget-scroll 13.04s linear infinite;
  will-change: transform;
}

.dd-widget-token {
  flex-shrink: 0;
  display: inline-flex;
  /* ... existing token styles ... */
  margin-right: 12px;  /* NEW: replaces the row's gap */
}
```

No keyframe change needed. The translate(-50%) stays correct now that the row content is exactly 2× repeatable.

### 4.4 Edge cases

- **Mobile breakpoint (≤640px):** the row currently has `.dd-widget-row { gap: 8px; padding: 0 14px; }` at mobile. The same fix applies: switch to `margin-right: 8px` on tokens at mobile + remove row padding.
- **Flagged token visual state:** the `.dd-widget-token.is-flagged` styling is unchanged. Margin-right doesn't affect the flagged border or popup positioning.
- **JS popup positioning:** the JS uses `getBoundingClientRect()` on the flagged token to position the popup. Rects don't change with the gap→margin swap because token visual widths stay the same.

### 4.5 Verification plan

After fix:
1. Visual: watch the carousel for one full cycle. The loop should be **invisible** — no jump, no skip, tokens flow continuously left.
2. Code: confirm the first frame after a loop wrap is pixel-identical to T=0 (use browser devtools to capture transforms).
3. Mobile: re-verify at 375px and 640px viewport.

---

## Section 5 — Section-level order: keep, OR is there a stronger option?

The brief said the section-level order stays unless a stronger option is explicitly proposed. After the audit I believe the current section sequence (post-overnight-sprint) is approximately right. The only section-level move I propose is Insight moving up to BEFORE the slider (Issue A fix).

I considered three alternative section-level moves and rejected them:

| Alt | Move | Why rejected |
|-----|------|--------------|
| 1 | Move both Insight + Solution before slider | Two prose sections back-to-back before the slider would create 3 prose blocks in a row (Problem + Insight + Solution + slider). Top-heavy. Better: move Insight only (Issue A fix) + rewrite Solution's first sentence to not narrate (§3.1). |
| 2 | Move the entire "Four view modes" section UP between DP-B and drift detection | Resolves Issue B but conflates view-mode-switching concept with token-detection concept. They argue different things. The new framing section (§3.2) is the cleaner fix. |
| 3 | Move drift detection between view modes + Key Decisions | Would isolate drift detection from the token-level argument. Drift detection IS the token-level scanning visible artifact; pairing it with the new framing prose (§3.2) keeps the argument intact. |

**Conclusion: keep section sequence; one section move (Insight up); add two NEW framing prose blocks (drift detection setup + K-A setup); fix Solution prose to not narrate.**

---

## Section 6 — Implementation summary (post-approval)

Phase 2 execution will:

1. **Move The Insight section** from current position (after slider caption, line 446–450) to BEFORE the slider demo (insert just after The Problem section close, ~line 266).
2. **Rewrite Solution prose first sub-claim** (line 455) to remove slider-narration. See §3.1.
3. **Insert new framing section** "Detection runs at the token level" between DP-B caption (line 552) and drift detection demo (line 553).
4. **Insert new framing section/lead** above K-A widget per gate choice (3.A or 3.B). See §3.3.
5. **Remove K-A markers**: edit `js/demos/ghost-restraint-strip.js` — drop `Marker` from imports, remove `markers = STRIPS.map(...)` array, remove `marker[i].mount()` + `appear()` from each strip Beat B, remove `markers.forEach(m => m.disappear())` from cleanup + resetAllState. Update file-header timeline table.
6. **Update K-A caption** to "Restraint." (or per gate choice — keep, shorten, drop).
7. **Carousel seam fix**: edit `styles.css` — `.dd-widget-row` drop `gap` and `padding`; add `margin-right: 12px` to `.dd-widget-token`. Mirror at the mobile breakpoint.
8. **Cache-bust**: styles.css v=61 → v=62; ghost-restraint-strip.js v=2 → v=3; ghost-drift-detection.js v=5 → v=6.
9. **Verification pass** per §4.5 carousel + walk the page top-to-bottom confirming every element is in correct position.

Phase 3 will:

10. Add new standing rule to `.claude/CLAUDE.md`: **"Case study page composition rule"** — encoding the lessons (every element's position must be verified after a reorder; introducing prose precedes its visual; no two loops adjacent without a framing text beat; alternate text + visual rhythm).
11. Append `.claude/learnings.md` entry: the meta-lesson (reorders break composition silently; future case studies must run this audit discipline as a standard step).
12. Update `.claude/canonical-motion-spec.md` only if a reusable pattern emerged (low likelihood).

---

## Section 7 — Gate questions (decisions needed before Phase 2)

**Q1.** Approve the proposed composition fix as scoped (move Insight up + rewrite Solution + 2 new framing sections + remove K-A markers + carousel seam fix)?

**Q2.** K-A framing line — pick option 1 / 2 / 3 (text) AND sub-option 3.A / 3.B (structure)?

**Q3.** K-A caption disposition — shorten to "Restraint.", keep current "Restraint — color where it carries meaning.", or drop entirely?

**Q4.** Stronger section-level move available? Default: only Insight moves up. If gate prefers Alt 1/2/3 from §5 (e.g., both Insight + Solution before slider), say so.

After approval, Phase 2 (execute) and Phase 3 (standing rule + learnings) run uninterrupted.

---

*Phase 1 audit complete. Pausing for gate approval before any code moves.*
