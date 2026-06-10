# Portfolio Audit: rotemgotlieb.com

*Audit run: 2026-05-06. Reviewer: portfolio-polish skill (Flows.cv reference set).*
*Pages reviewed: home, /work/lexisnexis, /work/pulse, /work/ghost, /work/gotefigure, /about, /process. Light + dark modes. Desktop viewport.*

## Overall Impression

This is a real portfolio, not a template — the kind a hiring manager pauses on. Restrained monochrome shell, Satoshi typography with weight-driven hierarchy, asymmetric bento, custom cursor, dark mode wired through a real token system, a canvas-rendered footer game on every page, and a "Process" essay that documents the actual workflow used to ship the site. Builder signals are unusually strong for a UX designer (3.8K-subscriber YouTube channel, Unity VR golf game, vanilla HTML/CSS/JS by hand). It does not yet hit reference-portfolio tier (rauno.me, paco.me, shud.in) — the lead bento thumbnail breaks visual coherence, two of the four projects are close cousins, and case-study openings skew text-heavy where visuals should lead. But the gap between this and the median UX-designer portfolio in 2026 is wide.

## Scores

| Category | Score | |
|---|---|---|
| 10-Second Gut Check | 4/5 | Considered typography and restraint; one bento card breaks rhythm |
| Work Is the Hero | 4/5 | Real UI dominates; case study openings lean text-first |
| Ruthless Curation | 4/5 | Four projects, tight — but Pulse and Ghost are close cousins |
| Storytelling & Framing | 4/5 | Confident framing, honest "what I'd do differently" — wall-of-text in spots |
| Ambition & Scope | 5/5 | Vanilla build, custom cursor, intro animation, footer game, Process page — unreasonable in the right way |
| Soul & Uniqueness | 4/5 | Footer game + dark-mode tooltip + Process essay are memorable; shell is conventional |
| Portfolio as Product | 4/5 | Clean IA, scrollspy sidebars, real token system; case studies long |
| Builder Signals | 5/5 | Strongest possible. Codes, ships, runs side projects, documents the workflow |

**Overall: 34/40**

For calibration: a 34 means a hiring manager reaching out, not a hiring manager skipping. It does not mean "done."

---

## What's Working

- **Typographic discipline.** Satoshi from Fontshare across 400 / 500 / 700 / 900 weights. Hierarchy is weight × size, not color. Hero H1 is 700-weight, body drops to 400 in `#555555`. This is one of the single hardest things to get right and you got it right. Most portfolios at this level are still on Inter or system stack.
- **Color discipline.** `#FAFAF8` shell, `#1A1A1A → #999999` text scale, projects supply all the chroma. This is the rauno.me / shud.in / emilkowal.ski pattern. No purple gradients anywhere on the site. No accent-color-soup.
- **Asymmetric bento.** The 1.35fr / 1fr / 1fr / 1.35fr offset grid reads as composed, not generated. Top-left LexisNexis is biggest because it deserves to be biggest. That's editorial thinking.
- **Real product UI on three of four cards.** Pulse and Ghost ship video-thumbnail demos that loop in-place. GoteFigure ships a lifestyle photo, not a flat lay. This is fidelity above template-tier.
- **The footer game.** Canvas-rendered pixel-art mountain biker, day/night sky tied to dark-mode toggle, Web Audio chiptune that increases tempo at 500m, dust particles on landing, distance markers, screen-shake on death. This belongs in a "humanity touches" reference set alongside hector.me and bguillaume.info. Memorable in the literal sense — I will remember this site tomorrow.
- **Dark mode that actually means something.** The toggle reveals a tooltip on first interaction: "Powered by the same token system I built at LexisNexis." This ties the personal site directly to the production work. Most dark-mode toggles on portfolios are decoration; this one is a thesis statement.
- **Case-study scrollspy sidebars.** 160px sticky left rail with section landmarks (`OVERVIEW / THE PROBLEM / PHASE 1 / PHASE 2 / PHASE 3 / OUTCOME`) and "Back to Top". Reads as "I've thought about how someone reads this" — which is the IA test.
- **The hero copy has a point of view.** "Product designer who ships systems, products, and the prototypes in between." — three nouns earning their place. Not "passionate about user-centered design." The first sentence after that names San Jose, names LexisNexis Risk Solutions specifically, names ThreatMetrix indirectly. Concrete.
- **LexisNexis case study has the metric.** "Palette updates: full day → 30 seconds. What required 3 people and a coordinated handoff now takes 1 designer." This is not a vanity metric; it's a behavioral outcome with a number. Compounded by "180+ WCAG-tested tokens serving 2 design systems through a shared architecture" and "8 user interviews that directly shaped the Custom Layouts product roadmap." Hiring managers can interview against these numbers.
- **Honest reflection in Pulse.** "What I'd do differently. I spent too long polishing the monitoring dashboard before realizing it wasn't the interesting part. If I were running it again, I'd mock the most ambitious interaction first, not the most conventional one." This kind of self-critique is rare and earns trust. Most candidates only show the wins.
- **The "Process" page is unusual and gutsy.** Documenting the two-Claude workflow ("strategic chat" / "executor in VS Code") + the protocol (Diagnose → Propose → Execute → Verify) + a 1,694-line learnings file is a builder-identity statement. It is also a 2026-aware statement: candidates who can ship with AI at this protocol level are the ones top tech is hiring right now. Few portfolios show this.
- **The "Currently building" section on About** is the right surface for non-design builder signals: outdoor YouTube channel (3.8K subs, real audience, real distribution), Unity/OpenXR VR golf game (genuine technical scope), daily timelapse drawing channel (consistency over time). All three pass the "this is a maker" test.
- **Vanilla HTML/CSS/JS** with a "no framework, no build step, no React" claim and a "Process" page that quietly proves it. This reads as taste, not limitation.
- **Four projects, not eight.** Reference-set discipline. Most portfolios cannot resist padding.

---

## What Needs Work

- **The LexisNexis bento thumbnail breaks the visual system of the other three.** Pulse, GoteFigure, and Ghost are real-UI / real-photo / real-video. LexisNexis is a typographic statement — `--color-brand-primary : #de4721` over `FULL DAY → 30 SECONDS / 3 PEOPLE → 1 DESIGNER`. Conceptually it's clever (your work IS the token pipeline). Visually it tells a hiring manager scanning at high speed: "this is the case where the work itself isn't visible." It's also the lead card — the biggest tile on the page is the one that doesn't show product. Replace with a real screenshot of the Custom Layouts UI, or a short loop of the Figma → Storybook token sync, or the side-by-side palette panel from inside the case study. Save the typographic statement for the inside-the-case-study hero, where it's earned.
- **Pulse and Ghost are too similar at the homepage tier.** Both 2026, both concept projects, both AI for designers, both built in Next.js + Framer Motion, both featuring an "annotated overlay on a dashboard" visual archetype. A hiring manager skimming the bento sees two AI-design-tool-concepts and risks reading one as redundant of the other. They are different inside (Pulse is a diagnosis canvas with a thermal heatmap; Ghost is a Figma-vs-production comparison slider) — but the homepage doesn't differentiate them. Either (a) push the homepage descriptions further apart so the distinct theses land in one read, or (b) consolidate into a single project and pick the stronger of the two interactions, or (c) change Ghost's bento thumbnail so the visual archetype reads obviously different from Pulse's.
- **Pulse case study leads with three paragraphs of prose before a screenshot.** The opening reads "I built Pulse because every UX analytics tool I've used was built for the wrong audience…" — strong sentence, but it's followed by a Hotjar/FullStory/Contentsquare diagnosis that takes another paragraph to ship the visual. The reference set (rauno.me, raphaelsalaja.com, emilkowal.ski) opens case studies on the artifact, not the argument. Restructure: lead with the Living Observatory canvas screenshot (which is the most distinctive thing in the project), let the visual carry the thesis, drop the analytics-tool-comparison paragraph or move it later. Same instinct for the LexisNexis problem section — three paragraphs of "two design systems, no shared language" could be a single annotated screenshot of the two systems side-by-side.
- **The hero on the homepage uses ~55% of the viewport width and the right column is empty.** This is whitespace-as-default, not whitespace-as-decision. The reference portfolios (paco.me, rauno.me) use that right region for a portrait, a status widget, a now-playing line, a clock, GPS coordinates, or a small kinetic element that signals craft. The empty column reads as "I haven't decided what goes here." Even a small thing — a Now line, a single craft pull-quote, a tiny code-style status (`status: building`), a pinned current project link — would lift the gut-check score.
- **"Process" as a top-nav item is unusual at this tier.** The reference set consistently leaves process documentation off the homepage and out of the navigation; the page itself is excellent, but having the word "Process" as a nav peer to "Work / About / Contact" risks signaling "I lead with how I work, not what I shipped." Two options: (a) keep the page, rename the nav label to "How I work" or fold it into About as a `/about#process` anchor, (b) keep "Process" but reorder it last in the nav so "Work" is the first thing the eye reads. The current Work / Process / About / Contact order puts Process second.
- **Hero subhead has one too many noun-phrases.** "Product designer who ships systems, products, and the prototypes in between." The ", and the prototypes in between" is doing rhetorical work but adds reading load before the eye gets to the bento. "Product designer who ships systems and the prototypes in between." is the same point in three fewer words. Or: keep it as is on desktop, drop the trailing phrase on mobile to recover real estate.
- **The footer game appears below every page including case studies.** On the homepage it is delightful. On the Pulse case study it competes for attention with the actual case study content at the precise moment a hiring manager is deciding whether the work is strong. The case study build doc says it goes full-width on project pages — the full-width treatment makes it more dominant, not less. Consider: keep the game on the homepage and About; make it a small footer-only easter-egg on case-study pages (smaller canvas, or collapsed-with-toggle).
- **"Selected Work" label is the only typographic moment between hero and bento.** It's small, all-caps, faint gray. Functional, but a missed opportunity. The reference set treats the section transition itself as a craft moment: rauno.me uses tabular numerals for project counts, paco.me uses a single word with a single typographic gesture. A small detail like a numeric counter ("01 / 04"), a directional arrow before each project, or a typographic ornament would lift the texture between sections.
- **The LexisNexis case study hero is a flat process diagram.** It reads as informational rather than visual. Compared to Ghost (which opens on the comparison-slider mock screenshot — instantly understandable, instantly desirable to interact with) and Pulse (which opens on a video loop), the LexisNexis hero asks the viewer to read a flowchart before they're rewarded. Move the flowchart to the Outcome section as a "before / after" comparison; lead the case study with a real screenshot of the token panel inside Figma or the Storybook Custom Layouts component.
- **The homepage's "View resume (PDF) →" link is the third thing on the page after the H1 and subhead, and links offsite.** That's an early-funnel exit. Reference portfolios either (a) hide the resume behind a small footer link, or (b) skip the resume entirely and let the work be the resume. If you're keeping it, demote it to small text or move it to the footer and keep the eye on the bento.
- **Dark-mode parity has a small leak.** Bento thumbnail backgrounds (`#E8EDF2` LexisNexis, etc.) stay light in dark mode by design — but at certain widths, the bright thumbnails against the dark shell create a flashlight effect. The LexisNexis thumb in particular reads as a glowing rectangle in dark mode because the background is colder than the others. Either tint the thumbnails down ~6-8% in dark mode, or swap thumbnail-background-color for a CSS variable so all four desaturate on theme switch.
- **No live demos linked from the homepage cards.** Pulse and Ghost are concepts so this is forgivable, but the work cards are all internal-link-only. If any prototype is genuinely deployable (the Pulse `Living Observatory` is described as "Procedural SVG wireframes, custom canvas-based heatmap renderer at 60fps" — that's deployable), a small `live →` chip on the case-study page would be a builder-signal multiplier. The reference set (emilkowal.ski for Sonner / Vaul, raphaelsalaja.com) shows live work, not just screenshots of work.
- **GoteFigure is the weakest case study by depth-of-evidence.** It opens on a beautiful product-photography grid (the strongest visual moment on the entire site) and then closes on "200+ pieces sold in Q1. Sketch to storefront in under three hours" — but the body in between is short and the storefront screenshots feel like an afterthought. Either lean into it as a pure visual case (cut the prose entirely, let the photography carry it) or give it the same evidence depth as LexisNexis. Right now it's between modes.
- **Footer reads "built with care in san jose, ca."** Lowercase, italic-quoted "Design infrastructure is leverage" tagline. This is fine but pretty close to a stock indie-portfolio cliché. The mountain biker game above it earns its place; the closing line could too. Consider either dropping the closing line or replacing with something specific to you that earns personality (a current building log timestamp, a Now line, a books-I'm-reading snippet, a most-recent-commit timestamp). The reference set (hector.me, bguillaume.info) earns soul through specifics, not through tone.
- **No typos detected.** This is not faint praise — many portfolios at this tier ship with at least one. Keep this discipline.

---

## Priority Fixes (Do These First)

Before May 8th. Ranked by ROI, not by effort.

**1. Replace the LexisNexis bento thumbnail with real product UI.** This is the single biggest visual leak on the site — the lead card sets the tone, and right now it sets a typographic-conceptual tone while the other three cards set a real-product tone. Pull the strongest screenshot from inside the case study (the dark-themed Figma token-library panel with `Red / Blue / Gray / Green` columns is the strongest internal asset). 30 minutes of work. Disproportionate gut-check lift. Save the typographic statement for the case study hero, where it's earned.

**2. Trim Pulse case study to lead with the artifact.** Move the Living Observatory screenshot or video to position 1, before any prose. Drop or push down the Hotjar/FullStory/Contentsquare paragraph. The visual is strong enough to carry the thesis — let it. Same instinct applies to LexisNexis (move the side-by-side Figma panels above the "Two design systems. Zero shared language." prose). Visuals-to-text ratio is the single most reliable separator between a 4-tier and 5-tier case study.

**3. Differentiate Pulse and Ghost on the homepage tier OR consolidate.** Either rewrite the descriptions so they read as obviously distinct in one glance (right now both are "AI [verb] for designers"), or commit to one and drop the other. A recruiter reviewing the bento should not have to think "which AI design tool is which" — they should remember each as a distinct artifact. If you keep both, change Ghost's homepage description to lead on the comparison-slider mechanic (the most visually distinctive thing in the project) and Pulse's to lead on the heatmap-on-canvas (its most distinctive). Right now both descriptions are written as product positioning, not as artifact descriptions.

(Stretch fix if there's time: fill the right column of the hero with something tiny but specific. Even one line — "currently building: Pulse, Ghost, GoteFigure relaunch" — will close the gap.)

---

## Portfolios to Study

Read these against your specific weaknesses, not as general inspiration.

- **rauno.me** — for visual-first case study openers. Watch how every project opens on the artifact, not the argument. Apply to Pulse and LexisNexis. Also study `/craft` as a model for the kind of micro-experiment surface your "Process" page is reaching toward but doesn't fully resolve.
- **emilkowal.ski** — for the live-demo-as-thumbnail pattern. Sonner and Vaul aren't shown as screenshots; they're shown as the thing itself. Your Pulse heatmap renderer is "60fps canvas" by your own description — that's deployable. Show it deploying.
- **paco.me** — for restraint and the empty-right-column problem. Look at how the hero region gets filled with one small specific element (a Now line, a status). Direct fix for the homepage hero whitespace issue.
- **shud.in** — for typographic intention at quiet tier. You're already here on font choice and weight discipline; study the section-transition treatment between work cards. Your "SELECTED WORK" label is the weakest typographic moment on the homepage; shud.in's equivalent moments earn their place.

---

## Resources to Level Up

Reading two recommendations from `references/RESOURCES.md` mapped to this candidate's weakest areas. Not the default dump.

- **Visual hierarchy in case-study composition.** Your case studies are well-written and well-scrolled, but they do not visually escalate. The rule is: the deeper the reader goes, the MORE visual it should get, not more text. Pulse currently does the opposite — opens on a video, then settles into paragraphs. Inverting this is a one-afternoon edit with disproportionate impact.
- **The artifact-vs-narrative balance on case study openers.** Specifically the two-page rule: in the first scroll of a case study, a hiring manager should see (a) the strongest single visual artifact and (b) one sentence stating what it is. Everything else is below the fold. Audit each of your four case studies against this rule — three of them currently fail it (Ghost is the closest to passing).

---

## The Hiring Manager Gut Check

If I'm a senior design lead at Google, Linear, Vercel, Figma, Stripe, or any tier-1 product company in 2026, opening this portfolio cold from a recruiter screen: I pause. I scroll. I notice the typography is right. I notice three of the four cards are real UI and the fourth is text-on-a-card. I click LexisNexis because it's the largest and has a real company name. I find a real metric, real research evidence, a real before-and-after, a real flowchart. I close the tab and write back to the recruiter "yes, let's set up a call." The reach-out happens.

What does NOT happen: I do not put this candidate in the same mental bucket as rauno.me, paco.me, or emilkowal.ski. The gap between a 34/40 and the reference tier is mostly visual coherence (one bento card breaks the system) and case-study composition (text leads where artifact should lead). Both are fixable in a focused weekend. You have two days before May 8th — fix the bento card and the Pulse opener, and the call goes from "let's talk" to "I want to show this to my director before we talk."

The work is real. The craft is real. The point of view is real. Now the homepage needs to stop apologizing for the lead project by displaying its source code instead of its product.

---

*Audit produced by the portfolio-polish skill. Reference set: 60+ portfolios curated by Flows.cv. Run date 2026-05-06.*
