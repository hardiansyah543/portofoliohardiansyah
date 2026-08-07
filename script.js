/* ==========================================================================
   HARDIANSYAH — PREMIUM PORTFOLIO
   Vanilla JavaScript — no dependencies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. LOADING SCREEN
     ------------------------------------------------------------------ */
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const loadingPercent = document.getElementById('loadingPercent');

  (function runLoader() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          document.body.classList.add('loaded');
          initRevealObserver(); // (re)check reveal states after layout settles
        }, 350);
      }
      loadingBarFill.style.width = progress + '%';
      loadingPercent.textContent = Math.floor(progress) + '%';
    }, 140);
  })();

  /* ------------------------------------------------------------------
     2. CUSTOM CURSOR
     ------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isTouch) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .magnetic, .skill-card, .project-card, .cert-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }

  /* ------------------------------------------------------------------
     3. MAGNETIC BUTTONS
     ------------------------------------------------------------------ */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ------------------------------------------------------------------
     4. RIPPLE EFFECT ON BUTTONS
     ------------------------------------------------------------------ */
  document.querySelectorAll('.btn, .social-icon, .nav-link').forEach((el) => {
    el.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ------------------------------------------------------------------
     5. NAVBAR SCROLL STATE + SCROLL PROGRESS BAR
     ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  // Declared here (before first use) so onScroll() can safely call
  // updateActiveNav() on its very first run without a TDZ error.
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('show', scrollY > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     6. MOBILE MENU TOGGLE
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ------------------------------------------------------------------
     7. (scrollspy logic now lives in section 5, defined before first
        onScroll() call — see updateActiveNav() above)
     ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
     8. TYPING ANIMATION (HERO ROLE)
     ------------------------------------------------------------------ */
  const typedTextEl = document.getElementById('typedText');
  const roles = ['Laravel Developer', 'Full Stack Enthusiast', 'Backend Engineer', 'Web Application Developer'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 45 : 85);
  }
  typeLoop();

  /* ------------------------------------------------------------------
     9. SCROLL REVEAL (Intersection Observer)
     ------------------------------------------------------------------ */
  let revealObserver;
  function initRevealObserver() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      revealObserver.observe(el);
    });
  }
  initRevealObserver();

  /* ------------------------------------------------------------------
     10. SKILL BAR ANIMATION (on view)
     ------------------------------------------------------------------ */
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        const level = entry.target.dataset.level;
        fill.style.width = level + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillCards.forEach((card) => skillObserver.observe(card));

  /* ------------------------------------------------------------------
     11. ANIMATED NUMBER COUNTERS (stats + about exp)
     ------------------------------------------------------------------ */
  function animateCounter(el, target, duration = 1800) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-number .counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.parentElement.dataset.target, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach((el) => counterObserver.observe(el));

  const expNumberEl = document.querySelector('.exp-number');
  if (expNumberEl) {
    const expObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.count, 10), 1200);
          expObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    expObserver.observe(expNumberEl);
  }

  /* ------------------------------------------------------------------
     12. 3D TILT EFFECT ON CARDS
     ------------------------------------------------------------------ */
  if (!isTouch) {
    document.querySelectorAll('.skill-card, .project-card, .cert-card, .timeline-card, .contact-item').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     13. PARTICLE CANVAS (mouse-follow particles)
     ------------------------------------------------------------------ */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (Math.random() > 0.6) {
      particles.push(createParticle(mouse.x, mouse.y));
    }
  });

  function createParticle(x, y) {
    return {
      x, y,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      life: 1,
      color: Math.random() > 0.5 ? '24,242,163' : '0,255,200'
    };
  }

  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= 0.02;
      if (p.life <= 0) {
        particles.splice(i, 1);
        return;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.color}, 0.8)`;
      ctx.fill();
    });
    if (particles.length > 120) particles.splice(0, particles.length - 120);
    requestAnimationFrame(updateParticles);
  }
  if (!isTouch) updateParticles();

  /* ------------------------------------------------------------------
     14. CONTACT FORM VALIDATION (client-side demo)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(input, errorId, validatorFn) {
    const group = input.closest('.form-group');
    const isValid = validatorFn(input.value.trim());
    group.classList.toggle('error', !isValid);
    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const messageInput = document.getElementById('formMessage');

      const nameValid = validateField(nameInput, 'errorName', (v) => v.length > 1);
      const emailValid = validateField(emailInput, 'errorEmail', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      const messageValid = validateField(messageInput, 'errorMessage', (v) => v.length > 4);

      if (nameValid && emailValid && messageValid) {
        formSuccess.classList.add('show');
        contactForm.reset();
        // Reset floating labels after programmatic reset
        contactForm.querySelectorAll('.form-group').forEach((g) => g.classList.remove('error'));
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }
    });
  }

  /* ------------------------------------------------------------------
     15. FOOTER YEAR
     ------------------------------------------------------------------ */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     16. SMOOTH ANCHOR SCROLL (extra safety for older browsers)
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});