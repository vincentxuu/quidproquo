import type { CloudPost } from './content-posts'

export type FindingSeverity = 'error' | 'warn'

export interface PipelineFinding {
  severity: FindingSeverity
  message: string
}

export interface QualityReportItem {
  slug: string
  title: string
  findings: PipelineFinding[]
}

const VALID_CATEGORIES = new Set([
  'tech', 'climbing', 'surf', 'film', 'life', 'coffee', 'learning', 'ai',
  'product', 'marketing', 'travel', 'design', 'education', 'policy', 'anime', 'career', 'investing',
])
const VALID_LANGS = new Set(['zh-TW', 'en'])
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const STRUCTURED_CATEGORIES = new Set([
  'tech', 'ai', 'learning', 'education', 'policy', 'design', 'marketing', 'product',
])

export function runPostQualityCheck(posts: CloudPost[], knownRoutes = buildKnownPostRoutes(posts)): QualityReportItem[] {
  return posts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      findings: [
        ...getFrontmatterFindings(post),
        ...getInternalLinkFindings(post.content, knownRoutes),
        ...getTagConsistencyFindings(post),
        ...getHeadingStructureFindings(post),
      ],
    }))
    .filter((report) => report.findings.length > 0)
}

export function countFindings(reports: QualityReportItem[], severity: FindingSeverity): number {
  return reports.flatMap((report) => report.findings).filter((finding) => finding.severity === severity).length
}

export function buildKnownPostRoutes(posts: CloudPost[]): Set<string> {
  const routes = new Set<string>()
  for (const post of posts) {
    routes.add(`/posts/${post.slug}`)
    routes.add(`/en/posts/${post.slug}`)
  }
  return routes
}

function isValidDateValue(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(new Date(value).getTime())
}

function getFrontmatterFindings(post: CloudPost): PipelineFinding[] {
  const findings: PipelineFinding[] = []

  if (post.title.trim().length === 0) findings.push({ severity: 'error', message: 'frontmatter `title` 必須是非空字串' })
  if (!isValidDateValue(post.created_at)) findings.push({ severity: 'error', message: 'frontmatter `date` 必須是 YYYY-MM-DD' })
  if (!VALID_CATEGORIES.has(post.category)) findings.push({ severity: 'error', message: 'frontmatter `category` 不在允許清單內' })
  if (!VALID_LANGS.has(post.lang)) findings.push({ severity: 'error', message: 'frontmatter `lang` 必須是 `zh-TW` 或 `en`' })

  const seen = new Set<string>()
  for (const tag of post.tags) {
    if (!TAG_PATTERN.test(tag)) {
      findings.push({ severity: 'error', message: `tag \`${tag}\` 必須是全小寫 kebab-case` })
      continue
    }
    if (seen.has(tag)) findings.push({ severity: 'error', message: `tag \`${tag}\` 重複` })
    seen.add(tag)
  }

  const basename = post.slug.split('/').pop() ?? post.slug
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(basename)) {
    findings.push({ severity: 'error', message: '檔名必須符合 `YYYY-MM-DD-<slug>.md`' })
  }

  return findings
}

function getInternalLinkFindings(content: string, knownRoutes: Set<string>): PipelineFinding[] {
  const findings: PipelineFinding[] = []
  const matches = [...content.matchAll(/\[[^\]]+]\((\/(?:en\/)?posts\/[^)#?\s]+)(?:#[^)]+)?\)/g)]

  for (const match of matches) {
    const route = match[1]
    if (!knownRoutes.has(route)) findings.push({ severity: 'error', message: `內部文章連結不存在：${route}` })
  }

  return findings
}

function getTagConsistencyFindings(post: CloudPost): PipelineFinding[] {
  const findings: PipelineFinding[] = []
  if (post.tags.length === 0) return findings

  const corpus = normalizeText(`${post.title}\n${post.content}`)
  for (const tag of post.tags) {
    const parts = tag.split('-').filter((part) => part.length >= 3)
    if (parts.length === 0) continue
    const hasSignal = parts.some((part) => corpus.includes(part))
    if (!hasSignal) {
      findings.push({
        severity: 'warn',
        message: `tag \`${tag}\` 沒有在標題或內文出現明顯對應詞，請確認是否真的貼切`,
      })
    }
  }

  return findings
}

function getHeadingStructureFindings(post: CloudPost): PipelineFinding[] {
  const findings: PipelineFinding[] = []
  const headingLines = getContentOutsideCodeFences(post.content)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter(({ line }) => /^#{1,6}\s+/.test(line.trim()))

  let previousLevel = 0
  let seenH2 = false

  for (const { line, index } of headingLines) {
    const trimmed = line.trim()
    const level = trimmed.match(/^#+/)?.[0].length ?? 0
    if (level === 1) findings.push({ severity: 'error', message: `第 ${index} 行不應在內文使用 H1（\`#\`）` })
    if (level === 2) seenH2 = true
    if (level >= 3 && !seenH2) findings.push({ severity: 'error', message: `第 ${index} 行在第一個 H2 之前出現更深層標題` })
    if (previousLevel > 0 && level - previousLevel > 1) {
      findings.push({ severity: 'error', message: `第 ${index} 行標題層級跳太多：H${previousLevel} -> H${level}` })
    }
    previousLevel = level
  }

  if (STRUCTURED_CATEGORIES.has(post.category) && !seenH2) {
    findings.push({ severity: 'error', message: '此分類文章至少應包含一個 H2 段落標題' })
  }

  return findings
}

function getContentOutsideCodeFences(content: string): string[] {
  const kept: string[] = []
  let inFence = false
  for (const line of content.split('\n')) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence
      kept.push('')
      continue
    }
    kept.push(inFence ? '' : line)
  }
  return kept
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9一-鿿-]+/g, ' ')
}
