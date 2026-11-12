/**
 * 💌 CHAPTER 9: THE JAR OF 100 LITTLE REASONS (FULL 100 QUOTES)
 * Interactive 3D fairy-lit glass jar releasing unfolding origami paper hearts
 * with Random Love Cannon and exact 100-reason counter.
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { particles } from './particles.js';

let unlockedReasons = new Set();
let currentIndex = 0;

export function initReasons() {
  const jar = document.getElementById('magic-mason-jar');
  const counterEl = document.getElementById('reasons-unlocked-count');
  const noteDisplay = document.getElementById('reason-note-card');
  const noteText = document.getElementById('reason-note-text');
  const noteIndexLabel = document.getElementById('reason-note-index');
  const closeNoteBtn = document.getElementById('close-note-btn');
  const nextNoteBtn = document.getElementById('next-note-btn');
  const cannonBtn = document.getElementById('random-cannon-btn');

  if (!jar) return;

  function updateCounter() {
    if (counterEl) {
      counterEl.textContent = `${unlockedReasons.size} / ${CONFIG.reasons.length} Reasons Unlocked`;
    }
  }

  updateCounter();

  function popReason(customIndex = null) {
    sound.playPaperUnfold();
    jar.classList.add('jar-shake');
    setTimeout(() => jar.classList.remove('jar-shake'), 400);

    const idx = customIndex !== null ? customIndex : (currentIndex % CONFIG.reasons.length);
    const reason = CONFIG.reasons[idx];
    unlockedReasons.add(idx);
    if (customIndex === null) currentIndex++;
    updateCounter();

    if (particles) {
      const rect = jar.getBoundingClientRect();
      particles.triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3, 20);
    }

    if (noteDisplay && noteText) {
      if (noteIndexLabel) noteIndexLabel.textContent = `Reason #${idx + 1} of 100 💖`;
      noteText.textContent = `"${reason}"`;
      noteDisplay.classList.remove('hidden');
      noteDisplay.classList.add('animate-pop-in');
    }
  }

  if (!jar.dataset.bound) {
    jar.dataset.bound = "true";
    jar.addEventListener('click', () => popReason());
  }

  if (cannonBtn && !cannonBtn.dataset.bound) {
    cannonBtn.dataset.bound = "true";
    cannonBtn.onclick = () => {
      sound.playCheer();
      const randomIdx = Math.floor(Math.random() * CONFIG.reasons.length);
      popReason(randomIdx);
    };
  }

  if (nextNoteBtn && !nextNoteBtn.dataset.bound) {
    nextNoteBtn.dataset.bound = "true";
    nextNoteBtn.onclick = () => {
      sound.playPop();
      popReason();
    };
  }

  if (closeNoteBtn && !closeNoteBtn.dataset.bound) {
    closeNoteBtn.dataset.bound = "true";
    closeNoteBtn.onclick = () => {
      sound.playClick();
      if (noteDisplay) noteDisplay.classList.add('hidden');
    };
  }
}
