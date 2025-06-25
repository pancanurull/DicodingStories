// indexedDB.js

// Fungsi untuk mengambil semua story favorite dari IndexedDB
export async function getAllSavedStories() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('DicodingStoriesDB', 3); // versi dan nama sama dengan StoryDB
    request.onerror = () => reject('Gagal membuka IndexedDB');
    request.onsuccess = (event) => {
      const db = event.target.result;
      // Ambil dari object store 'favorites'!
      const tx = db.transaction('favorites', 'readonly');
      const store = tx.objectStore('favorites');
      const getAllReq = store.getAll();
      getAllReq.onsuccess = () => resolve(getAllReq.result);
      getAllReq.onerror = () => reject('Gagal mengambil data');
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }
    };
  });
}