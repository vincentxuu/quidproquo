interface YouTubeBriefInput {
  videoUrl: string
  language?: string
  includeTranscript?: boolean
}

interface DraftContext {
  date: string
  language: string
  category: string
  slug: string
}

export interface YouTubeBriefResult {
  source: {
    url: string
    videoId: string | null
  }
  language: string
  generatedAt: string
  sourceTitle: string | null
  sourceAuthor: string | null
  sourceProvider: string | null
  transcript: {
    hasTranscript: boolean
    language: string | null
    preview: string
    source: 'youtube_timedtext' | 'none'
  }
  keySections: string[]
  templateHeadings: string[]
  evidenceGaps: string[]
  actionItems: string[]
  retrievalSource: 'oembed' | 'url-only'
  requiresHumanInput: boolean
}

export interface YouTubeBriefDraftResult {
  markdown: string
  title: string
  slug: string
  date: string
  category: string
}

interface YouTubeOembedResponse {
  title?: string
  author_name?: string
  provider_name?: string
}

export async function runYouTubeBrief(
  input: YouTubeBriefInput,
  options: { onExternalCall?: () => void } = {},
): Promise<YouTubeBriefResult> {
  const sourceUrl = normalizeText(input.videoUrl)
  const language = normalizeText(input.language) || 'zh-TW'
  const videoId = extractYouTubeId(sourceUrl)
  const metadata = await fetchYouTubeMeta(sourceUrl, options.onExternalCall)
  const wantTranscript = input.includeTranscript !== false
  const transcript = wantTranscript && videoId
    ? await fetchYouTubeTranscript(videoId, language, options.onExternalCall)
    : { hasTranscript: false, language: null, preview: '', source: 'none' as const }

  const evidenceGaps = [
    transcript.hasTranscript
      ? '已抓到 public transcript，請核對重點對齊與精準主張邏輯'
      : '尚未抓取逐字稿；請先補齊影片重點摘要與段落時間軸',
    '未核對引用內容，發佈前需逐句對照逐字稿',
    metadata
      ? '已抓到 oEmbed metadata，但仍需人工確認標題、論點次序與證據來源'
      : '建議補齊影片名稱、講者、主張背景再定稿',
    '需補上與個人觀點對照的反思與局限性討論',
  ].filter(Boolean)

  return {
    source: {
      url: sourceUrl,
      videoId,
    },
    language,
    generatedAt: new Date().toISOString(),
    sourceTitle: typeof metadata?.title === 'string' && metadata.title.trim() ? metadata.title.trim() : null,
    sourceAuthor: typeof metadata?.author_name === 'string' && metadata.author_name.trim() ? metadata.author_name.trim() : null,
    sourceProvider: typeof metadata?.provider_name === 'string' && metadata.provider_name.trim() ? metadata.provider_name.trim() : null,
    transcript: {
      hasTranscript: transcript.hasTranscript,
      language: transcript.language,
      preview: transcript.preview,
      source: transcript.source,
    },
    keySections: [
      '引言：影片主軸、出發問題、與個人觀點接點',
      '論點一：可驗證觀察或框架',
      '論點二：反例、限制、替代觀點',
      '論點三：與近期實務案例對照',
      '結語：結論、下一步行動',
    ],
    templateHeadings: [
      '## ✳️ 文章標題',
      '## ✳️ 觀察：為什麼值得關注',
      '## ✳️ 重點論點',
      '## ✳️ 實務啟示',
      '## ✳️ 延伸閱讀',
      '## ✳️ 後記',
    ],
    evidenceGaps,
    actionItems: [
      transcript.hasTranscript
        ? '用 transcript 版本對齊論點順序與每段主張，補齊時間軸證據'
        : `補齊影片 ${videoId ? `(${videoId})` : 'URL'} 的逐字稿關鍵段落`,
      `確認並補上題目、發佈日期、影片作者（目前值: ${metadata?.author_name ?? '未抓取到'})`,
      '補齊技術名詞縮寫與術語對齊（避免與既有文章混淆）',
      '新增 2~3 則延伸閱讀連結並補寫 personal note',
      '補齊結構：引言/論點/結語是否與全文節奏一致',
    ],
    retrievalSource: metadata ? 'oembed' : 'url-only',
    requiresHumanInput: true,
  }
}

export function buildYouTubeDraftSlug(videoUrl: string, generatedAt: string): string {
  const datePrefix = generatedAt.slice(0, 10)
  const videoId = extractYouTubeId(videoUrl)
  const source = videoId || videoUrl
  const safeSource = slugify(source)
  return `ai/${datePrefix}-youtube-${safeSource}`
}

export function buildYouTubeBriefDraft(result: YouTubeBriefResult, context: DraftContext): YouTubeBriefDraftResult {
  const headings = dedupeList(result.keySections)
  const checks = dedupeList(result.actionItems)
  const gaps = dedupeList(result.evidenceGaps)
  const sources = dedupeList([
    result.source.url,
    result.source.videoId ? `https://www.youtube.com/watch?v=${result.source.videoId}` : '',
    result.sourceAuthor ? `https://www.youtube.com/results?search_query=${encodeURIComponent(result.sourceAuthor)}` : '',
    result.retrievalSource === 'oembed' ? 'https://www.youtube.com/' : '',
  ])

  const markdown = [
    '---',
    `title: "${escapeYamlString(buildDraftTitle(result))}"`,
    `date: ${context.date}`,
    `category: "${context.category}"`,
    `tags: ["${[
      'youtube',
      'brief',
      'video',
      slugify(context.language),
    ].filter(Boolean).join('\", \"')}"]`,
    `lang: ${context.language}`,
    `description: "${escapeYamlString(`基於 ${result.source.url} 的 YouTube 草稿，保留人工補充與逐段驗證清單。`)}`,
    `tldr: "先完成影片主張拆解後再補齊引用與邏輯鏈接。"`,
    'draft: true',
    '---',
    '',
    '## 情境',
    `- 影片標題：${result.sourceTitle || '待抓取'}`,
    `- 影片網址：${result.source.url}`,
    `- 作者：${result.sourceAuthor || '未抓取'}`,
    `- 識別來源：${result.retrievalSource}`,
    '',
    '## 目錄',
    ...headings.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## 重點草稿',
    ...headings.map((heading) => `- ${heading}`),
    '',
    '## 人工補充清單',
    ...checks.map((item) => `- [ ] ${item}`),
    '',
    '## 證據缺口',
    ...gaps.map((item) => `- ${item}`),
    '',
    '## 參考資料',
    ...sources.map((source) => `- [${source}](${source})`),
    '',
    '## 下一步',
    '- [ ] 對每段主張補齊至少一個可追溯連結。',
    '- [ ] 對影片主要論點逐句對照原始內容做核對。',
    '- [ ] 加入可否證偽的反例觀點與個人結論。',
    '- [ ] 檢查引用格式與 internal link 是否符合站內規範。',
  ].join('\n')

  return {
    markdown,
    title: buildDraftTitle(result),
    slug: context.slug,
    date: context.date,
    category: context.category,
  }
}

async function fetchYouTubeMeta(url: string, onExternalCall?: () => void): Promise<YouTubeOembedResponse | null> {
  if (!url) return null
  onExternalCall?.()
  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const response = await fetch(endpoint)
    if (!response.ok) return null

    const payload = await response.json() as Record<string, unknown>
    if (!payload || typeof payload !== 'object') return null
    return {
      title: typeof payload.title === 'string' ? payload.title : undefined,
      author_name: typeof payload.author_name === 'string' ? payload.author_name : undefined,
      provider_name: typeof payload.provider_name === 'string' ? payload.provider_name : undefined,
    }
  } catch {
    return null
  }
}

interface YouTubeTrack {
  lang: string
  name?: string
}

async function fetchYouTubeTranscript(videoId: string, preferredLanguage: string, onExternalCall?: () => void): Promise<
  { hasTranscript: boolean; language: string | null; preview: string; source: 'youtube_timedtext' | 'none' }
> {
  if (!videoId) return { hasTranscript: false, language: null, preview: '', source: 'none' }

  const tracks = await fetchYouTubeTranscriptTracks(videoId, onExternalCall)
  if (!tracks.length) {
    return { hasTranscript: false, language: null, preview: '', source: 'none' }
  }

  const preferredCode = normalizeLangCode(preferredLanguage)
  const bestTrack = pickBestTrack(tracks, preferredCode) ?? tracks[0]
  const content = await fetchYouTubeTranscriptTrack(videoId, bestTrack.lang, onExternalCall)
  if (!content) {
    return { hasTranscript: false, language: null, preview: '', source: 'none' }
  }

  const preview = makeTranscriptPreview(content, 380)
  return {
    hasTranscript: true,
    language: bestTrack.lang,
    preview,
    source: 'youtube_timedtext',
  }
}

async function fetchYouTubeTranscriptTracks(videoId: string, onExternalCall?: () => void): Promise<YouTubeTrack[]> {
  const endpoint = `https://www.youtube.com/api/timedtext?type=list&v=${encodeURIComponent(videoId)}`
  onExternalCall?.()
  try {
    const response = await fetch(endpoint)
    if (!response.ok) return []
    const text = await response.text()
    const tracks: YouTubeTrack[] = []
    const trackMatcher = /<track([^>]*)>/g
    let match: RegExpExecArray | null

    while ((match = trackMatcher.exec(text)) !== null) {
      const raw = match[1] ?? ''
      const lang = extractAttribute(raw, 'lang_code') || extractAttribute(raw, 'lang')
      if (!lang) continue
      const name = extractAttribute(raw, 'name') ?? undefined
      tracks.push({ lang: lang.toLowerCase(), name })
    }

    return tracks
  } catch {
    return []
  }
}

async function fetchYouTubeTranscriptTrack(videoId: string, lang: string, onExternalCall?: () => void): Promise<string> {
  const endpoint = `https://www.youtube.com/api/timedtext?fmt=vtt&lang=${encodeURIComponent(lang)}&v=${encodeURIComponent(videoId)}`
  onExternalCall?.()
  try {
    const response = await fetch(endpoint)
    if (!response.ok) return ''
    const raw = await response.text()
    return raw || ''
  } catch {
    return ''
  }
}

function pickBestTrack(tracks: YouTubeTrack[], preferredCode: string | null): YouTubeTrack | null {
  if (!tracks.length) return null
  if (!preferredCode) return tracks[0] ?? null
  const exact = tracks.find((track) => track.lang === preferredCode)
  if (exact) return exact

  const fallbackByBase = tracks.find((track) => track.lang.startsWith(preferredCode))
  if (fallbackByBase) return fallbackByBase

  const zh = tracks.find((track) => /^zh\b/.test(track.lang))
  if (zh) return zh

  const en = tracks.find((track) => /^en\b/.test(track.lang))
  if (en) return en

  return tracks[0] ?? null
}

function normalizeLangCode(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  if (!normalized) return null
  if (normalized === 'zh-tw' || normalized === 'zh_hant') return 'zh'
  if (normalized === 'zh-cn' || normalized === 'zh_hans') return 'zh'
  return normalized
}

function makeTranscriptPreview(raw: string, limit: number): string {
  if (!raw) return ''
  const lines = raw.split('\n')
  const textLines = lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('WEBVTT') && !line.startsWith('NOTE') && !/^\d{2}:/.test(line) && !line.includes('-->'))

  const cleaned = textLines.join(' ').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  if (cleaned.length <= limit) return cleaned
  return `${cleaned.slice(0, limit).trim()}…`
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:v=)([A-Za-z0-9_-]{6,})/,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1] ?? null
  }
  return null
}

function extractAttribute(raw: string, attribute: string): string | null {
  const pattern = new RegExp(`${attribute}="([^"]+)"`)
  const match = raw.match(pattern)
  return match?.[1] ?? null
}

function buildDraftTitle(result: YouTubeBriefResult): string {
  return result.sourceTitle ? `YouTube 草稿：${result.sourceTitle}` : `YouTube 草稿：${result.source.url}`
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

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
