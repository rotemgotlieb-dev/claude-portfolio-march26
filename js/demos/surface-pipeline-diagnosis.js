/* Surface Labs — Pipeline Diagnosis (interactive body demo, Pattern C)
 * ====================================================================
 * A faithful, miniature recreation of Rotem's live lead-magnet at
 * withsurface.com/lp/pipeline-diagnosis: four one-tap questions, one per
 * funnel stage (Capture / Qualify / Route / Convert). The lowest-scoring
 * stage surfaces as "the leak" on a 4-segment funnel, lit coral.
 *
 * Pattern C (real user interaction): plain click listeners + state
 * classes. No engine loop, no Choreography, no LoopObserver — the only
 * engine import is prefersReduced (to drop transitions, NOT to disable
 * the demo: a recruiter must still be able to operate it).
 *
 * HONESTY: stages + mechanic are real; the question copy and 0/1/2
 * scoring are illustrative (the production copy lives in Surface's
 * private repo). The caption states this. Leak is conveyed by color AND
 * text (accessible). Earlier-stage tie-break (fix upstream first).
 */

import { prefersReduced } from './_engine/index.js';

const ROOT_ID = 'surfacePipelineDiagnosis';

/* Illustrative questions; the funnel STAGES are the real product loop. */
const STAGES = [
  { key: 'CAPTURE', q: 'How do inbound leads reach your team?',
    opts: [['Routed the moment they land', 2], ['A form someone checks daily', 1], ['They fill a form and wait', 0]] },
  { key: 'QUALIFY', q: 'How are new leads qualified?',
    opts: [['Scored automatically on arrival', 2], ['A rep eyeballs each one', 1], ['Everyone gets the same reply', 0]] },
  { key: 'ROUTE', q: 'How fast is the first response?',
    opts: [['Under a minute', 2], ['Within the day', 1], ['A few days, if at all', 0]] },
  { key: 'CONVERT', q: 'What happens to no-shows and stalls?',
    opts: [['Re-engaged automatically', 2], ['A manual nudge, sometimes', 1], ['Nothing, they go cold', 0]] }
];

function init(root) {
  const reduce = prefersReduced();
  if (reduce) root.classList.add('sd-reduced');

  const qWrap = root.querySelector('[data-sd-questions]');
  const segs = Array.from(root.querySelectorAll('[data-sd-seg]'));
  const result = root.querySelector('[data-sd-result]');
  const funnel = root.querySelector('[data-sd-funnel]');
  const verdict = root.querySelector('[data-sd-verdict]');
  const again = root.querySelector('[data-sd-again]');
  if (!qWrap || !result || !funnel || !verdict) return;

  let step = 0;
  const health = [null, null, null, null];

  function paintProgress() {
    segs.forEach((s, i) => {
      s.classList.toggle('is-filled', health[i] !== null);
      s.classList.toggle('is-active', i === step);
    });
  }

  function renderQuestion() {
    const st = STAGES[step];
    qWrap.innerHTML =
      '<span class="sd-q-stage">Stage ' + (step + 1) + ' of 4 &middot; ' + st.key + '</span>' +
      '<p class="sd-q-text">' + st.q + '</p>' +
      '<div class="sd-opts">' +
      st.opts.map(o => '<button type="button" class="sd-opt" data-h="' + o[1] + '">' + o[0] + '</button>').join('') +
      '</div>';
    qWrap.classList.remove('is-advancing');
    paintProgress();
  }

  function advance(h, btn) {
    if (btn) btn.classList.add('is-selected');
    health[step] = h;
    paintProgress();
    const go = () => {
      step += 1;
      if (step >= STAGES.length) { showResult(); return; }
      renderQuestion();
    };
    if (reduce) { go(); return; }
    qWrap.classList.add('is-advancing');
    setTimeout(go, 220);
  }

  /* Lowest health wins; strict < means the EARLIEST stage wins a tie
     (fix the funnel from the top). */
  function leakStage() {
    let min = 99, idx = 0;
    for (let i = 0; i < 4; i++) { if (health[i] < min) { min = health[i]; idx = i; } }
    return idx;
  }

  function showResult() {
    const leak = leakStage();
    funnel.innerHTML = STAGES.map((st, i) =>
      '<div class="sd-fseg' + (i === leak ? ' is-leak' : '') + '">' +
        '<div class="sd-fbar" data-h="' + health[i] + '"></div>' +
        '<span class="sd-flabel">' + st.key + '</span>' +
      '</div>').join('');
    verdict.innerHTML = 'Your pipeline leaks at <b>' + STAGES[leak].key + '</b>.';
    qWrap.style.display = 'none';
    result.hidden = false;

    const bars = Array.from(funnel.querySelectorAll('.sd-fbar'));
    const fill = () => bars.forEach((b, i) => {
      const h = parseInt(b.getAttribute('data-h'), 10);
      const scale = 0.18 + (h / 2) * 0.82; /* floor so a leak still shows a stub */
      if (reduce) { b.style.transform = 'scaleY(' + scale + ')'; }
      else { setTimeout(() => { b.style.transform = 'scaleY(' + scale + ')'; }, 70 * i); }
    });
    if (reduce) fill();
    else requestAnimationFrame(() => requestAnimationFrame(fill));
  }

  function reset() {
    step = 0;
    for (let i = 0; i < 4; i++) health[i] = null;
    result.hidden = true;
    qWrap.style.display = '';
    segs.forEach(s => s.classList.remove('is-filled', 'is-active'));
    renderQuestion();
  }

  qWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.sd-opt');
    if (!btn || btn.classList.contains('is-selected')) return;
    advance(parseInt(btn.getAttribute('data-h'), 10), btn);
  });
  if (again) again.addEventListener('click', reset);

  renderQuestion();
}

const rootEl = document.getElementById(ROOT_ID);
if (rootEl) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(rootEl));
  } else {
    init(rootEl);
  }
}
