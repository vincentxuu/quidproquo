export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { resolveProviderApiKeys } from '@/lib/rag/provider-key-store'

const PROVIDERS: Record<string, { baseUrl: string; envKey: string }> = {
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', envKey: 'OPENROUTER_API_KEY' },
  opencode: { baseUrl: 'https://opencode.ai/zen/v1', envKey: 'OPENCODE_ZEN_API_KEY' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', envKey: 'GROQ_API_KEY' },
  openai: { baseUrl: 'https://api.openai.com/v1', envKey: 'OPENAI_API_KEY' },
  nvidia: { baseUrl: 'https://integrate.api.nvidia.com/v1', envKey: 'NVIDIA_API_KEY' },
  cerebras: { baseUrl: 'https://api.cerebras.ai/v1', envKey: 'CEREBRAS_API_KEY' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', envKey: 'GEMINI_API_KEY' },
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return badRequest('invalid JSON')
  }

  const modelSpec = typeof body.model === 'string' ? body.model : ''
  if (!modelSpec || !modelSpec.includes('/')) {
    return badRequest('model is required (format: provider/model, e.g. nvidia/meta/llama-3.1-8b-instruct)')
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt : 'Say "hello" in JSON: {"message":"hello"}'
  const maxTokens = typeof body.maxTokens === 'number' ? body.maxTokens : 100

  const slash = modelSpec.indexOf('/')
  const providerKey = modelSpec.slice(0, slash)
  const model = modelSpec.slice(slash + 1)
  const config = PROVIDERS[providerKey]

  if (!config) {
    return json({ error: `Unknown provider: ${providerKey}`, available: Object.keys(PROVIDERS) }, 400)
  }

  const db = (env as unknown as Env).DB
  const apiKeys = await resolveProviderApiKeys(db)
  const apiKey = apiKeys[config.envKey] || (env as unknown as Record<string, string>)[config.envKey]

  if (!apiKey) {
    return json({
      error: `${config.envKey} not found`,
      checked: ['D1 settings', 'Worker env secrets'],
      availableKeys: Object.entries(apiKeys)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k),
    }, 400)
  }

  const started = Date.now()
  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
      }),
    })

    const latency = Date.now() - started
    const rateLimitHeaders = extractRateLimitHeaders(res.headers)

    if (!res.ok) {
      const errBody = await res.text()
      return json({ ok: false, provider: providerKey, model, status: res.status, latency, error: errBody.slice(0, 500), rateLimit: rateLimitHeaders })
    }

    const data = await res.json() as {
      choices: Array<{ message: { content: string } }>
      model: string
      usage?: unknown
    }

    return json({
      ok: true,
      provider: providerKey,
      model: data.model,
      latency,
      content: data.choices?.[0]?.message?.content ?? '',
      usage: data.usage,
      rateLimit: rateLimitHeaders,
    })
  } catch (err) {
    return json({ ok: false, provider: providerKey, model, latency: Date.now() - started, error: String(err) })
  }
}

const RATE_LIMIT_HEADER_PREFIXES = ['x-ratelimit', 'retry-after', 'x-rate-limit', 'ratelimit']

function extractRateLimitHeaders(headers: Headers): Record<string, string> | undefined {
  const result: Record<string, string> = {}
  headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (RATE_LIMIT_HEADER_PREFIXES.some(p => lower.startsWith(p) || lower === p)) {
      result[key] = value
    }
  })
  return Object.keys(result).length > 0 ? result : undefined
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const apiKeys = await resolveProviderApiKeys(db)
  const envRecord = env as unknown as Record<string, string>

  const status = Object.entries(PROVIDERS).map(([id, config]) => ({
    provider: id,
    envKey: config.envKey,
    hasKey: Boolean(apiKeys[config.envKey] || envRecord[config.envKey]),
    source: apiKeys[config.envKey] ? 'd1' : envRecord[config.envKey] ? 'env' : 'missing',
  }))

  return json({ providers: status })
}
