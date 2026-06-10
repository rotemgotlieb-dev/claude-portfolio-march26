# Key Decisions Loop Sprint — Final Report

**Date:** 2026-05-28
**Scope:** replace the dark static Overlay screenshot in the Ghost Key Decisions section with a fourth cursor-as-agent body demo arguing the prose's primary claim — "clinical precision; severity color only where it carries meaning."
**Outcome:** K-A "The Editorial Strip" shipped. Cursor strips text-label color from 4 deviation rows while the severity dot on each row holds. Pointwise property-level edit — a fourth gesture signature joining the page's existing three (action / additive build / subtractive triage).
**Design doc:** [.claude/sprint-reports/2026-05-28-key-decisions-loop-design.md](2026-05-28-key-decisions-loop-design.md)

---

## Section 1 — What changed

### 1.1 Before vs after

| State | Before | After |
|-------|--------|-------|
| Slot occupant | Dark static Overlay screenshot (`img/ghost/process-05.png`, 1600×1000 RGB, 229 KB) — the heaviest static element on the page, clashed with the cursor-loop aesthetic | **K-A "The Editorial Strip"** — cursor strips text color from 4 deviation rows; severity dots hold. 7000ms loop. Polyrhythmic 350/280/240/320 ms dwells. 1580ms terminal absorption holds the clinical end state. |
| Asset disposition | Dark screenshot owns the visual climax of Key Decisions section, page rhythm broken between Design Process (DP-B loop) and Outcome (OC-E loop) | PNG asset preserved at `img/ghost/process-05.png` per user direction (potential future surfaces — process gallery, social card). Only the markup is removed from work/ghost.html. Page rhythm now coherent: 5 cursor-loops + the comparison slider, all light-system. |
| Argument | "Here's what Overlay mode looks like" (descriptive — repeats what View Modes demo already shows) | "What earns color in Ghost — restraint as an active editorial choice" (the prose's primary claim, dramatized as a per-element cursor judgment) |

### 1.2 Why this replacement

The Process Loops sprint (2026-05-27) shipped DP-B + OC-E and established the page's coherent light-system aesthetic. The dark Overlay screenshot survived that sprint but became the most visually heavy element on the page — a static asset in a page now defined by cursor-driven motion. It hijacked the visual climax of the Key Decisions section and broke the system the new loops earned.

Three options were on the table at concept gate:
- Loop the slot with K-A (recommended; cleared all four bars)
- Prose-only with a small static palette swatch (honest steelman; rejected — leaves a visual void at a position where the eye expects motion)
- Two alternative loop concepts (K-B palette tone-down, K-C voice trim; both failed bars — see design doc §1C)

User picked K-A at concept gate. K-A's load-bearing distinctness: pointwise property-level edit (text color leaves while sibling dot holds). Categorically different from the hero's action execution, DP-B's additive build, OC-E's subtractive whole-element fade.

### 1.3 The page's coherent system, post-sprint

The Ghost case study now ships:

| Position | Surface | Type | Argument |
|----------|---------|------|----------|
| Above fold | Hero AI Fix Flow | Cursor-driven autoplay (7.19s) | Apply a known fix — execution |
| Beat 2 | Comparison slider | User-driven drag | Drag reveals production drift |
| Beat 3 | Drift detection | Cursor-driven autoplay (5s) | Token-level drift surfaces what visual review misses |
| Beat 4 | View modes | User-driven chips | Four ways to compare design vs production |
| Design Process | DP-B Severity Vocabulary Build | Cursor-driven autoplay (7s) | Building the severity language |
| **Key Decisions** | **K-A Editorial Strip (THIS SPRINT)** | **Cursor-driven autoplay (7s)** | **What earns color in Ghost** |
| Outcome | OC-E Critical Three | Cursor-driven autoplay (7s) | Triage at scale — 21 → 3 |

Seven artifacts. Five cursor-driven loops + one user-driven slider + one user-driven chip toolbar. The dark Overlay screenshot was the last static asset on the case study spine. Its removal completes the light-system coherence.

---

## Section 2 — Phase-by-phase execution log

### Phase 0 — pre-sprint backup ✓
Full project snapshot at `_archive/_pre-key-decisions-loop-2026-05-28/full-project-snapshot/` (297 MB). Captures state with DP-B + OC-E shipped at v=59 cache-bust + Marker primitive hardened.

### Phase 1 — design doc + concept gate ✓
Read pre-required files: `.claude/CLAUDE.md` (verified Engine self-documentation rule present), `canonical-motion-spec.md` (verified §D.7-D.9 in place), `learnings.md` (verified breakthrough pattern + hardening entries), three existing demo modules, `_engine/*`, `work/ghost.html` (current state). Produced `.claude/sprint-reports/2026-05-28-key-decisions-loop-design.md` (~580 lines) — §1A through §1G covering: decision restated, real-Ghost element inventory + loud/clinical end states, three concept candidates with grading, full beat-by-beat spec, distinctness + honesty audit, 6 risks with mitigations + self-critique.

User picked K-A at concept gate; chose "accept all 6 risks, tune at visual review"; chose "keep PNG; only remove markup."

### Phase 2 — teardown ✓
- Removed `<div class="case-image reveal"><img src="../img/ghost/process-05.png">...` block from work/ghost.html (lines 691-693, 3 lines net removal)
- PNG asset preserved at `img/ghost/process-05.png` per user direction
- Grep verified 0 orphan `process-05` references in active code
- No cache-bust needed (CSS unchanged at this phase)

### Phase 3 — K-A build ✓
Created `js/demos/ghost-restraint-strip.js` (276 lines, ~10 KB raw / ~3.5 KB gz est.) implementing the editorial-strip choreography with:
- 9 beats in a 7000ms loop
- 4 strips (red → black, orange → black, orange → black, yellow → black)
- Polyrhythmic cognition dwells 350 / 280 / 240 / 320 ms (decisive → questioning → recognising → edge-case-recheck)
- Mirror-action seam with cleanup at T=6300 reversing all 4 strips
- Reduced-motion early-exit to static clinical end state
- IO pause/resume via LoopObserver

Added `.kd-widget*` CSS block (~180 lines) and `<div class="kd-widget" id="ghostRestraintStrip">` markup in the Key Decisions section. Wired `ghost-restraint-strip.js?v=1` script tag. Cache-bust styles.css v=59 → v=60 across all 11 active HTML files.

End-of-Phase-3 gate output: planned-vs-implemented beat table (all 17 timeline beats land at exact planned T-stamps); honesty self-check (every strip traces to Rotem's real iterative call; clinical end state matches live case study rendering); distinctness self-check (pointwise property-level edit categorically distinct from hero / DP-B / OC-E).

### Phase 4 — final deliverables ✓
This report; learnings.md entry below; canonical-motion-spec.md updated with K-A as the fourth gesture-signature category.

---

## Section 3 — Final file map

### Created
- `js/demos/ghost-restraint-strip.js` (276 lines)
- `.claude/sprint-reports/2026-05-28-key-decisions-loop-design.md` (~580 lines)
- `.claude/sprint-reports/2026-05-28-key-decisions-loop.md` (this report)

### Modified
- `styles.css` — +182 lines for `/* DEMO: GHOST RESTRAINT STRIP */` block. File 4528 → 4710 lines.
- `work/ghost.html` — net +48 lines (Phase 2 removed 3 lines for Overlay screenshot div; Phase 3 added 51 lines for widget markup + script tag). File 830 → 878 lines.
- 11 HTML files — cache-bust styles.css v=59 → v=60
- `.claude/canonical-motion-spec.md` — Appendix D §D.10 added (fourth gesture-signature category)
- `.claude/learnings.md` — sprint entry appended

### Removed (markup only)
- `<div class="case-image">` block + `<img src="../img/ghost/process-05.png">` tag at work/ghost.html (former lines 691-693)

### Preserved (per user direction)
- `img/ghost/process-05.png` (229 KB) — kept on disk for potential future surfaces

### Backups
- `_archive/_pre-key-decisions-loop-2026-05-28/full-project-snapshot/` (full project, 297 MB)
- `_archive/_pre-phase-2-key-decisions-teardown-2026-05-28/` (lightweight pre-teardown)
- `_archive/_pre-phase-3-restraint-strip-2026-05-28/` (lightweight pre-build)

---

## Section 4 — Code-level verification (final state)

| Check | Result |
|-------|--------|
| Node syntax on `ghost-restraint-strip.js` | PASS |
| Markup hooks vs JS expectations | 4 deviation rows ✓, 4 labels ✓, canvas present ✓ |
| Cache-bust at v=60 across 11 HTML files | 11/11 ✓ |
| HTTP smoke | / · /work/ghost.html · /styles.css?v=60 · /js/demos/ghost-restraint-strip.js?v=1 · /js/demos/ghost-severity-build.js?v=3 · /js/demos/ghost-critical-three.js?v=3 · /js/demos/_engine/cursor.js → 7/7 200 OK |
| Served CSS contains kd-widget rules | 32 references in styles.css?v=60 ✓ |
| Orphan references for removed Overlay screenshot | 0 (`process-05` not found in active code) |
| Engine self-documentation rule satisfied | This sprint didn't touch any engine primitive — no audit triggered. Marker constraint block from prior sprint already in place. |

No claim on visual quality — Rotem's call at visual review.

---

## Section 5 — Honesty + distinctness audit (across all four cursor-driven body demos on the page)

| Demo | Decision | Gesture signature | Markers | Popup | Real-text approach |
|------|----------|-------------------|---------|-------|--------------------|
| Hero AI Fix Flow | Apply known fix | Action execution + 3-step cascade + blurCrossfade | 1 green | NO | Full deviation list + detail panel with all hex values |
| DP-B Severity Vocabulary Build | Build vocabulary | Additive picker-driven; legend fills + system reflects | 3 different colors | YES (4-swatch picker) | Same 4 deviation strings as hero |
| OC-E Critical Three | Triage 21 → 3 | Subtractive whole-card fade; counter morphs | 3 red | NO | 21 component names (Button / Modal / Select / ...) |
| **K-A Editorial Strip (THIS SPRINT)** | **What earns color** | **Pointwise property-level edit; sibling holds** | **0** | **NO** | **Same 4 deviation strings as hero + DP-B** |

Every demo on the page uses a categorically different gesture. **K-A's "zero markers" and "pointwise edit" are unique on the page** — no other demo uses zero markers, and no other demo edits a single CSS property while leaving a sibling property untouched.

The narrative arc across the page is now four-act:
1. **DP-B** *builds* the severity language (Breaking=red, Critical=orange, Minor=yellow)
2. **K-A** applies *editorial restraint* using that language (color stays on dots, leaves text)
3. **OC-E** *wields* the language at scale (3 critical, 18 healthy)
4. **Hero** *executes* a fix using the established system (Apply Fix → 3-step cascade → done)

Plus the comparison slider as the case study's entry interaction and the existing Beat 3/4 supporting demos.

---

## Section 6 — Patterns surfaced for canonical spec

The K-A sprint validates Appendix D (Designer-Process Body Demo pattern) for the third time. The 5-step template from §D.7 — *decide the decision first → generate concepts → resolve at spec level → build is execution → cursor IS the agent making the decision* — applied cleanly across the sprint. Phase 1 was heavy upfront design (~580-line doc); Phase 3 implementation matched the planned T-stamps exactly with zero re-scoping.

One reusable pattern emerged worth promoting to canonical-motion-spec.md:

### Pointwise property-level edit as a fourth distinctness category

The existing process-loop pattern catalogue had three gesture signatures:
1. Action execution (hero)
2. Additive build (DP-B)
3. Subtractive whole-element fade (OC-E)

K-A introduces a fourth:

4. **Pointwise property-level edit** — cursor edits ONE specific CSS property on a specific element while a SIBLING property (or a sibling element) holds. The edit is surgically scoped, visually unmistakable from any whole-element treatment.

This is added to Appendix D as §D.10 — a non-exhaustive catalogue of gesture signatures. Future process loops should be checkable against the existing four. If a new loop doesn't introduce a new signature OR doesn't visibly differ from the existing four on at least one of (markers / popup / mechanism / surface), distinctness risks failing the bar.

The catalogue is not closed — future demos may introduce gesture-signature #5 etc. The discipline is: **before building, name the gesture-signature category; if it's the same as an existing demo on the same page, distinguish it on another axis (markers / popup / surface / dwell rhythm) explicitly.**

---

## Section 7 — What I'd revisit

Honest list for visual review:

1. **The strip animation duration (250ms)** vs the hover dwell (240–350ms). The strip is FAST so that the click → consequence connection is tight. But if at visual review the strip reads as "the text instantly went black" without the viewer registering the cursor caused it, the strip duration could stretch to 300ms (still inside V3 §2.2 state-transition ceiling). Tune by ear.

2. **The terminal absorption freeze (1580ms)** is the longest motionless beat on the page. Designed to give the viewer time to absorb "4 black labels + 4 colored dots — restraint applied." If at review the freeze reads as "the demo froze," try tightening to 1200ms (still within V3 §2.3 terminal dwell range 1500–2500). The freeze is the rhetorical payoff window — tune carefully.

3. **Risk 5 from the design doc — DP-B continuity.** K-A uses the same 4 deviation rows as DP-B. The intentional reading is "DP-B *defined* the severity language on these 4 rows; K-A *applies editorial restraint* to them." If at review this reads as repetition rather than arc, the K-A canvas could swap to a different set of 4 deviations (e.g., from drift detection tokens). Easy adjustment.

4. **The header dot (#4F46E5 indigo brand accent)** sits in the K-A widget header as a visual anchor for "what stays colored in the final clinical state." It's a small element but carries thematic weight — the loop's argument is "color earns its place," and the indigo dot is itself an element that earns its place. If the dot reads as out-of-system at review, swap to a black dot or remove it (the title text alone is sufficient).

5. **The 5-loop cascade on a single case study page** is a real perception concern that the Process Loops sprint surfaced and this sprint inherits. The page now has 5 cursor-driven autoplay loops + 2 user-driven interactions. If the page reads saturated at review, K-A's terminal absorption freeze is the first cut target (reducing attention budget cost).

---

## Section 8 — Sprint metrics

| Metric | Value |
|--------|-------|
| Phases run | 4 (Phase 0 backup + Phase 1 design + Phase 2 teardown + Phase 3 build + Phase 4 deliverables) |
| Concept gate resolved | 1 (Phase 1 end — user picked K-A + accept-all-6-risks + keep-PNG) |
| End-of-phase gates output | 1 (Phase 3 — planned-vs-implemented beat table + honesty + distinctness self-checks) |
| Pre-phase backups created | 3 (Phase 0, Phase 2, Phase 3) |
| Files created | 3 (1 JS module + 2 sprint docs) |
| Files modified | 4 (styles.css, work/ghost.html, canonical-motion-spec.md, learnings.md) |
| Files deleted | 0 (PNG asset preserved per user direction) |
| Markup deltas — work/ghost.html | -3 lines teardown, +51 lines K-A widget = +48 net |
| CSS deltas — styles.css | +182 lines for K-A block |
| Cache-bust monotonic bumps | 1 (v=59 → v=60) |
| Engine primitives used | Cursor, Choreography, LoopObserver, prefersReduced, getCenterOf |
| Engine primitives DELIBERATELY not used | Marker, Popup, blurCrossfade (distinctness signature) |
| HTTP smoke endpoints | 7/7 200 OK |
| Node syntax checks | 1/1 PASS |
| Gesture signatures on the case study page after this sprint | 4 (action / additive build / subtractive fade / pointwise edit) |

---

*End of sprint report. Production deploy NOT executed per sprint constraints. Final visual review is Rotem's call. Page coherence: 5 cursor-loops + comparison slider + chip toolbar, all light-system, no static assets on the case study spine.*
