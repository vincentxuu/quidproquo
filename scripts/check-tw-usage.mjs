#!/usr/bin/env node
// check:tw-usage — catch Chinese-mainland vocabulary in `lang: zh-TW` posts.
//
// Why this exists: 繁體字 ≠ 台灣用語. The model's Chinese training data is
// dominated by mainland content, so CN vocabulary leaks into drafts — most
// often in passages rewritten from English sources. The word list used to
// live only as a grep snippet in the post skill's writing guide, which meant
// it was never actually run.
//
// Scope is deliberately narrow: by default only files you changed. The
// existing corpus predates this check and contains legitimate exceptions
// (質量 as physics mass, 天花板 as a metaphor Taiwan also uses), so a
// repo-wide hard gate would be red on day one and would train people to
// ignore it. `--all` audits everything but stays advisory unless `--strict`.
//
// Usage:
//   node scripts/check-tw-usage.mjs                  # changed posts (default)
//   node scripts/check-tw-usage.mjs <path> [...]     # specific files/dirs
//   node scripts/check-tw-usage.mjs --all            # whole corpus, report only
//   node scripts/check-tw-usage.mjs --all --strict   # whole corpus, fail on hits
//
// Escapes, for the genuine exceptions:
//   <!-- tw-usage-ignore -->        on the line before  → skips the next line
//   <!-- tw-usage-ignore-file -->   anywhere in a file  → skips the whole file

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const POSTS_ROOT = path.resolve('src/content/posts');

// Blocked: mainland-only, no Taiwanese reading worth keeping. Guards exist
// where a legitimate Taiwanese word contains the pattern (產品類別, 部落格來,
// 確保安全, 封閉環境, 貼標籤, 工作流程).
const BLOCKED = [
  ['(?<!產)品類(?!別)', '類別'],
  ['貼標(?!籤)', '貼上……的標籤'],
  ['機構記憶', '組織記憶'],
  ['視頻', '影片'],
  ['網絡', '網路'],
  ['信號(?!彈|槍|旗|鏈路)', '訊號'],
  ['信息', '資訊 / 訊息'],
  ['界面', '介面'],
  ['用戶', '使用者'],
  ['默認', '預設'],
  ['缺省', '預設'],
  ['博客(?!來)', '部落格'],
  ['審計(?!部)', '稽核'],
  ['(?<!確)保安(?!全)', '保全'],
  ['賦能', '說明實際做了什麼'],
  ['抓手', '施力點 / 做法'],
  ['(?<!封)閉環', '完整流程'],
  ['對標', '比照 / 對照'],
  ['復盤', '檢討 / 回顧'],
  ['顆粒度', '細緻程度'],
  ['量級', '規模 / 數量'],
  ['工作流(?!程)', '工作流程 / workflow'],
  ['橡皮鴨', '小黃鴨除錯法'],
  ['調用', '呼叫 / 叫用'],
  ['激活', '啟用'],
  ['打印', '列印'],
  ['端口', '連接埠'],
  ['軟件', '軟體'],
  ['硬件', '硬體'],
  ['內存', '記憶體'],
  ['硬盤', '硬碟'],
  ['服務器', '伺服器'],
  ['屏幕', '螢幕'],
  ['郵箱', '信箱'],
  ['立馬', '馬上'],
  ['靠譜', '可靠'],
];

// Judgement calls: legitimate in some contexts, translationese in others.
// Reported, never fatal — a human has to read the sentence.
const REVIEW = [
  ['質量', '物理的 mass 可留；指 quality 要改「品質」'],
  ['天花板', '若是 ceiling 直譯改「上限」；台灣自有的比喻用法可留'],
  ['鷹架', '教育學的 scaffolding 可留；scaffolding 硬譯成鷹架要改'],
  ['阻塞', '網路 / OS 教科書用法可留；blocking 直譯建議改「卡住」'],
  ['對齊', 'align 直譯，多半可改「講清楚方向」「照著走」'],
  ['項目', '指 project 要改「專案」；指品項（檢查項目）可留'],
  ['卸載', '軟體請用「解除安裝」；貨物卸載可留'],
];

const TRANSLATIONESE_REMINDER = [
  '腳本抓不到翻譯腔，逐句自己看這五型：',
  '  1. 形容詞直譯：很不性感（unglamorous）→ 很不起眼',
  '  2. 名詞化：國家層級的執法啟動 → 國家層級開始執法',
  '  3. 英文語序：辯護每個選擇 → 為每個選擇辯護',
  '  4. 術語硬譯：framing → 多半是「說法」「講法」，不是「框架」',
  '  5. 隱喻直譯：ceiling→天花板、scaffolding→鷹架、ticket→票',
];

const PROSE_FRONTMATTER_KEY = /^\s*-?\s*(title|tldr|description|definition|advanced|context):/;

function compile(entries) {
  return entries.map(([source, suggestion]) => ({
    source,
    suggestion,
    regex: new RegExp(source, 'g'),
  }));
}

const BLOCKED_RULES = compile(BLOCKED);
const REVIEW_RULES = compile(REVIEW);

function walkMarkdownFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  if (fs.statSync(targetPath).isFile()) {
    return targetPath.endsWith('.md') ? [targetPath] : [];
  }
  return fs.readdirSync(targetPath, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(targetPath, entry.name);
    return entry.isDirectory() ? walkMarkdownFiles(next) : next.endsWith('.md') ? [next] : [];
  });
}

function changedPostFiles() {
  let output;
  try {
    output = execSync('git status --porcelain --untracked-files=all', { encoding: 'utf8' });
  } catch {
    return null; // not a git checkout — caller falls back to advisory mode
  }

  const files = new Set();
  for (const line of output.split('\n')) {
    if (!line.trim()) continue;
    let file = line.slice(3).trim();
    if (file.includes(' -> ')) file = file.split(' -> ')[1].trim(); // rename
    if (file.startsWith('"') && file.endsWith('"')) file = JSON.parse(file);
    if (!file.endsWith('.md')) continue;
    const resolved = path.resolve(file);
    if (!resolved.startsWith(POSTS_ROOT)) continue;
    if (!fs.existsSync(resolved)) continue; // deleted
    files.add(resolved);
  }
  return [...files];
}

// Only prose is checked. Code fences, inline code, and link targets carry
// English identifiers and quoted source text that must stay verbatim.
function maskNonProse(line) {
  return line
    .replace(/`[^`]*`/g, (m) => ' '.repeat(m.length))
    .replace(/\]\([^)]*\)/g, (m) => ' '.repeat(m.length));
}

function isTraditionalChinesePost(text) {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!frontmatter) return false;
  const lang = /^lang:\s*['"]?([\w-]+)/m.exec(frontmatter[1]);
  return !lang || lang[1] === 'zh-TW';
}

function scanFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (!isTraditionalChinesePost(text)) return { blocked: [], review: [] };
  if (text.includes('<!-- tw-usage-ignore-file -->')) return { blocked: [], review: [] };

  const lines = text.split('\n');
  const blocked = [];
  const review = [];
  let inFence = false;
  let inFrontmatter = false;

  for (const [index, raw] of lines.entries()) {
    if (index === 0 && raw.trim() === '---') { inFrontmatter = true; continue; }
    // Frontmatter is mostly identifiers (tags, slug, dates), but title / tldr /
    // description / glossary prose all render to readers — those get checked.
    if (inFrontmatter) {
      if (raw.trim() === '---') { inFrontmatter = false; continue; }
      if (!PROSE_FRONTMATTER_KEY.test(raw)) continue;
    }
    if (/^\s*```/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (index > 0 && lines[index - 1].includes('<!-- tw-usage-ignore -->')) continue;

    const line = maskNonProse(raw);
    for (const [bucket, rules] of [[blocked, BLOCKED_RULES], [review, REVIEW_RULES]]) {
      for (const rule of rules) {
        rule.regex.lastIndex = 0;
        let match;
        while ((match = rule.regex.exec(line)) !== null) {
          bucket.push({
            file,
            line: index + 1,
            term: match[0],
            suggestion: rule.suggestion,
            excerpt: raw.trim().slice(0, 90),
          });
        }
      }
    }
  }
  return { blocked, review };
}

const args = process.argv.slice(2);
const all = args.includes('--all');
const strict = args.includes('--strict');
const explicitPaths = args.filter((a) => !a.startsWith('--'));

let files;
let scopeLabel;
let advisory = false;

if (explicitPaths.length > 0) {
  files = explicitPaths.flatMap((p) => walkMarkdownFiles(path.resolve(p)));
  scopeLabel = `${files.length} file(s) from arguments`;
} else if (all) {
  files = walkMarkdownFiles(POSTS_ROOT);
  scopeLabel = `all ${files.length} post files`;
  advisory = !strict;
} else {
  const changed = changedPostFiles();
  if (changed === null) {
    files = walkMarkdownFiles(POSTS_ROOT);
    scopeLabel = `all ${files.length} post files (no git — advisory)`;
    advisory = true;
  } else {
    files = changed;
    scopeLabel = `${files.length} changed post file(s)`;
  }
}

const blocked = [];
const review = [];
for (const file of files) {
  const result = scanFile(file);
  blocked.push(...result.blocked);
  review.push(...result.review);
}

function render(items) {
  const seen = new Set();
  return items
    .filter((i) => {
      const key = `${i.file}:${i.line}:${i.term}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((i) => `  ${path.relative('.', i.file)}:${i.line}  「${i.term}」→ ${i.suggestion}\n      ${i.excerpt}`)
    .join('\n');
}

if (blocked.length === 0 && review.length === 0) {
  console.log(`OK: tw-usage clean (${scopeLabel}).`);
  console.log(TRANSLATIONESE_REMINDER[0]);
  process.exit(0);
}

if (review.length > 0) {
  console.log(`\n人工判讀（不擋，但每一個都要看過）— ${review.length} 處:`);
  console.log(render(review));
}

if (blocked.length > 0) {
  console.log(`\n${advisory ? '中國用語（稽核模式，不擋）' : '中國用語（必須修）'} — ${blocked.length} 處:`);
  console.log(render(blocked));
  console.log('\n合法的例外請加 <!-- tw-usage-ignore --> 在該行前一行。');
}

console.log(`\n${TRANSLATIONESE_REMINDER.join('\n')}`);
console.log(`\nscope: ${scopeLabel}`);
process.exit(blocked.length > 0 && !advisory ? 1 : 0);
