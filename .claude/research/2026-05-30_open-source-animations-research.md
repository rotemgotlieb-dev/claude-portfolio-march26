# Open-Source Animation & Component Library Research — Foundational Bento Thumbnail Audit
*Compiled 2026-05-30. Scope: vanilla HTML/CSS/JS only. Targets: Pulse + Ghost bento thumbnails first, LexisNexis queued.*

---

## TL;DR (the landscape, ~280 words)

The open-source motion ecosystem in 2025–2026 has shifted in three structural ways that change what's available to a vanilla portfolio.

**First, GSAP is genuinely free now.** As of April 30 2025, Webflow acquired and re-licensed the entire GSAP suite — including the formerly paid Club plugins (SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother, MotionPath) — under a no-charge Standard License that explicitly covers commercial use ([CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/), [Webflow Blog](https://webflow.com/blog/gsap-becomes-free), [GSAP Standard License](https://gsap.com/community/standard-license/)). The only prohibited use is building no-code visual animation builders that compete with Webflow. Portfolios are fine. This is the single biggest license-landscape change in five years and removes the historical reason designers avoided GSAP plugins.

**Second, the "vanilla-first" animation library tier has consolidated around three names:** GSAP (RAF-based, sequencing-king, MIT-license for the core, free Standard for plugins), Motion ([motion.dev](https://motion.dev/docs), MIT, 18kb full / 2.3kb mini, WAAPI-backed so it survives main-thread jank), and anime.js v4 (MIT, mature SVG morph + scroll observer support). All three work in raw browser, no React needed.

**Third, the React-only component galleries (Aceternity, Magic UI, hover.dev, motion-primitives) are extractable in practice but not in marketing.** The animations themselves are usually CSS + SVG paths + small JS — the React wrapper is thin. The most extractable patterns for our use are: animated beam (path-along-SVG), border beam (conic gradient + CSS rotation), and compare slider (already pure DOM).

**Specifically relevant for our 3 projects:** Pulse wants WebGL noise + heatmap.js or visual-heatmap layered over a wireframe + GSAP for the cursor. Ghost wants `image-compare-viewer` or `before-after` web component with an autoplay loop layer we write ourselves (~20 lines). LexisNexis wants GSAP MotionPath flowing tokens along an SVG pipeline — the technique the GSAP free release just unlocked for $0.

---

## Per-category findings

### 1. Animation component libraries (vanilla-compatible)

#### GSAP (with all plugins, free as of Apr 30 2025)
- **URL:** https://gsap.com — license: https://gsap.com/community/standard-license/
- **What it is:** Industry-standard JS animation library. Tween engine + timeline + plugin ecosystem (ScrollTrigger, SplitText, MorphSVG, DrawSVG, MotionPath, ScrollSmoother, Flip, Observer).
- **License:** Standard License — "no charge…commercial use" ([CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)). Owned by Webflow. Only prohibited use: building a no-code visual animation builder that competes with Webflow. Portfolios pass.
- **Vanilla-compatible:** Yes, primary mode. React/Vue wrappers exist but are optional.
- **Best use for our portfolio:** Choreography backbone for Pulse cursor flight + Ghost slider autoplay + LexisNexis token pipeline (MotionPath specifically). Also the right tool for the existing case-study body demos.
- **Effort to integrate:** Drop-in (single `<script>` from CDN). Plugins each ~15kb gzipped.
- **What it brings:** A real timeline (the Single Unified Timeline pattern documented in CLAUDE.md gets a native primitive instead of being hand-rolled). MotionPath lets a token element follow any SVG path. MorphSVG lets a Figma component shape-shift into a code component shape. DrawSVG lets the pipeline draw itself.
- **Risks:** RAF-based (not WAAPI), so animations run on main thread — for Pulse where we already worry about decoder fan-out, scope ScrollTrigger work carefully. ~70kb core gzipped. Standard License is not OSI-approved open-source even though it's free; the source isn't on GitHub the way MIT projects are. Acceptable for our use; documenting it for awareness.

#### Motion (motion.dev)
- **URL:** https://motion.dev/docs — repo: https://github.com/motiondivision/motion
- **What it is:** Hybrid library that uses Web Animations API where possible, JS RAF where not. Successor to Framer Motion's vanilla bits.
- **License:** MIT.
- **Vanilla-compatible:** Yes — `import { animate } from "motion"`. Separate React and Vue packages.
- **Best use for our portfolio:** When hardware-accelerated transform/opacity animations matter (e.g. the bento card hover lift, scroll-triggered reveals, page transitions). Pairs well with GSAP — use Motion for property tweens that benefit from WAAPI compositor-thread execution; use GSAP for sequence orchestration.
- **Effort to integrate:** Drop-in via ESM or bundled.
- **What it brings:** Per [Motion's own benchmark](https://motion.dev/docs/feature-comparison), 2.5×–6× faster than GSAP at unknown-value animations, smaller bundle (full `animate` 18kb vs GSAP core ~70kb, mini `animate` 2.3kb), and crucially: WAAPI animations survive main-thread jank, JS-RAF animations don't. This matters on Pulse where 4 video decoders compete for the main thread.
- **Risks:** Less mature plugin ecosystem than GSAP. No equivalent of MorphSVG/MotionPath out of the box.

#### anime.js v4
- **URL:** https://animejs.com/documentation/ — license: MIT ([repo](https://github.com/juliangarnier/anime/blob/master/LICENSE.md))
- **What it is:** Long-running vanilla JS animation library. v4 ships ScrollObserver, splitText, scrambleText, morphTo, draggable, layout animations, timelines.
- **License:** MIT.
- **Vanilla-compatible:** Yes, primary mode.
- **Best use for our portfolio:** SVG morph in places where we don't need GSAP's whole timeline machinery. Text scramble effect on the homepage hero (post-intro). Backup option if we want MIT-pure stack.
- **Effort to integrate:** Drop-in.
- **What it brings:** A middle-ground option that's MIT-clean. Smaller mental model than GSAP for simple cases.
- **Risks:** Smaller community than GSAP. SVG morph quality not as battle-tested as MorphSVG.

#### Web Animations API (WAAPI, native)
- **URL:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- **What it is:** Browser-native animation API.
- **License:** N/A — native browser API.
- **Vanilla-compatible:** Yes.
- **Best use for our portfolio:** Anywhere we currently use `requestAnimationFrame` to tween a single property (the custom cursor lerp could stay RAF for the lerp math, but the intro icons could be WAAPI). Hardware-accelerated, survives main-thread jank.
- **Effort to integrate:** Already in browser, zero deps.
- **What it brings:** Per [Motion's tier list](https://motion.dev/magazine/web-animation-performance-tier-list), highest-tier perf for transform/opacity. Survives the kind of decoder-callback storm Pulse is sensitive to.
- **Risks:** No spring physics, limited easing customization (only CSS timing functions), no timeline orchestration. Best for individual tweens, not sequences.

---

### 2. Modern component galleries (extractable to vanilla)

#### Magic UI
- **URL:** https://magicui.design/docs — license: MIT ([repo LICENSE.md](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md))
- **What it is:** Copy-paste React component library focused on landing-page eye candy. ~50 components.
- **License:** MIT — components can be lifted and re-implemented.
- **Vanilla-compatible:** Components are React + Tailwind + sometimes Motion. The *animations* (CSS keyframes, SVG paths, conic gradients) are portable; the React wrapper is replaceable in ~20 lines of vanilla.
- **Best use for our portfolio:** Three specific lifts:
  - **Border Beam** — conic gradient with `@property` animation traveling around a card border. Drop-in for the Pulse/Ghost bento hover state (a scan-line traveling the card edge says "active intelligence" in one motion).
  - **Animated Beam** — SVG path between two DOM refs, with an animated stroke gradient traveling the path. Drop-in for the LexisNexis token pipeline (token element travels from "Figma" node to "code" node).
  - **Dotted Map / Icon Cloud** — particle/dot grid background, useful for Pulse's "intelligence canvas" aesthetic.
- **Effort to integrate:** Light adaptation (~30 min per component to strip React, keep CSS+JS).
- **What it brings:** A vetted visual vocabulary in 2026 — these patterns recur on Linear, Vercel, Resend, every modern landing.
- **Risks:** Each component visits a different aesthetic; mixing too many produces "AI slop landing page." Pick ONE per project.

#### Aceternity UI
- **URL:** https://ui.aceternity.com/components
- **What it is:** ~70 React components, heavily Framer-Motion-dependent.
- **License:** No public LICENSE file at the repo's expected location (404 on first lookup); marketing site states "free to use" but does not commit to MIT in writing. **Treat as inspiration, not extractable assets.**
- **Vanilla-compatible:** No — Framer Motion bound, would need significant rewrite.
- **Best use for our portfolio:** Reference only. Specifically worth studying:
  - **Compare** component — drag/slide image comparison (we have better vanilla options below).
  - **Canvas Reveal Effect** — dot expansion on hover (lift the technique, not the code).
  - **Evervault Card** — encrypted text reveal with gradient (Pulse aesthetic adjacent).
- **Risks:** License ambiguity. Don't copy code verbatim.

#### React Bits
- **URL:** https://www.reactbits.dev — repo: https://github.com/DavidHDev/react-bits
- **License:** MIT + Commons Clause. The Commons Clause restricts re-selling the library itself but permits personal and commercial use of the components. Acceptable for portfolio use.
- **Vanilla-compatible:** Library ships JS-CSS, JS-TW, TS-CSS, TS-TW variants. The JS-CSS variant is the closest to vanilla but still uses React component conventions.
- **Best use for our portfolio:** Text animations (the `<Leftover>`-style character morph similar to what Arnaud Rocca built — see Codrops piece below). Background patterns.
- **Effort to integrate:** Heavy adaptation if used at all.

#### hover.dev
- **URL:** https://www.hover.dev
- **License:** "May not be redistributed without written consent." **Reference only.** Cannot lift code.
- **Best use:** Visual inspiration for hover-pattern vocabulary.

#### motion-primitives
- **URL:** https://motion-primitives.com — repo: https://github.com/ibelick/motion-primitives
- **License:** MIT.
- **Vanilla-compatible:** React + Motion (the library above) + Tailwind. Animations technically extractable.
- **Best use for our portfolio:** Reference for Motion-based patterns. Lower priority than Magic UI for our needs.

---

### 3. Specific niches relevant to Pulse + Ghost

#### Image comparison sliders (Ghost project)
The best vanilla option is **image-compare-viewer** ([CSS Script writeup](https://www.cssscript.com/image-compare-viewer/)):
- **License:** MIT.
- **Vanilla:** Yes, zero deps.
- **Hover trigger:** Supports `hoverStart: true` option. **Critical for our Ghost thumbnail** — we want hover-initiated comparison on desktop.
- **Smoothing:** Configurable easing on the slider.
- **Gap:** Does not autoplay-loop. We'd write a ~15-line wrapper that animates the slider position 0→100→0 on a timeline.

Alternative: **before-after web component** (~3KB minified, zero deps, MIT, native custom element — drop-in `<before-after before="a.jpg" after="b.jpg">`). Smaller, but no built-in hover-start option.

Both can be styled to look like Figma/Code split with the DESIGN/PRODUCTION orientation labels already established in Ghost's case study.

#### Heatmap rendering (Pulse project)
Two open-source options:
- **heatmap.js** ([patrick-wied.at](https://www.patrick-wied.at/static/heatmapjs/)) — ~3KB gzip, Canvas-based, MIT, handles 40k+ datapoints. Smooth, classic thermal-gradient aesthetic. Drop-in vanilla.
- **visual-heatmap** ([GitHub](https://github.com/nswamy14/visual-heatmap)) — WebGL/shader-based, BSD-3-Clause, 500k+ datapoints. Higher ceiling, larger setup cost. Overkill for a 16:9 thumbnail but worth knowing.

For Pulse's bento thumbnail we want a thermal pattern *animated* — heatmap.js doesn't animate natively, but we can `setData()` on a 30fps interval with shifted-noise data and get a living heatmap. ~30 lines.

#### Dashboard / Linear-aesthetic patterns
There's no single library; Linear's design system "Orbiter" isn't public ([LogRocket](https://blog.logrocket.com/ux-design/linear-design-ui-libraries-design-kits-layout-grid/)). Magic UI is the closest open-source approximation. The visual language we want — Border Beam scanning, conic gradient borders, dotted backgrounds, blurred radial highlights — is all in Magic UI's catalog and reproducible in 50–100 lines of vanilla CSS each.

#### Diff / drift visualization (Ghost project, beyond the slider)
No purpose-built library. The right approach is hand-rolled: render a wireframe at left + production at right, position absolutely positioned SVG circles/labels at "drift spots," animate them in sequence with GSAP timeline. The technique is already in Ghost's case-study body demo per CLAUDE.md.

---

### 4. WebGL / shader libraries

#### Three.js
- **URL:** https://threejs.org/examples
- **License:** MIT.
- **Vanilla-compatible:** Yes, primary mode. React wrapper (R3F) is optional.
- **Best use for our portfolio:** Probably no use at the bento-thumbnail layer (overkill, 600kb+ runtime). Reference for techniques. If we ever do a Pulse case-study hero with a literal flying-cursor-through-3D-canvas, this is the tool.
- **Risks:** Bundle weight. Mobile perf on iOS Safari.

#### ShaderToy
- **URL:** https://www.shadertoy.com (returned 403 on direct fetch — anti-scraping)
- **License:** Default Creative Commons but per-shader-author. **Each shader has its own license — check before lifting.**
- **Best use:** Reference for thermal-gradient patterns. The pattern from [Alex Harri's WebGL gradient deconstruction](https://alexharri.com/blog/webgl-gradients) is a particularly relevant reference — simplex noise + time + gradient mapping → flowing colored field, perfect Pulse aesthetic. Code linked from his post.

#### OGL (used by Arnaud Rocca per [Codrops profile](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/))
- **URL:** https://github.com/oframe/ogl
- **License:** MIT.
- **What it is:** Minimal WebGL library, ~30kb. Lighter than Three.js when you don't need a full scene graph.
- **Best use:** If we ever want a custom shader without 600kb of Three.js. Worth knowing exists.

#### ShaderGradient
- **URL:** https://shadergradient.co — repo difficult to find (multiple 404s in research)
- **License:** Unconfirmed. Marketed for Framer + Figma + React. **Skip for vanilla.**

#### Unicorn Studio
- **URL:** https://www.unicorn.studio
- **What it is:** No-code WebGL composition tool that exports embeddable web animations.
- **License:** Paid tool, generates exports of unclear license. Worth a 30-minute eval as a possible Pulse thumbnail authoring path. Not researched deeply this round.

---

### 5. Lottie + alternatives (declarative animation files)

#### dotlottie-wc (the modern Lottie player)
- **URL:** https://github.com/LottieFiles/dotlottie-web — npm: `@lottiefiles/dotlottie-wc`
- **What it is:** Web Component for embedding Lottie + dotLottie files. Drop-in: `<dotlottie-wc src="x.lottie" autoplay loop>`.
- **License:** MIT (the player). Animations themselves are per-author licensed on LottieFiles.
- **Vanilla-compatible:** Yes — pure web component, no framework.
- **Bundle:** ~40KB gzipped runtime.
- **Best use for our portfolio:** **The fastest path to a Pulse or Ghost thumbnail is finding the right free Lottie animation and dropping it in.** LottieFiles has thousands of free animations (filter by license: "Free" + verify CC0/CC-BY per asset). For Pulse: search "AI / scan / dashboard / heatmap." For Ghost: search "compare / scan / design system."
- **Risks:** Lottie files vary wildly in size (5KB to 2MB). LottieFiles' free tier is per-asset; verify each asset's license. Don't trust generic "free" labels — read the per-asset terms.

#### Rive
- **URL:** https://rive.app — runtime repo: https://github.com/rive-app/rive-wasm
- **What it is:** Interactive animation tool + runtime. Produces .riv files that are 90% smaller than Lottie for comparable animations.
- **License:** Runtime is MIT. The tool itself is freemium SaaS.
- **Vanilla-compatible:** Yes — `@rive-app/canvas` is the vanilla JS runtime. WASM-based, larger initial download than Lottie (~150kb) but tiny animation files.
- **Best use for our portfolio:** Higher ceiling than Lottie for *interactive* animations — Rive supports state machines, mouse-tracking, data binding. If we want the LexisNexis token pipeline to react to mouse position, Rive is the tool. For static loops, dotlottie is cheaper.
- **Risks:** Requires learning the Rive editor (designer effort, not just engineering). Runtime is larger. The case for Rive is interactivity; without interactivity, use Lottie or hand-code.

---

### 6. Specific search verdicts for the bento needs

#### tsParticles
- **URL:** https://particles.js.org
- **License:** MIT.
- **Vanilla-compatible:** Yes — Web Component support listed alongside React, Vue, etc.
- **Bundle:** Tiered (`@tsparticles/basic` smallest, `@tsparticles/all` largest).
- **Best use for our portfolio:** Reference only. Particle backgrounds carry strong "2017 hackathon landing page" baggage. Modern aesthetic on Linear/Vercel uses extremely sparse dot grids (Magic UI's Dotted Map pattern) not the dense connected-particle network look. **Avoid the dense particle-network aesthetic.**

#### Codrops creative coding tutorials
- **URL:** https://tympanus.net/codrops
- **License:** Most tutorials ship MIT or unlicensed example code, freely lifted by convention. Verify per article.
- **Best use:** Reference + small adaptable snippets. Especially:
  - [Arnaud Rocca's portfolio deconstruction](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/) — confirms GSAP + OGL stack for top-tier portfolios.
  - [WebGL Shader Techniques for Dynamic Image Transitions (Jan 2025)](https://tympanus.net/codrops/2025/01/22/webgl-shader-techniques-for-dynamic-image-transitions/) — circle SDF + smooth merge patterns for organic reveals.
  - [Alex Harri's WebGL gradient deconstruction](https://alexharri.com/blog/webgl-gradients) — directly applicable thermal field pattern.

---

### 7. Project-representative finds (consolidated)

**For PULSE — heatmap intelligence dashboard:**
- Layer 1 (background): WebGL thermal field — adapt [Alex Harri's gradient](https://alexharri.com/blog/webgl-gradients) (simplex noise + custom gradient stops in red/orange/yellow → cyan/blue), ~120 lines, 5kb shader.
- Layer 2 (wireframe): Static SVG wireframe of a generic web page, low opacity.
- Layer 3 (heatmap dots): heatmap.js with animated `setData()`, ~50 lines.
- Layer 4 (cursor flight): GSAP MotionPath, cursor traces a path over the layered field, lands on a "diagnose" button.

**For GHOST — design system reality scanner:**
- Primary: `image-compare-viewer` (MIT, vanilla, hover-start support) wrapping two PNG renders (Figma spec / production). Add a ~15-line autoplay-loop wrapper that animates slider position on a 4s cycle when not hover-interrupted.
- Augment with: Magic UI Border Beam ported to vanilla — a conic-gradient scan line traveling the card edge during the comparison reads as "active scanning."

**For LEXISNEXIS — token pipeline (queued):**
- Primary: GSAP with **MotionPath plugin** (now free) — a small SVG token shape (colored circle) follows an SVG path from a Figma node to a code node. Loop with multiple tokens staggered.
- Augment with: GSAP **DrawSVG** to draw the pipeline path itself first, then have tokens flow through.
- Optional: Lottie file for the Figma → code morph if we find a clean free one; otherwise hand-code with anime.js `morphTo` or GSAP MorphSVG.

---

## TOP 5 specific recommendations for our bento thumbnails

### #1 — Build the Pulse thumbnail on a heatmap.js + GSAP MotionPath layered composition
**Reason:** Pulse's project signature is "layered heatmap data over a wireframe." heatmap.js is the canonical vanilla heatmap library (MIT, 3kb, Canvas-based), and GSAP MotionPath is now free for cursor flight choreography. Two real OSS libraries doing exactly what the project is about.
**Cost:** ~4 hours. heatmap.js setup (1h) + SVG wireframe asset (1h) + GSAP MotionPath cursor path (1h) + state choreography (1h).
**Risk:** Low. heatmap.js is a 12-year-old library with broad compatibility. iOS Safari Canvas perf is fine at this scale. GSAP RAF runs on main thread — keep the timeline short (~3s loop) to minimize main-thread cost. The Pulse case study already has 4 videos; this bento thumb adds one more Canvas. Monitor cumulative impact.

### #2 — Build the Ghost thumbnail on image-compare-viewer with a custom autoplay-loop wrapper
**Reason:** Ghost's project signature is "side-by-side Figma vs production." image-compare-viewer is the cleanest MIT vanilla option (hover-start built in), and adding a ~15-line autoplay wrapper gives us the desktop-hover + mobile-autoplay split the brief asks for.
**Cost:** ~3 hours. Library integration (30m) + two assets (Figma render + Production render, 1h) + autoplay-loop wrapper (1h) + DESIGN/PRODUCTION orientation labels to match Ghost's body demo (30m).
**Risk:** Very low. Library is mature; we own the autoplay wrapper. Risk is asset quality — the two compared images need to look genuinely different in a perceivable way at 16:9 thumbnail scale (the existing case study has this learning encoded).

### #3 — Port Magic UI's Border Beam to vanilla CSS for both Pulse and Ghost hover states
**Reason:** A single load-bearing visual cue — a thin scan line tracing the card border during hover — adds "active intelligence" to both thumbnails without doing the heavy lifting itself. It's the equivalent of a system saying "I'm listening." ~40 lines of CSS using `@property` + conic-gradient + `@keyframes rotation`. MIT-licensed source.
**Cost:** ~1 hour total (one component, used twice).
**Risk:** Firefox does not yet fully support CSS `@property` for animated conic gradients ([MDN ref via the conic-gradient search](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/conic-gradient)) — Firefox falls back to a static border, which is acceptable. Safari + Chromium families work.

### #4 — Queue dotlottie-wc + a hand-picked free Lottie file as a Pulse fallback path
**Reason:** If hand-building the heatmap composition (rec #1) stalls or under-delivers, dropping a `<dotlottie-wc>` element with a vetted free Lottie animation is the fastest known-good fallback (~30 min to integrate). LottieFiles has multiple "dashboard / AI / heatmap" free animations. The runtime is 40kb, MIT, vanilla web component.
**Cost:** 1 hour including curation of the right Lottie file.
**Risk:** Per-asset license verification required. Less project-representative than a hand-built composition — Lottie animations carry a "stock animation" valence that fights the "centerpiece" goal. Use only if rec #1 hits a wall.

### #5 — Reserve GSAP MotionPath + DrawSVG for the LexisNexis token pipeline (when queued)
**Reason:** The "tokens flowing through a pipeline from Figma node to code node" is *exactly* what MotionPath does. Now free thanks to the Webflow acquisition. This was the single most expensive plugin in the old paid-Club tier; getting it free is a category change for this project.
**Cost:** ~5 hours when queued. SVG pipeline asset (1.5h) + DrawSVG path-draw choreography (1h) + multi-token staggered MotionPath flow (2h) + color token cycling (30m).
**Risk:** Low if scope held to the bento (3s loop). The big risk is scope creep — MotionPath invites elaborate routing; resist and keep this thumb-sized.

---

## TOP 3 case-study body-loop recommendations (future sprints)

### #A — Migrate the Pulse cursor flight (`ai-fly.mp4`) from MP4 to GSAP MotionPath
**Reason:** The hero is currently a fixed-size MP4. A GSAP-rendered SVG cursor flying over a real DOM canvas would be infinitely scalable, smaller (~5kb vs the current ~300kb video), responsive at any width, and editable in code rather than re-rendered in Figma. Solves the decoder-saturation issue documented in CLAUDE.md §7a (one fewer video at parse).
**Cost:** ~6 hours. Significant — but unlocks the "Living Observatory" framing the case study already promises.
**Risk:** Re-introduces the choreography complexity the existing Single Unified Timeline rule was written for. Manageable with GSAP's native timeline.

### #B — Port the Ghost body comparison demo to a GSAP-orchestrated `image-compare-viewer` autoplay
**Reason:** Ghost's body currently has both a static slider section and a separate drift-detection carousel. Combining them via a GSAP timeline that programmatically drives the comparison slider position + overlays drift markers at specific positions would tighten the body to one coherent demo.
**Cost:** ~4 hours.
**Risk:** Triggers the Case Study Page Composition Rule (CLAUDE.md). Audit prose pairing before shipping.

### #C — Build the LexisNexis pipeline as a body demo using GSAP MotionPath + the existing case-study composition discipline
**Reason:** When LexisNexis gets its dedicated body demo (it currently has none), the right tool is already in our stack thanks to the GSAP free release. Pipeline + tokens + DrawSVG = a self-explanatory body demo.
**Cost:** ~8 hours including the asset design.
**Risk:** Low for tech; the design decisions (what tokens, what nodes, what path) are the harder problem.

---

## License-cleared shortlist

| Resource | License | Vanilla? | Use |
|---|---|---|---|
| GSAP + all plugins | Standard No-Charge (commercial OK) | Yes | Pulse cursor + LexisNexis pipeline + general |
| Motion (motion.dev) | MIT | Yes | Hardware-accel hover/scroll |
| anime.js v4 | MIT | Yes | MIT-pure backup for SVG morph |
| Web Animations API | Native | Yes | Single-property tweens |
| Magic UI (Border Beam, Animated Beam, Dotted Map) | MIT | After porting | Card-edge scan + LexisNexis path + Pulse background |
| heatmap.js | MIT | Yes | Pulse heatmap layer |
| visual-heatmap | BSD-3-Clause | Yes | Pulse (overkill — reserve for future) |
| image-compare-viewer | MIT | Yes | Ghost thumbnail + body demo |
| before-after web component | MIT | Yes | Ghost alternative if image-compare-viewer feels heavy |
| dotlottie-wc | MIT (runtime) | Yes | Lottie embed fallback |
| Rive runtime (@rive-app/canvas) | MIT | Yes | Interactive-mouse-tracked option |
| Three.js | MIT | Yes | Reference (overkill for bento) |
| OGL | MIT | Yes | Light WebGL when Three.js is too heavy |
| tsParticles | MIT | Yes (web component) | Reference only — particle aesthetic is dated |
| Alex Harri's WebGL gradient | Repo-dependent (likely MIT/CC) | Yes | Pulse thermal field, adapt the shader |

---

## Things we should explicitly NOT use

1. **Aceternity UI components** verbatim. License is ambiguous (no MIT file at expected path), components are heavily Framer-Motion-bound. Use as inspiration only.
2. **hover.dev** components. Explicit redistribution prohibition.
3. **Dense particle networks** (tsParticles' default network look). Reads as 2017 hackathon landing-page aesthetic. Conflicts with the editorial/refined-minimalism direction in CLAUDE.md.
4. **Framer Motion**. Requires React; not in our stack.
5. **shadcn/ui (standalone)** for our use. It's a React component library; the design tokens are useful as reference but the runtime is React-dependent.
6. **ShaderGradient on the bento layer.** Designed for Framer/React, license unconfirmed, would be heavy for a thumbnail. Reserve evaluation for any future Pulse-hero rebuild.
7. **Three.js full runtime for any bento thumbnail.** 600kb runtime for a 16:9 thumb is wildly disproportionate. OGL is the correct tier if WebGL is genuinely needed.
8. **GSAP for animations that don't need timeline/sequencing.** Motion or WAAPI is preferable when the animation is a single transform/opacity tween — they survive main-thread jank that GSAP RAF doesn't, which matters specifically on Pulse where decoder fan-out is already a documented concern (CLAUDE.md §7a).
9. **`<canvas>`-based heavy compositions on iOS Safari with autoplay videos in the same viewport.** The decoder budget is finite. If Pulse adds heatmap.js Canvas, audit cumulative main-thread cost; consider lazy-loading the Canvas until hover on desktop.
10. **Any animation file with unverified per-asset license** from LottieFiles or similar marketplaces. Free does not mean CC0 — check each one.

---

## Open questions for Rotem (decisions only he can make)

1. **GSAP non-OSI-approved license: comfortable?** The Standard License is "free for commercial use" but isn't MIT/BSD/Apache. It's a no-charge proprietary license from Webflow. Most of the industry has adopted it (it's de facto the standard for premium web animation), but if there's a strong MIT-pure preference, the alternate stack is Motion + anime.js + Magic UI components.
2. **WebGL ambition level for the Pulse thumbnail?** Three escalating tiers exist: (a) hand-rolled Canvas heatmap.js — ~30kb, MIT, low risk; (b) WebGL via OGL with a custom shader — ~80kb, MIT, "more impressive but mobile perf must be measured"; (c) Lottie/Rive — designer-authored, 40-150kb runtime, fastest path but designer-authoring required.
3. **Lottie dependency willingness?** dotlottie-wc adds 40kb to every page where it's used. For a single bento thumb that's a real cost. Alternative is hand-code, which is more time but no runtime cost.
4. **Rive editor learning?** Rive is the most modern interactive-animation pipeline but requires learning a Figma-adjacent editor. Worth it only if we plan 5+ uses of it across the portfolio. For one Pulse thumb, GSAP+SVG hand-code is cheaper.
5. **Bento thumbnail loop length?** Body demos are 6–10s per the standing rule. Thumbnails feel right at 3–5s — but the existing bento patterns aren't documented yet. Confirm the right cadence before authoring.
6. **Hover-only on desktop, autoplay on mobile?** This is implicit in the brief but worth confirming — the current bento cards have static images plus magnetic tilt; the brief asks for animation, so confirm desktop = hover-triggered (saves perf, matches "tactile" CLAUDE.md aesthetic) and mobile = autoplay (no hover surface).
7. **Are LexisNexis assets ready?** CLAUDE.md notes LexisNexis content is on a USB drive being organized. The MotionPath token-pipeline approach is the right tool, but needs the design decision of "what tokens, what pipeline shape." Worth a brainstorm before queueing the build.
8. **Combining recommendations: aggressive (#1+#2+#3 + later #5) or conservative (just #2 + #3 first to validate the approach)?** Conservative is the lower-risk path — Ghost is the simpler thumb, ship it first, then attack Pulse with confidence about the bento format.

---

## Multi-disciplinary lens cross-check

- **UX researcher lens:** Hover-triggered preview animations on portfolio thumbnails increase dwell time and click-through per common e-commerce/product-card research (no single citation; consistent finding across A/B tests). The mobile autoplay-on-scroll equivalent is the documented engagement pattern on Instagram Reels and similar. Pulse + Ghost both benefit.
- **UI researcher lens:** The 2025–2026 "premium" vocabulary is: monochrome shell, single accent color per surface, conic-gradient or radial-glow accents, micro-grids/dotted backgrounds, scan-line motion. Magic UI captures this vocabulary; the Border Beam pattern is the single highest-leverage adoption.
- **Animator lens:** Award-winning portfolios in 2026 (Rocca per Codrops, the references from Pulse's hero-research) consistently use GSAP timelines with SplitText / MotionPath, ease-out-expo or ease-out-quart easing curves, and 600–1000ms snap-pause-snap rhythms (already encoded in CLAUDE.md). No new technique discovery here — the existing rules align.
- **Animation researcher lens (tech stacks):** The emerging stack in 2026 is GSAP (free) + Motion (WAAPI hardware accel) + OGL (lightweight WebGL) + Lottie (declarative loops) + WAAPI native (single-property tweens). Three.js is being passed over for OGL in the lightweight tier; Framer Motion is being passed over for Motion (without the React lock-in). Rive is the leading-edge for interactive animation but not yet the default.
- **Artist lens:** The hand-crafted vs auto-generated split is decided by *deliberate color and rhythm choices, not technique sophistication*. A Border Beam in a non-portfolio brand color (custom orange for Pulse, custom desaturated cyan for Ghost) reads hand-crafted; the same beam in default white reads template. The CLAUDE.md monochrome shell + per-project accent color rule already encodes this discipline; apply it to every new animation surface.

---

**Sources:**
- [GSAP Standard License](https://gsap.com/community/standard-license/)
- [Webflow: GSAP becomes free](https://webflow.com/blog/gsap-becomes-free)
- [CSS-Tricks: GSAP is now completely free](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)
- [Motion docs](https://motion.dev/docs)
- [Motion vs GSAP feature comparison](https://motion.dev/docs/feature-comparison)
- [Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list)
- [anime.js docs](https://animejs.com/documentation/) — [LICENSE](https://github.com/juliangarnier/anime/blob/master/LICENSE.md)
- [Magic UI](https://magicui.design/docs) — [LICENSE](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md)
- [Magic UI Animated Beam](https://magicui.design/docs/components/animated-beam)
- [Magic UI Border Beam](https://magicui.design/docs/components/border-beam)
- [Aceternity UI components](https://ui.aceternity.com/components)
- [React Bits](https://www.reactbits.dev) / [repo](https://github.com/DavidHDev/react-bits)
- [motion-primitives](https://github.com/ibelick/motion-primitives)
- [hover.dev](https://www.hover.dev)
- [heatmap.js](https://www.patrick-wied.at/static/heatmapjs/)
- [visual-heatmap](https://github.com/nswamy14/visual-heatmap)
- [image-compare-viewer (CSS Script writeup)](https://www.cssscript.com/image-compare-viewer/)
- [before-after web component (CSS Script writeup)](https://www.cssscript.com/before-after-image-comparison-slider-component/)
- [Definitive Image Comparison Slider](https://github.com/abelcabezaroman/definitive-image-comparison-slider)
- [Three.js (MIT)](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
- [Three.js examples](https://threejs.org/examples/)
- [OGL](https://github.com/oframe/ogl)
- [dotlottie-web / dotlottie-wc](https://github.com/LottieFiles/dotlottie-web)
- [Rive web runtime (wasm)](https://github.com/rive-app/rive-wasm)
- [Rive runtimes overview](https://rive.app/runtimes)
- [tsParticles](https://particles.js.org/) — [repo](https://github.com/tsparticles/tsparticles)
- [Alex Harri: A flowing WebGL gradient, deconstructed](https://alexharri.com/blog/webgl-gradients)
- [Codrops: Arnaud Rocca's portfolio](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/)
- [Codrops: WebGL shader image transitions](https://tympanus.net/codrops/2025/01/22/webgl-shader-techniques-for-dynamic-image-transitions/)
- [Codrops: WebGL for Designers (Unicorn Studio)](https://tympanus.net/codrops/2026/03/04/webgl-for-designers-creating-interactive-shader-driven-graphics-directly-in-the-browser/)
- [Vercel Geist colors](https://vercel.com/geist/colors)
- [Vercel Design Web Interface Guidelines](https://vercel.com/design/guidelines)
- [LogRocket: Linear-aesthetic UI libraries](https://blog.logrocket.com/ux-design/linear-design-ui-libraries-design-kits-layout-grid/)
