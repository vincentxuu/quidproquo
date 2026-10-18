#!/usr/bin/env node
// 岩場事實索引：把研究筆記與審稿紀錄裡查過的事實拆成一行一筆，存 .research/index/crag-facts.jsonl。
//
// 為什麼有這支：義大利岩場系列（2026-10-18）的封閉令、時刻表、纜車日期散在 12 份研究筆記裡，
// 文章上線後沒有地方能一次列出「哪些事實會過期、出自哪個網址」。這份索引是 recheck-crag-sources.mjs 的輸入。
//
// 來源：
//   .research/<prefix>*.md      研究筆記：每個頂層 bullet = 一個來源；bullet 內以「;／；」切成多筆 claim。
//                               「Dropped / not used / unverified」段落不收。
//   .work/reviews/<prefix>*.md  審稿紀錄：post-verify 的 🟢（已確認）／🔵（已修）行用來標 review 狀態；
//                               🔵 行本身也收成 claim（審稿修正後的寫法）。
// 分級：scripts/config/climbing-source-tiers.json（人讀版 docs/climbing-sources.md）。
//
// 用法：
//   node scripts/build-crag-fact-index.mjs                          預設 prefix 2026-10-18-italy-crag，country Italy
//   node scripts/build-crag-fact-index.mjs --prefix 2026-10-12-japan-crag --country Japan --checked 2026-10-12
//   多個系列：分別跑，每次只覆寫該 prefix 的 crag 那幾行（其他國家的行保留）。

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PREFIX = opt('--prefix', '2026-10-18-italy-crag');
const COUNTRY = opt('--country', 'Italy');
const CHECKED = opt('--checked', PREFIX.slice(0, 10));
const OUT = opt('--out', '.research/index/crag-facts.jsonl');
const TIERS = JSON.parse(readFileSync('scripts/config/climbing-source-tiers.json', 'utf8')).rules;

export function tierOf(url) {
  let u;
  try { u = new URL(url); } catch { return { tier: '不能單獨撐', type: 'unknown' }; }
  const host = u.hostname.replace(/^www\./, '');
  const hp = host + u.pathname;
  for (const r of TIERS) {
    for (const m of r.match) {
      const hit = m.includes('/') ? hp.startsWith(m) : m.endsWith('.') ? host.includes(m) : host === m || host.endsWith(`.${m}`);
      if (hit) return { tier: r.tier, type: r.type };
    }
  }
  return { tier: '二手', type: 'unclassified' };
}

// claim_type：一筆 claim 只給一個主類別，依優先序比對關鍵字（封閉 > 器材 > 費用 > 交通 > 救援法規 > 季節 > 路線 > 熱門度）。
const TYPES = [
  ['closure', /clos|chius|vietat|divieto|interdett|prohibit|banned|ban\b|ordinanza|ordinance|封閉|禁攀|禁止|nesting|nidific|access issue|private land|privately owned|立入禁止|閉鎖/i],
  ['bolt_condition', /rebolt|richiodat|bolt(s|ed)? (are|were|condition)|rusty|corrod|stainless|resin|titani|anchor|bolting|spit|piastrin|打 bolt|換 bolt|鏽|錨栓|樹脂|確保站|豬尾|掛片|equipment by professionals|check of equipment/i],
  ['fee', /€|eur\b|euro|fee|ticket|pass\b|paid|toll|pedaggio|biglietto|收費|歐元|円/i],
  ['transport', /\bbus(es)?\b|bus&go|\btrain|station|stazione|timetable|orari|shuttle|navetta|cable ?car|lift|funivia|seggiovia|ferry|boat|parking|parcheggio|park (at|near)|drive|exit|A\d+\b|SS\d+|SP\d+|km\b|min(ute)?s? (walk|from)|approach|walk|rope ?way|ロープウ|バス|駅|停車|班次|時刻|巴士|火車|纜車|接駁|渡輪|開車|步行/i],
  ['rescue_law', /rescue|soccorso|cnsas|112|118|insurance|law|regulation|regolamento|legge|permit|permesso|救援|法規|許可/i],
  ['route_grade', /\b[3-9][abc]\+?\b|\b5\.\d{1,2}[abcd]?\b|\bV\d+\b|\b[3-8][ABC]\+?\b|UIAA|\b(VI|VII|VIII|IX)[+-]?\b|routes?\b|vie\b|tiri|pitch|sector|settore|m rope|quickdraw|draws|first ascent|FA\b|路線|難度/i],
  ['season', /season|winter|summer|spring|autumn|fall\b|month|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b(?! \d{4})|inverno|estate|shade|sun until|sunny|ora wind|temperature|°|季/i],
  ['popularity', /popular|crowd|busy|classic|repeats|ascents|stars?\b|polish|famous|人潮|熱門|磨亮/i],
];
export function claimType(text) {
  for (const [t, re] of TYPES) if (re.test(text)) return t;
  return 'general';
}
// volatile：會在文章生命週期內改變、需要定期回查的事實。
const VOLATILE_TRANSPORT = /timetable|orari|schedule|shuttle|navetta|lift|funivia|seggiovia|cable ?car|rope ?way|ロープウ|bus&go|ferry|boat|\d{1,2}[:.]\d{2}|\b(19|20)\d{2}\b|service|runs|summer only|期間|班次|時刻|open(s|ing)? (from|until)|dal .* al/i;
export function isVolatile(type, text) {
  if (['closure', 'bolt_condition', 'fee'].includes(type)) return true;
  if (type === 'transport' && VOLATILE_TRANSPORT.test(text)) return true;
  return false;
}

const URL_RE = /https?:\/\/[^\s)>\]"'`，、；]+/g;
const cleanUrl = (u) => u.replace(/[.,;:）)]+$/, '');

function bulletsOf(md) {
  const out = [];
  let section = '';
  let cur = null;
  for (const line of md.split('\n')) {
    if (/^#{2,3} /.test(line)) { section = line.replace(/^#+ /, ''); cur = null; continue; }
    if (/^- /.test(line)) { cur = { section, text: line.slice(2) }; out.push(cur); continue; }
    // 表格式筆記：| 來源（含網址） | 事實 | → 當成「來源: 事實」
    if (/^\|/.test(line) && !/^\|[\s|:-]+\|?$/.test(line)) {
      const c = line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((x) => x.trim());
      if (c.length >= 2 && URL_RE.test(c[0])) out.push({ section, text: `${c[0].replace(/[:：]/g, ' ').replace(/https? +\/\//g, 'https://')}: ${c.slice(1).join('; ')}` });
      URL_RE.lastIndex = 0;
      cur = null;
      continue;
    }
    if (cur && /^\s{2,}\S/.test(line)) { cur.text += ` ${line.trim()}`; continue; }
    if (!line.trim()) cur = null;
  }
  return out;
}

const SKIP_SECTION = /dropped|not used|unverified|未用|未查證|routes-by-level pass/i;
const nameKey = (s) => s.toLowerCase().replace(/\(.*?\)|（.*?）/g, '').replace(/[^a-z0-9぀-ヿ一-鿿]+/g, ' ').trim();

function parseNote(path) {
  const md = readFileSync(path, 'utf8');
  const facts = [];
  const byName = new Map(); // 短名稱 → URL，供沒附網址的後續 bullet 回填
  for (const b of bulletsOf(md)) {
    if (SKIP_SECTION.test(b.section)) continue;
    // 有些筆記寫裸網域（「planetmountain.com/en/crags/x.html: …」），補上 https://
    const bare = b.text.match(/^`?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/[^\s:`]*)?)`?(?=[\s:：(（])/i);
    if (bare && !/^https?:/.test(b.text)) b.text = `https://${bare[1]}${b.text.slice(bare[0].length)}`;
    // 筆記裡被截斷的網址（結尾 ... 或 …）不能回查，不收。
    const urls = [...b.text.matchAll(URL_RE)].map((m) => m[0]).filter((u) => !/\.\.\.$|…/.test(u)).map(cleanUrl);
    const plain = b.text.replace(URL_RE, '');
    const colon = plain.search(/[:：]/);
    const name = colon > 0 && colon < 120 ? plain.slice(0, colon).trim() : '';
    let url = urls[0];
    if (url && name) {
      byName.set(nameKey(name).split(' ')[0], url);
      for (const ab of name.matchAll(/\(([A-Z]{2,6})\)/g)) byName.set(ab[1].toLowerCase(), url);
    }
    if (!url && name) url = byName.get(nameKey(name).split(' ')[0]);
    if (!url) continue; // 沒有可回查的網址就不進索引
    const body = (colon > 0 && colon < 120 ? plain.slice(colon + 1) : plain).replace(/\s+/g, ' ').trim();
    for (const piece of body.split(/;\s|；/).map((s) => s.trim().replace(/[.。]$/, '')).filter((s) => s.length > 8)) {
      facts.push({ source_name: name || new URL(url).hostname, claim: piece, source_url: url, from: path });
    }
  }
  return facts;
}

function parseReview(path) {
  if (!existsSync(path)) return { confirmed: [], fixed: [] };
  const md = readFileSync(path, 'utf8');
  const pv = md.split(/^## /m).find((s) => s.startsWith('post-verify')) ?? '';
  const confirmed = [];
  const fixed = [];
  for (const line of pv.split('\n')) {
    const m = line.match(/^- (🟢|🔵)[^：:]*[：:]\s*(.*)$/);
    if (!m) continue;
    const head = line.slice(4, 4 + Math.max(0, line.search(/[：:]/) - 4));
    (m[1] === '🟢' ? confirmed : fixed).push({ head: nameKey(head.replace(/→.*$/, '')), body: m[2], line });
  }
  return { confirmed, fixed };
}

const crags = readdirSync('.research').filter((f) => f.startsWith(PREFIX) && f.endsWith('.md')).sort();
const rows = [];
for (const f of crags) {
  const slug = basename(f, '.md');
  const crag = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const note = join('.research', f);
  const review = join('.work/reviews', f);
  const { confirmed, fixed } = parseReview(review);
  const reviewText = [...confirmed, ...fixed].map((r) => `${r.head} ${r.body}`).join('\n').toLowerCase();
  for (const fact of parseNote(note)) {
    const type = claimType(fact.claim);
    const host = new URL(fact.source_url).hostname.replace(/^www\./, '').split('.')[0];
    const nk = nameKey(fact.source_name).split(' ')[0];
    const status = reviewText.includes(host.toLowerCase()) || (nk && reviewText.includes(nk)) ? 'confirmed' : 'note-only';
    rows.push({
      crag, country: COUNTRY, claim_type: type, claim: fact.claim, source_url: fact.source_url,
      ...(() => { const t = tierOf(fact.source_url); return { source_tier: t.tier, source_type: t.type }; })(),
      checked: CHECKED, volatile: isVolatile(type, fact.claim), review: status, note, review_record: review,
    });
  }
  // 🔵 行：審稿修正後的寫法，網址從行內或同名來源回填。
  for (const fx of fixed) {
    const urls = [...fx.line.matchAll(URL_RE)].map((m) => cleanUrl(m[0]));
    const url = urls[0] ?? rows.find((r) => r.crag === crag && (fx.line.toLowerCase().includes(new URL(r.source_url).hostname.replace(/^www\./, '').split('.')[0])))?.source_url;
    if (!url) continue;
    const claim = fx.body.replace(URL_RE, '').replace(/\s+/g, ' ').slice(0, 400);
    const type = claimType(claim);
    const t = tierOf(url);
    rows.push({ crag, country: COUNTRY, claim_type: type, claim, source_url: url, source_tier: t.tier, source_type: t.type, checked: CHECKED, volatile: isVolatile(type, claim), review: 'fixed', note, review_record: review });
  }
}

mkdirSync('.research/index', { recursive: true });
const cragSet = new Set(rows.map((r) => r.crag));
const kept = existsSync(OUT)
  ? readFileSync(OUT, 'utf8').split('\n').filter(Boolean).filter((l) => !cragSet.has(JSON.parse(l).crag))
  : [];
writeFileSync(OUT, [...kept, ...rows.map((r) => JSON.stringify(r))].join('\n') + '\n');

const count = (k) => rows.reduce((a, r) => ((a[r[k]] = (a[r[k]] ?? 0) + 1), a), {});
console.log(`${OUT}: ${rows.length} rows for ${cragSet.size} crags (${kept.length} other rows kept)`);
console.log('volatile:', rows.filter((r) => r.volatile).length, '| urls (volatile):', new Set(rows.filter((r) => r.volatile).map((r) => r.source_url)).size);
console.log('claim_type:', count('claim_type'));
console.log('source_tier:', count('source_tier'));
console.log('review:', count('review'));
