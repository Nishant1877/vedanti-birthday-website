/**
 * ⏳ CHAPTER 2: COSMIC COUNTDOWN ENGINE
 * Precision real-time counter to November 14th midnight.
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { particles } from './particles.js';

let countdownTimer = null;

export function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');
  const bannerEl = document.getElementById('birthday-arrival-banner');
  const fastForwardBtn = document.getElementById('fast-forward-btn');

  if (!daysEl) return;

  function update() {
    const targetDate = new Date(CONFIG.birthdayDate).getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (bannerEl) bannerEl.classList.remove('hidden');
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(update, 1000);

  if (fastForwardBtn && !fastForwardBtn.dataset.bound) {
    fastForwardBtn.dataset.bound = "true";
    fastForwardBtn.addEventListener('click', () => {
      sound.playCheer();
      if (particles) particles.triggerConfetti();
      if (bannerEl) {
        bannerEl.classList.remove('hidden');
        bannerEl.style.animation = 'scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
    });
  }
}
