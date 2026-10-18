#!/usr/bin/env node
// 岩場文章「依程度挑路線」表格的難度換算檢查／補欄。
//
// 為什麼有這支：義大利岩場系列（2026-10-18）讀者要看 YDS／V 級；第一版用一次性 Python 腳本補欄，
// 之後又手修了三種情況（分段清單取最難、E 級、不分 abc 的級數加「約」）。規則寫成可重跑的檢查，
// 新岩場文章與日後更新都照同一張表換算，不靠記憶。
//
// 換算表：Mountain Project International Climbing Grade Comparison Chart
//   https://www.mountainproject.com/international-climbing-grades
// 規格：.agents/skills/post/references/crag-guide-contract.md「難度換算」。
//
// 只看 `## 依程度挑路線` / `## Routes by level` 段落裡的表格：
//   - 表頭有「難度／Grade」→ 右邊要有 YDS 欄（法國運攀級數）
//   - 表頭有「原始難度／Original grade」→ 右邊要有 YDS 欄（UIAA 傳攀優先，其次 E 級、法國級）
//   - 表頭含「Font」→ 右邊要有「V 級／V grade」欄
// 原始級數已經是 YDS（5.10a）或 V 級的表格不需換算。
//
// 用法：
//   node scripts/climbing-grade-convert.mjs --check <files...>   缺欄、缺值或與對照表不符 → exit 1
//   node scripts/climbing-grade-convert.mjs --write <files...>   補缺的欄、空白值、標題 YDS 範圍與換算說明；
//                                                               不覆寫已有但不符的值（照樣回報）。可重跑。
//   node scripts/climbing-grade-convert.mjs --self-test

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

export const FR = {
  '3a': '5.2', '3b': '5.3', '3c': '5.3', '4a': '5.4', '4b': '5.5', '4c': '5.6', '5a': '5.7', '5b': '5.8', '5c': '5.9',
  '6a': '5.10a', '6a+': '5.10b', '6b': '5.10c', '6b+': '5.10d', '6c': '5.11a/b', '6c+': '5.11c', '7a': '5.11d',
  '7a+': '5.12a', '7b': '5.12b', '7b+': '5.12c', '7c': '5.12d', '7c+': '5.13a', '8a': '5.13b', '8a+': '5.13c',
  '8b': '5.13d', '8b+': '5.14a', '8c': '5.14b', '8c+': '5.14c', '9a': '5.14d', '9a+': '5.15a', '9b': '5.15b',
  '9b+': '5.15c', '9c': '5.15d',
};
// 來源沒分 a/b/c 的級數，或對照表沒有的半級：輸出加「約」。
export const FR_APPROX = { '3': '5.2', '3+': '5.3', '4': '5.4–5.5', '4+': '5.6', '5': '5.7–5.8', '5+': '5.9', '5c+': '5.9+' };
export const UIAA = {
  'III': '5.3', 'IV-': '5.4', 'IV': '5.4', 'IV+': '5.5', 'V-': '5.6', 'V': '5.6', 'V+': '5.7', 'VI-': '5.8', 'VI': '5.9',
  'VI+': '5.10a', 'VII-': '5.10b', 'VII': '5.10c', 'VII+': '5.10d', 'VIII-': '5.11b', 'VIII': '5.11d', 'VIII+': '5.12a',
  'IX-': '5.12c', 'IX': '5.12d', 'IX+': '5.13a', 'X-': '5.13b', 'X': '5.13c', 'X+': '5.13d',
};
// 英國 E 級混合了保護與難度，只給到數字級（一律加「約」）。
export const E_GRADE = { E1: '5.10', E2: '5.10', E3: '5.11', E4: '5.11', E5: '5.12', E6: '5.12', E7: '5.13', E8: '5.13', E9: '5.14' };
export const FONT = {
  '3': 'VB', '4': 'V0', '4+': 'V0+', '5': 'V1', '5+': 'V2', '5A': 'V1', '5B': 'V1', '5C': 'V2', '6A': 'V3', '6A+': 'V3+',
  '6B': 'V4', '6B+': 'V4+', '6C': 'V5', '6C+': 'V5+', '7A': 'V6', '7A+': 'V7', '7B': 'V8', '7B+': 'V8+', '7C': 'V9',
  '7C+': 'V10', '8A': 'V11', '8A+': 'V12', '8B': 'V13', '8B+': 'V14', '8C': 'V15', '8C+': 'V16', '9A': 'V17',
};

const FR_RE = /(?<![\w.])([3-9][abc]\+?|[3-5]\+?)(?![\w.])/g;
const UIAA_RE = /(?<![A-Za-z])(X[+-]?|IX[+-]?|VIII[+-]?|VII[+-]?|VI[+-]?|IV[+-]?|V[+-]?|III)(?![A-Za-z])/;
const E_RE = /(?<![A-Za-z])E([1-9])(?:\s*\/\s*E([1-9]))?(?!\d)/;
const FONT_RE = /(?<![\w])([3-9][ABC]\+?|[3-5]\+?)(?![\w])/;
const HARDEST_RE = /最難|hardest/i;
const REVISED_RE = /後改|改為|later|downgraded/i;


function frValue(g) {
  if (g in FR) return FR[g];
  if (g in FR_APPROX) return `約 ${FR_APPROX[g]}`;
  return null;
}

// 去掉括號內補充（「必要 5b」「hardest pitch 6b+」「thetopo」）與輔助攀登 A1/A2，不讓它們被當成主級數。
function mainPart(cell) {
  return cell
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/（[^）]*）|\([^)]*\)/g, ' ')
    .replace(/\bA\d\b/g, ' ')
    .split(/[；;]/)[0]
    // 「必要 6a+」「6a obligatory」是最低必要難度，不是另一段。
    .replace(/[，,]?\s*必要\s*[3-9][abc]?\+?/g, ' ')
    .replace(/[，,]?\s*[3-9][abc]?\+?\s*obligatory/gi, ' ');
}

export function toYds(cell, { trad = false } = {}) {
  const raw = cell.trim();
  if (!raw || raw === '—' || raw === '-') return '—';
  if (/^5\.\d/.test(raw)) return null; // 已經是 YDS
  const main = mainPart(raw);
  if (trad) {
    const u = main.match(UIAA_RE);
    if (u) return UIAA[u[1]];
  }
  const e = main.match(E_RE);
  if (e && !main.match(FR_RE)) {
    const lo = E_GRADE[`E${e[1]}`];
    const hi = e[2] ? E_GRADE[`E${e[2]}`] : lo;
    return `約 ${lo === hi ? lo : `${lo}–${hi}`}`;
  }
  const hasHardestWord = HARDEST_RE.test(main);
  // 「提 9a，後改 8c+」「Proposed 9a, later 8c+」→ 以後來的共識為準。
  const revised = main.search(REVISED_RE);
  const target = revised >= 0 ? main.slice(revised) : hasHardestWord ? main.slice(main.search(HARDEST_RE)) : main;
  const grades = [...target.matchAll(FR_RE)].map((m) => m[1]).filter((g) => frValue(g));
  if (!grades.length) return '—';
  // 「6c/6c+」「8b/8b+」是同一段的兩種標法 → 取第一個；「5b、3a、5c+」「6b and 7a+」是分段清單 → 取最難並標「最難」。
  const isPitchList = !hasHardestWord && revised < 0 && grades.length > 1 && /[、,，]|\band\b|和|與/.test(target);
  if (isPitchList) {
    const hardest = grades.reduce((a, b) => (rank(b) > rank(a) ? b : a));
    return `最難 ${frValue(hardest)}`;
  }
  return frValue(grades[0]);
}

function rank(g) {
  const keys = Object.keys(FR);
  if (g in FR) return keys.indexOf(g);
  const approxBase = { '3': '3a', '3+': '3b', '4': '4a', '4+': '4c', '5': '5a', '5+': '5c', '5c+': '5c' }[g];
  return approxBase ? keys.indexOf(approxBase) + 0.5 : -1;
}

export function toV(cell) {
  const raw = cell.trim();
  if (!raw || raw === '—') return '—';
  if (/^V\d|^VB/.test(raw)) return null;
  const m = mainPart(raw).match(FONT_RE);
  return m && FONT[m[1]] ? FONT[m[1]] : '—';
}

const localize = (v, en) => (en ? v.replace(/^最難 /, 'hardest ').replace(/(^|hardest )約 /, '$1approx. ') : v);
const norm = (v) => v.replace(/\s+/g, ' ').replace(/approx\.\s*/i, '約 ').replace(/^hardest\s*/i, '最難 ').replace(/[-–]/g, '–').trim();

export const HEAD = {
  '### 入門：6a 以下': '### 入門：6a 以下（YDS 5.10a 以下）',
  '### 中級：6a+ 到 6c+': '### 中級：6a+ 到 6c+（YDS 5.10b–5.11c）',
  '### 進階：7a 到 7c+': '### 進階：7a 到 7c+（YDS 5.11d–5.13a）',
  '### 高手：8a 以上': '### 高手：8a 以上（YDS 5.13b 以上）',
  '### Beginner: up to 6a': '### Beginner: up to 6a (YDS 5.10a and below)',
  '### Intermediate: 6a+ to 6c+': '### Intermediate: 6a+ to 6c+ (YDS 5.10b–5.11c)',
  '### Advanced: 7a to 7c+': '### Advanced: 7a to 7c+ (YDS 5.11d–5.13a)',
  '### Expert: 8a and up': '### Expert: 8a and up (YDS 5.13b and up)',
};
export const NOTE_ZH = 'YDS／V 級換算照 [Mountain Project 國際難度對照表](https://www.mountainproject.com/international-climbing-grades)，只是近似值；標「約」的是來源只寫 4、5+ 這類不分 abc 的級數。難度以原始級數為準。';
export const NOTE_EN = 'YDS and V-grade conversions follow the [Mountain Project international grade comparison chart](https://www.mountainproject.com/international-climbing-grades) and are approximate; "approx." marks grades the sources give without a/b/c (such as 4 or 5+). The original grade is the one that counts.';

const SECTION_RE = /^## (?:依程度挑路線|Routes by level)\s*$/m;
const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isSep = (line) => /^\|?[\s|:-]+\|?$/.test(line.trim()) && line.includes('-');
const joinRow = (c) => `| ${c.join(' | ')} |`;

function headerMode(c) {
  for (let i = 0; i < c.length; i++) {
    const h = c[i];
    if (/Font/i.test(h)) return { mode: 'V', col: i, trad: false };
    if (['難度', 'Grade', '原始難度', 'Original grade'].includes(h)) return { mode: 'Y', col: i, trad: /原始|Original/.test(h) };
  }
  return null;
}
const isTarget = (h, mode) => (mode === 'Y' ? /^YDS$/i.test(h) : /^V( 級| grade)?$/i.test(h));

export function processText(text, { write = false, en = false } = {}) {
  const issues = [];
  const m = SECTION_RE.exec(text);
  if (!m) return { text, issues, rows: 0, noSection: true };
  const start = m.index + m[0].length;
  const nextH2 = text.slice(start).search(/^## /m);
  const end = nextH2 < 0 ? text.length : start + nextH2;
  const before = text.slice(0, start);
  const lines = text.slice(start, end).split('\n');
  const lineOffset = before.split('\n').length - 1;
  const out = [];
  let tbl = null;
  let rows = 0;
  lines.forEach((line, idx) => {
    const ln = lineOffset + idx + 1;
    const st = line.trim();
    if (line.startsWith('### ')) {
      const fixed = HEAD[line.trimEnd()];
      if (fixed) {
        if (write) line = fixed;
        else issues.push(`L${ln}: 標題缺 YDS 範圍 → ${fixed}`);
      }
    }
    if (!st.startsWith('|')) {
      tbl = null;
      out.push(line);
      return;
    }
    const c = cells(st);
    if (!tbl) {
      const hm = headerMode(c);
      tbl = hm ? { ...hm, has: isTarget(c[hm.col + 1] ?? '', hm.mode) } : { mode: null };
      if (hm && !tbl.has) {
        const label = hm.mode === 'Y' ? 'YDS' : en ? 'V grade' : 'V 級';
        if (write) {
          c.splice(hm.col + 1, 0, label);
          line = joinRow(c);
        } else issues.push(`L${ln}: 表格缺 ${label} 欄（在「${c[hm.col]}」右邊）`);
      }
      out.push(line);
      return;
    }
    if (!tbl.mode) return out.push(line);
    if (isSep(st)) {
      if (!tbl.has && write) {
        c.splice(tbl.col + 1, 0, '---');
        line = `|${c.join('|')}|`;
      }
      return out.push(line);
    }
    const src = c[tbl.col] ?? '';
    const expRaw = tbl.mode === 'Y' ? toYds(src, { trad: tbl.trad }) : toV(src);
    rows++;
    if (expRaw === null) return out.push(line); // 原始級數已是目標系統
    const exp = localize(expRaw, en);
    if (!tbl.has) {
      if (write) {
        c.splice(tbl.col + 1, 0, exp);
        line = joinRow(c);
      }
      return out.push(line);
    }
    const actual = c[tbl.col + 1] ?? '';
    if (!actual) {
      if (write) {
        c[tbl.col + 1] = exp;
        line = joinRow(c);
      } else issues.push(`L${ln}: 「${c[0]}」${src} 缺換算值 → ${exp}`);
    } else if (norm(actual) !== norm(exp)) {
      issues.push(`L${ln}: 「${c[0]}」${src} 寫 ${actual}，對照表是 ${exp}`);
    }
    out.push(line);
  });
  let body = out.join('\n');
  const note = en ? NOTE_EN : NOTE_ZH;
  if (!body.includes('mountainproject.com/international-climbing-grades')) {
    if (write) body = `\n${note}\n${body}`;
    else issues.push(`L${lineOffset + 1}: 段落缺換算說明（Mountain Project 對照表連結）`);
  }
  return { text: before + body + text.slice(end), issues, rows, noSection: false };
}

function selfTest() {
  const cases = [
    [['5c+'], '約 5.9+'], [['6c/6c+'], '5.11a/b'], [['6b、7a+ 兩段'], '最難 5.12a'], [['5b、3a、5c+'], '最難 約 5.9+'],
    [['6a, 5c, 5b'], '最難 5.10a'], [['6b and 7a+ pitches'], '最難 5.12a'], [['最難 6b，必要 6a'], '5.10c'],
    [['6a（最難一段）'], '5.10a'], [['5c（必要 5b）'], '5.9'], [['6b (hardest pitch 6b+)'], '5.10c'], [['4+'], '約 5.6'],
    [['5'], '約 5.7–5.8'], [['4（thetopo）'], '約 5.4–5.5'], [['E4/E5'], '約 5.11–5.12'], [['5c S2'], '5.9'],
    [['VII（必要 VI）；UKC 標 E1/E2', { trad: true }], '5.10c'], [['IV-', { trad: true }], '5.4'], [['5.10a'], null],
    [['（theCrag 頁面未顯示）'], '—'], [['8b/8b+'], '5.13d'],
  ];
  let fail = 0;
  for (const [[cell, opt], want] of cases) {
    const got = toYds(cell, opt);
    if (got !== want) { fail++; console.error(`FAIL toYds(${cell}) = ${got}, want ${want}`); }
  }
  for (const [cell, want] of [['7A+', 'V7'], ['6C+', 'V5+'], ['5C', 'V2']]) {
    if (toV(cell) !== want) { fail++; console.error(`FAIL toV(${cell}) = ${toV(cell)}, want ${want}`); }
  }
  const sample = `## 依程度挑路線\n\n### 入門：6a 以下\n\n| 路線 | 難度 | 長度 |\n|---|---|---|\n| A | 5b、3a、5c+ | 3 段 |\n\n## 參考資料\n`;
  const once = processText(sample, { write: true }).text;
  const twice = processText(once, { write: true }).text;
  if (once !== twice) { fail++; console.error('FAIL --write not idempotent'); }
  if (processText(once).issues.length) { fail++; console.error('FAIL --check after --write:', processText(once).issues); }
  console.log(fail ? `${fail} self-test failure(s)` : 'self-test ok');
  process.exit(fail ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
const write = args.includes('--write');
const check = args.includes('--check');
let files = args.filter((a) => !a.startsWith('--'));
// --check 不給檔案時（pnpm verify 用）：掃全站有「依程度挑路線／Routes by level」段落的文章。
if (check && !write && !files.length) {
  const POSTS = 'src/content/posts';
  files = readdirSync(POSTS, { recursive: true })
    .filter((p) => p.endsWith('.md'))
    .map((p) => join(POSTS, p))
    .filter((p) => /^## (依程度挑路線|Routes by level)$/m.test(readFileSync(p, 'utf8')));
}
if ((!write && !check) || !files.length) {
  console.error('usage: climbing-grade-convert.mjs --check|--write <files...> | --self-test');
  process.exit(2);
}
let bad = 0;
let totalRows = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const r = processText(text, { write, en: f.endsWith('-en.md') });
  totalRows += r.rows;
  if (r.noSection) { console.log(`- ${basename(f)}: 沒有「依程度挑路線」段落，略過`); continue; }
  if (write && r.text !== text) writeFileSync(f, r.text);
  if (r.issues.length) {
    bad++;
    console.log(`✗ ${basename(f)} (${r.rows} rows)`);
    for (const i of r.issues) console.log(`    ${i}`);
  } else console.log(`✓ ${basename(f)} (${r.rows} rows)`);
}
console.log(`\n${files.length} files, ${totalRows} grade rows, ${bad} file(s) with issues`);
process.exit(bad ? 1 : 0);
