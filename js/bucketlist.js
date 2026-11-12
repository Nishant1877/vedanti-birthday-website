/**
 * 🗺️ CHAPTER 12: OUR FUTURE BUCKET LIST
 * Interactive checklist with localStorage persistence and custom wish additions.
 */

import { CONFIG } from './config.js';
import { sound } from './audio.js';
import { particles } from './particles.js';

const STORAGE_KEY = 'vedanti_future_bucket_list';

export function initBucketList() {
  const container = document.getElementById('bucket-list-items');
  const inputEl = document.getElementById('new-bucket-input');
  const addBtn = document.getElementById('add-bucket-btn');

  if (!container) return;

  function getItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return CONFIG.bucketList;
  }

  function saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function render() {
    const items = getItems();
    container.innerHTML = items.map((item, idx) => `
      <div class="bucket-item ${item.done ? 'checked' : ''}" data-index="${idx}">
        <span class="bucket-checkbox">${item.done ? '✓' : ''}</span>
        <span class="bucket-text">${item.title}</span>
      </div>
    `).join('');

    container.querySelectorAll('.bucket-item').forEach(el => {
      el.onclick = () => {
        sound.playClick();
        const idx = parseInt(el.getAttribute('data-index'));
        const currentItems = getItems();
        currentItems[idx].done = !currentItems[idx].done;
        saveItems(currentItems);
        render();
        if (currentItems[idx].done && particles) {
          const rect = el.getBoundingClientRect();
          particles.triggerConfetti(rect.left + 50, rect.top + 20, 15);
        }
      };
    });
  }

  render();

  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "true";
    addBtn.onclick = () => {
      const val = inputEl?.value.trim();
      if (!val) return;
      sound.playChime();
      const items = getItems();
      items.push({ title: val, done: false });
      saveItems(items);
      inputEl.value = '';
      render();
      if (particles) particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 25);
    };
  }
}
