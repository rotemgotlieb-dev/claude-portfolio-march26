# ch.sh — Deep Dive Supplemental

> Focused dossier covering the eight dimensions standard portfolio audits don't reach, applied separately to each of the four surfaces: homepage, /skills, /stack, and the /work modal gallery. Studying the moves at structural level.

---

## Site map

- **/** (homepage) — bio, featured projects, projects, art, connect, footer + live commit graph + live clock
- **/skills** — Curated/Created/For Agents/Installed skills (23 total)
- **/stack** — 16 categories of curated resources (155+ items)
- **/work** — modal gallery overlay on the homepage; "Index 22" gallery of Freighter mobile screens
- **404 surfaces:** /work/freighter, /work/art/rgb, /freighter all return 404. Project pages do NOT exist as standalone URLs.

---

# Surface 1: Homepage (ch.sh)

## 1. Information architecture and page hierarchy

**Total surface count:** 4 distinct pages — homepage + /skills + /stack + /work (modal). Plus the 5 external destinations linked from Projects (ElevenRooms, AI Design Jobs, RGB, Rat Labs, Noundation, Noundation UI).

**Top-level nav:** 3 icon-only links — logo (home), /skills, /stack. No /about, /work as a direct nav item (work is exposed via "View work" CTA on the homepage). No /contact.

**Content layering on the homepage:** 7 visible blocks in vertical order:
1. Top header: name + title + clock + email-copy + x.com button (single row, two-column distribution)
2. Bio paragraph block (4 short paragraphs)
3. Right column: "View work" preview card + commit graph + "Last 30 days / 94 commits" label
4. Featured (3 items: Freighter, Snack, Laboratory)
5. Projects (6 items)
6. Art (4 items)
7. Connect (5 items: email + 4 socials)
8. Footer: avatar + 신 © 2026 + git hash + sun icon + Chicago, IL

**Navigation logic:** the homepage is the index. Everything else is one click away. The site is fundamentally a "dashboard of self" — one page densely encoded with multiple data types (identity, work, skills inventory, location, time).

**Lessons for benchmarking:**
- A "dashboard of self" is the alternative to an "essay of self" (benji.org's model). Both are valid; they target different reader-attention shapes.
- Three-page top-nav (home + 2 meta pages) is the minimum that lets you have first-class /skills and /stack surfaces. Four pages would dilute; two pages would collapse into one.
- No /about page is acceptable when the homepage IS the about page. No /contact page is acceptable when the homepage has email + social.

---

## 2. Project / case study structure (homepage view)

**Projects are presented as ROWS, not cards.** Each row: icon (left) + name + one-line sublabel + optional arrow indicator.

**Three section types:**
- **Featured** (3 items): icon + name + sublabel. Treatment: button (`expanded=false`). Interaction: opens modal? Inline expand? Not explicit on the row.
- **Projects** (6 items): icon + name + sublabel + tiny arrow icon. Treatment: anchor (link). Interaction: navigate to external URL.
- **Art** (4 items): full-color icon + name + sublabel. Treatment: button (`expanded=false`). Interaction: opens modal? Inline detail?

**What comes first per item:** icon. Always. The icon is the primary visual identifier; the name is secondary text.

**Per-item word count:** sublabel is 2–5 words. Total per-item copy is ~10 words including the name.

**Per-item structure on the homepage:** icon + name + sublabel + (optional) arrow. NO image preview, NO timestamp, NO category tag, NO outcome metric.

**The "View work" preview card** is the only place on the homepage that shows actual UI screens — three small mobile-screen renders stacked, with a magenta peek at the bottom, behind a "View work" overlay button. This is the entire visual proof on the homepage: three thumbnail-sized peeks at one project's screens.

**Lessons for benchmarking:**
- A row-based project list is denser than a card grid. The trade-off: less visual hierarchy per project, more projects visible at a glance.
- The Featured / Projects / Art tri-section is editorial taxonomy. Featured = employer work, Projects = side projects with live URLs, Art = NFT/visual art. This separation is a useful audit move — sort your work into 2-3 categorical buckets based on what's evaluated differently per bucket.
- A single preview card on the upper-fold beats zero visual proof. Even minimal visual evidence in the bio block makes the verbal credentials more credible.

---

## 3. Interactive elements on the homepage

**Live components:**
- **Live clock** ("01:52:35 PM") — updates every second, top-right of bio block. No timezone label (presumably local).
- **Commit graph** — 30 bar chart showing daily commit counts, "94 commits" total. Possibly canvas-rendered (a Canvas element is visible in the DOM root). Bars vary in saturation (some dark green, some lighter, some empty for no-commit days).
- **Email copy-to-clipboard button** ("hi@ch.sh" with a small copy icon next to it).
- **"View work" CTA** — opens the /work modal gallery as an overlay.
- **Featured row items as buttons** with `expanded=false` aria — disclosure widgets.
- **Art row items as buttons** with `expanded=false` aria — disclosure widgets.
- **Project row items as anchor links** with external arrow indicator.

**Hover states:** unverified without hover capture.

**Scroll behavior:** standard scroll. No parallax, no scroll-jacking, no scroll-triggered animations (verified by screenshot — content is fully rendered without scroll-revealing).

**Canvas usage:** there IS a `<Canvas>` element in the DOM root, unidentified from static screenshot. Possible candidates: ambient background effect, commit graph renderer, the View Work preview thumbnail composer, or an analytics tracker. Untested.

**Working components vs static images:**
- Commit graph: working (live data).
- Clock: working (live data).
- View Work card: working (modal trigger).
- Project icons: static SVG.
- Art icons: static SVG (or possibly PNG given full-color palette).
- The peek-of-magenta on the View Work card: static.

**Lessons for benchmarking:**
- A live clock + a live commit graph in the upper fold are two "this is alive" signals at minimal implementation cost. Both are 1-2 hours of dev work each. The signal value is much higher.
- Mixed interaction models on visually-identical row treatments (Featured = button, Projects = link) is a discoverability risk. Either unify the treatment or differentiate the visuals.

---

## 4. Component usage — working vs image (homepage)

**Working components count on the homepage:** 4 — clock, commit graph, View Work preview, email copy button.

**Bespoke SVG icons count:** ~15 — one per project, one per art piece, one per social, one per email, footer icons.

**Static image count:** small — the View Work card has 3 tiny preview thumbnails (mobile screens from the gallery). That's the entire image inventory on the homepage.

**When a component is embedded vs shown as an image:**
- Live data (commit graph, clock) → working components.
- Identity icons (project marks) → bespoke SVG.
- Work proof (mobile screens) → small thumbnails in the View Work card preview; full-size in the modal gallery.

**Lessons for benchmarking:**
- A homepage can be ~90% icons and ~10% live data and STILL feel substantive. Charles's homepage has essentially zero photographic content and is one of the densest portfolios in 2026.
- Bespoke icons across all projects is a design-system move. Generic icons would dilute the identity by 50%.

---

## 5. Voice and copy patterns (homepage)

**First sentence of bio:** "Currently the Lead Product Designer at Exa."

**Paragraph length:** 4 short paragraphs, each 1-2 sentences.

**Tense:** present for current state, past for prior employers.

**First-person:** implicit. The bio doesn't say "I am the Lead Product Designer" — it says "Currently the Lead Product Designer at Exa." The "I" is dropped. This is third-person framing on a single-author portfolio — slightly distanced, slightly resume-toned.

**Marketing tone:** one sentence ("Designing interfaces and interactions that feel simple, clear, and enjoyable") is the closest to marketing prose. The rest is factual.

**Metrics:** zero quantified outcomes. One quantified input: "94 commits" (last 30 days). This is a *process metric*, not an *outcome metric*. Charles shows velocity, not impact.

**Technical vocabulary:** present and confident. "Writing code through conversation and wiring agents together (Claude Code, OpenClaw, Paperclip)." This sentence names specific tools, uses the term "agents" without definition, and implies fluency at the orchestration layer.

**Per-row copy:**
- "Flagship Stellar wallet"
- "List curation tool"
- "Stellar developer sandbox"
- "ASCII Soundscapes"
- "Curated design jobs"
- "Onchain identity framework"
- "Onchain product studio"
- "Community design system"
- "Framer design kit"
- "Onchain binary values"
- "Colorful generative characters"
- "Daily brand remixes"
- "Zorb profile collection"

Each is 2–5 words, declarative, no marketing fluff. Notice the deliberate vocabulary: "onchain" (appears 4 times — positioning), "framework" / "system" / "kit" (positioning as system-design work, not single-product design).

**Lessons for benchmarking:**
- Implicit first-person (dropped "I") works on a one-author portfolio with strong credentials. It feels like a CV header rather than a conversational About paragraph.
- One sentence in the bio can do all the AI fluency work. "Writing code through conversation and wiring agents together (Claude Code, OpenClaw, Paperclip)" is more efficient than a full /AI page or a skill list.
- Project sublabels at 2-5 words force you to find the verb. "Curated design jobs" beats "A platform for curated design jobs."

---

## 6. Typography and color discipline (homepage)

**Font:** a clean modern sans-serif. Less distinctive than benji.org's choice. Possibly Inter, Söhne, Aeonik, or similar. The font is competent and gets out of the way; identity lives elsewhere (icons, layout, data viz).

**Type scale:**
- H1 "Charles Shin": bold, modest size up from body.
- Subtitle "Software Designer": body size, muted gray.
- Body bio: ~15–16px, generous line height, narrow column.
- Section labels (Featured/Projects/Art/Connect): body size, muted gray, with thin horizontal rule above each.
- Row names: bold or medium weight, body size.
- Row sublabels: body size, muted gray.
- Clock: tabular numerals (presumably), larger than body, monospaced look.

**Color:**
- Background: near-white, presumably tinted but lightly.
- Body text: high-contrast near-black.
- Muted gray: a single rank for time, descriptions, section labels.
- Accent green: commit graph bars (saturated on active days, faint or empty on no-commit days).
- Accent magenta: tiny peek at the bottom of the View Work preview card. Decorative dot.
- Full-color: Art row icons (purple/pink/orange/blue).

**Dark mode:** none.

**Color role rule:** monochrome for structure (Projects, Connect, Featured names). Color for atmosphere (commit graph green, weather sun gold). Full color for the work itself (Art row icons).

**Lessons for benchmarking:**
- A workhorse typeface is fine if you have other strong identity vectors. Charles's identity lives in icons + data + footer + IA. Typography doesn't need to do extra work.
- One accent color, one role. Charles uses green for "ship" (commits) and that's the only place it appears. Compare to benji.org which uses magenta for "pointer annotation" — same discipline, different role assignment.
- Role-based color allocation (mono for structure, color for art) is a design-system thinking signal.

---

## 7. AI fluency signals (homepage)

**Explicit mentions:**
- "Claude Code" — named in the bio paragraph.
- "OpenClaw" — named in the bio paragraph (obscure; insider reference).
- "Paperclip" — named in the bio paragraph (obscure; insider reference).
- "wiring agents together" — bio language. Uses "agents" as plural without definition.
- "AI Design Jobs" — a Project entry. The product itself is AI-related.

**Builder/maker signals:**
- Live commit graph: 94 commits in 30 days. Multiple repos: portfolio, skills, ramp, crosstown, ai-design-jobs.
- GitHub link in Connect: 0xchsh.
- Git commit hash in footer (46D898E) — linked to the actual commit page on GitHub.
- /skills page exists (more on this below).
- Multiple shipped products visible in Projects (ElevenRooms, AI Design Jobs, RGB, Rat Labs, Noundation, Noundation UI).

**Commit graph:** the strongest single AI/builder signal on the homepage. It encodes velocity, repo diversity (5+ repos active in 30 days), and consistency (most days have commits). A reader sees this and gets a model of Charles's working rate WITHOUT a single explicit AI mention.

**Lessons for benchmarking:**
- Specific tool naming (Claude Code, OpenClaw, Paperclip) > generic AI mentions. Specificity is credibility.
- A live commit graph is the highest-signal builder element. It is also the easiest to fake-by-not-shipping, so a viewer might discount it — but the linked git hash makes it auditable.
- Multiple repos in the graph (not just "portfolio") proves work across surfaces, not just on the portfolio itself.

---

## 8. What's deliberately missing (homepage)

- No /about page (bio IS the about).
- No /contact page (email + socials are in Connect row + bio).
- No /work as a standalone page (only modal gallery via "View work").
- No /writing or blog surface.
- No testimonials, no client quotes, no recommendation snippets.
- No "hire me" CTA, no availability badge.
- No metrics or outcomes (only the process metric of 94 commits).
- No client logos.
- No team mentions (single-author).
- No certificates / degrees / awards.
- No newsletter signup.
- No "download CV" link.
- No video content.
- No music or "now playing" surface.
- No book recommendations.
- No "uses" page (though /stack approximates it).
- No FAQ.
- No language selector.
- No dark mode toggle.

**Pattern:** like benji.org, Charles has removed an enormous category of "personal site filler." He keeps: identity (bio), proof (commit graph), inventory (projects + art), capability (/skills + /stack), contact (Connect). Five buckets. Everything else is cut.

**The strategic move:** absence is curation. By removing testimonials, client logos, and metrics, Charles says: "evaluate me on the work, the commits, and the curation. Not on third-party validation."

---

# Surface 2: /skills

## 1. Information architecture

A single page split into **four sub-sections** (per the WebFetch enumeration):
1. **Curated Skills** (header only — possibly empty or pending)
2. **Created Skills** (2 items): `/enforce-design-system`, `/shincn`
3. **For Agents** (1 item): "llms.txt is set up" link (ch.sh/llms.txt)
4. **Installed Skills** (~20 items): /agent-browser, /agentation, /copywriting, /electron, /emil-design-engineering, /find-skills, /frontend-design, /impeccable, /last30days, /portfolio-audit, /rams, /remotion-best-practices, /shadcn, /shincn, /swiftui-expert-skill, /ui, /ui-skills, /userinterface-wiki, /vercel-react-best-practices, /web-design-guidelines, /web-interface-guidelines

**Total count:** 23 items (2 created + 1 agents reference + 20 installed). Some duplicates exist (`/shincn` appears in both Created and Installed; `/web-design-guidelines` and `/web-interface-guidelines` are near-identical).

**Per-item structure:** slash-prefixed name + one-line description + external GitHub link. No images, no demos, no examples.

## 2. What the page does (and doesn't do)

**Does:**
- Inventory the Claude Code skills Charles uses.
- Surface the ones he authored vs imported.
- Link out to each skill's GitHub repo.
- Signal AI fluency by the act of having this page.

**Doesn't:**
- Show what each skill PRODUCES (no example outputs, no before/after).
- Provide rationale for installation choices.
- Show usage frequency or recency.
- Rank or rate skills.
- Distinguish strongly between authored and installed (both use same row treatment).

## 3. Voice (on /skills)

**No first-person prose.** The page is essentially a directory. Each skill row is name + 4–6 word description + link. There is no "why I use this" or "how this changed my workflow." The page positions Charles as a curator/admin, not a writer about tooling.

## 4. AI fluency signal

Maximum on the homepage's bio sentence ("Writing code through conversation and wiring agents together"); this page is the *proof surface* — the receipt for that claim. Without /skills, the bio sentence would be unsubstantiated. With /skills, the bio sentence is verifiable.

## 5. What's missing that would have made the page stronger

- **Working demos.** Each skill could have an embedded example showing what it produces. The portfolio-audit skill could show a sample audit. The impeccable skill could embed a critique snippet.
- **Self-authored highlight.** "Created Skills" should be visually distinguishable from "Installed Skills" — a different row treatment, a badge, or a separate page.
- **Usage data.** "Used 47 times in the last month" or "Installed Apr 10, 2026" would convert the static directory into a living document.
- **Rationale.** "Why /shadcn over /tailwindui" or "Why I built /shincn instead of using /shadcn alone" would convert curation into thinking.

## 6. Lessons for benchmarking

- A /skills page is a 2026-specific portfolio surface. It directly signals AI/agent fluency in a way no other surface does.
- A directory-only treatment is the thin version. The thick version embeds demos.
- Self-authored skills are the strongest signal on the page — they should be the headline, not buried.

---

# Surface 3: /stack

## 1. Information architecture

A single page split into **16 categorized sections**:

| Category | Item count |
|---|---|
| Agents | 4 |
| APIs | 3 |
| Articles | 15 |
| Components | 15 |
| Courses | 7 |
| Design Agencies | 4 |
| Design Skills | 10 |
| Design Systems | 5 |
| Design Tools | 10 |
| Directories | 13 |
| Fun Sites | 31 |
| Hardware | 3 |
| Inspiration | 16 |
| Mockups | 3 |
| On Repeat | 9 |
| Read | 11 |
| Software | 10 |
| Typography | 6 |

**Total:** 155+ items across 16 categories.

**Per-item structure:** favicon + name + optional OG preview image. NO description, NO rating, NO "currently using" tag.

## 2. What the page does (and doesn't do)

**Does:**
- Position Charles as a tool curator across 16 domains.
- Show breadth of interest (Components AND Hardware AND Fun Sites AND Typography).
- Surface specific products (Composio, Conductor, Paperclip, Companies.sh, etc.) by name.
- Operate as a public reference library that other designers/builders might bookmark.

**Doesn't:**
- Tell you which items Charles actually uses vs. has bookmarked.
- Rank or filter by recency.
- Explain why an item is on the list.
- Separate "tools I use" from "tools I'm watching."

## 3. The "Fun Sites" category is the largest (31 items)

This is a tell. Fun Sites being the dominant category on a designer's stack page signals that Charles values craft-as-play. Most curated stacks are dominated by Tools or Productivity. Charles puts the playground first.

## 4. The "Agents" category sits FIRST

Despite being only 4 items, "Agents" is presumably positioned at the top of the page (per the WebFetch enumeration). Editorial signal: agents are the topic of the moment.

## 5. What's missing that would have made the page stronger

- **Personal notes per item.** A 1-sentence "why I use this" or "why this is on the list" would convert a directory into a personal essay.
- **"Currently using" vs. "watching" tags.** A reader can't tell what's active.
- **Date added or last visited.** A stack is a living thing; showing date stamps makes that visible.
- **Anti-list.** Sometimes the strongest curation signal is what you've REMOVED. "I used X for a year and switched to Y because" would be more valuable than "X is on my list."

## 6. Lessons for benchmarking

- A /stack page is a curator-identity move. It positions you as someone who reads, evaluates, and decides — not just someone who consumes.
- 155+ items is on the upper edge of useful. The risk: it becomes a public bookmark dump.
- A directory-only treatment is thin; personal annotation is thick.
- Category counts reveal priorities. "Fun Sites = 31" is a positioning statement about playfulness over productivity.

---

# Surface 4: /work modal gallery

## 1. Architecture

**Modal overlay on the homepage.** Triggered by the "View work" button in the upper-right card. URL changes to /work (presumably).

**Header:** "Index 22" badge + X close button.

**Body:** sequence of 22 mobile-screen screenshots, displayed one at a time in a centered container with soft gray background. Each screen is labeled below ("Freighter / Home", "Freighter / Past transactions", etc.).

**Footer:** unclear from screenshot whether there's prev/next navigation or whether it auto-advances on scroll.

## 2. Content inventory (visible from screenshots)

22 Freighter mobile UI screens, labeled:
- Home
- Past transactions
- History details
- Wallets
- Discover (1)
- Discover (2)
- In-app browser
- Transaction details
- Malicious transaction warning
- Review transaction
- Collectibles
- Sundae Frogs (NFT collection view)
- (~10+ more not captured in our session — total is 22 per the Index badge)

## 3. What the page does (and doesn't do)

**Does:**
- Show the complete UI flow for one project (Freighter).
- Demonstrate iOS/mobile design craft at viewing-quality scale.
- Let a reader form a holistic impression of the design system across 22 screens.
- Use the "Index N" format as a quick navigational anchor (you know how many screens to expect).

**Doesn't:**
- Provide narrative — no problem statement, no constraints, no rationale, no outcome.
- Cover other Featured projects (Snack, Laboratory) — only Freighter has a gallery.
- Show desktop UI (only mobile renders).
- Show interactive prototypes — only static images.
- Provide a "Designer credits" or "Team" section.
- Provide deep-linkable URLs per screen (URL likely doesn't change per screen).

## 4. Voice (in /work)

**Zero prose. Pure visual gallery.** This is the most aggressive "let the work speak" choice on the site. A reader has to evaluate purely on the basis of the design quality of 22 mobile screens.

## 5. Why it works

- Freighter is a wallet app, so mobile UI IS the core deliverable. The gallery format matches the medium.
- 22 screens is dense enough to demonstrate a complete system (auth flows, transaction flows, edge cases like malicious transaction warning).
- The "Index N" header sets reader expectation — "this is a complete walkthrough, not a teaser."

## 6. Why it fails (or limits)

- Without rationale, a reader can't separate "this is a great design" from "this is a competent design." The work has to be genuinely strong to survive prose-less presentation.
- No design system anchoring — the reader sees 22 screens but doesn't see how they compose from shared components.
- No interaction documentation — clicking the lock-icon does what? Hovering on the chart shows what? These are invisible in static gallery format.

## 7. Lessons for benchmarking

- A modal "Index N" gallery is a credible case-study alternative when the work is visual (mobile UI, illustration, posters, icons). Don't use this format for systems work, research, or product strategy.
- The Index-count header is a small UX detail that anchors reader expectation. "Index 22" tells you the gallery has a definite length and you can commit to scrolling through it.
- Zero prose is a high-stakes choice. It works only when the work itself is strong enough to require no framing.

---

# Cross-surface synthesis

## What the four surfaces TOGETHER are doing

The site is making four distinct claims, one per surface:

| Surface | Claim |
|---|---|
| Homepage | "I am a Software Designer working in crypto + AI, and here are my receipts." |
| /work (modal) | "I design mobile interfaces at professional scale — see for yourself." |
| /skills | "I run agent tooling at a level few designers do." |
| /stack | "I curate the tool layer of design, AI, and the web more broadly than most." |

**No surface tries to be all four.** Each is single-purpose. The reader follows the surface that matches their interest:
- Hiring manager → homepage + /work.
- Fellow builder / Claude-power-user → /skills.
- Design-tool curator / fellow stack-watcher → /stack.

This is sophisticated audience segmentation via IA. A reader self-selects which surface they care about.

## What's missing across all four surfaces

- **No long-form writing.** Charles has the material (skills, stack, commits, products) but no essay or article surface. This is the single largest opportunity gap in the portfolio. A writing page would: (a) link the four surfaces together with a narrative, (b) add narrative-tier proof to complement the visual-tier proof, (c) give the reader a reason to return.

- **No demos / interactive components anywhere outside the modal gallery.** /skills could embed working examples. /stack could embed live tool previews. The homepage could embed a working component from one of Charles's projects. None of this happens. The portfolio is "directories + galleries + bio" — no live interactivity except the clock and commit graph.

- **No project-specific URLs.** /work loads the Freighter gallery; /work/freighter is 404; /work/snack doesn't exist. The four named projects (Featured + Projects + Art + /work) aren't deep-linkable individually. This limits sharing, indexing, and external links.

- **No timeline or chronology.** A reader cannot tell which project was when. Was ElevenRooms built before or after RGB? Did Charles work at Stellar before or after Warby Parker? The bio names companies; everything else is undated. The commit graph gives 30-day rolling data but doesn't anchor multi-year context.

- **No services or "what I do" offer surface.** Charles doesn't tell a reader "if you want to hire me to do X, here's how." Implicit, but absent.

## The structural pattern (the move)

**Replace your case study + about + skills page with four single-purpose surfaces:**

1. **Homepage = identity + work-receipt + status bar.** Bio paragraph, project list, commit graph, clock, footer signature. The "dashboard of self."
2. **Modal gallery = work proof.** Sequence of UI screens, indexed by count, prose-less. Works when the work is visual.
3. **/skills = capability inventory.** Slash-named Claude Code skills, self-authored + installed.
4. **/stack = curation receipts.** 16 categories × ~10 items each. The "reference library."

That's the entire portfolio. Compared to traditional portfolios:
- No /about page → homepage IS about.
- No /work case studies → modal gallery IS the case study.
- No skill list → /skills IS the skill list (made specific to Claude Code skills, which is a 2026-only category).
- No "uses" page → /stack IS the uses page.
- No /contact page → email and socials are inline.

The architecture treats the portfolio as a system of distinct evaluative surfaces, each targeting a different reader-archetype, each prose-less or near-prose-less. The total information density is high; the per-surface cognitive load is low. The reader picks their entry point.

## How this compares to benji.org

- **benji.org:** writing + bio. Two-surface architecture. Each surface is editorial.
- **ch.sh:** dashboard + gallery + skills + stack. Four-surface architecture. Each surface is inventory/data.

Both are top-tier. They occupy different lanes:
- benji.org optimizes for *depth per piece* — one article at a time, each one a complete argument.
- ch.sh optimizes for *breadth across pieces* — many surfaces, each one a different evaluative angle.

A reader who prefers reading rewards benji.org. A reader who prefers scanning rewards ch.sh.

A designer choosing between the two formats should decide: **am I going to produce 6 deep essays/year, or 100+ shipped artifacts/year?** Benji's format requires the writing throughput. Charles's format requires the shipping throughput. Both are exhausting; they're exhausting in different ways.

---

## Distilled cross-surface lessons

1. **Single-purpose surfaces > multi-purpose pages.** Each surface answers one question. The reader picks which question matters to them.

2. **/skills and /stack as separate first-class pages is a 2026 bet.** AI fluency and tool curation are becoming evaluable signals. Make them first-class.

3. **Modal galleries are a valid case-study alternative when the work is visual.** Use Index-N headers to set reader expectation.

4. **A live commit graph is the highest-density single builder signal available in 2026.** If you ship, show the graph.

5. **Footer-as-status-bar.** Live clock + weather + city + git hash + signature character. Five identity signals in 40 pixels of vertical space.

6. **Role-based color allocation.** Color where the work warrants it (Art icons); monochrome where the work is structural (Projects).

7. **Bespoke icons across all projects is identity work that compounds.** ~15 hand-crafted SVGs in Charles's case. Without them, the portfolio would feel half as dense.

8. **A directory page is thin without per-item annotations.** /skills and /stack both leave value on the table by not adding 1-sentence-each "why" notes.

9. **Specific tool naming (Claude Code, OpenClaw, Paperclip) > generic AI claims.** Specificity is credibility.

10. **Absence is curation.** Every category Charles refused to include (about, contact, writing, testimonials, metrics) is a positioning bet. The bet is "evaluate me on shipped work, not on validation."
