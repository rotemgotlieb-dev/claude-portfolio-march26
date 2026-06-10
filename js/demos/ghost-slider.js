/* Ghost Slider — vanilla port of ComparisonSlider.tsx (2026-05-21)
   Drives the .demo-frame-body--16-9 > .ghost-slider component on
   work/ghost.html. Updates the --slider-pos custom property on the
   .ghost-slider element; CSS cascades that to handle position and
   production panel clip-path.

   Conventions:
   - Self-contained IIFE matching main.js style (no globals).
   - .is-dragging applied dynamically; per JS-State Classes §1 NEVER
     ships in static HTML.
   - .is-initialized added on first setPosition() to reveal handle
     (handle is visibility:hidden default; see open item #6).
   - Loaded only on ghost.html via end-of-body script tag; querySelector
     returns null on other pages and the IIFE no-ops.
*/
(function () {
  var slider = document.querySelector('[data-slider]');
  if (!slider) return;

  var handle = slider.querySelector('[data-handle]');
  if (!handle) return;

  var isDragging = false;
  var position = 50; // percent

  function setPosition(pct) {
    position = Math.max(0, Math.min(100, pct));
    slider.style.setProperty('--slider-pos', position + '%');
    handle.setAttribute('aria-valuenow', Math.round(position));
  }

  function updateFromClientX(clientX) {
    var rect = slider.getBoundingClientRect();
    if (rect.width === 0) return;
    setPosition(((clientX - rect.left) / rect.width) * 100);
  }

  handle.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    isDragging = true;
    slider.classList.add('is-dragging');
    updateFromClientX(e.clientX);
  });

  // Per W3C Pointer Events: with setPointerCapture, events still bubble
  // from the capturing element. Listening on slider catches the bubbled
  // pointermove/up from the captured handle.
  slider.addEventListener('pointermove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    updateFromClientX(e.clientX);
  });

  slider.addEventListener('pointerup', function () {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('is-dragging');
  });

  slider.addEventListener('pointercancel', function () {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('is-dragging');
  });

  // Keyboard navigation — WAI-ARIA Slider Pattern
  handle.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 10 : 2;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setPosition(position - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setPosition(position + step);
        break;
      case 'Home':
        e.preventDefault();
        setPosition(0);
        break;
      case 'End':
        e.preventDefault();
        setPosition(100);
        break;
      case 'PageDown':
        e.preventDefault();
        setPosition(position - 10);
        break;
      case 'PageUp':
        e.preventDefault();
        setPosition(position + 10);
        break;
    }
  });

  // Init: snap to 50% and reveal handle (was visibility:hidden in CSS)
  setPosition(50);
  slider.classList.add('is-initialized');
})();
