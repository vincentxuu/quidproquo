#!/usr/bin/env node
/**
 * 收藏館客觀資料抓取（build-time，產物 commit 進 git）。
 *
 * 只寫 src/data/media-collection.meta.json（整份由本腳本產生，勿手改），
 * 站主手寫的 src/data/media-collection.json 一律不動。
 *
 * 來源（皆不需 API key）：
 *   - 動漫：AniList GraphQL（集數、單集長度、製作公司、橫幅、角色＋日文聲優、導演、MAL id）
 *           ＋ MyAnimeList 公開作品頁（主題曲 OP／ED，含 Spotify 連結）
 *   - 電影／劇集：TMDB 公開作品頁與演員頁（片長、標語、導演／主創、電視台、集數、橫幅、演員＋角色）
 * 圖片（橫幅、人物頭像）下載到 public/images/collection/，不熱連結外站。
 *
 * 用法：node scripts/collection-meta.mjs [slug...]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'src/data/media-collection.json');
const META = path.join(ROOT, 'src/data/media-collection.meta.json');
const IMG_DIR = path.join(ROOT, 'public/images/collection');
const PUBLIC_PREFIX = '/images/collection';
const UA = 'collection-poster-fetch/1.0';
const CAST_LIMIT = 8;

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 網路錯誤、429、5xx 重試兩次（MAL／AniList 連續請求會被限流） */
async function fetchRetry(url, init = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, init);
      if ((res.status === 429 || res.status >= 500) && attempt < 2) throw new Error(`${res.status}`);
      return res;
    } catch (err) {
      if (attempt >= 2) throw err;
      await sleep(4000 * (attempt + 1));
    }
  }
}

async function get(url, as = 'text') {
  const res = await fetchRetry(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return as === 'json' ? res.json() : res.text();
}

async function download(url, rel) {
  if (!url) return null;
  const res = await fetchRetry(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const ext = path.extname(new URL(url).pathname).toLowerCase() || '.jpg';
  const file = `${rel}${ext}`;
  await mkdir(path.dirname(path.join(IMG_DIR, file)), { recursive: true });
  await writeFile(path.join(IMG_DIR, file), Buffer.from(await res.arrayBuffer()));
  return `${PUBLIC_PREFIX}/${file}`;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

// ── TMDB 公開頁 ──
function parseRuntime(text) {
  const h = /(\d+)h/.exec(text)?.[1] ?? 0;
  const m = /(\d+)m/.exec(text)?.[1] ?? 0;
  const total = Number(h) * 60 + Number(m);
  return total || null;
}

function parseCrew(html) {
  // 主頁的「主創」清單：<li class="profile"> 人名 + <p class="character">Director, Writer</p>
  const crew = [];
  for (const m of html.matchAll(/<li class="profile">([\s\S]*?)<\/li>/g)) {
    const name = /<a href="\/person\/\d+[^"]*">([^<]+)<\/a>/.exec(m[1])?.[1];
    const jobs = /<p class="character">([^<]+)<\/p>/.exec(m[1])?.[1];
    const id = /\/person\/(\d+)/.exec(m[1])?.[1];
    if (name && jobs) crew.push({ name: decode(name), jobs: decode(jobs).split(/,\s*/), id: { tmdb: Number(id) } });
  }
  return crew;
}

function parseCast(html) {
  const section = /<section id="cast"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
  const cast = [];
  for (const block of section.split(/<li data-order="/).slice(1)) {
    const order = Number(/^(\d+)/.exec(block)?.[1]);
    const id = /\/person\/(\d+)/.exec(block)?.[1];
    const img = /<img[^>]*class="profile[^"]*"[^>]*src="([^"]+)"/.exec(block)?.[1] ?? null;
    const name = /<p><a href="\/person\/[^"]*">([^<]+)<\/a><\/p>/.exec(block)?.[1];
    const charRaw = /<p class="character">([\s\S]*?)<\/p>/.exec(block)?.[1] ?? '';
    // 劇集的角色欄會帶「(20 Episodes)」之類的集數，去掉
    const character = decode(charRaw.replace(/<[^>]+>/g, ' ')).replace(/\s*\(?\d+\s+Episodes?\)?\s*$/i, '').trim();
    if (!name) continue;
    cast.push({
      name: decode(name),
      character: character || null,
      // 頭像換成 2x 尺寸
      imageUrl: img ? img.replace(/\/w66_and_h66_face\//, '/w132_and_h132_face/') : null,
      order,
      id: { tmdb: Number(id) },
    });
  }
  return cast.sort((a, b) => a.order - b.order).slice(0, CAST_LIMIT);
}

async function fromTmdb(work) {
  const kind = work.type === 'film' ? 'movie' : 'tv';
  const base = `https://www.themoviedb.org/${kind}/${work.externalIds.tmdb}`;
  const html = await get(base);
  await sleep(300);
  const castHtml = await get(`${base}/cast`);

  const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '{}');
  const images = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map((m) => m[1]);
  const backdropUrl = images[1] ? images[1].replace(/\/t\/p\/w\d+\//, '/t/p/w1280/') : null;
  const runtimeText = /<span class="runtime">([\s\S]*?)<\/span>/.exec(html)?.[1];
  const tagline = /<h3 class="tagline"[^>]*>([^<]+)<\/h3>/.exec(html)?.[1];
  const network = /alt="See more TV shows from ([^"]+?)\.\.\."/.exec(html)?.[1];
  // 季數讀季列表頁（季名可能是「2020」而不是「Season 2」）；第 0 季是特別篇，不算
  let seasons = 0;
  if (kind === 'tv') {
    await sleep(300);
    const seasonsHtml = await get(`${base}/seasons`);
    const re = new RegExp(`/tv/${work.externalIds.tmdb}[^"]*/season/(\\d+)"`, 'g');
    seasons = new Set([...seasonsHtml.matchAll(re)].map((m) => Number(m[1])).filter((n) => n > 0)).size;
  }

  const crew = parseCrew(html);
  const directors = crew
    .filter((p) => p.jobs.some((j) => /Director|Creator/.test(j)))
    .map(({ name, jobs, id }) => ({ name, role: jobs.find((j) => /Director|Creator/.test(j)), id }));

  return {
    source: { tmdb: `${base}` },
    backdropUrl,
    tagline: tagline ? decode(tagline) : null,
    runtime: kind === 'movie' && runtimeText ? parseRuntime(runtimeText) : null,
    episodes: ld.numberOfEpisodes ?? null,
    seasons: kind === 'tv' && seasons ? seasons : null,
    seasonList: null,
    studios: network ? [decode(network)] : [],
    directors,
    cast: parseCast(castHtml),
    themes: [],
  };
}

// ── AniList ＋ MyAnimeList ──
const ANILIST_QUERY = `query ($id: Int, $search: String, $year: Int) {
  Media(id: $id, search: $search, seasonYear: $year, type: ANIME) {
    id idMal episodes duration bannerImage seasonYear status format
    title { romaji english native }
    relations { edges { relationType node { id type format status } } }
    studios(isMain: true) { nodes { name } }
    staff(perPage: 50, sort: RELEVANCE) { edges { role node { id name { full native } } } }
    characters(sort: [ROLE, RELEVANCE], perPage: ${CAST_LIMIT}) {
      edges {
        role
        node { id name { full native } image { medium } }
        voiceActors(language: JAPANESE) { id name { full native } }
      }
    }
  }
}`;

/** MyAnimeList 作品頁的主題曲表：opnening（MAL 原文拼錯）／ending 兩區，每列一首 */
function parseMalThemes(html) {
  const out = [];
  for (const [cls, type] of [['opnening', 'op'], ['ending', 'ed']]) {
    const start = html.indexOf(`theme-songs js-theme-songs ${cls}`);
    if (start < 0) continue;
    const end = html.indexOf('theme-songs js-theme-songs', start + 30);
    const seg = html.slice(start, end > 0 ? end : start + 20000);
    for (const row of seg.split('<td width="84%">').slice(1)) {
      // 單首時歌名包在 theme-song-title；多首時前面是「1:」編號、歌名沒包 span
      const title =
        /<span class="theme-song-title">"?([^<]+?)"?<\/span>/.exec(row)?.[1] ??
        /^(?:\s*<span class="theme-song-index">[^<]*<\/span>)?(?:&nbsp;|\s)*"?([^<]+?)"?\s*<span class="theme-song-artist">/.exec(row)?.[1];
      const artist = /<span class="theme-song-artist">\s*by\s+([^<]+)<\/span>/.exec(row)?.[1];
      const eps = /<span class="theme-song-episode">\(eps?\s*([^)]+)\)<\/span>/.exec(row)?.[1];
      const spotify = /id="spotify_url_\d+" value="([^"]+)"/.exec(row)?.[1];
      // MAL 附的 YouTube Music 連結（官方音源），取影片 id
      const youtube = /id="youtube_url_\d+" value="[^"]*[?&]v=([\w-]{11})/.exec(row)?.[1];
      if (title) {
        out.push({
          type,
          title: decode(title),
          artist: artist ? decode(artist) : null,
          episodes: eps ? decode(eps) : null,
          spotify: spotify ?? null,
          youtube: youtube ?? null,
        });
      }
    }
  }
  return out;
}

async function anilist(variables) {
  const res = await fetchRetry('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ query: ANILIST_QUERY, variables }),
  });
  const json = await res.json();
  return { media: json?.data?.Media, json };
}

// 一季算進系列的條件：TV 本篇（含短篇、網路動畫），或多集的特別篇（如進擊的巨人完結篇）
const isSeason = (n) =>
  ['TV', 'TV_SHORT', 'ONA'].includes(n.format) || (n.format === 'SPECIAL' && (n.episodes ?? 0) >= 2);
const SEASON_LIMIT = 10;

/** 從登記的那一季沿 SEQUEL 往後走，收集同系列已播出的各季（電影只穿過、不收） */
async function seriesOf(first) {
  const seasons = [first];
  const seen = new Set([first.id]);
  let cur = first;
  while (seasons.length < SEASON_LIMIT) {
    // 續集可能不只一個（如 OVA 與下一季並列），電視本篇優先
    const sequels = cur.relations.edges.filter(
      (e) => e.relationType === 'SEQUEL' && e.node.type === 'ANIME' && !seen.has(e.node.id) && e.node.status !== 'NOT_YET_RELEASED',
    );
    const next = sequels.find((e) => ['TV', 'TV_SHORT', 'ONA'].includes(e.node.format)) ?? sequels[0];
    if (!next) break;
    seen.add(next.node.id);
    await sleep(700);
    const { media } = await anilist({ id: next.node.id });
    if (!media) break;
    if (isSeason(media)) seasons.push(media);
    cur = media;
  }
  return seasons;
}

const directorsOf = (media) =>
  media.staff.edges
    .filter((e) => /^(Chief |Series )?Director(\s*\(.*\))?$/i.test(e.role))
    .map((e) => ({ name: pickName(e.node.name), role: e.role, id: { anilist: e.node.id } }));

/** 有日文／漢字原名才用原名，其他（如韓文）用羅馬拼音，讀者才看得懂 */
const pickName = (n) => (n.native && /[\u3040-\u30ff\u3400-\u9fff]/.test(n.native) ? n.native : n.full);

const uniqBy = (arr, key) => [...new Map(arr.map((x) => [key(x), x])).values()];

async function fromAniList(work, knownId) {
  const variables = knownId ? { id: Number(knownId) } : { search: work.originalTitle, year: work.year };
  const { media, json } = await anilist(variables);
  if (!media) throw new Error(`AniList 找不到：${work.slug}（${JSON.stringify(json?.errors ?? json)}）`);
  const seasons = await seriesOf(media);

  // 主題曲逐季抓，標上第幾季；抓不到只警告
  const themes = [];
  for (const [i, s] of seasons.entries()) {
    if (!s.idMal) continue;
    try {
      await sleep(1500);
      for (const t of parseMalThemes(await get(`https://myanimelist.net/anime/${s.idMal}`))) themes.push({ ...t, season: i });
    } catch (err) {
      console.warn(`⚠ ${work.slug} 第 ${i + 1} 季主題曲抓取失敗：${err.message}`);
    }
  }

  const sum = seasons.reduce((n, s) => (s.episodes ? n + s.episodes : n), 0);

  return {
    source: {
      anilist: `https://anilist.co/anime/${media.id}`,
      ...(media.idMal ? { mal: `https://myanimelist.net/anime/${media.idMal}` } : {}),
    },
    ids: { anilist: media.id, mal: media.idMal },
    backdropUrl: media.bannerImage,
    tagline: null,
    runtime: media.duration ?? null, // 單集分鐘
    episodes: sum || null,
    seasons: seasons.length > 1 ? seasons.length : null,
    seasonList: seasons.map((s, i) => ({
      // 英文標題可能跨季重複（如分割季），重複時改用羅馬字標題
      title:
        s.title.english && !seasons.slice(0, i).some((p) => p.title.english === s.title.english)
          ? s.title.english
          : s.title.romaji,
      native: s.title.native,
      year: s.seasonYear,
      episodes: s.episodes ?? null,
      status: s.status,
      ids: { anilist: s.id, mal: s.idMal },
    })),
    studios: uniqBy(seasons.flatMap((s) => s.studios.nodes.map((n) => n.name)), (x) => x),
    directors: uniqBy(seasons.flatMap(directorsOf), (d) => d.id.anilist),
    cast: media.characters.edges.map((e, i) => ({
      name: e.voiceActors[0] ? pickName(e.voiceActors[0].name) : null,
      character: e.node.name.native || e.node.name.full,
      characterRomaji: e.node.name.full,
      imageUrl: e.node.image.medium, // 100x150，頭像用不到 large
      order: i,
      role: e.role, // MAIN / SUPPORTING
      id: { anilist: e.node.id },
    })),
    themes,
  };
}

// ── 主流程 ──
const works = JSON.parse(await readFile(DATA, 'utf8')).works;
let meta = { _readme: '', works: {} };
try {
  meta = JSON.parse(await readFile(META, 'utf8'));
} catch {
  /* 第一次執行 */
}
meta._readme =
  '由 scripts/collection-meta.mjs 產生，勿手改。客觀資料（片長、集數、製作、演員角色、主題曲、橫幅）來自 TMDB 公開頁、AniList、MyAnimeList；動漫沿 AniList 續集關聯收集各季，themes[].season 是 seasonList 的索引；站主手寫內容在 media-collection.json。';

for (const work of works) {
  if (only.length && !only.includes(work.slug)) continue;
  const raw = work.type === 'anime'
    ? await fromAniList(work, work.externalIds?.anilist ?? meta.works[work.slug]?.ids?.anilist)
    : await fromTmdb(work);

  const backdrop = await download(raw.backdropUrl, `${work.slug}-backdrop`);
  const cast = [];
  for (const [i, c] of raw.cast.entries()) {
    const { imageUrl, ...rest } = c;
    cast.push({ ...rest, image: await download(imageUrl, `people/${work.slug}-${String(i + 1).padStart(2, '0')}`) });
  }

  meta.works[work.slug] = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    source: raw.source,
    ...(raw.ids ? { ids: raw.ids } : {}),
    backdrop,
    tagline: raw.tagline,
    runtime: raw.runtime,
    episodes: raw.episodes,
    seasons: raw.seasons,
    ...(raw.seasonList ? { seasonList: raw.seasonList } : {}),
    studios: raw.studios,
    directors: raw.directors,
    cast,
    themes: raw.themes,
  };
  console.log(
    `✓ ${work.slug}  ep=${raw.episodes ?? '-'} rt=${raw.runtime ?? '-'} studios=${raw.studios.join('/') || '-'} ` +
      `dir=${raw.directors.map((d) => d.name).join('/') || '-'} cast=${cast.length} themes=${raw.themes.length} backdrop=${backdrop ? 'y' : 'n'}`,
  );
  await sleep(500);
}

// 依原檔作品順序輸出，方便 diff
const ordered = {};
for (const w of works) if (meta.works[w.slug]) ordered[w.slug] = meta.works[w.slug];
meta.works = ordered;
await writeFile(META, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`完成：${Object.keys(ordered).length} 部 → ${path.relative(ROOT, META)}`);
