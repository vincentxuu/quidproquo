import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createModel } from '../../rag/model'

const ARXIV_READING_SYSTEM_PROMPT = `You are a senior researcher who reads arXiv papers using S. Keshav's three-pass method.
Return JSON only. No markdown fences.
Do not fabricate findings, numbers, or citations that are not supported by the provided paper reference or abstract.
If the abstract is missing or you are unsure, say so in the relevant field instead of inventing content.

Three-pass method:
- First pass (5-10 min skim): decide whether the paper is worth reading via the "five Cs".
- Second pass (~1 hour): grasp the content (core idea, method, key results, assumptions) without every detail.
- Third pass (deep): challenge every assumption and consider how you would re-implement the work.

{
  "firstPass": {
    "category": "what kind of paper (measurement / analysis / prototype / survey / theory ...)",
    "context": "which problems or prior work it relates to",
    "correctness": "do the assumptions appear valid (or unknown)",
    "contributions": ["1-4 main contributions"],
    "clarity": "is it well written / readable",
    "verdict": "read | maybe | skip",
    "verdictReason": "one sentence why"
  },
  "secondPass": {
    "coreIdea": "1-2 sentence plain-language summary",
    "method": "how they do it",
    "keyResults": ["notable results, with numbers if available"],
    "assumptions": ["assumptions the work relies on"],
    "canExplainToFriend": "what you would tell a colleague in one breath"
  },
  "thirdPass": {
    "challengedAssumptions": ["assumptions worth challenging"],
    "reproducibility": "what it would take to re-implement / reproduce",
    "strengths": ["genuine strengths"],
    "weaknesses": ["hidden failings, gaps, or limits"],
    "futureIdeas": ["follow-up directions"]
  },
  "openQuestions": ["unresolved questions a reader should keep in mind"],
  "relatedWorkToRead": ["follow-up papers / topics worth reading next, as descriptions"]
}

Only fill "secondPass" when depth is "second" or "third".
Only fill "thirdPass" when depth is "third".
For shallower depths, return the deeper objects as empty objects/arrays.
`

export type ArxivPassDepth = 'first' | 'second' | 'third'

interface ArxivReadingInput {
  paperRef: string
  abstract?: string
  language?: string
  passDepth?: ArxivPassDepth
}

interface DraftContext {
  date: string
  language: string
  category: string
  slug: string
}

export interface ArxivFirstPass {
  category: string
  context: string
  correctness: string
  contributions: string[]
  clarity: string
  verdict: string
  verdictReason: string
}

export interface ArxivSecondPass {
  coreIdea: string
  method: string
  keyResults: string[]
  assumptions: string[]
  canExplainToFriend: string
}

export interface ArxivThirdPass {
  challengedAssumptions: string[]
  reproducibility: string
  strengths: string[]
  weaknesses: string[]
  futureIdeas: string[]
}

export interface ArxivReadingResult {
  paperRef: string
  arxivId: string
  language: string
  passDepth: ArxivPassDepth
  hasAbstract: boolean
  generatedAt: string
  firstPass: ArxivFirstPass
  secondPass: ArxivSecondPass
  thirdPass: ArxivThirdPass
  openQuestions: string[]
  relatedWorkToRead: string[]
  requiresHumanInput: boolean
  model: string
  modelUsage: string[]
}

export interface ArxivReadingDraftResult {
  markdown: string
  title: string
  slug: string
  date: string
  category: string
}

const PASS_BUDGET: Record<ArxivPassDepth, number> = {
  first: 1600,
  second: 2600,
  third: 3600,
}

const PASS_ORDER: Record<ArxivPassDepth, number> = { first: 1, second: 2, third: 3 }

export async function runArxivReading(
  input: ArxivReadingInput,
  options: { onExternalCall?: () => void } = {},
): Promise<ArxivReadingResult> {
  const paperRef = normalizeText(input.paperRef)
  const abstract = normalizeText(input.abstract)
  const language = normalizeText(input.language) || 'zh-TW'
  const passDepth = normalizePassDepth(input.passDepth)
  const arxivId = extractArxivId(paperRef)

  const abstractBlock = abstract
    ? `Abstract / notes provided by the user:\n"""\n${abstract}\n"""`
    : 'No abstract was provided. Work only from the reference and common, stable knowledge; do not invent specific results.'

  const run = await runModel(
    'arxiv_reading',
    ARXIV_READING_SYSTEM_PROMPT,
    `Paper reference: ${paperRef}
${arxivId ? `arXiv ID: ${arxivId}` : ''}
Language for free-text fields: ${language}
Depth: ${passDepth}

${abstractBlock}

Return a JSON object in the strict format described above.`,
    options.onExternalCall,
    PASS_BUDGET[passDepth],
  )

  const parsed = parseJsonObject(run.text)
  const model = run.model || 'unknown'

  const firstPass = normalizeFirstPass(parsed?.firstPass)
  const wantsSecond = PASS_ORDER[passDepth] >= 2
  const wantsThird = PASS_ORDER[passDepth] >= 3
  const secondPass = wantsSecond ? normalizeSecondPass(parsed?.secondPass) : emptySecondPass()
  const thirdPass = wantsThird ? normalizeThirdPass(parsed?.thirdPass) : emptyThirdPass()
  const openQuestions = normalizeStringList(parsed?.openQuestions)
  const relatedWorkToRead = normalizeStringList(parsed?.relatedWorkToRead)

  const requiresHumanInput =
    !abstract ||
    firstPass.contributions.length === 0 ||
    firstPass.verdict.toLowerCase() === 'maybe' ||
    openQuestions.length > 0

  return {
    paperRef,
    arxivId,
    language,
    passDepth,
    hasAbstract: Boolean(abstract),
    generatedAt: new Date().toISOString(),
    firstPass,
    secondPass,
    thirdPass,
    openQuestions,
    relatedWorkToRead,
    requiresHumanInput,
    model,
    modelUsage: [model],
  }
}

export function buildArxivReadingSlug(paperRef: string, arxivId: string, generatedAt: string): string {
  const datePrefix = generatedAt.slice(0, 10)
  const ref = arxivId || slugify(paperRef)
  return `ai/${datePrefix}-paper-${slugify(ref) || 'arxiv'}`
}

export function buildArxivReadingDraft(result: ArxivReadingResult, context: DraftContext): ArxivReadingDraftResult {
  const title = formatTitle(result.paperRef, result.arxivId)
  const wantsSecond = PASS_ORDER[result.passDepth] >= 2
  const wantsThird = PASS_ORDER[result.passDepth] >= 3
  const paperUrl = result.arxivId ? `https://arxiv.org/abs/${result.arxivId}` : ''

  const lines: string[] = [
    '---',
    `title: "${escapeYamlString(title)}"`,
    `date: ${context.date}`,
    `category: "${context.category}"`,
    `tags: ["${['arxiv', 'paper-reading', 'literature-review', slugify(context.language)].filter(Boolean).join('", "')}"]`,
    `lang: ${context.language}`,
    'description: "三遍閱讀法產生的論文閱讀預備稿，先保留結構化筆記與人工核對清單。"',
    `tldr: "${escapeYamlString(`對「${title}」做三遍式閱讀整理：第一遍取捨、第二遍理解、第三遍批判。`)}"`,
    'draft: true',
    '---',
    '',
    '## 來源',
    `論文：${title}`,
    paperUrl ? `連結：${paperUrl}` : '連結：（未提供 arXiv 連結，請補上）',
    `閱讀深度：${result.passDepth}`,
    `語言：${context.language}`,
    result.hasAbstract ? '（已根據提供的摘要整理）' : '（未提供摘要，內容偏保守，請務必對照原文）',
    '',
    '## 第一遍：取捨（5-10 分鐘）',
    `- 類型：${fallback(result.firstPass.category)}`,
    `- 脈絡：${fallback(result.firstPass.context)}`,
    `- 正確性：${fallback(result.firstPass.correctness)}`,
    `- 清晰度：${fallback(result.firstPass.clarity)}`,
    `- 判定：**${fallback(result.firstPass.verdict)}** — ${fallback(result.firstPass.verdictReason)}`,
    '',
    '### 主要貢獻',
    ...toList(result.firstPass.contributions, '待補貢獻'),
  ]

  if (wantsSecond) {
    lines.push(
      '',
      '## 第二遍：理解（約 1 小時）',
      `- 核心想法：${fallback(result.secondPass.coreIdea)}`,
      `- 方法：${fallback(result.secondPass.method)}`,
      `- 一句話解釋給同事：${fallback(result.secondPass.canExplainToFriend)}`,
      '',
      '### 關鍵結果',
      ...toList(result.secondPass.keyResults, '待補關鍵結果（含數字）'),
      '',
      '### 依賴的假設',
      ...toList(result.secondPass.assumptions, '待補假設'),
    )
  }

  if (wantsThird) {
    lines.push(
      '',
      '## 第三遍：批判與重現',
      `- 重現難度：${fallback(result.thirdPass.reproducibility)}`,
      '',
      '### 可挑戰的假設',
      ...toList(result.thirdPass.challengedAssumptions, '待補可挑戰假設'),
      '',
      '### 優點',
      ...toList(result.thirdPass.strengths, '待補優點'),
      '',
      '### 弱點 / 隱藏問題',
      ...toList(result.thirdPass.weaknesses, '待補弱點'),
      '',
      '### 後續想法',
      ...toList(result.thirdPass.futureIdeas, '待補後續想法'),
    )
  }

  lines.push(
    '',
    '## 待解問題',
    ...toList(result.openQuestions, '無（或待補）'),
    '',
    '## 接著該讀',
    ...toList(result.relatedWorkToRead, '待補延伸閱讀'),
    '',
    '## 人工驗證區',
    '- [ ] 對照原文確認每個貢獻與數字無誤（AI 可能幻覺）。',
    '- [ ] 補上 arXiv 連結與正式引用。',
    '- [ ] 關鍵結果逐一核對圖表與實驗設定。',
    '',
    '## 參考資料',
    paperUrl ? `- [${escapeMarkdown(title)}](${paperUrl})` : '- [arXiv](https://arxiv.org/)',
  )

  return {
    markdown: lines.join('\n'),
    title,
    slug: context.slug,
    date: context.date,
    category: context.category,
  }
}

function extractArxivId(ref: string): string {
  const trimmed = ref.trim()
  const fromUrl = trimmed.match(/arxiv\.org\/(?:abs|pdf|html)\/([0-9]{4}\.[0-9]{4,5})(v[0-9]+)?/i)
  if (fromUrl) return `${fromUrl[1]}${fromUrl[2] ?? ''}`
  const bare = trimmed.match(/^([0-9]{4}\.[0-9]{4,5})(v[0-9]+)?$/)
  if (bare) return `${bare[1]}${bare[2] ?? ''}`
  const legacy = trimmed.match(/(?:arxiv:)?([a-z-]+(?:\.[A-Z]{2})?\/[0-9]{7})(v[0-9]+)?/i)
  if (legacy) return `${legacy[1]}${legacy[2] ?? ''}`
  return ''
}

async function runModel(
  stage: string,
  systemPrompt: string,
  userPrompt: string,
  onExternalCall?: () => void,
  maxTokens = 2600,
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

function normalizePassDepth(value: unknown): ArxivPassDepth {
  const text = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (text === 'first' || text === 'second' || text === 'third') return text
  return 'second'
}

function normalizeFirstPass(value: unknown): ArxivFirstPass {
  const obj = asObject(value)
  return {
    category: normalizeText(obj.category),
    context: normalizeText(obj.context),
    correctness: normalizeText(obj.correctness),
    contributions: normalizeStringList(obj.contributions),
    clarity: normalizeText(obj.clarity),
    verdict: normalizeText(obj.verdict) || 'maybe',
    verdictReason: normalizeText(obj.verdictReason),
  }
}

function normalizeSecondPass(value: unknown): ArxivSecondPass {
  const obj = asObject(value)
  return {
    coreIdea: normalizeText(obj.coreIdea),
    method: normalizeText(obj.method),
    keyResults: normalizeStringList(obj.keyResults),
    assumptions: normalizeStringList(obj.assumptions),
    canExplainToFriend: normalizeText(obj.canExplainToFriend),
  }
}

function normalizeThirdPass(value: unknown): ArxivThirdPass {
  const obj = asObject(value)
  return {
    challengedAssumptions: normalizeStringList(obj.challengedAssumptions),
    reproducibility: normalizeText(obj.reproducibility),
    strengths: normalizeStringList(obj.strengths),
    weaknesses: normalizeStringList(obj.weaknesses),
    futureIdeas: normalizeStringList(obj.futureIdeas),
  }
}

function emptySecondPass(): ArxivSecondPass {
  return { coreIdea: '', method: '', keyResults: [], assumptions: [], canExplainToFriend: '' }
}

function emptyThirdPass(): ArxivThirdPass {
  return { challengedAssumptions: [], reproducibility: '', strengths: [], weaknesses: [], futureIdeas: [] }
}

function parseJsonObject(raw: string): Record<string, unknown> | null {
  const normalized = raw.trim()
  if (!normalized) return null
  try {
    const parsed = JSON.parse(normalized)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    const start = normalized.indexOf('{')
    const end = normalized.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        const parsed = JSON.parse(normalized.slice(start, end + 1))
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
      } catch {
        return null
      }
    }
    return null
  }
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function toList(items: string[], fallbackText: string): string[] {
  if (!items.length) return [`- ${fallbackText}`]
  return items.map((item) => `- ${item}`)
}

function fallback(value: string): string {
  return value || '待補'
}

function formatTitle(paperRef: string, arxivId: string): string {
  const ref = paperRef.trim()
  if (ref && !/^https?:\/\//i.test(ref) && !/^[0-9]{4}\.[0-9]{4,5}/.test(ref)) return ref
  if (arxivId) return `arXiv:${arxivId}`
  return ref || 'arXiv 論文'
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s_.]+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

function escapeYamlString(value: string): string {
  return String(value).replace(/"/g, '\\"')
}

function escapeMarkdown(value: string): string {
  return String(value).replace(/([[\]])/g, '\\$1')
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => (item == null ? '' : String(item).trim())).filter(Boolean)
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split('\n')
      .map((line) => line.trim().replace(/^[-*]\s*/, '').trim())
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
        if (part && typeof part === 'object' && 'text' in part) return String((part as { text?: unknown }).text ?? '')
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  if (content && typeof content === 'object' && 'content' in content) return String((content as { content?: unknown }).content ?? '')
  return ''
}
