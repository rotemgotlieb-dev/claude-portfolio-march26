# CLAUDE.md — Rotem Gotlieb Portfolio (slim core 2026-06-10; prior version archived at .claude/archive/root-CLAUDE-md-archive-2026-06-10.md)

Personal UX portfolio, vanilla HTML/CSS/JS, live at www.rotemgotlieb.com (Vercel, project claude-portfolio-march26). Audience: founding-designer hiring managers. Aesthetic: refined editorial minimalism, monochrome shell (#FAFAF8 bg, #1A1A1A ink), projects provide the color, Satoshi only, asymmetric bento, motion is the differentiator. NOT generic, NOT AI-slop.

## Structure
index.html (hero + 2x2 bento: Lexis lead / Pulse / Gote / Ghost) · about.html · process.html · work/{lexisnexis,pulse,ghost,gotefigure}.html · styles.css (all styles) · main.js (site interactions) · game.js (footer bike game) · js/demos/ (animation modules + _engine/) · img/, images/ (site assets).
All four case studies have BUILT animated heroes/demos (no static hero images). All thumbnails are JS-injected built animations (lexisnexis-thumb.js Token Snap + repulsion · pulse-thumb-v4.js scrubber/heat · ghost-thumb-v4.js mini Fix Flow).

## Operating rules
EVERYTHING operational lives in .claude/CLAUDE.md → follow its TRIGGER INDEX (read the matching .claude/rules/*.md before animation, video, case-study, token/styling, or review work). Em dash banned in user-facing prose. Design/animation quality bar: Benji/Linear tier — when in doubt read .claude/rules/animation-build.md and imitate ghost-ai-fix-flow-hero.js.

## Contact/meta
rotem.gotlieb@gmail.com · linkedin.com/in/rotemgotlieb · local dev http://localhost:8080
