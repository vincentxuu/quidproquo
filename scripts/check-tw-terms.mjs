// 台灣用語檢查。分兩級：
//   A 級 = 在台灣沒有正當用法，紅燈擋 commit
//   B 級 = 看語境（物理的「質量」、專有名詞裡的「智能」），只提示不擋
// 詞表刻意窄——寧可漏抓也不要有噪音，因為紅燈要能被信任。
// 廣度交給 zhtw-mcp 定期健檢，見 .agents/skills/post/references/writing-guide.md#台灣用語
import fs from 'node:fs';
import path from 'node:path';

const POSTS_ROOT = path.resolve('src/content/posts');

// A 級：查證過站內零誤判
const BLOCK = {
  視頻: '影片', 網絡: '網路', 用戶: '使用者', 默認: '預設', 軟件: '軟體', 硬件: '硬體',
  插件: '外掛', 兼容: '相容', 屏幕: '螢幕', 鼠標: '滑鼠', 硬盤: '硬碟',
  賦能: '（重寫整句）', 抓手: '（重寫整句）', 對標: '對照、比較', 復盤: '檢討、回顧',
  顆粒度: '粒度、細緻度', 品類: '類別', 機構記憶: '組織記憶',
};

// B 級：站內有正當用法，只提示
const WARN = {
  質量: '品質（物理語境不用改）',
  智能: '智慧（專有名詞如「北京人工智能研究院」不用改）',
  信號: '訊號（引述原文不用改）',
  界面: '介面（生物、地質的「界面」不用改）',
  反饋: '回饋（控制理論的「反饋」不用改）',
  博客: '部落格（「博客來」不用改）',
  保安: '保全（「確保安全」不用改）',
  激活: '啟用（機器學習的 activation 不用改）',
  貼標: '貼上標籤（「貼標籤」本身沒問題）',
};

// 註：以下三條曾在 A 級，2026-08-21 依站內實際語境降級或移除：
//   審計 — 移除。36 次全是 SOC2 審計，且審計部是中華民國機關。
//   激活 — 降 B。23 次全是機器學習的 activation（激活空間、激活量化、非線性激活）。
//   貼標 — 降 B。站內唯一一次是「貼標籤」，改成「貼上標籤」會變「貼上標籤籤」。

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(next) : next.endsWith('.md') ? [next] : [];
  });
}

// 程式碼、行內程式碼、連結網址、blockquote 引述原文都不算
function scannable(source) {
  return source
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .split('\n')
    // 這兩條必須在「把連結扁平成純文字」之前跑，否則行首特徵已經被抹掉
    // 參考資料那種「- [外部文章標題](url)」的行不檢查——別人的標題不該被我們改
    .map((line) => (/^\s*[-*] \[[^\]]*\]\(/.test(line) ? '' : line))
    .map((line) => (line.startsWith('>') ? '' : line))
    .join('\n')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

// 台灣正規用語，但字面上包含 A 級詞（例：「用戶端」含「用戶」）
const CARVE_OUTS = ['用戶端', '博客來', '確保安全', '針對標', '相對標'];

// 以「這些詞本身」為題的文章——詞是被討論的對象，不是被使用的
const EXEMPT = ['2026-08-21-zh-tw-terminology-linters-tested.md'];

function scan(file) {
  let text = scannable(fs.readFileSync(file, 'utf8'));
  for (const phrase of CARVE_OUTS) text = text.split(phrase).join('');
  const found = { block: [], warn: [] };
  for (const [tier, table] of [['block', BLOCK], ['warn', WARN]]) {
    for (const [term, better] of Object.entries(table)) {
      const count = text.split(term).length - 1;
      if (count > 0) found[tier].push({ term, better, count });
    }
  }
  return found;
}

function main() {
  const args = process.argv.slice(2);
  const files = args.length > 0
    ? args.flatMap((p) => (fs.statSync(p).isDirectory() ? walk(path.resolve(p)) : [path.resolve(p)]))
    : walk(POSTS_ROOT).filter((f) => !f.endsWith('-en.md'));
  const scanned = files.filter((f) => !EXEMPT.includes(path.basename(f)));

  let blockTotal = 0;
  let warnTotal = 0;
  const report = [];

  for (const file of scanned) {
    const { block, warn } = scan(file);
    if (block.length === 0 && warn.length === 0) continue;
    blockTotal += block.reduce((s, x) => s + x.count, 0);
    warnTotal += warn.reduce((s, x) => s + x.count, 0);
    report.push({ file, block, warn });
  }

  for (const r of report) {
    console.log(`\n${path.relative(process.cwd(), r.file)}`);
    for (const x of r.block) console.log(`  [ERROR] ${x.term} ×${x.count} → ${x.better}`);
    for (const x of r.warn) console.log(`  [WARN]  ${x.term} ×${x.count} → ${x.better}`);
  }

  console.log(
    `\nchecked ${scanned.length} zh-TW post file(s): ${blockTotal} blocking, ${warnTotal} to review.`,
  );

  if (blockTotal > 0) {
    console.log('A 級是台灣沒有正當用法的詞，請改掉。B 級看語境自行判斷。');
    process.exitCode = 1;
  }
}

main();
