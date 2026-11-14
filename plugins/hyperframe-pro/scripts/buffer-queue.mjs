#!/usr/bin/env node
// Jadwalkan 1 video siap tayang per hari ke Buffer (YouTube Shorts 18:00, Instagram Reels 19:00, Facebook Reels 20:00 WIB).
//   BUFFER_TOKEN=... node buffer-queue.mjs            # jadwalkan video "ready" berikutnya untuk besok
//   node buffer-queue.mjs --check                     # cek token / koneksi Buffer saja
//   node buffer-queue.mjs --dry                       # tampilkan yang akan dikirim, tanpa mengirim
//   node buffer-queue.mjs --date 2026-11-20           # pilih tanggal tayang (WIB)
// Antrian: queue/queue.json -> [{ "slug": "nama-video", "status": "draft|ready|scheduled" }]
// Isi post per video: videos/<slug>/publish/post.json
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const ROOT = process.cwd();
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, "queue/buffer.config.json"), "utf8"));
const QFILE = path.join(ROOT, "queue/queue.json");
const TOKEN = process.env.BUFFER_TOKEN;
const API = "https://api.buffer.com";

async function gql(query, variables) {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify({ query, variables }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.errors) throw new Error(`Buffer API ${r.status}: ${JSON.stringify(j.errors || j).slice(0, 600)}`);
  return j.data;
}

if (!TOKEN && !flag("dry")) { console.error("BUFFER_TOKEN belum diisi (GitHub secret BUFFER_TOKEN)."); process.exit(2); }

if (flag("check")) {
  const d = await gql("{ account { organizations { id name } } }");
  console.log("Buffer tersambung:", JSON.stringify(d.account.organizations));
  process.exit(0);
}

const queue = JSON.parse(fs.readFileSync(QFILE, "utf8"));
const item = opt("slug") ? queue.find((q) => q.slug === opt("slug")) : queue.find((q) => q.status === "ready");
if (!item) { console.log("Antrian kosong: tidak ada video berstatus 'ready'. Buat video baru dulu."); process.exit(0); }

const post = JSON.parse(fs.readFileSync(path.join(ROOT, "videos", item.slug, "publish/post.json"), "utf8"));
const videoUrl = `https://raw.githubusercontent.com/${CFG.repo}/renders-${item.slug}/video.mp4`;
const head = await fetch(videoUrl, { method: "HEAD" });
if (!head.ok) { console.error(`Video tidak bisa diakses (${head.status}): ${videoUrl}`); process.exit(1); }

const wib = new Date(Date.now() + 7 * 3600e3);
const tomorrow = new Date(wib.getTime() + 86400e3).toISOString().slice(0, 10);
const FIXED = opt("time"); // HH:MM WIB untuk SEMUA channel, hari ini (dipakai alur otomatis 12:00 dan 16:00)
const date = opt("date") || (FIXED ? wib.toISOString().slice(0, 10) : tomorrow);
const tag = (arr) => arr.map((h) => (h.startsWith("#") ? h : "#" + h)).join(" ");
const body = (c) => `${c}\n\n${post.disclosure || CFG.disclosure}\n\n${tag(post.hashtags)}`;

const jt = (t) => FIXED || t;
const jobs = [
  { name: "YouTube", channelId: CFG.channels.youtube, time: jt(CFG.times.youtube), text: body(post.caption), metadata: { youtube: { title: post.title, categoryId: "26", madeForKids: false, isAiGenerated: true } } },
  { name: "Instagram", channelId: CFG.channels.instagram, time: jt(CFG.times.instagram), text: body(post.caption), metadata: { instagram: { type: "reel", shouldShareToFeed: true, isAiGenerated: true } } },
  { name: "Facebook", channelId: CFG.channels.facebook, time: jt(CFG.times.facebook), text: body(post.caption), metadata: { facebook: { type: "reel" } } },
];

const dueFor = (t) => { // jam sudah lewat / kurang dari 10 menit lagi -> geser ke 15 menit dari sekarang (WIB)
  const at = new Date(`${date}T${t}:00+07:00`);
  return (at.getTime() < Date.now() + 10 * 60e3 ? new Date(Date.now() + 15 * 60e3) : at).toISOString();
};
const M = `mutation($input: CreatePostInput!){ createPost(input:$input){ ... on PostActionSuccess { post { id status dueAt channelId } } ... on MutationError { message } } }`;
const ids = [];
for (const j of jobs) {
  const input = { channelId: j.channelId, text: j.text, schedulingType: "automatic", mode: "customScheduled", dueAt: dueFor(j.time), assets: [{ video: { url: videoUrl } }], metadata: j.metadata };
  if (flag("dry")) { console.log(j.name, JSON.stringify(input).slice(0, 400)); continue; }
  const d = await gql(M, { input });
  const r = d.createPost;
  if (!r.post) throw new Error(`${j.name}: ${r.message}`);
  console.log(`${j.name} terjadwal ${r.post.dueAt} (${r.post.id})`);
  ids.push({ channel: j.name, id: r.post.id });
}
if (!flag("dry")) {
  item.status = "scheduled"; item.date = date; item.posts = ids;
  fs.writeFileSync(QFILE, JSON.stringify(queue, null, 2) + "\n");
}
