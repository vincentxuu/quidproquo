import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');
const DEFAULT_REPORT = path.resolve('docs/content-ops-report.json');
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'you', 'your', 'are', 'was', 'were',
  'have', 'has', 'not', 'but', 'about', 'into', 'when', 'what', 'how', 'why', 'can', 'will',
  '一個', '這個', '不是', '可以', '如果', '因為', '所以', '但是', '就是', '沒有', '自己',
]);

function walkMarkdownFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return targetPath.endsWith('.md') ? [targetPath] : [];

  return fs.readdirSync(targetPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(targetPath, entry.name);
    return entry.isDirectory() ? walkMarkdownFiles(nextPath) : nextPath.endsWith('.md') ? [nextPath] : [];
  });
}

function stripMarkdown(content) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? [])
    .filter(token => token.length >= 2 && !STOP_WORDS.has(token));
}

function getTermFrequency(text) {
  const counts = new Map();
  for (const token of tokenize(text)) counts.set(token, (counts.get(token) ?? 0) + 1);
  return counts;
}

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (const value of left.values()) leftNorm += value * value;
  for (const value of right.values()) rightNorm += value * value;
  for (const [token, value] of left.entries()) dot += value * (right.get(token) ?? 0);

  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function kebabCase(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function summarize(content, maxLength = 120) {
  const text = stripMarkdown(content);
  const firstSentence = text.split(/[。.!?！？]\s*/).find(sentence => sentence.trim().length >= 18) ?? text;
  return firstSentence.trim().slice(0, maxLength);
}

function classifyDifficulty(post) {
  const words = tokenize(stripMarkdown(post.content)).length;
  const codeBlocks = (post.content.match(/```/g) ?? []).length / 2;
  const headings = (post.content.match(/^##\s+/gm) ?? []).length;
  const type = post.data.type;

  if (type === 'deep-dive' || words >= 2200 || codeBlocks >= 8 || headings >= 10) return '深度';
  if (type === 'guide' || words >= 900 || codeBlocks >= 3 || headings >= 5) return '進階';
  return '入門';
}

function getKnownTags(posts) {
  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
}

function suggestTags(post, knownTags) {
  const corpus = `${post.data.title ?? ''}\n${stripMarkdown(post.content)}`.toLowerCase();
  const existing = new Set(post.data.tags ?? []);
  const matchedKnownTags = [...knownTags.keys()]
    .filter(tag => !existing.has(tag))
    .map(tag => {
      const parts = tag.split('-').filter(part => part.length >= 3);
      const matches = parts.filter(part => corpus.includes(part)).length;
      return { tag, score: matches / Math.max(1, parts.length) + (knownTags.get(tag) ?? 0) / 100 };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.tag);

  const keywordTags = [...getTermFrequency(corpus).entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => kebabCase(token))
    .filter(tag => TAG_PATTERN.test(tag) && !existing.has(tag));

  return Array.from(new Set([...matchedKnownTags, ...keywordTags])).slice(0, 6);
}

function relatedScore(post, candidate) {
  const leftTags = new Set(post.data.tags ?? []);
  const rightTags = new Set(candidate.data.tags ?? []);
  const union = new Set([...leftTags, ...rightTags]);
  let overlap = 0;
  for (const tag of leftTags) if (rightTags.has(tag)) overlap += 1;

  const tagScore = union.size > 0 ? overlap / union.size : 0;
  const categoryScore = post.data.category === candidate.data.category ? 1 : 0;
  const dayDiff = Math.abs(new Date(post.data.date).getTime() - new Date(candidate.data.date).getTime()) / 86400000;
  const recencyScore = Math.max(0, 1 - dayDiff / 365);
  const seriesScore = post.data.series?.name && post.data.series.name === candidate.data.series?.name ? 1 : 0;

  return tagScore * 0.4 + categoryScore * 0.3 + recencyScore * 0.2 + seriesScore * 0.1;
}

function findInternalLinkOpportunities(post, posts) {
  return posts
    .filter(candidate => candidate.file !== post.file && candidate.data.lang === post.data.lang)
    .map(candidate => ({ candidate, score: relatedScore(post, candidate) }))
    .filter(item => item.score >= 0.35 && !post.content.includes(`/posts/${item.candidate.slug}`))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ candidate, score }) => ({
      title: candidate.data.title,
      slug: candidate.slug,
      score: Number(score.toFixed(3)),
    }));
}

function detectFreshnessRisk(post) {
  const toolSignals = [
    'api', 'sdk', 'cloudflare', 'astro', 'workers', 'd1', 'vectorize', 'openai',
    'anthropic', 'google', 'langgraph', 'nextjs', 'ollama', 'vllm',
  ];
  const text = `${post.data.title ?? ''}\n${post.content}`.toLowerCase();
  const hasToolSignal = toolSignals.some(signal => text.includes(signal));
  const ageDays = (Date.now() - new Date(post.data.date).getTime()) / 86400000;
  const stalePhrase = /(deprecated|deprecate|淘汰|棄用|已過時|breaking change|版本)/i.test(text);

  if (!hasToolSignal && !stalePhrase) return null;
  if (ageDays < 120 && !stalePhrase) return null;

  return {
    age_days: Math.max(0, Math.round(ageDays)),
    reason: stalePhrase ? '文章提到版本、淘汰或 breaking change，建議人工複查引用狀態' : '技術/API 文章已超過 120 天，建議複查文件與版本',
  };
}

function loadSearchQueries(file) {
  if (!file || !fs.existsSync(file)) return [];
  const source = fs.readFileSync(file, 'utf8');
  try {
    const parsed = JSON.parse(source);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (Array.isArray(parsed.queries)) return parsed.queries.map(String);
  } catch {
    return source.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  }
  return [];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { report: DEFAULT_REPORT, searchLog: null };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--report') result.report = path.resolve(args[++index]);
    if (args[index] === '--search-log') result.searchLog = path.resolve(args[++index]);
  }
  return result;
}

function loadPosts() {
  return walkMarkdownFiles(POSTS_ROOT).map((file) => {
    const source = fs.readFileSync(file, 'utf8');
    const parsed = matter(source);
    const slug = path.relative(POSTS_ROOT, file).replace(/\\/g, '/').replace(/\.md$/, '');
    return { file, slug, data: parsed.data, content: parsed.content };
  });
}

function main() {
  const args = parseArgs();
  const posts = loadPosts();
  const knownTags = getKnownTags(posts);
  const vectors = new Map(posts.map(post => [post.file, getTermFrequency(`${post.data.title ?? ''}\n${stripMarkdown(post.content)}`)]));

  const postReports = posts.map(post => {
    const suggestedTldr = post.data.tldr ? null : summarize(post.content, 140);
    const suggestedDescription = post.data.description ? null : summarize(post.content, 155);
    const suggestedDifficulty = post.data.difficulty ? null : classifyDifficulty(post);
    const tagSuggestions = suggestTags(post, knownTags);
    const freshness = detectFreshnessRisk(post);

    return {
      file: path.relative(process.cwd(), post.file),
      title: post.data.title,
      category: post.data.category,
      lang: post.data.lang,
      suggestions: {
        tldr: suggestedTldr,
        description: suggestedDescription,
        tags: tagSuggestions,
        difficulty: suggestedDifficulty,
      },
      seo: {
        title_length: String(post.data.title ?? '').length,
        description_length: String(post.data.description ?? '').length,
        internal_link_opportunities: findInternalLinkOpportunities(post, posts),
      },
      freshness,
    };
  });

  const duplicateCandidates = [];
  for (let i = 0; i < posts.length; i += 1) {
    for (let j = i + 1; j < posts.length; j += 1) {
      if (posts[i].data.lang !== posts[j].data.lang) continue;
      const similarity = cosineSimilarity(vectors.get(posts[i].file), vectors.get(posts[j].file));
      if (similarity >= 0.56) {
        duplicateCandidates.push({
          left: path.relative(process.cwd(), posts[i].file),
          right: path.relative(process.cwd(), posts[j].file),
          similarity: Number(similarity.toFixed(3)),
        });
      }
    }
  }

  const searchQueries = loadSearchQueries(args.searchLog);
  const corpus = stripMarkdown(posts.map(post => `${post.data.title}\n${post.content}`).join('\n')).toLowerCase();
  const contentGaps = searchQueries
    .map(query => ({ query, has_obvious_match: tokenize(query).some(token => corpus.includes(token)) }))
    .filter(item => !item.has_obvious_match)
    .slice(0, 50);

  const report = {
    generated_at: new Date().toISOString(),
    summary: {
      posts: posts.length,
      missing_tldr: postReports.filter(item => item.suggestions.tldr).length,
      missing_description: postReports.filter(item => item.suggestions.description).length,
      missing_difficulty: postReports.filter(item => item.suggestions.difficulty).length,
      duplicate_candidates: duplicateCandidates.length,
      freshness_candidates: postReports.filter(item => item.freshness).length,
      content_gaps: contentGaps.length,
    },
    posts: postReports,
    duplicate_candidates: duplicateCandidates.sort((a, b) => b.similarity - a.similarity).slice(0, 100),
    content_gaps: contentGaps,
  };

  fs.mkdirSync(path.dirname(args.report), { recursive: true });
  fs.writeFileSync(args.report, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Content ops report written to ${path.relative(process.cwd(), args.report)}`);
}

main();
