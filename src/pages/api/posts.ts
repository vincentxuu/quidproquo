// src/pages/api/posts.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

interface PostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  lang: string;
  description: string | null;
  tldr: string | null;
  tags: string;
  created_at: string;
}

function getDB(): D1Database {
  return (env as unknown as { DB: D1Database }).DB;
}

export const GET: APIRoute = async ({ request }) => {
  const db = getDB();
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const lang = url.searchParams.get('lang');
  const now = new Date().toISOString();

  let query = 'SELECT id, slug, title, category, lang, description, tldr, tags, created_at FROM posts';
  const conditions: string[] = ['created_at <= ?'];
  const bindings: string[] = [now];

  if (category) {
    conditions.push('category = ?');
    bindings.push(category);
  }
  if (lang) {
    conditions.push('lang = ?');
    bindings.push(lang);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  const { results } = await (bindings.length > 0 ? stmt.bind(...bindings) : stmt).all<PostRow>();

  const posts = results.map(row => ({
    ...row,
    tags: JSON.parse(row.tags) as string[],
  }));

  return new Response(JSON.stringify({ posts }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// 這裡原本有一個未經驗證的 POST，可對 posts 表做 INSERT ... ON CONFLICT DO UPDATE。
// 沒有任何呼叫端（`pnpm sync` 走 scripts/sync-to-d1.ts），但 posts 表會被公開的
// /api/search、/api/related-posts 以及 RAG 的 get-post-detail 讀取，等於開了一條
// 任意內容注入讀者介面與 LLM 上下文的路徑，因此移除。
// 若日後需要以 HTTP 寫入，比照 src/pages/api/crawl/sync.ts 的 CRAWL_SECRET 模式。
