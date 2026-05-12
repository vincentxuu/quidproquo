import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createModel } from '../../rag/model'

const RESEARCH_BRIEF_SYSTEM_PROMPT = `You are a senior editor in a multilingual technical newsletter team.
Return JSON only. No markdown fences.
Your output must help a writer move from topic to evidence-based article draft.
Do not fabricate facts that are not in common, stable knowledge.

{
  "keyQuestions": ["3-8 concrete questions to answer"],
  "claimHypotheses": ["key possible claims", "each should be narrow and testable"],
  "sourcesToCheck": ["1-6 high-value source families to verify, as categories"],
  "outline": ["ordered section outline for the draft"],
  "manualChecks": [
    "human checks needed before drafting",
  ],
  "risks": ["potential inaccuracies/ambiguities to flag"]
}
`

interface ResearchBriefInput {
  topic: string
  language?: string
  researchDepth?: 'quick' | 'standard' | 'deep'
  includeExternalSources?: boolean
}

interface DraftContext {
  date: string
  language: string
  category: string
  slug: string
}

export interface ResearchBriefResult {
  topic: string
  language: string
  researchDepth: 'quick' | 'standard' | 'deep'
  generatedAt: string
  keyQuestions: string[]
  claimHypotheses: string[]
  sourcesToCheck: string[]
  outline: string[]
  manualChecks: string[]
  risks: string[]
  requiresHumanInput: boolean
  model: string
  modelUsage: string[]
}

export interface ResearchBriefDraftResult {
  markdown: string
  title: string
  slug: string
  date: string
  category: string
}

const RESEARCH_BUDGET: Record<NonNullable<ResearchBriefInput['researchDepth']>, number> = {
  quick: 1800,
  standard: 2600,
  deep: 3600,
}

export async function runResearchBrief(
  input: ResearchBriefInput,
  options: { onExternalCall?: () => void } = {},
): Promise<ResearchBriefResult> {
  const topic = normalizeText(input.topic)
  const language = normalizeText(input.language) || 'zh-TW'
  const researchDepth = input.researchDepth ?? 'standard'
  const includeExternalSources = input.includeExternalSources !== false

  const scopeInstruction = includeExternalSources
    ? 'Source suggestions can include public official sources, docs, RFCs, changelogs, and benchmark pages.'
    : 'Do not propose internet source names as hard evidence; provide verification checkpoints and internal source classes only.'

  const run = await runModel(
    'research_brief',
    RESEARCH_BRIEF_SYSTEM_PROMPT,
    `Topic: ${topic}
Language: ${language}
Depth: ${researchDepth}
${scopeInstruction}

Return a JSON object in strict format.`,
    options.onExternalCall,
    RESEARCH_BUDGET[researchDepth],
  )

  const parsed = parseResearchBrief(run.text)
  const model = run.model || 'unknown'

  const keyQuestions = normalizeStringList(parsed?.keyQuestions)
  const claimHypotheses = normalizeStringList(parsed?.claimHypotheses)
  const sourcesToCheck = normalizeStringList(parsed?.sourcesToCheck)
  const outline = normalizeStringList(parsed?.outline)
  const manualChecks = normalizeStringList(parsed?.manualChecks)
  const risks = normalizeStringList(parsed?.risks)
  const safeSources = includeExternalSources ? sourcesToCheck : filterSourcesForInternalUse(sourcesToCheck)
  const safeManualChecks = [...manualChecks]
  if (!includeExternalSources) {
    safeManualChecks.push('External source lookup was disabled; author must verify all facts against reliable references before draft.')
  }

  return {
    topic,
    language,
    researchDepth,
    generatedAt: new Date().toISOString(),
    keyQuestions,
    claimHypotheses,
    sourcesToCheck: safeSources,
    outline,
    manualChecks: safeManualChecks,
    risks,
    requiresHumanInput: safeManualChecks.length > 0 || risks.length > 0 || keyQuestions.length === 0,
    model,
    modelUsage: [model],
  }
}

export function buildResearchDraftSlug(topic: string, generatedAt: string): string {
  const datePrefix = generatedAt.slice(0, 10)
  const safeTopic = slugify(topic)
  return `ai/${datePrefix}-research-${safeTopic || 'topic'}`
}

export function buildResearchBriefDraft(result: ResearchBriefResult, context: DraftContext): ResearchBriefDraftResult {
  const outline = dedupeList(result.outline)
  const keys = dedupeList(result.keyQuestions)
  const claims = dedupeList(result.claimHypotheses)
  const checks = dedupeList([...result.manualChecks, ...result.risks.map((item) => `風險驗證：${item}`)])
  const references = dedupeList(result.sourcesToCheck).slice(0, 6)

  const referenceItems = references.length
    ? references.map((source) => `- [${source}](${buildSearchUrl(context, source)})`)
    : ['- [Cloudflare 文檔](https://developers.cloudflare.com/)']

  const markdown = [
    '---',
    `title: "${escapeYamlString(formatTitle(result.topic))}"`,
    `date: ${context.date}`,
    `category: "${context.category}"`,
    `tags: ["${[
      'research',
      'brief',
      'ai',
      slugify(context.language),
    ].filter(Boolean).join('\", \"')}"]`,
    `lang: ${context.language}`,
    'description: "研究主題預備稿，先保留可執行的研究問題、主張與人工作業清單。"',
    `tldr: "${escapeYamlString(`對 ${formatTitle(result.topic)} 進行結構化研究、主張核對與可引用查證佈局。`) }"`,
    'draft: true',
    '---',
    '',
    '## 情境',
    `主題：${formatTitle(result.topic)}`,
    `研究深度：${result.researchDepth}`,
    `建立時間：${context.date}`,
    `語言：${context.language}`,
    '',
    '## 研究問題',
    ...toList(keys, '待補研究問題'),
    '',
    '## 可驗證主張',
    ...toList(claims, '待補主張'),
    '',
    '## 草稿大綱',
    ...outline.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## 人工補充清單',
    ...checks.map((item) => `- [ ] ${item}`),
    '',
    '## 參考資料',
    ...referenceItems,
    '',
    '## 人工驗證區',
    '- [ ] 將每個研究問題對應到來源並補齊逐字引用。',
    '- [ ] 每個主張都要加上事實來源與反例觀察。',
    '- [ ] 確認術語、數字與專有名詞定義一致。',
  ].join('\n')

  return {
    markdown,
    title: formatTitle(result.topic),
    slug: context.slug,
    date: context.date,
    category: context.category,
  }
}

function filterSourcesForInternalUse(sources: string[]): string[] {
  const normalized = sources.length > 0 ? sources : ['官方產品文件與變更記錄', '版本說明與變更歷史', '內部既有文章脈絡比對']
  return normalized.slice(0, 6).map((item) => {
    const trimmed = String(item ?? '').trim()
    if (!trimmed) return '待補驗證來源'
    if (trimmed.length <= 5) return `待補類型: ${trimmed}`
    return trimmed
  })
}

async function runModel(
  stage: string,
  systemPrompt: string,
  userPrompt: string,
  onExternalCall?: () => void,
  maxTokens = 2400,
): Promise<{ text: string; model: string }> {
  onExternalCall?.()
  const model = createModel(maxTokens, { stage })
  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ])
  const text = extractModelText(response.content)
  if (!text.trim()) {
    throw new Error(`${stage} stage produced empty output`)
  }
  return { text, model: stage }
}

function parseResearchBrief(raw: string): Record<string, unknown> | null {
  const normalized = raw.trim()
  if (!normalized) return null

  if (!normalized.startsWith('{')) return null
  try {
    const parsed = JSON.parse(normalized)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    const start = normalized.indexOf('{')
    const end = normalized.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        const fenced = normalized.slice(start, end + 1)
        const parsed = JSON.parse(fenced)
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
      } catch {
        return null
      }
    }
    return null
  }
}

function toList(items: string[], fallback: string): string[] {
  if (!items.length) return [`- ${fallback}`]
  return items.map((item) => `- ${item}`)
}

function buildSearchUrl(context: { slug: string; language: string }, source: string): string {
  const query = `${context.slug.replace(/-/g, ' ')} ${source}`
  const encoded = encodeURIComponent(query)
  const engine = context.language === 'en' ? 'duckduckgo.com/?q=' : 'duckduckgo.com/?q='
  return `https://${engine}${encoded}`
}

function dedupeList(items: string[]): string[] {
  const result: string[] = []
  const seen = new Set<string>()

  for (const item of items) {
    const value = normalizeText(item)
    if (!value || seen.has(value)) continue
    seen.add(value)
    result.push(value)
  }

  return result
}

function formatTitle(value: string): string {
  return value || '研究主題草稿'
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

function escapeYamlString(value: string): string {
  return String(value).replace(/"/g, '\\"')
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item == null) return ''
        return String(item).trim()
      })
      .filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split('\n')
      .map((line) => line.trim().replace(/^-|\*/g, '').trim())
      .filter(Boolean)
  }

  return []
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function extractModelText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part
        if (typeof (part as { text?: unknown }).text === 'string') return String((part as { text?: unknown }).text)
        if (part && typeof part === 'object' && 'text' in part) return String((part as { text?: unknown }).text ?? '')
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  if (content && typeof content === 'object' && 'content' in content) return String((content as { content?: unknown }).content ?? '')
  return ''
}
