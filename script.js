(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const intro = $('#introScreen');
  const main = $('#mainContent');
  const header = $('#siteHeader');
  const openBtn = $('#openArchiveBtn');
  const musicToggle = $('#musicToggle');
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function unlockArchive() {
    intro.classList.add('is-leaving');
    main.classList.remove('locked-content');
    header.classList.add('is-ready');
    document.body.classList.remove('no-scroll');
    setTimeout(() => intro.remove(), 1100);
    // Sound is intentionally user-controlled; opening the archive does not force audio on.
    observeReveals();
  }
  document.body.classList.add('no-scroll');
  openBtn.addEventListener('click', unlockArchive);

  // Scroll reveals: content remains readable when JavaScript or motion support is unavailable.
  let revealObserver;
  function observeReveals() {
    const nodes = $$('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('is-visible')); return; }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    nodes.forEach(node => revealObserver.observe(node));
  }

  // Mobile navigation.
  const menuBtn = $('#mobileMenuBtn');
  const mobileNav = $('#mobileNav');
  menuBtn.addEventListener('click', () => {
    const opened = mobileNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(opened));
    menuBtn.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  });
  $$('#mobileNav a').forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));

  // Local MP3 soundtrack. Playback begins only after the visitor presses the small header control.
  const friendshipAudio = $('#friendshipAudio');

  function syncMusicControl() {
    const playing = !friendshipAudio.paused && !friendshipAudio.ended;
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    $('.music-action', musicToggle).textContent = playing ? 'Ⅱ' : '▶';
    musicToggle.setAttribute('aria-label', playing ? 'Pause Jaane Kyun' : 'Play Jaane Kyun');
    musicToggle.title = playing ? 'Pause Jaane Kyun' : 'Play Jaane Kyun';
  }

  musicToggle.addEventListener('click', async () => {
    if (!friendshipAudio.paused) {
      friendshipAudio.pause();
      return;
    }
    try {
      await friendshipAudio.play();
    } catch (error) {
      showToast('Music could not load. Check media/jaane-kyun.mp3 is included.');
    }
  });

  friendshipAudio.addEventListener('play', syncMusicControl);
  friendshipAudio.addEventListener('pause', syncMusicControl);
  friendshipAudio.addEventListener('ended', syncMusicControl);
  friendshipAudio.addEventListener('error', () => {
    showToast('Music file unavailable. Keep jaane-kyun.mp3 inside the media folder.');
    syncMusicControl();
  });
  syncMusicControl();

  // A tiny replay of the infamous housemaster panic.
  const alertBtn = $('#housemasterAlert');
  const alertResponse = $('#alertResponse');
  let alertTimeout;
  alertBtn.addEventListener('click', () => {
    clearTimeout(alertTimeout);
    const messages = [
      '11:59 PM — DECORATIONS COMPLETE. EVERYONE, STAY QUIET.',
      '12:00 AM — HAPPY BIRTHDAY, ROHAN!!!',
      '12:01 AM — WARNING: HOUSEMASTER DETECTED NEAR BLOCK 01.',
      '12:02 AM — 15 FRIENDS: SCATTER. SCATTER. SCATTER.',
      '30 MINUTES LATER — SEARCH OVER. FRIENDSHIP INTACT.'
    ];
    let i = 0;
    alertResponse.textContent = messages[i];
    alertBtn.classList.add('alert-running');
    const run = () => {
      i++;
      if (i >= messages.length) {
        alertResponse.textContent = messages[messages.length - 1];
        alertBtn.classList.remove('alert-running');
        return;
      }
      alertResponse.textContent = messages[i];
      alertTimeout = setTimeout(run, 1150);
    };
    alertTimeout = setTimeout(run, 1150);
  });

  // Holi memory reveal.
  const holiBtn = $('#holiRevealBtn');
  const holiHidden = $('#holiHidden');
  holiBtn.addEventListener('click', () => {
    holiHidden.hidden = !holiHidden.hidden;
    holiBtn.innerHTML = holiHidden.hidden ? 'REVEAL THE LESSON <span>＋</span>' : 'HIDE THE LESSON <span>−</span>';
  });

  // Gallery lightbox.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    lightboxImage.src = '';
  }
  $$('.photo-card').forEach(card => card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = $('img', card).alt;
    lightboxCaption.textContent = card.dataset.caption;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    $('#lightboxClose').focus();
  }));
  $('#lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  // Birthday finale: light the candles, release confetti, then reveal the letter.
  const candleBtn = $('#lightCandlesBtn');
  const cake = $('.cake');
  const birthdayReveal = $('#birthdayReveal');
  const cakeHint = $('#cakeHint');
  candleBtn.addEventListener('click', () => {
    if (cake.classList.contains('is-lit')) return;
    cake.classList.add('is-lit');
    birthdayReveal.hidden = false;
    cakeHint.textContent = 'WISH MADE. THE NEXT CHAPTER IS YOURS.';
    candleBtn.innerHTML = '<span>WISH GRANTED ✦</span><span class="btn-arrow">✓</span>';
    candleBtn.disabled = true;
    candleBtn.style.opacity = '.65';
    launchConfetti();
    birthdayReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  $('#openLetterBtn').addEventListener('click', () => {
    const letter = $('#letterCard');
    letter.hidden = false;
    letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function launchConfetti() {
    const colors = ['#d9b77e', '#f0e0bc', '#b85b4e', '#8b9b91', '#d9a1a1'];
    for (let i = 0; i < 75; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--fall', `${2.2 + Math.random() * 2.4}s`);
      piece.style.setProperty('--drift', `${(Math.random() - .5) * 180}px`);
      piece.style.setProperty('--spin', `${Math.random() * 900 - 450}deg`);
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  // Subtle pointer light on larger screens only.
  const glow = $('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Avoid a blank page behind the intro if scripts load before reveal observers.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal').forEach(node => node.classList.add('is-visible'));
  }
})();
