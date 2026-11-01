// build.mjs — "GPS tracker" (9:16): lip-sync presenter hook + closing, photo, ui widgets, product card; navy/orange ABIDIN AI look.
// storyboard.json: scenes {at,type,label,badge,overlays[]}; every cue is "the next time this word is spoken after the previous cue".
// Types: presenter | prompt | check | product.
import fs from "node:fs";
import path from "node:path";

export const PLAN = [
  { beat: "S1 hook presenter",  from: "start", to: "next", hero: "slam", zones: "video full | head 300 | caption 1580" },
  { beat: "S2 foto parkiran",   from: "next",  to: "next", hero: "slam", zones: "photo full | head 300 | caption 1580" },
  { beat: "S3 empat hal",       from: "next",  to: "next", hero: "slam", zones: "pill 300 | title 390 | cards 520-1535 | caption 1580" },
  { beat: "S4 produk",          from: "next",  to: "next", hero: "slam", zones: "pill 300 | image 340-965 | name 1000 | list 1140 | link 1330 | caption 1580" },
  { beat: "S5 penutup presenter", from: "next", to: "next", hero: "slam", zones: "video full | head 300 | caption 1580" },
  { beat: "END cek link",       from: "next",  to: "end",  hero: "slam", zones: "pill 300 | words 470-1010 | sub 1330 | caption 1580" },
];

const proj = process.argv[2] || ".";
const SB = JSON.parse(fs.readFileSync(path.join(proj, "storyboard.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(proj, "assets/vo/audio_meta.json"), "utf8"));
const VO = meta.scenes[0];
const W = 1080, H = 1920;
const NAVY = "#102B46", BLUE2 = "#173D60", ORG = "#F5A623", YEL = "#FFD84D", WHITE = "#FFFFFF";
const GLYPH = {
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
const bg = `<svg viewBox="0 0 1080 1920" width="1080" height="1920"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="#0A1B2E"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#g)"/><g stroke="#1C4468" stroke-width="2" opacity="0.5">${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="1920"/>`).join("")}${Array.from({ length: 25 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="1080" y2="${i * 80}"/>`).join("")}</g></svg>`;
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
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n}</span></div><div class="ttl">${esc(sc.title)}</div><div id="${id}c" class="chat"><div class="who">LAKUKAN INI</div><div class="msg">${sc.text}</div></div><div id="${id}k" class="chip">✓ MULAI HARI INI</div>`;
  } else if (sc.type === "photo") {
    inner = `<div id="${id}i" class="photo" style="background-image:url('assets/img/${esc(sc.img)}')"></div><div class="shade"></div><div class="hd">${sc.head || ""}</div>`;
  } else if (sc.type === "stat") {
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n}</span></div><div id="${id}s" class="stat">${esc(sc.value)}</div><div id="${id}l" class="statl">${esc(sc.caption)}</div><div id="${id}x" class="stats">${esc(sc.sub || "")}</div>`;
  } else if (sc.type === "word") {
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n}</span></div>${sc.words.map((w, k) => `<div id="${id}w${k}" class="wd" style="top:${470 + k * (sc.size ? 230 : 270)}px;color:${k % 2 ? YEL : WHITE}${sc.size ? `;font-size:${sc.size}px` : ""}">${esc(w)}</div>`).join("")}<div id="${id}x" class="stats" style="top:1330px">${esc(sc.sub || "")}</div>`;
  } else if (sc.type === "ui") {
    inner = `${bg}<div class="pill"><span>${esc(sc.pillLabel || "TIPS")} ${sc.n}</span></div><div class="ttl">${esc(sc.title)}</div>${sc.cards.map((c, k) => `<div id="${id}u${k}" class="wg" style="top:${(sc.top || 640) + k * ((sc.cardH || 290) + 30)}px;height:${sc.cardH || 290}px">${GLYPH[c.g] || ""}<span>${esc(c.t)}</span></div>`).join("")}`;
  } else if (sc.type === "check") {
    inner = `${bg}<svg class="ico" viewBox="0 0 200 220" width="420" height="462"><path d="M100 10L185 45V110C185 160 150 195 100 212C50 195 15 160 15 110V45Z" fill="${BLUE2}" stroke="${ORG}" stroke-width="10" stroke-linejoin="round"/><path id="${id}m" d="M62 112L92 142L142 80" fill="none" stroke="${YEL}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="140" stroke-dashoffset="140"/></svg><div class="hd2">${sc.head}</div>`;
  } else if (sc.type === "product") {
    const im = sc.img;
    inner = `${bg}<div class="pill"><span>ALAT BANTU</span></div>${im ? `<img class="pimg" src="assets/img/${esc(im)}">` : ""}<div class="pname"${im ? ' style="top:1000px;font-size:64px"' : ""}>${esc(sc.name)}</div><div class="plist"${im ? ' style="top:1140px;font-size:42px"' : ""}>${(sc.lines || []).map((l) => `<div>${esc(l)}</div>`).join("")}</div><div class="plink"${im ? ' style="top:1340px;font-size:48px"' : ""}>Link di keterangan video</div><div class="pdis"${im ? ' style="top:1420px;font-size:34px"' : ""}>Mengandung link afiliasi</div>`;
  }
  els.push(`<div id="${id}" class="scn footage">${inner}${SB.watermark ? `<div class="lab">${esc(sc.label || "ABIDIN AI")}</div>` : ""}</div>`);
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
  if (sc.type === "ui") sc.cards.forEach((_, k) => tl.push(`tl.fromTo("#${id}u${k}",{y:140,rotationX:-40,opacity:0,transformPerspective:900},{y:0,rotationX:0,opacity:1,duration:0.55,ease:"back.out(1.8)"},${fx(sc.ov[k] ? sc.ov[k].t : t0 + 0.3 + k * 0.5)});`));
  if (sc.type === "photo") tl.push(`tl.fromTo("#${id}i",{scale:1.0,transformOrigin:"50% 40%"},{scale:1.12,transformOrigin:"50% 40%",duration:${dur},ease:"none"},${t0});`);
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
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${NAVY}}
body{font-family:Inter,system-ui,sans-serif;color:${WHITE};-webkit-font-smoothing:antialiased}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${NAVY}}
#scene{position:absolute;inset:0;z-index:2}
.pv{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover;z-index:1}
.scn{position:absolute;inset:0;overflow:hidden;opacity:0;visibility:hidden}
.scn>svg{position:absolute;left:0;top:0}
.photo{position:absolute;inset:0;background-size:cover;background-position:50% 20%;will-change:transform}
.photo.ph{display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#173D60,#0A1B2E);font-size:70px;font-weight:900;color:#4f7aa1}
.photo.ph small{display:block;margin-top:20px;font-size:34px;font-weight:600}
.shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,27,46,0.75) 0,rgba(10,27,46,0) 38%,rgba(10,27,46,0) 55%,rgba(10,27,46,0.85) 100%);pointer-events:none}
.hd{position:absolute;left:50px;right:50px;top:250px;text-align:center;font-size:84px;line-height:1.05;font-weight:900;letter-spacing:-0.02em;text-shadow:0 4px 20px rgba(0,0,0,0.5);z-index:3}
.lab{position:absolute;left:48px;top:88px;font-family:ui-monospace,Menlo,monospace;font-size:28px;font-weight:700;letter-spacing:0.1em;color:${ORG};z-index:4}
.pill{position:absolute;left:0;right:0;top:300px;text-align:center;z-index:3}
.pill,.pname{font-family:ui-monospace,Menlo,monospace}
.pill{font-size:34px;font-weight:700;letter-spacing:0.16em;color:${NAVY}}
.pill span{background:${ORG};padding:8px 28px;border-radius:10px}
.ttl{position:absolute;left:50px;right:50px;top:390px;text-align:center;font-size:96px;line-height:1.02;font-weight:900;letter-spacing:-0.03em;z-index:3;color:${YEL}}
.chat{position:absolute;left:60px;right:60px;top:660px;background:${BLUE2};border:4px solid ${ORG};border-radius:36px;padding:34px 36px 40px;opacity:0;z-index:3}
.chat .who{font-family:ui-monospace,Menlo,monospace;font-size:26px;letter-spacing:0.14em;color:${ORG};margin-bottom:16px}
.chat .msg{font-size:54px;line-height:1.22;font-weight:700}
.chip{position:absolute;left:0;right:0;top:1290px;text-align:center;font-size:40px;font-weight:900;letter-spacing:0.06em;color:${YEL};opacity:0;z-index:3}
.scn>svg.ico{position:absolute;left:330px;top:400px}
.hd2{position:absolute;left:50px;right:50px;top:930px;text-align:center;font-size:96px;line-height:1.04;font-weight:900;letter-spacing:-0.03em;color:${WHITE}}
.pname{position:absolute;left:50px;right:50px;top:400px;text-align:center;font-size:76px;line-height:1.08;font-weight:900;color:${YEL};font-family:Inter,system-ui,sans-serif}
.plist{position:absolute;left:80px;right:80px;top:760px;font-size:50px;font-weight:800;line-height:1.5}
.plink{position:absolute;left:0;right:0;top:1230px;text-align:center;font-size:56px;font-weight:900;color:${YEL}}
.pdis{position:absolute;left:0;right:0;top:1330px;text-align:center;font-size:40px;font-weight:700;color:#9db6cf}
.stat{position:absolute;left:0;right:0;top:520px;text-align:center;font-size:330px;line-height:1;font-weight:900;letter-spacing:-0.04em;color:${YEL};opacity:0;z-index:3}
.statl{position:absolute;left:50px;right:50px;top:930px;text-align:center;font-size:62px;font-weight:900;color:${WHITE};opacity:0;z-index:3}
.stats{position:absolute;left:50px;right:50px;top:1060px;text-align:center;font-size:48px;font-weight:700;color:#9db6cf;opacity:0;z-index:3}
.wd{position:absolute;left:30px;right:30px;text-align:center;font-size:190px;line-height:1;font-weight:900;letter-spacing:-0.04em;opacity:0;z-index:3;white-space:nowrap}
.wg{position:absolute;left:70px;right:70px;height:290px;display:flex;align-items:center;gap:36px;padding:0 50px;background:${BLUE2};border:4px solid ${ORG};border-radius:44px;font-size:58px;font-weight:900;line-height:1.1;opacity:0;z-index:3;box-shadow:0 30px 60px rgba(0,0,0,0.45)}
.pimg{position:absolute;left:240px;top:340px;width:600px;height:625px;object-fit:cover;border-radius:36px;border:4px solid ${ORG};z-index:3}
.wg svg{width:120px;height:120px;flex:none}
.cap{position:absolute;left:40px;right:40px;top:1580px;text-align:center;font-size:66px;font-weight:900;line-height:1.1;letter-spacing:-0.01em;color:#fff;text-shadow:0 4px 16px rgba(0,0,0,0.7);opacity:0;z-index:6}
.cap mark{background:${YEL};color:${NAVY};padding:0 10px;border-radius:12px;text-shadow:none}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
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
