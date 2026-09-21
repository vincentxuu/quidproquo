export interface PageContext {
  slug: string
  title: string
  lang: string
}

const MAX_SLUG_LENGTH = 200
// D1 的 slug 是檔案路徑去掉 .md，版號文章會帶點（…-pydantic-ai-2.36.0）
const SLUG_PATTERN = /^[a-z0-9][a-z0-9/._-]*$/i

// 前端只送 slug；標題一律由伺服器從 D1 取，前端傳來的文字不進 prompt。
export function parseRequestedSlug(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null
  const slug = (raw as { slug?: unknown }).slug
  if (typeof slug !== 'string') return null
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, '')
  if (!trimmed || trimmed.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(trimmed) || trimmed.includes('..')) return null
  return trimmed
}

// flag 關閉、slug 不合法或查不到文章時一律回 null，請求照全站問題處理。
export async function resolvePageContext(
  db: D1Database,
  raw: unknown,
  enabled: boolean,
): Promise<PageContext | null> {
  if (!enabled) return null
  const slug = parseRequestedSlug(raw)
  if (!slug) return null
  const row = await db
    .prepare('SELECT slug, title, lang FROM posts WHERE slug = ?')
    .bind(slug)
    .first<{ slug: string; title: string; lang: string }>()
  return row ? { slug: row.slug, title: row.title, lang: row.lang } : null
}

// 同一句「這篇的重點」在不同文章要得到不同答案，semantic cache 必須依文章分開。
// slug 含 / . _（後兩者在 LIKE 比對有特殊意義），所以只取雜湊進 namespace。
export async function pageCacheNamespace(base: string | undefined, context: PageContext | null): Promise<string | undefined> {
  if (!context) return base
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(context.slug))
  const hash = Array.from(new Uint8Array(digest).slice(0, 6), byte => byte.toString(16).padStart(2, '0')).join('')
  return base ? `${base}-page${hash}` : `page${hash}`
}
