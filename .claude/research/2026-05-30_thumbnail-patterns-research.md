# Top-tier portfolio thumbnail patterns — homepage research

**Date:** 2026-05-30
**Question:** How do best-in-class designer portfolios present case-study thumbnails on the homepage? What's the right pattern for Rotem's 4 projects?
**Method:** Raw HTML inspection via `curl` of 9 portfolios (WebFetch strips visuals — DOM scrape was load-bearing). Asset audit of `<video>`, `<img>`, `<canvas>` tags; attribute-level analysis of `autoplay`/`loop`/`muted`/`playsinline`/`poster`; aspect-ratio extraction from inline styles.

---

## 1. TL;DR — the landscape (120 words)

The top tier has converged: **autoplay muted loop MP4 in a 16:9 frame is the dominant homepage thumbnail pattern** (Salaja, Rauno's Craft, Emmi Wu, partly Charles Shin). Static-only thumbnails (Brittany Chiang, Charles Shin's nav row, Tobias Ahlin) read as a tier below — competent but not memorable. The signature move from the leaders is **the loop IS the thesis**: not a product screenshot that happens to move, but a 5–8s motion artifact distilled to a single argument (Salaja's Cambio = pure timeline UI animating; Rauno = a craft principle demonstrated). A small minority (Charles Shin nav cards, Benji's bio links) intentionally use icon-only / text-only for projects they want to underweight versus their featured work. Hover behavior is minimal — the loop carries the seduction; click target is the whole card.

---

## 2. Per-portfolio findings

**[Raphael Salaja — raphaelsalaja.com](https://raphaelsalaja.com)** — 6 work entries on homepage, 19+ total in /work. Every entry: `<video autoPlay muted loop playsInline>` MP4, `aspect-ratio: 1.7777` (16:9), blurred SVG color-rect placeholder behind via `filter:blur(32px)` while video loads. No hover state change — loops always play. Title appears below thumbnail on grid. **The gold standard.**

**[Rauno Freiberg — rauno.me/craft](https://rauno.me/craft)** — 40+ autoplay muted loop videos in a single stream. Some have `transform:scale(1.005)` to prevent 1px edge flicker. Each item is a single craft principle (focus rings, lerp curves, etc.) shown as an isolated demo loop. Dense feed > formal grid. No hover behavior visible in HTML.

**[Charles Shin — ch.sh](https://ch.sh)** — Featured work uses **dual-layer crossfade**: `<img>` webp poster (opacity 100) absolutely positioned over `<video>` mp4 (opacity 0). Hover swaps opacities. Nav row (Freighter/Snack/Lab/etc.) uses tiny 16x16 SVG icons with `group-hover:scale-110`. **Mixed-tier pattern** — featured work gets video, secondary gets icon-only.

**[Emmi Wu — emmiwu.com](https://www.emmiwu.com)** (Rotem's cited inspiration) — Mixed pattern: hero project autoplays mp4 immediately; subsequent grid items use `loop muted playsinline preload="none"` videos that only start when scrolled near. Heavy use of static Framer images at 2000–4000px wide alongside videos. 2-column grid post-hero.

**[Emil Kowalski — emilkowal.ski](https://emilkowal.ski)** — Homepage projects (animations.dev, Sonner, Vaul, index.how) are **text-only links with descriptions**, no thumbnails at all. Visual artifacts live one layer deep on the project sites themselves. Deliberate minimalism — works because each linked site IS a live demo.

**[Linear — linear.app](https://linear.app)** — Static high-res webp/avif images at 1920x1080 via CDN with `data-grain` overlay attribute. Product screenshots, not motion. Inline avatars and small icons everywhere. Linear is a product site, not a portfolio, but shows what production-grade static thumbs look like.

**[Shape of AI — shapeof.ai](https://www.shapeof.ai)** — `.webp` cards with responsive srcset (500w → 3040w), no video. Each pattern card is a static UI mock. Pattern-library presentation, not project showcase.

**[Brittany Chiang — brittanychiang.com](https://brittanychiang.com)** — Static PNG `aspect-video` thumbnails, `group-hover:border-slate-200/30` border highlight, modest 200x48 small previews next to large prose. Engineering-portfolio convention.

**[Benji Taylor — benji.org](https://benji.org)** — **Text-only bio with hyperlinked project names.** No thumbnails. Works because he's senior enough that the company names (SpaceX, Coinbase, Family) carry the signal. **Anti-pattern for Rotem** — Rotem doesn't have that brand-equity shortcut.

---

## 3. Pattern decomposition — 6 categories

### A. Autoplay video loop (THE dominant pattern)
**Used by:** Salaja, Rauno, Emmi Wu (hero), Charles Shin (featured), Pulse/Ghost bento on Rotem's current site.
**Why it works:** Loop IS the thesis. 7-second window communicates more than any still. iOS-safe via the 7-attribute pattern Rotem already enforces. Bandwidth is the real cost (~80–200 KB per loop).
**Trade-off:** Demands a curated 5–8s story. A bad loop is worse than a good still — the eye locks on motion and judges harshly.

### B. Hover-triggered video (poster → mp4 crossfade)
**Used by:** Charles Shin's featured cards.
**Why it works:** Page-load is cheap (image only), motion appears on intent. Implies "click to explore."
**Trade-off:** Loses the at-rest seduction of the loop. Mobile has no hover so this degrades to static-only.

### C. Live-DOM thumbnail (HTML/CSS/JS running in the card)
**Used by:** Rauno's craft items where the demo IS DOM (focus ring demos, etc.). Emil's site, in spirit — the linked sites ARE live components.
**Why it works:** Interactive, zero video weight, scales perfectly. Demonstrates engineering chops.
**Trade-off:** Massive build cost per card. Only worth it if the project IS interactive UI.

### D. Single-frame hero still
**Used by:** Linear, Shape of AI, Brittany Chiang.
**Why it works:** Performance, simplicity, predictable quality.
**Trade-off:** A static homepage thumbnail in 2026 reads as one tier below motion. Tolerable for product sites, costly for design portfolios.

### E. Multi-frame collage / stitched
**Used by:** Emmi Wu (some items use 2–3-image montages within a single card).
**Why it works:** Communicates breadth (multiple deliverables on one project) in one frame.
**Trade-off:** Easy to read as visual clutter; collage demands tight art direction.

### F. Conceptual / abstract
**Used by:** Charles Shin's RGB/Noundation icons; Rauno's most abstract craft demos.
**Why it works:** When the actual product UI is proprietary or boring, an abstract mark CAN carry the brand.
**Trade-off:** Risks reading as "decorative" rather than "the work." Best used sparingly within a grid that's otherwise concrete.

---

## 4. Per-project recommendations for Rotem

All four use **Pattern A — autoplay muted loop MP4, 16:9, 7–10s** (matches the strongest cohort: Salaja + Rauno + Emmi). The pipeline already exists on this site (Mobile Video Standing Rule, parse-time `.play()`, IO retry). Differentiation lives in the loop *content*, not the format.

### LexisNexis — Bridging Design and Engineering
**Concept:** **Token-cascade animation.** Single color swatch in upper-left. At T+0 it shifts hue (e.g. blue→teal). Over the next 6s, the swatch's new value propagates through a tree of 12–20 dependent component chips arranged in a rough hex grid below — each chip flipping to the new hue in a staggered wave (50ms apart, ease-out, lighter shadow on flip). Final 1s: the entire tree settles, a tiny label fades in: `30s` or `tokens propagated`.
- **3-second read:** "One change ripples through a whole system."
- **7–10s loop story:** Source change → staggered propagation wave → settle → quiet held state → loop.
- **Why this project specifically:** The case study's entire thesis is "full-day updates → 30 seconds." The thumbnail IS the metric, made visible. Engineering-focused project gets an engineering-precise visual.

### Pulse — AI UX Intelligence Dashboard
**Concept:** **Wireframe + emerging heatmap.** Greyscale wireframe of a page (header, hero, 3-up cards) holds for 1.2s. A heatmap glow begins blooming from one hotspot (red), then two more (orange, yellow). A small AI-diagnosis chip slides in lower-right with one line like "Hero CTA cold zone — 2.1× below benchmark." Held for 2s. Heatmap fades. Loop.
- **3-second read:** "The dashboard sees what users can't tell you."
- **7–10s loop story:** Wireframe at rest → heatmap blooms → diagnosis chip lands → quiet hold → reset.
- **Why this project specifically:** Living Observatory IS the hero artifact (per Case Study Opener rule). The bento thumbnail should echo it in miniature — the same X-ray gesture, 1/10th the canvas. Pairs the homepage thumb with the hero loop on the case-study page, building recognition.

### Ghost — Design System Reality Scanner
**Concept:** **Slider-reveal between Figma spec and production.** Static split: left half "DESIGN" label, perfect spec mock; right half "PRODUCTION" label, same component with subtle drift (off-by-2px padding, wrong font weight, faded color). A vertical slider handle animates left→right→left over 6s, smoothly revealing the differences. At handle's midpoint, 2–3 tiny callout markers fade in on drift points (a `+2px` chip, a `#`-color chip).
- **3-second read:** "It catches what eyeballs miss."
- **7–10s loop story:** Spec visible → slider sweeps right showing production → callouts ping → slider returns → loop.
- **Why this project specifically:** The slider IS the product's signature interaction. Putting it in the thumb is "what you see is what you get." Direct, no metaphor needed.

### GoteFigure — Hand-Drawn Apparel Brand
**Concept:** **Pencil sketch → ink → color.** Single illustration (one of Rotem's strongest hand-drawn pieces). Loop starts with rough pencil strokes appearing via SVG `stroke-dasharray` over 2s. Then black ink lines bloom in over 1.5s (replacing pencil). Then flat color fills cascade in over 1.5s. Hold for 1s. Crossfade back to blank. Loop.
- **3-second read:** "Hand-drawn, all the way through."
- **7–10s loop story:** Blank → pencil sketch → inked → colored → held → fade to blank.
- **Why this project specifically:** This is the *only* project that's pure art, not product. It should feel like watching the artist's hand. The other three thumbs are UI/system loops; this one breaks the pattern intentionally to signal "different tier of work, personal craft."

**Cross-cutting notes:**
- All four loops keep the same 16:9 frame, same `--card-radius: 12px`, same monochrome scaffolding so the four read as a curated set, with each project's color identity inside the frame doing all the chromatic work.
- Each loop's **first 600ms must be the strongest single beat** (Body-demo discipline §5 — applies to bento thumbs too).
- Encode per the existing pipeline (CRF 28 for bento, H.264 Main L4.0, 30fps CFR, +faststart, audio stripped). Target ≤200 KB each, ≤800 KB total for the bento grid.

---

## 5. Open questions for Rotem

1. **LexisNexis is real work under NDA-ish constraints. Can the token-cascade thumb show real LexisNexis component fragments, or does it need to be abstracted (generic chips)?** This shifts the concept from "look at the actual artifact" to "look at the principle."
2. **For Pulse and Ghost (concept projects), should the bento loop be the *same* MP4 as the case-study hero, or a tighter miniature?** Reusing the hero clip is cheaper and builds recognition; a miniature is more curatorially correct (per Case Study Opener Rule §4, the hero shouldn't repeat in body — but the homepage isn't "body").
3. **GoteFigure pencil→ink→color: do we have any existing time-lapse footage from a real Wacom session, or do we synthesize the sequence in After Effects from the finished art?** Real time-lapse would be a flex; synthesis is faster but reads as effect.
4. **Audio?** Salaja, Rauno, Emmi all run silent. Standing rule says strip audio (`-an`). Confirm we stay silent.
5. **Title overlay on bento thumb, or only on hover?** Current Rotem bento has the project name visible as a label below the thumb. Salaja and Rauno do the same. Recommend keeping that — the loop seduces, the label confirms. No overlay text on the loop itself.

---

**Sources (raw HTML inspected via `curl`, 2026-05-30):**
- https://raphaelsalaja.com (6 entries verified, `<video autoplay muted loop playsInline>` MP4, 16:9, blur placeholder)
- https://rauno.me/craft (40+ autoplay loop videos)
- https://ch.sh (img-poster + mp4 crossfade pattern)
- https://www.emmiwu.com (mixed autoplay + scroll-triggered video, framer images)
- https://emilkowal.ski (text-only project list)
- https://linear.app (static webp 1920x1080 with grain)
- https://www.shapeof.ai (static webp pattern cards)
- https://brittanychiang.com (static png small previews)
- https://benji.org (text-only bio)
