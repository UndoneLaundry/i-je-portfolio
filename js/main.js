// main.js – mobile nav toggle, scroll animations, header scroll effect

document.addEventListener('DOMContentLoaded', function() {
  // ---------- MOBILE NAVIGATION ----------
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const navLinks = document.querySelectorAll('.primary-nav a');
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');

  function setBodyScrollLock(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.setAttribute('data-visible', !isExpanded);
      setBodyScrollLock(!isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('data-visible', 'false');
        setBodyScrollLock(false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.getAttribute('data-visible') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('data-visible', 'false');
        setBodyScrollLock(false);
      }
    });
  }

  // ---------- DYNAMIC HEADER PADDING ----------
  function adjustMainPadding() {
    if (header && main) {
      main.style.paddingTop = header.offsetHeight + 'px';
    }
  }

  // Initial call (header already exists) + resize only (no need for load)
  adjustMainPadding();
  window.addEventListener('resize', adjustMainPadding);

  // ---------- CLOSE MOBILE NAV ON RESIZE ABOVE BREAKPOINT ----------
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && primaryNav?.getAttribute('data-visible') === 'true') {
      navToggle?.setAttribute('aria-expanded', 'false');
      primaryNav?.setAttribute('data-visible', 'false');
      setBodyScrollLock(false);
    }
  });

  // ---------- HEADER SCROLL EFFECT (debounced with rAF) ----------
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---------- SCROLL FADE-IN ANIMATION (Intersection Observer) ----------
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px'
      });

      fadeElements.forEach(el => observer.observe(el));
    } else {
      // Fallback for very old browsers: make all elements visible immediately
      fadeElements.forEach(el => el.classList.add('visible'));
    }
  }
});