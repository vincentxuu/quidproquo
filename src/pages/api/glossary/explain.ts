import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createModel } from '../../../lib/rag/model'
import { findDefaultGlossaryEntry, type GlossaryEntry, type GlossaryLink } from '../../../lib/glossary/terms'
import { json } from '@/lib/api/response'

interface D1StatementLike {
  bind: (...values: unknown[]) => {
    run: () => Promise<unknown>
  }
}

interface D1DatabaseLike {
  prepare: (query: string) => D1StatementLike
}

interface RuntimeEnv {
  DB?: D1DatabaseLike
  GROQ_API_KEY?: string
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
}

interface GlossaryRequest {
  term?: string
  level?: 'beginner' | 'advanced'
  context?: string
  slug?: string
  seed?: GlossaryEntry
}

interface GlossaryResponse {
  term: string
  level: 'beginner' | 'advanced'
  definition: string
  context: string
  reading: GlossaryLink[]
  source: 'ai' | 'local'
}

const MAX_TERM_LENGTH = 80
const MAX_CONTEXT_LENGTH = 420


function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

function cleanText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function hasModelKey(e: RuntimeEnv): boolean {
  return Boolean(e.GROQ_API_KEY || e.OPENAI_API_KEY || e.GOOGLE_API_KEY)
}

function buildLocalResponse(term: string, level: 'beginner' | 'advanced', context: string, seed?: GlossaryEntry): GlossaryResponse {
  const entry = seed ?? findDefaultGlossaryEntry(term)
  const definition = level === 'advanced'
    ? entry?.advanced ?? entry?.definition
    : entry?.definition ?? entry?.advanced

  return {
    term,
    level,
    definition: definition ?? `${term} 是本文中的技術名詞。這裡先保留原文脈絡，方便你不用離開頁面也能回到剛剛讀到的位置。`,
    context: entry?.context ?? context ?? '這個詞彙的精確意思會依文章脈絡而變。',
    reading: entry?.links?.length
      ? entry.links
      : [{ label: `搜尋 ${term}`, url: `/search?q=${encodeURIComponent(term)}&mode=rag` }],
    source: 'local',
  }
}

function parseModelJson(content: unknown): Partial<GlossaryResponse> | null {
  const text = Array.isArray(content)
    ? content.map((part) => typeof part === 'string' ? part : 'text' in part ? part.text : '').join('')
    : typeof content === 'string'
      ? content
      : ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0]) as Partial<GlossaryResponse>
  } catch {
    return null
  }
}

async function explainWithModel(env: RuntimeEnv, term: string, level: 'beginner' | 'advanced', context: string, seed?: GlossaryEntry): Promise<GlossaryResponse | null> {
  if (!hasModelKey(env)) return null

  const fallback = buildLocalResponse(term, level, context, seed)
  const model = createModel(420)
  const prompt = [
    new SystemMessage('你是部落格文章內的互動詞彙卡。只輸出 JSON，不要 Markdown。說明要短、準確、貼近讀者正在看的上下文。'),
    new HumanMessage(JSON.stringify({
      term,
      level,
      article_context: context,
      seed_definition: seed?.definition,
      seed_advanced: seed?.advanced,
      output_schema: {
        definition: level === 'beginner' ? '用初學者能懂的 1-2 句中文解釋' : '用進階讀者需要的技術細節，最多 2 句中文',
        context: '這個詞在本文脈絡中代表什麼，1 句中文',
        reading: [{ label: '延伸閱讀標題', url: '/search?q=term&mode=rag' }],
      },
    })),
  ]

  const response = await model.invoke(prompt)
  const parsed = parseModelJson(response.content)
  if (!parsed) return null

  return {
    term,
    level,
    definition: cleanText(parsed.definition, fallback.definition),
    context: cleanText(parsed.context, fallback.context),
    reading: Array.isArray(parsed.reading) && parsed.reading.length > 0
      ? parsed.reading
          .map((link) => ({
            label: cleanText(link?.label, `搜尋 ${term}`),
            url: cleanText(link?.url, `/search?q=${encodeURIComponent(term)}&mode=rag`),
          }))
          .filter((link) => link.label && link.url)
          .slice(0, 3)
      : fallback.reading,
    source: 'ai',
  }
}

async function recordLookup(env: RuntimeEnv, term: string, slug: string, level: 'beginner' | 'advanced', context: string): Promise<void> {
  const db = env.DB
  if (!db) return
  await db.prepare(
    `INSERT INTO glossary_lookup_stats (term, slug, level, lookup_count, last_context, last_seen_at)
     VALUES (?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(term, slug, level) DO UPDATE SET
       lookup_count = lookup_count + 1,
       last_context = excluded.last_context,
       last_seen_at = CURRENT_TIMESTAMP`
  ).bind(term, slug, level, context).run()
}

export const POST: APIRoute = async ({ request }) => {
  const runtimeEnv = env as unknown as RuntimeEnv
  let body: GlossaryRequest
  try {
    body = await request.json() as GlossaryRequest
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const term = truncate(cleanText(body.term), MAX_TERM_LENGTH)
  const level = body.level === 'advanced' ? 'advanced' : 'beginner'
  const context = truncate(cleanText(body.context), MAX_CONTEXT_LENGTH)
  const slug = truncate(cleanText(body.slug), 180)

  if (!term) return json({ error: 'missing_term' }, 400)

  await recordLookup(runtimeEnv, term, slug, level, context).catch(() => {})

  const response = await explainWithModel(runtimeEnv, term, level, context, body.seed)
    .catch(() => null)

  return json(response ?? buildLocalResponse(term, level, context, body.seed))
}
