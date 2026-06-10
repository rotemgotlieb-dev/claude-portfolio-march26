# Video rules (READ BEFORE touching any <video> element or video file)

## The 7 iOS autoplay gates (ALL must pass)
1. **7 attributes on every <video>:** autoplay muted loop playsinline preload="metadata" poster aria-label. Missing any = silent iOS failure.
2. **Encoding:** H.264 Main profile, Level ≤4.0, yuv420p, 30fps CFR (`-r 30 -fps_mode cfr` load-bearing), audio stripped (`-an`), `+faststart`. Container MUST be .mp4 (not .mov).
   ffmpeg -i in.mov -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p -r 30 -fps_mode cfr -crf 24 -preset medium -movflags +faststart -an out.mp4
3. **Poster:** extract at t=0.5s (loops) / t=2s (demos): ffmpeg -i in.mp4 -ss 2 -vframes 1 -q:v 4 poster.jpg
4. **No opaque overlay at parse** (JS-state classes like .page-transition.active NEVER ship in HTML).
5. **No ancestor with opacity:0 / display:none / visibility:hidden / offscreen transform at parse.** iOS decides autoplay ONCE at parse. Fix: `.reveal:has(video) { opacity:1; transform:none; }`.
6. **Parse-time .play() for above-fold videos**, viewport-scoped via getBoundingClientRect (NEVER unscoped — decoder saturation starved cursor RAF). Canonical at main.js attemptVideoAutoplay(). readyState guard required for end-of-body scripts.
7. **Verify ffprobe on every new file:** profile=Main, level≤40, yuv420p, 30/1 CFR, faststart, no audio. Then test on REAL iPhone at deployed URL.

## Meta-gate (M): cache-bust ?v=N monotonic, ALL HTML files in lockstep, every CSS/JS change.

## IO retry (defense-in-depth)
IntersectionObserver that adds .revealed must also call video.play().catch(()=>{}) on descendants.

## JS-state classes rule
.active/.open/.visible/.loaded etc. NEVER ship in static HTML. JS applies at runtime. Audit: "structural property or runtime state?"

## will-change
Every RAF/JS-transform-animated element declares `will-change: transform` in CSS.
