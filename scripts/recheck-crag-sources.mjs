#!/usr/bin/env node
// 回查岩場文章裡會過期的事實來源（封閉令、時刻表、費用、纜車／接駁日期、bolt 狀況）。
//
// 為什麼有這支：岩場文章上線後，封閉令與時刻表會在幾週內改變，但文章不會自己知道。
// 這支讀 .research/index/crag-facts.jsonl（build-crag-fact-index.mjs 產生）裡 volatile 的行，
// 逐一抓來源網址、存內容 hash，和上次比對，列出哪些網址變了或抓不到，交給人／post-update 處理。
//
// 用法：
//   node scripts/recheck-crag-sources.mjs                 抓全部 volatile 來源；第一次執行建立基準
//   node scripts/recheck-crag-sources.mjs --crag arco     只抓 crag 名稱含 "arco" 的
//   node scripts/recheck-crag-sources.mjs --strict        有變動或失敗時 exit 1（排程用）
//   node scripts/recheck-crag-sources.mjs --dry-run       不寫快照
//   node scripts/recheck-crag-sources.mjs --reader        直接抓被擋（403／429／bot 頁）時改用 r.jina.ai 公開 reader 重抓；
//                                                        快照記 via，只和同一管道的上次 hash 比較
// 輸出：.research/index/crag-source-snapshots.json
//   { "<url>": { hash, status, bytes, checked, firstSeen, lastChanged, error?, crags: [...] } }
//
// 只用一般 fetch（無 API key、無 cookie）。被 Cloudflare 擋的頁（theCrag 常見）會記為 failed；
// 那類來源要用 Exa / jina 等工具手動回查，見 docs/climbing-sources.md「定期回查」。

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const INDEX = opt('--index', '.research/index/crag-facts.jsonl');
const SNAP = opt('--out', '.research/index/crag-source-snapshots.json');
const CRAG = opt('--crag', '');
const TIMEOUT = Number(opt('--timeout', '20000'));
const CONCURRENCY = Number(opt('--concurrency', '6'));
const STRICT = args.includes('--strict');
const DRY = args.includes('--dry-run');
const READER = args.includes('--reader');
const today = new Date().toISOString().slice(0, 10);

// 錨點：claim 裡的數字、日期、時間、金額與引號原文。頁面整體 hash 很吵（廣告、相關新聞、瀏覽數），
// 所以「變了」的判準是：上次找得到的錨點這次不見了。整頁 hash 只當參考（drift）。
export function claimTokens(claim) {
  const out = new Set();
  for (const m of claim.matchAll(/\d[\d:.,–-]*\d|\b\d{2,}\b/g)) {
    const t = m[0].replace(/[–-]$/, '');
    if (t.length >= 2 && !/^(19|20)\d\d$/.test(t)) out.add(t);
    else if (/^(19|20)\d\d$/.test(t)) out.add(t);
  }
  for (const m of claim.matchAll(/[「"“]([^」"”]{8,80})[」"”]/g)) out.add(m[1].toLowerCase());
  return out;
}
const variants = (t) => [t, t.replace(/,/g, ''), t.replace(/,/g, '.'), t.replace(/–/g, '-'), t.replace(/:/g, '.')];
export function missingTokens(text, tokens) {
  const hay = text.toLowerCase().replace(/\s+/g, ' ');
  return [...tokens].filter((t) => !variants(t).some((v) => hay.includes(v)));
}

const facts = readFileSync(INDEX, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const targets = new Map();
for (const f of facts) {
  if (!f.volatile || (CRAG && !f.crag.includes(CRAG))) continue;
  const t = targets.get(f.source_url) ?? { crags: new Set(), types: new Set(), tokens: new Set() };
  for (const tok of claimTokens(f.claim)) t.tokens.add(tok);
  t.crags.add(f.crag);
  t.types.add(f.claim_type);
  targets.set(f.source_url, t);
}
const prev = existsSync(SNAP) ? JSON.parse(readFileSync(SNAP, 'utf8')) : {};
const firstRun = Object.keys(prev).length === 0;

// 只 hash 可見文字：去掉 script/style/註解與標籤，壓空白，降低版面或追蹤碼變動造成的假警報。
export function normalize(body, type) {
  if (!/html|xml/i.test(type)) return body;
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\b(csrf|nonce|token)[^\s]*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let readerChain = Promise.resolve();
async function check(url) {
  const direct = await fetchOnce(url);
  if (READER && direct.error && /HTTP (403|429|503)|bot-check|timeout/.test(direct.error)) {
    // 公開 reader 有速率限制（429）：一次一個、間隔 3 秒。
    readerChain = readerChain.then(() => new Promise((r) => setTimeout(r, 3000)));
    await readerChain;
    const viaReader = await fetchOnce(`https://r.jina.ai/${url}`);
    if (!viaReader.error) return { ...viaReader, via: 'jina', finalUrl: undefined };
    return { ...direct, error: `${direct.error}; reader: ${viaReader.error}` };
  }
  return { ...direct, via: 'direct' };
}

async function fetchOnce(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (quidproquo crag-source recheck)', accept: 'text/html,application/pdf,*/*' },
    });
    const type = res.headers.get('content-type') ?? '';
    const buf = Buffer.from(await res.arrayBuffer());
    if (!res.ok) return { status: res.status, error: `HTTP ${res.status}` };
    const text = /pdf|octet/i.test(type) ? buf : normalize(buf.toString('utf8'), type);
    if (typeof text === 'string' && text.length < 200) return { status: res.status, error: 'empty or bot-check page' };
    return { status: res.status, hash: createHash('sha256').update(text).digest('hex').slice(0, 16), bytes: buf.length, finalUrl: res.url, text: typeof text === 'string' ? text : '' };
  } catch (e) {
    return { status: 0, error: e.name === 'AbortError' ? `timeout ${TIMEOUT}ms` : String(e.cause?.code ?? e.message) };
  } finally {
    clearTimeout(timer);
  }
}

const urls = [...targets.keys()];
const results = {};
let i = 0;
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (i < urls.length) {
      const url = urls[i++];
      results[url] = await check(url);
    }
  }),
);

const changed = [];
const drifted = [];
const failed = [];
const added = [];
const next = { ...prev };
for (const url of urls) {
  const r = results[url];
  const p = prev[url];
  const crags = [...targets.get(url).crags];
  const types = [...targets.get(url).types];
  const entry = { ...(p ?? { firstSeen: today }), status: r.status, checked: today, crags, types };
  if (r.error) {
    entry.error = r.error;
    failed.push({ url, crags, error: r.error, before: p?.hash ? 'had baseline' : 'no baseline' });
  } else {
    delete entry.error;
    const tokens = targets.get(url).tokens;
    const missing = r.text ? missingTokens(r.text, tokens) : [];
    if (!p?.hash || (p.via ?? 'direct') !== r.via) added.push(url);
    else {
      const lost = missing.filter((t) => !(p.missing ?? []).includes(t));
      if (lost.length) {
        changed.push({ url, crags, types, since: p.checked, lost });
        entry.lastChanged = today;
      } else if (p.hash !== r.hash) drifted.push(url);
    }
    entry.anchors = tokens.size;
    entry.missing = missing;
    entry.hash = r.hash;
    entry.via = r.via;
    entry.bytes = r.bytes;
    if (r.finalUrl && r.finalUrl !== url) entry.finalUrl = r.finalUrl;
  }
  next[url] = entry;
}
if (!DRY) writeFileSync(SNAP, JSON.stringify(next, null, 2) + '\n');

console.log(`${firstRun ? 'Baseline' : 'Recheck'} ${today}: ${urls.length} volatile URLs — ok ${urls.length - failed.length}, failed ${failed.length}, changed ${changed.length}, drift-only ${drifted.length}, new baseline ${added.length}${DRY ? ' (dry run, not saved)' : ''}`);
if (changed.length) {
  console.log('\nChanged since last check (re-read the page, then update the post via post-update):');
  for (const c of changed) console.log(`  ~ ${c.url}\n      crags: ${c.crags.join(', ')} | claims: ${c.types.join(', ')} | anchors gone: ${c.lost.join(' · ')} | last seen ${c.since}`);
}
if (failed.length) {
  console.log('\nFailed (check manually with Exa / jina; plain fetch is often bot-blocked):');
  for (const f of failed) console.log(`  ! ${f.url} — ${f.error} [${f.crags.join(', ')}; ${f.before}]`);
}
process.exit(STRICT && (changed.length || failed.length) ? 1 : 0);
