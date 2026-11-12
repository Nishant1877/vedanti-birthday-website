/**
 * 🌌 CHAPTER 11: COSMIC STARGAZER & SHOOTING STAR WISH CANNON
 * Connect Scorpio constellation, launch shooting stars, and generate love horoscopes!
 */

import { sound } from './audio.js';
import { particles } from './particles.js';

export function initConstellation() {
  const canvas = document.getElementById('constellation-canvas');
  const revealBox = document.getElementById('constellation-reveal');
  const wishCannonBtn = document.getElementById('wish-cannon-btn');
  const horoscopeBtn = document.getElementById('horoscope-btn');
  const horoscopeBanner = document.getElementById('horoscope-banner');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth || 340;
  canvas.height = canvas.parentElement.offsetHeight || 360;

  const starNodes = [
    { x: 0.20, y: 0.22, label: "Graffias", connected: false },
    { x: 0.26, y: 0.32, label: "Dschubba", connected: false },
    { x: 0.36, y: 0.42, label: "Antares ⭐", connected: false },
    { x: 0.44, y: 0.54, label: "Al Niyat", connected: false },
    { x: 0.52, y: 0.68, label: "Larawag", connected: false },
    { x: 0.66, y: 0.80, label: "Sargas", connected: false },
    { x: 0.78, y: 0.72, label: "Shaula", connected: false },
    { x: 0.84, y: 0.60, label: "Lesath", connected: false }
  ];

  let connectedCount = 0;
  let isComplete = false;
  let comets = [];

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shooting stars / comets
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.x += c.vx;
      c.y += c.vy;
      c.life -= 0.02;

      if (c.life <= 0) {
        comets.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - c.vx * 6, c.y - c.vy * 6);
      ctx.strokeStyle = `rgba(255, 215, 0, ${c.life})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8DC';
      ctx.fill();
    }

    // Draw connected constellation lines
    ctx.strokeStyle = '#F3D082';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    let hasLine = false;
    for (let i = 0; i < connectedCount; i++) {
      const s = starNodes[i];
      const px = s.x * canvas.width;
      const py = s.y * canvas.height;
      if (i === 0) ctx.moveTo(px, py);
      else {
        ctx.lineTo(px, py);
        hasLine = true;
      }
    }
    if (hasLine) ctx.stroke();

    // Draw stars
    starNodes.forEach((s, idx) => {
      const px = s.x * canvas.width;
      const py = s.y * canvas.height;
      const isNext = idx === connectedCount;

      ctx.beginPath();
      ctx.arc(px, py, idx === 2 ? 6.5 : (s.connected ? 5 : 4), 0, Math.PI * 2);
      ctx.fillStyle = s.connected ? '#FFF8DC' : (isNext ? '#F3D082' : 'rgba(255, 255, 255, 0.45)');
      ctx.fill();

      if (isNext) {
        ctx.beginPath();
        ctx.arc(px, py, 10 + Math.sin(Date.now() * 0.007) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(243, 208, 130, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    requestAnimationFrame(render);
  }

  function handleInteraction(e) {
    if (isComplete) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const targetIdx = connectedCount;
    if (targetIdx < starNodes.length) {
      const s = starNodes[targetIdx];
      const px = s.x * canvas.width;
      const py = s.y * canvas.height;
      if (Math.hypot(cx - px, cy - py) < 38) {
        s.connected = true;
        connectedCount++;
        sound.playChime();

        if (particles) {
          particles.triggerConfetti(rect.left + px, rect.top + py, 15);
        }

        if (connectedCount === starNodes.length) {
          completeConstellation();
        }
      }
    }
  }

  function completeConstellation() {
    isComplete = true;
    sound.playCheer();
    if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);

    setTimeout(() => {
      if (revealBox) {
        revealBox.classList.remove('hidden');
        revealBox.classList.add('animate-scale-up');
      }
    }, 500);
  }

  canvas.onclick = (e) => handleInteraction(e);
  canvas.ontouchstart = (e) => {
    e.preventDefault();
    handleInteraction(e);
  };

  // 1. Shooting Star Wish Cannon Button
  const funnyWishes = [
    "🌠 WISH GRANTED: 100 Free Hugs directly delivered from boyfriend!",
    "🌠 WISH GRANTED: All calories on your birthday cake are legally void!",
    "🌠 WISH GRANTED: All boyfriend hoodies are now officially your property!",
    "🌠 WISH GRANTED: Spontaneous date night with unlimited dessert!",
    "🌠 WISH GRANTED: You win every playful argument for the rest of 2026!"
  ];

  let wishIdx = 0;
  if (wishCannonBtn && !wishCannonBtn.dataset.bound) {
    wishCannonBtn.dataset.bound = "true";
    wishCannonBtn.onclick = () => {
      sound.playUnlock();
      // Launch 2 comets across canvas
      comets.push({
        x: 0,
        y: Math.random() * (canvas.height * 0.5),
        vx: 8 + Math.random() * 4,
        vy: 4 + Math.random() * 2,
        life: 1.0
      });

      const wishText = funnyWishes[wishIdx % funnyWishes.length];
      wishIdx++;
      wishCannonBtn.textContent = "🌠 Launching Wish...";
      setTimeout(() => {
        wishCannonBtn.textContent = "🌠 Launch Another Shooting Star Wish!";
        if (horoscopeBanner) {
          horoscopeBanner.classList.remove('hidden');
          horoscopeBanner.innerHTML = `<p style="color: var(--gold-light); font-weight: 600;">${wishText}</p>`;
        }
      }, 300);
    };
  }

  // 2. Scorpio Love Horoscope Generator
  const horoscopes = [
    "♏ Scorpio Horoscope for Vedanti: Today the cosmos align directly in your favor. 100% chance of unconditional love, 0% chance of boyfriend winning any food arguments, and eternal happiness predicted!",
    "♏ Scorpio Mystery Reading: The stars reveal that you were born with a rare aura of beauty and laughter. Warning: Spending time with you causes involuntary smiles and permanent devotion from your boyfriend!"
  ];

  let horoIdx = 0;
  if (horoscopeBtn && !horoscopeBtn.dataset.bound) {
    horoscopeBtn.dataset.bound = "true";
    horoscopeBtn.onclick = () => {
      sound.playChime();
      const hText = horoscopes[horoIdx % horoscopes.length];
      horoIdx++;
      if (horoscopeBanner) {
        horoscopeBanner.classList.remove('hidden');
        horoscopeBanner.innerHTML = `<p style="color: #FFF8DC; line-height: 1.5;">${hText}</p>`;
      }
    };
  }

  render();
}
