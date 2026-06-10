# Pulse — AI UX Intelligence Dashboard

## Case Study

---

### Hook

Designers get dashboards built for PMs. I built one built for us — it X-rays your live pages, pins AI-detected issues directly onto the UI, and tells you what to fix in language designers actually think in.

---

### The Problem

Every UX analytics tool on the market speaks the wrong language. Hotjar shows you heatmaps but calls the problems "bounce rates." FullStory replays sessions but buries insights behind enterprise search queries. Contentsquare quantifies frustration but ties it to revenue, not to the component that's broken. They're built for product managers tracking funnels, not designers trying to figure out why the onboarding form feels wrong.

The gap isn't data. Designers are drowning in data. The gap is translation. A designer doesn't need to know that "bounce rate increased 12% on /onboarding." They need to know that users are clicking the submit button 3.2 times because the disabled state looks identical to the enabled state — and that it violates WCAG 1.4.3.

I wanted to build the analytics tool I'd actually open every morning. One that shows me the interface, shows me where it hurts, and tells me what to do about it — all in the vocabulary I already use.

---

### The Insight

Designers don't think in pages. They think in components. A button, a form, a modal, a date picker — that's the unit of work. But no analytics tool maps issues to components. They stop at page-level metrics and leave you to figure out which piece of the UI is actually responsible.

The second realization: showing charts *about* a UI is fundamentally less useful than showing the UI *with the problems on it*. A bar chart that says "Onboarding: 69/100" communicates almost nothing. An SVG wireframe of the onboarding page with red pulsing dots on the submit button and the date picker — that communicates everything in a glance.

That's the core of Pulse: make the invisible visible, at the level designers actually work.

`[hero-dark.png — Full dashboard showing Page X-Ray hero with hotspots]`

---

### The Solution

**Page X-Ray** is the centerpiece. Every page in the product being analyzed gets a procedural SVG wireframe — not a screenshot, but an architectural blueprint rendered in code. Issues detected by the AI are overlaid as interactive hotspots pinned to the exact UI component where the problem lives. Toggle to heatmap mode and the wireframe lights up with a thermal visualization — red where friction concentrates, cooling to yellow at the edges. You see the shape of the problem before reading a single word.

`[xray-heatmap-dark.png — Thermal heatmap overlay on Task Board wireframe]`

The dashboard opens with the X-Ray front and center, not buried behind charts. Below it: a compact metrics row with the overall health score, 30-day trend, and key stats. A user journey flow diagram shows how people move through the product and where they drop off. Page scores and top issues round out the view — everything a design lead needs to assess UX health in under 10 seconds.

`[dashboard-full-dark.png — Complete dashboard scroll]`

Click any hotspot or issue card and you're in the **Issue Deep-Dive** — the AI showcase. At the top: a zoomed wireframe cropped to the problem area, so you see exactly which component is affected. Below that: behavioral evidence (rage clicks, dead clicks, u-turns), then the AI diagnosis. The diagnosis doesn't just describe the problem — it names the UX principle being violated, cites the WCAG criteria if applicable, and rates its own confidence level. Recommendations are numbered, tagged by effort level (quick win, medium effort, significant change), and each one is specific enough to act on.

`[deepdive-diagnosis-dark.png — AI Diagnosis with UX principle reference and confidence badge]`

The deepest layer: **Generate Fix**. For issues with clear token-level solutions, Pulse generates implementation-ready code — current values versus recommended values, with WCAG compliance verification. Copy to Figma, export as tokens. This is where the tool crosses from "diagnostic" to "design co-pilot."

`[deepdive-fix-dark.png — Expanded AI Fix panel with code diff and WCAG note]`

**Component Health** maps every UI component in the system — 32 in total — with individual health scores, issue counts, instance counts, and 7-day trends. Sorted worst-first by default, because the components that need attention should be impossible to ignore. Click any component to see its issues and which pages it appears on. This is the systems thinking view — not "which page is broken" but "which building block is failing across the product."

`[components-grid-dark.png — Component health grid sorted by worst health]`

**Weekly UX Brief** is designed to be forwarded. Narrower layout, document feel, executive summary tone. What improved, what degraded, the single top priority for next sprint, a component spotlight. The kind of report a design lead sends to their VP on Monday morning. Copy link, share report — two buttons and it's out the door.

`[brief-top-dark.png — Weekly Brief with executive summary and improvement metrics]`

---

### Key Design Decisions

**The X-Ray pivot.** The first version of the dashboard was a standard metrics layout — health score ring, trend charts, issue cards in a grid. It was functional, accurate, and completely forgettable. Expert feedback was blunt: "Not bad, but not interesting. You sell it as AI-driven and I don't see anything impressive." That feedback led to the Page X-Ray concept — show the actual UI being analyzed with issues overlaid on it. The charts got demoted to a compact secondary row. The wireframe became the hero. That single decision transformed the project from a well-built template into something that makes people stop and look.

**Designer vocabulary, everywhere.** Every label, every metric, every diagnosis is written in the language designers use. "Users are stuck" instead of "bounce rate increased." "This component is the problem" instead of "conversion dropped." The issues table uses "Frustration Signals" as a column header, not "Error Events." This isn't cosmetic — it determines whether a designer trusts the tool enough to use it daily.

**Component-level health over page-level scores.** I looked at every major competitor — Hotjar, FullStory, Contentsquare, Sprig, Clarity, Mouseflow. Every single one tracks health at the page level. None map issues to individual components. But designers work in components. A design system is a library of components. Sprint tickets reference components. The decision to build a component health map with 32 tracked elements, each with its own score, trend, and issue list, creates a view that no existing tool offers.

**Thermal heatmap as default view.** The original default was "Hotspots" mode — individual dots on the wireframe. But dots require you to find them, count them, interpret their positions. Switching the default to the thermal heatmap means the first thing you see is an immediate visual signal: red areas have concentrated problems, cool areas are fine. One glance, full picture. Hotspots mode becomes the precision tool you toggle to when you want individual issue detail.

**AI diagnosis that cites its reasoning.** Most AI-powered tools give recommendations without showing their work. Pulse's AI diagnosis references specific UX principles — Fitts's Law for touch target issues, WCAG 1.4.3 for contrast violations, progressive disclosure for information overload. It also shows a confidence rating (high/medium). This isn't just transparency — it's how senior designers actually communicate problems to engineers. "The contrast ratio is 1.2:1, which violates WCAG 1.4.3" carries more weight in a sprint planning meeting than "the button is hard to see."

`[hero-light.png — Dashboard in light mode showing theme system]`

---

### Technical Build

Pulse runs on Next.js 14 with the app router, Tailwind CSS v4 for styling, Recharts for data visualization, and Framer Motion for page transitions and micro-interactions. The wireframes are procedural SVGs — six pages, each built as a React component with parametric shapes that adapt to both dark and light mode through CSS variables. The thermal heatmap renders colored radial blobs at issue positions using the standard thermal color scale. Mock data drives everything: 18 issues with full AI diagnoses, 32 components with health trends, 18 session records, 30 days of health score history across 6 pages, and 2 complete weekly briefs. No backend, no real AI calls — but every interaction works end to end. Dark and light mode throughout, with the entire color system running through CSS custom properties.

I built it with Claude Code in VS Code — iterating strategy and prompts in conversation, then executing in code. The workflow: define the design system contract in a CLAUDE.md file, write comprehensive single-pass prompts with explicit execution order, review the output visually, refine.

---

### What I'd Build Next

If Pulse were a real product, the next features would be: a conversational AI interface where designers type natural language questions ("what's the biggest problem this week?" "which component needs the most attention?") and get synthesized answers from the full dataset. A Figma plugin that surfaces Pulse insights directly in the design tool — see a component's health score while you're editing it. Real-time session replay integration so the behavioral evidence isn't mocked. And CI/CD pipeline hooks for automated UX monitoring on every deploy.

---

### How It Fits

LexisNexis showed I can build design system infrastructure — token pipelines, component governance, bridging design and engineering. Pulse shows I can measure UX quality at scale — AI-driven analytics, component-level health tracking, design-native reporting. Ghost shows I can enforce design systems in production — visual regression, spec-to-reality comparison. Together they describe a designer who thinks in systems, not screens. Someone who doesn't just design interfaces — they build the tools that make design teams faster, more informed, and more accountable.

---

## Project Metadata

**One-liner:** AI dashboard that X-rays live pages and diagnoses UX issues for designers.

**Elevator pitch:** Pulse is an AI UX Intelligence Dashboard that shows designers where users struggle — not with charts, but by overlaying detected issues directly onto SVG wireframes of the live product. It translates behavioral data into designer vocabulary: component health scores, AI diagnosis citing UX principles, and implementation-ready fixes.

**Skills tags:** AI-Native Design · Data Visualization · Systems Thinking · Design Tooling · UX Analytics · Prototyping · Next.js · Accessibility · Dark/Light Theming

**Role:** Product Designer & Developer — Concept, Research, Design System, Full-Stack Build

---

## Visual Asset Mapping

| Portfolio Slot | Recommended File | Why |
|---|---|---|
| **Hero image** (16:8 wide) | `hero-wide-dark.png` | Cinematic dashboard shot at the exact ratio your portfolio needs. The X-Ray with data visible is the strongest first impression. |
| **Bento thumbnail** (16:9) | `xray-heatmap-dark.png` | The thermal heatmap is visually striking at small sizes — immediately reads as "data visualization" even as a thumbnail. Crop to 16:9 from the element screenshot. |
| **Case study image 1** | `hero-dark.png` | Full dashboard context — place after "The Solution" section opens. |
| **Case study image 2** | `deepdive-top-dark.png` | Visual context + behavioral evidence — place after the deep-dive paragraph. |
| **Case study image 3** | `deepdive-fix-dark.png` | The Generate Fix panel — place after the "design co-pilot" paragraph. |
| **Case study image 4** | `components-grid-dark.png` | Systems thinking proof — place after the component health paragraph. |
| **Case study image 5** | `brief-top-dark.png` | Stakeholder communication — place after the weekly brief paragraph. |
| **Image trio** (3-up, 4:3 each) | `xray-heatmap-dark.png` + `deepdive-diagnosis-dark.png` + `issues-table-dark.png` | Detection → Analysis → Management. Three layers of the product in one row. Crop each to 4:3. |
| **Light mode proof** | `hero-light.png` | Place near the design decisions section to show the theme system works. |
| **Animated embed** | `rec-dashboard-load.webm` | Convert to GIF or embed as autoplay video. The scan animation → heatmap reveal is the strongest motion moment. Place near the X-Ray section. |
| **Secondary animation** | `rec-generate-fix.webm` | The fix panel expanding. Place near the Generate Fix paragraph. |
