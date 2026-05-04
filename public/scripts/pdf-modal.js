document.addEventListener('DOMContentLoaded', function () {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  
    const modal        = document.getElementById('pdf-modal');
    const canvasWrap   = document.querySelector('.pdf-canvas-wrap');
    const pageNum      = document.getElementById('pdf-page-num');
    const pageCount    = document.getElementById('pdf-page-count');
    const btnClose     = document.getElementById('pdf-close');
    const openTriggers = document.querySelectorAll('.open-agreement');
  
    let pdfDoc       = null;
    let loaded       = false;
    let lastFocused  = null; /* for restoring focus on close */
  
    /* ── Focus trap helpers ─────────────────────────────────────────── */
    function getFocusable() {
      return Array.from(modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.disabled);
    }
  
    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
  
    /* ── Render all pages ───────────────────────────────────────────── */
    function renderAllPages() {
      canvasWrap.innerHTML = '';
      const totalPages = pdfDoc.numPages;
      pageCount.textContent = totalPages;
  
      function renderPage(num) {
        pdfDoc.getPage(num).then(function (page) {
          const wrapWidth = canvasWrap.clientWidth - 32;
          const baseVP    = page.getViewport({ scale: 1 });
          const scale     = wrapWidth / baseVP.width;
          const viewport  = page.getViewport({ scale });
  
          const canvas  = document.createElement('canvas');
          const ctx     = canvas.getContext('2d');
          canvas.width  = viewport.width;
          canvas.height = viewport.height;
          canvas.setAttribute('aria-label', 'Agreement page ' + num);
          canvas.setAttribute('role', 'img');
          canvas.addEventListener('contextmenu', e => e.preventDefault());
  
          canvasWrap.appendChild(canvas);
          page.render({ canvasContext: ctx, viewport }).promise.then(function () {
            if (num < totalPages) renderPage(num + 1);
          });
        });
      }
  
      renderPage(1);
  
      canvasWrap.addEventListener('scroll', function () {
        const canvases = canvasWrap.querySelectorAll('canvas');
        let current = 1;
        const wrapTop = canvasWrap.getBoundingClientRect().top;
        canvases.forEach(function (c, i) {
          if (c.getBoundingClientRect().top <= wrapTop + c.height / 2) {
            current = i + 1;
          }
        });
        pageNum.textContent = current;
      });
    }
  
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (pdfDoc && modal.classList.contains('is-open')) renderAllPages();
      }, 250);
    });
  
    /* ── Open / close ───────────────────────────────────────────────── */
    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', trapFocus);
  
      /* Move focus into modal */
      setTimeout(function () { btnClose.focus(); }, 50);
  
      if (!loaded) {
        canvasWrap.innerHTML = '<p style="color:var(--indigo);padding:2rem;text-align:center;">Loading agreement…</p>';
        pdfjsLib.getDocument('/documents/BlankAgreement.pdf').promise.then(function (doc) {
          pdfDoc  = doc;
          loaded  = true;
          renderAllPages();
        }).catch(function (err) {
          console.error('PDF load error:', err);
          canvasWrap.innerHTML =
            '<p style="color:#a32d2d;padding:2rem;text-align:center;">Unable to load the agreement. Please contact <a href="mailto:nikifosterlaw@gmail.com">nikifosterlaw@gmail.com</a>.</p>';
        });
      } else {
        canvasWrap.scrollTop = 0;
        pageNum.textContent  = 1;
      }
    }
  
    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);
      /* Restore focus to the element that opened the modal */
      if (lastFocused) lastFocused.focus();
    }
  
    openTriggers.forEach(el => el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    }));
  
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  });