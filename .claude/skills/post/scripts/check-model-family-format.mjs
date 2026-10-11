#!/usr/bin/env node
/** Standalone skill check; does not alter the repository's governance gate. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const SERIES = { 'zh-TW': 'AI 模型家族', en: 'AI Model Families' };
export const HEADINGS = {
  'zh-TW': ['家族定位與版本矩陣', '家族演化', '架構與訓練取捨', '評測與競品比較', '授權、價格與部署', 'Agent 使用與選型', '限制與取捨'],
  en: ['Family positioning and model matrix', 'Family evolution', 'Architecture and training trade-offs', 'Evaluation and alternatives', 'Licensing, pricing, and deployment', 'Agent integration and selection', 'Limitations and trade-offs'],
};
const roles = JSON.parse(fs.readFileSync(new URL('../references/model-family-roles.json', import.meta.url), 'utf8'));
const COMPARISON_SLUGS = new Set(roles.comparison);

export function outsideFences(content) {
  let fence = null;
  return content.split('\n').map(line => {
    const match = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && match) { fence = match[1]; return ''; }
    if (fence) {
      if (match && match[1][0] === fence[0] && match[1].length >= fence.length && !match[2].trim()) fence = null;
      return '';
    }
    return line;
  }).join('\n');
}

export function inspectPost(source, filename) {
  const { data, content } = matter(source);
  const errors = [];
  const isFamily = Object.values(SERIES).includes(data.series?.name);
  if (!isFamily) return { data, content, isFamily, errors, role: null, headings: [] };
  const lang = data.lang;
  if (!Object.hasOwn(SERIES, lang)) errors.push('lang must be zh-TW or en');
  else if (data.series.name !== SERIES[lang]) errors.push(`series.name must be ${SERIES[lang]}`);
  if (typeof data.tldr !== 'string' || !data.tldr.trim()) errors.push('non-empty tldr required');
  const slug = path.basename(filename).replace(/(?:-en)?\.md$/, '');
  const role = COMPARISON_SLUGS.has(slug) ? 'comparison' : 'family';
  const lines = outsideFences(content).split('\n');
  const headings = lines.flatMap((line, i) => /^##\s+/.test(line) ? [{ text: line.replace(/^##\s+/, '').trim(), index: i }] : []);
  const refs = lang === 'en' ? 'References' : '參考資料';
  const history = lang === 'en' ? 'Update history' : '更新紀錄';
  if (headings.at(-1)?.text !== refs) errors.push(`${refs} must be the final H2`);
  if (role === 'family' && Object.hasOwn(HEADINGS, lang)) {
    const expected = [...HEADINGS[lang], ...(headings.some(h => h.text === history) ? [history] : []), refs];
    if (headings.map(h => h.text).join('\n') !== expected.join('\n')) errors.push(`H2 order must be: ${expected.join(' → ')}`);
    const firstEnd = headings[1]?.index ?? lines.length;
    const firstSection = lines.slice((headings[0]?.index ?? -1) + 1, firstEnd).join('\n');
    if (!/^\s*\|?\s*:?-{3,}:?\s*\|(?:[^\n]*\|)?\s*$/m.test(firstSection)) errors.push('opening model matrix must contain a Markdown table');
  }
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const section = lines.slice(h.index + 1, headings[i + 1]?.index ?? lines.length).join('\n');
    if (!section.replace(/^\s*(?:#{3,6} .*|[-*_]{3,})\s*$/gm, '').trim()) errors.push(`empty section: ${h.text}`);
  }
  const references = headings.find(h => h.text === refs);
  if (references && !/\[[^\]]+\]\(https?:\/\/[^\s)]+\)/.test(lines.slice(references.index + 1).join('\n'))) errors.push('References must include an external source link');
  return { data, content, isFamily, errors, role, headings: headings.map(h => h.text) };
}

export function inspectPair(zh, en) {
  const errors = [];
  for (const key of ['date', 'category']) {
    if (String(zh.data[key]) !== String(en.data[key])) errors.push(`bilingual ${key} differs`);
  }
  if (zh.data.lang !== 'zh-TW' || en.data.lang !== 'en') errors.push('pair must contain zh-TW then en');
  if (zh.data.series?.order !== en.data.series?.order) errors.push('bilingual series.order differs');
  if (Boolean(zh.data.draft) !== Boolean(en.data.draft)) errors.push('bilingual publication state differs');
  if (zh.role !== en.role) errors.push('bilingual article role differs');
  if (zh.headings.length !== en.headings.length) errors.push('bilingual H2 counts differ; review semantic alignment');
  return errors;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(filename) : filename.endsWith('.md') ? [filename] : [];
  });
}

export function run(files = []) {
  const paths = files.length ? files.map(f => path.resolve(f)) : walk(path.resolve('src/content/posts'));
  const selected = new Map();
  const problems = [];
  for (const filename of paths) {
    const post = inspectPost(fs.readFileSync(filename, 'utf8'), filename);
    if (files.length && !post.isFamily) problems.push(`${filename}: not an AI Model Families article`);
    if (post.isFamily) selected.set(filename, post);
  }
  // Even a scoped single-file check requires its sibling and checks both languages.
  for (const [filename] of [...selected]) {
    const sibling = filename.endsWith('-en.md') ? filename.replace(/-en\.md$/, '.md') : filename.replace(/\.md$/, '-en.md');
    if (!fs.existsSync(sibling)) { problems.push(`${filename}: missing bilingual sibling`); continue; }
    if (!selected.has(sibling)) selected.set(sibling, inspectPost(fs.readFileSync(sibling, 'utf8'), sibling));
  }
  for (const [filename, post] of selected) {
    if (!post.isFamily) problems.push(`${filename}: sibling has a different series`);
    for (const error of post.errors) problems.push(`${filename}: ${error}`);
    if (filename.endsWith('-en.md')) continue;
    const en = selected.get(filename.replace(/\.md$/, '-en.md'));
    if (en) for (const error of inspectPair(post, en)) problems.push(`${filename}: ${error}`);
  }
  return { checked: selected.size, problems };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = run(process.argv.slice(2));
    for (const problem of result.problems) console.error(problem);
    console.log(`model-family-format: ${result.checked} articles, ${result.problems.length} problems (format only; facts and semantic parity require review)`);
    if (result.problems.length) process.exitCode = 1;
  } catch (error) {
    console.error(`model-family-format: ${error.message}`);
    process.exitCode = 1;
  }
}
