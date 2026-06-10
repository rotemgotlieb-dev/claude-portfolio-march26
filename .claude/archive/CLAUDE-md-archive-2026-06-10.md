# .claude/CLAUDE.md — Project Rules & Build Commands

## Tech Stack
- Vanilla HTML/CSS/JS — no frameworks
- Satoshi font from Fontshare (400, 500, 700, 900 weights)
- CSS custom properties for theming (light/dark mode via `[data-theme="dark"]`)
- Single `styles.css` for all pages, single `main.js` for all interactions
- `game.js` separate for the footer mountain biker game
- Each case study is its own HTML file in `work/`

## UX Patterns
- Full-width hero image → 1040px centered content column
- Body text max-width: 640px in case studies
- Scroll reveals via IntersectionObserver (threshold 0.1, rootMargin: 0px 0px -40px 0px)
- Page transitions via `.page-transition` fade overlay (200ms out, 300ms in)
- Magnetic tilt hover on bento cards (JS mousemove, desktop only)
- Custom cursor: 8px circle, lerp follow, 40px on hover targets

## Architecture
- `index.html` — Homepage with intro animation + bento grid
- `about.html` — About page
- `styles.css` — All styles
- `main.js` — All interactions, cursor, page transitions, scroll reveals
- `game.js` — Footer game (separate)
- `work/*.html` — Case study pages (lexisnexis, pulse, ghost, gotefigure)
- `img/` — Optimized images per project subfolder

## Build & Test
- **Run:** `python3 -m http.server 8080`
- **Test:** Open `http://localhost:8080` and click through all pages
- **Verify:**
  - Intro animation plays on refresh (not on internal nav back)
  - Dark mode toggle works on every page
  - Game audio plays only during active gameplay
  - Page transitions work between all internal links
  - Check responsive at 1200px, 768px, 375px

## Image Layout Protocol

Established 2026-04-26 after a trim session silently converted `.case-image-trio` (3-up small grid) into single full-width `.case-image` blocks because the trim left fewer than 3 images per cluster. That is exactly the failure this protocol prevents.

**Standing rules — apply to any case study, any page, any future trim or edit pass:**

1. **Text content changes do not carry permission to change image layout.** Image container classes (`.case-image`, `.case-image-trio`, `.case-image-sm`, etc.), grid patterns, image counts, and image sizes are independent decisions from prose decisions. A brief that says "trim the prose" or "rewrite this section" does not authorize touching image structure.

2. **If a text-content change creates downstream pressure to change image layout** (e.g., a section trim leaves a 3-up row with only 2 images, or removing a paragraph orphans an image cluster), **STOP**. Surface it in STEP 2 of the proposal as a labeled "**Structural side effect**" item and ask the user before executing. Never silently restructure image containers — even if the new structure looks reasonable, the user has a layout intent that may differ from yours.

3. **Default reflex when an image-row loses an image:** keep the row layout, resize remaining children if needed, OR ask the user whether to keep the cut image. **Do NOT convert a small-grid row to a single full-width image.** Full-width is a different layout decision (different visual rhythm, different reader cadence, different content density) and requires explicit approval. The reverse also applies: do NOT promote a single full-width image into a small-grid row without approval.

4. **`.case-image-trio` is a 3-children-only component.** Two children leaves an empty column; one child leaves two empty columns. If a cut leaves a trio with <3 children, the choice is: (a) restore a 3rd image (which one?), (b) collapse to single `.case-image` divs (full-width — explicit approval needed), or (c) introduce a new 2-up class. Always ask which.

5. **Image taxonomy on this site is small and load-bearing.** Read [styles.css](styles.css) for the canonical definitions before changing any image container: `.case-image` (full-width, 16:10 default; modifier `.case-image--video-wide` for 16:9 video), `.case-image-trio` (3-column grid), `.case-image-sm` (trio child, 16:10). Never invent new container classes without flagging.

6. **The convention on this site is "image divs as siblings between sections, not children inside `<section>` tags"** for case-study body images. The sole exception is the Outcome section's footer summary image, which lives inside `<section id="outcome">`. Match this convention when restructuring.

## Mobile Video Standing Rule

Established 2026-04-29 after iOS Safari + Chrome on mobile reported static poster + center-play-icon (autoplay-blocked symptom) on the Pulse and Ghost bento thumbnails AND the Pulse case-study videos. Diagnosis: every `<video>` element already had the canonical 7-attribute pattern, but underlying video files used H.264 High profile (not Main), declared 120 fps with VFR content (Ghost), Level 4.2 (above the L4.1 ceiling), and three Pulse case-study files used `.mov` containers served as `video/quicktime` MIME. iOS autoplay refuses on any of those. This rule prevents recurrence.

**Standing rules — apply to every `<video>` element and every video file added to this site:**

1. **Every `<video>` element on this site MUST have all 7 attributes:** `autoplay`, `muted`, `loop`, `playsinline`, `preload="metadata"`, `poster`, `aria-label`. Missing any one breaks iOS autoplay. `muted` is the iOS autoplay unlock — drop it and autoplay silently fails on every iPhone. `playsinline` prevents iOS from hijacking the video into fullscreen mode on play. `poster` gives iOS something to render before autoplay fires AND a fallback if autoplay is blocked. `aria-label` is the accessibility contract for non-text media. The full template:
   ```html
   <video src="path/to/video.mp4"
          poster="path/to/video-poster.jpg"
          autoplay muted loop playsinline preload="metadata"
          aria-label="describe what the video shows">
   </video>
   ```

2. **Every video file MUST be H.264 Main profile, Level ≤4.0, yuv420p pixel format, 30 fps CFR (constant frame rate, not VFR), audio stripped, `+faststart` flag.** `.mov` containers are technically OK if the codec inside is compliant, BUT static-server MIME-type defaults often serve `.mov` as `video/quicktime` — iOS Safari is stricter on `.mov` autoplay than `.mp4`. **`.mp4` is the required container** on this site. The canonical ffmpeg encode pipeline:
   ```bash
   ffmpeg -i input.mov \
     -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p \
     -r 30 -fps_mode cfr \
     -crf <24-for-case-study|28-for-bento> -preset medium \
     -movflags +faststart -an \
     output.mp4
   ```
   The `-r 30 -fps_mode cfr` combination is **load-bearing** — fixes the 120fps-declared / VFR-actual autoplay trap discovered in the Apr 29 session. The `-an` strips audio. The `+faststart` puts the moov atom before mdat so iOS can begin playback before full download.

3. **Always extract a poster JPG before embedding** — at `t=0.5s` for short loops, `t=2s` for longer demos. Posters prevent flash of empty frame on slow connections AND give iOS something to render if autoplay fails for any reason. Pipeline:
   ```bash
   ffmpeg -i input.mp4 -ss 00:00:02 -vframes 1 -q:v 4 poster.jpg
   ```

4. **VERIFY ffprobe output on every new file before considering the work done.** Don't trust ffmpeg flags — verify the actual output stream metadata. Required output: `profile=Main`, `level≤40`, `pix_fmt=yuv420p`, `r_frame_rate=30/1`, `avg_frame_rate=30/1` (not a fractional value — fractional means VFR, not CFR), faststart=YES (moov atom before mdat), audio stream absent.

5. **Test on real iOS device (Safari + Chrome) before considering any video work shipped.** Desktop Chrome ≠ iOS Safari. Desktop Chromium autoplays muted High-profile-Level-4.2-VFR video without complaint. iOS will refuse silently. Real-device testing is mandatory; simulators are insufficient. The deployed URL on a real iPhone is the only valid acceptance test.

6. **Cascaded ancestor visibility — NO ancestor from `<video>` up to `<body>` may have `opacity: 0`, `display: none`, `visibility: hidden`, or off-screen `transform` at parse time.** Established 2026-04-30 (afternoon) after the morning's `.page-transition.active` fix solved one occurrence of this pattern but the bug persisted because `.reveal { opacity: 0 }` hid every video on the site through cascade. iOS Safari evaluates autoplay at parse against the cascaded compositor alpha — `opacity: 0` on any ancestor at any depth disqualifies the video. Same logic applies to `display: none` (subtree not rendered), `visibility: hidden` (rendered but invisible), and `transform: translateX(-100vw)` or similar off-screen positioning. **iOS makes the autoplay decision once at parse and does NOT retry on per-element class changes.** The IO `.classList.add('revealed')` pattern with a CSS opacity transition is too late — by the time the transition runs, iOS has already denied autoplay for that video element permanently. Discrimination test: if toggling dark mode (or any global cascade-rebuilding action) "unsticks" the autoplay, an ancestor visibility issue exists. Fix patterns: (a) preferred — exempt video-containing ancestors from the hidden state via `:has(video)` override (e.g., `.reveal:has(video) { opacity: 1; transform: none; }`); (b) structural — move videos outside reveal-on-scroll subtrees entirely. **Audit checklist for any new `<video>` placement: walk the DOM from the video to `<body>` and confirm no class on any ancestor sets `opacity < 1`, `display: none`, `visibility: hidden`, or `transform` that moves content off-screen at parse.**

7. **Parse-time `.play()` invocation is required for above-the-fold videos — the `autoplay` attribute alone is insufficient.** Established 2026-04-30 (evening) after a real-iPhone diagnostic confirmed `paused:true / lastPlayState:never-called` at parse on every video, even with rules §1–§6 satisfied. iOS Safari treats the implicit `autoplay` attribute as a *hint*, not a guarantee — without a user-activation token, the browser frequently denies it silently. The fix is an explicit JS `.play().catch(() => {})` pass at `DOMContentLoaded` (or immediately if the DOM is already parsed). **The pass MUST scope to viewport-visible videos only** (see §7a — promoted 2026-04-30 late evening after the unscoped first version saturated decoders on Pulse and starved the cursor RAF loop). The IO retry from §JS-State Classes #4 only fires for videos that scroll into view; **videos already in view at parse never trigger IO and need a separate parse-time bootstrap.** The canonical pattern lives at [main.js:286-308](main.js#L286-L308):
   ```js
   function attemptVideoAutoplay() {
     var allVideos = document.querySelectorAll('video');
     allVideos.forEach(function (v) {
       var rect = v.getBoundingClientRect();
       if (rect.top < window.innerHeight && rect.bottom > 0) {
         v.play().catch(function () {});
       }
     });
   }
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', attemptVideoAutoplay);
   } else {
     attemptVideoAutoplay();
   }
   ```
   The `readyState === 'loading'` guard is **load-bearing** — `main.js` loads at end-of-body without `defer`, so DOMContentLoaded has typically already fired by the time the IIFE runs. A bare `addEventListener('DOMContentLoaded', ...)` would silently never register. The else-branch calls immediately. **Rule: every DOMContentLoaded listener registered from end-of-body must be wrapped in this readyState guard.** This is the sixth autoplay gate — combined with rules §1–§6, all six must pass independently. The six gates: (1) attributes, (2) codec, (3) container/MIME, (4) parse-time occlusion (no opaque overlays — JS-State Classes Standing Rule), (5) cascaded ancestor visibility, (6) parse-time `.play()` API invocation (viewport-scoped — see §7a). AND a meta-layer: **(M) asset cache invalidation (`?v=N` query string monotonic bump on all 8 HTML in lockstep)** — without this, none of the six fixes propagate past deploy.

7a. **Any cross-page video operation MUST filter by viewport visibility before firing.** Established 2026-04-30 (late evening) after the unscoped parse-time `.play()` pass landed earlier the same day fired `.play()` on every `<video>` regardless of viewport position. On Pulse (4 videos, ~2.3 MB cumulative, 3 below the fold) this saturated hardware decoders at parse, queued media-element callbacks on the main thread, and starved the custom-cursor RAF loop — user reported visible cursor lag site-wide. The fix scoped to `getBoundingClientRect().top < window.innerHeight && rect.bottom > 0`. Decoder fan-out at parse on Pulse dropped from 4 to 1; on About from 2 to 0; below-fold videos defer to the IO retry that was always handling them. **Rule: any `document.querySelectorAll('video').forEach(...)` that triggers expensive work (`.play()`, `.load()`, attribute mutation, codec inspection) MUST gate on viewport intersection. The unscoped pattern is almost always wrong: autoplay rescue is viewport-bound, decoder budgets are viewport-bound, main-thread budgets are viewport-bound. The canonical filter:**
   ```js
   var rect = v.getBoundingClientRect();
   if (rect.top < window.innerHeight && rect.bottom > 0) { /* fire */ }
   ```
   Below-fold videos are handled by the IO retry block in [main.js](main.js) (`SCROLL REVEAL` section) when scrolled into view — that path was always present and is the correct rescue surface for off-screen videos. **Audit checklist before adding any new "for every video" operation: ask "does this need to fire on off-screen videos right now?" If no (and it almost never is), gate by viewport. Pair with the IO retry for the off-screen surface.**

7b. **Any element animated via JS-set transforms in a RAF loop MUST declare `will-change: transform` in CSS.** Established 2026-04-30 (late evening) alongside §7a. Without compositor-layer promotion, transform updates can trigger paint of the element's area; under main-thread pressure (e.g., decoder callbacks queueing) the RAF loop drops frames and the animation visibly stutters. With `will-change: transform`, the element gets its own GPU layer; transform updates skip paint entirely. Tiny memory cost (one extra layer), large smoothness payoff. Currently applied: `.custom-cursor` ([styles.css:334](styles.css#L334)), `.intro-icon` ([styles.css:167](styles.css#L167)). **Audit checklist when introducing any new RAF-driven transform animation: declare `will-change: transform` on the animated element. Don't rely on browser auto-promotion.**

## Recurring Bug Rule

Established 2026-04-30 (evening) after a single iOS Safari autoplay bug consumed five fix sessions over seven days (Apr 24 → Apr 29 → Apr 30 morning → Apr 30 midday → Apr 30 afternoon). Each session's fix was technically correct AND addressed a real layer of the iOS autoplay gate stack — yet the user-facing symptom ("video shows poster + center play icon") was identical across all six layers. Without instrumentation, every session's framing was indistinguishable from the previous: "the prior fix didn't work — try harder at the same layer or the next adjacent one." The breakthrough came when the protocol inverted: **30 minutes of pure instrumentation (a URL-flag-gated `?debug=videos` panel logging `userActivation`, computed-style visibility, paused/readyState/networkState, and a `v.play` monkey-patch recording every promise resolution) produced a state vector that pointed at exactly one remaining hypothesis (layer 6: no parse-time `.play()` invocation). The fix took five minutes to write.** This rule prevents the loop from recurring.

**Standing rules — apply to every recurring bug, all future sessions:**

1. **Identical symptoms across N≥2 fix sessions is THE diagnostic signal that the model is wrong.** When the user reports "still broken" after a fix attempt that was technically correct for the layer it addressed, do NOT immediately attempt the next-most-adjacent fix. Stop. The protocol is wrong, not the layer. The next session must be **diagnostic-only**.

2. **Diagnostic-only sessions produce no fix attempts.** No code changes intended to remedy the bug. Instead: instrument the affected subsystem with explicit logging or a visible debug panel; reproduce on the real failing platform (real iPhone for iOS bugs, not simulator; production deployment URL, not localhost); collect a **vector of state** — not just "broken vs not broken" but "what specifically is the value of every variable that could plausibly be wrong." The diagnostic itself is throwaway code, removed in the same session as the eventual fix.

3. **Defensive `.catch(() => {})` patterns hide failures during diagnostic phases.** Add `.then(() => log)` and `.catch(err => log)` during any debug session that involves promise-based APIs (video `.play()`, `fetch`, etc.). The empty-catch pattern is correct for production (no-noise) but a black box for debugging. Remove the logs only after the bug is confirmed closed.

4. **Diagnostic instrumentation lives behind a URL flag, not a build flag.** Pattern: `if (window.location.search.indexOf('debug=<feature>') !== -1) { ... }`. The flag-gated block is invisible to normal users, accessible to the developer with one URL change, and removable in a single edit. Do NOT leave debug panels in production code "in case we need them later" — they rot, accumulate state-leakage risks, and pollute the codebase. Remove the entire block in the same commit as the fix.

5. **The cost of one diagnostic-only session is a single round of "no apparent progress on the bug." The benefit is closing the loop instead of running it again.** Five fix sessions × ~30 min each = 2.5 hours of fix attempts that did not close the bug. One diagnostic session × 30 min = 30 min that produced the vector that closed the bug in 5 min. The math favors instrumentation as soon as N≥2.

6. **Going in circles without measurement is a code smell that means the diagnostic model is wrong.** This is the rule's load-bearing claim. If the symptom is unchanged after the fix you most strongly believed would resolve it, the unstated premise of "I know which layer is failing" is false. Resolve the premise (instrument) before resolving the bug (fix).

## JS-State Classes Standing Rule

Established 2026-04-30 after the Apr 29 codec re-encode (Mobile Video Standing Rule) failed to fix iOS Safari autoplay. Root cause was `<div class="page-transition active">` shipped in static HTML on every page. The `.active` class was a fully opaque viewport-covering overlay (z-index 9998) — meant to be applied by JS during page-to-page navigation, but baked into the initial HTML. Result: every video element on the site was occluded by an opaque overlay at parse time. iOS Safari makes its autoplay decision at parse and does NOT retry once denied. The codec fix was real and correct, but addressed a different layer than the actual blocker.

**Standing rules — apply to every interactive class on this site, all future sessions:**

1. **JS-state classes NEVER ship in static HTML.** Classes like `.active`, `.open`, `.visible`, `.loaded`, `.expanded`, `.playing`, `.scrolled` describe a *runtime state that JS controls*. They must default OFF in static HTML and be applied on demand by JS. Shipping them baked-in means the page renders in that state before JS runs — which often means: opaque overlays at parse, modals open at parse, menus expanded at parse, etc. Each of these has knock-on effects on browser-native behaviors (autoplay, focus, scroll position) that get decided at parse, not retried later.

2. **`.page-transition` is the canonical example.** The `<div class="page-transition"></div>` element exists in static HTML; the `.active` class is added by JS only when navigating between pages (`document.addEventListener('click', ...)` in `main.js`). Initial parse: NOT active. Mid-navigation: active for ~200ms. Destination page after load: NOT active. Never ship `.active` baked in.

3. **iOS Safari makes autoplay decisions at parse time and does NOT reliably retry.** This is the load-bearing reason rule #1 matters for video specifically. Even with all 7 attributes correct (Mobile Video Standing Rule §1) and codec compliant (§2), if the video is occluded by another opaque element at parse time, iOS Safari may decide "not autoplaying" and never try again — even after JS removes the occluder. Shipping JS-state classes that cover the viewport is the most common form of this trap.

4. **Defense-in-depth: IntersectionObserver-triggered `video.play()` retry.** When a video sits inside a `.reveal` parent (or any JS-driven visibility class), the IntersectionObserver that adds `.revealed` should ALSO call `video.play().catch(() => {})` on every `<video>` descendant. iOS allows `.play()` on muted videos as a normal API call (no user gesture needed); already-playing videos treat it as a no-op; if iOS still denies, the catch swallows. Pattern:
   ```js
   var observer = new IntersectionObserver(function (entries) {
     entries.forEach(function (entry) {
       if (entry.isIntersecting) {
         entry.target.classList.add('revealed');
         var videos = entry.target.querySelectorAll('video');
         videos.forEach(function (v) { v.play().catch(function () {}); });
         observer.unobserve(entry.target);
       }
     });
   }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
   ```
   This pattern is already in [main.js](main.js) — preserve it on any future refactor.

5. **Audit checklist before adding any class to static HTML:** ask "is this class describing a fixed structural property (always true regardless of runtime), or describing a dynamic runtime state?" Structural = OK to ship (e.g., `.bento-card`, `.case-image-trio`, `.reveal` — `.reveal` is borderline but its semantic is "this is reveal-eligible," not "this is currently revealed"). State = MUST NOT ship; JS applies on demand. The `.revealed` flip-on partner of `.reveal` correctly defaults off.

## Case Study Opener Standing Rule

Established 2026-05-06 after the audit-driven Pulse restructure session. The audit's #2 priority fix was "lead with the artifact, not the argument" — confirmed by reference portfolios (rauno.me, raphaelsalaja.com, emilkowal.ski) that uniformly open case studies on the strongest single visual artifact, not on multi-paragraph prose. Pulse's pre-fix opener used a static `compare.png` hero followed immediately by 2 paragraphs of analytics-tool-comparison prose ("I built Pulse because every UX analytics tool I've used was built for the wrong audience…") before the Living Observatory artifact appeared 30+ lines later in the body. The fix swapped the hero to the Living Observatory motion clip (`ai-fly.mp4`) and pushed the prose down. This rule prevents future case studies from falling back to the prose-first pattern.

**Standing rules — apply to every case-study page on this site, all future sessions:**

1. **Position 1 above-the-fold of any case study MUST be the strongest single visual artifact, not prose.** The "first scroll" rule: in the first viewport-height of a case study, a hiring manager should see (a) the strongest single visual artifact, (b) optionally a one-sentence caption framing what it is, and (c) the case title. Everything else — metadata grid, Overview prose, problem statement — comes below. If a case-study restructure pushes the artifact below the metadata grid or behind 2+ paragraphs of prose, that's a regression — undo it. The artifact carries the thesis; prose elaborates afterward.

2. **Prefer video over static image for the hero artifact when both exist.** A loop autoplay communicates 1.5x more than a still in the same vertical real-estate. Use the existing canonical `<video>` 7-attribute pattern (Mobile Video Standing Rule §1) — autoplay, muted, loop, playsinline, preload="metadata", poster, aria-label. The hero is always above-the-fold so parse-time `.play()` (Mobile Video Standing Rule §7) covers autoplay; the IO retry (JS-State Classes §4) handles below-the-fold rescue if the user has scrolled past on reload.

3. **Hero captions are 8–15 words MAX, not paragraphs.** Established 2026-05-06 after the user explicitly truncated a proposed 30-word caption to "The Living Observatory — one canvas that fuses a wireframe, heatmap, time scrubber, and AI prompt bar." (15 words). Reference portfolios use single-sentence framing under hero artifacts; longer captions become competing prose. The detailed framing belongs in the Overview section directly below, not in the caption. **Rule: any hero caption proposal that exceeds ~15 words gets cut before commit. The Overview section is the right surface for elaboration.**

4. **The hero artifact MUST be unique to the hero — do not also appear later in the body.** If `ai-fly.mp4` is the hero, it should NOT also appear as a body video 30 lines down. Repetition reads as padding. When swapping the hero in, audit the body for the same asset and remove the duplicate. The body should still have visual rhythm via OTHER artifacts (compare.mp4, image-trio, deep-dive.mp4 in Pulse's case) — just not the same one as the hero.

5. **The `.case-hero-image` container supports both `<img>` and `<video>` children — but each requires its own CSS rule.** Established 2026-05-06 after the hero-swap revealed that [styles.css:861-867](styles.css#L861-L867) had a `.case-hero-image img` rule but NO `.case-hero-image video` rule. The rules must mirror each other for consistent sizing. Canonical pair:
   ```css
   .case-hero-image img {
     width: 100%; height: 100%;
     object-fit: cover; object-position: center top;
     display: block;
   }
   .case-hero-image video {
     width: 100%; height: 100%;
     object-fit: cover;
     display: block;
   }
   ```
   The `object-position: center top` on `img` and absent on `video` is intentional — static screenshots benefit from top-anchoring (preserve column headers, captions); video frames are typically composed center.

6. **Audit checklist before shipping any case-study restructure:**
   - First scroll shows the strongest visual artifact above-the-fold? ✓
   - Caption (if any) is ≤15 words? ✓
   - Hero artifact does NOT also appear in the body? ✓
   - All 7 video attributes present (Mobile Video §1)? ✓
   - No `opacity:0` ancestor at parse (Mobile Video §6)? ✓
   - Cache-bust applied across all 8 HTML if `styles.css` changed (Mobile Video meta-layer M)? ✓

## Cross-Surface Thumbnail Consistency Rule

Established 2026-05-06 after the Pulse Other Work cards on three case study pages were found to be `<img>` elements pointing at a static PNG (`img/pulse/v2/compare.png`) while the homepage bento Pulse card and the Ghost Other Work cards on the same pages were `<video>` elements. The asymmetry traced to a 2026-04-27 decision to "keep videos on the homepage bento only, use a static still for Other Work cards" — a perf trade-off that ultimately cost 1.5 weeks of latent visual inconsistency. The user explicitly overruled the perf rationale this session (110 KB total per case study page is negligible) and demanded all surfaces match. This rule prevents the asymmetry from recurring.

**Standing rules — apply to every project thumbnail surface, all future sessions:**

1. **Any project whose homepage bento card uses `<video>` MUST also use `<video>` for its Other Work cards on every case study that links to that project.** No `<img>` / `<video>` asymmetry across surfaces. The visitor sees the homepage first, and any later surface (case study Other Work, related-projects sections, future thumbnail surfaces) that downgrades the same project to a static still reads as a regression — even if the perf reasoning was sound at the time it was made.

2. **The same MP4 + poster JPG file pair used on the homepage bento is the canonical asset for Other Work cards.** Don't generate a second clip at a different size or with different framing. Reuse the homepage bento asset verbatim — `src` and `poster` paths get the `../` relative-prefix shift for the `work/*.html` subpath, but the file is identical. This guarantees pixel-for-pixel consistency between the home rendition and the case-study rendition. Aria-label string also matches verbatim across surfaces.

3. **The full 7-attribute Mobile Video pattern applies — autoplay, muted, loop, playsinline, preload="metadata", poster, aria-label.** Same as Mobile Video Standing Rule §1. Other Work cards are not exempt; iOS Safari will refuse autoplay on any `<video>` missing any one attribute, regardless of surface.

4. **Audit command — verify cross-surface consistency anytime a project's homepage bento is converted to video, OR anytime a new project ships:**
   ```bash
   # For each project with a video bento, confirm zero <img> matches in Other Work blocks
   grep -n "thumb-<project-slug>" work/*.html | grep -B1 "<img"
   # Should output: nothing. Any match is a violation of this rule.
   ```
   Run this whenever a homepage bento `<img>` → `<video>` swap is approved. The grep takes ~50ms and catches the asymmetry the moment it's introduced.

5. **The reverse case is also disallowed: do NOT use `<video>` on Other Work cards when the homepage bento for the same project is `<img>`.** The principle is symmetry: visitor expectation set on the homepage carries to every later surface. If the homepage shows a still, Other Work shows the same still; if the homepage shows a loop, Other Work shows the same loop.

6. **The CSS sizing rule at `.other-work-card .project-thumbnail img, .other-work-card .project-thumbnail video` ([styles.css:1084-1090](styles.css#L1084-L1090)) MUST stay combined.** Established 2026-04-24, re-confirmed 2026-05-06. If the rule is ever split into separate `img`-only and `video`-only blocks, the next img → video swap will misfit the 16:9 container until the missing rule is re-added. Keep them combined.

## Reference-portfolio investigation methodology

When the user references another designer's portfolio as inspiration ("how does X do this?", "I want this kind of thing"), the investigation follows a fixed process. Skipping any step risks reaching a wrong conclusion from incomplete evidence.

1. **Fetch the actual source URLs first.** Use `web_fetch` on the live pages, not on user-provided screen recordings or screenshots. Recordings are secondary evidence about the recording itself; the source is publicly viewable.
2. **Read every word, especially footnotes and figure captions.** Designers often confess technical details in margin notes, acknowledgements, or footnotes that aren't repeated in the main body.
3. **Look for the asymmetry between the reference's situation and the user's situation.** A reference designer may use a pattern that works for their specific subject (single embeddable component, real shipped product) but doesn't translate directly to the user's subject (concept project, full app, proprietary work). Identify this gap before recommending the pattern verbatim.
4. **Decompose the pattern into reusable building blocks.** Don't recommend "copy this site." Recommend the specific subsystems (chrome treatment, mockup approach, choreography engine, etc.) that compose to produce the observed quality.
5. **Document findings as a standalone file in `.claude/research/`** with filename pattern `YYYY-MM-DD_subject-decomposition.md`. Cite this file in future sessions that revisit the same subject or apply the same pattern elsewhere. Learnings.md entries reference but do not duplicate research-file content.
6. **List open questions for future investigation.** Any pattern decomposition will have ambiguous points (exact easing curve, library choice, accessibility handling). Note them at the bottom of the research file so subsequent sessions can answer them with deeper investigation if warranted.

## Mobile-divergence rule

Visual drifts, callouts, captions, or positioning that depend on proportional landing room at desktop breakpoints may be suppressed, scaled, or repositioned at mobile breakpoints when the desktop treatment reads as a render error or collision at smaller viewports rather than as intentional design.

When applied, the divergence is implemented inside the existing `@media (max-width: 767px)` block at the bottom of the relevant CSS cluster. Document the occurrence in `learnings.md` with the original desktop value, the mobile override value, and the reason. Cite this rule when proposing future mobile-only overrides.

Three precedents as of 2026-05-22:
1. Ghost slider stats-row drift suppression (mobile readability fix, May 21)
2. Ghost slider annotation font + padding scaling (annotation layer build, May 22)
3. Ghost slider annotation top-position collision repositioning (annotation layer build, May 22)

## Body-demo discipline (applies to body slots only, NOT heroes)

Established 2026-05-25 after the V2 master-report cross-portfolio research (Benji, Rauno, Salaja, Kowalski, Vercel, Linear) confirmed that body demos and hero demos are categorically separate patterns with non-overlapping parameter ranges. The pre-V2 View Modes demo violated body-demo discipline by shipping with full app chrome and an 11s loop in a body slot — diagnosed as the structural cause of the "this is too much" reading the user flagged on the Vercel preview.

**Scope:** This rule applies ONLY to demos embedded in body slots — i.e., between prose paragraphs within a case study, NOT above-the-fold. Hero demos (the case-study opener artifact) are explicitly EXEMPT and follow the hero pattern parameters documented in `.claude/design-decisions.md` "Hero-vs-body framework." The two patterns are categorically separate; do not apply body-demo rules to heroes or hero rules to body slots.

**Standing rules — apply to every body-slot demo, any case study, any future build pass:**

1. **Body demo height target is 330px.** Range allowed: 300–350px. Match Benji's `.demo-window` baseline exactly. Demos taller than 350px read as "two demos collapsed into one" — split them.

2. **Body demos strip ALL app chrome.** No sidebar, no nav strip, no peripheral toolbars, no surrounding cards. Show ONLY the component the surrounding prose discusses, plus the floating cursor + popup + marker if the demo is autoplay-choreographed. Per V2 research §Q2: "body demos read as documentation; hero demos read as a hero artifact. Mixing the two loses both readings."

3. **Wireframe fidelity with strategic real-text only.** Real text appears in: popup actions (Cancel/Add), mode labels where the label IS the subject (Side-by-Side, Overlay), and orientation labels (DESIGN/PRODUCTION). All other content is `<div>` placeholders styled as gray bars via inline-width-only (`style="width:50px"`). Per Benji's body-demo pattern documented in `.claude/research/2026-05-25_benji-componentization-philosophy.md`.

4. **Loop duration 6–10 seconds OR interactive widget.** Body demos in the 11–13s "no-man's-land" between body-demo ceiling (10s) and hero-demo floor (14s) are structural errors. If a demo cannot compress to ≤10s, it is either a hero (promote it) or two demos collapsed into one (split it).

5. **First action within ~600ms when autoplay.** Body demos hit fast. Hero-demo's ~1500ms slow opening is wrong for a body slot.

6. **Unique semantic localhost URL slug in the browser-bar.** Each body demo's mock URL bar reads `localhost:3000/<slug>` where `<slug>` semantically labels the demo (e.g., `/deviations`, `/tokens`, `/comments`). Same as Benji's per-demo URL discipline.

7. **Short declarative caption underneath.** VERB + WHAT + WHY, ≤15 words, italic, centered, system-ui or Satoshi medium. The existing `.demo-frame-caption` class handles this.

**Audit checklist when adding any new body-slot demo:**
- Is it in a body slot (between prose) or a hero slot (case-study opener)? If hero, body-demo discipline does NOT apply.
- If body: is height ≤350px? Does it strip ALL app chrome? Is text wireframe-with-strategic-real-only? Is loop ≤10s or interactive? Does first action fire ≤600ms? Does URL slug semantically label the demo?
- Any "no" answer is a structural error — surface it before commit.

**Violations are structural errors.** When reviewing body-slot demos in audit passes, flag any violation against this list. Do not fix silently — the fix is a substantive narrative decision (do we compress, split, or promote to hero?) that requires user input.

## Cursor easing by context

Established 2026-05-26 after V3 canonical motion specification integration. The V2 hero shipped with Penner easeOutQuad applied to ALL cursor motion. Gemini Round 2 diagnosed this as the root cause of the "mechanical feel" the user flagged — Disney's Slow-in/Slow-out principle dictates easing by motion context, NOT by designer personality. Cursor moving between targets already on screen requires ease-in-out, not pure ease-out. Pure ease-out is correct only for cursor ARRIVALS from offscreen.

**Standing rules — apply to every cursor motion in every demo, all future sessions:**

1. **Cursor arriving from offscreen** (initial mount, drop-in from outside canvas): ease-out `cubic-bezier(0.23, 1, 0.32, 1)` — Frigade Entrance Curve. The cursor enters fast and decelerates to land softly.

2. **Cursor leaving to offscreen** (final exit before unmount): ease-in `cubic-bezier(0.7, 0, 0.84, 0)` — strong ease-in. Accelerating out — the viewer's attention has already decoupled.

3. **Cursor traversing between on-screen targets** (the default case for autoplay demos): ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`. Already in motion — accelerates from rest, decelerates to rest. This is the load-bearing case for our portfolio because most cursor motion is target-to-target on a stable canvas.

4. **Never use `ease` (CSS default) or `linear` for cursor motion.** Generic; signals undisciplined motion. The CSS default `ease` curve is a `cubic-bezier(0.25, 0.1, 0.25, 1)` which is a weak ease-out — wrong for traversal AND too generic for arrivals.

5. **Never use ease-out for traversal between on-screen targets.** That was the V2 error. The cursor is already on screen, already in implicit motion (the next action is implied) — it should accelerate AND decelerate, not just decelerate.

**Audit checklist before shipping any cursor motion:**
- What's the motion context? (Arrival / exit / on-screen traversal)
- Does the easing match the context? If no, fix it.
- For RAF-driven or `transitionend`-driven motion: does the CSS rule on `.demo-cursor` (or equivalent) declare the correct easing for the dominant case? Override per-move only when context shifts.

Full parameter table in [.claude/canonical-motion-spec.md](canonical-motion-spec.md) Section 2.1.

## Multi-step rhythm — snap-pause-snap, not metronomic

Established 2026-05-26 after V3 canonical motion specification integration. The V2 hero shipped with uniform 333ms intervals between Apply→done step rows. Gemini Round 2 diagnosed this as a robotic-feel anti-pattern: top-tier portfolios use snap-pause-snap rhythm where the middle beat holds for 600–1000ms even when the real work is instant. This is the **Labor Illusion** in UX psychology — viewers trust software more when they see it visibly working. Compressing every step to be fast destroys this trust signal.

**Standing rules — apply to every multi-step UI sequence (Apply→progress→done flows, multi-stage state changes, async confirmations), all future sessions:**

1. **Snap-pause-snap, never metronome.** Multi-step sequences MUST follow snap-pause-snap pattern:
   - **Snap 1:** Instant feedback within 100ms of trigger (button compresses, loading state appears)
   - **Pause:** 600–1000ms middle beat where the work APPEARS to happen — this is load-bearing — even if real work is instant, hold the loading state
   - **Snap 2:** Rapid resolution with 200ms crossfade to done state

2. **The Progressive Step Cascade for typical Apply→done flows:**
   - Step 1 at T+150 (instant confirmation — "transaction initiated")
   - Step 2 at T+750 (the load-bearing pause representing "heavy work")
   - Step 3 at T+900 (rapid wrap-up)
   - Done state at T+1000–1200 (`blur(16px)` crossfade)

3. **Visual restraint on step indicators per Linear calm-interface rule:**
   - Step rows in 11px or smaller font
   - Inactive steps at 30–40% opacity
   - Active step animates soft transition to 100% opacity with micro-checkmark over 150ms
   - No colorful state changes — stay near-monochrome
   - Step row container should be inline with the trigger (Freiberg's trigger-feedback alignment rule), NOT a far-away toast

4. **Uniform metronomic timing is a structural error.** A 333ms × 3 = 1s cascade is technically fast but reads as robotic — the viewer perceives "scripted timer" not "system working." Vary the intervals.

5. **The pause is not dead time.** During the 600ms pause between Step 1 and Step 2, the loading state visual SHOULD show motion (spinner rotating, progress bar partially filling, animated dots) so the viewer registers "the system is busy, not stuck."

Full pattern in [.claude/canonical-motion-spec.md](canonical-motion-spec.md) Section 2.4.

## Single Unified Timeline architecture

Established 2026-05-26 after V3 canonical motion specification integration. The V2 hero's choreography used cascading `setTimeout` chains with separate timers for each beat. Gemini Round 2 Report 3 diagnosed this as the architectural cause of the loop state-drift the user noticed (panel occasionally still visible, badges in wrong state across iterations). The fix is the Single Unified Timeline pattern: one master timeline that owns ALL animated properties.

**Standing rules — apply to every multi-beat autoplay demo, all future sessions:**

1. **One master timeline per demo.** Not multiple `setInterval` calls. Not cascading promise chains. Not multiple `setTimeout` chains. One master timeline owns the cursor, popups, state changes, markers — every animated property. When the timeline pauses (browser tab switch, IntersectionObserver out-of-view), EVERYTHING pauses simultaneously. When it resumes, EVERYTHING resumes from the same elapsed offset.

2. **Label-based offsets, not hardcoded absolute milliseconds.** Beats reference semantic labels: `"applyClick+=0.16"`, NOT `at: 5400`. When a duration earlier in the timeline changes, all downstream beats shift automatically. Vanilla JS equivalent: store beats as objects with `label` property and `+labelName+offset` strings; resolve to absolute times at orchestration start.

3. **Data-attribute element targeting via `querySelector` at runtime, NOT element references threaded through nested functions.** Markup uses `data-demo-element="cursor"`, `data-demo-element="apply-btn"`, etc. Orchestrator queries at init. Prevents the "stale ref" bugs that emerge when nested closures hold dead element references after DOM updates.

4. **Explicit zero-position reset block at timeline start.** Before any animated property runs in iteration N+1, restore EVERY animated property to its origin. This is the load-bearing fix for the V2 loop trap. Pattern (vanilla): a `resetAllState()` function called as the FIRST action of `runIteration()`. Restores every modified CSS class + inline style. (Our V2 hero has this pattern but it's incomplete — some properties drift; the recalibration sprint must complete the reset.)

5. **Reduced motion path skips timeline entirely and sets representative static state.** Don't try to play the timeline with shortened durations; SKIP it. Set elements to their done-state visuals directly via CSS `@media (prefers-reduced-motion: reduce)` or JS state mutation. Re-evaluate `prefersReduced()` per page load (don't cache).

6. **Separation of concerns at the file level.**
   - `demo-script.js` (or inline data): pure timing data + cursor coordinates + scene definitions
   - `demo-markup.html` (or partial): completely inert, stateless markup with `data-demo-element` attributes; NO JavaScript references
   - `demo-orchestrator.js`: the single master timeline; reads script data, queries markup via data-attributes, animates

7. **GSAP is the canonical library** for the Single Unified Timeline pattern. We currently operate vanilla. If a demo's orchestration complexity grows beyond what vanilla can express cleanly (Pulse may demand this), evaluate GSAP migration. Until then: build the pattern in vanilla using a `Choreography` class with a `beats` array and a single RAF-driven elapsed-time tracker.

**Audit checklist before shipping any new multi-beat autoplay demo:**
- Does ONE timeline own all animated properties? (Not multiple `setInterval` or `setTimeout` chains.)
- Are timings label-based (semantic offsets) or absolute milliseconds? Label-based wins.
- Does markup use `data-demo-element` attributes for orchestrator targeting?
- Is there an explicit zero-position reset block at iteration start?
- Does reduced motion path SKIP the timeline entirely?
- Are the three files (script / markup / orchestrator) cleanly separated?

Full pattern + GSAP and vanilla examples in [.claude/canonical-motion-spec.md](canonical-motion-spec.md) Section 4.

## Engine primitive self-documentation rule

Established 2026-05-27 after the DP-B Minor marker silent-invisible bug. The Marker primitive accepted `variant: 'yellow'` without erroring but no matching `.demo-marker--yellow` CSS rule existed, producing a transparent 22px circle with white text against a near-white canvas — visually invisible. The fix was one CSS rule. The lesson was that the engine's constraint ("every variant string MUST have a matching CSS rule") lived only in the author's head, was not surfaced in the primitive's file, and was rediscovered by a downstream demo failure two weeks after the primitive shipped. This rule prevents that pattern from recurring.

**Standing rules — apply to every engine primitive in `js/demos/_engine/`, every session, all future work:**

1. **When you discover something worth knowing about an engine primitive — a failure mode, a constraint, a gotcha, a reusable pattern — document it directly in that primitive's file as a top-of-file comment block** under a `KNOWN CONSTRAINTS / GOTCHAS` section. The engine files are self-documenting. A future session reading `marker.js` or `cursor.js` or `popup.js` must see the hard-won knowledge inline, NOT have to cross-reference `learnings.md` to discover that (e.g.) variants need matching CSS rules, that cursor.moveTo defaults to 440ms ease-in-out, that the container must be `position: relative`, etc. Learnings.md is the discovery log; the primitive's file is the operating manual.

2. **The comment block goes at the TOP of the file, after the API description but before the export.** Numbered list of constraints. Each constraint: a one-line headline (bold the imperative), then 2-4 lines explaining the WHY and the failure mode it prevents. Cite the date + sprint where the constraint was discovered if applicable — provenance helps future sessions decide whether the constraint is still load-bearing.

3. **Promote silent-failure modes to runtime warnings where cheap.** When a primitive accepts a config value that produces invisible/broken behavior with no error (like `variant: 'purple'` with no CSS rule), add a `console.warn` in the constructor / setter. The warning should: (a) name the bad value, (b) state the constraint that was violated, (c) list valid values if the set is closed. **Do NOT throw — warn only.** Warnings surface the bug in dev console without breaking production loops. The `[Marker] Unknown variant "purple". A matching .demo-marker--purple CSS rule must exist or the marker will render invisible. Supported variants: default, green, orange, yellow, red.` pattern is the canonical shape.

4. **Closed sets get an exported / module-level constant.** When an API parameter is restricted to a known set (variants, modes, easing names), define a `KNOWN_X = new Set([...])` constant at module top and check against it. This makes the closed set discoverable via code search, machine-checkable, and the single source of truth for both the warning logic and the documentation. The CSS rule list mirrors the JS set — add one, add both.

5. **When you change an engine primitive, also update its KNOWN CONSTRAINTS section if the change creates a new constraint OR closes an old gotcha.** A constraint-update commit MUST include the comment block edit. PRs that change engine code without updating the comment block are incomplete.

6. **Apply this rule retroactively when you touch an engine file.** If you open `cursor.js` for any reason — bug, feature, refactor — and notice a constraint or gotcha that's not documented in its comment block, add it in the same session. Engine documentation drifts behind reality the moment the rule lapses. Keep it current.

**Audit checklist before shipping any engine primitive change:**
- Did you add a `KNOWN CONSTRAINTS / GOTCHAS` section if one didn't exist?
- Did you update the section if your change creates / resolves a constraint?
- Did you add a runtime `console.warn` for any new silent-failure mode?
- Did you add a `KNOWN_X` module constant for any new closed set?
- Did you mirror the JS set with the CSS rules (or vice versa) so they can't drift?

Canonical reference: [js/demos/_engine/marker.js](../js/demos/_engine/marker.js) (the constraint block established 2026-05-27 is the template). Apply the same shape to `cursor.js`, `choreography.js`, `popup.js`, `observer.js`, `motion.js`, `reduced-motion.js` as you touch each.

## Case study page composition rule

Established 2026-05-28 after the overnight reorder sprint moved sections into the right SEQUENCE but broke COMPOSITION: prose ended up on the wrong side of its visual (Insight + Solution narrating the slider after the slider was shown), two looping visuals stacked back-to-back with no framing prose between them (DP-B → drift detection), and K-A numbered markers added without verifying they communicated. A section reorder is not done when sequence is right; it is done when every element makes sense relative to what is now around it AND the page alternates text and visual in a deliberate rhythm. This rule encodes the discipline so it never recurs.

**Standing rules — apply to EVERY case study page on this site (Ghost, Pulse, LexisNexis, GoteFigure, and any new ones), every session, all future work.** This is not Ghost-specific.

1. **A section reorder is not complete until every element's position is verified relative to its new neighbors.** When you move section blocks, walk the page top-to-bottom AFTER the move and check each element against the elements now above and below it. The sequence may be right but the COMPOSITION may now be wrong because the prose/visual pairings shifted. Reorders break composition silently — only an element-level audit catches it.

2. **Prose that introduces a visual MUST precede that visual, never trail it.** If a paragraph's content is "the slider does X" or "the demo shows Y" or "the comparison reveals Z" — that paragraph belongs BEFORE the demo, framing it. If it ends up AFTER the demo, the prose becomes animation-narration: it describes what the viewer just saw. Animation-narration is a structural error per the Body-demo discipline standing rule; here it's a structural error per composition discipline.

3. **No two looping visuals may be adjacent without a framing text beat between them.** Two autoplay loops back-to-back (separated only by a caption) overwhelm the reader. The Benji rhythm rule: alternate text and visual. Every looping visual gets a short framing line before it that tells the viewer what they're about to see. The framing can be a full section (`<section class="case-section">` + H2 + p — canonical pattern in this codebase) or a lead paragraph; either way, it sits in the prose slot before the demo.

4. **Every looping visual gets a short framing line before it.** This is the cleanest expression of the Benji rhythm. The framing line names what the demo argues; the demo demonstrates it; an optional caption summarizes the takeaway in one line. The pattern is: framing prose → demo → (optional) caption.

5. **The page must read as polished and professional for a founding-designer hire.** Deliberate rhythm. Nothing overwhelming. Each section setup → demo → takeaway. No two loops stacked bare. No prose narrating what just played. Every element earns its position. **A hiring manager scanning the page in 30 seconds should feel "this person sequences their work deliberately"**, not "this is dense, where do I look first."

**Audit checklist before shipping any case study restructure or new case study build:**

- [ ] Walk top-to-bottom; for every element, name what's directly above and below it; verify the relationship makes sense.
- [ ] Find every introducing-prose block. Confirm it sits BEFORE its visual, not after.
- [ ] Find every pair of adjacent looping visuals. Confirm a framing text beat sits between them.
- [ ] Confirm every looping demo has a framing line above it (section prose OR lead paragraph).
- [ ] No animation-narration in any prose. Prose adds information beyond what the demo shows; it does not restate the demo.
- [ ] The reorder doesn't leave anchor links broken (section IDs stable; sidebar nav resolves).
- [ ] Cache-bust lockstep across all active HTML files if any styles changed.

**This rule applies to every case study page, every restructure, every new case study build, all future sessions.** Section reorders are common. Composition fixes after a reorder must be a standard step, not an afterthought. The element-level audit is the discipline.

Canonical reference for the audit shape: [.claude/sprint-reports/2026-05-28-layout-audit.md](sprint-reports/2026-05-28-layout-audit.md) (the element-by-element walkthrough format established this sprint). Apply the same shape to future case study audits.

## Em dash ban (hard rule, project-wide)

Established 2026-05-28 after Rotem flagged that em dashes (`—`, U+2014) read as AI across modern writing tools. The portfolio's voice is technical first-person — em dashes signal generated content even when the surrounding prose is otherwise tight. Hard ban going forward.

**Standing rules — apply to EVERY user-facing surface on this site (Ghost, Pulse, LexisNexis, GoteFigure case studies; homepage; About; Process; Skills; any new pages), every session, all future work.**

1. **Never use the em dash (`—`) in user-facing copy. Anywhere. Ever.** This includes the HTML entity `&mdash;`. Reads as AI. Use a period, a comma, parentheses, a colon, or rewrite the sentence. The shortest fix that preserves meaning wins.

2. **Replacement hierarchy (preferred → fallback):**
   - **Period** (split into two sentences) — usually the cleanest
   - **Comma** (when the flow genuinely continues)
   - **Parentheses** (for a true aside)
   - **Colon** (for definition or list lead-in)
   - **Rewrite the sentence** if none of the above land cleanly
   
   Do NOT mass-replace mechanically. Each instance gets a judgment call so the prose stays clean.

3. **Code comments and internal sprint reports are EXEMPT.** Em dashes are fine in `.claude/learnings.md`, `.claude/sprint-reports/*.md`, file header comments, JS inline comments, CSS comments. The rule applies to USER-FACING PROSE only — anything a hiring manager would read on the rendered page.

4. **The HTML entity `&mdash;` is the same character; treat it identically.** Both forms get replaced.

5. **Verification grep — run after any prose touch:**
   ```bash
   grep -c "—\|&mdash;" work/*.html index.html about.html process.html
   ```
   All counts must return zero for user-facing files. Code comments at the file-header level inside `<script>` or `<style>` blocks don't render and are exempt only if they're not in body prose.

6. **Run a sweep on the FIRST prose touch in any future session that modifies a case study or homepage page.** Em dashes have a way of creeping back when prose is added or rewritten. Make the sweep a standard pre-commit step on any prose edit.

**Why this matters for a founding-designer portfolio:** the bar is "this person writes like a person." AI signals (em dashes, "—", over-hedged phrasings, generic adjectives) dilute the credibility that comes from technical specificity and first-person ownership. Removing em dashes is one cheap structural fix that lifts the entire voice register.

Canonical reference: this rule established by Rotem 2026-05-28 alongside the Ghost opening-trim sprint. Future case study work (Pulse, LexisNexis, future projects) audits em dashes as standard practice.

## Loop seam diagnosis rule

Established 2026-05-28 after the Beat 3 drift-detection carousel seam consumed multiple sprints. Two prior fixes changed scroll SPEED (18s → 15.65s → 13.04s) on the assumption that the skip was a timing problem. Neither was the real fix. A third sprint addressed the major geometric error (gap+padding mismatch) but left subpixel ambiguity from percentage-based translation. Only the fourth sprint identified and shipped the real fix: pixel-precise translation via a JS-measured CSS custom property. The seam was always geometry, never timing. This rule prevents the same loop on the next continuous-state seam (Pulse, LexisNexis, any future scrolling artifact).

**Standing rules — apply to every continuous-state loop seam (carousels, marquees, ticker rows, infinite scrollers), every session, all future work:**

1. **When a loop seam visibly skips, diagnose geometry BEFORE touching timing.** The first question is "is the content at every screen-X position identical at T=0 and T=LOOP_DURATION?" If yes, the seam is invisible by construction; the skip is somewhere else. If no, the geometry is broken; no amount of timing tuning will hide the skip. The diagnostic check is binary: identical content at the boundary, or not.

2. **Speed changes cannot fix a geometric mismatch.** They only change how often the skip appears or how long the visible discontinuity lasts. If a speed bump "made the skip shorter," that's a sign the geometry is wrong AND you're tuning the wrong layer. Stop tuning speed; fix geometry.

3. **For horizontal-scroll continuous-state seams: the row must tile perfectly.** Render the list N ≥ 2 times end-to-end with identical structure. Translate by EXACTLY one list-copy's width per cycle. Both halves of the tile must have identical layout-box widths (same children in same order, no asymmetric padding/margins between halves).

4. **Percentage-based translation (`translateX(-50%)`) is vulnerable to subpixel rounding.** When the row's underlying content has fractional pixel widths (font metrics, monospace strings, anything non-integer), -50% lands at a subpixel boundary the browser may round to ±0.5-1px. Subpixel skips ARE perceptible at loop boundaries. **For pixel-precise seam continuity, measure the exact target translation distance in JS and write it to a CSS custom property; the keyframe uses `calc(-1 * var(--list-width))`.** Reliable, integer-pixel exact.

5. **"It feels like it's working" is the worst false positive.** When a parameter change morphs the bug but doesn't eliminate it, the parameter is not the root cause. Stop tweaking it. The reason the Beat 3 carousel ate multiple sprints: each speed bump changed the skip duration proportionally, which felt like progress. It was not. **Diagnostic discipline: if N consecutive parameter tweaks don't close the bug, the root cause is at a different layer. Stop. Reframe.**

6. **The reusable pattern for horizontal continuous-state seams is documented in [canonical-motion-spec.md Appendix D §D.11](canonical-motion-spec.md).** Apply that pattern as the default for any new carousel, marquee, or ticker on this site. Don't reinvent it.

**Audit checklist before shipping ANY loop with a continuous-state seam:**
- Is the content (visible viewport content) identical at T=0 and T=LOOP_DURATION? ✓ verify by inspection or measurement.
- For horizontal scrolls: does the row tile perfectly (each half = same children, same widths, no asymmetric spacing)? ✓
- Is the translation distance pixel-precise (measured in JS) rather than percentage-based? ✓ for any production seam.
- Does the seam fix survive responsive breakpoints (resize listener re-measures list width)? ✓
- If a parameter was changed and the seam still skips, did you switch to a geometric / pixel-precise diagnosis instead of tweaking further? ✓

Canonical reference for the fix shape: [js/demos/ghost-drift-detection.js](../js/demos/ghost-drift-detection.js) `measureListWidth()` + `applyListWidth()` + resize listener + CSS custom property `--dd-list-width`. Apply this pattern to any future horizontal-scroll seam on Pulse, LexisNexis, or new case studies.

## Core Loop Directive
At the end of every significant task:
1. Reflect on what worked and what failed
2. Extract corrections
3. Log to `.claude/learnings.md` with date and context
4. Promote repeated learnings to permanent rules in this file

## Self-improvement loop

At the END of every Claude Code session that modifies source files, 
append a new entry to `.claude/learnings.md` using this format:

```
## YYYY-MM-DD — [Short session title]

**What I did:** One-line summary of the changes made this session.

**What worked:** Specific techniques, file paths, or patterns that 
succeeded. Include code snippets if relevant.

**What failed or surprised me:** Bugs encountered, assumptions that 
turned out wrong, edits that needed to be redone. Be specific — 
"the existing CSS used X pattern, not Y as I assumed."

**What I learned:** Concrete rules to apply on future sessions. 
Phrase as imperative ("Always check X before Y" or "Do not assume Z").

**Files touched:** List of files modified or created.
```

At the START of every new Claude Code session, read 
`.claude/learnings.md` BEFORE proposing any plan, and explicitly 
reference any prior learnings that apply to the current task.
