import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');
const VALID_CATEGORIES = new Set([
  'tech', 'climbing', 'surf', 'film', 'life', 'coffee', 'learning', 'ai',
  'product', 'marketing', 'travel', 'design', 'education', 'policy', 'anime', 'career',
]);
const VALID_LANGS = new Set(['zh-TW', 'en']);
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STRUCTURED_CATEGORIES = new Set([
  'tech', 'ai', 'learning', 'education', 'policy', 'design', 'marketing', 'product',
]);

function walkMarkdownFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return targetPath.endsWith('.md') ? [targetPath] : [];
  }

  return fs.readdirSync(targetPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(targetPath, entry.name);
    return entry.isDirectory() ? walkMarkdownFiles(nextPath) : nextPath.endsWith('.md') ? [nextPath] : [];
  });
}

function getInputFiles(args) {
  if (args.length === 0) {
    return walkMarkdownFiles(POSTS_ROOT);
  }

  return args.flatMap((arg) => {
    const resolved = path.resolve(arg);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Path not found: ${arg}`);
    }
    return walkMarkdownFiles(resolved);
  });
}

function buildKnownPostRoutes() {
  const files = walkMarkdownFiles(POSTS_ROOT);
  const routes = new Set();

  for (const file of files) {
    const relative = path.relative(POSTS_ROOT, file).replace(/\\/g, '/').replace(/\.md$/, '');
    routes.add(`/posts/${relative}`);
    routes.add(`/en/posts/${relative}`);
  }

  return routes;
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff-]+/g, ' ');
}

function isValidDateValue(value) {
  if (typeof value === 'string') {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  return false;
}

function getContentOutsideCodeFences(content) {
  const lines = content.split('\n');
  const kept = [];
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      kept.push('');
      continue;
    }

    kept.push(inFence ? '' : line);
  }

  return kept;
}

function getFrontmatterFindings(file, data) {
  const findings = [];

  for (const key of ['title', 'date', 'category', 'tags', 'lang']) {
    if (!(key in data)) {
      findings.push({ severity: 'error', message: `缺少 frontmatter 欄位 \`${key}\`` });
    }
  }

  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    findings.push({ severity: 'error', message: 'frontmatter `title` 必須是非空字串' });
  }

  if (!isValidDateValue(data.date)) {
    findings.push({ severity: 'error', message: 'frontmatter `date` 必須是 YYYY-MM-DD' });
  }

  if (typeof data.category !== 'string' || !VALID_CATEGORIES.has(data.category)) {
    findings.push({ severity: 'error', message: 'frontmatter `category` 不在允許清單內' });
  }

  if (!Array.isArray(data.tags)) {
    findings.push({ severity: 'error', message: 'frontmatter `tags` 必須是陣列' });
  } else {
    const seen = new Set();
    for (const tag of data.tags) {
      if (typeof tag !== 'string' || !TAG_PATTERN.test(tag)) {
        findings.push({ severity: 'error', message: `tag \`${String(tag)}\` 必須是全小寫 kebab-case` });
        continue;
      }
      if (seen.has(tag)) {
        findings.push({ severity: 'error', message: `tag \`${tag}\` 重複` });
      }
      seen.add(tag);
    }
  }

  if (typeof data.lang !== 'string' || !VALID_LANGS.has(data.lang)) {
    findings.push({ severity: 'error', message: 'frontmatter `lang` 必須是 `zh-TW` 或 `en`' });
  }

  const basename = path.basename(file);
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(basename)) {
    findings.push({ severity: 'error', message: '檔名必須符合 `YYYY-MM-DD-<slug>.md`' });
  }

  return findings;
}

function getInternalLinkFindings(content, knownRoutes) {
  const findings = [];
  const matches = [...content.matchAll(/\[[^\]]+\]\((\/(?:en\/)?posts\/[^)#?\s]+)(?:#[^)]+)?\)/g)];

  for (const match of matches) {
    const route = match[1];
    if (!knownRoutes.has(route)) {
      findings.push({ severity: 'error', message: `內部文章連結不存在：${route}` });
    }
  }

  return findings;
}

function getTagConsistencyFindings(data, content) {
  const findings = [];
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    return findings;
  }

  const corpus = normalizeText(`${data.title ?? ''}\n${content}`);
  for (const tag of data.tags) {
    const parts = tag.split('-').filter((part) => part.length >= 3);
    if (parts.length === 0) {
      continue;
    }
    const hasSignal = parts.some((part) => corpus.includes(part));
    if (!hasSignal) {
      findings.push({
        severity: 'warn',
        message: `tag \`${tag}\` 沒有在標題或內文出現明顯對應詞，請確認是否真的貼切`,
      });
    }
  }

  return findings;
}

function getHeadingStructureFindings(data, content) {
  const findings = [];
  const headingLines = getContentOutsideCodeFences(content)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter(({ line }) => /^#{1,6}\s+/.test(line.trim()));

  let previousLevel = 0;
  let seenH2 = false;

  for (const { line, index } of headingLines) {
    const trimmed = line.trim();
    const level = trimmed.match(/^#+/)[0].length;

    if (level === 1) {
      findings.push({ severity: 'error', message: `第 ${index} 行不應在內文使用 H1（\`#\`）` });
    }

    if (level === 2) {
      seenH2 = true;
    }

    if (level >= 3 && !seenH2) {
      findings.push({ severity: 'error', message: `第 ${index} 行在第一個 H2 之前出現更深層標題` });
    }

    if (previousLevel > 0 && level - previousLevel > 1) {
      findings.push({ severity: 'error', message: `第 ${index} 行標題層級跳太多：H${previousLevel} -> H${level}` });
    }

    previousLevel = level;
  }

  if (STRUCTURED_CATEGORIES.has(data.category) && !seenH2) {
    findings.push({ severity: 'error', message: '此分類文章至少應包含一個 H2 段落標題' });
  }

  return findings;
}

function lintPost(file, knownRoutes) {
  const source = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(source);
  const findings = [
    ...getFrontmatterFindings(file, data),
    ...getInternalLinkFindings(content, knownRoutes),
    ...getTagConsistencyFindings(data, content),
    ...getHeadingStructureFindings(data, content),
  ];

  return { file, findings };
}

function main() {
  const files = getInputFiles(process.argv.slice(2));
  const knownRoutes = buildKnownPostRoutes();
  const reports = files.map((file) => lintPost(file, knownRoutes)).filter((report) => report.findings.length > 0);
  const errorCount = reports.flatMap((report) => report.findings).filter((finding) => finding.severity === 'error').length;

  if (reports.length === 0) {
    console.log(`OK: checked ${files.length} post file${files.length === 1 ? '' : 's'}, no quality issues found.`);
    return;
  }

  for (const report of reports) {
    console.log(`\n${path.relative(process.cwd(), report.file)}`);
    for (const finding of report.findings) {
      const prefix = finding.severity === 'error' ? 'ERROR' : 'WARN';
      console.log(`  [${prefix}] ${finding.message}`);
    }
  }

  if (errorCount > 0) {
    process.exitCode = 1;
    return;
  }

  console.log(`\nWARN: checked ${files.length} post file${files.length === 1 ? '' : 's'}, warnings found but no blocking errors.`);
}

main();
