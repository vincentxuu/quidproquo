#!/usr/bin/env node
/**
 * 收藏館海報下載（build-time，產物 commit 進 git）。
 *
 * 來源（皆不需 API key）：
 *   - 有 externalIds.tmdb：讀 TMDB 公開作品頁的第一張 og:image（海報，取 w780）
 *   - 動漫沒有 tmdb id：AniList GraphQL（coverImage.extraLarge），並回寫 externalIds.anilist
 *
 * 用法：
 *   node scripts/collection-posters.mjs            # 只補缺的
 *   node scripts/collection-posters.mjs --force    # 全部重抓
 *   node scripts/collection-posters.mjs <slug>...  # 指定作品（隱含 --force）
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'src/data/media-collection.json');
const OUT_DIR = path.join(ROOT, 'public/images/collection');
const PUBLIC_PREFIX = '/images/collection';
const UA = 'collection-poster-fetch/1.0';

const args = process.argv.slice(2);
const only = args.filter((a) => !a.startsWith('--'));
const force = args.includes('--force') || only.length > 0;

const exists = (p) => access(p).then(() => true, () => false);

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function download(url, file) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  return buf.length;
}

async function fromTmdb(work) {
  const kind = work.type === 'film' ? 'movie' : 'tv';
  const html = await fetchText(`https://www.themoviedb.org/${kind}/${work.externalIds.tmdb}`);
  const images = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map((m) => m[1]);
  if (images.length === 0) throw new Error(`TMDB 頁面沒有 og:image：${work.slug}`);
  return { poster: images[0].replace(/\/t\/p\/w\d+\//, '/t/p/w780/'), ids: {} };
}

async function fromAniList(work) {
  const query = `query ($search: String, $year: Int) {
    Media(search: $search, type: ANIME, seasonYear: $year) {
      id coverImage { extraLarge }
    }
  }`;
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ query, variables: { search: work.originalTitle, year: work.year } }),
  });
  const json = await res.json();
  const media = json?.data?.Media;
  if (!media) throw new Error(`AniList 找不到：${work.slug}（${JSON.stringify(json?.errors ?? json)}）`);
  return { poster: media.coverImage.extraLarge, ids: { anilist: String(media.id) } };
}

const raw = await readFile(DATA, 'utf8');
const data = JSON.parse(raw);

/**
 * 只改指定作品的單行欄位，保留檔案原本的排版（陣列、物件寫在同一行），讓 git diff 只剩實際變動。
 * 依賴的格式：每部作品有 `"slug": "<slug>"`，目標欄位的值寫在同一行。
 */
function patchField(text, slug, key, value) {
  const start = text.indexOf(`"slug": "${slug}"`);
  if (start < 0) throw new Error(`找不到作品：${slug}`);
  const re = new RegExp(`("${key}": )(.*?)(,?)$`, 'm');
  const rest = text.slice(start);
  const m = rest.match(re);
  if (!m) throw new Error(`${slug} 沒有單行欄位 ${key}`);
  const inline = JSON.stringify(value).replace(/^\{(.+)\}$/, '{ $1 }').replace(/":"/g, '": "').replace(/","/g, '", "');
  return text.slice(0, start) + rest.replace(re, `$1${inline}$3`);
}
let out = raw;
await mkdir(OUT_DIR, { recursive: true });

let changed = 0;
for (const work of data.works) {
  if (only.length && !only.includes(work.slug)) continue;
  if (!force && work.poster && (await exists(path.join(ROOT, 'public', work.poster)))) continue;

  const src = work.externalIds?.tmdb ? await fromTmdb(work) : await fromAniList(work);
  // 副檔名跟著來源（AniList 有些封面是 png）
  const ext = path.extname(new URL(src.poster).pathname).toLowerCase() || '.jpg';
  const posterBytes = await download(src.poster, path.join(OUT_DIR, `${work.slug}${ext}`));
  work.poster = `${PUBLIC_PREFIX}/${work.slug}${ext}`;
  console.log(`✓ ${work.slug}  ${src.poster}  ${(posterBytes / 1024) | 0}KB`);
  work.externalIds = { ...work.externalIds, ...src.ids };
  out = patchField(out, work.slug, 'poster', work.poster);
  out = patchField(out, work.slug, 'externalIds', work.externalIds);
  changed++;
}

JSON.parse(out); // 確認改完仍是合法 JSON
await writeFile(DATA, out);
console.log(`完成：更新 ${changed} 部`);
