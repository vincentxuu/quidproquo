import { ChatGroq } from '@langchain/groq'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { env } from 'cloudflare:workers'
import type { RagRuntimeConfig } from './state'
import type { BaseMessageLike } from '@langchain/core/messages'

type Env = {
  GROQ_API_KEY?: string
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
}

type ModelProvider = RagRuntimeConfig['defaultProvider']

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

export function createModel(maxTokens = 512, options?: { config?: RagRuntimeConfig; stage?: string; route?: ModelRoute }) {
  const e = env as unknown as Env
  const route = options?.route ?? resolveRoute(options?.config, options?.stage)

  if (route.provider === 'openai') {
    return new ChatOpenAI({ model: route.model, apiKey: e.OPENAI_API_KEY, maxTokens })
  }

  if (route.provider === 'google' || route.provider === 'gemini') {
    return new ChatGoogleGenerativeAI({ model: route.model, apiKey: e.GOOGLE_API_KEY, maxOutputTokens: maxTokens })
  }

  if (route.provider === 'groq') {
    return new ChatGroq({ model: route.model, apiKey: e.GROQ_API_KEY, maxTokens })
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
  maxTokens = 512
) {
  const primary = resolveModelRoute(config, stage)
  try {
    const response = await createModel(maxTokens, { route: primary }).invoke(messages)
    return { response, route: primary }
  } catch (error) {
    const fallback = resolveFallbackRoute(config)
    if (!fallback) throw error
    const response = await createModel(maxTokens, { route: fallback }).invoke(messages)
    return { response, route: fallback }
  }
}
