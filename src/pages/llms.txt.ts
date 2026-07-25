// src/pages/llms.txt.ts
// llms.txt — a flat, link-dense index for answer engines and LLM crawlers.
// Spec: https://llmstxt.org/ . Kept generated (not a static public/ file) so it
// can never drift from the content collection.
export const prerender = true;

import type { APIContext } from 'astro';
import { getPublishedPosts, sortPostsByDateDesc } from '../utils/content';

// Newest-first within a category, and cap so the file stays scannable rather
// than becoming a 668-line dump nothing reads to the end of.
const PER_CATEGORY_LIMIT = 30;

export async function GET(context: APIContext) {
  const site = (context.site?.toString() ?? 'https://quidproquo.cc').replace(/\/$/, '');
  const posts = sortPostsByDateDesc(await getPublishedPosts('zh-TW'));

  const byCategory = new Map<string, typeof posts>();
  for (const post of posts) {
    const bucket = byCategory.get(post.data.category) ?? [];
    bucket.push(post);
    byCategory.set(post.data.category, bucket);
  }

  const lines: string[] = [
    '# quidproquo',
    '',
    '> 技術、產品、AI、攀岩、衝浪、咖啡的個人筆記與深入研究。作者 xiaoxu，內容以繁體中文為主，多數文章有英文版（網址加上 `-en`）。',
    '',
    `所有文章列表：${site}/sitemap-index.xml`,
    `RSS：${site}/rss.xml`,
    '',
  ];

  for (const [category, categoryPosts] of [...byCategory].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`## ${category}`, '');
    for (const post of categoryPosts.slice(0, PER_CATEGORY_LIMIT)) {
      const summary = (post.data.tldr ?? post.data.description ?? '').replace(/\s+/g, ' ').trim();
      lines.push(`- [${post.data.title}](${site}/posts/${post.id})${summary ? `: ${summary}` : ''}`);
    }
    if (categoryPosts.length > PER_CATEGORY_LIMIT) {
      lines.push(`- （此分類另有 ${categoryPosts.length - PER_CATEGORY_LIMIT} 篇，見 ${site}/categories/${category}）`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
