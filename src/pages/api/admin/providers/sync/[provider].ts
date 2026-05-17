import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { loadCatalog, isProvider, saveCatalog, type ProviderModel } from '../../providers'
import { resolveProviderApiKeys as resolveKeys } from '../../../../../lib/rag/provider-key-store'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

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
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const provider = params.provider
  if (typeof provider !== 'string' || !isProvider(provider)) {
    return json({ error: 'Invalid provider' }, 400)
  }

  const db = (env as unknown as Env).DB
  const providerApiKeys = await resolveKeys(db)
  const catalog = await loadCatalog(db)
  const currentModels = catalog.models.filter((row) => row.provider === provider)
  const currentMap = new Map(currentModels.map((row) => [row.model, row]))

  let models: string[]
  try {
    models = await fetchProviderModels(provider, providerApiKeys)
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : 'Provider sync failed',
      provider,
    }, 502)
  }
  const merged: ProviderModel[] = []
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

async function fetchProviderModels(provider: string, envFallbacks: Partial<Record<string, string>>): Promise<string[]> {
  if (provider === 'groq' || provider === 'openai') {
    return fetchOpenAiLikeModels(
      provider === 'groq' ? `https://api.groq.com/openai/v1/models` : `https://api.openai.com/v1/models`,
      provider === 'groq' ? envFallbacks.GROQ_API_KEY : envFallbacks.OPENAI_API_KEY,
      provider,
    )
  }

  if (provider === 'google' || provider === 'gemini') {
    return fetchGoogleModels(envFallbacks.GOOGLE_API_KEY)
  }

  if (provider === 'anthropic') {
    return fetchAnthropicModels(envFallbacks.ANTHROPIC_API_KEY)
  }

  if (provider === 'openrouter') {
    return fetchOpenRouterModels(envFallbacks.OPENROUTER_API_KEY)
  }

  if (provider === 'nvidia') {
    return fetchOpenAiLikeModels(
      'https://integrate.api.nvidia.com/v1/models',
      envFallbacks.NVIDIA_API_KEY,
      provider,
    )
  }

  if (provider === 'cerebras') {
    return fetchOpenAiLikeModels(
      'https://api.cerebras.ai/v1/models',
      envFallbacks.CEREBRAS_API_KEY,
      provider,
    )
  }

  if (provider === 'cloudflare') {
    return fetchCloudflareModels(envFallbacks.CLOUDFLARE_ACCOUNT_ID, envFallbacks.CLOUDFLARE_API_TOKEN)
  }

  if (provider === 'ollama_cloud') {
    return fetchOllamaCloudModels(envFallbacks.OLLAMA_API_KEY)
  }

  if (provider === 'ollama') {
    const base = envFallbacks.OLLAMA_API_BASE || envFallbacks.OLLAMA_HOST || envFallbacks.OLLAMA_URL
      || 'http://localhost:11434'
    return fetchOllamaLocalModels(base)
  }

  return []
}

async function fetchOpenAiLikeModels(url: string, apiKey: string | undefined, provider: string): Promise<string[]> {
  if (!apiKey) throw new Error(`${provider.toUpperCase()}_API_KEY is missing`)
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) {
      throw new Error(`OpenAI-compatible API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { data?: Array<{ id?: unknown }> } | null
    const data = Array.isArray(payload?.data) ? payload.data : []
    return data
      .map((item) => (typeof item?.id === 'string' ? item.id.trim() : ''))
      .filter(Boolean)
  } catch {
    throw new Error(`${provider} 模型列表 API 呼叫失敗`)
  }
}

async function fetchGoogleModels(apiKey: string | undefined): Promise<string[]> {
  if (!apiKey) throw new Error('GOOGLE_API_KEY is missing')
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`
    )
    if (!response.ok) {
      throw new Error(`Google models API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { models?: Array<{ name?: unknown }> } | null
    const list = Array.isArray(payload?.models) ? payload.models : []
    return list
      .map((item) => (typeof item?.name === 'string' ? item.name.trim().replace(/^models\//, '') : ''))
      .filter(Boolean)
  } catch {
    throw new Error('google 模型列表 API 呼叫失敗')
  }
}

async function fetchAnthropicModels(apiKey: string | undefined): Promise<string[]> {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is missing')
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    })
    if (!response.ok) {
      throw new Error(`Anthropic API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { data?: Array<{ id?: unknown }> } | null
    const data = Array.isArray(payload?.data) ? payload.data : []
    return data
      .map((item) => (typeof item?.id === 'string' ? item.id.trim() : ''))
      .filter(Boolean)
  } catch {
    throw new Error('anthropic 模型列表 API 呼叫失敗')
  }
}

async function fetchOpenRouterModels(apiKey: string | undefined): Promise<string[]> {
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is missing')
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) {
      throw new Error(`OpenRouter API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { data?: Array<{ id?: unknown }> } | null
    const data = Array.isArray(payload?.data) ? payload.data : []
    return data
      .map((item) => (typeof item?.id === 'string' ? item.id.trim() : ''))
      .filter(Boolean)
  } catch {
    throw new Error('openrouter 模型列表 API 呼叫失敗')
  }
}

async function fetchCloudflareModels(accountId: string | undefined, apiKey: string | undefined): Promise<string[]> {
  if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID is missing')
  if (!apiKey) throw new Error('CLOUDFLARE_API_TOKEN is missing')
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/models/search`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Cloudflare Models API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { result?: Array<{ name?: unknown }> } | null
    const data = Array.isArray(payload?.result) ? payload.result : []
    return data
      .map((item) => (typeof item?.name === 'string' ? item.name.trim() : ''))
      .filter(Boolean)
  } catch {
    throw new Error('cloudflare 模型列表 API 呼叫失敗')
  }
}

async function fetchOllamaCloudModels(apiKey: string | undefined): Promise<string[]> {
  if (!apiKey) throw new Error('OLLAMA_API_KEY is missing')
  try {
    const response = await fetch('https://ollama.com/api/tags', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Ollama Cloud API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { models?: Array<{ model?: unknown }> } | null
    const data = Array.isArray(payload?.models) ? payload.models : []
    return data
      .map((item) => (typeof item?.model === 'string' ? item.model.trim() : ''))
      .filter(Boolean)
  } catch {
    throw new Error('ollama_cloud 模型列表 API 呼叫失敗')
  }
}

async function fetchOllamaLocalModels(baseUrl: string): Promise<string[]> {
  const normalized = normalizeUrl(baseUrl)
  try {
    const response = await fetch(`${normalized}/api/tags`)
    if (!response.ok) {
      throw new Error(`Ollama local API failed (${response.status}): ${await response.text()}`)
    }
    const payload = await response.json().catch(() => null) as { models?: Array<{ name?: unknown; model?: unknown }> } | null
    const data = Array.isArray(payload?.models) ? payload.models : []
    return data
      .map((item) => {
        if (typeof item?.name === 'string') return item.name.trim()
        if (typeof item?.model === 'string') return item.model.trim()
        return ''
      })
      .filter(Boolean)
  } catch {
    throw new Error('ollama 本地模型列表 API 呼叫失敗')
  }
}

function normalizeUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, '').replace(/\/api\/generate$/i, '').replace(/\/v1$/i, '')
}


