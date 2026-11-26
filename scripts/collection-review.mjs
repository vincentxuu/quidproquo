#!/usr/bin/env node
/**
 * 收藏館評價工作台：站主填自己的評價（紅線欄位，AI 不代填）。
 *
 * 快評（必填，約 30 秒）：分數＋收藏等級。rating 為 0 的作品就是「待評」，快評完才離開佇列。
 * 慢評（每項都能 Enter 跳過、保留原值）：
 *   - 一句話：站主隨口打感想，工具只把原話切成句子當候選，不改寫、不生成；選一句後可以小改。
 *   - 推薦給、最愛角色（從 meta 的角色牆勾選）、最愛場景（參考分季清單自己寫）。
 *   - 主題曲影片逐首確認：y 確認、n 拒絕（標 rejected，頁面不嵌入、重跑抓影片腳本也不會再挑回來）。
 *
 * 用法：
 *   node scripts/collection-review.mjs              # 依序評佇列裡的作品（q 離開）
 *   node scripts/collection-review.mjs <slug>       # 評／改指定作品（快評＋慢評）
 *   node scripts/collection-review.mjs --list       # 列待快評、待慢評、主題曲待確認
 *   加 --dry-run：只印出會改的欄位，不寫檔
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'src/data/media-collection.json');
const META = path.join(ROOT, 'src/data/media-collection.meta.json');
const YOUTUBE = path.join(ROOT, 'src/data/media-collection.youtube.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const listOnly = args.includes('--list');
const only = args.filter((a) => !a.startsWith('--'));

const TIERS = [
  ['watched', '看過'],
  ['loved', '很喜歡'],
  ['favorite', '真愛'],
];
const tierLabel = Object.fromEntries(TIERS);

const data = JSON.parse(await readFile(DATA, 'utf8'));
const meta = JSON.parse(await readFile(META, 'utf8')).works;
const youtube = JSON.parse(await readFile(YOUTUBE, 'utf8'));

const pendingThemes = (slug) => Object.values(youtube.works[slug] ?? {}).filter((v) => !v.confirmed && !v.rejected).length;
const needsQuick = (w) => !(w.rating > 0);
const needsSlow = (w) => w.rating > 0 && !w.oneLiner;

if (listOnly) {
  const show = (label, works, extra = () => '') => {
    console.log(`${label}（${works.length}）`);
    for (const w of works) console.log(`  ${w.slug.padEnd(22)} ${w.title}${extra(w)}`);
  };
  show('待快評', data.works.filter(needsQuick));
  show('待慢評（還沒有一句話）', data.works.filter(needsSlow));
  show('主題曲待確認', data.works.filter((w) => pendingThemes(w.slug) > 0), (w) => `  ${pendingThemes(w.slug)} 首`);
  process.exit(0);
}

const targets = only.length
  ? only.map((slug) => data.works.find((w) => w.slug === slug) ?? fail(`找不到作品：${slug}`))
  : data.works.filter(needsQuick);
if (!targets.length) {
  console.log('佇列是空的：每部都快評過了。要改某一部就帶 slug，--list 看待慢評與主題曲。');
  process.exit(0);
}

// 自己排隊每一行：管線輸入時 readline 會在提問前就把行讀完，rl.question 會漏接
const rl = createInterface({ input: process.stdin, terminal: process.stdin.isTTY });
const buffered = [];
let waiting = null;
let closed = false;
rl.on('line', (line) => (waiting ? (waiting(line), (waiting = null)) : buffered.push(line)));
rl.on('close', () => {
  closed = true;
  waiting?.('q');
});
/** 輸入結束（Ctrl+D 或管線讀完）時當成 q */
async function ask(q) {
  process.stdout.write(q);
  if (buffered.length) return buffered.shift().trim();
  if (closed) return 'q';
  return (await new Promise((resolve) => (waiting = resolve))).trim();
}
/** y/N 問題：只收 y、n 或 Enter（＝否），打錯就重問，避免把下一題的輸入吃掉 */
async function yes(q) {
  for (;;) {
    const s = (await ask(q)).toLowerCase();
    if (s === 'q') throw new Quit();
    if (s === 'y') return true;
    if (s === '' || s === 'n') return false;
    console.log('  請打 y 或 n。');
  }
}
class Quit extends Error {}
const quitOn = (s) => {
  if (s === 'q') throw new Quit();
  return s;
};

try {
  for (const work of targets) {
    await reviewWork(work, Boolean(only.length));
    if (closed) break;
  }
} catch (e) {
  if (!(e instanceof Quit)) throw e;
  console.log('\n離開；已評的部分都存了。');
} finally {
  rl.close();
}

async function reviewWork(work, forceSlow) {
  const m = meta[work.slug];
  console.log(`\n━━ ${work.title}（${work.originalTitle}，${work.year}）`);
  console.log(`   ${work.synopsis}`);

  // 快評
  const ratingHint = work.rating > 0 ? `Enter 保留 ${work.rating}` : '1–10，可 .5';
  let rating = work.rating;
  for (;;) {
    const s = quitOn(await ask(`分數（${ratingHint}，s 跳過這部，q 離開）：`));
    if (s === 's') return;
    if (!s && rating > 0) break;
    const n = Number(s);
    if (n >= 1 && n <= 10 && Number.isInteger(n * 2)) {
      rating = n;
      break;
    }
    console.log('  要 1–10、0.5 為一級。');
  }
  const tierMenu = TIERS.map(([, label], i) => `${i + 1} ${label}`).join(' / ');
  const tierHint = work.rating > 0 ? `，Enter 保留「${tierLabel[work.tier]}」` : '';
  let tier = work.tier;
  for (;;) {
    const s = quitOn(await ask(`等級（${tierMenu}${tierHint}）：`));
    if (!s && work.rating > 0) break;
    const pick = TIERS[Number(s) - 1];
    if (pick) {
      tier = pick[0];
      break;
    }
  }
  await save(work, { rating, tier });

  if (!forceSlow && !(await yes('要繼續慢評嗎？[y/N] '))) return;

  // 慢評
  await slowOneLiner(work);
  const audience = quitOn(await ask(`推薦給${work.audience ? `（Enter 保留「${work.audience}」）` : '（Enter 跳過）'}：`));
  if (audience) await save(work, { audience });
  await slowCharacters(work, m);
  await slowScenes(work, m);
  await slowThemes(work, m);
}

/** 一句話：只從站主自己的原話挑句，不改寫 */
async function slowOneLiner(work) {
  if (work.oneLiner) console.log(`目前的一句話：${work.oneLiner}`);
  console.log('隨口打你對這部的感想，幾句都行，空一行結束（直接 Enter 跳過）：');
  const lines = [];
  for (;;) {
    const s = await ask('  > ');
    if (s === 'q' && !lines.length) throw new Quit();
    if (!s || s === 'q') break;
    lines.push(s);
  }
  if (!lines.length) return;
  const ramble = lines.join('\n');
  const candidates = splitCandidates(ramble);
  if (candidates.length) {
    console.log('從你的原話切出來的候選：');
    candidates.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  }
  const s = await ask('選編號（e 自己重打一句，Enter 不改一句話）：');
  let chosen = null;
  if (s === 'e') chosen = await ask('一句話：');
  else if (candidates[Number(s) - 1]) {
    chosen = candidates[Number(s) - 1];
    const edited = await ask(`要小改就打完整新句，Enter 照用「${chosen}」：`);
    if (edited && edited !== 'q') chosen = edited;
  }
  if (chosen && chosen !== 'q') await save(work, { oneLiner: chosen });
  if (!work.review && (await yes('把剛才那段原話存成心得（review）？[y/N] '))) {
    await save(work, { review: ramble.replace(/\n+/g, ' ') });
  }
}

/** 句子＋句中子句都列；只切、不改字，太短或太長的不列 */
function splitCandidates(text) {
  const out = [];
  for (const sentence of text.split(/(?<=[。！？!?])|\n/)) {
    const s = sentence.trim();
    if (!s) continue;
    out.push(s);
    const clauses = s.split(/[，,；;]/).map((c) => c.trim().replace(/[。！？!?]$/, ''));
    if (clauses.length > 1) out.push(...clauses);
  }
  return [...new Set(out)].filter((c) => [...c].length >= 4 && [...c].length <= 60);
}

async function slowCharacters(work, m) {
  const cast = (m?.cast ?? []).filter((c) => c.character);
  if (!cast.length) return;
  const current = work.deep.characters ?? [];
  console.log('角色牆：');
  cast.forEach((c, i) => {
    const mark = current.some((p) => p.name === c.character) ? '★' : ' ';
    const romaji = c.characterRomaji && c.characterRomaji !== c.character ? ` ${c.characterRomaji}` : '';
    console.log(`  ${mark}${String(i + 1).padStart(2)}. ${c.character}${romaji}${c.name ? `（${c.name}）` : ''}`);
  });
  const s = quitOn(await ask('最愛角色，編號用空白隔開（Enter 保留 ★ 的、- 清空）：'));
  if (!s) return;
  if (s === '-') return save(work, { deep: { ...work.deep, characters: [] } });
  const picks = [...new Set(s.split(/[\s,，]+/).map(Number))].map((n) => cast[n - 1]).filter(Boolean);
  const characters = [];
  for (const c of picks) {
    const prev = current.find((p) => p.name === c.character);
    const take = await ask(`  對「${c.character}」的看法（一句，Enter ${prev?.take ? '保留原本的' : '留空'}）：`);
    characters.push({
      name: c.character,
      ...(c.name ? { actor: c.name } : {}),
      take: take && take !== 'q' ? take : (prev?.take ?? ''),
      ...(prev?.spoiler ? { spoiler: true } : {}),
    });
  }
  await save(work, { deep: { ...work.deep, characters } });
}

async function slowScenes(work, m) {
  const seasons = m?.seasonList ?? [];
  if (seasons.length > 1) {
    console.log('分季（寫場景時參考）：');
    seasons.forEach((s) => console.log(`  ${s.year ?? '—'}  ${s.title}`));
  }
  if (work.favoriteScenes.length) console.log(`目前的最愛場景：${work.favoriteScenes.join('／')}`);
  console.log('最愛場景，一行一幕，空一行結束（第一行直接 Enter 保留目前的、- 清空）：');
  const scenes = [];
  for (;;) {
    const s = await ask('  > ');
    if (s === 'q' && !scenes.length) throw new Quit();
    if (!s || s === 'q') break;
    if (s === '-' && !scenes.length) return save(work, { favoriteScenes: [] });
    scenes.push(s);
  }
  if (scenes.length) await save(work, { favoriteScenes: scenes });
}

async function slowThemes(work, m) {
  const entries = Object.entries(youtube.works[work.slug] ?? {}).filter(([, v]) => !v.confirmed && !v.rejected);
  if (!entries.length) return;
  if (!(await yes(`主題曲影片有 ${entries.length} 首待確認，要逐首看嗎？[y/N] `))) return;
  const themes = m?.themes ?? [];
  const seasons = m?.seasonList ?? [];
  for (const [title, v] of entries) {
    const t = themes.find((x) => x.title === title);
    const season = t?.season != null && seasons[t.season] ? `${seasons[t.season].title} · ` : '';
    console.log(`\n  ${season}${t?.type?.toUpperCase() ?? ''} ${title}${t?.artist ? ` — ${t.artist}` : ''}`);
    console.log(`  影片：${v.videoTitle}（${v.channel}）`);
    console.log(`  https://youtu.be/${v.id}`);
    const s = (await ask('  y 確認 / n 不對 / Enter 先跳過 / q 停止確認：')).toLowerCase();
    if (s === 'q') break;
    if (s === 'y') v.confirmed = true;
    else if (s === 'n') v.rejected = true;
    else continue;
    await saveYoutube(`${work.slug} · ${title} → ${s === 'y' ? '確認' : '拒絕'}`);
  }
}

async function save(work, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (JSON.stringify(work[k]) === JSON.stringify(v)) continue;
    console.log(`  ${dryRun ? '[dry-run] ' : '✓ '}${work.slug}.${k} = ${JSON.stringify(v)}`);
    work[k] = v;
  }
  if (!dryRun) await writeFile(DATA, formatCollection(data));
}

async function saveYoutube(label) {
  console.log(`  ${dryRun ? '[dry-run] ' : '✓ '}${label}`);
  if (!dryRun) await writeFile(YOUTUBE, JSON.stringify(youtube, null, 2) + '\n');
}

/** 跟 media-collection.json 原本的排版一致：每部作品一欄一行、值寫在同一行，git diff 才只剩實際變動 */
function formatCollection(d) {
  const inline = (v) => {
    if (Array.isArray(v)) return `[${v.map(inline).join(', ')}]`;
    if (v && typeof v === 'object') {
      const entries = Object.entries(v);
      return entries.length ? `{ ${entries.map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(', ')} }` : '{}';
    }
    return JSON.stringify(v);
  };
  const works = d.works.map(
    (w) => `    {\n${Object.entries(w).map(([k, v]) => `      ${JSON.stringify(k)}: ${inline(v)}`).join(',\n')}\n    }`,
  );
  const head = Object.entries(d)
    .filter(([k]) => k !== 'works')
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`)
    .join('');
  return `{\n${head}  "works": [\n${works.join(',\n')}\n  ]\n}\n`;
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}
