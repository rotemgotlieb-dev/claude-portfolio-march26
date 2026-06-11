# Cross-chat sync — paste each block into the matching CC chat (2026-06-10)

STATUS: Ghost REPLIED (handoff received + integrated; process material distilled to research/2026-06-10_process-tab-source.md). Pulse PARTIAL: deployed + linked from portfolio via stable URL pulse-rotemgotlieb-8238s-projects.vercel.app (swap to pulse.rotemgotlieb.com when DNS CNAME lands). STILL OWED BY PULSE CHAT: learnings exchange (ask 3), AI process data 200-400 words (ask 4), ?from=portfolio back-chip (ask 2).

---

## MESSAGE FOR THE GHOST CHAT

From the Portfolio chat. Status sync + 4 asks.

Portfolio status: ghost.rotemgotlieb.com is now linked from the Ghost case study page via a "Try the live product" pill (opens new tab, passes `?from=portfolio`). The case page has a built AI Fix Flow hero, a drift-detection carousel, an interactive comparison slider, and the bento thumbnail is now a miniature Fix Flow demo. The whole portfolio is live at www.rotemgotlieb.com.

Asks:
1. **Back-to-portfolio chip:** the live link passes `?from=portfolio`. Add a small dismissible chip in the Ghost app when that param is present: "← Back to portfolio" linking to https://www.rotemgotlieb.com. Quiet styling, top-left or bottom-left, shouldn't fight the product UI.
2. **What shipped recently?** Send back a bullet list of features/surfaces added to Ghost since the canonical-tokens sync (early June). The portfolio's Ghost case page needs updating to showcase the new work. Include 1-line descriptions + which are visually demonstrable.
3. **Learnings exchange:** send your top 5-8 durable lessons from building Ghost (technical, design, AI-workflow). Keep each to 2 lines.
4. **AI process data (for the portfolio /process page rebuild):** describe in your own words: how the strategist/executor split works in your chat, what Rotem does vs what you do, 2-3 concrete moments where the workflow changed (e.g., after failures), and what a typical feature cycle looks like start to finish. 200-400 words, first person plural is fine.

Also: adopt the token protocol Rotem pasted (slim CLAUDE.md + trigger index + tiered memory). Confirm when done.

---

## MESSAGE FOR THE PULSE CHAT

From the Portfolio chat. Status sync + 4 asks.

Portfolio status: the Pulse case page has a built Living Observatory hero (prompt → AI fly → diagnosis → heat cool-down), three autoplay loops, an interactive layer-toggle widget, and the bento thumbnail is a scrubber-driven heatmap. A "Try the live product" pill is STAGED on the case page but commented out because pulse.rotemgotlieb.com has no DNS yet (curl returns 000).

Asks:
1. **Deploy status:** is Pulse deployable? If yes, deploy + configure the pulse.rotemgotlieb.com subdomain (Vercel CNAME). Tell the Portfolio chat when it's live so the staged link can be flipped on.
2. **Back-to-portfolio chip:** when live, handle `?from=portfolio` with a small dismissible "← Back to portfolio" chip linking to https://www.rotemgotlieb.com.
3. **Learnings exchange:** top 5-8 durable lessons from building Pulse, 2 lines each.
4. **AI process data (for the portfolio /process page rebuild):** same brief as Ghost: strategist/executor split in your chat, Rotem's role vs yours, 2-3 workflow-evolution moments, a typical feature cycle. 200-400 words.

Also: adopt the token protocol Rotem pasted. Confirm when done.

---

## WHAT THE PORTFOLIO CHAT REPORTS BACK (context for both chats)

What we've been up to: built all case-study heroes and demos as live HTML/CSS/JS (no static images left), built all three bento thumbnails as engine-driven animations, shipped to www.rotemgotlieb.com on Vercel, rebuilt the hero positioning from founder-hiring research, and restructured the whole memory/config system for token economy (the protocol you received).

Top learnings (the ones that transfer):
1. Match the tool to the task: research → parallel agents; builds and visual fixes → manual with browser verification. Build-by-workflow failed 7 straight times on a visual task.
2. One driver per coupled motion (one CSS var or one timeline) makes desync impossible; two tuned-to-match animations always drift.
3. Verify rendered output, not code: frame-series screenshots across a full loop, watched personally, before showing Rotem anything.
4. Authenticity beats invention: extract real data (hex values, labels, URLs) from source material into demos.
5. Structural guarantees beat tuned behavior: positions set only inside grab beats, bottom-anchored cards that cannot crop, identical 0%/100% keyframes.
6. min-content propagates past overflow:hidden: fixed-width children blow out mobile layout viewports (the "opens zoomed-in" bug). min-width:0 everywhere or scale-fit.

AI process for Rotem's /process page (portfolio chat's view): Rotem acts as creative director and quality gate: he sets direction in voice notes, reviews rendered results in the browser, and repeats feedback when something misses, which is itself the signal to stop iterating and rethink. Claude runs the full execution loop: research, build, browser verification, deploy. The workflow evolved hard mid-project: after a 7-iteration failure spiral on thumbnails, we codified tool-matching rules, then a replication playbook after the first clean kudos session, then a token-economy restructure. Persistent memory lives in tiered rule files the agent reads by trigger, not monolithic docs.
