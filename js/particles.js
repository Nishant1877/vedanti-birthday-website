/**
 * ⚡ HIGH-PERFORMANCE PARTICLES & STARDUST ENGINE (ZERO-LAG)
 * Optimized for 60-120 FPS with hardware-friendly rendering:
 * - Removed heavy ctx.shadowBlur (major lag source)
 * - Throttled mousemove particle spawning
 * - Efficient particle pooling and cleanup
 */

class FastParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.width = (this.canvas.width = window.innerWidth);
    this.height = (this.canvas.height = window.innerHeight);
    this.dust = [];
    this.sparks = [];
    this.confetti = [];
    this.hearts = [];
    this.maxDust = 25; // Lightweight ambient count
    this.lastSparkTime = 0;

    this.initDust();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initDust() {
    this.dust = [];
    for (let i = 0; i < this.maxDust; i++) {
      this.dust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.1,
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI,
        color: Math.random() > 0.4 ? 'rgba(243, 208, 130,' : 'rgba(255, 248, 220,'
      });
    }
  }

  bindEvents() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.initDust();
      }, 150);
    }, { passive: true });

    // Throttled mousemove (max once every 50ms)
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - this.lastSparkTime > 50) {
        this.lastSparkTime = now;
        if (this.sparks.length < 15) {
          this.sparks.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 1.5 - 0.5,
            size: Math.random() * 2.5 + 1.5,
            life: 1.0,
            decay: 0.035,
            color: Math.random() > 0.5 ? '#F3D082' : '#E0A899'
          });
        }
      }
    }, { passive: true });

    // Global Click / Tap: Spawns floating Love Emojis (capped to avoid lag)
    window.addEventListener('click', (e) => {
      // Don't spawn if clicking input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      this.spawnTapHearts(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        this.spawnTapHearts(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  spawnTapHearts(x, y) {
    const emojis = ['💖', '✨', '💕', '🌸', '🥰'];
    for (let i = 0; i < 2; i++) {
      if (this.hearts.length < 18) {
        this.hearts.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2.5 - 1.8,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: Math.random() * 6 + 18,
          life: 1.0,
          decay: 0.025
        });
      }
    }
  }

  triggerConfetti(x = this.width / 2, y = this.height / 2, count = 35) {
    const colors = ['#F3D082', '#E0A899', '#FFD700', '#FF69B4', '#FFF8DC'];
    const safeCount = Math.min(count, 45); // Hard cap for smoothness
    for (let i = 0; i < safeCount; i++) {
      if (this.confetti.length > 70) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2.5;
      this.confetti.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        w: Math.random() * 6 + 4,
        h: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1.0,
        decay: 0.016
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Ambient Dust (No shadowBlur for 120 FPS performance!)
    for (let i = 0; i < this.dust.length; i++) {
      const p = this.dust[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.y < 0) p.y = this.height;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      const alpha = Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.15);
      this.ctx.fillStyle = p.color + alpha + ')';
      this.ctx.fillRect(p.x, p.y, p.r, p.r); // Faster than arc
    }

    // 2. Draw Touch/Mouse Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.life;
      this.ctx.fillRect(s.x, s.y, s.size, s.size);
    }

    // 3. Draw Floating Love Emojis
    if (this.hearts.length > 0) {
      this.ctx.textAlign = 'center';
      for (let i = this.hearts.length - 1; i >= 0; i--) {
        const h = this.hearts[i];
        h.x += h.vx;
        h.y += h.vy;
        h.life -= h.decay;

        if (h.life <= 0) {
          this.hearts.splice(i, 1);
          continue;
        }

        this.ctx.font = `${Math.floor(h.size)}px sans-serif`;
        this.ctx.globalAlpha = h.life;
        this.ctx.fillText(h.emoji, h.x, h.y);
      }
    }

    // 4. Draw Confetti
    if (this.confetti.length > 0) {
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.22; // subtle gravity
        c.rotation += c.rotSpeed;
        c.life -= c.decay;

        if (c.life <= 0 || c.y > this.height) {
          this.confetti.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.fillStyle = c.color;
        this.ctx.globalAlpha = c.life;
        this.ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        this.ctx.restore();
      }
    }

    this.ctx.globalAlpha = 1.0;
    requestAnimationFrame(this.animate);
  }
}

export let particles = null;
export function initParticles(canvasId) {
  particles = new FastParticleEngine(canvasId);
  return particles;
}
