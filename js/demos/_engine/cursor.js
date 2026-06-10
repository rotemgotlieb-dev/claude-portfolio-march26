/* Demo engine — custom cursor.
   DOM-rendered cursor that follows scripted paths. CSS transitions on
   `left` / `top` produce the eased motion; `transitionend` is awaited
   so sequential moves don't collapse into one (see Mobile Video §7b and
   research file §M0 cursor mechanism).

   V3 EASING STRATIFICATION (2026-05-26, per canonical-motion-spec.md §2.1):
   Easing depends on motion context, not personality (Disney Slow-in/Slow-out).
   - Cursor TRAVERSAL (on-screen → on-screen): ease-in-out
     cubic-bezier(0.77, 0, 0.175, 1) — accelerates from rest, decelerates
     to rest. Default in styles.css .demo-cursor rule.
   - Cursor ARRIVAL (offscreen → on-screen): ease-out-snappy
     cubic-bezier(0.23, 1, 0.32, 1). NOT default — pass opts.easing if a
     demo introduces an arrival motion in its loop body. Our hero has no
     in-loop arrival (cursor mounts via opacity fade only).
   - Cursor EXIT (on-screen → offscreen): ease-in
     cubic-bezier(0.7, 0, 0.84, 0). NOT default — pass opts.easing.

   V2 used Penner easeOutQuad cubic-bezier(0.25, 0.46, 0.45, 0.94) as the
   universal default, which Gemini Round 2 diagnosed as the root cause of
   the "mechanical feel" — ease-out is correct for arrivals, wrong for
   traversal.

   V3 STAMPING MOTION (2026-05-26, per canonical-motion-spec.md §2.1):
   Click feedback uses clickStamp() — cursor translates 5px down + drop-
   shadow flattens to 0px offset for 100ms (40% keyframe), then restores.
   The OLD click() method (scale-based pulse) is deprecated but preserved
   for backwards compatibility. New code should use clickStamp().

   API:
     const cursor = new Cursor(container);
     cursor.mount();
     await cursor.moveTo(x, y);              // traversal easing (V3 default)
     await cursor.moveTo(x, y, { duration: 700 });  // slower settling move
     cursor.clickStamp();                    // V3-canonical stamping motion
     cursor.click();                         // DEPRECATED — V2 scale pulse
     cursor.hide(); cursor.show();
     cursor.destroy();
*/
export class Cursor {
  constructor(container) {
    this.container = container;
    this.el = null;
    this._pendingResolves = [];
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  mount() {
    if (this.el) return;
    const el = document.createElement('div');
    el.className = 'demo-cursor';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22">' +
        '<path d="M5 3 L5 17 L9 13 L11 19 L14 18 L12 12 L17 12 Z" ' +
              'fill="#1A1A1A" stroke="#FFFFFF" stroke-width="1.4" stroke-linejoin="round"/>' +
      '</svg>';
    // Initial position offscreen so the first moveTo doesn't transition
    // from {0,0} visibly. Inline style keeps the CSS file authoritative
    // for everything else.
    el.style.left = '-40px';
    el.style.top = '-40px';
    this.container.appendChild(el);
    el.addEventListener('transitionend', this._onTransitionEnd);
    this.el = el;
  }

  _onTransitionEnd(e) {
    if (e.propertyName !== 'left' && e.propertyName !== 'top') return;
    const resolves = this._pendingResolves;
    this._pendingResolves = [];
    resolves.forEach(fn => fn());
  }

  /* Move to (x, y) in container-local coordinates. Resolves on
     transitionend. If a move is in flight when called, the resolves
     of the previous move are dropped — the caller of the prior move
     is presumed to have moved on (next setTimeout in the timeline).

     opts.duration (ms): per-move duration override. Default is the
     CSS-defined 400ms easeOutQuad. Used for slower "settling" moves
     at loop seams (700ms return-to-rest per Tweak 3 calibration).
     Easing curve stays at the engine default; only the duration
     changes. The transition is restored to CSS default on transitionend. */
  moveTo(x, y, opts) {
    if (!this.el) return Promise.resolve();
    if (opts && opts.duration) {
      return this._moveWithDuration(x, y, opts.duration);
    }
    return new Promise(resolve => {
      this._pendingResolves.push(resolve);
      this.el.style.left = x + 'px';
      this.el.style.top = y + 'px';
    });
  }

  /* Internal: move with a one-shot duration override. The transition
     stack below mirrors the styles.css .demo-cursor rule with left/top
     duration replaced. V3 (2026-05-26): easing curve updated from
     Penner easeOutQuad to traversal ease-in-out cubic-bezier(0.77, 0,
     0.175, 1) to match the CSS default. If the CSS-side easing curve
     is ever changed, mirror the change here. */
  _moveWithDuration(x, y, duration) {
    const el = this.el;
    el.style.transition =
      `left ${duration}ms cubic-bezier(0.77, 0, 0.175, 1), ` +
      `top ${duration}ms cubic-bezier(0.77, 0, 0.175, 1), ` +
      `opacity 200ms ease, ` +
      `transform 150ms cubic-bezier(0.16, 1, 0.3, 1)`;
    return new Promise(resolve => {
      const onEnd = (e) => {
        if (e.propertyName !== 'left' && e.propertyName !== 'top') return;
        el.removeEventListener('transitionend', onEnd);
        el.style.transition = ''; // restore CSS default
        resolve();
      };
      el.addEventListener('transitionend', onEnd);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });
  }

  /* Snap to a position without transitioning. Used by .reset() to teleport
     the cursor offscreen between loop iterations without a visible drift. */
  snapTo(x, y) {
    if (!this.el) return;
    this.el.classList.add('is-snapping');
    this.el.style.left = x + 'px';
    this.el.style.top = y + 'px';
    // Force reflow so the snap commits before the class is removed
    void this.el.offsetWidth;
    this.el.classList.remove('is-snapping');
  }

  /* DEPRECATED (V3, 2026-05-26): V2 scale-based click pulse. Preserved for
     backwards compatibility. New code should use clickStamp() instead — V3
     canonical click feedback is a stamping motion (translateY + shadow
     shift), NOT a scale compression. Per canonical-motion-spec.md §2.1
     "Click pulse motion: Compression only — no Y-axis displacement on the
     TARGET" — the TARGET element scales; the CURSOR stamps. */
  click() {
    if (!this.el) return;
    this.el.classList.remove('is-clicking');
    void this.el.offsetWidth;
    this.el.classList.add('is-clicking');
  }

  /* V3 click feedback (2026-05-26, per canonical-motion-spec.md §2.1):
     stamping motion via translateY(5px) + drop-shadow shift to 0px offset
     for 100ms (40% keyframe peak), then restores. Biomechanically reads
     as the cursor depressing INTO the surface — the missing-from-V2 polish
     detail that Gemini Round 2 follow-up identified. */
  clickStamp() {
    if (!this.el) return;
    this.el.classList.remove('is-stamping');
    void this.el.offsetWidth;  // force reflow so rapid re-fire restarts the animation
    this.el.classList.add('is-stamping');
  }

  hide() { if (this.el) this.el.classList.add('is-hidden'); }
  show() { if (this.el) this.el.classList.remove('is-hidden'); }

  destroy() {
    if (!this.el) return;
    this.el.removeEventListener('transitionend', this._onTransitionEnd);
    this.el.remove();
    this.el = null;
    this._pendingResolves = [];
  }
}
