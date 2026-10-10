#!/usr/bin/env node
// pnpm check:course-videos — 課程系列文章的影片狀態必須和登錄表一致。
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
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

function findPost(slug, suffix) {
  const file = `${slug}${suffix}.md`;
  const dirs = fs.readdirSync(POSTS, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const d of dirs) {
    const p = path.join(POSTS, d.name, file);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function youtubeFenceIds(text) {
  const ids = [];
  for (const m of text.matchAll(/^```youtube\s*\n([\s\S]*?)^```/gm)) {
    const u = m[1].match(/^url:\s*(\S+)/m);
    const id = u && u[1].match(/(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (id) ids.push(id[1]);
  }
  return ids;
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const staleMs = (registry.staleAfterDays ?? 7) * 86400000;
const problems = [];

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
  if (entry.video === null && Date.now() - checked > staleMs) {
    problems.push(
      `${slug}: 「尚無錄影」的查核已超過 ${registry.staleAfterDays} 天（checkedAt ${entry.checkedAt}）。` +
        `回 ${entry.source} 即時重查，再更新 checkedAt 或填入 video ID`
    );
  }
  for (const suffix of ['', '-en']) {
    const file = findPost(slug, suffix);
    if (!file) {
      problems.push(`${slug}${suffix}.md: 找不到文章`);
      continue;
    }
    const rel = path.relative(ROOT, file);
    const text = fs.readFileSync(file, 'utf8');
    const status = text.match(STATUS_RE)?.[0];
    if (!status) {
      problems.push(`${rel}: 缺少「影片狀態」行`);
      continue;
    }
    const included = INCLUDED_RE.test(status);
    if (entry.video) {
      if (!included) problems.push(`${rel}: 登錄表有錄影 ${entry.video}，狀態行卻不是「已附影片」`);
      if (!youtubeFenceIds(text).includes(entry.video)) {
        problems.push(`${rel}: 登錄表有錄影 ${entry.video}，文章沒有嵌入`);
      }
    } else if (included) {
      problems.push(`${rel}: 登錄表尚無錄影，狀態行卻寫「已附影片」——先更新登錄表（需即時查證）`);
    }
  }
}

if (problems.length) {
  console.error(`check:course-videos: ${problems.length} problem(s)\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log(`OK: ${Object.keys(registry.entries).length} 篇課程文章（中英）影片狀態與登錄表一致。`);
