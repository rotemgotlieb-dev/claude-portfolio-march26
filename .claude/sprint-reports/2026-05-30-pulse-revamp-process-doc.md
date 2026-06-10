# How Pulse's case-study animations were built · A process record

**Date completed:** 2026-05-30
**Designer:** Rotem Gotlieb
**Build collaborator:** Claude Code (Opus 4.7)
**Output:** Three cursor-as-designer autoplay loops + one interactive widget on [work/pulse.html](../../work/pulse.html), all reusable across future case studies via a vanilla JS engine in [js/demos/_engine](../../js/demos/_engine).

This document captures the build's through-line as a portfolio surface: what shipped, what failed, what got promoted to a permanent rule. Adapt freely for a public-facing post.

---

## The three loops, in render order

| Loop | Section | What the cursor does | What the loop argues |
|---|---|---|---|
| **Compose** | The Solution | Annotates the canvas with "add the rage-click layer," watches the layer materialize, hovers a hot zone to read component-level data, clicks Friction to reset | "The heatmap is a sentence to Pulse. I name the layer, the canvas paints it in." |
| **Rebuild** | The Pivot | Annotates the dark V1 dashboard with "make this one canvas," watches V1 morph into V2 with real geometric transitions, examines the new AI prompt bar as it materializes | "I scrapped a conventional monitoring dashboard. The rebuild is one investigation canvas." |
| **Anchor** | Design Process | Annotates a diagnosis line with "name the component," watches Claude Code execute three coordinated changes (component identity, instance count, WCAG citation) | "I built Pulse with my two-Claude method. I annotate, Claude Code executes." |

A fourth element (interactive Living Observatory mini-canvas, in Try the Observatory) lets the viewer toggle each heatmap layer themselves. That's the only piece on the page where viewer input drives the visual.

---

## Build timeline (six rounds, one direction reset)

**Sprint 1 (2026-05-28):** spine locked. Hero, three body loops, no static product screenshots, all motion. Three of three body loops cursor-as-designer.

**Sprint 2 (2026-05-29):** spec authored, locking the four loops, the engine reuse contract, the §3 real-transformation rule (no opacity crossfades for whole-element swaps), the body-demo discipline (~330px, browser-bar chrome only, 6 to 10 second loops, 3 to 5 beats, first action under 500ms).

**Sprint 3 v1 (2026-05-30 morning):** first end-to-end build via Workflow tool. Three agents in parallel: compose-author, rebuild-author, adversarial spec-verifier. Workflow produced clean v1 with one medium finding (cached coords for animated element) and a few low findings. Integration landed.

**Round 1 (2026-05-30 morning):** rage-layer + heatmap circles invisible. Two failed-fix cycles trying CSS r-attribute transitions and CSS transform:scale. Diagnostic-only probe at N=2 identified the actual bug: `<ellipse>` doesn't have an `r` attribute (silently ignored), `<circle>` does. One-letter markup change fixed it.

**Round 2 (2026-05-30 afternoon):** four polish fixes shipped together. Logical-causation rule established (popup never dismisses without a visible click on its dismiss control). Compose got a heatmap legend, Rebuild got an on-canvas outcome label naming the strategic shift, Anchor got three cascading metadata pills (247 instances, WCAG 2.5.5, Medium severity) so the bind reads as systemic awareness, not a label change.

**Round 3 (2026-05-30 afternoon):** human-pacing rule established. Cursor move-to-Add hop slowed from 250ms to 500ms, 200ms hover dwell added before the click, clickStamp animation extended from 200ms to 300ms so the press is visibly deliberate. All three loops extended from 7000ms to 7500ms to absorb the slower click sequence.

**Round 4 (2026-05-30 evening):** dead-zone rule established. Loop 1 grew a data-tooltip beat (cursor hovers the central rage blob, real Pulse data surfaces with WCAG citation). Loop 2 cursor now follows the morph to the V2 prompt bar (placeholder text fades in: "Ask Pulse what to investigate next..."). Eliminated cursor idle windows in both.

**Round 5 (2026-05-30 evening):** timing-tighten rule established. Loop 1's tooltip wasn't getting enough visible time (1500ms) because the cursor was idle 1500ms after the Add click before moving to the blob. Shifted the cursor-to-blob beat 940ms earlier. Tooltip visible window extended to 2440ms. Post-Add dead zone shrunk to 560ms. Both wins from one timing edit.

**Round 6 (2026-05-30 evening):** interactive Living Observatory mini-canvas added. Viewer can click each of four layer chips (Friction / Rage / Dead / Attention) to toggle the corresponding heatmap on or off. Multiple layers stack. Hover a blob for component-level data. The interactive widget puts the viewer in the designer's seat.

---

## Standing rules promoted from this build

Every rule below was discovered while building Pulse and is now permanent for any future case study work on this site.

1. **Logical causation rule.** Every UI state change must be visibly caused by a cursor action on the responsible target. Popups dismiss only on a visible click. State changes without visible causation read as glitchy.

2. **Human cursor-pacing rule.** Secondary-target hops 450 to 550ms (not 250ms). Hover dwell before every click 200 to 250ms (not 0). clickStamp 280 to 320ms (not 200ms). Sub-300ms cursor moves read as scripted, not human.

3. **Cursor dead-zone rule.** When the cursor would be idle more than ~1 second, replace with motion, a tooltip, or an activating element.

4. **Tighten dead-zone before high-information beats.** When a tooltip / callout / code diff follows a cursor traversal, shift the traversal earlier. The dead zone shrinks AND the information stays on screen longer. Two wins from one edit.

5. **SVG primitive selection.** Circles use `r`, ellipses use `rx`/`ry`. Mixing them is silent: invalid attributes are ignored. Prefer `<circle>` for radial heatmap blobs.

6. **Real transformation over crossfade.** Whole-element opacity 0 to 1 substitution is banned for state swaps. Property morphs (radius / transform / color / clip-path) are required. The V1 to V2 Rebuild morph is the canonical example: every V1 element transforms (translate / scale / color) into V2 via CSS transitions, with opacity as the secondary skin.

7. **Diagnostic-only protocol at N=2.** When a fix fails and the symptom persists, the second session must be diagnostic-only. No code changes. Instrument, reproduce, collect a state vector. The cost of one diagnostic session beats the cost of three failed fix cycles.

8. **Cache-bust in lockstep.** When CSS changes, bump the version query string on all 11 HTML files in the same edit pass.

9. **Backups before any phase that touches existing files.** `_archive/_pre-{phase-name}-{date}/` snapshots make every change reversible.

10. **Cursor z-index ABOVE popup.** The cursor metaphor IS the designer's hand and naturally renders above every element it touches.

All rules are codified in [.claude/learnings.md](../learnings.md) with full provenance, and the entry-point document [.claude/principles.md](../principles.md) cross-references each one.

---

## Architecture under the hood

The site is vanilla HTML + CSS + JS, no frameworks. The animation engine lives at [js/demos/_engine](../../js/demos/_engine):

- **Cursor** — DOM-rendered cursor with eased motion via CSS transitions on left/top, clickStamp animation (translateY 5px + shadow shift), and snap/show/hide controls
- **Choreography** — single-pass timeline runner with pause/resume from elapsedMs offset, reset callback, and label-based offset semantics
- **LoopObserver** — IntersectionObserver wrapper that pauses choreography when the loop scrolls out of view and resumes on scroll-back-in
- **Popup** — Benji-style comment popup with show/hide/typeInto, back-out entry curve
- **Marker** — numbered annotation pins (used in other case studies)
- **motion utilities** — getCenterOf, pulse, crossfade, blurCrossfade, BLUR_LIGHT, BLUR_HEAVY
- **reduced-motion** — `prefersReduced()` gate

Each loop is a self-contained ES6 module in [js/demos/](../../js/demos/) that imports the engine primitives, defines its timeline beats, and wires the LoopObserver. The Single Unified Timeline architecture means every loop has one master timeline that owns all animated properties; pausing the loop pauses everything; an explicit `resetAllState()` runs as the first action of every iteration to prevent state drift across loop seams.

---

## What I'd do differently if rebuilding

The first end-to-end build had a silent rendering failure (the SVG `<ellipse r="N">` bug) that took two failed-fix cycles to diagnose. The fix was a one-letter markup change once the root cause was identified. The lesson: instrument earlier. The Recurring Bug Rule says invert to diagnostic-only at N=2, not N=3+. On this build I diagnosed at N=2, which is correct, but I should have diagnosed at N=1 because the symptom (invisible layer) was distinctive enough to warrant immediate investigation.

The other lesson: the Workflow tool with parallel agents + adversarial spec-verifier is the right default for substantive multi-component builds. It produced a working v1 in one shot and the verifier caught a medium finding before I integrated. That pattern compounds — every future case study build will use the same shape.

---

*Adapt freely. For a public-facing version, trim the engineering specifics and lead with the loop arguments + the standing rules.*
