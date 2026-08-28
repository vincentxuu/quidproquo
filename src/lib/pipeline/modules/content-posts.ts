export interface CloudPost {
  id: string
  slug: string
  title: string
  category: string
  lang: string
  description: string | null
  tldr: string | null
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

interface PostRow {
  id: string
  slug: string
  title: string
  category: string
  lang: string
  description: string | null
  tldr: string | null
  content: string
  tags: string
  created_at: string
  updated_at: string
}

export async function loadCloudPosts(db: D1Database, input: Record<string, unknown> = {}): Promise<CloudPost[]> {
  const slug = normalizeSlug(input.slug ?? input.path ?? input.sourcePath)
  const query = slug
    ? db.prepare(`SELECT id, slug, title, category, lang, description, tldr, content, tags, created_at, updated_at FROM posts WHERE slug = ?`).bind(slug)
    : db.prepare(`SELECT id, slug, title, category, lang, description, tldr, content, tags, created_at, updated_at FROM posts ORDER BY created_at DESC`)
  const result = slug ? { results: [await query.first<PostRow>()].filter(Boolean) as PostRow[] } : await query.all<PostRow>()
  return result.results.map(rowToPost)
}

export function normalizeSlug(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  return value
    .trim()
    .replace(/^src\/content\/posts\//, '')
    .replace(/\.md$/, '')
    .replace(/^\/+/, '')
}

function rowToPost(row: PostRow): CloudPost {
  return {
    ...row,
    tags: parseTags(row.tags),
  }
}

function parseTags(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}
