#!/usr/bin/env node
/**
 * 替收藏館主題曲找 YouTube 官方影片，寫進 src/data/media-collection.youtube.json。
 *
 * - 來源優先序：MyAnimeList 附的 YouTube Music 連結（meta 的 themes[].youtube）→ YouTube 公開搜尋頁（不需 key），
 *   只收原唱者對得上的官方來源：認證歌手頻道、「- Topic」官方音源、官方頻道
 * - 每支候選都用 oEmbed 確認可嵌入（下架回 404、禁止嵌入回 401）
 * - 自動挑的結果 confirmed: false，站主確認後改成 true；之後重跑不會覆蓋 confirmed 的項目
 * - collection-meta.mjs 重抓 meta 時不會動這個檔
 *
 * 用法：node scripts/collection-youtube.mjs [slug ...] [--force]
 */
import { readFile, writeFile } from 'node:fs/promises';

const META = new URL('../src/data/media-collection.meta.json', import.meta.url);
const OUT = new URL('../src/data/media-collection.youtube.json', import.meta.url);
const UA = 'collection-poster-fetch/1.0';

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const meta = JSON.parse(await readFile(META, 'utf8'));
let out;
try {
  out = JSON.parse(await readFile(OUT, 'utf8'));
} catch {
  out = {
    _readme:
      '主題曲的 YouTube 影片。由 scripts/collection-youtube.mjs 依官方頻道自動挑選，confirmed=false 表示尚未經站主確認；確認無誤後改成 true，重跑腳本就不會覆蓋。key 是 meta 檔裡的主題曲 title。',
    works: {},
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 「Guren no Yumiya (紅蓮の弓矢)」→ 紅蓮の弓矢；沒有括號就用原字串 */
const songName = (title) => title.match(/\(([^)]+)\)\s*$/)?.[1] ?? title;
/** 「Kenshi Yonezu (米津玄師)」→ 米津玄師；長串團體名只取括號前 */
const artistName = (artist) => {
  const paren = artist.match(/\(([^)]+)\)\s*$/)?.[1];
  if (paren && !/[,:]/.test(paren)) return paren;
  return artist.replace(/\s*\(.*$/, '').slice(0, 40);
};

const BAD = /MAD|AMV|acoustic|instrumental|off vocal|inst\.|ver\.|version|cover|カバー|歌ってみた|弾いてみた|叩いてみた|piano|ピアノ|reaction|live|ライブ|歌詞|lyrics|karaoke|カラオケ|nightcore|remix|8bit|music box|オルゴール|1 hour|耐久/i;

async function search(q) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&hl=ja`;
  const res = await fetchRetry(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ja' } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const html = await res.text();
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!m) throw new Error('ytInitialData not found');
  const found = [];
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    if (o.videoRenderer) {
      const v = o.videoRenderer;
      found.push({
        id: v.videoId,
        title: (v.title?.runs ?? []).map((r) => r.text).join(''),
        channel: (v.ownerText?.runs ?? []).map((r) => r.text).join(''),
        badges: (v.ownerBadges ?? []).map((b) => b.metadataBadgeRenderer?.style),
      });
    }
    Object.values(o).forEach(walk);
  };
  walk(JSON.parse(m[1]));
  return found;
}

const norm = (x) => x.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
/** 原唱者的各種寫法：羅馬字、括號內原文 */
const artistKeys = (artist) =>
  [artist.replace(/\s*\(.*$/, ''), artist.match(/\(([^)]+)\)/)?.[1] ?? '']
    .map(norm)
    .filter((k) => k.length >= 2);

function score(c, song, romaji, artist) {
  let s = 0;
  const hay = norm(c.channel + c.title);
  // 原唱者對不上就不收（避免同名歌）
  if (!artistKeys(artist).some((k) => hay.includes(k))) return -99;
  if (c.badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST')) s += 5;
  if (/ - Topic$/.test(c.channel)) s += 4;
  if (/official|公式|オフィシャル/i.test(c.channel)) s += 3;
  if (c.badges.includes('BADGE_STYLE_TYPE_VERIFIED')) s += 2;
  // 標題一定要含歌名（避免挑到同歌手的別首或組曲）
  const t = norm(c.title);
  if (!t.includes(norm(song)) && !t.includes(norm(romaji))) return -99;
  s += 3;
  if (BAD.test(c.title) || /\sat\s+[A-Z]/.test(c.title)) s -= 10;
  return s;
}

/** 網路錯誤、429、5xx 重試兩次（YouTube 連續請求會被限流） */
async function fetchRetry(url, init) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, init);
      if ((res.status === 429 || res.status >= 500) && attempt < 2) throw new Error(`${res.status}`);
      return res;
    } catch (err) {
      if (attempt >= 2) throw err;
      await sleep(5000 * (attempt + 1));
    }
  }
}

/** oEmbed：可嵌入回影片資訊；下架（404）或禁止嵌入（401）回 null */
async function oembed(id) {
  const res = await fetchRetry(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`, {
    headers: { 'User-Agent': UA },
  });
  return res.ok ? res.json() : null;
}

for (const [slug, work] of Object.entries(meta.works)) {
  if (only.length && !only.includes(slug)) continue;
  const themes = work.themes ?? [];
  if (!themes.length) continue;
  out.works[slug] ??= {};
  for (const t of themes) {
    const prev = out.works[slug][t.title];
    if (prev && (prev.confirmed || !force)) continue;
    try {
      // 1. MyAnimeList 附的 YouTube Music 官方音源
      if (t.youtube) {
        const info = await oembed(t.youtube);
        if (info) {
          out.works[slug][t.title] = { id: t.youtube, channel: info.author_name, videoTitle: info.title, source: 'myanimelist', confirmed: false };
          console.log(`✓ ${slug} | ${t.title} → ${t.youtube}（MAL）${info.author_name}`);
          await sleep(400);
          continue;
        }
        console.warn(`  ${slug} | ${t.title}：MAL 的影片不能嵌入，改用搜尋`);
      }
      // 2. 搜尋官方頻道
      const song = songName(t.title);
      const romaji = t.title.replace(/\s*\(.*$/, '');
      const cands = (await search(`${artistName(t.artist ?? '')} ${song}`))
        .map((c) => ({ ...c, score: score(c, song, romaji, t.artist ?? '') }))
        .filter((c) => c.score >= 5)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      let pick = null;
      for (const c of cands) {
        if (await oembed(c.id)) {
          pick = c;
          break;
        }
      }
      if (pick) {
        out.works[slug][t.title] = { id: pick.id, channel: pick.channel, videoTitle: pick.title, source: 'search', confirmed: false };
        console.log(`✓ ${slug} | ${t.title} → ${pick.id}（搜尋）${pick.channel}｜${pick.title}`);
      } else {
        // 舊的自動選擇不再符合規則就移除（站主確認過的不會走到這裡）
        delete out.works[slug][t.title];
        console.warn(`✗ ${slug} | ${t.title}：找不到可嵌入的官方影片`);
      }
    } catch (e) {
      console.warn(`✗ ${slug} | ${t.title}：${e.message}`);
    }
    await sleep(2500);
  }
}

await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`寫入 ${OUT.pathname}`);
