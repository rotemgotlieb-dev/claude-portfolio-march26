# Case study page rules (READ BEFORE editing any work/*.html content or layout)

## Composition (applies to every reorder/build)
- Prose that introduces a visual sits BEFORE it. Never animation-narration after.
- No two looping visuals adjacent — framing text beat between.
- Every looping demo gets a framing line above; optional caption below.
- After any reorder: walk top-to-bottom, verify each element vs its NEW neighbors.
- Anchor links + sidebar nav must still resolve.

## Hero (case-study opener)
- Position 1 above-fold = strongest single visual artifact, not prose. Video > static.
- Hero caption ≤15 words. Hero artifact must NOT repeat in body.
- .case-hero-image needs BOTH img and video CSS rules (mirror sizing).
- .case-hero-demo has 76px top padding (clears fixed 60px nav — don't regress).

## Body demos (Benji discipline)
- ~330px frame, browser-bar chrome with REAL url, ONE component per demo, wireframe bars + strategic real text only, 6-10s loop, caption ≤15 words italic.
- Reuse real data when replacing an image: extract its hex values/labels/steps verbatim.

## Image layout protocol
- Text edits NEVER authorize image-layout changes. .case-image-trio = exactly 3 children. Never silently convert trio↔full-width — ask.
- Image divs are siblings between sections (exception: Outcome footer image).

## Copy
- EM DASH BAN (— and &mdash;) in all user-facing prose. Replace: period > comma > parens > colon. Verify: grep -c "—\|&mdash;" work/*.html index.html → 0.
- Cross-surface thumbnails: homepage bento and Other Work cards use the SAME implementation (JS-injected). Never img on one + animation on the other.

## Live-product links (2026-06-10)
.case-live-link pill under the case title (accent via --live-accent inline var), target _blank + ?from=portfolio (products show a back-chip). Pulse's is staged commented-out until pulse.rotemgotlieb.com resolves.

## Copy register (2026-06-10 trim, peer-validated)
Body prose earns its place only if a founding-designer hiring manager loses something in a 60-second scan without it. Demos carry explanation; prose carries numbers, proper nouns, and one craft moment per page. Sentences ≤20 words.
