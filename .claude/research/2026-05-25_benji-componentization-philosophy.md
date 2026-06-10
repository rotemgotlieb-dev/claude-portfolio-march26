# Benji Taylor componentization philosophy — what each demo shows vs. what's stripped

**Investigation date:** 2026-05-25
**Subjects:** benji.org/agentation, www.agentation.com, benji.org/annotating, benji.org/liveline
**Trigger:** Phase 4 of the autoplay engine sprint produced a View Modes demo (work/ghost.html Beat 4) that shows the full app chrome — toolbar + 4 modes + dashboard mockup with stats row, transactions list, button rows, on both a design panel AND a production panel. User reviewed the Vercel preview and flagged: this doesn't match Benji's pattern. Benji shows isolated component-level demos. We're showing the entire app. This investigation surfaces the philosophical gap before we build AI Fix Flow (Phase 4 static) using the same approach.
**Methodology:** [.claude/CLAUDE.md → Reference-portfolio investigation methodology](../../CLAUDE.md). Goes one layer deeper than the May 22 autoplay-decomposition pass — that one documented the technical primitives (cursor, popup, marker, choreography runner). This one documents the **content discipline** — what gets shown, how much app chrome is stripped, what one demo "is for."

Source HTML pulled to `/tmp/benji-research-2026-05-25/` for offline inspection. Cited measurements come from grep + DOM walk of the raw HTML and the linked `04479d16ca5de00d.css` shared stylesheet + `chunk7047-5e076d77278feec5.js` choreography bundle.

---

## Investigation summary (one-paragraph TL;DR)

Benji uses **TWO different demo patterns** across these four pages, plus a **third** for the Liveline product page that doesn't apply to our portfolio. Pattern A is the "hero demo" — a single tall multi-feature aggregated showcase that runs ONE long choreographed loop cycling through every feature of the product (16s desktop / 14s mobile). Pattern B is the "section demo" — a SHORT (~330px tall), STRIPPED-DOWN, ONE-COMPONENT visual that demonstrates exactly ONE interaction in 6–10 seconds. Section demos do NOT include sidebar, nav strip, or surrounding app chrome. They show the bare component the prose is talking about, surrounded by abstract gray-bar placeholders only when context is needed. Each section demo has its own per-demo CSS namespace prefix (`.tsd-`, `.ecd-`, `.msd-`, `.asd-`, `.apd-`, `.sd-`, `.sid-`) sitting on top of shared primitives (`.demo-window`, `.demo-cursor`, `.demo-popup`, `.demo-marker`, `.demo-toolbar`). **The body of an article is N small isolated demos, one per feature, NOT one big multi-feature demo.** Our current View Modes demo is structurally a hero-style demo (full app chrome, multi-feature, longer duration) but placed in a body-demo slot in the article narrative. That mismatch is the gap.

---

## Per-page findings

### Page 1 — benji.org/agentation (the canonical reference)

Source: 127 KB HTML, single inline `<style>` block (~800 lines for the hero demo), 3 inline `<script>` blocks, choreography lives in linked `_next/static/chunks/7047-5e076d77278feec5.js` (~174 KB).

**Headings as published in the article body:**

| # | Heading | Demo namespace | Demo type |
|---|---|---|---|
| — | (hero, no heading) | `.hero-demo-*` | Hero/aggregate |
| 1 | Building with pointing | (no demo here, prose-only) | — |
| 2 | Text selection | `.tsd-*` | Body (one feature) |
| 3 | Element click | `.ecd-*` | Body (one feature) |
| 4 | Multi-select | `.msd-*` | Body (one feature) |
| 5 | Area selection | `.asd-*` | Body (one feature) |
| 6 | Animation pause | `.apd-*` | Body (one feature) |
| 7 | What the output captures | `.sd-*` | Body (one feature — settings UI capture) |
| 8 | Calibrating context | `.sid-*` | Body (one feature — social profile annotation) |
| — | Now available / Acknowledgements / Footnotes | — | — |

**Total: 1 hero demo + 7 body demos.** (The May 22 research said "six section demos plus a hero demo." This pass enumerates seven body demos — `.sid-` (Calibrating context, social profile) was previously uncounted because its class shares lookups with `.hero-demo-sidebar`. Verified by grepping for `class="sid-page"` separately.)

**Per-demo composition — what's INSIDE each container:**

The shared `.demo-window` container is `width: 100%; height: 330px; background: #f6f5f4; border-radius: 12px;` per the linked stylesheet. The browser-bar chrome adds ~38px (traffic lights + URL bar saying `localhost:3000`). So **demo-content area ≈ 292px tall**. Across all body demos.

- **Text selection (`.tsd-*`):** A blockquote-styled passage (`.demo-quote` + `.demo-quote-author`) — visible content is "Steve Jobs quote" + author attribution. The cursor in I-beam mode drags across two words; a comment popup appears. **No sidebar. No nav strip. No surrounding cards.** Just the quote + cursor + popup + ONE marker pin.
- **Element click (`.ecd-*`):** A single "Pro Plan" pricing card with badge + usage label/value + progress bar + 3 feature lines (2 with checkmarks, 1 with X) + an upgrade button. The cursor moves to the upgrade button, a green highlight appears around the button (`.ecd-highlight` 338×40px), marker pin #1 lands. **One component (a pricing card). No sidebar, no nav, no surrounding chrome.**
- **Multi-select (`.msd-*`):** Three checkbox list items (`.msd-item × 3`), each with a checkbox + faux-text bar. The cursor lassos all three, popup "3 elements selected" appears. **Three rows, period. No card chrome, no nav.**
- **Area selection (`.asd-*`):** A simulated dashboard header strip (`.asd-header` with logo + title + button) + 3 abstract stat cards + an empty section below. The cursor in crosshair mode drags an `.asd-area-outline` rectangle across the empty section. **More context than the other body demos** — has header + stats — but the header is decorative scenery, not interactive. The empty section is the actual subject of the demo.
- **Animation pause (`.apd-*`):** Two `.apd-skeleton-card` elements stacked vertically (each = avatar + 2 lines of shimmer). The "animation" being paused is the skeleton shimmer. **Two skeleton cards, period. No app chrome.**
- **Settings/output (`.sd-*`):** A settings panel with: brand row + theme toggle + 3 checkbox rows + color picker with 5 color swatches + "cycle" controls. The cursor moves through the settings, demonstrating that Agentation captures settings panel state. **A settings panel, period. No surrounding dashboard.**
- **Social/calibration (`.sid-*`):** A social profile mockup: avatar + banner + bio + handle + location + meta + stats + tabs + follow button + mentions. **A profile page, period. No surrounding social app chrome (no notifications panel, no compose box, no left rail).**

**Per-demo isolation discipline (the load-bearing finding):**

Each body demo shows EXACTLY the component the surrounding prose discusses, **and nothing more.** When prose talks about element-click, the demo is a pricing card. When prose talks about multi-select, the demo is three checkbox rows. When prose talks about animation pause, the demo is two skeleton cards. There is no "Benji's Dashboard" wrapping any body demo — the dashboard chrome only exists in the hero demo above-the-fold.

**Mockup fidelity:** Designed-down. Most "content" is abstract `<div>` placeholders styled with `.<prefix>-faux-title`, `.<prefix>-faux-label`, `.<prefix>-faux-value`, `.<prefix>-faux-text` — empty divs with inline `style="width:50px"` etc. that render as gray bars. Real text appears only where it carries semantic load: the popup headers (`<button.submit-btn>`, `3 elements selected`, `<div.skeleton-card>`), the popup actions (`Cancel`, `Add`), and a small number of human-readable labels. Visually they read like wireframes with strategic real-text inserts.

**Loop intervals (extracted from chunk7047 setInterval values):**

| Interval (ms) | Likely demo |
|---|---|
| 14000 (mobile) / 16000 (desktop) | Hero demo (`window.innerWidth<=640?14e3:16e3`) |
| 6000 | One body demo |
| 7000 | One body demo |
| 8000 | Two body demos |
| 9000 | Four body demos |
| 10000 (`1e4`) | Two body demos |
| 28000 (`28e3`) | Two long composite loops |
| 14000 (second occurrences) | Two |
| 3300 / 3750 (small intervals) | Internal beats (typing tick, marker tick) |

**Body demo median ≈ 8 seconds. Range 6–10s.** The hero demo doubles that at 14–16s because it cycles through six product features in one continuous loop with 4–5 marker pins (`hero-demo-marker visible` 1, 2, 3, 4, 5).

**Beats per loop:** Body demos have **3–5 beats** typically (cursor move → cursor click → popup appears → popup types → popup hides; or cursor crosshair-mode → drag → outline grows → popup → marker). The hero demo has **~10–12 beats** to cycle through all five marker positions plus mode switches (cursor mode swaps from pointer to crosshair to I-beam).

**Hero demo composition — different from body demos:**

The hero `.hero-demo-browser` container is `width: 100%; height: 300px; background: #F6F5F4; border-radius: 12px`. Inside:
- `.hero-demo-browser-bar` — Mac traffic lights + URL bar (`localhost:3000`)
- `.hero-demo-content` — flex row, full browser-bar minus 38px chrome
  - `.hero-demo-sidebar` (44px wide) — sidebar logo + 3 icon-only nav items + 1 bottom circle icon
  - `.hero-demo-main` (flex:1) — main content area
    - `.hero-demo-header` — header logo + "Benji's Dashboard" title text + button + avatar
    - `.hero-demo-metrics` — 3 metric cards (label + value)
    - `.hero-demo-table` — 3 table rows with td-pill cells
    - `.hero-demo-toolbar` — 6 toolbar icons (settings/cog/eye/etc.)
  - `.hero-demo-terminal` — a Mac-styled terminal preview with "Benji's Project" + Claude Code branding + Opus 4.5 version label
- Five `.hero-demo-marker` instances (numbered 1–5, with `.green` and `.orange` variants)
- One `.hero-demo-popup` (the comment popup that follows the cursor through beats)
- One `.hero-demo-cursor` (with pointer / crosshair / I-beam children)

**The hero is the ONLY demo that has surrounding app chrome** (sidebar + nav strip + terminal panel). Body demos strip all of that away.

**Contextual relationship to prose:** Each body demo lives **between paragraphs** in its section, with the section heading directly above it and a single italic caption (≤15 words, declarative verb-first) directly below. Example: heading "Element click" → 1-2 paragraphs of prose → demo → caption "Click any element to add feedback." → next paragraph or next section. The demo is *embedded between* prose, not *inside* a paragraph.

**Footnote 1 (the load-bearing confession):** "Seriously, every single one. The cursor movements, the timing, the easing curves, all iterated through pointing and feedback." Confirms the autoplay-decomposition file's earlier reading.

**Acknowledgements:** Present at page end. Credits Dennis Jin, Alex Vanderzon, and notes "This post was designed by me, with the help of... you guessed it." (referring to Claude).

---

### Page 2 — www.agentation.com (the docs site)

Source: 65 KB HTML, 2 inline `<style>` blocks (one for the hero, one for the small below-the-fold demos), simpler structure than the article page.

**Headings:**

| # | Heading | Demo type |
|---|---|---|
| — | (hero) | Hero demo — IDENTICAL to benji.org/agentation hero |
| 1 | How you use it | Prose-only |
| 2 | How agents use it | Prose-only |
| 3 | Try it | Static interactive cards (`.demo-card`, `.demo-elements`, `.demo-input`, `.demo-button`) — user clicks to add annotations |
| 4 | Example Card | Same static interactive surface |
| 5 | Animation pause demo | A single moving `.progress-bar` inside `.animation-demo` — user clicks pause icon to freeze |
| 6 | Agents talk back | Prose only (with MCP/Schema cross-links) |
| 7 | Best practices | Prose only |
| 8 | Licensing | Prose only |

**Total autoplay-choreographed demos on agentation.com: 1 (the hero).** The body of the docs site uses **static interactive components**, not scripted cursor demos. The "Animation pause demo" section is the most reduced demo on any of the four pages — `.animation-demo > .progress-bar-demo > .progress-bar` is literally three nested divs with a CSS animation on the inner progress bar. The prose tells you what to do: "Click [pause icon] in the toolbar to freeze this animation."

**This is the lower bound of Benji's componentization scale.** ONE moving rectangle. ONE prose instruction. ONE user gesture. The entire demo is a single animated CSS keyframe on one div, plus a "this is the pause control" pointer to the hero's toolbar.

**Reuse of the hero:** The `.hero-demo-*` inline style block on agentation.com is byte-identical to benji.org/agentation. Confirms May 22 finding: the hero is treated as a packaged component that ships across surfaces. The article (benji.org) and the product docs (agentation.com) reuse the SAME hero component, suggesting Benji treats the hero demo as an asset, not a per-page custom build.

**Asymmetry vs. agentation page:** The article enumerates 7 features via 7 body demos. The docs site enumerates the same 7 features via *prose + static UI affordances* the visitor can click directly. The product itself runs on agentation.com (the toolbar is real), so the user gets to interact with the actual Agentation product. The article uses scripted demos because the visitor doesn't have Agentation installed.

---

### Page 3 — benji.org/annotating

Source: 41 KB HTML, **zero inline `<style>` blocks**, all styling via CSS Modules (`styles_<componentName>__hash` class names).

**Headings:**

| # | Heading |
|---|---|
| 1 | Annotating for agents |
| 2 | Bridging the gap |
| 3 | A different approach |
| 4 | Closing thoughts |
| — | Footnotes |

**Demos enumerated by counting `.styles_demoContainer__OKd_T` occurrences: 2 demos total.**

- **Demo #1** sits in body prose between "The agent can grep for the exact selector..." paragraphs. Has the same chrome composition: an animation area, a `.styles_playPauseButton` (toggle play/pause), a `.styles_saveButton` (Save button — opacity:0 by default so it's invisible but present), a `.styles_refreshButton` ("Clear annotations" — `disabled=""`).
- **Demo #2** appears further down with caption "Click anywhere to add feedback." Contains heart/sparkle SVG icons (a like/heart icon animation — circles + heart paths + sparkle paths transforming over time).

**Demo CONTENT visible:** Single component per demo. The first demo shows a save-button-like control. The second shows a heart/sparkle animation. No surrounding sidebar, nav strip, dashboard, or app shell. Just the one interaction being demonstrated.

**Demo control surface:** Unlike the agentation page (pure autoplay loops), the annotating page's demos have **explicit user controls** — Play/Pause toggle button + Refresh button. The user can stop the demo to inspect a frozen state. This is structurally different from the agentation.org body demos which run autoplay continuously.

**Loop duration:** Cannot extract from HTML (no setInterval in inline scripts; choreography lives in shared chunks). Behaviorally, these are shorter loops (~3–5 seconds each) because they have fewer beats — heart animation = 1 trigger → 1 reveal → return to start.

**Mockup fidelity:** Even more reduced than agentation body demos. The heart-icon demo is just an SVG of nested circles + heart paths; no surrounding UI. The save-button demo is just the button with its animated label states. **One DOM element animating, period.**

**Contextual relationship to prose:** Embedded between paragraphs of the body article. Each demo follows a paragraph that names what the demo demonstrates.

---

### Page 4 — benji.org/liveline

Source: 102 KB HTML, 0 inline `<style>` blocks, **17 `<canvas>` elements**, all with `style="display:block;cursor:crosshair"`.

**Headings (each = one chart variant section):**

Getting started · Momentum · Value overlay · Time windows · Reference line · Orderbook · Candlestick · Multi-series · States · Theming · More features · How it works · Props · Data · Appearance · Features · State · Time · Crosshair · Orderbook · Advanced · Stress testing · Just a line · Acknowledgements

**Total demos: 17 canvas instances of the Liveline charting component**, each configured with different props per section. **Zero `.demo-cursor`, `.demo-popup`, `.demo-marker` references.** No scripted choreography. The user IS the driver — moves their mouse over the canvas, the OS crosshair appears, Liveline's canvas-internal renderer responds.

**Composition per demo:** Literally `<canvas>` with cursor:crosshair + the Liveline component's internal canvas rendering. ZERO surrounding chrome. The entire interaction surface is the canvas itself.

**Loop duration / number of beats:** N/A — no scripted loop. Liveline's canvas might animate internally (candlestick pulses, orderbook value transitions) but that's the product, not a portfolio demo construct.

**Asymmetry with our situation:** **Strongest asymmetry of the four pages.** Liveline is *a single embeddable component* that Benji can drop 17 times. Pulse and Ghost are *full Next.js applications* with routing, multi-page architecture, and stateful behavior. We cannot embed them at all — we must rebuild designed-down mockups in vanilla HTML. The Liveline pattern transfers ZERO percent to us. The mention in the brief is for completeness.

---

## Cross-page synthesis — the five questions

### Q1 — The componentization question

> Does Benji build one demo per feature, OR one demo per component-level interaction within a feature?

**Answer: one demo per component-level interaction.** Each Agentation body demo isolates ONE interaction (text selection, element click, multi-select, area selection, animation pause, settings capture, social profile annotation). Each Annotating demo isolates ONE interaction (save button, heart animation). The hero demo on Agentation is the SINGLE EXCEPTION — it aggregates multiple features into one long loop because its job is "show the product as a whole." The aggregation is reserved for the hero slot only.

**Refined finding:** Benji uses **N+1 demos per article**, where N = number of distinct interactions documented + 1 hero demo. He never builds a "kitchen sink" body demo. He builds N body demos plus 1 hero.

### Q2 — The decontextualization question

> When Benji shows a demo, does he include the surrounding app chrome (navbar, sidebar, etc.) or strip it away to focus on just the component being demonstrated?

**Answer: he strips it away aggressively for body demos. He preserves it deliberately for the hero demo.**

- **Body demos:** No sidebar, no nav strip, no header chrome, no toolbar except where the toolbar IS the demo subject (the toolbar appears in body demos that demonstrate toolbar interactions — multi-select shows the toolbar because the toolbar's icons are part of how multi-select feels). The demo contains: a designed-down container holding ONLY the component being demonstrated + the floating cursor + the floating popup + one marker pin.
- **Hero demo:** Has the full app chrome — sidebar (44px), header strip (logo + title + button + avatar), metric cards (3), table (3 rows), terminal preview. Five markers cycle through different beats demonstrating different features. The hero demo's job is "this is the product"; the body demos' job is "this is one feature."

**The decontextualization is the differentiator.** Body demos read as documentation. Hero demos read as a hero artifact. Mixing the two (a body demo with full app chrome) loses both readings — too much chrome to feel like documentation, too narrow in placement to feel like a hero.

### Q3 — The duration question

> What's the median loop duration across all demos found? What's the shortest? The longest? Our current View Modes demo is 11s — where does that sit on Benji's distribution?

**Answer:**

| Stat | Value | Source |
|---|---|---|
| Shortest body demo loop | **6 seconds** | chunk7047 `setInterval(n,6e3)` |
| Median body demo loop | **8–9 seconds** | dominant intervals in chunk7047 |
| Longest body demo loop | **10 seconds** | `setInterval(n,1e4)` |
| Hero demo loop | **14s mobile / 16s desktop** | `setInterval(s,window.innerWidth<=640?14e3:16e3)` |
| Annotating page demos | **~3–5s each** (estimated; behavior-driven) | Inspection of heart-icon DOM |
| Our View Modes loop | **11 seconds** | After Phase 4 Tweak 3 calibration |

**Our 11s sits in no-man's-land.** Above the body-demo ceiling (10s) but below the hero floor (14s). Either we should compress further to ≤10s and present as a body demo, OR re-frame as a hero-style demo and stretch to 14–16s while taking on the hero's full-app-chrome composition responsibly. Currently we are doing neither cleanly.

### Q4 — The "catches the eye" question

> Some demos start fast (within 500ms of mounting), others have long openings. What's Benji's pacing on the FIRST action of each loop?

**Answer: body demos hit the user FAST.** First cursor move within ~500–800ms of mounting (inferred from `h(600)` sleep utility in chunk7047 — the canonical between-beat sleep). The cursor starts visible at the demo edge or just outside, and the first move begins almost immediately. The hero demo opens slower (the cursor sits idle for ~1000–1500ms before the first move) because it needs to give the user time to read the dashboard mockup.

**Our View Modes loop has a 1500ms wait before the first cursor move + a 1000ms cursor fade-in.** That's slow even by hero-demo standards. Hero-style pacing in a body-demo slot is part of why the loop feels stately rather than punchy.

### Q5 — The fidelity question

> Are Benji's mockups visually closer to abstract gray-bar wireframes or to pixel-perfect product UI? Where on that spectrum does View Modes sit?

**Answer: Benji is at the wireframe end. We are pushing toward pixel-perfect.**

Benji's body demos use `<div class="<prefix>-faux-title">` / `-faux-label` / `-faux-value` / `-faux-text` — *empty divs styled with inline-width-only* (`style="width:50px"`) that render as gray rectangles. Real text only appears in 3 places per demo: the popup header (`<button.submit-btn>`), the popup buttons (`Cancel` / `Add`), and the marker number (`1`, `2`, etc.).

Our View Modes body shows: actual dollar values (`$48.2K`, `$12.8K`), actual transaction descriptions (`AWS`, `Acme Corp`, `Spotify`, `-$340.50`), actual button labels (`New transaction`, `View all`), actual mode labels (`Side-by-Side`, `Overlay`, `Slider`, `Timeline`), date strings (`Mar 7`, `Mar 6`, `Mar 5`), section labels (`Recent Transactions`, `DESIGN`, `PRODUCTION`).

**Our demo communicates "this is a real dashboard." Benji's communicates "this is the component being demonstrated, everything else is scenery."** The two readings are different — neither is wrong, but the body-demo slot in an article-narrative is where Benji systematically chooses the second reading.

---

## Gap analysis — explicit answers per question for the View Modes demo we shipped

### Gap 1 — Componentization (Q1)

**What View Modes does:** ONE demo containing FOUR mode switches + FOUR canvas variants + full dashboard mockup with stats + transactions + buttons + a side-by-side comparison + drift markers. It is doing the work of **4 demos collapsed into 1**.

**Intentional or accidental?** **Mostly accidental.** The Phase 2 brief framed it as "the View Modes demo" — singular — because the Ghost product has a chip toolbar that swaps view modes, so the demo follows the product structure. But the article-narrative consequence is: in the slot where Benji would put 1 small demo of 1 interaction, we put 4 demos worth of content in 1 container. The reader has to follow 4 mode switches + watch the canvas crossfade + scan the dashboard mockup + parse the drift markers — all simultaneously.

**Possible re-frames:**
- (a) Split into 4 small demos, one per mode (Slider in its own demo, SBS in its own, etc.) — fits the Benji body-demo pattern but loses the "these are the four ways" connective tissue.
- (b) Keep aggregated but reposition as the **Ghost hero demo** (above the case-study fold, replacing the existing static hero image). At hero pacing (14–16s) with full chrome it would land correctly.
- (c) Keep at Beat 4 but radically reduce the dashboard mockup density — strip the tx list and stats row to wireframe placeholders, so the FOUR MODES are the subject (which is what the prose claims) rather than the dashboard content being the subject.

### Gap 2 — Decontextualization (Q2)

**What View Modes does:** Shows full app chrome — mock-nav (logo + wordmark + label + avatar), mock-stats-row (3 cards), mock-tx-card (header + 3 rows), button, on BOTH design and production panels. Twice. In every mode variant.

**Intentional or accidental?** **Accidental, traceable to Phase 2.** During Phase 2 we observed the panels reading as "too empty" without the tx-card and added it explicitly for visual density (logged in the Phase 2 report under "tx-list added to fill the empty middle"). That decision was directionally wrong by Benji's discipline: empty space is the correct affordance for "the panel is scenery, the modes are the subject." Adding the tx-card increased dashboard fidelity but pulled the demo away from componentization.

**Possible re-frames:**
- Strip the tx-card. Restore the empty middle. The prose underneath Beat 4 names the 21 components Ghost tracks — that does the inventory work. The demo only needs to show enough panel structure to register "two panels being compared, four modes switching."
- Or strip even more: replace stats row and tx-card with `<div class="vm-faux-line" style="width:60%;height:6px">` placeholders, Benji-style. The drift visible would be: button color, panel bg tint, divider chrome/no-chrome.

### Gap 3 — Duration (Q3)

**What View Modes does:** 11-second loop after Tweak 3.

**Intentional or accidental?** **Partially intentional.** Tweak 3 calibration session brought it from 14.5s → 12.5s → 11s, all driven by user feedback that the longer loop felt fidgety. The first calibration was correct (dead-zone reduction was real and worthwhile) but the target was assumed without reference data. We were aiming for "felt right" without a benchmark.

**Where 11s sits:** Between Benji's body-demo ceiling (10s) and hero-demo floor (14s). **Neither pattern's discipline applies cleanly.** If we accept the body-demo framing, compress to ≤10s (drop one of the four-mode cycle to three modes, or compress per-beat dwell further). If we accept the hero framing, stretch to 14–16s and add a deliberate "introduction beat" at the loop start (Benji's hero opens with the cursor idle for ~1.5s while the dashboard is read).

### Gap 4 — Catches the eye (Q4)

**What View Modes does:** 1500ms wait before first cursor move + 200ms cursor fade-in. First user-perceptible motion at T+1500ms.

**Intentional or accidental?** **Intentional but mis-targeted.** The Phase 4 brief said "the first transition keeps its longer original timing as the introduction beat — the longer first transition gives the user time to orient." That's hero-demo pacing. Benji body demos start fast (~600ms to first cursor motion). Our calibration borrowed the hero pacing while remaining structurally a body demo.

**Possible re-frames:** Tighten the first beat to ~700ms (cursor mount + immediate move-to-first-chip) IF we recommit to body-demo framing. Keep the slow opening IF we recommit to hero framing.

### Gap 5 — Fidelity (Q5)

**What View Modes does:** Real text everywhere — `$48.2K`, `Revenue`, `Balance`, `Spend`, `AWS`, `Mar 7`, `View all`, `Recent Transactions`, `Side-by-Side`, `Overlay`, `Slider`, `Timeline`, `New transaction`, `DESIGN`, `PRODUCTION`. ~20 distinct text strings per panel × 2 panels × visible across 3 modes (Slider, SBS, Overlay) = the reader is asked to scan a lot of small-text content while the cursor moves through chip switches.

**Intentional or accidental?** **Accidental drift toward fidelity.** Each text string was added in good faith — values to communicate "this is a finance dashboard," dates to suggest recency, transaction names to feel realistic. The cumulative result is a demo that looks like a real dashboard from a hiring manager glancing at it, not "a stripped-down sketch of two panels with four modes."

**Possible re-frames:**
- (a) Replace all text with `<div>` placeholders sized to the same widths. Drop to ZERO real text inside the panels. Real text remains in: the chip toolbar (Side-by-Side / Overlay / Slider / Timeline are the SUBJECT and must read), the DESIGN/PRODUCTION corner labels (those are the orientation), and OVERLAY MODE · 50% label (mode-specific framing). Everything else becomes gray bars.
- (b) Compromise: keep 3–4 strategic text strings (DESIGN / PRODUCTION corner labels, Slider/SBS/Overlay/Timeline chips, the mode-specific labels) and turn EVERYTHING ELSE into placeholders. This preserves orientation while stripping fake-product-detail noise.

---

## What this gap analysis means for the AI Fix Flow demo about to be built

The Phase 4 AI Fix Flow spec — as written — repeats the same mistake. The brief says:

> Panel composition: header strip with type-dot + "Color Deviation — Table" + X icon, badges row (Breaking + Critical, with Fixed appending in done state), expected/found grid (#9CA3AF vs #6B7280), delta strip ("Delta: -1.4:1 contrast"), AI recommendation card with Lightbulb icon, fix-flow card in idle state...

That is **far more component density** than any Benji body demo. Closer to Agentation's hero demo in chrome count. If we ship this without rethinking, we'll have TWO demos in the Ghost case study that both pattern-mismatch Benji's discipline, which will compound the visual sense of "too much" the user already flagged on View Modes.

**Recommendation (for the redesign conversation, not for this research file to act on):** before Phase 4 AI Fix Flow build resumes, decide the orientation:

1. **Recommit to body-demo discipline.** AI Fix Flow shows only the deviation panel + recommendation card. No badges row, no expected/found grid as separate cards, no "Color Deviation — Table" titling. Just: a wireframe-ish card with a colored swatch on each side ("expected #9CA3AF, found #6B7280"), an Apply button, three step rows that animate from spinners to checks, a green check + "Fix Applied" final state. ~330px tall. ~8s loop. ~4 beats.

2. **Or recommit to hero-demo discipline.** AI Fix Flow becomes a SECOND HERO in the Ghost case study. Allowed full chrome. ~14–16s loop. Justifies the density.

3. **Or split into two body demos.** Demo A: "Detection" — shows just the deviation panel pulsing red with the marker. Demo B: "Remediation" — shows the Apply button click + 3 steps + green check. Both ~8s, both ~330px tall.

This research file does NOT make that call. The user does, informed by this file + Gemini Deep Research.

---

## Cross-page comparison table

| Aspect | benji.org/agentation body | benji.org/agentation hero | agentation.com body | benji.org/annotating | benji.org/liveline | Our View Modes |
|---|---|---|---|---|---|---|
| Demo count | 7 | 1 | 1 static demo (animation pause = 1 div) | 2 (user-controllable) | 17 (real component instances) | 1 (containing 4 mode variants) |
| Demo height (px) | 330 | 300 | varies, smaller | varies | varies (canvas) | 585 (16:9 of 1040) |
| App chrome inside? | NO | YES — full | NO | NO | NO (canvas only) | YES — full × 2 panels |
| Real text in mockup | minimal (popup actions only) | mostly placeholders | none (single bar) | none | N/A (canvas-rendered) | extensive |
| Loop duration | 6–10s | 14s mobile / 16s desktop | N/A (user-driven) | ~3–5s (user-controllable) | N/A | 11s |
| Beats per loop | 3–5 | ~10–12 | 1 (CSS keyframe) | 2–3 | N/A | 9 |
| Time to first action | ~600ms | ~1500ms | immediate (CSS animation) | user-driven | user-driven | 1500ms |
| User can pause? | no | no | yes (toolbar pause icon) | yes (play/pause button) | yes (hover stops cursor) | no |
| Pattern category | Body demo | Hero demo | Static interactive | User-controllable autoplay | Real component | Hybrid (hero-density at body slot) |

---

## Open questions for Gemini Deep Research

These are the questions I cannot answer from HTML inspection alone. They feed directly into the redesign brief that comes after this research.

1. **Is Benji's componentization pattern (one demo per component-level interaction, body demos stripped of app chrome) standard practice in product designer portfolios at his tier, or is it personal style?** Investigate Rauno Freiberg (rauno.me), Raphael Salaja (raphaelsalaja.com), Emil Kowalski (emilkowal.ski), Linear's about/portfolio pages, Shopify's design portfolios, Vercel's design team blog posts. Map each to the componentization scale (kitchen-sink demos at one end vs. ultra-decomposed body demos at the other).

2. **What is the documented benchmark for autoplay demo loop duration in product designer portfolios — is 8–10 seconds for body demos a Benji-specific choice or an industry norm?** Look for any UX research, motion-design guidelines, or designer-tier portfolio audits that quantify "how long before a viewer disengages from an autoplay demo." Pay attention to whether the benchmark differs for hero-position vs. body-position demos.

3. **Are there high-tier portfolios that successfully show full-app-chrome demos in body slots (i.e., where the View Modes-style aggregation would land cleanly), or does component-level isolation appear to be a hard requirement at the top tier?** Counter-examples would be load-bearing — if any portfolio at Benji's level uses our current pattern and reads as confident, we have more room than the gap analysis suggests.

4. **Does the asymmetry between "single-product-component" portfolios (Liveline) and "full-app" portfolios (Agentation, our case studies) change the componentization rule, or is the rule universal?** Specifically: does showing a full-app product (like Pulse or Ghost) require more demos at shorter durations, or fewer demos at longer durations, or is duration orthogonal to product surface area?

5. **What's the canonical pattern for portfolios that show "view mode switchers" or "interactive control demos" specifically — UI features that ARE the interaction surface itself?** Our View Modes demo is showing a feature whose primary affordance is "switch between four representations." Is there a Benji-equivalent demo of a comparable feature (a dropdown selector, a tab group, a settings toggle) that we can pattern-match against, or is this kind of feature fundamentally a hero-style demo because the interaction surface itself is what's being demonstrated?

6. **How do top-tier portfolios handle the case where a single product has multiple competing "wedge" interactions?** Ghost has a Slider (Beat 2 — already shipped), View Modes (Beat 4 — under review), and an AI Fix Flow (Beat 3 — about to be built). All three deserve component-level attention. Is the established discipline "one wedge demo per case study, all others are smaller bodies" — and if so, how do top-tier portfolios resolve when a single case study has 3+ wedge-worthy interactions?

7. **What does a 5–8 second autoplay loop showing exactly ONE chip-toolbar interaction look like across the industry?** If we splash 4 chip switches into 11s for View Modes, the body-demo recompression alternative would be: 1 demo, 1 mode change ("here's the slider mode in isolation"), 5–6 seconds. Find examples of this pattern at the top tier and document whether they ever ship 4 chip switches in one demo or always split them.

8. **For the AI Fix Flow demo in Beat 3 — what does the canonical pattern look like for "user clicks Apply → 3 steps animate → result appears"?** This is a common product flow (any SaaS with multi-step actions has this). Find 5–10 examples across top portfolios and document the median demo height, duration, beat count, and chrome density. Use that to set the AI Fix Flow target before the static build.

9. **Is the per-iteration cursor-return-to-rest pattern (our Tweak 3) common across top portfolios, or is the more common pattern "cursor fades out, fades in next iteration"?** Our Tweak 3 was driven by user feedback that fade-out/fade-in broke continuity. Verify whether other top portfolios match our solution or accept the seam.

10. **Does the 330px height constraint Benji uses for body demos correspond to a specific aspect-ratio or content-density rule, or is it arbitrary?** If 330px is meaningful (e.g., "single viewport scroll-impression height" on a typical laptop), the implication for our Pulse and LexisNexis demos is "ship them at 330px regardless of how much content the case study has to show." Find research on demo height standardization at the top tier.

---

## Files touched this session

None of the codebase. Research-only. The single deliverable is this file.

## Next sessions that should reference this file

- **Redesign brief writing (immediately next).** The user runs Gemini Deep Research with the 10 open questions above + this gap analysis. The output informs a Phase 4 redesign brief that resolves the body-demo-vs-hero-demo orientation for View Modes AND pre-resolves the same question for AI Fix Flow before its static build.
- **Phase 4 AI Fix Flow static build (after redesign).** Whatever discipline lands from the redesign applies here. Do NOT proceed to AI Fix Flow until this is closed.
- **Phase 5 AI Fix Flow choreography (after Phase 4).** Inherits the orientation decided in the redesign.
- **Future Pulse case study autoplay loops.** This research scopes the rule for Pulse — same componentization discipline applies. Avoid the View Modes mistake.
- **Future LexisNexis case study autoplay loops.** Same.
