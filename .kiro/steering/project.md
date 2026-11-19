---
inclusion: always
---

# Panduan proyek Sela

Sela merupakan To-Do List Life Dashboard untuk mini project Coding Camp. Gunakan Bahasa Indonesia pada antarmuka. Pertahankan aplikasi statis yang dapat dijalankan dari index.html maupun subdirektori GitHub Pages.

## Batasan dari brief

- Struktur menggunakan HTML. Seluruh gaya berada di css/style.css. Seluruh perilaku menggunakan vanilla JavaScript di js/app.js.
- Aplikasi berjalan tanpa backend, framework, pemasangan paket, atau proses build.
- Simpan data hanya di sisi pengguna dengan Local Storage API. Gunakan jalur relatif untuk aset.
- Pertahankan antarmuka minimal, responsif, cepat, dan mudah dibaca pada Chrome, Firefox, Edge, dan Safari modern.

## Kriteria penerimaan

1. Jam dan tanggal mengikuti perangkat. Sapaan berubah sesuai jam setempat.
2. Timer dimulai dari 25:00. Pengguna dapat memulai, menjeda, melanjutkan, dan mereset timer. Hitung selisih terhadap waktu selesai agar sesi tetap akurat saat tab berada di latar belakang.
3. Pengguna dapat membuat, mengubah, mencentang, dan menghapus tugas. Memuat ulang halaman mempertahankan tugas dan statusnya.
4. Tautan favorit dapat dibuka di tab baru, ditambah, dihapus, dan tersimpan setelah halaman dimuat ulang.
5. Tiga tantangan pilihan ialah mode terang/gelap, nama sapaan, dan pencegahan tugas duplikat. Validasi duplikat berlaku juga saat mengubah tugas, dengan mengabaikan kapitalisasi dan variasi spasi.
