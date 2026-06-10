/* ============================================
   ROTEM GOTLIEB — PORTFOLIO
   v7: Rebuilt intro animation from scratch
   ============================================ */

(function () {
  'use strict';

  var transitionOverlay = document.querySelector('.page-transition');
  var nameIntro = document.getElementById('nameIntro');
  var isHomepage = !!nameIntro;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState === 'complete') {
      fn();
    } else {
      window.addEventListener('load', fn);
    }
  }


  /* ============================================
     INTRO ANIMATION — v8 JS-orchestrated timeline
     T+0ms     Name reveal (CSS)
     T+600ms   Icons burst (CSS)
     T+900ms   Mouse glide starts (JS rAF)
     T+1700ms  Mouse arrives at Figma
     T+1850ms  Click + spark lines
     T+2150ms  Hide intro content
     T+2200ms  Circle wipe
     T+2600ms  Wipe complete, homepage visible
     ============================================ */

  /* --- Cubic Bezier curve math for smooth mouse path --- */
  function cubicBezier(t, p0, p1, p2, p3) {
    var u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* --- Animate mouse cursor along a bezier arc --- */
  function animateMouseToFigma(el, sx, sy, ex, ey, duration, onDone) {
    var cp1x = sx + (ex - sx) * 0.3;
    var cp1y = Math.max(sy, ey) + 30;
    var cp2x = sx + (ex - sx) * 0.7;
    var cp2y = ey + 15;

    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var t = easeInOutCubic(Math.min(elapsed / duration, 1));
      var x = cubicBezier(t, sx, cp1x, cp2x, ex);
      var y = cubicBezier(t, sy, cp1y, cp2y, ey);
      el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else if (onDone) {
        onDone();
      }
    }
    el.style.willChange = 'transform';
    requestAnimationFrame(frame);
  }


  /* ---- Decide whether to play or skip the intro ---- */
  function shouldPlayIntro() {
    var navEntry = performance.getEntriesByType('navigation')[0];
    var isReload = navEntry && navEntry.type === 'reload';
    var playedAt = localStorage.getItem('introPlayedAt');
    var hasPlayed = playedAt && (Date.now() - Number(playedAt)) < 604800000;
    // Play on: first visit (no flag / expired) OR manual refresh
    return isReload || !hasPlayed;
  }

  function skipIntroAnimation() {
    if (nameIntro) {
      nameIntro.classList.add('hidden');
      nameIntro.style.display = 'none';
    }
    var introReveal = document.getElementById('introReveal');
    if (introReveal) introReveal.style.display = 'none';
    document.body.classList.remove('intro-active');
    if (transitionOverlay) transitionOverlay.classList.remove('active');
    triggerLoadAnimations();
  }

  function playNameOnlyIntro() {
    var introEl = document.getElementById('nameIntro');
    if (!introEl) { triggerLoadAnimations(); return; }

    document.body.classList.add('intro-active');

    // Hide icons, burst, and reveal overlay — show only the name
    var iconsEl = introEl.querySelector('.intro-icons');
    var burstEl = introEl.querySelector('.intro-click-burst');
    var revealEl = document.getElementById('introReveal');
    if (iconsEl) iconsEl.style.display = 'none';
    if (burstEl) burstEl.style.display = 'none';
    if (revealEl) revealEl.style.display = 'none';

    // Override character stagger for narrow viewport: 50ms per char
    // Last char starts at 11×50=550ms, finishes fade-in at ~950ms, hold 200ms, then fade out
    var allChars = introEl.querySelectorAll('.name-char');
    for (var i = 0; i < allChars.length; i++) {
      allChars[i].style.animationDelay = (i * 50) + 'ms';
    }

    // Fade-out at 1200ms (after all chars visible + 200ms hold), homepage by 1600ms
    setTimeout(function () {
      introEl.style.transition = 'opacity 400ms ease';
      introEl.style.opacity = '0';
      setTimeout(function () {
        introEl.style.display = 'none';
        document.body.classList.remove('intro-active');
        if (transitionOverlay) transitionOverlay.classList.remove('active');
        localStorage.setItem('introPlayedAt', Date.now().toString());
        triggerLoadAnimations();
      }, 400);
    }, 1200);
  }

  function playIntroAnimation() {
    // Narrow viewports: name-only animation (no icons/cursor/burst/wipe)
    if (window.innerWidth < 1000) {
      playNameOnlyIntro();
      return;
    }

    document.body.classList.add('intro-active');

    onReady(function () {
      if (transitionOverlay) transitionOverlay.classList.remove('active');

      var introInner = document.getElementById('nameIntroInner');
      var cursorEl = document.getElementById('introCursor');
      var figmaEl = document.querySelector('.icon-figma');
      var clickBurst = document.getElementById('clickBurst');
      var introReveal = document.getElementById('introReveal');

      /* --- Desktop timeline ---
         All positions calculated from CSS custom properties at runtime.
         NO getBoundingClientRect() on animated elements.
         Reads --ix/--iy from computed styles so tablet breakpoint overrides apply.
      */

      function parseVwVh(val, vw, vh) {
        val = val.trim();
        if (val.indexOf('vw') !== -1) return parseFloat(val) / 100 * vw;
        if (val.indexOf('vh') !== -1) return parseFloat(val) / 100 * vh;
        return parseFloat(val) || 0;
      }

      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var figmaStyle = getComputedStyle(figmaEl);
      var cursorStyle = getComputedStyle(cursorEl);

      var figmaOffX = parseVwVh(figmaStyle.getPropertyValue('--ix'), vw, vh);
      var figmaOffY = parseVwVh(figmaStyle.getPropertyValue('--iy'), vw, vh);
      var cursorOffX = parseVwVh(cursorStyle.getPropertyValue('--ix'), vw, vh);
      var cursorOffY = parseVwVh(cursorStyle.getPropertyValue('--iy'), vw, vh);

      // Click position in viewport coordinates (for spark lines + wipe)
      var clickScreenX = window.innerWidth / 2 + figmaOffX;
      var clickScreenY = window.innerHeight / 2 + figmaOffY;

      // T+900ms: burst is done (600ms delay + 250ms burst = 850ms). Start mouse glide.
      setTimeout(function () {
        if (!cursorEl || !figmaEl || !introInner) return;

        // Kill CSS animation on cursor — JS takes direct control
        cursorEl.style.animation = 'none';
        cursorEl.style.opacity = '1';
        cursorEl.style.transform = 'translate(' + cursorOffX + 'px, ' + cursorOffY + 'px)';

        // Glide from cursor position to Figma position over 800ms
        animateMouseToFigma(cursorEl, cursorOffX, cursorOffY, figmaOffX, figmaOffY, 800, function () {
          // T+1700ms: Mouse arrives. Stop Figma float, show hover scale.
          figmaEl.style.animation = 'none';
          figmaEl.style.opacity = '0.55';
          figmaEl.style.transition = 'transform 100ms ease';
          figmaEl.style.transform = 'translate(' + figmaOffX + 'px, ' + figmaOffY + 'px) scale(1.15)';

          // T+1850ms: click (100ms hover beat, then fire)
          setTimeout(function () {
            // Mouse press: scale 1 → 0.75 → 1
            cursorEl.querySelector('svg').style.transition = 'transform 120ms ease';
            cursorEl.querySelector('svg').style.transform = 'scale(0.75)';
            setTimeout(function () {
              cursorEl.querySelector('svg').style.transform = 'scale(1)';
            }, 120);

            // Figma pop: 1.15 → 1.4 → 1.0
            figmaEl.style.transform = 'translate(' + figmaOffX + 'px, ' + figmaOffY + 'px) scale(1.4)';
            setTimeout(function () {
              figmaEl.style.transition = 'transform 150ms ease';
              figmaEl.style.transform = 'translate(' + figmaOffX + 'px, ' + figmaOffY + 'px) scale(1)';
            }, 120);

            // Spark lines + flash at Figma position
            clickBurst.style.position = 'fixed';
            clickBurst.style.left = clickScreenX + 'px';
            clickBurst.style.top = clickScreenY + 'px';
            clickBurst.classList.add('active');

            var flash = document.createElement('div');
            flash.className = 'intro-click-flash';
            flash.style.left = clickScreenX + 'px';
            flash.style.top = clickScreenY + 'px';
            document.body.appendChild(flash);
            requestAnimationFrame(function () { flash.classList.add('active'); });
            setTimeout(function () { flash.remove(); }, 400);

            // T+2050ms → T+2150ms: sparks visible 200ms, then hide all
            setTimeout(function () {
              introInner.style.opacity = '0';

              // T+2200ms: circle wipe from Figma position
              setTimeout(function () {
                introReveal.style.setProperty('--reveal-x', clickScreenX + 'px');
                introReveal.style.setProperty('--reveal-y', clickScreenY + 'px');
                introReveal.classList.add('active');

                // T+2600ms: wipe done, cleanup
                setTimeout(function () {
                  nameIntro.classList.add('hidden');
                  introReveal.classList.add('fade-out');
                  document.body.classList.remove('intro-active');
                  localStorage.setItem('introPlayedAt', Date.now().toString());
                  triggerLoadAnimations();
                }, 400);
              }, 50);
            }, 200);
          }, 100);
        });
      }, 900);
    });
  }

  if (isHomepage) {
    if (prefersReducedMotion) {
      skipIntroAnimation();
    } else if (shouldPlayIntro()) {
      playIntroAnimation();
    } else {
      skipIntroAnimation();
    }
  } else {
    // Non-homepage: skip intro
    if (nameIntro) nameIntro.style.display = 'none';

    onReady(function () {
      if (transitionOverlay) transitionOverlay.classList.remove('active');
      triggerLoadAnimations();
    });
  }


  /* ---- PAGE TRANSITIONS ---- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.hasAttribute('download')) return;
    if (link.target === '_blank') return;

    e.preventDefault();
    if (transitionOverlay) transitionOverlay.classList.add('active');
    setTimeout(function () { window.location.href = href; }, 200);
  });


  /* ---- STAGGERED LOAD ANIMATION ---- */
  function triggerLoadAnimations() {
    var els = document.querySelectorAll('.fade-in');
    var stagger = prefersReducedMotion ? 0 : 150;
    els.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, i * stagger);
    });
  }


  /* ---- iOS AUTOPLAY: parse-time play() pass ----
     Belt-and-suspenders alongside the IO retry below. iOS Safari denies
     autoplay at parse for muted videos that lack a user-activation token.
     Calling .play() at the earliest possible moment (DOMContentLoaded, or
     immediately if the DOM is already parsed) catches above-the-fold videos
     that never trigger the IO callback. SCOPE: viewport-visible videos only.
     Below-the-fold videos rely on the IO retry at the next block — firing
     .play() on all videos here saturates hardware decoders on video-heavy
     pages (Pulse has 4) and starves the custom-cursor RAF loop.
     Layer 6 of the iOS autoplay gate stack (see CLAUDE.md). */
  function attemptVideoAutoplay() {
    var allVideos = document.querySelectorAll('video');
    allVideos.forEach(function (v) {
      var rect = v.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        v.play().catch(function () {});
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptVideoAutoplay);
  } else {
    attemptVideoAutoplay();
  }


  /* ---- SCROLL REVEAL ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          var videos = entry.target.querySelectorAll('video');
          videos.forEach(function (v) { v.play().catch(function () {}); });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) { observer.observe(el); });
  }


  /* ---- SCROLL PROGRESS BAR ---- */
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.addEventListener('resize', function () {
      docHeight = document.documentElement.scrollHeight - window.innerHeight;
    }, { passive: true });
    window.addEventListener('scroll', function () {
      progressBar.style.width = (window.scrollY / docHeight * 100) + '%';
    }, { passive: true });
  }


  /* ---- SIDEBAR SCROLLSPY ---- */
  var sidebarLinks = document.querySelectorAll('.sidebar-link');
  if (sidebarLinks.length > 0) {
    var sections = [];
    sidebarLinks.forEach(function (link) {
      var targetId = link.getAttribute('href').substring(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) sections.push({ el: targetEl, link: link });
    });

    function updateActiveLink() {
      var scrollPos = window.scrollY + 150;
      var current = null;
      sections.forEach(function (s) {
        if (s.el.offsetTop <= scrollPos) current = s;
      });
      sidebarLinks.forEach(function (link) { link.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }


  /* ---- NAV SCROLL EFFECT ---- */
  var navEl = document.querySelector('nav');
  if (navEl) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) navEl.classList.add('scrolled');
      else navEl.classList.remove('scrolled');
    }, { passive: true });
  }


  /* ---- THEME TOGGLE ---- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    if (false) { /* dark mode disabled 2026-05-13: keep theme=light. Restore: change to `localStorage.getItem('theme') === 'dark'` + revert .theme-toggle CSS hide + <head> bootstrap */
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }

      if (!sessionStorage.getItem('tokenTooltipShown')) {
        showTokenTooltip();
        sessionStorage.setItem('tokenTooltipShown', 'true');
      }
    });
  }

  function showTokenTooltip() {
    var tooltip = document.createElement('div');
    tooltip.className = 'token-tooltip';
    tooltip.textContent = 'Powered by the same token system I built at LexisNexis';
    document.body.appendChild(tooltip);

    requestAnimationFrame(function () {
      tooltip.classList.add('visible');
      setTimeout(function () {
        tooltip.classList.remove('visible');
        setTimeout(function () { tooltip.remove(); }, 400);
      }, 3000);
    });
  }


  /* ---- CUSTOM CURSOR (desktop, motion-OK only) ---- */
  if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    var cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    document.body.classList.add('cursor-active');

    var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    var smoothing = 0.15;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    (function animate() {
      cursorX += (mouseX - cursorX) * smoothing;
      cursorY += (mouseY - cursorY) * smoothing;
      cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      requestAnimationFrame(animate);
    })();

    var hoverTargets = 'a, button, .bento-card, .other-work-card, .sidebar-link';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverTargets)) cursor.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverTargets)) cursor.classList.remove('cursor-hover');
    });
  }


  /* ---- BFCACHE RESTORE FIX ----
     Browsers restore back-forward navigations from bfcache verbatim.
     JS does not re-execute, so a page unloading mid-transition leaves
     .page-transition.active opaque on restore — blanks the page. */
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;

    if (transitionOverlay) {
      transitionOverlay.classList.remove('active');
    }

    document.body.classList.remove('intro-active');
    document.body.style.overflow = '';

    if (nameIntro) {
      nameIntro.style.display = 'none';
      nameIntro.classList.add('hidden');
    }

    var introReveal = document.getElementById('introReveal');
    if (introReveal) introReveal.style.display = 'none';
  });


  /* ---- RESUME MODAL (with PDF.js viewer) ----
     Wires up the optional resume preview modal. Only runs on pages
     that include the #resumeModal markup (index, about, process).
     Desktop: lazy-loads PDF.js from cdnjs and renders the resume into
     a canvas with zoom + pagination controls. Mobile (<=767px): skips
     PDF.js entirely; CSS hides the canvas and shows a download/open
     fallback panel. PDF.js failure also falls back to that panel. */
  var resumeModal = document.getElementById('resumeModal');
  if (resumeModal) {
    var pdfContainer = resumeModal.querySelector('.resume-modal-pdfjs-container');
    var pdfCanvas    = resumeModal.querySelector('.resume-modal-pdfjs-canvas');
    var pdfToolbar   = resumeModal.querySelector('.resume-modal-pdfjs-toolbar');
    var pdfPageInfo  = resumeModal.querySelector('.resume-modal-pdfjs-page-info');
    var pdfPrevBtn   = resumeModal.querySelector('[data-pdfjs-prev]');
    var pdfNextBtn   = resumeModal.querySelector('[data-pdfjs-next]');
    var pdfZoomInBtn = resumeModal.querySelector('[data-pdfjs-zoom-in]');
    var pdfZoomOutBtn= resumeModal.querySelector('[data-pdfjs-zoom-out]');
    var pdfFallback  = resumeModal.querySelector('.resume-modal-mobile-fallback');

    var PDFJS_VERSION = '3.11.174';
    var PDFJS_LIB     = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + PDFJS_VERSION + '/pdf.min.js';
    var PDFJS_WORKER  = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/' + PDFJS_VERSION + '/pdf.worker.min.js';
    var PDF_URL       = '/Rotem_Gotlieb_Resume.pdf';
    var ZOOM_STEP     = 0.25;
    var MAX_ZOOM_MULT = 2;

    var pdfDoc = null;
    var pdfCurrentPage = 1;
    var pdfFitToWidthScale = 1;
    var pdfCurrentScale = 1;
    var pdfLibLoaded = false;
    var pdfLibLoadingPromise = null;
    var pdfInitPromise = null;
    var resumeLastFocused = null;

    function loadPdfJs() {
      if (pdfLibLoaded) return Promise.resolve();
      if (pdfLibLoadingPromise) return pdfLibLoadingPromise;
      pdfLibLoadingPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = PDFJS_LIB;
        script.async = true;
        script.onload = function () {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
            pdfLibLoaded = true;
            resolve();
          } else {
            reject(new Error('pdfjsLib unavailable after script load'));
          }
        };
        script.onerror = function () { reject(new Error('Failed to load PDF.js from CDN')); };
        document.head.appendChild(script);
      });
      return pdfLibLoadingPromise;
    }

    function showPdfFallback() {
      if (pdfContainer) pdfContainer.style.display = 'none';
      if (pdfToolbar)   pdfToolbar.style.display   = 'none';
      if (pdfFallback)  pdfFallback.style.display  = 'flex';
      hidePdfLoading();
    }

    var pdfLoadingEl = null;
    function showPdfLoading() {
      if (!pdfContainer) return;
      if (!pdfLoadingEl) {
        pdfLoadingEl = document.createElement('div');
        pdfLoadingEl.className = 'resume-modal-loading';
        pdfLoadingEl.textContent = 'Loading…';
      }
      if (!pdfLoadingEl.parentNode) pdfContainer.appendChild(pdfLoadingEl);
    }
    function hidePdfLoading() {
      if (pdfLoadingEl && pdfLoadingEl.parentNode) {
        pdfLoadingEl.parentNode.removeChild(pdfLoadingEl);
      }
    }

    function calcFitToWidthScale(page) {
      // pdfContainer has 16px padding each side
      var containerWidth = pdfContainer.clientWidth - 32;
      var unscaled = page.getViewport({ scale: 1 });
      return containerWidth / unscaled.width;
    }

    function renderCurrentPage() {
      if (!pdfDoc || !pdfCanvas) return Promise.resolve();
      return pdfDoc.getPage(pdfCurrentPage).then(function (page) {
        var viewport = page.getViewport({ scale: pdfCurrentScale });
        var dpr = window.devicePixelRatio || 1;
        var ctx = pdfCanvas.getContext('2d');
        pdfCanvas.width  = Math.floor(viewport.width  * dpr);
        pdfCanvas.height = Math.floor(viewport.height * dpr);
        pdfCanvas.style.width  = viewport.width  + 'px';
        pdfCanvas.style.height = viewport.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return page.render({ canvasContext: ctx, viewport: viewport }).promise;
      }).then(updatePdfControls);
    }

    function updatePdfControls() {
      if (!pdfDoc) return;
      var multiPage = pdfDoc.numPages > 1;
      if (pdfPageInfo) {
        pdfPageInfo.textContent = multiPage ? ('Page ' + pdfCurrentPage + ' of ' + pdfDoc.numPages) : '';
      }
      if (pdfPrevBtn) {
        pdfPrevBtn.style.display = multiPage ? '' : 'none';
        pdfPrevBtn.disabled = pdfCurrentPage <= 1;
      }
      if (pdfNextBtn) {
        pdfNextBtn.style.display = multiPage ? '' : 'none';
        pdfNextBtn.disabled = pdfCurrentPage >= pdfDoc.numPages;
      }
      var minScale = pdfFitToWidthScale;
      var maxScale = pdfFitToWidthScale * MAX_ZOOM_MULT;
      if (pdfZoomOutBtn) pdfZoomOutBtn.disabled = pdfCurrentScale <= minScale + 0.001;
      if (pdfZoomInBtn)  pdfZoomInBtn.disabled  = pdfCurrentScale >= maxScale - 0.001;
    }

    function initPdfViewer() {
      if (pdfInitPromise) return pdfInitPromise;
      showPdfLoading();
      pdfInitPromise = loadPdfJs().then(function () {
        return window.pdfjsLib.getDocument(PDF_URL).promise;
      }).then(function (doc) {
        pdfDoc = doc;
        pdfCurrentPage = 1;
        return pdfDoc.getPage(1);
      }).then(function (page) {
        pdfFitToWidthScale = calcFitToWidthScale(page);
        pdfCurrentScale = pdfFitToWidthScale;
        return renderCurrentPage();
      }).then(function () {
        hidePdfLoading();
      }).catch(function (err) {
        console.error('PDF.js viewer init failed:', err);
        showPdfFallback();
        pdfInitPromise = null; // allow retry next open if user closes/reopens
      });
      return pdfInitPromise;
    }

    function gotoPage(delta) {
      if (!pdfDoc) return;
      var next = pdfCurrentPage + delta;
      if (next < 1 || next > pdfDoc.numPages) return;
      pdfCurrentPage = next;
      renderCurrentPage();
    }

    function adjustZoom(direction) {
      if (!pdfDoc) return;
      var minScale = pdfFitToWidthScale;
      var maxScale = pdfFitToWidthScale * MAX_ZOOM_MULT;
      var step = ZOOM_STEP * pdfFitToWidthScale;
      var next = pdfCurrentScale + direction * step;
      if (next < minScale) next = minScale;
      if (next > maxScale) next = maxScale;
      if (Math.abs(next - pdfCurrentScale) < 0.001) return;
      pdfCurrentScale = next;
      renderCurrentPage();
    }

    function openResumeModal(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      resumeLastFocused = document.activeElement;
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      var closeBtn = resumeModal.querySelector('.resume-modal-close');
      if (closeBtn) closeBtn.focus();
      // Defer PDF.js init by one frame so the container has its final
      // layout width before we calculate fit-to-width.
      if (pdfContainer) {
        requestAnimationFrame(function () { initPdfViewer(); });
      }
    }

    function closeResumeModal() {
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (resumeLastFocused && resumeLastFocused.focus) {
        resumeLastFocused.focus();
      }
    }

    // Triggers: any external <a href="/Rotem_Gotlieb_Resume.pdf">.
    // The modal's own download / open-in-new-tab links are excluded
    // via .contains() so they keep their default browser behavior.
    var resumeTriggers = document.querySelectorAll('a[href="/Rotem_Gotlieb_Resume.pdf"]');
    resumeTriggers.forEach(function (trigger) {
      if (resumeModal.contains(trigger)) return;
      trigger.addEventListener('click', openResumeModal);
    });

    // Close affordances: backdrop, X button — anything with [data-resume-close].
    resumeModal.querySelectorAll('[data-resume-close]').forEach(function (el) {
      el.addEventListener('click', closeResumeModal);
    });

    // ESC to close.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && resumeModal.getAttribute('aria-hidden') === 'false') {
        closeResumeModal();
      }
    });

    // Toolbar wiring.
    if (pdfPrevBtn)    pdfPrevBtn.addEventListener('click',    function () { gotoPage(-1); });
    if (pdfNextBtn)    pdfNextBtn.addEventListener('click',    function () { gotoPage(1); });
    if (pdfZoomOutBtn) pdfZoomOutBtn.addEventListener('click', function () { adjustZoom(-1); });
    if (pdfZoomInBtn)  pdfZoomInBtn.addEventListener('click',  function () { adjustZoom(1); });

    // Window resize: if PDF inited and modal is open, recalc fit-to-width
    // and re-render at the new minimum scale.
    var resizeRaf = null;
    window.addEventListener('resize', function () {
      if (!pdfDoc) return;
      if (resumeModal.getAttribute('aria-hidden') !== 'false') return;
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () {
        pdfDoc.getPage(pdfCurrentPage).then(function (page) {
          pdfFitToWidthScale = calcFitToWidthScale(page);
          pdfCurrentScale = pdfFitToWidthScale;
          renderCurrentPage();
        });
      });
    });
  }

  /* ---- IMAGE MODAL (mobile-only image expansion) ----
     Reusable component. Any <img class="expandable"> on a page that
     also includes the #imageModal markup will open in the modal on
     click. Mobile-only — gated by matchMedia at handler-bind time so
     desktop hero images stay non-interactive. Native pinch-zoom on
     the modal image is honored via touch-action: pinch-zoom in CSS. */
  var imageModal = document.getElementById('imageModal');
  if (imageModal && window.matchMedia('(max-width: 767px)').matches) {
    var imageModalImg = imageModal.querySelector('.image-modal-img');
    var imageLastFocused = null;

    function openImageModal(e) {
      var img = e.currentTarget;
      if (!img || !imageModalImg) return;
      e.preventDefault();
      e.stopPropagation();
      imageLastFocused = document.activeElement;
      imageModalImg.setAttribute('src', img.getAttribute('src'));
      imageModalImg.setAttribute('alt', img.getAttribute('alt') || '');
      imageModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      var closeBtn = imageModal.querySelector('.image-modal-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeImageModal() {
      imageModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (imageLastFocused && imageLastFocused.focus) imageLastFocused.focus();
    }

    document.querySelectorAll('img.expandable').forEach(function (img) {
      img.addEventListener('click', openImageModal);
    });

    imageModal.querySelectorAll('[data-image-close]').forEach(function (el) {
      el.addEventListener('click', closeImageModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && imageModal.getAttribute('aria-hidden') === 'false') {
        closeImageModal();
      }
    });
  }


  /* ---- FOOTER STATUS LINE: live San Jose time ---- */
  var footerStatusTime = document.getElementById('footerStatusTime');
  if (footerStatusTime) {
    var sjFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    });
    function updateFooterStatusTime() {
      footerStatusTime.textContent = sjFormatter.format(new Date()).replace(/\s/g, '').toLowerCase();
    }
    updateFooterStatusTime();
    setInterval(updateFooterStatusTime, 1000);
  }

})();
