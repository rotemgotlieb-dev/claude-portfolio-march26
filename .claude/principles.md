# Principles · Rotem's operating manual for this portfolio

**Status:** Source of truth. Read this BEFORE the project CLAUDE.md, learnings.md, or any sprint report.
**Authored:** 2026-05-30 by Rotem, codified by Claude on his direction.
**Updated:** keep current; promote repeated learnings up to standing rules in CLAUDE.md, and source the rules themselves back from here when they change.

CLAUDE.md captures specific standing rules established after specific failures (Mobile Video, Em dash ban, Loop seam diagnosis, etc.). This file captures the VALUES those rules exist to serve. When a CLAUDE.md rule and these principles conflict, this file wins, and the CLAUDE.md rule needs updating.

---

## Decision-making and mindset

- **Quality is the only deadline. Never rush.**
- When the choice is "simple to build" vs "right," choose right, and say why.
- But don't overcomplicate. The best solution is the clearest one, not the most elaborate.
- Resolve the hard questions first, then execute cleanly against a locked spec.
- Show reasoning when it matters. Don't pad it when it doesn't.
- **One clear recommendation with reasoning, not a menu of options.**
- Honest pushback when something's wrong. Don't drift into agreement.

---

## What earns a place on the page

- **Every animated element must earn its place.** Motion without meaning gets cut.
- Every cursor action represents a real decision or intention. Never decoration.
- **Interview-defensible.** If you couldn't explain a beat to a hiring manager in 30 seconds, it doesn't ship.
- **Show the designer's hand at work, not the product running on autopilot.** Every loop has an agent (a cursor that's you) manipulating real components you designed.
- "Build, point, wait" choreography: the cursor points at a component, takes an action, the system responds.
- **At least half of a page's motion-bearing elements are cursor-as-designer loops.** (Standing rule, established 2026-05-28 after Pulse Sprint 3 rejection. See [learnings.md](learnings.md) entry "Pulse Sprint 3 Phase E rejection".)
- Each loop on a page uses a distinct gesture signature: action-execution, additive build, subtractive fade, pointwise edit, annotate-and-delegate.

---

## Animation craft (the Ghost / Benji bar)

- **Real transformation over crossfades and opacity tricks.** Shapes genuinely become other shapes. This is the biggest craft delta between us and the bar. See [learnings.md](learnings.md) "Pulse Sprint 3 Phase E rejection" for what crossfade-mistakes look like.
- Cursor traversal eases in-out (`cubic-bezier(0.77, 0, 0.175, 1)`, ~440ms). Never pure ease-out. See [CLAUDE.md](CLAUDE.md) "Cursor easing by context."
- **Human cursor pacing (NOT mechanical):** secondary-target hops 450 to 550ms, hover dwell before any click 200 to 250ms, clickStamp 280 to 320ms. Sub-300ms hops read as glitched. See [learnings.md](learnings.md) "Human-pacing rule for cursor motion" for the full timing budget.
- **Logical causation:** every UI state change must be visibly caused by a cursor action on the responsible target. Popups dismiss only when the cursor visibly clicks Cancel/Add/X. Modals close only on visible close. State changes without visible causation read as glitchy. See [learnings.md](learnings.md) 2026-05-30 Finding 2.
- **Cursor dead-zone rule:** when the cursor would be idle for more than ~1 second, that's a wasted beat. Replace with: cursor moves to a new element, a tooltip appears at the cursor's location, the cursor "examines" something, or a related UI element activates. See [learnings.md](learnings.md) "Cursor dead-zone rule."
- **Tighten dead-zone before high-information beats:** when a tooltip / callout / code diff follows a cursor traversal, shift the traversal earlier. Both windows improve (less idle time AND more visible time for the information). See [learnings.md](learnings.md) "Round 5: tighten dead-zone before high-information beats."
- Clicks are a stamp: cursor `translateY(5px)` + shadow, target compresses `scale(0.97)`. Cursor z-index ABOVE the popup it clicks (cursor at 50, popup at 11).
- Multi-step rhythm is **snap-pause-snap**. The ~600ms pause is load-bearing. The pause IS the work. See [CLAUDE.md](CLAUDE.md) "Multi-step rhythm."
- Blur transitions: `blur(16px)`/250ms major, `blur(2px)`/200ms minor.
- Entry scale never below 0.93. UI under 300ms. Exits ~20% faster than entrances.
- **SVG primitive selection — circles use `r`, ellipses use `rx`/`ry`.** Mixing them is silent: invalid attributes are ignored without errors. For heatmap blobs, prefer `<circle r="N">` unless you need genuinely non-circular shapes. See [learnings.md](learnings.md) "Finding 1 — SVG ellipse vs circle."
- **Single Unified Timeline** via the Choreography engine, not raw setTimeout chains. Explicit zero-position reset at the loop seam. See [CLAUDE.md](CLAUDE.md) "Single Unified Timeline architecture."
- Spatial Choreographers school (Freiberg/Benji): single-property morphs, meticulous 100 to 200ms staggering.
- **The feel is hand-tuned and only judged by watching it move.** A spec captures structure, not feel.

---

## Standing operating note: ALWAYS reference learnings.md

At the start of every session that touches autoplay loops, cursor animations, or interactive widgets on this site, read [learnings.md](learnings.md) first. The rules above link to specific entries. Discoveries from past sessions are how this site's quality compounds. Failing to reference learnings.md repeats mistakes that have already been diagnosed and fixed.

---

## Body-demo discipline

- A body loop is **ONE component**, ~330px tall, stripped of all app chrome except a browser-bar with a localhost slug.
- Wireframe fidelity with strategic real text only where it carries meaning. Faux placeholders for the rest.
- **6 to 10s loop, 3 to 5 beats, first action under 500ms.**
- One italic caption, ≤15 words, plus a sentence of framing prose so meaning never depends on guessing. See [CLAUDE.md](CLAUDE.md) "Case study page composition rule."
- **Hero vs body are categorically separate.** Hero density in a body slot is a structural error. See [CLAUDE.md](CLAUDE.md) "Body-demo discipline."

---

## Visuals and content policy

- **Zero static product screenshots.** Visuals are animations or interactive widgets. Beats that don't earn animation go prose-only. (Process photography is fine.)
- Reuse the engine and proven patterns. Invent no new primitives without surfacing it.
- Never stretch or distort images. Pad to target dimensions; containers enforce fixed aspect ratios.
- `getBoundingClientRect()` on animated elements returns wrong positions mid-animation. Prohibited. Use CSS custom properties + JS math.

---

## Honesty

- **No fabricated process, metrics, or claims.** Loops dramatize real decisions; stylization is fine, fabrication isn't.
- Banned overclaims: "built both then merged," inflated phase counts, unprofiled performance numbers.
- Ground every visual in a real component and a real decision.

---

## Build process and engineering

- **Phased, gated builds.** Pre-phase backup, planned-vs-implemented report, gate for approval, stop.
- Verify visually before proceeding. Rollback is on the table at any gate.
- **Disk and the running build are ground truth.** Not memory, not a cached fetch.
- **Cache-bust in lockstep** across all HTML. Keep CSS and JS on one version number.
- Append-only CSS where possible. Don't modify existing rules when adding.
- Reduced-motion static path AND IntersectionObserver pause/resume on every loop.
- **Self-improvement loop.** Update the spec and `.claude/learnings.md` as you go, so quality lives in the repo, not in chat history.

---

## Writing and voice

- **Concise.** No padding.
- **Banned words:** leverage, ensure, passionate, seamless, intuitive, robust, holistic.
- **No em-dashes in user-facing prose** (middle dot `·` is the separator). No emojis. See [CLAUDE.md](CLAUDE.md) "Em dash ban."
- Every paragraph should **Hook, Prove, or Land.** Target ~400 to 600 words per case study.

---

## Cross-references

- **Project rules + standing rules:** [CLAUDE.md](CLAUDE.md) and [../CLAUDE.md](../CLAUDE.md)
- **Discovery log + post-sprint reflections:** [learnings.md](learnings.md)
- **Case-study operating manual:** [case-study-guidebook.md](case-study-guidebook.md)
- **Canonical motion parameters:** [canonical-motion-spec.md](canonical-motion-spec.md)
- **Reference-portfolio research:** [research/](research/)
- **Per-sprint reports:** [sprint-reports/](sprint-reports/)

---

*This file is the entry point. When something on this site conflicts with these principles, the something on this site is what needs to change.*
