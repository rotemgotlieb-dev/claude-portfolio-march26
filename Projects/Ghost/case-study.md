# Ghost — Design System Reality Scanner

## Case Study

---

### The Gap Nobody Talks About

Design systems break silently. A developer hardcodes a padding value instead of using a token. A color shifts by one hex digit during a refactor. Border radius rounds down from 8px to 6px because someone eyeballed it. None of these are bugs. All of them pass code review. And after six months of compounding, your product looks like three different products wearing the same logo.

The tools that exist — Chromatic, Percy, Applitools — catch regressions against *previous code*. They answer "did this component change since last week?" They don't answer the question designers actually care about: **does our live product match our design system?**

That's the gap Ghost fills.

---

### What Ghost Does

Ghost is a Design System Reality Scanner. It compares what a design system *intends* — the Figma source of truth — against what's *actually rendering* in production, and surfaces every deviation visually.

The hero interaction is a comparison slider. Drag it left: you see the production reality. Drag it right: you see the design spec. The gap between them is the drift. No spreadsheets, no code diffs, no ticket backlogs. Just drag and see.

I designed and built Ghost end-to-end — product concept, visual identity, interaction design, and frontend development — as a fully functional prototype with mock data. The fictional design system is Meridian UI, built by a fictional fintech company called Arcline.

**Role:** Product Designer & Developer
**Timeline:** 2026
**Stack:** Next.js 14, Tailwind, Recharts, Framer Motion, Lucide React

---

### The Problem

Design systems are expensive to build. Teams spend months establishing tokens, components, patterns, and documentation. Then the system ships, and reality diverges almost immediately.

The drift isn't malicious. It's human. A developer copies a color value instead of referencing the token. A padding override gets committed during a deadline crunch. A third-party library ships with slightly different border radius defaults. Each deviation is tiny. Together, they erode the system.

Current tools attack this from the wrong angle. Code linters check if you used the right token *name* — but they can't see if the rendered result *looks* right. Visual regression tools like Chromatic compare a component against its own previous version — but not against the Figma design spec. Applitools recently launched a Figma plugin that does compare design to production, but their UX is built for QA automation engineers running test suites, not designers investigating drift.

Nobody built the tool designers actually want: show me my live product, show me my design system, and show me exactly where they disagree.

---

### The Insight

I started Ghost after building Nexus Studio V2, a design system management tool. Nexus handles creation — tokens, components, documentation. But I kept asking: what happens *after* the system ships? Who's checking that production actually follows the spec?

The answer, for most teams, is nobody. Or one designer doing manual audits in Figma, overlaying screenshots, squinting at pixel differences. Four hours per sprint, minimum. And they still miss things.

The comparison slider became the centerpiece because it mirrors how designers actually check work — they hold the spec next to the output and look for differences. Ghost automates that comparison and makes the drift tangible. When you drag the handle and watch a button shift from indigo to purple, or padding collapse by 4 pixels, you don't need a report to understand the problem. You can see it.

---

### Competitive Positioning

I mapped every tool in the space before designing Ghost:

**Chromatic** captures Storybook snapshots on every commit and compares them against previous baselines. It catches regressions in code — but it never compares against the Figma design intent.

**Knapsack** ($10M Series A) unifies design assets and code in a central platform. It manages the system beautifully — but it doesn't verify that production actually follows the system.

**Zeroheight** creates living documentation for design systems. It's passive reference material. It doesn't detect or enforce anything.

**Applitools** is the closest competitor. Their Centra product and Figma Plugin do compare design frames against production screenshots. But their interface is a QA test results dashboard — tables of pass/fail statuses with side-by-side image diffs. No comparison slider. No component health tracking over time. And critically, no remediation — they detect problems but offer zero path to fixing them.

Ghost's position: **the design-first tool for understanding and fixing design system drift.** Not a QA testing tool. An investigation and remediation platform for the people who care most about visual fidelity.

---

### Design Process

Ghost went through five major iterations, shaped by building, testing, and direct external feedback.

**Iteration 1: The Monitoring Console.** My first build was a standard dashboard — fidelity score donut, stat cards, trend chart, scan list. All six routes worked. The comparison slider existed but was buried behind three clicks. I showed this to a senior marketing professional at PingCap.

His reaction: "It's not bad, but it's not interesting."

Then he found the comparison slider. "That's brilliant. That's a very nice solution." He said it should be "front and center" and "pushed more, made so the user is incentivized to click on it."

**Iteration 2: Slider as Hero.** I restructured the entire dashboard. The comparison slider became the first thing you see — interactive on the homepage, pre-loaded with the most deviation-heavy scan. No clicking required. The monitoring elements (fidelity score, trend chart) got demoted below the fold. This was uncomfortable — dashboards are supposed to lead with metrics. But the feedback was clear: the visual comparison is the product, not the charts.

**Iteration 3: Investigation, Not Monitoring.** The same reviewer drew a parallel to my LexisNexis work: "The people that use the tools are people that investigate. So they need the UX to be built for investigation." I added a Quick Investigation search bar, restructured the scan detail page as an investigation workspace, and shifted every label from passive ("view scan") to active ("investigate this scan").

**Iteration 4: AI Remediation.** The reviewer's strongest suggestion: "You can take the findings of the issue and tell it, go and fix something. That makes the tool a lot better." He drew an analogy to Claude managing Canva templates via API. This led to the AI Fix flow — a three-stage animated sequence where Ghost connects to Figma, locates the component, updates the property, and confirms the change. No competitor offers this. It transforms Ghost from detection to remediation.

**Iteration 5: UX Friction Audit.** I recorded myself using Ghost and analyzed the mouse movements. The slider handle was too small to find (2 seconds of wandering). The primary CTA was in the wrong corner. The deviation markers were so large they turned the production side into a solid red wash. Each of these became a targeted fix — bigger handle with directional arrows, button repositioned left-aligned, markers shrunk to tightly wrap individual elements.

---

### The Solution

**The Comparison Slider** is the first thing you see on the dashboard. Design spec on the left, production reality on the right. Drag to reveal. Deviation markers overlay the production side — red for breaking changes, amber for drift, blue for undocumented variants. Measurement annotations show the exact values: "Expected: padding 16px. Found: padding 12px. Delta: -4px." You understand the problem in three seconds without reading a single data table.

**The AI Fix Flow** is what makes Ghost unique in the market. Select a deviation. See the AI recommendation. Click "Apply Fix to Figma." Watch a three-step progress animation — connecting to the Figma API, locating the component, updating the property. The marker on the slider transitions from red to green. The deviation list shows a "Fixed" badge with a strikethrough delta. The Fix Activity Log tracks every applied fix in the session. This is the feature that would make a design systems lead stop and think: "This is how it should work."

**Three View Modes** serve different investigation needs. The Slider is the dramatic reveal — the demo moment. Side-by-Side shows both panels at full scale for detailed comparison. Overlay with opacity control lets you blend the layers for precise alignment checking. A fourth mode, Timeline, shows the same page at four points in time, revealing how drift accumulated gradually — a view no competitor offers.

**Component Health Tracking** goes beyond point-in-time snapshots. Each component has a health ring, sparkline trend, deviation count, and instance gallery showing where it appears across pages. You can see at a glance: "The Card component has been declining for three weeks. It started at 92% health and is now at 72%. The padding drift is the primary cause."

**WCAG Compliance** is integrated directly into the drift narrative — not a separate tab, but a dimension of every deviation. "This color deviation is also a WCAG contrast failure: found 2.8:1, required 4.5:1." Accessibility isn't an afterthought; it's a core signal that the design system is working or breaking.

**GitHub and Slack Integration Previews** on the Report page show what Ghost would look like in a CI/CD pipeline — a PR comment summarizing new deviations, a Slack notification flagging critical drift. These position Ghost as a tool that fits into real engineering workflows, not a standalone island.

---

### Key Design Decisions

**"Clinical Precision" as the visual identity.** Ghost uses Clash Display for headings (technical warmth), DM Sans for body (clean readability), and JetBrains Mono for data values (precision). The color system is restrained — deep indigo accent, clean whites, severity colors only where they carry meaning. Light mode primary. The tone is surgical: observational, never judgmental. "Deviation detected" not "violation found." "Recommendation available" not "fix required." This was a deliberate UX writing framework — drift isn't anyone's fault, and the tool shouldn't assign blame.

**The slider as theatrical interaction.** I could have built a side-by-side diff view — simpler, more conventional. But the comparison slider creates a moment of discovery. Dragging the handle and watching a button change color, padding shift, a divider disappear — that's visceral. It communicates the concept of design drift faster than any explanation. The PingCap reviewer used the word "brilliant" when he first dragged it. That reaction is what a portfolio piece needs.

**Component-level, not page-level scanning.** Design systems are built from components, not pages. Ghost maps every deviation to a specific component (Card, Button, NavBar, StatCard) so teams can fix systemically rather than page-by-page. The Component Drift Report shows health across all 21 tracked components, sortable by health score, with sparkline trends and common deviation patterns. This is the view a design systems lead would actually use in a sprint planning meeting.

---

### Impact

Ghost is a prototype with mock data — it doesn't capture real screenshots or connect to a real Figma API. But the design decisions it embodies are real, informed by competitive analysis of $15M+ funded tools and direct feedback from an industry professional.

If Ghost shipped as a product, the metrics that matter would be: time to detect drift (from 4 hours of manual auditing to seconds), component compliance rate (percentage of production components matching the spec), and fix throughput (deviations resolved per sprint). The AI Fix flow alone — detect, diagnose, remediate in one workflow — would reduce the gap between identifying a problem and resolving it from days to minutes.

What I'd do differently: I'd start with the comparison slider on day one instead of building a monitoring dashboard first. The external feedback made this obvious in hindsight — lead with your strongest feature, not your most conventional one.

---

### The Design Systems Arc

Ghost doesn't exist in isolation. It extends a through-line across my portfolio:

**LexisNexis** shows I can build design system infrastructure — a Figma-to-Storybook token pipeline that reduced palette updates from a full day to 30 seconds.

**Nexus Studio V2** shows I can create design system management tools — a working app for building and maintaining component libraries.

**Ghost** shows I can enforce design systems in production — visual drift detection, AI-powered diagnosis, and automated remediation.

**Pulse** shows I can measure UX quality at scale — translating analytics into the visual language designers actually think in.

This isn't four random projects. It's a philosophy: design systems need to be created, maintained, enforced, and measured. I build the tools for each stage.
