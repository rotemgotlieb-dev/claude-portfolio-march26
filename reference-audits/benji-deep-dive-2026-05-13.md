# benji.org — Deep Dive Supplemental

> Focused dossier covering the eight dimensions standard portfolio audits don't reach. Studying the moves at structural level.

---

## 1. Information architecture and page hierarchy

**Total surface count:** 2 page types — homepage + article page. That's the entire site.

**Homepage:** single article element with five paragraphs of bio, a "Writing" list of six entries, a live-clock footer. No nav menu, no /about, no /contact, no /work, no /uses. The bio's embedded company links all point OFF-domain. The Writing list's entries are the only internal links.

**Article page:** a sticky left sidebar with "Index" (returns to homepage) + a TOC of in-article anchors. Centered article column. Footnotes at the bottom. No "next article" or "prev article."

**Navigation logic:** the site is structured as a single magazine. Homepage is the cover page (masthead + table of contents). Article pages are interior articles. There is no rest-of-magazine — no archive page, no profile page, no shop page. Two surfaces, two purposes.

**Content layering:** all "About me" content is on the homepage in five paragraphs. All "Work" content lives behind text links to articles. There is no traditional case-study page. No /work surface. No project gallery. The work is the writing; the writing IS the case studies.

**Scaling limit:** the Writing list shows all six entries on the homepage. As content grows past ~12–15 entries the homepage will need redesign (or a /writing archive page added). Currently the architecture has no scaling capacity — it's calibrated for the current six-entry corpus.

**Lessons for benchmarking:**
- A two-surface IA is the minimum possible. Anything fewer is a single-page site; anything more starts introducing maintenance overhead.
- Putting bio + work on the same page is anti-pattern in most portfolio advice and is ESSENTIAL here. The bio's credential ladder DOES the work that case studies would normally do.
- The absence of /about, /contact, /work pages is not a feature gap — it's an architectural commitment. He has decided you don't need those.

---

## 2. Project / case study structure

**There are no traditional case studies.** This is the most important structural observation about the site.

**What exists instead:** writing entries that function simultaneously as launch announcements, technical essays, and case studies. Each entry has:

1. **A title that is the product name OR the technique name.** Examples: "Liveline" (product name), "Agentation" (product name), "Annotating for agents" (technique), "Morphing icons with Claude" (technique + tool), "Honkish" (product name), "Family Values" (essay/values declaration).

2. **A date in formal long form** ("13 January, 2026"). No year cut off, no abbreviation.

3. **An opening sentence that is contextual, not declarative.** Morphing icons opens: "I've been experimenting more with Claude Code lately, trying to push the limits of its animation and craft skills." Personal, journal-toned. Compare to a SaaS launch ("Introducing Liveline, the future of charts") — opposite tone.

4. **Hero artifact: a working interactive demo, immediately.** No metadata grid (no Role / Team / Timeline / Tools labels). The artifact is the metadata. The thing the article will explain is rendered live in the first viewport, with "click to cycle" or "drag to explore" instruction.

5. **Body sections each have their own embedded demo.** Section H1 → 1-2 prose paragraphs → demo widget → 1-2 more paragraphs → next section. The pattern is: setup → demonstrate → reflect.

6. **Section labels match the design narrative arc:** Setting constraints / Rotation groups / Cross-group morphs / Leveraging custom tools / Reflections / Acknowledgements. NOT Problem / Process / Solution. The labels are *the structure of the thinking*, not a generic case-study template.

7. **Length:** the Morphing icons piece is around 1,200 words of prose + interactive demos. Liveline is much longer (the chart library has 12+ demos). Not artificially compressed, not artificially padded.

8. **A Reflections section.** This is the closest thing to a "what I learned" / "outcome" surface. It's notably brief — 2-3 paragraphs of honest assessment ("Claude was great at X, mediocre at Y"). Not boasting, not bullet points of wins.

9. **An Acknowledgements section** in tiny gray text at the bottom. Credits tools, contributors, inspirations.

10. **Footnotes** with numbered superscript markers (magenta) and gray small-text definitions at the bottom.

**What comes first: ARTIFACT, then prose.** This is the single most important structural pattern. The user can't reach prose without first seeing the artifact work.

**What's missing that traditional case studies have:**
- No metadata grid (Role, Team, Timeline, Tools, Stakeholders).
- No outcome metrics (no usage stats, no revenue numbers, no adoption figures).
- No problem statement upfront — the problem emerges through the prose.
- No process documentation (no wireframes, no exploration screenshots, no rejected directions).
- No "team" or "credits" beyond the small Acknowledgements footer.

**Lessons for benchmarking:**
- The structural choice "artifact-first, prose-as-reflection" inverts the standard case-study template. It is *much* harder to fake — you have to actually have an artifact that works.
- Section labels should be the structure of the thinking, not generic ("Problem / Process / Outcome"). His labels would not make sense in any other article — they are specific to that article's logic.
- Reflections > Outcome. Honest reflection on what worked AND failed is more credible than declared wins.
- Acknowledgements are mandatory. They cost no credibility and signal care.

---

## 3. Interactive elements on the page

**Homepage:**
- Live clock in the footer ("11:45am in Los Angeles, California") — updates client-side via JS.
- Hand-drawn magenta ellipse around "New" badge — static SVG, not animated.
- Hand-drawn parens-face glyph after the clock — static SVG.
- Embedded text-link underlines — dashed/dotted pattern (static).
- Hover states on links — presumably exist but not visible in static screenshot.
- NO bento grid, NO video, NO canvas, NO scroll-triggered animation, NO custom cursor.

**Article pages:**
- Sticky left sidebar TOC (CSS sticky position, not JS-driven).
- Interactive icon-morpher widget on Morphing icons page — clicks cycle through 21 icons with SVG path morphs via Motion (animation library).
- Multiple smaller morph-demo widgets throughout the article (rotation groups demo, cross-group morphs demo).
- A custom-tools demo showing the working component with a grid selector and a highlighted target icon.
- On Liveline page: 12+ live chart components — line charts, area charts, candlestick charts, multi-series charts, dark-mode variants. Each chart is interactive (hover to show value at point, drag to scrub the timeline on some).

**Working components vs. images:** the icon morpher and the Liveline charts are ALL working components. There are no screenshots of products on this site that I observed. Every visual element is either typography, a hand-drawn SVG (the New badge, the face glyph), or a live working component.

**Canvas usage:** none observed. All animations are SVG-driven (icon morpher) or React-rendered chart components (Liveline). No `<canvas>` element required.

**Scroll-triggered behavior:** none observed beyond standard CSS sticky positioning. No fade-in-on-scroll, no parallax, no scrolljacking.

**Hover-only elements:** unknown without hover testing. Underline state probably solidifies; sidebar TOC entries probably highlight on hover.

**Lessons for benchmarking:**
- Static screenshots are RARE on this site. The proof-of-skill is in working components, not pictures of working components. This is a 10x signal multiplier.
- Canvas is not required to look polished. Two technologies do all the work: SVG (for hand-drawn details, icon morphs) and Recharts/Motion (for the chart library + animations).
- The site has zero scroll-driven motion. It chose to put motion *inside* the artifacts, not *around* them. The framing surface stays calm; the artifact does the moving.

---

## 4. Component usage — working vs image

**Working components count:** ≥ 13 (1 icon morpher + 12+ chart variants in Liveline).

**Images of components count:** approximately 0 on the homepage; ~22 in the icon morpher article (the 21-icon gallery grid is technically a grid of static-state SVG icons labeled "menu / cross / plus / minus / equals / asterisk / more / check / play / pause / download / upload / external / arrow → / arrow ↓ / arrow ← / arrow ↑ / chev → / chev ↓ / chev ← / chev ↑"). These are SVG renders, not bitmaps. Whether you count them as images or components is a definitional choice — they are the working component frozen in 21 states.

**Component types embedded:**
- SVG icon morphing (custom).
- Stock chart components in multiple variants (line, area, candlestick, multi-series, dark mode) — likely built on top of a charting primitive like Recharts or a custom Motion-driven renderer.
- The "click and explore custom tools" demo — a grid selector with a target icon highlight.

**When is a component embedded vs. shown as an image:** the rule appears to be: if the component is the SUBJECT of the writing, it's embedded live. If the component is the ILLUSTRATION of a point (a sub-detail), it's still embedded live wherever possible. There are no image-of-component anywhere I saw.

**Embedding pattern:** components are wrapped in a soft gray-rounded-rectangle container with a label below or beside it. The container is consistent across articles — same border radius, same background tint, same spacing — so embedded demos read as a recognizable type of element in his system.

**Lessons for benchmarking:**
- A portfolio that embeds working components instead of screenshots is in a separate tier. The cost (you must build the components) is high, the payoff (you've demonstrated the craft, not described it) is also high.
- A consistent embed container creates a "demo box" recognizable across articles. The reader learns to look for it.
- The icon morpher's 21-icon gallery is the *only* place on the site I saw a grid of "static" components. Even that is technically the working component frozen, with each cell labeled.

---

## 5. Voice and copy patterns

**Opening sentences of each project (Writing list entries):**

- **Liveline:** [opens directly to chart demo; first prose sentence unknown without further click but the page is dominated by chart and code blocks]
- **Agentation:** [unknown without click — probably opens on a working agentation toolbar demo]
- **Annotating for agents:** [unknown without click — probably opens on an annotation example]
- **Morphing icons with Claude:** "I've been experimenting more with Claude Code lately, trying to push the limits of its animation and craft skills."
- **Honkish:** [unknown without click]
- **Family Values:** [unknown without click — likely an essay about Family's values/principles]

**Typical paragraph length:** 3-5 sentences in articles. Punchy, not rambling. Each paragraph carries one beat of the argument. Short paragraphs increase scannability in long-form.

**First-person voice:** consistently used. "I've been experimenting," "I wanted to see if Claude could," "I gave Claude this constraint." Not the marketing-plural "we." Not the hedged passive ("It was decided that").

**Tense:** past tense for completed work, present tense for observations and reflections. "I described this to Claude AND we introduced..." (past) → "When you morph coordinates, the lines bend and warp" (present, declarative).

**Presence of metrics:** essentially zero. No "we shipped to 10k users" or "increased engagement by 40%." The closest thing is "Twenty-one icons, any of which can morph into any other" — a count, not a metric. He uses *counts* (artifact-quantity statements) but not *outcome metrics* (impact statements).

**Technical vocabulary:** medium-high. He uses terms like AnimatePresence (Framer Motion), SVG paths, coordinate space, tweening, rotation groups. He doesn't define them. He assumes the reader knows. This is targeted writing — for technical readers.

**Self-referential tone:** restrained. He doesn't say "this is amazing" or "I'm proud of this." Examples of self-positioning that DO appear: "I consider myself a designer at heart" (homepage), "This is the sort of thing you only notice by playing with it" (article), "The whole thing came together in a single session with Claude Code" (article — a quiet brag, but framed as a fact).

**Marketing copy presence:** essentially zero. The phrase "interface excellence" in the bio is the only mildly marketing-toned phrase on the site. Everything else is technical/personal.

**Lessons for benchmarking:**
- First-person, past tense for completed work + present tense for observations. Avoid the marketing-plural "we" and the case-study-template "the team."
- Counts > metrics. "Twenty-one icons" is a more credible quantification than "improved user engagement."
- Don't define technical terms. Address your actual audience; they'll know.
- Restrained self-positioning. State facts; let the reader infer praise.
- Short paragraphs (3-5 sentences). One beat per paragraph.

---

## 6. Typography and color discipline

**Font:** designer-curated workhorse. Not a system font. Distinctive lowercase `g` (double-story), distinctive lowercase `a`, distinctive italic. Probably a Klim, Dinamo, GT, or similar boutique foundry release — or possibly something like Söhne, Walsheim, Inter Display. The choice itself is a taste signal. Used as the ONLY face on the site for body, headings, and UI.

**Type scale:** soft on the homepage (H1 ≈ body size, weight contrast only), more conventional on article pages (H1 distinctly larger, H2 same size as body but bold). The ratio between H1 and body on the article is approximately 1.6–1.8x. The ratio on the homepage is closer to 1.1x.

**Line length:** appears to be ≈65ch on desktop. Within the body-text limit (65–75ch).

**Color:**
- Background: warm off-white (NOT `#fff`). The tint is barely perceptible but consistent.
- Body text: warm near-black (NOT `#000`). Soft on the eye.
- Muted text: single mid-gray rank. Used for: dates, "Updated" header, year column in Writing list, "Index" sidebar link. ONE gray, not a ladder.
- Accent: magenta-pink. Single role: "look here" pointer-annotation. Never decorative.
- Link underline color: faint gray, dashed/dotted.

**Dark mode:** none. The brand identity is editorial-light; a dark mode would dilute that.

**Accent ratio:** 2–3% by pixel area maximum. ≤ 10% rule for Restrained is comfortably under-budget.

**Lessons for benchmarking:**
- One typeface. Body + headings + UI + caption — all the same face, distinguished by weight and size.
- Warm-tinted neutrals (not pure white, not pure black). This is the single biggest "doesn't look like a default" move you can make.
- One accent, one role. Discipline at this level is rare. Most portfolios use 3-4 accent colors and dilute each.
- Soft type ladder for short pages (homepage). Strong type ladder for long pages (article). Different surfaces, different needs.

---

## 7. AI fluency signals

**Explicit mentions of AI tools / Claude / agents / MCP / n8n:**

- **Homepage bio:** "co-founder at Dip, which creates and publishes tools for achieving interface excellence, such as cmdk and Agentation." Agentation is presumably an agent-related tool. The bio's only AI mention is via this product reference.
- **Writing list:** "Morphing icons with Claude" — Claude explicitly named in a title. "Annotating for agents" — agents explicitly named. "Agentation" — the product launch entry. Three of six writing entries reference agents/AI/Claude in their titles.
- **Article content (Morphing icons):** "I've been experimenting more with Claude Code lately, trying to push the limits of its animation and craft skills." Names Claude Code specifically as the tool. The article is a transparent narrative of using Claude as a code-generation partner. He says "I gave Claude this constraint and it ran with it" — frames himself as the designer, Claude as the implementer.
- **No mentions of:** GPT, ChatGPT, n8n, MCP (Model Context Protocol), Cursor, v0, Lovable, OpenAI, Anthropic-the-company explicitly. He uses Claude Code as a noun without crediting Anthropic.
- **No skill listing of AI tools.** No "/skills" page. No "/uses" page. No technology stack disclosure.

**Builder/maker signals beyond AI:**
- cmdk — named open-source command-menu primitive used by major tools. He links to it.
- Agentation — referenced product.
- Liveline — chart library shipped via blog post.
- Six writing entries that are all artifacts of building things.

**Commit graphs / GitHub references / activity surfaces:** none. He doesn't show his commits. He doesn't link to GitHub from the homepage. He doesn't show a stream of recent commits. The Writing list IS his activity stream.

**Lessons for benchmarking:**
- AI fluency is signaled NARRATIVELY (through writing about using AI tools), not LITERALLY (through skill lists or commit graphs). A writing entry titled "Morphing icons with Claude" is a 100x stronger signal than "AI Tools" in a skills list.
- Naming specific tools (Claude Code, Motion) is more credible than naming categories (AI, animation). Specificity = competence.
- Frame the AI as the partner you direct, not the tool that does the work. "I gave Claude this constraint and it ran with it" positions YOU as the architect. "I used AI to build this" positions the tool as the protagonist.
- No commit graph needed. The output is the signal.

---

## 8. What's deliberately missing

A list of things the site DOESN'T have, that lesser portfolios usually do:

- **No traditional case studies.** No /work page, no project galleries, no metadata grids.
- **No about page.** Bio is on the homepage.
- **No contact page.** Email is in the bio paragraph.
- **No social links page.** Social links are in the bio paragraph.
- **No client list.** Companies are mentioned in the bio narratively, not as logos.
- **No testimonials.** Zero. Not even a single quote.
- **No "hire me" CTA.** No "available for work" badge. No status indicator.
- **No metrics or outcomes.** No "10M downloads," no "increased revenue by X."
- **No team photos.** No "meet the team" surface.
- **No process documentation.** No wireframes, no exploration shots, no "how I work."
- **No skill listing.** No tech stack page, no "/uses," no toolbox.
- **No commit graph.** No live GitHub activity.
- **No newsletter signup.** No "subscribe for updates."
- **No SEO meta description on the homepage** (inferred from the bare-bones HTML).
- **No service offerings.** No "I can do X for you."
- **No download CV / resume.** The Writing list is the CV.
- **No "currently reading / listening / watching" surfaces.** No public consumption tracking.
- **No "uses" page (à la wesbos.com/uses).** Despite using specific tools, he doesn't publish them.
- **No FAQ.** No "frequently asked" surface.
- **No 404 page custom design** (untested, but inferred from minimalist architecture).
- **No light/dark mode toggle.**
- **No language selector.** English-only.
- **No timestamp on individual paragraphs.** The "Updated Mar 25, 2026" stamp is page-level only.
- **No "previous role" timeline visualization.** The career progression is narrative, not infographic.
- **No certificates / degrees / awards.** Zero.

**Pattern:** every category of content that *could* be on a personal site is REMOVED. The only things that remain are: bio paragraph, six writing links, and a clock. The site is a maximally aggressive subtraction exercise. The negative space of what he chose to leave out is doing as much positioning work as the positive space of what he chose to include.

**The strategic move:** absence is curation. Each thing he didn't include is a thing he doesn't want a reader to evaluate him on. By removing certificates, testimonials, process documentation, metrics, and service offerings, he is saying "evaluate me on the writing." The bio is just barely enough to give the writing context.

**Lessons for benchmarking:**
- **The most useful audit question is "what does this portfolio REFUSE to include?"** Every refusal is a positioning bet.
- **Most portfolios fail by addition** (adding sections, adding metrics, adding social proof). Benji.org succeeds by subtraction.
- **The categories he's removed are categories the reader didn't need.** A skill list is for someone evaluating whether you can do the job. A testimonial is for someone evaluating whether others trust you. A metric is for someone evaluating impact. He has bet that his audience evaluates him on the work itself, viewed through the writing.

---

## Synthesis: the moves

If you were going to learn ONE structural pattern from benji.org, it would be this:

**Replace your case study with an artifact + a journal entry about building it.**

The artifact lives in the article, working, embedded. The journal entry explains the constraint that made the artifact possible, the discoveries you made along the way, and an honest reflection on what worked and didn't. There is no metadata grid, no outcome metric, no client name in the masthead. The article IS the case study, the launch announcement, and the portfolio piece — collapsed into one surface.

The HOMEPAGE then becomes a *bibliography* of your articles. Plus a paragraph of credentials. Plus a clock.

That's the entire portfolio.
