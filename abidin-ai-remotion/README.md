# ABIDIN AI Remotion Studio
Template Remotion 9:16 untuk cinematic documentary, presenter, B-roll, motion graphics dan integrasi Shopee Affiliate.

## Jalankan
```bash
npm install
npx remotion skills add
npm run dev
```
Buka URL Studio yang muncul. Render setelah aset lengkap:
```bash
npm run render
```

## Peran Remotion
Remotion menyusun klip/gambar/audio yang sudah dibuat menjadi video. Remotion sendiri tidak membuat wajah AI, voice cloning, atau video generatif. Buat presenter/lip-sync di HeyGen/Kling/dll, voice-over di ElevenLabs/dll, lalu simpan aset ke `public/assets`.

## Aset yang diperlukan
Taruh file berikut di `public/assets/`:
`presenter-hook.mp4`, `friend-request.mp4`, `identity-phone.mp4`, `phone-alert.mp4`, `data-graphic.mp4`, `security-broll.mp4`, `watermark-demo.mp4`, `product-demo.mp4`, `presenter-close.mp4`, `cta-bg.mp4`.
Aset yang belum ada perlu digenerate/diunggah. Foto wajah pribadi jangan dimasukkan ke repo publik.

## Ubah episode dan produk
Edit `src/episode.ts`: ubah judul, scenes, narasi, overlay, nama produk, harga setelah dicek, link affiliate, CTA dan disclosure. Jangan mengarang harga, rating, komisi, ulasan atau klaim produk. Hanya masukkan produk yang relevan.

Untuk Android, gunakan GitHub Codespaces/cloud Linux lewat browser; render panjang di HP bisa berat.
