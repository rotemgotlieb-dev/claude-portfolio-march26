# Impeccable Audit + Critique: ch.sh

> Combined `/impeccable audit` (technical/quality lens) and `/impeccable critique` (heuristic/design lens) on an external reference portfolio. Studying the craft moves, not prescribing fixes.

```
IMPECCABLE_PREFLIGHT: context=pass (project CLAUDE.md as context; external site under review) product=N/A (external target) command_reference=audit+critique combined shape=N/A image_gate=skipped:external_site_already_captured mutation=N/A (writing audit report only)
```

## Register

**Brand** — design IS the product. Personal portfolio surface, single-author identity, content-as-product. But unlike a pure brand portfolio (essay-driven), ch.sh has product-register elements baked into the brand surface — the modal gallery is a working product UI, the commit graph is a working data viz, the live clock is a working ambient component. This is a **brand register that imports product register affordances**. Evaluating against brand register heuristics primarily, with product-register checks on the embedded components.

## Color discipline

**Strategy: Restrained, with role-based color allowance.**

Observed palette:
- Background: near-white, neutral (closer to true `#fff` than benji.org's warm tint, but presumably still tinted slightly — needs sampling to confirm).
- Body text: black (or near-black), high contrast. Heavier on the eye than benji's softer black.
- Muted text: a single mid-gray for time, "Last 30 days," "94 commits," section labels (Featured / Projects / Art / Connect). One consistent gray rank.
- Greyed-out interactive state: Laboratory item in Featured row uses an even softer gray for both lines.
- Accent green: the commit graph uses a single saturated green for active commit days. Two states: full-green (committed today) and faint-green (committed historically but not today). The green is the only accent on the upper-fold of the homepage.
- Accent magenta: peeking from the bottom of the "View work" preview card. Single decorative dot — barely visible.
- Art row icons: full-color (purple/pink/orange-yellow/blue). Bright, saturated. Used as iconic identity for each art piece.
- Footer sun-icon: gold/yellow (the weather glyph).

**Verdict:** Strategy is Restrained, but Charles has bent the rule selectively. The "≤10% accent" applies to the upper-fold (where it holds — green commit graph is well under 10%). The Art row breaks the Restrained rule by design — full-color icons in a saturated palette. This is *role-based color allocation*: Restrained for the structural surface (bio + projects + connect), Full palette for the art surface. The role allocation itself is a design-system decision; he is treating "art" as a domain where color is the work, while "project" is a domain where color is irrelevant.

The single green accent is doing dual duty: signaling "ship", signaling "freshness", signaling "live data." It's the same hue used by GitHub's contribution graph (deliberate — Charles is *quoting* the GitHub aesthetic, signaling fluency with the developer-portfolio register).

**Issues a master-tier designer would catch:**

1. **The accent green is unmodulated.** GitHub's contribution graph uses a 5-step gradient (no commits → low → medium → high → highest). Charles's graph uses just two states (committed / not committed). This is a simplification — the *count* of commits per day is visible as text, but the visual bar height/density is flat. A higher-tier execution would map green saturation OR bar height to commit count, encoding two dimensions in one element instead of just one.

2. **The Art row icons are NOT chroma-managed.** RGB Signatures is purple, RGB Friends is pink, Opepen is multi-color flower-y, Zorps is blue. Each icon's own native palette is preserved, with no homogenization. This is correct (each art piece has its own identity) but it does mean the Art row is the most visually noisy region of the homepage. A subtle treatment — uniform background tint, or a tiny inner-shadow normalization — would unify them without flattening their identity.

3. **The grey-out state on Laboratory has no semantic label.** Just visually muted. A `disabled` aria attribute might exist (untested), but the visual treatment alone reads as "not loaded" rather than "intentionally inactive." A small "coming soon" pill in muted type would clarify the state.

## Theme

**Light.** Correct choice for a designer-builder-curator audience reading at desks during work hours. The physical scene is: "engineer or designer reading a peer's portfolio on a 14–27 inch monitor in office light, scanning for the commit graph and the project list before deciding whether to click anything." Light forces the focus on data density; dark would over-styling the dashboard aesthetic.

The single green accent (commit graph) is exactly the green that pops in light mode. In dark mode it would either need to shift hue or risk looking sickly. The choice is internally consistent.

**No dark mode toggle.** Correct — adding one would double the surface complexity and the green accent would need re-tuning. Also conceptually: this is a portfolio of someone who codes through Claude Code and ships products. Both Claude Code and GitHub default to system theme, but his portfolio chooses one stance. Commitment.

## Typography

**Hierarchy observed:**

- H1 "Charles Shin" — bold weight, larger than body, but only by a modest ratio. ≈ 18px vs 15px body, with bold contrast.
- Subtitle "Software Designer" — body size, muted gray. Sits visually as a metadata caption to the name. Soft hierarchy.
- Body paragraphs (bio + intro) — ≈ 15–16px, generous line-height (~1.5), narrow column width.
- Section labels (Featured / Projects / Art / Connect) — body size, ALL LOWERCASE (not actually all-caps, but lowercase or sentence case — needs sampling). Muted gray. Sit *above* the section content, separated by a thin horizontal rule.
- Row labels (Freighter, Snack, ElevenRooms, etc.) — body size, bold weight or medium weight. Crisp.
- Row sublabels ("Flagship Stellar wallet", "ASCII Soundscapes") — body size, muted gray. Tight vertical spacing.
- Commit graph numbers ("94 commits") — same body size, different alignment.
- Clock ("01:52:35 PM") — monospace or tabular numerals, slightly larger. Possibly a monospace face for the digits to keep them from jumping.
- Footer ("신 © 2026 · 46D898E · Chicago, IL") — smaller text, with separator dots between.

**Typeface:** appears to be a clean modern sans-serif. Not a typewriter-monospace, not a serif. Possibly Inter, Söhne, Aeonik, or one of the modern editorial sans. Less distinctive than benji.org's choice — Charles's typography is "competent" rather than "characterful." This is a small craft delta vs benji — benji's letterforms are themselves part of the brand; Charles's typeface gets out of the way.

**Line length:** narrow column, well within the 65–75ch limit. The bio reads as 4 short paragraphs of ~25 words each.

**Issues a master-tier designer would catch:**

1. **The H1 / body weight contrast is the only hierarchy signal for the name.** Same with benji.org — soft hierarchy. The name doesn't announce. But Charles's font choice makes this even softer than benji's (which used a more distinctive typeface for emphasis). On a 27-inch monitor at standard scale, the H1 "Charles Shin" can be missed in a 5-second scan because it sits at the same size as the bio text. This is consistent with the dashboard aesthetic — your name is a label, not a banner — but it costs first-glance recognition.

2. **Tabular numerals on the clock are mandatory but may not be enabled.** The clock updates every second. If the digits are NOT tabular, the 5 vs 1 jump in width causes the time string to jitter horizontally. Hard to verify from static screenshot but worth checking; tabular numerals (`font-variant-numeric: tabular-nums`) should be on every digit-displaying surface.

3. **The section labels (Featured / Projects / Art / Connect) are nearly identical in weight to row sublabels.** Compare a row like "Freighter / Flagship Stellar wallet" — the sublabel "Flagship Stellar wallet" is gray. The section label "Featured" is also gray. The reader has to look at position (above vs below) to disambiguate label-as-section-header vs label-as-row-description. A slight weight bump or letter-spacing on section labels would resolve this.

4. **The footer uses three different typographic treatments in one line:** Korean character "신" (probably a CJK system fallback), Latin "© 2026", monospace-style "46D898E" (git hash), regular weight "Chicago, IL". Four character classes, no explicit unification. The total line is short enough that it reads cleanly, but it's a tiny inconsistency.

## Layout

**Two-column on the upper fold, single-column below.**

**Observed structure:**
- Top: ≈ 50/50 split. Left column has bio (Charles Shin / Software Designer / 4-paragraph bio / contact line). Right column has "View work" preview card + commit graph + "Last 30 days / 94 commits" caption.
- Below the upper fold: single-column. All sections (Featured / Projects / Art / Connect) collapse to left column only. Right column is unused white space.
- Section separators: thin horizontal rules above each section header (Featured | Projects | Art | Connect). The rule extends ONLY the width of the content column, not full-width.

**Spacing rhythm:**
- Paragraph-to-paragraph in bio: tight (~14px or so).
- Bio block to Featured: ≈ 60px (a section break).
- Section header to first row: ~16px.
- Row to row within a section: ~12px (very tight, dashboard-dense).
- Section to section: ~40px (less than benji's section gaps).

**Issues a master-tier designer would catch:**

1. **The right column is dead below the upper fold.** This is the single largest layout issue on the site. The two-column rhythm is established at the top; abandoning it after ~700px reads as "ran out of right-column content." On a 1280px viewport, the empty right column is approximately 400px wide × 1500px tall = 600,000 unused pixels. A higher-tier execution would fill this with: a writing surface (latest essays), a now-reading/now-playing block, a calendar of upcoming work, a "Currently building" status, or simply shift to centered single-column to make the asymmetry deliberate.

2. **Section header rules are width-limited but the section content isn't always.** The rule sits above the section header, spanning the column width. The Featured items extend across the same column. But the right column is empty next to them. The rule + items + empty right = an asymmetric L-shape that doesn't quite resolve.

3. **Project icons sit in a slightly different column than the text.** Each row is `icon | name | sublabel`. The icons are left-aligned in a fixed 40px column. The text starts at a fixed offset to the right of that column. This works but the icon column is wider than the icons themselves — there's ~12px of negative space between the icon and the name. Tighter spacing would feel more dense; the current spacing reads slightly airy for a dashboard-aesthetic.

4. **The "View work" preview card sits at a soft border-radius (~16px) with a gradient mask at the bottom.** The card visually IS a card. The rest of the page has no card affordance. Just one card. A higher-tier execution either commits to the card pattern (multiple cards) or removes the card border-radius to integrate the preview into the page flow. Standalone cards on an otherwise-flat page read as inconsistent.

5. **No grid system is visibly enforced.** The icon column and text column don't align across sections — the gap between icon and text in the Featured section is the same as in the Projects section, but Section header text doesn't align with row name text in any meaningful way. This is the kind of issue you only notice with a grid overlay; it doesn't break the read but a stricter execution would have a 4-column or 12-column grid governing everything.

## Motion / micro-interaction

**Observed:**
- Live clock updating every second (digit cycle).
- Commit graph animates on load (presumably — needs verification).
- "View work" button opens a modal gallery (animated overlay transition).
- Hover states on rows (presumably exist — not captured in static screenshot).
- The Featured items expand on click (per the `expanded=false` aria attribute) — modal or inline expand TBD.

**No site-wide scroll-driven animations, no parallax, no scroll-jacking.** Same as benji.org — restraint at the surface level. Motion lives inside the modal gallery and the live components, not in the page chrome.

**Issues a master-tier designer would catch:**

1. **The clock's update animation, if any, is invisible from screenshot.** Best practice: each digit fades/slides as it changes, not a hard swap. Whether Charles does this is untested but worth checking — this is a small craft moment that the dashboard aesthetic rewards.

2. **The commit graph bars don't have hover-to-zoom or click-through to GitHub.** Each bar is a day; clicking should plausibly open the day's commits on GitHub, or hovering should show commit messages. The current presentation is read-only. A higher-tier execution would make the graph interactively explorable.

3. **The modal gallery's screen-to-screen transition is unclear from static screenshot.** Likely a fade or crossfade — needs verification. Best practice for a gallery: each transition should feel like "advancing a page," not "swapping content."

## Cognitive load

**Homepage:** medium-high. There are 18 distinct interactive elements in the upper-fold area alone (bio, 6 bio links, view-work button, commit graph hover targets, copy-email button, x.com link). The reader must triage what to engage with.

**The /work modal gallery:** low. Single image at a time, single label, breadcrumb. The reader follows a guided sequence.

**The /skills and /stack pages:** high. /skills shows 23 items with thin per-item context. /stack shows 155+ items across 16 categories. These pages assume the reader is willing to scroll-graze.

**Issues:**

1. **The upper-fold density requires the reader to understand the visual taxonomy quickly.** "View work" is a CTA. Commit graph is a status. Clock is ambient. Bio is identity. A first-time visitor has to parse all four within ~5 seconds. The risk: a reader bounces because the parse cost is higher than for a single-surface portfolio.

2. **The Featured row uses a different interaction model than the Projects row.** Featured items are buttons (expand inline / open modal). Projects items are links (navigate to external URL). The visual treatment is nearly identical — a reader would not know that clicking Freighter does something different from clicking ElevenRooms.

3. **/skills mixes self-authored skills with installed skills with no strong visual delta.** Both groups use the same row treatment. The reader has to read the section headers ("Created Skills" vs "Installed Skills") to disambiguate. A stronger contrast — different row treatment, different icon style, or a tiny "by chsh" badge on self-authored items — would surface the ones Charles built vs the ones he uses.

## Information architecture

**Three-page architecture: / + /skills + /stack.**

Plus the /work modal (which technically lives at /work but is rendered as an overlay on /).

**Pros:** clear separation of concerns. Home = identity + work. /skills = capability inventory. /stack = reference library.

**Critique:**

1. **The /work modal overlay has unusual URL semantics.** Opening "View work" presumably loads /work as a URL state. But the modal renders over the homepage, not as a full-page replacement. If a user shares /work as a link, what does the recipient see — the modal floating over the homepage, or a standalone gallery? Best-case the modal opens with the URL set; worst-case the URL is unchanged and the gallery is deep-link-broken. Untested.

2. **The Freighter / Snack / Laboratory Featured items don't have individual deep-link surfaces.** All three are "View work" buttons. There's no /work/freighter, /work/snack, /work/laboratory. The 22-screen gallery is presumably Freighter's, but Snack and Laboratory either share it or don't have their own. The IA conflates the three projects into one work surface.

3. **The bio's external links (Exa, Stellar, Warby Parker, Uber, Weebly) all exit the site.** Same pattern as benji.org's bio. The user lands on Stellar's site and forgets they were on ch.sh. This is the inevitable cost of letting the bio do the credentialing work — but it's worth noting.

4. **No /about page, no /writing page, no /contact page.** The contact is the bio. The "about" is the bio. The writing doesn't exist. Three classic portfolio surfaces are absent.

5. **/skills and /stack are not navigable from anywhere except the top icon links.** No breadcrumbs, no inter-page navigation. From /skills you can return home or click to /stack but not navigate elsewhere. The IA is essentially flat — three peer pages with no cross-linking.

## Performance — observable signals

- **Live clock**: causes a re-render every second. Probably bounded to its component subtree, but still — JS execution per second. Acceptable if scoped, problematic if mismanaged.
- **Commit graph**: rendered from data (probably fetched at build time or via SSR). Static after render. No perf issue.
- **/work modal**: 22 mobile-screen images loaded. With Next.js Image optimization, these are responsive WebP renders, lazy-loaded. Reasonable.
- **/stack page**: 155+ items each with favicon + optional OG preview image. This page is the heaviest — likely loads dozens of images.
- **Canvas in DOM** (noted in the snapshot): there's a Canvas element rendering something. Possibly the commit graph (rendered as canvas for perf), possibly an ambient background effect (untested). If it's the graph, fine; if it's a background, it's a perf cost without visible value.

**Likely issue:** /stack is likely the slowest-loading page on the site due to favicon and OG preview requests. Untested without Lighthouse.

## Accessibility (observable)

- **Semantic HTML** appears clean. Links are links, buttons are buttons, headings are headings.
- **The Featured items are `button` elements with `expanded=false` aria attributes** — correct for disclosure widgets.
- **The "View work" overlay** — unclear if focus is trapped inside the modal (an a11y requirement). Untested.
- **The clock** — likely lacks an `aria-live` region declaration; a screen reader would re-read the time every second if it did. Probably acceptable to keep it silent for screen readers.
- **The commit graph bars** — unclear if they have aria-labels with day + commit count, or if they're purely visual.
- **Color contrast on muted gray** — needs sampling. Smaller items (sublabels) on near-white may be on the edge of AA.
- **The email copy-to-clipboard button** — should have `aria-label="Copy email"` if the button is icon-only.

**Issues:**

1. **The greyed-out Laboratory entry** lacks a `disabled` or `aria-disabled` attribute (likely — untested). A keyboard user tabs to it and can interact with it visually, but the visual state says "don't."

2. **The commit graph likely has no keyboard interaction.** It's a data viz that a sighted user can read; a non-sighted user gets nothing unless there's a `aria-label` summarizing "94 commits over the last 30 days." Worth checking.

3. **The Canvas element in the DOM** is opaque to screen readers unless `role` and `aria-label` are applied. Whatever it's rendering, it must have an accessible alternative.

## Copy

**Every word earns its place.** Pass mostly — the bio is 4 short paragraphs and each carries one beat (current role, design philosophy, AI fluency, contact).

**No em dashes.** Pass verified.

**No restated headings.** Pass.

**Tone:** technical, declarative, brief. Charles uses the present tense for current state ("Currently the Lead Product Designer at Exa") and the past for prior context ("Previously at Stellar, Warby Parker, Uber, and Weebly"). The "Writing code through conversation and wiring agents together" sentence is the only piece of original prose — a single sentence that does a lot of work.

**Issues:**

1. **The "Designing interfaces and interactions that feel simple, clear, and enjoyable" sentence is the closest to marketing-prose on the site.** "Simple, clear, and enjoyable" is a tricolon of warm adjectives that a corporate marketing team would write. Compared to the rest of the bio (which is fact-based — companies named, tools named), this sentence floats. It's the only sentence that doesn't pass a "would I write this if I were just trying to be precise?" test.

2. **"Especially in blockchain and AI, where new patterns are being shaped for the first time"** — the "for the first time" qualifier is doing positioning work but mildly overclaims. Lots of patterns get re-invented; not all are "first time." A tighter version would just be "where new patterns are being shaped." Minor.

3. **Featured items have very terse sublabels** that work in isolation but lose context. "List curation tool" (Snack) doesn't tell you what's curated. "Stellar developer sandbox" (Laboratory) is genre-correct but doesn't position Laboratory uniquely among Stellar devtools. The pattern works because the icon and name carry primary identity, but the sublabels could be a tiny bit more specific.

## The AI slop test

**First-order:** Could you guess the design from the category? "Senior designer + builder who works in crypto and AI" — first reflex would be: dark mode, terminal aesthetic, neon green or cyan accent, monospace everywhere, glitchy ASCII details. Charles's site is light mode, sans-serif, monochrome with a green commit-graph accent. Decisively NOT the category reflex. Pass.

**Second-order:** Could you guess from category-plus-anti? "Crypto+AI designer who refuses the cyberpunk aesthetic." Second reflex would be: warm light editorial (benji.org's territory), or stark Swiss minimalism. Charles's site is dashboard-dense Restrained — neither editorial nor stark Swiss. He found a third lane: developer-portfolio-density. Pass.

**Verdict:** This site does not look like AI made it. The bespoke icon library, the live commit graph, the role-based color rule, the modal gallery format — these are individual choices that no AI default would converge on. Pass.

## Absolute bans — clean

- No side-stripe borders. ✓
- No gradient text. ✓
- No glassmorphism. ✓ (the modal overlay is a subtle blur/dimming, NOT a glass card effect)
- No hero-metric template. ✓ (the "94 commits" is contextualized as a count under the graph, not a giant standalone number)
- No identical card grids. ✓ (the project list is rows, not cards)
- No modal-as-first-thought. The modal is *the* affordance for the gallery — but it's correctly applied. The gallery is a sequence of single-screen-at-a-time views, not a content surface that should have been inline. The modal serves the right job.

All six absolute bans cleanly avoided.

## Critique heuristics (the impeccable critique pass)

### Hierarchy (visual)
**Score: 7/10.** Soft H1/body contrast. Section headers under-differentiated from row sublabels. The hierarchy is *consistent* (no broken rules) but *quiet* (no strong visual stops). Loses points for low first-glance recognizability.

### Hierarchy (informational)
**Score: 8/10.** Three-page IA is clear. Modal gallery is unusual but works. Loses points on lack of breadcrumbs and zero cross-linking between /skills and /stack.

### Restraint
**Score: 7/10.** Restrained on color (single green accent + role-based color allocation). NOT restrained on content density — the homepage has more elements than benji.org by a factor of ~3. The restraint is at the *visual* level, not the *informational* level. This is a deliberate trade.

### Identity
**Score: 9/10.** Strong identity comes from: bespoke icon library, live commit graph, /skills + /stack architecture, footer identity stack (clock + weather + Chicago + 신), GitHub-quoted green accent. Loses one point because the typography itself is workhorse-competent, not distinctive — vs benji.org where typography IS the identity.

### Rhythm
**Score: 6/10.** Upper-fold two-column rhythm is broken below the bio. Section spacing is tight and consistent within sections, but section-to-section spacing doesn't establish a strong page-level cadence. The page reads as one long left-column list once you get past the fold.

### Detail
**Score: 9/10.** The 신 character. The git hash link. The commit graph showing repo names per day. The "Index 22" badge in the modal. The peek of magenta at the bottom of the View Work card. The role-based color rule. Every detail rewards close looking.

### Originality
**Score: 8/10.** Original moves: live commit graph, /skills page, /stack page, modal gallery format. Less original: a project list with icons (genre-common), Connect section with social links (genre-common). The originality is concentrated in the meta-pages and the data-viz elements.

### Cohesion
**Score: 7/10.** The upper-fold is cohesive. The post-bio single-column section is cohesive. The relationship BETWEEN the two zones is the weakness — the layout shift from two-column to single-column reads as broken rather than intentional.

**Overall impeccable critique score: 61/80.**

(Note: this is lower than benji.org's 71/80, but the two portfolios are in different categories. Charles's portfolio is denser, more ambitious in scope, and harder to execute perfectly. The category gap is "calm-editorial" vs "high-density-builder-dashboard." Both succeed; they're aiming at different targets.)

## What this teaches a benchmarking designer

1. **Live data on a portfolio is a multiplier signal.** A commit graph is faster proof of velocity than any case study. Build the integration even if it's a small element.

2. **Bespoke icons across an entire portfolio is identity work that pays off only at scale.** Charles has ~15 hand-crafted SVG icons. The cost was significant; the reward is that NO other portfolio looks like this. If you commit to icons, commit to enough of them that they become a recognizable system.

3. **Role-based color allocation is a design-system thinking signal.** Color goes where the work is colorful (Art). Color does not go where the work is structural (Projects). The rule is internal to the portfolio's own system, not externally imposed.

4. **A modal gallery is a credible alternative to case-study pages, but only when the work is visual.** Charles's "Index 22" works because Freighter is iOS UI screens — they speak for themselves. A modal gallery would NOT work for a research project, an essay, or a system design — those need prose.

5. **/skills and /stack as separate first-class pages is a 2026-specific bet.** AI/agent fluency and tool curation are becoming evaluable signals. Charles has decided they deserve their own pages. The bet might not pay off in 2025; it almost certainly will in 2026–2027.

6. **A footer can be a status bar.** Five identity signals in 40 pixels: clock, weather, city, signature character, git hash. This is dense-portfolio's equivalent of editorial-portfolio's hand-drawn marginalia.

7. **Density is a hiring filter.** A casual reader bounces from ch.sh's density. The audience that DOESN'T bounce is the technical hiring audience. Charles has selected for his audience via design density.

## Small craft issues a master-tier auditor would catch (compiled)

1. Right column dies below the upper fold — large dead real-estate.
2. Featured / Projects / Art sections use the same visual treatment but different interaction models (modal vs link) — discoverability cost.
3. Laboratory greyed-out state lacks a "soon" or "coming" label.
4. RGB / RGB Signatures / RGB Friends multi-counted; Noundation / Noundation UI doubly counted.
5. Commit graph uses only 2 visual states (committed/not) rather than encoding count via height/saturation.
6. Section headers (Featured/Projects/Art/Connect) under-differentiated from row sublabels.
7. Possible tabular-numeral miss on the live clock — digits may jitter.
8. The Canvas DOM element rendering something unidentified — should have an a11y label.
9. The "Simple, clear, and enjoyable" tricolon is the one piece of marketing-toned copy.
10. The modal gallery URL semantics are unclear — possibly not deep-linkable.
11. The "94 commits" stat has no time-anchor visible at a glance — needs to be paired with the "Last 30 days" label below, which is small.
12. /skills lacks visual differentiation between Charles's own skills and installed ones.
13. /stack is purely a directory — no personal notes or "currently using" tags.
14. The View Work preview card is the only card-affordance on the page — visually inconsistent with the flat row design.
15. No long-form writing surface despite ample material (skills, stack, commits) that could anchor essays.

None of these are deal-breakers. All visible only with the magnifying glass on.
