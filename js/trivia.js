/**
 * 💡 CHAPTER 8: THE LOVERS' TRIVIA CHALLENGE
 * Interactive relationship quiz engine with tricky questions, lifeline button, and confetti rewards.
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { particles } from './particles.js';

let currentQ = 0;
let score = 0;

export function initTrivia() {
  currentQ = 0;
  score = 0;
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById('trivia-container');
  if (!container) return;

  const questions = CONFIG.trivia;
  if (currentQ >= questions.length) {
    // Show Results
    container.innerHTML = `
      <div class="trivia-result-card animate-scale-up">
        <div class="result-badge">🏆 100% SOULMATE CERTIFIED</div>
        <h3 class="result-title">You know our story by heart!</h3>
        <p class="result-score">Final Score: ${score} / ${questions.length} Correct</p>
        <p class="result-sub">No matter the score, you already won my heart a long time ago.</p>
        <button id="trivia-retry-btn" class="glow-btn">Play Again ↺</button>
      </div>
    `;
    sound.playCheer();
    if (particles) particles.triggerConfetti();

    document.getElementById('trivia-retry-btn')?.addEventListener('click', () => {
      sound.playClick();
      initTrivia();
    });
    return;
  }

  const qData = questions[currentQ];
  container.innerHTML = `
    <div class="trivia-question-card animate-fade-in">
      <div class="trivia-header">
        <span class="trivia-pill">Question ${currentQ + 1} of ${questions.length}</span>
        <span class="trivia-score">Score: ${score}</span>
      </div>
      <h3 class="trivia-question-text">${qData.q}</h3>
      <div class="trivia-options-grid">
        ${qData.options.map((opt, i) => `
          <button class="trivia-opt-btn" data-index="${i}">${opt}</button>
        `).join('')}
      </div>

      <div style="margin-top: 14px; text-align: center;">
        <button id="trivia-lifeline-btn" class="fun-action-btn">📞 Use Lifeline: Call Boyfriend</button>
      </div>

      <div id="lifeline-modal-box" class="fun-toast-banner hidden">
        <p><strong>📞 Ring ring... Boyfriend answers:</strong></p>
        <p style="font-style: italic; margin-top: 4px;">"Hello? Whatever answer Vedanti picks is legally 1000% correct! My survival instinct says never argue with a queen!" 😂</p>
      </div>

      <div id="trivia-feedback" class="trivia-feedback hidden"></div>
    </div>
  `;

  // Bind Lifeline
  const lifelineBtn = container.querySelector('#trivia-lifeline-btn');
  const lifelineBox = container.querySelector('#lifeline-modal-box');
  if (lifelineBtn) {
    lifelineBtn.onclick = () => {
      sound.playChime();
      lifelineBox?.classList.remove('hidden');
      lifelineBtn.disabled = true;
      lifelineBtn.style.opacity = '0.5';
    };
  }

  const buttons = container.querySelectorAll('.trivia-opt-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedIndex = parseInt(e.currentTarget.getAttribute('data-index'));
      handleAnswer(selectedIndex, qData, buttons);
    });
  });
}

function handleAnswer(selectedIndex, qData, allButtons) {
  const feedback = document.getElementById('trivia-feedback');
  allButtons.forEach(btn => btn.disabled = true);

  const isCorrect = selectedIndex === qData.correct;
  if (isCorrect) {
    score++;
    sound.playChime();
    if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
    allButtons[selectedIndex].classList.add('correct');
  } else {
    sound.playClick();
    allButtons[selectedIndex].classList.add('incorrect');
    allButtons[qData.correct].classList.add('correct');
  }

  if (feedback) {
    feedback.classList.remove('hidden');
    feedback.innerHTML = `
      <p class="feedback-text">${isCorrect ? '✨ ' : '💡 '}${qData.cheer}</p>
      <button id="trivia-next-q" class="glow-btn-small">Next Question →</button>
    `;
    document.getElementById('trivia-next-q')?.addEventListener('click', () => {
      sound.playClick();
      currentQ++;
      renderQuestion();
    });
  }
}
