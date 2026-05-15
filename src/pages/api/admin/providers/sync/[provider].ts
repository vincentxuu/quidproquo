import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { loadCatalog, isProvider, saveCatalog } from '../providers'
import { verifySession } from '../../../../../lib/auth/session'

interface Env {
  DB: D1Database
  GROQ_API_KEY?: string
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
}

const PRESET_MODELS: Record<string, string[]> = {
  groq: ['llama-3.3-70b-versatile', 'llama-3.3-70b-specdec', 'llama-3.1-70b-versatile', 'llama-3.2-90b-text-preview'],
  openai: ['gpt-4.1-mini', 'gpt-4.1', 'gpt-4.1-nano', 'gpt-4o-mini', 'gpt-4o'],
  google: ['gemini-2.0-flash', 'gemini-1.5-pro'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro'],
  anthropic: ['claude-3.5-sonnet', 'claude-3.5-haiku', 'claude-3.7-sonnet'],
  cloudflare: ['@cf/meta/llama-3.1-8b-instruct', '@cf/qwen/qwen2.5-72b-instruct'],
  nvidia: ['llama-3.3-70b', 'nemotron-4-340b'],
  cerebras: ['llama3.1-8b', 'llama3.3-70b'],
  openrouter: ['openrouter/auto'],
  ollama_cloud: ['llama3.3', 'qwen2.5-72b'],
  ollama: ['llama3.3', 'qwen2.5-72b'],
}

export const POST: APIRoute = async ({ cookies, params }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const provider = params.provider
  if (typeof provider !== 'string' || !isProvider(provider)) {
    return json({ error: 'Invalid provider' }, 400)
  }

  const db = (env as unknown as Env).DB
  const catalog = await loadCatalog(db)
  const currentModels = catalog.models.filter((row) => row.provider === provider)
  const currentMap = new Map(currentModels.map((row) => [row.model, row]))

  const models = await fetchProviderModels(provider, env as unknown as Env)
  const merged: Array<{
    provider: string
    model: string
    displayName?: string
    enabled: boolean
    notes?: string
  }> = []
  const seen = new Set<string>()
  let added = 0
  let existing = 0

  for (const model of models) {
    const trimmed = model.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)

    const existingEntry = currentMap.get(trimmed)
    if (existingEntry) {
      existing += 1
      merged.push({
        provider,
        model: trimmed,
        displayName: existingEntry.displayName,
        enabled: existingEntry.enabled,
        notes: existingEntry.notes,
      })
      continue
    }

    added += 1
    merged.push({
      provider,
      model: trimmed,
      displayName: trimmed,
      enabled: true,
    })
  }

  for (const fallbackModel of PRESET_MODELS[provider] ?? []) {
    const trimmed = fallbackModel.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)

    const existingEntry = currentMap.get(trimmed)
    if (existingEntry) {
      existing += 1
      merged.push({
        provider,
        model: trimmed,
        displayName: existingEntry.displayName,
        enabled: existingEntry.enabled,
        notes: existingEntry.notes,
      })
      continue
    }

    added += 1
    merged.push({
      provider,
      model: trimmed,
      displayName: trimmed,
      enabled: true,
    })
  }

  const nextModels = [
    ...catalog.models.filter((row) => row.provider !== provider),
    ...merged.sort((a, b) => a.model.localeCompare(b.model)),
  ]

  await saveCatalog(db, { models: nextModels })
  return json({ provider, added, existing, total: merged.length })
}

async function fetchProviderModels(provider: string, env: Env): Promise<string[]> {
  if (provider === 'groq' || provider === 'openai') {
    return fetchOpenAiLikeModels(provider === 'groq'
      ? `https://api.groq.com/openai/v1/models`
      : `https://api.openai.com/v1/models`,
    provider === 'groq' ? env.GROQ_API_KEY : env.OPENAI_API_KEY)
  }

  if (provider === 'google' || provider === 'gemini') {
    return fetchGoogleModels(env.GOOGLE_API_KEY)
  }

  return []
}

async function fetchOpenAiLikeModels(url: string, apiKey: string | undefined): Promise<string[]> {
  if (!apiKey) return []
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) return []
    const payload = await response.json().catch(() => null) as { data?: Array<{ id?: unknown }> } | null
    const data = Array.isArray(payload?.data) ? payload.data : []
    return data
      .map((item) => (typeof item?.id === 'string' ? item.id.trim() : ''))
      .filter(Boolean)
  } catch {
    return []
  }
}

async function fetchGoogleModels(apiKey: string | undefined): Promise<string[]> {
  if (!apiKey) return []
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`
    )
    if (!response.ok) return []
    const payload = await response.json().catch(() => null) as { models?: Array<{ name?: unknown }> } | null
    const list = Array.isArray(payload?.models) ? payload.models : []
    return list
      .map((item) => (typeof item?.name === 'string' ? item.name.trim().replace(/^models\//, '') : ''))
      .filter(Boolean)
  } catch {
    return []
  }
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

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}
