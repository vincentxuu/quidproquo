#!/usr/bin/env node
// layout: routes 的影片區塊必須緊接在表格正下方。
//
// 為什麼有這支：remarkVideoGallery 找不到前一個表格會拋錯，Astro 只記一行 log，整篇內文變空白，
// build 仍然成功。2026-10-26 的 44 篇日本岩場因此線上只剩標題和摘要，到 2026-11-07 才發現。
//
// 用法：
//   node scripts/check-route-video-fences.mjs              全站
//   node scripts/check-route-video-fences.mjs <post.md...> 只看指定文章
//   node scripts/check-route-video-fences.mjs --self-test
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const POSTS = 'src/content/posts';

export function fenceProblems(text) {
  const lines = text.split('\n');
  const problems = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '```video-gallery') continue;
    let end = i + 1;
    while (end < lines.length && !lines[end].startsWith('```')) end++;
    if (!lines.slice(i + 1, end).some((l) => /^\s*layout:\s*routes\s*$/.test(l))) continue;
    let prev = i - 1;
    while (prev >= 0 && !lines[prev].trim()) prev--;
    if (prev < 0 || !lines[prev].trimStart().startsWith('|')) problems.push(i + 1);
  }
  return problems;
}

function allPosts() {
  return readdirSync(POSTS).flatMap((d) => {
    const dir = join(POSTS, d);
    if (!statSync(dir).isDirectory()) return [];
    return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => join(dir, f));
  });
}

function selfTest() {
  const fence = '```video-gallery\nkey: demo\nlang: en\nlayout: routes\n```';
  const cases = [
    [`| a |\n|---|\n| b |\n\n${fence}`, 0],
    [`intro\n\n${fence}\n\n| a |\n|---|\n| b |`, 1],
    [`${fence}`, 1],
    ['intro\n\n```video-gallery\nkey: demo\nlang: en\n```', 0],
  ];
  for (const [text, expected] of cases) {
    if (fenceProblems(text).length !== expected) {
      console.error('self-test failed:', JSON.stringify(text));
      process.exit(1);
    }
  }
  console.log('route-video-fences self-test ok');
}

if (process.argv[2] === '--self-test') {
  selfTest();
} else {
  const args = process.argv.slice(2);
  const files = args.length ? args : allPosts();
  const bad = files.flatMap((f) => fenceProblems(readFileSync(f, 'utf8')).map((line) => `${f}:${line}`));
  if (bad.length) {
    console.error(`route-video-fences：${bad.length} 個 layout: routes 區塊沒有緊接表格（整篇內文會變空白）`);
    for (const b of bad) console.error(`  - ${b}`);
    process.exit(1);
  }
  console.log(`route-video-fences：檢查 ${files.length} 篇，0 個問題`);
}
