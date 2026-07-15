import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');
const REFERENCE_HEADINGS = new Set([
  '## 參考資料',
  '### 參考資料',
  '## References',
  '### References',
  '**參考資料**',
  '**References**',
]);
const REFERENCE_REQUIRED_CATEGORIES = new Set([
  'ai',
  'tech',
  'learning',
  'education',
  'policy',
  'design',
  'marketing',
  'product',
]);
const STRUCTURAL_HEADINGS = new Set([
  'tl;dr',
  '情境',
  '問題',
  '嘗試過程',
  '解法',
  '為什麼會這樣',
  '學到的事',
  '整體來說',
  '整體架構',
  '參考資料',
  'references',
]);
const COVERAGE_STOPWORDS = new Set([
  '2026',
  '2025',
  'guide',
  'intro',
  'overview',
  'deep',
  'dive',
  'complete',
  'terminal',
  'coding',
  'agent',
  'agents',
  'framework',
  'frameworks',
  'ai',
  'llm',
  'the',
  'and',
  'for',
  'with',
  'from',
  'into',
  'your',
  'that',
  'this',
  'how',
  'what',
  'why',
]);
const CITATION_KEYWORDS = [
  '官方',
  '文件',
  '文檔',
  '參考',
  '論文',
  'paper',
  'research',
  'benchmark',
  'github',
  'repo',
  'release',
  'sdk',
  'framework',
  'stars',
  'compare',
  '比較',
  'according to',
];

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

function extractReferenceSection(body) {
  const lines = body.split('\n');
  const headingIndex = lines.findIndex((line) => REFERENCE_HEADINGS.has(line.trim()));
  if (headingIndex === -1) {
    return { exists: false, headingIndex: -1, content: '', links: [] };
  }

  const headingMatch = lines[headingIndex].trim().match(/^(#+)/);
  const headingLevel = headingMatch ? headingMatch[1].length : 2;
  const breakPattern = new RegExp(`^#{1,${headingLevel}}\\s+`);

  const referenceLines = [];
  for (let i = headingIndex + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (breakPattern.test(trimmed)) {
      break;
    }
    referenceLines.push(lines[i]);
  }

  const content = referenceLines.join('\n').trim();
  const links = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);

  return { exists: true, headingIndex, content, links };
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function getTopicHeadings(bodyBeforeReferences) {
  const lines = bodyBeforeReferences.split('\n');
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, '').replace(/^\d+\.\s*/, '').trim())
    .filter((heading) => heading.length > 0)
    .filter((heading) => !STRUCTURAL_HEADINGS.has(heading.toLowerCase()));
}

function normalizeToken(token) {
  const normalized = token.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9-]+$/g, '');
  if (normalized.length < 3 || COVERAGE_STOPWORDS.has(normalized)) {
    return null;
  }
  return normalized;
}

function getCoverageTokens(text) {
  const tokens = new Set();

  for (const match of text.matchAll(/[A-Za-z0-9][A-Za-z0-9-]{2,}/g)) {
    const token = normalizeToken(match[0]);
    if (token) {
      tokens.add(token);
    }
  }

  return [...tokens];
}

function estimateReferenceNeed(category, title, bodyBeforeReferences) {
  if (category && REFERENCE_REQUIRED_CATEGORIES.has(category)) {
    return true;
  }

  const lower = `${title}\n${bodyBeforeReferences}`.toLowerCase();
  const headingCount = countMatches(bodyBeforeReferences, /^##\s+/gm);
  const codeFenceCount = countMatches(bodyBeforeReferences, /^```/gm) / 2;
  const inlineCodeCount = countMatches(bodyBeforeReferences, /`[^`\n]+`/g);
  const externalLinkCount = countMatches(bodyBeforeReferences, /\[[^\]]+\]\(https?:\/\/[^)]+\)/g);
  const keywordHits = CITATION_KEYWORDS.filter((keyword) => lower.includes(keyword)).length;

  return headingCount >= 4 || codeFenceCount > 0 || inlineCodeCount >= 3 || externalLinkCount > 0 || keywordHits >= 2;
}

function checkCoverage(title, headings, referenceContent, referenceLinks) {
  const findings = [];
  const coverageSource = [title, ...headings.slice(0, 8)].join('\n');
  const requiredTokens = getCoverageTokens(coverageSource);
  const referenceTokens = new Set(getCoverageTokens(referenceContent));
  const matchedTokenCount = requiredTokens.filter((token) => referenceTokens.has(token)).length;

  const expectedMinimumLinks =
    headings.length >= 8 ? 4 :
    headings.length >= 4 ? 2 :
    1;

  if (referenceLinks.length < expectedMinimumLinks) {
    findings.push({
      severity: 'warn',
      message: `參考資料可能不足：主題段落 ${headings.length} 個，但只有 ${referenceLinks.length} 個連結`,
    });
  }

  if (requiredTokens.length > 0 && matchedTokenCount === 0) {
    findings.push({
      severity: 'warn',
      message: '參考資料和標題/主要段落缺少明顯關鍵詞重疊，可能沒有覆蓋文章主題',
    });
  }

  return findings;
}

function lintPost(file) {
  const source = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(source);
  const title = typeof data.title === 'string' ? data.title : path.basename(file);
  const category = typeof data.category === 'string' ? data.category : undefined;
  const referenceSection = extractReferenceSection(content);
  const lines = content.split('\n');
  const bodyBeforeReferences = referenceSection.exists
    ? lines.slice(0, referenceSection.headingIndex).join('\n')
    : content;
  const findings = [];
  const needsReferences = estimateReferenceNeed(category, title, bodyBeforeReferences);
  const headings = getTopicHeadings(bodyBeforeReferences);

  if (needsReferences && !referenceSection.exists) {
    findings.push({
      severity: 'error',
      message: '缺少 `參考資料` / `References` 區段',
    });
  }

  if (referenceSection.exists && referenceSection.links.length === 0) {
    findings.push({
      severity: 'error',
      message: '參考資料區段存在，但沒有有效的 Markdown 連結',
    });
  }

  if (referenceSection.exists && /{{|待補|\btodo\b/i.test(referenceSection.content)) {
    findings.push({
      severity: 'error',
      message: '參考資料區段仍有 placeholder 或待補標記',
    });
  }

  if (referenceSection.exists && referenceSection.links.length > 0) {
    findings.push(...checkCoverage(title, headings, referenceSection.content, referenceSection.links));
  }

  return { file, findings };
}

function main() {
  const args = process.argv.slice(2);
  const files = getInputFiles(args);
  const reports = files.map(lintPost).filter((report) => report.findings.length > 0);
  const errors = reports.flatMap((report) => report.findings.filter((finding) => finding.severity === 'error'));
  const warnings = reports.flatMap((report) => report.findings.filter((finding) => finding.severity === 'warn'));

  if (reports.length === 0) {
    console.log(`OK: checked ${files.length} post files, no reference issues found.`);
    return;
  }

  for (const report of reports) {
    console.log(`\n${path.relative(process.cwd(), report.file)}`);
    for (const finding of report.findings) {
      const label = finding.severity === 'error' ? 'ERROR' : 'WARN ';
      console.log(`  [${label}] ${finding.message}`);
    }
  }

  console.log(`\nSummary: ${errors.length} error(s), ${warnings.length} warning(s), ${reports.length} file(s) with issues.`);

  if (errors.length > 0 || warnings.length > 0) {
    process.exitCode = 1;
  }
}

main();
