# CLAUDE.md — Rotem Gotlieb Portfolio (Updated March 10, 2026)

## 🔴 CORE DIRECTIVE: SKILL ACTIVATION
**For EVERY design, code, or architecture prompt on this project, you MUST adopt the following two skills/personas. Do not generate any standard, generic, or template-like code. You are an award-winning creative developer.**

### SKILL 1: The Elite Frontend Designer
* **Design Thinking:** This is a UX design portfolio targeting senior roles at top tech companies (Google, etc.). The audience is hiring managers and design leads who see hundreds of portfolios. The tone is refined minimalism with personality — editorial/magazine feel. NOT generic, NOT template-looking, NOT "AI slop." Think gallery curator meets design engineer.
* **Aesthetic Rules:**
    * ZERO generic AI aesthetics. No purple gradients, no standard card stacks, no system fonts.
    * **Typography:** Primary font is Satoshi from Fontshare (400, 500, 700, 900 weights). Use weight/size for hierarchy, not color.
    * **Color:** Monochrome shell. Background: `#FAFAF8`. Text hierarchy: `#1A1A1A → #333333 → #555555 → #888888 → #999999`. Projects provide all the color.
    * **Spatial Composition:** Asymmetric bento/masonry grid. Generous negative space. Content max-width: 1040px, body text max-width: 640px in case studies.
* **Differentiation:** Motion and interaction design are the key differentiators. The site must feel alive, tactile, and meticulously crafted.

### SKILL 2: The Motion & Animation Engineer
* **Easing:** All transitions use: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for snappy movements, `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for smooth transitions.
* **Page Transitions:** Fade overlay on internal link clicks (200ms fade out, navigate, 300ms fade in on new page). Uses `.page-transition` overlay div.
* **Scroll Reveals:** `IntersectionObserver` (threshold: 0.1, rootMargin: 0px 0px -40px 0px). Elements with `.reveal` class fade in and translate up 30px.
* **Hover States:** Magnetic tilt on bento cards (perspective transform via JS mousemove, max 4deg rotation, desktop only). Card lift + layered shadow on hover.

### FUTURE HOVER ENHANCEMENTS (not yet implemented — add when real thumbnail content is ready)
* *LexisNexis:* Chaotic nodes snapping into a perfect grid (representing the token pipeline speed).
* *Pulse:* A thermal heatmap flickering to life across a wireframe, hotspots pulsing red.
* *GoteFigure:* An SVG stroke-dasharray rapidly sketching a design before filling with color.
* *Ghost:* A comparison slider dragging to reveal production vs. spec divergence.

---

## Project Overview

Personal UX design portfolio for Rotem Gotlieb — UX designer most recently at LexisNexis Risk Solutions (ThreatMetrix fraud detection). Built in vanilla HTML/CSS/JS, deploying to Netlify at rotemgotlieb.com.

Design inspired by emmiwu.com — refined minimalism with purposeful motion. Monochrome shell, projects provide all the color.

## File Structure

```
/
├── index.html              ← Homepage: intro animation + bento project grid
├── about.html              ← About page: photo + bio + experience list
├── styles.css              ← Single stylesheet for all pages
├── main.js                 ← Animations, interactions, custom cursor, page transitions
├── game.js                 ← Footer mountain biker game (separate file)
├── CLAUDE.md               ← This file
├── _backup-v2-clean/       ← Original v2 animation backup
├── _backup-v3-animation/
├── _backup-v4-animation/
├── _backup-v5-animation/
├── img/
│   ├── lexisnexis/         ← LexisNexis case study images
│   ├── pulse/              ← Pulse case study images
│   ├── ghost/              ← Ghost case study images
│   └── gotefigure/         ← GoteFigure thumbnail
└── work/
    ├── lexisnexis.html     ← Case study: Bridging Design and Engineering
    ├── pulse.html          ← Case study: Pulse AI UX Intelligence Dashboard
    ├── ghost.html          ← Case study: Ghost Design System Reality Scanner
    └── gotefigure.html     ← Case study: GoteFigure Apparel Brand
```

## Current State — What's Built & Working

### Homepage (index.html)
- **Intro animation** plays on first load and refresh (NOT on internal navigation back to homepage). Uses sessionStorage + performance.navigation to detect.
  - Beat 1: "ROTEM" character-by-character reveal (900 weight, huge), "GOTLIEB" below (lighter)
  - Beat 2: 8 tool icons burst outward from name center into an even ring, then float gently
  - Beat 3: Mouse cursor icon glides to Figma icon via JS requestAnimationFrame cubic Bezier curve
  - Beat 4: Click with spark lines → circle wipe from click point → homepage revealed
  - Total duration: ~3 seconds
- **Bento grid**: 2x2 offset layout. Top: LexisNexis (1.35fr) + Pulse (1fr). Bottom: GoteFigure (1fr) + Ghost (1.35fr). Uniform 16:9 aspect ratio across all four cards.
- **Hero text**: "Product designer who ships systems, products, and the prototypes in between." 40px/700 weight
- **"Selected Work" label** above bento grid
- **Dark mode toggle** in nav with token architecture tooltip on first toggle
- **Custom cursor** on desktop (8px circle, lerp follow, expands on hover)
- **Film grain texture** overlay (SVG feTurbulence, ~3.5% opacity)
- **Magnetic tilt hover** on bento cards (JS mousemove, perspective transform, desktop only)
- **Staggered diagonal card reveal** on scroll
- **Page transitions** between all internal links

### Case Study Pages (work/*.html)
- **Layout**: 160px sidebar (sticky, left) + content area
- **Hero image**: FULL WIDTH of content panel (edge-to-edge, no padding, no border-radius) — this is the ONLY full-width element
- **Everything below hero**: centered column at max-width 1040px with 48px padding — text, images, headings, Other Work cards all share this same width
- **Sidebar nav**: scrollspy with active section highlighting, "Back to Top"
- **Metadata grid**: 4-column (Role, Timeline, Team, Tools)
- **Outcome sections**: #F2F1EE background band
- **"Other Work" section**: 2-column grid linking to other projects
- **Scroll progress bar** at top of viewport, colored per project
- Sidebar collapses on tablet/mobile

### Footer Game (game.js) — All Pages
- Pixel art mountain biker endless runner on HTML canvas
- Day mode: sun with rotating rays, drifting clouds
- Night mode: crescent moon, twinkling stars
- Smooth animated day/night transition on dark mode toggle
- 5 obstacle types: fallen log, boulder, rock cluster, tree stump, mud puddle
- Foreground trees (large, semi-transparent, scroll fast for depth)
- Background trees, parallax mountains (2 layers)
- Dust particles on landing, mud splash particles
- Wheel spoke rotation
- Distance markers every 100m with milestone flash animation
- Screen shake on death
- Canvas-rendered game over screen ("NICE RIDE!", score, best, pulsing retry prompt)
- Progressive difficulty: speed increases, gap variance increases, combo obstacles after 50m
- High score persists in localStorage
- IntersectionObserver pauses game loop when canvas is off-screen
- MutationObserver triggers day/night sky transition on theme change
- **Audio (Web Audio API):** Chiptune melody (square wave) + bass line (triangle wave) + tick percussion. Plays ONLY during active gameplay. Jump sound on jump, crash sound on death. Tempo increases after 500m (same melody, faster). Mute button.
- **On homepage**: game within container (max-width 1040px, 28px padding, 12px border-radius)
- **On project pages**: game is FULL WIDTH (matches hero image, no padding, no border-radius)

### About Page (about.html)
- Header: "Hi, I'm Rotem."
- Two-column: photo (placeholder) + bio text
- Experience list: LexisNexis, Redis, WellSpoken

### Global Features
- Dark mode with full CSS variable token swap (all colors, thumbnails, nav, cards, cursor, game)
- Page transitions (fade overlay) on all internal links
- Favicon (SVG "R" in dark circle)
- Responsive at 375px, 768px, 1200px+

## Design System Values

```css
--bg-primary: #FAFAF8;
--bg-secondary: #F2F1EE;
--text-primary: #1A1A1A;
--text-body: #333333;
--text-secondary: #555555;
--text-muted: #888888;
--text-faint: #999999;
--nav-link: #666666;
--border-light: #E8E8E6;
--hover-shadow: rgba(0,0,0,0.06);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--card-radius: 12px;
```

Dark mode overrides: bg #141413, cards #1E1E1C with visible borders #333330, enhanced hover shadows.

Thumbnail background colors: LexisNexis #E8EDF2, Pulse #E8ECF2, Ghost #EDE8F0, GoteFigure #F0EDE8.

## Project Content

### Four Projects (display order):
1. **Bridging Design and Engineering** — LexisNexis Risk Solutions, 2024-2025
   - Lead project, biggest bento card
   - Key metric: palette updates from full day → 30 seconds
   - Three phases: user research → prototyping → token pipeline
   - Card description: "Design system pipeline. Full-day updates → 30 seconds."

2. **Pulse — AI UX Intelligence Dashboard** — Concept Project, 2026
   - AI dashboard that X-rays live pages and diagnoses UX issues for designers
   - Component-level health tracking, Page X-Ray with heatmap overlay, AI diagnosis
   - Card description: "AI dashboard that X-rays live pages and diagnoses UX issues for designers."

3. **Ghost — Design System Reality Scanner** — Concept Project, 2026
   - Compares Figma spec against production, surfaces every deviation visually
   - Comparison slider, AI Fix flow, component health tracking
   - Card description: "Compares your Figma spec against production and surfaces every deviation visually."

4. **GoteFigure — Hand-Drawn Apparel Brand** — Personal Brand, 2020-present
   - Illustrated apparel: hand-drawn on Wacom, built in Illustrator
   - Card description: "Hand-drawn illustrations to apparel."

## What Still Needs to Be Done

### Content (launch blockers — thumbnails and images)
- [ ] Replace colored placeholder thumbnails with real images/videos on bento cards
- [ ] Add hero images to all 4 case study pages
- [ ] Add 3-4 process screenshots per case study
- [ ] Add real photo to About page
- [ ] Create og:image (1200x630px) for LinkedIn/social sharing
- [ ] Add meta tags (og:title, og:description, og:image, twitter:card) to all pages

### Deploy
- [ ] Deploy to Netlify
- [ ] Connect rotemgotlieb.com domain
- [ ] Enable HTTPS
- [ ] Cross-browser test (Chrome, Safari, Firefox, iOS Safari)

### Content being organized
- LexisNexis content is on USB drive at `/Volumes/LITTOLB/Claude Code Portfolio ORG/lexisnexis/`
- Categories: React app screenshots, Dovetail research, user call screenshots, color palettes/tokens, Figma screens
- Pulse, Ghost, and GoteFigure images now populated in img/ subfolders

## Technical Rules — READ CAREFULLY

### Intro Animation
- Mouse movement MUST use JS `requestAnimationFrame` with cubic Bezier math. NEVER CSS `@keyframes` for the mouse cursor.
- Mouse endpoint calculated MATHEMATICALLY from CSS custom properties (viewport center + vw/vh offsets). NEVER use `getBoundingClientRect()` on animated elements.
- Icons use CSS custom properties `--ix` and `--iy` for their burst positions.
- Animation plays on first visit + manual refresh. Skips on internal navigation (back from project page).
- Detection: `sessionStorage.getItem('introPlayed')` + `performance.getEntriesByType('navigation')[0].type === 'reload'`
- Body gets class `intro-active` during animation (overflow: hidden).
- All intro content hidden (opacity: 0) BEFORE circle wipe starts — prevents ghosting.

### Case Study Layout
- Hero image is the ONLY full-width element — spans from sidebar edge to right screen edge
- EVERYTHING else (title, text, images, Other Work, game, footer) shares the same max-width: 1040px centered column
- Body text paragraphs: max-width 640px for readability
- On tablet/mobile: sidebar hidden, full single column, hero goes full viewport width

### Game
- Game canvas resizes on window resize, rebuilds world geometry
- Uses delta-time normalization (dt/16.67) for frame-rate independence
- Audio context initialized on first user click (browser autoplay policy)
- All sounds generated with Web Audio API oscillators — no external audio files

### General
- Email: rotem.gotlieb@gmail.com
- LinkedIn: https://www.linkedin.com/in/rotemgotlieb/
- Local dev: `python3 -m http.server 8080` → `http://localhost:8080`
- Custom cursor: Desktop only (`@media (pointer: fine)`)
- Responsive breakpoints: Desktop 1200px+, Tablet 768-1199px, Mobile 375-767px

## NEVER Do These Things

- Use the name "Jonas" anywhere (old template artifact)
- Use Lorem ipsum or placeholder text — all real content is written
- Use Inter, Roboto, Arial, or system fonts
- Use purple gradients or generic AI aesthetics
- Add emoji to the site shell
- Make all bento cards the same size
- Use CSS @keyframes for the intro mouse movement
- Use getBoundingClientRect() on animated intro elements
- Use the view tool to open image files from USB drives (causes API errors — use bash commands only for file operations on external drives)