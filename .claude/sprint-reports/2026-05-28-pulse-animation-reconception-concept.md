# Pulse Animation Reconception · Concept Doc

**Date:** 2026-05-28 (loop set approved 2026-05-29)
**Status:** Decisions LOCKED. This is the rationale record for the approved four-loop set. The buildable spec is `2026-05-29-pulse-animation-reconception-spec.md`.
**Replaces:** Pulse Sprint 3 (rejected at Phase E).
**Bar:** Ghost. Build, point, wait. Every motion element is the designer's hand on a real component, interview-defensible in 30 seconds.

---

## 1. Why Sprint 3 failed, restated

One structural reason, not three: only 1 of 4 motion elements showed Rotem's hand (hero = AI, layer chips = viewer, slider = viewer, only D1 = designer). The slider also argued no comparable delta. Frames stretched (a build-quality issue, fixed by the spec's right-sizing rule).

**The standing rule this enforces:** at least half of a page's motion-bearing elements are cursor-as-designer process loops. The approved set lands at 75%.

---

## 2. The principle

A cursor-as-designer loop: the cursor is Rotem making a real design decision on a real Pulse component. The wait carries the cognition, the click is the decision, the material change is the consequence. The hero is the one sanctioned exception (it shows the product). Reuse the engine verbatim; every loop traces to a Ghost precedent.

---

## 3. The approved four-loop set

| Section | Loop | Signature | Cursor as | Argues |
|---|---|---|---|---|
| Hero | ai-fly (untouched) | #1 Action execution | AI / product | "Ask Pulse, it flies to the issue." |
| Solution | D1 wireframe fidelity | #2 Additive build | Designer | "I made the Observatory's content real." |
| Pivot | Subtractive collapse | #3 Subtractive whole-element fade | Designer | "I scrapped the conventional dashboard." |
| Design Process | Annotate-execute | #5 Annotate-and-delegate | Designer | "I built Pulse with my two-Claude method." |

Four motion-bearing loops, three the designer's hand, four cleanly distinct signatures. With the two body videos demoted to static evidence, the page reads at 75% cursor-as-designer. The four-act in render order: Pulse runs (hero) → I made its substrate real (Solution) → I scrapped the conventional version (Pivot) → here is my method (Design Process). Closing on the method beat is the strongest founding-designer signal and ties to the Process page.

---

## 4. Why each loop, and what it beat

**Hero · ai-fly (#1).** The sanctioned product opener. Untouched. Showing the product in motion is correct for a hero; the body loops carry the designer's hand.

**Solution · D1 wireframe fidelity (#2).** Decision: "I made the Living Observatory's wireframes stylized-but-real so the heatmap reads as analysis." D1 was the one Sprint 3 loop that passed the four bars; we keep its proven logic and re-home it from Design Process to Solution. Two reasons: the Observatory is the Solution, so substrate fidelity belongs there; and it solves the Solution-slot problem the original concept doc flagged. Sprint 1 had rejected Solution-area loops (A1 as a feature tour, A2 as Pulse's algorithm), so the original recommendation was prose-only. D1 escapes that trap because it is content craft, not a feature tour, and it gives the prose-heavy top half a cursor-as-designer beat. Precedent: DP-B.

**Pivot · subtractive collapse (#3).** Decision: "I scrapped the conventional dashboard." Replaces the rejected slider (which was the viewer's hand and argued no delta). The cursor clears three named pieces of V1 monitoring furniture (health ring, severity pills, sparkline) and the V2 canvas resolves where they were. Beat OC-E's mechanic. Considered alternatives: consolidation (#5, more literally honest but higher build risk) and a static diptych (restraint fallback). Subtractive won for legibility plus a proven precedent. Honesty: the three cleared elements are real V1 components V2 dropped; the loop dramatizes what was cut, the K-A / OC-E stylization.

**Design Process · annotate-execute (#5, new signature).** Decision: "I built Pulse with my two-Claude method: I annotate a component, Claude Code executes." This loop does double duty no other does: a real Pulse design decision plus a demonstration of the AI-augmented workflow, Rotem's sharpest founding-designer signal for 2026. It is a new gesture signature, distinct from the hero (the hero is the product executing for a user; this is Rotem directing his build tool). Buildable from shipped pieces: the `Popup` primitive is the Benji annotation mechanic (it cites `2026-05-25_benji-componentization-philosophy.md` and types a note at Benji's pace), and the execute half is the hero's cascade. Honest and accurate: Pulse was built in Claude Code (confirmed against the files), and the Process page documents the method. The one design challenge is keeping the Claude Code panel visually distinct from Pulse's product UI so no viewer mistakes it for a Pulse feature; the spec solves this with a distinct panel treatment plus framing prose.

---

## 5. Distinctness and honesty

Four distinct signatures (#1, #2, #3, #5), no within-page collision. Cross-page reuse of #2 (D1 / DP-B) and #3 (Pivot / OC-E) is the soft gate, acceptable. Honesty per loop: D1 fully defensible; Pivot defensible with the what-was-cut framing; annotate-execute defensible and tool-accurate. Prose guardrail: avoid the "12 phases / 60fps / built-both-then-merged" overclaims.

---

## 6. The sprint architecture

- **Build-step-zero (done):** rolled the working tree to the clean `v=63` baseline; preserved the D1 module as reference.
- **Concept (this doc):** decisions locked.
- **Spec (`2026-05-29-pulse-animation-reconception-spec.md`):** the full buildable specification, all four loops, beat tables, right-sizing, build sequence.
- **Build (Sprint 3, portfolio chat):** markup, CSS, JS, integration, visual review, deploy.

---

## 7. Resolved at the gate (2026-05-29)

- Solution slot: D1 re-homed here (was: prose-only or a forced loop). Resolved.
- Pivot: subtractive collapse (was: vs consolidation vs static). Resolved.
- Design Process: the annotate-execute loop (was: D1). Resolved.
- Section order: kept; the page closes on the method beat.
- Body videos: demote both to static (confirm they are product demos).
- Tooling honesty: Claude Code, confirmed against the files. The Lovable association was a memory error, retracted.

---

*End of concept doc. Approved four-loop set, locked 2026-05-29. See the spec for build detail.*
