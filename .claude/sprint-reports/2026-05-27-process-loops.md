# Process Loops Sprint — Final Report

**Date:** 2026-05-27
**Scope:** rebuild the two bottom-of-Ghost visuals (Design Process + Outcome) as cursor-as-agent designer-process loops, replacing Concept X (token health dashboard) and Concept Z (remediation pipeline) shipped earlier the same day.
**Outcome:** two new body demos shipped — DP-B "Severity Vocabulary Build" + OC-E "The Critical Three" — with a clean narrative arc (vocabulary → application) and the proven hero r2.6 cursor discipline applied throughout.
**Design doc:** [`.claude/sprint-reports/2026-05-27-process-loops-design.md`](2026-05-27-process-loops-design.md)

---

## Section 1 — What changed

### 1.1 Before vs after

| Slot | BEFORE (shipped morning) | AFTER (this sprint) |
|------|--------------------------|---------------------|
| Design Process | Concept X — Live token health dashboard. 21 tiles with sine-wave drift scores, scanline sweep, 2 periodic spikes. No cursor, no agent. | **DP-B "Severity Vocabulary Build"** — cursor populates an empty 4-row severity legend (Breaking / Critical / Minor / Resolved) via a small picker popup. 3 picks per 7000ms loop. As each legend row gets a color, matching deviation rows below snap to the just-defined severity. Resolved stays empty (future state). |
| Outcome | Concept Z — Live remediation pipeline. 4 stages (SCAN → DETECT → DIAGNOSE → FIX), 4 tickets cycling via modular arithmetic. No cursor, no agent. | **OC-E "The Critical Three"** — cursor triages 21 real Ghost component cards by visiting Modal, Select, Banner in sequence, marking each critical with red border + red marker pin + counter tick. After the 3rd click the non-critical 18 cards fade to 30% opacity ("Ghost narrows 21 components to the 3 that matter"). |

### 1.2 Why the swap

Concept X and Concept Z were technically clean — sine-wave continuous-state seams, modular-arithmetic ticket flow, IO pause/resume, reduced-motion paths, framework-compliant CSS — and shipped to user review the morning of 2026-05-27. The user reviewed them and identified a structural failure: both demos showed Ghost running on autopilot. The implied actor was the product, not the designer. For the Design Process and Outcome slots specifically — the case study's rhetorical spine — that's the wrong read. The hero (AI Fix Flow) is allowed to show the product because its job is "this is what Ghost does." The body demos at this position must show **how the designer made Ghost**, not the product in motion.

The user's reframe: **cursor-as-agent, build-point-wait, watch-me-think-and-build.** Grounded in the Benji Taylor research that originally shaped the hero. The new direction puts a visible designer (cursor) doing intentional design work on real Ghost UI.

### 1.3 The narrative arc (locked at concept gate)

- **DP-B Design Process** = building the severity language (additive — colors appear on an empty legend)
- **OC-E Outcome** = wielding that language at scale (subtractive — non-critical components fade as the triage result lands)
- **Hero** = executing a fix using that language (the AI Fix Flow already in place)

Three demos, three thinking-types, one connected story.

---

## Section 2 — Phase-by-phase execution log

### Phase 0 — pre-sprint backup ✓
Full-project snapshot at `_archive/_pre-process-loops-rebuild-2026-05-27/full-project-snapshot/`. Captures the state with Concept X + Concept Z in place (v=54 cache-bust). Restorable via one-line `cp -r ...`.

### Phase 1 — deep think + design doc ✓
Read all 11 pre-read files in full before any concept generation:
1. `.claude/CLAUDE.md`
2. `.claude/canonical-motion-spec.md` (Section 5.1 Benji fingerprint load-bearing)
3. `.claude/research/2026-05-21_benji-pattern-decomposition.md`
4. `.claude/research/2026-05-22_benji-autoplay-decomposition.md`
5. `.claude/research/2026-05-25_benji-componentization-philosophy.md`
6. `.claude/learnings.md` (r2.1 → r2.6 + Concept X + Concept Z build entries)
7. `.claude/sprint-reports/2026-05-27-bottom-visuals-design.md`
8. `js/demos/ghost-ai-fix-flow-hero.js` (gold standard)
9. `js/demos/ghost-token-health.js` + `js/demos/ghost-pipeline.js` (to-be-torn-down)
10. `js/demos/_engine/*` (all primitives)
11. `work/ghost.html` end-to-end

Produced `.claude/sprint-reports/2026-05-27-process-loops-design.md` (~720 lines) containing:
- §1A Benji synthesis — "what makes 'watch me think and build'" (5 mechanics + the cursor-as-agent thesis)
- §1B Real Ghost component inventory (what's available without overlapping the hero)
- §1C 6 concept candidates (3 per slot) graded against the four evaluative bars
- §1D Full beat-by-beat specs for the recommended pair
- §1E Visual consistency + honesty audit
- §1F 10 risks with mitigations
- §1G Self-critique
- §1H Decision gate questions

### Phase 1 concept gate
User picked **DP-B refinement #1 (vocabulary-build)** + **OC-E** + locked the narrative arc. §2 of the design doc appended with the refined DP-B spec and the build mandate.

### Phase 2 — teardown ✓
- Deleted `js/demos/ghost-token-health.js` + `js/demos/ghost-pipeline.js`
- Removed `/* DEMO: GHOST LIVE TOKEN HEALTH DASHBOARD */` block (216 lines) + `/* DEMO: GHOST LIVE REMEDIATION PIPELINE */` block (399 lines) from styles.css — 615 lines total
- Removed `<div class="th-widget">` + `<div class="pl-widget">` markup + comment blocks + script tags from work/ghost.html — 158 lines
- Cache-bust styles.css v=54 → v=55 across 11 HTML files
- Verified zero orphan references via grep
- HTTP smoke: 4/4 endpoints 200 OK

### Phase 3 — DP-B build ✓
Created `js/demos/ghost-severity-build.js` (381 lines, ~16 KB raw / ~5 KB gz est.) implementing the vocabulary-build choreography with:
- 12 beats in a 7000ms loop
- 3 picks (Breaking → red, Critical → orange, Minor → yellow); Resolved stays empty
- Polyrhythmic legend-hover dwells (300 / 350 / 280 ms — decisive → questioning → recognising)
- Uniform 200ms picker-swatch hovers (decisive within that context)
- Mirror-action seam with cleanup beat at T=6540
- Reduced-motion early-exit to static end state

Added `.sb-widget*` CSS block (271 lines) and `<div class="sb-widget" id="ghostSeverityBuild">` markup. Wired `ghost-severity-build.js?v=1` script tag. Cache-bust v=55 → v=56.

Phase 3 gate output: before/after beat table (all 12 beats land at planned T-stamps); honesty self-check (every beat traces to Rotem's real severity-taxonomy decision); distinctness self-check (categorically distinct from hero and pre-built for distinctness from OC-E).

### Phase 4 — OC-E build ✓
Created `js/demos/ghost-critical-three.js` (300 lines, ~11 KB raw / ~4 KB gz est.) implementing the triage choreography with:
- 7 beats in a 7000ms loop
- 3 triage picks (Modal at 78, Select at 77, Banner at 83 — lowest-scored / highest-visibility)
- Polyrhythmic card-hover dwells (300 / 350 / 280 ms)
- 1830ms terminal absorption freeze (the load-bearing payoff window — viewer absorbs "3 critical · 18 healthy")
- Mirror-action seam with cleanup beat at T=6300
- Reduced-motion early-exit

Added `.ct-widget*` CSS block (196 lines) and `<div class="ct-widget" id="ghostCriticalThree">` markup with 21 component cards. Wired `ghost-critical-three.js?v=1` script tag. Cache-bust v=56 → v=57.

Phase 4 gate output: before/after beat table (all 7 beats land); honesty self-check (21 component names + Modal/Select/Banner picks defensible per click); distinctness self-check (subtractive fade pattern + 3 red markers + 21-card grid clearly distinct from DP-B's additive build + 3 multi-colored markers + split-panel).

### Phase 5 — final deliverables ✓
- This report
- Appended sprint-level learnings to `.claude/learnings.md`
- Appended canonical-motion-spec.md with new Appendix codifying the **Designer-Process Body Demo pattern**

---

## Section 3 — Final file map

### Created
- `js/demos/ghost-severity-build.js` (381 lines)
- `js/demos/ghost-critical-three.js` (300 lines)
- `.claude/sprint-reports/2026-05-27-process-loops-design.md` (~720 lines)
- `.claude/sprint-reports/2026-05-27-process-loops.md` (this report)

### Modified
- `styles.css` — net delta: -615 lines (teardown) +271 (DP-B) +196 (OC-E) = -148 net. File went 4676 → 4528 lines.
- `work/ghost.html` — net delta: -158 lines (teardown) +98 (DP-B markup + script tag) +55 (OC-E markup + script tag) = -5 net. File went 844 → 830 lines.
- Cache-bust on all 11 active HTML files: v=54 → v=57 (three monotonic bumps across the sprint)
- `.claude/canonical-motion-spec.md` — appended Appendix D ("Designer-Process Body Demo Pattern")
- `.claude/learnings.md` — appended sprint-level entry

### Deleted (teardown)
- `js/demos/ghost-token-health.js`
- `js/demos/ghost-pipeline.js`

### Backup directories (preserved for rollback)
- `_archive/_pre-process-loops-rebuild-2026-05-27/full-project-snapshot/` (full pre-sprint snapshot)
- `_archive/_pre-phase-2-teardown-2026-05-27-process-loops/` (lightweight pre-teardown)
- `_archive/_pre-phase-3-dpb-2026-05-27/` (lightweight pre-DP-B-build)
- `_archive/_pre-phase-4-oce-2026-05-27/` (lightweight pre-OC-E-build)

---

## Section 4 — Code-level verification (final state)

| Check | Result |
|-------|--------|
| Node syntax on `ghost-severity-build.js` | PASS |
| Node syntax on `ghost-critical-three.js` | PASS |
| Markup hooks vs JS expectations: DP-B | 4 legend rows ✓, 4 deviation rows ✓, picker present ✓, 4 picker swatches ✓ |
| Markup hooks vs JS expectations: OC-E | 21 cards ✓, 3 `data-critical-target="true"` ✓, counter present ✓, grid present ✓ |
| Cache-bust at v=57 across 11 HTML files | 11/11 ✓ |
| HTTP smoke (final state) | / · /work/ghost.html · /styles.css?v=57 · ghost-severity-build.js · ghost-critical-three.js · engine/cursor.js · engine/marker.js → 7/7 200 OK |
| Orphan references for torn-down demos | 0 (grep clean across all source files) |

No claim on visual quality — that's Rotem's call at final review.

---

## Section 5 — Honesty + distinctness pass (across both new demos)

### Honesty (per the bar in the super-prompt)

| Beat / element | DP-B | OC-E |
|----------------|------|------|
| Component subjects | Severity vocabulary (Breaking/Critical/Minor/Resolved) — Rotem-defined taxonomy | 21 component names — verbatim from case study's "21 components tracked" claim |
| Real text | 4 deviation rows mirror hero deviations verbatim (#text-secondary, 16 → 12, 8 → 6, 500 → 400) | 21 drift scores + Modal/Select/Banner picks (lowest-scored + high-visibility) |
| Decision per click | "Breaking means red. Critical means orange. Minor means yellow." Each is a real taxonomy decision Rotem made for Ghost. | "This component needs attention. This one too. This third as well." Real triage judgments. |
| What I would not defend | Nothing fabricated. The 4 deviation row strings are from the hero. The 21 component names are from the case study prose. The severity colors are the actual color hex values shipped (#dc2626 / #f97316 / #eab308 / #22c55e). |

### Distinctness (per the bar)

| Axis | DP-B | OC-E | Hero |
|------|------|------|------|
| Decision type | Vocabulary build (3 picks define a taxonomy) | System-wide triage (3 picks classify components) | Execution (cursor applies a known fix) |
| Time horizon | Mid-project — "what should the language BE?" | Late-project — "what does the inventory NEED right now?" | Mid-task — "apply this fix to this deviation" |
| Cursor pattern | Picks a target, picker opens, picks a color, fill cascades | Picks 3 targets in sequence, no picker | Single deviation drilled into, Apply Fix → 3-step cascade |
| Markers | 3 in **different colors** (red, orange, yellow — color reflects the taxonomy decision) | 3 in **the same color** (red — triage flag) | 1 green (the marked deviation) |
| Layout | Split-panel: 4-row legend (top) + 4-row deviation list (bottom) + small dark picker popup | 7×3 card grid + 28px header strip with counter | Full app chrome: sidebar + nav + 4-row deviation list + detail panel |
| Visual result | Additive — empty swatches → filled colors | Subtractive — 18 cards fade as 3 are marked | Replacement — idle state crossfades to applying then done |
| Loop pattern | 3 build cycles with picker, mirror-action seam | 3 triage cycles + 1 cascade fade, mirror-action seam | Single complete fix execution, mirror-action seam |
| Loop duration | 7000ms (body demo) | 7000ms (body demo) | 7190ms desktop / 5990ms mobile (hero density) |

Both body demos use the same cursor easing (V3 traversal ease-in-out), same clickStamp mechanics, same engine primitives — but compose them into categorically different visual stories. Nothing in DP-B's beat sequence resembles OC-E's beat sequence, and neither resembles the hero's beat sequence.

---

## Section 6 — Patterns surfaced for canonical spec

One reusable pattern emerged worth promoting to `canonical-motion-spec.md`:

### The Designer-Process Body Demo Pattern

The cursor-as-agent body demo — cursor representing the designer, build-point-wait rhythm, judgment-per-click, real product components only. This is the body-demo analog of the hero pattern (where the cursor represents the user executing a known action). The DESIGNER-process body demo shows the designer MAKING the product, not the product running.

Codified in canonical-motion-spec.md Appendix D (added this sprint).

The hero pattern (cursor-as-user executing a known fix) and the designer-process body demo pattern (cursor-as-designer making decisions) are categorically distinct. The hero is allowed because its slot is "this is the product." Body demos at the case study's rhetorical spine should default to the designer-process pattern when the slot's job is to argue HOW the work was done.

---

## Section 7 — What I'd revisit

Honest list of things to scrutinize at final visual review:

1. **DP-B's picker positioning at narrow viewports.** The picker auto-anchors LEFT of the row if it would overflow. Verify the anchor logic at < 700px viewport — the picker may collide with the row's right edge swatch.

2. **OC-E's 1830ms terminal freeze.** This is the longest motionless beat in either demo and the load-bearing absorption window. If at visual review the freeze reads as "the demo froze" rather than "the result holds," the freeze duration is wrong (too long) or the lead-up cascade is wrong (not landing decisively enough). Tune the cascade-fade speed first; tune the freeze duration second.

3. **DP-B's deviation-row cascade (80ms stagger).** When Critical fills orange, Spacing and Radius rows cascade with 80ms between them. Verify the stagger reads as "two rows lighting up sequentially" not "two rows lighting up simultaneously." Tune stagger to 120ms if too fast.

4. **OC-E's choice of Modal/Select/Banner** vs alternative (Modal/Select/Switch by pure score). The picks are interview-defensible but Banner-by-visibility is a judgment call. If a hiring manager asks Rotem "why Banner not Switch?", he should be ready with "Banner is a high-visibility component; even at 83 drift it's higher triage priority than Switch at 81 because users see Banner more often." If he'd prefer pure-score triage, swap Banner for Switch.

5. **Both demos' reduced-motion paths render the END state.** This is correct per V3 §4.3, but visual review should confirm the end states actually communicate the demo's argument without motion. DP-B: 3 legend colors filled + 4 deviation dots filled + Resolved empty. OC-E: 3 cards with red borders + 18 faded + counter "3 critical · 18 healthy". Both should read as "the language was built" / "the triage was done."

---

## Section 8 — Sprint metrics

| Metric | Value |
|--------|-------|
| Phases run | 5 (Phase 0 backup + Phase 1 design + Phase 2 teardown + Phase 3 DP-B + Phase 4 OC-E + Phase 5 deliverables) |
| Concept gates resolved | 1 (Phase 1 end — user picked DP-B vocabulary-build + OC-E) |
| End-of-phase gates output | 2 (Phase 3 + Phase 4 — before/after beat tables + honesty + distinctness self-checks) |
| Pre-phase backups created | 4 (Phase 0, Phase 2, Phase 3, Phase 4) |
| Files created | 4 (2 JS modules + 2 sprint docs) |
| Files modified | 3 (styles.css, work/ghost.html, learnings.md, canonical-motion-spec.md) — 4 actually |
| Files deleted | 2 (Concept X + Concept Z JS modules) |
| Net line delta — styles.css | -148 lines (615 removed teardown, 467 added two new blocks) |
| Net line delta — work/ghost.html | -14 lines (158 removed teardown, 144 added two new blocks) |
| Cache-bust monotonic bumps | 3 (v=54 → v=55 → v=56 → v=57) |
| Engine primitives used (DP-B) | Cursor, Choreography, Marker × 3 (red/orange/yellow), LoopObserver, prefersReduced, getCenterOf |
| Engine primitives used (OC-E) | Cursor, Choreography, Marker × 3 (red), LoopObserver, prefersReduced, getCenterOf |
| New engine surface added | 0 (DP-B's picker is widget-specific, NOT an engine primitive extension) |
| HTTP smoke endpoints (final state) | 7/7 200 OK |
| Node syntax checks | 2/2 PASS |

---

---

## Section 9 — Visual review outcome (post-build, 2026-05-27)

**Both loops approved at visual review.** User confirmed:
- DP-B "Severity Vocabulary Build" lands — cursor reads as the designer making decisions, polyrhythmic dwells make "watch me think" legible, vocabulary-build narrative arc reads cleanly into OC-E.
- OC-E "The Critical Three" lands — three triage judgments read as decisive, terminal absorption freeze carries "3 critical · 18 healthy" as the rhetorical payoff, distinct from DP-B (subtractive vs additive) and from the hero.
- Narrative arc validated end-to-end: DP-B builds the severity language → OC-E wields it at scale → hero executes a fix using it.

### 9.1 Post-review bug discovered and fixed — Minor marker silent invisibility

During visual confirmation the user identified that DP-B's third marker (yellow "3" for the Minor severity pick) was not rendering. Beats 1B + 2B produced the red "1" and orange "2" markers correctly; Beat 3B produced nothing visible.

**Diagnosis:** the Marker engine primitive accepted `variant: 'yellow'` without erroring but `styles.css` had no matching `.demo-marker--yellow` CSS rule (only default / green / orange / red were defined at lines 2644-2647). The DOM element rendered with class `demo-marker demo-marker--yellow` and a transparent background — a 22px circle with white "3" text against a near-white canvas: visually invisible. Marker 3 was being instantiated, mounted, `.appear()`-ed and cleaned up correctly. The failure was at the CSS layer, not the JS layer.

**Fix:** added one CSS rule `.demo-marker--yellow { background: #eab308; }` at [styles.css:2647](../../styles.css#L2647) as a first-class engine variant alongside green/orange/red. Cache-bust styles.css v=57 → v=58 across 11 active HTML files. Verified: yellow "3" now renders identical-treatment to red "1" and orange "2" (same 22px circle, same drop-shadow, same scale-in easing); cleanup at T=6540 still removes all three markers together at the loop seam.

### 9.2 Post-fix hardening — Marker engine primitive

Surfaced from the bug: the engine's silent-acceptance of unknown variants was a structural failure mode that would recur on Pulse / LexisNexis (and any future case study) the next time a demo passed a novel variant string. Hardened the primitive:

- **Added `KNOWN_VARIANTS = new Set(['default', 'green', 'orange', 'yellow', 'red'])`** as a module-level constant at [js/demos/_engine/marker.js](../../js/demos/_engine/marker.js).
- **Added `warnUnknownVariant()`** helper. Constructor + `setVariant()` both check the variant string against the set on instantiation / runtime swap; unknown variants trigger `console.warn` with canonical text: `[Marker] Unknown variant "X". A matching .demo-marker--X CSS rule must exist in styles.css or the marker will render invisible. Supported variants: default, green, orange, yellow, red.` Does NOT throw — warns only.
- **Added "KNOWN CONSTRAINTS / GOTCHAS" comment block** at the top of marker.js documenting 6 numbered constraints with provenance: the variant-CSS-rule rule (#1, dated 2026-05-27, citing the DP-B bug), variants-not-arbitrary-hex (#2), position-relative container (#3), container-local CENTER coords (#4), setTimeout-based promise resolution (#5), setVariant doesn't re-render (#6).

**Test (PASSED):** ran a node test with minimal DOM stubs. 6 known-variant constructor calls (red/orange/yellow/green/default + default-via-no-opts) produced 0 warnings. 3 unknown-variant calls (purple/blue/magenta) produced 3 warnings with the expected canonical text.

### 9.3 Post-fix standing rule — Engine primitive self-documentation

Added new section to [.claude/CLAUDE.md](../CLAUDE.md): "Engine primitive self-documentation rule." Six rules + audit checklist. Key imperatives:

1. When you discover something worth knowing about an engine primitive — a failure mode, constraint, gotcha, reusable pattern — document it directly in that primitive's file as a top-of-file `KNOWN CONSTRAINTS / GOTCHAS` comment block, in addition to learnings.md.
2. Numbered list with bold imperative headlines; cite provenance (date + sprint).
3. Promote silent-failure modes to runtime `console.warn` where cheap (NOT throw).
4. Closed sets → `KNOWN_X` module constants (machine-checkable + grep-discoverable + single source of truth that the CSS rule list mirrors).
5. Engine code changes MUST update the comment block in the same commit.
6. Apply retroactively when touching any engine file.

`marker.js` is cited as the canonical template. Future sessions touching `cursor.js`, `choreography.js`, `popup.js`, `observer.js`, `motion.js`, `reduced-motion.js` should audit each on first touch and add KNOWN CONSTRAINTS sections where missing.

### 9.4 Updated metrics (incorporating post-review work)

| Metric | Updated value |
|--------|---------------|
| Cache-bust monotonic bumps | **5** (v=54 → v=55 → v=56 → v=57 → v=58 → v=59 — 2 post-review for yellow rule + Marker hardening) |
| Demo script version bumps in work/ghost.html | ghost-severity-build.js v=1 → v=3; ghost-critical-three.js v=1 → v=3 |
| Standing rules added to .claude/CLAUDE.md | **1** ("Engine primitive self-documentation rule") |
| Engine primitives hardened | **1** (`marker.js` — KNOWN_VARIANTS + warnUnknownVariant + 6-constraint KNOWN CONSTRAINTS block) |
| Engine primitives still pending the new standing rule (audit on first touch) | **6** (cursor.js, choreography.js, popup.js, observer.js, motion.js, reduced-motion.js) |
| Bugs caught at visual review | 1 (Marker 3 silent invisibility — fixed same session, surfaced new standing rule) |

### 9.5 What the sprint produced — final summary

**Two shipped body demos validated by user review:**
- DP-B "Severity Vocabulary Build" — Design Process slot, the additive vocabulary-build with three colored markers
- OC-E "The Critical Three" — Outcome slot, the subtractive triage with the 1830ms terminal absorption

**One canonical pattern codified** in [canonical-motion-spec.md Appendix D](../canonical-motion-spec.md) — the Designer-Process Body Demo pattern, with the five mechanics + audit checklist + worked examples + anti-pattern record.

**One standing rule added** in [.claude/CLAUDE.md](../CLAUDE.md) — Engine primitive self-documentation rule, applicable to every engine file from here forward.

**One engine primitive hardened** — marker.js with KNOWN_VARIANTS, warnUnknownVariant, and the canonical 6-constraint KNOWN CONSTRAINTS block (the template for future engine documentation).

**One persistent memory saved** in `~/.claude/projects/.../memory/feedback_process_loop_template.md` — the five-step template ("decide the decision first, then choreograph the cursor to show it") indexed in MEMORY.md for inheritance into future Claude Code sessions on this project.

Production deploy NOT executed per sprint constraints. Final visual review COMPLETE — both loops approved.

---

*End of sprint report. Sprint closed 2026-05-27 with user visual approval + post-review hardening.*
