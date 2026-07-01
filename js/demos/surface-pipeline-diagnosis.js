/* Surface Labs — Pipeline Diagnosis (interactive, auto-restarting, Pattern C)
 * ====================================================================
 * A clickable, miniature recreation of Rotem's live lead magnet at
 * withsurface.com/lp/pipeline-diagnosis. Two questions: click an answer
 * to advance, and after the second answer the view slides up to the
 * diagnostic graph — a 4-stage funnel where the leaking stage lights
 * coral, with a one-line verdict. Nothing below the verdict (no CTA).
 * A few seconds after the result, it resets to the first question on its
 * own (the loop restarts), ready for the next visitor.
 *
 * Pattern C (real user interaction): plain click listeners + state. The
 * only engine imports are LoopObserver (clear pending timers / re-arm
 * when it scrolls out of and back into view) and prefersReduced (paint
 * the static diagnostic graph, no motion).
 *
 * HONESTY: the four funnel STAGES (Capture / Qualify / Route / Convert)
 * and the leak-diagnosis mechanic are the real product loop. The two
 * question prompts and the fixed QUALIFY verdict are illustrative (the
 * production scoring + copy live in Surface's private repo). Leak is
 * conveyed by color AND text.
 */
import { LoopObserver, prefersReduced } from './_engine/index.js';

const ROOT_ID = 'surfacePipelineDiagnosis';

const QUESTIONS = [
  { stage: 'CAPTURE', q: 'How do inbound leads reach your team?',
    opts: ['Routed the moment they land', 'A form someone checks daily', 'They fill a form and wait'] },
  { stage: 'QUALIFY', q: 'How are new leads qualified?',
    opts: ['Scored automatically on arrival', 'A rep reads each one', 'Everyone gets the same reply'] }
];

/* Diagnostic output across all four stages. QUALIFY is the leak:
   shortest bar (h:0 = stub), lit coral. */
const FUNNEL = [
  { key: 'CAPTURE', h: 2 },
  { key: 'QUALIFY', h: 0, leak: true },
  { key: 'ROUTE',   h: 1 },
  { key: 'CONVERT', h: 2 }
];

const RESTART_AFTER = 4500; /* ms held on the result before the loop restarts */

function init(root) {
  const reduce = prefersReduced();
  const qWrap = root.querySelector('[data-sd-questions]');
  const result = root.querySelector('[data-sd-result]');
  const funnel = root.querySelector('[data-sd-funnel]');
  const verdict = root.querySelector('[data-sd-verdict]');
  if (!qWrap || !result || !funnel || !verdict) return;

  let step = 0;
  let busy = false;          /* locked during a transition (guards double-clicks) */
  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

  function renderQuestion(i, animateIn) {
    const q = QUESTIONS[i];
    qWrap.innerHTML =
      '<span class="sd-q-stage">Stage ' + (i + 1) + ' of 2 &middot; ' + q.stage + '</span>' +
      '<p class="sd-q-text">' + q.q + '</p>' +
      '<div class="sd-opts">' +
      q.opts.map(o => '<button type="button" class="sd-opt">' + o + '</button>').join('') +
      '</div>';
    if (animateIn) {
      qWrap.classList.add('is-advancing');                 /* start hidden */
      requestAnimationFrame(() =>
        requestAnimationFrame(() => qWrap.classList.remove('is-advancing'))); /* fade in */
    } else {
      qWrap.classList.remove('is-advancing');
    }
  }

  function buildFunnel() {
    funnel.innerHTML = FUNNEL.map(s =>
      '<div class="sd-fseg' + (s.leak ? ' is-leak' : '') + '">' +
        '<div class="sd-fbar" data-h="' + s.h + '"></div>' +
        '<span class="sd-flabel">' + s.key + '</span>' +
      '</div>').join('');
  }

  function fillFunnel() {
    const bars = funnel.querySelectorAll('.sd-fbar');
    bars.forEach((b, i) => {
      const h = parseInt(b.getAttribute('data-h'), 10);
      const scale = 0.18 + (h / 2) * 0.82; /* floor so the leak still shows a stub */
      if (reduce) { b.style.transform = 'scaleY(' + scale + ')'; }
      else { setTimeout(() => { b.style.transform = 'scaleY(' + scale + ')'; }, 90 * i); }
    });
  }

  function showResult() {
    qWrap.style.display = 'none';
    result.hidden = false;
    buildFunnel();
    verdict.innerHTML = 'Your pipeline leaks at <b>QUALIFY</b>.';
    requestAnimationFrame(() => {
      result.classList.add('is-in');                       /* slide up + fade in */
      requestAnimationFrame(() => requestAnimationFrame(fillFunnel));
    });
    busy = false;
    later(restart, RESTART_AFTER);                         /* auto-restart the loop */
  }

  function advance() {
    qWrap.classList.add('is-advancing');                   /* fade current question out */
    if (step === 0) {
      later(() => { step = 1; renderQuestion(1, true); busy = false; }, 300);
    } else {
      later(showResult, 300);
    }
  }

  function resetState(animateIn) {
    clearTimers();
    step = 0;
    busy = false;
    result.hidden = true;
    result.classList.remove('is-in');
    funnel.innerHTML = '';
    verdict.innerHTML = '';
    qWrap.style.display = '';
    renderQuestion(0, animateIn);
  }

  function restart() { resetState(true); }                 /* loop back to Q1 */

  /* Reduced motion: static diagnostic graph, no question cycle, no loop. */
  if (reduce) {
    root.classList.add('sd-reduced');
    qWrap.style.display = 'none';
    result.hidden = false;
    result.classList.add('is-in');
    buildFunnel();
    verdict.innerHTML = 'Your pipeline leaks at <b>QUALIFY</b>.';
    fillFunnel();
    return;
  }

  qWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.sd-opt');
    if (!btn || busy || qWrap.classList.contains('is-advancing')) return;
    busy = true;
    btn.classList.add('is-selected');
    later(advance, 280);
  });

  /* Re-arm cleanly when the widget scrolls out of and back into view: clear
     any pending auto-restart so it never fires off-screen, and reset to Q1. */
  let armed = false;
  const observer = new LoopObserver({
    element: root,
    onEnter: () => { if (!armed) { armed = true; resetState(false); } },
    onExit: () => { armed = false; clearTimers(); }
  });

  resetState(false);   /* paint Q1 before the observer arms */
  observer.start();
}

const rootEl = document.getElementById(ROOT_ID);
if (rootEl) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(rootEl));
  } else {
    init(rootEl);
  }
}
