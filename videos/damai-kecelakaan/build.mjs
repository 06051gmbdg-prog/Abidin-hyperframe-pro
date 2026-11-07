// build.mjs — "Tekanan ban" (9:16): lip-sync presenter in every section (light studio), ui cards, stat, drum-brake animation, product card (no price).
// storyboard.json: scenes {at,type,label,badge,overlays[]}; every cue is "the next time this word is spoken after the previous cue".
// photo may carry clip (assets/clips/*.mp4, root-level video). Types: presenter | photo | stat | word | ui | drum | product | prompt | check.
import fs from "node:fs";
import path from "node:path";

export const PLAN = [
  { beat: "S1 hook presenter",   from: "start", to: "next", hero: "slam", zones: "video full | head 250 | caption 1580" },
  { beat: "S2 video ban jalan",  from: "next",  to: "next", hero: "slam", zones: "video full | head 250 | caption 1580" },
  { beat: "S3 presenter akibat", from: "next",  to: "next", hero: "slam", zones: "video full | head 250 | caption 1580" },
  { beat: "S4 motion ban",       from: "next",  to: "next", hero: "slam", zones: "pill 300 | tire 380-1080 | label 985 | chips 1080-1540 | caption 1580" },
  { beat: "S5 presenter berapa", from: "next",  to: "next", hero: "slam", zones: "video full | head 250 | caption 1580" },
  { beat: "S6 rekomendasi",      from: "next",  to: "next", hero: "slam", zones: "pill 300 | image 370-770 | cards 800-1240 | caption 1580" },
  { beat: "S7 presenter kapan",  from: "next",  to: "next", hero: "slam", zones: "video full | head 250 | caption 1580" },
  { beat: "S8 seminggu sekali",  from: "next",  to: "next", hero: "slam", zones: "pill 300 | stat 540 | label 720 | sub 850 | caption 1580" },
  { beat: "S9 presenter cara",   from: "next",  to: "next", hero: "slam", zones: "video full | head 250 | caption 1580" },
  { beat: "S10 foto pasang",     from: "next",  to: "next", hero: "slam", zones: "photo full | head 250 | caption 1580" },
  { beat: "S11 contoh produk",   from: "next",  to: "next", hero: "slam", zones: "pill 300 | image 340-965 | name 1000 | list 1140 | link 1340 | caption 1580" },
  { beat: "END cek ban dulu",    from: "next",  to: "end",  hero: "slam", zones: "photo full | head 250 | sub 1360 | caption 1580" },
];

const proj = process.argv[2] || ".";
const SB = JSON.parse(fs.readFileSync(path.join(proj, "storyboard.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(proj, "assets/vo/audio_meta.json"), "utf8"));
const VO = meta.scenes[0];
const W = 1080, H = 1920;
const NAVY = "#1F2A44", BLUE2 = "#FFFFFF", ORG = "#FF8A1F", YEL = "#FFD84D", WHITE = "#FFFFFF", ACC = "#E8590C", TEAL = "#0FA3A3", CREAM = "#FFF3DC", PEACH = "#FFE3B8";
const GLYPH = {
  tread: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="none" stroke="#2B2F3A" stroke-width="14"/><path d="M50 12v14M50 74v14M12 50h14M74 50h14M23 23l10 10M67 67l10 10M77 23L67 33M33 67L23 77" stroke="${ACC}" stroke-width="5" stroke-linecap="round"/></svg>`,
  fuel: `<svg viewBox="0 0 100 100"><rect x="18" y="14" width="42" height="72" rx="6" fill="${TEAL}"/><rect x="26" y="22" width="26" height="18" rx="3" fill="#fff"/><path d="M60 34h10c6 0 8 4 8 9v28" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/></svg>`,
  grip: `<svg viewBox="0 0 100 100"><path d="M20 80C30 60 30 40 24 20M44 82C54 62 54 42 48 22M68 80C78 60 78 40 72 20" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><path d="M80 84l10-14" stroke="${ACC}" stroke-width="7" stroke-linecap="round"/></svg>`,
  ok: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${TEAL}"/><path d="M30 52l14 14 28-30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warn2: `<svg viewBox="0 0 100 100"><path d="M50 10L92 86H8Z" fill="${YEL}" stroke="${ACC}" stroke-width="6" stroke-linejoin="round"/><path d="M50 38v26" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><circle cx="50" cy="75" r="5.5" fill="${NAVY}"/></svg>`,
  drop: `<svg viewBox="0 0 100 100"><path d="M50 8C36 30 22 46 22 62a28 28 0 0 0 56 0C78 46 64 30 50 8Z" fill="#4DA3FF"/><path d="M38 64a12 12 0 0 0 10 12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`,
  warn: `<svg viewBox="0 0 100 100"><path d="M50 10L92 86H8Z" fill="${YEL}" stroke="${ORG}" stroke-width="5" stroke-linejoin="round"/><path d="M50 38v26" stroke="#102B46" stroke-width="9" stroke-linecap="round"/><circle cx="50" cy="75" r="5.5" fill="#102B46"/></svg>`,
  sound: `<svg viewBox="0 0 100 100"><path d="M14 38h16l22-18v60L30 62H14Z" fill="#fff"/><path d="M64 34c8 8 8 24 0 32M74 24c14 14 14 38 0 52" fill="none" stroke="${YEL}" stroke-width="7" stroke-linecap="round"/></svg>`,
  dist: `<svg viewBox="0 0 100 100"><path d="M12 50h76M12 50l14-14M12 50l14 14M88 50L74 36M88 50L74 64" fill="none" stroke="${YEL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><rect x="44" y="32" width="12" height="36" rx="3" fill="#fff"/></svg>`,
  lever: `<svg viewBox="0 0 100 100"><circle cx="24" cy="70" r="12" fill="#fff"/><path d="M24 70L80 26" stroke="${YEL}" stroke-width="12" stroke-linecap="round"/><path d="M66 60c8 4 16 4 22-2" fill="none" stroke="${ORG}" stroke-width="6" stroke-linecap="round"/></svg>`,
  thin: `<svg viewBox="0 0 100 100"><rect x="10" y="26" width="80" height="22" rx="5" fill="#C9A66B"/><rect x="10" y="62" width="80" height="8" rx="3" fill="#C9A66B"/><path d="M50 50v10M44 55l6 6 6-6" fill="none" stroke="${ORG}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  traffic: `<svg viewBox="0 0 100 100"><rect x="30" y="8" width="40" height="84" rx="14" fill="#2b4f73" stroke="#fff" stroke-width="5"/><circle cx="50" cy="28" r="11" fill="#E5484D"/><circle cx="50" cy="50" r="11" fill="${YEL}"/><circle cx="50" cy="72" r="11" fill="#4ADE80"/></svg>`,
  road: `<svg viewBox="0 0 100 100"><path d="M8 88L46 12h8l38 76Z" fill="#2b4f73" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M50 24v12M50 48v14M50 74v10" stroke="${YEL}" stroke-width="5" stroke-linecap="round"/></svg>`,
  bulb: `<svg viewBox="0 0 100 100" width="170" height="170"><path d="M50 8C30 8 18 23 18 40c0 12 6 20 14 28v10h36V68c8-8 14-16 14-28C82 23 70 8 50 8Z" fill="${YEL}"/><rect x="34" y="82" width="32" height="8" rx="4" fill="${ORG}"/><rect x="38" y="92" width="24" height="6" rx="3" fill="${ORG}"/></svg>`,
  pin: `<svg viewBox="0 0 100 100"><path d="M50 8C33 8 22 21 22 36c0 20 28 54 28 54s28-34 28-54C78 21 67 8 50 8Z" fill="#E5484D"/><circle cx="50" cy="36" r="11" fill="#fff"/></svg>`,
  signal: `<svg viewBox="0 0 100 100"><g fill="${YEL}"><rect x="14" y="62" width="12" height="24" rx="3"/><rect x="34" y="46" width="12" height="40" rx="3"/><rect x="54" y="30" width="12" height="56" rx="3"/><rect x="74" y="14" width="12" height="72" rx="3"/></g></svg>`,
  battery: `<svg viewBox="0 0 100 100"><rect x="8" y="30" width="78" height="40" rx="8" fill="none" stroke="#fff" stroke-width="6"/><rect x="88" y="42" width="6" height="16" rx="2" fill="#fff"/><rect x="15" y="37" width="38" height="26" rx="4" fill="#4ADE80"/></svg>`,
  phone: `<svg viewBox="0 0 100 100"><rect x="28" y="8" width="44" height="84" rx="9" fill="none" stroke="#fff" stroke-width="6"/><circle cx="50" cy="80" r="3.5" fill="#fff"/><path d="M50 22c-7 0-12 5-12 11 0 8 12 22 12 22s12-14 12-22c0-6-5-11-12-11Z" fill="${ORG}"/></svg>`,
  toggle: `<svg viewBox="0 0 100 100" width="170" height="170"><rect x="8" y="28" width="84" height="44" rx="22" fill="#2b4f73"/><circle cx="30" cy="50" r="17" fill="#fff"/><path d="M62 40l16 20M78 40L62 60" stroke="${ORG}" stroke-width="6" stroke-linecap="round"/></svg>`,
};
const fx = (n) => +n.toFixed(3);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const VO_START = 0.35;

function TA(word, after) {
  for (const w of VO.words) {
    const t = fx(VO_START + w.start);
    if (t > after + 0.01 && norm(w.text).startsWith(norm(word))) return t;
  }
  throw new Error(`cue "${word}" after ${after}s not found — the script changed; fix storyboard.json`);
}
const VO_END = fx(VO_START + VO.duration);
const TOTAL = fx(VO_END + 1.5);
if (TOTAL > 179) throw new Error(`total ${TOTAL}s exceeds the 2:59 ceiling — cut words, never speed up the voice`);

let cur = -1;
const S = SB.scenes.map((sc) => {
  const start = sc.at == null ? 0 : (cur = TA(sc.at, cur));
  if (sc.at == null) cur = 0;
  const ov = (sc.overlays || []).map((o) => ({ ...o, t: (cur = TA(o.at, cur)) }));
  return { ...sc, start, ov };
});
S.forEach((sc, i) => { sc.end = i + 1 < S.length ? S[i + 1].start : TOTAL; });

// ------------------------------------------------------------ elements + tweens
const tl = [], els = [], vids = [];
const bg = `<svg viewBox="0 0 1080 1920" width="1080" height="1920"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CREAM}"/><stop offset="1" stop-color="${PEACH}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#g)"/><g stroke="#F0D2A0" stroke-width="2" opacity="0.7">${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="1920"/>`).join("")}${Array.from({ length: 25 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="1080" y2="${i * 80}"/>`).join("")}</g></svg>`;
S.forEach((sc, i) => {
  const id = `sc${i}`, dur = fx(sc.end - sc.start + 0.3), first = i === 0;
  const at0 = first ? 0 : fx(Math.max(0, sc.start - 0.1));
  let inner = "";
  if (sc.type === "presenter") {
    const hasClip = sc.clip && fs.existsSync(path.join(proj, "assets/presenter", sc.clip));
    const has = sc.img && fs.existsSync(path.join(proj, "assets/presenter", sc.img));
    if (hasClip) {
      const cs = sc.start === 0 ? VO_START : fx(sc.start - 0.05);
      vids.push(`<video class="clip pv" id="${id}v" muted playsinline preload="auto" src="assets/presenter/${esc(sc.clip)}" data-start="${cs}" data-duration="${fx(sc.end - cs + 0.1)}" data-track-index="2"></video>`);
      inner = "";
    } else inner = has ? `<div id="${id}i" class="photo" style="background-image:url('assets/presenter/${esc(sc.img)}')"></div>`
      : `<div id="${id}i" class="photo ph"><span>FOTO PRESENTER<br><small>${esc(sc.img || "")}</small></span></div>`;
    inner += `<div class="shade"></div><div class="hd">${sc.head || ""}</div>`;
    sc._still = !hasClip;
  } else if (sc.type === "prompt") {
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n ?? ""}</span></div><div class="ttl">${esc(sc.title)}</div><div id="${id}c" class="chat"><div class="who">LAKUKAN INI</div><div class="msg">${sc.text}</div></div><div id="${id}k" class="chip">✓ MULAI HARI INI</div>`;
  } else if (sc.type === "photo") {
    const okp = fs.existsSync(path.join(proj, "assets/img", sc.img));
    const hasV = sc.clip && fs.existsSync(path.join(proj, "assets/clips", sc.clip));
    if (hasV) {
      const cs = sc.start === 0 ? VO_START : fx(sc.start - 0.05);
      vids.push(`<video class="clip pv" id="${id}v" muted playsinline preload="auto" src="assets/clips/${esc(sc.clip)}" data-start="${cs}" data-duration="${fx(sc.end - cs + 0.1)}" data-track-index="2"></video>`);
    }
    inner = (hasV ? "" : okp ? `<div id="${id}i" class="photo" style="background-image:url('assets/img/${esc(sc.img)}')"></div>` : `<div id="${id}i" class="photo ph"><span>${sc.clip ? "VIDEO AI" : "GAMBAR AI"}<br><small>${esc(sc.desc || sc.img)}</small></span></div>`) + `<div class="shade"></div><div class="hd">${sc.head || ""}</div>${sc.sub ? `<div class="psub">${esc(sc.sub)}</div>` : ""}`;
  } else if (sc.type === "stat") {
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n ?? ""}</span></div><div id="${id}s" class="stat"${sc.size ? ` style="font-size:${sc.size}px;top:540px"` : ""}>${esc(sc.value)}</div><div id="${id}l" class="statl"${sc.size ? ' style="top:720px"' : ""}>${esc(sc.caption)}</div><div id="${id}x" class="stats"${sc.size ? ' style="top:850px"' : ""}>${esc(sc.sub || "")}</div>`;
  } else if (sc.type === "word") {
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n ?? ""}</span></div>${sc.words.map((w, k) => `<div id="${id}w${k}" class="wd" style="top:${470 + k * (sc.size ? 230 : 270)}px;color:${k % 2 ? ACC : NAVY}${sc.size ? `;font-size:${sc.size}px` : ""}">${esc(w)}</div>`).join("")}<div id="${id}x" class="stats" style="top:1330px">${esc(sc.sub || "")}</div>`;
  } else if (sc.type === "ui") {
    const okg = sc.topImg && fs.existsSync(path.join(proj, "assets/img", sc.topImg));
    const top = sc.topImg ? (okg ? `<img id="${id}g" class="uimg" src="assets/img/${esc(sc.topImg)}">` : `<div id="${id}g" class="uimg ph2">GAMBAR AI<br>${esc(sc.desc || sc.topImg)}</div>`) : `<div class="ttl">${esc(sc.title)}</div>`;
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n ?? ""}</span></div>${top}${sc.cards.map((c, k) => `<div id="${id}u${k}" class="wg" style="top:${(sc.top || 640) + k * ((sc.cardH || 290) + 30)}px;height:${sc.cardH || 290}px">${GLYPH[c.g] || ""}<span>${esc(c.t)}</span></div>`).join("")}`;
  } else if (sc.type === "drum") {
    const C = [360, 300], arc = (r, a1, a2) => { const p = (a) => [C[0] + r * Math.cos(a * Math.PI / 180), C[1] + r * Math.sin(a * Math.PI / 180)].map((v) => +v.toFixed(1)); const [x1, y1] = p(a1), [x2, y2] = p(a2); return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`; };
    const spr = (y) => `<path d="M293 ${y}l15 -14 15 28 15 -28 15 28 15 -28 15 28 15 -28 15 28 15 -14" fill="none" stroke="#9db6cf" stroke-width="6" stroke-linejoin="round"/>`;
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "REM TROMOL")}</span></div><svg id="${id}d" class="drm" viewBox="0 0 720 600" width="900" height="750" style="position:absolute;left:90px;top:400px"><circle cx="360" cy="300" r="230" fill="#0C2236" stroke="#2b4f73" stroke-width="18"/><path d="${arc(160, -60, 60)}" fill="none" stroke="#9db6cf" stroke-width="14" stroke-linecap="round"/><path d="${arc(160, 120, 240)}" fill="none" stroke="#9db6cf" stroke-width="14" stroke-linecap="round"/><path id="${id}lr" d="${arc(188, -60, 60)}" fill="none" stroke="#C9A66B" stroke-width="44"/><path id="${id}ll" d="${arc(188, 120, 240)}" fill="none" stroke="#C9A66B" stroke-width="44"/>${spr(140)}${spr(460)}<g id="${id}a"><rect x="360" y="286" width="320" height="28" rx="12" fill="#9db6cf"/><path d="M620 286L652 286L636 258Z" fill="${ORG}"/></g><circle cx="360" cy="300" r="58" fill="${BLUE2}" stroke="${ORG}" stroke-width="8"/><path d="M620 222L652 222L636 250Z" fill="${YEL}"/></svg><div id="${id}t" class="dl1">TANDA PANAH DI TUAS REM</div><div id="${id}m" class="dl2">SEJAJAR = KAMPAS AUS</div>`;
  } else if (sc.type === "tire") {
    const spokes = [0, 60, 120, 180, 240, 300].map((a) => `<line x1="360" y1="242" x2="${+(360 + 120 * Math.cos(a * Math.PI / 180)).toFixed(1)}" y2="${+(242 + 120 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="${TEAL}" stroke-width="10" stroke-linecap="round"/>`).join("");
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TEKANAN BAN")}</span></div><svg id="${id}d" class="drm" viewBox="0 0 720 560" width="900" height="700" style="position:absolute;left:90px;top:380px"><rect x="0" y="470" width="720" height="8" rx="4" fill="${NAVY}" opacity="0.85"/><g id="${id}t"><circle cx="360" cy="242" r="200" fill="none" stroke="#2B2F3A" stroke-width="56"/><circle cx="360" cy="242" r="140" fill="#fff" stroke="${TEAL}" stroke-width="14"/>${spokes}<circle cx="360" cy="242" r="22" fill="${TEAL}"/></g><rect id="${id}c" x="330" y="464" width="60" height="16" rx="8" fill="${ACC}"/><g><circle cx="620" cy="90" r="64" fill="#fff" stroke="${NAVY}" stroke-width="8"/><path d="M572 112A52 52 0 0 1 620 38" fill="none" stroke="#E5484D" stroke-width="10"/><path d="M620 38A52 52 0 0 1 668 112" fill="none" stroke="#2FB36B" stroke-width="10"/><g id="${id}n"><line x1="620" y1="90" x2="620" y2="48" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/></g><circle cx="620" cy="90" r="8" fill="${NAVY}"/></g></svg><div id="${id}l1" class="tl1">BAN KURANG ANGIN</div><div id="${id}l2" class="tl2">TEKANAN PAS</div>${sc.chips.map((c, k) => `<div id="${id}u${k}" class="wg" style="top:${1080 + k * 160}px;height:140px;font-size:50px">${GLYPH[c.g] || ""}<span>${esc(c.t)}</span></div>`).join("")}`;
  } else if (sc.type === "check") {
    inner = `${bg}<svg class="ico" viewBox="0 0 200 220" width="420" height="462"><path d="M100 10L185 45V110C185 160 150 195 100 212C50 195 15 160 15 110V45Z" fill="${BLUE2}" stroke="${ORG}" stroke-width="10" stroke-linejoin="round"/><path id="${id}m" d="M62 112L92 142L142 80" fill="none" stroke="${YEL}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="140" stroke-dashoffset="140"/></svg><div class="hd2">${sc.head}</div>`;
  } else if (sc.type === "product") {
    const im = sc.img;
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "CONTOH PRODUK")}</span></div>${im ? `<img class="pimg" src="assets/img/${esc(im)}">` : ""}<div class="pname"${im ? ' style="top:1000px;font-size:64px"' : ""}>${esc(sc.name)}</div><div class="plist"${im ? ' style="top:1140px;font-size:42px"' : ""}>${(sc.lines || []).map((l) => `<div>${esc(l)}</div>`).join("")}</div><div class="plink"${im ? ' style="top:1340px;font-size:48px"' : ""}>Link di keterangan video</div><div class="pdis"${im ? ' style="top:1420px;font-size:34px"' : ""}>Mengandung link afiliasi</div>`;
  }
  els.push(`<div id="${id}" class="scn footage${sc.type === "presenter" ? " pres" : ""}">${inner}${SB.watermark ? `<div class="lab">${esc(sc.label || "ABIDIN AI")}</div>` : ""}</div>`);
  tl.push(`tl.fromTo("#${id}",{autoAlpha:0},{autoAlpha:1,duration:${first ? 0.01 : 0.12},ease:"none"},${at0});`);
  tl.push(`tl.fromTo("#${id}",{scale:${first ? 1 : 1.04}},{scale:1,duration:0.25,ease:"power3.out"},${at0});`);
  if (i + 1 < S.length) {
    const out = fx(Math.max(sc.end, at0 + 0.9));
    tl.push(`tl.to("#${id}",{autoAlpha:0,duration:0.12,ease:"none"},${out});`, `tl.set("#${id}",{autoAlpha:0},${fx(out + 0.12)});`);
  }
  const t0 = fx(Math.max(sc.start, at0));
  if (sc.type === "presenter" && sc._still) tl.push(`tl.fromTo("#${id}i",{scale:1.0,transformOrigin:"50% 30%"},{scale:1.12,transformOrigin:"50% 30%",duration:${dur},ease:"none"},${t0});`);
  if (sc.type === "prompt") {
    tl.push(`tl.fromTo("#${id}c",{y:60,opacity:0},{y:0,opacity:1,duration:0.4},${fx(t0 + 0.25)});`);
    tl.push(`tl.fromTo("#${id}k",{opacity:0,scale:0.8},{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"},${fx(Math.min(t0 + 2.2, sc.end - 0.6))});`);
  }
  if (sc.type === "stat") {
    tl.push(`tl.fromTo("#${id}s",{scale:0.35,opacity:0},{scale:1,opacity:1,duration:0.55,ease:"back.out(2.4)"},${fx(t0 + 0.15)});`);
    tl.push(`tl.fromTo("#${id}l",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${fx(t0 + 0.7)});`);
    tl.push(`tl.fromTo("#${id}x",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${fx(t0 + 1.4)});`);
  }
  if (sc.type === "word") {
    sc.words.forEach((_, k) => tl.push(`tl.fromTo("#${id}w${k}",{scale:1.9,opacity:0,x:-60},{scale:1,opacity:1,x:0,duration:0.35,ease:"power4.out"},${fx(t0 + 0.2 + k * 0.45)});`));
    tl.push(`tl.fromTo("#${id}x",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${fx(t0 + 0.2 + sc.words.length * 0.45)});`);
  }
  if (sc.type === "ui" && sc.topImg) tl.push(`tl.fromTo("#${id}g",{scale:0.9,opacity:0},{scale:1,opacity:1,duration:0.5,ease:"power3.out"},${fx(t0 + 0.1)});`);
  if (sc.type === "ui") sc.cards.forEach((_, k) => tl.push(`tl.fromTo("#${id}u${k}",{y:140,rotationX:-40,opacity:0,transformPerspective:900},{y:0,rotationX:0,opacity:1,duration:0.55,ease:"back.out(1.8)"},${fx(sc.ov[k] ? sc.ov[k].t : t0 + 0.3 + k * 0.5)});`));
  if (sc.type === "photo" && !(sc.clip && fs.existsSync(path.join(proj, "assets/clips", sc.clip)))) tl.push(`tl.fromTo("#${id}i",{scale:1.0,transformOrigin:"50% 40%"},{scale:1.12,transformOrigin:"50% 40%",duration:${dur},ease:"none"},${t0});`);
  if (sc.type === "drum") {
    const ot = sc.ov[0] ? sc.ov[0].t : t0 + 3, as = fx(Math.max(t0 + 0.9, ot - 1.3));
    tl.push(`tl.fromTo("#${id}d",{scale:0.6,opacity:0,transformOrigin:"50% 50%"},{scale:1,opacity:1,duration:0.5,ease:"back.out(1.6)"},${fx(t0 + 0.15)});`);
    tl.push(`tl.fromTo("#${id}t",{y:30,opacity:0},{y:0,opacity:1,duration:0.4},${fx(t0 + 0.5)});`);
    tl.push(`tl.fromTo("#${id}a",{rotation:-28,svgOrigin:"360 300"},{rotation:0,svgOrigin:"360 300",duration:${fx(Math.max(0.6, ot - as))},ease:"power2.inOut"},${as});`);
    tl.push(`tl.fromTo("#${id}m",{scale:0.6,opacity:0},{scale:1,opacity:1,duration:0.4,ease:"back.out(2)"},${fx(ot)});`);
    tl.push(`tl.to("#${id}lr",{attr:{"stroke-width":12},duration:1.1,ease:"power2.inOut"},${fx(ot + 0.3)});`, `tl.to("#${id}ll",{attr:{"stroke-width":12},duration:1.1,ease:"power2.inOut"},${fx(ot + 0.3)});`);
  }
  if (sc.type === "tire") {
    const o = (k) => (sc.ov[k] ? sc.ov[k].t : t0 + 1.5 + k * 1.4), ret = fx(Math.min(o(2) + 0.4, sc.end - 1.1));
    tl.push(`tl.set("#${id}n",{rotation:-55,svgOrigin:"620 90"},0);`);
    tl.push(`tl.fromTo("#${id}d",{scale:0.7,opacity:0,transformOrigin:"50% 50%"},{scale:1,opacity:1,duration:0.5,ease:"back.out(1.6)"},${fx(t0 + 0.15)});`);
    tl.push(`tl.fromTo("#${id}l1",{y:30,opacity:0},{y:0,opacity:1,duration:0.4},${fx(t0 + 0.5)});`);
    tl.push(`tl.fromTo("#${id}t",{scaleY:1,scaleX:1,svgOrigin:"360 470"},{scaleY:0.86,scaleX:1.05,svgOrigin:"360 470",duration:0.8,ease:"power2.inOut"},${fx(t0 + 0.6)});`);
    tl.push(`tl.fromTo("#${id}c",{attr:{x:330,width:60}},{attr:{x:240,width:240},duration:0.8,ease:"power2.inOut"},${fx(t0 + 0.6)});`);
    sc.chips.forEach((_, k) => tl.push(`tl.fromTo("#${id}u${k}",{y:140,rotationX:-40,opacity:0,transformPerspective:900},{y:0,rotationX:0,opacity:1,duration:0.55,ease:"back.out(1.8)"},${fx(o(k))});`));
    tl.push(`tl.fromTo("#${id}t",{scaleY:0.86,scaleX:1.05,svgOrigin:"360 470"},{scaleY:1,scaleX:1,svgOrigin:"360 470",duration:0.8,ease:"power2.inOut"},${ret});`);
    tl.push(`tl.fromTo("#${id}c",{attr:{x:240,width:240}},{attr:{x:315,width:90},duration:0.8,ease:"power2.inOut"},${ret});`);
    tl.push(`tl.to("#${id}n",{rotation:0,svgOrigin:"620 90",duration:0.8,ease:"power2.inOut"},${ret});`);
    tl.push(`tl.to("#${id}l1",{opacity:0,duration:0.3},${ret});`, `tl.fromTo("#${id}l2",{y:30,opacity:0},{y:0,opacity:1,duration:0.4},${fx(ret + 0.4)});`);
  }
  if (sc.type === "check") tl.push(`tl.to("#${id}m",{attr:{"stroke-dashoffset":0},duration:0.6,ease:"power2.out"},${fx(t0 + 0.3)});`);
});

// ------------------------------------------------------------ captions
const KEY = new Set((SB.keys || []).map(norm));
const caps = [];
{
  const lines = []; let line = [];
  for (const w of VO.words) { line.push(w); if (line.length === 3 || /[.?!:,]$/.test(w.text)) { lines.push(line); line = []; } }
  if (line.length) lines.push(line);
  lines.forEach((ln, i) => {
    const st = fx(VO_START + ln[0].start - 0.06), nx = lines[i + 1];
    const en = fx(nx ? VO_START + nx[0].start - 0.06 : VO_START + ln.at(-1).end + 0.3);
    const txt = ln.map((w) => KEY.has(norm(w.text)) ? `<mark>${esc(w.text)}</mark>` : esc(w.text)).join(" ");
    caps.push(`<div class="cap clip" id="cap-${i}" data-start="${st}" data-duration="${fx(en - st)}" data-track-index="7">${txt}</div>`);
    tl.push(`tl.fromTo("#cap-${i}",{y:12,opacity:0},{y:0,opacity:1,duration:0.14,ease:"power2.out"},${st});`);
  });
}

const page = `<!doctype html>
<html lang="id"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${CREAM}}
body{font-family:Inter,system-ui,sans-serif;color:${NAVY};-webkit-font-smoothing:antialiased}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${CREAM}}
#scene{position:absolute;inset:0;z-index:2}
.pv{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover;z-index:1}
.scn{position:absolute;inset:0;overflow:hidden;opacity:0;visibility:hidden}
.scn>svg{position:absolute;left:0;top:0}
.photo{position:absolute;inset:0;background-size:cover;background-position:50% 20%;will-change:transform}
.photo.ph{display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#FFE3B8,#FFD08A);font-size:70px;font-weight:900;color:#B8741A}
.photo.ph small{display:block;margin-top:20px;font-size:34px;font-weight:600}
.shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,27,46,0.75) 0,rgba(10,27,46,0) 38%,rgba(10,27,46,0) 55%,rgba(10,27,46,0.85) 100%);pointer-events:none}
.hd{position:absolute;left:50px;right:50px;top:250px;text-align:center;font-size:84px;line-height:1.05;font-weight:900;letter-spacing:-0.02em;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,0.5);z-index:3}
.lab{position:absolute;left:48px;top:88px;font-family:ui-monospace,Menlo,monospace;font-size:28px;font-weight:700;letter-spacing:0.1em;color:${ORG};z-index:4}
.pill{position:absolute;left:0;right:0;top:300px;text-align:center;z-index:3}
.pill,.pname{font-family:ui-monospace,Menlo,monospace}
.pill{font-size:34px;font-weight:700;letter-spacing:0.16em;color:${NAVY}}
.pill span{background:${ORG};padding:8px 28px;border-radius:10px}
.ttl{position:absolute;left:50px;right:50px;top:390px;text-align:center;font-size:96px;line-height:1.02;font-weight:900;letter-spacing:-0.03em;z-index:3;color:${ACC}}
.chat{position:absolute;left:60px;right:60px;top:660px;background:${BLUE2};border:4px solid ${ORG};border-radius:36px;padding:34px 36px 40px;opacity:0;z-index:3}
.chat .who{font-family:ui-monospace,Menlo,monospace;font-size:26px;letter-spacing:0.14em;color:${ORG};margin-bottom:16px}
.chat .msg{font-size:54px;line-height:1.22;font-weight:700}
.chip{position:absolute;left:0;right:0;top:1290px;text-align:center;font-size:40px;font-weight:900;letter-spacing:0.06em;color:${ACC};opacity:0;z-index:3}
.scn>svg.ico{position:absolute;left:330px;top:400px}
.hd2{position:absolute;left:50px;right:50px;top:930px;text-align:center;font-size:96px;line-height:1.04;font-weight:900;letter-spacing:-0.03em;color:${NAVY}}
.pname{position:absolute;left:50px;right:50px;top:400px;text-align:center;font-size:76px;line-height:1.08;font-weight:900;color:${ACC};font-family:Inter,system-ui,sans-serif}
.plist{position:absolute;left:80px;right:80px;top:760px;font-size:50px;font-weight:800;line-height:1.5}
.plink{position:absolute;left:0;right:0;top:1230px;text-align:center;font-size:56px;font-weight:900;color:${ACC}}
.pdis{position:absolute;left:0;right:0;top:1330px;text-align:center;font-size:40px;font-weight:700;color:#7A6A55}
.stat{position:absolute;left:0;right:0;top:520px;text-align:center;font-size:330px;line-height:1;font-weight:900;letter-spacing:-0.04em;color:${ACC};opacity:0;z-index:3}
.statl{position:absolute;left:50px;right:50px;top:930px;text-align:center;font-size:62px;font-weight:900;color:${NAVY};opacity:0;z-index:3}
.stats{position:absolute;left:50px;right:50px;top:1060px;text-align:center;font-size:48px;font-weight:700;color:#7A6A55;opacity:0;z-index:3}
.wd{position:absolute;left:30px;right:30px;text-align:center;font-size:190px;line-height:1;font-weight:900;letter-spacing:-0.04em;opacity:0;z-index:3;white-space:nowrap}
.wg{position:absolute;left:70px;right:70px;height:290px;display:flex;align-items:center;gap:36px;padding:0 50px;background:${BLUE2};border:4px solid ${ORG};border-radius:44px;font-size:58px;font-weight:900;line-height:1.1;opacity:0;z-index:3;box-shadow:0 24px 50px rgba(150,100,30,0.28)}
.pimg{position:absolute;left:240px;top:340px;width:600px;height:625px;object-fit:cover;border-radius:36px;border:4px solid ${ORG};z-index:3}
.wg svg{width:120px;height:120px;flex:none}
.drm{z-index:3}
.tl1,.tl2{position:absolute;left:50px;right:50px;top:985px;text-align:center;font-size:54px;font-weight:900;opacity:0;z-index:3}
.tl1{color:#E5484D}
.tl2{color:${TEAL}}
.psub{position:absolute;left:50px;right:50px;top:1360px;text-align:center;font-size:46px;font-weight:800;color:#fff;text-shadow:0 4px 16px rgba(0,0,0,0.7);z-index:4}
.uimg{position:absolute;left:90px;top:370px;width:900px;height:400px;object-fit:cover;border-radius:36px;border:4px solid ${ORG};z-index:3}
.ph2{display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#FFE3B8,#FFD08A);color:#B8741A;font-size:38px;font-weight:900;line-height:1.3;padding:0 40px}
.dl1{position:absolute;left:50px;right:50px;top:1380px;text-align:center;font-size:56px;font-weight:900;color:${NAVY};opacity:0;z-index:3}
.dl2{position:absolute;left:50px;right:50px;top:1460px;text-align:center;font-size:62px;font-weight:900;color:${YEL};opacity:0;z-index:3}
.light .pres .hd{color:${SB.darkPresenter ? "#FFFFFF" : NAVY};text-shadow:${SB.darkPresenter ? "0 4px 18px rgba(0,0,0,0.65)" : "none"}}
.light .pres .shade{display:none}
.light .cap{-webkit-text-stroke:12px ${NAVY};paint-order:stroke fill;text-shadow:none}
.light .cap mark{-webkit-text-stroke:0}
.cap{position:absolute;left:40px;right:40px;top:1580px;text-align:center;font-size:66px;font-weight:900;line-height:1.1;letter-spacing:-0.01em;color:#fff;text-shadow:0 4px 16px rgba(0,0,0,0.7);opacity:0;z-index:6}
.cap mark{background:${YEL};color:${NAVY};padding:0 10px;border-radius:12px;text-shadow:none}
</style></head><body>
<div id="root" class="${SB.light ? "light" : ""}" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
  ${vids.join("\n  ")}
  <div id="scene" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="3">
    ${els.join("\n    ")}
  </div>
  ${caps.join("\n  ")}
  <audio id="vo" src="assets/vo/${VO.wav}" data-start="${VO_START}" data-duration="${fx(VO.duration)}" data-track-index="30" data-volume="1"></audio>
</div>
<script>
  window.__timelines = window.__timelines || {};
  gsap.set(".scn",{autoAlpha:0});
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  ${tl.join("\n  ")}
  window.__timelines["main"] = tl;
</script>
</body></html>
`;
fs.writeFileSync(path.join(proj, "index.html"), page);
console.log(`wrote index.html  total=${TOTAL}s  scenes=${S.length}  tweens=${tl.length}  captions=${caps.length}`);
