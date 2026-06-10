# Benji Taylor autoplay-choreography decomposition

**Investigation date:** 2026-05-22
**Subjects:** benji.org/agentation (Next.js article), agentation.com (Next.js docs), benji.org/liveline (Next.js article)
**Trigger:** Before building our own autoplay-choreographed loop engine (Ghost Beat 3+4, Pulse, LexisNexis), confirm at code-level how Benji implements his autoplay demos. The May 21 investigation established the *pattern* (vanilla in-page, not video, not iframe) but left the *primitives* as open questions.
**Methodology:** [`CLAUDE.md` → Reference-portfolio investigation methodology](../../CLAUDE.md), six numbered rules. This investigation went one layer deeper than the May 21 pass — raw HTML + CSS + bundled JS chunks, not rendered markdown.

## Investigation summary

All three pages are Next.js apps sharing the same `_next/static/chunks/*` infrastructure (chunks 7047, 6047, 4964, 6329, 1127, 7918, 8083, 3761 are reused across all three). But the **demo layer** diverges sharply:

- **benji.org/agentation** is the canonical autoplay-choreography case. Uses a shared `.demo-*` class system + JS state-driven cursor positioning + CSS transitions for easing. Six section demos plus a hero demo, all sharing primitives.
- **agentation.com** is a docs site that embeds the same hero demo component (identical inline `<style>` block, identical class names) from benji.org/agentation at the top. Below the fold it is static cards, not scripted demos.
- **benji.org/liveline** uses a fundamentally different demo strategy: 17 live `<canvas>` instances of the Liveline chart component, each embedded with different props. Zero `demo-cursor` references. The user is the driver; nothing is scripted.

The most important finding for our Session 3 engine: **the scripted demo system is React state + CSS transitions, not a JS animation library.** Cursor movement is `style={{left, top}}` updated via React `setState`, with CSS handling the easing via `transition: left 0.35s cubic-bezier(.4, 0, .2, 1)`. There is no requestAnimationFrame loop driving cursor position, no Web Animations API, no GSAP/Framer Motion on the cursor. Choreography is `async function play() { setX(50); await sleep(300); setX(100); ... }`. Loop coordinator is plain `setInterval`. Tab visibility (not viewport visibility) gates execution.

This is a much smaller engine than I expected before reading the source.

---

## Per-page findings

### Page 1 — benji.org/agentation

The blog post that introduces the Agentation product. Contains one hero demo (above the fold) + six section demos (text selection, element click, multi-select, area selection, animation pause, plus the calibrating-context section).

**Cursor element.** A `<div class="demo-cursor">` (or `.hero-demo-cursor` for the hero variant — same architecture, separate class namespace because the hero ships its own inline `<style>` block) containing three SVG children in a CSS grid cell, only one visible at a time:

```html
<div class="hero-demo-cursor" style="left:280px;top:180px">
  <div class="hero-demo-cursor-pointer">
    <svg height="24" width="24" viewBox="0 0 32 32"><!-- macOS pointer SVG --></svg>
  </div>
  <div class="hero-demo-cursor-crosshair hidden">
    <svg width="17" height="17"><!-- horizontal+vertical lines --></svg>
  </div>
  <div class="hero-demo-cursor-ibeam hidden">
    <svg width="10" height="16"><!-- I-beam SVG --></svg>
  </div>
</div>
```

The cursor sits at `z-index: 100` with `pointer-events: none` so the actual mouse passes through. The pointer SVG is a classic macOS-arrow shape filled `#fff` over `#000` (drop-shadow filtered for definition over light backgrounds).

**Cursor motion mechanism.** Pure CSS transitions on `left` and `top`, driven by React inline-style updates. Source CSS (inline in the page, also in the shared stylesheet `04479d16ca5de00d.css`):

```css
.demo-cursor {
  position: absolute;
  pointer-events: none;
  z-index: 100;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              top  0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: grid;
}
.demo-cursor.dragging,
.demo-cursor.selecting { transition: none; }
.demo-cursor.dragging *,
.demo-cursor.selecting * { transition: none !important; }
```

React component (extracted from minified `7047-5e076d77278feec5.js`):

```jsx
<div className={`demo-cursor ${dragging ? 'dragging' : ''}`}
     style={{left: pos.x, top: pos.y}}>
  ...
</div>
```

So position is React state; every `setPos({x, y})` triggers a re-render, the new inline style is applied, and CSS interpolates between the old and new `left/top` over 350ms with `cubic-bezier(0.4, 0, 0.2, 1)`. During "drag" or "select" sequences the `.dragging` / `.selecting` class disables the transition so the cursor follows discrete frame updates without smoothing.

**Easing.** Three distinct curves, each used for a specific class of motion:

| Curve | Where used | Visual character |
| --- | --- | --- |
| `cubic-bezier(0.4, 0, 0.2, 1)` | Cursor `left`/`top` (350ms) | Material standard. Decelerating, neutral. |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | Popup entry, terminal entry, toolbar morph icon (200–250ms) | Back-out / overshoot. Springy. |
| `cubic-bezier(0.22, 1, 0.36, 1)` | Marker scale-in (250ms) | Ease-out-quint. Snappy stop. |
| `cubic-bezier(0.19, 1, 0.22, 1)` | Toolbar width/padding morph (400ms) | Ease-out-expo. Very long tail. |

Cursor mode crossfade (`hidden` class adds `transform: scale(0)` and `opacity: 0` on the unused cursor SVG) uses `transition: transform 0.2s ease, opacity 0.15s ease`. Plain `ease`, no custom curve.

**Popup/annotation elements.** A `<div class="demo-popup">` with three child elements:

```html
<div class="demo-popup">
  <div class="demo-popup-header">button.submit-btn</div>
  <div class="demo-popup-input">
    <span style="opacity:0.4">|</span>  <!-- caret -->
    typed text...
  </div>
  <div class="demo-popup-actions">
    <div class="demo-popup-btn cancel">Cancel</div>
    <div class="demo-popup-btn submit">Add</div>
  </div>
</div>
```

The popup is dark (`background: #1a1a1a`), `200px` wide, `border-radius: 14px`, with a layered shadow. Entry/exit:

```css
.demo-popup {
  opacity: 0;
  transform: translateX(-50%) scale(0.95) translateY(4px);
  transition: opacity 0.2s ease,
              transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.demo-popup.visible {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
```

The `translateX(-50%)` is the horizontal centering math (the popup anchors at a point and centers itself). The `scale(0.95) translateY(4px)` is the entry pose; `.visible` resolves to scale 1 / Y 0 with the back-out springy curve.

Submit button color is per-demo: `.submit` is blue (`#3b82f6`), `.submit.green` is green (`#22c55e`), `.submit.orange` is orange (`#f59e0b`). The color is chosen to match the marker color in that demo's beat.

**Numbered markers (pins).** A `<div class="demo-marker">` with a number inside:

```css
.demo-marker {
  position: absolute;
  width: 20px; height: 20px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.25s ease,
              transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.demo-marker.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.demo-marker.green { background: #22c55e; border-radius: 4px; }
```

The pin sits at its declared center via `translate(-50%, -50%)`, scales from 0.3 to 1 with ease-out-quint. The `.green` variant is square (4px radius) instead of circular — different visual signature for area-selection markers.

**Scripted typing.** Could not find character-by-character text reveal in the shared `.demo-*` system. The popup-input in the static HTML shows a single `|` caret followed by typed text — the typing must be done by React state updates ticking through a string. The bundled JS chunk `7047` has 21 `setInterval` calls and 34 `setTimeout` calls; one of those drives the typing tick. Without un-minifying, I can confirm the *mechanism* (state-driven, not CSS) but not the *exact interval*.

Inferred pattern (matches Benji's overall style):

```jsx
const [typed, setTyped] = useState('');
useEffect(() => {
  if (popupVisible) {
    let i = 0;
    const target = 'needs more padding';
    const id = setInterval(() => {
      setTyped(target.slice(0, ++i));
      if (i >= target.length) clearInterval(id);
    }, 50);  // estimated 40-60ms per character
    return () => clearInterval(id);
  }
}, [popupVisible]);
```

**Loop coordinator.** Plain `setInterval` per demo. Extracted from `7047-5e076d77278feec5.js` (minified, formatting added for clarity):

```js
// Sleep utility, used inside async sequences:
const h = e => new Promise(t => setTimeout(t, e));

// Per-demo loop (one of six similar blocks in the chunk):
const play = async () => {
  // ... sequence of setState() + await h(N) calls ...
};
play();
let i = setInterval(play, 6000);

// Tab visibility handling:
const onVisChange = () => {
  if (document.visibilityState === 'visible') {
    clearInterval(i);
    setTimeout(() => {
      play();
      i = setInterval(play, 6000);
    }, 100);
  }
};
document.addEventListener('visibilitychange', onVisChange);
return () => { clearInterval(i); document.removeEventListener('visibilitychange', onVisChange); };
```

Loop intervals observed across the chunk: 6000ms, 7000ms, 8000ms, 9000ms (varies per demo complexity). Hero demo uses `window.innerWidth <= 640 ? 14000 : 16000` — longer cycle on desktop because the demo is bigger and more elaborate; tighter on mobile.

**Play/pause on scroll.** **Does not exist.** The chunk has zero `IntersectionObserver` references for the demo loops. The `IntersectionObserver` references in chunks 1127/4964/7918 belong to Framer Motion's `useInView` hook (Framer Motion is used elsewhere on the site — headings, page transitions — but not for the demo cursors).

The only "pause" surface is `document.visibilitychange` (tab visibility). Off-screen but in-viewport demos continue ticking. This is a lighter design than I would have predicted; it works because CSS transitions are cheap and the JS state updates are infrequent (one `setState` per beat, ~6 beats per 6-second cycle = ~1 update/sec average).

**`prefers-reduced-motion` handling.** The matching `matchMedia('(prefers-reduced-motion)')` reference in chunk `1127` is inside Framer Motion's internals (governs Framer Motion's animation behaviors). The demo cursor system itself does **not** check `prefers-reduced-motion`. Users with the OS-level reduced-motion preference still see the full scripted demo. This is a gap we should close on our own implementation — our `CLAUDE.md` standing rules treat motion accessibility as required.

**Bundle estimate.**
- Inline `<style>` block in the page HTML (hero demo only): ~32 KB unminified, ~8 KB after minification. This is what gets sent with the article HTML for the hero.
- Shared CSS for the body demos: `.demo-*` selectors in `04479d16ca5de00d.css` (70 KB total stylesheet, ~6 KB of it is the demo system).
- Per-demo HTML: ~3–8 KB of inline DOM per demo (designed-down mockup + cursor + popup elements).
- JS for choreography: the demos live inside chunk `7047-5e076d77278feec5.js` (174 KB). Hard to attribute exactly because the chunk also contains other article components, but the cursor + sleep + per-demo choreography sequences are likely 15–30 KB unminified.

Total demo-system overhead for the page (CSS + JS, gzipped): on the order of **8–12 KB gzipped** for the engine, plus ~2–4 KB per individual demo's mockup HTML and choreography script. Cheap enough to make the budget irrelevant.

**External scripts.** All `_next/static/chunks/*.js` — Next.js bundled output, no third-party CDN scripts. Framer Motion (used elsewhere on the site, not on demo cursors) is bundled, not externally referenced.

---

### Page 2 — agentation.com

The Agentation product docs site. Different repo from benji.org (separate Next.js build, different webpack chunks), but **reuses the hero-demo component verbatim**: identical inline `<style>` block, identical class names (`hero-demo-container`, `hero-demo-browser`, `hero-demo-cursor`, `hero-demo-popup`, etc.).

**Cursor implementation, motion mechanism, easing, popups, typing, loop coordinator, play/pause, reduced-motion handling.** Same as benji.org/agentation's hero demo. Both pages ship the same component — likely a shared package or copy-pasted source. The inline `<style>` block is byte-identical.

**What's different from benji.org/agentation.** Below the hero, agentation.com is a docs site (Install / Features / Output / Schema / MCP / API / Webhooks / Changelog / Blog / FAQ). The body content uses simpler `.demo-card`, `.demo-elements`, `.demo-button`, `.animation-demo` classes — static cards, not scripted cursor demos. There are some standalone animations (typing on the `npm install agentation` snippet — `mobileTypeChar` keyframe; copy icon morph — `progress` keyframe; pulse on the install button — `pulse` keyframe), but these are CSS-only with `animation:` declarations, not orchestrated cursor sequences.

**Bundle estimate.** Stylesheet `099694473aaf8b71.css` is 16 KB total. The hero demo inline style block is identical to benji.org/agentation. JS chunks are smaller because the docs pages don't carry the full per-demo choreography of the article — they only have the hero demo.

**Mobile note.** agentation.com shows a `<div class="mobile-notice">Agentation is currently desktop only.</div>` banner. The hero demo *does* render on mobile (the demo's `@media (max-width: 640px)` block scales it down), but the actual Agentation product runs only on desktop.

**Asymmetry vs. our situation.** agentation.com is a production docs site for a real product. The hero demo is marketing material — it shows the product working without requiring the visitor to install Agentation. We have no analog. Our case studies are NOT product docs; the demos serve a different purpose (illustrating a design decision, not selling a tool). The pattern transfers cleanly anyway because the engine doesn't care what the demo is for.

---

### Page 3 — benji.org/liveline

The Liveline (financial-chart React component) article. Completely different demo strategy from benji.org/agentation.

**Cursor implementation.** **None.** The page contains zero `demo-cursor` / `hero-demo-cursor` references. Search confirmed: `grep -c "demo-cursor\|hero-demo-cursor" /tmp/benji_liveline.html` → 0.

**Motion mechanism.** Each demo is a live `<canvas>` element rendered by the actual Liveline component. 17 `<canvas>` elements in the page, each with the same baseline style `style="display:block;cursor:crosshair"`. The cursor visible during interaction is the **OS-level crosshair** (native browser cursor), not a JS-managed DOM element. When the user moves their mouse over the canvas, the OS shows the crosshair; Liveline's internal canvas rendering responds to mousemove events.

**Easing, popups, typing, loop coordinator, play/pause, reduced-motion handling.** None of the agentation-style primitives apply. The Liveline component manages its own internal rendering. Whatever easing it uses for chart animations (e.g., the candlestick pulse-in, the orderbook value transitions) is internal to the canvas drawing loop, not visible in the page HTML or CSS.

**Bundle estimate.** Page-specific chunk `app/(articles)/liveline/page-2e1c278785d3c511.js` is a 192-byte entry pointer; the actual Liveline component bundle is one of the shared chunks (likely `7047` or `6047`). Liveline itself is a published npm package per Benji's article; the demo is the real package embedded directly.

**Asymmetry vs. agentation.** Liveline is a **single embeddable component**, so Benji can drop it 17 times with different props (one for momentum, one for value overlay, one for orderbook, etc.). Agentation is **a browser toolbar that operates on other apps**, so its demos need a fake-app mockup + a scripted cursor pretending to be a user. Two products → two demo patterns.

---

## Cross-page comparison

### Shared engine vs. per-post implementations

**Shared engine: YES, for the cursor/popup/marker primitives — but the engine is small.** The `.demo-cursor`, `.demo-popup`, `.demo-marker`, `.demo-toolbar` classes in `04479d16ca5de00d.css` are reused across all body demos on benji.org/agentation. The hero-demo namespace (`.hero-demo-*`) is a near-clone that ships inline with the article and is also reused verbatim on agentation.com.

**Per-post: the choreography scripts and the mockup HTML.** Each demo on benji.org/agentation has its own designed-down mockup (gray-bar dashboard, Steve Jobs quote, pricing card, task list, etc.) with its own namespace prefix (`.tsd-` text selection, `.ecd-` element click, `.msd-` multi-select, `.asd-` area selection, `.apd-` animation pause, `.sid-` sidebar, `.sd-` selection). And each has its own async `play()` choreography function inside chunk 7047.

So the shared engine provides ~5 primitives (cursor, popup, marker, toolbar, browser-chrome). Each demo composes those primitives + its own mockup + its own beat sequence. This is exactly the right granularity for our portfolio: build the primitives once, write a per-demo mockup and choreography for each case study beat.

**Liveline diverges entirely.** Because the product itself is the embeddable thing, the demo strategy is "embed the product." No shared engine borrows over.

### Easing curve catalog (load-bearing summary)

| Element class | Property | Duration | Easing |
| --- | --- | --- | --- |
| `.demo-cursor` | `left`, `top` | 350ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `.demo-cursor-*` (mode swap) | `transform`, `opacity` | 200ms / 150ms | `ease` |
| `.demo-popup` | `transform` | 200ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `.demo-popup` | `opacity` | 200ms | `ease` |
| `.demo-marker` | `transform` | 250ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `.demo-marker` | `opacity` | 250ms | `ease` |
| `.demo-toolbar` | `width`, `border-radius`, `padding` | 400ms | `cubic-bezier(0.19, 1, 0.22, 1)` |
| `.demo-toolbar-btn` | `color`, `bg`, `opacity` | 200ms | `ease` |
| `.tsd-highlight` / `.ecd-highlight` | `opacity` | 100ms / 150ms | `ease` |

Five custom cubic-beziers carry the entire feel:
- Material standard for cursor (neutral, deceleration-only)
- Back-out for popups and morphing icons (springy, alive)
- Ease-out-quint for markers (snappy stop)
- Ease-out-expo for toolbar morph (very long tail, dramatic)

Everything else is plain `ease`.

### Bundle cost across pages

| Page | Total HTML | Inline `<style>` | Inline `<script>` blocks | External JS chunks | External CSS |
| --- | ---: | ---: | ---: | ---: | ---: |
| benji.org/agentation | 127 KB | 1 (~32 KB unmin, hero only) | 25 (Next.js hydration) | 18 chunks | 3 sheets |
| agentation.com | 65 KB | 2 | 5 | 10 chunks | 1 sheet |
| benji.org/liveline | 102 KB | 0 | 34 | 18 chunks (shared with agentation) | 3 sheets |

The hero-demo inline `<style>` block is the largest single demo cost — and it ships only on pages where the hero demo appears.

---

## Technical architecture for our choreography engine

What our engine needs to provide, given what Benji does:

### Module 1 — Custom cursor (single component)

A `<div>` that's positioned absolutely inside a `.demo-frame`, with CSS transitions on `left`/`top`. Three SVG children for cursor modes (pointer, crosshair, text). API:

```js
const cursor = createCursor(demoFrameElement);
cursor.moveTo(x, y);                    // updates style.left/top
cursor.setMode('pointer' | 'crosshair' | 'text');
cursor.setDragging(true);               // disables CSS transitions during drag
cursor.click();                         // momentary scale pulse (optional micro-animation)
```

Implementation: a class that owns the DOM element and exposes setter methods that mutate `style.left` / `style.top` and class names. CSS provides the easing. ~30 lines of JS + ~20 lines of CSS.

### Module 2 — Motion primitives (sleep + easing)

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));
```

That's the entire motion utility. The easing isn't a JS function — it's a CSS property on each animated element. No `requestAnimationFrame`, no bezier-curve math in JS.

### Module 3 — Popup, marker, toolbar (per-element components)

Each is a small class wrapping a DOM element:

```js
const popup = createPopup(container, {x, y, header: 'button.submit-btn'});
popup.show();           // adds .visible class
popup.type('needs more padding', {speed: 50});  // setInterval char-by-char
popup.hide();           // removes .visible class
popup.destroy();        // removes from DOM

const marker = createMarker(container, {x, y, number: 1, color: 'blue'});
marker.show();
marker.hide();
```

These wrap the `.demo-popup` / `.demo-marker` CSS — instances mutate class names; CSS handles entry/exit easing. ~40 lines per component.

### Module 4 — Choreography runner

A function that takes an async sequence and a loop interval, runs it, and re-runs on a timer:

```js
function runChoreography({sequence, intervalMs, container}) {
  let isRunning = false;
  const tick = async () => {
    if (isRunning) return;
    isRunning = true;
    try { await sequence(); } finally { isRunning = false; }
  };
  tick();
  const intervalId = setInterval(tick, intervalMs);
  const onVis = () => {
    if (document.visibilityState === 'visible') {
      clearInterval(intervalId);
      // re-arm after small delay
      setTimeout(() => tick(), 100);
    }
  };
  document.addEventListener('visibilitychange', onVis);
  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', onVis);
  };
}
```

### Module 5 — IntersectionObserver pause (our addition, NOT in Benji's implementation)

Benji does not pause on scroll. We **should**, because:
- Our pages can have multiple demos per case study (Ghost will have 2+ autoplay loops).
- Off-screen scripted state updates burn battery on mobile and waste main-thread budget.
- Our existing `main.js` already uses IntersectionObserver patterns extensively (Mobile Video Standing Rule §4, JS-State Classes §4) — this is consistent infrastructure.

API:

```js
function observeDemo(container, {onEnter, onLeave}) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? onEnter() : onLeave());
  }, {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});  // match site convention
  io.observe(container);
  return () => io.disconnect();
}
```

The choreography runner subscribes to `onEnter`/`onLeave` and starts/stops accordingly.

### Module 6 — `prefers-reduced-motion` gate (our addition, NOT in Benji's implementation)

Benji's demos run regardless. Ours should respect the OS preference. Pattern: at engine init, check `matchMedia('(prefers-reduced-motion: reduce)').matches`. If true, snap the demo to its final state (or its most-explanatory beat) and skip the loop. Roughly:

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  // render snapshot of beat N (the "thesis frame"); skip choreography loop
  return;
}
// otherwise start the choreography runner
```

### Module 7 — Mac chrome (the `.demo-frame` we already have)

Already shipped 2026-05-21. Reuse as-is. Our system uses `.demo-frame` instead of Benji's `.demo-window` / `.hero-demo-browser` — same idea, our class.

### API surface summary

```js
import {createCursor, createPopup, createMarker, runChoreography, observeDemo, sleep} from './demo-engine.js';

function setupGhostAIFixDemo() {
  const frame = document.querySelector('#ghost-ai-fix-demo');
  const cursor = createCursor(frame);
  const popup = createPopup(frame, {x: 200, y: 80});

  const sequence = async () => {
    cursor.moveTo(50, 50);
    await sleep(600);
    cursor.moveTo(200, 100);
    await sleep(400);
    cursor.click();
    popup.show();
    await sleep(800);
    popup.type('needs more padding');
    await sleep(1500);
    popup.hide();
    // reset to start state
    cursor.moveTo(50, 50);
    await sleep(400);
  };

  const stopChoreo = runChoreography({sequence, intervalMs: 6000, container: frame});
  const stopObs = observeDemo(frame, {
    onEnter: () => { /* runChoreography is already running */ },
    onLeave: () => { stopChoreo(); }
  });
  // (real integration: factor so observeDemo controls runChoreography's start/stop)
}
```

### Dependencies between modules

- Cursor depends on nothing.
- Popup, marker, toolbar depend on nothing.
- runChoreography depends on `sleep`.
- observeDemo wraps runChoreography (starts on enter, stops on leave).
- prefers-reduced-motion gate sits at the top, decides whether to call runChoreography at all.

No internal coupling. Each module is testable in isolation in `sandbox-demo-frame.html`.

---

## Reusable building blocks across our portfolio

The May 21 file ([`2026-05-21_benji-pattern-decomposition.md`](2026-05-21_benji-pattern-decomposition.md)) listed five engine modules as open work. With the deeper inspection complete, here is the more specific mapping per case study:

### Ghost case study (two pending autoplay loops)

**Beat 3 — AI Fix flow.** Mockup is a designed-down version of Ghost's "AI Fix" panel: a small dark popup over a wireframe component, with a "Generate fix" button and a result panel sliding in. Choreography: cursor moves to the drift indicator → clicks → popup appears → "AI Fix" text types in → result panel slides in showing the proposed CSS change → loop. **Engine primitives needed:** cursor (pointer mode), popup, typing utility, plus a custom result-panel slide-in (per-demo CSS, not engine-level).

**Beat 4 — View Modes switcher.** Mockup is the Ghost canvas with a view-mode pill (Specs / Production / Diff). Choreography: cursor hovers each pill in sequence, the canvas content cross-fades to match. **Engine primitives needed:** cursor, plus per-demo view-state state machine + canvas content cross-fade. Lighter than Beat 3.

### Pulse case study (one pending autoplay loop, possibly two)

**Living Observatory loop (likely Beat 2 or 3, TBD in planning).** Mockup is the Pulse "Living Observatory" — a wireframe with a heatmap layer, a time scrubber, and an AI prompt bar. Choreography: AI fly-in indicator pulses → cursor moves to a heatmap hot spot → clicks → AI diagnosis popup appears with typed analysis → time scrubber animates forward → diagnosis updates → loop. **Engine primitives needed:** cursor, popup, typing, plus per-demo time-scrubber animation and heatmap hotspot pulse (CSS keyframes).

### LexisNexis case study (one pending autoplay loop)

**Token playground (the wedge).** This may end up user-driven rather than autoplay; the case-study planning session will decide. If autoplay: mockup is a designed-down design-system color palette with token names. Choreography: cursor selects a token → palette colors update across the canvas → cursor selects another → palette updates again. Demonstrates the "full day → 30 seconds" claim visually. **Engine primitives needed:** cursor, plus per-demo color-token state machine.

### Reuse calculus

All three case studies need: **cursor (3 modes), sleep utility, choreography runner, observer pause, reduced-motion gate.** All shared.

Some need: **popup, typing, marker.** Two of three need popup (Ghost AI Fix, Pulse diagnosis). Two need typing (same). None obviously need numbered markers (those were specific to Agentation's multi-pin demos; our case studies don't have that interaction).

Per-demo, each needs ~50–150 lines of choreography (mockup HTML + async sequence). The engine itself is ~250–400 lines total across all modules.

---

## Asymmetry with our situation

Where Benji's choices won't transfer cleanly to our portfolio.

**1. React vs. vanilla JS.** Benji's cursor position is React state (`useState({x, y})`) updated via `setState`. We're vanilla. Our version: a class that owns a DOM element and mutates `.style.left` / `.style.top` directly. The end-user behavior is identical (CSS transitions interpolate either way); the API just changes from React hooks to imperative class methods. No structural impact.

**2. No `prefers-reduced-motion` handling on Benji's demos.** Already flagged. We add a gate at engine init — this is a small addition, not a structural change.

**3. No viewport-based pause on Benji's demos.** Benji uses `document.visibilitychange` only (tab visibility). We should use both: visibility *and* IntersectionObserver. The off-screen pause is consistent with our existing mobile-video patterns and protects the cursor RAF loop — even though we don't use RAF, the principle is the same. Small addition.

**4. Benji has the docs-site infrastructure to share components across pages (Next.js component library).** We don't — we're a single-page vanilla JS portfolio. Our `demo-engine.js` should be one file in `js/` (or appended to `main.js`), loaded once per page, ~6–10 KB minified. Single-file engine.

**5. Benji's hero demos ship inline `<style>` blocks per page; our convention is single `styles.css` for the whole site.** We can fold the `.demo-cursor`, `.demo-popup`, etc. CSS into our `styles.css` — increases total stylesheet by ~3–5 KB but keeps the convention. Following our `Cross-Surface Thumbnail Consistency Rule` mental model: one canonical asset/stylesheet for the whole site.

**6. No animation library on Benji's demos = no animation library for ours.** Tempting to consider Motion One or Framer Motion, but the pure-CSS-transition approach is simpler, lighter, and proven. Stay vanilla.

**7. We can't reuse Benji's choreography content (the actual demos).** The engine is reusable; the demos are not. Every Ghost / Pulse / LexisNexis demo is per-case-study work. The May 21 estimate of "3-5 hours per demo after the engine ships" looks correct based on the per-demo size in chunk 7047.

---

## Open questions

1. **Exact typing speed for Benji's popup-input character reveal.** Inferred 40–60ms per character from his pacing; could confirm by un-minifying chunk 7047 if we want exact parity. Not required for our v1 — picking a value in that range and tuning by ear is the same outcome.

2. **Whether Benji's cursor.click() has a visual pulse.** Watching the demos there's a slight scale tick on click moments. The `.demo-cursor-pointer` has `transition: transform 0.2s ease` — likely a momentary `transform: scale(0.9)` then back. Could confirm by stepping through chunk 7047. Easy to add to ours either way.

3. **How Benji handles demo state-leakage on tab visibility changes.** The `visibilitychange` listener calls `play()` immediately on re-visible — but the previous `play()` may have been mid-sequence. State could be in a partial pose. Watching the demos this isn't visually obvious, but is worth designing around: our runChoreography should track sequence-position and resume cleanly, or simply reset to a known state on re-visible.

4. **Whether Liveline's canvas exposes hover state to our portfolio's custom cursor.** Probably yes (mousemove events bubble). Not an open question for the engine, but for any future portfolio integration with chart components.

These are all answerable in Session 3 by implementation, not by more research. The engine should be implementable from this research alone.

---

## Bundle budget recommendation

Given:
- Engine itself (cursor + popup + marker + runner + observer + reduced-motion gate): target **~4–6 KB gzipped**. Achievable in pure vanilla JS based on Benji's structure.
- CSS additions to `styles.css` for `.demo-cursor`, `.demo-popup`, etc.: target **~2 KB gzipped**.
- Per-demo HTML mockup: variable, **~2–4 KB each unminified inline in the case-study HTML**.
- Per-demo JS choreography (async sequence): **~1–2 KB each**.

For a case study with two autoplay loops (e.g., Ghost), total demo overhead: **~6 KB engine (shared across all case studies, paid once site-wide) + ~4–6 KB per case study (mockup + choreography for that page's demos)**.

This is well within budget — for reference, our current Pulse case-study videos are **~2.3 MB cumulative**. The scripted-demo system is two orders of magnitude lighter.

**Discipline for Session 3:** if the engine grows past ~8 KB gzipped, stop and audit. Likely either (a) abstraction creep (too many configuration options), or (b) feature additions that should be per-demo, not in the engine. Cursor + popup + marker + runner + observer + reduced-motion gate is sufficient. Anything beyond is opt-in per demo.

---

## Files touched this session

None. Research-only. The only deliverable is this file.

## Next sessions that should reference this file

- **Session 3 (engine build).** This is the bedrock. Cite specific easing curves, the sleep utility shape, the runChoreography pattern, the IntersectionObserver + reduced-motion additions.
- **Ghost Beat 3 (AI Fix loop).** First demo built on the engine.
- **Ghost Beat 4 (View Modes switcher).** Second demo, validates engine generality.
- **Pulse autoplay-loop planning.** Will refer to this file's "Reusable building blocks" → Pulse section when mapping which beats are autoplay vs. user-driven.
- **LexisNexis autoplay-loop planning.** Same as above.
