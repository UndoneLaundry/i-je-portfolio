// main.js – mobile nav, scroll animations, header scroll effect

document.addEventListener('DOMContentLoaded', function () {

  // ---------- BUILD MOBILE OVERLAY AT RUNTIME ----------
  // Injecting via JS means the overlay is always the last child of <body>,
  // guaranteed to paint on top of everything regardless of z-index stacking contexts.

  const navToggle = document.querySelector('.mobile-nav-toggle');
  const header    = document.querySelector('.site-header');
  const mainEl    = document.querySelector('main');

  // Collect links from the desktop nav
  const desktopLinks = Array.from(document.querySelectorAll('.primary-nav a'));

  // Inject overlay styles into <head>
  const overlayStyle = document.createElement('style');
  overlayStyle.textContent = `
    #mobileNavOverlay {
      display: none;
      position: fixed;
      inset: 0;
      background: #F8FAFC;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 2.5rem;
    }
    #mobileNavOverlay ul {
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
    }
    #mobileNavOverlay li {
      border-top: 1px solid #BCCCDC;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    #mobileNavOverlay li:last-child {
      border-bottom: 1px solid #BCCCDC;
    }
    #mobileNavOverlay.is-open li {
      opacity: 1;
      transform: translateY(0);
    }
    #mobileNavOverlay.is-open li:nth-child(1) { transition-delay: 0.05s; }
    #mobileNavOverlay.is-open li:nth-child(2) { transition-delay: 0.12s; }
    #mobileNavOverlay.is-open li:nth-child(3) { transition-delay: 0.19s; }
    #mobileNavOverlay .nav-link-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.4rem 0;
      text-decoration: none;
      color: #1d1c1e;
      gap: 1rem;
    }
    #mobileNavOverlay .nav-link-row:active { opacity: 0.5; }
    #mobileNavOverlay .nav-num {
      font-size: 0.75rem;
      font-family: var(--font-sans);
      font-weight: 400;
      color: #9AA6B2;
      letter-spacing: 0.08em;
      min-width: 1.5rem;
    }
    #mobileNavOverlay .nav-label {
      font-size: 2rem;
      font-family: var(--font-heading);
      font-weight: 600;
      letter-spacing: -0.02em;
      flex: 1;
    }
    #mobileNavOverlay .nav-arrow {
      font-size: 1.1rem;
      color: #9AA6B2;
      transition: transform 0.2s ease;
    }
    #mobileNavOverlay .nav-link-row:hover .nav-arrow {
      transform: translateX(4px);
    }
    #mobileNavOverlay .nav-link-row.active .nav-label {
      color: #4A5B6A;
    }
  `;
  document.head.appendChild(overlayStyle);

  // Build overlay element
  const overlay = document.createElement('nav');
  overlay.id = 'mobileNavOverlay';
  overlay.setAttribute('aria-hidden', 'true');

  const ul = document.createElement('ul');

  desktopLinks.forEach((link, i) => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href   = link.href;
    a.className = 'nav-link-row' + (link.classList.contains('active') ? ' active' : '');

    const num = document.createElement('span');
    num.className = 'nav-num';
    num.textContent = `0${i + 1}`;

    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = link.textContent.trim();

    const arrow = document.createElement('span');
    arrow.className = 'nav-arrow';
    arrow.textContent = '→';

    a.appendChild(num);
    a.appendChild(label);
    a.appendChild(arrow);
    a.addEventListener('click', closeNav);
    li.appendChild(a);
    ul.appendChild(li);
  });

  overlay.appendChild(ul);
  document.body.appendChild(overlay); // Last child of body — always on top

  // ---------- OPEN / CLOSE ----------
  function openNav() {
    overlay.style.display = 'flex';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    overlay.style.display = 'none';
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
    });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 640) closeNav(); });

  // ---------- DYNAMIC HEADER PADDING ----------
  function adjustMainPadding() {
    if (header && mainEl) mainEl.style.paddingTop = header.offsetHeight + 'px';
  }
  adjustMainPadding();
  window.addEventListener('resize', adjustMainPadding);

  // ---------- HEADER SCROLL EFFECT ----------
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---------- SCROLL FADE-IN ----------
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

});