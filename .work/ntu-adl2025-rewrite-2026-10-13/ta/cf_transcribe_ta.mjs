// 用專案的 Cloudflare AI 綁定（Workers AI whisper-large-v3-turbo）轉錄 ADL 助教課影片。可重跑，已完成的會跳過。
// 注意：下面清單裡有七支影片的主題標錯了（正確對照見各逐字稿檔頭與 rewrite-log.md），重跑前要先改。
// 做法沿用 .work/ntu-htlin-ml/cf_transcribe.mjs。
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { getPlatformProxy } from 'wrangler';
const S = '.work/ntu-adl2025-rewrite-2026-10-13/ta';
const V = [
  ['zuiACAhRUzA', 'PyTorch Tutorial', 'PyTorch、tensor、autograd、Dataset、DataLoader、nn.Module、optimizer、Colab、GPU'],
  ['RYkEoCkJWeA', 'PyTorch Debugging', 'PyTorch、ipdb、breakpoint、tensor shape、debug、Colab'],
  ['BBw-ki4_06o', 'NLP Project Lifecycle 1', 'Hugging Face、datasets、tokenizer、transformers、Trainer、pipeline、Gradio、BERT'],
  ['TzhCZOILzlI', 'NLP Project Lifecycle 2', 'Hugging Face、datasets、tokenizer、transformers、Trainer、pipeline、Gradio'],
  ['AgZuF7lsu-8', 'NLP Project Lifecycle 3', 'Hugging Face、datasets、tokenizer、transformers、Trainer、pipeline、Gradio、demo'],
  ['4JPJkLxW84w', 'Underlying Logics of Projects', 'text classification、token classification、multiple choice、question answering、sequence to sequence、tokenizer、BERT、T5'],
  ['eGQMzbhokg0', 'LLM LoRA Training', 'LoRA、QLoRA、quantization、PEFT、adapter、rank、bitsandbytes、LLM'],
  ['anK1_PK464k', 'LLM Basics & MoE', 'Transformer、decoder-only、LLaMA、RoPE、RMSNorm、SwiGLU、Mixture of Experts、MoE、attention'],
  ['255ZzsTTHoU', 'LLM Inference & Evaluation', 'quantization、GGUF、llama.cpp、perplexity、benchmark、LLM as judge、inference'],
  ['mulWMLla-AM', 'LLM Deployment', 'vLLM、OpenAI API、serving、batching、KV cache、throughput、deployment'],
];
const CHUNK = 300, CONC = 4;
const ts = x => { x = Math.floor(x); return [x / 60, x % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':'); };
const { env, dispose } = await getPlatformProxy({ configPath: 'wrangler.jsonc' });
async function pool(items, n, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; }
try {
  fs.mkdirSync(`${S}/audio`, { recursive: true });
  for (const [id, title, terms] of V) {
    const out = `${S}/${id}.txt`;
    if (fs.existsSync(out)) continue;
    const prompt = `以下是台灣大學深度學習之應用（ADL）的助教課「${title}」，繁體中文講解，夾雜英文術語：${terms}。`;
    const a = `${S}/audio/${id}.m4a`;
    for (let k = 0; k < 3 && !fs.existsSync(a); k++) { try { execFileSync('yt-dlp', ['-q', '-f', 'bestaudio[ext=m4a]/bestaudio', '-o', a, `https://www.youtube.com/watch?v=${id}`], { stdio: 'pipe' }); } catch { await new Promise(r => setTimeout(r, 15000)); } }
    if (!fs.existsSync(a)) { console.log('DOWNLOAD FAILED', id); continue; }
    const dir = `${S}/chunks-${id}`; fs.mkdirSync(dir, { recursive: true });
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', a, '-ac', '1', '-ar', '16000', '-b:a', '32k', '-f', 'segment', '-segment_time', String(CHUNK), `${dir}/%03d.mp3`]);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).sort();
    const res = await pool(files, CONC, async (f, k) => {
      const audio = fs.readFileSync(`${dir}/${f}`).toString('base64');
      for (let t = 0; t < 4; t++) {
        try { const r = await env.AI.run('@cf/openai/whisper-large-v3-turbo', { audio, language: 'zh', initial_prompt: prompt }); return (r.segments ?? []).map(s => ({ s: s.start + k * CHUNK, t: s.text })); }
        catch (e) { console.log('retry', id, f, String(e).slice(0, 120)); await new Promise(r => setTimeout(r, 5000 * (t + 1))); }
      }
      throw new Error(`chunk failed ${id} ${f}`);
    });
    let txt = `# ADL 助教課 ${title}（${id}）：機器轉錄逐字稿（Whisper large-v3-turbo，未經人工校對）。每 5 分鐘一段分開轉錄，術語可能聽錯。\n`;
    for (const s of res.flat()) txt += `[${ts(s.s)}] ${s.t.trim()}\n`;
    fs.writeFileSync(out, txt);
    fs.rmSync(dir, { recursive: true });
    console.log('done', id, title, files.length, 'chunks');
  }
  console.log('ALL DONE');
} finally { await dispose(); }
