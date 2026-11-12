/**
 * 🌟 MAIN APPLICATION ENTRY POINT (ALL 14 SLIDES PACKED WITH UNIQUE FUN FEATURES)
 * Initializes all 14 chapters, binds event controllers,
 * and coordinates audio, routing, and particle effects.
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { initParticles, particles } from './particles.js';
import { router } from './router.js';
import { initCountdown } from './countdown.js';
import { initFortuneWheel } from './wheel.js';
import { initTrivia } from './trivia.js';
import { initReasons } from './reasons.js';
import { initScratchCard } from './scratch.js';
import { initConstellation } from './constellation.js';
import { initBucketList } from './bucketlist.js';
import { initCake } from './cake.js';
import { initVault } from './vault.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles & Stardust (Zero-Lag Engine)
  initParticles('star-canvas');

  // 2. Initialize Router
  router.init();
  window.router = router;

  // 3. Audio Pill Toggle
  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      sound.ensureContext();
      sound.startMusic();
      const isMuted = sound.toggleMute();
      musicBtn.classList.toggle('muted', isMuted);
      musicBtn.innerHTML = isMuted ? '🔇 Music Off' : '🎵 Music On';
    });
  }

  // Bind Slide-Specific Fun Tricks & Activities
  setupSlide1_Keyhole();
  setupSlide2_LoveMeter();
  setupSlide3_PolaroidStickers();
  setupSlide4_SecretConfessions();
  setupSlide5_MemeSoundboard();
  setupSlide6_StatsCalculator();
  setupSlide12_CrazyDateGenerator();
  setupSlide13_PartyHorns();
  setupSlide14_GuaranteeCertificate();

  // Register Chapter Lifecycle Hooks
  router.registerHook(2, initCountdown);
  router.registerHook(7, initFortuneWheel);
  router.registerHook(8, initTrivia);
  router.registerHook(9, initReasons);
  router.registerHook(10, initScratchCard);
  router.registerHook(11, initConstellation);
  router.registerHook(12, initBucketList);
  router.registerHook(13, initCake);
  router.registerHook(14, initVault);
});

/**
 * Slide 1: Knock on Secret Door & Golden Key
 */
function setupSlide1_Keyhole() {
  const key = document.getElementById('golden-key');
  const keyhole = document.getElementById('door-keyhole');
  const revealCard = document.getElementById('keyhole-reveal-card');
  const enterBtn = document.getElementById('enter-journey-btn');
  const knockBtn = document.getElementById('knock-door-btn');
  const knockToast = document.getElementById('knock-toast');

  if (knockBtn) {
    knockBtn.onclick = () => {
      sound.playPop();
      if (knockToast) {
        knockToast.classList.remove('hidden');
        knockToast.innerHTML = `<strong>🚪 *Knock Knock!*</strong><br>"Who's there?"<br><strong>"The luckiest boyfriend in the entire world! 🥰"</strong>`;
      }
    };
  }

  function unlock() {
    if (!key || key.classList.contains('used')) return;
    key.classList.add('used');
    sound.ensureContext();
    sound.startMusic();
    sound.playUnlock();

    key.style.transform = 'translateY(-60px) scale(0.8) rotate(45deg)';
    key.style.opacity = '0';

    setTimeout(() => {
      if (keyhole) keyhole.classList.add('unlocked-glow');
      if (revealCard) {
        revealCard.classList.remove('hidden');
        revealCard.classList.add('animate-scale-up');
      }
      sound.playChime();
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
      router.unlockFirstChapter();
    }, 500);
  }

  if (key) {
    key.addEventListener('click', unlock);
    key.addEventListener('touchstart', (e) => {
      e.preventDefault();
      unlock();
    });
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      sound.playClick();
      router.goTo(2);
    });
  }
}

/**
 * Slide 2: Rapid-Fire Love Meter
 */
function setupSlide2_LoveMeter() {
  const chargeBtn = document.getElementById('charge-love-btn');
  const lovePctEl = document.getElementById('love-meter-pct');
  let loveCount = 100;

  if (chargeBtn) {
    chargeBtn.onclick = () => {
      sound.playPop();
      loveCount += 50;
      if (lovePctEl) lovePctEl.textContent = `${loveCount}%`;
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.7, 15);
      if (loveCount >= 500) {
        chargeBtn.textContent = '🔥 LOVE METER OVERHEATED AT 1000%! 🔥';
      }
    };
  }
}

/**
 * Slide 3: Polaroid Developing & Funny Sticker Box
 */
function setupSlide3_PolaroidStickers() {
  const polaroid = document.getElementById('day-one-polaroid');
  const img = document.getElementById('polaroid-photo');
  const stickerBtns = document.querySelectorAll('.stamp-tool-btn');

  if (polaroid && img) {
    const develop = () => {
      if (img.classList.contains('developed')) return;
      img.classList.add('developed');
      sound.playPaperUnfold();
      if (particles) {
        const rect = polaroid.getBoundingClientRect();
        particles.triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      }
    };
    polaroid.addEventListener('mouseenter', develop);
    polaroid.addEventListener('touchstart', develop);
    polaroid.addEventListener('click', develop);
  }

  stickerBtns.forEach(btn => {
    btn.onclick = () => {
      sound.playPop();
      const sticker = btn.getAttribute('data-sticker') || '❤️';
      const span = document.createElement('span');
      span.textContent = sticker;
      span.style.position = 'absolute';
      span.style.fontSize = '2.2rem';
      span.style.left = `${Math.random() * 65 + 15}%`;
      span.style.top = `${Math.random() * 60 + 15}%`;
      span.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;
      span.style.pointerEvents = 'none';
      span.style.zIndex = '5';
      polaroid?.appendChild(span);
    };
  });
}

/**
 * Slide 4: Milestone Secret Confessions
 */
function setupSlide4_SecretConfessions() {
  const cards = document.querySelectorAll('.timeline-card');
  const toast = document.getElementById('confession-toast');
  const confessions = [
    "🤫 Behind the Scenes Confession: I checked my outfit in the mirror 18 times before seeing you in that saree, and you still made my jaw drop in 2 seconds!",
    "🤫 Behind the Scenes Confession: Matching in white was completely unplanned, but seeing you smile made me feel like the main character in a movie!"
  ];

  cards.forEach((card, idx) => {
    const confBtn = card.querySelector('.confession-btn');
    if (confBtn) {
      confBtn.onclick = (e) => {
        e.stopPropagation();
        sound.playChime();
        if (toast) {
          toast.classList.remove('hidden');
          toast.innerHTML = `<p>${confessions[idx % confessions.length]}</p>`;
        }
      };
    }
  });
}

/**
 * Slide 5: Meme Soundboard / Laugh Reactions
 */
function setupSlide5_MemeSoundboard() {
  const cards = document.querySelectorAll('.flip-card-inner');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      sound.playCardFlip();
      card.parentElement.classList.toggle('flipped');
    });
  });

  const boingBtn = document.getElementById('sfx-boing-btn');
  const choirBtn = document.getElementById('sfx-choir-btn');
  const laughBtn = document.getElementById('sfx-laugh-btn');

  if (boingBtn) boingBtn.onclick = () => { sound.playPop(); if (particles) particles.triggerConfetti(window.innerWidth * 0.3, window.innerHeight * 0.5, 15); };
  if (choirBtn) choirBtn.onclick = () => { sound.playChime(); if (particles) particles.triggerConfetti(window.innerWidth * 0.5, window.innerHeight * 0.5, 25); };
  if (laughBtn) laughBtn.onclick = () => { sound.playCheer(); if (particles) particles.triggerConfetti(window.innerWidth * 0.7, window.innerHeight * 0.5, 30); };
}

/**
 * Slide 6: Relationship Stats Calculator
 */
function setupSlide6_StatsCalculator() {
  const calcBtn = document.getElementById('calc-stats-btn');
  const statsBox = document.getElementById('relationship-stats-box');

  if (calcBtn) {
    calcBtn.onclick = () => {
      sound.playChime();
      if (statsBox) {
        statsBox.classList.remove('hidden');
        statsBox.innerHTML = `
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <span>☕ Cutting Chais: <strong>842</strong></span>
            <span>😂 Inside Jokes: <strong>4,219</strong></span>
            <span>🛣️ Distance Traveled: <strong>∞ km</strong></span>
            <span>❤️ Love Level: <strong>Off the charts</strong></span>
          </div>
        `;
      }
    };
  }
}

/**
 * Slide 12: Spontaneous Crazy Date Idea Generator
 */
function setupSlide12_CrazyDateGenerator() {
  const crazyBtn = document.getElementById('crazy-date-btn');
  const crazyToast = document.getElementById('crazy-date-toast');
  const ideas = [
    "🎲 Crazy Date Idea: 3:00 AM midnight drive in pajamas to find the best hot chocolate!",
    "🎲 Crazy Date Idea: Vedanti teaches boyfriend how to do winged eyeliner (with photographic evidence)!",
    "🎲 Crazy Date Idea: Blindfolded taste-test challenge with our favorite street snacks!",
    "🎲 Crazy Date Idea: Recreate our very first July 2023 photo in exact matching poses!"
  ];

  let ideaIdx = 0;
  if (crazyBtn) {
    crazyBtn.onclick = () => {
      sound.playChime();
      if (crazyToast) {
        crazyToast.classList.remove('hidden');
        crazyToast.innerHTML = `<p>${ideas[ideaIdx % ideas.length]}</p>`;
        ideaIdx++;
      }
    };
  }
}

/**
 * Slide 13: Party Horn & Taste Virtual Cake
 */
function setupSlide13_PartyHorns() {
  const hornBtn = document.getElementById('party-horn-btn');
  const tasteBtn = document.getElementById('taste-cake-btn');
  const tasteToast = document.getElementById('taste-cake-toast');

  if (hornBtn) {
    hornBtn.onclick = () => {
      sound.playCheer();
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 40);
      hornBtn.textContent = '🥳 TOOT TOOT! HAPPY BIRTHDAY! 🥳';
      setTimeout(() => { hornBtn.textContent = '📯 Blow Party Horn!'; }, 1500);
    };
  }

  if (tasteBtn) {
    tasteBtn.onclick = () => {
      sound.playPop();
      if (tasteToast) {
        tasteToast.classList.remove('hidden');
        tasteToast.innerHTML = `<p>🍰 <strong>Taste Test Result:</strong> 100/10 Delicious Dutch Truffle with zero calories for the birthday girl!</p>`;
      }
    };
  }
}

/**
 * Slide 14: Boyfriend Guarantee Certificate
 */
function setupSlide14_GuaranteeCertificate() {
  const certBtn = document.getElementById('download-cert-btn');
  const certModal = document.getElementById('cert-modal');
  const closeCertBtn = document.getElementById('close-cert-btn');

  if (certBtn) {
    certBtn.onclick = () => {
      sound.playCheer();
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
      if (certModal) certModal.classList.remove('hidden');
    };
  }

  if (closeCertBtn) {
    closeCertBtn.onclick = () => {
      sound.playClick();
      if (certModal) certModal.classList.add('hidden');
    };
  }
}
