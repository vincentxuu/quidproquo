import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');

const TRANSLATION_REQUIRED_CATEGORIES = new Set([
  'ai',
  'tech',
  'learning',
  'education',
  'policy',
  'design',
  'marketing',
  'product',
  'daily',
]);

// Legacy published zh-TW posts that predate the bilingual hard gate.
// New published structured posts should ship with an adjacent -en.md file.
const LEGACY_ZH_ONLY_POSTS = new Set([]);
// 'daily' category was added to TRANSLATION_REQUIRED_CATEGORIES on 2026-08-30 (the hard
// gate previously had no enforcement for 'daily', so daily-digest routines silently
// shipped zh-TW-only posts for several days without pnpm verify catching it). The
// 17 pre-existing 2026-08-27~29 gaps this surfaced have all been backfilled with -en.md
// siblings (see the "post(daily): backfill English versions..." commits from 2026-08-30),
// so no grandfather exceptions were needed for them.

// Also checks existing pairs for drift: changed one language, forgot the other.
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

function shouldRequireEnglishVersion(file, post) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  return (
    post.data.lang === 'zh-TW' &&
    post.data.draft !== true &&
    TRANSLATION_REQUIRED_CATEGORIES.has(post.data.category) &&
    !LEGACY_ZH_ONLY_POSTS.has(rel)
  );
}

function main() {
  const problems = [];
  let pairs = 0;

  for (const zhFile of walk(POSTS_ROOT)) {
    if (zhFile.endsWith('-en.md')) continue;
    const enFile = zhFile.replace(/\.md$/, '-en.md');
    pairs += 1;
    const rel = path.relative(process.cwd(), zhFile);
    const zh = readPost(zhFile);

    if (!fs.existsSync(enFile)) {
      if (shouldRequireEnglishVersion(zhFile, zh)) {
        problems.push(`${rel}\n  已發布的 ${zh.data.category} / zh-TW 文章缺少英文版：${path.relative(process.cwd(), enFile)}`);
      }
      continue;
    }

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
