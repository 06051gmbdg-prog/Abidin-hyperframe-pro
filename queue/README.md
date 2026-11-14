# Antrian posting harian ke Buffer

Satu video "ready" dijadwalkan per hari oleh workflow `daily-buffer.yml` (10:00 WIB, untuk tayang besok):
YouTube Shorts 18:00, Instagram Reels 19:00, Facebook Reels 20:00 WIB.

## Cara pakai
1. Video selesai dirender (branch `renders-<slug>` berisi `video.mp4`).
2. Isi `videos/<slug>/publish/post.json` (lihat `post.example.json`).
3. Ubah status di `queue/queue.json` dari `draft` ke `ready`.
4. Workflow mengambil `ready` paling atas, membuat 3 post di Buffer, lalu menandainya `scheduled`.

## Setup satu kali
- Buat API token di Buffer (developers.buffer.com), simpan sebagai GitHub secret `BUFFER_TOKEN`.
- Cek koneksi kapan saja: Actions > daily-buffer > Run workflow, isi `mode` = `check`.

## Catatan
- Antrian kosong = workflow selesai tanpa posting. Tidak ada video yang dibuat otomatis (biaya fal dan persetujuan naskah tetap manual).
- Paket gratis Buffer maksimal 10 post terjadwal; error dari Buffer akan muncul di log workflow.
- Jangan tandai `ready` untuk video preview berisi suara tiruan (`FAKE_PREVIEW_DELETE`).
- Ide topik ada di `ideas/backlog.md`.

## Alur otomatis harian (auto-daily.yml)
Tiap hari 08:30 WIB: 2 video otomotif dibuat dan dijadwalkan ke Buffer hari itu juga, jam 12:00 dan 16:00 WIB
(YouTube, Instagram, Facebook sekaligus). Urutan: topik dan naskah (Anthropic API, plus pemeriksaan fakta oleh panggilan kedua)
-> footage Pixabay -> suara ElevenLabs -> presenter lip-sync (fal Kling) -> render -> Buffer.

Secrets yang dibutuhkan: `ANTHROPIC_API_KEY`, `PIXABAY_API_KEY`, `ELEVENLABS_API_KEY`, `FAL_KEY`, `BUFFER_TOKEN`.
Link afiliasi dan nama produk ada di `queue/products.json` (isi `name` supaya topik cocok dengan produk).
Uji tanpa biaya fal dan tanpa posting: Run workflow dengan mode `dry`.
Video yang gagal ditandai `failed` di `queue/queue.json` beserta alasannya (saldo fal habis adalah penyebab paling mungkin).
