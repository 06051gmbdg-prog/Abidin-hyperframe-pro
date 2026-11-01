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

## Ide pemakaian
- Selingan angka besar (ref-2) bisa ditambahkan ke tipe adegan baru `stat` di `build.mjs`.
- Kata kinetik (ref-1) bisa jadi tipe adegan `word`.
- Widget 3D (ref-3) bisa jadi tipe adegan `ui` untuk video tentang aplikasi/HP.
