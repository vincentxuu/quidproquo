import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');
const DEFAULT_TERMS_FILE = path.resolve('src/lib/glossary/terms.ts');

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readDefaultGlossaryTerms() {
  const source = fs.readFileSync(DEFAULT_TERMS_FILE, 'utf8');
  const terms = [...source.matchAll(/term: '([^']+)'/g)].map((match) => match[1]);
  const aliases = [...source.matchAll(/aliases: \[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((aliasMatch) => aliasMatch[1]));

  return [...new Set([...terms, ...aliases])]
    .sort((a, b) => b.length - a.length)
    .map((term) => ({ term, pattern: new RegExp(`(^|[^\\p{L}\\p{N}_-])${escapeRegExp(term)}([^\\p{L}\\p{N}_-]|$)`, 'iu') }));
}

function getGlossaryCoverage(file, defaultTerms) {
  const source = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(source);
  const frontmatterTerms = Array.isArray(data.glossary) ? data.glossary : [];
  const defaultMatches = defaultTerms
    .filter(({ pattern }) => pattern.test(content))
    .map(({ term }) => term);

  return {
    file,
    title: data.title ?? path.basename(file),
    frontmatterCount: frontmatterTerms.length,
    defaultMatches,
    covered: frontmatterTerms.length > 0 || defaultMatches.length > 0,
  };
}

function formatRelative(file) {
  return path.relative(process.cwd(), file).replace(/\\/g, '/');
}

const files = getInputFiles(process.argv.slice(2));
const defaultTerms = readDefaultGlossaryTerms();
const coverage = files.map((file) => getGlossaryCoverage(file, defaultTerms));
const uncovered = coverage.filter((item) => !item.covered);
const withFrontmatter = coverage.filter((item) => item.frontmatterCount > 0).length;
const withDefaults = coverage.filter((item) => item.defaultMatches.length > 0).length;

console.log('Glossary coverage report');
console.log(`Posts checked: ${coverage.length}`);
console.log(`Covered posts: ${coverage.length - uncovered.length}`);
console.log(`Posts with frontmatter glossary: ${withFrontmatter}`);
console.log(`Posts matching default glossary: ${withDefaults}`);
console.log(`Uncovered posts: ${uncovered.length}`);

if (uncovered.length > 0) {
  console.log('\nPosts without glossary coverage:');
  for (const item of uncovered) {
    console.log(`- ${formatRelative(item.file)} — ${item.title}`);
  }
  console.log('\nAdd a reusable term to src/lib/glossary/terms.ts or a focused `glossary` frontmatter entry.');
}
