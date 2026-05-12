import type { CloudPost } from './content-posts'

interface SeriesSuggestionsInput {
  topSeriesCount?: number
  minPostsPerSeries?: number
  maxPostsPerSeries?: number
  minSignalLength?: number
}

interface SeriesSuggestionItem {
  signal: string
  signal_type: 'tag' | 'topic'
  post_count: number
  unique_categories: number
  score: number
  reasons: string[]
  top_posts: Array<{
    slug: string
    title: string
    category: string
    lang: string
    updated_at: string
  }>
  needs_human_input: boolean
}

interface SeriesSuggestionsSummary {
  posts_analyzed: number
  candidates: number
  min_posts_per_series: number
  top_series_count: number
  min_signal_length: number
  with_tag_signal: number
  with_topic_signal: number
}

export interface SeriesSuggestionsReport {
  generated_at: string
  inputs: {
    top_series_count: number
    min_posts_per_series: number
    max_posts_per_series: number
    min_signal_length: number
  }
  summary: SeriesSuggestionsSummary
  suggestions: SeriesSuggestionItem[]
  notes: string[]
}

const DEFAULT_TOP_SERIES_COUNT = 12
const DEFAULT_MIN_POSTS_PER_SERIES = 2
const DEFAULT_MAX_POSTS_PER_SERIES = 8
const DEFAULT_MIN_SIGNAL_LENGTH = 2

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'your',
  'you',
  'our',
  'from',
  'into',
  'how',
  'when',
  'where',
  'what',
  'which',
  'would',
  'could',
  'using',
  '使用',
  '技巧',
  '介紹',
  '如何',
  '分享',
  '心得',
  '筆記',
  '心得筆記',
  '一文',
  '快速',
  '指南',
  '完整',
  '篇',
  '版本',
  '新手',
  '實作',
])

interface SeriesBucket {
  signal: string
  signalType: 'tag' | 'topic'
  posts: Map<string, {
    title: string
    category: string
    lang: string
    updatedAt: string
  }>
  categorySet: Set<string>
}

export function runSeriesSuggestions(posts: CloudPost[], input: SeriesSuggestionsInput = {}): SeriesSuggestionsReport {
  const topSeriesCount = normalizePositiveInt(input.topSeriesCount, DEFAULT_TOP_SERIES_COUNT, 1, 200)
  const minPostsPerSeries = normalizePositiveInt(input.minPostsPerSeries, DEFAULT_MIN_POSTS_PER_SERIES, 2, 100)
  const maxPostsPerSeries = normalizePositiveInt(input.maxPostsPerSeries, DEFAULT_MAX_POSTS_PER_SERIES, 1, 20)
  const minSignalLength = normalizePositiveInt(input.minSignalLength, DEFAULT_MIN_SIGNAL_LENGTH, 1, 20)

  const notes: string[] = []
  if (posts.length === 0) {
    return {
      generated_at: new Date().toISOString(),
      inputs: {
        top_series_count: topSeriesCount,
        min_posts_per_series: minPostsPerSeries,
        max_posts_per_series: maxPostsPerSeries,
        min_signal_length: minSignalLength,
      },
      summary: {
        posts_analyzed: 0,
        candidates: 0,
        min_posts_per_series: minPostsPerSeries,
        top_series_count: topSeriesCount,
        min_signal_length: minSignalLength,
        with_tag_signal: 0,
        with_topic_signal: 0,
      },
      suggestions: [],
      notes: ['No cloud posts available for series signal scan.'],
    }
  }

  const buckets = new Map<string, SeriesBucket>()

  for (const post of posts) {
    const postSignals = buildPostSignals(post, minSignalLength)
    for (const signal of postSignals.tagSignals) {
      upsertBucket(buckets, signal, 'tag', post)
    }
    for (const signal of postSignals.topicSignals) {
      upsertBucket(buckets, signal, 'topic', post)
    }
  }

  const candidates = Array.from(buckets.values())
    .map((bucket) => buildSuggestion(bucket, maxPostsPerSeries))
    .filter((item) => item.post_count >= minPostsPerSeries)
    .sort((a, b) => b.score - a.score || b.post_count - a.post_count || a.signal.localeCompare(b.signal))
    .slice(0, topSeriesCount)

  if (candidates.length === 0) {
    notes.push('No signal reached the minimum post count threshold.')
  } else {
    notes.push(`${candidates.length} series signals found from tags/topics across ${posts.length} posts.`)
  }

  return {
    generated_at: new Date().toISOString(),
    inputs: {
      top_series_count: topSeriesCount,
      min_posts_per_series: minPostsPerSeries,
      max_posts_per_series: maxPostsPerSeries,
      min_signal_length: minSignalLength,
    },
    summary: {
      posts_analyzed: posts.length,
      candidates: candidates.length,
      min_posts_per_series: minPostsPerSeries,
      top_series_count: topSeriesCount,
      min_signal_length: minSignalLength,
      with_tag_signal: candidates.filter((item) => item.signal_type === 'tag').length,
      with_topic_signal: candidates.filter((item) => item.signal_type === 'topic').length,
    },
    suggestions: candidates,
    notes,
  }
}

function buildSuggestion(bucket: SeriesBucket, maxPostsPerSeries: number): SeriesSuggestionItem {
  const sortedPosts = Array.from(bucket.posts.entries())
    .map(([slug, meta]) => ({
      slug,
      title: meta.title,
      category: meta.category,
      lang: meta.lang,
      updated_at: meta.updatedAt,
    }))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  const topPosts = sortedPosts.slice(0, maxPostsPerSeries)
  const uniqueCategories = bucket.categorySet.size
  const reasons = [
    bucket.signalType === 'tag'
      ? `共用 tag 信號 "${bucket.signal}"，形成系列化主題聚合。`
      : `主題詞「${bucket.signal}」在多篇文章中反覆出現，可考慮串聯補全。`,
    `共 ${bucket.posts.size} 篇文章，涵蓋 ${uniqueCategories} 個分類。`,
  ]

  if (bucket.posts.size >= 4) {
    reasons.push('可規劃為 series 首頁 + 多篇子篇章。')
  }

  const score = bucket.signalType === 'tag'
    ? bucket.posts.size * 11 + uniqueCategories * 6 + bucket.posts.size
    : bucket.posts.size * 8 + uniqueCategories * 4

  return {
    signal: bucket.signal,
    signal_type: bucket.signalType,
    post_count: bucket.posts.size,
    unique_categories: uniqueCategories,
    score,
    reasons,
    top_posts: topPosts,
    needs_human_input: true,
  }
}

function buildPostSignals(post: CloudPost, minSignalLength: number): { tagSignals: string[]; topicSignals: string[] } {
  const tagSignals = post.tags
    .map((tag) => normalizeSignal(tag))
    .filter((signal) => isValidSignal(signal, minSignalLength))
    .filter((signal, index, arr) => arr.indexOf(signal) === index)

  const titleAndHeadings = extractSignalsFromText(`${post.title}\n${extractHeadings(post.content)}`)
  const topicSignals = titleAndHeadings
    .map((topic) => normalizeSignal(topic))
    .filter((topic) => isValidSignal(topic, minSignalLength))
    .filter((topic, index, arr) => arr.indexOf(topic) === index)

  return {
    tagSignals,
    topicSignals,
  }
}

function extractSignalsFromText(text: string): string[] {
  const englishTokens = text.match(/\b[a-z][a-z0-9\-_.]+\b/gi) ?? []
  const latinLongTokens = englishTokens.filter((token) => token.length > 2)
  const chineseTokens = text.match(/[\u4e00-\u9fff]{2,}/g) ?? []
  return [...latinLongTokens, ...chineseTokens]
}

function extractHeadings(content: string): string {
  return content
    .split('\n')
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, ''))
    .join(' ')
}

function upsertBucket(
  buckets: Map<string, SeriesBucket>,
  signal: string,
  type: 'tag' | 'topic',
  post: CloudPost,
): void {
  const bucket = buckets.get(signal) ?? {
    signal,
    signalType: type,
    posts: new Map(),
    categorySet: new Set(),
  }

  if (!bucket.posts.has(post.slug)) {
    bucket.posts.set(post.slug, {
      title: post.title,
      category: post.category,
      lang: post.lang,
      updatedAt: post.updated_at,
    })
    bucket.categorySet.add(post.category)
  } else if (post.category) {
    bucket.categorySet.add(post.category)
  }

  bucket.signalType = bucket.signalType === 'tag' ? 'tag' : type
  buckets.set(signal, bucket)
}

function isValidSignal(signal: string, minLen: number): boolean {
  const normalized = normalizeSignal(signal)
  if (normalized.length < minLen) return false
  if (STOPWORDS.has(normalized.toLowerCase())) return false
  return true
}

function normalizeSignal(value: string): string {
  return value.trim().toLowerCase().replace(/^#+|[^\p{L}\p{N}]+/gu, '')
}

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= min && numeric <= max ? numeric : fallback
}
