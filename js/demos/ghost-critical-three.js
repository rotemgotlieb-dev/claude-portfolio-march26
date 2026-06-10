/* Ghost Critical Three (OC-E, Process Loops Sprint, 2026-05-27)

   Body demo inside the Outcome section of work/ghost.html, before Other
   Work cards. Argues what the body of work amounts to — the system made
   legible via triage. Cursor as agent visiting three of twenty-one real
   Ghost component cards, marking them critical. After the third mark, the
   non-critical 18 fade to 30% opacity — "this is what Ghost does:
   narrows 21 components to the 3 that matter."

   Design doc: .claude/sprint-reports/2026-05-27-process-loops-design.md §1D.2

   The loop (7000ms):
     - 3 triage judgments: Modal, Select, Banner (the three lowest-scored /
       highest-visibility deviations in the case study's component list)
     - Each judgment = cursor → card, hover dwell (cognition), clickStamp,
       red border applied, red marker pin appears, counter ticks
     - After 3rd judgment + 350ms: 18 non-critical cards cascade-fade to
       30% opacity (50ms stagger); counter morphs to "3 critical · 18 healthy"
     - Cursor settles to rest. 1830ms terminal freeze. Cleanup before LOOP.

   Cursor discipline (mirrors hero r2.6):
     - Ease-in-out traversal (engine default 440ms)
     - clickStamp at each click point (V3 stamping motion)
     - Polyrhythmic dwells: 300/350/280 ms (decisive → confirming pattern →
       fast pattern-recognised). NOT metronomic.
     - True setTimeout-gated freezes between beats — Choreography engine
       schedules absolute beat timestamps; gaps are motionless cursor
     - SETTLE_MS = 770ms on the loop-seam settle

   Continuous-state seam: mirror-action. Every triage state change
   (border + marker + counter + fade) reverses in cleanup before LOOP.
   Cursor stays at rest position. T=0 ≡ T=7000.

   Timeline (7000ms):
   | Beat | T (ms)  | Action                                                           |
   |------|---------|------------------------------------------------------------------|
   |  1A  |    0    | Cursor → Modal card (440ms ease-in-out)                          |
   |  1A' |  440    | Cursor arrives; hover dwell 300ms (decisive cognition)           |
   |  1B  |  740    | clickStamp Modal + .is-critical + Marker 1 (red) + counter "1/21"|
   |  2A  |  940    | Cursor → Select card (200ms post-click linger then move)         |
   |  2A' | 1380    | Cursor arrives; hover dwell 350ms (slightly longer)              |
   |  2B  | 1730    | clickStamp Select + .is-critical + Marker 2 + counter "2/21"     |
   |  3A  | 1930    | Cursor → Banner card                                             |
   |  3A' | 2370    | Cursor arrives; hover dwell 280ms (fastest — pattern recognised) |
   |  3B  | 2650    | clickStamp Banner + .is-critical + Marker 3 + counter "3/21"     |
   |  4   | 3000    | 350ms post-3rd-click: 18 non-critical cards cascade-fade (50ms   |
   |      |         |   row stagger, ~300ms total). Counter morphs blur-crossfade to   |
   |      |         |   "3 critical · 18 healthy" (250ms)                              |
   |  5   | 3700    | Cursor → rest position (770ms SETTLE)                            |
   |  5'  | 4470    | Cursor arrives at rest                                           |
   |  --  | 4470    | TERMINAL FREEZE BEGINS — 1830ms motionless absorption window     |
   |  6   | 6300    | Cleanup beat: markers disappear, .is-critical removed, faded     |
   |      |         |   cards return to 100%, counter reverts to "0 / 21 critical"     |
   |  --  | 6600    | Cleanup transitions complete (longest = 300ms)                   |
   | LOOP | 7000    | Iteration N+1. State matches T=0 exactly.                        |
*/

import {
  Cursor,
  Choreography,
  LoopObserver,
  Marker,
  getCenterOf,
  prefersReduced
} from './_engine/index.js';

const ROOT_ID = 'ghostCriticalThree';
const root = document.getElementById(ROOT_ID);
if (root) initCriticalThree(root);

function initCriticalThree(rootEl) {
  const grid = rootEl.querySelector('.ct-widget-grid');
  const counter = rootEl.querySelector('.ct-widget-counter');
  const allCards = Array.from(rootEl.querySelectorAll('.ct-widget-card'));
  const targetCards = allCards.filter(c => c.dataset.criticalTarget === 'true');
  if (!grid || !counter || allCards.length !== 21 || targetCards.length !== 3) return;

  const LOOP_DURATION = 7000;
  const SETTLE_MS = 770;
  const CURSOR_TRAVERSAL_MS = 440;

  /* Polyrhythmic hover dwells per V3 §2.3 — each pick is a triage judgment.
     300ms first (decisive), 350ms second (confirming pattern), 280ms third
     (fastest — pattern recognised). The variation IS the polish. */
  const HOVER_DWELLS = [300, 350, 280];

  /* Reduced motion path: render the "triage done" end state statically.
     3 target cards have red borders, other 18 at 30% opacity, counter
     reads the final morphed text. No cursor, no markers, no motion. */
  if (prefersReduced()) {
    targetCards.forEach(c => c.classList.add('is-critical'));
    allCards.forEach(c => {
      if (!c.classList.contains('is-critical')) c.classList.add('is-faded');
    });
    counter.textContent = '3 critical · 18 healthy';
    counter.setAttribute('data-counter-state', 'triaged');
    return;
  }

  // Engine instances — cursor mounts on widget root (so it can sit ABOVE the
  // grid at rest position); markers mount on grid (positioned per-card)
  const cursor = new Cursor(rootEl);
  const markers = [0, 1, 2].map(i => new Marker(rootEl, { number: i + 1, variant: 'red' }));

  let isFirstIteration = true;
  let loopTimer = null;
  let choreo = null;

  /* Rest position: just above the grid, top-left area — clearly outside any
     card so the viewer reads "cursor is parked, ready to start." */
  function getRestPosition() {
    const firstCard = allCards[0];
    const center = getCenterOf(firstCard, rootEl);
    return { x: center.x - 30, y: center.y - 56 };
  }

  function setCounterText(text, state) {
    counter.textContent = text;
    if (state) counter.setAttribute('data-counter-state', state);
  }

  /* Crossfade-morph the counter from "3 / 21 critical" to "3 critical ·
     18 healthy" — blur the leaving text out, swap textContent at peak
     blur, blur the new text in. 250ms total via CSS transition on opacity
     + filter. */
  function morphCounter(newText, newState) {
    counter.style.opacity = '0';
    counter.style.filter = 'blur(3px)';
    setTimeout(() => {
      setCounterText(newText, newState);
      counter.style.opacity = '';
      counter.style.filter = '';
    }, 150);
  }

  function cascadeFadeNonCritical() {
    let cnt = 0;
    allCards.forEach(card => {
      if (card.classList.contains('is-critical')) return;
      setTimeout(() => card.classList.add('is-faded'), cnt * 50);
      cnt++;
    });
  }

  function resetAllState() {
    allCards.forEach(c => {
      c.classList.remove('is-critical', 'is-faded', 'is-hovered');
    });
    setCounterText('0 / 21 critical', 'initial');
    counter.style.opacity = '';
    counter.style.filter = '';
    markers.forEach(m => {
      if (m.el) m.disappear();
    });
    if (cursor.el) {
      cursor.el.classList.remove('is-clicking', 'is-stamping');
      cursor.el.style.transition = '';
    }
  }

  function buildTimeline() {
    const beats = [];
    let t = 0;

    targetCards.forEach((card, i) => {
      const hoverDwell = HOVER_DWELLS[i];

      // Beat A: cursor → card
      beats.push({
        at: t,
        do: () => {
          const target = getCenterOf(card, rootEl);
          card.classList.add('is-hovered');
          cursor.moveTo(target.x, target.y);
        }
      });
      t += CURSOR_TRAVERSAL_MS;
      t += hoverDwell;

      // Beat B: clickStamp + .is-critical + marker + counter tick
      beats.push({
        at: t,
        do: () => {
          cursor.clickStamp();
          card.classList.remove('is-hovered');
          card.classList.add('is-critical');
          const cardRect = card.getBoundingClientRect();
          const cardCenter = getCenterOf(card, rootEl);
          if (!markers[i].el) markers[i].mount();
          markers[i].appear({
            x: cardCenter.x + cardRect.width / 2 - 6,
            y: cardCenter.y - cardRect.height / 2 + 4
          });
          setCounterText((i + 1) + ' / 21 critical', 'counting');
        }
      });

      if (i < 2) {
        t += 200; // post-click linger before next move
      } else {
        t += 350; // longer pause after the 3rd click before the cascade
      }
    });

    // Beat 4: cascade-fade 18 non-critical + counter morph
    beats.push({
      at: t,
      do: () => {
        cascadeFadeNonCritical();
        morphCounter('3 critical · 18 healthy', 'triaged');
      }
    });
    t += 700; // cascade ~300ms + ~400ms absorption before cursor moves

    // Beat 5: cursor → rest at SETTLE_MS
    beats.push({
      at: t,
      do: () => {
        const rest = getRestPosition();
        cursor.moveTo(rest.x, rest.y, { duration: SETTLE_MS });
      }
    });
    t += SETTLE_MS;
    // Now t ≈ 4470. Terminal absorption freeze begins. No beats scheduled in
    // this window — the Choreography engine has no work, cursor is motionless
    // at rest, the triage result holds on screen.
    t += 1830; // terminal freeze → t = 6300

    // Beat 6: cleanup — reverse every state change
    beats.push({
      at: t,
      do: () => {
        markers.forEach(m => m.disappear());
        allCards.forEach(c => {
          c.classList.remove('is-critical', 'is-faded');
        });
        morphCounter('0 / 21 critical', 'initial');
      }
    });
    // t = 6300; cleanup transitions complete by t≈6600; ~400ms terminal
    // silence until LOOP at 7000. Cursor remains at rest position.

    return beats;
  }

  function ensureCursor() {
    if (!cursor.el) {
      cursor.mount();
      const rest = getRestPosition();
      cursor.snapTo(rest.x, rest.y);
      cursor.show();
    }
  }

  function startLoop() {
    resetAllState();
    ensureCursor();
    if (isFirstIteration) {
      isFirstIteration = false;
    }

    const timeline = buildTimeline();
    choreo = new Choreography({
      timeline,
      duration: LOOP_DURATION,
      onReset: resetAllState
    });
    choreo.play();

    loopTimer = setTimeout(() => {
      choreo.reset();
      startLoop();
    }, LOOP_DURATION);
  }

  function stopLoop() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (choreo) choreo.pause();
  }

  const observer = new LoopObserver({
    element: rootEl,
    onEnter: () => {
      if (choreo && choreo.state === 'paused') {
        const remaining = LOOP_DURATION - choreo.elapsedMs;
        choreo.resume();
        loopTimer = setTimeout(() => {
          choreo.reset();
          startLoop();
        }, Math.max(0, remaining));
      } else {
        startLoop();
      }
    },
    onExit: () => {
      stopLoop();
    }
  });
  observer.start();
}
