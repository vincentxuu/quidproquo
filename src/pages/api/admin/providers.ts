export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createModel } from '../../../lib/rag/model'
import type { RagRuntimeConfig } from '../../../lib/rag/state'
import { SUPPORTED_PROVIDERS } from '../../../lib/rag/providers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { CATALOG_KEY } from '@/lib/config/settings-keys'
import {
  getCurrentProviderKeyValues,
  isWhitelistedProviderKey,
  loadProviderKeyOverrides,
  PROVIDER_KEY_PREFIX,
  PROVIDER_SECRET_FIELDS,
  resolveProviderApiKeys,
} from '../../../lib/rag/provider-key-store'
import { json } from '@/lib/api/response'
import { deleteSetting, getSetting, setSetting } from '@/lib/db/settings-store'

const LEGACY_SETTINGS_TABLE = { tableName: 'settings' as const }

export interface ProviderModel {
  provider: RagRuntimeConfig['defaultProvider']
  model: string
  displayName?: string
  enabled: boolean
  notes?: string
}

export interface ProviderCatalog {
  models: ProviderModel[]
}

type ProviderKeySource = 'missing' | 'env' | 'admin' | 'both'

interface ProviderSecretStatus {
  envKey: string
  provider: string
  label: string
  hasEnv: boolean
  hasDb: boolean
  configured: boolean
  source: ProviderKeySource
}

interface ProviderSaveBody {
  action?: unknown
  key?: unknown
  provider?: unknown
  value?: unknown
  model?: unknown
  prompt?: unknown
  maxTokens?: unknown
}

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
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const catalog = await loadCatalog(db)
  const providerKeys = await loadProviderKeyStatuses(db)
  return json({ providers: SUPPORTED_PROVIDERS, catalog, providerKeys })
}

export const PUT: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => ({})) as { models?: unknown }
  const models = parseModels(body.models)
  if (!models) {
    return json({ error: 'Invalid provider model catalog' }, 400)
  }

  const catalog: ProviderCatalog = { models }
  const db = (env as unknown as Env).DB
  await saveCatalog(db, catalog)

  return json({ ok: true, catalog })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as ProviderSaveBody

  if (typeof body.action === 'string') {
    if (body.action === 'save-provider-key' || body.action === 'delete-provider-key') {
      const key = typeof body.key === 'string' ? body.key.trim() : ''
      if (!isWhitelistedProviderKey(key)) {
        return json({ error: 'Invalid provider secret key' }, 400)
      }
      if (body.action === 'delete-provider-key') {
        await deleteProviderSecret(db, key)
        return json({ ok: true, action: 'delete-provider-key', key })
      }

      const valueRaw = typeof body.value === 'string' ? body.value : ''
      const value = valueRaw.trim()
      if (!value) return json({ error: 'value is required' }, 400)
      await saveProviderSecret(db, key, value)
      return json({ ok: true, action: 'save-provider-key', key })
    }
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
  const apiKeys = await resolveProviderApiKeys(db)
  try {
    const response = await createModel(maxTokens, {
      route: { provider, model, fallback: false },
      apiKeys,
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

export async function loadCatalog(db: D1Database): Promise<ProviderCatalog> {
  const row = await getSetting(db, CATALOG_KEY, LEGACY_SETTINGS_TABLE)
  if (!row?.value) return DEFAULT_CATALOG

  try {
    const parsed = JSON.parse(row.value) as { models?: unknown }
    const models = parseModels(parsed.models)
    return models ? { models } : DEFAULT_CATALOG
  } catch {
    return DEFAULT_CATALOG
  }
}

export async function saveCatalog(db: D1Database, catalog: ProviderCatalog): Promise<void> {
  await setSetting(db, CATALOG_KEY, JSON.stringify(catalog), LEGACY_SETTINGS_TABLE)
}

export async function loadProviderKeyStatuses(db: D1Database): Promise<ProviderSecretStatus[]> {
  const saved = await loadProviderKeyOverrides(db)
  const envValues = getCurrentProviderKeyValues()

  const keys = new Set(Object.keys(saved))
  for (const field of PROVIDER_SECRET_FIELDS) {
    keys.add(field.envKey)
  }

  return Array.from(keys, (envKey) => {
    const field = PROVIDER_SECRET_FIELDS.find((item) => item.envKey === envKey)
    const hasEnv = !!envValues[envKey]
    const hasDb = !!saved[envKey]
    const source: ProviderKeySource = hasEnv && hasDb ? 'both' : hasEnv ? 'env' : hasDb ? 'admin' : 'missing'
    return {
      envKey,
      provider: field?.provider || 'custom',
      label: field?.label || envKey,
      hasEnv,
      hasDb,
      configured: hasEnv || hasDb,
      source,
    }
  }).filter((item) => isWhitelistedProviderKey(item.envKey))
    .sort((a, b) => a.label.localeCompare(b.label))
}

async function saveProviderSecret(db: D1Database, envKey: string, value: string): Promise<void> {
  const storageKey = `${PROVIDER_KEY_PREFIX}${envKey}`
  await setSetting(db, storageKey, value, LEGACY_SETTINGS_TABLE)
}

async function deleteProviderSecret(db: D1Database, envKey: string): Promise<void> {
  await deleteSetting(db, `${PROVIDER_KEY_PREFIX}${envKey}`, LEGACY_SETTINGS_TABLE)
}

export function parseModels(value: unknown): ProviderModel[] | null {
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

export function isProvider(value: string): value is ProviderModel['provider'] {
  return (SUPPORTED_PROVIDERS as readonly string[]).includes(value)
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
