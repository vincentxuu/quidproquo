// 沒有字幕軌的課程影片：下載音訊，用專案的 Cloudflare AI 綁定（Workers AI whisper-large-v3-turbo）轉錄成帶時間戳的逐字稿。
// 用法：node .agents/skills/post/scripts/transcribe-course-videos.mjs <lectures.json> <工作目錄>
//   lectures.json：[{ "key": "F01", "title": "機器學習基石 第 1 堂 The Learning Problem", "terms": "PLA、hypothesis", "language": "zh",
//                    "videos": [{ "id": "<YouTube 11 碼>", "section": "What Is Machine Learning", "seconds": 1109 }] }]
//   工作目錄底下會產生 audio/、subs/、transcripts/<key>.txt。可重跑，已完成的會跳過。
// 需要 uvx（跑 yt-dlp）、ffmpeg，以及已登入且有 AI 權限的 wrangler。費用記在專案的 Cloudflare 帳號（約每分鐘音訊 0.0005 美元）。
// 逐字稿是機器轉錄：每 5 分鐘一段分開轉，交界可能斷句或出現重複的幻聽句，術語會聽錯；公式、數字、人名以講義或原始頁面為準。
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { getPlatformProxy } from 'wrangler';
const [listPath, S] = process.argv.slice(2);
if (!listPath || !S) { console.error('usage: transcribe-course-videos.mjs <lectures.json> <workdir>'); process.exit(1); }
const L = JSON.parse(fs.readFileSync(listPath, 'utf8'));
for (const d of ['audio', 'subs', 'transcripts', 'chunks']) fs.mkdirSync(`${S}/${d}`, { recursive: true });
const CHUNK = 300, CONC = 4;
const ts = x => { x = Math.floor(x); return [x / 3600, x % 3600 / 60, x % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':'); };
const { env, dispose } = await getPlatformProxy({ configPath: 'wrangler.jsonc' });
async function pool(items, n, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; }
try {
  for (const o of L) {
    const key = o.key;
    if (fs.existsSync(`${S}/transcripts/${key}.txt`)) continue;
    const language = o.language ?? 'zh';
    const prompt = language === 'zh' ? `以下是課程「${o.title}」的錄影，繁體中文授課，夾雜英文術語：${o.terms ?? ''}。` : `Lecture recording: ${o.title}. Terms: ${o.terms ?? ''}.`;
    const parts = [];
    for (const v of o.videos) {
      const j = `${S}/subs/${v.id}.cf.json`;
      if (!fs.existsSync(j)) {
        const a = `${S}/audio/${v.id}.m4a`;
        for (let k = 0; k < 3 && !fs.existsSync(a); k++) { try { execFileSync('uvx', ['yt-dlp', '--js-runtimes', 'node', '-q', '-f', 'bestaudio[ext=m4a]/bestaudio', '-o', a, `https://www.youtube.com/watch?v=${v.id}`], { stdio: 'pipe' }); } catch { await new Promise(r => setTimeout(r, 15000)); } }
        if (!fs.existsSync(a)) { console.log('DOWNLOAD FAILED', key, v.id); continue; }
        const dir = `${S}/chunks/${v.id}`; fs.mkdirSync(dir, { recursive: true });
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', a, '-ac', '1', '-ar', '16000', '-b:a', '32k', '-f', 'segment', '-segment_time', String(CHUNK), `${dir}/%03d.mp3`]);
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).sort();
        const res = await pool(files, CONC, async (f, k) => {
          const audio = fs.readFileSync(`${dir}/${f}`).toString('base64');
          for (let t = 0; t < 4; t++) {
            try { const r = await env.AI.run('@cf/openai/whisper-large-v3-turbo', { audio, language, initial_prompt: prompt }); return (r.segments ?? []).map(s => ({ s: s.start + k * CHUNK, e: s.end + k * CHUNK, t: s.text })); }
            catch (e) { console.log('retry', v.id, f, String(e).slice(0, 120)); await new Promise(r => setTimeout(r, 5000 * (t + 1))); }
          }
          throw new Error(`chunk failed ${v.id} ${f}`);
        });
        fs.writeFileSync(j, JSON.stringify(res.flat()));
        fs.rmSync(dir, { recursive: true });
        console.log('done', key, v.id, v.section, files.length, 'chunks');
      }
      parts.push([v, JSON.parse(fs.readFileSync(j, 'utf8'))]);
    }
    if (parts.length !== o.videos.length) continue;
    let txt = `# ${o.title}：機器轉錄逐字稿（Whisper large-v3-turbo，未經人工校對）\n# 時間戳是各支影片自己的時間，每 5 分鐘一段分開轉錄，段與段的交界可能斷句。術語可能被聽錯，公式與術語以講義為準。\n`;
    for (const [v, segs] of parts) {
      txt += `\n\n===== 影片 ${v.id}｜${v.section}｜${Math.floor(v.seconds / 60)}:${String(v.seconds % 60).padStart(2, '0')} =====\n\n`;
      for (const s of segs) txt += `[${ts(s.s)}] ${s.t.trim()}\n`;
    }
    fs.writeFileSync(`${S}/transcripts/${key}.txt`, txt);
    console.log('LECTURE', key, 'ready');
  }
  console.log('ALL DONE');
} finally { await dispose(); }
