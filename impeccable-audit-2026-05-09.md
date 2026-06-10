# Impeccable Audit & Critique — rotemgotlieb.com

**Date:** 2026-05-09
**Target:** https://rotemgotlieb.com (live + local source)
**Scope:** Full technical audit + critique of homepage and four case studies (LexisNexis, Pulse, Ghost, GoteFigure)
**Mode:** Brutal honesty. No softening. Recruiter-readable.

---

## 0. Methodology Notes (read first)

- **Setup gate skipped intentionally.** Impeccable's normal flow requires `PRODUCT.md` and a `shape` confirmation before any opinion is rendered. This project has no PRODUCT.md, but it has a 250-line [CLAUDE.md](CLAUDE.md) that performs the same role (audience, tone, register, anti-references, design laws). I used CLAUDE.md as the de facto product context. Register: **brand** (portfolio — design IS the product).
- **Deterministic detector skipped.** `npx impeccable --json` was denied by sandbox classifier (auto-installs untrusted npm package). All findings below are LLM-derived from full source reads and live URL fetches.
- **Live ≠ source.** I fetched all five URLs live. The deployed site matches the source on disk; no rendering drift detected. (WebFetch's "no video hero" on Pulse is a false negative — it doesn't execute markup; the source has `ai-fly.mp4` as the hero.)
- **Browser overlay tab skipped.** No Playwright/Puppeteer available in this session. The `[Human]` overlay tab that `critique` normally produces is not present.

---

# PART 1 — AUDIT (technical, cross-cutting)

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|---|---|---|
| 1 | Accessibility | **2 / 4** | Multiple WCAG AA contrast failures on muted/faint text. Broken `aria-labelledby` on image modal (4 pages). No `prefers-reduced-motion` opt-out for 3-second intro animation. |
| 2 | Performance | **3 / 4** | Strong fundamentals (lazy load, faststart videos, IO-gated game, viewport-scoped autoplay). Cost: 3s intro animation, perpetual cursor RAF, Fontshare CDN single-point-of-failure for typography. |
| 3 | Theming | **3 / 4** | Solid token system with full dark mode. Drift: hardcoded hex inline (page-transition, scroll-progress per-case color), inline `style="object-position:..."` on imgs, dark-mode thumbnail overrides hardcoded instead of tokenized. |
| 4 | Responsive Design | **3 / 4** | Three breakpoints, clever mobile bento reorder via `display:contents` + `order:`. Failing: theme-toggle (32×32px) and PDF.js toolbar buttons (28×28) below WCAG 44×44 touch target minimum. Nav links 12px on mobile. |
| 5 | Anti-Patterns | **3 / 4** | Genuinely distinctive — intro animation, bento asymmetry, bike game are NOT AI slop. But: em dashes everywhere (Impeccable §Copy "no em dashes"), Pulse outcome is a textbook hero-metric template, "AI-native" buzz copy, About's "Currently Building" is the identical-card-grid pattern. |
| | **Total** | **14 / 20** | **Good (address weak dimensions)** |

**Rating band:** Good. The site is well above average and clearly the work of someone who cares about craft. But the score is dragged down by a small set of high-leverage issues — most importantly the contrast failures and the broken ARIA — that no recruiter will notice consciously but that fail WCAG and would fail an enterprise accessibility audit on day one.

---

## Anti-Patterns Verdict (start here)

**Does this look AI-generated? NO. Mostly.**

This is **not** AI slop. It is the work of a real designer with a defined aesthetic point of view: monochrome shell + bento + film grain + character-by-character name intro + tool-icon orbit + custom cursor + bike game + page transitions. None of those choices read as default LLM output. The references named in CLAUDE.md (emmiwu.com, rauno.me, raphaelsalaja.com, emilkowal.ski) are correctly internalized.

**The specific AI tells that ARE present:**

1. **"AI-native" buzz copy.** `index.html:157` — *"Currently designing AI-native products end-to-end."* `AI-native` + `end-to-end` in one sentence is two LLM-flavored phrases stacked. "AI-native" is meaningless filler; "end-to-end" is meaningless filler. **Fix:** name two products. "Currently designing Pulse and Ghost — two AI-augmented design tools." Concrete > buzzword.
2. **Hero-metric template at Pulse outcome.** `work/pulse.html:187` — *"**17 issues authored across five pages. 32 components tracked. Six procedural wireframes rendered in code. Four heatmap layers. Twelve build phases on a single branch in a focused day, on top of six weeks of part-time work.**"* Bolded multi-metric run-on inside `<strong>` tags is the SaaS-cliché hero-metric template Impeccable's shared laws explicitly call out. For a concept project, it also reads as inflated — "17 issues authored" is meta-craft, not user impact. **Fix:** pick the ONE metric that proves the thesis (probably the six procedural wireframes) and lose the rest. Or move the list to an aside.
3. **Repeated "X pivots" framing.** Both Pulse (`work/pulse.html:171` — "Two more pivots got it the rest of the way") and Ghost (`work/ghost.html:158` — "Three pivots made Ghost what it is") use identical structural framing for their Process sections. For a portfolio of four cases, two sharing the same skeleton reads as a template. **Fix:** give one of them a different shape — Pulse already has the V1/V2 diptych which is unique; lean on that. Ghost can use a different rhetorical move (chronological, principle-led, what-I-removed).
4. **Identical "Built with:" coda.** Both Pulse and Ghost end with a "Built with: Figma, Next.js 14, Tailwind, Framer Motion" sentence in the Outcome section. Identical structure, near-identical word order. This is the spec-sheet ending the impeccable test would flag as template-rendering.
5. **Identical-card grid on About — "Currently Building".** Three cards (Rotem's Adventures, GoteFigure, Gote Golf VR), each with image+title+description. Same dimensions, same internal layout. Impeccable's absolute ban on "identical card grids" applies even though the cards link to real different things. **Fix:** vary the card sizes (one tall, two short, like the bento), or make one of them an editorial photograph instead of a card.
6. **Em dashes EVERYWHERE.** Impeccable's shared law §Copy says "**No em dashes.**" The site uses em dashes in every project title (`GoteFigure — Hand-Drawn Apparel Brand`, `Pulse — AI UX Intelligence Dashboard`, `Ghost — Design System Reality Scanner`), every project label (`lexisnexis risk solutions — 2024-2025`), and ~40 body paragraphs. This is a deliberate style choice on this site, not slop — but if you treat Impeccable's rules as binding, you fail this category hard. **Recommendation:** don't apply this rule. Em dashes are a craftsperson's punctuation; the AI-tell association is a recent overcorrection. Keep them.

**Tells that are NOT present (good):**
- No purple gradients
- No gradient text
- No glassmorphism cards (only `backdrop-filter` on scrolled nav, which is purposeful)
- No side-stripe borders
- No hero metric on the homepage
- No Inter / Roboto / system font
- No emoji decoration
- Not a "dashboards are always dark" reflex (light is the default, dark is a toggle)

---

## Executive Summary

- **Audit Health Score: 14/20 (Good)**
- **Issues found: 4 P0, 11 P1, 14 P2, 8 P3 = 37 total**
- **Top 5 things to fix this week:**
  1. **[P0] Broken `aria-labelledby="imageModalTitle"` on all 4 case study pages.** No matching element. Screen readers announce nothing or fall back to generic dialog label. (`work/*.html` lines 246/250/242/212 + corresponding image modal markup.)
  2. **[P0] WCAG AA contrast failures** on `--text-muted` (#888 on #FAFAF8 ≈ 3.5:1) and `--text-faint` (#999 ≈ 2.85:1). Both used for project labels, section labels, footer quote, game prompt. Fail AA's 4.5:1 minimum. Dark mode has the same pattern flipped (`--text-faint: #555` on `#141413` ≈ 2.5:1 — worse).
  3. **[P0] No `prefers-reduced-motion` handling.** A 3-second JS-orchestrated mouse-glide + circle-wipe intro plays on every refresh / first visit. Users who have set OS-level reduce-motion get the full ride regardless. This is the single most likely cause of a recruiter closing the tab.
  4. **[P0] Ghost case study hero is a static image while its homepage bento card is a video.** Violates the Case Study Opener Standing Rule §2 ("prefer video over static image for the hero artifact when both exist") — `ghost-demo.mp4` exists in the body. The hero should be the video.
  5. **[P1] "AI-native ... end-to-end" hero subtitle copy.** The single most LLM-flavored sentence on the site, sitting in the first viewport of the homepage.

---

## Detailed Findings by Severity

### P0 — Blocking (fix immediately)

#### [P0] Broken `aria-labelledby` on image modal — 4 pages
- **Location:** [work/lexisnexis.html:246](work/lexisnexis.html#L246), [work/pulse.html:250](work/pulse.html#L250), [work/ghost.html:242](work/ghost.html#L242), [work/gotefigure.html:212](work/gotefigure.html#L212)
- **Category:** Accessibility
- **Impact:** `<div class="image-modal" role="dialog" aria-labelledby="imageModalTitle">` — but no element with `id="imageModalTitle"` exists anywhere in the markup. Screen readers announce the dialog with no accessible name, or fall back to the alt text of the contained image (if AT chooses that path). The closest analog modal (`#resumeModal`) DOES have a matching `<h2 id="resumeModalTitle">` — so this looks like a copy-paste regression on the image modal.
- **WCAG/Standard:** WCAG 4.1.2 Name, Role, Value (Level A)
- **Recommendation:** Either (a) add a visually-hidden `<h2 id="imageModalTitle">Expanded image</h2>` inside the image-modal-content, or (b) swap to `aria-label="Expanded image"`.
- **Suggested command:** `/impeccable harden work/*.html`

#### [P0] WCAG AA contrast failures — muted + faint text
- **Location:** [styles.css:16-17](styles.css#L16-L17) (light) + [styles.css:34-35](styles.css#L34-L35) (dark)
- **Category:** Accessibility
- **Impact:**
  - Light mode: `--text-muted: #888888` on `#FAFAF8` ≈ **3.5:1** (fails 4.5:1 AA for normal text)
  - Light mode: `--text-faint: #999999` on `#FAFAF8` ≈ **2.85:1** (fails AA, fails AA Large at 3:1 by a hair)
  - Dark mode: `--text-muted: #777777` on `#141413` ≈ **4.3:1** (fails 4.5:1 AA, passes by rounding under some calculators)
  - Dark mode: `--text-faint: #555555` on `#141413` ≈ **2.5:1** (fails everything except WCAG 1.4.11 non-text contrast)
- **Used in:** `.project-label`, `.section-label`, `.section-label-home`, `.footer-quote`, `.footer-location`, `.game-prompt`, `.metadata-label`, `.project-description` (via secondary, OK), `.sidebar-link` default state (text-faint), `.experience-dates`, `.token-tooltip`, `.error-code`.
- **WCAG/Standard:** 1.4.3 Contrast (Minimum) — Level AA
- **Recommendation:** Bump `--text-muted` to `#6E6E6E` (4.74:1 on #FAFAF8) and `--text-faint` to `#7A7A7A` (4.05:1 — still under AA, so pick `#717171` for 4.5:1). For dark mode, `--text-muted: #8E8E8E` (4.55:1 on #141413) and `--text-faint: #6E6E6E` (3.05:1 — fine for "decorative" but if used for labels, push to `#8E8E8E`). For project-labels and section-labels on the homepage, these are decorative micro-text — you can argue they're "incidental" under WCAG 1.4.3 exemptions, BUT the safer move is to bump them. A senior designer applying for accessibility-conscious teams will be auto-rejected by some hiring screens that run aXe.
- **Suggested command:** `/impeccable harden styles.css`

#### [P0] No `prefers-reduced-motion` handling
- **Location:** [main.js:127-243](main.js#L127-L243) (intro animation), [styles.css:107-211](styles.css#L107-L211) (character + icon CSS animations)
- **Category:** Accessibility
- **Impact:** OS-level reduce-motion preference is ignored. The intro animation runs in full — character-by-character reveal, icon orbit, mouse glide, click burst, circle wipe — for users with vestibular disorders, photosensitivity, or simply a preference for stillness. Also affects the scroll-reveal `.fade-in` / `.reveal` translateY animations on every page, custom cursor RAF, and the bike game canvas.
- **WCAG/Standard:** 2.3.3 Animation from Interactions (AAA) + general 2.3 Seizures principles
- **Recommendation:** Add at the top of `main.js` intro logic: `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { skipIntroAnimation(); return; }`. In CSS, wrap the keyframe-heavy rules in `@media (prefers-reduced-motion: no-preference)` blocks OR add a global override: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`. Also disable `nameIntro` entirely and skip to `triggerLoadAnimations()`.
- **Suggested command:** `/impeccable harden main.js styles.css`

#### [P0] Ghost case study hero is static while homepage bento is video
- **Location:** [work/ghost.html:76](work/ghost.html#L76) (`<img src="../img/ghost/hero.png">`) vs [work/ghost.html:118-127](work/ghost.html#L118-L127) (`ghost-demo.mp4` exists in the body)
- **Category:** Anti-Pattern (Case Study Opener Standing Rule §2 from CLAUDE.md)
- **Impact:** A video exists for Ghost and is shown elsewhere on the same page. Putting a still on the hero when the loop exists costs ~50% of the artifact's communicative bandwidth in the most-viewed position. This is EXACTLY the regression Pulse's 2026-05-06 restructure fixed; Ghost still has the pre-fix shape.
- **Recommendation:** Swap the hero to `ghost-demo.mp4` with poster `ghost-demo-poster.jpg`. Apply the canonical 7-attribute video pattern. Audit the body for the duplicate `ghost-demo.mp4` (it appears at line 118 — remove or replace with a different artifact like process-02/03 once the hero takes the slider clip).
- **Suggested command:** `/impeccable craft work/ghost.html` "swap hero to video"

---

### P1 — Major (fix before release)

#### [P1] Hero subtitle is the most LLM-flavored sentence on the site
- **Location:** [index.html:157](index.html#L157)
- **Current:** *"Based in San Jose. Most recently shipped a design-to-code token pipeline at LexisNexis Risk Solutions. Currently designing AI-native products end-to-end."*
- **Problem:** "AI-native" + "end-to-end" in one sentence is two empty buzzphrases. "Currently designing X products end-to-end" is structurally indistinguishable from a thousand LinkedIn About sections. The first 8 words ("Based in San Jose. Most recently shipped...") are excellent — concrete location + concrete verb + named outcome. The last sentence undoes that signal.
- **Fix:** *"Based in San Jose. Most recently shipped a design-to-code token pipeline at LexisNexis Risk Solutions. Now designing Pulse and Ghost — two concept tools for designers."* (Names the projects shown two scrolls below, creates a forward hook into the bento grid.)
- **Suggested command:** `/impeccable clarify index.html`

#### [P1] "the prototypes in between" — vague filler in hero h1
- **Location:** [index.html:156](index.html#L156)
- **Current:** *"Product designer who ships systems, products, and the prototypes in between."*
- **Problem:** "Systems, products, and the prototypes in between" tries to claim three things and lands on one specific thing (systems), one generic thing (products), and one literal void ("in between"). The h1 is the single most important sentence on the site; it can't carry filler.
- **Fix options:**
  - *"Product designer who ships infrastructure other designers use."* (sharp, owns the LexisNexis story)
  - *"Product designer who builds the tools, the system, and the thing you ship with both."* (rhythmic; weaker)
  - *"Product designer. Recently: a token pipeline at LexisNexis. Now: Pulse and Ghost."* (radical — sets up the bento)
- **Suggested command:** `/impeccable clarify index.html`

#### [P1] Identical card grid — About "Currently Building"
- **Location:** [about.html:101-145](about.html#L101-L145)
- **Problem:** Three cards, same dimensions, same internal layout (image → title → paragraph). Impeccable's shared law §Absolute Bans includes "**Identical card grids.** Same-sized cards with icon + heading + text, repeated endlessly." This is three not endless, but it's the pattern.
- **Fix:** Vary the sizes (bento-style — one 1.5fr, two 1fr) OR vary the inner composition (e.g., one card is just a tall photograph of you with Bear, one is a video, one is a text-heavy quote). The point is rhythm, not three rectangles in a row.
- **Suggested command:** `/impeccable layout about.html`

#### [P1] LexisNexis case study is the lead project, but only static images
- **Location:** [work/lexisnexis.html](work/lexisnexis.html)
- **Problem:** The LexisNexis case is the biggest bento card on the homepage and the strongest narrative ("full day → 30 seconds"). But every single image in the case is a static screenshot — Dovetail snapshots, a Figma variables panel, a color palette reference, a prototype still. The SUBJECT of the case is a pipeline that runs in 30 seconds — there is no video of the pipeline running. The case underspends its own thesis.
- **Fix:** Record one ~5–10s screen capture of a palette swap in Figma → JSON export → Storybook re-render. That clip belongs either at the top (replace the static hero) or as the Outcome's footer image where `footer_apr23.png` currently sits. Without it, the case relies entirely on the metric to carry the story.
- **Suggested command:** `/impeccable bolder work/lexisnexis.html`

#### [P1] Pulse "Live prototype (coming soon)" link
- **Location:** [work/pulse.html:191](work/pulse.html#L191)
- **Current:** *`<a href="https://pulse.rotemgotlieb.com" class="cta-link">Live prototype →</a> (coming soon)`*
- **Problem:** A prominent CTA-styled link to a URL that doesn't exist yet, with "(coming soon)" tacked on in muted text. For a recruiter, this signals "I claim a live prototype but you can't see it" — which reads worse than not mentioning a live prototype at all. The case study is otherwise rich enough to stand on its own.
- **Fix:** Either ship `pulse.rotemgotlieb.com` before the recruiter review next week, OR remove the line entirely until it's real, OR replace with a static link to a Figma prototype URL if one exists.
- **Suggested command:** `/impeccable clarify work/pulse.html`

#### [P1] Pulse Outcome opens with a hero-metric template
- **Location:** [work/pulse.html:187](work/pulse.html#L187)
- **Problem:** `<strong>17 issues authored across five pages. 32 components tracked. Six procedural wireframes rendered in code. Four heatmap layers. Twelve build phases on a single branch in a focused day, on top of six weeks of part-time work.</strong>` — a bolded multi-metric run-on. This is the SaaS-cliché Impeccable's absolute bans call out by name. The metrics are also meta-craft ("issues authored") rather than user impact, which is appropriate for a concept project but doesn't earn the bolded-six-stats treatment.
- **Fix:** Pick ONE proof-of-depth metric (the six procedural wireframes is the most interesting one) and lose the rest into prose. *"Six procedural wireframes rendered in code, four heatmap layers, twelve build phases — six weeks part-time plus one focused day."* Same content, different rhythm, no template smell.
- **Suggested command:** `/impeccable quieter work/pulse.html`

#### [P1] Both Pulse and Ghost end with identical "Built with:" coda
- **Location:** [work/pulse.html:190](work/pulse.html#L190) + [work/ghost.html:183](work/ghost.html#L183)
- **Pulse:** *"**Built with:** Figma, Next.js 14, TypeScript, Tailwind v4, Framer Motion."*
- **Ghost:** *"**Built with:** Figma, Next.js 14, Tailwind, Recharts, Framer Motion, Lucide React."*
- **Problem:** Same template, same word, same position in the outcome. Reads as auto-generated. If a recruiter reads both cases in sequence, the second one signals "this is filled in from a snippet" — which hurts both.
- **Fix:** Vary the surface entirely. Pulse can end on the strategic argument (already strong: "Pulse names its competitors"); Ghost can end on the lesson ("Three pivots taught me the signature interaction should have been first"). Move the tech-stack list to the metadata grid at the top, or to a tiny aside in a smaller type style.
- **Suggested command:** `/impeccable layout work/pulse.html work/ghost.html`

#### [P1] Both Pulse and Ghost use "X pivots made it what it is" framing
- **Location:** [work/pulse.html:171](work/pulse.html#L171) + [work/ghost.html:158](work/ghost.html#L158)
- **Problem:** Identical rhetorical move for the Process section of two consecutive concept projects. "Two more pivots got it the rest of the way" / "Three pivots made Ghost what it is" — the structural skeleton (count + pivots + bold lead sentences for each) is the same in both cases. The Pulse V1/V2 diptych is unique to Pulse; rebuild Ghost's process around a different shape.
- **Fix:** Reshape Ghost's Design Process section around (a) the moment the slider moved from buried feature to hero — which IS a single inflection, not three pivots — OR (b) a chronological build log (week 1, week 3, week 5) — OR (c) what I removed (predictive scanning, mobile, real Figma integration — same as Pulse's deliberate non-build choices).
- **Suggested command:** `/impeccable craft work/ghost.html`

#### [P1] GoteFigure case study uses two image folders
- **Location:** [work/gotefigure.html](work/gotefigure.html) — hero uses `../images/gotefigure/hero.jpg` (line 73), Overview uses `../img/gotefigure/gotefigure_overviewv3.jpg` (line 107)
- **Problem:** Both directories exist on disk (`images/gotefigure/` for the hero, sketch trio, product trio; `img/gotefigure/` for overview, thumbnail). Not broken, but the file taxonomy is split across two near-identical folder names for the same project. This is a future you-bug — a quick `find img/gotefigure -name "*"` won't surface the hero, and any future refactor that consolidates one folder will leave half the case study with broken paths.
- **Fix:** Consolidate to `img/gotefigure/` (matches every other case). Move the contents of `images/gotefigure/` into `img/gotefigure/`. Update all six paths in the case study HTML.
- **Suggested command:** Manual file move + `grep -rn "images/gotefigure"` to confirm zero remaining references.

#### [P1] Touch targets below WCAG 2.5.5 minimum (44×44)
- **Locations:**
  - [styles.css:402-403](styles.css#L402) — `.theme-toggle` is 32×32px
  - [styles.css:1812-1813](styles.css#L1812) — `.resume-modal-pdfjs-btn` is 28×28px
- **WCAG/Standard:** 2.5.5 Target Size (Enhanced) AAA, 2.5.8 Target Size (Minimum) AA — 24×24 is the Level AA floor; 44×44 is AAA. Apple HIG and Material both say 44–48. The theme toggle passes 24×24 AA but fails AAA and fails the platform conventions.
- **Recommendation:** Bump `.theme-toggle` to 40×40 desktop / 44×44 mobile. Bump `.resume-modal-pdfjs-btn` to 40×40 with extra hit-area padding. Already fixed on `.resume-modal-close` mobile.
- **Suggested command:** `/impeccable harden styles.css`

#### [P1] Nav links font-size 12px on mobile
- **Location:** [styles.css:1423](styles.css#L1423)
- **Problem:** `.nav-links a { font-size: 12px }` at `≤767px`. 12px is below the WCAG 1.4.4 readability threshold for most users; iOS Human Interface Guidelines recommend 17pt as the minimum body text. With 16px gap, the four-link nav (Work, Process, About, Contact) plus the 14px logo and 32px toggle compete for ~280px of usable nav real-estate.
- **Recommendation:** Either (a) bump to 13–14px and accept the wrap, (b) collapse to a hamburger on mobile, (c) drop one link (Process is the weakest — see Critique notes below).
- **Suggested command:** `/impeccable adapt index.html styles.css`

---

### P2 — Minor (fix in next pass)

#### [P2] Inline `<style>` block duplicated across 8 HTML files
- **Location:** Every HTML file, e.g. [index.html:20](index.html#L20)
- **Current:** `<style>.page-transition.active{position:fixed;inset:0;background:#FAFAF8;z-index:9998;opacity:1;}.name-intro{position:fixed;inset:0;background:#FAFAF8;z-index:10000;}</style>` — repeated.
- **Problem:** Hardcoded `#FAFAF8` in inline style. If the bg-primary token ever changes, these 8 inlines silently drift. Also a duplicated cache surface (eight copies of the same bytes).
- **Fix:** Move into `styles.css` (the cascade order is fine — the inline existed to prevent FOUC on page-transition; the `?v=25` cache-bust means styles.css ships with the new rules instantly anyway). If you keep it inline for FOUC reasons, comment-document why on every file.

#### [P2] Inline `style="object-position: center bottom"` and `style="object-position: center 15%"` on imgs
- **Locations:** [index.html:169](index.html#L169) (`thumb-lexisnexis` img), [work/lexisnexis.html:75](work/lexisnexis.html#L75) (hero), [work/gotefigure.html:107](work/gotefigure.html#L107), three more in gotefigure trio.
- **Problem:** Per-image positioning bypasses the design-token / class system. Hard to grep, hard to change, easy to forget when swapping an image.
- **Fix:** Either (a) crop the source images to land correctly with the default `object-position: center` rule, OR (b) introduce semantic classes (`.img-anchor-bottom`, `.img-anchor-top-15`). The latter is heavier than the problem deserves; the former is the right call for 5 instances.

#### [P2] Bento-card-thumb background colors hardcoded in light AND dark
- **Locations:** [styles.css:626-629](styles.css#L626-L629) (light: `#E8EDF2` for lexisnexis, etc.) and [styles.css:45-48](styles.css#L45-L48) (dark overrides)
- **Problem:** Eight hardcoded hex values outside the token system. They function as project identity colors but live as literals.
- **Fix:** Introduce `--thumb-lexisnexis-bg`, `--thumb-pulse-bg`, etc. in `:root` and `[data-theme="dark"]`. Three lines of token, four lines saved on the override block.

#### [P2] Per-case scroll-progress background hardcoded inline
- **Location:** [work/lexisnexis.html:30](work/lexisnexis.html#L30) (`style="background:#C8D4E0"`), pulse `#4A90D9`, ghost `#7B61D9`, gotefigure `#DED8CE`
- **Problem:** Same as above. The per-case progress-bar color is part of the project identity but lives as a literal inline.
- **Fix:** Move to a CSS variable on the body or `.case-layout`: `--case-accent: #4A90D9`. Then `.scroll-progress { background: var(--case-accent); }`.

#### [P2] LexisNexis Other Work uses static `<img>` while homepage bento for the same case is also `<img>` — fine for Lexis, but a hidden footgun
- **Location:** [work/pulse.html:198-199](work/pulse.html#L198-L199), [work/ghost.html:190-191](work/ghost.html#L190-L191), [work/gotefigure.html:160-161](work/gotefigure.html#L160-L161)
- **Status:** Currently symmetric (homepage Lexis bento is `<img>`, so all Lexis Other Work cards are `<img>`). PASSES the Cross-Surface Thumbnail Consistency Rule from CLAUDE.md today.
- **Risk:** If the homepage Lexis card is upgraded to video (recommended in the P1 entry above), all three Other Work blocks need to be updated in lockstep. The current state is correct but fragile.

#### [P2] `metadata-grid` uses `<div>` per cell when `<dl>` is semantically correct
- **Location:** [work/*.html](work/lexisnexis.html#L81) (every case study)
- **Problem:** Role/Timeline/Team/Tools are literally a definition list. The current markup is `<div class="metadata-item"><span class="metadata-label">Role</span><span class="metadata-value">...</span></div>`. Screen readers don't recognize the label/value pairing.
- **Fix:** Convert to `<dl class="metadata-grid"><dt>Role</dt><dd>Product Designer</dd>...</dl>`. The about-skills section already uses `<dl>` correctly ([about.html:157-175](about.html#L157)) — match that pattern.

#### [P2] Bike game canvas marked `role="img"` but is interactive
- **Location:** [index.html:240](index.html#L240) and every other page with footer
- **Problem:** `<canvas role="img" aria-label="Decorative pixel-art mountain biking game. Press space or click to play.">` — `role="img"` tells AT it's an image. The aria-label says "press space or click to play." Contradictory: an image is not interactive. If a keyboard user lands on it, what happens?
- **Fix:** Either (a) commit to it being decorative — drop the keyboard-play affordance from the label and add `aria-hidden="true"` and `tabindex="-1"`, OR (b) commit to it being an interactive game — `role="application"`, focus management, an accessible "skip game" link, and explicit keyboard instructions in a visually-hidden label. Option (a) is the lower-effort and arguably correct choice — the game is a delight detail, not part of the portfolio's content.

#### [P2] `font-family: 'Satoshi', sans-serif` — fallback stack is one word
- **Location:** [styles.css:58](styles.css#L58)
- **Problem:** If Fontshare CDN fails or is blocked, the entire site falls to the OS default `sans-serif`. On macOS that's Helvetica; on Windows that's Arial; on Android that's Roboto. CLAUDE.md explicitly bans those. The fallback contradicts the brand rules.
- **Fix:** `font-family: 'Satoshi', -apple-system, 'Inter', 'Segoe UI', system-ui, sans-serif;` — still imperfect (CLAUDE.md bans Inter and system fonts too) but at least chooses the best available. Better: self-host Satoshi from `/fonts/satoshi-*.woff2` to remove the Fontshare dependency entirely. ~80 KB total for the four weights.

#### [P2] Fontshare `@import` blocks CSS parse
- **Location:** [styles.css:6](styles.css#L6)
- **Problem:** `@import url('https://api.fontshare.com/v2/css?f[]=satoshi@...')` at the top of styles.css forces the browser to fetch the remote CSS before continuing to parse the local stylesheet. Render-blocking.
- **Fix:** Replace with `<link rel="preload" as="font" href="..." crossorigin>` in the HTML `<head>`, OR self-host (preferred — see above).

#### [P2] Custom cursor RAF runs perpetually
- **Location:** [main.js:436-441](main.js#L436-L441)
- **Problem:** The `animate()` IIFE calls `requestAnimationFrame(animate)` unconditionally for the life of the page. Even when the page is in a background tab or the mouse hasn't moved in 5 minutes, the RAF runs (~60 fps × 86,400 s/day = 5.2M frames/day idle). Battery cost.
- **Fix:** Idle-pause. On `mousemove`, set a timestamp; in the RAF loop, if `Date.now() - lastMove > 100ms` AND `mouseX/Y === cursorX/Y` (within 0.5px), skip the next RAF and bind a `mousemove` one-shot listener to wake it back up. Standard idle-RAF pattern.

#### [P2] Scrollspy uses scroll listener instead of IntersectionObserver
- **Location:** [main.js:347-368](main.js#L347-L368)
- **Problem:** `window.addEventListener('scroll', updateActiveLink)` recomputes `offsetTop` for every section on every scroll tick (passive listener but still runs the loop). Two case studies have 6-7 sections; not catastrophic but inefficient and a known antipattern.
- **Fix:** Convert to `new IntersectionObserver(callback, { rootMargin: '-150px 0px -50% 0px' })`. Cleaner code, no recomputation.

#### [P2] Skills `<dl>` uses fixed `140px` first column on desktop
- **Location:** [styles.css:1359-1364](styles.css#L1359-L1364)
- **Problem:** `grid-template-columns: 140px 1fr;` forces "AI Workflow" (the longest label) to wrap on the desktop view. Counts as a content-layout collision.
- **Fix:** `grid-template-columns: minmax(140px, max-content) 1fr;` — column grows to fit the longest label.

#### [P2] Resume modal `aria-hidden="true"` not paired with `inert`
- **Location:** [index.html:259](index.html#L259)
- **Problem:** When the modal is closed, `aria-hidden="true"` correctly hides it from AT, but the focusable elements inside (PDF nav buttons, close button) are still in the tab order. A keyboard user tabbing through the homepage will hit them in a hidden state.
- **Fix:** Add `inert` attribute alongside `aria-hidden` (modern browsers; Safari 15.5+). Or `tabindex="-1"` on every focusable inside the modal when closed, toggled with JS on open.

#### [P2] Inline `<script>` for theme detection lacks CSP nonce or hash
- **Location:** [index.html:23](index.html#L23) and 7 other files — `<script>(function(){if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');})();</script>`
- **Problem:** When/if you add a CSP, this inline script will be blocked. The "no FOUC" justification is correct, but the implementation will need a nonce. Not a bug today; a tripwire for the future.
- **Fix:** When CSP gets added, generate a nonce per response (or hash this script and add to `script-src`). Document the requirement in CLAUDE.md.

#### [P2] PDF.js loaded from cdnjs at first modal open
- **Location:** [main.js:497-499](main.js#L497-L499)
- **Problem:** First click on "View resume" → script tag injected → fetch ~300 KB PDF.js → parse → render. Latency ~600 ms on a fast connection, several seconds on cellular. Visible spinner (`Loading…`) helps but the UX is async.
- **Fix:** Either (a) preload PDF.js on `requestIdleCallback` after the page settles, (b) self-host it, OR (c) accept the latency as an acceptable trade-off for keeping the homepage payload light. Option (a) is the typical answer.

#### [P2] `<body class="cursor-active">` applied via JS at parse but cursor not yet rendered
- **Location:** [main.js:426](main.js#L426)
- **Problem:** Body gets `cursor: none` (via `body.cursor-active a, button, etc.`) before the custom-cursor element is appended. ~30 ms gap on slow devices where the system cursor is hidden and the custom cursor doesn't yet exist. Tiny UX glitch.
- **Fix:** Append the cursor element FIRST, then `body.classList.add('cursor-active')`. Already mostly ordered correctly; the cursor `appendChild` is the previous line ([main.js:425](main.js#L425)) so this is probably fine on real hardware. Verify on a Throttled CPU 6× run.

#### [P2] Case study `<style>` block missing `.name-intro` rule, but file still references the class indirectly
- **Location:** [work/lexisnexis.html:20](work/lexisnexis.html#L20) (and 3 others) — only `.page-transition.active`, no `.name-intro`. This is correct because case studies don't have the intro element. Not a bug. Listed for documentation.

---

### P3 — Polish (nice-to-fix)

#### [P3] `.name-line-first .name-char` font-size: 128px is hardcoded
- **Location:** [styles.css:111](styles.css#L111). Use a CSS var to share between desktop and the `clamp()` mobile override.

#### [P3] Theme toggle `transform: rotate(15deg)` on hover is unmotivated
- **Location:** [styles.css:418](styles.css#L418). Rotating the icon on hover is a frequently-used motion-design cliché. The site otherwise has restrained hover states. Consider just a `color` transition.

#### [P3] `.intro-icon { will-change: transform, opacity }` declared but only transform animates in the keyframes
- **Location:** [styles.css:167](styles.css#L167). Opacity is set discretely, not animated. Remove `opacity` from `will-change` — slight memory savings.

#### [P3] `nav.scrolled` blur + background swap is two transitions in one — could be a single backdrop-filter
- **Location:** [styles.css:368, 372-375](styles.css#L368). Minor.

#### [P3] `.bento-card:hover { opacity: 1 }` overrides the global `a:hover { opacity: 0.7 }`
- **Location:** [styles.css:60, 553](styles.css#L553). Works, but the global rule is fighting the local rule. Consider: drop the global `a:hover { opacity: 0.7 }` and apply it explicitly where wanted (text links, sidebar). The global is currently leaking into bento cards, footer cards, and would silently affect any future card surface.

#### [P3] Footer quote `"Design infrastructure is leverage."` uses straight quotes
- **Location:** [index.html:245](index.html#L245) and 7 other files. Curly quotes (`"`/`"`) are typographically correct.

#### [P3] `.experience-item:last-child { border-bottom }` — solo rule
- **Location:** [styles.css:1224](styles.css#L1224). Could be one rule using `:not(:first-child)` for top borders and a single `:last-child` bottom. Just a small consolidation.

#### [P3] About page experience list lacks dates as semantic `<time>`
- **Location:** [about.html:185](about.html#L185) etc. `<p class="experience-dates">December 2024 – July 2025</p>` should be `<time datetime="2024-12">December 2024</time> – <time datetime="2025-07">July 2025</time>`. SEO + AT signal.

#### [P3] og:image at `/og-image.png` is a single static asset for all 5 pages
- **Location:** Every HTML head. Twitter / LinkedIn / Slack previews of `pulse.html` show the homepage hero, not the case study. Per-case og images would meaningfully improve shared-link CTR.

---

## Patterns & Systemic Issues

1. **Token system underused at the seams.** The CSS variables cover ~85% of the site cleanly but leak literal hexes at the boundaries: page-transition inline styles, scroll-progress per-case backgrounds, dark-mode thumbnail overrides, inline `object-position` on imgs. Pattern: any "this is decorative per-page state" lands as a literal. Fix: a `--case-accent` and `--thumb-bg-*` token family. Cost: ~15 lines of CSS, removes ~30 inline literals.
2. **AT contracts broken at modal boundaries.** Two modals on the site; one's `aria-labelledby` resolves (resume), one's doesn't (image — 4 case studies). Pattern: copy-paste of modal markup without re-pointing IDs.
3. **Concept-project case studies converge to the same skeleton.** Pulse and Ghost share: video hero (Ghost should), three-pivot framing, "Built with:" coda, "What I'd do differently" trope. The LexisNexis case (a real shipped project) and GoteFigure case (a personal brand) each have their own shape — but Pulse + Ghost echo each other. For a recruiter reading top-to-bottom, the third one read in sequence will feel templated.
4. **Touch-target discipline is inconsistent.** Theme toggle 32×32, nav links 12px font, PDF.js controls 28×28 are all below platform conventions, but the mobile resume close button is exactly 44×44. Whoever wrote the second one knew the rule.
5. **The intro animation is the load-bearing differentiator AND the load-bearing friction.** 3 seconds of animated craft on first visit + every refresh. Hits hard the first time, less so the second; for users with motion sensitivity it's a hard exit. The `prefers-reduced-motion` gap is the single biggest accessibility regression of the site precisely because the rest is so careful.

---

## Positive Findings (don't lose these)

- **The intro animation is genuinely original.** Character reveal + tool-icon orbit + cursor glide + click burst + circle wipe in 3 seconds is several layers above what a portfolio template would do. The CLAUDE.md technical rules (CSS custom props for icon positions, JS rAF for cursor glide, no `getBoundingClientRect()` on animated elements) reflect the kind of disciplined thinking that produces craft.
- **Six layers of iOS Safari autoplay handling.** Documented in CLAUDE.md, implemented in the codebase. The fact that this site renders muted-autoplay video reliably on iOS is non-trivial; most portfolios fail this silently.
- **`:has(video)` reveal exemption.** [styles.css:477](styles.css#L477) — a one-line fix that solves the cascaded-opacity autoplay trap. Sharp.
- **Mobile bento reorder via `display: contents`.** [styles.css:1437-1445](styles.css#L1437-L1445) — clever, idiomatic CSS.
- **Skip link present and styled.** [styles.css:1523-1538](styles.css#L1523-L1538). Standard but often forgotten.
- **Focus-visible outlines token-aware.** [styles.css:1540-1547](styles.css#L1540-L1547). Light + dark.
- **PDF.js viewer ships with mobile fallback.** [main.js:534-539](main.js#L534) + [styles.css:1833-1842](styles.css#L1833). Acknowledges that 200 KB PDF on mobile is a worse UX than "Tap to download."
- **The LexisNexis "I was bad at this at first" paragraph.** [work/lexisnexis.html:127](work/lexisnexis.html#L127) — concrete admission of a skill gap, followed by what fixed it (an hour with a senior researcher), followed by the specific behavior change ("By the third round I was tagging in real time"). This is the single best paragraph on the site. Senior hiring is gated on this kind of self-awareness.
- **The Pulse "competent and forgettable" paragraph.** [work/pulse.html:163](work/pulse.html#L163) — owning the V1 was a misfire is exactly what a senior portfolio needs. The honesty is the asset.
- **Bento layout is asymmetric, not 2×2.** [styles.css:636-645](styles.css#L636) — 1.35fr / 1fr alternating. Avoids the "identical card grid" trap by ~15% on each cell.
- **CLAUDE.md is a model of project memory.** The Mobile Video Standing Rule + Recurring Bug Rule + JS-State Classes Standing Rule + Case Study Opener Standing Rule + Cross-Surface Thumbnail Consistency Rule together describe how to fail-fast on iOS Safari autoplay. This is craft documentation, not just code documentation.

---

# PART 2 — CRITIQUE: Homepage (https://rotemgotlieb.com)

## Heuristic Scores

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Page transition overlay is the only loading affordance; scroll position is shown on case studies but not on the homepage. |
| 2 | Match System / Real World | 3 | "Selected Work" is unambiguous; "AI-native" is jargon. |
| 3 | User Control and Freedom | 2 | Intro animation cannot be skipped (no escape key handler, no skip button, no reduced-motion path). |
| 4 | Consistency and Standards | 3 | Bento card layout consistent; em-dash use consistent; project label lowercase consistent. |
| 5 | Error Prevention | n/a | Static portfolio; nothing to prevent. |
| 6 | Recognition Rather Than Recall | 4 | Project labels include year + context, descriptions are concrete. Recruiter can read in one pass without remembering anything. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; theme toggle has no keyboard activation hint. Power-user recruiter has no shortcut to skip intro or jump to case studies. |
| 8 | Aesthetic and Minimalist Design | 4 | Restrained monochrome shell with project color as the variable. Generous negative space. Strong. |
| 9 | Error Recovery | n/a | n/a — no destructive actions. |
| 10 | Help and Documentation | n/a | Portfolio doesn't need help text. |
| **Total (of applicable 7)** | | **21 / 28** | **Good — strong aesthetic, weak motion-discipline.** |

## Overall Impression

**Strong, with two specific copy lines that drag the first viewport down a notch.**

The page is well-composed: the typographic hierarchy (huge h1, supporting subtitle, micro-label "Selected Work", asymmetric bento) is editorial in the way the CLAUDE.md vision asks for. The intro animation is unique and not-AI. The bento grid balances thumbnail with text without resorting to the icon-headline-body card cliché. The footer game is a personality moment.

The two things that hurt the homepage:
1. **The h1 fizzles in its last clause.** "Product designer who ships systems, products, and the prototypes in between" — "the prototypes in between" is filler. The whole first viewport hinges on this sentence.
2. **"AI-native" appears in the subtitle.** It's the single weakest phrase on the page.

Both are 30-second fixes. Both would lift the page meaningfully.

## What's Working

- **Asymmetric bento with 16:9 uniform aspect ratio.** Solves the "all cards look the same" problem without breaking grid rhythm.
- **Project labels in lowercase + year.** *"lexisnexis risk solutions — 2024-2025"* reads as editorial caption, not corporate header. Adds personality without being precious.
- **Two-line "Currently designing" subtitle as warm-up before the bento.** The structure (where → recent → now) is the right shape.
- **Skip link + theme toggle present.** Both are above-the-fold accessibility wins.

## Priority Issues (homepage)

#### [P0] No skip-intro affordance
- **What:** The intro animation runs ~3 seconds on every refresh + first visit, no Escape key, no skip button.
- **Why it matters:** Recruiter on second visit sees the same animation. Reduced-motion user sees the full ride. Anyone who hits refresh because they expected the page to be cached gets locked out for 3 seconds.
- **Fix:** Add `Escape` key listener that calls `skipIntroAnimation()`; add a tiny "skip" link bottom-right of the intro screen (visible after 500 ms); respect `prefers-reduced-motion`.
- **Suggested command:** `/impeccable harden main.js`

#### [P1] Hero h1 last clause is filler
- **What:** "and the prototypes in between" claims nothing specific.
- **Fix:** See P1 entry above. Best option: kill the third clause entirely. "Product designer who ships systems and products." (still weak — "systems and products" is everything a product designer does). Better: replace with the LexisNexis hook in the h1 itself. *"Product designer who ships infrastructure other designers use."*

#### [P1] "AI-native ... end-to-end" subtitle
- **Fix:** See P1 entry above.

#### [P2] Section label "Selected Work" lives just above the bento
- **What:** Standard caption. Works, but unmemorable. A more confident move would be a one-line editorial caption ("Four projects. Two shipped, two concept.") OR a fading horizontal rule.
- **Fix:** Optional. Don't over-engineer if it works.

#### [P2] Project descriptions vary in voice
- *"Shipped the Figma-to-Storybook token pipeline that took palette updates from a full day with three people down to thirty seconds with one designer."* (LexisNexis — past-tense, concrete metric)
- *"AI-native dashboard that X-rays live pages, pins issues to components, and explains them in designer vocabulary."* (Pulse — present-tense, abstract verbs)
- *"Illustrated apparel brand. 200+ pieces sold in Q1. Sketch to storefront in under three hours."* (GoteFigure — terse, three fragments)
- *"Drag-to-reveal scanner that compares Figma spec to production reality and surfaces every deviation visually."* (Ghost — present-tense, long descriptor sentence)
- **What:** Two different rhetorical patterns. LexisNexis + GoteFigure lead with action/outcome; Pulse + Ghost lead with description. Inconsistent voice on the most-scanned text on the homepage.
- **Fix:** Match Pulse + Ghost to the LexisNexis pattern. *"Built an AI-native heatmap that pins UX issues to components and reads them out in designer vocabulary."* / *"Built a drag-to-reveal scanner that surfaces every gap between Figma spec and production reality."*

## Persona Red Flags

**Hiring Manager (Senior Design role at top tech, 90 seconds before the bento):**
- 🟢 First 6 words of h1 land cleanly: "Product designer who ships systems."
- 🔴 Last 7 words of h1 fizzle: "the prototypes in between" — non-specific.
- 🔴 "AI-native ... end-to-end" subtitle reads as LinkedIn-About-section pad.
- 🟢 The LexisNexis bento is the lead and carries the hardest metric on the site.
- 🟡 Two of four projects are 2026 concepts — for a senior hire, the ratio of shipped:concept might raise an eyebrow.

**Engineer reviewing a cross-functional designer hire:**
- 🟢 Mention of Figma → JSON → Storybook in the LexisNexis card hits the engineering vocabulary correctly.
- 🟢 "Built every line" note in About + tech stack in Skills builds trust.
- 🟡 Bento includes only thumbnails; no architecture diagram visible from the homepage.

**Recruiter on mobile (likely):**
- 🟢 Bento stacks single-column with explicit mobile reorder. Solid.
- 🔴 Nav links 12px on mobile. Will struggle to tap.
- 🟡 Footer game canvas may scroll out of view fast on mobile; less of a personality moment than on desktop.

## Minor Observations
- "Currently designing AI-native products end-to-end" — when did "designing X end-to-end" become a job description? Whatever this means, it's the wrong sentence.
- Footer game on the homepage is a great signal of craft taste. Make sure it doesn't accidentally read as "this person has too much time on their hands" — frame it deliberately or trust the recruiter to read it as craft.
- "View resume (PDF) →" link below the subtitle competes with the bento for attention. Consider moving below the bento or styling smaller.

## Questions to Consider
- What if the first card in the bento WAS the LexisNexis case study video, autoplaying the pipeline in 5 seconds? You'd lose the homepage hero, but the strongest project would carry its own demo from the front door.
- Does the intro animation HAVE to play on refresh? CLAUDE.md says yes; a recruiter who refreshes (because something looked slow) is more annoyed than impressed the second time. Consider once-per-week localStorage gate (already in `main.js:75` — 604800000 ms = 7 days; this is correct), but the refresh-detection (`navEntry.type === 'reload'`) overrides the gate. Drop the refresh override.
- What if you replaced "Selected Work" with a single sentence: "Four projects — two shipped, two in concept, all with the same point of view."

---

# PART 3 — CRITIQUE: LexisNexis (https://rotemgotlieb.com/work/lexisnexis.html)

## Heuristic Scores

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Scroll progress bar present, sidebar scrollspy works. |
| 2 | Match System / Real World | 4 | "Custom Layouts," "ThreatMetrix," "Dovetail" — uses the real names. |
| 3 | User Control and Freedom | 3 | Sidebar nav, back-to-top, image expand on mobile. No way to skip to outcome. |
| 4 | Consistency and Standards | 4 | Section labels, h2 cadence, image rhythm match the other case studies. |
| 5 | Error Prevention | n/a | Static. |
| 6 | Recognition Rather Than Recall | 4 | "30 seconds" metric repeated 3 times. Reader carries it out. |
| 7 | Flexibility and Efficiency | 3 | Sidebar scrollspy is the only shortcut. |
| 8 | Aesthetic and Minimalist Design | 3 | Static images only. The pipeline that runs in 30 seconds doesn't run in any media on the page. |
| 9 | Error Recovery | n/a | n/a |
| 10 | Help and Documentation | n/a | n/a |
| **Total (of applicable 7)** | | **24 / 28** | **Strong — best-written case study, weakest visually.** |

## Overall Impression

**The best-written case study on the site. The most under-visualized.**

The LexisNexis story is the load-bearing one. It's the only case where Rotem ships real infrastructure that other people use, and the metric ("full day → 30 seconds") is the cleanest causal claim on the entire portfolio. The narrative is well-shaped: problem (two design systems, no shared language) → research (eight interviews, the "I was bad at this at first" beat) → prototyping (three rounds in two weeks) → token pipeline → outcome.

The case underspends its own thesis visually. Every image is a static screenshot — Dovetail snapshots, a Figma variables panel, a color palette. The thing that makes the case singular — the pipeline running in 30 seconds — is never shown running. The hero is a before/after diagram (good) but it's static. The footer summary image is a similar before/after diagram (also static). For a case study that proves a craftsperson can ship velocity, there is no velocity on the page.

The "I was bad at this at first" paragraph is the single best moment on the entire portfolio. Keep it. Make it earlier or louder if anything.

## What's Working

- **"Two design systems. Zero shared language."** Best h2 on the site. Sets the stakes in 6 words.
- **The metric repeats three times** (Overview, Outcome, footer caption) without feeling redundant — each repetition adds the supporting detail (3 people, 1 designer, 30 seconds, 180+ tokens, etc.).
- **The "I was bad at this at first" paragraph.** Vulnerable + specific + ends with a concrete behavior change ("By the third round I was tagging in real time. The second draft was a different document"). This is what senior portfolios need.
- **Phase 1/2/3 structure** matches the chronological work without feeling formulaic.
- **Outcome bullets use bold + prose, not a metric card grid.** Restrained.
- **The "design infrastructure is leverage" coda** is earned by the body and doesn't read as a slogan.

## Priority Issues (LexisNexis)

#### [P1] No video of the pipeline running
- **What:** The case study's central claim is "30 seconds." The page never shows 30 seconds.
- **Fix:** Record a single 5–8 second screen capture: palette swap in Figma → JSON export → Storybook re-render. Drop it as the hero (replacing `hero_apr23.png`) OR as a single video block in Phase 3.
- **Suggested command:** `/impeccable bolder work/lexisnexis.html`

#### [P2] Phase 3 (Token Pipeline) has zero images of the actual code/JSON
- **What:** The section is the technical centerpiece of the case. The reader's mental model needs at least one glimpse of a token JSON file, the parse script, or a diff of "before naming" vs "after naming."
- **Fix:** Add one stylized code-snippet image (Carbon, Ray.so) showing 3-4 token entries with the semantic alias scheme. Counts as proof of depth.

#### [P2] "Two design systems" claim could be visualized
- **What:** The body says "Risk Narrative" and "ThreatMetrix" maintain separate Figma systems. There's no image showing the BEFORE state (two divergent palettes).
- **Fix:** Optional. A simple side-by-side of the two pre-token palettes would land. If not available, skip.

#### [P3] Other Work card for Pulse is a video, for Lexis it's the source (no card) — symmetric. PASS.

#### [P3] "Eight interviews that rewrote the roadmap" — could the page surface a single sample quote from one of the eight?
- **What:** The reader hears about eight interviews but doesn't hear from any of them. One pull-quote (anonymized) — *"I have four tabs open just so I can see what I need."* — would let the analyst's voice into the case.
- **Fix:** Add one styled blockquote in Phase 1, between the two paragraphs.

## Persona Red Flags

**Hiring Manager (Senior Design role):**
- 🟢 Metric carries the case.
- 🟢 Self-awareness paragraph builds trust.
- 🟡 Static images only — for a case study about velocity, no velocity is shown.

**Design System Lead:**
- 🟢 "180+ WCAG-tested tokens" + "semantic aliases" + "JSON export schema" → speaks the language.
- 🟢 "Each WCAG-tested" — checks the right box.
- 🟡 The JSON schema is referenced but not shown. A 5-line snippet would close the gap.

**Engineer:**
- 🟢 "Worked with a UX engineer to define the JSON export schema" — credits the engineer correctly.
- 🟢 The "parsing script converts them into CSS files and JS config objects" sentence is technically specific.

## Minor Observations
- "Custom Layouts was on the roadmap as a response to friction analysts kept hitting" — first sentence of Phase 1 is grammatically dense. Consider: "Custom Layouts was on the roadmap as a response to friction analysts kept describing, but no one had grounded what 'custom' should mean."
- The hero image and footer image are both before/after pipeline diagrams. Slightly redundant. The footer summary could be a single "after" frame instead.

## Questions to Consider
- What if the case study OPENED on the 5-second pipeline video instead of the diagram?
- The "I was bad at this at first" paragraph is the single best thing on the site. What if it appeared in the homepage bento description instead of the case study body? — Probably not (too long for the card) but worth considering whether some version of "I was bad at this at first" can surface higher.

---

# PART 4 — CRITIQUE: Pulse (https://rotemgotlieb.com/work/pulse.html)

## Heuristic Scores

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Scroll progress + scrollspy good. |
| 2 | Match System / Real World | 4 | "Wireframe + heatmap + scrubber + AI prompt bar" — concrete to the surface. |
| 3 | User Control and Freedom | 3 | Same affordances as other cases. |
| 4 | Consistency and Standards | 4 | Matches other cases. |
| 5 | Error Prevention | n/a | |
| 6 | Recognition Rather Than Recall | 3 | "Living Observatory" is named but mentioned in dense sentences; reader may not retain the term. |
| 7 | Flexibility and Efficiency | 3 | Sidebar nav. |
| 8 | Aesthetic and Minimalist Design | 4 | Video hero is the strongest opener on the site. |
| 9 | Error Recovery | n/a | |
| 10 | Help and Documentation | n/a | |
| **Total (of applicable 7)** | | **24 / 28** | **Strong — well-structured concept case.** |

## Overall Impression

**The most ambitious case study and the most reflective. Also the most templated in spots.**

Pulse is the case that proves Rotem can do strategy as well as execution. It names its competitors (Hotjar, FullStory, Contentsquare). It maps to a real buyer (Director / VP of Design). It owns the V1 mistake and explains the rebuild. It ends with what to do differently.

The strongest moves: the "competent and forgettable" caption pair under the V1/V2 diptych. The Pivot section. The "I'd mock the most ambitious interaction first" lesson.

The weaknesses: the Outcome opens with the hero-metric template (17 issues, 32 components, 6 wireframes, 4 layers, 12 phases — bolded run-on); the Live prototype link points at "coming soon"; the "Built with: Figma, Next.js 14..." coda is identical structure to Ghost's coda. These are template smells in an otherwise sharp case.

## What's Working

- **Video hero is the strongest opener on the site.** The Living Observatory clip with the AI fly-cursor is exactly what Case Study Opener §1 demands: first viewport shows the strongest single artifact.
- **The caption is 15 words on the dot.** [work/pulse.html:83](work/pulse.html#L83) — *"The Living Observatory — one canvas that fuses a wireframe, heatmap, time scrubber, and AI prompt bar."* — respects the 15-word ceiling.
- **"Designers ship components. Their tools report on pages."** Best h2 in this case. Sets the wedge in 8 words.
- **The V1/V2 diptych with "competent and forgettable" caption.** Reference-portfolio-tier move.
- **Naming the competitors.** Hotjar, FullStory, Contentsquare. Most concept-project case studies don't dare. This one does, and is sharper for it.
- **"What I'd do differently" is actually substantive** — *"I'd mock the most ambitious interaction first, not the most conventional one."* This is a real lesson.

## Priority Issues (Pulse)

#### [P1] Hero-metric template in Outcome
- See P1 entry in Part 1. Six bolded metrics + run-on.

#### [P1] "Live prototype (coming soon)"
- See P1 entry in Part 1.

#### [P1] "Built with:" coda identical to Ghost
- See P1 entry in Part 1.

#### [P2] Pulse Overview h2 restates the title
- **Location:** Title "Pulse — AI UX Intelligence Dashboard" + Overview h2 "A UX intelligence tool built for designers, not analysts."
- **Problem:** Mild restatement. The h2 IS adding something ("for designers, not analysts") but it's wearing the same words as the title.
- **Fix:** Reshape h2 to lead with the wedge — *"Built for designers, not analysts."* (5 words, no restatement).

#### [P2] Three pivots framing matches Ghost
- See P1 in Part 1.

#### [P3] The Insight section is the shortest section
- **Location:** [work/pulse.html:123-128](work/pulse.html#L123-L128) — three sentences. The other sections have 5–8.
- **Note:** This may be intentional (a single insight stated cleanly). Don't pad.

#### [P3] "Hotjar speaks in bounce rates. FullStory buries insights behind enterprise search. Contentsquare ties friction to revenue, not to the component that's broken."
- **Note:** Excellent paragraph. Worth promoting visually — maybe pull-quote treatment or a slightly larger type size.

## Persona Red Flags

**Hiring Manager (Senior Design role):**
- 🟢 Strong strategic argument.
- 🟢 V1/V2 self-critique is unusually candid.
- 🔴 "Live prototype (coming soon)" undermines the polish in the same section.

**Director / VP Design (the named buyer):**
- 🟢 Speaks the right vocabulary — components, design system anchoring, semantic aliases.
- 🟡 The argument ends with a metrics list rather than a strategic statement. The strategic argument (naming competitors, naming the buyer, naming what NOT to build) is the strongest part of the case but lives buried in the second-to-last paragraph.

**Designer reviewing:**
- 🟢 "Make the heatmap an interface, not a visualization" is a real insight that a working designer will quote.

## Minor Observations
- "predictive heatmaps, mobile responsive, real Figma integration" — the deliberately-out-of-scope list. Each is named like a feature, "mobile responsive" doesn't parse as a feature noun. Consider: "I deliberately scoped out predictive heatmaps, mobile responsiveness, and real Figma integration."
- "OKLab-interpolated thermal palette" → technical specificity. Good signal for engineering-adjacent recruiters.
- "Geist Mono headlines" → name a real font. Good.
- "Page X-Ray became Living Observatory — X-Ray is medical and passive; Observatory is exploratory and active. The naming change signaled the conceptual shift." → A strong meta-design move. Worth elevating.

## Questions to Consider
- What if the Outcome section opened on the strategic argument ("Pulse names its competitors") instead of the build metrics?
- The "Two more pivots" framing is the second occurrence of "X pivots." What if Pulse's Process section was just *"The pivot"* — single, named, defended?

---

# PART 5 — CRITIQUE: Ghost (https://rotemgotlieb.com/work/ghost.html)

## Heuristic Scores

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Scrollspy + progress. |
| 2 | Match System / Real World | 3 | "Drift," "deviation," "comparison slider" — anchored. |
| 3 | User Control and Freedom | 3 | Standard. |
| 4 | Consistency and Standards | 3 | Matches other cases, including the shape it shouldn't match (Pulse). |
| 5 | Error Prevention | n/a | |
| 6 | Recognition Rather Than Recall | 3 | "Comparison slider" repeats, sticks. |
| 7 | Flexibility and Efficiency | 3 | |
| 8 | Aesthetic and Minimalist Design | 2 | Static hero where video exists. **Regression from Pulse.** |
| 9 | Error Recovery | n/a | |
| 10 | Help and Documentation | n/a | |
| **Total (of applicable 7)** | | **20 / 28** | **Acceptable — same skeleton as Pulse, weaker hero choice, weaker prose.** |

## Overall Impression

**The case is real but reads as the second draft of Pulse.**

Ghost has a genuine product wedge (Figma spec ↔ production reality, drag-to-reveal comparison slider, detection-to-remediation), and its origin story (the half of LexisNexis that didn't get solved) is the most compelling framing in the case. But the case has the same structural skeleton as Pulse — overview → problem → insight → solution → design process → key decisions → outcome — and the same rhetorical moves ("Three pivots," "Built with:," "What I'd do differently").

Worse, the hero is static (`hero.png`) when `ghost-demo.mp4` exists in the body. This is the exact regression Case Study Opener §2 was written to prevent. The first viewport sells Ghost short.

## What's Working

- **Comparison slider as the signature interaction.** Concrete, demonstrable, memorable.
- **"Design systems break silently. Ghost makes the drift visible."** Strong opening h2.
- **The link to LexisNexis** — *"Ghost came out of a gap I hit indirectly at LexisNexis. The token pipeline we shipped there solved how tokens get defined — it didn't solve how to verify production actually uses them."* — ties the concept to the shipped work. The portfolio is stronger when cases reference each other.
- **WCAG integrated into the drift narrative.** Not a bolted-on a11y section; embedded. Right move.
- **"Detection-to-remediation" framing.** Specific. Different from generic "drift detection" framing.
- **Tone discipline** — "Deviation detected" not "violation found," "Recommendation available" not "fix required." Genuinely thoughtful UX-writing decision.

## Priority Issues (Ghost)

#### [P0] Hero is static; demo video exists
- See P0 in Part 1.

#### [P1] Three pivots framing duplicates Pulse
- See P1 in Part 1.

#### [P1] "Built with:" coda duplicates Pulse
- See P1 in Part 1.

#### [P2] Outcome section ends on a generic note
- **Current:** *"What I'd do differently. Start with the comparison slider on day one instead of building a monitoring dashboard first. Three pivots taught me that the signature interaction should have been the first thing I designed, not the third. Conventional is invisible."*
- **Problem:** The "conventional is invisible" line is good but generic. The Pulse version of this lesson is sharper ("mock the most ambitious interaction first, not the most conventional one") — Ghost's lesson is essentially the same lesson, said slightly weaker.
- **Fix:** Combine the LexisNexis-link (the case's origin story) with the lesson: *"If I built Ghost again, I'd start at the slider, not the dashboard — and I'd start it at LexisNexis, where the gap that opened Ghost actually lived."*

#### [P3] Four view modes named but only three shown visually
- **Note:** "Slider, Side-by-Side, Overlay, Timeline" are named in [work/ghost.html:148](work/ghost.html#L148) but only `process-02.png` through `process-05.png` are shown. Each mode could earn its own micro-thumbnail.

#### [P3] "21 components tracked, four view modes" in outcome
- **Note:** Smaller version of the hero-metric template that Pulse fails on. Doesn't feel template-y at Ghost's count but watch the pattern.

## Persona Red Flags

**Design System Lead:**
- 🟢 The detection-to-remediation framing is a real wedge against Chromatic / Percy / Applitools.
- 🟢 Naming the existing tools (Chromatic, Knapsack, Applitools, Zeroheight) is the move.
- 🟡 The "Apply Fix to Figma" flow is described but not demoed. A 5-second clip would land hard.

**Recruiter reading after Pulse:**
- 🔴 Same skeleton structure as Pulse. The case after the case I just read shouldn't share its shape.
- 🔴 Same "Built with:" closer. Reads as templated.

**Engineer:**
- 🟢 "Connecting to the Figma API, locating the component, updating the property" — specifies the technical path.
- 🟢 References real packages (Recharts, Framer Motion, Lucide React).

## Minor Observations
- "A developer hardcodes a padding value instead of using a token. A color shifts by one hex digit during a refactor. Border radius rounds down from 8px to 6px because someone eyeballed a Figma inspect." — strong concrete examples paragraph. Keep.
- "Clinical precision as the visual identity" → h2 for Key Decisions. Good named principle.
- "Designers check work by holding the spec next to the output." — h2 for The Insight. Excellent — observational, true, immediately usable.

## Questions to Consider
- What if Ghost's Process section was REORGANIZED around the LexisNexis link? *"I hit half this problem in production. Ghost is the other half."* — that origin story is the strongest framing in the case but lives in paragraph 2 of the Overview, not in the spine.
- What if the hero IS the comparison slider, interactively? Even a short autoplay loop showing the slider dragging would communicate the entire wedge in 3 seconds without a single word.

---

# PART 6 — CRITIQUE: GoteFigure (https://rotemgotlieb.com/work/gotefigure.html)

## Heuristic Scores

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | |
| 2 | Match System / Real World | 4 | Sketch → Wacom → Illustrator → product is the actual pipeline. |
| 3 | User Control and Freedom | 3 | |
| 4 | Consistency and Standards | 3 | Same case-study chrome; only 4 sections vs 6-7 elsewhere — could read as thin. |
| 5 | Error Prevention | n/a | |
| 6 | Recognition Rather Than Recall | 4 | "200+ pieces in Q1," "Sketch to listed product in three hours." Memorable. |
| 7 | Flexibility and Efficiency | 3 | |
| 8 | Aesthetic and Minimalist Design | 3 | All static images. Product photography is good but reads as catalog. |
| 9 | Error Recovery | n/a | |
| 10 | Help and Documentation | n/a | |
| **Total (of applicable 7)** | | **23 / 28** | **Good — distinct in tone, slightly thin in content depth.** |

## Overall Impression

**The most personal case study, and the right kind of thin.**

GoteFigure is the only case on the site that doesn't try to be a product-design case. It's a personal brand, framed as a personal brand. The "everything is a system waiting to be built" framing earns its place because the entire case is about applying design-system thinking to apparel — a sketch-to-listing pipeline, a seasonal palette template, a Shopify theme rebuilt for mobile-first commerce.

The 4-section structure (Overview, Brand System, Storefront, Outcome) is shorter than the 6-7 in the other cases, which feels appropriate — this isn't a research-driven case, it's a craft-driven case.

The risks: it's heavily text-to-image-ratio compared to the others; the storefront work is described but not interactively shown (no video of the actual checkout flow); the "200+ pieces sold in Q1" metric isn't anchored to a screenshot of a Shopify dashboard or a sales report. The case has to be taken on faith.

## What's Working

- **"Every design starts as a hand drawing."** Best h2 of the case. Three more words than necessary but worth them.
- **"From sketch to listed product in under three hours."** The pipeline metric that mirrors the LexisNexis metric (different scale, same shape of claim).
- **"Designed for how people actually shop on mobile."** Strong h2 — sets up the storefront choices.
- **The "no newsletter popup, no review widget, no upsell carousel" line.** Negative-space design discipline. Senior-design signal.
- **"Everything is a system waiting to be built — even the parts of work that don't look like product design."** Earned coda. The whole case justifies this sentence.

## Priority Issues (GoteFigure)

#### [P1] Two image folders (`images/` + `img/`)
- See P1 in Part 1.

#### [P2] No image of the actual Shopify analytics / sales dashboard
- **What:** "200+ pieces in Q1" is the only sales metric. Anchoring it to a screenshot would prove it without being braggy.
- **Fix:** Optional — sales screenshots can read tacky. Consider an Instagram engagement screenshot instead (followers, post engagement on a drop) — same proof, different surface.

#### [P2] Outcome paragraph foreshadows a relaunch that isn't shown
- **Current:** *"The relaunch will apply what I've learned at LexisNexis and on my own since: a real design system, proper component architecture, and a shopping experience that feels as considered as the illustrations on the garments."*
- **Problem:** The case ends on "what's next" rather than "what was." For a portfolio reviewer this reads as roadmap-not-shipped.
- **Fix:** Cut the relaunch sentence OR move it to a sub-paragraph and end on the systems lesson.

#### [P3] No video anywhere
- **Note:** Different in tone from Pulse/Ghost (which lean video-heavy). For a craft case about hand-drawn illustration, this is appropriate. But one 5-second timelapse of an Illustrator vectorize-from-sketch pass would be a strong inclusion in the Brand System section — and would link to the live GoteFigure YouTube channel (already on the About page).

#### [P3] "200+ pieces sold in Q1" — Q1 of which year?
- **Location:** [work/gotefigure.html:103](work/gotefigure.html#L103). Reader can infer "early in the 2020 launch" but the case doesn't say. Add the year inline: *"200+ pieces sold in Q1 2021."*

#### [P3] Brand System section names "type scale, seasonal color palette, templates for product mockups and social posts, standard photo setup" but shows none of them
- **What:** The sketch trio + collection grid covers the illustrations but not the brand system Rotem actually describes.
- **Fix:** One image of the seasonal palette or the social-template grid would let the brand system claim land. Optional.

## Persona Red Flags

**Hiring Manager (Senior Design at top tech):**
- 🟢 The Shopify case demonstrates breadth (commerce, photography, fulfillment).
- 🟡 The hand-drawn brand is the most outlier case on the site — for a senior product-design role, the question is whether the reader values the breadth or wishes the case were another product case.

**Brand / E-commerce / Founder-tier role:**
- 🟢 200+ pieces + 3-hour pipeline + mobile-first commerce → strong fit.
- 🟢 The "design system thinking applied to apparel" framing is the wedge.

**Designer reviewing the artist:**
- 🟢 The hand-drawn line work is good. Not great. The case doesn't oversell.
- 🟢 The Wacom → Illustrator → product workflow is the right level of specificity.

## Minor Observations
- "Hand-Drawn" is hyphenated; "Hand drawn" elsewhere in the body. Minor consistency.
- "Idea to listed product: under three hours" — same number ("three hours") as the section h2. The repetition lands because each version anchors a slightly different framing.
- The Outcome's "What a brand taught me about systems" h2 is a clever subversion — the rest of the site is "what systems taught me about brands," and this case inverts it.

## Questions to Consider
- What if GoteFigure was the FIRST case on the homepage instead of the last? It's the most personality-rich and the most outlier — leading with it would frame Rotem as a designer who can move across surfaces.
- What if the Outcome section ended on a single image — Rotem at the Wacom drawing, or the rabbit hoodie on someone outdoors — rather than text?

---

# PART 7 — Recommended Actions (priority order)

Based on the findings above, the order to fix issues for the **recruiter review next week** is:

## This Week (P0 + the highest-leverage P1)

1. **[P0] Add `prefers-reduced-motion` handling.** `/impeccable harden main.js styles.css`
2. **[P0] Fix `aria-labelledby="imageModalTitle"` on all 4 case study pages.** `/impeccable harden work/*.html`
3. **[P0] Bump `--text-muted` and `--text-faint` for WCAG AA.** `/impeccable harden styles.css`
4. **[P0] Swap Ghost hero from static `hero.png` to `ghost-demo.mp4`.** `/impeccable craft work/ghost.html`
5. **[P1] Rewrite the homepage hero subtitle. Kill "AI-native" and "end-to-end."** `/impeccable clarify index.html`
6. **[P1] Rewrite the homepage h1 last clause. Kill "the prototypes in between."** `/impeccable clarify index.html`
7. **[P1] Remove or ship the Pulse "Live prototype (coming soon)" link.** `/impeccable clarify work/pulse.html`
8. **[P1] Reshape Pulse Outcome to lose the hero-metric template.** `/impeccable quieter work/pulse.html`
9. **[P1] Differentiate Pulse's and Ghost's Outcome codas. Lose the duplicated "Built with:" pattern.** `/impeccable layout work/pulse.html work/ghost.html`
10. **[P1] Reshape Ghost's three-pivot section to not echo Pulse's.** `/impeccable craft work/ghost.html`

## Next (P1 + P2)

11. **[P1] Record one ~6-second LexisNexis pipeline video and use as hero.** `/impeccable bolder work/lexisnexis.html`
12. **[P1] Consolidate `images/gotefigure/` into `img/gotefigure/`.** Manual file move.
13. **[P1] Bump theme toggle to 40×40 (mobile 44×44).** `/impeccable adapt styles.css`
14. **[P1] Bump mobile nav links to 13–14px.** `/impeccable adapt styles.css`
15. **[P1] Address the "Currently Building" identical-card grid on About.** `/impeccable layout about.html`
16. **[P2] Move hardcoded thumb colors + scroll-progress colors to CSS variables.** `/impeccable harden styles.css`
17. **[P2] Convert `metadata-grid` to `<dl>` on all 4 case studies.** `/impeccable harden work/*.html`
18. **[P2] Decide bike-game canvas: decorative (`aria-hidden`) or interactive (`role="application"` + keyboard contract).** `/impeccable harden`

## Later (P2 + P3)

19. **[P2] Self-host Satoshi or preload it.** `/impeccable optimize styles.css`
20. **[P2] Idle-pause the custom cursor RAF.** `/impeccable optimize main.js`
21. **[P2] IntersectionObserver-ize scrollspy.** `/impeccable optimize main.js`
22. **[P3] Per-case `og:image`.** Manual or `/impeccable harden`.
23. **[P3] Curly quotes for the footer quote.** Trivial.
24. **[P3] `<time datetime="...">` for experience dates.** `/impeccable harden about.html`

## Final pass

25. **`/impeccable polish` across the site.** After fixes land.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `/impeccable audit https://rotemgotlieb.com` after fixes to see the score improve (target: 18+/20).

---

# Appendix A — Specific text edits, ready to paste

**index.html h1:**
- Current: *Product designer who ships systems, products, and the prototypes in between.*
- Proposed: *Product designer who ships infrastructure other designers use.*

**index.html subtitle:**
- Current: *Based in San Jose. Most recently shipped a design-to-code token pipeline at LexisNexis Risk Solutions. Currently designing AI-native products end-to-end.*
- Proposed: *Based in San Jose. Most recently shipped a design-to-code token pipeline at LexisNexis Risk Solutions. Now designing Pulse and Ghost — two concept tools for designers.*

**index.html Pulse card description:**
- Current: *AI-native dashboard that X-rays live pages, pins issues to components, and explains them in designer vocabulary.*
- Proposed: *Built an AI heatmap that pins UX issues to components and reads them out in designer vocabulary.*

**index.html Ghost card description:**
- Current: *Drag-to-reveal scanner that compares Figma spec to production reality and surfaces every deviation visually.*
- Proposed: *Built a drag-to-reveal scanner that surfaces every gap between Figma spec and production reality.*

**work/pulse.html Overview h2:**
- Current: *A UX intelligence tool built for designers, not analysts.*
- Proposed: *Built for designers, not analysts.*

**work/pulse.html Outcome opener:**
- Current (bolded): *17 issues authored across five pages. 32 components tracked. Six procedural wireframes rendered in code. Four heatmap layers. Twelve build phases on a single branch in a focused day, on top of six weeks of part-time work.*
- Proposed: *Six procedural wireframes rendered in code, four heatmap layers, twelve build phases — six weeks part-time plus one focused day.*

**work/ghost.html Outcome closer:**
- Current: *Three pivots taught me that the signature interaction should have been the first thing I designed, not the third. Conventional is invisible.*
- Proposed: *If I built Ghost again, I'd start at the slider, not the dashboard — and I'd start it at LexisNexis, where the gap that opened Ghost actually lived.*

**work/gotefigure.html Outcome:**
- Current ends with: *...a real design system, proper component architecture, and a shopping experience that feels as considered as the illustrations on the garments.*
- Proposed: end the case on *"Everything is a system waiting to be built — even the parts of work that don't look like product design."* (already the penultimate sentence — promote to last). Move the relaunch paragraph above or cut.

---

# Appendix B — What this audit could not check

- **Visual rendering on real iOS Safari + Chrome on real mobile devices.** The CLAUDE.md Mobile Video Standing Rule is rich and well-tested, but I cannot verify autoplay actually fires on a real iPhone in this session.
- **Lighthouse / Core Web Vitals.** No headless Chrome here. The site looks like it should score well (small CSS, lazy-loaded images, no JS framework) but unconfirmed.
- **Dark mode contrast end-to-end.** Computed ratios for `--text-muted` and `--text-faint` flagged above; the rest of the dark-mode token swap was not exhaustively run through a contrast calculator.
- **The intro animation's actual timing on slow CPUs.** CLAUDE.md says ~3 seconds. Real measurement requires browser instrumentation.
- **Whether `pulse.rotemgotlieb.com` redirects, 404s, or is parked.** WebFetch did not test the live prototype URL.
- **OG image rendering on LinkedIn / Twitter / Slack.** The og:image is a single static asset; visual rendering on each platform is unverified.
- **Sitemap.xml and robots.txt content.** Files exist; contents not inspected.

If any of these are critical before the recruiter review, name them and I'll run a targeted check.

---

*End of audit. — Generated 2026-05-09 in response to `/impeccable audit + critique` on rotemgotlieb.com. Brutally honest by request. No softening pass applied.*
