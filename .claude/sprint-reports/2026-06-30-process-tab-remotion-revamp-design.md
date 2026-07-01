# Process tab: 9-beat Remotion revamp (design doc)

**Status: APPROVED by Rotem 2026-06-30. Build = manual, run in a fresh session. Deploy gated on Rotem's localhost review of the whole portfolio.**
**Date: 2026-06-30. Target: process.html.**

## Locked decisions (confirmed by Rotem 2026-06-30)
- **Animation tech:** all 9 visuals are Remotion video loops (max polish, chosen over engine builds).
- **Numbers to print:** **13+ core pages merged live, 8 in review.** "~17 pages" is proposal scope only and NEVER appears as "shipped live."
- **MANDATORY honesty fix:** change the existing `PortfolioTemplate` stat overlay ("17 pages shipped live") to proposal-scope vs in-production, or drop it (beat 3).
- **Cyan:** keep `#1AA0C4`->`#54CFEC` gradient + `#1AA0C4` on-white tick inside videos; `#2a9bbb` for page chrome.
- **Durations:** as specced per beat (8-14s).
- **Satoshi on the Remotion render path** (beats 8, 9): load via `@remotion/fonts`; if unverified, self-host the woff2 or use an approved fallback and FLAG it. Never ship a wrong font.
- **All other open decisions (section 6):** take the doc's recommended default.
- **Already built this cycle** (on disk, same gated localhost review): the Surface Labs case study + "Surface Wave" thumbnail + homepage restructure, and the home hero H1/H2.

## The big idea

The process page already argues a real operating model for building with AI. This revamp adds the proof it was missing: **Surface Labs, a public YC company, where the same model shipped real pages to production.** Surface validates the method.

Every visual on the page becomes a **Remotion video loop**, chosen for maximum polish. Nine seamless, silent, code-driven motion-graphics loops, ~8 to 14 seconds each, rendered in Rotem's existing Remotion project at `/Users/rotemgotlieb/Desktop/Surface_Labs/product-videos`. No screenshots. Every UI surface is rebuilt in code. Each loop is a new `<Composition>` in `src/Root.tsx`, rendered to `out/`, iOS-encoded, then wired into process.html with the 7 video attributes.

The page reads as one system: a near-monochrome editorial frame, one accent at a time, calm data motion, payoffs that arrive and hold. Surface-themed beats wear the Surface visual language (cyan accent, square corners, hairlines). The opener and the close wear the portfolio's own monochrome shell, so the page opens and closes in Rotem's voice and visits Surface in between.

Honesty is load-bearing. Surface is Rotem's current contract employer. The page shows only public and capability-level facts. It never exposes PR numbers, branch or reviewer names, dollar figures, raw token values, or internal tooling source.

---

## 1. The spine (9 beats in order)

| # | Section label | What the loop shows | Status |
|---|---|---|---|
| 1 | The operating model | Three-stage pipeline: design in Claude, build in repo, ship as a merged PR | NEW comp |
| 2 | The fork model | One decision, three options, a human locks one over the recommendation | NEW comp |
| 3 | The system | A typed object resolves into an on-brand page, CI blocks a raw hex, one engine fans out to many pages | EXTEND `PortfolioTemplate` |
| 4 | Tests versus truth | Split frame: 116/116 green tests beside a UI that lies, then the verify model resolves | NEW comp |
| 5 | Surface Labs / discipline | A single main-branch line: six early merges revert, three reviewed PRs land clean | NEW comp |
| 6 | Memory as a system | One bloated file distills into a lean core plus rules pulled on demand | NEW comp |
| 7 | The video system | One timing function drives the bars and the sound at once, across three aspect ratios | NEW comp |
| 8 | What it shipped | A 2x2 grid of four proof cards with honest LIVE vs CASE STUDY tags | NEW comp |
| 9 | What I'd bring | Six method nodes on a loop, closing on an email pill | NEW comp |

Build summary: **7 new compositions, 1 extension of an existing comp (`PortfolioTemplate`), 0 kept as-is.** The existing `PortfolioRevert` comp is the case-study revert and is reused as a code reference only, not embedded here (beat 5 is a different horizontal-line treatment so the two pages do not duplicate).

---

## 2. Shared visual system and Remotion conventions

### Portfolio aesthetic
Refined editorial minimalism. Big simple forms, smooth premium motion, generous negative space, zero clutter, no fiddly mini-UIs. Benji and Linear tier. Motion is the differentiator. Not generic, not AI-slop.

### How the loops sit on the monochrome page
The page shell stays monochrome: bg `#FAFAF8` warm paper, ink `#1A1A1A`, Satoshi only. Each loop sits in a framed `<video>` with a framing line above and an optional italic caption below, per the case-study composition rules. No two looping visuals are adjacent without a text beat between them.

Two shells are in play:
- **Portfolio shell** (beats 1 partial, 8, 9): paper `#FAFAF8`, ink `#1A1A1A`, Satoshi, one cyan accent. This is the page's own voice.
- **Surface-themed chrome** (beats 1 inner, 2, 3, 4, 5, 6, 7): bg `#FCFCFD`, ink `#272727`, accent cyan, square corners, 1px hairlines, mono-uppercase labels, weight-400 headings. This is the validated operating model rendered in Surface's own language.

The opener (beat 1) bridges both: portfolio framing, Surface-themed inner panels. The close (beat 9) returns fully to the portfolio shell.

### Palettes used
- **Surface** (the dominant in-frame language): bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, hairline `#E7E7E9`, accent cyan `#2a9bbb` (website token) and deep-cyan tick `#1AA0C4` (legible on white), light-cyan `#A8ECFF` (fill only, dark text on top, never thin text), bar gradient `#54CFEC` to `#1AA0C4`, divergence coral `#EC6646` (the one rare second hue), amber `#F0A500` (in-flight only), `BRAND_BOXES` six-swatch accent bar. All from `tokensJune.ts`.
- **Pulse** (beat 4 heat canvas only): warm `#F5B34A`, hot `#F07856` over cream `#FFFDF8`, `mix-blend-mode: multiply` (screen washes out).
- **Ghost** (beat 4 build tick, beat 6 immune rail): accent indigo `#4F46E5`, fixed-green `#22c55e` family. Used as a thin rail or a single tick, never a full second palette.
- **Portfolio shell** (beats 8, 9): bg `#FAFAF8`, ink `#1A1A1A`, text steps `#333/#555/#888/#999`, hairline `#E8E8E6`, radius 12px; per-product accent confined to its own tag.

One signal per meaning, never stacked: cyan = healthy/reviewed/consensus, coral = divergence/lie/revert, amber = in-flight, green = passing gate. This is the page's discipline made visible.

### Defaults
- **Dimensions:** 1920x1080, 30fps (all nine).
- **Durations:** 8 to 14s. Most sit at 11 to 12s to match the existing `PortfolioRevert` and `PortfolioTemplate` (both 11s). The fork (beat 2) and the proof grid (beat 8) and memory (beat 6) run shorter (8 to 9s). The system beat (beat 3) and motion system (beat 7) and opener (beat 1) run longer (12 to 14s).
- **Silent:** every loop ships with no audio track at all (`-an`). Page videos are silent for the iOS gate, and Surface client films are prop-gated silent by default.

### The seamless-loop rule (non-negotiable)
T=0 and T=end must be geometrically identical, not timing-tuned. Two techniques, used consistently:
1. **Mirror-action cleanup:** everything added during the loop reverses out in mirror order before the final frame, returning panels, counters, and tokens to their empty start state. Counters reset by construction because every value derives from `useCurrentFrame`, not accumulated state.
2. **Continuous ambient drift:** the only always-running motion is the sine/cosine color-wash blobs (the `Blob` component). Their period is chosen so phase at the last frame equals phase at frame 0 (period divides evenly into `durationInFrames`), or they sit behind a short 6-frame crossfade at the seam.

Verify first and last rendered stills are pixel-identical before surfacing.

### Remotion reuse conventions
- Import `COLOR`, `FONT`, `EASE_OUT_QUINT` ([0.23,1,0.32,1]), `BRAND_BOXES` from `tokensJune.ts`. Do not reinvent tokens.
- Reuse from `PortfolioTemplate.tsx` verbatim: the `ip()` interpolate helper (clamp-extrapolated), the `Blob` color-wash component, the editor and browser-bar chrome, the `PageSection` scaleY top-origin reveal, the beam-with-arrowhead connector, and the named frame-constant `T` object pattern.
- Brand fonts `PP Object Sans` and `PP Supply Mono` ARE licensed inside the Remotion project (`fonts.ts` loads them on the render path), so Surface-themed chrome uses real brand fonts. The portfolio PAGE prose stays Satoshi. The portfolio-shell beats (8, 9) load Satoshi on the render path via `@remotion/fonts`; if Satoshi licensing on that path is unverified, fall back to the system display stack and FLAG it, never ship a wrong font silently.
- Compositor-only transforms everywhere: `transform`, `opacity`, `filter`, `clip-path`, `scaleX`, `scaleY`, `translate`. Never animate width, height, top, margin, or box-shadow.
- Single clean ease-out (`EASE_OUT_QUINT`) on all data motion. Zero overshoot. No settle-bounce. No motion-blur trail.
- Scaffold-first: draw the frame within ~0.6s so it is never void. No dead zones.

### The 7 iOS gates (render checklist, every output)
1. **`<video>` attributes:** `autoplay muted loop playsinline preload="metadata" poster aria-label`. All seven on every element.
2. **Encoding:** H.264 Main profile, level <= 4.0, yuv420p, 30fps CFR (`-r 30 -fps_mode cfr`), audio stripped (`-an`), `+faststart`, `.mp4` container.
   `ffmpeg -i out/<id>_raw.mp4 -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p -r 30 -fps_mode cfr -crf 24 -preset medium -movflags +faststart -an <out>.mp4`
3. **Poster:** extract at t~2s: `ffmpeg -i <out>.mp4 -ss 2 -vframes 1 -q:v 4 <out>-poster.jpg`. (Beat 6 prefers t~5s for the clean after-state.)
4. **No opaque overlay at parse:** JS-state classes (`.active`, `.revealed`) never ship in static HTML.
5. **No ancestor with `opacity:0` / `display:none` / offscreen transform at parse.** Fix the reveal wrapper: `.reveal:has(video){opacity:1;transform:none}`.
6. **Parse-time scoped `.play()`** for above-fold videos (beats 1 and 2), viewport-scoped via `getBoundingClientRect`, with a `readyState` guard.
7. **ffprobe-verify every file:** profile=Main, level<=40, yuv420p, 30/1 CFR, faststart, no audio. Then test on a real iPhone at the deployed URL.
**Meta-gate:** cache-bust `?v=N` monotonic, ALL HTML files in lockstep, on every CSS/JS change.

---

## 3. The beats

### Beat 1 — The operating model

**Section label:** The operating model
**H2:** Design in Claude, build in the repo, ship as reviewed PRs

**Paragraphs:**
- This is how I work now, proven on a live company site. I design a page in Claude, then build it myself in the repo.
- Surface Labs is a public YC company building an AI-native GTM conversion platform. I joined as a contract design engineer.
- The loop has three stages. A design forms in Claude. It becomes code in the production repo. It ships as a reviewed pull request.
- I composed pages with the team's component kit, so they pass as real withsurface.com pages. I shipped the pages, not the kit.
- Thirteen-plus core pages are merged and live. More sit in review, where new work belongs. I never self-merge.

**Framing line:** One loop, three stages: a design becomes code becomes a merged pull request.

**Video concept**

- **Title:** The Loop, design in Claude, build in the repo, ship as a reviewed PR.
- **Narrative:** A silent loop that reads in five seconds as a three-stage pipeline moving left to right. Stage 1 (DESIGN): a compact Claude-design surface types a mono prompt and assembles a small Surface page mock, scaffold-first. Stage 2 (BUILD): a beam carries it into a code editor where a typed data object writes itself line by line. Stage 3 (SHIP): the code becomes a pull-request card that fills a review bar and stamps MERGED with a cyan check. Three square stage panels on warm paper with drifting cyan and lime wash, connected by two animated cyan beams. A mono stage label sits above each panel and one moving cyan progress dot rides the spine across all three. This is the page opener: it sets the visual language the rest of the page reuses.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s | Field fades up: bg `#FCFCFD`, three drifting blobs ease to low opacity over ~0.6s. Three empty square stage panels scaffold in (scaleY 0.9 to 1, top origin). Three mono-uppercase stage labels appear above. |
| 0.6s | STAGE 1. A slim ASK SURFACE prompt bar shows a blinking caret; a mono line types in at ~2f/char: "a page for marketing leaders". |
| 2.0s | A GENERATE chip pulses once (cyan). The Stage-1 mini page builds scaffold-first: hero bar, weight-400 H1 wireframe, light-cyan tag chip, two-cell stat row, each growing from a hairline guide via scaleY on a ~7f stagger. |
| 3.6s | BEAM 1 fires left to right: a 2px gradient line (`#1AA0C4` to `#54CFEC`) scales in from left, arrowhead at full. The progress dot departs Stage 1 and rides toward Stage 2. |
| 4.0s | STAGE 2. Middle panel is a code editor (dark header, traffic lights, "marketing-leaders.ts"). A typed data object writes line by line on ~8f stagger: page, title, subtitle, cta, tag, stats. Property names ink, strings coral, keywords deep-cyan. Stage-1 fields map 1:1 to the lines. |
| 6.4s | Last line lands. A mono gate strip ticks: "token-check" then "type-check" each flips to a cyan check (capability level, no source). BEAM 2 fires; the dot rides to Stage 3. |
| 7.2s | STAGE 3. Right panel is a pull-request card: square, hairline, mono title "Persona template + pages", a REVIEW bar, an amber in-review dot. The bar fills left to right (scaleX) as two reviewer hairline rows check off. |
| 9.0s | PAYOFF. The amber dot flips to a cyan filled check; a MERGED badge stamps in (scale 0.9 to 1, no overshoot). A faint cyan glow pulses once. The three labels brighten in unison. Hold ~1.5s. |
| 10.8s | CLEANUP toward seam: MERGED badge, review fill, both beams, typed lines, Stage-1 build, and progress dot reverse out in mirror order so panels return to empty scaffold. Labels dim. Blobs never reset. |
| 12.0s | LOOP. T=0 equals T=end: three empty panels, dimmed labels, blobs mid-drift, dot parked at Stage 1, no beams, no badge. |

- **Dims:** 1920x1080. **Duration:** 12s (360f).
- **Loop seam:** Mirror-action cleanup from 10.8s to 12.0s reverses everything added; only the sine-driven blobs run continuously and carry no discrete state.
- **Palette:** bg `#FCFCFD`, ink `#272727`, accent cyan `#2a9bbb` (progress dot, gate checks, merged check), light-cyan `#A8ECFF` (tag chip fill), beam gradient `#1AA0C4` to `#54CFEC`, coral `#EC6646` (string values), amber `#F0A500` (in-review dot), hairline `#E7E7E9`, muted `#6B6B70`, card `#FFFFFF`. Wash blobs cyan/lime/sky low opacity.
- **Render notes:** New Composition id `PortfolioLoop`. Reuse `tokensJune.ts`, `ip()`, `Blob`, editor/browser chrome, `PageSection` reveal, beam connector from `PortfolioTemplate.tsx`. This opener establishes; `PortfolioTemplate` (beat 3) is the close-up, so keep consistent but not redundant. As page-opener hero: `.reveal:has(video){opacity:1;transform:none}` and parse-time scoped `.play()`.
- **Honesty notes:** Shown are public/capability artifacts: a generic Surface-style page mock, a typed object with public marketing copy, a PR card with a generic title, a review bar. Told at capability level: token-check/type-check as two abstract ticks, no verifier internals. No real PR numbers, branch/reviewer names, dollar figures, or raw tokens. "Contract design engineer", not employee. "Thirteen-plus core pages merged live, more in review" is the hard line (the approximate ~17-page proposal count is omitted from the opener). "Composed with the team's component kit, shipped the pages not the kit" protects the `@surface/ui` authorship line. The three-stage pipeline mirrors the verified branch-off-main to design-with-Claude to PR-base-main to team-merges loop (recap section 2.4).

---

### Beat 2 — The fork model

**Section label:** The fork model
**H2:** Every decision is a fork. I lock one.

**Paragraphs:**
- The AI does not wait to be told, and it does not run loose.
- For anything that matters it lays out a fork: real options, a recommendation, and the tradeoff between them.
- I lock one option. Sometimes the recommendation, sometimes not. The AI builds what I lock.
- One rule sits above all of it. No production code until the mockup is approved.
- On Surface pages, that loop ran inside Claude Design first. I approved the mock, then it shipped in code.

**Framing line:** A decision laid out as three options, with one locked over the recommendation.

**Video concept**

- **Title:** The Fork (Surface-themed Remotion loop).
- **Narrative:** A single decision presents three real options inside a Surface-styled card. Option A wears a quiet REC tag. The cursor considers A, then B, then C, then returns and locks B, overruling the recommendation. A and C dim, B fills with light-cyan and a LOCKED tag. A short hold reads the overrule, a thin gate line confirms the rule, the choice releases, and the frame resets clean. The five-second read: the human decides, sometimes against the machine, and nothing builds until the human commits.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s | COLD OPEN. Surface card on `#FCFCFD` wash (3 drifting blobs). Card white, 1px hairline, 3px corners, soft shadow. Top rail: mono eyebrow "DECISION" left, ink label "Case study spine" right. Three option rows at rest opacity 0.62. Row A carries a mono REC chip. Cursor parked at card top-center. Rows identical to T=end. |
| 0.5s | Card and rows fade up over 12f (`EASE_OUT_QUINT`). No element moves; only opacity settles. |
| 1.2s | Cursor traverses to row A (~500ms, cursor ease). Row A lifts to opacity 1.0, hairline brightens, 1.01 scale. REC chip stays. 250ms dwell. |
| 2.0s | Row A returns to rest. Cursor to row B (~500ms). Row B lifts. 250ms dwell. |
| 2.8s | Row B returns. Cursor to row C (~500ms). Row C lifts. 250ms dwell. Three considered, none committed. |
| 3.5s | THE OVERRULE. Cursor returns from C back UP to row B (~560ms, deliberate). The reversal past REC-row A is the whole story. |
| 3.9s | LOCK. clickStamp on row B (280-320ms ring, no bounce). Row B fills light-cyan `#A8ECFF` with ink text, a mono LOCKED chip appears (deep-cyan text). Rows A and C dim to 0.32. Row A keeps its dimmed REC chip, so "recommendation overruled" reads by construction. |
| 4.3s | A thin gate line grows L to R beneath the rows (~300ms): mono "NO PRODUCTION CODE UNTIL THE MOCKUP IS APPROVED". A deep-cyan check stamps at its end. |
| 5.8s | READ HOLD ~1.5s. Everything still. Locked B + dimmed REC-on-A + gate line legible. Wash keeps drifting. |
| 6.5s | RELEASE. Gate check fades, gate line retracts R to L. Cursor lifts to rest (ease-in exit). Row B fill drains, LOCKED chip fades, rows A and C return to 0.62. |
| 8.0s | SEAM. Brief 6f crossfade so T=end equals T=0. Frame 240 == frame 0. |

- **Dims:** 1920x1080. **Duration:** 8s (240f).
- **Loop seam:** T=0 and T=end identical: cursor at top-center, three rows at 0.62, REC chip on A, no fill or LOCKED chip on B, gate hidden, blobs matched phase. Lock state fully drained before the final frame. 6f tail crossfade as insurance.
- **Palette:** bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, hairline `#E7E7E9`, track-fill `#EDEDEF`, accent fill `#A8ECFF` (dark text on top), deep-cyan `#1AA0C4` (check + LOCKED chip), blobs cyan/sky/lime. No coral, no red. The overrule is told by the REC chip persisting on a dimmed row, never by a warning color.
- **Render notes:** New Composition id `PortfolioFork`. Reuse `Blob`, `ip()`, browser/card chrome, the `T` beat-constant pattern from `PortfolioTemplate.tsx`. Drive one frame-based cursor track (consider-A, B, C, return-B, lift) with Surface cursor ease; clickStamp ring scale 0.8 to 1.15 to 1 over ~9f. Option-row states set only inside their beats (stationary by construction). Replaces the current `#forkDemo` div + `process-fork.js`.
- **Honesty notes:** Shows a generic decision-fork mechanic (A/B/C, REC, LOCKED, the approval gate) rebuilt in code, no real PR numbers, branch/reviewer names, dollar figures, raw tokens, or tooling internals. The fork UI is illustrative; the mechanic is the real operating model. Decision label "Case study spine" is Rotem's own portfolio-side example, not a leaked Surface artifact. The prose ties the model to Surface only at altitude ("that loop ran inside Claude Design first; I approved the mock, then it shipped in code"), publicly true per the case-study design doc. "No production code until the mockup is approved" is Rotem's stated rule, consistent with the recap's approve-the-mock step.

---

### Beat 3 — On-brand by construction

**Section label:** The system
**H2:** On-brand by construction: one engine, every page passes

**Paragraphs:**
- A new page is a typed data object plus a three-line route. Nothing else.
- Style comes only from the Surface kit. So every page reads as a withsurface.com page.
- A token check in CI blocks raw hex. Pages stay on the kit before they merge.
- I composed with the team component kit. I shipped the pages, not the kit.
- Content lives in a typed data file. Layout lives in a template. The two never mix.
- The contract proposal counts around 17 pages in roughly two weeks. Strategy guides, persona pages, competitor pages, an industries directory.

**Framing line:** Watch one typed object resolve into a finished Surface page, then watch the engine stamp many.

**Video concept**

- **Title:** On-brand by construction: the template engine.
- **Narrative:** A typed data object on the left resolves into a finished on-brand Surface page on the right, then a CI token check rejects a raw hex and snaps it to a kit token, then the single engine fans out into a wall of distinct on-brand pages. The five-second read: data in, on-brand page out, the kit guarantees it. This is the SYSTEM beat. It differs from the opener by foregrounding two things the opener omits: the CI hex guard and the one-engine-to-many fan-out.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s (f0) | HOOK. Mono eyebrow "SURFACE LABS / ON-BRAND BY CONSTRUCTION" rises and fades in; display headline "One engine. Every page on-brand." holds. Three drifting blobs already washing. |
| 0.6s (f18) | Hook eases out, unmounts at f36. Two panels scaffold in from +14px over f28-44: LEFT a dark-header code editor (680w), RIGHT a browser-chrome Surface page (980w), 80px gap. Editor tab "marketing-leaders.ts"; URL pill "withsurface.com/for/marketing-leaders". |
| 1.5s (f44) | TYPING. Six code lines stagger in (26f each), mono, blinking caret. A typed PageData object: page, title, subtitle, cta, tag, stats. Property names ink, strings coral, keywords cyan. This left panel is the swap list made visible. |
| 5.9s (f178) | BEAM. A cyan gradient beam grows left to right across the gap (scaleX origin-left), arrowhead at full. The 3-line route binding data to page. |
| 6.6s (f198) | PAGE BUILD. Four sections stamp top to bottom (26f stagger, scaleY 0.85 to 1 top origin): nav strip; coral-bordered light-cyan tag chip + weight-400 H1 + muted subhead; two stat cells (numbers count up via interpolate, cyan numerals); the `BRAND_BOXES` six-swatch bar. Each section traces to its data line. |
| 9.5s (f286) | GUARD (new vs opener). A left-editor string briefly shows a raw hex `#7B61FF`; a coral underline strikes it; a mono chip "lint:design-tokens raw hex blocked" slides up. The hex replaces with a kit token name in cyan; the strike clears to a cyan tick. ~1.5s, holds ~0.6s. |
| 11.0s (f330) | FAN-OUT (new vs opener). The right page shrinks to a tile; 5 sibling tiles stamp in on a 3x2 grid (26f stagger), each a distinct on-brand page (persona / competitor / strategy guide / industries / lead-magnet / case study) on shared chrome and accent bar. A thin cyan line connects the one editor to all six. Holds ~1s. |
| 14.0s | Global fade into the seam. Blobs continue drifting through the fade. |

- **Dims:** 1920x1080. **Duration:** 14s (420f).
- **Loop seam:** T=0 and T=end both show the empty washed background with three drifting blobs and no panels or tiles mounted. The fan-out tiles and editor unmount during the global fade. Blob phase is continuous; if a visible jump appears at the seam, hold the final 8f on the bare wash and crossfade ~6f.
- **Palette:** `tokensJune.ts` exactly. bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, hairline `#E7E7E9`. Cyan bar gradient `#54CFEC` to `#1AA0C4` (numerals, beam, tick, connectors), light-cyan `#A8ECFF` (tag-chip fill, blob wash), coral `#EC6646` + soft `#FBE4DC` (CTA button, rejected-hex strike + guard chip). `BRAND_BOXES` six-swatch bar as page accent signature. The rejected raw hex is an off-brand violet `#7B61FF`, shown only to be blocked. No purple anywhere except that one rejected frame.
- **Render notes:** REUSE the existing comp. `PortfolioTemplate.tsx` already implements the hook, two-panel scaffold, typing, beam, four-section page build, and `Blob` (Composition id `PortfolioTemplate`, currently `PORTFOLIO_TEMPLATE_FRAMES=330`). Do NOT rebuild. Extend it: (1) bump frames 330 to 420 (14s) and add the two new segments (CI hex guard, then fan-out) before the global fade; move `fadeStart` to ~f408. (2) FIX the honesty issue in the existing stat overlay: it currently renders "17 pages / shipped live" which overstates per the guardrails. Relabel to "~17 pages / proposal scope" and "13+ live / in production", or drop the overlay and carry the split in prose. (3) The fan-out reuses the existing RIGHT page card as a shrunk tile cloned 6x with per-tile title/tag/url swaps. PP fonts are licensed in the Remotion project, so the video chrome uses real brand fonts.
- **Honesty notes:** Shows the on-brand-by-construction concept, a recreated-in-code Surface page using the real `/for/marketing-leaders` URL, the `BRAND_BOXES` motif, the capability of a CI token check (the rejected hex `#7B61FF` is invented as an obviously off-brand example, NOT a real token value), and a fan-out of page TYPES confirmed live (persona, competitor, strategy guide, industries, lead-magnet, case study). Told at capability level only, never exposed: the lint source, the allow-list, the `@surface/ui` internals, the design-sync mechanism. The existing "17 pages shipped live" overstates: ~17 is the proposal count, the hard line is "13+ core pages merged live, more in review". The "+37%" and "100%" inside the demo page are real third-party customer proof used as illustrative page content (Nextiva +37%, Galley 100% spam blocked), not asserted as Rotem's result. The ~30% more demos product claim is NOT shown here (it belongs to the outcome beat, attributed). FLAG: the caption under the video should say the token check is real and the hex shown is illustrative.

---

### Beat 4 — Tests versus truth

**Section label:** Tests versus truth
**H2:** Green tests are not a working product

**Paragraphs:**
- Three products taught me this, each one on its own. Pulse held 116 tests green and a clean typecheck. Beside that, a compare panel sat contradicting the heatmap next to it.
- Ghost shipped headings rendered white on white, invisible, every test still passing. Tests assert that things exist. They cannot see that the pixels are wrong.
- So I verify like a skeptic. The AI reviews its own work adversarially. Reviewers raise findings, then separate refuters attack each one before it counts.
- On Pulse that loop confirmed 16 real bugs with 0 false positives, while 116 of 116 tests passed. Structured doubt sees what a checkmark cannot.
- Then I watch the rendered thing. Nothing I have not seen myself gets shown to you. A green check is the start of verification, never the end.

**Framing line:** All green. Build clean. The readout still lies about the canvas beside it.

**Video concept**

- **Title:** Green / Truth, the test suite passes while the screen lies.
- **Narrative:** A split frame. Left: a terminal test runner counting up to 116/116 with a green build chip. Right: a rebuilt Pulse compare readout that says "quiet, 0 issues" while the heatmap beside it glows visibly hot. The contradiction is the point: mechanical gates went green while the rendered UI lies. A coral flag snaps onto the readout, the lie is named, and the frame resolves into the verify model: RAISE into REFUTE into a surviving VERDICT, with the honest scoreboard 16 confirmed / 0 false positives while 116/116 passed.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s (f0) | HOOK. Coral and cyan blob wash fades in. Centered mono eyebrow "TESTS VERSUS TRUTH" and weight-400 line "Green is not a working product." scale/opacity in. |
| 0.6s (f18) | Hook line exits (opacity to 0, translateY -10), done by f32. The split workspace scaffolds in: two square hairline panels draw within ~0.5s. |
| 1.1s (f32) | LEFT panel = terminal. Title bar "bun test", three lights. Six real Pulse test rows stagger in (7f apart) with cyan-ink check strokes: scrubber maps time, heat peak renders, compare panel mounts, tour advances, issue route resolves, brief drawer opens. |
| 1.3s (f40) | Count chip "0 / 116 passed" counts up (one ease-out, zero overshoot), landing 116 at ~f100. RIGHT panel paints the Pulse compare surface: browser bar "pulse.app/observatory", a heat canvas with a hot peak (Pulse warm to hot over cream, mix-blend multiply), and a COMPARE readout "quiet, 0 issues". |
| 3.4s (f102) | ALL-GREEN HOLD. Count locks 116/116, build chip flips green "build check" (Ghost fixed-green, restrained). Calm hold ~0.8s where everything reads as success. The heat canvas keeps glowing, unacknowledged. The trap lands. |
| 4.3s (f128) | THE CATCH. A coral flag snaps onto the readout (scale-in, no bounce). Status crossfades "quiet, 0 issues" to "contradicts heatmap". A thin coral connector draws from the readout to the hot peak. Left panel desaturates to 0.55 to push focus right. |
| 5.5s (f165) | VERDICT HOLD ~1.2s. The contradiction reads fully. Micro-label "asserts existence, not pixels". |
| 6.9s (f207) | TRANSITION. The split scales down to a muted proof-chip at top; the lower two-thirds reveals RAISE to REFUTE to VERDICT. RAISE = 3 cyan reviewer dots, REFUTE = 2 coral refuter dots, arrows draw, VERDICT = "survives" in a square hairline pill. |
| 8.2s (f246) | SCOREBOARD counts up: "16 confirmed, 0 false positives, 116/116 passed". The 0 sits in a calm cyan-fill highlight, confirmed/16 in ink. Holds ~2.6s, the payoff. |
| 10.8s (f324) | Cross-dissolve back to the hook state (blob wash + faint eyebrow) so f330 reads identical to f0. `fadeStart` f308. |

- **Dims:** 1920x1080. **Duration:** 11s (330f).
- **Loop seam:** f0 and f330 identical: blob wash plus the faint centered "TESTS VERSUS TRUTH" eyebrow at the same opacity. All workspace/verdict elements interpolated to opacity 0 by f328. Counts reset by construction. Matches the 330f loop pattern.
- **Palette:** bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, hairline `#E7E7E9`, cyan accent `#2a9bbb` + fill `#A8ECFF`, coral lie/divergence `#EC6646` + soft `#FBE4DC`, pass-green `#22c55e` (build tick, restrained), Pulse heat warm `#F5B34A` / hot `#F07856` over cream `#FFFDF8` (mix-blend multiply). Two semantic colors at any moment max.
- **Render notes:** New Composition id `PortfolioVerify`. Reuse 1920x1080, 30fps, 330f, `tokensJune` COLOR/FONT, `EASE_OUT_QUINT` (Q), the `ip()` wrapper, the `Blob` wash, and the hook/fade timeline skeleton from `PortfolioRevert.tsx` (copy its `T` object shape). Silent. Replaces the JS green-demo (`#greenDemo`) + verdict card. Verify rendered stills at hook / all-green-hold / flag / scoreboard before surfacing.
- **Honesty notes:** This beat is Pulse and Ghost, NOT Surface, so no Surface internals leak. All numbers are Rotem-verifiable and already live on process.html: 116/116, 16 confirmed, 0 false positives, plus the two failure modes (Pulse compare contradicting the heatmap; Ghost white-on-white headings) verbatim from the existing copy. The reviewers/refuters loop is told at capability level. The page's Surface visual SHELL is kept (it is the validated operating model) but populated only with public Pulse/Ghost facts.

---

### Beat 5 — A healthy main branch

**Section label:** Surface Labs / discipline
**H2:** A healthy main branch beats a high commit count

**Paragraphs:**
- Six merges once landed before they were cleared. I reverted all of them.
- Then I re-shipped the same work as consolidated, reviewed pull requests.
- The revert is the point. A healthy main branch matters more than my commit count.
- Thirteen-plus core pages are merged and live. Eight more sit in review, where they belong.

**Framing line:** On a live company repo, what you take back out matters as much as what you ship.

**Video concept**

- **Title:** The Revert, a clean main branch as one continuous timeline.
- **Narrative:** A single horizontal main-branch line runs left to right across a calm Surface-light frame. Six small commit nodes pop on in a hurried cluster, each tagged MERGED EARLY with a faint amber in-flight dot. The line beneath flickers from healthy cyan to a tense coral as unreviewed nodes accumulate. A single REVERT sweep travels right to left: the six early nodes lift off and fade, the line snaps back to clean cyan. Then three larger, calmer nodes settle on one at a time, each tagged CONSOLIDATED, REVIEWED with a cyan check. The line holds straight through all three. The whole thing reads as one branch staying clean over time, not a feature tour.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s | Cold open on empty frame: bg `#FCFCFD`, three soft drifting blobs wash in over 0.7s. A horizontal hairline "main" line draws on left to right (clip-path inset reveal), with a mono "main" label and a faint cyan health-pulse traveling. |
| 1.0s | Eyebrow + headline fade up centered above: mono "SURFACE LABS, A LIVE COMPANY REPO", display weight-600 "A healthy main branch." Holds ~1.4s. |
| 2.6s | Headline lifts and shrinks to a quiet top-left caption ("main, withsurface.com"). Six small square commit nodes pop on in a tight left cluster (staggered ~0.27s, scale 0.6 to 1, no overshoot). Each = a 12px square, amber in-flight dot, a mono tag (strategy guides / persona pages / competitor pages / industries dir. / case study / landing page) and "MERGED EARLY". |
| 4.4s | As the 5th and 6th land, the line under the cluster cross-tints cyan to coral (0.5s). The health-pulse stalls. A coral label "UNREVIEWED" fades in. Beat holds ~0.8s of micro-motion. |
| 5.6s | THE REVERT. A coral pull-back chevron enters from the cluster's right edge and sweeps right to left across all six (single driver, ~0.7s). As it passes each node, that node detaches upward and fades (staggered by arrow position). A mono coral label rides under: "REVERT, MAIN RESTORED". |
| 6.5s | With all six gone, the line snaps coral back to clean cyan (0.4s) and the health-pulse resumes full length. A 0.6s exhale on a clean empty healthy line, the visual claim. |
| 7.3s | Three larger calmer nodes settle on one at a time (staggered ~0.5s, scale 0.7 to 1 + translateY 18 to 0). Each = a bigger square with a cyan check, mono label (strategy guides / persona + competitor / industries + templates), tag "CONSOLIDATED, REVIEWED". The line stays straight and cyan. |
| 9.4s | All three hold, gently breathing (1px pulse). Caption fades up bottom-center: display weight-400 "The revert is the point." Full payoff hold ~1.6s. |
| 11.4s | Everything eases out: reviewed nodes and caption fade, the line clears back to the cold-open empty healthy state. T=END equals T=0. ~0.6s. |

- **Dims:** 1920x1080. **Duration:** 12s (360f).
- **Loop seam:** T=0 and T=end are both an empty unbroken cyan "main" line with blobs mid-drift and the health-pulse traveling. The closing ease-out reverses the build; blob drift uses continuous sine on `useCurrentFrame` so frame 360 phase equals frame 0. No node, arrow, or caption at the seam.
- **Palette:** bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, hairline `#E7E7E9`. Healthy/reviewed cyan tick `#1AA0C4` (line + checks, readable on white), accent fill `#A8ECFF` with dark text. Tension/revert coral `#EC6646` + soft `#FBE4DC`. Amber in-flight `#F0A500`. Drift blobs cyan/lime/sky. All from `tokensJune.ts`.
- **Render notes:** New Composition id `ProcessRevertTimeline` (do NOT reuse `PortfolioRevert` id, reserved for the case study, a different card-stack treatment). New file `src/ProcessRevertTimeline.tsx`; reuse `Blob`, `ip()`, `EASE_OUT_QUINT`/`EI`, COLOR/FONT from `PortfolioRevert.tsx`. The differentiator vs `PortfolioRevert`: that one stacks vertical cards; THIS one is a single horizontal branch-LINE with nodes traveling and detaching, so the two pages do not duplicate. 360f. Silent.
- **Honesty notes:** Told strictly at altitude. Shows an abstract main-branch line with generic work-area node labels (strategy guides, persona pages, etc., all public live page TYPES on withsurface.com, recap sections 6 and 7), the revert gesture, and three consolidated reviewed nodes. NEVER shown: PR numbers (#408, #418-420), branch names, reviewer/teammate names, dollar figures, raw tokens, lint/verifier/design-sync source, or surface-ui internals. The "6 merges reverted, then re-shipped as 3 consolidated reviewed PRs" is grounded in recap section 1, 7.2-7.3 and the case-study design doc (six unauthorized merges undone via revert #408, re-shipped via three consolidated v3 PRs). "Thirteen-plus core / eight in review" matches the doc's hard line. No surface-hub reference (0 commits from Rotem). No internal politics, no claim of authorship over `@surface/ui`.

---

### Beat 6 — Memory as a system

**Section label:** Memory as a system
**H2:** Memory is infrastructure, not notes

**Paragraphs:**
- A method only compounds if the AI remembers. Early on that meant one file read every session, around forty thousand tokens, mostly irrelevant to the task.
- I re-architected it. A small always-loaded core, topical rule files pulled only when the matching work starts, a failure checklist read only at review time.
- Session-start cost dropped roughly sixty to eighty times. Each bug a review catches becomes one line, so the next session never re-debugs it.
- Same instinct as a design token. Solve a thing once, encode the solution as infrastructure, then stop solving it.

**Framing line:** One bloated file read every session, re-architected into a lean core plus rules pulled on demand.

**Video concept**

- **Title:** Memory as Infrastructure, bloated file distills into a lean routed system.
- **Narrative:** A single tall block labeled 40,000 tokens, read every session, splits into three tiers. A small always-loaded core sits up top. Three topical rule cards wait below, dimmed until a use pulls one in. A review-only immune checklist sits apart and lights only at review time. The session-start counter drops from 40,000 to ~510 as the heavy block evaporates. The loop reads in five seconds as one heavy thing becoming three light, purpose-routed things.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s | HOLD BEFORE. Center: one tall monochrome block, fourteen faint prose lines of varied width, mono eyebrow "learnings.md". Below it a coral counter "40,000 tokens, read every session". Two soft cyan blobs drift behind. Counter uses tabular-nums. |
| 1.6s | TRIGGER. A thin cyan beam (gradient) sweeps top to bottom across the block (opacity 0 to 1 over 12f). Read as a parse pass. |
| 2.0s | SPLIT. The block separates into three stacked tiers on a 14f stagger (translateY 16 to 0): CORE (compact card, 3 lines, "core, always loaded, ~510 tokens"); RULES (three square hairline cards: rules/animation, rules/video, rules/design, dimmed ~45%); IMMUNE (one card set apart with an indigo-tint rail, "immune, review only", dimmed). The 14 prose lines fade to 0 as tiers arrive, so total ink DROPS. |
| 2.4s | COUNTER MORPH (overlaps the split). The coral "40,000" counts down to "~510" on one clamped ease-out, recoloring coral to calm tick-cyan as it lands. Label swaps to "tokens at session start". |
| 3.4s | ROUTE ON DEMAND. A mono tag "building an animation" slides in beside the rules row; the rules/animation card brightens 45% to 100% and nudges 6px toward the core, a 1px cyan connector drawing core to that card. The other two rule cards stay dimmed (proof they are not loaded). |
| 4.6s | REVIEW BEAT. Tag swaps to "review". The pulled rule card dims back to 45%; the IMMUNE card brightens with its indigo rail, a connector drawing core to immune. Reinforces: immune read only at review time. |
| 5.6s | RESOLVE / HOLD AFTER. Connectors fade; rules and immune settle to uniform dimmed rest (~55%), core stays bright, the ~510 counter holds. The longest hold. |
| 7.2s | SEAM RETURN. The three tiers re-converge into the single tall block (reverse of split), the counter ticks back 510 to 40,000 recoloring to coral, prose lines fade back in. By 9.0s the frame is pixel-identical to 0.0s. Blob phase continuous. |

- **Dims:** 1920x1080. **Duration:** 9s (270f).
- **Loop seam:** T=0 and T=end are the identical BEFORE state: one tall block, 14 faint prose lines at the same widths, coral counter "40,000", blobs at the same phase. The split/route/review fully reverses in the 7.2s to 9.0s return so frame 0 equals frame 270 geometrically. Blob period divides evenly into 270, or a 6f crossfade hides any seam jump.
- **Palette:** bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, beam gradient `#54CFEC` to `#1AA0C4`, accent fill `#A8ECFF`, before-cost coral `#EC6646` (soft `#FBE4DC`), after-cost tick `#1AA0C4`, immune rail indigo `#4F46E5` (fill `#F0EFFC`), faint prose-line `#E2E1DD`.
- **Render notes:** New Composition id `PortfolioMemory`, file `src/PortfolioMemory.tsx`, 270f. Clone `PortfolioTemplate.tsx` conventions: `ip()`, `Blob`, the named-frame `T` object, the beam treatment. Reuse the existing 14-line varied-width prose fill (widths 92/78/86/64/90/73/81/58/88/70/84/66/79/52 from `js/demos/process-memory.js`) so the before-state matches the current site demo. Counter uses FONT.mono + tabular-nums. Poster prefers t~5s (clean after-state) over the t~2s default mid-split.
- **Honesty notes:** Shows the SHAPE of Rotem's OWN portfolio memory architecture (the `.claude/` system in this repo): one big file becoming a small always-loaded core, topical rule files pulled on demand, a review-only immune checklist, and the ~60-80x session-start reduction. These are Rotem's own process facts, not Surface internals, so fully showable. The "40,000 to ~510" mirrors the existing live process.html numbers. No Surface memory internals, no raw token values from any Surface config, no tooling source. The "60 to 80" factor is kept as an approximate range, matching the live page. The immune indigo `#4F46E5` is kept only as a thin rail so it reads as a distinct tier without importing Ghost's full palette.

---

### Beat 7 — The video system

**Section label:** The video system
**H2:** One data file drives the film and its sound

**Paragraphs:**
- At Surface Labs I built a Remotion video system, not a one-off render. Each film is a typed data file.
- The same timing helper places every bar and every sound cue. Swap the data and both re-sync by construction.
- settleFrame(rank, score) returns one frame number. The bar lands on it. The pluck fires on it.
- One codebase renders the same film square, vertical, and wide. A format prop threads the layout to every child.
- I composed this on Surface's own tokens and synthesized the sound kit in code. No stock assets, no drift.

**Framing line:** Watch one timing function drive the bars and the sound at once.

**Video concept**

- **Title:** Motion System: one file, the film and its sound.
- **Narrative:** A 12s silent loop that makes the "one data file drives both" idea legible without audio. Left third is a small data/timeline panel; center is the leaderboard bars racing up; a thin track along the bottom is the visualized SOUND layer (named cue chips that pulse exactly when each bar lands). The dazzle: a glowing driver value, settleFrame(rank, score), travels from the data panel and forks into TWO synchronized strikes at the same frame, one hitting the bar's landing, one hitting the sound-cue chip. Then the frame snaps through three aspect ratios (wide, square, vertical, back) to prove one codebase, many films, returning to the opening pose.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s (f0) | HOOK. On paper with three drifting blobs, eyebrow "SURFACE LABS / THE VIDEO SYSTEM" rises with headline "One file. The film and the sound." Holds ~1s. |
| 1.3s (f38) | Hook lifts and fades as three regions scaffold in: LEFT data/timeline panel (editor chrome, "timelineJune.ts" tab), CENTER bar board, BOTTOM sound track. Scale-from-0.85 + fade, 14f. |
| 1.6s (f48) | LEFT panel types 3 mono lines (26f stagger): "data = june2026" (7 brands), the helper "settleFrame(rank, score)" highlighted in cyan, "buildCues(data)". A blinking cursor follows each. The literal single source of truth. |
| 3.0s (f90) | RACE begins. 6 horizontal bars (ranks 7 down to 2) fill left to right one at a time bottom to top on the 120-BPM cadence (FPB=15), gradient `#54CFEC` to `#1AA0C4`, single ease-out, zero overshoot. Each bar's % counts up. Cadence ~22f, exactly RACE.cadence from `timelineJune.ts`. |
| 3.0s+ | THE DRIVER MOMENT. As each bar nears landing, a glowing token "settleFrame(N)" detaches from the LEFT panel and travels right along a 2px cyan beam; at the exact landing frame it FORKS: one spark strikes the bar end (scale-tick + glow), one drops to the sound track and lights a cue chip "sfx pluckN" that pulses (scaleY) like a struck waveform. Both on the SAME frame. The sync is shown, not heard. |
| 8.0s (f240) | PAYOFF. The #1 bar (HubSpot, longest) sweeps up slower and heavier, counts to its score, locks with a glow + brand-color pop; its fork lights the final cue chip "sfx ding". The board holds fully settled ~1.2s. |
| 9.4s (f282) | FORMAT SWITCH. A label "formatFor(w, h)" flashes; the whole frame reflows WIDE to SQUARE (board squares up, rows restack) to VERTICAL (tall) and back toward WIDE, each transition ~14f. Proves one codebase renders all aspect ratios. |
| 10.8s (f324) | Caption "One data file drives the visuals and the beat-synced sound." rises at the bottom. Everything settles back into the exact opening composed pose. |
| 11.6s (f348) | Gentle cross-dissolve of the caption out and blobs back to their f0 phase so T=end equals T=0. |

- **Dims:** 1920x1080. **Duration:** 12s (360f).
- **Loop seam:** Blob drift is sine/cosine of (frame+phase); 360f (multiple of FPB=15) means each blob completes whole cycles so phase at f360 equals f0. The format switch ends back on WIDE with the board settled in the identical pose it scaffolded into; the caption fades fully out by the last 4 frames.
- **Palette:** `tokensJune.ts`: bg `#FCFCFD`, ink `#272727`, muted `#6B6B70`, hairline `#E7E7E9`, bar gradient `#54CFEC` to `#1AA0C4`, accent light-cyan `#A8ECFF` (fill only, never thin text), coral `#EC6646` used sparingly, blobs cyan/lime/sky. FONT.display (PP Object Sans) 400/600 only, FONT.mono (PP Supply Mono) for numbers/labels/code.
- **Render notes:** New Composition id `PortfolioMotionSystem`, 360f. REUSE `Blob`, `Cursor`, `CodeLine`, editor/browser chrome from `PortfolioTemplate.tsx`; `tokensJune.ts`; the real `settleFrame`/`fillStart`/`growFor` + RACE/PAYOFF constants from `timelineJune.ts` as the actual driver (import them, do not retype frames); cue labels mirror `soundJune.ts` (pluck1-7, ding). The bottom sound track is a VISUAL of the cue list since page videos ship silent. Build silent: no Audio components, no sound prop. Verify the fork-strike lands on the SAME frame for bar and cue chip.
- **Honesty notes:** The Remotion system architecture (data file + timeline helper + sound map + responsive layouts) is real and grounded in recap section 3 and the on-disk files `timelineJune.ts`, `soundJune.ts`, `sound.ts`, `layouts.ts`; settleFrame genuinely drives both visuals and SFX; films genuinely render across square/vertical/wide via formatFor. The AI Visibility Index leaderboard it visualizes is a shipped public Surface film. Sound is shown as a code-driven cue track (named cues, real filenames) rather than claimed as audible, honest since portfolio videos ship silent. "Composed on Surface tokens" avoids claiming authorship of `@surface/ui`. No dollar figures, no 30% claim, no reviewer/branch names, no surface-hub. The synthesized-sound-kit claim is verifiable (recap 3.5). The brand list (HubSpot #1) matches the real shipped data file.

---

### Beat 8 — What it shipped

**Section label:** What it shipped
**H2:** The method shipped four things you can open.

**Paragraphs:**
- Three products and a marketing site, all built this way. Two run live. One is the page you are reading.
- Surface Labs is the new proof. The same method shipped real pages to a YC company site.
- Live links open the product. Case study links open the story. The labels stay honest.
- Surface is contract and freelance, not full-time. The site links go to public withsurface.com pages only.

**Framing line:** Four artifacts, one operating model, live links kept honest.

**Video concept**

- **Title:** ProofGrid, four shipped artifacts reveal.
- **Narrative:** A 2x2 grid of four proof cards builds in, one per beat, on the warm portfolio shell. Each card states the artifact, a one-line what-it-is, and an honest status tag (LIVE or CASE STUDY). Surface Labs leads top-left as the validated production proof, then Pulse, Ghost, This portfolio. A thin status row underneath counts the honest tally. The whole point: the method produced FOUR real things, not a slide.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s | Open on empty `#FAFAF8` paper. A mono eyebrow "WHAT IT SHIPPED" fades in top-left over 8f, weight-400, `#888`. |
| 0.5s | Four card outlines (1px `#E8E8E6`, 12px radius) scaffold in as empty frames in a 2x2 asymmetric bento, staggered 6f, scaling 0.96 to 1.0. Scaffold-first. |
| 1.3s | Card 1 (top-left, Surface Labs) fills: big Satoshi-700 name wipes up under a clip mask, then proof-line "Designed in Claude, shipped in code, merged to production." fades in 10f later at `#555`. |
| 2.1s | Surface status tag stamps in: a square chip "LIVE on withsurface.com" with one cyan pulse (`#2a9bbb` hairline, light-cyan `#A8ECFF` fill, dark text). A second ghost tag "CASE STUDY" sits muted beside it. |
| 2.6s | Card 2 (Pulse) fills the same way: name, line "A living UX observatory. Scrub time, watch friction heat up.", a LIVE tag (Pulse `#E8ECF2` tint) plus a muted CASE STUDY tag. |
| 3.4s | Card 3 (Ghost) fills: name, line "A design system reality scanner. Pick the canon, measure the drift.", LIVE tag in Ghost `#4F46E5` accent, plus CASE STUDY tag. |
| 4.2s | Card 4 (This portfolio) fills: name, line "Vanilla HTML, CSS, JS. Every animation built and verified the same way.", a single tag "YOU ARE HERE" (ink `#1A1A1A`). |
| 5.0s | A thin status row slides up beneath the grid: "FOUR SHIPPED, TWO LIVE, ONE IN PRODUCTION". Numerals count up from 0 over 14f, zero overshoot, lock and hold. |
| 6.0s | Hold the full grid ~2.0s. All four LIVE/accent tags share ONE synchronized slow breathing pulse (opacity 0.85 to 1.0) driven by a single sine. |
| 8.0s | Gentle crossfade: card fills, lines, tags, status row fade out over 30f back to the empty scaffold of T=0, then the eyebrow alone remains. Loop. |

- **Dims:** 1920x1080. **Duration:** 9s (270f).
- **Loop seam:** T=0 and T=end are both the empty 2x2 hairline scaffold with only the "WHAT IT SHIPPED" eyebrow visible. The closing 30f crossfade returns every element to the start state. The shared sine pulse on the LIVE tags completes a whole number of cycles across the loop, so its phase at T=end equals T=0.
- **Palette:** Shell: bg `#FAFAF8`, ink `#1A1A1A`, text steps `#333/#555/#888`, hairline `#E8E8E6`, radius 12px. Per-card accent confined to its LIVE tag: Surface cyan `#2a9bbb` with light-cyan `#A8ECFF` fill, Pulse tint `#E8ECF2`, Ghost `#4F46E5`, portfolio neutral ink. Satoshi only.
- **Render notes:** New Composition id `ProofGrid`, 270f. Reuse the panel-build + clip-mask reveal cadence and `EASE_OUT_QUINT`/COLOR/FONT imports from `PortfolioTemplate.tsx` as the structural reference, but RESKIN to the portfolio shell tokens (bg `#FAFAF8`, ink `#1A1A1A`, Satoshi via `@remotion/fonts`, NOT PP Object Sans which is unlicensed here). Reuse the count-up-with-zero-overshoot pattern from `Leaderboard`/`IndexFilm` for the status numerals. One shared sine driver for all LIVE-tag pulses. Replaces the static `.proof-grid` markup (process.html lines ~242-266) or sits as the hero above it; keep the existing honest text links beneath for real navigation, since the video is not clickable.
- **Honesty notes:** Shows only the four artifact names, one-line descriptors, and LIVE vs CASE STUDY tags. Surface card says "LIVE on withsurface.com" and "merged to production", both true and public. No PR numbers, branch/reviewer names, tokens, internals, or "~17 pages" on the card. The status row "FOUR SHIPPED / TWO LIVE / ONE IN PRODUCTION" (Surface in production, Pulse + Ghost live demos, portfolio here) avoids over-claiming. Surface framed as contract/freelance proof of method; the ~30% claim is NOT on this card (it belongs to the Surface case study, attributed there); no full-time implication. Surrounding HTML links go only to public withsurface.com pages, the live Pulse/Ghost demos, and internal case studies.

---

### Beat 9 — What I'd bring

**Section label:** What I'd bring
**H2:** What I'd bring to your team

**Paragraphs:**
- A real operating model for building with AI, not a vibe. The AI brings velocity and breadth. I bring taste and the bar.
- A bias toward shipping the whole loop, research through production code. This year that meant Pulse, Ghost, and 13+ core pages merged live at Surface Labs.
- And the discipline to verify what renders, not what compiles. Nothing reaches you that I have not watched myself.
- If that is the designer you are hiring, I would love to talk.

**Framing line:** The whole method, in one quiet loop.

**Video concept**

- **Title:** Process Close, the loop, distilled.
- **Narrative:** A restrained monochrome summary of the page's six method beats. Six labeled nodes (Fork, Verify, Memory, Seams, Ship, Repeat) sit on a single horizontal spine. A cyan token travels left to right, lighting each node as it passes, then a thin return path arcs back from the last node to the first so the cycle closes on itself. As the token completes its lap, the labels settle and one line resolves at center: an email pill. The motion reads in five seconds as a method that is a loop, not a line, ending on the ask. The cyan return path is the only color on an otherwise ink-on-paper frame, echoing the one-accent discipline the page argues for.

- **Choreography:**

| At | Action |
|---|---|
| 0.0s (f0) | Open on warm paper `#FAFAF8`, empty. A 1px ink hairline spine draws left to right across the lower-middle (0 to 100% width over f0-24). |
| 0.8s (f24) | Six square hairline nodes (`#1A1A1A` 1.5px stroke, no fill, ~64px) pop onto the spine one at a time (9f stagger, scale 0.85 to 1 + opacity, zero overshoot). Mono labels fade in beneath: FORK / VERIFY / MEMORY / SEAMS / SHIP / REPEAT. |
| 1.6s (f48) | After node 3 lands, the eyebrow "THE METHOD" fades in top-left, small mono, `#888`. |
| 2.6s (f78) | A solid cyan token (`#1AA0C4` fill, ~14px square) materializes at node 1 (Fork). Brief 200ms settle, then travels the spine. |
| 2.6s-6.6s (f78-198) | Token travels node to node (~20f per hop, 6f pause at each, snap-pause-snap). On arrival: that node's stroke flips ink to cyan and its label brightens `#999` to `#1A1A1A`. Passed nodes hold their cyan-lit state. Traversal ease cubic-bezier(0.77,0,0.175,1), arrival ease (0.23,1,0.32,1). |
| 6.6s (f198) | Token reaches node 6 (Repeat). A thin cyan return path arcs UP and back from node 6 to node 1 (over f198-228). The "not a line, a loop" payoff. |
| 7.6s (f228) | All six nodes cyan-lit. The spine + nodes group eases UP ~40px and dims to ~35% (recedes to background), making room below. |
| 8.0s (f240) | Centered, ink: the line "What I'd bring" resolves (fade + 12px rise). Below it an email pill "rotem.gotlieb@gmail.com" on a soft light-cyan `#A8ECFF` fill, dark ink text, square corners, a small mono arrow. Pill scales 0.92 to 1, zero overshoot. |
| 8.8s-11.0s (f264-330) | HOLD ~2.2s: dimmed cyan-lit loop above, the line and email pill centered and steady. Token rests at node 1, faint. |
| 10.8s (f324) | Seam crossfade: email pill, center line, eyebrow, and lit-node states all cross-dissolve back toward the f0 empty-paper + bare-spine state over f324-330. |

- **Dims:** 1920x1080. **Duration:** 11s (330f).
- **Loop seam:** T=0 and T=end are both the warm-paper frame with only the bare ink spine present (nodes unlit, no token, no email pill, no center line). The f324-330 crossfade returns every element to the opening state. The token rests at node 1 before fading. Verify the first and last rendered stills are pixel-identical.
- **Palette:** Paper `#FAFAF8`, ink `#1A1A1A`, muted `#888/#999` for pre-lit labels and eyebrow. Cyan accent: token + lit nodes + return path use deep cyan `#1AA0C4` (readable on paper); email pill fill uses light-cyan `#A8ECFF` with dark `#1A1A1A` text. No gradients, no second hue, no purple.
- **Render notes:** New Composition id `PortfolioProcessClose`, file `src/ProcessClose.tsx`, 330f, silent. This is the portfolio's OWN monochrome shell, NOT `tokensJune`, so do NOT import `tokensJune` for bg/ink; define local PAPER `#FAFAF8` / INK `#1A1A1A`. Reuse only `EASE_OUT_QUINT`, the traversal/arrival eases via `Easing.bezier`, the `RADIUS=4` convention, the `ip()` helper and the frame-constant `T` map from `PortfolioTemplate.tsx` as scaffolding. Satoshi must load on the render path via `@remotion/fonts loadFont`; if Satoshi licensing on the render path is unverified, fall back to the system display stack and FLAG it. The HTML `#bring` section keeps the mailto CTA link as real fallback text below the video.
- **Honesty notes:** Shows only abstract motion graphics (nodes, spine, token) and a public email address. No Surface UI, no PR numbers, no branch/reviewer names, no tooling. The six node labels summarize the page's own already-public arguments. The one number, "13+ core pages merged live", is the verified floor from the recap; the approximate ~17-page proposal figure and the unattributed 30% product claim are deliberately OMITTED here. "Contract" is not implied as full-time. Pulse and Ghost are Rotem's own products. The revert is referenced only at altitude via the "Seams" node label.

---

## 4. Coherence pass

The page must read as one system, not nine unrelated clips. Walking top to bottom:

**No two adjacent loops clash or repeat a mechanic:**
- Beat 1 (pipeline, three panels, left-to-right beams) into beat 2 (single decision card, cursor + lock). Different scale (wide pipeline vs intimate card) and different driver (auto-build vs human cursor). No clash.
- Beat 2 (decision card, cursor) into beat 3 (two-panel editor + page build, no cursor, fan-out). Beat 3 is busier and wider; beat 2 is calm and singular. The contrast is intentional.
- Beat 3 (build/fan-out, cyan + coral CTA) into beat 4 (split terminal vs lying UI, green + coral + Pulse heat). Both use code chrome, but beat 4 introduces the green/coral semantic and a split layout absent in beat 3. Distinct.
- Beat 4 (split frame, verdict flow) into beat 5 (single horizontal branch line, nodes detaching). Beat 5 is the most spatially different on the page (one line, not panels). Strong palate cleanser.
- Beat 5 (horizontal line) into beat 6 (vertical tall block splitting into tiers). Beat 6 is vertical and tier-based, the orthogonal axis to beat 5. No repeat.
- Beat 6 (memory tiers) into beat 7 (racing bars + sound track + format switch). Beat 7 is the most kinetic; beat 6 the most static-resolving. Good rhythm.
- Beat 7 (kinetic Surface motion graphics) into beat 8 (calm portfolio-shell proof grid). The shell shift (Surface to portfolio) signals "we are coming home". Intentional gear change.
- Beat 8 (grid) into beat 9 (single spine loop). Both portfolio-shell, both restrained; beat 9 closes the loop the page opened. Deliberate bookend.

**The horizontal-line motif appears twice (beats 5 and 9) on purpose:** beat 5 is the Surface-themed branch line (cyan/coral, discipline), beat 9 is the portfolio-shell method loop (ink + one cyan, the close). They are 4 beats apart, in different shells, carrying different meanings (clean main vs the method-is-a-loop). This rhymes rather than repeats, and reinforces "one system".

**The Surface-to-portfolio shell arc** is the spine of coherence: open in a bridge (beat 1: portfolio frame, Surface inner), live in Surface for beats 2 to 7, return fully to the portfolio shell for beats 8 to 9. The page visits the proof and comes back to Rotem's voice.

**One signal per meaning holds across all nine:** cyan = healthy/reviewed/consensus/the-accent, coral = divergence/lie/revert, amber = in-flight, green = passing gate, indigo = the immune/review tier only. No beat stacks three cues.

**Reuse vs new:**
- Beat 3 EXTENDS the existing `PortfolioTemplate` comp (do not rebuild; add the CI guard + fan-out segments, fix the stat-overlay honesty issue).
- Beats 1, 2, 4, 5, 6, 7, 8, 9 are NEW comps, but each reuses `Blob`, `ip()`, the `T` frame-constant pattern, `EASE_OUT_QUINT`, and (where Surface-themed) the editor/browser chrome from `PortfolioTemplate.tsx`. This shared toolkit is what makes nine clips feel like one film.
- The existing `PortfolioRevert` comp is a code donor for beats 4 and 5 (its `T` skeleton and `Blob`) but is NOT embedded; beat 5 deliberately uses a horizontal-line treatment so the process page does not duplicate the case-study card-stack.

---

## 5. Build order and verify plan

**Builds are MANUAL per the project rule** (from-scratch builds, fine-tuning, and bug fixes are manual + engine + browser-verify; research is the only background-workflow task). No subagent renders these.

**Build order** (cheapest reuse first, so the shared toolkit is proven before the from-scratch comps):

1. **Beat 3 (`PortfolioTemplate` extension)** first. It already exists; extending it (frames 330 to 420, add CI guard + fan-out, fix the stat overlay) validates the shared chrome and the honesty fix before anything new is built.
2. **Beat 1 (`PortfolioLoop`)** second. The opener reuses the most from beat 3's now-proven blocks; building it second locks the page's establishing visual language.
3. **Beat 5 (`ProcessRevertTimeline`)** and **beat 4 (`PortfolioVerify`)** next, both leaning on `PortfolioRevert`'s `T` skeleton and `Blob`.
4. **Beat 6 (`PortfolioMemory`)** and **beat 7 (`PortfolioMotionSystem`)**, both cloning `PortfolioTemplate` conventions; beat 7 also imports the real `timelineJune.ts` constants.
5. **Beat 2 (`PortfolioFork`)**, the cursor-driven card.
6. **Beat 8 (`ProofGrid`)** and **beat 9 (`PortfolioProcessClose`)** last, both reskinned to the portfolio shell (resolve Satoshi-on-render-path first).

**Per-video pipeline** (every beat):
1. Author the comp in `src/<Name>.tsx`, reusing the shared toolkit.
2. Register the `<Composition>` in `src/Root.tsx` (id, component, `durationInFrames`, fps 30, 1920x1080).
3. Render: `remotion render <id> out/<id>_raw.mp4 --crf 16 --concurrency 4`. Silent (no sound prop, no Audio).
4. iOS-encode: `ffmpeg -i out/<id>_raw.mp4 -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p -r 30 -fps_mode cfr -crf 24 -preset medium -movflags +faststart -an <out>.mp4`.
5. Poster: `ffmpeg -i <out>.mp4 -ss 2 -vframes 1 -q:v 4 <out>-poster.jpg` (beat 6 uses `-ss 5`).
6. ffprobe-verify: profile=Main, level<=40, yuv420p, 30/1 CFR, faststart, no audio.
7. Wire into process.html: `<video autoplay muted loop playsinline preload="metadata" poster aria-label>`, framing line above, optional italic caption below, `.reveal:has(video){opacity:1;transform:none}` on the wrapper. Above-fold beats (1, 2) also get a parse-time scoped `.play()`.
8. Browser-verify: watch the rendered loop frame-series (every 500ms across the full loop + seam), confirm zero console errors, confirm the seam is pixel-identical, and (mobile) confirm `.case-content` width equals viewport width at 375.

**Cache-bust:** before any deploy, bump `?v=N` monotonic in lockstep across ALL HTML files, on every CSS/JS change. Smoke-test the live domain after `vercel deploy --prod --yes`, then test the above-fold autoplay on a real iPhone.

---

## 6. Open decisions for Rotem

Consolidated from the per-beat questions, ranked by impact:

1. **Cyan unification.** Lock the engine artifacts on the website token `#2a9bbb` while the rendered videos keep their `#1AA0C4`-to-`#54CFEC` gradient and `#1AA0C4` on-white tick, or force one cyan everywhere? Recommendation: keep `#1AA0C4` for on-white legibility inside the videos, `#2a9bbb` for page chrome. (Affects beats 1, 5, 8.)
2. **The hard live/in-review numbers to print.** Confirm "thirteen-plus core pages merged live" as the floor and "eight more in review" (recap gives 13+ live and the design doc says 8 in review). These appear in beats 1, 5, and 9 prose. Mandatory: the existing `PortfolioTemplate` stat overlay says "17 pages shipped live", which overstates and MUST change to proposal-scope vs in-production, or be dropped.
3. **Durations vs the 11s siblings.** Several beats run 12 to 14s (opener 12, system 14, revert 12, motion 12) against the 11s `PortfolioRevert`/`PortfolioTemplate`. Confirm the longer reads are wanted, or compress to ~11s for rhythm.
4. **Satoshi on the Remotion render path** (beats 8, 9). Confirm Satoshi loads via `@remotion/fonts` (Fontshare static file); if not, choose a self-hosted woff2 or an approved fallback before render. A wrong font must not ship silently.
5. **Node labels must match final section eyebrows** (beat 9 assumes Fork, Verify, Memory, Seams, Ship, Repeat). If the 9-beat reorder renames sections, the node labels change verbatim.
6. **CI-guard clarity** (beat 3). The rejected hex `#7B61FF` is invented and off-brand. Confirm a caption stating the token check is real and the value illustrative, so showing a blocked hex never reads as exposing the lint source.
7. **Beat 4 numbers on record.** Confirm 116/116, 16 confirmed, 0 false positives (they match current process.html but predate Surface). Confirm mixing the Pulse heat palette inside a Surface-shell workspace is acceptable, or drop beat 4 to a neutral shell to avoid three brand palettes.
8. **Memory figures still current** (beat 6). Confirm the ~60-80x factor and "40,000 to ~510" if the real `.claude/` core has grown since 2026-06-10.
9. **Proof-grid emphasis and live link** (beat 8). Confirm Surface Labs leads top-left as the larger card, the page count stays off the card, and the surrounding LIVE link targets `/lp/pipeline-diagnosis` (matches the case-study hero) vs withsurface.com home.
