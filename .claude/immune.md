# Immune system — read ONLY at pre-commit / pre-surface review. Never during builds.

Scan the diff against these historical failures:
1. Em dash in user-facing prose (grep "—\|&mdash;")
2. Cache-bust not bumped in lockstep across ALL html after CSS/JS change
3. <video> missing any of 7 attributes, or .mov container, or VFR/High-profile encode
4. JS-state class (.active/.open/.revealed) shipped in static HTML
5. New animation: 0%≠100% keyframes (seam skip); linear cursor easing; non-compositor property animated
6. .case-image-trio with ≠3 children; prose narrating a demo after it
7. CSS appended with unbalanced braces / dangling selector before @media
8. Screenshot verification skipped, or captured single frame instead of loop series
9. Reduced-motion path missing on new animation
10. Other Work thumbnails diverging from homepage bento implementation
11. nowrap text without measured fit across 320-1440px viewports
12. New "for every video/element" JS loop without viewport scoping
13. Mobile viewport blowout: fixed-width/no-shrink children or nowrap text expand the LAYOUT viewport (page opens zoomed on phones). min-content propagates up width:100% chains PAST overflow:hidden; transform:scale does NOT change the layout box. Real fixes: min-width:0 on every column level, or scale-fit (main.js applyScaleFit: child absolute + measured against document width). Probe: window.innerWidth>375 at 375 device. (2026-06-10)
- 2026-06-10b: overflow-x:clip MASKS over-wide content (vw=375 but .case-content 412/482, right edge silently cut). After any mobile fix, assert .case-content width == 375, not just documentElement.clientWidth.
