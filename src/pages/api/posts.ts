// src/pages/api/posts.ts
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

interface PostBody {
  id: string;
  slug: string;
  title: string;
  category: string;
  lang?: string;
  description?: string;
  tldr?: string;
  content: string;
  tags: string[];
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

  let query = 'SELECT id, slug, title, category, lang, description, tldr, tags, created_at FROM posts';
  const conditions: string[] = [];
  const bindings: string[] = [];

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

export const POST: APIRoute = async ({ request }) => {
  const db = getDB();
  const body = (await request.json()) as PostBody;
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO posts (id, slug, title, category, lang, description, tldr, content, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         title = excluded.title,
         category = excluded.category,
         lang = excluded.lang,
         description = excluded.description,
         tldr = excluded.tldr,
         content = excluded.content,
         tags = excluded.tags,
         updated_at = excluded.updated_at`
    )
    .bind(
      body.id,
      body.slug,
      body.title,
      body.category,
      body.lang ?? 'zh-TW',
      body.description ?? null,
      body.tldr ?? null,
      body.content,
      JSON.stringify(body.tags),
      body.created_at,
      now
    )
    .run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
