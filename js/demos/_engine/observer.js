/* Demo engine — viewport + tab visibility observer.
   Dual-gate play: both conditions must be true.
     1. Element intersects viewport at threshold 0.5
     2. document.visibilityState === 'visible' (tab not backgrounded)

   On either condition flipping false → fires onExit.
   On both becoming true → fires onEnter.

   This is one of two improvements over Benji's implementation (the other
   is the prefers-reduced-motion gate). Documented in the autoplay
   decomposition research file as modules M5 and M6.

   API:
     const obs = new LoopObserver({ element, onEnter, onExit });
     obs.start();
     obs.stop();   // tears down listeners
*/
export class LoopObserver {
  constructor({ element, onEnter, onExit }) {
    this.element = element;
    this.onEnter = onEnter || (() => {});
    this.onExit = onExit || (() => {});
    this._inViewport = false;
    this._tabVisible = document.visibilityState === 'visible';
    this._playing = false;
    this._io = null;
    this._onVisChange = this._onVisChange.bind(this);
  }

  _evaluate() {
    const shouldPlay = this._inViewport && this._tabVisible;
    if (shouldPlay && !this._playing) {
      this._playing = true;
      this.onEnter();
    } else if (!shouldPlay && this._playing) {
      this._playing = false;
      this.onExit();
    }
  }

  _onVisChange() {
    this._tabVisible = document.visibilityState === 'visible';
    this._evaluate();
  }

  start() {
    if (this._io) return;
    // Safari has historically had subtle bugs around single-threshold
    // values on tall elements. Using a multi-threshold array makes the
    // observer fire on any of them — whichever WebKit honors first wins.
    this._io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        this._inViewport = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        this._evaluate();
      });
    }, { threshold: [0, 0.25, 0.5], rootMargin: '0px' });
    this._io.observe(this.element);
    document.addEventListener('visibilitychange', this._onVisChange);
  }

  stop() {
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
    document.removeEventListener('visibilitychange', this._onVisChange);
    if (this._playing) {
      this._playing = false;
      this.onExit();
    }
  }
}
