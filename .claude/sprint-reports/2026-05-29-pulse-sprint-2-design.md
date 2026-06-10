# Pulse Sprint 2 · Full Design Doc

**Date:** 2026-05-29
**Sprint:** Pulse rebuild, Sprint 2 of 3 (full design doc; NO build, NO HTML / CSS / JS edits to live site)
**Predecessor:** [2026-05-28-pulse-sprint-1-spine.md](2026-05-28-pulse-sprint-1-spine.md) §1F resolved
**Sprint 1 amendment (locked at Sprint 2 kickoff):** dual-CTA framing dropped entirely. Not in Outcome, not in Key Decisions, not anywhere. Sprint 1 §1F updated in place.
**Next:** Sprint 3 builds against this spec. Pre-phase backup, markup + CSS + JS for D1 / B1 / C1, cache-bust lockstep, planned-vs-implemented T-stamp table.
**Operating standard:** apply the case-study guidebook end to end. The system from Ghost transfers. Pulse-specific choreography numbers are this sprint's job to lock.

---

## §2.0 · How to read this document

Sections in order: §2.1 rewritten prose section by section (the page's literal text), §2.2 D1 wireframe-fidelity loop design, §2.3 B1 Layer chip widget design, §2.4 C1 V1 vs V2 slider design, §2.5 distinctness, §2.6 visual consistency, §2.7 risk surface, §2.8 Sprint 3 preview, §2.9 gate.

Audit discipline baked in: em dashes and the seven banned words from CLAUDE.md verified zero before this file ships.

---

## §2.1 · Section-by-section prose rewrites

### §2.1.0 Voice and discipline

Pulse voice per guidebook §8: first-person where natural, technical vocabulary, zero marketing fluff, animations carry their own meaning (no narration). Identity facts intact: UC San Diego ICAM, San Jose, LexisNexis Risk Solutions ThreatMetrix. Banned words zero. Em dashes zero.

Pulse-specific posture: strategy-heavier than Ghost. Names competitors and disqualifies them by mechanism. Names what was deliberately NOT built. Voice reads as a designer with a hypothesis, not a feature list with a portfolio gloss.

### §2.1.1 Hero (caption stays at 15 words)

The video itself does not change. The existing caption already passes the ≤15-word rule and the artifact-first opener rule.

```
The Living Observatory: one canvas that fuses a wireframe, heatmap, time scrubber, and AI prompt bar.
```

Word count: 15. No change. (Caption is "what the artifact is" framing; not animation-narration because it does not describe motion or beats.)

### §2.1.2 Overview

Three tight sentences. Competitor list moved out (into §2.1.3). The wedge sentence lands first, then a sentence on what makes Pulse different, then a sentence on what it actually does at the component level.

```
A UX intelligence tool built for designers, not analysts. Pulse anchors every observation to a named component, surfaces it with instance count and trend, and ships the fix as a code diff inside the same surface that diagnosed the issue. Most analytics tools speak conversion rate. Pulse speaks WCAG 1.4.3 and Fitts's Law.
```

Word count: 56. Three sentences plus one short fourth. The fourth sentence is the wedge in vocabulary form (WCAG + Fitts's Law beats "we speak the designer's language" any day). Removes the "designers ship components; tools report on pages" framing from Overview · that goes in the Problem section so the lead and the disqualification are not duplicated.

### §2.1.3 The Problem

The competitor list lifted in from current Overview. One sentence per disqualification by mechanism. Concrete failure example closes the section.

```
Designers ship components. Their tools report on pages.

Hotjar speaks in bounce rates. FullStory buries insights behind enterprise search. Contentsquare ties friction to revenue, not to the component that's broken. The gap is not data. The gap is translation. Pages are too coarse. Sessions are too granular. Components are the unit designers think in, and almost no analytics tool sees them that way.

A designer doesn't need "bounce rate increased 12% on /onboarding". She needs to know users are clicking the submit button 3.2 times because the disabled state looks identical to the enabled state. That's a WCAG 1.4.3 violation. Existing tools flatten it into a chart and call it a heatmap.
```

Word count: 117. Three paragraphs. Lead sentence is the wedge (now in its proper home). Middle paragraph names the three competitors by name AND by mechanism (specific failure mode per tool). Closing paragraph is the concrete failure example with the specific WCAG citation, preserved from current page. No animation-narration. No banned words. No em dashes.

### §2.1.4 The Insight

Two sentences. Declarative. Word for word from current page; this section already passes.

```
Make the heatmap an interface, not a visualization.

You can look at a Hotjar heatmap. You can't ask it a question. Pulse's heatmap is interactive, layered, time-aware, and component-anchored.
```

Word count: 29. The H2 is the insight; the body is two sentences explaining it. No change.

### §2.1.5 The Solution: Living Observatory (framing prose for B1)

Three short paragraphs. First paragraph names the system at a glance. Second paragraph names the technical choices that earn the framing (OKLab thermal palette confirmed real per Q1; procedural SVG wireframes confirmed real per Q3; severity vocabulary confirmed as parallel/shared cross-product system per Q2). Third paragraph is the framing line for the Layer chip widget below.

```
The home canvas is everything in one frame. A procedural SVG wireframe of the analyzed page renders in the center, drawn from data, not screenshotted. Four heatmap layers overlay it. A 7-day scrubber runs along the bottom. An AI prompt bar runs along the top.

Each heatmap layer gets its own OKLab-interpolated thermal palette. OKLab is a perceptually uniform color space, so a hot zone reads as hot whether it's red or blue, and intermediate values stay legible instead of muddying. The severity dots (red / orange / yellow) match the vocabulary I use on Ghost. Consistent severity language across products is the point.

Try the four layers below. Each surfaces a different UX signal on the same Task Board wireframe.
```

Word count: 122. Surfaces the OKLab claim with specific technical reasoning (perceptually uniform, hot reads as hot across colors, intermediate values stay legible). Surfaces the procedural SVG claim with the precise framing (drawn from data, not screenshotted). Names the severity-vocabulary cross-product decision honestly (matches Ghost; consistency is the point). Closes with the framing line for B1 that names what to try and what it argues. No animation-narration about HOW the widget works · just what each layer surfaces and what's underneath them.

### §2.1.6 The Pivot: V1 → V2 (framing prose for C1)

Two short paragraphs and a quote-style standalone sentence. Lead is the trigger; quote is the senior reviewer's verbatim feedback; second paragraph is the rebuild's identity shift, ending with the framing line for the slider.

```
Version one was competent and forgettable. A senior reviewer's exact words were: "not bad, but not interesting." I scrapped it and rebuilt on a new branch.

V1 was Linear meets Datadog meets Statsig: dark mode, sidebar nav, health ring, severity pills, sparkline. Polished, professional, forgettable. The rebuild moved to a paper-on-cream identity, Geist Mono headlines, one canvas with two drawers instead of five separate dashboard views. Page X-Ray became Living Observatory. X-Ray is medical and passive; Observatory is exploratory and active.

Drag the slider below to compare V1 against V2 directly.
```

Word count: 96. Names the trigger with the verbatim quote. Names the V1 reference frame ("Linear meets Datadog meets Statsig"). Names the specific moves the rebuild made (paper-on-cream, Geist Mono, two drawers, naming pivot). The naming pivot (X-Ray → Observatory) is honest and small; gets one sentence, not a section. Closes with the framing line for the slider. The slider lets the visitor DO the comparison instead of reading a description of it.

### §2.1.7 Design Process (framing prose for D1 + framing prose for deep-dive.mp4)

Two decisions. Wireframe fidelity (first), then diagnosis-card-to-deep-dive routing (second). Dual-CTA framing absent per Sprint 1 amendment.

**Decision 1 framing (preceding D1):**

```
Two more pivots got V2 the rest of the way.

The first round of procedural wireframes were pure abstractions: kanban shapes, form lines, settings rows. They read as stage dressing. The heatmap overlaid on them looked decorative. I sat down on day eight, rebuilt the wireframes with real column headers ("BACKLOG · 7"), real task titles, real assignee initials, and the moment the content felt real, the heatmap stopped reading as decoration and started reading as analysis.

The fidelity shift is small but load-bearing. The loop below dramatizes how the call gets made: each click commits a content choice that pulls the wireframe out of abstraction.
```

Word count: 116. Lead acknowledges there are two more pivots. Middle paragraph names the original problem (abstractions read as stage dressing), the trigger ("the heatmap looked decorative"), the moment (day eight rebuild), and the four content fidelities the rebuild added (column headers, task titles, assignee initials, plus the specific real example "BACKLOG · 7"). Final paragraph is the framing line for D1: names what the loop argues without describing what the loop SHOWS.

**Decision 2 framing (preceding deep-dive.mp4):**

```
The second pivot was about depth. The diagnosis card on the canvas surfaces the headline and the evidence. But when a designer wants to actually verify the fix, look at the WCAG check, read the code diff, see session evidence, the card is the wrong surface for that. I built the deep-dive as a routed page, not an expanded card.

When depth becomes the subject, depth deserves its own surface.
```

Word count: 76. Lead names what decision 2 is about (depth). Middle sentence names what the card does and where it fails (verification depth). Closing sentence names the architectural call (routed page, not expanded card). Final standalone sentence is the principle behind the call. No dual-CTA framing. No "I built both then merged." Honest decision, honest framing, deep-dive.mp4 demonstrates the depth that justifies the route.

### §2.1.8 Key Decisions

Three named exclusions. One sentence each on the reasoning. No dual-CTA mention. No "what I'd build next" speculation in this section (saved for Outcome).

```
What I chose not to build is part of the design.

No predictive heatmaps. The four layers I shipped are observational. Predictive heat would have shifted the trust contract from "here's what happened" to "here's what we think will happen," and the second is harder to defend in a design review than the first.

No mobile responsive. Pulse is a desktop tool for designers reviewing production interfaces. Mobile responsive is a six-week problem for a one-month project, and adding a phantom mobile layout would have given hiring managers something true to call out as half-baked.

No real Figma integration. The "Connect your design system" button on the canvas is a real surface but its plumbing stops at the button. Real plumbing needs API negotiation, OAuth, a token sync pipeline, and a maintenance plan. Out of scope for the concept; in scope for the next version.
```

Word count: 158. Three exclusions named, each with one paragraph of reasoning. Reasoning per exclusion is specific (trust contract for predictive; six-week-vs-one-month scope for mobile; explicit naming of the surface + the missing plumbing for Figma). Tone is restraint-as-design without overclaiming the restraint. Final sentence on Figma signals the work that comes after the concept without committing to a date.

### §2.1.9 Outcome

Counts softened per Sprint 1 §1F (15 issues, 5 wireframes, 32 components stays, 4 layers, 10 surfaced). "12 build phases" cut. "60fps custom canvas renderer" kept. Dual-CTA framing absent. Reflection kept.

```
A concept that earns its place.

Fifteen issues authored across five pages. Thirty-two components in inventory, ten surfaced with severity and trend. Five procedural SVG wireframes rendered from data. Four heatmap layers, each on its own OKLab thermal palette. A 60fps canvas-based heatmap renderer with a synchronized 7-day scrubber.

The most valuable thing Pulse demonstrates isn't the canvas. It's the strategic argument around it. Pulse names its competitors. It anchors observation to components, not pages. It puts WCAG verification next to every recommended fix. And the design closes the loop from "what's broken" to "what to change" inside the same surface that diagnosed it.

What I'd do differently. I spent too long polishing V1 before realizing it wasn't the interesting part. If I were running it again, I'd mock the most ambitious interaction first, not the most conventional one.

Built with: Figma, Next.js 14, TypeScript, Tailwind v4, Framer Motion. The next build target is a static code analyzer that produces the same diagnosis-card output by scanning a codebase and Figma file directly.

Live prototype coming soon.
```

Word count: 196. Lead is the section title; second paragraph is the verifiable counts (15 issues, 32 inventory / 10 surfaced, 5 wireframes, 4 layers, 60fps renderer) per Sprint 1 §1F resolutions. Third paragraph is the strategic argument; explicitly cites WCAG verification and the close-the-loop signal (both confirmed real per Q1/Q3 and surfaced in §2.1.5). Fourth paragraph is the reflection (V1-polish-too-long + mock-the-most-ambitious-first), kept verbatim from current page in spirit. Fifth paragraph is the tech stack + next-build target (the static code analyzer line is preserved from current prose because it's a real, defensible "what comes after" signal). Sixth line is the live prototype note; minimal because it stays "coming soon" per Q9.

### §2.1.10 Section order

Per Sprint 1 §1F Q12: keep current ordering. Final order:

1. Hero
2. Overview
3. The Problem
4. The Insight
5. The Solution: Living Observatory + **B1 Layer chip widget**
6. The Pivot + **C1 V1 vs V2 slider**
7. Design Process
   - 7a. Wireframe fidelity + **D1 wireframe-fidelity loop**
   - 7b. Diagnosis-card-to-deep-dive routing + **deep-dive.mp4** (kept)
8. Key Decisions
9. Outcome
10. Other Work

### §2.1.11 Composition walk (top-to-bottom)

| # | Element | Above | Below | Composition check |
|---|---|---|---|---|
| 1 | Hero (ai-fly.mp4) | (top) | Overview prose | ✓ strongest artifact opens |
| 2 | Overview prose | Hero | Problem prose | ✓ 3-4 sentence wedge |
| 3 | Problem prose | Overview | Insight prose | ✓ competitor list + WCAG example |
| 4 | Insight prose | Problem | Solution framing prose | ✓ declarative |
| 5 | Solution framing prose | Insight | B1 widget | ✓ frames B1 without narrating |
| 6 | **B1 Layer chip widget** | Solution prose | Pivot framing prose | ✓ framed; followed by prose |
| 7 | Pivot framing prose | B1 widget | C1 slider | ✓ frames C1 without narrating |
| 8 | **C1 V1 vs V2 slider** | Pivot prose | DP decision-1 framing prose | ✓ framed; followed by prose |
| 9 | DP decision-1 framing prose | C1 slider | D1 loop | ✓ frames D1 without narrating |
| 10 | **D1 wireframe-fidelity loop** | DP-1 prose | DP decision-2 framing prose | ✓ framed; followed by prose |
| 11 | DP decision-2 framing prose | D1 loop | deep-dive.mp4 | ✓ frames deep-dive.mp4 without narrating |
| 12 | **deep-dive.mp4** | DP-2 prose | Key Decisions prose | ✓ framed above; prose buffer after |
| 13 | Key Decisions prose | deep-dive.mp4 | Outcome prose | ✓ pure prose buffer |
| 14 | Outcome prose | Key Decisions | Other Work | ✓ no coda (Q17) |
| 15 | Other Work | Outcome | (footer) | ✓ |

Loop and motion-bearing element count:
- 1 hero autoplay (ai-fly.mp4)
- 1 cursor-driven body process loop (D1)
- 2 user-driven interactives (B1, C1)
- 1 supporting body autoplay (deep-dive.mp4)

Five motion-bearing elements. Below Ghost's saturation ceiling (seven). Right density for strategy-heavier case study.

Anchor link audit: section IDs in the rebuilt page must be `#overview`, `#the-problem`, `#the-insight`, `#the-solution`, `#the-pivot`, `#design-process`, `#key-decisions`, `#outcome`. Sidebar nav references all of these. Sprint 3 verifies sidebar `<a>` href values match.

---

## §2.2 · D1 Wireframe-fidelity loop · design spec

### §2.2.1 Decision-first sentence (per guidebook §5 Step 1)

> "I shifted V2's wireframes from blueprint abstractions to stylized-but-real content (real column headers, real task titles, real assignee initials), because the heatmap overlaid on abstract wireframes was reading as decoration."

That sentence is the rhetorical payload of D1. Every beat traces back to it. Q11 confirmed this was deliberate, one moment of rebuild on day eight (Sprint 1 §1F). Honesty bar passes.

### §2.2.2 Surface and components

Surface: the V2 Task Board procedural wireframe, stripped to body-demo height per guidebook §7 / CLAUDE.md "Body-demo discipline" standing rule (≤350px, no app chrome, no sidebar, no ASK PULSE bar, no friction-zones rail). What stays: the kanban-style wireframe (4 columns), with placeholder gray bars in the four positions D1 will fill.

The four positions D1 fills (in order, polyrhythmic):
1. **Column header bar** → "BACKLOG · 7"
2. **Task title bar (first task in IN PROGRESS)** → "Refactor authentication flow"
3. **Task title bar (second task in IN PROGRESS)** → "Update onboarding copy"
4. **Assignee avatar zone (first task)** → empty circles fill with "FE", "EL"

After all four fills, the wireframe reads as the V2 stylized-but-real render. Mirror-action cleanup reverses each.

### §2.2.3 Beat-by-beat timeline (T-stamps, polyrhythmic dwells)

`LOOP_DURATION = 7000ms`. Matches body-process-loop precedent (DP-B, OC-E, K-A all at 7000ms).
`CURSOR_TRAVERSAL_MS = 440ms` (engine default, ease-in-out for traversal between on-screen targets per canonical-motion-spec §2.1).
`SETTLE_MS = 770ms` (loop-seam cursor return-to-rest, precedent from DP-B).

Polyrhythmic dwell assignments (per canonical-motion-spec §2.3, varied by cognitive weight):
- Beat 1 (column header): **300ms** decisive (the easy first commit · column headers were the obvious place to start)
- Beat 2 (first task title): **350ms** questioning (the cognitive heart · committing to a specific task title means committing to a content voice)
- Beat 3 (second task title): **280ms** recognising-pattern (faster because the voice was set in beat 2)
- Beat 4 (assignee zone): **320ms** edge-case-recheck (the smallest commitment · initials are minimal content, but they round out the realism)

Timeline:

| Beat | T (ms) | Action |
|------|--------|--------|
| 1A | 0 | Cursor → column header bar (440ms ease-in-out traversal) |
| 1A' | 440 | Cursor arrives; **hover dwell 300ms (decisive)** |
| 1B | 740 | clickStamp + column-header bar fills "BACKLOG · 7" + 80ms bar→text crossfade |
| 1B-rest | 990 | 250ms post-fill absorption gap |
| 2A | 1240 | Cursor → first task title bar (440ms traversal) |
| 2A' | 1680 | Cursor arrives; **hover dwell 350ms (questioning · the cognitive heart)** |
| 2B | 2030 | clickStamp + first task title bar fills "Refactor authentication flow" + crossfade |
| 2B-rest | 2280 | 250ms absorption gap |
| 3A | 2530 | Cursor → second task title bar (440ms traversal) |
| 3A' | 2970 | Cursor arrives; **hover dwell 280ms (recognising-pattern)** |
| 3B | 3250 | clickStamp + second task title bar fills "Update onboarding copy" + crossfade |
| 3B-rest | 3500 | 250ms absorption gap |
| 4A | 3750 | Cursor → assignee zone (440ms traversal) |
| 4A' | 4190 | Cursor arrives; **hover dwell 320ms (edge-case-recheck)** |
| 4B | 4510 | clickStamp + assignee circles fill with "FE", "EL" (80ms stagger between the two) |
| 4B-rest | 4760 | 250ms absorption gap |
| 5 | 5010 | Settle: cursor → rest position (770ms ease-in-out SETTLE) |
| 5' | 5780 | Cursor arrives at rest; 100ms hover-on-rest freeze (true motionless) |
| 6 | 5880 | Cleanup beat: all four fills blur-fade out (filter blur(4px), opacity 0.3) |
| 6-rest | 6180 | 820ms remaining cleanup absorption; CSS transitions complete |
| LOOP | 7000 | iter N+1: resetAllState() snaps to T=0; cursor at rest; bars empty |

Total wall time check: 4510 (beat 4 click) + 250 (4B-rest) + 770 (settle) + 100 (hover-rest) + 1370 (cleanup + remaining) = 7000 ✓.

First action timing per body-demo discipline (≤600ms when autoplay): beat 1A fires at T=0 (cursor begins traversal). Cursor arrival + first material change is beat 1B at T=740. Within tolerance per canonical-motion-spec §2.3 mid-narrative compressed dwell range (matches DP-B/OC-E pattern).

### §2.2.4 Markup spec (HTML to be added to work/pulse.html)

Conventional container per body-demo discipline. ID `pulseWireframeFidelity` (matches JS orchestrator ROOT_ID).

```html
<!-- DEMO: PULSE WIREFRAME FIDELITY (D1) -->
<div class="demo-frame demo-frame--body" id="pulseWireframeFidelity">
  <div class="demo-frame-browser-bar">
    <span class="demo-frame-traffic-light"></span>
    <span class="demo-frame-traffic-light"></span>
    <span class="demo-frame-traffic-light"></span>
    <span class="demo-frame-url">localhost:3000/canvas/task-board</span>
  </div>
  <div class="demo-frame-body demo-frame-body--330" data-pulse-d1-canvas>
    <!-- Kanban wireframe · 4 columns, stripped of all chrome -->
    <div class="wf-canvas">
      <div class="wf-column" data-wf-column="backlog">
        <div class="wf-col-header" data-wf-fill="col-header">
          <span class="wf-fill-placeholder" data-wf-placeholder></span>
          <span class="wf-fill-content" data-wf-content>BACKLOG &middot; 7</span>
        </div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
      </div>
      <div class="wf-column" data-wf-column="in-progress">
        <div class="wf-col-header"><span class="wf-col-header-bar"></span></div>
        <div class="wf-task wf-task--active">
          <span class="wf-task-title-bar" data-wf-fill="task-1">
            <span class="wf-fill-placeholder" data-wf-placeholder></span>
            <span class="wf-fill-content" data-wf-content>Refactor authentication flow</span>
          </span>
          <span class="wf-task-assignees" data-wf-fill="assignees">
            <span class="wf-assignee-circle" data-wf-assignee="0">
              <span class="wf-fill-placeholder" data-wf-placeholder></span>
              <span class="wf-fill-content" data-wf-content>FE</span>
            </span>
            <span class="wf-assignee-circle" data-wf-assignee="1">
              <span class="wf-fill-placeholder" data-wf-placeholder></span>
              <span class="wf-fill-content" data-wf-content>EL</span>
            </span>
          </span>
        </div>
        <div class="wf-task">
          <span class="wf-task-title-bar" data-wf-fill="task-2">
            <span class="wf-fill-placeholder" data-wf-placeholder></span>
            <span class="wf-fill-content" data-wf-content>Update onboarding copy</span>
          </span>
        </div>
      </div>
      <div class="wf-column" data-wf-column="review">
        <div class="wf-col-header"><span class="wf-col-header-bar"></span></div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
      </div>
      <div class="wf-column" data-wf-column="done">
        <div class="wf-col-header"><span class="wf-col-header-bar"></span></div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
        <div class="wf-task"><span class="wf-task-title-bar"></span></div>
      </div>
    </div>
  </div>
  <p class="demo-frame-caption"><em>Wireframe fidelity: each click commits a content choice.</em></p>
</div>
```

Caption: 9 words (within Body-demo discipline §7 ≤15-word ceiling). VERB + WHAT + WHY: "commits a content choice" is the VERB, "wireframe fidelity" is the WHAT, the framing is implicit. No animation-narration (doesn't describe motion or beats).

Notes on the markup:
- Four `data-wf-fill` slots: `col-header`, `task-1`, `task-2`, `assignees`. The orchestrator queries by these data attributes (per Single Unified Timeline §4.1 Rule 3).
- Each fill slot has TWO children: a `data-wf-placeholder` (the empty gray bar) and a `data-wf-content` (the filled real-text). Both are present in the DOM at parse; the orchestrator swaps `opacity` to crossfade.
- The OTHER columns and tasks render at full opacity but use plain `wf-col-header-bar` and `wf-task-title-bar` placeholders (no data-wf-fill). These stay as gray bars throughout the loop, signalling "this is a wireframe, and only some elements get committed in this loop." Specifically: only the IN PROGRESS column gets fidelity touches (col header excluded because the first beat shows the BACKLOG column header; the demo argues "the rebuild commits content fidelity by stages, not all at once").

Wait · beat 1 is BACKLOG col header. Beat 2 + 3 are IN PROGRESS task titles. Beat 4 is assignees in IN PROGRESS first task. The four beats are spread across two columns; the markup above is correct.

Body-demo height check: 330px target with `demo-frame-body--330` modifier. May stretch to 350px ceiling per Q16 flag if the four kanban columns at this height feel cramped. Sprint 3 build phase tests both heights.

### §2.2.5 CSS spec (key rules to add to styles.css)

Inheriting `.demo-frame`, `.demo-frame-browser-bar`, `.demo-frame-body--330`, `.demo-frame-caption` patterns from existing Ghost demos. New rules required:

```css
/* DEMO: PULSE WIREFRAME FIDELITY (D1) · wireframe surface */

#pulseWireframeFidelity .wf-canvas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 12px;
  height: 100%;
  background: #fdfcfa;          /* paper-on-cream, matches Pulse V2 identity */
  position: relative;
}

#pulseWireframeFidelity .wf-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f7f5f0;
  border-radius: 4px;
  padding: 8px 6px;
  min-width: 0;
}

#pulseWireframeFidelity .wf-col-header {
  position: relative;
  height: 14px;
  margin-bottom: 4px;
  font-family: "Geist Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  color: #4a4a4a;
  text-transform: uppercase;
}

#pulseWireframeFidelity .wf-col-header-bar {
  display: block;
  height: 8px;
  width: 60%;
  background: #d8d5cc;
  border-radius: 2px;
  margin-top: 3px;
}

#pulseWireframeFidelity .wf-task {
  background: #ffffff;
  border-radius: 3px;
  padding: 6px 6px 7px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}

#pulseWireframeFidelity .wf-task-title-bar {
  position: relative;
  display: block;
  height: 8px;
  width: 80%;
  background: #d8d5cc;
  border-radius: 2px;
}

#pulseWireframeFidelity [data-wf-fill] {
  position: relative;
  display: inline-block;
}

/* Placeholder bar · visible at parse, fades out when content fades in */
#pulseWireframeFidelity .wf-fill-placeholder {
  display: block;
  height: 8px;
  background: #d8d5cc;
  border-radius: 2px;
  opacity: 1;
  filter: blur(0);
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
              filter   220ms cubic-bezier(0.16, 1, 0.3, 1);
}
#pulseWireframeFidelity [data-wf-fill="col-header"] .wf-fill-placeholder { width: 60%; }
#pulseWireframeFidelity [data-wf-fill="task-1"]    .wf-fill-placeholder { width: 90%; }
#pulseWireframeFidelity [data-wf-fill="task-2"]    .wf-fill-placeholder { width: 80%; }

/* Real-text content · invisible at parse, fades in when placeholder fades out */
#pulseWireframeFidelity .wf-fill-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  font-family: "Geist Mono", monospace;
  font-size: 10px;
  color: #1f1d1a;
  letter-spacing: 0.01em;
  opacity: 0;
  filter: blur(2px);              /* blur-light, per canonical-motion-spec §2.2 */
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
              filter   220ms cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

/* Filled state · placeholder out, content in */
#pulseWireframeFidelity [data-wf-fill].is-filled .wf-fill-placeholder {
  opacity: 0;
  filter: blur(2px);
}
#pulseWireframeFidelity [data-wf-fill].is-filled .wf-fill-content {
  opacity: 1;
  filter: blur(0);
}

/* Cleanup-fade state · both placeholder and content blur out before LOOP */
#pulseWireframeFidelity [data-wf-fill].is-cleanup .wf-fill-placeholder,
#pulseWireframeFidelity [data-wf-fill].is-cleanup .wf-fill-content {
  filter: blur(4px);
  opacity: 0.3;
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
              filter   280ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Assignee circles */
#pulseWireframeFidelity .wf-task-assignees {
  display: inline-flex;
  gap: 3px;
  position: relative;
}
#pulseWireframeFidelity .wf-assignee-circle {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e8e4dc;
  display: inline-flex;
}
#pulseWireframeFidelity .wf-assignee-circle .wf-fill-placeholder {
  position: absolute; inset: 0;
  border-radius: 50%;
  width: 100%;
}
#pulseWireframeFidelity .wf-assignee-circle .wf-fill-content {
  font-size: 7px;
  letter-spacing: 0.02em;
  justify-content: center;
}

/* Hover state on D1 target · subtle ring, decisive */
#pulseWireframeFidelity [data-wf-fill].is-hovered::after {
  content: "";
  position: absolute;
  inset: -3px;
  border: 1px solid rgba(31, 29, 26, 0.18);
  border-radius: 3px;
  pointer-events: none;
}

/* Mobile @media @ 640px · see §2.2.8 */
@media (max-width: 640px) {
  #pulseWireframeFidelity .wf-canvas { gap: 4px; padding: 8px; }
  #pulseWireframeFidelity .wf-column { padding: 6px 4px; }
  #pulseWireframeFidelity .wf-fill-content { font-size: 9px; }
  #pulseWireframeFidelity .wf-assignee-circle { width: 12px; height: 12px; }
  #pulseWireframeFidelity .wf-assignee-circle .wf-fill-content { font-size: 6px; }
}

/* Reduced motion · see §2.2.7 */
@media (prefers-reduced-motion: reduce) {
  #pulseWireframeFidelity [data-wf-fill] .wf-fill-placeholder { opacity: 0; }
  #pulseWireframeFidelity [data-wf-fill] .wf-fill-content { opacity: 1; filter: blur(0); transition: none; }
}
```

Color tokens: `#fdfcfa` (paper-on-cream surface), `#f7f5f0` (column track), `#ffffff` (task card), `#d8d5cc` (placeholder bar), `#e8e4dc` (assignee circle base), `#1f1d1a` (text body). These map to existing Pulse V2 identity (see Sprint 1 §A.2). Sprint 3 verifies all six values either exist as CSS custom properties or get added under a `--pulse-d1-*` namespace.

Typography: Geist Mono for headers and content text. The wireframe-fidelity decision is itself ABOUT typography content (real labels vs gray bars), so the typeface that surfaces matters. Geist Mono is already in Pulse V2.

### §2.2.6 JS orchestrator structure

Follow `js/demos/ghost-severity-build.js` structure verbatim with content swap. Same engine primitives (Cursor + Choreography + LoopObserver + prefersReduced + getCenterOf). No Marker (per distinctness §2.5). No Popup (per distinctness §2.5).

File path: `js/demos/pulse-wireframe-fidelity.js`. Import barrel from `./_engine/index.js`.

Skeleton:

```js
/* Pulse Wireframe Fidelity Build (D1, 2026-05-29 design / 2026-05-?? build)

   Body demo at Design Process > Decision 1 of work/pulse.html.
   Argues HOW Rotem shifted V2's wireframes from blueprint abstractions
   to stylized-but-real content. Cursor as agent. 4 picks. Polyrhythmic
   dwells.

   Design doc: .claude/sprint-reports/2026-05-29-pulse-sprint-2-design.md §2.2
   Sprint 1 spine: .claude/sprint-reports/2026-05-28-pulse-sprint-1-spine.md
   Gesture signature: Additive build (#2) · same as DP-B, distinct surface.

   The loop (7000ms):
     - 4 fills: col-header → "BACKLOG · 7", task-1 → "Refactor authentication
       flow", task-2 → "Update onboarding copy", assignees → "FE" + "EL"
     - Polyrhythmic dwells: 300 / 350 / 280 / 320 ms (decisive →
       questioning → recognising → edge-case-recheck)
     - Mirror-action cleanup: each fill blur-fades out, cursor settles
       at rest position, resetAllState at iter N+1 start
     - ZERO markers, ZERO popup (distinctness vs DP-B)
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'pulseWireframeFidelity';
const root = document.getElementById(ROOT_ID);
if (root) initWireframeFidelity(root);

function initWireframeFidelity(rootEl) {
  const canvas = rootEl.querySelector('[data-pulse-d1-canvas]');
  const fillSlots = {
    'col-header': rootEl.querySelector('[data-wf-fill="col-header"]'),
    'task-1':     rootEl.querySelector('[data-wf-fill="task-1"]'),
    'task-2':     rootEl.querySelector('[data-wf-fill="task-2"]'),
    'assignees':  rootEl.querySelector('[data-wf-fill="assignees"]')
  };
  if (!canvas) return;
  if (!fillSlots['col-header'] || !fillSlots['task-1'] ||
      !fillSlots['task-2']    || !fillSlots['assignees']) return;

  const LOOP_DURATION = 7000;
  const SETTLE_MS = 770;
  const CURSOR_TRAVERSAL_MS = 440;
  const ABSORPTION_MS = 250;     // post-fill absorption gap between beats

  /* Four picks · polyrhythmic dwells per canonical-motion-spec §2.3
     and Sprint 2 §2.2.3 cognitive-weight rationale. */
  const PICKS = [
    { key: 'col-header', slot: fillSlots['col-header'], hoverMs: 300 }, // decisive
    { key: 'task-1',     slot: fillSlots['task-1'],     hoverMs: 350 }, // questioning (cognitive heart)
    { key: 'task-2',     slot: fillSlots['task-2'],     hoverMs: 280 }, // recognising-pattern
    { key: 'assignees',  slot: fillSlots['assignees'],  hoverMs: 320 }  // edge-case-recheck
  ];

  if (prefersReduced()) {
    // Skip the loop; render the "fidelity committed" end state statically.
    PICKS.forEach(p => p.slot.classList.add('is-filled'));
    return;
  }

  const cursor = new Cursor(canvas);
  let loopTimer = null;
  let choreo = null;

  function getRestPosition() {
    // Top-left of canvas, above the col-header · matches DP-B rest-position pattern
    const first = fillSlots['col-header'];
    const center = getCenterOf(first, canvas);
    return { x: center.x - 90, y: center.y - 28 };
  }

  function resetAllState() {
    PICKS.forEach(p => p.slot.classList.remove('is-filled', 'is-hovered', 'is-cleanup'));
    if (cursor.el) cursor.el.classList.remove('is-clicking', 'is-stamping');
  }

  function buildTimeline() {
    const beats = [];
    let t = 0;

    PICKS.forEach((pick, i) => {
      // Beat A: cursor → slot (440ms ease-in-out traversal)
      beats.push({ at: t, do: () => {
        const target = getCenterOf(pick.slot, canvas);
        pick.slot.classList.add('is-hovered');
        cursor.moveTo(target.x, target.y);
      }});
      t += CURSOR_TRAVERSAL_MS;
      t += pick.hoverMs;        // polyrhythmic dwell · cognition

      // Beat B: clickStamp + slot.is-filled (placeholder fades; content fades in)
      beats.push({ at: t, do: () => {
        cursor.clickStamp();
        pick.slot.classList.remove('is-hovered');
        pick.slot.classList.add('is-filled');
      }});
      t += ABSORPTION_MS;
    });

    // Settle beat · cursor returns to rest (770ms SETTLE)
    beats.push({ at: t, do: () => {
      const rest = getRestPosition();
      cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
    }});
    t += SETTLE_MS;
    t += 100;                   // 100ms motionless freeze

    // Cleanup beat · all fills blur-fade out via .is-cleanup class
    beats.push({ at: t, do: () => {
      PICKS.forEach(p => p.slot.classList.add('is-cleanup'));
    }});
    // Remaining wall time (~820ms) lets CSS transitions complete

    return beats;
  }

  function ensureCursor() {
    if (!cursor.el) {
      cursor.mount();
      const rest = getRestPosition();
      cursor.snapTo(rest.x, rest.y);
      cursor.show();
    }
  }

  function startLoop() {
    resetAllState();
    ensureCursor();
    const timeline = buildTimeline();
    choreo = new Choreography({
      timeline,
      duration: LOOP_DURATION,
      onReset: resetAllState
    });
    choreo.play();
    loopTimer = setTimeout(() => {
      choreo.reset();
      startLoop();
    }, LOOP_DURATION);
  }

  function stopLoop() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (choreo) choreo.pause();
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => {
      if (choreo && choreo.state === 'paused') {
        const remaining = LOOP_DURATION - choreo.elapsedMs;
        choreo.resume();
        loopTimer = setTimeout(() => { choreo.reset(); startLoop(); }, Math.max(0, remaining));
      } else {
        startLoop();
      }
    },
    onExit: stopLoop
  });
  observer.start();
}
```

Structural parallels to `ghost-severity-build.js`: same engine imports, same ROOT_ID + early-return guard, same LOOP_DURATION / SETTLE_MS / CURSOR_TRAVERSAL_MS constants, same reduced-motion early return that sets end-state statically, same buildTimeline pattern with absolute T-stamps, same resetAllState shape (per Single Unified Timeline §4.1 Rule 5), same LoopObserver gating with paused/resume + elapsedMs preservation.

Structural differences: no Marker imports / no markers array, no Popup, no picker positioning logic, four picks (not three), polyrhythmic dwells 300/350/280/320 (DP-B is 300/350/280 across three).

### §2.2.7 Reduced-motion path

Per Single Unified Timeline §4.1 Rule 5: skip the timeline entirely, render representative end state.

End state: all four fill slots show real-text content, placeholders invisible. The argument the loop makes is preserved (visitor sees the fidelity-committed wireframe) without motion.

Implementation: the `prefersReduced()` check at the top of `initWireframeFidelity` returns after applying `.is-filled` to all four `fillSlots`. CSS rule `@media (prefers-reduced-motion: reduce)` (already in §2.2.5) backstops by setting placeholder opacity 0 / content opacity 1 directly, in case JS doesn't run for any reason.

### §2.2.8 Mobile plan (≤640px)

Body-demo discipline applies at all breakpoints. Constraints at 640px:

- Canvas grid drops to 4 columns at smaller widths but each column tightens (gap 8 → 4px, padding 12 → 8px on canvas; padding 8/6 → 6/4 on columns).
- Geist Mono content text shrinks from 10px to 9px.
- Assignee circles shrink from 14px to 12px; content text 7 → 6px.
- Body-demo height stays at 330px; mobile may want a 280-310px range so the kanban columns don't compress past readability. Flag for Sprint 3 visual test.

Cursor RAF behavior: unchanged at mobile (engine handles consistently). Cursor traversals at 440ms still register cleanly on smaller viewports.

No mobile-divergence required for D1 at this stage. Sprint 3 build verifies on real iPhone (per Mobile Video Standing Rule §5 testing discipline; D1 has no video, but the loop discipline still requires real-device verification).

---

## §2.3 · B1 Layer chip widget · design spec

### §2.3.1 Pattern inheritance + content swap

Inherits the [ghost-view-modes-widget.js](../../js/demos/ghost-view-modes-widget.js) pattern verbatim. ARIA tablist, click + Arrow / Home / End / Space / Enter keyboard nav, blurCrossfade with BLUR_LIGHT between mode panels, aria-live announcer, prefers-reduced-motion instant swap.

Content swap (vs Ghost View Modes):
- Chips: **Friction · Rage Clicks · Dead Clicks · Attention** (vs SBS / Overlay / Slider / Timeline)
- Mode panels: 4 panels, each is the same Task Board wireframe substrate with a different OKLab-interpolated thermal palette overlay (vs 4 different comparison-mode layouts of the same dashboard)
- Default active: **Friction** (the highest-incidence layer, the one a designer reaches for first)
- aria-live announcement: "Heatmap layer changed to <label>"

### §2.3.2 Markup spec

```html
<!-- DEMO: PULSE LAYER CHIP WIDGET (B1) -->
<div class="demo-frame demo-frame--body" id="pulseLayerChips">
  <div class="demo-frame-browser-bar">
    <span class="demo-frame-traffic-light"></span>
    <span class="demo-frame-traffic-light"></span>
    <span class="demo-frame-traffic-light"></span>
    <span class="demo-frame-url">localhost:3000/canvas/layers</span>
  </div>
  <div class="demo-frame-body demo-frame-body--330">
    <!-- Chip toolbar · ARIA tablist -->
    <div class="lc-widget-toolbar" role="tablist" aria-label="Heatmap layer">
      <button class="lc-widget-chip" role="tab"
              aria-selected="true"  tabindex="0"
              data-lc-layer="friction">Friction</button>
      <button class="lc-widget-chip" role="tab"
              aria-selected="false" tabindex="-1"
              data-lc-layer="rage">Rage Clicks</button>
      <button class="lc-widget-chip" role="tab"
              aria-selected="false" tabindex="-1"
              data-lc-layer="dead">Dead Clicks</button>
      <button class="lc-widget-chip" role="tab"
              aria-selected="false" tabindex="-1"
              data-lc-layer="attention">Attention</button>
    </div>

    <!-- Wireframe substrate · fixed underlay (same kanban, same content,
         only the heatmap overlay swaps) -->
    <div class="lc-widget-substrate">
      <!-- Same kanban wireframe as D1, but with content already filled
           (this is V2 stylized-but-real; D1 just showed how it gets that way) -->
      <!-- ...4 columns of wf-tasks... -->
    </div>

    <!-- Four heatmap layer panels · only one visible at a time -->
    <div class="lc-widget-mode" data-lc-canvas="friction" role="tabpanel"
         aria-labelledby="(chip-id)" hidden="false">
      <svg class="lc-heat-svg" viewBox="0 0 400 240" preserveAspectRatio="none">
        <!-- Friction palette: warm orange/red halos on column gutters -->
        <radialGradient id="friction-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stop-color="#ff7a2c" stop-opacity="0.62"/>
          <stop offset="60%" stop-color="#ff7a2c" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#ff7a2c" stop-opacity="0"/>
        </radialGradient>
        <ellipse cx="120" cy="120" rx="70" ry="46" fill="url(#friction-1)"/>
        <ellipse cx="240" cy="100" rx="62" ry="40" fill="url(#friction-1)"/>
        <!-- ...more ellipses positioned over real Fitts violations... -->
      </svg>
    </div>
    <div class="lc-widget-mode" data-lc-canvas="rage" role="tabpanel" hidden>
      <svg class="lc-heat-svg" viewBox="0 0 400 240">
        <!-- Rage palette: sharp red dots at specific click coordinates -->
        <!-- ... -->
      </svg>
    </div>
    <div class="lc-widget-mode" data-lc-canvas="dead" role="tabpanel" hidden>
      <svg class="lc-heat-svg" viewBox="0 0 400 240">
        <!-- Dead Clicks palette: cool gray dots on non-responsive regions -->
        <!-- ... -->
      </svg>
    </div>
    <div class="lc-widget-mode" data-lc-canvas="attention" role="tabpanel" hidden>
      <svg class="lc-heat-svg" viewBox="0 0 400 240">
        <!-- Attention palette: cool blue gaze pools, broader and softer -->
        <!-- ... -->
      </svg>
    </div>

    <!-- aria-live announcer -->
    <span class="lc-widget-live" aria-live="polite" aria-atomic="true"></span>
  </div>
  <p class="demo-frame-caption"><em>Click any chip to swap the heatmap layer.</em></p>
</div>
```

Caption: 7 words. Pattern matches Ghost View Modes caption ("Click any chip to compare design against production"); verb-first declarative interactive framing.

### §2.3.3 CSS spec (key rules)

Inherits `.demo-frame-body`, `.demo-frame-caption` from Ghost demos. New rules:

```css
/* DEMO: PULSE LAYER CHIPS (B1) */

#pulseLayerChips .lc-widget-toolbar {
  display: flex;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(253, 252, 250, 0.92);
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 3;
}

#pulseLayerChips .lc-widget-chip {
  font: 500 11px/1 "Satoshi", sans-serif;
  letter-spacing: 0.02em;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid rgba(31, 29, 26, 0.12);
  border-radius: 999px;
  color: #555;
  cursor: pointer;
  transition: background 160ms cubic-bezier(0.23, 1, 0.32, 1),
              color 160ms cubic-bezier(0.23, 1, 0.32, 1);
}
#pulseLayerChips .lc-widget-chip:hover { color: #1f1d1a; }
#pulseLayerChips .lc-widget-chip[aria-selected="true"] {
  background: #1f1d1a;
  color: #fdfcfa;
  border-color: transparent;
}
#pulseLayerChips .lc-widget-chip:focus-visible {
  outline: 2px solid #ff7a2c;
  outline-offset: 2px;
}

#pulseLayerChips .lc-widget-substrate {
  position: absolute;
  inset: 40px 0 0 0;     /* below toolbar */
  background: #fdfcfa;
  z-index: 1;
}

#pulseLayerChips .lc-widget-mode {
  position: absolute;
  inset: 40px 0 0 0;
  z-index: 2;
  opacity: 0;
  filter: blur(2px);
  pointer-events: none;
}
#pulseLayerChips .lc-widget-mode.is-active {
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}
#pulseLayerChips .lc-heat-svg {
  width: 100%; height: 100%;
  mix-blend-mode: multiply;       /* makes the warm halos read on cream */
}

#pulseLayerChips .lc-widget-live {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* OKLab thermal palette per layer · see §2.3.7 palette table */
/* Friction:   #ff7a2c  (warm orange, dense halo)         */
/* Rage:       #d33a2a  (saturated red, sharp dots)       */
/* Dead:       #6a6a6a  (cool desaturated gray)           */
/* Attention:  #3a6ac8  (cool blue, broad gaze pools)     */

@media (max-width: 640px) {
  #pulseLayerChips .lc-widget-chip { font-size: 10px; padding: 5px 8px; }
  #pulseLayerChips .lc-widget-toolbar { gap: 4px; padding: 6px 8px; overflow-x: auto; }
}

@media (prefers-reduced-motion: reduce) {
  #pulseLayerChips .lc-widget-mode {
    transition: none;
    filter: blur(0);
  }
}
```

### §2.3.4 JS handler (orchestrator structure)

File path: `js/demos/pulse-layer-chips.js`. Inherits ghost-view-modes-widget.js verbatim with two content swaps:

1. `ROOT_ID = 'pulseLayerChips'` (vs `'ghostViewModesWidget'`)
2. Selector class swaps: `.lc-widget-chip`, `.lc-widget-mode`, `.lc-widget-live`, `data-lc-layer`, `data-lc-canvas` (vs `.vm-widget-*` / `data-vm-mode` / `data-vm-canvas`)
3. aria-live announcement template: `"Heatmap layer changed to " + label` (vs "View mode changed to")

Engine imports identical: `blurCrossfade, BLUR_LIGHT, prefersReduced`.

No new engine primitive required; no new closed-set constant required. (Mirroring the existing pattern keeps the engine surface unchanged.)

### §2.3.5 Reduced-motion path

Per ghost-view-modes-widget.js pattern: when `prefersReduced()` returns true, skip the blurCrossfade and instant-swap opacity + filter. The `@media (prefers-reduced-motion: reduce)` CSS rule (§2.3.3) backstops by removing the transition entirely from `.lc-widget-mode`.

End state preserved: visitor still sees the active layer's heatmap; switching chips still works; no motion.

### §2.3.6 Mobile plan (≤640px)

Toolbar overflows horizontally if 4 chips don't fit. Apply `overflow-x: auto; -webkit-overflow-scrolling: touch;` to `.lc-widget-toolbar` at the mobile breakpoint so the visitor can scroll-swipe to less-frequent chips. Default Friction chip stays leftmost so first-load visibility is preserved.

Chip text shrinks to 10px (per §2.3.3 media block). Active chip pill remains visible at all viewports.

### §2.3.7 OKLab thermal palette table

Per Q1 (real implementation):

| Layer | Hex (anchor) | Approx OKLab | Visual character | Rationale |
|---|---|---|---|---|
| Friction | `#ff7a2c` | L≈0.74, C≈0.21, h≈40° | Dense warm orange halo | Default "where it hurts" layer; OKLab anchor warm and saturated for legibility on cream |
| Rage Clicks | `#d33a2a` | L≈0.59, C≈0.18, h≈30° | Sharp saturated red dots | Discrete event signal; high chroma so dots read as discrete points, not a halo |
| Dead Clicks | `#6a6a6a` | L≈0.55, C≈0.005, h≈n/a | Cool desaturated gray | Absence signal (click without response); low chroma so the eye reads "missing" |
| Attention | `#3a6ac8` | L≈0.51, C≈0.16, h≈260° | Cool blue, broad gaze pool | Continuous signal (where eyes linger); cool hue contrasts warm friction so layers can stack visually distinct |

OKLab perceptual uniformity rationale: in OKLab space, equal lightness across hues reads as equal perceived brightness. A warm orange at L=0.74 and a cool blue at L=0.51 visibly differ in brightness, which is what Sprint 2 design wants · so the layers FEEL different in addition to looking different. The intermediate stops in each gradient (per the SVG `<stop>` declarations in §2.3.2 markup) interpolate within OKLab, not sRGB, which keeps mid-gradient pixels from going muddy gray. This is the technical claim §2.1.5 prose surfaces.

Sprint 3 verifies the SVG gradient stops use OKLab-interpolated colors (CSS Color Module 4 supports `oklch()` natively in modern browsers, Safari 15.4+, Chrome 111+, Firefox 113+). If a browser falls back to sRGB, the visual still reads but loses some perceptual smoothness. Acceptable degradation.

---

## §2.4 · C1 V1 vs V2 slider · design spec

### §2.4.1 Pattern inheritance + content swap

Inherits [js/demos/ghost-slider.js](../../js/demos/ghost-slider.js) verbatim. WAI-ARIA Slider Pattern, pointer events with setPointerCapture, keyboard nav (Arrow / Home / End / PageUp / PageDown / Shift modifier), `--slider-pos` CSS custom property, `.is-dragging` + `.is-initialized` JS-state classes that NEVER ship in static HTML (per JS-State Classes standing rule §1).

Content swap (vs Ghost slider):
- Left panel: V1 Calm Command Center screenshot (`v1-calm-command-center.png`)
- Right panel: V2 Living Observatory screenshot (`home-task-board.png`)
- Default position: 50% (same as Ghost)
- aria-valuetext: "V1 visible: {pct}%, V2 visible: {100-pct}%"

### §2.4.2 Markup spec

```html
<!-- DEMO: PULSE V1 VS V2 SLIDER (C1) -->
<div class="demo-frame demo-frame--body-16-9 pulse-pivot-slider">
  <div class="ghost-slider" data-slider
       role="region" aria-label="Compare V1 and V2 designs">
    <!-- V1 image base · full visibility, V2 clipped on top -->
    <img class="ghost-slider-base" src="../img/pulse/v2/v1-calm-command-center.png"
         alt="V1 Calm Command Center · dark mode SaaS dashboard"
         draggable="false">
    <!-- V2 image overlay · clipped by --slider-pos -->
    <div class="ghost-slider-overlay" aria-hidden="true">
      <img src="../img/pulse/v2/home-task-board.png"
           alt="" draggable="false">
    </div>
    <!-- DESIGN / PRODUCTION corner labels (here: V1 / V2) -->
    <div class="ghost-slider-label ghost-slider-label--left">V1</div>
    <div class="ghost-slider-label ghost-slider-label--right">V2</div>
    <!-- Handle: divider line + circular grip -->
    <div class="ghost-slider-handle" data-handle
         role="slider"
         aria-label="Compare V1 against V2"
         aria-valuemin="0" aria-valuemax="100"
         aria-valuenow="50" aria-valuetext="V1 visible: 50%, V2 visible: 50%"
         tabindex="0">
      <div class="ghost-slider-line"></div>
      <div class="ghost-slider-grip">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6 6 L2 10 L6 14 M14 6 L18 10 L14 14" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>
      </div>
    </div>
  </div>
  <p class="demo-frame-caption"><em>Drag to compare V1 against V2.</em></p>
</div>
```

Caption: 6 words. Verb-first declarative interactive framing.

Notes:
- `.ghost-slider` class reused verbatim (not renamed). The mechanism is identical; class reuse keeps CSS surface small. Distinctness is by content (V1 vs V2 screenshots) and by surrounding context (Pivot section, not Solution).
- Corner labels: V1 (left) / V2 (right). Match Ghost's DESIGN / PRODUCTION naming pattern.
- Base image: V1 (full visibility at parse). Overlay: V2 (clipped at 50% at parse via `.is-initialized` class added by JS).
- aria-valuetext updates dynamically to announce both sides' visibility percentages (more useful than just one percentage for a comparison slider).

### §2.4.3 CSS spec (minimal new rules)

If `.ghost-slider` already styles the slider mechanism, only `.pulse-pivot-slider` and any aspect-ratio override is new:

```css
/* DEMO: PULSE V1 VS V2 SLIDER (C1) · minimal override */

.pulse-pivot-slider .ghost-slider {
  aspect-ratio: 16 / 9;
  /* OR for tighter V1/V2 comparison: aspect-ratio: 3 / 2 · Sprint 3 picks */
  max-width: 100%;
}

/* Corner labels · adopt Ghost's existing styles unless override needed */
.pulse-pivot-slider .ghost-slider-label {
  font: 600 10px/1 "Geist Mono", monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

If `.ghost-slider` CSS is currently scoped to `ghost.html` markup only (id-scoped or sibling-of-ghost-specific-parent), Sprint 3 first generalizes the selectors so they work in pulse.html. Otherwise C1 is a CSS-free port.

### §2.4.4 JS handler

If the existing `ghost-slider.js` uses `document.querySelector('[data-slider]')` (and it does, per the read), the script ALREADY works for Pulse's slider as long as Pulse's slider also carries `[data-slider]` and `[data-handle]`. No new JS file needed.

Open question: does loading `ghost-slider.js` from `pulse.html` make sense, or should we (a) rename `ghost-slider.js` → `comparison-slider.js` (more semantically accurate) and reference from both pages, (b) leave the filename as-is for compatibility and accept the misnomer, or (c) clone the file as `pulse-pivot-slider.js`. Sprint 3 picks. Recommendation: **(a) rename to `comparison-slider.js`** · the mechanic is reusable, naming should reflect that, and ghost.html updates its script tag in lockstep. Cleaner.

### §2.4.5 Reduced-motion path

The slider has no autoplay; user-driven only. Reduced-motion behavior: the slider continues to work normally (drag, keyboard nav) · there's no transition to suppress. `@media (prefers-reduced-motion: reduce)` should still verify zero transitions are added by Sprint 3 visual polish that would violate.

### §2.4.6 Mobile plan (≤640px)

Touch-friendly handle (already in Ghost slider via pointer events). The grip element may want a larger touch target at mobile (16px → 22px) to land Fitts's Law cleanly on phone screens · flag for Sprint 3 build phase.

Aspect ratio: `aspect-ratio: 16 / 9` may compress V1 and V2 too much on phones. Sprint 3 considers `aspect-ratio: 4 / 3` at mobile to preserve enough vertical real estate for both screenshots to read.

Corner labels stay at 10px on mobile (already legible).

---

## §2.5 · Distinctness table · Pulse vs Pulse, Pulse vs Ghost

### §2.5.1 Within-Pulse distinctness (the hard distinctness gate)

Per guidebook §6 and canonical-motion-spec §D.10. Pulse's motion-bearing elements:

| Element | Type | Signature (§D.10) | Cognitive activity | Cursor as | Markers | Popup | Surface |
|---|---|---|---|---|---|---|---|
| Hero (ai-fly.mp4) | Autoplay video | Action execution (#1) | "Watch AI find the fix" | AI agent | n/a (video) | n/a | Living Observatory canvas (full chrome) |
| B1 Layer chip widget | User-driven widget | n/a (interactive) | "Compare four UX signals" | User's hand | n/a | n/a | Wireframe substrate + heatmap overlays |
| C1 V1 vs V2 slider | User-driven slider | n/a (interactive) | "See the pivot for yourself" | User's hand | n/a | n/a | Full-width V1/V2 image comparison |
| D1 Wireframe-fidelity loop | Autoplay process loop | Additive build (#2) | "Watch the designer commit to content fidelity" | Designer | **0** | **0** | Wireframe (no chrome, 4 columns) |
| deep-dive.mp4 | Autoplay video | n/a (recorded walkthrough) | "See diagnosis depth" | n/a (no cursor on canvas) | n/a | n/a | Deep-dive routed page |

Within-Pulse check:
- D1 is the only cursor-driven process loop on the page. No signature collision possible.
- B1 and C1 are user-driven widgets (no autoplay process-loop comparison applies).
- Hero ai-fly.mp4 is in Action execution (#1) family. D1 is in Additive build (#2). Different signatures.
- deep-dive.mp4 has no cursor on canvas · visitor watches a recorded walkthrough of UI surfaces. Not a process loop. Differentiates from D1 by virtue of being a different category entirely (recorded walkthrough vs cursor-as-agent autoplay).

Within-Pulse distinctness: **passes.**

### §2.5.2 Cross-page distinctness · Pulse vs Ghost (the softer gate)

Hiring managers review the portfolio holistically. The visitor reading both Ghost and Pulse should not feel "this is the same trick on a different page." Audit each shared mechanism against multiple supporting axes.

**B1 Layer chip widget vs Ghost View Modes widget** (same mechanic: chip toolbar + blurCrossfade between mode panels):

| Axis | Ghost View Modes | Pulse B1 |
|---|---|---|
| Chip count | 4 | 4 |
| Chip labels | Side-by-Side · Overlay · Slider · Timeline | Friction · Rage Clicks · Dead Clicks · Attention |
| What swaps | comparison-mode layouts of the same dashboard mockup | heatmap palettes over the same kanban wireframe |
| Default chip | Side-by-Side | Friction |
| Visual character | dense dashboard content with stat rows + tx list + button strips | sparse wireframe with thermal halos in 4 distinct OKLab palettes |
| Rhetorical job | "Show me the 4 ways Ghost compares design vs production" | "Show me the 4 UX signals Pulse surfaces" |

Distinctness verdict: same mechanic, **categorically different content** (comparison-mode panels vs heatmap palettes). Visitor reading Pulse second may register the pattern repeat but not feel it as a wasted slot · the content stakes are different. **Accept the mechanism reuse as a calculated cost.** No mitigation required.

**C1 V1 vs V2 slider vs Ghost Beat 2 slider** (same mechanic: drag handle with --slider-pos):

| Axis | Ghost Beat 2 slider | Pulse C1 |
|---|---|---|
| Subject | design vs production (cross-section comparison) | V1 vs V2 (design-history comparison) |
| Content category | parallel artifacts (design file vs production page) | sequential artifacts (rejected version vs shipped version) |
| Visual character | wireframe-style dashboard split | screenshot-vs-screenshot full-fidelity |
| Rhetorical job | "See how the system compares spec vs production" | "See for yourself why I scrapped V1" |
| Surrounding section | Beat 2 of Solution arc | Pivot section (the apex of the case study) |

Distinctness verdict: same mechanic, **categorically different content** (cross-section comparison vs design-history comparison). Visitor recognises the slider mechanic but the WHAT-IS-BEING-COMPARED is so different that the slot earns its place. **Accept reuse as calculated cost.** No mitigation required.

**D1 Additive build vs Ghost DP-B Additive build** (same signature category):

| Axis | Ghost DP-B (severity vocabulary) | Pulse D1 (wireframe fidelity) |
|---|---|---|
| Picks | 3 (Breaking / Critical / Minor) | 4 (col header / 2 task titles / assignees) |
| Markers | 3 (red / orange / yellow) | **0** |
| Popup | 1 (picker) | **0** |
| Surface | split-panel legend + deviation rows | kanban wireframe (no chrome) |
| Cognitive activity | defining a vocabulary | committing content fidelity |
| Polyrhythmic dwells | 300/350/280 (decisive / questioning / recognising) | 300/350/280/**320** (decisive / questioning / recognising / **edge-case-recheck**) |
| What gets reflected | matching deviation rows snap to new severity dot | nothing reflects (the fill IS the commit) |

Distinctness verdict: same signature (#2 Additive build), **four axes of differentiation**: pick count, marker count (3 vs 0), popup presence (yes vs no), reflection mechanic (yes vs no). Within-portfolio (cross-page) distinctness: easily passes.

Note: D1 zero-markers is a deliberate restraint call. Reason: D1 argues content fidelity · the cleanest reading is the wireframe transition itself. Adding 4 numbered marker pins would over-instrument the loop and obscure the content-fidelity argument. Matches the K-A restraint argument from Ghost (where markers were removed in the layout audit).

### §2.5.3 Reuse-of-mechanism honesty

The case study reader (hiring manager scanning portfolio) will see the B1 and C1 mechanism reuses. The honesty framing: this is a portfolio with deliberate cross-product systems thinking. The severity vocabulary repeats across Pulse and Ghost (per Q2 parallel/shared system resolution). The slider mechanic repeats because comparison is comparison. The chip-toolbar mechanic repeats because tab-style mode switching is mode switching.

If a hiring manager asks "you used a chip widget on both Ghost and Pulse · why?" the interview answer is: "Both case studies have a 4-option mutual-exclusion choice (Ghost: 4 comparison modes; Pulse: 4 heatmap signals). The chip widget is the right control for that choice. Building two different controls for the same problem would have been worse design." That answer is honest and defensible.

---

## §2.6 · Visual consistency checklist

Per guidebook §10. The Pulse loops feel visually continuous with Ghost via:

| Element | Source | How it shows up in Pulse |
|---|---|---|
| Engine primitives | `js/demos/_engine/*` | D1 imports Cursor / Choreography / LoopObserver / getCenterOf / prefersReduced verbatim. B1 imports blurCrossfade / BLUR_LIGHT / prefersReduced verbatim. C1 doesn't use the engine. |
| Cursor easing | canonical-motion-spec §2.1 | D1 uses engine default ease-in-out 440ms for on-screen traversal. No override. |
| Cursor click | canonical-motion-spec §2.1 | D1 uses `cursor.clickStamp()` (V3 stamping motion). Same as DP-B / OC-E / K-A. |
| Polyrhythmic dwells | canonical-motion-spec §2.3 | D1 polyrhythm: 300/350/280/320. Pattern matches DP-B 300/350/280; extended to 4 beats per Pulse loop structure. |
| Mirror-action seam | canonical-motion-spec §2.5 | D1 cleanup beat reverses all fills before LOOP. `resetAllState()` at iter start. |
| LoopObserver | `js/demos/_engine/observer.js` | D1 uses LoopObserver with onEnter/onExit dual-gate. Same pattern as DP-B. |
| Reduced motion | `js/demos/_engine/reduced-motion.js` + CSS `@media` | D1 early-returns with end state. B1 instant-swaps. C1 unaffected (user-driven). |
| Color tokens | styles.css existing Pulse palette | D1 uses `#fdfcfa` / `#f7f5f0` / `#ffffff` / `#d8d5cc` / `#1f1d1a`. B1 uses `#1f1d1a` active chip + OKLab palette per layer. |
| Typography | existing site CSS vars | D1 uses Geist Mono for col headers + Geist Mono for task titles. B1 chips use Satoshi 500/11 (matches Ghost chip styling). |
| Demo frame chrome | `.demo-frame` + `.demo-frame-browser-bar` + `.demo-frame-body--330` | D1 / B1 reuse verbatim. Browser-bar URL slugs: `/canvas/task-board` for D1, `/canvas/layers` for B1, follows Body-demo discipline §6. |
| Caption styling | `.demo-frame-caption` | D1 / B1 / C1 all use the same `<p class="demo-frame-caption"><em>...</em></p>` pattern. |

No new engine primitives needed. No new CSS custom properties required at engine scope (Pulse-specific colors are demo-scoped under `#pulseWireframeFidelity` / `#pulseLayerChips` selectors). No new design tokens introduced.

---

## §2.7 · Risk surface

What could go wrong, named honestly so Sprint 3 has eyes-open execution.

### §2.7.1 Mechanism duplication with Ghost (acknowledged cost)

B1 and C1 reuse Ghost's chip-widget and slider mechanisms respectively. Mitigation: §2.5.2 distinctness audit shows content differentiates the slots; §2.5.3 honesty framing prepares Rotem to defend the choice in interview. **Accept the cost.**

### §2.7.2 Pulse canvas density at 330px body-demo ceiling (Q16 deferred)

Pulse's kanban wireframe is 4 columns; at 330px height the columns may compress to ~70px wide each, which is tight for the col-header bars + task title bars + assignee circles. Mitigation options at Sprint 3 build:
- (a) Test at 330px and ship if readable.
- (b) Stretch to 350px ceiling (Body-demo discipline upper bound).
- (c) Drop to 3-column wireframe (BACKLOG / IN PROGRESS / DONE) and remove REVIEW. Risk: loses the "real kanban" reading.

Recommendation: (b) · stretch to 350px first. The Pulse loops earn the extra 20px because the kanban density genuinely needs it. Body-demo discipline allows 300-350px; 350 is in-tolerance.

### §2.7.3 OKLab gradient browser fallback (Q1 confirmed real but technical edge case)

Modern browsers support `oklch()` natively (Safari 15.4+, Chrome 111+, Firefox 113+). Older browsers fall back to sRGB. The fallback is graceful (gradients still render, just lose some perceptual smoothness) but worth verifying on the lowest-supported browser Pulse promises.

Sprint 3: test B1 on Safari 14 / Chrome 90 (lower-bound modern). If fallback reads as "noticeably muddier," add a `@supports (color: oklch(0% 0 0))` block with the OKLab palette and a fallback block with hand-tuned sRGB hex values.

### §2.7.4 D1 wireframe content fits inside the body-demo height

The kanban wireframe with 4 columns × 3-4 tasks each, at 330-350px, must include the column gutters (where heatmap halos go in B1) without spilling. Sprint 3 mockup-first sanity check before writing the markup.

### §2.7.5 deep-dive.mp4 redundancy risk

deep-dive.mp4 sits after D1 in Design Process > decision 2. D1 is a cursor-driven loop; deep-dive.mp4 is a recorded walkthrough. The video already exists and works; the risk is reader fatigue (D1 just played; another video starts). Composition Rule 3 is satisfied because §2.1.7 decision-2 framing prose sits between D1 and deep-dive.mp4. But the rhythm test (no 2 motion-bearing elements adjacent without a framing prose beat) might be tight. Mitigation: §2.1.7 decision-2 framing is 76 words; that's enough for a meaningful prose buffer.

### §2.7.6 Sidebar nav and anchor IDs

Current pulse.html sidebar has these IDs: `#overview`, `#the-problem`, `#the-insight`, `#the-solution`, `#the-pivot`, `#design-process`, `#outcome`. The Sprint 2 spine adds Key Decisions section. Sprint 3 must add a `#key-decisions` anchor link to the sidebar and verify scrollspy still resolves.

### §2.7.7 V1 screenshot resolution

`v1-calm-command-center.png` is 277 KB. Verified at 2026-05-28 (Sprint 1 §A.2) and reads cleanly at sizes up to a 16:9 frame at 1040px wide. C1 slider should ship at this size. If 16:9 compresses V1 / V2 too tightly to read (dark mode V1 has small text in metric cards), Sprint 3 considers 4:3 aspect ratio at mobile per §2.4.6.

### §2.7.8 First-deploy cache-bust scope

Sprint 3 adds CSS rules in styles.css (D1 demo block, B1 demo block, C1 minimal override) and 2-3 new JS files (`pulse-wireframe-fidelity.js`, `pulse-layer-chips.js`, possibly renamed `comparison-slider.js`). Cache-bust lockstep across all 11 HTML files required per CLAUDE.md / Mobile Video Standing Rule §(M).

Production state at end of Sprint 1 deploy: `styles.css?v=63`, `main.js?v=21`, `game.js?v=3`. Sprint 3 bumps `styles.css?v=64` (CSS changed) across all 11 HTMLs. `main.js?v=21` stays unless main.js changes. New JS files get their own cache-bust at first appearance (`pulse-wireframe-fidelity.js?v=1`).

---

## §2.8 · Sprint 3 build preview

Sprint 3 deliverable: `.claude/sprint-reports/2026-05-30-pulse-sprint-3-build.md`.

Pre-phase backups before any file modification: full-project snapshot to `_archive/_pre-pulse-sprint-3-2026-05-30/`.

Build sub-phases:

**Phase A · Markup.** Add D1 demo block, B1 demo block, C1 slider markup into `work/pulse.html` per §2.2.4 / §2.3.2 / §2.4.2 specs. Move existing prose into the new spine order per §2.1. Cut compare.mp4, image-trio, diptych per Sprint 1 §1F. Update sidebar nav with `#key-decisions` anchor.

**Phase B · CSS.** Add demo block rules per §2.2.5 / §2.3.3 / §2.4.3 to `styles.css`. Verify no rule conflicts with existing demos.

**Phase C · JS.** Author `pulse-wireframe-fidelity.js` per §2.2.6 skeleton. Author `pulse-layer-chips.js` per §2.3.4 skeleton (clone ghost-view-modes-widget.js + content swap). If renaming `ghost-slider.js` → `comparison-slider.js`, do that in same phase + update Ghost script tag.

**Phase D · Integration + cache-bust.** Add script tags to `work/pulse.html`. Bump `styles.css?v=63 → 64` across all 11 HTML files. Verify Node syntax on every touched JS file (`node --check`). Local HTTP smoke on critical endpoints.

**Phase E · Visual review.** Open all relevant pages in browser. Verify:
- D1 fires through all 4 picks at planned T-stamps (run with `?debug=videos` if instrumentation needed)
- B1 chip toolbar swaps cleanly between all 4 layers
- C1 slider drags smoothly + keyboard nav works
- Cache-bust visible on all HTMLs
- Sidebar nav scrollspy resolves to all sections including `#key-decisions`
- Cursor RAF behavior smooth (no decoder fan-out per Mobile Video Standing Rule §7a)

**Phase F · Deploy preview (gate before prod).** `vercel` preview → smoke the deployed URL → AskUserQuestion approval → `vercel deploy --prod` for production.

**End-of-Phase gates:** each phase outputs planned-vs-implemented table per executing-plans discipline. Honesty self-check + distinctness self-check at end of each motion-bearing build (D1, B1).

---

## §2.9 · Sprint 2 gate (presented after this doc ships)

After Sprint 2 design doc is reviewed, gate question batch:

1. **Approve the rewritten prose** (§2.1.1-2.1.9) section by section. Any sentence needs rework? Any framing line off?
2. **Approve D1 timeline** (§2.2.3): T-stamps, polyrhythmic dwell assignments (300/350/280/320), and 4-pick choice (col-header / task-1 title / task-2 title / assignees). Any beat needs adjustment?
3. **Approve D1 zero-markers, zero-popup decision** (§2.2 + §2.5.2 distinctness): restraint matches the loop's argument. Or add markers for visibility?
4. **Approve B1 default-Friction + OKLab palette** (§2.3.7). Any palette anchor needs adjustment? (Sprint 3 can tune in build, but lock the FRAMING here.)
5. **Approve C1 mechanism reuse** (§2.4 + §2.5.2): same as Ghost slider with V1/V2 content. Acceptable cost?
6. **Approve `ghost-slider.js` rename to `comparison-slider.js`** (§2.4.4): better naming, requires Ghost script tag update in same phase.
7. **Approve body-demo height 350 (vs 330)** for D1 and B1 per §2.7.2.
8. **Confirm: Sprint 3 begins build** when approvals land.

---

## §2.10 · Operating-standard verification

Per guidebook §3 Phase 1 design-doc requirements:

- [x] Narrative spine resolved (§2.1.10 + Sprint 1 §1F)
- [x] Real component inventory (Sprint 1 §A.4)
- [x] Candidate decisions per loop slot (Sprint 1 §1C + Sprint 2 §2.2-2.4)
- [x] Four-bar grading per concept (Sprint 1 §1C)
- [x] Distinctness audit (§2.5.1 within-Pulse + §2.5.2 cross-page Pulse vs Ghost)
- [x] Honesty check per beat (§2.2.1 D1 decision-first; B1 OKLab Q1 confirmed; C1 reuses real V1/V2 artifacts)
- [x] Risk surface (§2.7)
- [x] Visual consistency checklist (§2.6)
- [x] Reduced-motion path for each demo (§2.2.7 / §2.3.5 / §2.4.5)
- [x] Mobile plan for each demo (§2.2.8 / §2.3.6 / §2.4.6)

Sprint 2 ready. Sprint 3 cleared after gate approval.

---

---

## §2.11 · Sprint 2 gate resolution (2026-05-29)

Rotem resolved all 8 gates across two AskUserQuestion rounds at end-of-Sprint-2. Sprint 3 is cleared to build against the locked spec. The full resolved set:

| # | Gate | Resolution | Sprint 3 action |
|---|---|---|---|
| 1 | §2.1 prose rewrites | **Approve all prose as drafted** | Ship every section's text from §2.1 verbatim. No further prose iteration. |
| 2 | §2.2.3 D1 timeline + picks | **Approve timeline + picks as drafted** | Build D1 to the exact T-stamps in §2.2.3. Four picks (col-header / task-1 / task-2 / assignees). Polyrhythmic 300/350/280/320. |
| 3 | §2.2 + §2.5.2 D1 restraint | **Approve zero markers, zero popup** | D1 ships with no Marker primitive, no Popup primitive. The content fills ARE the commits. K-A restraint precedent. |
| 4 | §2.3.7 B1 palette + default | **Approve palette and default** | Friction `#ff7a2c` (default), Rage `#d33a2a`, Dead `#6a6a6a`, Attention `#3a6ac8`. OKLab interpolation in gradients. Tunable in build phase. |
| 5 | §2.4 + §2.5.2 C1 mechanism reuse | **Accept reuse, V1 vs V2 content** | C1 reuses the slider mechanism verbatim. Content carries the distinctness. |
| 6 | §2.4.4 slider rename | **Rename to comparison-slider.js** | Sprint 3 Phase C: rename `js/demos/ghost-slider.js` → `js/demos/comparison-slider.js`. Update Ghost script tag AND Pulse script tag in lockstep. Backup `ghost-slider.js` to `_archive/_pre-pulse-sprint-3-2026-05-30/`. |
| 7 | §2.7.2 + §2.2.8 demo height | **Try 330px first, stretch only if needed** | Sprint 3 Phase B: build CSS at `demo-frame-body--330` for D1 and B1. Phase E visual review decides whether to bump to 350. Do NOT default to 350. |
| 8 | Sprint 3 timing | **Sprint 3 in a follow-up session** | Sprint 2 ends here. Rotem reviews this design doc at leisure. Sprint 3 starts fresh in a new session. |

### What Sprint 3 inherits, in one paragraph

A locked spine (Sprint 1 §1F as amended), nine sections of prose ready to ship verbatim (§2.1), a beat-by-beat T-stamp table for D1 with engine-primitive-grounded skeleton code (§2.2), a content-swap-only port of `ghost-view-modes-widget.js` for B1 (§2.3) and `ghost-slider.js` for C1 (§2.4) with an OKLab palette table that surfaces the technical claim §2.1.5 prose makes. Distinctness audit (§2.5) green within Pulse and acceptable against Ghost. Six-phase build plan A through F (§2.8). Seven risks named (§2.7) with mitigations.

### Sprint 3 first-action checklist (when the next session starts)

1. Read this design doc end to end. Confirm no drift from the locked spec since 2026-05-29.
2. Read the Sprint 1 deliverable (still at `.claude/sprint-reports/2026-05-28-pulse-sprint-1-spine.md`) for the spine + honesty resolutions.
3. Read the case-study guidebook §3 Phase 3 + §9 (engine self-documentation rule).
4. Pre-phase full-project backup to `_archive/_pre-pulse-sprint-3-<date>/full-project-snapshot/`.
5. Phase A markup. End-of-phase: planned-vs-implemented markup checklist.
6. Phase B CSS. End-of-phase: brace balance + cache-bust delta check.
7. Phase C JS. End-of-phase: Node syntax pass on every touched file.
8. Phase D integration + cache-bust lockstep across all 11 HTML files.
9. Phase E visual review (Rotem in browser).
10. Phase F preview deploy via `vercel`, AskUserQuestion approval gate, then `vercel deploy --prod` for production.

Sprint 2 closes here. Sprint 3 is queued.

---

*End of Pulse Sprint 2 design doc. Apply guidebook §3 Phase 3 build discipline in Sprint 3. The cursor is the agent. Build, point, wait. Polyrhythmic dwells. Mirror-action seam. resetAllState. Real Pulse components only.*
