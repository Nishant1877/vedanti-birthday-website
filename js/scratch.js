/**
 * ✨ CHAPTER 10: 3-ZONE LOVE LOTTERY & SCRATCH CARD
 * Interactive lottery ticket with multiple tools (Coin, Wand, Paw) and instant reveal.
 */

import { sound } from './audio.js';
import { particles } from './particles.js';

let isScratchedCompleted = false;

export function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const clearBtn = document.getElementById('scratch-magic-clear-btn');
  const toolBtns = document.querySelectorAll('.scratch-tool-btn');
  const jackpotBanner = document.getElementById('scratch-jackpot-banner');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  canvas.width = container.offsetWidth || 310;
  canvas.height = container.offsetHeight || 420;

  isScratchedCompleted = false;
  let brushSize = 26;
  drawGoldLotteryFoil(ctx, canvas.width, canvas.height);

  let isDrawing = false;
  let scratchedPixels = 0;

  // Tool Selection
  toolBtns.forEach(btn => {
    btn.onclick = (e) => {
      sound.playClick();
      toolBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const tool = e.currentTarget.getAttribute('data-tool');
      if (tool === 'wand') brushSize = 34;
      else if (tool === 'paw') brushSize = 38;
      else brushSize = 26;
    };
  });

  function scratch(x, y) {
    if (isScratchedCompleted) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    // Spawn tiny golden flakes
    if (particles && Math.random() > 0.6) {
      const rect = canvas.getBoundingClientRect();
      particles.triggerConfetti(rect.left + x, rect.top + y, 2);
    }

    scratchedPixels++;
    if (scratchedPixels % 12 === 0) {
      checkCompletion();
    }
  }

  function checkCompletion() {
    if (isScratchedCompleted) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentCount = 0;
      const totalPixels = imgData.data.length / 4;

      // Sample every 32nd pixel for ultra-fast check
      for (let i = 3; i < imgData.data.length; i += 128) {
        if (imgData.data[i] === 0) {
          transparentCount += 32;
        }
      }

      if (transparentCount / totalPixels > 0.42) {
        revealJackpot();
      }
    } catch (e) {}
  }

  function revealJackpot() {
    if (isScratchedCompleted) return;
    isScratchedCompleted = true;
    canvas.style.transition = 'opacity 0.6s ease-out';
    canvas.style.opacity = '0';
    setTimeout(() => { canvas.style.display = 'none'; }, 600);

    sound.playCheer();
    if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);

    if (jackpotBanner) {
      jackpotBanner.classList.remove('hidden');
      jackpotBanner.classList.add('animate-scale-up');
    }
  }

  // Magic Instant Clear Button
  if (clearBtn && !clearBtn.dataset.bound) {
    clearBtn.dataset.bound = "true";
    clearBtn.onclick = () => {
      sound.playChime();
      revealJackpot();
    };
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  canvas.onmousedown = (e) => {
    isDrawing = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  window.onmousemove = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  window.onmouseup = () => { isDrawing = false; };

  canvas.ontouchstart = (e) => {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  canvas.ontouchmove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  canvas.ontouchend = () => { isDrawing = false; };
}

function drawGoldLotteryFoil(ctx, w, h) {
  ctx.globalCompositeOperation = 'source-over';
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#E6C280');
  grad.addColorStop(0.3, '#F3D082');
  grad.addColorStop(0.6, '#FFF8DC');
  grad.addColorStop(0.85, '#D4AF37');
  grad.addColorStop(1, '#AA771C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative border
  ctx.strokeStyle = '#23101E';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, w - 16, h - 16);

  // Label text
  ctx.fillStyle = '#23101E';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎰 THE LOVE LOTTERY 🎰', w / 2, 45);

  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#4A2800';
  ctx.fillText('Scratch all 3 zones to win your jackpot!', w / 2, 70);

  // 3 Distinct Lottery Scratch Windows - proportionally positioned to fit any mobile height
  ctx.fillStyle = '#C89D42';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;

  const titleEnd = Math.min(75, h * 0.19);
  const remainingH = h - titleEnd - 16;
  const boxH1 = Math.max(34, Math.floor(remainingH * 0.16));
  const boxH2 = Math.max(34, Math.floor(remainingH * 0.16));
  const gap = Math.max(8, Math.floor(remainingH * 0.04));
  const boxH3 = Math.max(70, remainingH - boxH1 - boxH2 - (gap * 3));

  const y1 = titleEnd + gap;
  const y2 = y1 + boxH1 + gap;
  const y3 = y2 + boxH2 + gap;

  // Box 1
  ctx.strokeRect(16, y1, w - 32, boxH1);
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Zone 1: Birthday Lucky Number ⭐', w / 2, y1 + (boxH1 / 2) + 4);

  // Box 2
  ctx.strokeRect(16, y2, w - 32, boxH2);
  ctx.fillText('Zone 2: Soulmate Match % 💖', w / 2, y2 + (boxH2 / 2) + 4);

  // Box 3 (Grand Prize)
  ctx.strokeRect(16, y3, w - 32, boxH3);
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('👑 GRAND ROMANTIC JACKPOT 👑', w / 2, y3 + (boxH3 * 0.42));
  ctx.font = '10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('(Scratch to reveal the prize)', w / 2, y3 + (boxH3 * 0.68));
}
