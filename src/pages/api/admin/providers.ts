export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { verifySession } from '../../../lib/auth/session'
import { createModel } from '../../../lib/rag/model'
import type { RagRuntimeConfig } from '../../../lib/rag/state'

interface Env {
  DB: D1Database
}

interface ProviderModel {
  provider: RagRuntimeConfig['defaultProvider']
  model: string
  displayName?: string
  enabled: boolean
  notes?: string
}

interface ProviderCatalog {
  models: ProviderModel[]
}

const PROVIDERS = ['groq', 'openai', 'google'] as const
const CATALOG_KEY = 'provider_model_catalog'

const DEFAULT_CATALOG: ProviderCatalog = {
  models: [
    {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      displayName: 'Llama 3.3 70B Versatile',
      enabled: true,
      notes: 'Default RAG model',
    },
    {
      provider: 'openai',
      model: 'gpt-4.1-mini',
      displayName: 'GPT-4.1 Mini',
      enabled: true,
    },
    {
      provider: 'google',
      model: 'gemini-2.0-flash',
      displayName: 'Gemini 2.0 Flash',
      enabled: true,
    },
  ],
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const catalog = await loadCatalog((env as unknown as Env).DB)
  return json({ providers: PROVIDERS, catalog })
}

export const PUT: APIRoute = async ({ cookies, request }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const body = await request.json().catch(() => ({})) as { models?: unknown }
  const models = parseModels(body.models)
  if (!models) {
    return json({ error: 'Invalid provider model catalog' }, 400)
  }

  const catalog: ProviderCatalog = { models }
  const db = (env as unknown as Env).DB
  await ensureSettingsTable(db)
  await db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).bind(CATALOG_KEY, JSON.stringify(catalog)).run()

  return json({ ok: true, catalog })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const body = await request.json().catch(() => ({})) as {
    provider?: unknown
    model?: unknown
    prompt?: unknown
    maxTokens?: unknown
  }
  const provider = typeof body.provider === 'string' && isProvider(body.provider) ? body.provider : null
  const model = typeof body.model === 'string' ? body.model.trim() : ''
  const prompt = typeof body.prompt === 'string' && body.prompt.trim()
    ? body.prompt.trim()
    : 'Reply with one short sentence confirming this model is reachable.'
  const maxTokens = typeof body.maxTokens === 'number' && Number.isFinite(body.maxTokens)
    ? Math.min(Math.max(Math.round(body.maxTokens), 16), 512)
    : 96

  if (!provider || !model) return json({ error: 'provider and model are required' }, 400)

  const started = Date.now()
  try {
    const response = await createModel(maxTokens, {
      route: { provider, model, fallback: false },
    }).invoke([
      new SystemMessage('You are a concise model connectivity test endpoint.'),
      new HumanMessage(prompt),
    ])
    return json({
      ok: true,
      provider,
      model,
      duration_ms: Date.now() - started,
      content: stringifyContent(response.content),
    })
  } catch (error) {
    return json({
      ok: false,
      provider,
      model,
      duration_ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    }, 502)
  }
}

async function loadCatalog(db: D1Database): Promise<ProviderCatalog> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?')
    .bind(CATALOG_KEY)
    .first<{ value: string }>()
    .catch(() => null)
  if (!row?.value) return DEFAULT_CATALOG

  try {
    const parsed = JSON.parse(row.value) as { models?: unknown }
    const models = parseModels(parsed.models)
    return models ? { models } : DEFAULT_CATALOG
  } catch {
    return DEFAULT_CATALOG
  }
}

function parseModels(value: unknown): ProviderModel[] | null {
  if (!Array.isArray(value)) return null

  const seen = new Set<string>()
  const models: ProviderModel[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') return null
    const model = item as Record<string, unknown>
    if (typeof model.provider !== 'string' || !isProvider(model.provider)) return null
    if (typeof model.model !== 'string' || !model.model.trim()) return null

    const key = `${model.provider}:${model.model.trim()}`
    if (seen.has(key)) continue
    seen.add(key)

    models.push({
      provider: model.provider,
      model: model.model.trim(),
      displayName: typeof model.displayName === 'string' ? model.displayName.trim() : undefined,
      enabled: typeof model.enabled === 'boolean' ? model.enabled : true,
      notes: typeof model.notes === 'string' ? model.notes.trim() : undefined,
    })
  }

  return models
}

function isProvider(value: string): value is ProviderModel['provider'] {
  return PROVIDERS.includes(value as ProviderModel['provider'])
}

async function ensureSettingsTable(db: D1Database): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run()
}

function stringifyContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (typeof part === 'string') return part
      if (part && typeof part === 'object' && 'text' in part) {
        const text = (part as { text?: unknown }).text
        return typeof text === 'string' ? text : ''
      }
      return ''
    }).filter(Boolean).join('\n')
  }
  return JSON.stringify(content)
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
