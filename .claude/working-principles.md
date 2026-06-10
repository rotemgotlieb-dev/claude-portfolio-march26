# Working Principles · Rotem + Claude Code

**Established:** 2026-05-29. Standing reference doc consolidated from chat history across the Pulse / Ghost / portfolio rebuild sessions.

**Purpose:** Apply on every substantive task. These are values and disciplines, not project-specific decisions. They override defaults; they do not override the case-study-guidebook or canonical-motion-spec where those are more specific. Where a tension exists, the more specific doc wins.

**How to use:** read before any planning, design, or implementation. Reference in spec docs when a decision invokes one of these rules. Update only when Rotem says so (this is not a discovery doc; it captures stable principles).

---

## Decision-making and mindset

- **Quality is the only deadline.** Never rush.
- When the choice is "simple to build" vs "right," choose right, and say why.
- Don't overcomplicate: the best solution is the clearest one, not the most elaborate.
- Resolve the hard questions first, then execute cleanly against a locked spec.
- Show reasoning when it matters; don't pad it when it doesn't.
- One clear recommendation with reasoning, not a menu of options.

## What earns a place on the page

- Every animated element must earn its place. Motion without meaning gets cut.
- Every cursor action represents a real decision or intention, never decoration.
- Interview-defensible: if you couldn't explain a beat to a hiring manager in 30 seconds, it doesn't ship.
- Show the designer's hand at work, not the product running on autopilot. Every loop has an agent (a cursor that's Rotem) manipulating real components Rotem designed.
- "Build · point · wait" choreography: the cursor points at a component, takes an action, the system responds.
- At least half of a page's motion-bearing elements are cursor-as-designer loops.
- Each loop on a page uses a distinct gesture signature (action-execution, additive build, subtractive fade, pointwise edit, annotate-and-delegate).

## Animation craft · the Ghost / Benji bar

- Real transformation over crossfades and opacity tricks. Shapes genuinely become other shapes.
- Cursor traversal eases in-out (`cubic-bezier(0.77, 0, 0.175, 1)`, ~440ms), never pure ease-out.
- Clicks are a stamp: cursor `translateY(5px)` + shadow, target compresses `scale(0.97)`.
- Multi-step rhythm is snap · pause · snap; the ~600ms pause is load-bearing, the pause is the work.
- Blur transitions: `blur(16px)`/250ms major, `blur(2px)`/200ms minor.
- Entry scale never below 0.93; UI under 300ms; exits ~20% faster than entrances.
- Single Unified Timeline via the Choreography engine, not raw setTimeout chains; explicit zero-position reset at the loop seam.
- Spatial Choreographers school (Freiberg / Benji): single-property morphs, meticulous 100-200ms staggering.
- The feel is hand-tuned and only judged by watching it move; a spec captures structure, not feel.

## Body-demo discipline

- A body loop is ONE component, ~330px tall, stripped of all app chrome except a browser-bar with a localhost slug.
- Wireframe fidelity with strategic real text only where it carries meaning; faux placeholders for the rest.
- 6-10s loop, 3-5 beats, first action under 500ms.
- One italic caption, ≤15 words, plus a sentence of framing prose so meaning never depends on guessing.
- Hero vs body are categorically separate. Hero density in a body slot is a structural error.

## Visuals and content policy

- Zero static product screenshots. Visuals are animations or interactive widgets; beats that don't earn animation go prose-only. (Process photography is fine.)
- Reuse the engine and proven patterns; invent no new primitives.
- Never stretch or distort images; pad to target dimensions, containers enforce fixed aspect ratios.
- `getBoundingClientRect()` on animated elements returns wrong positions mid-animation. Prohibited. Use CSS custom properties + JS math.

## Honesty

- No fabricated process, metrics, or claims. Loops dramatize real decisions; stylization is fine, fabrication isn't.
- Specific banned overclaims: "built both then merged," inflated phase counts, unprofiled performance numbers.
- Ground every visual in a real component and a real decision.

## Build process and engineering

- Phased, gated builds: pre-phase backup, planned-vs-implemented report, gate for approval, stop.
- Verify visually before proceeding; rollback is on the table at any gate.
- Disk and the running build are ground truth, not memory or a cached fetch.
- Cache-bust in lockstep across all HTML; keep CSS and JS on one version number.
- Append-only CSS where possible; don't modify existing rules when adding.
- Reduced-motion static path and IntersectionObserver pause/resume on every loop.
- Self-improvement loop: update the spec and `.claude/learnings.md` as you go, so quality lives in the repo, not in chat history.

## Writing and voice

- Concise. No padding.
- Banned words: leverage, ensure, passionate, seamless, intuitive, robust, holistic.
- No em dashes in user-facing prose (middle dot · is the separator); no emojis.
- Every paragraph should Hook, Prove, or Land. Target ~400-600 words per case study.
- Honest pushback when something's wrong; don't drift into agreement.

---

*End of working principles. Apply on every task. Update only when Rotem says so.*
