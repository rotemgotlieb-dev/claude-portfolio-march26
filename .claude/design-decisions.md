# Portfolio Design Decisions

**Purpose:** Source of truth for design decisions on Rotem's portfolio. Captures what we've decided to do, what we've decided not to do, and the reasoning + evidence for each. Living document — update when new decisions are made or existing ones are revisited.

**How to use this file:**
- New session starting: read this file first to understand the established design direction.
- Considering a new pattern: check this file before deciding; cite it in proposals when relevant.
- Making a new decision: add it under the appropriate section with reasoning + evidence citation.
- Reversing a decision: do not delete the old one. Mark it ~~struck through~~ with the reason and date, and add the replacement decision below it. The history matters as much as the current state.

**Evidence sources cited in this file:**
- `.claude/research/2026-05-21_benji-pattern-decomposition.md` — benji.org/agentation, agentation.com, benji.org/liveline
- benji.org/ and ch.sh/ + ch.sh/skills + ch.sh/stack — investigated 2026-05-21, findings synthesized into this document directly without a separate decomposition snapshot
- User-stated preferences and goals across the session log (job search target: founding designer / designer #1-3 at seed and Series A startups in the Bay Area)

---

## Strategic positioning

**Target buyer:** Founding designer / designer #1-3 at seed and Series A startups in the Bay Area.

**Primary signal being sent:** "Systems thinker who builds tools, with real shipped infrastructure work + AI fluency made visible, not claimed."

**Asymmetry with the reference portfolios we study (Benji Taylor, Charles Shin):** Both have employer credentials that carry the weight on their own (Head of Design at X/xAI under SpaceX, CPO at Aave Labs, Lead PD at Exa, previously Stellar / Warby Parker / Uber). Rotem is earlier-career; his single strongest signal (the LexisNexis 30-second token-pipeline metric) needs framing to land. This asymmetry shapes which patterns transfer directly and which need adaptation.

---

## Homepage

### Bio prose style

**Decision:** Bio is short prose paragraphs with inline hyperlinks to companies, not bulleted lists or separated experience cards.

**Evidence:** Both Benji and Charles use this verbatim. Benji: "I currently work at SpaceX/xAI, where I lead design for X." Charles: "Currently the Lead Product Designer at Exa." Companies hyperlinked inline.

**Implementation status:** Already in place at rotemgotlieb.com — homepage subtitle has inline link to /process. Extend this pattern to About page bio when restructured.

### Explicit tool naming

**Decision:** Name tools by their actual product names, not generic categories.

**Evidence:** Charles writes "Writing code through conversation and wiring agents together (Claude Code, OpenClaw, Paperclip)." Benji's writing implicitly demonstrates Claude Code by linking to "Morphing icons with Claude." Generic terms like "AI tools" don't carry weight; named products do.

**Implementation status:** Pending. One additional sentence in About bio. Specific products only.

### Freshness signal

**Decision:** Provide a visible "this site is alive" indicator on the homepage.

**Evidence:** Benji uses "Updated [date]" as a single static status indicator. Charles uses a 30-day commit activity log with cumulative count ("Last 30 days: 69 commits") plus a footer linking the latest commit hash to GitHub. Both signal active maintenance.

**Implementation status:** Footer live clock + ∴ glyph already provides a baseline freshness signal (shipped 2026-05-13). Whether to add a live commit graph is pending — depends on Rotem's GitHub activity density across portfolio + pulse + ghost repos.

**Action needed before deciding on commit graph:** Audit commit counts across the three repos for the last 30 days. If 50+ commits total, add the graph. If less or fragmented, skip the pattern.

### Footer pattern

**Decision:** Time + city + signature glyph. Already shipped.

**Evidence:** Benji has time + city ("12:00am in Los Angeles, California"). Charles has weather icon + city ("Chicago, IL") + Korean character + © year.

**Implementation status:** Shipped via 2026-05-13 footer status line work. Rotem's ∴ glyph parallels Charles's 신 character — same personal-touch signal.

### No contact page

**Decision:** No /contact page. Email lives in the About page footer / bio prose / "Reach me" section.

**Evidence:** Neither Benji nor Charles has a contact page. Both put email in bio prose.

**Implementation status:** Done. /contact slot in nav will be replaced by /skills when /skills ships.

---

## Case studies

### Keep the case study format

**Decision:** Case studies remain in current format (hero + overview + phases + outcome + other work). Do not migrate to Benji's "blog post as case study" model or Charles's "modal gallery" model.

**Reasoning:** Asymmetry with reference portfolios. Rotem's career stage requires more framing for each piece of work. Concept projects (Pulse, Ghost) especially benefit from explicit narrative arc — without it, they read as design exercises rather than considered explorations.

**Re-evaluate this decision when:** Rotem lands a high-signal employer credential (recognized startup, well-known company). At that point, revisit whether the case study format is still earning its place vs. constraining presentation.

### One interactive wedge per case study

**Decision:** Each case study gets ONE primary interactive demo (the wedge interaction) plus supporting video loops or static images at other narrative beats. Not every demo is interactive.

**Reasoning:** Benji's pattern — most demos are scripted JS animations, ONE per blog post is genuinely interactive (the Agentation toolbar runs live on his own page). Same density principle applies.

**Implementation status:** Ghost slider is the wedge for Ghost case study (shipped 2026-05-21). Pulse heat-map-with-AI-fly will be the wedge for Pulse. LexisNexis token playground will be the wedge for LexisNexis.

### Interactive demos: Path C — vanilla demo authoring system

**Decision:** All interactive demos and animated demos are built as vanilla HTML/CSS/JS components inside the `.demo-frame` system, embedded directly in case study pages.

**Reasoning:** This is what Benji does. Confirmed via investigation. Two alternatives considered and rejected — see "What we won't do" below for rejected paths.

**Evidence:** `.claude/research/2026-05-21_benji-pattern-decomposition.md` documents the finding in full, including the load-bearing Footnote 1 from benji.org/agentation: "The cursor movements, the timing, the easing curves, all iterated through pointing and feedback."

**Implementation status:** `.demo-frame` system shipped 2026-05-21. First demo (Ghost slider) shipped 2026-05-21.

### Designed-down mockups, not faithful product UI

**Decision:** When recreating Pulse or Ghost UI for embedded demos, use simplified abstract mockups (gray bar placeholders, minimal color, just enough structure to demonstrate the interaction), not pixel-perfect recreations of the production UI.

**Reasoning:** Benji's "Benji's Dashboard" mockup in Agentation demos is intentionally minimal — gray bars and blank cards, not a faithful copy of his real product. The interaction being demonstrated is the value, not the mockup fidelity. Faithful recreations create maintenance burden every time the underlying product UI changes.

**Implementation note:** Ghost slider integration ports Ghost's MockVisualBlocks as inline HTML/CSS — but the goal is fidelity to the production component's STRUCTURE, not to a screenshot. The 24 drifts catalogued in the Ghost CC report are the substance.

### Caption pattern

**Decision:** Every embedded demo has a one-sentence caption underneath, declarative, verb-first, ≤15 words, italic, centered.

**Evidence:** Benji's pattern is consistent across all demos: "Drag to select multiple elements at once." "Click any element to add feedback." "Freeze CSS animations to annotate specific states."

**Implementation status:** `.demo-frame-caption` system class shipped 2026-05-21. First instance text: "Drag the handle to reveal the gap between spec and production." (Ghost slider, Beat 2 of Ghost case study).

### Acknowledgements section

**Decision:** Each case study ends with an Acknowledgements section: people, tools, AI workflows used in the project. Match Benji's pattern.

**Evidence:** Benji ends every blog post with "Acknowledgements" + named collaborators + "This post was designed by me, with the help of... you guessed it." (referring to Claude).

**Implementation status:** Phase 2+ work. Each case study gets a coda crediting real collaborators (Jason Silver mentor, Abdullah Atif recruiter relationship where relevant, etc.), tools used, AI workflows applied.

### Two demo categories: user-driven and autoplay-choreographed

**Decision:** All embedded `.demo-frame` content falls into one of two categories:

1. **User-driven interactive** — user is the driver (drag, click, hover, type). No scripted timeline. Ghost slider (shipped 2026-05-21) is the canonical example. Used for "wedge" interactions where the user's hand on the interaction IS the moment.
2. **Autoplay-choreographed loop** — scripted JS animation with custom cursor + eased motion paths + scripted typing, looping continuously. No user input required. Equivalent of Benji's Agentation text-selection, multi-pin, element-click demos.

Both categories live inside the same `.demo-frame` system. Different JS module per demo, same chrome.

**Reasoning:** Benji's pattern uses both. Some demos invite play; others tell a story. A portfolio with only user-driven demos asks too much of every viewer ("you must drag this to understand"); a portfolio with only autoplay-loops asks too little ("watch passively, learn nothing through your hands"). The mix is what makes Benji's pages feel alive without becoming overwhelming.

**Implementation status:**
- User-driven: shipped (Ghost slider).
- Autoplay-choreographed: pending. Requires the vanilla demo authoring system (custom cursor module, choreography engine, eased motion paths utility, scripted-typing utility, IntersectionObserver-driven play/pause coordinator) flagged in `.claude/research/2026-05-21_benji-pattern-decomposition.md`. Build before the first autoplay-loop demo, not piecemeal per demo.

**Action needed:** before the next case study (likely Pulse), decide which interactions are user-driven and which are autoplay-loop. Map them in the Pulse case-study planning session.

---

## /skills page

**Decision:** Build a /skills page modeled on ch.sh/skills, with three categories:

1. **Created Skills** — skills Rotem has authored. If none yet at time of build, skip this section entirely rather than show an empty one.
2. **For Agents** — llms.txt at domain root (optional, Phase 2+ stretch goal).
3. **Installed Skills** — third-party Claude Code skills, MCPs, and tools Rotem uses daily.

**Improvement over Charles's version:** Each entry gets BOTH a one-line description (what the skill does) AND a one-line personal rationale (why Rotem uses it / how it changed his workflow).

**Reasoning:** Charles's /skills is a strong credibility signal but the descriptions are thin — "/copywriting — Marketing copy for any page" tells you the skill's purpose, not why Charles uses it or where it fits into his actual work. The rationale is the differentiator that turns a list into a useful artifact for hiring managers.

**Evidence:** ch.sh/skills observed pattern (2026-05-21). Charles has 20 installed skills + 2 created + 1 llms.txt entry. Each item is `/slash-name + one-line description + link to source`. No rationale.

**Implementation note:** Nav update — /contact slot in nav replaced by /skills. Email contact info moves entirely to About page (already partially there in "Reach me" section).

**Action needed before building:**
1. Audit `~/.claude/skills/` for installed skills inventory
2. List MCPs in use
3. List daily tools Rotem reaches for

**Implementation status:** Pending. Highest-priority Phase 2 work after Ghost case study integration.

---

## /stack page

**Decision:** Hold for Phase 2+. Not in critical path for current job search.

**Reasoning:** Charles has a /stack page organized into 17 categories of curated resources (Agents, APIs, Articles, Components, Courses, Design Skills, Design Systems, Design Tools, Directories, Fun Sites, Hardware, Inspiration, On Repeat, Read, Software, Typography). Useful for "taste display" but high content debt and not a hiring-manager-priority surface. Worth doing after case studies and /skills land, only if Rotem has bandwidth.

**Re-evaluate when:** Case studies are restructured + /skills ships + Rotem still has authoring bandwidth. Not before.

---

## Visual system

### Typography

**Decision:** Single typeface (Satoshi) for site-wide use today. Adding a monospace companion (Geist Mono or JetBrains Mono — both already used by Pulse) when case study restructure begins, for code-adjacent content.

**Evidence:** Benji and Charles both pair a sans-serif body with a monospace for technical content. Agentation.com uses mono for code blocks, version badges (AFS 1.1), terminal mockups.

**Implementation status:** Satoshi shipped. Mono companion pending case study restructure phase.

### Colors

**Decision:** Existing palette stands. Warm off-white #FAFAF8 background, #1A1A1A text, no dark mode.

**Reasoning:** Already shipped 2026-05-13. Dark mode hidden via Option A+ (CSS preserved, JS neutered) — reversible if revisited later. No need to relitigate.

### Demo frame

**Decision:** All embedded demos sit inside the `.demo-frame` system shipped 2026-05-21. Mac chrome (traffic lights + URL bar showing deployed subdomain) + soft multi-layer shadow + body content area + optional bottom-right reset slot + optional caption below.

**Evidence:** Pattern observed across Benji's demos. System validated via `sandbox-demo-frame.html` + real iPhone autoplay test.

**Implementation status:** Shipped. First case study integration shipped 2026-05-21 (Ghost slider).

---

## What we won't do

### Path B — iframe deployed Next.js apps as demos

**Rejected.** Initially considered as a way to embed real Pulse/Ghost apps with `?demo=mode` URL flags. Rejected because: heavier than vanilla recreation, fights mobile iframe quirks, less direct control over caption + frame integration. Vanilla rebuild is the path Benji uses and produces better mobile experience.

### Path A — video file pipeline with Screen Studio captures

**Rejected.** Initially considered as the path to recreate Benji-quality "video loops." Investigation revealed Benji's "videos" aren't videos — they're JS-rendered DOM animations. Going down the video pipeline path would have invested in a parallel craft Benji doesn't actually use, while losing the benefits of HTML/CSS/JS animations (pixel-perfect at any resolution, no autoplay issues, mobile-friendly, re-renderable when app changes).

### Faithful product UI recreations in demos

**Rejected.** Building demos that look exactly like Pulse or Ghost's production UI was considered for fidelity reasons. Rejected because designed-down abstractions communicate the interaction more clearly and don't create maintenance burden every time the underlying product UI changes.

### Long-form bio with bullet points

**Rejected.** Bulleted skills list, separated experience cards, "I am passionate about..." paragraphs. Both Benji and Charles use prose with inline hyperlinks. Format matches the "this person communicates clearly" signal we want to send.

### Migrating to Benji-style "blog-post-as-case-study" model

**Rejected for now.** Considered after seeing how cleanly it works for Benji. Rejected because Rotem's career stage requires more explicit narrative framing per case study. May revisit after a future high-signal employer credential lands.

### A contact form, captcha, or any contact-page chrome

**Rejected.** Email in bio prose. Nothing else.

---

## Build conventions

### ES modules for demo engine and per-demo scripts

**Decision:** The autoplay demo engine (`js/demos/_engine/*.js`) and per-demo scripts (`js/demos/ghost-*.js`, `js/demos/pulse-*.js`, future case-study demos) use native ES modules with `import`/`export` syntax. HTML script tags use `type="module"`. Existing portfolio scripts (`main.js`, `game.js`, `ghost-slider.js`) remain IIFE-wrapped and continue using `window` namespace; they are not migrated.

**Reasoning:** The engine is a new infrastructure layer with its own scope discipline. Matching the existing IIFE convention would require `window.DemoEngine.Cursor`, `window.DemoEngine.Choreography`, etc., polluting the global namespace and forcing verbose per-demo imports. ES modules give natural scoping, cleaner API, and future tree-shaking compatibility. Browser support is fine (Chrome 61+, Safari 11+); the portfolio's existing baseline already exceeds this.

**Implementation status:** Shipped as part of the autoplay engine session (2026-05-22).

**Action needed:** None. Future demo modules follow this pattern; legacy code stays IIFE.

### Engine animation timing — cursor easing + dwell discipline

> **V3 UPDATE (2026-05-26):** Point #1 below is partially superseded. Penner easeOutQuad is correct for cursor ARRIVALS (offscreen → on-screen) but wrong for cursor TRAVERSAL (between on-screen targets) — V3 stratifies easing by motion context per Disney's Slow-in/Slow-out principle. For traversal use `cubic-bezier(0.77, 0, 0.175, 1)` (ease-in-out). See [.claude/canonical-motion-spec.md](canonical-motion-spec.md) Section 2.1 and CLAUDE.md standing rule "Cursor easing by context." Points #2 (Material standard for UI controls), #3 (dwell discipline — V3 expands into polyrhythmic dwell, but the 700–1000ms range is still in-spec), and #4 (continuous loop seam) remain valid; V3 strengthens but does not contradict them.

**Decision (calibrated 2026-05-23, Phase 4 of the autoplay engine sprint, after View Modes user review on Vercel preview):**

1. **Default cursor easing is Penner easeOutQuad** — `cubic-bezier(0.25, 0.46, 0.45, 0.94)` at **400ms**. Ease-out-heavy: cursor leaves quickly, settles softly. Reads as a human hand arriving at a target rather than a Material-standard mechanical transition. Defined in `styles.css .demo-cursor` rule; documented in `js/demos/_engine/cursor.js` header. Available alternative for more dramatic settle: Benji's ease-out-quint `cubic-bezier(0.22, 1, 0.36, 1)` at 450ms. *V3 note: this is the ARRIVAL case (offscreen → on-screen). For TRAVERSAL between on-screen targets, use ease-in-out per V3.*
2. **Material standard `cubic-bezier(0.4, 0, 0.2, 1)` remains correct for UI control transitions** (pill slides, button presses, toolbar morphs) where mechanical efficiency reads as the system being responsive, not robotic. Different motion classes deserve different curves.
3. **Dwell time after a visual change in autoplay loops = 700–1000ms, NOT 1500–2000ms.** "Dwell" measured from the moment the visual response resolves (slowest concurrent CSS transition / JS animation), to the next cursor move starting. Originally View Modes had 1600ms dwells; user-reviewed loop felt "fidgety with dead air," calibrated to ~900ms dwells across the second-through-fourth transitions. The **first transition** in a loop is exempt — give it 1500–2000ms total as an "introduction beat" so the user has time to orient.
4. **Loop seams must be continuous.** Cursor never fades out mid-demo-lifecycle. At the end of each iteration, the cursor moves back to a rest position (typically canvas center) via a slower "settling" move (700ms easeOutQuad — RETURN_TO_REST_MS in `ghost-view-modes.js`); the next iteration starts from that rest position with no fade, no mount, no destroy. **First-iteration cursor mount + 200ms fade-in is the only acceptable mount/unmount event in a demo's lifecycle.** Implementation pattern: module-scoped `isFirstIteration` flag; `ensureCursor()` returns `newlyMounted` boolean; first-iteration setup runs OUTSIDE the timeline (snap + show), all subsequent iterations skip it. If a demo's narrative requires the cursor to leave the canvas (rare), use translate-out-of-frame, not opacity fade — motion preserves continuity in a way opacity does not. Calibrated 2026-05-23 (Tweak 3) after user noted the previous fade-out/fade-in pattern broke the illusion of a continuous live process.

**Reasoning:** The first demo built on a new engine IS the calibration session. Engine defaults that go un-tuned during demo #1 risk being inherited by demo #2 in a non-deliberate state. Locking these in now means all future autoplay demos (AI Fix Flow this session, Pulse loops later, LexisNexis token playground if it goes autoplay) start from a calibrated baseline.

**Implementation status:** Cursor easing + 12.5s View Modes timeline shipped 2026-05-23; Vercel preview verified at the URL emitted in that session's preview deploy. Production not touched yet (deploys in Phase 6).

**Evidence:** `.claude/learnings.md` entry under 2026-05-23 ("Autoplay engine calibration") — three lessons (dead zones, ease-out-heavy curves for cursors, calibrate-during-first-demo) documented with code references and reasoning.

**Action needed:** None for View Modes. Apply the same calibration discipline to the AI Fix Flow demo (Phase 4 → 5) and to every future engine-bearing case study (Pulse autoplay loops, LexisNexis token playground).

### Hero-vs-body framework

**Decision (2026-05-25, V2 sprint):** Every embedded demo on this site falls into one of two categorically separate patterns. Heroes and bodies do not share parameter ranges — pattern-mismatch is a structural error.

**Hero demos** — above-the-fold case-study openers. The strongest single visual artifact, carrying the thesis.
- Height: 300–600px (we use 300px to match Benji's `.hero-demo-browser` baseline).
- Loop duration: 14–16s, viewport-conditional (`window.innerWidth <= 640 ? 14000 : 16000`).
- Beats per loop: 10–12.
- Opening: ~1500ms slow opening / introduction beat — gives the viewer time to orient before motion starts.
- Composition: full app chrome — sidebar, browser-bar, header, content rows, terminal, multi-marker.
- Placement: position 1 above-the-fold of the case study (per Case Study Opener Standing Rule §1 in CLAUDE.md).

**Body demos** — embedded between prose, NOT above-the-fold. Show ONE component-level interaction the surrounding text discusses.
- Height: 300–350px (we use 330px to match Benji's `.demo-window` baseline exactly).
- Loop duration: 6–10s OR interactive widget (no loop).
- Beats per loop: 3–5.
- Opening: sub-500ms first action when autoplay — body demos do not get the hero's introduction beat.
- Composition: NO app chrome. Only the component + cursor + popup + marker. Wireframe placeholders for surrounding context.
- Fidelity: wireframe-with-strategic-real-text — real text only where it carries semantic load (popup actions, mode labels, orientation labels). Faux-text divs for the rest.
- Each body demo gets a unique semantic localhost URL slug in the browser-bar (e.g., `localhost:3000/deviations`, `localhost:3000/tokens`).
- Caption: short declarative VERB + WHAT + WHY, ≤15 words.

**The two patterns are categorically separate.** Hero density in a body slot OR body brevity in a hero slot is a structural error. Pre-flight any new demo by deciding: hero or body? Then commit to the full pattern.

**Evidence:** `.claude/research/2026-05-25_benji-componentization-philosophy.md` documents the framework in full, drawn from per-page HTML inspection of benji.org/agentation, agentation.com, benji.org/annotating, benji.org/liveline.

### Verified motion specifications

**Decision (2026-05-26, V3 integration — supersedes the 2026-05-25 V2 spec):**

Canonical motion specifications live in [.claude/canonical-motion-spec.md](canonical-motion-spec.md). That file is the reference standard for all motion design work on rotemgotlieb.com. It is sourced from four independent research streams (CC HTML inspection, Strategist visual+design, Gemini Deep Research Round 1, Gemini Deep Research Round 2 with three reports plus four follow-ups).

**Critical parameters that override V1/V2 specs:**

- **Cursor traversal easing:** `cubic-bezier(0.77, 0, 0.175, 1)` — ease-in-out for cursor moving between targets already on screen (NOT pure ease-out — that was a V2 error and is the diagnosed root cause of the "mechanical feel" the user flagged on the V2 hero)
- **Cursor click feedback:** stamping motion (`translateY(5px)` + shadow shift to 0px), NOT scale-down. The TARGET element compresses with `scale(0.97)`; the CURSOR stamps. These are two distinct responses to one click.
- **Multi-step rhythm:** snap-pause-snap pattern (T+150, T+750, T+900, done T+1000–1200), NOT uniform metronome. The 600ms gap between Step 1 and Step 2 is the load-bearing pause — the pause IS the work.
- **Major state transitions:** `blur(16px)` at 250ms. Minor crossfades: `blur(2px)` at 200ms.
- **Loop seam:** explicit zero-position reset at timeline start to prevent the V2 loop trap (state drift between iterations).
- **Button press:** `scale(0.97)` at 160ms (Kowalski universal rule).
- **Entry scale:** minimum `0.93`, never `scale(0)`.
- **Maximum UI duration:** under 300ms (strict ceiling).
- **Exit timing:** 20% faster than entrance (asymmetric — Kowalski rule).
- **Anticipation/overshoot:** 2–5% past target via spring approximation `cubic-bezier(0.34, 1.56, 0.64, 1)` at 600ms.

**Stylistic positioning:** We operate in the **Spatial Choreographers school** (Rauno Freiberg + Benji Taylor). When in doubt, hew to Freiberg/Benji parameters over Salaja/Kowalski. This means high-stiffness springs (or our CSS approximation `cubic-bezier(0.34, 1.56, 0.64, 1)` at 600ms), meticulous 100–200ms staggering, single-property vector morphs over opacity fades. **Less** iOS-native depth-of-field (Salaja). **Less** ruthless under-300ms minimalism (Kowalski). The portfolio's "systems thinker who builds tools" positioning aligns with structural fluidity over consumer delight or pure utility.

**Architecture:** All multi-beat demos use the **Single Unified Timeline** pattern (canonical-motion-spec.md Section 4). One master timeline. Label-based offsets, not hardcoded milliseconds. Data-attribute element targeting, not ref threading. Explicit zero-position reset before each loop. The V2 hero's `setTimeout`-chain orchestration is a known anti-pattern to migrate away from in the next recalibration sprint.

**Implementation status:**
- V2 engine primitives (`popup.js`, `marker.js`, `blurCrossfade`, `motion.js`) remain correct — the parameter envelope they implement matches V3.
- V2 hero choreography needs recalibration: cursor traversal easing, cursor stamping motion, multi-step rhythm, zero-position reset. Scope per canonical-motion-spec.md Appendix A.2.
- V2 Beat 3 drift detection needs minor recalibration: same cursor easing fix when cursor is added in future polish pass.

**Historical V2 motion table (now superseded by canonical-motion-spec.md Section 2):** The May 25 V2 spec used Penner easeOutQuad `cubic-bezier(0.25, 0.46, 0.45, 0.94)` at 400ms as the universal cursor easing. V3 overrides this — Penner easeOutQuad is correct for cursor ARRIVALS (offscreen → on-screen) but wrong for TRAVERSAL (between on-screen targets). The V2 popup/marker/blur primitives are unchanged.

### Zero static screenshots policy

**Decision (2026-05-25, V2 sprint):** All portfolio visuals are animations or interactive widgets. Beats that don't earn animation are prose-only. Static product UI screenshots (Pulse/Ghost dashboard PNGs, mode comparisons, etc.) are explicitly prohibited going forward.

**Reasoning:** Top-tier portfolios (Benji, Rauno, Salaja, Kowalski, Vercel, Linear) treat product UI in case studies as something to demonstrate via motion, never via static screenshots. A static screenshot reads as documentation; a motion clip reads as craft. The asymmetry is large and consistent across the reference cohort.

**Scope:** Applies to product UI screenshots specifically. Process photography (whiteboard sketches, in-person research, hand-drawn ideation) remains acceptable — those communicate "this happened in real life" and serve a different narrative function than "this is what the product looks like."

**Implementation status:** Phase 5 of V2 sprint removes the last product-UI static (Beat 3 of Ghost case study). Pulse case-study audit pending — flag all remaining static product-UI images in Phase 6B for morning review.

---

## Open questions

1. **Live commit graph feasibility** — does Rotem's GitHub commit activity support the Charles pattern? Need to audit commit counts across portfolio + pulse + ghost repos for the last 30 days. If dense enough, build; if not, skip.
2. **Employer credential evolution** — when Rotem lands a recognized employer, revisit whether the case study format is still earning its place or can be lightened toward Benji's model.
3. **/skills page rationale phrasing** — should rationales be technical ("Use for design-system audit before code review") or narrative ("This is what I reach for when..."). Decide when authoring.
4. **llms.txt at domain root** — useful AI fluency signal or noise? Hold for Phase 2 decision.
~~5. Mobile-drift-suppression pattern — formalized as Mobile-divergence rule in CLAUDE.md on 2026-05-22 (three precedents).~~
~~5. **Mobile-drift-suppression pattern** — Ghost slider mobile fix on 2026-05-21 suppressed three minor drifts at mobile breakpoint. If a second occurrence happens (likely on Pulse), promote to formal standing rule: "Visual drifts/details that depend on proportional landing room may be suppressed at mobile breakpoints when they read as render errors rather than design intent."~~

---

## How this file evolves

- New design decisions get added under the appropriate section.
- Reversed decisions get struck-through with date and reason for reversal; replacement decision added below.
- New research files in `.claude/research/` get cited inline when they inform a decision.
- This file should not exceed ~400 lines. If it grows beyond that, split into topic-scoped files (e.g., `design-decisions-case-studies.md`, `design-decisions-visual-system.md`).
- Update this file at the END of any session that produced a new decision, before learnings.md is appended. Learnings entries reference design-decisions.md when relevant.
