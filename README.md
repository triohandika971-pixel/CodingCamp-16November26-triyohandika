# Sela · To-Do List Life Dashboard

Dashboard harian berbahasa Indonesia untuk mini project Coding Camp. Buka `index.html` di browser modern setelah mengekstrak seluruh folder. Semua aset tersedia secara lokal. Tidak perlu memasang paket atau menjalankan server.

## Fitur

| Fitur | Cara mencoba |
| --- | --- |
| Jam, tanggal, dan sapaan | Lihat bagian atas dashboard. Waktu mengikuti zona waktu perangkat. |
| Timer fokus | Tekan **Mulai** untuk memulai 25 menit, **Jeda** untuk berhenti sementara, lalu **Mulai** untuk melanjutkan. Tombol panah melingkar mengembalikannya ke 25:00. |
| Daftar tugas | Ketik tugas dan tekan **Enter**. Centang untuk menyelesaikan, gunakan ikon pensil untuk mengubah, atau ikon tempat sampah untuk menghapus. |
| Tautan cepat | Tekan **Tambah tautan**, masukkan nama dan alamat web. Klik nama untuk membuka di tab baru atau tanda × untuk menghapusnya. |

Tiga tantangan yang dipilih:
- **Mode terang/gelap.** Klik ikon bulan atau matahari di kanan atas.
- **Nama sapaan.** Klik **Nama sapaan**, masukkan nama panggilan, lalu simpan. Kosongkan nama untuk kembali ke sapaan umum.
- **Cegah tugas duplikat.** Misalnya, setelah menyimpan “Belajar HTML”, aplikasi menolak “belajar   html” saat menambah atau mengubah tugas.

## Struktur

- `index.html` berisi struktur dashboard.
- `css/style.css` berisi satu-satunya stylesheet.
- `js/app.js` berisi satu-satunya file JavaScript.
- `assets/perbukitan.webp` adalah ilustrasi lokal untuk banner sapaan.
- `.kiro/steering/project.md` memuat batasan proyek dan kriteria penerimaan untuk Kiro.

Local Storage menyimpan tugas, tautan, nama, tema, dan sesi timer pada browser yang digunakan. Jika penyimpanan diblokir, halaman menampilkan pemberitahuan dan tetap berjalan selama sesi. Data lokal saat membuka file dapat berbeda dari data pada alamat GitHub Pages. Untuk presentasi, uji penyimpanan langsung pada URL yang akan dikumpulkan.

## Publikasi dan pengumpulan

1. Masuk ke Kiro dengan AWS Builder ID milik peserta, buka folder proyek, dan tinjau fitur serta batasan bersama Kiro. Simpan identitas akun untuk formulir.
2. Di GitHub Desktop pilih **File → New repository**. Gunakan nama dengan pola **CodingCamp-[tanggal pertama batch]-[nama peserta]**. Contoh dari brief, dirapikan tanpa spasi, adalah `CodingCamp-16November26-yamaroni`. Ganti tanggal dan nama sesuai data pendaftaran.
3. Salin **isi** folder hasil ekstrak ke root repositori yang baru dibuat, termasuk folder tersembunyi `.kiro`. Pastikan `index.html` berada sejajar dengan `css/`, `js/`, dan `.kiro/`. Di GitHub Desktop, periksa daftar perubahan, tulis ringkasan commit, pilih **Commit to main**, lalu **Publish repository**. Pilih repositori publik jika memakai GitHub Free.
4. Buka repositori di GitHub. Masuk **Settings → Pages → Build and deployment → Deploy from a branch**, pilih **main** dan **/(root)**, lalu **Save**. Sesudah deployment selesai, buka **Visit site**. [Dokumentasi GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
5. Periksa URL publik dari HP atau jendela privat. Coba setiap fitur, muat ulang untuk memeriksa penyimpanan, dan pastikan folder `.kiro` terlihat di repositori.
6. Masukkan **AWS Builder ID**, **URL repositori GitHub**, dan **URL website GitHub Pages** pada [Paperform pengumpulan dari brief](https://rebrand.ly/FCSWE-miniproject). Tenggat yang tertulis di brief adalah Sabtu pukul 11.59 WIB.
