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

// 規則 1：token 不准有第二個來源（單一來源＝src/styles/tokens.css；後台獨立）。
for (const file of walk(SRC_ROOT, ['.astro', '.css'])) {
  const rel = path.relative(process.cwd(), file);
  if (rel === 'src/styles/tokens.css' || rel === 'src/styles/admin-tokens.css') continue;
  if (rel.startsWith('src/content/')) continue;
  linesOf(file).forEach((line, i) => {
    if (/--brand-900\s*:/.test(line)) {
      add(file, i + 1, 'token 出現第二來源——改色只改 src/styles/tokens.css，刪掉這份拷貝');
    }
  });
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
