#!/usr/bin/env node
// Skill 之間用「<檔案>.md#<章節>」互相指路。被指到的章節不見了，讀的人（或 agent）只會默默跳過那條規則。
// 這支檢查擋兩種情況：指到的 .md 不存在、或檔案在但沒有對應的標題。
// 本站踩過：2026-09-16 一筆發文提交把 writing-guide.md 整檔蓋回舊版，「台灣用語」「長文的體裁與語域」
// 等章節消失近一個月，post-review 等三個 skill 的連結一直指向空氣（2026-10-13 才發現）。
//
// 掃描範圍：.agents/skills 下的 Markdown，加上 scripts/ 裡提到 .agents/skills/...md#... 的註解。
// 錨點比對刻意寬鬆：去掉標點與空白後，標題以錨點開頭就算對上（「#台灣用語」對得上「## 台灣用語（硬性）」）。

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve('.');
const SKILLS = join(ROOT, '.agents', 'skills');
const SCRIPTS = join(ROOT, 'scripts');

function walk(dir, keep) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, keep));
    else if (keep(full)) out.push(full);
  }
  return out;
}

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

const headingCache = new Map();
function headings(file) {
  if (!headingCache.has(file)) {
    const list = [];
    let fence = false;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (/^\s*(```|~~~)/.test(line)) fence = !fence;
      const m = !fence && line.match(/^#{1,6}\s+(.+?)\s*$/);
      if (m) list.push(norm(m[1]));
    }
    headingCache.set(file, list);
  }
  return headingCache.get(file);
}

// 路徑寫法有三種：相對於所在檔案、相對於 repo 根目錄、或只寫檔名（同一個 skill 的 references/ 底下）。
function resolveTarget(fromFile, ref) {
  const candidates = [resolve(dirname(fromFile), ref), resolve(ROOT, ref)];
  if (!ref.includes('/')) candidates.push(resolve(dirname(fromFile), 'references', ref));
  return candidates.find((p) => existsSync(p));
}

const REF = /((?:\.{1,2}\/)?[\w.\-/]*[\w-]+\.md)#([^\s)`'"|，。；、）」】>\]]+)/g;
const sources = [
  ...walk(SKILLS, (f) => f.endsWith('.md')),
  ...walk(SCRIPTS, (f) => /\.(mjs|js|ts|sh)$/.test(f)),
];

const problems = [];
let checked = 0;
for (const file of sources) {
  const inScripts = file.startsWith(SCRIPTS);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(REF)) {
      const [, ref, rawAnchor] = m;
      if (/^https?:/.test(line.slice(Math.max(0, m.index - 8), m.index + ref.length))) continue;
      if (inScripts && !ref.includes('.agents/skills/')) continue;
      const anchor = norm(decodeURIComponent(rawAnchor));
      if (!anchor) continue;
      checked++;
      const where = `${relative(ROOT, file)}:${i + 1}`;
      const target = resolveTarget(file, ref);
      if (!target) {
        problems.push(`${where}  找不到檔案 ${ref}`);
        continue;
      }
      if (!headings(target).some((h) => h.startsWith(anchor))) {
        problems.push(`${where}  ${relative(ROOT, target)} 沒有「${rawAnchor}」這個章節`);
      }
    }
  });
}

if (problems.length > 0) {
  process.stderr.write(`skill 章節連結失效（${problems.length} 處）：\n${problems.join('\n')}\n`);
  process.stderr.write('修法：把章節補回來，或把連結改到現在的章節名稱。不要為了變綠刪掉連結。\n');
  process.exit(1);
}
console.log(`skill-anchors: ${checked} 個章節連結都對得上`);
