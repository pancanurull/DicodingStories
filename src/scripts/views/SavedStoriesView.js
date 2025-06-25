// SavedStoriesView.js
// Halaman untuk menampilkan data story yang tersimpan di IndexedDB

import { getAllSavedStories } from '../utils/indexedDB.js';
import { StoryCard } from './components/StoryCard.js';
import { StoryDB } from '../db.js';

export default class SavedStoriesView {
  constructor() {
    this.storyDB = new StoryDB();
  }

  async render() {
    const container = document.getElementById('saved-stories-page');
    if (!container) return;
    container.innerHTML = '<h2>Story Tersimpan (Offline)</h2><div id="saved-stories-list">Memuat...</div>';
    const stories = await getAllSavedStories();
    const listDiv = document.getElementById('saved-stories-list');
    if (!stories || stories.length === 0) {
      listDiv.innerHTML = '<p>Tidak ada story tersimpan di perangkat.</p>';
      return;
    }
    listDiv.innerHTML = '';
    for (const story of stories) {
      // Adaptasi agar StoryCard bisa menampilkan gambar dari story.photo jika photoUrl tidak ada
      if (!story.photoUrl && story.photo) {
        if (typeof story.photo === 'string') {
          story.photoUrl = story.photo;
        } else if (story.photo instanceof Blob) {
          story.photoUrl = URL.createObjectURL(story.photo);
        }
      }
      // Tampilkan card, favorite di halaman ini selalu true (karena sudah tersimpan)
      const card = new StoryCard(story, true, null).render();
      card.classList.add('saved-story-card'); // Tambahkan class khusus
      // Tambahkan tombol Unsave/Unfavorite
      const unsaveBtn = document.createElement('button');
      unsaveBtn.className = 'unsave-btn';
      unsaveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Hapus dari Tersimpan';
      unsaveBtn.onclick = async () => {
        await this.storyDB.deleteFavorite(story.id);
        card.remove();
        // Jika sudah tidak ada card, tampilkan pesan kosong
        if (!listDiv.querySelector('.saved-story-card')) {
          listDiv.innerHTML = '<p>Tidak ada story tersimpan di perangkat.</p>';
        }
      };
      card.appendChild(unsaveBtn);
      // Sembunyikan tombol favorite di halaman tersimpan
      const favBtn = card.querySelector('.favorite-btn');
      if (favBtn) favBtn.style.display = 'none';
      listDiv.appendChild(card);
    }
  }
}
