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

export function validateSourceUrls(markdown: string, state: Pick<GraphState, 'search_results'>): string[] {
  const errors: string[] = []
  const BLOG_ORIGIN = 'https://quidproquo.cc'
  const normalize = (url: string) =>
    url.startsWith('/') ? `${BLOG_ORIGIN}${url}` : url

  const allowedSourceUrls = new Set(state.search_results.map(result => result.source_url))
  const allowedImageUrls = new Set(state.search_results.flatMap(result => result.images))
  const { citationUrls, imageUrls } = extractMarkdownUrls(markdown)

  const invalidCitationUrls = citationUrls.filter(url => {
    const abs = normalize(url)
    return !allowedSourceUrls.has(abs) && !allowedSourceUrls.has(url) && !allowedImageUrls.has(abs) && !allowedImageUrls.has(url)
  })
  if (invalidCitationUrls.length > 0) {
    errors.push(`Unknown citation URL(s): ${Array.from(new Set(invalidCitationUrls)).join(', ')}`)
  }

  const invalidImageUrls = imageUrls.filter(url => !allowedImageUrls.has(normalize(url)) && !allowedImageUrls.has(url))
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
    ...validateMarkdownStructure(state.draft),
    ...validateSourceUrls(state.draft, state),
    ...validateMermaidBlocks(state.draft),
  ]

  return {
    passed: errors.length === 0,
    errors,
  }
}

export async function validationNode(state: GraphState): Promise<Partial<GraphState>> {
  return { validation: validateDraft(state) }
}
