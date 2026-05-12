import type { CloudPost } from './content-posts'

interface FreshnessReviewInput {
  maxAgeDays?: number
  riskThreshold?: number
  categoryFilter?: string
  languageFilter?: string
}

interface FreshnessSection {
  heading: string
  snippets: string[]
}

export interface FreshnessCandidate {
  slug: string
  title: string
  category: string
  lang: string
  risk_score: number
  reason: string
  affected_sections: string[]
  verification_sources: string[]
  needs_human_input: boolean
}

export interface FreshnessReviewSummary {
  posts_analyzed: number
  candidates: number
  high_risk_candidates: number
  risk_threshold: number
  max_age_days: number
  average_risk_score: number
}

export interface FreshnessReviewResult {
  generated_at: string
  inputs: {
    max_age_days: number
    risk_threshold: number
    category_filter: string
    language_filter: string
  }
  summary: FreshnessReviewSummary
  candidates: FreshnessCandidate[]
}

const DEFAULT_MAX_AGE_DAYS = 365
const DEFAULT_RISK_THRESHOLD = 40

const VERSION_RE = /\b(v\d+(?:\.\d+){1,2}|version\s*\d+(?:\.\d+)?(?:\.\d+)?|\d+\.\d+\.\d+)\b/i
const DATE_RE = /\b(20\d{2})[/-](\d{1,2})[/-](\d{1,2})\b/
const YEAR_CH_RE = /\b20\d{2}年\d{1,2}月\d{1,2}日\b/
const SENSITIVE_KEYWORDS = [
  'deprecated',
  'deprecated.',
  'deprecated:',
  '棄用',
  '淘汰',
  '過時',
  '安全風險',
  'security',
  'release',
  'changelog',
  '更新',
  '更新版',
  'break',
  'legacy',
]

const HIGH_CHURN_KEYWORDS = [
  'cloudflare',
  'workers',
  'd1',
  'vectorize',
  'rag',
  'embedding',
  'llm',
  'ai',
  'openai',
  'anthropic',
  'gemini',
  'vercel',
  'nextjs',
  'astro',
  'llama',
  'vllm',
  'kubernetes',
]

const SOURCE_HINTS: Array<[RegExp, string]> = [
  [/cloudflare/i, 'Cloudflare 官方變更公告 / Changelog'],
  [/wrangler|workers|d1|vectorize|r2/i, 'Cloudflare 官方文件更新頁'],
  [/openai|o1|gpt|chatgpt|assistant/i, 'OpenAI API 更新文件'],
  [/anthropic|claude/i, 'Anthropic 官方文件'],
  [/gemini|google/i, 'Google AI 官方文件'],
  [/astro|nextjs|react|vite|vitepress/i, '框架官方版本與相容性頁'],
  [/rag|embed|embedding|retrieval/i, 'RAG/Embeddings 相關官方文件'],
]

export function runFreshnessReview(posts: CloudPost[], input: FreshnessReviewInput = {}): FreshnessReviewResult {
  const maxAgeDays = sanitizePositiveInt(input.maxAgeDays, DEFAULT_MAX_AGE_DAYS, 30, 1095)
  const riskThreshold = sanitizePositiveInt(input.riskThreshold, DEFAULT_RISK_THRESHOLD, 1, 100)
  const categoryFilter = sanitizeText(input.categoryFilter).toLowerCase()
  const languageFilter = sanitizeText(input.languageFilter).toLowerCase()

  const now = new Date()

  const filteredPosts = posts
    .filter((post) => matchCategoryFilter(post, categoryFilter))
    .filter((post) => matchLanguageFilter(post, languageFilter))

  const candidates = filteredPosts
    .map((post) => inspectPost(post, { now, maxAgeDays }))
    .filter((item): item is FreshnessCandidate => item !== null && item.risk_score >= riskThreshold)
    .sort((a, b) => b.risk_score - a.risk_score)

  const summary: FreshnessReviewSummary = {
    posts_analyzed: filteredPosts.length,
    candidates: candidates.length,
    high_risk_candidates: candidates.filter((item) => item.risk_score >= 75).length,
    risk_threshold: riskThreshold,
    max_age_days: maxAgeDays,
    average_risk_score: candidates.length > 0 ? Number((candidates.reduce((sum, item) => sum + item.risk_score, 0) / candidates.length).toFixed(2)) : 0,
  }

  return {
    generated_at: new Date().toISOString(),
    inputs: {
      max_age_days: maxAgeDays,
      risk_threshold: riskThreshold,
      category_filter: categoryFilter,
      language_filter: languageFilter,
    },
    summary,
    candidates,
  }
}

function inspectPost(post: CloudPost, context: { now: Date; maxAgeDays: number }): FreshnessCandidate | null {
  const postText = `${post.title}
${post.content}`
  const lowerText = postText.toLowerCase()

  let riskScore = 0
  const reasons: string[] = []
  const verificationSources = new Set<string>()

  const updatedAt = parseDate(post.updated_at) ?? parseDate(post.created_at) ?? context.now
  const ageDays = Math.max(0, Math.round((context.now.getTime() - updatedAt.getTime()) / 86400000))

  if (ageDays > context.maxAgeDays) {
    const overDays = ageDays - context.maxAgeDays
    riskScore += 30 + Math.min(35, Math.floor(overDays / 40))
    reasons.push(`最後更新超過 ${context.maxAgeDays} 天（距今 ${ageDays} 天）`)
    verificationSources.add('官方文件變更歷史')
  }

  const hasVersionSignal = VERSION_RE.test(postText)
  if (hasVersionSignal) {
    riskScore += 20
    reasons.push('偵測到明確版本訊息，需確認該版本與 API 行為是否仍有效')
    verificationSources.add('發行版本與 release notes')
  }

  const isSensitiveDate = /202[0-9]|20[3-9][0-9]/.test(lowerText)
  if (isSensitiveDate && lowerText.match(DATE_RE)) {
    riskScore += 12
    reasons.push('內容中包含舊日期/版本時間參考，可能需要核對是否仍正確')
    verificationSources.add('日期對照的官方公告')
  }

  const matchedSensitiveKeywords = SENSITIVE_KEYWORDS.filter((keyword) => postText.toLowerCase().includes(keyword.toLowerCase()))
  if (matchedSensitiveKeywords.length > 0) {
    riskScore += Math.min(30, 12 + matchedSensitiveKeywords.length * 4)
    reasons.push(`包含敏感詞彙（${matchedSensitiveKeywords.slice(0, 3).join('、')}）`)
    verificationSources.add('外部來源與實際行為驗證')
  }

  const matchedChurnSignals = HIGH_CHURN_KEYWORDS.filter((keyword) => lowerText.includes(keyword))
  if (matchedChurnSignals.length > 0) {
    riskScore += Math.min(25, 10 + matchedChurnSignals.length * 3)
    verificationSources.add('近期官網發布與更新說明')
  }

  if (post.tags.some((tag) => ['ai', 'tech', 'product', 'marketing', 'learning'].includes(tag))) {
    riskScore += 5
  }

  if (riskScore < 35 && ageDays <= context.maxAgeDays) return null

  const affectedSections = buildAffectedSections(post.content)
    .filter((section) => hasSectionSignal(section, postText))
    .map((section) => section.heading)

  if (affectedSections.length === 0) {
    affectedSections.push('文章開頭摘要區')
  }

  const finalRisk = Math.min(100, riskScore)

  if (finalRisk < 35) return null

  for (const [matcher, source] of SOURCE_HINTS) {
    if (matcher.test(postText)) {
      verificationSources.add(source)
    }
  }

  if (verificationSources.size === 0) {
    verificationSources.add('官方文件、發行紀錄與版本公告（依文章主題）')
  }

  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    lang: post.lang,
    risk_score: finalRisk,
    reason: reasons.length > 0 ? reasons.join('；') : '未達高風險門檻前建議人工快速抽查',
    affected_sections: affectedSections,
    verification_sources: Array.from(verificationSources).slice(0, 6),
    needs_human_input: true,
  }
}

function hasSectionSignal(section: FreshnessSection, text: string): boolean {
  const combined = `${section.heading} ${section.snippets.join(' ')}`.toLowerCase()
  if (VERSION_RE.test(combined)) return true
  if (YEAR_CH_RE.test(combined) || DATE_RE.test(combined)) return true
  if (SENSITIVE_KEYWORDS.some((keyword) => combined.includes(keyword))) return true
  if (HIGH_CHURN_KEYWORDS.some((token) => combined.includes(token))) return true
  return false
}

function buildAffectedSections(content: string): FreshnessSection[] {
  const headings: FreshnessSection[] = []
  const lines = content.split('\n')
  let currentHeading = '文章開頭摘要區'
  let snippets: string[] = []

  const flush = () => {
    headings.push({
      heading: currentHeading,
      snippets,
    })
    snippets = []
  }

  for (const line of lines) {
    const match = line.match(/^#{1,6}\s+(.+)$/)
    if (match) {
      flush()
      currentHeading = match[1].trim()
      continue
    }
    snippets.push(line)
  }

  flush()
  return headings
}

function sanitizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = Number(value)
  if (!Number.isInteger(numeric)) return fallback
  if (numeric < min || numeric > max) return fallback
  return numeric
}

function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function matchCategoryFilter(post: CloudPost, categoryFilter: string): boolean {
  if (!categoryFilter) return true
  const target = categoryFilter.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
  if (!target.length) return true
  return target.includes(post.category.toLowerCase())
}

function matchLanguageFilter(post: CloudPost, languageFilter: string): boolean {
  if (!languageFilter) return true
  const target = languageFilter.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
  if (!target.length) return true
  return target.includes(post.lang.toLowerCase())
}
