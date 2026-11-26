#!/usr/bin/env node
// 器材文找影片：先掃可信頻道的上傳列表，再用關鍵字補漏；過濾雜訊、標日期，輸出候選清單。
// 用法見 --help。頻道清單在 scripts/config/climbing-gear-channels.json。
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const USAGE = `用法：node scripts/yt-candidates.mjs --match "<標題 regex>" [選項]

  --match <regex>     標題要符合的主題（不分大小寫），例："quick ?draw|ヌンチャク|快扣|퀵드로우"
  --since <date>      日期門檻，預設 2024-01-01
  --tiers <list>      要掃的頻道層級，預設 1,2,3（見設定檔 tiers）
  --channels <path>   頻道設定，預設 scripts/config/climbing-gear-channels.json
  --search <q;q;...>  另外用關鍵字搜尋補漏（每組自動檢查標題有沒有攀岩字樣）
  --verify            逐支查確切上傳日期（慢；只查通過篩選的候選）
  --min-seconds <n>   排除太短的片，預設 90
  --limit <n>         每個頻道最多看幾支最新影片，預設 400
  --sleep <sec>       每次請求間隔，預設 2（--verify 逐支查時至少 5）
  --browser <name>    yt-dlp 讀 cookies 的瀏覽器，預設 chrome；none 表示不用
  --out <path>        輸出 Markdown；同名 .json 另存原始資料`;

// approximate_date 從「N 年前」換算，誤差可達半年以上，所以頻道列表階段把門檻往前放寬。
export const APPROX_MARGIN_DAYS = 270;

export const NOISE = [
  /쇼핑|추천\s*(top|베스트|best|판매)|판매순위|가성비|알리익스프레스/i, // 韓文 AI 購物排行
  /top\s*\d+|check (latest )?price|best .* of 20\d\d - top/i,             // 英文購物排行
  /nunchaku|nunchuck|ヌンチャク(アーティスト|パフォーマー|講座|チャレンジ|の選び方(?!.*(クライミング|クイックドロー)))|雙節棍|双节棍/i, // 雙節棍
  /\brep\b.*quick ?draw|dumbbell|啞鈴/i,                                     // REP QuickDraw 啞鈴
  /marvel|game|gaming|mod!|red dead|ゲーム/i,                                // 遊戲
  /工具箱|tool ?box/i,
];

export const CLIMBING_WORDS = /climb|belay|carabiner|攀|岩|確保|クライミング|ボルダ|登山|클라이밍|등반|암벽|escalade|arrampic|klettern|bould/i;

export function toDate(yyyymmdd) {
  return /^\d{8}$/.test(yyyymmdd ?? '') ? `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6)}` : null;
}

export function shiftDays(date, days) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isNoise({ title = '', channel = '', duration }, minSeconds = 90) {
  if (typeof duration === 'number' && duration > 0 && duration < minSeconds) return 'too_short';
  const text = `${title} ${channel}`;
  return NOISE.some(pattern => pattern.test(text)) ? 'noise_pattern' : null;
}

export function parseLine(line) {
  const [id, date, duration, channel, ...rest] = line.split('\t');
  if (!/^[\w-]{11}$/.test(id ?? '')) return null;
  return { id, date: toDate(date), duration: Number(duration) || null, channel: channel && channel !== 'NA' ? channel : '', title: rest.join('\t') };
}

function ytdlp(args, { browser }) {
  const cookie = browser && browser !== 'none' ? ['--cookies-from-browser', browser] : [];
  const result = spawnSync('yt-dlp', [...cookie, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw new Error(`yt-dlp 無法執行：${result.error.message}`);
  return { ok: result.status === 0, out: result.stdout ?? '', err: result.stderr ?? '' };
}

const sleep = seconds => new Promise(done => setTimeout(done, seconds * 1000));
const PRINT = '%(id)s\t%(upload_date)s\t%(duration)s\t%(channel)s\t%(title)s';

export async function scanChannel(channel, { limit, browser }) {
  const url = channel.url.replace(/\/$/, '') + '/videos';
  const { out } = ytdlp(['--flat-playlist', '--extractor-args', 'youtubetab:approximate_date', '--playlist-end', String(limit), '--print', PRINT, url], { browser });
  return out.split('\n').map(parseLine).filter(Boolean).map(item => ({ ...item, channel: item.channel || channel.name, source: 'channel', tier: channel.tier, ties: channel.ties, dateKind: 'approx' }));
}

export async function searchKeyword(query, { browser }) {
  const { out } = ytdlp(['--flat-playlist', '--print', PRINT, `ytsearch25:${query}`], { browser });
  return out.split('\n').map(parseLine).filter(Boolean).map(item => ({ ...item, date: null, source: `search:${query}`, tier: null, ties: '', dateKind: 'unknown' }));
}

export async function exactDate(id, { browser, sleepSeconds }) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { ok, out } = ytdlp(['--skip-download', '--print', '%(upload_date)s', `https://www.youtube.com/watch?v=${id}`], { browser });
    const date = toDate(out.trim());
    if (ok && date) return date;
    await sleep(sleepSeconds * (attempt + 2));
  }
  return null;
}

export function filterCandidates(items, { match, since, minSeconds, exact = false }) {
  const loose = shiftDays(since, -APPROX_MARGIN_DAYS);
  const kept = [];
  const dropped = { off_topic: 0, too_old: 0, too_short: 0, noise_pattern: 0, not_climbing: 0, duplicate: 0 };
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) { dropped.duplicate++; continue; }
    if (!match.test(item.title)) { dropped.off_topic++; continue; }
    const noise = isNoise(item, minSeconds);
    if (noise) { dropped[noise]++; continue; }
    if (item.source.startsWith('search:') && !CLIMBING_WORDS.test(`${item.title} ${item.channel}`)) { dropped.not_climbing++; continue; }
    const threshold = exact || item.dateKind === 'exact' ? since : loose;
    if (item.date && item.date < threshold) { dropped.too_old++; continue; }
    seen.add(item.id);
    kept.push(item);
  }
  return { kept, dropped };
}

function toMarkdown({ since, match, kept, dropped, verified }) {
  const rows = [...kept].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  const lines = [
    `# YouTube 候選（門檻 ${since}，主題 /${match.source}/i）`,
    '',
    `日期欄：exact＝逐支查的確切日期；approx＝頻道列表的大約日期（誤差可達半年，用前要 --verify 或手動確認）；unknown＝關鍵字搜尋結果，未查日期。${verified ? '' : '本次沒有跑 --verify。'}`,
    `排除：${Object.entries(dropped).map(([k, v]) => `${k} ${v}`).join('、')}`,
    '',
    '| 日期 | 種類 | 層級 | 頻道 | 長度 | 標題 | 商業關係 |',
    '|---|---|---|---|---|---|---|',
    ...rows.map(r => `| ${r.date ?? '—'} | ${r.dateKind} | ${r.tier ?? '搜尋'} | ${r.channel} | ${r.duration ? `${Math.round(r.duration / 60)} 分` : '—'} | [${r.title.replace(/\|/g, '／')}](https://www.youtube.com/watch?v=${r.id}) | ${r.ties || ''} |`),
    '',
    '下一步：每支要用都得抓字幕核對時間點與原話、看說明欄的贊助與導購連結（見 .agents/skills/post/references/climbing-gear-videos.md）。',
  ];
  return lines.join('\n') + '\n';
}

export async function main(args = process.argv.slice(2)) {
  const opt = { since: '2024-01-01', tiers: [1, 2, 3], channels: 'scripts/config/climbing-gear-channels.json', search: [], verify: false, minSeconds: 90, limit: 400, sleep: 2, browser: 'chrome', out: null, match: null };
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    const value = () => { const v = args[++i]; if (v === undefined) throw new Error(`${key} 需要參數`); return v; };
    if (key === '--help') { console.log(USAGE); return; }
    else if (key === '--match') opt.match = new RegExp(value(), 'i');
    else if (key === '--since') opt.since = value();
    else if (key === '--tiers') opt.tiers = value().split(',').map(Number);
    else if (key === '--channels') opt.channels = value();
    else if (key === '--search') opt.search = value().split(';').map(s => s.trim()).filter(Boolean);
    else if (key === '--verify') opt.verify = true;
    else if (key === '--min-seconds') opt.minSeconds = Number(value());
    else if (key === '--limit') opt.limit = Number(value());
    else if (key === '--sleep') opt.sleep = Number(value());
    else if (key === '--browser') opt.browser = value();
    else if (key === '--out') opt.out = value();
    else throw new Error(`不認得的選項：${key}\n${USAGE}`);
  }
  if (!opt.match) throw new Error(`--match 必填\n${USAGE}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opt.since)) throw new Error('--since 要是 YYYY-MM-DD');

  const config = JSON.parse(await readFile(resolve(opt.channels), 'utf8'));
  const channels = config.channels.filter(channel => opt.tiers.includes(channel.tier));
  const items = [];
  for (const channel of channels) {
    const found = await scanChannel(channel, opt);
    if (!found.length) console.error(`警告：${channel.name} 沒有抓到影片（網址錯、被限流或頻道無影片）`);
    items.push(...found);
    await sleep(opt.sleep);
  }
  for (const query of opt.search) { items.push(...await searchKeyword(query, opt)); await sleep(opt.sleep); }

  let { kept, dropped } = filterCandidates(items, opt);
  if (opt.verify) {
    const pause = Math.max(opt.sleep, 5);
    for (const item of kept) {
      const date = await exactDate(item.id, { browser: opt.browser, sleepSeconds: pause });
      if (date) Object.assign(item, { date, dateKind: 'exact' });
      await sleep(pause);
    }
    const before = kept.length;
    kept = kept.filter(item => item.dateKind !== 'exact' || item.date >= opt.since);
    dropped.too_old += before - kept.length;
  }

  const report = toMarkdown({ since: opt.since, match: opt.match, kept, dropped, verified: opt.verify });
  if (opt.out) {
    await mkdir(dirname(resolve(opt.out)), { recursive: true });
    await writeFile(resolve(opt.out), report);
    await writeFile(resolve(opt.out.replace(/\.md$/, '') + '.json'), JSON.stringify({ since: opt.since, match: opt.match.source, scannedChannels: channels.length, dropped, kept }, null, 2) + '\n');
    console.log(`${kept.length} 支候選（掃 ${channels.length} 個頻道、${opt.search.length} 組關鍵字）→ ${opt.out}`);
  } else process.stdout.write(report);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
