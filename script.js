/* ============================================================
   ROTARACT CLUB OF HIGHGROUNDS — Interactive Scripts
   Clean Video Intro | Indian Theme | Floating Diyas & Particles
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── DOM References ──
  const mainContent = document.getElementById('main-content');
  const mainNav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const particlesContainer = document.getElementById('particles-container');

  let introComplete = false;

  // ══════════════════════════════════════
  // CLEAN CLICK-TO-PLAY VIDEO INTRO
  // ══════════════════════════════════════

  function initVideoIntro() {
    const intro = document.getElementById('video-intro');
    const video = document.getElementById('intro-video');
    const progressBar = document.getElementById('vi-progress-bar');
    const SESSION_KEY = 'rcbhg_intro_seen';

    if (!intro) {
      showMainContent();
      return;
    }

    // Skip intro if already seen this session
    if (sessionStorage.getItem(SESSION_KEY)) {
      if (video) video.pause();
      intro.classList.add('vi-hidden');
      showMainContent();
      return;
    }

    // Lock scrolling on page load
    document.body.classList.add('vi-active');

    let hasStarted = false;

    // Video begins ONLY on user click
    intro.addEventListener('click', () => {
      if (!hasStarted && video) {
        hasStarted = true;
        intro.classList.add('vi-playing');
        video.play().catch(() => {
          dismissIntro();
        });
      } else if (hasStarted) {
        // Second click skips the video
        dismissIntro();
      }
    });

    // Update progress bar as video plays
    if (video) {
      video.addEventListener('timeupdate', () => {
        if (video.duration && progressBar) {
          const pct = Math.min((video.currentTime / video.duration) * 100, 100);
          progressBar.style.width = pct + '%';
        }
      });

      // Automatically dismiss when video finishes
      video.addEventListener('ended', () => {
        dismissIntro();
      });
    }

    function dismissIntro() {
      if (introComplete) return;
      introComplete = true;

      if (video) {
        try { video.pause(); } catch (e) {}
      }

      intro.classList.add('vi-fade-out');
      sessionStorage.setItem(SESSION_KEY, 'true');

      setTimeout(() => {
        intro.classList.add('vi-hidden');
        document.body.classList.remove('vi-active');
        showMainContent();
      }, 800);
    }
  }

  function showMainContent() {
    introComplete = true;

    if (mainContent) mainContent.classList.add('visible');
    if (mainNav) mainNav.classList.add('visible');

    document.body.style.overflow = '';

    // Initialize page features
    initScrollAnimations();
    initParticles();
    initCounters();
  }

  // Start Intro Logic
  initVideoIntro();

  // ══════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════

  window.addEventListener('scroll', () => {
    if (!introComplete) return;

    const scrollY = window.scrollY;

    if (scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll
  document.querySelectorAll('.nav-link[data-section], .quick-link-card[data-section], .btn[data-section]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = el.getAttribute('data-section');
      const targetSection = document.getElementById(sectionId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      closeMobileMenu();
    });
  });

  // ══════════════════════════════════════
  // HAMBURGER & MOBILE MENU
  // ══════════════════════════════════════

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    if (mobileMenu) mobileMenu.classList.toggle('open');
    if (mobileBackdrop) mobileBackdrop.classList.toggle('active');
    document.body.style.overflow = mobileMenu && mobileMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    if (introComplete) {
      document.body.style.overflow = '';
    }
  }

  // ══════════════════════════════════════
  // SCROLL REVEAL ANIMATIONS
  // ══════════════════════════════════════

  function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-parent, .reveal-divider, .reveal-mandala');

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('revealed');

          // If it is a reveal parent, stagger the display of its children
          if (el.classList.contains('reveal-parent')) {
            const children = el.querySelectorAll('.reveal-child, .reveal-divider, .reveal-mandala');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('revealed');
              }, index * 120);
            });
          }

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ══════════════════════════════════════
  // ANIMATED COUNTERS
  // ══════════════════════════════════════

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ══════════════════════════════════════
  // FLOATING PARTICLES (Diyas & Sparkles & Falling Marigold Petals)
  // ══════════════════════════════════════

  function initParticles() {
    if (!particlesContainer) return;

    // Initial batch
    for (let i = 0; i < 20; i++) {
      createParticle(true);
    }

    // Keep spawning new particles
    setInterval(() => {
      if (document.querySelectorAll('.particle').length < 35) {
        createParticle(false);
      }
    }, 800);
  }

  function createParticle(randomizeY = false) {
    const particle = document.createElement('div');
    const rand = Math.random();
    
    // 3 Types of particles: 35% diya, 35% petal, 30% sparkle
    let type = 'sparkle';
    if (rand < 0.35) {
      type = 'diya';
    } else if (rand < 0.70) {
      type = 'petal';
    }

    particle.className = `particle ${type}`;
    particle.style.left = Math.random() * 100 + '%';

    const isFalling = (type === 'petal');

    // Vertical starting position
    if (randomizeY) {
      particle.style.top = Math.random() * 100 + 'vh';
    } else {
      if (isFalling) {
        particle.style.top = '-20px';
      } else {
        particle.style.bottom = '-10px';
      }
    }

    // Size configuration
    let size = 3;
    if (type === 'diya') {
      size = 5 + Math.random() * 4;
    } else if (type === 'petal') {
      size = 10 + Math.random() * 12;
    } else {
      size = 2 + Math.random() * 3;
    }
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Set custom HSL colors for petals (marigold shades of gold, orange, saffron)
    if (type === 'petal') {
      const hue = 25 + Math.floor(Math.random() * 20);
      particle.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 55%), hsl(${hue + 12}, 100%, 48%))`;
    }

    particlesContainer.appendChild(particle);

    const duration = 10000 + Math.random() * 10000;
    const horizontalDrift = (Math.random() - 0.5) * 250;

    let keyframes;
    if (isFalling) {
      const startRot = Math.random() * 360;
      keyframes = [
        { opacity: 0, transform: `translateY(0) translateX(0) rotate(${startRot}deg) rotateY(0deg)` },
        { opacity: 0.8, transform: `translateY(15vh) translateX(${horizontalDrift * 0.25}px) rotate(${startRot + 45}deg) rotateY(180deg)`, offset: 0.15 },
        { opacity: 0.8, transform: `translateY(65vh) translateX(${horizontalDrift * 0.75}px) rotate(${startRot + 180}deg) rotateY(360deg)`, offset: 0.75 },
        { opacity: 0, transform: `translateY(105vh) translateX(${horizontalDrift}px) rotate(${startRot + 360}deg) rotateY(720deg)` }
      ];
    } else {
      keyframes = [
        { opacity: 0, transform: `translateY(0) translateX(0) scale(0)` },
        { opacity: 0.8, transform: `translateY(-20vh) translateX(${horizontalDrift * 0.3}px) scale(1)`, offset: 0.2 },
        { opacity: 0.5, transform: `translateY(-60vh) translateX(${horizontalDrift}px) scale(0.8)`, offset: 0.7 },
        { opacity: 0, transform: `translateY(-100vh) translateX(${horizontalDrift * 1.5}px) scale(0.3)` }
      ];
    }

    const animation = particle.animate(keyframes, {
      duration: duration,
      easing: isFalling ? 'linear' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => {
      particle.remove();
    };
  }

  // ══════════════════════════════════════
  // TILT EFFECT ON CARDS
  // ══════════════════════════════════════

  document.querySelectorAll('.project-card, .focus-card, .quick-link-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ══════════════════════════════════════
  // FORMSUBMIT AJAX HANDLING
  // ══════════════════════════════════════

  const contactForm = document.querySelector('.contact-form') || document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... ⏳';

      const formData = new FormData(contactForm);

      fetch('https://formsubmit.co/ajax/rotaractbangalorehighgrounds@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('FormSubmit error response');
        }
      })
      .then(data => {
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 4000);
      })
      .catch(error => {
        console.warn('FormSubmit AJAX failed, falling back to standard submit:', error);
        contactForm.submit();
      });
    });
  }

  console.log('🇮🇳 Rotaract Club of HighGrounds — Indian Theme Active');
});

document.addEventListener('DOMContentLoaded', function() {
    // Team Reveal Button Logic
    const toggleBtn = document.getElementById('toggle-team-btn');
    const hiddenMembers = document.querySelectorAll('.extra-member');
    let isExpanded = false;

    if(toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            
            hiddenMembers.forEach(member => {
                if (isExpanded) {
                    member.classList.remove('hidden');
                } else {
                    member.classList.add('hidden');
                }
            });

            // Change button text based on state
            toggleBtn.innerHTML = isExpanded 
                ? 'Show Less <span style="margin-left: 5px;">⬆️</span>' 
                : 'View Full Board <span style="margin-left: 5px;">⬇️</span>';
        });
    }
});
