export type Scene={id:string;label:string;narration:string;overlay:string;asset?:string;kind:'presenter'|'broll'|'graphic'|'product'|'cta'};
export const BRAND={navy:'#102B46',blue:'#173D60',orange:'#F5A623',white:'#FFFFFF',yellow:'#FFD84D'};
export const EPISODE={
 title:'Jangan Asal Bagikan Data Pribadi',
 scenes:[
 {id:'hook',label:'HOOK',kind:'presenter',narration:'Pernah diminta mengirim foto KTP oleh teman? Jangan buru-buru memberikannya.',overlay:'JANGAN ASAL BAGIKAN DATA PRIBADI!',asset:'assets/presenter-hook.mp4'},
 {id:'request',label:'PERMINTAAN',kind:'broll',narration:'Kadang permintaannya terdengar sederhana. Katanya hanya untuk mendaftar sesuatu.',overlay:'CUMA BUAT DAFTAR KOK.',asset:'assets/friend-request.mp4'},
 {id:'data',label:'DATA PRIBADI',kind:'broll',narration:'Foto identitas memuat informasi yang perlu dijaga dan dibagikan hanya saat benar-benar diperlukan.',overlay:'DATA PRIBADI ITU BERHARGA.',asset:'assets/identity-phone.mp4'},
 {id:'risk',label:'RISIKO',kind:'broll',narration:'Jika data digunakan tanpa izin, kamu bisa menghadapi proses klarifikasi dan pelaporan.',overlay:'WASPADA PENYALAHGUNAAN DATA.',asset:'assets/phone-alert.mp4'},
 {id:'explain',label:'PENJELASAN',kind:'graphic',narration:'Kenali siapa yang meminta, untuk tujuan apa, dan bagaimana data akan disimpan.',overlay:'KENALI TUJUAN • VERIFIKASI • BATASI',asset:'assets/data-graphic.mp4'},
 {id:'steps',label:'LANGKAH',kind:'broll',narration:'Jangan pernah membagikan kode OTP. Hindari mengirim dokumen ke pihak yang tidak jelas.',overlay:'JANGAN BAGIKAN KODE OTP.',asset:'assets/security-broll.mp4'},
 {id:'watermark',label:'PERLINDUNGAN',kind:'graphic',narration:'Jika salinan KTP memang dibutuhkan, tanyakan apakah boleh diberi watermark sesuai tujuan dan penerima.',overlay:'PERTIMBANGKAN WATERMARK.',asset:'assets/watermark-demo.mp4'},
 {id:'product',label:'PRODUK TERKAIT',kind:'product',narration:'Organizer dokumen dapat membantu menyimpan dokumen fisik dengan lebih rapi. Pilih sesuai kebutuhan.',overlay:'PRODUK PENDUKUNG',asset:'assets/product-demo.mp4'},
 {id:'presenter-close',label:'KESIMPULAN',kind:'presenter',narration:'Membantu orang lain itu baik. Tetapi menjaga data pribadi juga tanggung jawab kita.',overlay:'BANTU ORANG LAIN, TETAP JAGA DATA.',asset:'assets/presenter-close.mp4'},
 {id:'cta',label:'CTA',kind:'cta',narration:'Bagikan video ini kepada keluarga dan temanmu. Lihat tautan produk jika memang kamu membutuhkannya.',overlay:'BAGIKAN • KOMENTAR • CEK LINK',asset:'assets/cta-bg.mp4'}
 ] as Scene[],
 affiliate:{enabled:true,productName:'Organizer dokumen',productPrice:'Isi harga setelah cek listing',productUrl:'TEMPEL_LINK_AFFILIATE_SHOPEE',disclosure:'Tautan affiliate: saya dapat menerima komisi jika kamu membeli melalui tautan ini.',cta:'Lihat produk melalui link di video/deskripsi.'}
};