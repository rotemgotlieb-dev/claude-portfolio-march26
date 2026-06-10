/* Demo engine — comment popup primitive (Benji-style).
   Used by demos that need a labeled callout with optional typing
   animation + Cancel/Add buttons. Matches the visual pattern
   documented in .claude/research/2026-05-25_benji-componentization-philosophy.md
   under Page 1 → text-selection / element-click / multi-select demos.

   Distinct from the existing .demo-popup (dark labeled callout in
   styles.css line 1895). The Benji-style popup is light-background,
   border + shadow chrome, header text + input field with caret +
   Cancel/Add buttons. CSS lives under .demo-comment-popup in
   styles.css (added by Phase 2 of V2 sprint).

   Easing curve per "Verified motion specifications"
   (.claude/design-decisions.md): back-out cubic-bezier(0.34, 1.56,
   0.64, 1) at 250ms on show; 150ms ease on hide.

   API:
     const popup = new Popup(container);
     popup.mount();
     await popup.show({ x, y, header: 'Add comment', submitLabel: 'Add' });
     await popup.typeInto('Bottom edge is misaligned');
     await popup.hide();
     popup.destroy();

   The mount step inserts the popup into the container's coordinate
   space (container must be position: relative or absolute). Default
   position is offscreen until show() runs.
*/
export class Popup {
  constructor(container) {
    this.container = container;
    this.el = null;
    this._inputEl = null;
    this._headerEl = null;
    this._cancelBtn = null;
    this._submitBtn = null;
    this._typingAbort = false;
  }

  mount() {
    if (this.el) return;
    const el = document.createElement('div');
    el.className = 'demo-comment-popup';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="demo-comment-popup__header"></div>' +
      '<div class="demo-comment-popup__input">' +
        '<span class="demo-comment-popup__text"></span>' +
        '<span class="demo-comment-popup__caret" aria-hidden="true"></span>' +
      '</div>' +
      '<div class="demo-comment-popup__buttons">' +
        '<button class="demo-comment-popup__btn demo-comment-popup__btn--cancel" type="button" tabindex="-1">Cancel</button>' +
        '<button class="demo-comment-popup__btn demo-comment-popup__btn--submit" type="button" tabindex="-1">Add</button>' +
      '</div>';
    el.style.left = '-9999px';
    el.style.top = '-9999px';
    this.container.appendChild(el);
    this._inputEl = el.querySelector('.demo-comment-popup__text');
    this._headerEl = el.querySelector('.demo-comment-popup__header');
    this._cancelBtn = el.querySelector('.demo-comment-popup__btn--cancel');
    this._submitBtn = el.querySelector('.demo-comment-popup__btn--submit');
    this.el = el;
  }

  /* Position + show with back-out easing. Returns Promise that resolves
     after the transition completes (250ms). Container coordinates. */
  show(opts) {
    if (!this.el) return Promise.resolve();
    const o = opts || {};
    if (typeof o.x === 'number') this.el.style.left = o.x + 'px';
    if (typeof o.y === 'number') this.el.style.top = o.y + 'px';
    if (o.header != null) this.setHeader(o.header);
    if (o.cancelLabel != null) this._cancelBtn.textContent = o.cancelLabel;
    if (o.submitLabel != null) this._submitBtn.textContent = o.submitLabel;
    if (o.submitVariant) {
      this._submitBtn.classList.remove(
        'demo-comment-popup__btn--submit-default',
        'demo-comment-popup__btn--submit-green',
        'demo-comment-popup__btn--submit-red'
      );
      this._submitBtn.classList.add('demo-comment-popup__btn--submit-' + o.submitVariant);
    }
    this._inputEl.textContent = '';
    void this.el.offsetWidth;
    this.el.classList.add('is-visible');
    return new Promise(resolve => setTimeout(resolve, 250));
  }

  hide() {
    if (!this.el) return Promise.resolve();
    this.el.classList.remove('is-visible');
    this._typingAbort = true;
    return new Promise(resolve => setTimeout(resolve, 150));
  }

  /* Type characters into the input field one at a time. Default
     50ms/char (Benji's pace). opts.charDelay overrides. opts.delayBefore
     gives a pause between show() resolving and typing starting (default 0).
     Returns Promise resolving when typing is complete OR hide() is called
     mid-typing (which sets _typingAbort to true). */
  typeInto(text, opts) {
    if (!this.el || !text) return Promise.resolve();
    const o = opts || {};
    const charDelay = typeof o.charDelay === 'number' ? o.charDelay : 50;
    const delayBefore = typeof o.delayBefore === 'number' ? o.delayBefore : 0;
    this._typingAbort = false;
    const inputEl = this._inputEl;
    return new Promise(resolve => {
      let i = 0;
      const step = () => {
        if (this._typingAbort) return resolve();
        if (i >= text.length) return resolve();
        inputEl.textContent = text.slice(0, i + 1);
        i++;
        setTimeout(step, charDelay);
      };
      setTimeout(step, delayBefore);
    });
  }

  setHeader(text) {
    if (this._headerEl) this._headerEl.textContent = text;
  }

  setButtons(opts) {
    if (!opts) return;
    if (opts.cancel != null) this._cancelBtn.textContent = opts.cancel;
    if (opts.submit != null) this._submitBtn.textContent = opts.submit;
    if (opts.submitVariant) {
      this._submitBtn.classList.remove(
        'demo-comment-popup__btn--submit-default',
        'demo-comment-popup__btn--submit-green',
        'demo-comment-popup__btn--submit-red'
      );
      this._submitBtn.classList.add('demo-comment-popup__btn--submit-' + opts.submitVariant);
    }
  }

  destroy() {
    if (!this.el) return;
    this.el.remove();
    this.el = null;
    this._inputEl = null;
    this._headerEl = null;
    this._cancelBtn = null;
    this._submitBtn = null;
    this._typingAbort = true;
  }
}
