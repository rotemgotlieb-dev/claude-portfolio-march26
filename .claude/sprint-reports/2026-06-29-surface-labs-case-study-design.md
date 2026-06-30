# Surface Labs case study — design doc (2026-06-29)

Status: DRAFT, awaiting Rotem sign-off. Nothing builds until approved.
Source of truth for facts: `.context/attachments/r0WJjO/pasted_text_2026-06-29_15-35-15.txt` (disk+git-verified engagement recap). Copy below was adversarially fact-checked against it (claim ledger: 3 rewords, 1 em-dash fix, 0 cuts, discretion-clean).

## 1. Goal & audience
New **lead** case study for the portfolio. Audience: founding/senior design-engineer hiring managers (active: Jinba, Surface itself). Job is the goal: market Rotem as strongly as the truth allows, lead with the most hireable signals, fabricate nothing.

The thesis the page proves (and the reason it leads): **designed in Claude Design → built in-repo with Claude Code → shipped as reviewed PRs to a live company site.** The method is the pitch.

## 2. Portfolio restructure this sits inside
- Order: **Surface Labs · LexisNexis · Pulse · Ghost.** GoteFigure removed everywhere (bento, Other Work cross-links, nav/meta).
- Unified **card-status system** (also fixes the existing live-vs-concept contradiction): Surface = `Now / currently shipping`; LexisNexis = shipped + year; Pulse/Ghost = one honest status each.
- Cache-bust `?v=N` lockstep across all HTML before deploy; register the new demo `<script type=module>` in `index.html` + all four `work/*.html`.

## 3. Honesty + discretion guardrails (baked into every line)
- **Role:** contract/freelance design engineering. NOT employee. Full-time is "6+ months out." Rotem is "the designer who ships the last mile in code."
- **`@surface/ui`:** composed with it, did **not** author it.
- **"~30% more demos in 2 weeks":** Surface's product claim, attributed, never asserted as Rotem's result.
- **"~17 pages live":** the contract proposal's count (approximate); the page *types* are independently confirmed live.
- **Live vs in-review:** 13+ core pages merged live, 8 in review. Kept honest.
- **The revert beat told at altitude:** no PR numbers, branch names, reviewer names, dollar figures, token values, lint/verifier/design-sync source, or the surface-ui AI tooling. We don't touch `surface-hub` (0 commits from Rotem).
- **Pipeline Diagnosis questions are illustrative** (real copy lives in the private repo); caption says so. Funnel stages + mechanic are real.
- Publishing posture confirmed by Rotem: live withsurface.com pages + the finished videos are showable; not-yet-live work described at capability level.

## 4. Spine (5 beats, minimal text, animations carry it)

**Eyebrow:** `Surface Labs · Contract design engineering · 2026`

1. **Hero** — engine-built demo + thesis line.
   - "Designed in Claude, shipped in code, merged to production."
   - "I design the page, then ship the last mile myself in the repo."
   - caption: "A typed data object becomes a finished, on-brand Surface marketing page."
   - prose: "Freelance design engineering for Surface Labs, a public YC company building an AI-native GTM conversion platform." / "The cursor is the designer. It types the data, the page builds itself."
2. **The system: on-brand by construction** — the interactive demo.
   - "A new page is a typed data object plus a three-line route. Nothing else."
   - "Style comes only from the Surface kit, so every page passes as a withsurface.com page."
   - "A design-token check blocks raw hex, so pages stay on the kit before they ship."
   - prose: "The contract proposal counts around 17 pages live in roughly two weeks: strategy guides, persona pages, competitor pages, an industries directory." / "I composed with @surface/ui, the team's component kit. I shipped the pages, not the kit." / "Content lives in a typed data file. Layout lives in a template. The two never mix." / "This is the real lead magnet, live at /lp/pipeline-diagnosis on withsurface.com."
3. **Shipped with discipline** — the maturity beat (prose-led, optional small visual).
   - "Six merges once landed before they were cleared. I reverted all of them."
   - "Then I re-shipped the same work as consolidated, reviewed pull requests."
   - prose: "The revert is the point. A healthy main branch matters more than my commit count." / "Thirteen-plus core pages are merged and live. Eight more sit in review, where they belong."
4. **The motion system** — the two embedded videos (separate pillar).
   - "One data file re-derives the film and its beat-synced sound at once."
   - "One codebase renders many films across square, vertical, and wide."
   - "Swap the data, and the visuals and the SFX re-sync by construction."
   - captions: "AI Visibility Index. An honest leaderboard where a competitor wins and Surface is the CTA." / "Same prompt, four AI models. The divergence is the story."
   - prose: "Built in Remotion, vanilla code-driven motion graphics. No screenshots, the product UI is rebuilt in code." / "Sound ships in version one: dry, beat-synced, mastered through a two-stage render then loudness pass."
5. **Outcome.**
   - "Live on withsurface.com today, shipped as reviewed pull requests on the team's repo."
   - "The role: the designer who ships the last mile in code via Claude Code."
   - prose: "Surface reports roughly 30 percent more demos in two weeks. That is their product claim, not my result." / "Contract and freelance, not full-time. Full-time is six-plus months out, and that is honest."

**Homepage bento card** — label: `Surface Labs · Design engineering, shipped to production`; blurb: "A typed data object becomes an on-brand marketing page. Designed in Claude, shipped in code, merged live to withsurface.com."
**Live link pill:** `https://www.withsurface.com/lp/pipeline-diagnosis?from=portfolio` (and/or withsurface.com home).

## 5. The four animated artifacts

Split falls out cleanly: thumbnail must be JS-injected and the interactive can't be a video, so those two are **engine-built (Claude)**; the two Remotion films are **Rotem-provided** (embedded video).

### 5a. HERO — "Data object → shipped page" (engine, Claude builds)
- **Pattern B** (scripted cursor + Choreography + LoopObserver) wrapping a real JS tween, the Pulse-compose hybrid.
- **Concept:** framed Surface chrome with a real URL (e.g. `withsurface.com/for/marketing-leaders`). Cursor-as-designer types a line into an `ASK SURFACE` prompt, clicks `GENERATE`, and the page **builds itself section by section** (cube-banner hero, mono eyebrow, weight-400 H1, a 3-cell stat row counting up, a coral tag chip, a square CTA), scaffold-first, no dead zones.
- **Real transformation (not crossfade):** each section is a real box that grows from a 1px hairline guide to full height via `transform: scaleY` (compositor-safe; **not** the height tween the spec first floated), and stat numbers count up via RAF. Left data-object lines map 1:1 to the sections that grow (title→H1, stats[]→row, tag→chip): a real data-binding render.
- **Loop:** continuous-state seam, `resetAllState()` first each iteration; cleanup reverses the build so T=0 ≡ T=loop. Cursor stays put across the boundary. ~7.6s desktop.
- **Reduced motion:** static finished composition (data object + fully-built page side by side). **Mobile:** split goes vertical (data panel above page), stat row stacks (`flex:none;width:100%`), URL/token text capped at 56vw.
- **Open fork (need your call):** side-by-side (data left / page right) is denser; **I recommend page-dominant 70/30** (slim data rail) for a clean 5-second read at ~360px tall.

### 5b. INTERACTIVE — mini Pipeline Diagnosis (engine, Claude builds)
- **Pattern C** (real user interaction; only `prefersReduced` imported). The one operable demo on the whole site, a recruiter actually *touches the tool Rotem shipped*. That's the argument.
- **Mechanic (faithful to the live `/lp/pipeline-diagnosis`):** 4 one-tap questions, one per funnel stage (Capture / Qualify / Route / Convert); each scored; after Q4 a 4-segment funnel bar fills and the **lowest-scoring stage lights coral as "the leak"** with a text verdict. `RUN AGAIN` resets. Earlier-stage tie-break.
- **Honesty:** questions/scoring are **illustrative** (real copy is in the private repo); stages + mechanic are real. Leak conveyed by color **and** text (a11y). Live-url chrome, links out to the real tool.
- Mobile-safe by construction (full-width stacked options); URL capped at 56vw.

### 5c. THUMBNAIL — "Index Climb" (engine, Claude builds, cross-surface)
- **Pattern A++** (one RAF → one CSS var `--srf-progress`; bar height, rank chip, gradient, glow all derive from it, desync impossible). JS-injected markup string, multi-instance safe (homepage bento + Other Work card, identical impl).
- **Concept:** a single highlighted leaderboard bar races bottom→top, re-ranking past muted rivals, **locks at #1** with one spring settle + cyan glow; rank chip ticks 5→1. Calmest, most legible thumb on the grid (answers the "busy thumbs" audit note): only the focal bar is saturated, rivals are low-contrast grey.
- `scaleY` from bottom origin (compositor-only), JS-measured slot geometry, clean geometric seam, reduced-motion paints the locked-#1 end-state.
- **Surface thumb tint (proposed):** `#E6F0F1` pale cyan (distinct from Pulse `#E8ECF2` / Lexis `#E8EDF2`); dark sibling `#18282A`.

### 5d + 5e. VIDEOS — embedded (Rotem provides)
- **Film 1 (marquee):** AI Visibility Index leaderboard (`AIVI_June_16x9.mp4` or the 4:5 flagship).
- **Film 2:** "Same prompt · 4 AI models" compare.
- Embedded as `<video>` under beat 4. **Must clear the 7 iOS gates:** re-encode H.264 Main / level ≤4.0 / yuv420p / 30fps CFR / `+faststart` / **audio stripped** (they ship silent anyway) / `.mp4`; 7 attributes; poster at t=2s. Body-demo framing line above each, italic caption below.

## 6. Visual language (match the real public product)
- Inside framed chrome only: bg `#FCFCFD`, ink `#272727`, **accent-cyan `#2a9bbb`** (canonical website token = lock this as the Surface accent), light-cyan `#A8ECFF` (fill/highlight band, dark text on top), divergence **coral `#EC6646`** (the one rare second hue, leak/tag only). Leaderboard bar gradient `#54CFEC→#1AA0C4` (real video token).
- Square corners (2–3px), 1px hairlines (`#eaeaea`), mono-uppercase eyebrows/labels/numbers, weight-400 headings (never bold), hierarchy from size + tracking.
- **Type caveat:** Surface brand fonts (PP Object Sans / PP Supply Mono) aren't licensed here; approximate with Satoshi (display) + a mono stack (labels) **inside the chrome only**. The "on-brand" read leans on color/rounding/layout, per Surface's own "style from the kit, not one signal." Portfolio prose stays Satoshi.

## 7. Build & verify plan
- Engine-built artifacts use `js/demos/_engine/` primitives; gold-standard reference `ghost-ai-fix-flow-hero.js` + `pulse-compose.js`. New modules: `surface-hero-compose.js`, `surface-pipeline-diagnosis.js`, `surface-thumb.js`.
- New page `work/surface-labs.html` mirrors existing case-study structure (skip-link, nav, sidebar anchors, `.case-hero-demo` 76px top pad, live-link pill, footer).
- Mandatory per artifact: `prefersReduced` early-return + static end-state, `LoopObserver` gate (hero/thumb), compositor-only motion, geometric loop seam, `will-change: transform`, mobile width discipline (assert `.case-content === 375`).
- Verify protocol before surfacing: Playwright frame series across the full loop, watched personally, zero console errors, desktop + 375 mobile.
- Deploy: cache-bust lockstep, `vercel deploy --prod --yes`, smoke-test live.

## 8. Decisions still needed from Rotem
1. **Hero density:** page-dominant 70/30 (my rec) vs side-by-side.
2. **Surface accent:** lock `#2a9bbb` (website canonical) as the case-study cyan? (videos keep their own gradient.)
3. **Which leaderboard cut** for the marquee embed: 16:9 (`AIVI_June_16x9`) vs the 4:5 flagship.
4. Confirm the verified copy in §4 (any line you want sharper or softer).

## 9. Build order (after approval)
1. Build `work/surface-labs.html` + the 3 engine artifacts; wire the 2 videos.
2. Self-review (Playwright, desktop+mobile), iterate to bar.
3. Homepage restructure: add Surface lead, remove GoteFigure, unified card-status system, cache-bust.
4. Surface visual review to Rotem → clear with Surface if needed → deploy.
