import type { CloudPost } from './content-posts'
import type { PipelineFinding, QualityReportItem } from './post-quality'

const REFERENCE_HEADINGS = new Set([
  '## 參考資料',
  '### 參考資料',
  '## References',
  '### References',
  '**參考資料**',
  '**References**',
])
const REFERENCE_REQUIRED_CATEGORIES = new Set([
  'ai',
  'tech',
  'learning',
  'education',
  'policy',
  'design',
  'marketing',
  'product',
])
const STRUCTURAL_HEADINGS = new Set([
  'tl;dr',
  '情境',
  '問題',
  '嘗試過程',
  '解法',
  '為什麼會這樣',
  '學到的事',
  '整體來說',
  '整體架構',
  '參考資料',
  'references',
])
const COVERAGE_STOPWORDS = new Set([
  '2026', '2025', 'guide', 'intro', 'overview', 'deep', 'dive', 'complete', 'terminal', 'coding',
  'agent', 'agents', 'framework', 'frameworks', 'ai', 'llm', 'the', 'and', 'for', 'with', 'from',
  'into', 'your', 'that', 'this', 'how', 'what', 'why',
])
const CITATION_KEYWORDS = [
  '官方', '文件', '文檔', '參考', '論文', 'paper', 'research', 'benchmark', 'github', 'repo',
  'release', 'sdk', 'framework', 'stars', 'compare', '比較', 'according to',
]

interface ReferenceSection {
  exists: boolean
  headingIndex: number
  content: string
  links: string[]
}

export function runReferenceCheck(posts: CloudPost[]): QualityReportItem[] {
  return posts
    .map((post) => ({ slug: post.slug, title: post.title, findings: lintReferences(post) }))
    .filter((report) => report.findings.length > 0)
}

function lintReferences(post: CloudPost): PipelineFinding[] {
  const referenceSection = extractReferenceSection(post.content)
  const lines = post.content.split('\n')
  const bodyBeforeReferences = referenceSection.exists
    ? lines.slice(0, referenceSection.headingIndex).join('\n')
    : post.content
  const findings: PipelineFinding[] = []
  const needsReferences = estimateReferenceNeed(post.category, post.title, bodyBeforeReferences)
  const headings = getTopicHeadings(bodyBeforeReferences)

  if (needsReferences && !referenceSection.exists) {
    findings.push({ severity: 'error', message: '缺少 `參考資料` / `References` 區段' })
  }

  if (referenceSection.exists && referenceSection.links.length === 0) {
    findings.push({ severity: 'error', message: '參考資料區段存在，但沒有有效的 Markdown 連結' })
  }

  if (referenceSection.exists && /{{|待補|todo/i.test(referenceSection.content)) {
    findings.push({ severity: 'error', message: '參考資料區段仍有 placeholder 或待補標記' })
  }

  if (referenceSection.exists && referenceSection.links.length > 0) {
    findings.push(...checkCoverage(post.title, headings, referenceSection.content, referenceSection.links))
  }

  return findings
}

function extractReferenceSection(body: string): ReferenceSection {
  const lines = body.split('\n')
  const headingIndex = lines.findIndex((line) => REFERENCE_HEADINGS.has(line.trim()))
  if (headingIndex === -1) return { exists: false, headingIndex: -1, content: '', links: [] }

  const headingLevel = lines[headingIndex].trim().match(/^(#+)/)?.[1].length ?? 2
  const breakPattern = new RegExp(`^#{1,${headingLevel}}\\s+`)
  const referenceLines: string[] = []

  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    if (breakPattern.test(lines[index].trim())) break
    referenceLines.push(lines[index])
  }

  const content = referenceLines.join('\n').trim()
  const links = [...content.matchAll(/\[[^\]]+]\(([^)]+)\)/g)].map((match) => match[1])
  return { exists: true, headingIndex, content, links }
}

function estimateReferenceNeed(category: string, title: string, bodyBeforeReferences: string): boolean {
  if (REFERENCE_REQUIRED_CATEGORIES.has(category)) return true

  const lower = `${title}\n${bodyBeforeReferences}`.toLowerCase()
  const headingCount = countMatches(bodyBeforeReferences, /^##\s+/gm)
  const codeFenceCount = countMatches(bodyBeforeReferences, /^```/gm) / 2
  const inlineCodeCount = countMatches(bodyBeforeReferences, /`[^`\n]+`/g)
  const externalLinkCount = countMatches(bodyBeforeReferences, /\[[^\]]+]\(https?:\/\/[^)]+\)/g)
  const keywordHits = CITATION_KEYWORDS.filter((keyword) => lower.includes(keyword)).length

  return headingCount >= 4 || codeFenceCount > 0 || inlineCodeCount >= 3 || externalLinkCount > 0 || keywordHits >= 2
}

function checkCoverage(title: string, headings: string[], referenceContent: string, referenceLinks: string[]): PipelineFinding[] {
  const findings: PipelineFinding[] = []
  const coverageSource = [title, ...headings.slice(0, 8)].join('\n')
  const requiredTokens = getCoverageTokens(coverageSource)
  const referenceTokens = new Set(getCoverageTokens(referenceContent))
  const matchedTokenCount = requiredTokens.filter((token) => referenceTokens.has(token)).length
  const expectedMinimumLinks = headings.length >= 8 ? 4 : headings.length >= 4 ? 2 : 1

  if (referenceLinks.length < expectedMinimumLinks) {
    findings.push({ severity: 'warn', message: `參考資料可能不足：主題段落 ${headings.length} 個，但只有 ${referenceLinks.length} 個連結` })
  }

  if (requiredTokens.length > 0 && matchedTokenCount === 0) {
    findings.push({ severity: 'warn', message: '參考資料和標題/主要段落缺少明顯關鍵詞重疊，可能沒有覆蓋文章主題' })
  }

  return findings
}

function getTopicHeadings(bodyBeforeReferences: string): string[] {
  return bodyBeforeReferences
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, '').replace(/^\d+\.\s*/, '').trim())
    .filter((heading) => heading.length > 0)
    .filter((heading) => !STRUCTURAL_HEADINGS.has(heading.toLowerCase()))
}

function getCoverageTokens(text: string): string[] {
  const tokens = new Set<string>()
  for (const match of text.matchAll(/[A-Za-z0-9][A-Za-z0-9-]{2,}/g)) {
    const token = normalizeToken(match[0])
    if (token) tokens.add(token)
  }
  return [...tokens]
}

function normalizeToken(token: string): string | null {
  const normalized = token.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9-]+$/g, '')
  if (normalized.length < 3 || COVERAGE_STOPWORDS.has(normalized)) return null
  return normalized
}

function countMatches(text: string, pattern: RegExp): number {
  return [...text.matchAll(pattern)].length
}
