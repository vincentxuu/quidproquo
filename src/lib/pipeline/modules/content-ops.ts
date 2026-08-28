import type { CloudPost } from './content-posts'

const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'you', 'your', 'are', 'was', 'were',
  'have', 'has', 'not', 'but', 'about', 'into', 'when', 'what', 'how', 'why', 'can', 'will',
  '一個', '這個', '不是', '可以', '如果', '因為', '所以', '但是', '就是', '沒有', '自己',
])

export function runContentOps(posts: CloudPost[], searchQueries: string[] = []) {
  const knownTags = getKnownTags(posts)
  const vectors = new Map(posts.map((post) => [post.slug, getTermFrequency(`${post.title}\n${stripMarkdown(post.content)}`)]))
  const postReports = posts.map((post) => {
    const suggestedTldr = post.tldr ? null : summarize(post.content, 140)
    const suggestedDescription = post.description ? null : summarize(post.content, 155)
    const suggestedDifficulty = classifyDifficulty(post)
    const tagSuggestions = suggestTags(post, knownTags)
    const freshness = detectFreshnessRisk(post)

    return {
      slug: post.slug,
      title: post.title,
      category: post.category,
      lang: post.lang,
      suggestions: {
        tldr: suggestedTldr,
        description: suggestedDescription,
        tags: tagSuggestions,
        difficulty: suggestedDifficulty,
      },
      seo: {
        title_length: post.title.length,
        description_length: post.description?.length ?? 0,
        internal_link_opportunities: findInternalLinkOpportunities(post, posts),
      },
      freshness,
    }
  })

  const duplicateCandidates = []
  for (let i = 0; i < posts.length; i += 1) {
    for (let j = i + 1; j < posts.length; j += 1) {
      if (posts[i].lang !== posts[j].lang) continue
      const similarity = cosineSimilarity(vectors.get(posts[i].slug) ?? new Map(), vectors.get(posts[j].slug) ?? new Map())
      if (similarity >= 0.56) {
        duplicateCandidates.push({ left: posts[i].slug, right: posts[j].slug, similarity: Number(similarity.toFixed(3)) })
      }
    }
  }

  const corpus = stripMarkdown(posts.map((post) => `${post.title}\n${post.content}`).join('\n')).toLowerCase()
  const contentGaps = searchQueries
    .map((query) => ({ query, has_obvious_match: tokenize(query).some((token) => corpus.includes(token)) }))
    .filter((item) => !item.has_obvious_match)
    .slice(0, 50)

  return {
    generated_at: new Date().toISOString(),
    summary: {
      posts: posts.length,
      missing_tldr: postReports.filter((item) => item.suggestions.tldr).length,
      missing_description: postReports.filter((item) => item.suggestions.description).length,
      missing_difficulty: postReports.filter((item) => item.suggestions.difficulty).length,
      duplicate_candidates: duplicateCandidates.length,
      freshness_candidates: postReports.filter((item) => item.freshness).length,
      content_gaps: contentGaps.length,
    },
    posts: postReports,
    duplicate_candidates: duplicateCandidates.sort((a, b) => b.similarity - a.similarity).slice(0, 100),
    content_gaps: contentGaps,
  }
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu)?.filter((token) => token.length >= 2 && !STOP_WORDS.has(token)) ?? []
}

function getTermFrequency(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const token of tokenize(text)) counts.set(token, (counts.get(token) ?? 0) + 1)
  return counts
}

function cosineSimilarity(left: Map<string, number>, right: Map<string, number>): number {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0
  for (const value of left.values()) leftNorm += value * value
  for (const value of right.values()) rightNorm += value * value
  for (const [token, value] of left.entries()) dot += value * (right.get(token) ?? 0)
  if (leftNorm === 0 || rightNorm === 0) return 0
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
}

function kebabCase(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48)
}

function summarize(content: string, maxLength: number): string {
  const text = stripMarkdown(content)
  const firstSentence = text.split(/[。.!?！？]\s*/).find((sentence) => sentence.trim().length >= 18) ?? text
  return firstSentence.trim().slice(0, maxLength)
}

function classifyDifficulty(post: CloudPost): string {
  const words = tokenize(stripMarkdown(post.content)).length
  const codeBlocks = (post.content.match(/```/g) ?? []).length / 2
  const headings = (post.content.match(/^##\s+/gm) ?? []).length
  if (words >= 2200 || codeBlocks >= 8 || headings >= 10) return '深度'
  if (words >= 900 || codeBlocks >= 3 || headings >= 5) return '進階'
  return '入門'
}

function getKnownTags(posts: CloudPost[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return counts
}

function suggestTags(post: CloudPost, knownTags: Map<string, number>): string[] {
  const corpus = `${post.title}\n${stripMarkdown(post.content)}`.toLowerCase()
  const existing = new Set(post.tags)
  const matchedKnownTags = [...knownTags.keys()]
    .filter((tag) => !existing.has(tag))
    .map((tag) => {
      const parts = tag.split('-').filter((part) => part.length >= 3)
      const matches = parts.filter((part) => corpus.includes(part)).length
      return { tag, score: matches / Math.max(1, parts.length) + (knownTags.get(tag) ?? 0) / 100 }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.tag)
  const keywordTags = [...getTermFrequency(corpus).entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => kebabCase(token))
    .filter((tag) => TAG_PATTERN.test(tag) && !existing.has(tag))
  return Array.from(new Set([...matchedKnownTags, ...keywordTags])).slice(0, 6)
}

function relatedScore(post: CloudPost, candidate: CloudPost): number {
  const leftTags = new Set(post.tags)
  const rightTags = new Set(candidate.tags)
  const union = new Set([...leftTags, ...rightTags])
  let overlap = 0
  for (const tag of leftTags) if (rightTags.has(tag)) overlap += 1
  const tagScore = union.size > 0 ? overlap / union.size : 0
  const categoryScore = post.category === candidate.category ? 1 : 0
  const dayDiff = Math.abs(new Date(post.created_at).getTime() - new Date(candidate.created_at).getTime()) / 86400000
  const recencyScore = Math.max(0, 1 - dayDiff / 365)
  return tagScore * 0.4 + categoryScore * 0.3 + recencyScore * 0.2
}

function findInternalLinkOpportunities(post: CloudPost, posts: CloudPost[]) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug && candidate.lang === post.lang)
    .map((candidate) => ({ candidate, score: relatedScore(post, candidate) }))
    .filter((item) => item.score >= 0.35 && !post.content.includes(`/posts/${item.candidate.slug}`))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ candidate, score }) => ({ title: candidate.title, slug: candidate.slug, score: Number(score.toFixed(3)) }))
}

function detectFreshnessRisk(post: CloudPost) {
  const toolSignals = ['api', 'sdk', 'cloudflare', 'astro', 'workers', 'd1', 'vectorize', 'openai', 'anthropic', 'google', 'langgraph', 'nextjs', 'ollama', 'vllm']
  const text = `${post.title}\n${post.content}`.toLowerCase()
  const hasToolSignal = toolSignals.some((signal) => text.includes(signal))
  const ageDays = (Date.now() - new Date(post.created_at).getTime()) / 86400000
  const stalePhrase = /(deprecated|deprecate|淘汰|棄用|已過時|breaking change|版本)/i.test(text)
  if (!hasToolSignal && !stalePhrase) return null
  if (ageDays < 120 && !stalePhrase) return null
  return {
    age_days: Math.max(0, Math.round(ageDays)),
    reason: stalePhrase ? '文章提到版本、淘汰或 breaking change，建議人工複查引用狀態' : '技術/API 文章已超過 120 天，建議複查文件與版本',
  }
}
