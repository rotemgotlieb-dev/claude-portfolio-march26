# Layout Audit Sprint — Final Report

**Date:** 2026-05-28
**Scope:** post-overnight-sprint layout audit + composition fixes + carousel seam diagnosis at root + encoding the discipline as a permanent standing rule for every case study page on the site.
**Phases:** Phase 1 audit (gated) → Phase 2 execution → Phase 3 standing rule + learnings.
**Audit doc:** [.claude/sprint-reports/2026-05-28-layout-audit.md](2026-05-28-layout-audit.md)

---

## Section 1 — What changed (4 composition issues + 1 technical issue, all fixed)

### Issue A — Introduce-after-show: Insight + Solution narrating the slider

**Before:** The Insight prose ("The comparison slider became the centerpiece because it mirrors how designers check work…") and The Solution prose ("The Comparison Slider shows design spec against production reality…") both sat AFTER the slider demo. Both narrated what the viewer had just seen.

**After:**
- **The Insight section moved UP** from position 6 (after slider caption) to position 4 (between Problem and slider). Insight prose tweaked from past-reflective ("became the centerpiece because") to present-introducing ("mirrors how designers check work").
- **The Solution prose rewrote its first sub-claim** from "The Comparison Slider shows design spec against production reality." to "**Deviation markers carry the diagnosis.** Red for breaking, amber for drift, blue for undocumented variants. Each marker shows the exact delta — 'Expected: padding 16px. Found: padding 12px. Off by 4.'"
  - Solution stays AFTER the slider as system-level summary. No longer narrates the slider; reframes around the marker taxonomy + AI Fix Flow callback to the hero.

### Issue B — Two looping visuals adjacent (DP-B → drift detection)

**Before:** DP-B caption sat directly above the drift detection demo. No prose framed the drift detection — viewer went from DP-B's autoplay loop directly into drift detection's autoplay loop.

**After:** new `<section class="case-section reveal">` inserted between DP-B caption and drift detection demo:
> **Detection runs at the token level.**
> Drift starts where designers don't look — at the token. Ghost scans every component on every push, surfacing the deviation before it ever ships.

Two sentences. Frames the drift detection demo (token-level scanning across the design system). Resolves the rhythm violation.

### Issue C — K-A numbered markers confusing

**Before:** 4 numbered markers (red, orange, orange, yellow — matching each row's severity color) appeared per clickStamp. User feedback: confusing, didn't communicate the decision.

**After:**
- **Markers removed from JS module.** Edited `js/demos/ghost-restraint-strip.js`: dropped `Marker` from imports, deleted the `markers = STRIPS.map(...)` array, removed `markers[i].mount()` + `appear()` from each Beat B, removed `markers.forEach(m => m.disappear())` from cleanup beat AND `resetAllState()`. File header timeline table updated to reflect the simpler beat structure.
- **New framing section inserted above K-A demo:**
> **Color where it carries meaning.**
> I keep color on what carries meaning. Severity dots hold the drift signal; text labels don't, so they go neutral.

First-person, plain, technical. Names BOTH categories (dots kept; labels stripped) + the reason. Voice matches Design Process pivots ("I rebuilt the dashboard…" / "I added the AI Fix Flow…").

- **Caption shortened** from "Restraint — color where it carries meaning." to just **"Restraint."** — single word; framing line above now carries the rule explanation, so the caption becomes a one-word takeaway.

### Issue D — Carousel seam diagnosed at root (NOT speed)

**Diagnosis (real cause):**
- `.dd-widget-row` used `gap: 12px` between 16 flex children (15 internal gaps) + `padding: 0 20px` on the row.
- Math: with 15 internal gaps shared between the two halves of repeated content, translating `-50%` lands token 8 at position 6 while token 0 started at position 20 → visible 6–14px jump every loop cycle.
- The +20% speed bump from the prior sprint didn't fix this because speed isn't the cause; the LAYOUT MATH was wrong.

**Fix (real continuous-state, not a speed change):**
- Switched `gap: 12px` to `margin-right: 12px` on each `.dd-widget-token`. Each token now owns its trailing margin.
- Removed `.dd-widget-row { padding: 0 20px }`. The strip's existing `::before` and `::after` linear-gradient fade pseudo-elements (80px wide each) provide the visual edge softening that the padding used to give.
- Mirrored at the mobile breakpoint (`@media (max-width: 640px)`): tokens get `margin-right: 8px`; row padding removed.

**Result:** the row content is now exactly 2× repeatable. `translateX(-50%)` lands token 8 at the exact pixel position where token 0 started → seam is mathematically continuous, no skip.

---

## Section 2 — Phase-by-phase execution

### Phase 1 — Deep layout audit + gate ✓
Walked all 22 elements of the case study top-to-bottom. Produced `.claude/sprint-reports/2026-05-28-layout-audit.md` (~440 lines, 7 sections): element-by-element walkthrough, composition issues summary, proposed corrected order, K-A description draft options (3 voice options × 2 structure sub-options), carousel seam math diagnosis with derivation, implementation summary, gate questions.

**Gate resolved:**
- Q1 (approve scope?): "Approve as scoped — execute Phase 2"
- Q2 (K-A framing text?): Option 1 (first-person, balanced)
- Q3 (K-A structure?): Section block + shortened caption

### Phase 2 — Execute composition fixes ✓
Pre-phase backup at `_archive/_pre-layout-fix-2026-05-28/` (ghost.html + styles.css + ghost-restraint-strip.js).

Sequential edits:
1. Removed The Insight section from current position (after slider caption).
2. Inserted (tweaked) Insight section between Problem and slider.
3. Rewrote Solution's first sub-claim.
4. Inserted "Detection runs at the token level" section.
5. Inserted "Color where it carries meaning" section above K-A.
6. Shortened K-A caption to "Restraint."
7. Edited `ghost-restraint-strip.js` — Marker import dropped, markers array deleted, appear/disappear calls removed, file header updated.
8. Edited `styles.css` — `.dd-widget-row` lost `gap` + `padding`; `.dd-widget-token` gained `margin-right: 12px`. Mirrored at mobile.
9. Cache-bust: styles.css v=61 → v=62 across 11 active HTML files; ghost-restraint-strip.js v=2 → v=3; ghost-drift-detection.js v=5 → v=6.

### Phase 3 — Standing rule + learnings ✓
- **Added "Case study page composition rule"** to `.claude/CLAUDE.md` between "Engine primitive self-documentation rule" and "Core Loop Directive." Five sub-rules + audit checklist. Applies to EVERY case study page (Pulse, LexisNexis, GoteFigure, and any new ones), not just Ghost.
- **Appended learnings entry** to `.claude/learnings.md` documenting the meta-lesson (reorders break composition silently) and the per-issue diagnoses.
- **canonical-motion-spec.md NOT updated** — no reusable motion pattern emerged; the composition rule is layout discipline, not motion discipline. It lives in CLAUDE.md as a standing rule.

---

## Section 3 — Final verification

| Check | Result |
|-------|--------|
| Node syntax: `ghost-restraint-strip.js` | PASS |
| Node syntax: `ghost-drift-detection.js` | PASS |
| Marker fully removed from K-A JS (no active references) | ✓ verified — Marker text remaining only in explanatory header comments documenting the removal |
| Cache-bust v=62 across 11 active HTML files | 11/11 ✓ |
| HTTP smoke (8 endpoints) | 8/8 200 OK |
| K-A markers gone in rendered output (zero `appear()` calls remaining) | ✓ |
| Carousel CSS: gap removed from `.dd-widget-row` | ✓ |
| Carousel CSS: margin-right added to `.dd-widget-token` (desktop + mobile) | ✓ |
| Identity facts preserved (LexisNexis verbatim, no PingCAP/Canva) | ✓ |
| Hero (`ghost-ai-fix-flow-hero.js`) untouched | ✓ r2.6 locked |
| Section anchor IDs (sidebar nav resolves) | ✓ all section IDs unchanged |
| Final element order (post-fix) | Hero → Overview → Problem → **Insight** → Slider → Solution → Design Process → DP-B → **Detection runs at the token level** → drift detection → Four view modes → view modes → Key Decisions → **Color where it carries meaning** → K-A → Outcome → OC-E → Other Work |

---

## Section 4 — The new standing rule (preview)

Added to [.claude/CLAUDE.md](.claude/CLAUDE.md) directly after "Engine primitive self-documentation rule." Five sub-rules:

1. A section reorder is not complete until every element's position is verified relative to its new neighbors.
2. Prose that introduces a visual MUST precede that visual, never trail it.
3. No two looping visuals may be adjacent without a framing text beat between them.
4. Every looping visual gets a short framing line before it (Benji rhythm: alternate text + visual).
5. The page must read as polished and professional for a founding-designer hire — deliberate rhythm, nothing overwhelming.

Plus the audit checklist (7 items) to run before shipping any case study restructure or new case study build.

**Applies to every case study page on this site — Pulse, LexisNexis, GoteFigure, any new ones.** Not Ghost-specific. The element-by-element audit format is now a standard step, not an afterthought.

---

## Section 5 — Forks documented at decision time

Decisions made at forks during this sprint:

1. **Move Insight only OR move both Insight + Solution before slider?** Chose: move Insight only; rewrite Solution's first sub-claim to remove slider-narration. Reasoning: moving both before slider creates 3 prose blocks in a row (Problem + Insight + Solution + slider). Moving only Insight + rewriting Solution achieves the same goal (no animation-narration) with less prose-load before the slider.

2. **K-A framing structure — section block (3.A) or standalone lead paragraph (3.B)?** Chose: section block (matches the new drift-detection framing pattern; visual rhythm consistency).

3. **K-A caption — keep current, shorten, or drop?** Chose: shorten to one word "Restraint." Reasoning: with the framing line above carrying the rule, the long caption was redundant; the one-word caption preserves the page-wide demo→caption rhythm.

4. **Carousel fix — gap→margin-right alone, padding removal alone, or both?** Chose: both. Math required both to land cleanly (the math derivation is in the audit doc §4).

5. **K-A markers — keep but tone down, remove?** Chose: remove entirely. The user explicitly said remove. The dot-holding + text-stripping IS the communication; markers were crowding a loop ABOUT restraint (recursive irony — the loop's own argument applies to its own elements).

---

## Section 6 — What I'd revisit at morning review

Honest list for visual review:

1. **K-A framing line voice.** First-person ("I keep color…") matches the Design Process pivots' voice but is a stylistic call. If at review it feels too I-heavy across the page (Design Process pivots already use "I"), consider rewording to third-person factual.

2. **K-A caption "Restraint." is one word.** It's terse — terser than any other caption on the page. If it reads thin, expand back to "Restraint — color where it carries meaning." (the prior caption), accepting some redundancy with the framing line above.

3. **The "Detection runs at the token level" framing might want a section-label badge** to match Design Process / Key Decisions etc. which have `<span class="section-label">`. Currently this new section has only an H2 + p without a section label. Consistency-wise, adding a small section label would match the page-wide pattern. Easy adjustment.

4. **The "Color where it carries meaning" framing same — no section-label badge.** Same as #3, consider adding for consistency.

5. **Carousel: visual verification on real device.** The math is correct; the seam should be invisible. But CSS animations on real devices sometimes have sub-pixel rounding artifacts. If at review a faint seam remains, the next layer would be a JS-driven `transform: translate3d()` with exact integer pixel values.

---

## Section 7 — Sprint metrics

| Metric | Value |
|--------|-------|
| Phases | 3 (audit + gate + execution + standing rule) |
| Gates | 1 (Phase 1 audit findings → user approval) |
| Forks documented | 5 |
| Backups | 1 pre-phase-2 (`_pre-layout-fix-2026-05-28/`) |
| Composition issues found and fixed | 4 (Issue A, B, C, D) |
| New `<section>` blocks inserted | 2 (drift detection framing, K-A framing) |
| Section blocks moved | 1 (The Insight, from after-slider to before-slider) |
| Prose blocks rewritten | 1 (Solution first sub-claim) |
| K-A engine primitive references removed | All Marker references in active code (markers array, mount/appear/disappear calls, import) |
| CSS rules modified for carousel seam | 2 (`.dd-widget-row` lost gap+padding; `.dd-widget-token` gained margin-right; mirrored at mobile) |
| Cache-bust bumps | 3 (styles.css v=62, ghost-restraint-strip.js v=3, ghost-drift-detection.js v=6) |
| HTTP smoke endpoints | 8/8 200 OK |
| Standing rules added to CLAUDE.md | 1 ("Case study page composition rule") |
| Identity facts preserved | All ✓ |
| Hero touched | NO (r2.6 locked) |

---

*End of layout audit sprint report. Production deploy NOT executed. Final visual review is Rotem's call. The composition discipline is now a standing rule applicable to every future case study page on this site.*
