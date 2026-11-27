// Chat UI 風格檢查：把「跟網站不搭」變成紅燈。
// 背景：Ask AI 曾用 shadcn／AI Elements 預設值（白 pill、深綠方塊、寫死重影）
// 拼出跟站內森林綠語言完全不同的 UI，深色還全死（data-theme vs .dark）。
// 規則刻意窄——只擋查證過的真問題，寧可漏抓也不要有噪音。
import fs from 'node:fs';
import path from 'node:path';

const CHAT_ROOT = path.resolve('src/components/Chat');
const SRC_ROOT = path.resolve('src');

// 例外：code-block 文字色，淺深色共用深底設計（見 2026-03-12 redesign spec）。
const HEX_ALLOW = new Set(['f8fafc']);

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(next, ext);
    return ext.some((e) => next.endsWith(e)) ? [next] : [];
  });
}

function linesOf(file) {
  return fs.readFileSync(file, 'utf8').split('\n');
}

const errors = [];
const add = (file, line, msg) =>
  errors.push(`${path.relative(process.cwd(), file)}:${line}: ${msg}`);

// 規則 1：token 不准有第二個來源（單一來源＝src/styles/tokens.css，前台與後台共用）。
// tokens.css 宣告的每一個 `--name:` 都不准在其他 .astro／.css 再宣告一次——
// 文章頁曾在 article 內把 --text-secondary／--brand-700 改掉，只看 tokens.css 的人會誤判顏色。
// 引用（var(--name)）不受影響；只擋「--name:」宣告。
const TOKEN_SOURCES = new Set(['src/styles/tokens.css']);

export function tokenNames(tokensCss) {
  return [...new Set([...tokensCss.matchAll(/(?<![\w-])(--[\w-]+)\s*:/g)].map((m) => m[1]))];
}

export function findTokenRedefinitions(text, names) {
  const hits = [];
  const patterns = names.map((name) => [name, new RegExp(`(?<![\\w-])${name}\\s*:`)]);
  text.split('\n').forEach((line, i) => {
    for (const [name, re] of patterns) if (re.test(line)) hits.push({ line: i + 1, name });
  });
  return hits;
}

// 規則 7：後台、通用元件、設計頁與專案手冊不准寫字面色（2026-11-27 後台統一到 tokens.css）。
// 後台曾在 3000 行 CSS 裡累積上百個寫死的 hex、不存在的 var(--color-*) fallback 與 Tailwind 色盤 class，
// 深色模式全壞、跟前台不同色。顏色只能是 var(--token) 或 globals.css 接好的語意 class。
// 唯一例外：flow builder 的節點分類色盤（step-fields.ts，理由寫在檔內）。
const LITERAL_SCOPE = [
  'src/styles/admin-tokens.css', 'src/styles/globals.css', 'src/layouts/AdminV2Layout.astro',
  'src/components/admin/', 'src/components/ui/', 'src/components/design/', 'src/pages/admin/', 'src/pages/design/',
  'src/pages/handbook/', 'src/layouts/DocsShell.astro',
];
const LITERAL_ALLOW = new Set(['src/components/admin/console/flow-builder/step-fields.ts']);
const PALETTE = 'slate|gray|zinc|neutral|stone|red|green|emerald|blue|amber|yellow|orange|sky|indigo|violet|purple|pink|rose|teal|lime|cyan';
const LITERAL_PATTERNS = [
  [/(?:^|[^&\w])#[0-9a-fA-F]{3,8}\b/, '字面 hex 色'],
  [/rgba?\(\s*\d/, '字面 rgb()／rgba() 色'],
  [/-\[#[0-9a-fA-F]/, 'Tailwind 任意值字面色'],
  [new RegExp(`\\b(?:bg|text|border|ring|from|via|to|divide|outline|fill|stroke|shadow)-(?:${PALETTE})-\\d{2,3}\\b`), 'Tailwind 色盤 class'],
  [/\b(?:bg|text|border)-(?:white|black)\b/, 'Tailwind 黑白 class'],
];

export function findColorLiterals(text) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$|\/\*.*?\*\/|^\s*\*.*$/g, '');
    const hit = LITERAL_PATTERNS.find(([re]) => re.test(code));
    if (hit) hits.push({ line: i + 1, label: hit[1] });
  });
  return hits;
}

function selfTest() {
  const names = tokenNames(':root {\n  --brand-700: #2d4a2d;\n  --text-secondary: #4a7c59;\n}\n[data-theme="dark"] { --brand-700: #c0c0c0; }');
  const cases = [
    ['抓得到 article 內重定義', 'article {\n  --text-secondary: #555;\n  --brand-700: #374151;\n}', 2],
    ['抓得到行內 style 重定義', '<div style="--brand-700:#000">', 1],
    ['引用 var() 不算', '.a { color: var(--brand-700); border-color: var(--text-secondary, #555); }', 0],
    ['名稱前綴相同的私有變數不算', '.dg { --brand-700-mix: red; --x-brand-700: red; }', 0],
    ['tokens.css 沒有的名稱不算', '.dg { --dg-ink: var(--text-primary); }', 0],
  ];
  const literalCases = [
    ['抓得到 hex', '.a { color: #b42318; }', 1],
    ['抓得到 rgba', "style={{ background: 'rgba(0,0,0,0.45)' }}", 1],
    ['抓得到 Tailwind 任意值', '<p class="text-[#92400e]">', 1],
    ['抓得到 Tailwind 色盤', '<span class="bg-emerald-50 text-emerald-700">', 1],
    ['抓得到 text-white', '"bg-destructive text-white"', 1],
    ['var() 不算', '.a { color: var(--danger); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-500) 28%, transparent); }', 0],
    ['HTML entity 不算', '<span>&#8594;</span>', 0],
    ['註解不算', '.a { color: var(--x); } /* 原本是 #3b82f6 */', 0],
    ['rgb(var()) 不算', '.a { color: rgb(var(--x)); }', 0],
  ];
  let bad = 0;
  for (const [label, text, want] of literalCases) {
    const got = findColorLiterals(text).length;
    if (got !== want) {
      bad++;
      console.log(`  [FAIL] ${label}：預期 ${want} 筆，實得 ${got} 筆`);
    }
  }
  if (names.join(',') !== '--brand-700,--text-secondary') {
    bad++;
    console.log(`  [FAIL] tokenNames 取出 ${names.join(',')}`);
  }
  for (const [label, text, want] of cases) {
    const got = findTokenRedefinitions(text, names).length;
    if (got !== want) {
      bad++;
      console.log(`  [FAIL] ${label}：預期 ${want} 筆，實得 ${got} 筆`);
    }
  }
  console.log(bad ? `self-test 失敗 ${bad} 項` : `self-test 通過（${cases.length + literalCases.length + 1} 項）`);
  return bad === 0;
}

if (process.argv.includes('--self-test')) process.exit(selfTest() ? 0 : 1);

const TOKEN_NAMES = tokenNames(fs.readFileSync(path.resolve('src/styles/tokens.css'), 'utf8'));
for (const file of walk(SRC_ROOT, ['.astro', '.css'])) {
  const rel = path.relative(process.cwd(), file).split(path.sep).join('/');
  if (TOKEN_SOURCES.has(rel)) continue;
  if (rel.startsWith('src/content/')) continue;
  for (const { line, name } of findTokenRedefinitions(fs.readFileSync(file, 'utf8'), TOKEN_NAMES)) {
    add(file, line, `token ${name} 出現第二來源——改色只改 src/styles/tokens.css，刪掉這份宣告`);
  }
}

// 規則 2–5：Chat 元件內的硬編碼風格。
for (const file of walk(CHAT_ROOT, ['.tsx'])) {
  linesOf(file).forEach((line, i) => {
    const n = i + 1;
    if (/boxShadow\s*:\s*['"`][^'"`]*['"`]/.test(line) && !line.includes('var(--')) {
      add(file, n, 'inline boxShadow 沒吃主題變數——陰影只能用 var(--shadow-*)，見 tokens.css');
    }
    if (/rgba\(\s*0\s*,\s*0\s*,\s*0/.test(line)) {
      add(file, n, '寫死的黑色陰影——淺色下會糊成髒影，改用 var(--shadow-*)');
    }
    if (/variant\s*=\s*"default"/.test(line)) {
      add(file, n, 'shadcn 預設 variant——必須同時用 var(--*)／chat-* class 對齊站內語言，不准裸用');
    }
    for (const m of line.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
      if (!HEX_ALLOW.has(m[1].toLowerCase())) {
        add(file, n, `硬編碼色 #${m[1]}——改用 var(--*)，例外只有 code-block 墨色 f8fafc`);
      }
    }
  });
}

for (const file of walk(SRC_ROOT, ['.astro', '.css', '.tsx', '.ts'])) {
  const rel = path.relative(process.cwd(), file).split(path.sep).join('/');
  if (LITERAL_ALLOW.has(rel) || !LITERAL_SCOPE.some((s) => rel === s || (s.endsWith('/') && rel.startsWith(s)))) continue;
  for (const { line, label } of findColorLiterals(fs.readFileSync(file, 'utf8'))) {
    add(file, line, `${label}——後台／通用元件／設計頁的顏色只能用 var(--token) 或語意 class（bg-primary、text-muted-foreground），值在 src/styles/tokens.css`);
  }
}

// 規則 6：dark: 哨兵——刪掉這行，深色下所有 dark: 規則靜默失效（2026-09-18 事故）。
const chatCss = path.resolve('src/styles/chat.css');
if (!fs.readFileSync(chatCss, 'utf8').includes('@custom-variant dark')) {
  add(chatCss, 1, '缺少 @custom-variant dark——本站用 [data-theme] 切換，沒這行 dark: 全死');
}

if (errors.length > 0) {
  console.log('check:chat-style blocking:');
  for (const e of errors) console.log(`  [ERROR] ${e}`);
  console.log(`\n${errors.length} blocking.`);
  process.exitCode = 1;
} else {
  console.log('check:chat-style: 0 blocking.');
}
