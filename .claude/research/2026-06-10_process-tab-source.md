# Process tab rebuild — source material (assembled 2026-06-10)

Status: Ghost data IN (handoff + local files distilled). Pulse data PENDING (relay out). Portfolio data IN (own history).
Build gate: start the rebuild when Pulse replies OR Rotem says go without it.

## Voice rules (from Ghost handoff, adopt for the whole tab)
Observational voice. No em dashes (use · or restructure). Banned words: leverage, ensure, passionate, seamless, intuitive, robust, holistic. Honest claims only ("prepared data" for Ghost demo). "Built solo with Claude Code" is the provenance line.

## The arc (candidate page structure — five beats, validated by Ghost chat)
1. **Prototype to product.** Ghost: 6-screen case-study prototype → real product at ghost.rotemgotlieb.com. Meridian UI built as the canon to scan.
2. **Engineering bar held in public.** TS strict, zero any, zero suppressions · 65 unit + 22 E2E (E2E also run against production) · 5 CI jobs + Lighthouse ≥0.95 all categories, 3-run median · 8-gate pre-deploy in ~35s · $0/month as enforced constraint.
3. **The launch was not clean, and that is the story.** In order: Vercel SSO 404ing every route · framework preset autodetected "Other" (build green, site dead) · deploys BLOCKED on old university git email (platform upsold a paid plan; fix was one line of free git config) · /status 500ing only in prod (localhost self-fetch). All documented on live /process page. Differentiator: proves debugging in production, not a claimed clean launch.
4. **User feedback drove the real shape.** First review: "images don't load, where is the actual tool?" → 5 shipped bugs invisible to green tests (nonexistent hero images, favicon as demo, white-on-white CSS layer bug, Times fallback from self-referential font token, dead view-mode switcher). Fix round rebuilt demo into the full product. Lesson verbatim: "tests assert existence, not pixels · every deploy now ends with a screenshot a human (or agent) actually reads."
5. **The collaboration became a designed system.** Token protocol mid-project: slim memory + trigger index + topical rules + failure memory at review time + builds manual / workflows for research. Driver was measured (workflow-built visual work burned multiples and verified worse).

## Portfolio chat's parallel beats (same arc, this repo's evidence)
- Beat 3 equivalent: the 7-iteration thumbnail spiral → tool-matching rules codified. "Verifier says PASS, user says FAIL = verify rendered output, not code."
- Beat 4 equivalent: Rotem repeating feedback 2× = signal to stop iterating and reassess the model, not iterate harder.
- Beat 5: measured efficiency results: config −94% per call, session start −99.7%, sprint shipped 8 deliverables at ~1/3 the output tokens of the failed spiral, 46/46 edits first pass.

## Role split (Ghost chat's words, cross-checked with ours — consistent)
**Rotem:** concept, specs, direction in voice notes, user-feedback interpretation, design decisions (when to ship, what to demo, voice rules), manual testing in the browser, ops (DNS, dashboards), final scope calls. Creative director + quality gate.
**Claude:** scaffolding, implementation, debugging production seams, building the quality gates themselves (pre-deploy script, banned-words grep, CI), browser verification, deploys.

## Quotable lines (verbatim from Ghost-Product learnings — strongest candidates)
1. "Wire the control or do not ship it." (dead view-switcher, shipped 2 releases)
2. "A deploy is not live until an anonymous curl says 200. The green check measures the build, not the serving path."
3. "Platform identity mismatches masquerade as paywalls. Read the error string before the upgrade button."
4. "Budgets should enforce medians, not hero runs."
5. "33 seconds for all 8 gates means I actually run it every time, instead of negotiating with myself about which checks to skip."
6. "Tests assert existence, not pixels."

## Concrete workflow moments (animation/demo candidates for the tab)
- "I wanna demo the full thing" beating the plan's thin-slice sequencing (user feedback > plan)
- The 4-bug launch-day chain, each fixed in order (could be a step-through loop)
- Green test suite vs broken rendered page (the verify-rendered-output lesson — shared by BOTH projects independently)
- The feedback-repeated-2× stop rule
- Tool-matching table: research → parallel agents · builds → manual + browser

## Numbers bank (claim only what's listed)
Ghost: 7 routes + status API · 65 unit + 22 E2E · Lighthouse ≥0.95 all categories · zero suppressions · $0/month · v0.4 prod SHA matches tag · 2-day step-1 (one day over plan).
Portfolio: 4 case pages all-built demos (no static heroes) · 3 JS-injected thumbnails · token protocol −94%/−99.7% · 46/46 trim edits first pass.
Pulse: PENDING.

## Don'ts
Do not claim Step 2 as live (Figma OAuth, live scan pipeline, components grid, WCAG report, exportable report). Ghost repo is PRIVATE · never link it. Demo = "prepared data."
