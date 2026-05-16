import { ChatGroq } from '@langchain/groq'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { AIMessage } from '@langchain/core/messages'
import { env } from 'cloudflare:workers'
import type { RagRuntimeConfig } from './state'
import type { BaseMessageLike } from '@langchain/core/messages'
import type { RagProvider } from './providers'

type Env = {
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<unknown>
  }
  GROQ_API_KEY?: string
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
  GEMINI_API_KEY?: string
  OPENROUTER_API_KEY?: string
  NVIDIA_API_KEY?: string
  CEREBRAS_API_KEY?: string
  OLLAMA_API_KEY?: string
  OLLAMA_CLOUD_API_KEY?: string
  OLLAMA_API_BASE?: string
  OLLAMA_HOST?: string
  OLLAMA_URL?: string
}

type ModelProvider = RagRuntimeConfig['defaultProvider']
export type ProviderApiKeys = Partial<Record<string, string>>

export interface ModelRoute {
  provider: ModelProvider
  model: string
  fallback: boolean
}

function resolveRoute(
  config: RagRuntimeConfig | undefined,
  stage: string | undefined
): ModelRoute {
  const stageConfig = stage && config?.stageOverrides ? config.stageOverrides[stage] : undefined
  return {
    provider: stageConfig?.provider ?? config?.defaultProvider ?? 'groq',
    model: stageConfig?.model ?? config?.defaultModel ?? 'llama-3.3-70b-versatile',
    fallback: false,
  }
}

export function createModel(
  maxTokens = 512,
  options?: {
    config?: RagRuntimeConfig
    stage?: string
    route?: ModelRoute
    apiKeys?: ProviderApiKeys
  }
) {
  const e = env as unknown as Env
  const route = options?.route ?? resolveRoute(options?.config, options?.stage)
  const apiKeys = options?.apiKeys ?? {}

  if (route.provider === 'openai') {
    const apiKey = apiKeys.openai || e.OPENAI_API_KEY
    return new ChatOpenAI({ model: route.model, apiKey, maxTokens })
  }

  if (route.provider === 'google' || route.provider === 'gemini') {
    const apiKey = apiKeys.google || apiKeys.gemini || apiKeys.GOOGLE_API_KEY || apiKeys.GEMINI_API_KEY || e.GOOGLE_API_KEY || e.GEMINI_API_KEY
    return new ChatGoogleGenerativeAI({ model: route.model, apiKey, maxOutputTokens: maxTokens })
  }

  if (route.provider === 'groq') {
    const apiKey = apiKeys.groq || e.GROQ_API_KEY
    return new ChatGroq({ model: route.model, apiKey, maxTokens })
  }

  if (route.provider === 'cloudflare') {
    if (!e.AI) throw new Error('Cloudflare Workers AI binding (AI) is missing')
    return createCloudflareAiModel(e.AI, route.model, maxTokens)
  }

  if (route.provider === 'openrouter') {
    const apiKey = apiKeys.openrouter || apiKeys.OPENROUTER_API_KEY || e.OPENROUTER_API_KEY
    return createOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://openrouter.ai/api/v1')
  }

  if (route.provider === 'nvidia') {
    const apiKey = apiKeys.nvidia || apiKeys.NVIDIA_API_KEY || e.NVIDIA_API_KEY
    return createOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://integrate.api.nvidia.com/v1')
  }

  if (route.provider === 'cerebras') {
    const apiKey = apiKeys.cerebras || apiKeys.CEREBRAS_API_KEY || e.CEREBRAS_API_KEY
    return createOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://api.cerebras.ai/v1')
  }

  if (route.provider === 'ollama_cloud') {
    const apiKey = apiKeys.ollama_cloud || apiKeys.OLLAMA_API_KEY || apiKeys.OLLAMA_CLOUD_API_KEY || e.OLLAMA_API_KEY || e.OLLAMA_CLOUD_API_KEY
    return createOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://ollama.com/v1')
  }

  if (route.provider === 'ollama') {
    const baseURL = apiKeys.OLLAMA_API_BASE || apiKeys.OLLAMA_HOST || apiKeys.OLLAMA_URL
      || e.OLLAMA_API_BASE || e.OLLAMA_HOST || e.OLLAMA_URL || 'http://localhost:11434/v1'
    return createOpenAiCompatibleModel(route.model, apiKeys.ollama || apiKeys.OLLAMA_API_KEY || e.OLLAMA_API_KEY || 'ollama', maxTokens, normalizeOpenAiBaseUrl(baseURL))
  }

  throw new Error(`Unsupported provider: ${route.provider}`)
}

function createOpenAiCompatibleModel(model: string, apiKey: string | undefined, maxTokens: number, baseURL: string) {
  if (!apiKey) throw new Error(`API key is missing for OpenAI-compatible provider at ${baseURL}`)
  return new ChatOpenAI({
    model,
    apiKey,
    maxTokens,
    configuration: { baseURL },
  })
}

function createCloudflareAiModel(ai: NonNullable<Env['AI']>, model: string, maxTokens: number) {
  return {
    async invoke(messages: BaseMessageLike[]) {
      const result = await ai.run(model, {
        messages: toCloudflareMessages(messages),
        max_tokens: maxTokens,
      })
      return new AIMessage(extractCloudflareText(result))
    },
  }
}

function toCloudflareMessages(messages: BaseMessageLike[]) {
  return messages.map((message) => {
    const record = message as Record<string, unknown>
    const type = typeof record._getType === 'function'
      ? String((record._getType as () => string)())
      : typeof record.type === 'string'
        ? record.type
        : 'user'
    const role = type === 'system' ? 'system' : type === 'ai' || type === 'assistant' ? 'assistant' : 'user'
    return {
      role,
      content: stringifyMessageContent(record.content ?? message),
    }
  })
}

function stringifyMessageContent(content: unknown): string {
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
  return content == null ? '' : String(content)
}

function extractCloudflareText(result: unknown): string {
  if (typeof result === 'string') return result
  if (result && typeof result === 'object') {
    const record = result as Record<string, unknown>
    if (typeof record.response === 'string') return record.response
    const choices = record.choices
    if (Array.isArray(choices)) {
      const first = choices[0] as Record<string, unknown> | undefined
      const message = first?.message as Record<string, unknown> | undefined
      if (typeof message?.content === 'string') return message.content
      if (typeof first?.text === 'string') return first.text
    }
  }
  return JSON.stringify(result)
}

function normalizeOpenAiBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '')
  return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`
}

export function resolveModelRoute(config: RagRuntimeConfig, stage: string): ModelRoute {
  return resolveRoute(config, stage)
}

export function resolveFallbackRoute(config: RagRuntimeConfig): ModelRoute | null {
  if (!config.fallbackProvider || !config.fallbackModel) return null
  return { provider: config.fallbackProvider, model: config.fallbackModel, fallback: true }
}

export async function invokeModel(
  config: RagRuntimeConfig,
  stage: string,
  messages: BaseMessageLike[],
  maxTokens = 512,
  apiKeys: ProviderApiKeys = {}
) {
  const primary = resolveModelRoute(config, stage)
  try {
    const response = await createModel(maxTokens, { route: primary, apiKeys }).invoke(messages)
    return { response, route: primary }
  } catch (error) {
    const fallback = resolveFallbackRoute(config)
    if (!fallback) throw error
    const response = await createModel(maxTokens, { route: fallback, apiKeys }).invoke(messages)
    return { response, route: fallback }
  }
}
