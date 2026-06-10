/* Demo engine — barrel.
   Re-exports the public surface of every module so per-demo scripts
   import from one place:

     import { Cursor, Choreography, LoopObserver,
              Popup, Marker,
              getCenterOf, pulse, crossfade, setPillPosition,
              blurCrossfade, BLUR_LIGHT, BLUR_HEAVY,
              prefersReduced } from '../_engine/index.js';

   Primitives in this barrel:
     - Cursor          (cursor.js)         scripted cursor pointer
     - Choreography    (choreography.js)   timeline runner with pause/resume
     - LoopObserver    (observer.js)       viewport + tab visibility gate
     - Popup           (popup.js)          Benji-style comment popup
     - Marker          (marker.js)         numbered annotation pin
   Utilities:
     - getCenterOf     (motion.js)         element center in container coords
     - pulse           (motion.js)         click pulse animation
     - crossfade       (motion.js)         opacity-only sibling swap
     - setPillPosition (motion.js)         chip-pill background slide
     - blurCrossfade   (motion.js)         opacity + blur sibling swap
     - BLUR_LIGHT      (motion.js)         2px blur — Kowalski variant
     - BLUR_HEAVY      (motion.js)         16px blur — Salaja variant
     - prefersReduced  (reduced-motion.js) reduced-motion gate
*/
export { Cursor } from './cursor.js';
export { Choreography } from './choreography.js';
export { LoopObserver } from './observer.js';
export { Popup } from './popup.js';
export { Marker } from './marker.js';
export {
  getCenterOf,
  pulse,
  crossfade,
  setPillPosition,
  blurCrossfade,
  BLUR_LIGHT,
  BLUR_HEAVY
} from './motion.js';
export { prefersReduced } from './reduced-motion.js';
