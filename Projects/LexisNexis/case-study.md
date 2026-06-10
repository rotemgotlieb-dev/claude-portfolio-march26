# Bridging Design and Engineering — LexisNexis

## Metadata

- **Role:** UX Designer & Researcher
- **Timeline:** December 2024 – July 2025
- **Team:** Product managers, UX engineers, fraud analysts
- **Tools:** Figma, Dovetail, Storybook, JSON

---

## Overview

### A palette update used to take three people and a full day. I got it down to one designer and 30 seconds.

At LexisNexis Risk Solutions, I inherited a design system where Figma, Storybook, and production code spoke different languages. Designers named colors one way. Engineers named them another. Every handoff was a manual translation — and every translation introduced drift.

Over seven months, I ran the user research that shaped the product roadmap, built the prototypes that validated it, and created the token infrastructure that connected design to code for the first time. The result was a pipeline now used by every designer and engineer on two product teams.

---

## The Problem

### Two design systems. Zero shared language.

LexisNexis Risk Solutions runs ThreatMetrix, a fraud detection platform used by financial institutions worldwide. When I joined, the design org maintained two separate Figma design systems — one for Risk Narrative, one for ThreatMetrix — with no connection between them or to the codebase.

Updating a color palette meant one designer rebuilding swatches in Figma, then two UX engineers manually translating those values into Storybook and production CSS. A single palette change consumed a full working day. Names didn't match across systems, so "primary-blue" in Figma might be "brand-action" in Storybook and something else entirely in the React components.

Meanwhile, fraud analysts — the people actually using the product — had never been formally interviewed about their workflows. The dashboards they relied on daily were rigid, one-size-fits-all layouts built on assumptions, not evidence. No one had asked them what they needed.

I saw three problems woven into one: a research gap, a prototyping gap, and an infrastructure gap. Fixing any one of them in isolation wouldn't hold. The solution had to connect all three.

---

## Phase 1 — Research

### Eight interviews that rewrote the roadmap.

I started where the team hadn't: talking to the people who use the product. I conducted 8 moderated interviews with fraud analysts and brought everything into Dovetail for structured analysis — tagging pain points, feature requests, and workflow patterns across sessions.

The core finding was stark. Analysts were monitoring fraud across dozens of signals simultaneously, but the dashboard forced them into a fixed layout that didn't match how any of them actually worked. One analyst described toggling between four browser tabs because a single view couldn't show what they needed side by side.

I built a structured insight report that separated must-haves from nice-to-haves, grounding each finding in direct quotes and tagged patterns. Two rounds of iteration with the PM tightened the framing. The final report directly informed sprint planning and reshaped the product roadmap — custom layouts, template libraries, and movable widgets all trace back to this research.

---

## Phase 2 — Prototyping

### Three rounds in two weeks. Each one driven by the people who'd use it.

With the research pointing clearly at customizable dashboards, I needed to validate the concept fast — without touching production. I built an interactive Figma prototype that simulated drag-and-drop layout customization, letting analysts rearrange widgets, resize panels, and test different configurations in a controlled environment.

I ran 3 rounds of moderated testing over 2 weeks. Each round, I watched analysts interact with the prototype, noted where they hesitated or got stuck, and shipped an updated version before the next session. By the third round, users were completing tasks without guidance.

The prototype pulled spacing rules and color tokens from the pipeline work already underway, so what analysts saw in testing matched what they'd eventually see in production. PMs used the prototype to gather stakeholder buy-in without engineering resources — it became a reusable testing tool the team continued using after I moved on.

---

## Phase 3 — Token Pipeline

### One source of truth for two design systems.

I created a Figma token library with 180+ colors, each WCAG-tested for accessibility and assigned semantic aliases that described usage, not just appearance — so "surface-elevated" and "feedback-error" replaced ambiguous names like "gray-200" or "red-3."

I collaborated with a UX engineer to define the JSON export schema, making sure token names, nesting structure, and value formats would survive the trip from Figma to code without manual cleanup. We tested the export against Storybook components and iterated on the naming convention until there were zero mismatches.

The full pipeline works like this: Figma variables export as JSON design tokens. A parsing script converts those tokens into CSS files and JS config objects. Those feed into Storybook — both the style guide documentation and the styled component library — and from there into production React components. A change log keeps Figma and Storybook in bidirectional sync. The pipeline serves both the Risk Narrative and ThreatMetrix design systems through a shared atomic structure.

What previously required one designer and two engineers coordinating over a full day now takes a single designer under 30 seconds. Update the token in Figma, export, and the change propagates everywhere.

---

## Outcome

### Infrastructure that outlasts the project.

- **Palette updates: full day to 30 seconds** — a process that required 3 people now takes 1.
- **180+ WCAG-tested tokens** serving 2 design systems through a single shared architecture.
- **8 user interviews** that directly shaped the Custom Layouts product roadmap — template libraries, movable widgets, and flexible views all traced back to this research.
- **3 prototype iterations in 2 weeks** that validated the direction before a single line of production code was written.

The token pipeline became the foundation for the 2025 design system rollout across LexisNexis Risk Solutions. The prototype became a reusable testing tool. The research report is still referenced in sprint planning.

The most impactful design work is often the work users never see. But every designer and engineer on both product teams now ships faster, more consistently, and with fewer handoff errors because this infrastructure exists.
