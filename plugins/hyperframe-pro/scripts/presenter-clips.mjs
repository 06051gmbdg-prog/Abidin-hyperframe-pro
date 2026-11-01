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
const hookEnd = Math.max(1, find(SB.hookEnd).start - 0.05);
const endFrom = Math.max(0, find(SB.endStart).start - 0.05);
const stop = SB.endStopAt ? VO.words.find((w) => w.start > endFrom + 0.5 && norm(w.text).startsWith(norm(SB.endStopAt))) : null;
const endTo = stop ? Math.max(endFrom + 1, stop.start - 0.05) : VO.duration;
const slices = { hook: [0, hookEnd], end: [endFrom, endTo] };
fs.writeFileSync(path.join(out, "slices.json"), JSON.stringify(slices, null, 1));
const total = Object.values(slices).reduce((a, [s, e]) => a + (e - s), 0);
console.log(`hook 0-${hookEnd.toFixed(2)}s, end ${endFrom.toFixed(2)}-${VO.duration}s  → ${total.toFixed(1)}s of lip-sync ≈ $${(total * 0.0562).toFixed(2)}`);
if (dry) process.exit(0);
const fal = new URL("./fal.mjs", import.meta.url).pathname;
for (const [name, [s, e]] of Object.entries(slices)) {
  const mp3 = path.join(out, `${name}.mp3`), raw = path.join(out, `${name}.raw.mp4`), fin = path.join(out, `${name}.mp4`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.toFixed(3), "-to", e.toFixed(3), "-i", path.join(dir, "assets/vo", VO.wav), "-ar", "44100", "-ac", "1", "-b:a", "128k", mp3]);
  execFileSync("node", [fal, "avatar", "--image", img, "--audio", mp3, "--out", raw], { stdio: "inherit", env: process.env });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-an", "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", fin]);
  fs.rmSync(raw); fs.rmSync(mp3);
  console.log(`${fin} ok`);
}
