import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const POSTS_ROOT = path.resolve('src/content/posts');
const WRITE_MODE = process.argv.includes('--write');

function walkMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walkMarkdownFiles(full) : entry.name.endsWith('.md') ? [full] : [];
  });
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  const get = (key) => {
    const m = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
  };
  const getTags = () => {
    // Support both inline array and block array
    const inline = raw.match(/^tags:\s*\[([^\]]*)\]/m);
    if (inline) return inline[1].split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
    const block = raw.match(/^tags:\s*\n((?:\s+-\s+.+\n?)+)/m);
    if (block) return block[1].match(/-\s+(.+)/g).map((t) => t.replace(/^-\s+/, '').trim().replace(/^['"]|['"]$/g, '').toLowerCase());
    return [];
  };
  return {
    raw,
    type: get('type'),
    category: get('category').toLowerCase(),
    tags: getTags(),
    title: get('title'),
    dateField: get('date'),
  };
}

function classify(category, tags, title) {
  const tagSet = new Set(tags);

  if (
    category.includes('debug') ||
    tagSet.has('debug') || tagSet.has('troubleshooting') || tagSet.has('fix') || tagSet.has('error')
  ) {
    return { type: 'debug', reason: `category="${category}" or debug-related tag` };
  }

  if (
    category.includes('deep-dive') || category.includes('research') ||
    tagSet.has('deep-dive') || tagSet.has('architecture') || tagSet.has('design')
  ) {
    return { type: 'deep-dive', reason: `category="${category}" or deep-dive-related tag` };
  }

  if (
    /^如何|^怎麼|^how to /i.test(title) ||
    tagSet.has('guide') || tagSet.has('tutorial') || tagSet.has('howto')
  ) {
    return { type: 'guide', reason: `title starts with how-to pattern or guide-related tag` };
  }

  if (
    category === 'product' || category === 'project' ||
    tagSet.has('project') || tagSet.has('side-project') || tagSet.has('open-source')
  ) {
    return { type: 'project', reason: `category="${category}" or project-related tag` };
  }

  return { type: 'guide', reason: 'no heuristic matched — defaulting to guide' };
}

function insertTypeAfterDate(source, typeValue) {
  // Insert `type: <value>` after the `date:` line in frontmatter
  return source.replace(/(^---\r?\n[\s\S]*?^date:[^\n]*\n)/m, `$1type: ${typeValue}\n`);
}

function atomicWrite(filePath, content) {
  const tmp = path.join(os.tmpdir(), `backfill-types-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`);
  fs.writeFileSync(tmp, content, 'utf8');
  fs.renameSync(tmp, filePath);
}

function main() {
  const files = walkMarkdownFiles(POSTS_ROOT);
  const results = [];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const fm = parseFrontmatter(source);

    if (!fm) continue;
    if (fm.type) continue; // already has type

    const { type, reason } = classify(fm.category, fm.tags, fm.title);
    results.push({ file, type, reason, source });
  }

  const missingCount = results.length;
  const typeCounts = {};

  for (const { file, type, reason } of results) {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    const rel = path.relative(process.cwd(), file);
    console.log(`${rel}`);
    console.log(`  suggested type: ${type}`);
    console.log(`  reason: ${reason}`);
    console.log('');
  }

  console.log('--- Summary ---');
  console.log(`Total posts scanned : ${files.length}`);
  console.log(`Missing type field  : ${missingCount}`);
  for (const [t, count] of Object.entries(typeCounts)) {
    console.log(`  ${t.padEnd(10)}: ${count}`);
  }

  const sampleN = Math.ceil(missingCount * 0.1);
  console.log(`\n⚠️  建議人工抽查 10%（約 ${sampleN} 篇）確認分類正確後再執行 --write`);

  if (WRITE_MODE) {
    console.log('\n--- Writing changes ---');
    for (const { file, type, source } of results) {
      const updated = insertTypeAfterDate(source, type);
      atomicWrite(file, updated);
      console.log(`  wrote  ${path.relative(process.cwd(), file)}  type: ${type}`);
    }
    console.log(`Done. Updated ${missingCount} file(s).`);
  } else {
    console.log('\nDry-run mode. Pass --write to apply changes.');
  }
}

main();
