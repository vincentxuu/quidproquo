export type FrontmatterValue = string | number | boolean | string[] | null

export interface ParsedFrontmatter {
  [key: string]: FrontmatterValue
}

export interface ParsedMarkdown {
  frontmatter: ParsedFrontmatter
  body: string
  hasFrontmatter: boolean
}

const FRONTMATTER_BOUNDARY = /^---\r?\n([\s\S]*?)\r?\n---/m

function stripQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith('\'') && trimmed.endsWith('\''))
  ) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

function parseArray(raw: string): string[] {
  const normalized = raw.trim()
  if (normalized.length < 2 || normalized[0] !== '[' || normalized[normalized.length - 1] !== ']') {
    return []
  }

  const inner = normalized.slice(1, -1).trim()
  if (!inner) return []

  return inner
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter((item) => item.length > 0)
}

function parseValue(raw: string): FrontmatterValue {
  const trimmed = raw.trim()

  if (!trimmed) return ''
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true'
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return parseArray(trimmed)
  }

  return stripQuotes(trimmed)
}

function parseFrontmatterBlock(markdown: string): ParsedFrontmatter {
  const lines = markdown.split('\n')
  const values: ParsedFrontmatter = {}

  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z0-9._-]+)\s*:\s*(.*?)\s*$/)
    if (!match) continue

    const [, key, rawValue] = match
    if (!key) continue

    values[key] = parseValue(rawValue)
  }

  return values
}

export function parseMarkdownFrontmatter(markdown: string): ParsedMarkdown {
  const match = markdown.match(FRONTMATTER_BOUNDARY)
  if (!match) {
    return {
      frontmatter: {},
      body: markdown,
      hasFrontmatter: false,
    }
  }

  const frontmatter = parseFrontmatterBlock(match[1] ?? '')
  const body = markdown.slice((match[0] ?? '').length)

  return {
    frontmatter,
    body,
    hasFrontmatter: true,
  }
}

export function parseDraftFromContent(content: string): boolean | undefined {
  const parsed = parseMarkdownFrontmatter(content)
  const draft = parsed.frontmatter.draft

  if (typeof draft === 'boolean') return draft
  if (typeof draft === 'string') {
    const normalized = draft.toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }

  return undefined
}

export function parseFrontendDateFromContent(content: string): string | undefined {
  const parsed = parseMarkdownFrontmatter(content).frontmatter
  const candidate = parsed.date

  if (typeof candidate === 'string' && candidate.length >= 10) return candidate.slice(0, 10)
  return undefined
}

export function parseTagsFromContent(content: string): string[] {
  const parsed = parseMarkdownFrontmatter(content).frontmatter
  const tags = parsed.tags

  if (Array.isArray(tags)) return tags.map((tag) => String(tag))
  if (typeof tags === 'string') return parseArray(tags)

  return []
}

export function stripMarkdownFrontmatter(markdown: string): string {
  const parsed = parseMarkdownFrontmatter(markdown)
  return parsed.body
}

export function toFrontmatterText(markdown: string): string {
  const parsed = parseMarkdownFrontmatter(markdown)
  if (!parsed.hasFrontmatter) return '{}'
  return JSON.stringify(parsed.frontmatter, null, 2)
}

export function serializeYamlLikeArray(values: string[]): string {
  const normalized = values.map((value) => `"${value}"`).join(', ')
  return `[${normalized}]`
}
