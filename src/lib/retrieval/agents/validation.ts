import type { GraphState, ValidationResult } from '../state'

const MERMAID_OPEN = /^```mermaid\s*$/gm
const MERMAID_CLOSE = /^```\s*$/gm
const MARKDOWN_LINK_RE = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
const MARKDOWN_IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
const MERMAID_BLOCK_RE = /```mermaid\s*\n([\s\S]*?)\n```/g
const MERMAID_STARTERS = [
  'graph',
  'flowchart',
  'sequenceDiagram',
  'classDiagram',
  'stateDiagram',
  'stateDiagram-v2',
  'erDiagram',
  'journey',
  'gantt',
  'pie',
  'mindmap',
  'timeline',
  'gitGraph',
  'requirementDiagram',
  'C4Context',
  'C4Container',
  'C4Component',
  'C4Dynamic',
  'C4Deployment',
  'quadrantChart',
  'xychart-beta',
  'sankey-beta',
  'packet-beta',
  'block-beta',
  'architecture',
]

export function validateMarkdownStructure(markdown: string): string[] {
  const errors: string[] = []
  const fenceCount = (markdown.match(/^```/gm) ?? []).length
  if (fenceCount % 2 !== 0) {
    errors.push('Unbalanced Markdown code fences.')
  }

  const suspiciousLinkStart = (markdown.match(/\]\(/g) ?? []).length
  const parsedLinks = [...markdown.matchAll(MARKDOWN_LINK_RE)].length + [...markdown.matchAll(MARKDOWN_IMAGE_RE)].length
  if (suspiciousLinkStart > 0 && parsedLinks === 0) {
    errors.push('Markdown links or images appear malformed.')
  }

  return errors
}

export function extractMarkdownUrls(markdown: string): { citationUrls: string[]; imageUrls: string[] } {
  const citationUrls = [...markdown.matchAll(MARKDOWN_LINK_RE)].map(match => match[2])
  const imageUrls = [...markdown.matchAll(MARKDOWN_IMAGE_RE)].map(match => match[2])
  return { citationUrls, imageUrls }
}

const BLOG_ORIGIN = 'https://quidproquo.cc'

/**
 * 比對引用 URL 用的正規化：模型常把 source_url 抄成「多一個結尾斜線」、
 * 「www.」或站內相對路徑，這些都是同一篇文章，不該讓 validation 失敗後整輪重跑。
 * （prod 的 rag_trace_steps 裡 validation 失敗全是結尾斜線這一種。）
 */
export function normalizeCitationUrl(url: string): string {
  const abs = url.startsWith('/') ? `${BLOG_ORIGIN}${url}` : url
  return abs
    .trim()
    .replace(/^http:\/\//, 'https://')
    .replace(/^https:\/\/www\./, 'https://')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
}

const BARE_URL_RE = /https?:\/\/[^\s<>()[\]"'`]+/g

function extractUrlsFromText(text: string): string[] {
  return (text.match(BARE_URL_RE) ?? []).map(url => url.replace(/[.,;:!?]+$/, ''))
}

export function validateSourceUrls(markdown: string, state: Pick<GraphState, 'search_results'>): string[] {
  const errors: string[] = []
  // 准引用的除了 source_url，還有證據段落裡本來就寫著的連結（文章自己引的官方文件等）：
  // 那些是有出處的，模型照抄不算幻覺；只擋證據裡完全沒出現過的 URL。
  const allowedSourceUrls = new Set(
    state.search_results.flatMap(result => [
      result.source_url,
      ...(result.links ?? []).map(link => link.url),
      ...extractUrlsFromText(result.evidence_excerpt ?? ''),
    ]).map(normalizeCitationUrl)
  )
  const allowedImageUrls = new Set(state.search_results.flatMap(result => result.images).map(normalizeCitationUrl))
  const { citationUrls, imageUrls } = extractMarkdownUrls(markdown)

  const invalidCitationUrls = citationUrls.filter(url => {
    const key = normalizeCitationUrl(url)
    return !allowedSourceUrls.has(key) && !allowedImageUrls.has(key)
  })
  if (invalidCitationUrls.length > 0) {
    errors.push(`Unknown citation URL(s): ${Array.from(new Set(invalidCitationUrls)).join(', ')}`)
  }

  const invalidImageUrls = imageUrls.filter(url => !allowedImageUrls.has(normalizeCitationUrl(url)))
  if (invalidImageUrls.length > 0) {
    errors.push(`Unknown image URL(s): ${Array.from(new Set(invalidImageUrls)).join(', ')}`)
  }

  return errors
}

export function validateMermaidBlocks(markdown: string): string[] {
  const errors: string[] = []
  const openCount = (markdown.match(MERMAID_OPEN) ?? []).length
  const closeCount = (markdown.match(MERMAID_CLOSE) ?? []).length

  if (openCount > closeCount) {
    errors.push('Unclosed Mermaid fenced block.')
    return errors
  }

  for (const match of markdown.matchAll(MERMAID_BLOCK_RE)) {
    const body = match[1].trim()
    const firstLine = body.split('\n').find(line => line.trim().length > 0)?.trim() ?? ''

    if (!firstLine) {
      errors.push('Empty Mermaid block.')
      continue
    }

    if (!MERMAID_STARTERS.some(starter => firstLine.startsWith(starter))) {
      errors.push(`Mermaid block must start with a valid diagram type, got: ${firstLine}`)
    }
  }

  return errors
}

export function validateDraft(state: Pick<GraphState, 'draft' | 'search_results'>): ValidationResult {
  const errors = [
    ...validateDraftNotEmpty(state.draft),
    ...validateMarkdownStructure(state.draft),
    ...validateSourceUrls(state.draft, state),
    ...validateMermaidBlocks(state.draft),
  ]

  return {
    passed: errors.length === 0,
    errors,
  }
}

function validateDraftNotEmpty(draft: string): string[] {
  if (!draft.trim()) {
    return ['Draft is empty; the writer produced no content.']
  }
  return []
}

export async function validationNode(state: GraphState): Promise<Partial<GraphState>> {
  return { validation: validateDraft(state) }
}
