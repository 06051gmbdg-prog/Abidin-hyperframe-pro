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
