document.addEventListener('DOMContentLoaded', function () {

    /* Respect prefers-reduced-motion — skip all animations */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-heading, .reveal-child')
        .forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
  
    /* Card observer */
    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        cardObserver.unobserve(el);
        const children = el.querySelectorAll('.reveal-child');
        children.forEach(function (child, i) {
          setTimeout(function () {
            child.classList.add('is-visible');
          }, 180 + i * 120);
        });
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
  
    document.querySelectorAll('.reveal').forEach(function (el) {
      cardObserver.observe(el);
    });
  
    /* Heading observer */
    const headingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        headingObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
  
    document.querySelectorAll('.reveal-heading').forEach(function (el) {
      headingObserver.observe(el);
    });
  
  });