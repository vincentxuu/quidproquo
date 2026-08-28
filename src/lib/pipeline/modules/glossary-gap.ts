import { findDefaultGlossaryEntry } from '../../glossary/terms'
import { loadCloudPosts } from './content-posts'
import type { CloudPost } from './content-posts'

interface GlossaryGapInput {
  days?: number
  minLookupCount?: number
  topTerms?: number
  topPostsPerTerm?: number
}

interface RawGlossaryRow {
  term: string
  slug: string
  level: string | null
  lookup_count: number | string | null
  last_context: string | null
  last_seen_at: string | null
}

interface GlossaryPostHit {
  slug: string
  title: string
  category: string
  lang: string
  hits: number
  lastSeen: string
  sampleContexts: string[]
}

export interface GlossaryGapCandidate {
  term: string
  totalLookupCount: number
  lookupRows: number
  uniquePosts: number
  levels: string[]
  hasLocalDefinition: boolean
  priorityScore: number
  actionItems: string[]
  topPosts: GlossaryPostHit[]
  needsHumanInput: boolean
}

interface GlossaryGapSummary {
  lookbackDays: number
  minLookupCount: number
  topTerms: number
  topPostsPerTerm: number
  totalTerms: number
  totalRows: number
  candidateTerms: number
  missingDefinitionTerms: number
  highPriorityTerms: number
}

export interface GlossaryGapReport {
  generated_at: string
  inputs: {
    lookbackDays: number
    minLookupCount: number
    topTerms: number
    topPostsPerTerm: number
  }
  summary: GlossaryGapSummary
  candidates: GlossaryGapCandidate[]
  note: string[]
}

const DEFAULT_LOOKBACK_DAYS = 14
const DEFAULT_MIN_LOOKUP = 3
const DEFAULT_TOP_TERMS = 20
const DEFAULT_TOP_POSTS_PER_TERM = 5

interface TermBucket {
  term: string
  totalLookupCount: number
  lookupRows: number
  postMap: Map<string, {
    hits: number
    levelSet: Set<string>
    contexts: string[]
    lastSeen: number
  }>
}

export async function runGlossaryGap(db: D1Database, input: GlossaryGapInput = {}): Promise<GlossaryGapReport> {
  const lookbackDays = normalizePositiveInt(input.days, DEFAULT_LOOKBACK_DAYS, 1, 365)
  const minLookupCount = normalizePositiveInt(input.minLookupCount, DEFAULT_MIN_LOOKUP, 1, 200)
  const topTerms = normalizePositiveInt(input.topTerms, DEFAULT_TOP_TERMS, 1, 100)
  const topPostsPerTerm = normalizePositiveInt(input.topPostsPerTerm, DEFAULT_TOP_POSTS_PER_TERM, 1, 20)

  const notes: string[] = []
  const rows = await loadGlossaryRows(db, lookbackDays, notes)
  const postMap = await loadPostMap(db)

  if (!rows.length) {
    return buildEmptyReport({
      lookbackDays,
      minLookupCount,
      topTerms,
      topPostsPerTerm,
      notes,
    })
  }

  const buckets = new Map<string, TermBucket>()
  for (const row of rows) {
    const term = normalizeText(row.term)
    if (!term) continue

    const slug = normalizeText(row.slug) || '（未綁定文章）'
    const lookupCount = toNonNegativeInt(row.lookup_count)
    if (lookupCount <= 0) continue

    const bucket = buckets.get(term) ?? {
      term,
      totalLookupCount: 0,
      lookupRows: 0,
      postMap: new Map(),
    }
    bucket.totalLookupCount += lookupCount
    bucket.lookupRows += 1

    const postHit = bucket.postMap.get(slug) ?? {
      hits: 0,
      levelSet: new Set<string>(),
      contexts: [],
      lastSeen: 0,
    }
    postHit.hits += lookupCount
    if (row.level) postHit.levelSet.add(row.level)
    const context = normalizeText(row.last_context)
    if (context) postHit.contexts.push(context)
    const lastSeen = toTimestamp(row.last_seen_at)
    if (lastSeen > postHit.lastSeen) postHit.lastSeen = lastSeen
    bucket.postMap.set(slug, postHit)

    buckets.set(term, bucket)
  }

  const allBuckets = Array.from(buckets.values())
  const candidates: GlossaryGapCandidate[] = allBuckets
    .filter((bucket) => bucket.totalLookupCount >= minLookupCount)
    .map((bucket) => buildCandidate(bucket, postMap, topPostsPerTerm))
    .filter((item) => item.totalLookupCount >= minLookupCount)
    .sort((a, b) => b.priorityScore - a.priorityScore || b.totalLookupCount - a.totalLookupCount)
    .slice(0, topTerms)

  const summary: GlossaryGapSummary = {
    lookbackDays,
    minLookupCount,
    topTerms,
    topPostsPerTerm,
    totalTerms: allBuckets.length,
    totalRows: rows.length,
    candidateTerms: candidates.length,
    missingDefinitionTerms: candidates.filter((item) => !item.hasLocalDefinition).length,
    highPriorityTerms: candidates.filter((item) => item.priorityScore >= 80).length,
  }

  if (candidates.length === 0) {
    notes.push('No term reaches the minimum lookup threshold in this window.')
  }
  if (allBuckets.some((bucket) => !findDefaultGlossaryEntry(bucket.term))) {
    notes.push('Some high-frequency terms are not covered by local glossary seed terms.')
  }

  return {
    generated_at: new Date().toISOString(),
    inputs: {
      lookbackDays,
      minLookupCount,
      topTerms,
      topPostsPerTerm,
    },
    summary,
    candidates,
    note: notes,
  }
}

async function loadGlossaryRows(db: D1Database, lookbackDays: number, notes: string[]): Promise<RawGlossaryRow[]> {
  try {
    const statement = db.prepare(`
      SELECT term, slug, level, lookup_count, last_context, last_seen_at
      FROM glossary_lookup_stats
      WHERE last_seen_at >= datetime('now', '-' || ? || ' days')
    `)
    const result = await statement.bind(lookbackDays).all<RawGlossaryRow>()
    return result.results ?? []
  } catch {
    notes.push('Unable to read glossary_lookup_stats (table may not exist yet).')
    return []
  }
}

async function loadPostMap(db: D1Database): Promise<Map<string, Pick<CloudPost, 'slug' | 'title' | 'category' | 'lang'>>> {
  const posts = await loadCloudPosts(db)
  return new Map(posts.map((post) => [post.slug, { slug: post.slug, title: post.title, category: post.category, lang: post.lang }]))
}

function buildCandidate(
  bucket: TermBucket,
  postMap: Map<string, Pick<CloudPost, 'slug' | 'title' | 'category' | 'lang'>>,
  topPostsPerTerm: number,
): GlossaryGapCandidate {
  const uniquePosts = bucket.postMap.size
  const levels = new Set<string>()
  const postCandidates: GlossaryPostHit[] = []

  for (const [slug, hit] of bucket.postMap) {
    const meta = postMap.get(slug)
    for (const l of hit.levelSet) levels.add(normalizeText(l) || 'unknown')
    postCandidates.push({
      slug,
      title: meta?.title ?? slug,
      category: meta?.category ?? '未歸檔',
      lang: meta?.lang ?? 'unknown',
      hits: hit.hits,
      lastSeen: toIso(hit.lastSeen) || new Date().toISOString(),
      sampleContexts: dedupeAndLimit(hit.contexts, 3),
    })
  }

  postCandidates.sort((a, b) => b.hits - a.hits)
  const topPosts = postCandidates.slice(0, topPostsPerTerm)
  const hasLocalDefinition = Boolean(findDefaultGlossaryEntry(bucket.term))

  const actionItems: string[] = []
  if (!hasLocalDefinition) {
    actionItems.push(`補齊「${bucket.term}」到 glossary seed 並加入中文/英文定義。`)
  }
  if (uniquePosts >= 2) {
    actionItems.push(`優先補齊高查詢量來源文章（前 ${topPosts.length} 篇）：${topPosts.map((item) => item.slug).join('、')}。`)
  }
  if (bucket.lookupRows > topPosts.reduce((sum, item) => sum + item.hits, 0)) {
    actionItems.push('檢查該詞彙是否有 level 或上下文造成多版本查詢。')
  }

  const priorityScore = Math.min(
    100,
    Math.round(
      bucket.totalLookupCount * 1.2 +
        uniquePosts * 8 +
        bucket.lookupRows * 1.2 +
        (hasLocalDefinition ? 0 : 18) +
        (actionItems.length > 0 ? 4 : 0),
    ),
  )

  return {
    term: bucket.term,
    totalLookupCount: bucket.totalLookupCount,
    lookupRows: bucket.lookupRows,
    uniquePosts,
    levels: Array.from(levels).slice(0, 5),
    hasLocalDefinition,
    priorityScore,
    actionItems,
    topPosts,
    needsHumanInput: true,
  }
}

function buildEmptyReport(input: {
  lookbackDays: number
  minLookupCount: number
  topTerms: number
  topPostsPerTerm: number
  notes: string[]
}): GlossaryGapReport {
  return {
    generated_at: new Date().toISOString(),
    inputs: {
      lookbackDays: input.lookbackDays,
      minLookupCount: input.minLookupCount,
      topTerms: input.topTerms,
      topPostsPerTerm: input.topPostsPerTerm,
    },
    summary: {
      lookbackDays: input.lookbackDays,
      minLookupCount: input.minLookupCount,
      topTerms: input.topTerms,
      topPostsPerTerm: input.topPostsPerTerm,
      totalTerms: 0,
      totalRows: 0,
      candidateTerms: 0,
      missingDefinitionTerms: 0,
      highPriorityTerms: 0,
    },
    candidates: [],
    note: input.notes.length > 0 ? input.notes : ['No glossary lookup record in the selected window.'],
  }
}

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= min && numeric <= max ? numeric : fallback
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function toNonNegativeInt(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.floor(value))
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : 0
}

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function toIso(ts: number): string {
  if (!ts) return ''
  return new Date(ts).toISOString()
}

function dedupeAndLimit(values: string[], limit: number): string[] {
  const deduped = Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
  return deduped.slice(0, limit)
}
