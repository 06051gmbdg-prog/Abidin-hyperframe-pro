#!/usr/bin/env node
// Alur otomatis: topik + naskah (Anthropic API) -> footage Pixabay -> folder video siap render.
//   node auto-video.mjs create --n 1 [--fake plan.json] [--no-pixabay]   # tulis videos/<slug>/, cetak SLUG=<slug>
//   node auto-video.mjs prep videos/<slug>                                  # sesuaikan klip Pixabay ke durasi scene (setelah build pertama)
// Env: ANTHROPIC_API_KEY (ANTHROPIC_MODEL opsional), PIXABAY_API_KEY
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => rest.includes(`--${n}`);
const opt = (n) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : undefined; };
const readJson = (p, d) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : d);
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// ---------- prep: klip stok -> 1080x1920, 30 fps, tanpa audio, panjang = durasi scene ----------
if (cmd === "prep") {
  const dir = rest[0];
  const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  for (const m of html.matchAll(/<video[^>]*src="assets\/clips\/([^"]+)"[^>]*data-duration="([\d.]+)"/g)) {
    const [, name, dur] = m, f = path.join(dir, "assets/clips", name), tmp = f + ".tmp.mp4";
    execFileSync("ffmpeg", ["-v", "error", "-y", "-stream_loop", "-1", "-i", f, "-t", String(+dur + 0.3), "-an", "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30", "-c:v", "libx264", "-crf", "22", "-preset", "veryfast", "-pix_fmt", "yuv420p", tmp]);
    fs.renameSync(tmp, f);
    console.log(`klip ${name} -> ${dur}s`);
  }
  process.exit(0);
}
if (cmd !== "create") { console.error("usage: auto-video.mjs create|prep"); process.exit(1); }

// ---------- create ----------
const CFG = readJson(path.join(ROOT, "queue/buffer.config.json"));
const PRODUCT = readJson(path.join(ROOT, "queue/products.json"));
const HIST = readJson(path.join(ROOT, "queue/history.json"), []);
const BACKLOG = fs.existsSync(path.join(ROOT, "ideas/backlog.md")) ? fs.readFileSync(path.join(ROOT, "ideas/backlog.md"), "utf8") : "";
const wibDate = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10).replace(/-/g, "");
const N = opt("n") || "1";

async function claude(prompt, maxTokens = 3000) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY belum diisi (GitHub secret)");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Anthropic API ${r.status}: ${JSON.stringify(j).slice(0, 400)}`);
  return j.content.map((c) => c.text || "").join("");
}
const parseJson = (t) => {
  const m = t.replace(/^```(?:json)?/m, "").replace(/```\s*$/m, "").trim().match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`respons bukan JSON: ${JSON.stringify(t.slice(0, 300))}`);
  try { return JSON.parse(m[0]); } catch (e) { throw new Error(`JSON rusak (${e.message}): ${JSON.stringify(t.slice(0, 200))}`); }
};

const productLine = PRODUCT.name ? `Produk afiliasi yang akan ditempel: ${PRODUCT.name}. Topik HARUS relevan dengan produk ini.` : "Produk afiliasi belum diketahui namanya, jadi pilih topik otomotif umum dan JANGAN menyebut atau menjelaskan produk tertentu.";
const used = HIST.map((h) => `- ${h.topic}`).join("\n") || "(belum ada)";

function prompt(feedback) {
  return `Kamu penulis naskah video edukasi pendek vertikal (45-60 detik) untuk channel "ABIDIN AI" tentang otomotif: perawatan dan keselamatan motor/mobil untuk pengendara di Indonesia.
${productLine}

Topik yang SUDAH dipakai (jangan ulangi atau mirip):
${used}

Ide cadangan (boleh dipilih atau buat yang setara):
${BACKLOG}

Pilih SATU topik baru yang evergreen dan berguna. Balas HANYA JSON valid dengan skema:
{"topic":"...","slug":"kebab-ascii-maks-30","title":"judul YouTube Shorts maks 80 karakter tanpa hashtag",
"sections":[{"question":"kalimat pembuka presenter 3-8 kata, diakhiri tanda tanya","body":"1-2 kalimat penjelasan, total 18-30 kata","head":"JUDUL LAYAR 2-4 KATA HURUF BESAR","sub":"opsional maks 6 kata atau kosong","query":"kata kunci pencarian video stok Pixabay, bahasa Inggris, 2-3 kata, visual umum (mis. motorcycle road, car engine, mechanic hands, rainy road)"}],
"closing":"satu kalimat penutup, pendek",
"caption":"2-4 baris caption: hook, poin utama, lalu satu pertanyaan ke penonton untuk komentar. Tanpa harga, tanpa link, tanpa hashtag.",
"hashtags":["lima","tagar","tanpa","tanda","pagar"]}
"sections" harus tepat 4 item.

ATURAN KETAT:
- Bahasa Indonesia santai-sopan, sapa "Anda". Ditulis untuk didengar.
- Hanya fakta umum yang mapan. Hindari angka spesifik (km, bar, psi, liter, tahun) kecuali sangat baku, dan jika ada tambahkan "sesuaikan dengan buku manual kendaraan Anda". Jangan mengarang statistik, merek, atau janji hasil.
- Topik keselamatan (rem, ban, kemudi, kelistrikan) WAJIB ditutup dengan anjuran "periksakan ke bengkel".
- Dilarang menyebut harga, diskon, ajakan mengikuti akun ("ikuti kami", "follow", "subscribe").
- Jangan klaim kemampuan produk. Jangan sebut merek atau toko.
- Query video stok: visual netral, tanpa kecelakaan, luka, atau darah.
${feedback ? `\nPERBAIKAN dari percobaan sebelumnya: ${feedback}\n` : ""}`;
}

async function review(plan, text) {
  const t = await claude(`Kamu pemeriksa fakta otomotif. Periksa naskah video ini. Balas HANYA JSON ringkas {"ok":true|false,"masalah":["maks 2 butir, masing-masing 1 kalimat pendek"]}. ok=false jika ada klaim faktual yang mungkin salah, angka spesifik tanpa dasar kuat, saran yang bisa membahayakan, atau klaim berlebihan.\n\nTopik: ${plan.topic}\nNaskah: ${text}`, 1500);
  try { return parseJson(t); } catch { return /"ok"\s*:\s*true/.test(t) ? { ok: true } : { ok: false, masalah: [t.slice(0, 500)] }; }
}

// naskah -> kata -> cue otomatis (kata awal tiap segmen yang pasti ter-resolve ke posisi yang benar)
function buildNarration(plan) {
  const segs = [];
  plan.sections.forEach((s, i) => {
    segs.push({ kind: "presenter", i, text: s.question.trim() });
    const body = s.body.trim() + (i === plan.sections.length - 1 ? " " + plan.closing.trim() : "");
    segs.push({ kind: "photo", i, text: body });
  });
  const words = []; segs.forEach((g) => { g.start = words.length; words.push(...g.text.split(/\s+/).filter(Boolean)); });
  let prev = -1;
  for (const g of segs) {
    if (g === segs[0]) { g.at = null; prev = 0; continue; }
    let ok = false;
    for (let k = 0; k < 3 && g.start + k < words.length; k++) {
      const cue = norm(words[g.start + k]); if (!cue) continue;
      let found = -1;
      for (let j = prev + 1; j < words.length; j++) if (norm(words[j]).startsWith(cue)) { found = j; break; }
      if (found === g.start + k) { g.at = words[g.start + k].replace(/[^\p{L}\p{N}]/gu, ""); prev = found; ok = true; break; }
    }
    if (!ok) throw new Error(`cue untuk segmen "${g.text.slice(0, 30)}" tidak bisa ditentukan`);
  }
  return { segs, text: words.join(" "), count: words.length };
}

function validate(plan) {
  if (!Array.isArray(plan.sections) || plan.sections.length !== 4) throw new Error("sections harus 4 item");
  for (const s of plan.sections) for (const k of ["question", "body", "head", "query"]) if (!s[k] || typeof s[k] !== "string") throw new Error(`field ${k} kosong`);
  if (!plan.closing || !plan.caption || !plan.title || !Array.isArray(plan.hashtags)) throw new Error("closing/caption/title/hashtags kurang");
  plan.slug = String(plan.slug || plan.topic).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
  const n = buildNarration(plan);
  if (n.count < 90 || n.count > 190) throw new Error(`naskah ${n.count} kata (harus 90-190)`);
  if (/\bharga\b|\brp\s?\d|\bdiskon\b|\bikuti (kami|saya|aku|akun|channel|kanal)\b|\bfollow\b|\bsubscribe\b/i.test(n.text)) throw new Error("naskah memuat kata terlarang (harga/diskon/ikuti)");
  if (/\bharga\b.*\brp\b/i.test(plan.caption)) throw new Error("caption memuat harga");
  const safety = /\b(rem|ban|kemudi|kelistrikan|aki|oli|radiator|lampu|bensin|rantai)\b/i.test(plan.topic + " " + n.text);
  if (safety && !/periksakan ke bengkel/i.test(n.text)) throw new Error('topik keselamatan harus memuat "periksakan ke bengkel"');
  return n;
}

let plan, narr, feedback = "";
if (opt("fake")) { plan = readJson(opt("fake")); narr = validate(plan); }
else {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      plan = parseJson(await claude(prompt(feedback)));
      narr = validate(plan);
      const rv = await review(plan, narr.text);
      if (!rv.ok) throw new Error(`pemeriksa fakta menolak: ${(rv.masalah || []).join("; ")}`);
      break;
    } catch (e) { console.error(`percobaan ${attempt} gagal: ${e.message}`); feedback = e.message; plan = null; }
  }
  if (!plan) throw new Error("gagal membuat naskah yang lolos validasi dan pemeriksaan fakta");
}

const slug = `${wibDate}-${N}-${plan.slug}`;
const dir = path.join(ROOT, "videos", slug);
if (fs.existsSync(dir)) throw new Error(`${dir} sudah ada`);
fs.mkdirSync(path.join(dir, "assets/clips"), { recursive: true });
fs.mkdirSync(path.join(dir, "assets/presenter"), { recursive: true });
fs.mkdirSync(path.join(dir, "assets/img"), { recursive: true });
fs.mkdirSync(path.join(dir, "publish"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "templates/auto/build.mjs"), path.join(dir, "build.mjs"));
fs.copyFileSync(path.join(ROOT, "videos/_presenter/presenter-studio.png"), path.join(dir, "assets/presenter/presenter-studio.png"));

// ---------- Pixabay ----------
const sources = [`# Sumber aset video ${slug} (dibuat otomatis)`];
const br = (t) => { const w = t.split(" "); return w.length > 3 ? w.slice(0, Math.ceil(w.length / 2)).join(" ") + "<br>" + w.slice(Math.ceil(w.length / 2)).join(" ") : t; };
async function pixabay(q, outFile) {
  const key = process.env.PIXABAY_API_KEY; if (!key) throw new Error("PIXABAY_API_KEY belum diisi (GitHub secret)");
  const r = await fetch(`https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(q)}&per_page=20&safesearch=true`);
  if (!r.ok) throw new Error(`Pixabay ${r.status}`);
  const j = await r.json();
  const hit = (j.hits || []).find((h) => h.duration >= 6 && (h.videos.medium?.url || h.videos.large?.url) && !HIST.some((x) => (x.pixabay || []).includes(h.id)));
  if (!hit) return null;
  const v = hit.videos.medium?.url ? hit.videos.medium : hit.videos.large;
  const d = await fetch(v.url); if (!d.ok) throw new Error(`unduh Pixabay ${d.status}`);
  fs.writeFileSync(outFile, Buffer.from(await d.arrayBuffer()));
  return hit;
}
const pixIds = [];
const scenes = [];
for (const g of narr.segs) {
  const s = plan.sections[g.i];
  if (g.kind === "presenter") { scenes.push({ type: "presenter", at: g.at, clip: `p${g.i + 1}.mp4`, head: br(s.question.replace(/\?$/, "?").toUpperCase()) }); sources.push(`p${g.i + 1}.mp4 - klip presenter AI (lip-sync dari foto presenter milik pengguna), bukan kejadian nyata`); continue; }
  const clip = `v${g.i + 1}.mp4`;
  if (!flag("no-pixabay")) {
    let hit = null;
    for (const q of [s.query, s.query.split(" ")[0] + " road", "car road"]) { hit = await pixabay(q, path.join(dir, "assets/clips", clip)); if (hit) break; }
    if (!hit) throw new Error(`tidak ada klip Pixabay untuk "${s.query}"`);
    pixIds.push(hit.id);
    sources.push(`${clip} - footage stok Pixabay ${hit.pageURL} (kontributor ${hit.user}), Pixabay Content License, ilustrasi umum bukan rekaman kejadian tertentu`);
  } else sources.push(`${clip} - footage stok Pixabay (uji tanpa unduh)`);
  scenes.push({ type: "photo", at: g.at, img: `b${g.i + 1}.png`, clip, desc: s.query, head: br(s.head.toUpperCase()), sub: g.i === plan.sections.length - 1 ? "Cek produk di link keterangan" : (s.sub || undefined) });
}
fs.writeFileSync(path.join(dir, "publish/sources.txt"), sources.join("\n") + "\n");

const base = readJson(path.join(ROOT, "videos/damai-kecelakaan/script.json"));
writeJson(path.join(dir, "script.json"), { ...base, slug, scenes: [{ id: "vo", text: narr.text }] });
writeJson(path.join(dir, "storyboard.json"), { presenterImage: "presenter-studio.png", light: true, darkPresenter: true, perScene: true, keys: [], scenes });

const caption = `${plan.caption.trim()}\n\n🛒 Produk terkait: ${PRODUCT.link}\n(Cek harga, spesifikasi, dan ulasan pembeli di listing. Pastikan cocok dengan kendaraan Anda.)\n\n⚠️ Info edukasi umum. Untuk komponen keselamatan, periksakan ke bengkel.`;
writeJson(path.join(dir, "publish/post.json"), { title: `${plan.title.replace(/\s*#shorts\s*$/i, "")} #Shorts`.slice(0, 100), caption, hashtags: [...plan.hashtags.map((h) => h.replace(/^#/, "")), "abidinai"] });
fs.writeFileSync(path.join(dir, "publish/affiliate.txt"), `Link produk: ${PRODUCT.link}\nKonten mengandung link afiliasi. Harga dan kecocokan cek langsung di Shopee.\nVideo dibuat dengan bantuan AI (naskah, suara, presenter).\n`);
writeJson(path.join(ROOT, "queue/history.json"), [...HIST, { date: wibDate, slug, topic: plan.topic, pixabay: pixIds }]);
const Q = readJson(path.join(ROOT, "queue/queue.json"), []);
Q.push({ slug, status: "building", topic: plan.topic });
writeJson(path.join(ROOT, "queue/queue.json"), Q);
console.log(`SLUG=${slug}`);
