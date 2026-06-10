# Process rules (READ at session start — this replaces reading learnings.md)

## Tool selection (user-validated after the 7-iteration regression)
| Task | Tool |
|---|---|
| Research / reference sweeps | Background Workflow (research workflows always delivered) |
| From-scratch builds, fine-tuning, bug fixes | MANUAL + engine + browser-verify |
| Polish ("make nicer") | Discuss/brainstorm first, then manual |
| User repeats feedback 2× | STOP. Reassess the model. Don't iterate harder. |

## The replication recipe (kudos-validated)
1. Read source material FIRST (images→extract real data; products→read case study).
2. Pick pattern by what the animation IS (see rules/animation-build.md).
3. Use the engine. 4. One driver per coupled motion. 5. Browser-verify frame series BEFORE surfacing. 6. Measure (getBoundingClientRect probe) before fixing layout. 7. Per-section hygiene inline (em-dash, composition, captions).

## Regression smell tests (any true → stop)
- Briefs growing while user feedback stays simple
- Adding architecture when user said "go back to what worked"
- Verifier says PASS, user says FAIL (= verify rendered output, not code)
- Haven't watched the loop in a browser before sending
- Reaching for new patterns (@property, state machines) for a CSS-keyframe-sized fix

## Deploy
vercel deploy --prod --yes (project linked; aliases www.rotemgotlieb.com). .vercelignore excludes _archive/working dirs/.claude. Cache-bust v=N lockstep across all HTML first. Smoke-test live domain after.

## Git
Commit at milestones. _archive/ (15GB) stays gitignored.
