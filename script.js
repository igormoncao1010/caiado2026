const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');
const heroStage = document.getElementById('heroStage');
const heroBack = document.getElementById('heroBack');
const heroCursor = document.getElementById('heroCursor');
const supportButton = document.getElementById('supportButton');
const donationModal = document.getElementById('donationModal');
const closeDonation = document.getElementById('closeDonation');
const musicButton = document.getElementById('musicButton');
const musicIcon = document.getElementById('musicIcon');
const audio = document.getElementById('campaignAudio');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const heroReveal = {
  targetX: 0,
  targetY: 0,
  currentX: 0,
  currentY: 0,
  size: Math.max(120, Math.min(178, window.innerWidth * 0.095)),
  frame: null,
};

function setHeroTarget(event) {
  if (!heroStage || !heroCursor) return;
  const rect = heroStage.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  heroReveal.targetX = clientX - rect.left;
  heroReveal.targetY = clientY - rect.top;
  heroReveal.size = Math.max(120, Math.min(178, window.innerWidth * 0.095));
  heroStage.style.setProperty('--x', `${heroReveal.targetX}px`);
  heroStage.style.setProperty('--y', `${heroReveal.targetY}px`);
  heroStage.style.setProperty('--reveal-size', `${heroReveal.size}px`);

  if (!heroReveal.frame) {
    heroReveal.currentX = heroReveal.targetX;
    heroReveal.currentY = heroReveal.targetY;
    heroReveal.frame = requestAnimationFrame(animateHeroReveal);
  }
}

function animateHeroReveal() {
  const ease = 0.16;
  heroReveal.currentX += (heroReveal.targetX - heroReveal.currentX) * ease;
  heroReveal.currentY += (heroReveal.targetY - heroReveal.currentY) * ease;

  heroStage.style.setProperty('--smooth-x', `${heroReveal.currentX}px`);
  heroStage.style.setProperty('--smooth-y', `${heroReveal.currentY}px`);
  heroCursor.style.left = `${heroReveal.currentX}px`;
  heroCursor.style.top = `${heroReveal.currentY}px`;
  heroCursor.style.width = `${heroReveal.size}px`;
  heroCursor.style.height = `${heroReveal.size}px`;

  if (Math.abs(heroReveal.targetX - heroReveal.currentX) > 0.2 || Math.abs(heroReveal.targetY - heroReveal.currentY) > 0.2) {
    heroReveal.frame = requestAnimationFrame(animateHeroReveal);
  } else {
    heroReveal.frame = null;
  }
}

if (heroStage && heroBack) {
  heroStage.addEventListener('pointerenter', (event) => {
    heroStage.classList.add('is-active');
    setHeroTarget(event);
  });
  heroStage.addEventListener('pointermove', setHeroTarget);
  heroStage.addEventListener('pointerleave', () => heroStage.classList.remove('is-active'));
  heroStage.addEventListener('touchstart', (event) => {
    heroStage.classList.add('is-active');
    setHeroTarget(event);
  }, { passive: true });
  heroStage.addEventListener('touchmove', setHeroTarget, { passive: true });
}

function openDonation() {
  donationModal?.classList.add('is-open');
  donationModal?.setAttribute('aria-hidden', 'false');
}

function hideDonation() {
  donationModal?.classList.remove('is-open');
  donationModal?.setAttribute('aria-hidden', 'true');
}

supportButton?.addEventListener('click', openDonation);
closeDonation?.addEventListener('click', hideDonation);
donationModal?.addEventListener('click', (event) => {
  if (event.target === donationModal) hideDonation();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideDonation();
});

function setMusicUi(isPlaying) {
  if (!musicIcon || !musicButton) return;
  musicIcon.textContent = isPlaying ? '\u275a\u275a' : '\u25b6';
  musicButton.setAttribute('aria-label', isPlaying ? 'Pausar jingle' : 'Tocar jingle');
}

async function playJingle() {
  if (!audio || !audio.paused) return;
  try {
    await audio.play();
    setMusicUi(true);
  } catch (error) {
    setMusicUi(false);
  }
}

musicButton?.addEventListener('click', async (event) => {
  event.stopPropagation();
  if (!audio) return;

  if (audio.paused) {
    await playJingle();
  } else {
    audio.pause();
    setMusicUi(false);
  }
});

document.addEventListener('click', (event) => {
  if (event.target.closest('#musicButton')) return;
  playJingle();
});

audio?.addEventListener('ended', () => {
  setMusicUi(false);
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = [
  ['.section-kicker', 'reveal-rise'],
  ['.section h2', 'reveal-rise'],
  ['.rich-copy p', 'reveal-rise'],
  ['.manifest-video', 'reveal-scale'],
  ['.signal-grid article', 'reveal-card'],
  ['.ticket-card', 'reveal-scale'],
  ['.ticket-media', 'reveal-left'],
  ['.ticket-copy', 'reveal-right'],
  ['.cida-support-grid', 'reveal-rise'],
  ['.cida-support-copy p', 'reveal-rise'],
  ['.agenda-item', 'reveal-row'],
  ['.plan-grid article', 'reveal-card'],
  ['.rare-earths-panel', 'reveal-scale'],
  ['.mineral-list div', 'reveal-card'],
  ['.gallery-head', 'reveal-rise'],
  ['.photo-item', 'reveal-scale'],
  ['.news-grid article', 'reveal-card'],
  ['.footer', 'reveal-rise']
];

if (reduceMotion) {
  document.documentElement.classList.add('reduce-motion');
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  revealTargets.forEach(([selector, effect]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.classList.add('reveal-item', effect);
      item.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
      revealObserver.observe(item);
    });
  });
}
