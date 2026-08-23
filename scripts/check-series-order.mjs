import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(next) : next.endsWith('.md') ? [next] : [];
  });
}

// zh 與 en 是同一個系列的兩個語面，各自從 1 開始編號，所以分開檢查。
export function groupBySeries(files) {
  const groups = new Map();
  for (const file of files) {
    const { data } = matter(fs.readFileSync(file, 'utf8'));
    const lang = data.lang === 'en' ? 'en' : 'zh-TW';
    const memberships = [data.series, ...(data.additionalSeries ?? [])]
      .filter((series) => series && typeof series.name === 'string');
    for (const series of memberships) {
      const key = `${series.name}\t${lang}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ file, order: series.order });
    }
  }
  return groups;
}

export function findProblems(groups) {
  const problems = [];
  const warnings = [];
  for (const [key, items] of [...groups].sort()) {
    const [name, lang] = key.split('\t');
    const label = `${name} [${lang}]`;

    const missing = items.filter((item) => typeof item.order !== 'number');
    if (missing.length > 0) {
      problems.push({ label, kind: 'series.order 缺漏或不是數字', files: missing.map((item) => item.file) });
    }

    const byOrder = new Map();
    for (const item of items) {
      if (typeof item.order !== 'number') continue;
      if (!byOrder.has(item.order)) byOrder.set(item.order, []);
      byOrder.get(item.order).push(item.file);
    }

    for (const [order, files] of [...byOrder].sort((a, b) => a[0] - b[0])) {
      if (files.length > 1) {
        problems.push({ label, kind: `order ${order} 重複 ${files.length} 次`, files });
      }
    }

    const orders = [...byOrder.keys()].sort((a, b) => a - b);
    if (orders.length > 0) {
      const gaps = [];
      for (let n = orders[0]; n < orders[orders.length - 1]; n += 1) {
        if (!byOrder.has(n)) gaps.push(n);
      }
      if (gaps.length > 0) {
        // 缺號常常只是系列還沒寫完（多 session 同時在寫時尤其常見），
        // 所以只提示不擋。重複編號才是一定錯的。
        warnings.push({ label, kind: `order 有缺號：${gaps.join(', ')}（若系列尚未寫完可忽略）` });
      }
    }
  }
  return { problems, warnings };
}

function main() {
  const groups = groupBySeries(walk(POSTS_ROOT));
  const { problems, warnings } = findProblems(groups);

  for (const w of warnings) console.log(`[warn] ${w.label} — ${w.kind}`);

  if (problems.length === 0) {
    console.log(`OK: checked ${groups.size} series group(s), ${warnings.length} warning(s), no blocking order issues.`);
    return;
  }

  for (const problem of problems) {
    console.log(`\n${problem.label} — ${problem.kind}`);
    for (const file of problem.files) {
      console.log(`  ${path.relative(process.cwd(), file)}`);
    }
  }
  console.log(`\nSummary: ${problems.length} blocking series order issue(s).`);
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
