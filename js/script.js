'use strict';

/* ==========================================================================
   NAVIGATION: mobile drawer + sticky navbar blur
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navbar = document.getElementById('navbar');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('menu-open', isOpen);

      const bars = menuToggle.querySelectorAll('.bar');
      if (isOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(3px, 3px)';
        bars[1].style.transform = 'rotate(-45deg) translate(3px, -3px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.transform = 'none';
      }
    });

    // Close drawer when a link is tapped
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  if (navbar) {
    function updateNavbarState() {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    updateNavbarState();

    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          updateNavbarState();
          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });
  }
});

/* ==========================================================================
   HERO ENTRANCE ANIMATION (GSAP) + PARALLAX + MAGNETIC BUTTONS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof gsap === 'undefined') return;

  const masterTimeline = gsap.timeline({ defaults: { ease: 'expo.out' } });

  masterTimeline
    .fromTo('#heroImage',
      { scale: 1.15, filter: 'blur(8px)' },
      { scale: 1.0, filter: 'blur(0px)', duration: 2.0, ease: 'power2.out' }, 0)
    .fromTo('#navbar', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.15)
    .to('.reveal-line', { y: '0%', duration: 1.1, stagger: 0.16, ease: 'power4.out' }, 0.35)
    .fromTo('#heroRule',
      { opacity: 0, scaleX: 0.7, transformOrigin: 'center' },
      { opacity: 1, scaleX: 1, duration: 0.8 }, 0.9)
    .fromTo('#heroSubtext', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 1.1)
    .fromTo('#heroButtons', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 1.25);

  if (window.innerWidth > 1024) {
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.getElementById('heroImage');

    if (heroSection && heroImage) {
      heroSection.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(heroImage, { x: xPercent * 20, y: yPercent * 20, duration: 1.6, ease: 'power1.out' });
      });
    }

    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }
});

/* ==========================================================================
   HERO RULE EMBLEM — LEFT → RIGHT → CENTER TRAVEL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const heroRules = document.querySelectorAll('.hero-rule-box');
  if (!heroRules.length) return;

  heroRules.forEach((heroRule) => {
    const emblem = heroRule.querySelector('.rule-emblem');
    if (!emblem) return;

    setTimeout(() => heroRule.classList.add('show'), 200);
    setTimeout(() => emblem.classList.add('run-animation'), 500);
  });
});

/* ==========================================================================
   SCROLL-REVEAL: .reveal-node (divisions grid, heritage image/text)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-node');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => revealObserver.observe(el));

  // 3D tilt on division cards (desktop only)
  if (window.matchMedia('(min-width: 992px)').matches) {
    document.querySelectorAll('.division-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
});

/* ==========================================================================
   SCROLL-REVEAL: .reveal-item (locations, feature-split, contact, footer)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (!revealItems.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('active'), idx * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));

  // Interactive tilt on wood panel griffin carving (desktop)
  const woodPanel = document.querySelector('.center-wood');
  const woodCrest = document.querySelector('.carved-crest-wrap');

  if (window.matchMedia('(min-width: 1024px)').matches && woodPanel && woodCrest) {
    woodPanel.addEventListener('mousemove', (e) => {
      const rect = woodPanel.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      woodCrest.style.transform = `perspective(800px) rotateY(${x * 0.08}deg) rotateX(${-y * 0.08}deg) scale(1.05)`;
    });
    woodPanel.addEventListener('mouseleave', () => {
      woodCrest.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }
});

/* ==========================================================================
   HERITAGE SECTION SCROLL ANIMATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const heritageSection = document.querySelector('.heritage-section');
  if (!heritageSection) return;

  const visual = heritageSection.querySelector('.story-visual');
  const content = heritageSection.querySelector('.story-content');
  if (!visual || !content) return;

  const heritageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      visual.classList.add('is-visible');
      setTimeout(() => content.classList.add('is-visible'), 180);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.22, rootMargin: '0px 0px -80px 0px' });

  heritageObserver.observe(heritageSection);
});

/* ==========================================================================
   OUR DIVISIONS DIVIDER — SCROLL ANIMATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const divisionsDivider = document.querySelector('.divisions-divider');
  if (!divisionsDivider) return;

  const divisionsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      divisionsDivider.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -60px 0px' });

  divisionsObserver.observe(divisionsDivider);
});

/* ==========================================================================
   GALLERY — FILTERING
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmpty = document.getElementById('galleryEmpty');
  if (!filterBtns.length || !galleryGrid) return;

  const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

  // Reveal items in on load with a gentle stagger.
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('gallery-visible'), 60 * i);
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      let visibleCount = 0;
      items.forEach((item) => {
        const categories = (item.getAttribute('data-category') || '').split(' ');
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          item.style.display = '';
          requestAnimationFrame(() => item.classList.add('gallery-visible'));
          visibleCount++;
        } else {
          item.classList.remove('gallery-visible');
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });

      if (galleryEmpty) galleryEmpty.classList.toggle('show', visibleCount === 0);
    });
  });
});

/* ==========================================================================
   GALLERY — LIGHTBOX (with keyboard + arrow navigation)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay) return;

  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(document.querySelectorAll('.gallery-item')).filter(
      (item) => item.style.display !== 'none'
    );
  }

  function renderSlide() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lightboxImage.src = img.getAttribute('src');
    lightboxImage.alt = img.getAttribute('alt') || '';
    lightboxCaption.innerHTML = item.getAttribute('data-caption') || '';
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
  }

  function openLightbox(item) {
    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    if (currentIndex < 0) currentIndex = 0;
    renderSlide();
    overlay.classList.add('open');
    document.body.classList.add('menu-open');
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  function showPrev() {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    renderSlide();
  }

  function showNext() {
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    renderSlide();
  }

  function bindGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      if (item.dataset.lightboxBound) return;
      item.dataset.lightboxBound = 'true';
      item.addEventListener('click', () => openLightbox(item));
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });
  }
  bindGalleryItems();

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});

/* ==========================================================================
   CONTACT FORM — LIVE VALIDATION + CLIENT-SIDE HANDLING
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  const validatedFields = form.querySelectorAll('.form-group.has-icon input[required], .form-group.has-icon textarea[required]');

  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;
    const isValid = field.checkValidity();

    if (field.value.trim() === '') {
      group.classList.remove('is-valid', 'is-invalid');
    } else if (isValid) {
      group.classList.add('is-valid');
      group.classList.remove('is-invalid');
    } else {
      group.classList.add('is-invalid');
      group.classList.remove('is-valid');
    }
    return isValid;
  }

  validatedFields.forEach((field) => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => {
      if (field.value.trim() !== '') validateField(field);
    });
  });

  // Live character counter for the message field
  const messageField = document.getElementById('cf-message');
  const charCounter = document.getElementById('charCounter');
  if (messageField && charCounter) {
    const max = messageField.getAttribute('maxlength') || 600;
    const updateCounter = () => {
      charCounter.textContent = `${messageField.value.length} / ${max}`;
    };
    messageField.addEventListener('input', updateCounter);
    updateCounter();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formIsValid = true;
    validatedFields.forEach((field) => {
      if (!validateField(field) || field.value.trim() === '') {
        if (field.value.trim() === '') {
          field.closest('.form-group').classList.add('is-invalid');
        }
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      const firstInvalid = form.querySelector('.form-group.is-invalid');
      if (firstInvalid) firstInvalid.querySelector('input, textarea').focus();
      return;
    }

    const submitBtn = form.querySelector('.contact-submit');
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // TODO: wire this up to a real endpoint (Formspree, serverless function, or CRM)
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      successMsg.classList.add('show');
      form.reset();
      validatedFields.forEach((field) => field.closest('.form-group').classList.remove('is-valid', 'is-invalid'));
      if (charCounter) charCounter.textContent = `0 / ${messageField.getAttribute('maxlength') || 600}`;
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    }, 1100);
  });
});

/* ==========================================================================
   CONTACT — LIVE OFFICE HOURS STATUS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('officeStatus');
  if (!statusEl) return;
  const statusText = statusEl.querySelector('.status-text');

  function updateOfficeStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 Sun ... 6 Sat
    const hour = now.getHours();
    const isWeekday = day >= 1 && day <= 5;
    const isOpenHours = hour >= 8 && hour < 17;
    const isOpen = isWeekday && isOpenHours;

    statusEl.classList.toggle('is-open', isOpen);
    statusEl.classList.toggle('is-closed', !isOpen);
    if (statusText) statusText.textContent = isOpen ? 'Open Now' : 'Currently Closed';
  }

  updateOfficeStatus();
  setInterval(updateOfficeStatus, 60000);
});

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  updateProgressBar();

  let progressTicking = false;
  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      requestAnimationFrame(() => {
        updateProgressBar();
        progressTicking = false;
      });
      progressTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateProgressBar);
});

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  function toggleBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 400);
  }
  toggleBackToTop();

  let backTopTicking = false;
  window.addEventListener('scroll', () => {
    if (!backTopTicking) {
      requestAnimationFrame(() => {
        toggleBackToTop();
        backTopTicking = false;
      });
      backTopTicking = true;
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ==========================================================================
   WORKING CHAT WIDGET
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const fabChat = document.getElementById('fabChat');
  const chatWidget = document.getElementById('chatWidget');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatMessageForm');
  const chatInput = document.getElementById('chatMessageInput');
  const chatGoContact = document.getElementById('chatGoContact');

  if (!fabChat || !chatWidget) return;

  function openChat() { chatWidget.classList.add('open'); }
  function closeChat() { chatWidget.classList.remove('open'); }

  fabChat.addEventListener('click', (e) => {
    e.preventDefault();
    chatWidget.classList.contains('open') ? closeChat() : openChat();
  });

  if (chatClose) chatClose.addEventListener('click', closeChat);
  if (chatGoContact) chatGoContact.addEventListener('click', closeChat);

  // Send message via mailto (works without any backend).
  // Swap this out for a real chat/API/service (Tawk.to, Crisp, Formspree, etc.) when ready.
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      const subject = encodeURIComponent('New message from website chat');
      const body = encodeURIComponent(message);
      window.location.href = `mailto:info@griffinbros.com?subject=${subject}&body=${body}`;

      chatInput.value = '';
    });
  }

  document.addEventListener('click', (e) => {
    if (
      chatWidget.classList.contains('open') &&
      !chatWidget.contains(e.target) &&
      !fabChat.contains(e.target)
    ) {
      closeChat();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget.classList.contains('open')) closeChat();
  });
});