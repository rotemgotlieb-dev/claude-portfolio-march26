# Token Optimization Protocol — SOURCE OF TRUTH (2026-06-10)

Applies to: this portfolio chat, Pulse chat, Ghost chat, and any future Claude Code project. Based on two Gemini deep-research reports (read in full) + a measured audit of this repo + our own validated workflow history. Constraint honored: we stay on the latest model + ultracode.

## 1. Why we were burning tokens (measured, this repo)

| Source | Cost | Mechanism |
|---|---|---|
| .claude/CLAUDE.md (515 lines) | ~15,600 tok | Loaded EVERY message, every session |
| root CLAUDE.md (228 lines) | ~3,300 tok | Loaded EVERY message |
| learnings.md (5,153 lines) | ~260,000 tok | Instructed read at EVERY session start |
| Build-by-workflow anti-pattern | ~5M tok over 7 failed thumb iterations | Each agent inherits the full baseline + own thinking; visual tasks can't be verified by code-reading agents |
| Frame-series screenshots | ~1-2k tok/image | Images are tokens; unscoped full-page shots waste most of it |
| Raw tool output | variable | Untailed logs/grep dumps re-billed every subsequent turn |

Key economics: output tokens cost 5× input; every output token is re-billed as input on all later turns; cache hits are 90% off, so a STABLE context (untouched config files) is nearly free while an edited one re-bills full price.

## 2. What we changed in this repo (done)

1. **Both CLAUDE.mds rewritten:** 18,900 → ~1,100 always-loaded tokens (-94%). Content not deleted — moved.
2. **Tiered memory replaces the learnings monolith:**
   - `.claude/rules/{process,animation-build,video,case-study-pages,design-tokens}.md` — topical, ≤700 tok each, loaded ONLY when the matching work happens, via a TRIGGER INDEX table in CLAUDE.md ("Before touching <video> → read rules/video.md").
   - `.claude/immune.md` — negative checklist (historical failures), read ONLY at pre-commit/pre-surface review. Mistakes don't ride along during builds.
   - `.claude/learnings.md` — 19-line index. Old monolith archived (read only to hunt a specific detail).
   - Session start now costs ~750 tok (index + process.md) instead of ~260k.
3. **Behavioral directives embedded in CLAUDE.md** (the agent self-optimizes): terse output, no preamble/restatement, no re-reading unchanged files, no open-ended grep sweeps, tail all command output, screenshot budget (element-scoped, ≤5/cycle), haiku for lookup subagents, minimal thinking on mechanical tasks, /clear suggestions at task boundaries, compaction-priority rules.
4. **New append protocol:** lessons go as ≤10 lines to the matching rules file; failures as one line to immune.md; no session narratives (git history covers it).

## 3. The standing protocol (apply in every chat)

### Memory architecture
- CLAUDE.md ≤ ~150 lines / ~1k tokens. Behavioral directives + facts the model can't infer + a TRIGGER INDEX. Nothing pedagogical, no file-by-file repo descriptions, no occasional workflows.
- Topical rules/ files loaded on demand via the trigger index. Immune (negative) knowledge isolated to review time. Archives are cold storage.
- NEVER instruct "read the whole learnings file each session."
- Keep CLAUDE.md STABLE mid-session (edits invalidate the 90% cache discount on everything after).

### Ultracode discipline (keep the power, bound the spend)
- Workflows for RESEARCH and genuinely parallel sweeps. Builds, fixes, and visual fine-tuning stay MANUAL — this is also our quality lesson, not just cost: 7 workflow build iterations failed where 1 manual pass succeeded.
- Workflow agents inherit the baseline payload → slim CLAUDE.md multiplies savings across every agent spawned.
- Lookup/log-parse subagents: model haiku. Never a subagent for a single Bash call.
- No persistent agent teams.

### Tool & session hygiene
- Tail/grep-filter all command output. No raw test/build logs into context.
- Element-scoped screenshots; frame-series only when verifying a loop; ≤5 frames per cycle.
- Targeted file reads (known paths, offset/limit); no exploratory List-Read-Filter loops.
- MCP: disable connectors unused by the project (this repo needs none; Figma/Gmail/Calendar/Drive idle schemas are pure tax in chats that don't use them).
- /clear at unrelated-task boundaries; /compact WITH focus instructions ("preserve file paths + active plan, discard terminal output"); checkpoint-rewind failed experiments instead of carrying their corpses.

### Output discipline (5× leverage since output re-bills as input)
- Outcome first, only load-bearing detail after. No greetings, restatements, hedging, or unsolicited options.
- Code comments only for constraints code can't show.

## 4. Universal CLAUDE.md block (paste into Pulse/Ghost/any project)

```
## Token economy (standing)
- Thorough reasoning, terse output. No preamble/restatement/closing fluff.
- Don't re-read unchanged files; no open-ended grep/glob; tail all command output.
- Screenshots element-scoped, ≤5 per verify cycle.
- Research → background workflow; builds/fixes → manual. Lookup subagents → haiku.
- Minimal thinking on mechanical tasks. Suggest /clear at task boundaries.
- On compaction: keep file paths, active plan, error trace; drop raw output + dead paths.
- Memory: CLAUDE.md ≤150 lines + on-demand rules/ files via trigger index; lessons appended ≤10 lines to topical files; failures to immune.md (read at review only).
```

## 5. What we deliberately did NOT adopt from the reports
- "Caveman" telegraphic prose for user-facing replies — Rotem reads these; clarity beats 10% extra savings. Applied to internal verbosity instead.
- Deleting learnings — archived, not destroyed; the knowledge validated by the kudos session is preserved in distilled form.
- Disabling thinking/effort — explicitly out of scope (we keep ultracode); we bound it behaviorally instead.

## 6. Expected impact
- Per-message baseline: −~17.8k input tokens (−94%) and far better cache stability.
- Session start: −~259k tokens (−99.7%).
- Workflow runs: every spawned agent saves the same ~17.8k baseline → multiplicative.
- Output volume: directive-driven reduction (benchmarks in the reports: 50-75% on comparable rulesets).
