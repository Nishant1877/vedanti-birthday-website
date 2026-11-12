/**
 * 🎵 JOYFUL AUDIO ENGINE FOR VEDANTI'S WEBSITE
 * Features:
 * 1. Upbeat, celebratory, joyful melodic synthesizer (Web Audio API)
 * 2. Cheerful acoustic-style arpeggios, bouncy bass, and sparkling music-box chime flourishes
 * 3. Fallback to custom MP3 in assets/audio/background.mp3 if available
 * 4. Bubbly, delightful interactive sound effects
 */

class AudioController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.musicTimer = null;
    this.step = 0;
    this.bpm = 112; // Bouncy, joyful tempo
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.hasCustomAudio = false;

    // Check custom audio
    this.audioElement.src = 'assets/audio/background.mp3';
    this.audioElement.addEventListener('canplaythrough', () => {
      this.hasCustomAudio = true;
    });
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startMusic() {
    this.ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.hasCustomAudio) {
      this.audioElement.play().catch(() => {
        this.startJoyfulSynth();
      });
    } else {
      this.startJoyfulSynth();
    }
  }

  startJoyfulSynth() {
    if (!this.ctx) return;
    if (this.musicTimer) clearInterval(this.musicTimer);

    // Uplifting, cheerful Major chord progression: C - G - Am - F
    // With bouncy bass and joyful syncopated bell arpeggios
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.00, C6 = 1046.50;
    const C3 = 130.81, G3 = 196.00, A3 = 220.00, F3 = 174.61;

    // 16-step joyful pattern
    const pattern = [
      // Bar 1 (C Major - joyful bounce)
      { bass: C3, chord: [E4, G4, C5], lead: E5, duration: 0.25 },
      { lead: G5, duration: 0.2 },
      { bass: G3, chord: [E4, G4, C5], lead: C6, duration: 0.25 },
      { lead: G5, duration: 0.2 },
      // Bar 2 (G Major - sunny warmth)
      { bass: G3, chord: [D4, G4, B4], lead: D5, duration: 0.25 },
      { lead: G5, duration: 0.2 },
      { bass: D4, chord: [D4, G4, B4], lead: B4, duration: 0.25 },
      { lead: D5, duration: 0.2 },
      // Bar 3 (A Minor - sweet tenderness)
      { bass: A3, chord: [C4, E4, A4], lead: C5, duration: 0.25 },
      { lead: E5, duration: 0.2 },
      { bass: E4, chord: [C4, E4, A4], lead: A5, duration: 0.25 },
      { lead: E5, duration: 0.2 },
      // Bar 4 (F Major - happy resolution & uplift)
      { bass: F3, chord: [C4, F4, A4], lead: C5, duration: 0.25 },
      { lead: D5, duration: 0.2 },
      { bass: C4, chord: [C4, F4, A4], lead: E5, duration: 0.25 },
      { lead: G5, duration: 0.3 }
    ];

    const stepTime = (60 / this.bpm) * 0.5 * 1000; // eighth-note steps

    this.musicTimer = setInterval(() => {
      if (!this.isPlaying || this.isMuted) return;
      const beat = pattern[this.step % pattern.length];
      this.step++;

      // Play joyful bass note (plucky, warm acoustic feel)
      if (beat.bass) {
        this.playPluck(beat.bass, 0.45, 0.08, 'triangle');
      }

      // Play cheerful chord comping
      if (beat.chord) {
        beat.chord.forEach((note, idx) => {
          setTimeout(() => {
            if (!this.isPlaying || this.isMuted) return;
            this.playPluck(note, 0.35, 0.035, 'sine');
          }, idx * 25);
        });
      }

      // Play bright, sparkling melody bell on top
      if (beat.lead) {
        this.playBell(beat.lead, beat.duration * 2.2, 0.045);
      }
    }, stepTime);
  }

  playPluck(freq, duration = 0.3, gainVal = 0.06, type = 'sine') {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playBell(freq, duration = 0.8, gainVal = 0.05) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- Sound Effects ---

  playPop() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playBell(freq, 1.2, 0.07), idx * 80);
    });
  }

  playUnlock() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    this.playPluck(130.81, 1.2, 0.12, 'triangle');
    setTimeout(() => this.playChime(), 120);
  }

  playClick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    this.playPop();
  }

  playCardFlip() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPaperUnfold() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    this.playPluck(523.25, 0.3, 0.05, 'sine');
    setTimeout(() => this.playPluck(659.25, 0.35, 0.06, 'sine'), 70);
    setTimeout(() => this.playPluck(783.99, 0.5, 0.07, 'sine'), 150);
  }

  playCandleBlow() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playCheer() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const fanfare = [392, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    fanfare.forEach((f, idx) => {
      setTimeout(() => this.playBell(f, 1.8, 0.09), idx * 90);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.hasCustomAudio) {
      this.audioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }
}

export const sound = new AudioController();
