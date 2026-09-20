import type { SearchResult } from '../state'

// Search-page keyword source backed by the trigram FTS5 tables (posts_fts for
// title/description/tldr/tags, chunks_fts for body text) instead of the
// LIKE '%q%' full-table scan that used to blow the 500ms source budget once
// posts passed ~4k rows. Measured on production (2026-09-19, "rag", 3995 posts):
// LIKE scan 348ms vs this shape 28–90ms, and it scales with hits, not table size.

export interface KeywordQueryPlan {
  /** FTS5 MATCH expression, or null when every term is shorter than a trigram. */
  match: string | null
  /** Terms too short for trigram MATCH (2 chars); served by per-column LIKE on posts_fts. */
  likeTerms: string[]
}

export interface CompiledKeywordSql {
  ctes: string
  params: string[]
}

export interface KeywordPostRow {
  slug: string
  title: string
  category: string
  description: string | null
  tldr: string | null
  excerpt: string
  date: string
  rank: number
}

const MIN_TRIGRAM_LENGTH = 3
const MIN_LIKE_LENGTH = 2
const MAX_TERMS = 6
/** Newest chunk hits considered for body-text matches; keeps the join bounded for common terms. */
export const CONTENT_CHUNK_CAP = 2000
/** bm25 column weights for posts_fts(title, description, tldr, tags). */
const META_BM25_WEIGHTS = '10.0, 3.0, 5.0, 2.0'
/** Rank assigned to LIKE-only metadata hits (bm25 hits are negative, body-only hits are 0). */
const LIKE_RANK = '-1.0'

function codePointLength(text: string): number {
  return [...text].length
}

function quoteFtsTerm(term: string): string {
  return `"${term.replace(/"/g, '""')}"`
}

/** Split on whitespace/punctuation, then on Han/non-Han boundaries; keeps first-seen order. */
export function tokenizeKeywordQuery(query: string): string[] {
  const rawTokens = query.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const seen = new Set<string>()
  const tokens: string[] = []
  for (const token of rawTokens) {
    const parts = token.match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu) ?? [token]
    for (const part of parts) {
      const trimmed = part.trim()
      if (!trimmed || seen.has(trimmed)) continue
      seen.add(trimmed)
      tokens.push(trimmed)
    }
  }
  return tokens
}

export function buildKeywordQueryPlan(query: string): KeywordQueryPlan {
  const exact = query.trim().replace(/\s+/g, ' ')
  const tokens = tokenizeKeywordQuery(exact).slice(0, MAX_TERMS)

  const ftsTerms: string[] = []
  const isPhrase = tokens.length > 1 && codePointLength(exact) >= MIN_TRIGRAM_LENGTH
  if (isPhrase) ftsTerms.push(exact)
  for (const token of tokens) {
    if (codePointLength(token) >= MIN_TRIGRAM_LENGTH && !ftsTerms.includes(token)) ftsTerms.push(token)
  }

  // LIKE only serves queries made purely of sub-trigram tokens ("AI", "微調");
  // once any term can go through MATCH, short leftovers would just add
  // thousands of rank -1 metadata hits ("AI" alone matches ~2.9k posts).
  // LIKE terms come from the whitespace-split words, not the Han/non-Han
  // tokens: "正2" splits into "正" + "2" (both single characters, nothing to
  // search) but is a real two-character query that used to hit via LIKE.
  const likeTerms = ftsTerms.length > 0
    ? []
    : Array.from(new Set(exact.split(' ').filter(word => codePointLength(word) >= MIN_LIKE_LENGTH)))

  return {
    match: ftsTerms.length > 0 ? ftsTerms.map(quoteFtsTerm).join(' OR ') : null,
    likeTerms,
  }
}

/**
 * Builds the shared CTE block: `meta` (posts_fts hits ranked by weighted bm25,
 * plus LIKE hits for sub-trigram terms), `body` (posts whose newest chunks
 * match), and `hits` (one row per post with its best rank). Callers append
 * their own SELECT over `hits JOIN posts`.
 */
export function compileKeywordSql(plan: KeywordQueryPlan): CompiledKeywordSql | null {
  const metaParts: string[] = []
  const params: string[] = []

  if (plan.match) {
    metaParts.push(`SELECT post_id, bm25(posts_fts, ${META_BM25_WEIGHTS}) AS rank FROM posts_fts WHERE posts_fts MATCH ?`)
    params.push(plan.match)
  }
  for (const term of plan.likeTerms) {
    metaParts.push(
      `SELECT post_id, ${LIKE_RANK} AS rank FROM posts_fts WHERE title LIKE ? OR description LIKE ? OR tldr LIKE ? OR tags LIKE ?`
    )
    const like = `%${term}%`
    params.push(like, like, like, like)
  }
  if (metaParts.length === 0) return null

  let body = 'SELECT NULL AS post_id WHERE 0'
  if (plan.match) {
    body = `SELECT DISTINCT pc.post_id FROM (
        SELECT chunk_id FROM chunks_fts
        WHERE chunks_fts MATCH ? AND chunks_fts.source_type = 'post'
        ORDER BY rowid DESC LIMIT ${CONTENT_CHUNK_CAP}
      ) c JOIN post_chunks pc ON pc.id = c.chunk_id`
    params.push(plan.match)
  }

  const ctes = `WITH meta AS (
      ${metaParts.join('\n      UNION ALL\n      ')}
    ),
    body AS (
      ${body}
    ),
    hits AS (
      SELECT post_id, MIN(rank) AS rank FROM (
        SELECT post_id, rank FROM meta
        UNION ALL
        SELECT post_id, 0.0 AS rank FROM body
      ) GROUP BY post_id
    )`

  return { ctes, params }
}

export function keywordRelevanceScore(position: number): number {
  return Math.max(0.4, Math.min(1, 1 - position * 0.01))
}

export function keywordRowToResult(row: KeywordPostRow, position: number): SearchResult {
  return {
    claim: row.title,
    evidence_excerpt: row.tldr ?? row.description ?? row.excerpt,
    source_url: `https://quidproquo.cc/posts/${row.slug}`,
    chunk_id: `keyword:${row.slug}`,
    date: row.date,
    relevance_score: keywordRelevanceScore(position),
    images: [],
    links: [],
    type: 'post',
    slug: row.slug,
    title: row.title,
  }
}

export async function searchKeywordPosts(
  db: D1Database,
  args: { query: string; lang: string; limit: number; offset: number }
): Promise<SearchResult[]> {
  const compiled = compileKeywordSql(buildKeywordQueryPlan(args.query))
  if (!compiled) return []

  const rows = await db.prepare(
    `${compiled.ctes}
    SELECT p.slug, p.title, p.category, p.description, p.tldr,
      substr(p.content, 1, 300) AS excerpt,
      substr(p.created_at, 1, 10) AS date,
      hits.rank AS rank
    FROM hits
    JOIN posts p ON p.id = hits.post_id
    WHERE p.lang = ?
    ORDER BY hits.rank ASC, p.created_at DESC
    LIMIT ? OFFSET ?`
  ).bind(...compiled.params, args.lang, args.limit, args.offset).all<KeywordPostRow>()

  return rows.results.map((row, index) => keywordRowToResult(row, args.offset + index))
}

export async function countKeywordPosts(
  db: D1Database,
  args: { query: string; lang: string }
): Promise<number> {
  const compiled = compileKeywordSql(buildKeywordQueryPlan(args.query))
  if (!compiled) return 0

  const row = await db.prepare(
    `${compiled.ctes}
    SELECT count(*) AS total
    FROM hits
    JOIN posts p ON p.id = hits.post_id
    WHERE p.lang = ?`
  ).bind(...compiled.params, args.lang).first<{ total: number }>()

  return row?.total ?? 0
}
