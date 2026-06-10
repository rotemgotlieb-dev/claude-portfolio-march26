# Polish Bar Research 2026 — Pulse & Ghost v5 Thumbnails

**Date:** 2026-06-09
**Authored during:** Pulse/Ghost v5 polish-pass synthesis sprint
**Subject:** Establishing the polish-bar checklist that v5 thumbnails must meet to ship at elite-grade quality (Linear / Vercel / Salaja / Emil Kowalski / Rauno tier), matching the case-study-level polish the rest of the site already carries.
**Companion files:** [.claude/canonical-motion-spec.md](../canonical-motion-spec.md), [.claude/research/2026-05-25_benji-componentization-philosophy.md](2026-05-25_benji-componentization-philosophy.md), [.claude/research/2026-05-30_thumbnail-patterns-research.md](2026-05-30_thumbnail-patterns-research.md)

---

## Executive Summary

Six parallel research sweeps (editorial portfolio refs, SaaS marketing motion, analytics-dashboard genre, design-system diff genre, 2026 motion-library defaults, curated portfolio gallery norms) converged on a consistent polish bar that v4 partially meets but v5 must fully hit. The bar is NOT a single technique — it's a stack of ~12 dimensions where mid-tier portfolios miss on 4-6 and elite portfolios miss on 0-1. v4's primary gaps cluster around cursor sophistication (linear easing, no breathing, no press states), motion economy (multiple elements animating simultaneously, metronomic uniform timing), genre vocabulary (Pulse heat needs canonical red/orange/yellow with blend composition), and ambient secondary motion (no status pulse, no tick counter, no sub-breath). The single highest-leverage polish primitive observed across 49 references is Salaja's `:has()`-based sibling-dim grid hover — six lines of CSS that converts a passive grid into a curated gallery walk. Combined with cursor-breathing during parked beats, blurred-poster atmospheric halos, and the canonical ease-out-quint curve, v5 closes the gap from competent to elite-grade.

**User-intent override (Ghost):** the research's Chromatic-canonical "neon green diff marker" recommendation does NOT apply. User explicitly approved amber (#F59E0B) for the Ghost production-state wrong-color signal, and approved dropping bounding-box overlay markers entirely. Ghost's drama comes from real visible difference between spec and production, not from annotation. Apply all other Ghost polish primitives.

---

## Methodology

Six parallel sweeps:

1. **Editorial portfolio references** — Emil Kowalski, Paco Coursey, Lee Robinson, Rauno Freiberg, Raphael Salaja, Emmi Wu, Benji Taylor, Cosmos.so
2. **SaaS marketing motion** — Linear, Vercel, Stripe, Notion, Framer
3. **Analytics-dashboard genre** (Pulse reference) — Amplitude, Heap, FullStory, PostHog, Contentsquare, Hotjar
4. **Design-system diff genre** (Ghost reference) — Chromatic, Percy, Argos, Applitools, Reflect
5. **2026 motion library defaults** — Motion.dev (formerly Framer Motion), Aceternity UI, Magic UI, Emil Kowalski's `/ui/great-animations`
6. **Curated portfolio gallery norms** — Awwwards portfolio category, Siteinspire startup gallery, Basement Studio

Each sweep produced: polish primitives observed, quality-bar signals (always/never patterns), key findings, and reference URLs. The synthesis below distills 68 polish primitives, 61 quality-bar signals, and 50 key findings into the actionable v5 checklist.

---

## Polish Primitives Organized by Category

### A. Composition & Grid

1. **Sibling-dim grid hover via `:has()`** — When any card is hovered, others dim to opacity(0.2) + grayscale(1) + scale(0.98); hovered card brightens. Six lines of CSS, no JS. Salaja's signature.
2. **16:9 unified thumbnail aspect** — No mixed aspect ratios; the grid reads as instrument because rhythm is metronomic. Rotem's bento already enforces this.
3. **Restraint on count, abundance on depth** — Top tier shows 4-6 projects with deep polish, never 15+ thin pieces. Rotem's 4-card bento is correctly sized.
4. **Asset reuse across surfaces** — Same canonical video file on homepage bento AND case-study Other Work cards. Codified in Cross-Surface Thumbnail Consistency rule.

### B. Material & Depth

5. **Box-shadow outline-ring (replaces border)** — `box-shadow: 0 0 0 1px var(--border-light)` — no layout consumption, tight against rounded corners. Plus inner rim: `inset 0 0 0 1px oklch(0 0 0 / 6%)`.
6. **Layered 2-stop shadow on floating UI** — `0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.04)`. Reads as 'lifted' without 'heavy.'
7. **Blurred-poster atmospheric halo** — 10x10 SVG data-URI of video's dominant color, `filter: blur(32px) scale(1.2)`, z-index:1 behind crisp video at z-index:2. Zero extra requests.
8. **Cursor-tracking light on hover** — Soft 400-600px radial gradient (opacity 0.06-0.1) that lerps to cursor on hover-active surfaces. The SURFACE glows where the cursor is, NOT the cursor.

### C. Motion Timing & Easing

9. **Token-driven motion timing** — All transitions reference CSS variables (`--ease-quint`, `--duration-mid`, `--pulse-loop`). No hardcoded ms in component CSS. One-file calibration.
10. **Ease-out-quint as canonical curve** — `cubic-bezier(0.19, 1, 0.22, 1)` (Salaja) or `cubic-bezier(0.2, 0.8, 0.2, 1)` (Rauno). The 'expensive software' tell.
11. **Cursor easing by context** — Already in CLAUDE.md. Arrival from offscreen: ease-out. Exit: ease-in. **On-screen traversal: ease-in-out cubic-bezier(0.77, 0, 0.175, 1) — NEVER ease-out (V2 mechanical-feel error).**
12. **Snap-pause-snap rhythm** — Already in CLAUDE.md. Snap (100-150ms) → pause (600-1000ms labor-illusion hold) → snap (200ms resolution). NEVER uniform 333ms × N.
13. **Spring-default for state changes** — Motion.dev's headline feature in 2026. Cubic-bezier reads as 'scripted' against spring-driven competitors. Use `cubic-bezier(0.34, 1.56, 0.64, 1)` as spring-shaped fallback in vanilla.
14. **40ms canonical stagger** — Motion's `stagger(0.04)`. Slower reads as cascade, faster as simultaneous, 40ms reads as choreographed.
15. **Sub-300ms ceiling for repeated interactions** — Emil's explicit rule. 500ms+ feels heavy by loop iteration 3.

### D. Cursor as Demo Protagonist

16. **Cursor as first-class actor** — Visible during action beats, drives the demo. Salaja's videos all feature cursor protagonists.
17. **Cursor breathing during parked beats** — 1.0 → 1.02 → 1.0 scale over 1.4s ease-in-out. Kills the 'dead-cursor' uncanny valley.
18. **Three distinct gesture states** — Hover (elevation + secondary light), press (scale 0.96 + shadow collapse), drag (cursor-tracking + spring release). Single shared 'interactive' animation is the AI-slop tell.
19. **Sub-breath drift between beats** — Cursor drifts 2-4px on sine wave (~3s period) even when 'still' to prevent static-decal read.

### E. Loop Discipline

20. **Loop seam invisibility (geometric, not timing)** — Already in CLAUDE.md as standing rule. Content identical at T=0 and T=LOOP_DURATION. Pixel-precise JS-measured translations, never percentages.
21. **Rest beat at seam** — 300-500ms held stillness before loop restart. Viewer absorbs message in hold, not motion.
22. **Two-frame proof choreography** — State A → transition → state B → hold. Emil's Sonner/Vaul pattern.
23. **Single Unified Timeline architecture** — Already in CLAUDE.md. One master timeline, label-based offsets, data-attribute targeting, zero-position reset block.
24. **Procedural ambient (no seam by construction)** — Stagger phases so aggregate never reaches parity. Stripe mesh, Vercel pulses.

### F. Genre Vocabulary

25. **Heat: canonical red→orange→yellow radial gradient** — Industry convention is `radial-gradient(circle, #FF3B30 0%, #FF9500 30%, #FFCC00 60%, transparent)`. **For this portfolio, use the canonical Pulse tokens (#F07856 friction-hot, #C93E3E molten, #F5B34A warm) — they're in the same warm-orange-red family and brand-locked.**
26. **Multi-layer heat with screen blend** — `mix-blend-mode: screen` so overlapping blobs brighten. Single-layer flat heat is the amateur tell.
27. **Bloom-in heat (scale + opacity ease-out)** — Scale 0.3→1.0 + opacity 0→0.65 over 240-320ms with `cubic-bezier(0.16, 1, 0.3, 1)`. The difference between 'AI-feeling heatmap' and 'real-feeling heatmap.'
28. **Heat over real product screenshot** — Never blank canvas. The page underneath gives heat its meaning.
29. **Time scrubber as primary UI** — Wide, central, with clearly marked playhead and tick marks. Beat-pause-beat pacing (600ms holds, 400ms moves).
30. **Neon green for diff highlights** — Chromatic canonical. `#4ADE80` at 60-80% opacity. **NOT APPLIED to Ghost — user override: amber #F59E0B is the wrong-color signal for production-state drift, no bounding-box markers (drama from real visible difference).**
31. **Toggleable diff overlay** — Fades IN, holds 600-900ms (labor pause), fades OUT before loop reset. **Not applied to Ghost per user override.**
32. **Element-level highlight (semantic outline)** — Highlight snaps to component bounding box with 4-6px padding. **Not applied to Ghost per user override.**
33. **Multi-mode comparison vocabulary** — 1up overlay, 2up side-by-side, Diff strobe. Ghost uses 2up side-by-side with slider per user spec.
34. **Production-grade obvious drift (NOT subtle)** — Per user override: the production state's drift should be obvious-real, not subtle-real. Amber button visible from across the room, missing element, offset tile.

### G. Live-Data Signals

35. **Single status dot pulse** — ONE green dot (5-7px), 1.2s scale 1.0→1.15→1.0 + box-shadow expansion. Multiple pulsing dots read as system distress.
36. **Monospaced tabular-figure metric** — Big numbers as typography. `font-variant-numeric: tabular-nums`. Amplitude's signature.
37. **Micro-counter tick** — +1 every 1.2s with 200ms flash. 'Data flowing right now' without flashy animation.
38. **Tiny ambient sparkline** — 12-20px tall marquee, 6-8s seam-precise loop. Universal 'live' tell.

### H. Composition Philosophy

39. **Selective animation against static chrome** — ONE element animates at any moment. Full app chrome stays static; one feature element moves.
40. **Hero-as-poster test** — Pause at T=0, T=mid, T=end. Each frame must read as deliberate poster. If only reads when moving, fails the gallery surface.
41. **Calm rest-state with one optional ambient detail** — Local time clock, breathing halo, dated entry. Multiple ambient signals = restless.
42. **Monochrome shell + selective color reveal** — Color concentration multiplies impact 10x vs. spread-color UIs.

### I. Typography & Voice

43. **Mixed typeface system (sans + mono + serif)** — Emmi Wu's pattern. Sans for body, mono for metadata, serif for personality. Pure-sans reads more generic.
44. **Numbers-as-typography** — Big monospaced tabular metrics; the number IS the visual.
45. **Editorial date-stamping** — Visible dates signal active curation. Absence reads as abandonment.
46. **Voiced specific copy** — Confident short sentences, proper nouns, specific numbers. Generic SaaS copy is the AI-template tell.

### J. Engineering Hygiene (visible in view-source)

47. **Viewport-scoped autoplay** — Already in CLAUDE.md §7a. Below-fold videos rescued by IO retry, not parse-time `.play()`.
48. **`will-change: transform` on RAF-animated elements** — Already in CLAUDE.md §7b. Compositor-layer promotion prevents paint stutter.
49. **Full 7-attribute video pattern** — Already in CLAUDE.md Mobile Video §1. autoplay/muted/loop/playsinline/preload="metadata"/poster/aria-label.
50. **Display-P3 color overrides** — `@supports @media (color-gamut: p3)` with oklch values. Hiring-manager MacBook Pro displays = P3.
51. **Paired light/dark assets** — File-pair pattern (-light.svg / -dark.svg) over CSS filters. Vercel/Linear discipline.

---

## The Polish-Bar Checklist (full table)

| # | Dimension | Standard | v4 Status | How to Close Gap |
|---|-----------|----------|-----------|------------------|
| 1 | Cursor sophistication | First-class actor with ease-in-out cubic-bezier(0.77,0,0.175,1) traversal, press-state (scale 0.96), breathing 1.4s at park | **misses** | Replace linear easing with token; add `cursor-breathe` keyframe; press-state class on grab |
| 2 | Easing curve discipline | All transitions token-driven; --ease-quint for hover, --ease-cursor for traversal, no `ease`/`linear`/default | **partially_hits** | Add `--ease-quint`/`--ease-cursor` to :root; grep & replace every non-token curve |
| 3 | Loop seam invisibility | T=0 and T=5.5s pixel-identical; 300-500ms rest beat at seam | **partially_hits** | Reserve 5.0-5.5s as held stillness; scrubber returns + heat fades by 5.0s |
| 4 | Ambient secondary motion | 1-3 live-data signals (status dot, sparkline, counter tick) per thumb | **misses** | Add green status pulse + monospaced tick counter to chrome of both thumbs |
| 5 | Material weight | Box-shadow ring (no border); inner rim oklch 6%; 2-stop shadow on floating UI | **misses** | Swap border for box-shadow; add ::after inner rim; tooltip-shadow on Pulse popup + Ghost handle |
| 6 | Sibling-dim grid hover | `:has()` dims non-hovered to 0.2 opacity + grayscale; hovered brightens | **misses** | 6 lines of CSS on `.bento-grid:has(.bento-card:hover)` |
| 7 | Blurred-poster halo | 10x10 SVG data-URI dominant-color blob, blur(32px) scale(1.2), z-index:1 | **misses** | Pulse: #FF8866; Ghost: #5B6E80. Inline SVG, zero extra requests |
| 8 | Selective animation | ONE element animates per moment; snap-pause-snap rhythm | **partially_hits** | Audit beats for simultaneous animation; refactor to snap-pause-snap timeline |
| 9 | Genre vocabulary | Pulse: canonical Pulse-warm heat with screen blend; Ghost: amber wrong-color drift (user override) | **partially_hits** | Pulse: add mix-blend-mode:screen + bloom-in. Ghost: amber stays, no green/no bbox |
| 10 | Multi-step rhythm | Snap (150ms) → pause (600-1000ms labor hold) → snap (200ms); no uniform metronome | **partially_hits** | Document beat intervals; refactor any uniform sequence to snap-pause-snap |
| 11 | Rest-state composition | Hero-as-poster test passes at T=0, mid, end; asymmetric split (38/62), never 50/50 | **misses** | Pause v5 at 3 frames, screenshot, recompose held moments |
| 12 | Engineering hygiene | Single Unified Timeline, label-based offsets, viewport-scoped autoplay, will-change | **partially_hits** | Run SUT audit checklist on v5; cross-surface consistency grep must return zero `<img>` |

---

## Pulse v5 Specific Recommendations (polish-pass)

- Keep canonical Pulse colors (#F07856 friction-hot, #C93E3E molten, #F5B34A warm) — user-established palette, brand-locked.
- Apply `mix-blend-mode: screen` to the heat layer container so overlapping blobs brighten additively (multi-layer composition not flat).
- Bloom-in stagger when entering heat-peak phase: 40ms stagger per blob, scale 0.3→1.0 + opacity 0→peak over 240ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Add cursor breathing during the parked beats (T=0→300 and T=4900→5500): 1.4s ease-in-out scale 1.0→1.02→1.0.
- Add press-state on the grab gesture (T=300→450): scale 0.96 + 4px outer ring expansion.
- Add ONE green status dot in chrome ('Tracking' or 'Live'), 6px, 1.2s pulse.
- Add ONE monospaced tabular counter ('Events: 12,847'), tick +1 every 1.2s with 200ms flash.
- Halo color: `#FF8866` (warm orange-pink) — `.thumb-halo--pulse` background SVG data-URI.
- Loop seam rest beat: held stillness 5000→5500 (no animation), all elements at T=0 baseline.

## Ghost v5 Specific Recommendations (polish-pass)

**Per user override:** Ghost diff vocabulary is amber-on-production (visible wrong-color drift in production layer), NOT neon-green overlay markers. NO bounding-box overlays. Drama comes from real visible difference.

- Keep amber (#F59E0B) as the wrong-button color in production layer.
- Keep all other production-state drifts visible (missing nav dot, offset stat tile, washed header shade, oversized card).
- Add cursor breathing during the parked beats: same pattern as Pulse.
- Add press-state on the grab gesture: scale 0.96 + 4px outer ring.
- Add ONE status dot in chrome — green when slider at start (mostly spec), amber when slider at end (mostly production). Single dot, single transition.
- Optional: small monospaced label like `12 deviations` or no label — keep chrome quiet.
- Halo color: `#5B6E80` (cool slate-blue) — `.thumb-halo--ghost` background SVG data-URI.
- Loop seam rest beat: held stillness 5000→5500.
- Slider at peak (right edge) should be ~88/12 (mostly production visible) — asymmetric framing, not 50/50.

## Site-wide CSS additions (apply once, both thumbs benefit)

- Add motion tokens to `:root`: `--ease-quint: cubic-bezier(0.19, 1, 0.22, 1)`, `--ease-cursor: cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`, `--duration-fast: 200ms`, `--duration-mid: 400ms`, `--duration-slow: 600ms`.
- Add sibling-dim grid hover to `.bento-grid` block — 6 lines of CSS.
- Add `.thumb-halo` base styles + `.thumb-halo--pulse` + `.thumb-halo--ghost` variants.
- Add box-shadow outline-ring + inner rim treatment to `.bento-card .project-thumbnail` (swap border for box-shadow).

---

## References (URL + 1-line summary)

### Editorial Portfolio

- **https://www.raphaelsalaja.com** — 16:9 video thumbnail grid; blurred-poster halo behind every video; :has()-based grid dim; --transition CSS token; box-shadow outline-rings.
- **https://emilkowal.ski** — Pure text-link project list, restraint-on-index strategy.
- **https://emilkowal.ski/craft** — Deep motion experiments; cursor as first-class actor.
- **https://emilkowal.ski/ui/great-animations** — Explicit sub-300ms ceiling rule; ease-out for snappy feel.
- **https://rauno.me** — Stitches tokens visible inline: --transitions-snappy, layered shadow scale (small/medium/large/tooltip).
- **https://emmiwu.com** — Mixed-typeface system (Figtree + IBM Plex Mono + Kode Mono + Self Modern serif).
- **https://paco.me** — Text-first project list; voiced specific copy.
- **https://benji.org** — Text-first projects; editorial date-stamping; calm rest-state with single ambient (local time clock).
- **https://www.cosmos.so** — Multi-column masonry gallery; inline photographer credits as provenance.

### SaaS Marketing Motion

- **https://linear.app** — Full app chrome on product art; CDN-delivered static frames with selective animation; layered art-directed stills.
- **https://linear.app/plan** — Dedicated mockup frames per feature; full Linear shell preserved.
- **https://vercel.com** — Paired light/dark SVG assets; ambient globe pulses; build-time stat callouts.
- **https://stripe.com/connect** — Full dashboard chrome; state-to-state crossfade demos.
- **https://stripe.com/payments** — Live iframe-embedded Checkout (highest-fidelity demo).
- **https://www.notion.com** — Static screenshots via Next.js image optimization; preserved browser chrome.

### Analytics Dashboard Genre

- **https://contentsquare.com/guides/heatmaps/** — Canonical red→blue heat scale; red/orange/yellow hot side documented.
- **https://amplitude.com** — Numbers-as-typography; monospaced tabular metric callouts; live counter ticks.
- **https://posthog.com/heatmaps** — Themable heat gradients (designer-controlled palette).
- **https://www.fullstory.com/platform/heatmaps/** — Revenue-overlay composited on behavioral heat; compare-historical-to-now as roadmap.
- **https://heap.io** — Named viz primitives (Journeys, Heatmaps, Session Replay).

### Design-System Diff Genre

- **https://www.chromatic.com/docs/diff-inspector/** — Neon green for diff highlights (chromatic isolation); diff strobing 'party mode'; autofocus on subtle drift. **Pattern NOT applied to Ghost per user override.**
- **https://www.chromatic.com/features/visual-test** — Multi-mode comparison vocabulary (1up, 2up, Diff).
- **https://argos-ci.com** — Speed-as-felt-promise ('seconds' positioning).
- **https://applitools.com** — Root Cause Analysis (element-level not pixel-level).

### 2026 Motion Libraries

- **https://motion.dev/** — Spring physics as default (type='spring'); stagger(0.04) canonical interval; hover/press/drag as distinct gestures.
- **https://ui.aceternity.com** — Ambient backdrop motion; cursor-tracking light; 3D Card Effect; multi-layer shadows.
- **https://magicui.design** — Blur Fade as first-class primitive; production-ready Motion + Tailwind components.

### Curated Galleries

- **https://www.awwwards.com/websites/portfolio** — June 2026 SOTD picks uniformly carry joint Developer Award (visual + engineering rigor are coupled).
- **https://www.siteinspire.com/websites?categories=2** — Static 1920px frames; monochrome dominance; the hero-as-poster test enforced by gallery format.
- **https://basement.studio** — WebP feature tiles linked to case studies.

---

## Open Questions for Future Investigation

1. **Spring physics in vanilla** — Motion.dev positions spring as the 2026 default but our portfolio is vanilla. Is the `cubic-bezier(0.34, 1.56, 0.64, 1)` spring-shaped fallback close enough?
2. **P3 color override scope** — Should Pulse heat blobs use P3-extended saturation? Probably needs a portfolio-wide P3 token pass.
3. **Mixed typeface integration** — Emmi Wu's pattern adds IBM Plex Mono for metadata. Worth ~30KB font cost for technical-credibility lift on the live-tick counter?
4. **System cursor vs. branded cursor in demos** — Top SaaS marketing uses no cursor or system cursor SVG, not branded dots. Test which reads better INSIDE the autoplay demo.
5. **GSAP migration threshold** — At what point does the vanilla orchestrator's complexity justify GSAP's ~50KB? Probably when a third or fourth simultaneous timeline lands.
6. **Loop seam strategy** — Rest beat (geometric) vs. procedural ambient (no seam by construction). Currently using rest beat for primary loop.

---

## Citation provenance

This file synthesizes findings from six parallel research sweeps conducted 2026-06-09 during the v5 polish-pass preparation. Cite this file in any future session that revisits Pulse or Ghost thumbnail polish, that builds a new bento-tier artifact, or that audits the portfolio against the 2026 elite-portfolio bar. Companion to existing standing rules in [CLAUDE.md](../CLAUDE.md): Cursor easing by context, Multi-step rhythm (snap-pause-snap), Single Unified Timeline architecture, Loop seam diagnosis, Case study opener, Cross-surface thumbnail consistency, Mobile video, JS-state classes, Reference-portfolio investigation methodology.
