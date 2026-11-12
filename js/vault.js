/**
 * 👑 CHAPTER 14: THE ROYAL VAULT, HANDWRITTEN LETTER & VIDEO REEL
 * 3D gift unboxing, wax-sealed letter unfolding, and living memory video reel modal.
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { particles } from './particles.js';
import { router } from './router.js';

export function initVault() {
  const ribbon = document.getElementById('vault-ribbon');
  const boxLid = document.getElementById('vault-box-lid');
  const boxInside = document.getElementById('vault-inside');
  const waxSeal = document.getElementById('wax-seal-btn');
  const letterModal = document.getElementById('letter-modal');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const replayBtn = document.getElementById('replay-journey-btn');
  const openVideoReelBtn = document.getElementById('open-video-reel-btn');
  const videoModal = document.getElementById('video-modal');
  const closeVideoBtn = document.getElementById('close-video-btn');

  // Populate Letter Content
  const letterBody = document.getElementById('letter-body');
  if (letterBody) {
    letterBody.innerHTML = `
      <p class="letter-salutation">${CONFIG.letter.salutation}</p>
      ${CONFIG.letter.paragraphs.map(p => `<p class="letter-para">${p}</p>`).join('')}
      <div class="letter-signoff-box">
        <p class="letter-signoff">${CONFIG.letter.signoff}</p>
        <p class="letter-signature">${CONFIG.letter.signature}</p>
      </div>
    `;
  }

  // 1. Unboxing Ribbon Pull
  if (ribbon && !ribbon.dataset.bound) {
    ribbon.dataset.bound = "true";
    ribbon.onclick = () => unboxGift(ribbon, boxLid, boxInside);
  }

  // 2. Wax Seal Crack
  if (waxSeal && !waxSeal.dataset.bound) {
    waxSeal.dataset.bound = "true";
    waxSeal.onclick = () => {
      sound.playPaperUnfold();
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
      if (letterModal) {
        letterModal.classList.remove('hidden');
        letterModal.classList.add('animate-scale-up');
      }
    };
  }

  // 3. Close Letter
  if (closeLetterBtn && !closeLetterBtn.dataset.bound) {
    closeLetterBtn.dataset.bound = "true";
    closeLetterBtn.onclick = () => {
      sound.playClick();
      if (letterModal) letterModal.classList.add('hidden');
    };
  }

  // 4. Video Reel Modal
  if (openVideoReelBtn && !openVideoReelBtn.dataset.bound) {
    openVideoReelBtn.dataset.bound = "true";
    openVideoReelBtn.onclick = () => {
      sound.playClick();
      if (videoModal) {
        videoModal.classList.remove('hidden');
        const vid = document.getElementById('reel-active-video');
        if (vid) vid.play().catch(() => {});
      }
    };
  }

  if (closeVideoBtn && !closeVideoBtn.dataset.bound) {
    closeVideoBtn.dataset.bound = "true";
    closeVideoBtn.onclick = () => {
      sound.playClick();
      if (videoModal) {
        const vid = document.getElementById('reel-active-video');
        if (vid) vid.pause();
        videoModal.classList.add('hidden');
      }
    };
  }

  // Video Reel Thumbnails
  const videoThumbs = document.querySelectorAll('.reel-thumb');
  videoThumbs.forEach(thumb => {
    thumb.onclick = (e) => {
      sound.playClick();
      const videoSrc = e.currentTarget.getAttribute('data-src');
      const vid = document.getElementById('reel-active-video');
      if (vid && videoSrc) {
        vid.src = videoSrc;
        vid.play().catch(() => {});
      }
      videoThumbs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
    };
  });

  // 5. Replay Button
  if (replayBtn && !replayBtn.dataset.bound) {
    replayBtn.dataset.bound = "true";
    replayBtn.onclick = () => {
      sound.playClick();
      router.goTo(1);
    };
  }
}

function unboxGift(ribbon, boxLid, boxInside) {
  sound.playUnlock();
  ribbon.style.transform = 'translateY(-120px) scale(0.6)';
  ribbon.style.opacity = '0';

  setTimeout(() => {
    if (boxLid) {
      boxLid.style.transform = 'translateY(-200px) rotate(-15deg)';
      boxLid.style.opacity = '0';
    }
  }, 250);

  setTimeout(() => {
    if (boxInside) {
      boxInside.classList.remove('hidden');
      boxInside.classList.add('animate-scale-up');
    }
    sound.playChime();
    if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);
  }, 500);
}
