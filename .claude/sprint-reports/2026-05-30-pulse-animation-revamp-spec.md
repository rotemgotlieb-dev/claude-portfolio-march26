# Pulse Animation Revamp · Design Spec (v2 of the reconception)

**Date:** 2026-05-30
**Status:** FINAL. The 2026-05-29 spec is **superseded**. Backup at `_archive/_pre-spec-revamp-2026-05-30/sprint-reports/2026-05-29-pulse-animation-reconception-spec.md`.
**Replaces:** the 2026-05-29 spec's D1 (wireframe fidelity) and Pivot (subtractive collapse) loops. Annotate-Execute survives unchanged.
**Trigger:** at visual review of the 2026-05-30 build, the user flagged that D1 and Pivot felt pointless. Both were abstract operations on abstract wireframes with crossfade-based "transitions" that did not read as the designer's hand at work. Annotate-Execute landed because it shows a real designer command, on a real component, executed by a real tool, with a real component-level result.
**Bar:** Ghost. Real transformation, not crossfade. Every loop is interview-defensible in 30 seconds. At least half cursor-as-designer (this spec ships 3 of 3).
**Reading order:** [.claude/principles.md](../principles.md) → this spec → [.claude/CLAUDE.md](../CLAUDE.md) → [.claude/research/2026-05-25_benji-componentization-philosophy.md](../research/2026-05-25_benji-componentization-philosophy.md).

---

## The approved set

| Section | Loop | Signature | Cursor as | Argues |
|---|---|---|---|---|
| Hero | ai-fly (UNTOUCHED) | #1 Action execution | AI / product | "Ask Pulse, it flies to the issue." |
| Solution | **Compose (NEW, replaces D1)** | #2 Annotate-and-delegate | Designer | "I add a heatmap layer with a sentence, and the canvas responds." |
| Pivot | **Rebuild (NEW, replaces Pivot)** | #3 Annotate-and-morph | Designer | "I told the dark dashboard to become one canvas. It did." |
| Design Process | Anchor (KEEP, pulse-annotate-execute.js) | #5 Annotate-and-delegate | Designer | "I built Pulse with my two-Claude method: I annotate, Claude Code executes." |

**Three of three body loops are now cursor-as-designer.** The hero remains the only "product on autopilot" surface, which is the correct slot for that gesture (it is the product hero, not a process loop).

Within "annotate-and-delegate," the three loops are **rhetorically distinct** even though the gesture-signature category is shared: Anchor binds an attribute on a component (component identity), Compose materializes a new visual layer on a canvas (visual composition), Rebuild morphs a whole interface into a different interface (strategic direction). Same cursor, three different scales of designer action. This is intentional, not a distinctness violation, because the visual outcome of each is unmistakably different.

---

## 1. The cursor-as-designer pattern (single source of truth)

All three body loops follow the same five-beat shape so the visual language is consistent. Each loop's content fills in what the beats DO; the beats themselves are fixed.

| Beat | Action | Mechanism | Duration target |
|---|---|---|---|
| 1 · point | Cursor traverses to the target element on the surface | `cursor.moveTo(x, y)` ease-in-out 440ms | ~440ms |
| 2 · annotate | clickStamp + `Popup.show()` anchored to the target | `cursor.clickStamp()` + `Popup.show({ x, y, header })` | ~250ms transition + dwell |
| 3 · type | `Popup.typeInto(command)` at 50ms/char (Benji pace) | The designer's voice in the popup | command-length-dependent (~600 to 900ms) |
| 4 · commit | 200ms hold + clickStamp on "Add" + popup hides | `cursor.clickStamp()` + `Popup.hide()` | ~350ms |
| 5 · respond | **Real transformation on the surface.** Class-toggle on the root drives a coordinated multi-property morph in CSS. Hard rule: no crossfade. No `opacity: 0 → 1` swap without a coordinated transform or shape change. | `root.classList.add('is-responded')` | ~600 to 1200ms (snap-pause-snap pause IS the response) |
| 6 · settle | Cursor returns to rest (770ms SETTLE). Long absorption (~1500 to 1800ms) on the responded state, which is the rhetorical payoff. | `cursor.moveTo(rest.x, rest.y, { duration: 770 })` | 770ms move + absorption |
| 7 · cleanup | Class-toggle on root reverses the state back to T=0. Iteration N+1 starts with `resetAllState()`. | `root.classList.remove('is-responded')` + `root.classList.add('is-cleanup')` | ~600ms |

**LOOP_DURATION: 7000ms** (matches Anchor; consistent across all three loops for visual rhythm).

The Single Unified Timeline architecture remains in force: one Choreography instance per loop, all beats live on one master timeline, `resetAllState()` is the first call of every iteration, IntersectionObserver pauses + resumes from elapsedMs.

---

## 2. Canonical motion constants (cite, do not re-derive)

From [.claude/canonical-motion-spec.md §2](../canonical-motion-spec.md) and the [Cursor easing by context](../CLAUDE.md) standing rule.

- **Cursor traversal:** ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`, ~440ms.
- **Click feedback:** stamp via `cursor.clickStamp()` (translateY 5px + shadow shift); target compresses `scale(0.97)` if it is a button.
- **Popup show:** back-out `cubic-bezier(0.34, 1.56, 0.64, 1)` @ 250ms.
- **Multi-step rhythm:** snap-pause-snap. The 600 to 1000ms pause between trigger and result is load-bearing.
- **Blur:** `blur(16px)`/250ms major, `blur(2px)`/200ms minor. **Reserved for state-class swaps inside an element (e.g. anonymous diagnosis fades to bound diagnosis); NOT for whole-element substitution.**
- **Entry scale:** never below 0.93.
- **Stagger:** 100 to 200ms between sibling sub-transformations in a coordinated morph (Spatial Choreographers school).
- **Reduced motion:** static end-state per loop. No timeline runs. The static end-state honestly represents the designer's final outcome for that loop.

---

## 3. The real-transformation rule (the load-bearing engineering bar)

This is the bar the 2026-05-29 build failed. Codified here so it cannot be silently traded away.

**Real transformation means:** a property morph in which an element's shape, geometry, or visible structure genuinely changes between the before and after state, NOT a substitution of one element for another via opacity.

**Allowed:**
- SVG path radius / position / color interpolation (e.g. heatmap blobs growing).
- DOM element `transform: translate + scale + rotate` from layout-position-A to layout-position-B (Spatial Choreographer morph).
- `width` / `height` / `border-radius` transitions on the same element so its silhouette becomes a different silhouette.
- `clip-path` shape morphs.
- Background-color or fill-color transitions (color is a real property morph).
- CSS variable transitions (e.g. `--gauge-fill: 0% → 100%` with `transition: --gauge-fill 600ms`).

**Disallowed:**
- `.element-a { opacity: 1 → 0 }` paired with `.element-b { opacity: 0 → 1 }` is a crossfade. Not a transformation. **Cut.**
- `display: none / block` toggling for content swap. Same problem, even harsher.
- `filter: blur(16px)` followed by an opacity swap is still a crossfade with a blur skin on it. Allowed ONLY inside an element where the content visibly inherits position (e.g. Anchor's anonymous → bound diagnosis line where both sit in the same headline slot). Not allowed for whole-surface swaps.

The Pivot loop in the 2026-05-29 spec used `is-swapped` to crossfade V1 → V2 with blur. That was the structural failure. The Rebuild loop fixes it by morphing V1 elements INTO V2 elements via transform.

---

## 4. Loop 1 · Compose (NEW, replaces D1, lives in the Solution section)

**Decision:** "I add the rage-click layer to the Observatory by telling it to. The heatmap materializes, the hot zone sharpens. That's how Pulse works AND how I built it."

**Surface (~330px tall, body-demo discipline):** the Living Observatory canvas in a browser-bar frame. The canvas is a designed-down vanilla recreation of the V2 hero: a paper-on-cream background, 4 wireframe columns (re-using the spec §4 wireframe styling from the prior D1, BUT without the fill-content beats — wireframe is already at full fidelity here, because the Solution prose names that work in text), a faint friction heatmap (`#ff7a2c` radial gradient ellipses) already on the canvas at T=0, layer chip strip at top reading `Friction · Rage · Dead · Attention` with only Friction active. Browser-bar slug `localhost:3000/observatory`.

**Hard rule for Compose:** the friction layer is on the canvas at T=0. The rage-click layer is what the designer adds. This separates "what's already there" from "what the designer's hand just made appear."

**Real-transformation mechanism (the rage-click layer materialization):**

1. **SVG group `<g class="rage-layer" data-rage>`** holds 4 to 5 ellipse hotspots, each with `r="0"` at T=0 and a target radius between 8 and 22 viewbox units.
2. On Beat 5 (the response beat), JS toggles `root.classList.add('is-composed')`.
3. CSS rule: `#pulseCompose.is-composed .rage-layer ellipse { r: var(--rage-target-r); transition: r 650ms cubic-bezier(0.77, 0, 0.175, 1); }` — the radius IS the property morph.
4. Each hotspot has a `transition-delay` between 0 and 300ms via `nth-child` or inline `style="transition-delay: 120ms"`, so the cluster STAGGERS in rather than fading in.
5. Color: an OKLab-derived warm gradient on the rage-layer's `<radialGradient>` definition, distinct from the friction layer (rage is hotter red `#e03d2a` core, friction is warmer orange `#ff7a2c` core).
6. The "sharpens" beat: `#pulseCompose.is-composed .rage-layer ellipse.center { r: var(--rage-target-r-sharp); }` after a 400ms hold — the center hotspot's radius contracts ~25% AND its `fill-opacity` ticks from 0.65 to 0.85. Tighter, hotter. Real morph.

The cursor's role: it points at a location on the canvas (the hot zone the rage layer will reveal), annotates "add the rage-click layer," commits. Then watches.

**Timeline (7000ms):**

| Beat | T (ms) | Action |
|---|---|---|
| 1 · point | 0 | Cursor → hot zone location on canvas (440ms) |
| 1' | 440 | Dwell 350ms (designer's noticing pause) |
| 2 · annotate | 790 | clickStamp; Popup.show anchored at the point (250ms back-out) |
| 3 · type | 1040 | Popup.typeInto("add the rage-click layer") @ 50ms/char (~24 chars → 1200ms) |
| 3' | 2240 | Typing done; 200ms hold |
| 4 · commit | 2440 | clickStamp on "Add"; Popup.hide |
| 5 · respond | 2740 | `.is-composed` on root. Rage layer materializes: ellipses grow from r=0, staggered 0/120/240/360/480ms (Spatial Choreographers). |
| 5' | 3340 | First hotspot reaches target; central hotspot continues to "sharpen" beat |
| 5'' | 3740 | "Sharpens" beat: central hotspot radius contracts 25% + fill-opacity 0.65 → 0.85 |
| 6 · settle | 4140 | Cursor → rest (770ms SETTLE) |
| 6' | 4910 | Arrive at rest. ~1450ms absorption on the new layer |
| 7 · cleanup | 6360 | `.is-cleanup` on root: rage layer ellipses contract back to r=0 (550ms). Iter N+1 reset wipes the class. |
| LOOP | 7000 | resetAllState() → T=0 |

**Framing prose (above the loop, in the Solution section):**

> "Adding a heatmap layer is a sentence to Pulse. I point at the canvas, name the layer I want, the canvas paints it in."

**Caption (below):**

> "I add the rage-click layer. The hot zone sharpens."

**DOM / engine contract:**

- `ROOT_ID = 'pulseCompose'`
- Markup prefix `cm-widget-*`; data attributes `[data-cm-canvas]`, `[data-cm-target]`, `[data-rage]`, `[data-rage-center]`
- State classes: `.is-hovered`, `.is-clicking`, `.is-composed`, `.is-cleanup`
- Engine imports (6): `Cursor, Choreography, LoopObserver, Popup, getCenterOf, prefersReduced`
- CSS owns ALL transitions (no `blurCrossfade` call). The class-toggle on root is the contract.
- Reduced motion: static end-state with the rage layer at its sharpened final state (no friction-layer-only baseline; viewer sees what the designer's hand made). No cursor, no popup.

---

## 5. Loop 2 · Rebuild (NEW, replaces Pivot, lives in the Pivot section)

**Decision:** "Version one was a competent monitoring dashboard. I told it to become one canvas. It became one canvas."

**Surface (~330px tall, body-demo discipline):** opens on the V1 Calm Command Center (dark sidebar 44px, dark canvas background `#15171F`, 4 dashboard furniture pieces: nav-pill strip, health-ring donut, severity-pills row, sparkline). Browser-bar slug `localhost:3000`. This is the V1 frozen as a designed-down vanilla mockup, NOT a recreation of the actual V1 (which was a full Next.js app). It is recognizable as the V1 contact-sheet's top-left tile.

**Real-transformation mechanism (V1 → V2 morph):**

The morph is **coordinated multi-property transitions** on the V1 elements themselves, driven by ONE class toggle `root.classList.add('is-rebuilt')`. Every V1 element has CSS transitions on the relevant properties. Staggered via `transition-delay` 0 to 400ms so the morph reads as a sequence, not a synchronized snap.

| V1 element | T (ms after `.is-rebuilt`) | Transformation |
|---|---|---|
| `.pv-widget-v1-sidebar` | 0ms | `translateX(-44px)` + `width: 0` (slides left, collapses). 500ms cubic-bezier ease-out. |
| `.pv-widget-v1-canvas` background | 100ms | `background-color: #15171F → #FAFAF8` (dark to paper-cream). 600ms ease. |
| `.pv-widget-v1-navbar` (nav pill strip) | 200ms | `transform: translateY(0)` + `height: 8px → 28px` + `background: #3A3E4C → #fdfcfa` + `border: 1px solid #e8e4dc` (morphs from a dark accent strip into the V2 AI prompt bar at the top of the canvas). 600ms. |
| `.pv-widget-furniture[data-pv-furniture="health-ring"]` | 200ms | `transform: scale(0.4) translateY(40px)` + `opacity: 1 → 0` (recedes downward into the cleared center). 500ms. This is a transform-and-fade, NOT a pure fade — the scale-down is the load-bearing real morph component. |
| `.pv-widget-furniture[data-pv-furniture="severity-pills"]` | 280ms | `transform: scale(0.4) translateY(40px)` + `opacity: 1 → 0`. 500ms. Same pattern, staggered. |
| `.pv-widget-furniture[data-pv-furniture="sparkline"]` | 360ms | `transform: scaleY(2) translateY(20px)` + `opacity: 1 → 0` (the sparkline stretches and dissolves into where the time scrubber will live, but no time scrubber is drawn in V2 — the sparkline's gesture is "I stretch into the scrubber's footprint and disappear"). 500ms. |
| `.pv-widget-v2-columns` (new V2 wireframe columns) | 500ms | `transform: scaleY(0) → scaleY(1)`, `transform-origin: bottom` (extrude up from the bottom into the cleared canvas center). Staggered per-column 0/80/160/240ms via `nth-child`. 700ms total. |
| `.pv-widget-v2-heat` (friction heatmap blob) | 1100ms | `r="0" → r="target"` on SVG ellipse + `opacity: 0 → 0.5`. 600ms. This is the last beat of the morph — the heatmap materializing IS what makes the canvas read as the Observatory. |

**Total response beat duration: ~1700ms** (from `.is-rebuilt` apply to heatmap landing). Long but rhetorically load-bearing — this is the strategic-direction beat of the whole case study, and the snap-pause-snap rhythm demands a long visible "work happening" pause for the labor illusion to land.

**Timeline (7000ms):**

| Beat | T (ms) | Action |
|---|---|---|
| 1 · point | 0 | Cursor → V1 dashboard (lands near the health-ring) (440ms) |
| 1' | 440 | Dwell 350ms (the designer's strategic-pause) |
| 2 · annotate | 790 | clickStamp; Popup.show (250ms back-out) |
| 3 · type | 1040 | Popup.typeInto("make this one canvas") @ 50ms/char (~21 chars → 1050ms) |
| 3' | 2090 | Typing done; 200ms hold |
| 4 · commit | 2290 | clickStamp on "Add"; Popup.hide |
| 5 · respond | 2590 | `.is-rebuilt` on root. The morph begins (per the table above). |
| 5' to 5''' | 2590 to 4290 | Morph sub-beats stagger (sidebar slides, bg color shifts, furniture recedes, columns extrude, heatmap blooms) |
| 6 · settle | 4290 | Cursor → rest (770ms SETTLE) |
| 6' | 5060 | Arrive at rest. ~1300ms absorption on the V2 canvas |
| 7 · cleanup | 6360 | `.is-cleanup` on root. The morph reverses (everything transitions back to V1 state). Iter N+1 reset wipes the class. |
| LOOP | 7000 | resetAllState() → T=0 |

**Framing prose (above the loop, in the Pivot section):**

> "I told the dark dashboard to become one canvas."

**Caption (below):**

> "Version one was Linear meets Datadog. The rebuild is one canvas."

**DOM / engine contract:**

- `ROOT_ID = 'pulseRebuild'`
- Markup prefix `rb-widget-*`; data attributes `[data-rb-stage]`, `[data-rb-v1-target]`
- State classes: `.is-hovered`, `.is-clicking`, `.is-rebuilt`, `.is-cleanup`
- Engine imports (6): `Cursor, Choreography, LoopObserver, Popup, getCenterOf, prefersReduced`
- CSS owns ALL transitions. Cleanup reverses the morph via the same transitions in reverse. No `blurCrossfade` call.
- Reduced motion: static end-state is V2 (the rebuild's outcome). Viewer sees the designer's final answer. No cursor, no popup.

---

## 6. Loop 3 · Anchor (KEEP, the centerpiece, no changes)

`pulse-annotate-execute.js` + the AE markup + CSS Blocks 10 to 16 + the static annotation surface remain unchanged. This loop earned its place at visual review; we keep it verbatim. The 2026-05-29 spec §6 is still the authoritative description.

---

## 7. Hero (KEEP, untouched)

`ai-fly.mp4` stays exactly as shipped. No change.

---

## 8. Page composition

The 2026-05-29 zero-static cuts are preserved: no image-trio, no compare.mp4, no deep-dive.mp4 in body, no V1/V2 diptych. The page's only visuals are the hero clip + Compose + Rebuild + Anchor. All motion, zero product statics.

Framing prose sits **directly above** each loop's container per the [Case study page composition rule](../CLAUDE.md). Captions sit directly below.

---

## 9. Distinctness and honesty

- Signatures: hero is #1, the three body loops are all variants of "annotate-and-delegate" (#5). Within #5, they argue at three different scales (component identity / visual layer / whole-interface strategic direction). The viewer never has to ask "wait, is this Pulse running or is this Rotem working?" — the cursor + popup gesture answers that consistently across all three.
- Honesty: every command in a popup is a real designer thought. "name the component" was a real design decision Rotem made about Pulse's diagnosis system. "add the rage-click layer" is a real Pulse interaction (the AI prompt bar genuinely does this in V2). "make this one canvas" is the real strategic call Rotem made between V1 and V2. The loops dramatize real decisions; they do not fabricate.

---

## 10. Build sequence

Phased, gated, with backups and planned-vs-implemented reports per the engineering discipline. Self-improvement loop updates spec + learnings as we go.

- **0 · Backups.** Pre-revamp snapshot of `work/pulse.html`, `styles.css`, all 11 HTML, both prior JS modules. Tag the archive `_pre-pulse-revamp-2026-05-30`.
- **A · Cleanup.** Archive `pulse-wireframe-fidelity.js` and `pulse-pivot-collapse.js` to `_archive/`. Delete from `js/demos/` (script tags will be replaced in step C).
- **B · Markup.** Replace the `#pulseWireframeFidelity` container with `#pulseCompose` (Compose); replace `#pulsePivotCollapse` with `#pulseRebuild` (Rebuild). Reuse the V2 wireframe + V1 dashboard markup from the existing CSS — we already have a substrate to map onto. Update framing prose and captions per §4 and §5.
- **C · CSS.** Replace CSS Blocks 1 to 11 (D1 + Pivot styles) with new Compose + Rebuild blocks. **Append-only where possible**; the prior blocks get deleted in a single edit pass with the new blocks landing in the same location. Preserve Blocks 10 to 16 (AE) verbatim. Bump cache-bust `v=65` → `v=66` across all 11 HTML in lockstep.
- **D · JS.** Write `pulse-compose.js` (~220 lines, mirrors annotate-execute.js shape). Write `pulse-rebuild.js` (~220 lines, same shape). Engine imports only; no new primitives. Cache-bust each at `?v=66` to match.
- **E · Integration.** Wire script tags in pulse.html. Live-verify on local server: zero console errors, IO pause/resume mid-timeline, mirror-seam no-drift across two iterations, reduced-motion end-states with no cursors.
- **F · Self-review with Playwright.** Desktop (1200px) and mobile (375px). Screenshot at each beat. Compare frame-by-frame to the spec table. Flag any deviation; iterate.
- **G · Hand to user for eyeball.** Browser review. Iterate on feel until it lands.
- **H · Deploy** (user's call). `vercel` preview, verify, then `vercel --prod`.

---

## 11. Open items (none blocking)

- Exact OKLab gradient stops for rage-click layer (red orange palette, hotter than friction). Tune in CSS during build step C.
- Exact `transition-delay` values for Rebuild morph staggers. Tune in self-review step F until the cascade reads as one coordinated act, not a series of independent fades.
- Whether the Rebuild morph's "cleanup" beat (reversing back to V1) is rhetorically right or whether a hard snap-back reads cleaner. Decide during self-review.

---

*End of spec. FINAL, 2026-05-30. The 2026-05-29 spec is archived. This is the source of truth going forward.*
