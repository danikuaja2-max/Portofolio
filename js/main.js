/**
 * ============================================================================
 * PORTFOLIO SPACE THEME - JAVASCRIPT ENGINE
 * M. Faris Labibul Izza - XII TJKT 2 (SMK QUEEN AL FALAH)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpaceCanvas();
  initTypewriter();
  initNavbarScrollSpy();
  initMobileMenu();
  initStatCounters();
  initSkillBars();
  initTiltEffect();
  initWhatsAppForm();
  initBackToTop();
});

/* ==========================================================================
   1. INTERACTIVE SPACE CANVAS (STARS, NEBULA & SHOOTING METEORS)
   ========================================================================== */
function initSpaceCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  });

  // Mouse Parallax
  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetX = mouseX;
  let targetY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Star Field Data
  const starCount = Math.min(Math.floor((width * height) / 4500), 280);
  let stars = [];

  const starColors = [
    'rgba(255, 255, 255, ',
    'rgba(0, 229, 255, ',   // Neon Cyan
    'rgba(96, 165, 250, ',   // Soft Blue
    'rgba(192, 132, 252, '   // Lavender Purple
  ];

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        depth: Math.random() * 0.6 + 0.2
      });
    }
  }

  createStars();

  // Shooting Stars (Meteors)
  let meteors = [];

  function spawnMeteor() {
    const startX = Math.random() * width * 1.2;
    const startY = Math.random() * (height * 0.4);
    const length = Math.random() * 120 + 80;
    const speed = Math.random() * 10 + 12;
    const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees

    meteors.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      opacity: 1,
      fadeRate: Math.random() * 0.02 + 0.015,
      trail: []
    });

    // Schedule next meteor between 3 to 7 seconds
    const nextSpawn = Math.random() * 4000 + 3000;
    setTimeout(spawnMeteor, nextSpawn);
  }

  // Trigger initial meteor
  setTimeout(spawnMeteor, 1500);

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse parallax
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;
    const offsetX = (mouseX - width / 2) * 0.03;
    const offsetY = (mouseY - height / 2) * 0.03;

    // Render Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Twinkle alpha
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.95) {
        s.alpha = 0.95;
        s.twinkleDir = -1;
      } else if (s.alpha < 0.2) {
        s.alpha = 0.2;
        s.twinkleDir = 1;
      }

      // Parallax coordinate
      const currentX = s.baseX - offsetX * s.depth;
      const currentY = s.baseY - offsetY * s.depth;

      ctx.fillStyle = s.colorPrefix + s.alpha + ')';
      ctx.beginPath();
      ctx.arc(currentX, currentY, s.size, 0, Math.PI * 2);
      ctx.fill();

      // Extra glow for larger stars
      if (s.size > 1.4) {
        ctx.fillStyle = s.colorPrefix + (s.alpha * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(currentX, currentY, s.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.dx;
      m.y += m.dy;
      m.opacity -= m.fadeRate;

      if (m.opacity <= 0 || m.x > width + 200 || m.y > height + 200) {
        meteors.splice(i, 1);
        continue;
      }

      const tailX = m.x - (m.dx / m.speed) * m.length;
      const tailY = m.y - (m.dy / m.speed) * m.length;

      const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
      gradient.addColorStop(0.3, `rgba(0, 229, 255, ${m.opacity * 0.8})`);
      gradient.addColorStop(1, `rgba(0, 150, 255, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Meteor head spark
      ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typingElement = document.getElementById('typing-role');
  if (!typingElement) return;

  const roles = [
    'Junior Web Developer',
    'Siswa Kelas XII TJKT 2',
    'SMK QUEEN AL FALAH',
    'Computer & Network Enthusiast',
    'Frontend & Tech Explorer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1800;
  const pauseStart = 400;

  function type() {
    const currentRole = roles[roleIdx];

    if (!isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseEnd);
        return;
      }
      setTimeout(type, typeSpeed);
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, pauseStart);
        return;
      }
      setTimeout(type, deleteSpeed);
    }
  }

  type();
}

/* ==========================================================================
   3. FLOATING NAVBAR SCROLL SPY & GLOW INTENSITY
   ========================================================================== */
function initNavbarScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.floating-navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar glow change on scroll
    if (scrollY > 50) {
      navbar.style.background = 'rgba(6, 11, 26, 0.88)';
      navbar.style.borderColor = 'rgba(0, 229, 255, 0.5)';
      navbar.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 229, 255, 0.4)';
    } else {
      navbar.style.background = 'rgba(8, 14, 30, 0.7)';
      navbar.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 15, 45, 0.5), 0 0 20px 2px rgba(0, 200, 255, 0.35)';
    }

    // Active Section Detection
    let currentId = '';
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navPanel = document.getElementById('mobile-nav-panel');
  if (!menuBtn || !navPanel) return;

  const menuIcon = menuBtn.querySelector('i');

  menuBtn.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('open');
    if (menuIcon) {
      if (isOpen) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    }
  });

  // Close when clicking link
  const links = navPanel.querySelectorAll('.nav-link, .nav-cta-btn');
  links.forEach((l) => {
    l.addEventListener('click', () => {
      navPanel.classList.remove('open');
      if (menuIcon) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    });
  });
}

/* ==========================================================================
   5. ANIMATED STATISTIC COUNTERS
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out expo
              const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.floor(easeOut * target);

              counter.textContent = currentVal + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target + suffix;
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   6. ANIMATED SKILL BARS
   ========================================================================== */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!skillSection || !fills.length) return;

  let filled = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !filled) {
          filled = true;
          fills.forEach((fill) => {
            const progress = fill.getAttribute('data-progress');
            fill.style.width = `${progress}%`;
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(skillSection);
}

/* ==========================================================================
   7. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initTiltEffect() {
  const cards = document.querySelectorAll('.profile-card, .project-card, .stat-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      card.style.transition = 'transform 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   8. WHATSAPP QUICK MESSAGE FORM
   ========================================================================== */
function initWhatsAppForm() {
  const form = document.getElementById('wa-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    const phoneNumber = '6281358385494';
    const text = `Halo M. Faris Labibul Izza! 🚀%0A%0ASaya: *${encodeURIComponent(name)}*%0AKeperluan: *${encodeURIComponent(subject)}*%0A%0APesan:%0A${encodeURIComponent(message)}`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    window.open(waUrl, '_blank');
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 450) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
