import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { parseMarkdownFrontmatter, serializeYamlLikeArray, type ParsedFrontmatter } from '../content-utils'
import { createModel } from '../../rag/model'
import { CULTURAL_REVIEW_PROMPT, TRANSLATION_SYSTEM_PROMPT } from '../translators'
import type { CloudPost } from './content-posts'

const NATIVE_CHECKER_PROMPT = `You are the Native Checker in a 3-stage technical blog localization pipeline.

Return JSON only, no markdown:
{
  "status": "approve" | "request_changes",
  "issues": [
    {
      "location": "section or line reference",
      "issue": "description",
      "suggestion": "how to fix"
    }
  ],
  "qa_notes": "short QA notes",
  "ready_to_publish": true
}`

type ModelText = string

export interface TranslationReviewIssue {
  location: string
  issue: string
  suggestion: string
}

export interface TranslationReviewResult {
  stage: 'cultural-review' | 'native-check'
  status: 'approve' | 'request_changes' | 'needs_human_input'
  summary: string
  issues: TranslationReviewIssue[]
  output: string
  model: string
}

export interface TranslationDraftResult {
  sourceSlug: string
  draftMarkdown: string
  reviews: TranslationReviewResult[]
  model: string
  modelUsage: string[]
}

export interface ModelRunResult {
  text: ModelText
  model: string
}

type ReviewStage = 'translate' | 'cultural-review' | 'native-check'

const REVIEW_TOKEN_BUDGET: Record<ReviewStage, number> = {
  translate: 3800,
  'cultural-review': 2200,
  'native-check': 2200,
}

export async function runTranslationDraft(
  sourcePost: CloudPost,
  options: { onExternalCall?: () => void } = {},
): Promise<TranslationDraftResult> {
  const sourceParsed = parseMarkdownFrontmatter(sourcePost.content)
  const sourcePreview = sourceParsed.hasFrontmatter ? sourceParsed.body : sourcePost.content
  const translationPrompt = [
    'Translate the following Traditional Chinese markdown post to English.',
    'Return only the translated markdown, do not add extra commentary.',
    'Keep frontmatter structure and keep code blocks, commands, URLs, model/API names, and version strings unchanged.',
    `Source slug: ${sourcePost.slug}`,
    `Source category: ${sourcePost.category}`,
    '',
    'Source content:',
    sourcePreview.trim(),
  ].join('\n')

  const translationRun = await runModel('translate', TRANSLATION_SYSTEM_PROMPT, translationPrompt, options.onExternalCall)
  const translationOutput = pickMarkdownCandidate(translationRun.text)
  const translationDraft = ensureDraftMetadata(translationOutput, sourceParsed, sourcePost)

  const culturalReview = await runReviewStage(
    {
      stage: 'cultural-review',
      systemPrompt: CULTURAL_REVIEW_PROMPT,
      input: buildReviewInput('cultural-review', translationDraft, sourcePost),
      onExternalCall: options.onExternalCall,
    },
  )

  const culturalDraft = ensureDraftMetadata(
    pickMarkdownCandidate(culturalReview.output, translationDraft),
    sourceParsed,
    sourcePost,
  )

  const nativeReview = await runReviewStage({
    stage: 'native-check',
    systemPrompt: NATIVE_CHECKER_PROMPT,
    input: buildReviewInput('native-check', culturalDraft, sourcePost),
    onExternalCall: options.onExternalCall,
  })

  const finalDraft = ensureDraftMetadata(
    pickMarkdownCandidate(nativeReview.output, culturalDraft),
    sourceParsed,
    sourcePost,
  )

  return {
    sourceSlug: sourcePost.slug,
    draftMarkdown: finalDraft,
    reviews: [culturalReview, nativeReview],
    model: nativeReview.model || culturalReview.model || translationRun.model,
    modelUsage: [translationRun.model, culturalReview.model, nativeReview.model],
  }
}

async function runReviewStage(args: {
  stage: 'cultural-review' | 'native-check'
  systemPrompt: string
  input: string
  onExternalCall?: () => void
}): Promise<TranslationReviewResult> {
  const stage = args.stage
  const modelResult = await runModel(stage, args.systemPrompt, args.input, args.onExternalCall)
  const parsed = parseJsonOutput(modelResult.text)
  const status = inferReviewStatus(parsed?.status, modelResult.text)

  const issues = parseReviewIssues(parsed)
  const summary = parseSummary(parsed, modelResult.text)

  return {
    stage,
    status,
    summary,
    issues,
    output: modelResult.text,
    model: modelResult.model,
  }
}

async function runModel(stage: ReviewStage, systemPrompt: string, userPrompt: string, onExternalCall?: () => void): Promise<ModelRunResult> {
  onExternalCall?.()
  const model = createModel(REVIEW_TOKEN_BUDGET[stage], { stage })
  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ])
  const text = modelTextFromContent(response.content)
  if (!text.trim()) {
    throw new Error(`${stage} stage produced empty output`)
  }

  return { text, model: stage }
}

function parseJsonOutput(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed.startsWith('{')) return null
  try {
    const parsed = JSON.parse(trimmed)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    const firstBrace = trimmed.indexOf('{')
    const lastBrace = trimmed.lastIndexOf('}')
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        const fenced = trimmed.slice(firstBrace, lastBrace + 1)
        const parsed = JSON.parse(fenced)
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
      } catch {
        return null
      }
    }
  }
  return null
}

function parseSummary(parsed: Record<string, unknown> | null, raw: string): string {
  if (!parsed) {
    return extractSection(raw, ['overall notes', 'qa notes', 'ready to publish'])?.slice(0, 220) ?? ''
  }

  const rawSummary =
    extractText(parsed.overall_notes)
    || extractText(parsed.qa_notes)
    || extractText(parsed.summary)
  return rawSummary.slice(0, 260)
}

function parseReviewIssues(parsed: Record<string, unknown> | null): TranslationReviewIssue[] {
  const rawIssues = parsed?.issues
  if (Array.isArray(rawIssues)) {
    return rawIssues.map((entry) => {
      if (!entry || typeof entry !== 'object') return null
      const rec = entry as Record<string, unknown>
      return {
        location: extractText(rec.location) || 'Unknown',
        issue: extractText(rec.issue),
        suggestion: extractText(rec.suggestion),
      }
    }).filter((issue): issue is TranslationReviewIssue => issue !== null)
  }

  const fallback = extractSection(
    JSON.stringify(parsed ?? ''),
    ['remaining risks', 'changes made', 'qa notes', 'remaining-risks'],
  )
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-') || line.startsWith('*'))
    .map((line) => {
      const normalized = line.replace(/^[-*]\s*/, '')
      return {
        location: 'Draft',
        issue: normalized,
        suggestion: '',
      }
    })

  return fallback
}

function inferReviewStatus(rawStatus: unknown, rawText: string): 'approve' | 'request_changes' | 'needs_human_input' {
  const statusText = extractText(rawStatus)
  const normalized = statusText.toLowerCase().trim()
  if (normalized === 'approve') return 'approve'
  if (normalized === 'needs_human_input' || normalized === 'needs human input') return 'needs_human_input'
  if (normalized === 'request_changes' || normalized === 'request changes') return 'request_changes'

  const markers = rawText.toLowerCase()
  if (/request_changes|request changes|needs_human_input|needs human input|needs_human_check/i.test(markers)) return 'request_changes'
  if (/approve/i.test(markers)) return 'approve'
  return 'request_changes'
}

function modelTextFromContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => extractText(part))
      .filter(Boolean)
      .join('\n')
  }
  if (content && typeof content === 'object' && 'content' in content) {
    return extractText((content as { content?: unknown }).content)
  }
  return ''
}

function pickMarkdownCandidate(raw: string, fallbackBody = ''): string {
  const draftedSection = extractSection(raw, [
    'draft translation',
    'revised draft',
    'final draft',
    'draft',
  ])
  if (draftedSection) return draftedSection

  const parsed = parseMarkdownFrontmatter(raw)
  if (parsed.hasFrontmatter && parsed.body.trim()) return raw

  const maybeYaml = raw.match(/^---[\s\S]*?---/m)
  if (maybeYaml && maybeYaml.index === 0 && raw.includes('\n')) return raw
  if (fallbackBody) return fallbackBody
  return raw
}

function ensureDraftMetadata(
  markdown: string,
  sourceParsed: ReturnType<typeof parseMarkdownFrontmatter>,
  sourcePost: CloudPost,
): string {
  const parsed = parseMarkdownFrontmatter(markdown)
  const sourceTags = Array.isArray(sourceParsed.frontmatter.tags) ? sourceParsed.frontmatter.tags : sourcePost.tags
  const title = normalizeText(parsed.frontmatter.title, sourceParsed.frontmatter.title, sourcePost.title)
  const description = normalizeText(
    parsed.frontmatter.description,
    sourceParsed.frontmatter.description,
    sourcePost.description,
  )
  const tldr = normalizeText(
    parsed.frontmatter.tldr,
    sourceParsed.frontmatter.tldr,
    sourcePost.tldr,
  )
  const tags = normalizeTags(parsed.frontmatter.tags, sourceTags)

  const nextFrontmatter: ParsedFrontmatter = {
    ...sourceParsed.frontmatter,
    ...parsed.frontmatter,
    title,
    description,
    tldr,
    tags,
    lang: 'en',
    draft: true,
  }

  const body = parsed.hasFrontmatter && parsed.body.trim() ? parsed.body : markdown
  return `---\n${serializeFrontmatter(nextFrontmatter)}\n---\n${body.trim()}\n`
}

function serializeFrontmatter(frontmatter: ParsedFrontmatter): string {
  const lines: string[] = []
  const keys = [
    'title',
    'date',
    'category',
    'tags',
    'lang',
    'description',
    'tldr',
    'draft',
  ]
  const consumed = new Set<string>()

  for (const key of keys) {
    const value = frontmatter[key]
    if (value !== undefined) {
      lines.push(`${key}: ${formatFrontmatterValue(value)}`)
      consumed.add(key)
    }
  }

  for (const [key, value] of Object.entries(frontmatter)) {
    if (consumed.has(key)) continue
    if (value === undefined) continue
    lines.push(`${key}: ${formatFrontmatterValue(value)}`)
  }

  return lines.join('\n')
}

function formatFrontmatterValue(value: unknown): string {
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  if (value === null) return 'null'
  if (Array.isArray(value)) return serializeYamlLikeArray(value.map((item) => String(item)))
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`}

function normalizeText(...candidates: Array<unknown>): string {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate.trim()
  }
  return ''
}

function normalizeTags(primary: unknown, fallback: unknown): string[] {
  if (Array.isArray(primary)) return primary.map(String).filter(Boolean)
  if (typeof primary === 'string' && primary.trim()) {
    const trimmed = primary.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
    }
    return [trimmed]
  }
  return Array.isArray(fallback) ? fallback.map(String).filter(Boolean) : []
}

function extractSection(markdown: string, headings: string[]): string {
  const lines = markdown.split('\n')
  const normalizedHeadings = headings.map((heading) => heading.toLowerCase())
  const startLine = lines.findIndex((line) => {
    const match = line.match(/^\s*#{1,6}\s+(.*?)\s*$/)
    if (!match) return false
    const candidate = match[1].toLowerCase()
    return normalizedHeadings.some((heading) => candidate.startsWith(heading))
  })

  if (startLine < 0) return ''

  const body = []
  for (let index = startLine + 1; index < lines.length; index += 1) {
    if (index > startLine + 1 && lines[index].match(/^\s*#{1,6}\s+/)) break
    body.push(lines[index])
  }

  return body.join('\n').trim()
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function buildReviewInput(
  stage: 'cultural-review' | 'native-check',
  draftMarkdown: string,
  sourcePost: CloudPost,
): string {
  if (stage === 'native-check') {
    return `Review this English draft for native fluency and publish-readiness.\n\nSource: ${sourcePost.slug}\n\n${draftMarkdown}`
  }

  return `Review this English translation for tone and readability.\n\nSource: ${sourcePost.slug}\n\n${draftMarkdown}`
}
