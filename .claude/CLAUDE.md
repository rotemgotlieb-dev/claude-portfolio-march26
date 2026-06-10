# .claude/CLAUDE.md — slim core (restructured 2026-06-10 for token economy; full prior version archived at .claude/archive/CLAUDE-md-archive-2026-06-10.md)

## Stack & commands
Vanilla HTML/CSS/JS, no frameworks. Single styles.css + main.js; game.js separate; demos in js/demos/ (engine primitives in js/demos/_engine/). Satoshi from Fontshare.
Run: `python3 -m http.server 8080`. Deploy: `vercel deploy --prod --yes` (aliases www.rotemgotlieb.com). Cache-bust `?v=N` lockstep across ALL html before any deploy.

## TRIGGER INDEX — read the rule file BEFORE the matching work (mandatory)
| Before… | Read |
|---|---|
| Session start / choosing tools / deploying | .claude/rules/process.md |
| Building or editing ANY animation/demo/thumbnail | .claude/rules/animation-build.md |
| Touching any `<video>` element or video file | .claude/rules/video.md |
| Editing work/*.html content, layout, heroes, copy | .claude/rules/case-study-pages.md |
| Styling any Pulse/Ghost/Lexis/Dovetail surface | .claude/rules/design-tokens.md |
| Pre-commit / pre-surface review | .claude/immune.md |
| Deep motion parameters | .claude/canonical-motion-spec.md |

## Behavioral directives (token economy)
- Be thorough in reasoning, terse in output. No preamble, no prompt restatement, no closing fluff, no unsolicited advice. Final message = outcome first, then only load-bearing detail.
- Don't re-read unchanged files. Never read .claude/archive/* wholesale. No open-ended grep/glob sweeps — go to known paths; if unknown, one targeted search.
- Pipe verbose command output through `tail`/`grep` filters; never dump raw logs.
- Screenshot budget: element-scoped clips, ≤5 frames per verification cycle (frame-series only when verifying a loop).
- Subagents/workflows: research → background Workflow; builds/fixes → manual (see rules/process.md). Log-parsing or lookup subagents → model: haiku. Never spawn a subagent for a task a single Bash call does.
- Minimize thinking depth on mechanical tasks (renames, cache-bumps, file moves).
- Suggest /clear at unrelated-task boundaries.

## Compaction rules
On auto-compact: preserve exact file paths under modification, the active error/task list, current ?v=N, and the verify state. Discard raw terminal output, superseded approaches, intermediate reasoning, old screenshots.

## Hard never-dos
Never: "Jonas" · Lorem ipsum · Inter/Roboto/system fonts · purple gradients · emoji in site shell · uniform bento cards · CSS keyframes for intro mouse · getBoundingClientRect on animated intro elements · view-tool on USB images · em dash in user-facing prose.

## Self-improvement loop (tiered — replaces old learnings.md monolith)
Durable lesson → ≤10 lines appended to the matching .claude/rules/*.md. Recurring failure → one line in .claude/immune.md. No session narratives. learnings.md is an index only.
