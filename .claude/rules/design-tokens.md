# Canonical design tokens (READ BEFORE styling any product surface)

## Portfolio shell
bg #FAFAF8 / #F2F1EE · text #1A1A1A→#333→#555→#888→#999 · border #E8E8E6 · radius 12px
Font: Satoshi (Fontshare) 400/500/700/900. NEVER Inter/Roboto/Arial/system.
Ease: --ease-smooth (.25,.46,.45,.94) · --ease-out-expo (.16,1,.3,1) · --ease-quint (.19,1,.22,1) · --ease-cursor (.77,0,.175,1) · --ease-spring (.34,1.56,.64,1)
Thumb tints: Lexis #E8EDF2 · Pulse #E8ECF2 · Ghost #EDE8F0 · Gote #F0EDE8

## Pulse (pulse.rotemgotlieb.com) — LOCKED
--paper #F7F6F2 · --cream #FFFDF8 · borders #DDD9CE · ink #1A1A1F
Heat: cool #6FCFBF · warm #F5B34A · hot/accent #F07856 · molten/critical #C93E3E · info #5B8CFF
Kanban: BACKLOG/IN PROGRESS/REVIEW/DONE + count badges, mono uppercase. Prompt bar: "ASK PULSE" eyebrow, cream bg, no leading icon, arrow only with text.
Heat over cream = mix-blend-mode: multiply (screen washes out).

## Ghost (ghost.rotemgotlieb.com) — LOCKED
accent #4F46E5 (hovers #4338CA/#818CF8) · ink #111827/#E8E8ED · cards #FFF/#1A1A24
Severity: breaking #EF4444(.25) · drift #F59E0B(.20) · undocumented #3B82F6(.20) · fixed #10B981(.10). 2.5px borders, NO neon. Fix-flow dots: #dc2626/#f97316/#eab308; fixed-green #22c55e/#15803d.
Forensic format: {Component} · {property}: {expected} → {found} ({delta}). Voice observational, never "wrong/broken". Mono: JetBrains.
USER VETO: no neon green markers, no bounding-box overlays on Ghost thumb.

## LexisNexis
Real ramps: Red #C70E15 · Blue #0077C8 · Gray #666666 · Green #2CA02C (+light/dark steps). Label: "LexisNexis Risk Solutions" (capitalized).
NDA: blur names + faces in any screenshot/recording; content itself OK.

## Dovetail (lxr demo)
ink #190041 · muted #73648B · surfaces #FFF/#FAFAFB/#F6F5F7 · borders #E5E2E9
Tags: orange #FF6E00/#FFE1D7/#FFEBE0 · indigo #5450FF/#E4DCFF/#EBEAFF · emerald #00784F/#E0EFEA. Sentence case, Inter-like, no mono in-frame.
