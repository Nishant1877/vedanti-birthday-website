/**
 * 🎡 CHAPTER 7: THE BIRTHDAY FORTUNE WHEEL & LOVE VOUCHERS
 * Interactive luxury carnival wheel with physics spin, ticker audio,
 * claimable boyfriend coupon vouchers, and a hilarious "Rig the Wheel" trick!
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { particles } from './particles.js';

let isSpinning = false;
let currentRotation = 0;

export function initFortuneWheel() {
  const canvas = document.getElementById('wheel-canvas');
  const spinBtn = document.getElementById('spin-wheel-btn');
  const rigBtn = document.getElementById('rig-wheel-btn');
  const voucherCard = document.getElementById('voucher-result-card');
  const voucherTitle = document.getElementById('voucher-title');
  const voucherDesc = document.getElementById('voucher-desc');
  const claimBtn = document.getElementById('claim-voucher-btn');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.parentElement.offsetWidth || 340, 360);
  canvas.width = size;
  canvas.height = size;

  const vouchers = CONFIG.vouchers.items;
  const totalSlices = vouchers.length;
  const sliceAngle = (Math.PI * 2) / totalSlices;

  const colors = [
    '#F3D082', '#E0A899', '#D4AF37', '#B388FF',
    '#FF8A80', '#80D8FF', '#FFD180', '#CCFF90'
  ];

  function drawWheel(rotation) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 12;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    for (let i = 0; i < totalSlices; i++) {
      const startA = i * sliceAngle;
      const endA = startA + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startA, endA);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#23101E';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Text label - dynamically sized to screen width
      ctx.save();
      ctx.rotate(startA + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1A0E14';
      const labelFontSize = Math.max(10, Math.floor(canvas.width * 0.036));
      ctx.font = `bold ${labelFontSize}px "Plus Jakarta Sans", sans-serif`;
      const shortTitle = vouchers[i].title.split(' ')[0] + ' ' + (vouchers[i].title.split(' ')[1] || '');
      ctx.fillText(shortTitle, radius - 16, 4);
      ctx.restore();
    }

    // Outer luxury gold rim
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#F3D082';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Center jewel pin
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#23101E';
    ctx.fill();
    ctx.strokeStyle = '#F3D082';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#F3D082';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💖', 0, 0);

    ctx.restore();
  }

  drawWheel(currentRotation);

  function executeSpin(forcedIndex = null) {
    if (isSpinning) return;
    isSpinning = true;
    sound.playClick();
    if (spinBtn) spinBtn.disabled = true;
    if (voucherCard) voucherCard.classList.add('hidden');

    const winningIndex = forcedIndex !== null ? forcedIndex : Math.floor(Math.random() * totalSlices);
    const targetSliceCenter = (winningIndex * sliceAngle) + (sliceAngle / 2);
    const targetAngle = (Math.PI * 2 * 6) + ((Math.PI * 1.5) - targetSliceCenter);

    const startAngle = currentRotation % (Math.PI * 2);
    const totalDelta = targetAngle - startAngle;
    const duration = 3800;
    const startTime = performance.now();

    function animateSpin(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentRotation = startAngle + totalDelta * easeOut;

      drawWheel(currentRotation);

      if (Math.floor(currentRotation / sliceAngle) !== Math.floor((currentRotation - 0.2) / sliceAngle)) {
        sound.playPop();
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        isSpinning = false;
        if (spinBtn) spinBtn.disabled = false;
        showWinningVoucher(vouchers[winningIndex]);
      }
    }

    requestAnimationFrame(animateSpin);
  }

  if (spinBtn && !spinBtn.dataset.bound) {
    spinBtn.dataset.bound = "true";
    spinBtn.onclick = () => executeSpin(null);
  }

  if (rigBtn && !rigBtn.dataset.bound) {
    rigBtn.dataset.bound = "true";
    rigBtn.onclick = () => {
      sound.playUnlock();
      // Land directly on Queen For The Day (index 2)
      executeSpin(2);
    };
  }

  function showWinningVoucher(voucher) {
    sound.playCheer();
    if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);

    if (voucherCard && voucherTitle && voucherDesc) {
      voucherTitle.textContent = voucher.title;
      voucherDesc.textContent = voucher.desc;
      voucherCard.classList.remove('hidden');
      voucherCard.classList.add('animate-scale-up');
    }
  }

  if (claimBtn && !claimBtn.dataset.bound) {
    claimBtn.dataset.bound = "true";
    claimBtn.onclick = () => {
      sound.playChime();
      claimBtn.textContent = "✓ Stamped & Claimed in Heart!";
      claimBtn.style.background = "#2ecc71";
      claimBtn.style.color = "#fff";
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
    };
  }
}
