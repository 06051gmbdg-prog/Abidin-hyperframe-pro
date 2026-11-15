# Referensi video

Catatan gaya dari video contoh (Klickpin/Pinterest). **File video aslinya sengaja tidak disimpan di repo ini** karena repo bersifat publik dan videonya milik pembuat lain. Simpan file aslinya di galeri HP / Google Drive pribadi. Catatan ini hanya untuk meniru *teknik*, bukan menyalin isi.

## ref-1 · "Dreamy meal prep…" (12,6 dtk, 720x1280, 60 fps)
Teknik: storytelling nostalgia dengan **kolase bergaya papan gabus** (foto polaroid, benang merah, pin), **tipografi kinetik besar** (kata raksasa merah/hitam yang ditumpuk, kata ganti-ganti per ketukan), transisi cepat tiap ~1 dtk, subtitle kecil putih di bawah.
Tiru di HyperFrames: kartu kata besar (font tebal, 1 kata per ketukan suara), tekstur kertas/papan gabus dari gambar fal.ai, transisi geser/zoom cepat.

## ref-2 · "Fresh fall outfit…" (58 dtk, 1080x1920, 30 fps)
Teknik: **presenter bicara di meja studio** (mikrofon, latar gelap hangat), diselingi **sisipan putih bersih** dengan angka/frasa besar ("10K", "$15,000", "simple way") dan garis grid halus. Subtitle kata kunci di dada presenter, highlight merah pada angka.
Tiru di HyperFrames: presenter lip-sync (sudah ada), sisipan kartu putih/navy dengan angka besar tiap ±8 dtk untuk memecah monoton, caption kata kunci ber-highlight.

## ref-3 · "Steal these simple etsy shop ideas…" (17,7 dtk, 1080x1920, 30 fps)
Teknik: **animasi UI 3D** (widget kalender, peta, cuaca, ikon aplikasi muncul satu per satu dengan efek pegas/melayang) di atas latar biru bergrid, berakhir kartu "END".
Tiru di HyperFrames: komponen HTML/SVG ikon + kartu widget dengan GSAP `back.out`, ditumpuk bertahap; cocok untuk topik teknologi/aplikasi.

## ref-4 · Penjelasan berita bergaya editorial gelap (40 dtk, 1080x1920, 30 fps, ±23 potongan)
Dianalisis 15 Nov 2026 dari video kiriman pemilik channel. Videonya TIDAK disimpan di repo (milik pihak ketiga, memuat foto orang dan potongan berita asli); yang dicatat hanya tekniknya.
Teknik:
- **Ritme cepat:** rata-rata satu potongan tiap 1,7 dtk, selalu jatuh di batas kata. Presenter (mikrofon di meja studio) muncul 3x saja (detik 0, ±24, ±32), tiap kali 2–4 dtk, sisanya visual.
- **Palet editorial:** hampir hitam, foto dibuat hitam-putih dengan vinyet, satu aksen kuning (#F5C518-ish) untuk kata/angka kunci. Tipografi serif untuk judul dan subtitle.
- **Stiker kertas sobek kuning** dengan satu kata ("OUT", "NO CHARGES") menghantam foto: penanda titik balik cerita.
- **Garis waktu** di atas layar (OCT 29 → NOV 12) dengan penanda bergerak, plus tahun besar samar dan tanggal sebagai orientasi waktu.
- **Atribusi di tiap visual:** label sumber kecil ("REPORTED BY …, OCT 29") dan label nama/tanggal berkotak putih.
- **Kartu kliping** miring (kutipan atau memo) dengan stabilo kuning di frasa kunci, ditumpuk di atas foto; dokumen close-up untuk "bukti".
- **Angka besar** kuning ("−10%") dengan satu baris keterangan di atas dan bawah.
- **Subtitle satu kata per kali**, serif putih di bawah (bukan frasa utuh).
- Audio: rata-rata −17 dB, puncak −1,8 dB.
Tiru di HyperFrames (aset sendiri saja):
- Tipe adegan baru: `sticker` (blob kuning sobek + satu kata, efek slam), `timeline` (HUD tanggal, untuk topik berurutan waktu), `clip` (kartu kertas miring + stabilo), tag sumber, dan opsi subtitle satu kata.
- Foto: ilustrasi gpt-image buatan sendiri diberi filter hitam-putih + vinyet + aksen kuning. Jangan pakai foto tokoh, logo media, atau tangkapan berita asli.
- Kartu kliping boleh mengutip teks resmi yang bisa diverifikasi (mis. bunyi pasal UU) dengan label sumbernya, bukan meniru halaman media tertentu (aturan: jangan palsukan tampilan pihak lain).
- Tema ini gelap; aturan palet cerah (3 Nov) tetap default. Pakai tema editorial gelap hanya bila pemilik channel memintanya untuk topik berita/hukum.

## Ide pemakaian
- Selingan angka besar (ref-2) bisa ditambahkan ke tipe adegan baru `stat` di `build.mjs`.
- Kata kinetik (ref-1) bisa jadi tipe adegan `word`.
- Widget 3D (ref-3) bisa jadi tipe adegan `ui` untuk video tentang aplikasi/HP.

## Aturan tetap untuk video berikutnya (dari pemilik channel, 2 Nov 2026)
- Naskah TIDAK boleh memuat ajakan "Ikuti ABIDIN AI" / "mengikuti ABIDIN AI" (narasi, caption, kartu penutup). Penutup cukup ajakan relevan (cek link, periksa ke bengkel, dst.).
- Setiap bagian (selain presenter) wajib punya gambar referensi: foto/ilustrasi nyata-terlihat (fal image/edit, foto produk dari pengguna) sebagai latar atau kartu, bukan hanya teks/kartu polos, supaya video tampak menarik dan profesional.
- Gambar AI dicatat di publish/sources.txt sebagai buatan AI; jangan pakai gambar orang terkenal, logo/merek pihak lain, atau klaim yang tidak terverifikasi.

## Peningkatan kualitas untuk video berikutnya (3 Nov 2026)
- Latar kartu/info/stat/word/ui/product: warna CERAH (bukan biru navy terus). Pakai palet terang per video (mis. krem/putih hangat + aksen oranye/teal/kuning, teks gelap); presenter tetap studio terang. Ubah konstanta warna di build.mjs, jangan hardcode navy.
- Naskah: hook lebih tajam di 3 detik pertama, satu ide per bagian, fakta bersumber, penutup relevan (tanpa ajakan Ikuti ABIDIN AI).
- Visual AI: gambar dibuat dengan gpt-image-2 (lewat fal.ai, quality high) dengan arahan gaya konsisten per video; periksa tiap gambar sebelum lanjut.
- Image-to-video: lebih banyak adegan bergerak (bukan hanya 3), durasi pas dengan kalimat.
- Motion grafik: animasi diagram/infografik buatan kode di tiap video (seperti penampang rem tromol), bukan hanya kartu.
