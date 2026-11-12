/**
 * 🧭 SPA ROUTER & CHAPTER CONTROLLER
 * Manages smooth transitions between the 14 chapters,
 * updates navigation progress, triggers chapter-specific interactive scripts,
 * and supports keyboard/touch gestures.
 */

import { sound } from './audio.js';

class ChapterRouter {
  constructor() {
    this.currentChapter = 1;
    this.totalChapters = 14;
    this.unlocked = false;
    this.chapterHooks = {};
    
    this.chapterNames = [
      "The Mysterious Invitation",
      "The Cosmic Countdown",
      "Day One: The First Spark",
      "Chapters in Time",
      "Hall of Giggle & Grace",
      "Our Coordinates",
      "The Birthday Fortune Wheel",
      "Lovers' Trivia Challenge",
      "Jar of 100 Little Reasons",
      "Scratch to Reveal",
      "Written in the Stars",
      "Our Future Bucket List",
      "Virtual Cake & Candles",
      "The Royal Vault & Letter"
    ];
  }

  init() {
    this.progressBar = document.getElementById('progress-fill');
    this.chapterCounter = document.getElementById('chapter-counter');
    this.chapterTitlePill = document.getElementById('chapter-title-pill');
    this.prevBtn = document.getElementById('nav-prev');
    this.nextBtn = document.getElementById('nav-next');

    this.bindNavigation();
    this.updateUI();
  }

  registerHook(chapterNum, onEnter) {
    this.chapterHooks[chapterNum] = onEnter;
  }

  bindNavigation() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        sound.playClick();
        this.goTo(this.currentChapter - 1);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        sound.playClick();
        this.goTo(this.currentChapter + 1);
      });
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (this.currentChapter < this.totalChapters) {
          sound.playClick();
          this.goTo(this.currentChapter + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (this.currentChapter > 1) {
          sound.playClick();
          this.goTo(this.currentChapter - 1);
        }
      }
    });

    // Touch swipe gesture support for mobile phones (ignoring interactive canvases & inputs)
    let touchStartX = null;
    let touchStartY = null;
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('#scratch-canvas, #constellation-canvas, #wheel-canvas, .timeline-scroll-box, #quotes-feed, input, textarea, button, .scratch-card-wrapper')) {
        touchStartX = null;
        touchStartY = null;
        return;
      }
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (touchStartX === null || touchStartY === null) return;
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and significant (> 55px)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 55) {
        if (diffX < 0 && this.currentChapter < this.totalChapters) {
          // Prevent advancing past chapter 1 before unlocking
          if (this.currentChapter === 1 && !this.unlocked) return;
          // Swiped left -> next
          sound.playClick();
          this.goTo(this.currentChapter + 1);
        } else if (diffX > 0 && this.currentChapter > 1) {
          // Swiped right -> prev
          sound.playClick();
          this.goTo(this.currentChapter - 1);
        }
      }
      touchStartX = null;
      touchStartY = null;
    }, { passive: true });
  }

  unlockFirstChapter() {
    this.unlocked = true;
    if (this.nextBtn) {
      this.nextBtn.classList.remove('disabled');
      this.nextBtn.removeAttribute('disabled');
    }
  }

  goTo(target) {
    if (target < 1 || target > this.totalChapters) return;
    
    // Hide all chapters
    document.querySelectorAll('.chapter-view').forEach((el) => {
      el.classList.remove('active');
    });

    this.currentChapter = target;
    const nextEl = document.getElementById(`chapter-${this.currentChapter}`);
    if (nextEl) {
      nextEl.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.updateUI();

    // Fire chapter hook if registered
    if (this.chapterHooks[this.currentChapter]) {
      this.chapterHooks[this.currentChapter]();
    }
  }

  updateUI() {
    // Update progress bar
    if (this.progressBar) {
      const pct = ((this.currentChapter - 1) / (this.totalChapters - 1)) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    // Update Counter & Title
    if (this.chapterCounter) {
      this.chapterCounter.textContent = `${this.currentChapter} / ${this.totalChapters}`;
    }

    if (this.chapterTitlePill) {
      this.chapterTitlePill.textContent = this.chapterNames[this.currentChapter - 1] || "";
    }

    // Prev / Next button states
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentChapter === 1;
      this.prevBtn.style.opacity = this.currentChapter === 1 ? '0.3' : '1';
    }

    if (this.nextBtn) {
      const isEnd = this.currentChapter === this.totalChapters;
      this.nextBtn.disabled = isEnd;
      this.nextBtn.style.opacity = isEnd ? '0.3' : '1';
    }
  }
}

export const router = new ChapterRouter();
