// 把 YouTube 影片轉成帶時間戳的原語逐字稿，給 media-to-post 用。
// 先找 YouTube 人工字幕；沒有就下載音訊，用 Workers AI whisper-large-v3-turbo 轉錄。
//
//   node scripts/transcribe.mjs <youtube-url|video-id> [--lang en] [--out dir] [--prompt "專有名詞…"] [--whisper]
//
// 輸出到 --out（預設 .work/media-to-post/<id>/）：
//   transcript.raw.vtt    原始字幕或轉錄結果（VTT）
//   transcript.meta.json  來源類型（youtube-manual / whisper）、模型、語言、分段長度
// Workers AI 呼叫方式：有 CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN 就打 REST（雲端 session 用這條）；
// 否則用 wrangler getPlatformProxy 的 AI 綁定（本機已 wrangler login）。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const MODEL = '@cf/openai/whisper-large-v3-turbo';
const CHUNK = 300;
const CONC = 4;

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const input = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!input) {
  console.error('用法：node scripts/transcribe.mjs <youtube-url|video-id> [--lang en] [--out dir] [--prompt "…"] [--whisper]');
  process.exit(1);
}
const id = input.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? input;
const url = `https://www.youtube.com/watch?v=${id}`;
const lang = opt('lang', 'en');
const prompt = opt('prompt', undefined);
const outDir = opt('out', `.work/media-to-post/${id}`);
const forceWhisper = args.includes('--whisper');
fs.mkdirSync(outDir, { recursive: true });

const has = (cmd) => {
  try {
    execFileSync('sh', ['-c', `command -v ${cmd}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};
const ytdlp = (extra) => {
  const [bin, pre] = has('yt-dlp') ? ['yt-dlp', []] : ['uvx', ['yt-dlp']];
  const js = has('node') ? ['--js-runtimes', 'node'] : [];
  return execFileSync(bin, [...pre, ...js, ...extra, url], { stdio: 'pipe' }).toString();
};
const vttTime = (x) => {
  const ms = Math.round(x * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}.${p(ms % 1000, 3)}`;
};
const writeMeta = (meta) =>
  fs.writeFileSync(path.join(outDir, 'transcript.meta.json'), JSON.stringify({ videoId: id, url, lang, fetchedAt: new Date().toISOString(), ...meta }, null, 2));

// 1. YouTube 人工字幕（不取自動字幕：自動字幕品質不如 Whisper，也常拿不到）
if (!forceWhisper) {
  try {
    ytdlp(['-q', '--skip-download', '--write-subs', '--sub-langs', lang, '--sub-format', 'vtt', '-o', path.join(outDir, 'yt.%(ext)s')]);
    const sub = fs.readdirSync(outDir).find((f) => f.startsWith('yt.') && f.endsWith('.vtt'));
    if (sub) {
      fs.renameSync(path.join(outDir, sub), path.join(outDir, 'transcript.raw.vtt'));
      writeMeta({ source: 'youtube-manual', note: 'YouTube 人工字幕，未經本專案校正' });
      console.log(`youtube-manual → ${outDir}/transcript.raw.vtt`);
      process.exit(0);
    }
  } catch (e) {
    console.log('人工字幕查詢失敗，改用 Whisper：', String(e.stderr ?? e).slice(0, 200));
  }
}

// 2. 下載音訊 → 切 5 分鐘段 → Whisper。音訊放系統暫存區，跑完刪掉，不留在 .work/（會被 commit）
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `transcribe-${id}-`));
const audio = path.join(tmp, 'audio.m4a');
try {
  ytdlp(['-q', '-f', 'bestaudio[ext=m4a]/bestaudio', '-o', audio]);
} catch (e) {
  console.error('音訊下載失敗（雲端常見原因：網域不在白名單，或 YouTube 要求登入驗證機器人）：');
  console.error(String(e.stderr ?? e).slice(0, 500));
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(2);
}
const chunkDir = path.join(tmp, 'chunks');
fs.mkdirSync(chunkDir);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', audio, '-ac', '1', '-ar', '16000', '-b:a', '32k', '-f', 'segment', '-segment_time', String(CHUNK), `${chunkDir}/%03d.mp3`]);
const files = fs.readdirSync(chunkDir).filter((f) => f.endsWith('.mp3')).sort();

let run;
let dispose = async () => {};
const { CLOUDFLARE_ACCOUNT_ID: acct, CLOUDFLARE_API_TOKEN: token } = process.env;
if (acct && token) {
  run = async (body) => {
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${acct}/ai/run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!r.ok || !j.success) throw new Error(`HTTP ${r.status} ${JSON.stringify(j.errors ?? j).slice(0, 200)}`);
    return j.result;
  };
} else {
  const { getPlatformProxy } = await import('wrangler');
  const proxy = await getPlatformProxy({ configPath: 'wrangler.jsonc' });
  run = (body) => proxy.env.AI.run(MODEL, body);
  dispose = proxy.dispose;
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k], k);
      }
    }),
  );
  return out;
}

try {
  const segs = await pool(files, CONC, async (f, k) => {
    const body = { audio: fs.readFileSync(path.join(chunkDir, f)).toString('base64'), language: lang, ...(prompt && { initial_prompt: prompt }) };
    for (let t = 0; t < 4; t++) {
      try {
        const r = await run(body);
        return (r.segments ?? []).map((s) => ({ s: s.start + k * CHUNK, e: s.end + k * CHUNK, t: s.text.trim() }));
      } catch (e) {
        console.log('retry', f, String(e).slice(0, 160));
        await new Promise((r) => setTimeout(r, 5000 * (t + 1)));
      }
    }
    throw new Error(`chunk failed ${f}`);
  });
  const flat = segs.flat().filter((s) => s.t);
  const vtt = 'WEBVTT\n\n' + flat.map((s) => `${vttTime(s.s)} --> ${vttTime(s.e)}\n${s.t}\n`).join('\n');
  fs.writeFileSync(path.join(outDir, 'transcript.raw.vtt'), vtt);
  writeMeta({
    source: 'whisper',
    model: MODEL,
    chunkSeconds: CHUNK,
    chunks: files.length,
    lastCueSeconds: flat.at(-1)?.e ?? null,
    note: `機器轉錄，未經人工校對；每 ${CHUNK / 60} 分鐘一段分開轉錄，段落交界可能斷句`,
  });
  console.log(`whisper ${files.length} chunks → ${outDir}/transcript.raw.vtt`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
  await dispose();
}
