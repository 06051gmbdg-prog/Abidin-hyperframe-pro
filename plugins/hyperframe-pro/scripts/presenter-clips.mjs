// presenter-clips.mjs — cut the hook + closing audio out of the video's VO and make lip-sync presenter clips.
// usage: node presenter-clips.mjs <videoDir> [--dry]      (needs assets/vo/audio_meta.json from tts.mjs, FAL_KEY unless --dry)
// storyboard.json: hookEnd = cue word where the hook ends, endStart = cue word where the closing starts, presenterImage.
// Writes <videoDir>/assets/presenter/{hook,end}.mp4 (1080x1920, 30 fps, silent) and slices.json.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const dir = process.argv[2]; const dry = process.argv.includes("--dry");
const SB = JSON.parse(fs.readFileSync(path.join(dir, "storyboard.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(dir, "assets/vo/audio_meta.json"), "utf8"));
const VO = meta.scenes[0], out = path.join(dir, "assets/presenter");
const img = path.join(out, SB.presenterImage || "presenter.png");
if (!fs.existsSync(img)) throw new Error(`presenter image missing: ${img}`);
fs.mkdirSync(out, { recursive: true });
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const find = (c) => { const w = VO.words.find((x) => norm(x.text).startsWith(norm(c))); if (!w) throw new Error(`cue "${c}" not in VO`); return w; };
let slices;
if (SB.perScene) {
  // one clip per presenter scene (scene.clip): [scene start - 0.05, next scene start - 0.05]; cues chain like build.mjs (incl. overlays)
  const VO_START = 0.35, starts = []; let cur = -1;
  const TA = (word) => { for (const w of VO.words) { const t = +(VO_START + w.start).toFixed(3); if (t > cur + 0.01 && norm(w.text).startsWith(norm(word))) return t; } throw new Error(`cue "${word}" not found after ${cur}s`); };
  for (const sc of SB.scenes) {
    const start = sc.at == null ? 0 : (cur = TA(sc.at));
    if (sc.at == null) cur = 0;
    for (const o of sc.overlays || []) cur = TA(o.at);
    starts.push(start);
  }
  slices = {};
  SB.scenes.forEach((sc, i) => {
    if (sc.type !== "presenter" || !sc.clip) return;
    const nextStart = i + 1 < starts.length ? starts[i + 1] : VO_START + VO.duration;
    const from = i === 0 ? 0 : Math.max(0, starts[i] - 0.05 - VO_START), to = Math.min(VO.duration, nextStart - 0.05 - VO_START);
    slices[path.basename(sc.clip, ".mp4")] = [+from.toFixed(3), +to.toFixed(3)];
  });
} else {
  const hookEnd = Math.max(1, find(SB.hookEnd).start - 0.05);
  const endFrom = Math.max(0, find(SB.endStart).start - 0.05);
  const stop = SB.endStopAt ? VO.words.find((w) => w.start > endFrom + 0.5 && norm(w.text).startsWith(norm(SB.endStopAt))) : null;
  const endTo = stop ? Math.max(endFrom + 1, stop.start - 0.05) : VO.duration;
  slices = { hook: [0, hookEnd], end: [endFrom, endTo] };
}
fs.writeFileSync(path.join(out, "slices.json"), JSON.stringify(slices, null, 1));
const total = Object.values(slices).reduce((a, [s, e]) => a + (e - s), 0);
console.log(`${Object.entries(slices).map(([k, [a, b]]) => `${k} ${a}-${b}`).join(", ")}  → ${total.toFixed(1)}s of lip-sync ≈ $${(total * 0.0562).toFixed(2)}`);
if (dry) process.exit(0);
const fal = new URL("./fal.mjs", import.meta.url).pathname;
for (const [name, [s, e]] of Object.entries(slices)) {
  if (fs.existsSync(path.join(out, `${name}.mp4`))) { console.log(`${name}.mp4 exists, skip`); continue; }
  const mp3 = path.join(out, `${name}.mp3`), raw = path.join(out, `${name}.raw.mp4`), fin = path.join(out, `${name}.mp4`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.toFixed(3), "-to", e.toFixed(3), "-i", path.join(dir, "assets/vo", VO.wav), "-ar", "44100", "-ac", "1", "-b:a", "128k", mp3]);
  execFileSync("node", [fal, "avatar", "--image", img, "--audio", mp3, "--out", raw], { stdio: "inherit", env: process.env });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-an", "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", fin]);
  fs.rmSync(raw); fs.rmSync(mp3);
  console.log(`${fin} ok`);
}
