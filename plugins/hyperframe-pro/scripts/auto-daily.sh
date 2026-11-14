#!/usr/bin/env bash
# Buat COUNT video otomotif (default 2) dan jadwalkan ke Buffer jam 12:00 dan 16:00 WIB hari ini.
# Env: COUNT, MODE (full|dry), secrets: ANTHROPIC_API_KEY PIXABAY_API_KEY ELEVENLABS_API_KEY FAL_KEY BUFFER_TOKEN, GH_TOKEN
set -uo pipefail
S=plugins/hyperframe-pro/scripts
SLOTS=("12:00" "16:00")
COUNT=${COUNT:-2}; MODE=${MODE:-full}
git config user.name "github-actions[bot]"; git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

set_status() { node -e 'const fs=require("fs");const q=JSON.parse(fs.readFileSync("queue/queue.json"));const i=q.find(x=>x.slug===process.argv[1]);if(i){i.status=process.argv[2];if(process.argv[3])i.error=process.argv[3];}fs.writeFileSync("queue/queue.json",JSON.stringify(q,null,2)+"\n")' "$1" "$2" "${3:-}"; }

commit_meta() { # $1=slug : simpan naskah, storyboard, antrian (tanpa klip/audio/presenter berat)
  git add -A -- queue "videos/$1" ":(exclude)videos/$1/assets/clips" ":(exclude)videos/$1/assets/presenter" ":(exclude)videos/$1/assets/vo/*.wav" ":(exclude)videos/$1/assets/vo/*.mp3"
  git commit -qm "auto: $1" || true
  git pull --rebase -q origin main && git push -q origin HEAD:main || echo "::warning::push ke main gagal untuk $1"
}

make_one() {
  local n=$1 slot=$2 out slug D mp4 tmp
  out=$(node $S/auto-video.mjs create --n "$n") || { echo "$out"; return 1; }
  echo "$out"
  slug=$(echo "$out" | sed -n 's/^SLUG=//p' | tail -1); D="videos/$slug"
  [ -n "$slug" ] || return 1
  if [ "$MODE" = dry ]; then set_status "$slug" draft "mode dry"; commit_meta "$slug"; return 0; fi
  fail() { echo "::error::$slug: $1"; set_status "$slug" failed "$1"; commit_meta "$slug"; return 1; }
  node $S/tts.mjs "$D/script.json" "$D/assets/vo" || { fail "suara (ElevenLabs) gagal"; return 1; }
  node $S/presenter-clips.mjs "$D" || { fail "presenter lip-sync (fal/Kling) gagal, cek saldo fal"; return 1; }
  node "$D/build.mjs" "$D" || { fail "build pertama gagal"; return 1; }
  node $S/auto-video.mjs prep "$D" || { fail "penyesuaian klip Pixabay gagal"; return 1; }
  node "$D/build.mjs" "$D" || { fail "build kedua gagal"; return 1; }
  node $S/lint.mjs "$D" "$D/build.mjs" || { fail "lint gagal"; return 1; }
  (cd "$D" && node build.mjs . && npx -y hyperframes render) || { fail "render gagal"; return 1; }
  mp4=$(find "$D" -name '*.mp4' -not -path "$D/assets/*" | head -n1)
  [ -n "$mp4" ] || { fail "mp4 tidak ditemukan"; return 1; }
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$mp4"); echo "durasi $dur s"
  tmp=$(mktemp -d); cp "$mp4" "$tmp/video.mp4"
  ( cd "$tmp" && git init -q -b "renders-$slug" && git config user.name "github-actions[bot]" && git config user.email "41898282+github-actions[bot]@users.noreply.github.com" \
    && git add -A && git commit -qm "Render $slug" && git push -qf "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" "renders-$slug" ) || { fail "publish branch gagal"; return 1; }
  set_status "$slug" ready
  node $S/buffer-queue.mjs --slug "$slug" --time "$slot" || { set_status "$slug" ready "jadwal Buffer gagal"; commit_meta "$slug"; echo "::error::$slug: penjadwalan Buffer gagal"; return 1; }
  commit_meta "$slug"
}

# Henti total: kalau ada video gagal yang belum diakui, jangan produksi apa pun (hindari buang biaya berulang).
if [ "$MODE" = full ]; then
  nfail=$(node -e 'const q=JSON.parse(require("fs").readFileSync("queue/queue.json"));console.log(q.filter(x=>x.status==="failed").length)')
  if [ "$nfail" -gt 0 ]; then
    if [ "${RESUME:-no}" = yes ]; then
      node -e 'const fs=require("fs");const q=JSON.parse(fs.readFileSync("queue/queue.json"));q.forEach(x=>{if(x.status==="failed")x.status="failed-ack"});fs.writeFileSync("queue/queue.json",JSON.stringify(q,null,2)+"\n")'
      echo "Lanjut atas permintaan (resume=yes): kegagalan sebelumnya diakui."
    else
      echo "::error::OTOMATISASI BERHENTI: ada $nfail video gagal di queue/queue.json. Perbaiki penyebabnya, lalu jalankan manual dengan resume=yes."
      exit 1
    fi
  fi
fi

ok=0
for n in $(seq 1 "$COUNT"); do
  echo "::group::Video $n (tayang ${SLOTS[$((n-1))]} WIB)"
  if make_one "$n" "${SLOTS[$((n-1))]}"; then ok=$((ok+1)); echo "::endgroup::"
  else echo "::endgroup::"; echo "::error::Video $n gagal. Otomatisasi dihentikan, video berikutnya tidak dibuat."; halted=1; break; fi
done

# bersihkan branch render yang lebih tua dari 3 hari
cutoff=$(date -u -d '3 days ago' +%Y%m%d)
for b in $(git ls-remote --heads origin 'renders-2*' | sed 's#.*refs/heads/##'); do
  d=${b#renders-}; d=${d:0:8}
  [[ "$d" =~ ^[0-9]{8}$ ]] && [ "$d" -lt "$cutoff" ] && git push -q origin --delete "$b" || true
done
echo "Selesai: $ok dari $COUNT video"
[ "${halted:-0}" = 0 ] || exit 1
