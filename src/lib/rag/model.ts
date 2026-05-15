import { ChatGroq } from '@langchain/groq'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { env } from 'cloudflare:workers'
import type { RagRuntimeConfig } from './state'
import type { BaseMessageLike } from '@langchain/core/messages'
import type { RagProvider } from './providers'

type Env = {
  GROQ_API_KEY?: string
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
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
    const apiKey = apiKeys.google || apiKeys.gemini || e.GOOGLE_API_KEY
    return new ChatGoogleGenerativeAI({ model: route.model, apiKey, maxOutputTokens: maxTokens })
  }

  if (route.provider === 'groq') {
    const apiKey = apiKeys.groq || e.GROQ_API_KEY
    return new ChatGroq({ model: route.model, apiKey, maxTokens })
  }

  throw new Error(`Unsupported provider: ${route.provider}`)
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
