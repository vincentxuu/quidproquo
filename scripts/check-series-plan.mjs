#!/usr/bin/env node
// 系列規劃與審稿閘門。
//
// 為什麼有這支：「從零開始的資安獵人」先有一篇單篇查證文，事後才登錄成系列、標成第 0 篇，
// 之後兩天內每批四篇寫完 12 篇；沒有規劃表，只跑了 post-verify，報告裡寫著「教學品質交 post-review／
// post-polish」卻從未執行。結果是入口不是入門、篇與篇之間沒有銜接、正文堆滿歸因但書（2026-10-14）。
//
// 兩條規則（只套用在新登錄的系列；既有系列列在 scripts/config/series-plan-baseline.json）：
//   1. src/utils/series.ts 每個系列都要有 .work/series-plans/<slug>.md，內含規劃表必備段落與使用者確認行。
//   2. 這些系列的每篇文章都要有 .work/reviews/<文章 slug>.md，內含 post-verify、post-review、post-polish 三節。
//      文章 slug 是檔名去掉 .md 與 -en；中英共用一份。
//   重寫中的既有系列列在 baseline 的 rewriting：規劃表照查；審稿紀錄只在指定檔案（pre-commit）時查，
//   全站模式不掃舊文，避免整個系列重寫完之前擋住全站 deploy。全部重寫完就移出 rewriting。
//
// 用法：
//   node scripts/check-series-plan.mjs                 全站（verify／CI）
//   node scripts/check-series-plan.mjs <post.md ...>   只看指定文章的審稿紀錄，系列規劃仍全看（pre-commit）
//   node scripts/check-series-plan.mjs --self-test

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const SERIES_TS = 'src/utils/series.ts';
const BASELINE = 'scripts/config/series-plan-baseline.json';
const PLANS = '.work/series-plans';
const REVIEWS = '.work/reviews';
const POSTS = 'src/content/posts';

// 規劃表必備段落：對應 series-curriculum-design 步驟一到六與使用者確認。
const PLAN_REQUIRED = [
  ['目標讀者', /目標讀者/],
  ['弧線', /弧線/],
  ['入口篇（order 0 或 1 是總覽／入門，不是事件文）', /入口/],
  ['斷崖處理', /斷崖/],
  ['每篇範圍卡（讀完後讀者能…）', /讀完後讀者能/],
  ['使用者確認行（使用者確認：YYYY-MM-DD）', /使用者確認[：:]\s*20\d\d-\d\d-\d\d/],
];

const REVIEW_REQUIRED = [
  ['## post-verify', /^##\s*post-verify\b/m],
  ['## post-review', /^##\s*post-review\b/m],
  ['## post-polish', /^##\s*post-polish\b/m],
];

export function parseSeries(ts) {
  // 每個 slug 到下一個 slug 之間是一筆；names 只在這一筆裡找，避免跨筆配錯名稱。
  const starts = [...ts.matchAll(/slug:\s*'([^']+)'/g)];
  return starts.map((m, i) => {
    const chunk = ts.slice(m.index, starts[i + 1]?.index ?? ts.length);
    const block = chunk.match(/names:\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const zh = block.match(/'zh-TW':\s*(['"])(.*?)\1/)?.[2];
    const en = block.match(/\ben:\s*(['"])(.*?)\1/)?.[2];
    return { slug: m[1], names: [zh, en].filter(Boolean) };
  });
}

export function planProblems(text) {
  return PLAN_REQUIRED.filter(([, re]) => !re.test(text)).map(([label]) => label);
}

// 規劃表要先有研究：寫出研究筆記路徑（檔案要存在）與五關判準一節。
// 為什麼：2026-10-16「知識庫怎麼建」先憑印象排篇目、來源欄列沒讀過的書，四輪都是使用者追問才補研究。
const RESEARCH_NOTE = /\.work\/research\/[\w.-]+\/research-note\.md/;
export function researchProblems(text, exists = existsSync) {
  const miss = [];
  const m = text.match(RESEARCH_NOTE);
  if (!m) miss.push('研究筆記路徑（.work/research/<slug>/research-note.md）');
  else if (!exists(m[0])) miss.push(`研究筆記檔案 ${m[0]} 不存在`);
  if (!/研究足夠的判準/.test(text)) miss.push('「研究足夠的判準」一節（五關檢查結果）');
  return miss;
}

export function reviewProblems(text) {
  return REVIEW_REQUIRED.filter(([, re]) => !re.test(text)).map(([label]) => label);
}

function seriesNameOf(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm || /^draft:\s*true\b/m.test(fm[1])) return null;
  const m = fm[1].match(/^series:\s*\n\s+name:\s*["']?([^"'\n]+?)["']?\s*$/m);
  return m ? m[1].trim() : null;
}

export const postSlug = (file) => basename(file, '.md').replace(/-en$/, '');

function allPosts() {
  const files = [];
  for (const d of readdirSync(POSTS)) {
    const dir = join(POSTS, d);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) if (f.endsWith('.md')) files.push(join(dir, f));
  }
  return files;
}

function run(files, explicit) {
  const cfg = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const baseline = new Set(cfg.grandfathered);
  const rewriting = new Set(cfg.rewriting ?? []);
  const researchExempt = new Set(cfg.researchExempt ?? []);
  const gated = parseSeries(readFileSync(SERIES_TS, 'utf8')).filter((s) => !baseline.has(s.slug));
  const errors = [];

  for (const s of gated) {
    const plan = join(PLANS, `${s.slug}.md`);
    if (!existsSync(plan)) { errors.push(`系列 ${s.slug} 沒有規劃表 ${plan}（先跑 series-curriculum-design）`); continue; }
    const text = readFileSync(plan, 'utf8');
    const miss = [...planProblems(text), ...(researchExempt.has(s.slug) ? [] : researchProblems(text))];
    if (miss.length) errors.push(`${plan} 缺：${miss.join('、')}`);
  }

  const reviewed = explicit ? gated : gated.filter((s) => !rewriting.has(s.slug));
  const nameToSlug = new Map(reviewed.flatMap((s) => s.names.map((n) => [n, s.slug])));
  for (const f of files) {
    const series = seriesNameOf(readFileSync(f, 'utf8'));
    if (!series || !nameToSlug.has(series)) continue;
    const review = join(REVIEWS, `${postSlug(f)}.md`);
    if (!existsSync(review)) { errors.push(`${f} 沒有審稿紀錄 ${review}（post-verify＋post-review＋post-polish）`); continue; }
    const miss = reviewProblems(readFileSync(review, 'utf8'));
    if (miss.length) errors.push(`${review} 缺：${miss.join('、')}`);
  }
  return { errors, gated: gated.length };
}

function selfTest() {
  const assert = (c, m) => { if (!c) { console.error(`✗ ${m}`); process.exitCode = 1; } else console.log(`✓ ${m}`); };
  const ts = `  {\n    slug: 'a-b',\n    category: 'x',\n    names: { 'zh-TW': '甲乙', en: 'A B' },\n  },\n  {\n    slug: 'c',\n    names: { 'zh-TW': '丙', en: 'C' },\n  }`;
  const s = parseSeries(ts);
  assert(s.length === 2 && s[0].slug === 'a-b' && s[0].names[1] === 'A B' && s[1].names[0] === '丙', '解析 series.ts 的 slug 與雙語名稱');
  const full = '目標讀者：x\n弧線：a→b\n入口：總覽\n### 斷崖處理\n讀完後讀者能：y\n使用者確認：2026-10-15';
  assert(planProblems(full).length === 0, '完整規劃表通過');
  assert(planProblems(full.replace(/使用者確認.*/, '')).length === 1, '缺使用者確認會擋');
  const researched = '研究筆記：`.work/research/a-b/research-note.md`\n## 研究足夠的判準\n五關結果';
  assert(researchProblems(researched, () => true).length === 0, '有研究筆記與五關判準通過');
  assert(researchProblems(researched, () => false).length === 1, '研究筆記檔案不存在會擋');
  assert(researchProblems('研究足夠的判準').length === 1, '沒寫研究筆記路徑會擋');
  assert(researchProblems('`.work/research/a-b/research-note.md`', () => true).length === 1, '缺五關判準會擋');
  assert(reviewProblems('## post-verify\n## post-review\n## post-polish').length === 0, '三節齊全的審稿紀錄通過');
  assert(reviewProblems('## post-verify\n只做了查證').length === 2, '只有查證會擋');
  assert(postSlug('src/content/posts/tech/2026-10-13-x-en.md') === '2026-10-13-x', '中英共用審稿紀錄');
  assert(seriesNameOf('---\ntitle: t\nseries:\n  name: "A B"\n  order: 1\n---\n') === 'A B', '讀 frontmatter 的系列名');
  assert(seriesNameOf('---\ndraft: true\nseries:\n  name: "A B"\n---\n') === null, '草稿不檢查');
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) {
  selfTest();
} else {
  const files = args.filter((a) => !a.startsWith('--'));
  const { errors, gated } = run(files.length ? files : allPosts(), files.length > 0);
  if (errors.length) {
    console.log(errors.map((e) => `🔴 ${e}`).join('\n'));
    console.log('規則見 .agents/skills/series-curriculum-design/SKILL.md「規劃表存檔與閘門」與 post skill「系列文章閘門」。');
    process.exitCode = 1;
  } else {
    console.log(`series-plan：${gated} 個受管系列的規劃表與審稿紀錄齊全`);
  }
}
