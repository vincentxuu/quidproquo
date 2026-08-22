import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');

// 不強制每篇中文都要有英文版——那是編輯決定。
// 這支只檢查「兩邊都存在時有沒有分岔」：改了一邊忘了另一邊。
const STRUCTURE_DRIFT_RATIO = 0.25;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(next) : next.endsWith('.md') ? [next] : [];
  });
}

function readPost(file) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const body = content.replace(/```[\s\S]*?```/g, '');
  return {
    data,
    headings: (body.match(/^#{1,3} .+$/gm) ?? []).length,
    changelog: (body.match(/^- \d{4}-\d{2}-\d{2}/gm) ?? []).length,
  };
}

function main() {
  const problems = [];
  let pairs = 0;

  for (const zhFile of walk(POSTS_ROOT)) {
    if (zhFile.endsWith('-en.md')) continue;
    const enFile = zhFile.replace(/\.md$/, '-en.md');
    if (!fs.existsSync(enFile)) continue;

    pairs += 1;
    const rel = path.relative(process.cwd(), zhFile);
    const zh = readPost(zhFile);
    const en = readPost(enFile);

    if (en.data.lang !== 'en') {
      problems.push(`${rel}\n  英文版的 lang 不是 en（是 ${JSON.stringify(en.data.lang)}）`);
    }
    if (String(zh.data.date) !== String(en.data.date)) {
      problems.push(`${rel}\n  date 不一致：zh ${zh.data.date} / en ${en.data.date}——同一篇的兩個語面應該同日`);
    }

    const zhSeries = zh.data.series?.order;
    const enSeries = en.data.series?.order;
    if (zhSeries !== enSeries) {
      problems.push(`${rel}\n  series.order 不一致：zh ${zhSeries} / en ${enSeries}`);
    }

    const max = Math.max(zh.headings, en.headings);
    if (max > 0 && Math.abs(zh.headings - en.headings) / max > STRUCTURE_DRIFT_RATIO) {
      problems.push(
        `${rel}\n  章節數差太多：zh ${zh.headings} 個標題 / en ${en.headings} 個——通常是只改了一邊`,
      );
    }

    if (zh.changelog !== en.changelog) {
      problems.push(
        `${rel}\n  更新紀錄筆數不一致：zh ${zh.changelog} / en ${en.changelog}——一邊更新了，另一邊沒跟上`,
      );
    }
  }

  if (problems.length === 0) {
    console.log(`OK: checked ${pairs} zh/en pair(s), no parity issues found.`);
    return;
  }

  for (const problem of problems) {
    console.log(`\n${problem}`);
  }
  console.log(`\nSummary: ${problems.length} parity issue(s) across ${pairs} pair(s).`);
  process.exitCode = 1;
}

main();
