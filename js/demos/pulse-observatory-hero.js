/* Pulse Observatory Hero — Ask-Fly-Cool (2026-06-09)
 * ====================================================================
 *
 * Hero demo for work/pulse.html. Performs Pulse's product thesis
 * ("the heatmap is an interface, not a visualization") in an ~8.5s
 * choreographed loop:
 *
 *   1. Cursor types a prompt into ASK PULSE bar
 *   2. AI "flies" — a pulse line zooms from prompt to a rage hotspot
 *   3. Marker drops on the diagnosed component
 *   4. Diagnosis card slides in (component name, WCAG citation, fix CTA)
 *   5. Cursor presses Apply Fix
 *   6. Heat at that location COOLS — orange fades to baseline, rage
 *      hotspot vanishes
 *   7. Diagnosis card flips to "✓ FIXED" state
 *   8. Held done state, then loop seam
 *
 * Engine pattern matches ghost-ai-fix-flow-hero.js:
 *   - Cursor primitive for the scripted cursor (with state classes)
 *   - Choreography primitive for the beat timeline
 *   - LoopObserver gating
 *   - reduced-motion early return
 *
 * Hero ID: pulseObservatoryHero (mounts on the <div id="..."> in
 * work/pulse.html, ignored elsewhere by query miss).
 */

import {
  Cursor,
  Choreography,
  LoopObserver,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'pulseObservatoryHero';
const root = document.getElementById(ROOT_ID);
if (root) initHero(root);

const LOOP_MS = 8800;
const PROMPT_TEXT = 'Show me the worst friction';

function initHero(rootEl) {
  if (prefersReduced()) {
    /* Reduced-motion: paint the "fixed" end state statically. CSS @media
     * block in styles.css handles the visuals. */
    rootEl.classList.add('plh-reduced');
    return;
  }

  const container = rootEl.querySelector('.plh-container');
  if (!container) return;

  /* DOM refs */
  const promptInput  = container.querySelector('.plh-prompt-input');
  const promptText   = container.querySelector('.plh-prompt-text');
  const sendBtn      = container.querySelector('.plh-send-btn');
  const flyDot       = container.querySelector('.plh-fly-dot');
  const flyPath      = container.querySelector('.plh-fly-path');
  const rageBlob     = container.querySelector('.plh-heat-blob--rage-center');
  const rageBlobL    = container.querySelector('.plh-heat-blob--rage-left');
  const frictionA    = container.querySelector('.plh-heat-blob--friction-a');
  const marker       = container.querySelector('.plh-marker');
  const diagCard     = container.querySelector('.plh-diag-card');
  const diagApplyBtn = container.querySelector('.plh-diag-apply');
  const diagFixed    = container.querySelector('.plh-diag-fixed');
  const promptCaret  = container.querySelector('.plh-prompt-caret');

  const cursor = new Cursor(container);
  cursor.mount();

  function resetAll() {
    promptText.textContent = '';
    promptText.classList.remove('is-typing');
    if (promptCaret) promptCaret.classList.remove('is-blinking');
    sendBtn.classList.remove('is-pressed', 'is-active');
    flyDot.classList.remove('is-flying');
    flyPath.classList.remove('is-visible');
    marker.classList.remove('is-visible', 'is-pulsing');
    diagCard.classList.remove('is-open', 'is-fixed');
    diagApplyBtn.classList.remove('is-pressed');
    rageBlob.classList.remove('is-cooled');
    rageBlobL.classList.remove('is-cooled');
    frictionA.classList.remove('is-cooled');
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
  }

  /* Rest position: cursor parked above the AI prompt bar. */
  function getRestPosition() {
    const rect = container.getBoundingClientRect();
    return { x: rect.width * 0.86, y: rect.height * 0.06 };
  }

  /* Anchor positions for the choreography. Recomputed at each play()
   * because container size depends on viewport (the hero fills .case-
   * hero-image which is 16:7 aspect ratio at content-area width). */
  function getAnchors() {
    const promptCenter = getCenterOf(promptInput, container);
    const sendCenter = getCenterOf(sendBtn, container);
    const rageCenter = getCenterOf(rageBlob, container);
    const applyCenter = getCenterOf(diagApplyBtn, container);
    /* Diagnosis card slides in from right; use its target left position
     * (computed when card has .is-open). For Apply button center we
     * use the open-state position assuming the card is open. */
    return {
      rest: getRestPosition(),
      prompt: promptCenter,
      send: sendCenter,
      rage: rageCenter,
      apply: applyCenter
    };
  }

  /* Type one character at a time into the prompt text. Returns a
   * Promise that resolves when typing is complete. */
  function typePrompt(text, durationMs) {
    promptText.textContent = '';
    promptText.classList.add('is-typing');
    const len = text.length;
    const tickMs = Math.max(28, Math.floor(durationMs / len));
    return new Promise(resolve => {
      let i = 0;
      function step() {
        if (i >= len) {
          promptText.classList.remove('is-typing');
          resolve();
          return;
        }
        promptText.textContent = text.slice(0, i + 1);
        i += 1;
        setTimeout(step, tickMs);
      }
      step();
    });
  }

  function buildTimeline() {
    const a = getAnchors();
    return [
      /* T=400 — Cursor moves down to the prompt input. */
      { at: 400, do: () => {
        cursor.moveTo(a.prompt.x, a.prompt.y);
      }},
      /* T=950 — Cursor reaches prompt, clickStamp, caret blink starts. */
      { at: 950, do: () => {
        cursor.clickStamp();
        if (promptCaret) promptCaret.classList.add('is-blinking');
      }},
      /* T=1100 — Typing begins. ~1000ms total typing duration. */
      { at: 1100, do: () => {
        typePrompt(PROMPT_TEXT, 1000);
      }},
      /* T=2300 — Cursor moves to Send button. */
      { at: 2300, do: () => {
        if (promptCaret) promptCaret.classList.remove('is-blinking');
        cursor.moveTo(a.send.x, a.send.y);
      }},
      /* T=2900 — Cursor clickStamp on Send. Button presses. */
      { at: 2900, do: () => {
        cursor.clickStamp();
        sendBtn.classList.add('is-pressed');
      }},
      /* T=3050 — AI fly begins. Pulse dot races from Send to rage hotspot. */
      { at: 3050, do: () => {
        sendBtn.classList.remove('is-pressed');
        sendBtn.classList.add('is-active');
        flyDot.classList.add('is-flying');
        flyPath.classList.add('is-visible');
      }},
      /* T=3750 — Fly arrives at hotspot. Marker drops in with bounce. */
      { at: 3750, do: () => {
        marker.classList.add('is-visible');
        rageBlob.classList.add('is-pulsing');
      }},
      /* T=3950 — Marker continues pulsing, diagnosis card slides in. */
      { at: 3950, do: () => {
        diagCard.classList.add('is-open');
      }},
      /* T=4900 — Cursor moves to Apply Fix button. */
      { at: 4900, do: () => {
        cursor.moveTo(a.apply.x, a.apply.y);
      }},
      /* T=5500 — Cursor clickStamp on Apply Fix. */
      { at: 5500, do: () => {
        cursor.clickStamp();
        diagApplyBtn.classList.add('is-pressed');
      }},
      /* T=5700 — Heat starts cooling at the diagnosed location. */
      { at: 5700, do: () => {
        rageBlob.classList.add('is-cooled');
        rageBlobL.classList.add('is-cooled');
        frictionA.classList.add('is-cooled');
        marker.classList.remove('is-pulsing');
      }},
      /* T=6800 — Diagnosis card flips to FIXED state. */
      { at: 6800, do: () => {
        diagCard.classList.add('is-fixed');
        if (diagFixed) diagFixed.classList.add('is-visible');
      }},
      /* T=7800 — Cursor lifts up toward rest. */
      { at: 7800, do: () => {
        cursor.moveTo(a.rest.x, a.rest.y, { duration: 700 });
      }},
      /* T=8500 — Reset all state. Loop seam buffer 300ms before LOOP_MS. */
      { at: 8500, do: () => {
        resetAll();
      }}
    ];
  }

  let choreo = null;
  let loopTimerId = null;
  let isFirst = true;

  function play() {
    /* Rebuild timeline each iteration so anchor positions stay correct
     * after resize. */
    const timeline = buildTimeline();
    choreo = new Choreography({
      timeline: timeline,
      duration: LOOP_MS,
      onReset: resetAll
    });
    if (isFirst) {
      /* Snap cursor to rest before first iteration. */
      const a = getAnchors();
      cursor.el.style.transition = 'none';
      cursor.el.style.left = a.rest.x + 'px';
      cursor.el.style.top = a.rest.y + 'px';
      void cursor.el.offsetWidth;
      isFirst = false;
    }
    choreo.play();
    loopTimerId = setTimeout(play, LOOP_MS);
  }

  function stop() {
    if (loopTimerId) {
      clearTimeout(loopTimerId);
      loopTimerId = null;
    }
    if (choreo) choreo.pause();
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => play(),
    onExit:  () => stop()
  });
  observer.start();
}
