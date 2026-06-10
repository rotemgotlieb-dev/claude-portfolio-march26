# Benji Taylor pattern decomposition

**Investigation date:** 2026-05-21
**Subjects:** benji.org/agentation, benji.org/liveline, agentation.com
**Trigger:** Rotem asked how to produce "video loops" at Benji's quality bar for Pulse and Ghost case studies. Investigation revealed the loops are not videos.

## Core finding

Benji does not use video files. Every "video loop" embedded in his pages is a live HTML/CSS/JS animation rendered directly in the page DOM.

Footnote 1 on benji.org/agentation confirms this in his own words: "Seriously, every single one. The cursor movements, the timing, the easing curves, all iterated through pointing and feedback." Cursor movements, timing, easing curves are properties of programmatic animations. He iterated on them using Agentation itself, which only works on real DOM elements.

## Pattern decomposition

### 1. Demo container

Every demo sits inside a consistent Mac-style window chrome:
- Three traffic-light dots (red/yellow/green, ~11px)
- Centered URL bar showing fake routes (`localhost:3000`, `localhost:3000/blog`, `localhost:3000/tasks`, etc.)
- Soft multi-layer drop shadow
- White interior
- Optional floating bottom-right toolbar (which on agentation.com is the actual Agentation product running live)

This is the pattern we recreated in our `.demo-frame` system on 2026-05-21 (see learnings.md entry for that session).

### 2. Background mockups are deliberately abstract

Each demo uses a simplified mockup as the canvas for the interaction. Examples from benji.org/agentation:
- Steve Jobs quote (for the text-selection demo)
- Gray bar placeholders standing in for a dashboard (for element-click demo)
- Three task list rows (for multi-select demo)
- An empty landing page (for area-selection demo)

The mockups are NOT recreations of real products. They are designed-down abstractions, typically:
- Plain text content where text matters
- Gray rounded rectangles where layout matters
- Minimal color
- Just enough structure to demonstrate the specific interaction

### 3. Foreground choreography is the actual demo

The interaction itself — the cursor moving, popups appearing, text being selected — is rendered on top of the static mockup. Components include:

- **Custom cursor:** a DOM element (not the system cursor) following a scripted path with easing
- **Cursor mode states:** crosshair for tool-mode, pointer for normal mode, swapped programmatically
- **Annotation popups:** dark cards with text input + Cancel/Add buttons, slide into view at scripted moments
- **Selection states:** dashed green borders appearing around elements being multi-selected
- **Numbered pins:** blue/green badges placed at click points
- **Typed text:** characters appearing in input fields at consistent intervals (likely scripted setInterval, not real keystrokes)

### 4. One demo per interaction

Each section of the blog post showcases exactly ONE interaction. Text selection. Element click. Multi-select. Area selection. Animation pause. The demos don't combine features; they isolate them.

Each demo loops continuously on a deterministic timeline — typically 6-15 seconds — returning to a clean start state.

### 5. Caption pattern

Single sentence below each demo. Declarative. No marketing fluff. Examples:
- "Select text to annotate typos, content issues, or copy changes."
- "Click any element to add feedback."
- "Drag to select multiple elements at once."
- "Drag to select any region, even empty space."

Italic, secondary text color, centered or left-aligned, max ~80 characters.

### 6. Acknowledgements at the bottom

Every post ends with:
- "Acknowledgements" heading
- Thanks to specific named collaborators (with social links)
- "This post was designed by me, with the help of... you guessed it." (referring to Claude)

This is the "show how it was built" pattern.

## Asymmetry vs. Rotem's situation

Benji on liveline.benji.org embeds the actual Liveline React component live on the page, with different prop combinations across the post. This works because Liveline IS a single embeddable component. Same for Agentation toolbar — it's a single component active on agentation.com.

Pulse and Ghost are not single embeddable components. They are full Next.js apps with routing, state, and multi-page architecture. We cannot drop Pulse or Ghost into the portfolio's vanilla HTML the way Benji drops Liveline into his post.

Practical translation: for Rotem, the right model is the agentation.com pattern, not the liveline pattern. We recreate **designed-down vanilla mockups** of the relevant Pulse/Ghost UI context, then layer scripted choreography over them. The mockups are tiny abstractions, not faithful reproductions of full Pulse/Ghost screens. The choreography demonstrates one specific interaction per demo.

## What this means for the portfolio architecture

Confirmed approach: **Path C — vanilla demo authoring system in the portfolio.**

A small reusable system to be built in the portfolio's vanilla JS:
- **Custom cursor module** — a DOM-rendered cursor that follows scripted paths with eased motion. Replaces the system cursor during demo playback via `cursor: none` on the demo container.
- **Choreography engine** — a tiny scheduler that runs a series of timed animation steps (move cursor, click, type text, show popup, etc.) on a deterministic timeline. Likely a JS module that takes a script array and plays it on requestAnimationFrame.
- **Eased motion path utility** — cubic-bezier interpolation between cursor waypoints. Match the deceleration feel of Benji's demos.
- **Scripted-typing utility** — characters appearing in input fields at consistent intervals with a blinking caret.
- **Loop coordinator** — IntersectionObserver-driven play/pause + reset on each demo's choreography when scrolled into/out of view.

Built once, reused across every case study and every future project.

## Reusable building blocks per demo

Each individual demo then has its own:
- Mockup HTML/CSS (the designed-down context)
- Choreography script (the interaction beats)
- Caption (one sentence)
- Frame wrapping (existing `.demo-frame` system)

Engineering investment per demo after the system exists: estimated 3-5 hours.

## Open questions for future investigation

- Exact easing curves Benji uses on cursor motion (visual inference suggests ease-out-expo or similar; would confirm via dev-tools inspection if a session revisits this)
- Whether Benji uses CSS-only animations + transitions or a JS animation library (none of his blog code blocks reveal this)
- How he handles `prefers-reduced-motion` — observed behavior on his pages is that animations still run; he may not respect this preference (we would, per our standing rule)
- Whether his demos use SVG, Canvas, or pure HTML for the cursor element

## Files touched this session

None. This file is a research artifact only — no code changes, no deploy.

## Next sessions that should reference this file

- When building the choreography engine for the portfolio
- When designing any new vanilla demo for a case study
- When evaluating future reference portfolios using the methodology in CLAUDE.md
