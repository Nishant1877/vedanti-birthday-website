/**
 * 🎂 CHAPTER 13: VIRTUAL BIRTHDAY CAKE & BLOWABLE CANDLES
 * Interactive SVG candle flames with tap extinction and microphone breath detection.
 */

import { sound } from './audio.js';
import { particles } from './particles.js';

let blownCandles = 0;
const totalCandles = 5;
let celebrationTriggered = false;
let micStream = null;

export function initCake() {
  blownCandles = 0;
  celebrationTriggered = false;

  const candles = document.querySelectorAll('.cake-candle');
  const cakeCelebration = document.getElementById('cake-celebration-banner');
  const micBtn = document.getElementById('mic-blow-btn');

  candles.forEach((candle, idx) => {
    candle.classList.remove('extinguished');
    candle.onclick = () => blowOutCandle(candle, cakeCelebration);
    candle.ontouchstart = (e) => {
      e.preventDefault();
      blowOutCandle(candle, cakeCelebration);
    };
  });

  if (micBtn && !micBtn.dataset.bound) {
    micBtn.dataset.bound = "true";
    micBtn.onclick = () => setupMicBlow(candles, cakeCelebration, micBtn);
  }
}

function blowOutCandle(candleEl, celebrationEl) {
  if (candleEl.classList.contains('extinguished')) return;
  
  candleEl.classList.add('extinguished');
  blownCandles++;
  sound.playCandleBlow();

  if (particles) {
    const rect = candleEl.getBoundingClientRect();
    particles.triggerConfetti(rect.left + rect.width / 2, rect.top, 10);
  }

  if (blownCandles >= totalCandles && !celebrationTriggered) {
    triggerBirthdayCelebration(celebrationEl);
  }
}

function triggerBirthdayCelebration(celebrationEl) {
  celebrationTriggered = true;
  sound.playCheer();

  // Grand fireworks bursts
  if (particles) {
    particles.triggerConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4, 70);
    setTimeout(() => {
      particles.triggerConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4, 70);
    }, 300);
    setTimeout(() => {
      particles.triggerConfetti(window.innerWidth * 0.5, window.innerHeight * 0.3, 100);
    }, 600);
  }

  if (celebrationEl) {
    celebrationEl.classList.remove('hidden');
    celebrationEl.classList.add('animate-scale-up');
  }
}

async function setupMicBlow(candles, celebrationEl, micBtn) {
  try {
    micBtn.textContent = "🎙️ Listening... Blow on your phone/mic!";
    micBtn.classList.add('listening');

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStream = stream;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkBlow() {
      if (celebrationTriggered) {
        stream.getTracks().forEach(track => track.stop());
        micBtn.textContent = "✨ All Candles Blown!";
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      // Detect blow threshold
      if (average > 55) {
        candles.forEach(c => blowOutCandle(c, celebrationEl));
      }

      requestAnimationFrame(checkBlow);
    }

    checkBlow();
  } catch (err) {
    micBtn.textContent = "⚠️ Mic unavailable (Tap candles directly!)";
  }
}
