/* LexisNexis Case Study Demos (2026-06-09)
 * ====================================================================
 *
 * Four body components for work/lexisnexis.html, built per the Benji
 * body-demo discipline (.claude/research/2026-05-25_benji-
 * componentization-philosophy.md): ~330px frames, browser-bar chrome,
 * ONE component per demo, designed-down wireframe fidelity with
 * strategic real text, 6-10s loops, caption below each.
 *
 *   1. lxt — Token Aliasing (autoplay ~8.5s)
 *      Swatch ramp on the left; Figma-style variables panel on the
 *      right. Three swatches map to semantic aliases one at a time,
 *      alias names type in. Performs "name by usage, not appearance."
 *
 *   2. lxr — Research Taxonomy (autoplay ~9.5s)
 *      Interview quotes fly into three tag buckets (Persona, Migrated,
 *      Product Area); counts tick up; insight banner lands. Performs
 *      "8 interviews became a tagged, queryable dataset."
 *
 *   3. lxw — Widget Builder (INTERACTIVE, real OS cursor)
 *      Modeled on the actual Custom Layouts prototype: pick a widget
 *      from the sidebar, press Add to layout, the tile springs into
 *      the dashboard grid. Click a placed tile to remove. Reset.
 *
 *   4. lxo — Before/After Pipeline (autoplay ~10s)
 *      The footer_apr23 diagram, performed: the BEFORE row (6 manual
 *      handoff steps) lights up slowly with dashed crawl; the AFTER
 *      row (3 nodes) zips through in a beat. Tempo contrast IS the
 *      metric (full day vs 30 seconds).
 *
 * Engine imports: Choreography, LoopObserver, prefersReduced.
 * Autoplay demos gate on LoopObserver (pause off-screen). The
 * interactive demo needs no observer (user-driven, no idle cost).
 */

import { Choreography, LoopObserver, prefersReduced } from './_engine/index.js';

/* ------------------------------------------------------------------ */
/* Shared: character-by-character typing into an element.             */
/* ------------------------------------------------------------------ */
function typeText(el, text, durationMs) {
  if (!el) return;
  el.textContent = '';
  el.classList.add('is-typing');
  var len = text.length;
  var tick = Math.max(24, Math.floor(durationMs / len));
  var i = 0;
  (function step() {
    if (!el.classList.contains('is-typing')) return; /* cancelled */
    if (i >= len) { el.classList.remove('is-typing'); return; }
    el.textContent = text.slice(0, i + 1);
    i += 1;
    setTimeout(step, tick);
  })();
}
function cancelType(el) {
  if (el) el.classList.remove('is-typing');
}

/* Generic autoplay wiring: build timeline per iteration, loop with
 * setTimeout, gate via LoopObserver. Mirrors the hero pattern. */
function autoplay(rootEl, loopMs, buildTimeline, resetAll) {
  var choreo = null;
  var timerId = null;
  function play() {
    choreo = new Choreography({ timeline: buildTimeline(), duration: loopMs, onReset: resetAll });
    choreo.play();
    timerId = setTimeout(function () { resetAll(); play(); }, loopMs);
  }
  function stop() {
    if (timerId) { clearTimeout(timerId); timerId = null; }
    if (choreo) choreo.pause();
  }
  var observer = new LoopObserver({
    element: rootEl,
    onEnter: function () { play(); },
    onExit:  function () { stop(); }
  });
  observer.start();
}

/* ================================================================== */
/* 1. TOKEN ALIASING (lxt)                                            */
/* ================================================================== */
(function initTokenDemo() {
  var rootEl = document.getElementById('lxtTokenDemo');
  if (!rootEl) return;
  if (prefersReduced()) { rootEl.classList.add('lxt-reduced'); return; }

  var swatches = rootEl.querySelectorAll('.lxt-swatch[data-step]');
  var rows = rootEl.querySelectorAll('.lxt-var-row[data-step]');
  var lines = rootEl.querySelectorAll('.lxt-wire[data-step]');
  var aliases = ['feedback-error', 'surface-elevated', 'brand-action'];

  function resetAll() {
    swatches.forEach(function (s) { s.classList.remove('is-active', 'is-done'); });
    rows.forEach(function (r) {
      r.classList.remove('is-active', 'is-done');
      var name = r.querySelector('.lxt-var-name');
      if (name) { cancelType(name); name.textContent = ''; }
    });
    lines.forEach(function (l) { l.classList.remove('is-drawn'); });
  }

  function beatFor(step, atMs) {
    var s = rootEl.querySelector('.lxt-swatch[data-step="' + step + '"]');
    var r = rootEl.querySelector('.lxt-var-row[data-step="' + step + '"]');
    var l = rootEl.querySelector('.lxt-wire[data-step="' + step + '"]');
    var nameEl = r ? r.querySelector('.lxt-var-name') : null;
    return [
      { at: atMs, do: function () {
        if (s) s.classList.add('is-active');
      }},
      { at: atMs + 350, do: function () {
        if (l) l.classList.add('is-drawn');
        if (r) r.classList.add('is-active');
      }},
      { at: atMs + 700, do: function () {
        if (nameEl) typeText(nameEl, aliases[step], 520);
      }},
      { at: atMs + 1500, do: function () {
        if (s) { s.classList.remove('is-active'); s.classList.add('is-done'); }
        if (r) { r.classList.remove('is-active'); r.classList.add('is-done'); }
      }}
    ];
  }

  function buildTimeline() {
    return []
      .concat(beatFor(0, 500))
      .concat(beatFor(1, 2400))
      .concat(beatFor(2, 4300))
      /* T=6200-8200: all three mapped, hold the completed state. */
      ;
  }

  autoplay(rootEl, 8200, buildTimeline, resetAll);
})();

/* ================================================================== */
/* 2. RESEARCH TAXONOMY (lxr)                                          */
/* ================================================================== */
(function initResearchDemo() {
  var rootEl = document.getElementById('lxrResearchDemo');
  if (!rootEl) return;
  if (prefersReduced()) { rootEl.classList.add('lxr-reduced'); return; }

  var quotes = rootEl.querySelectorAll('.lxr-quote[data-step]');
  var buckets = rootEl.querySelectorAll('.lxr-bucket');
  var counts = rootEl.querySelectorAll('.lxr-bucket-count');
  var insight = rootEl.querySelector('.lxr-insight');
  var baseCounts = [12, 18, 9];

  function resetAll() {
    quotes.forEach(function (q) { q.classList.remove('is-visible', 'is-flying'); });
    buckets.forEach(function (b) { b.classList.remove('is-receiving'); });
    counts.forEach(function (c, i) { c.textContent = String(baseCounts[i]); });
    if (insight) insight.classList.remove('is-visible');
  }

  /* Pacing (2026-06-09 readability fix): each quote now holds on
   * screen for 2.2s before flying into its bucket (was 0.9s, which
   * the user flagged as too fast to read). Loop grew 9.4s -> 13.6s. */
  function beatFor(step, atMs) {
    var q = rootEl.querySelector('.lxr-quote[data-step="' + step + '"]');
    var b = buckets[step];
    var c = counts[step];
    return [
      { at: atMs, do: function () {
        if (q) q.classList.add('is-visible');
      }},
      { at: atMs + 2200, do: function () {
        if (q) q.classList.add('is-flying');
        if (b) b.classList.add('is-receiving');
      }},
      { at: atMs + 2750, do: function () {
        if (q) q.classList.remove('is-visible', 'is-flying');
        if (b) b.classList.remove('is-receiving');
        if (c) c.textContent = String(baseCounts[step] + 1);
      }}
    ];
  }

  function buildTimeline() {
    return []
      .concat(beatFor(0, 400))
      .concat(beatFor(1, 3600))
      .concat(beatFor(2, 6800))
      .concat([
        { at: 10000, do: function () { if (insight) insight.classList.add('is-visible'); } }
        /* hold insight through T=13600 */
      ]);
  }

  autoplay(rootEl, 13600, buildTimeline, resetAll);
})();

/* ================================================================== */
/* 3. WIDGET BUILDER (lxw) — interactive                               */
/* ================================================================== */
(function initWidgetBuilder() {
  var rootEl = document.getElementById('lxwWidgetBuilder');
  if (!rootEl) return;

  var reduced = prefersReduced();
  var chips = rootEl.querySelectorAll('.lxw-chip');
  var addBtn = rootEl.querySelector('.lxw-add-btn');
  var resetBtn = rootEl.querySelector('.lxw-reset-btn');
  var slots = rootEl.querySelectorAll('.lxw-slot');
  var counter = rootEl.querySelector('.lxw-counter');
  var hint = rootEl.querySelector('.lxw-hint');

  var selectedType = null;
  var placedCount = 0;

  /* Tile inner markup per widget type. Designed-down wireframe bars +
   * one strategic real-text label, per Benji fidelity discipline. */
  var TILE_TEMPLATES = {
    overview: '<span class="lxw-tile-label">Overview</span><span class="lxw-tile-row"><span class="lxw-tile-stat"></span><span class="lxw-tile-stat"></span><span class="lxw-tile-stat"></span></span>',
    graph:    '<span class="lxw-tile-label">Graph</span><span class="lxw-tile-chart"><i style="height:38%"></i><i style="height:64%"></i><i style="height:46%"></i><i style="height:82%"></i><i style="height:58%"></i><i style="height:71%"></i></span>',
    table:    '<span class="lxw-tile-label">Table</span><span class="lxw-tile-line" style="width:88%"></span><span class="lxw-tile-line" style="width:72%"></span><span class="lxw-tile-line" style="width:80%"></span>',
    summary:  '<span class="lxw-tile-label">Summary</span><span class="lxw-tile-line" style="width:64%"></span><span class="lxw-tile-line lxw-tile-line--accent" style="width:42%"></span>'
  };

  function updateChrome() {
    if (counter) counter.textContent = placedCount + (placedCount === 1 ? ' widget' : ' widgets');
    if (addBtn) addBtn.disabled = !selectedType || placedCount >= slots.length;
    if (hint) {
      if (placedCount >= slots.length) hint.textContent = 'Layout full. Click a tile to remove it, or reset.';
      else if (selectedType) hint.textContent = 'Now press Add to layout.';
      else hint.textContent = 'Pick a widget from the left.';
    }
  }

  function selectChip(chip) {
    chips.forEach(function (c) {
      c.classList.remove('is-selected');
      c.setAttribute('aria-pressed', 'false');
    });
    if (chip) {
      chip.classList.add('is-selected');
      chip.setAttribute('aria-pressed', 'true');
      selectedType = chip.getAttribute('data-widget');
    } else {
      selectedType = null;
    }
    updateChrome();
  }

  function firstFreeSlot() {
    for (var i = 0; i < slots.length; i++) {
      if (!slots[i].querySelector('.lxw-tile')) return slots[i];
    }
    return null;
  }

  function addWidget() {
    if (!selectedType) return;
    var slot = firstFreeSlot();
    if (!slot) return;
    var tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'lxw-tile lxw-tile--' + selectedType;
    tile.setAttribute('aria-label', 'Remove ' + selectedType + ' widget');
    tile.innerHTML = TILE_TEMPLATES[selectedType] || '';
    tile.addEventListener('click', function () {
      if (reduced) { tile.remove(); placedCount -= 1; updateChrome(); return; }
      tile.classList.add('is-leaving');
      setTimeout(function () { tile.remove(); placedCount -= 1; updateChrome(); }, 240);
    });
    slot.appendChild(tile);
    placedCount += 1;
    if (!reduced) {
      /* Spring-in on the next frame so the entry transition fires. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { tile.classList.add('is-placed'); });
      });
    } else {
      tile.classList.add('is-placed');
    }
    selectChip(null);
    updateChrome();
  }

  function resetAll() {
    rootEl.querySelectorAll('.lxw-tile').forEach(function (t) { t.remove(); });
    placedCount = 0;
    selectChip(null);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (chip.classList.contains('is-selected')) selectChip(null);
      else selectChip(chip);
    });
  });
  if (addBtn) addBtn.addEventListener('click', addWidget);
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  updateChrome();
})();

/* ================================================================== */
/* 4. BEFORE/AFTER PIPELINE (lxo)                                      */
/* ================================================================== */
(function initOutcomeDemo() {
  var rootEl = document.getElementById('lxoOutcomeDemo');
  if (!rootEl) return;
  if (prefersReduced()) { rootEl.classList.add('lxo-reduced'); return; }

  var beforeNodes = rootEl.querySelectorAll('.lxo-row--before .lxo-node');
  var beforeArrows = rootEl.querySelectorAll('.lxo-row--before .lxo-arrow');
  var beforeBadge = rootEl.querySelector('.lxo-badge--before');
  var beforeRow = rootEl.querySelector('.lxo-row--before');
  var afterNodes = rootEl.querySelectorAll('.lxo-row--after .lxo-node');
  var afterArrows = rootEl.querySelectorAll('.lxo-row--after .lxo-arrow');
  var afterBadge = rootEl.querySelector('.lxo-badge--after');

  function resetAll() {
    beforeNodes.forEach(function (n) { n.classList.remove('is-lit'); });
    beforeArrows.forEach(function (a) { a.classList.remove('is-lit'); });
    afterNodes.forEach(function (n) { n.classList.remove('is-lit'); });
    afterArrows.forEach(function (a) { a.classList.remove('is-lit'); });
    if (beforeBadge) beforeBadge.classList.remove('is-visible');
    if (afterBadge) afterBadge.classList.remove('is-visible');
    if (beforeRow) beforeRow.classList.remove('is-dimmed');
  }

  function buildTimeline() {
    var beats = [];
    /* BEFORE row: 6 nodes light slowly, 620ms apart. Dashed arrows
     * light between them. The slowness IS the point. */
    var t = 300;
    beforeNodes.forEach(function (node, i) {
      (function (nn, at) {
        beats.push({ at: at, do: function () { nn.classList.add('is-lit'); } });
      })(node, t);
      if (i < beforeArrows.length) {
        (function (aa, at) {
          beats.push({ at: at + 310, do: function () { aa.classList.add('is-lit'); } });
        })(beforeArrows[i], t);
      }
      t += 620;
    });
    /* Badge after the whole slog: "< 1 day / 3 people" */
    beats.push({ at: t + 100, do: function () {
      if (beforeBadge) beforeBadge.classList.add('is-visible');
    }});
    /* AFTER row: zips. 3 nodes, 170ms apart, starting after a beat. */
    var t2 = t + 900;
    afterNodes.forEach(function (node, i) {
      (function (nn, at) {
        beats.push({ at: at, do: function () { nn.classList.add('is-lit'); } });
      })(node, t2);
      if (i < afterArrows.length) {
        (function (aa, at) {
          beats.push({ at: at + 90, do: function () { aa.classList.add('is-lit'); } });
        })(afterArrows[i], t2);
      }
      t2 += 170;
    });
    /* AFTER badge pops + BEFORE row dims: the contrast beat. */
    beats.push({ at: t2 + 150, do: function () {
      if (afterBadge) afterBadge.classList.add('is-visible');
      if (beforeRow) beforeRow.classList.add('is-dimmed');
    }});
    /* hold done state through ~10200 */
    return beats;
  }

  autoplay(rootEl, 10200, buildTimeline, resetAll);
})();
