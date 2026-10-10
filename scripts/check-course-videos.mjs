#!/usr/bin/env node
// pnpm check:course-videos — 所有帶「影片狀態」的文章（全部課程系列）都要通過影片狀態檢查。
//
// 為什麼有這支：影片狀態寫錯過兩次（把已上架的錄影標成「待確認」，或憑快取說「沒有錄影」）。
// 這支檢查離線、可重複，所以它不查 YouTube；它強制兩件事：
//   1. 登錄表有 video ID 的文章，必須嵌入那支影片，且狀態行是「已附影片／Videos included」。
//   2. 登錄表 video 為 null（尚無錄影）的文章，checkedAt 不能超過 staleAfterDays，
//      過期就失敗——逼人回到原始來源即時重查，再更新登錄表。
// 登錄表：scripts/config/course-videos.json。更新流程見 post-update skill「課程影片狀態」。

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const REGISTRY = path.join(ROOT, 'scripts/config/course-videos.json');
const POSTS = path.join(ROOT, 'src/content/posts');

const STATUS_RE = /^\*\*(?:影片狀態|Video status)[：:].*$/m;
const INCLUDED_RE = /已附影片|Videos included/;
const SUPPLEMENTARY_RE = /補充影片|supplementary video/i;
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

function youtubeFenceIds(text) {
  const ids = [];
  for (const m of text.matchAll(/^```youtube\s*\n([\s\S]*?)^```/gm)) {
    const u = m[1].match(/^url:\s*(\S+)/m);
    const id = u && u[1].match(/(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (id) ids.push(id[1]);
  }
  return ids;
}


function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const next = path.join(dir, e.name);
    return e.isDirectory() ? walk(next) : next.endsWith('.md') ? [next] : [];
  });
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const strictStaleMs = (registry.staleAfterDays ?? 7) * 86400000;
const genericStaleMs = (registry.genericStaleAfterDays ?? 30) * 86400000;
const problems = [];

// ---------- 1. 通用規則：套用到每一篇帶「影片狀態」行（或課程標籤）的文章 ----------
const pairs = new Map(); // slug -> { zh, en }
for (const file of walk(POSTS)) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, 'utf8');
  const status = text.match(STATUS_RE)?.[0];
  const isEn = file.endsWith('-en.md');
  const slug = path.basename(file, '.md').replace(/-en$/, '');
  const frontmatter = text.startsWith('---') ? text.split('---')[1] : '';
  const isCourse = /^tags:.*\bai-course\b/m.test(frontmatter);

  if (!status) {
    if (isCourse && !(registry.noStatusAllowlist ?? []).includes(rel)) {
      problems.push(`${rel}: 課程文章（ai-course）缺少「影片狀態」行`);
    }
    continue;
  }
  const included = INCLUDED_RE.test(status);
  const ids = youtubeFenceIds(text);
  if (included && ids.length === 0) problems.push(`${rel}: 狀態寫「已附影片」，文章卻沒有 youtube 嵌入`);
  if (!included && !SUPPLEMENTARY_RE.test(status) && ids.length > 0) problems.push(`${rel}: 文章已嵌入影片，狀態行卻不是「已附影片」`);

  // 否定類說法（未列／待確認／查核）若自帶查核日期，日期不能過期
  if (!included) {
    const section = text.match(/^## (?:課程影片來源|Course video sources)\s*\n([\s\S]*?)(?=^## )/m)?.[1] ?? '';
    const d = section.match(/(?:查核日期|Checked(?: on)?|Verified)[：:]?\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    if (d && Date.now() - Date.parse(d) > genericStaleMs) {
      problems.push(
        `${rel}: 影片來源查核日期 ${d} 已超過 ${registry.genericStaleAfterDays ?? 30} 天，` +
          `回原始來源即時重查後更新日期（或嵌入新找到的影片）`
      );
    }
  }
  const pair = pairs.get(slug) ?? {};
  pair[isEn ? 'en' : 'zh'] = { rel, included, ids };
  pairs.set(slug, pair);
}

// 中英版必須一致
for (const [slug, { zh, en }] of pairs) {
  if (!zh || !en) continue;
  if (zh.included !== en.included) {
    problems.push(`${slug}: 中英版影片狀態不一致（${zh.included ? '中有' : '中無'}／${en.included ? '英有' : '英無'}）`);
  }
  const a = [...new Set(zh.ids)].sort().join(',');
  const b = [...new Set(en.ids)].sort().join(',');
  if (a !== b) problems.push(`${slug}: 中英版嵌入的影片不同（zh: ${a || '無'}／en: ${b || '無'}）`);
}

// ---------- 2. 登錄表（嚴格模式）：已逐講查證過的系列 ----------
for (const [slug, entry] of Object.entries(registry.entries)) {
  if (entry.video !== null && !ID_RE.test(entry.video)) {
    problems.push(`${slug}: video 必須是 11 碼 YouTube ID 或 null`);
    continue;
  }
  const checked = Date.parse(entry.checkedAt);
  if (Number.isNaN(checked)) {
    problems.push(`${slug}: checkedAt 不是有效日期`);
    continue;
  }
  if (entry.video === null && Date.now() - checked > strictStaleMs) {
    problems.push(
      `${slug}: 「尚無錄影」的查核已超過 ${registry.staleAfterDays} 天（checkedAt ${entry.checkedAt}）。` +
        `回 ${entry.source} 即時重查，再更新 checkedAt 或填入 video ID`
    );
  }
  const pair = pairs.get(slug);
  for (const lang of ['zh', 'en']) {
    const p = pair?.[lang];
    if (!p) {
      problems.push(`${slug}${lang === 'en' ? '-en' : ''}.md: 登錄表有此文章，但找不到或缺影片狀態行`);
      continue;
    }
    if (entry.video) {
      if (!p.included) problems.push(`${p.rel}: 登錄表有錄影 ${entry.video}，狀態行卻不是「已附影片」`);
      if (!p.ids.includes(entry.video)) problems.push(`${p.rel}: 登錄表有錄影 ${entry.video}，文章沒有嵌入`);
    } else if (p.included) {
      problems.push(`${p.rel}: 登錄表尚無錄影，狀態行卻寫「已附影片」——先更新登錄表（需即時查證）`);
    }
  }
}

if (problems.length) {
  console.error(`check:course-videos: ${problems.length} problem(s)\n` + problems.slice(0, 80).map((p) => `  - ${p}`).join('\n'));
  if (problems.length > 80) console.error(`  ...還有 ${problems.length - 80} 項`);
  process.exit(1);
}
console.log(`OK: ${pairs.size} 組帶影片狀態的文章通過通用規則；登錄表 ${Object.keys(registry.entries).length} 篇通過嚴格檢查。`);
