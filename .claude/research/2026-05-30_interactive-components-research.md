# Interactive Components Inside Case Studies — Reference-Portfolio Research

*Date: 2026-05-30. Subject: what kinds of interactive components top-tier designer portfolios embed inside case study pages (not on the index). Purpose: pick ONE thoughtful interactive component to add to Pulse, which currently has 3 autoplay loops and zero interactives.*

---

## TL;DR

Top-tier portfolios fall into three camps. **Component-craft sites** (Emil Kowalski, Rauno Freiberg, Salaja) lean almost entirely on inline interactive demos — small, single-purpose, drag/hover/type — because each post IS the demo. **Storytelling case studies** (Benji's Agentation, Annotating, Liveline) embed ONE primary interactive surface that *is* the product, plus autoplay loops everywhere else; the interactive sits at the page's center of gravity, not the periphery. **Linear/Vercel-style brand pages** lean almost entirely on autoplay with click-to-explore links out. Across all three, the consistent pattern: **a single interactive carries more rhetorical weight than three autoplay loops**, because the viewer has to *commit a gesture*, which converts spectatorship into authorship. The two interactive shapes that translate cleanest to a concept project like Pulse: (1) **layer toggle** (Liveline's chip-based "hide/show this line" — direct analog to Pulse's 4 heatmap layers), and (2) **interactive prompt bar** (type a query, watch the cursor fly to the matching component — Pulse's exact signature gesture made manipulable).

---

## Per-Portfolio Findings

**Benji Taylor — agentation.com / benji.org/agentation** (https://www.agentation.com, https://benji.org/agentation). One large primary interactive: a "Try it" toolbar that lets the viewer click any element in a faux dashboard and watch metadata extract into markdown. Static feature-cards (Primary/Secondary/Modal buttons) are inert mockups. The argument: the product IS the gesture, so the gesture must be real.

**Benji Taylor — benji.org/liveline** (https://benji.org/liveline). 17 inline canvas instances. Most are autoplay loops at varying speeds, but ~6 are explicitly interactive: time-window chip toggles ("1m" / "5m"), line-vs-candlestick morph toggle, multi-series legend chips that hide/show individual series, pause/resume click, hover labels on orderbook bid/ask. The interactives prove "the library survives interaction" in a way no autoplay can.

**Benji Taylor — benji.org/annotating** (https://benji.org/annotating). One interactive: "Click anywhere to add feedback" overlay on a faux page. Quote: "I can give feedback the way I naturally think: visually and in real time." The interactivity carries the thesis of the post.

**Raphael Salaja — raphaelsalaja.com** (https://raphaelsalaja.com). Index page is mostly project-card links. Live site uses physics-driven hover on the project tiles and morphing typography but case study pages weren't reachable via WebFetch. Known from prior research: heavy use of view-transition-driven inline morphs between states.

**Emil Kowalski — emilkowal.ski/craft** (https://emilkowal.ski). Library of ~20 tiny standalone interactive demos. Each post IS the demo. Notable shapes: **Precision Slider** (drag for fine value), **Fractional Slider** (drag to reveal proportion math), **Blur Reveal** (hover to progressively unblur), **Wheel Input** (rotate a radial), **Vanish Input** (type, watch input transform), **Combobox** (search and filter), **Exclusion Tabs** (tab click with morph), **Gooey Tooltip** (hover with physics). Pattern: gesture-first, prose-second.

**Rauno Freiberg — rauno.me** (https://rauno.me). Index gave thin signal via WebFetch. Known from prior reference research: every craft entry has at least one hover-driven or scroll-tied morph; uses ViewTransition API heavily. Linear-style restraint — interactives are small and monochrome.

**Linear — linear.app/method** (https://linear.app/method). Almost zero inline interactivity. Click-to-explore links to deeper methodology pages. The interactivity sits at the level of navigation, not inline manipulation. Not a useful model for Pulse.

**Vercel — vercel.com/design** (https://vercel.com/design). Team page with profile-card links. The product surfaces (Resources, Geist) are linked out, not embedded. Not a useful model for inline case-study interactives.

**Charles Shin — ch.sh** (https://ch.sh). 404 on the actual URL Rotem flagged. The alternate (charlesshin.com) returned a real-estate site, not the design portfolio. Likely a stale URL; recommend re-confirming with Rotem.

---

## Pattern Decomposition

| Pattern | What viewer does | Used by |
|---|---|---|
| **Layer toggle** (chips that show/hide a visualization layer) | Click chip | Liveline (multi-series), Agentation (annotation modes) |
| **Comparison slider** (drag handle to reveal A vs B) | Drag handle | Ghost case study on this site (precedent) |
| **Interactive prompt/text input** ("type something, see it transform") | Type + Enter | Emil's Vanish Input, Combobox |
| **Hover-to-reveal** (move mouse over heatmap zones to surface diagnosis) | Hover | Emil's Blur Reveal, Liveline orderbook labels |
| **Drag slider** (continuous value control like fractional/precision) | Drag horizontally | Emil's Precision Slider, Fractional Slider |
| **Click-to-explore mini-prototype** (click a region of a faux app, see metadata appear) | Click on canvas | Benji's Agentation toolbar, Annotating overlay |
| **Pause/resume an autoplay** (play-button overlay on a loop) | Click center | Liveline pause demo, Benji's annotation pause |
| **Time scrubber** (drag a timeline, watch state change) | Drag horizontal scrubber | Liveline time-window toggle (chip version), exists in many data tools |

The category that's load-bearing for Pulse: **the interactive surface needs to BE the signature surface of the product, not adjacent to it.** Pulse's signature surface is the Living Observatory canvas with four heatmap layers, a time scrubber, and an AI prompt bar. Any interactive should live INSIDE that surface, not next to it.

---

## Top 3 Recommendations for Pulse

### Recommendation 1: **Interactive heatmap-layer toggle** (the Liveline pattern, Pulsified)

- **Gesture**: viewer clicks chips labeled `Friction / Rage / Dead / Attention` above a static Living Observatory wireframe.
- **Response**: each chip toggles an SVG heatmap layer (already exists in CSS for the Compose loop). Hot zones appear/disappear; the legend updates; small caption underneath morphs ("Add the rage-click layer. The hot zone sharpens.").
- **Why better than another autoplay**: the four-layer composability is Pulse's core conceptual claim ("the heatmap is an interface, not a visualization"). An autoplay shows the layers being added on a script. A toggle makes the *viewer* the designer who decides what to look for — directly enacting Pulse's thesis. The viewer authors the diagnosis.
- **Cost**: SMALL (<2 hours). The Compose loop already has all four SVG layers + animations defined. Wrap chips with `aria-pressed`, bind `click → classList.toggle`, freeze the existing layer-fade transitions for click instead of timed beats. Reuses the existing `.cm-widget` markup verbatim.
- **Placement**: replaces (or sits adjacent to) the Compose loop at the end of "The Solution" section. Same slot, swapped pattern. The Compose loop currently demonstrates this exact gesture on autoplay; converting it to interactive is a one-section upgrade, not an insertion.

### Recommendation 2: **Type-a-prompt → cursor flies to component** (the signature Pulse gesture, made manipulable)

- **Gesture**: an interactive AI prompt bar at the top of a static wireframe. Three preset chips: `"Where's the most friction?"` / `"Why are users rage-clicking?"` / `"What's broken on mobile?"`. Click a chip (or type free text + Enter), watch the cursor fly across the canvas via cubic-Bezier RAF to land on the correct component, popup appearing with the matching diagnosis.
- **Response**: each preset has a pre-scripted cursor path + landing component + diagnosis card text. The free-text input case can match on keywords (`friction`, `rage`, `mobile`) and fall back to a default if no match.
- **Why better than another autoplay**: the hero video already shows the AI flying the cursor on a fixed prompt. Making it a chooseable interactive converts the viewer from "I saw that happen" to "I asked, and it answered." Same canvas, transformed rhetorical register. This is the gesture Pulse's name and architecture is built around.
- **Cost**: MEDIUM (2-4 hours). Reuse the existing hero video's cursor-flight math (already implemented as an autoplay in `ai-fly.mp4`). Rebuild as DOM/SVG with three target coordinates + three popup-text variants. Engine primitives in `js/demos/_engine/` (cursor.js, popup.js) likely already exist per CLAUDE.md.
- **Placement**: sits in "The Solution" section as a SECOND demo after the Compose toggle (if Rec 1 is chosen) — OR replaces the hero video entirely, making the hero itself interactive (riskier per Case Study Opener Standing Rule §2 which prefers loop hero, but defensible since the gesture IS the product). Recommendation: keep hero as loop, place this interactive between "The Solution" and "The Pivot."

### Recommendation 3: **Time scrubber — drag through 7 days, watch heatmap intensify**

- **Gesture**: drag a horizontal scrubber along a 7-day timeline beneath the Living Observatory wireframe.
- **Response**: as the scrubber moves, the SVG heatmap layers change opacity/position (the rage cluster gets hotter on Day 4 because of a button regression, cooler again after Day 6 because of a fix). Date label updates. Diagnosis card cycles through three different states.
- **Why better than another autoplay**: time-awareness is one of Pulse's four claimed properties (interactive, layered, time-aware, component-anchored). The other three are demonstrated in existing loops; time-aware currently isn't shown anywhere. The scrubber is the most literal possible enactment of "time-aware."
- **Cost**: MEDIUM (2-4 hours). Requires a new `<input type="range">` with custom styling + 4-6 keyframe states for each heatmap layer + a date-label component. More custom CSS than Rec 1, less choreography than Rec 2.
- **Placement**: between "The Solution" and "The Pivot," OR in the Outcome section as a final "explore the surface yourself" interactive — which the Outcome currently lacks. Outcome placement is the strongest argument for this option: hiring managers reach the Outcome and get to *play* before scrolling to Other Work.

---

## Open Questions for Rotem

1. **Which of Pulse's four claims do you most want the interactive to enact?** "Interactive" → Rec 1 (layer toggle). "AI-driven" → Rec 2 (prompt bar). "Time-aware" → Rec 3 (scrubber). "Component-anchored" is already carried by the Annotate-Execute loop.
2. **Replace an existing loop or add alongside?** Rec 1 most naturally replaces the Compose loop (same content, gesture upgraded). Rec 2 and Rec 3 most naturally insert as a new section between "The Solution" and "The Pivot." Outcome-section placement is unique to Rec 3 and is the cleanest "viewer ends the case study having touched the product" finish.
3. **Are the `_engine` primitives (`cursor.js`, `popup.js`, `choreography.js`) ready for an interactive-driven cursor flight, or do they assume timeline-driven autoplay only?** Worth a 5-min check before committing to Rec 2.
4. **Mobile**: layer-toggle chips (Rec 1) work cleanly on touch. Type-a-prompt (Rec 2) requires either a keyboard input on mobile (clunky) or chip-only mode (loses the "type free text" register). Time scrubber (Rec 3) needs a thumb-sized handle. Recommendation: design for desktop-first, document the mobile fallback per the Mobile-divergence rule.
5. **Charles Shin / ch.sh URL**: returned 404. Either the URL is stale or behind a redirect. Worth confirming the actual reference URL Rotem meant.

---

*Word count: ~1,420. Sources cited inline. Patterns drawn from live WebFetch of agentation.com, benji.org/agentation, benji.org/annotating, benji.org/liveline, emilkowal.ski, vercel.com/design, linear.app/method, raphaelsalaja.com. Pulse case study reviewed at `/Users/rotemgotlieb/Desktop/claude portfolio march26/work/pulse.html`.*
