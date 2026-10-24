#!/usr/bin/env node
// 岩場文章的模板覆蓋與路線影片覆蓋閘門。
//
// 為什麼有這支：Crazy Horse「依新模板更新」時，第一輪只做了必備段，路線影片、經典線、網路紀錄
// 三個條件段直接跳過就回報完成；第二輪只搜了 18 組關鍵字，路線影片 17 支，使用者說「影片好少」，
// 改成逐條路線名＋多語＋頻道上傳列表後找到 29 支（2026-10-24）。兩次都是使用者看了才發現。
//
// 規則（只套用在不在 baseline 的岩場文章：新寫的，或依新模板改寫後從 baseline 移除的）：
//   1. 文章有規格的固定 H2 與「依程度挑路線」四級 H3。
//   2. 審稿紀錄 .work/reviews/<slug>.md 有 `## 模板覆蓋`，三個條件段（路線影片、經典線、網路上的路線紀錄）
//      各有一列，結論是「已做」或「查過沒有」。
//   3. 審稿紀錄有一行 `影片統計：查詢 N 組；候選 N 支；收錄 N 支；有影片的路線 X／Y 列`，
//      X／Y 必須等於本腳本從文章分級表與 src/data/climbing-videos.ts 算出來的數字。
//   4. 覆蓋率低於 30% 時，審稿紀錄要有 `影片覆蓋說明：` 一行，說明為什麼找不到更多。
//
// 用法：
//   node scripts/check-crag-coverage.mjs                 全站（verify／CI）
//   node scripts/check-crag-coverage.mjs <post.md ...>   只看指定文章（pre-commit）
//   node scripts/check-crag-coverage.mjs --report        列出每篇覆蓋率（含 baseline），不擋
//   node scripts/check-crag-coverage.mjs --self-test

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const POSTS = 'src/content/posts/climbing';
const REVIEWS = '.work/reviews';
const VIDEOS = 'src/data/climbing-videos.ts';
const BASELINE = 'scripts/config/crag-coverage-baseline.json';
const MIN_COVERAGE = 0.3;

const REQUIRED_H2 = ['這是什麼樣的岩場', '什麼季節去', '怎麼去', '去之前要知道的規範', '依程度挑路線', '查資料的入口', '參考資料'];
const LEVEL_H3 = [/^### 入門：/m, /^### 中級：/m, /^### 進階：/m, /^### 高手：/m];
const CONDITIONAL = ['路線影片', '經典線', '網路上的路線紀錄'];

export const slugOf = (file) => basename(file, '.md').replace(/-en$/, '');
export const isCragGuide = (text) => /^## 依程度挑路線\s*$/m.test(text);

// 「依程度挑路線」四級 H3 底下表格的第一欄（不含經典線、網路紀錄）。
export function levelRouteNames(text) {
  const start = text.search(/^## 依程度挑路線\s*$/m);
  if (start < 0) return [];
  const end = text.slice(start + 1).search(/^## /m);
  const section = text.slice(start, end < 0 ? undefined : start + 1 + end);
  const names = [];
  let inLevel = false;
  for (const line of section.split('\n')) {
    if (line.startsWith('### ')) inLevel = LEVEL_H3.some((re) => re.test(line));
    if (!inLevel || !line.startsWith('|')) continue;
    const first = line.split('|')[1]?.trim() ?? '';
    if (!first || /^-+$/.test(first) || first === '路線') continue;
    names.push(first);
  }
  return names;
}

export function galleryRouteEns(ts, key) {
  const re = new RegExp(`(?:^|\\n)\\s*(?:'${key}'|${key})\\s*:\\s*\\{`);
  const m = ts.match(re);
  if (!m) return [];
  const rest = ts.slice(m.index + m[0].length);
  const end = rest.search(/\n\s{2}\},?\n/);
  const block = end < 0 ? rest : rest.slice(0, end);
  return [...block.matchAll(/routeEn:\s*(['"])(.*?)\1/g)].map((x) => x[2]);
}

// 與 src/plugins/remarkVideoGallery.ts 的 layout: routes 比對規則相同。
export function hasVideo(name, routeEns) {
  return routeEns.some((r) => !/descent/i.test(r) && name.startsWith(r.split(' 5.')[0]));
}

export function coverage(text, ts) {
  const key = text.match(/^key:\s*(\S+)\s*$/m)?.[1];
  const names = levelRouteNames(text);
  const routeEns = key ? galleryRouteEns(ts, key) : [];
  const withVideo = names.filter((n) => hasVideo(n, routeEns)).length;
  return { key, total: names.length, withVideo };
}

export function reviewProblems(review, cov) {
  const problems = [];
  if (!/^##\s*模板覆蓋\s*$/m.test(review)) return ['審稿紀錄缺 `## 模板覆蓋`'];
  const section = review.slice(review.search(/^##\s*模板覆蓋\s*$/m)).split(/\n## (?!#)/)[0];
  for (const item of CONDITIONAL) {
    const row = section.split('\n').find((l) => l.startsWith('|') && l.includes(item));
    if (!row) problems.push(`模板覆蓋缺「${item}」一列`);
    else if (!/已做|查過沒有/.test(row)) problems.push(`模板覆蓋「${item}」沒有結論（已做／查過沒有）`);
  }
  const stat = review.match(/影片統計：查詢\s*(\d+)\s*組；候選\s*(\d+)\s*支；收錄\s*(\d+)\s*支；有影片的路線\s*(\d+)\s*[／/]\s*(\d+)\s*列/);
  if (!stat) {
    problems.push('審稿紀錄缺「影片統計：查詢 N 組；候選 N 支；收錄 N 支；有影片的路線 X／Y 列」');
  } else {
    const [x, y] = [Number(stat[4]), Number(stat[5])];
    if (x !== cov.withVideo || y !== cov.total) {
      problems.push(`影片統計寫 ${x}／${y} 列，實際分級表是 ${cov.withVideo}／${cov.total} 列`);
    }
  }
  if (cov.total > 0 && cov.withVideo / cov.total < MIN_COVERAGE && !/影片覆蓋說明：\S/.test(review)) {
    problems.push(`路線影片覆蓋 ${cov.withVideo}／${cov.total} 低於 ${MIN_COVERAGE * 100}%，審稿紀錄要有「影片覆蓋說明：…」`);
  }
  return problems;
}

export function postProblems(text) {
  const problems = REQUIRED_H2.filter((h) => !new RegExp(`^## ${h}\\s*$`, 'm').test(text)).map((h) => `缺 H2「${h}」`);
  LEVEL_H3.forEach((re, i) => { if (!re.test(text)) problems.push(`缺第 ${i + 1} 級 H3`); });
  return problems;
}

function run(files, report) {
  const baseline = new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).grandfathered);
  const ts = readFileSync(VIDEOS, 'utf8');
  const targets = (files.length ? files : readdirSync(POSTS).map((f) => join(POSTS, f)))
    .filter((f) => f.endsWith('.md') && !f.endsWith('-en.md') && existsSync(f));
  let failed = 0;
  let checked = 0;
  for (const file of targets) {
    const text = readFileSync(file, 'utf8');
    if (!isCragGuide(text)) continue;
    const slug = slugOf(file);
    const cov = coverage(text, ts);
    if (report) console.log(`${baseline.has(slug) ? '·' : '●'} ${slug}: ${cov.withVideo}／${cov.total}`);
    if (baseline.has(slug)) continue;
    checked += 1;
    const reviewPath = join(REVIEWS, `${slug}.md`);
    const problems = [
      ...postProblems(text),
      ...(existsSync(reviewPath) ? reviewProblems(readFileSync(reviewPath, 'utf8'), cov) : [`缺審稿紀錄 ${reviewPath}`]),
    ];
    if (problems.length) {
      failed += 1;
      console.error(`✗ ${slug}`);
      for (const p of problems) console.error(`    ${p}`);
    }
  }
  console.log(`crag-coverage：檢查 ${checked} 篇（baseline ${baseline.size} 篇免檢），${failed} 篇有問題`);
  if (failed && !report) process.exitCode = 1;
}

function selfTest() {
  const assert = (c, m) => { if (!c) { console.error(`✗ ${m}`); process.exitCode = 1; } else console.log(`✓ ${m}`); };
  const post = [
    '## 這是什麼樣的岩場', '## 什麼季節去', '## 怎麼去', '## 去之前要知道的規範', '## 依程度挑路線',
    '### 入門：6a 以下（YDS 5.10a 以下）', '| 路線 | 難度 |', '| --- | --- |', '| Alpha | 5a |', '| Beta / B | 5b |',
    '### 中級：6a+ 到 6c+', '| 路線 | 難度 |', '| Gamma | 6b |',
    '### 進階：7a', '### 高手：8a', '### 經典線：X', '| 路線 | 難度 |', '| Delta | 6a |',
    '```video-gallery', 'key: demo', 'lang: zh-TW', 'layout: routes', '```',
    '## 查資料的入口', '## 參考資料',
  ].join('\n');
  const ts = "export const v = {\n  demo: {\n    videos: [\n      { id: 'a', routeEn: 'Alpha 5.7 (5a, X)' },\n      { id: 'b', routeEn: 'Beta 5.8 (5b, X)' },\n      { id: 'c', routeEn: 'Alpha descent' },\n    ],\n  },\n  other: {\n    videos: [ { id: 'd', routeEn: 'Gamma 5.10c (6b)' } ],\n  },\n};";
  assert(levelRouteNames(post).join(',') === 'Alpha,Beta / B,Gamma', '只收四級 H3 的表格列，不收經典線與表頭');
  const cov = coverage(post, ts);
  assert(cov.withVideo === 2 && cov.total === 3, '覆蓋率只用這個 key 的影片，descent 不算');
  assert(postProblems(post).length === 0, '固定 H2 與四級 H3 齊全時沒有問題');
  assert(postProblems(post.replace('## 怎麼去', '')).some((p) => p.includes('怎麼去')), '缺 H2 會被抓到');
  const good = '## 模板覆蓋\n\n| 路線影片 | 已做 |\n| 經典線 | 查過沒有（2026-10-24） |\n| 網路上的路線紀錄 | 已做 |\n\n影片統計：查詢 30 組；候選 100 支；收錄 5 支；有影片的路線 2／3 列\n';
  assert(reviewProblems(good, cov).length === 0, '完整的模板覆蓋與正確統計通過');
  assert(reviewProblems(good.replace('| 經典線 | 查過沒有（2026-10-24） |\n', ''), cov).some((p) => p.includes('經典線')), '缺條件段一列會被抓到');
  assert(reviewProblems(good.replace('| 路線影片 | 已做 |', '| 路線影片 | 之後再補 |'), cov).some((p) => p.includes('沒有結論')), '條件段沒有結論會被抓到');
  assert(reviewProblems(good.replace('2／3', '3／3'), cov).some((p) => p.includes('實際分級表')), '統計數字和實際不符會被抓到');
  const low = { withVideo: 0, total: 3 };
  const lowReview = good.replace('2／3', '0／3');
  assert(reviewProblems(lowReview, low).some((p) => p.includes('影片覆蓋說明')), '覆蓋率低於 30% 沒有說明會被抓到');
  assert(reviewProblems(`${lowReview}\n影片覆蓋說明：岩場冷門，查過沒有更多。\n`, low).length === 0, '覆蓋率低但有說明時通過');
  assert(reviewProblems('## post-verify\n', cov)[0].includes('模板覆蓋'), '沒有模板覆蓋段直接報錯');
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else run(args.filter((a) => !a.startsWith('--')), args.includes('--report'));
