# Pulse Animation Reconception · Design Spec

**Date:** 2026-05-29
**Status:** FINAL. Loop set + target locked. Folds in the Benji body-demo discipline, the canonical motion constants, and the zero-static-screenshots policy. Buildable.
**Builds on:** `2026-05-28-pulse-animation-reconception-concept.md`.
**Baseline:** clean `v=63` working tree (260-line `work/pulse.html`), verified by the 2026-05-29 rollback.
**Bar:** Ghost. Build, point, wait. Every loop is the designer's hand on a real component, interview-defensible in 30 seconds.

---

## The approved set

| Section | Loop | Signature | Cursor as | Argues |
|---|---|---|---|---|
| Hero | ai-fly (UNTOUCHED) | #1 Action execution | AI / product | "Ask Pulse, it flies to the issue." |
| Solution | D1 wireframe fidelity (RE-HOMED) | #2 Additive build | Designer | "I made the Observatory's content real so the heatmap reads as analysis." |
| Pivot | Subtractive collapse (NEW) | #3 Subtractive whole-element fade | Designer | "I scrapped the conventional dashboard." |
| Design Process | Annotate-execute (NEW) | #5 Annotate-and-delegate | Designer | "I built Pulse with my two-Claude method: I annotate, Claude Code executes." |

Four motion-bearing loops, three the designer's hand. After the zero-static cuts (§8) the page's ONLY visuals are the hero clip plus these three loops: **all motion, zero product-UI statics, 75% cursor-as-designer**, four cleanly distinct signatures. Four-act in render order: Pulse runs (hero) → I made its substrate real (Solution) → I scrapped the conventional version (Pivot) → here is my method (Design Process). The page closes on the method beat.

---

## 1. Body-demo discipline (applies to all three loops)

From `2026-05-25_benji-componentization-philosophy.md` and the hero-vs-body framework in `design-decisions.md`. This is the discipline the rejected View Modes demo violated; it is non-negotiable here.

- **One component.** Each loop shows ONLY the component its surrounding prose discusses. No sidebar, no app nav, no surrounding dashboard.
- **Chrome:** a minimal browser-bar (Mac traffic lights + a semantic localhost URL slug, e.g. `localhost:3000/observatory`, `localhost:3000/diagnosis`) frames the demo as a screen. That is the ONLY chrome. D1's existing `wf-widget-browser-bar` is the pattern.
- **Height:** ~330px (Benji's `.demo-window` baseline; matches Ghost's body demos). NOT 16:10-derived, NOT hero-scale.
- **Duration:** 6-10s loop. 3-5 beats (the annotate-execute loop is the exception, see §6).
- **First action:** sub-500ms. No hero-style introduction beat. The cursor starts at or just outside the demo edge and moves almost immediately.
- **Fidelity:** wireframe with strategic real text. Faux gray-bar placeholders for context; real text ONLY where it carries semantic load (the annotation note, a code line, "Applied", a component name, orientation labels). Do not reproduce pixel-perfect product content.
- **Caption:** one italic line below, ≤15 words, declarative verb-first.

---

## 2. Canonical motion constants (cite these in the build; do not re-derive)

From `design-decisions.md` · Verified motion specifications and `canonical-motion-spec.md` §2. The engine already implements these; the build must honor them on every new beat.

- **Cursor traversal (between on-screen targets):** ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`, ~440ms. NOT pure ease-out (the diagnosed V2 mechanical-feel error).
- **Click feedback:** stamp. Cursor `translateY(5px)` + shadow shift; the TARGET element compresses `scale(0.97)`. Two distinct responses to one click. (`clickStamp` in the engine.)
- **Multi-step rhythm:** snap-pause-snap, NOT metronome. The ~600ms gap between steps is the load-bearing pause; the pause is the work.
- **Major state transition:** `blur(16px)` @ 250ms (`blurCrossfade(BLUR_HEAVY)`). Minor crossfade: `blur(2px)` @ 200ms (`BLUR_LIGHT`).
- **Button press:** `scale(0.97)` @ 160ms. **Entry scale:** never below `0.93`. **Max UI duration:** under 300ms. **Exit:** ~20% faster than entrance. **Overshoot/anticipation:** 2-5% past target via `cubic-bezier(0.34, 1.56, 0.64, 1)` @ 600ms (also the Popup show curve).
- **Architecture:** Single Unified Timeline via the Choreography engine (one master timeline, absolute beat timestamps, pause/resume), NOT raw setTimeout chains. Explicit zero-position reset at the loop seam (prevents state drift).
- **School:** Spatial Choreographers (Freiberg/Benji). Single-property morphs over opacity fades; 100-200ms staggers.

---

## 3. Engine and DOM conventions

Engine (`js/demos/_engine/index.js`, 13 exports): `Cursor, Choreography, LoopObserver, Popup, Marker, getCenterOf, pulse, crossfade, setPillPosition, blurCrossfade, BLUR_LIGHT, BLUR_HEAVY, prefersReduced`. Reuse only; no new primitives.

- `ROOT_ID`: camelCase, project + concept (`pulseWireframeFidelity`, `pulsePivotCollapse`, `pulseAnnotateExecute`).
- Widget chrome prefix: 2-3 letter mnemonic + `-widget-*` (`wf-widget-*`, `pv-widget-*`, `ae-widget-*`).
- Orchestrator targets: data-attributes (`[data-wf-fill]`, `[data-pv-furniture]`, `[data-ae-target]`).
- State classes: `.is-*` (`.is-hovered`, `.is-clicking`, plus loop-specific).
- Every loop: mirror-action seam (T=0 ≡ T=7000), `prefersReduced()` static end-state path, `LoopObserver` pause/resume offscreen, `SETTLE_MS = 770`.

The build grounds itself in the existing `wf-widget` markup/CSS (D1), the design tokens in `styles.css` (e.g. `#FAFAF8` warm off-white), the existing demo primitives (`.demo-cursor`, `.demo-comment-popup`, `.demo-marker`), and the OC-E / K-A / hero modules as pattern references.

---

## 4. Loop 1 · D1 wireframe fidelity, re-homed to Solution (KEEP the logic)

**Decision:** "I shifted the Living Observatory's wireframes from blueprint abstraction to stylized-but-real content, because the heatmap only reads as analysis once the content feels real."

Keep the proven loop logic in `pulse-wireframe-fidelity.js`. Changes:
1. **Re-home to Solution** (`#the-solution`, ~L130), after the framing prose. The Observatory is the Solution; substrate fidelity belongs here; it gives the prose-heavy top half a cursor-as-designer beat and escapes the Solution-loop feature-tour trap (it is content craft, not a tour).
2. **Re-add the markup** (rollback removed it; the module is the reference): `pulseWireframeFidelity`, `wf-widget-*`, four `[data-wf-fill]` slots (col-header, task-1, task-2, assignees), browser-bar slug `localhost:3000/observatory`.
3. **Right-size to ~330px** body-demo height (§1). Fixes the stretched frame from Sprint 3.

Loop unchanged: 7000ms, four-pick additive build, dwells 300/350/280/320, mirror seam, signature #2, precedent DP-B. D1 is deliberately the one loop that adds SOME real content (that is its subject), which is consistent with the strategic-real-text rule.

---

## 5. Loop 2 · Pivot subtractive collapse (NEW)

**Decision:** "Version one was competent and forgettable. I scrapped the monitoring-dashboard pattern and rebuilt it as an investigation canvas." The bravest decision in the case study.

**Signature:** #3 subtractive whole-element fade. Precedent: OC-E.

**Surface (designed-down, lean — not a sprawling dashboard).** A stylized DOM/SVG V1 Calm Command Center: dark chrome plus three pieces of conventional monitoring furniture (confirmed present in the V1 contact-sheet screenshot). Beneath, the V2 Living Observatory canvas sits masked and dim. Browser-bar slug `localhost:3000` (V1) crossfading toward the V2 view. The three furniture targets:
1. Health-ring donut
2. Severity pills row
3. Sparkline

Each clear is a real rejection judgment: an investigation surface needs none of these.

**Timeline (7000ms):**

| Beat | T (ms) | Action |
|---|---|---|
| 1A | 0 | Cursor → health-ring (440ms ease-in-out) |
| 1A' | 440 | Dwell 320ms (decisive, first cut) |
| 1B | 760 | clickStamp + health-ring clears (fade + scale-down ~300ms) |
| 2A | 1060 | Cursor → severity-pills (440ms) |
| 2A' | 1500 | Dwell 280ms (faster) |
| 2B | 1780 | clickStamp + severity-pills clear |
| 3A | 2080 | Cursor → sparkline (440ms) |
| 3A' | 2520 | Dwell 360ms (emphatic, last convention) |
| 3B | 2880 | clickStamp + sparkline clears |
| 4 | 3180 | Substrate swap: V1 chrome `blurCrossfade(BLUR_HEAVY)` to paper-on-cream; V2 wireframe + friction heatmap resolves where the furniture was (~600ms). Payoff. |
| 5 | 3830 | Cursor → rest (SETTLE 770ms) |
| 5' | 4600 | Arrive. Terminal absorption (~1600ms) on the V2 canvas |
| 6 | 6200 | Cleanup: substrate crossfades back to V1; furniture returns; reset |
| LOOP | 7000 | State matches T=0 |

Dwells 320/280/360. **Seam:** mirror-action (the reset crossfade is a seam mechanic, not a rhetorical reversal — OC-E precedent). **Markers:** none; the clearing + V2 reveal carries it.

**DOM:** `ROOT_ID = 'pulsePivotCollapse'`; `pv-widget-*`; `[data-pv-furniture="health-ring"|"severity-pills"|"sparkline"]`; `[data-pv-v2-canvas]`; states `.is-hovered`, `.is-clicking`, `.is-cleared`, `.is-cleanup`.
**Engine:** `Cursor, Choreography, LoopObserver, getCenterOf, prefersReduced, blurCrossfade, BLUR_HEAVY`. No Marker, no Popup.
**Reduced motion:** static end-state — V2 canvas visible, furniture absent, no cursor. Caption: "Version one was a conventional monitoring dashboard. The rebuild cut the gauges and pills for one investigation canvas."
**Honesty:** the three cleared elements are real V1 components V2 dropped; the loop dramatizes what was cut, the K-A / OC-E stylization.

---

## 6. Loop 3 · Annotate-execute (NEW, the centerpiece)

**Decision:** "I built Pulse with my two-Claude method: I annotate a component, Claude Code executes." Triple duty: a real Pulse design decision, the AI-augmented workflow (sharpest founding-designer signal), and the component-anchoring wedge (Pulse's whole thesis). Honest and tool-accurate: Pulse was built in Claude Code (confirmed against the files); the Process page documents the method.

**Signature:** #5 annotate-and-delegate (new). Cursor annotates (`Popup.typeInto`), then the agent executes (the hero's cascade). Distinct from the hero (#1): the hero is the product executing for a user; this is Rotem directing his build tool. Different agent, cursor identity, rhetoric.

**LOCKED target: anchor the wedge, on the diagnosis card.** The loop opens on a diagnosis that reads anonymously — "Drag target too narrow · 24px" (grounded in the real deep-dive surface, which names this exact issue + a 24px target-size fix + WCAG 2.1.1). The cursor annotates "name the component", Claude Code executes in the terminal, and the component identity binds: the diagnosis becomes "KanbanColumn · Drag target too narrow". Anonymous → component-attributed, which IS the wedge made visible.

**The Claude Code panel (legibility solution, Benji-precedented).** A compact Mac-styled terminal with a "Claude Code" header label (Benji's own hero contains exactly this — a Mac terminal with Claude Code branding). Visually distinct from Pulse's product UI (darker, terminal treatment) so no viewer mistakes it for a Pulse feature. One code-diff line, a spinner-to-check, "Applied". CSS prefix `ae-widget-cc-*`. Framing prose above the loop: "Pulse itself was built with my two-Claude method."

**Fidelity guardrail (critical — this is the loop most at risk of the View Modes density trap).** Keep it lean: ONE diagnosis component, wireframe fidelity. Real text ONLY on: the anonymous diagnosis line, the annotation note ("name the component"), the code-diff line, "Applied", the "Claude Code" label, and the bound component name ("KanbanColumn"). Everything else on the card = gray placeholders. Do NOT build a full diagnosis card with every badge, severity pill, and CTA.

**Timeline (7000-8000ms; this is the most beat-dense loop, so the typing-vs-absorption balance and the exact duration are the primary build-time tuning target, per the hero's r2.x precedent — it may land a touch longer than the others, still inside the 6-10s body range):**

| Beat | T (ms) | Action |
|---|---|---|
| 1A | 0 | Cursor → the diagnosis line (440ms ease-in-out) |
| 1A' | 440 | Dwell 350ms (the designer notices the gap) |
| 1B | 790 | clickStamp; annotation `Popup.show` (back-out 250ms) anchored at the line |
| 2 | 1040 | `Popup.typeInto("name the component")` at Benji's 50ms/char pace (~18 chars → 900ms) |
| 2' | 1940 | Typing done; 200ms hold; clickStamp "Add" (annotation commits) |
| 3 | 2390 | Claude Code terminal appears (`blurCrossfade` ~300ms), header "Claude Code", one code-diff line shown |
| 4a | 2690 | Execution: spinner (350ms) |
| 4b | 3040 | spinner → check; diff applies; "Applied" |
| 5 | 3390 | Diagnosis updates (`blurCrossfade(BLUR_HEAVY)` ~500ms): component name binds → "KanbanColumn · Drag target too narrow" |
| 6 | 3890 | Cursor → rest; terminal + annotation fade (SETTLE 770ms) |
| 6' | 4660 | Arrive. Terminal absorption (~1700ms) on the anchored diagnosis |
| 7 | 6360 | Cleanup: diagnosis reverts to anonymous; terminal + annotation removed; reset |
| LOOP | ~7000-8000 | State matches T=0 |

**Rhythm:** the hover (350), the typing pace (the distinctive Benji beat — protect it), the execution steps (snap-pause-snap, ~350ms). **Seam:** mirror-action; diagnosis reverts, terminal clears.
**DOM:** `ROOT_ID = 'pulseAnnotateExecute'`; `ae-widget-*` (diagnosis) + `ae-widget-cc-*` (terminal); `[data-ae-target]`, `[data-ae-cc-panel]`, `[data-ae-cc-step]`, `[data-ae-diff]`; browser-bar slug `localhost:3000/diagnosis`; states `.is-hovered`, `.is-clicking`, `.is-annotated`, `.is-executing`, `.is-applied`, `.is-cleanup`.
**Engine:** `Cursor, Choreography, LoopObserver, Popup, getCenterOf, blurCrossfade, BLUR_HEAVY, prefersReduced`. The annotation uses the existing `Popup` (its `typeInto` is the Benji mechanic). No separate Marker.
**Reduced motion:** static end-state — the diagnosis in its anchored state ("KanbanColumn · Drag target too narrow"), a static annotation note, a static "Claude Code · applied" label, no cursor. Caption: "I built Pulse by annotating components and letting Claude Code execute the change."
**Honesty:** dramatizes the real two-Claude workflow; the annotate-then-instant-execute is a stylization of the diagnose-propose-execute protocol (K-A / OC-E precedent). The cursor + terminal must read as Rotem building the anchoring into Pulse, not Pulse auto-anchoring.

---

## 7. Hero · untouched

`ai-fly.mp4` stays exactly as shipped (signature #1, the sanctioned product opener). A motion clip, which the zero-static policy endorses. No change.

---

## 8. Page composition · zero-static cuts (per the zero-static-screenshots policy)

`design-decisions.md` prohibits static product-UI screenshots; beats that don't earn animation go prose-only. The clean baseline carries several product statics plus two product videos. Resolve them so the page is all-motion:

- **Image-trio (L145-149: home-task-board, layer-rage, card-broken PNGs)** → CUT to prose-only. Product statics, prohibited, and redundant with D1 (Solution) + the hero, which already show the canvas and a layer.
- **V1/V2 diptych (L155-162)** → already REPLACED by the Pivot loop.
- **`compare.mp4` (L137-143)** → CUT to prose-only. Redundant: the Pivot and annotate-execute loops already carry before/afters.
- **`deep-dive.mp4` (L176-182)** → CUT to prose-only. The annotate-execute loop carries the code-execution surface; the prose carries the rest of the depth (Fitts's Law, ranked fixes, WCAG verification).

Result: the page's only visuals are the hero clip + the three loops. All motion, zero product statics. The Solution, Pivot, Design Process, and Outcome prose absorb whatever the cut statics were communicating (it is mostly redundant with the loops). This is a judgment call on the videos (keeping them as motion would also satisfy the policy, at 50% cursor-as-designer); cutting is the leaner, Benji-disciplined choice and is reversible.

---

## 9. Page-level distinctness and honesty

**Distinctness:** four cleanly distinct signatures (#1 hero, #2 D1, #3 Pivot, #5 annotate-execute), no within-page collision. Cross-page reuse of #2 (D1 / DP-B) and #3 (Pivot / OC-E) is the soft gate, acceptable. #5 is distinct from #1 on agent, cursor identity, and rhetoric.

**Honesty (per loop):** D1 fully defensible; Pivot defensible with the what-was-cut framing; annotate-execute defensible and tool-accurate. Prose guardrail: avoid the "12 phases / 60fps / built-both-then-merged" overclaims.

---

## 10. Build sequence (Sprint 3, portfolio chat)

Phase gates between each, pre-phase backups, planned-vs-implemented beat tables, cache-bust lockstep across all 11 HTML, reduced-motion + IO + the §2 motion constants on every loop.

- **0 · Cleanup.** Delete the orphan `pulse-layer-chips.js`. Confirm clean tree.
- **A · Markup.** Re-home D1 into Solution; build `pulsePivotCollapse` into the Pivot section; build `pulseAnnotateExecute` (anonymous diagnosis + Claude Code terminal) into Design Process; cut the image-trio + both videos to prose-only (§8); add browser-bar slugs.
- **B · CSS.** `pv-widget-*`, `ae-widget-*` + `ae-widget-cc-*` (the distinct Mac-terminal treatment), ~330px body-demo sizing for all three loops, the §2 constants, reduced-motion + mobile blocks. Bump cache-bust `v=63` → `v=64` across all 11 HTML in lockstep.
- **C · JS.** `pulse-pivot-collapse.js` (§5); `pulse-annotate-execute.js` (§6, compose Cursor + Popup + the cascade); confirm D1 wiring. Engine imports only.
- **D · Integration.** Wire all three; verify IO pause/resume, mirror seams, reduced-motion paths.
- **E · Visual review (Rotem).** ~330px sizing reads right at three widths; the annotate-execute typing pace and the terminal distinction land; all loops read as the designer's hand; the four bars hold; the page reads coherent and all-motion.
- **F · Deploy (Rotem's call).** `vercel` preview, verify, then `vercel --prod`. Ships the whole clean site in one pass and closes the disk-ahead-of-prod gap safely.

---

## 11. Open items

- None blocking. Target locked (anchor the wedge), discipline + constants + policy folded in.
- Save this final spec over the disk copy before the build session.

---

*End of design spec. FINAL, 2026-05-29. Sprint 3 builds against these beats.*
