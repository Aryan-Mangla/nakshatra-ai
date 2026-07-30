/**
 * NakshatraX AI - Premium Astronomy Landing Page Script
 * Pure Vanilla JavaScript | Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initShootingStars();
  initCountdownTimer();
  initCursorGlow();
  initEmailValidation();
  initIntersectionObserver();
});

/* ==========================================================================
   1. Dynamic Starfield Generator (~110 Stars with randomized attributes)
   ========================================================================== */
function initStarfield() {
  const container = document.getElementById('starfield');
  if (!container) return;

  const STAR_COUNT = 110;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() < 0.75 ? (Math.random() * 1.5 + 0.8) : (Math.random() * 2.5 + 1.5);
    const duration = (Math.random() * 4 + 2).toFixed(2);
    const delay = (Math.random() * 6).toFixed(2);
    const minOpacity = (Math.random() * 0.25 + 0.1).toFixed(2);

    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      --duration: ${duration}s;
      --delay: ${delay}s;
      --min-opacity: ${minOpacity};
    `;

    /* Occasional colored stars */
    const r = Math.random();
    if (r > 0.88) star.style.backgroundColor = '#FCE09B';
    else if (r > 0.78) star.style.backgroundColor = '#A2D0FF';

    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

/* ==========================================================================
   2. Periodic Shooting Stars Spawner
   ========================================================================== */
function initShootingStars() {
  const spaceBg = document.querySelector('.space-bg');
  if (!spaceBg) return;

  function spawnShootingStar() {
    const el = document.createElement('div');
    el.className = 'shooting-star';

    /* Random position in upper-right area */
    const startX = Math.random() * 55 + 45;
    const startY = Math.random() * 35;

    el.style.cssText = `
      top: ${startY}%;
      left: ${startX}%;
      animation: shootingStarAnim 2.4s cubic-bezier(0.2, 1, 0.4, 1) forwards;
    `;

    spaceBg.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  /* First shooting star after 1.8s, then random 5-10s intervals */
  setTimeout(spawnShootingStar, 1800);
  setInterval(() => {
    setTimeout(spawnShootingStar, Math.random() * 2000);
  }, 7000);
}

/* ==========================================================================
   3. Live Countdown Timer
   ========================================================================== */
function initCountdownTimer() {
  const daysEl    = document.getElementById('timerDays');
  const hoursEl   = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  /* Launch target: 28 days 14 hours 36 minutes from page load */
  const target = Date.now()
    + 28 * 24 * 60 * 60 * 1000
    + 14 *      60 * 60 * 1000
    + 36 *           60 * 1000;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => el.textContent = '00');
      return;
    }

    daysEl.textContent    = pad(Math.floor(diff / 86400000));
    hoursEl.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    minutesEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    secondsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   4. Mouse-Following Soft Glow Effect (smooth lerp)
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  (function animateGlow() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(animateGlow);
  })();
}

/* ==========================================================================
   5. Email Validation & Success Modal
   ========================================================================== */
function initEmailValidation() {
  const form         = document.getElementById('notifyForm');
  const emailInput   = document.getElementById('emailInput');
  const errorMsg     = document.getElementById('errorMsg');
  const modal        = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const inputWrapper = emailInput ? emailInput.closest('.input-wrapper') : null;

  if (!form || !emailInput || !errorMsg || !modal) return;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Clear error on typing */
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input-error');
    if (inputWrapper) inputWrapper.classList.remove('input-error-wrapper');
    errorMsg.classList.remove('visible');
  });

  /* Form submission handler */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = emailInput.value.trim();

    if (!EMAIL_REGEX.test(val)) {
      emailInput.classList.add('input-error');
      if (inputWrapper) inputWrapper.classList.add('input-error-wrapper');
      errorMsg.classList.add('visible');
      emailInput.focus();
      return;
    }

    /* Valid email — show glass success modal */
    emailInput.classList.remove('input-error');
    if (inputWrapper) inputWrapper.classList.remove('input-error-wrapper');
    errorMsg.classList.remove('visible');
    form.reset();
    openModal();
  });

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  /* Click backdrop to close */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  /* Escape key to close */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   6. Intersection Observer — Scroll Fade-In Animations
   ========================================================================== */
function initIntersectionObserver() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}
