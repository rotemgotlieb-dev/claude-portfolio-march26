# Animation build rules (READ BEFORE building/editing any animation, demo, or thumbnail)

## Pattern selection (user-validated, 2026-06-09)
- **A — Ambient loop** (no story): CSS @keyframes. Coupled animations share SAME percent layout + SAME easing.
- **A++ — Coupled loop:** ONE JS RAF writes ONE CSS var (or per-element transforms); every coupled property derives from that single driver. Use when two things must track each other (heat↔scrubber). Desync becomes impossible by construction.
- **B — Scripted cursor story:** engine Cursor + Choreography ({at,do} beats). Element positions get SET only inside specific beats → stationary outside them by construction.
- **C — Real user interaction:** plain listeners + state classes. No engine, no observer.

## Engine (js/demos/_engine/) — ALWAYS use, never reinvent
Cursor (moveTo/clickStamp, easing baked), Choreography (pause/resume timeline), LoopObserver (viewport+tab gate), getCenterOf, prefersReduced. Gold standard reference: ghost-ai-fix-flow-hero.js.

## Mandatory per build
- prefersReduced() early-return + CSS static representative end-state
- LoopObserver gating; pre-paused guard before observer.start()
- Loop seam: 0% and 100% keyframes IDENTICAL (geometric guarantee, never timing-tuned)
- Compositor-only: transform/opacity/filter/clip-path. Never width/height/top/margin/box-shadow animation.
- iOS ≤17.3: no SVG r animation (transform:scale instead)
- Cross-surface: JS-injection markup as string constant into wrapper classes; multi-instance safe
- Structural guarantees > tuned behavior (bottom-anchor cards that must not crop; positions set only in grab beats)

## Cursor & pacing (canonical-motion-spec.md §2.1 for full table)
- Traversal: cubic-bezier(0.77,0,0.175,1). Arrival: (0.23,1,0.32,1). Exit: ease-in. NEVER linear/default.
- Human pacing: 450-500ms moves, 200-250ms hover-before-click, 280-320ms clickStamp.
- Dead zones: cursor idle >1s with nothing animating = wasted beat. Fill or shift.
- Snap-pause-snap, never metronomic (no 333×3). Pause beat 600-1000ms shows micro-motion.

## VERIFY PROTOCOL (non-negotiable before surfacing)
Playwright frame series (every 500ms across full loop+) OR video. WATCH it. Element-scoped screenshots. Wait ~4s after homepage load (intro replays on reload). Zero console errors. Only show the user what you've personally watched.

## Loop seam diagnosis
Skip at the seam = GEOMETRY not timing. Content at T=0 must equal T=END. Pixel-precise JS-measured values over percentages. N failed parameter tweaks = wrong layer, stop and reframe.
