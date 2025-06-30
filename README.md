# Dicoding Stories

**Dicoding Stories** adalah aplikasi **Progressive Web App (PWA)** yang memungkinkan pengguna berbagi cerita menarik, lengkap dengan foto dan lokasi. Proyek ini dibuat sebagai bagian dari kelas **"Belajar Fundamental Front-End Web Development"** di [Dicoding Indonesia](https://www.dicoding.com/).

🚀 **Live Demo:** https://dicodingstoriesapps.netlify.app/

---

## ✨ Fitur Utama

- 🔐 **Autentikasi Pengguna**  
  Pengguna dapat melakukan registrasi dan login untuk mengakses fitur berbagi cerita.

- 📝 **Berbagi Cerita dengan Gambar dan Lokasi**  
  Cerita dapat mencakup deskripsi, gambar, dan data lokasi pengguna.

- 📷 **Galeri Cerita**  
  Menampilkan kumpulan cerita dalam tampilan galeri grid responsif.

- ⚡ **Progressive Web App (PWA)**  
  Dapat diinstal di perangkat (Add to Home Screen), mendukung akses offline.

- 🌍 **Dukungan Lokasi**  
  Menyisipkan lokasi secara otomatis saat mengunggah cerita baru (opsional).

- 🔔 **Notifikasi Push**  
  Pengguna dapat mengaktifkan push notification untuk mendapatkan pembaruan terbaru.

- 📶 **Fungsionalitas Offline**  
  Cerita tetap dapat ditulis & dibaca meski tanpa koneksi. Data akan disinkronkan ketika online kembali.

- 📱 **Desain Responsif**  
  UI dioptimalkan untuk semua ukuran layar, dari mobile hingga desktop.

---

## 🧰 Tech Stack

| Teknologi                | Deskripsi                                      |
|--------------------------|-----------------------------------------------|
| **JavaScript (ES6+)**    | Bahasa pemrograman utama                      |
| **Webpack 5**            | Module bundler                                |
| **Babel**                | Transpiler JavaScript modern                  |
| **CSS**                  | Styling dan layout                            |
| **Model-View-Presenter** | Arsitektur aplikasi                           |
| **Workbox + Service Worker** | Penerapan PWA dan dukungan offline       |
| **IndexedDB, Local Storage** | Penyimpanan sisi klien                  |
| **Dicoding Story API**   | Backend layanan cerita                        |

---

## 💻 Instalasi & Menjalankan Secara Lokal

1. **Clone repositori ini**

   ```bash
   git clone https://github.com/pancanurull/DicodingStory.git
   ```

2. **Masuk ke direktori proyek**

   ```bash
   cd DicodingStory
   ```

3. **Instal dependensi**

   ```bash
   npm install
   ```

4. **Jalankan server pengembangan**

   ```bash
   npm run start-dev
   ```

5. **Akses aplikasi**

   Buka browser dan akses `http://localhost:8080`

---

## 📦 Skrip Tersedia

| Skrip               | Fungsi                                         |
|---------------------|------------------------------------------------|
| `npm run start-dev` | Menjalankan server development dengan HMR      |
| `npm run build`     | Membuat build produksi di folder `dist/`       |
| `npm run deploy`    | Membangun dan mendeploy ke GitHub Pages        |

---

## 🌍 Deployment

Aplikasi ini dideploy menggunakan **Netlify**  
🔗 https://dicoding-stories-page.netlify.app/

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **ISC License**.

---

## 🙌 Kontribusi

Pull request dan saran sangat diterima.  
Silakan fork repositori ini dan tambahkan fitur baru sesuai kebutuhanmu.

---

## 📬 Kontak

Dibuat oleh [@pancanurull](https://github.com/pancanurull)  
Terima kasih sudah berkunjung!

---

> _Dicoding Stories — Menyampaikan cerita Anda ke seluruh dunia, satu gambar dan kata demi kata._
