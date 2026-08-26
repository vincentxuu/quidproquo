import { ChatGroq } from '@langchain/groq'
import { ChatOpenAI } from '@langchain/openai'
import type { ChatOpenAIFields } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { AIMessage } from '@langchain/core/messages'
import { env } from 'cloudflare:workers'
import type { RagRuntimeConfig } from './state'
import type { BaseMessageLike } from '@langchain/core/messages'

/**
 * Structural response type for chat model invocations.
 *
 * We define this as an explicit interface rather than using `AIMessage<MessageStructure>`
 * directly because langchain v1's `$InferMessageContent` generic makes `.content`
 * invisible to TypeScript when the structure generic is in play. Callers across
 * the codebase read `response.content` and `response.usage_metadata`, so we
 * expose exactly those fields with their runtime-correct types.
 *
 * `usage_metadata` is only present on AI-role responses; it is optional here so
 * that callers already guard with `?? 0` as expected.
 */
export interface ChatModelResponse {
  content: string | unknown[]
  usage_metadata?: {
    input_tokens: number
    output_tokens: number
    total_tokens?: number
  }
}

/**
 * Common chat model surface unified across all providers (ChatOpenAI, ChatGroq,
 * ChatGoogleGenerativeAI, Cloudflare Workers AI). Each provider class extends
 * langchain's BaseChatModel and adds its own generic args, so the raw union
 * type isn't easy for TS to narrow. This minimal interface only exposes the
 * surface we actually call.
 */
export interface ChatModel {
  invoke(input: BaseMessageLike[]): Promise<ChatModelResponse>
}

type Env = {
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<unknown>
  }
  GROQ_API_KEY?: string
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
  GEMINI_API_KEY?: string
  OPENROUTER_API_KEY?: string
  OPENCODE_API_KEY?: string
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
    model: stageConfig?.model ?? config?.defaultModel ?? 'openai/gpt-oss-120b',
    fallback: false,
  }
}

/**
 * Adapt a langchain chat-model instance (whose `invoke` signature is widened
 * to `BaseLanguageModelInput` with a provider-specific generic return type) to
 * the minimal `ChatModel` interface we expose to the rest of the codebase.
 * All providers accept `BaseMessageLike[]` at runtime; we only need to relax
 * TS' view so it unifies them behind one type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- langchain's invoke/bindTools signatures use any
type InvokableModel = { invoke: (...args: any[]) => Promise<unknown>; bindTools?: (...args: any[]) => unknown }
function adapt(model: InvokableModel): ChatModel {
  const adapted: ChatModel & Record<string, unknown> = {
    invoke: (input) => (model.invoke as (i: BaseMessageLike[]) => Promise<ChatModelResponse>).call(model, input),
  }
  if (typeof model.bindTools === 'function') {
    // [skip-harness] langchain's bindTools returns a model with the same shape
    adapted.bindTools = (...args: unknown[]) => adapt((model as Required<InvokableModel>).bindTools.apply(model, args) as InvokableModel)
  }
  return adapted
}

/**
 * Widen the `@langchain/openai` 1.4.x `ChatOpenAIFields` constructor type so
 * we can pass `apiKey` and `maxTokens`. The package ships broken `.d.ts`
 * files (internal type modules import from `../../src/types.js` paths absent
 * from the published artefact), so `Partial<OpenAIChatInput>` resolves to
 * nothing and TS sees `ChatOpenAIFields` as only its four explicit literal
 * members. Until upstream is fixed, we intersect with the runtime-valid
 * fields we actually need.
 */
type OpenAIConstructorFields =
  Omit<ChatOpenAIFields, 'model'> & { apiKey?: string; maxTokens?: number; configuration?: { baseURL?: string } }

/**
 * The `@langchain/openai` 1.4.x published `Omit<ChatOpenAIFields, 'model'>`
 * resolves to its four literal members (TS sees the rest as `never`). Cast our
 * runtime-valid intersection through a permissive shape so the
 * `constructor(model, fields)` overload still resolves.
 */
function asOpenAIFields(fields: OpenAIConstructorFields): Omit<ChatOpenAIFields, 'model'> {
  return fields as unknown as Omit<ChatOpenAIFields, 'model'>
}

export function createModel(
  maxTokens = 512,
  options?: {
    config?: RagRuntimeConfig
    stage?: string
    route?: ModelRoute
    apiKeys?: ProviderApiKeys
  }
): ChatModel {
  const e = env as unknown as Env
  const route = options?.route ?? resolveRoute(options?.config, options?.stage)
  const apiKeys = options?.apiKeys ?? {}

  if (route.provider === 'openai') {
    const apiKey = apiKeys.openai || e.OPENAI_API_KEY
    const fields: OpenAIConstructorFields = { apiKey, maxTokens }
    return adapt(new ChatOpenAI(route.model, asOpenAIFields(fields)) as unknown as InvokableModel)
  }

  if (route.provider === 'google' || route.provider === 'gemini') {
    const apiKey = apiKeys.google || apiKeys.gemini || apiKeys.GOOGLE_API_KEY || apiKeys.GEMINI_API_KEY || e.GOOGLE_API_KEY || e.GEMINI_API_KEY
    return adapt(new ChatGoogleGenerativeAI(route.model, { apiKey, maxOutputTokens: maxTokens }))
  }

  if (route.provider === 'groq') {
    const apiKey = apiKeys.groq || e.GROQ_API_KEY
    return adapt(new ChatGroq(route.model, {
      apiKey,
      maxTokens,
      // Provider fallback is handled explicitly below. SDK retries make a
      // quota-exhausted primary block the fallback path for over a minute.
      maxRetries: 0,
    } as unknown as import('@langchain/groq').ChatGroqInput))
  }

  if (route.provider === 'cloudflare') {
    if (!e.AI) throw new Error('Cloudflare Workers AI binding (AI) is missing')
    return createCloudflareAiModel(e.AI, route.model, maxTokens)
  }

  if (route.provider === 'openrouter') {
    const apiKey = apiKeys.openrouter || apiKeys.OPENROUTER_API_KEY || e.OPENROUTER_API_KEY
    return createOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://openrouter.ai/api/v1')
  }

  if (route.provider === 'opencode') {
    const apiKey = apiKeys.opencode || apiKeys.OPENCODE_API_KEY || e.OPENCODE_API_KEY
    return createOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://opencode.ai/zen/v1')
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

// [skip-harness] Returns the raw LangChain model without the adapt() wrapper.
// Use this when the consumer needs the full BaseChatModel interface (e.g. createReactAgent needs bindTools).
export function createRawModel(
  maxTokens = 512,
  options?: {
    config?: RagRuntimeConfig
    stage?: string
    route?: ModelRoute
    apiKeys?: ProviderApiKeys
  }
): InvokableModel {
  const e = env as unknown as Env
  const route = options?.route ?? resolveRoute(options?.config, options?.stage)
  const apiKeys = options?.apiKeys ?? {}

  if (route.provider === 'openai') {
    const apiKey = apiKeys.openai || e.OPENAI_API_KEY
    const fields: OpenAIConstructorFields = { apiKey, maxTokens }
    return new ChatOpenAI(route.model, asOpenAIFields(fields)) as unknown as InvokableModel
  }

  if (route.provider === 'google' || route.provider === 'gemini') {
    const apiKey = apiKeys.google || apiKeys.gemini || apiKeys.GOOGLE_API_KEY || apiKeys.GEMINI_API_KEY || e.GOOGLE_API_KEY || e.GEMINI_API_KEY
    return new ChatGoogleGenerativeAI(route.model, { apiKey, maxOutputTokens: maxTokens }) as unknown as InvokableModel
  }

  if (route.provider === 'groq') {
    const apiKey = apiKeys.groq || e.GROQ_API_KEY
    return new ChatGroq(route.model, {
      apiKey,
      maxTokens,
      maxRetries: 0,
    } as unknown as import('@langchain/groq').ChatGroqInput) as unknown as InvokableModel
  }

  if (route.provider === 'openrouter') {
    const apiKey = apiKeys.openrouter || apiKeys.OPENROUTER_API_KEY || e.OPENROUTER_API_KEY
    return createRawOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://openrouter.ai/api/v1')
  }

  if (route.provider === 'opencode') {
    const apiKey = apiKeys.opencode || apiKeys.OPENCODE_API_KEY || e.OPENCODE_API_KEY
    return createRawOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://opencode.ai/zen/v1')
  }

  if (route.provider === 'nvidia') {
    const apiKey = apiKeys.nvidia || apiKeys.NVIDIA_API_KEY || e.NVIDIA_API_KEY
    return createRawOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://integrate.api.nvidia.com/v1')
  }

  if (route.provider === 'cerebras') {
    const apiKey = apiKeys.cerebras || apiKeys.CEREBRAS_API_KEY || e.CEREBRAS_API_KEY
    return createRawOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://api.cerebras.ai/v1')
  }

  if (route.provider === 'ollama_cloud') {
    const apiKey = apiKeys.ollama_cloud || apiKeys.OLLAMA_API_KEY || apiKeys.OLLAMA_CLOUD_API_KEY || e.OLLAMA_API_KEY || e.OLLAMA_CLOUD_API_KEY
    return createRawOpenAiCompatibleModel(route.model, apiKey, maxTokens, 'https://ollama.com/v1')
  }

  if (route.provider === 'ollama') {
    const baseURL = apiKeys.OLLAMA_API_BASE || apiKeys.OLLAMA_HOST || apiKeys.OLLAMA_URL
      || e.OLLAMA_API_BASE || e.OLLAMA_HOST || e.OLLAMA_URL || 'http://localhost:11434/v1'
    return createRawOpenAiCompatibleModel(route.model, apiKeys.ollama || apiKeys.OLLAMA_API_KEY || e.OLLAMA_API_KEY || 'ollama', maxTokens, normalizeOpenAiBaseUrl(baseURL))
  }

  throw new Error(`Unsupported provider: ${route.provider}`)
}

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504]
const DEFAULT_FALLBACK_CHAIN: ModelProvider[] = ['opencode', 'openrouter', 'nvidia']
const CLOUDFLARE_FALLBACK_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

export function createResilientModel(
  maxTokens = 512,
  options?: {
    config?: RagRuntimeConfig
    stage?: string
    route?: ModelRoute
    apiKeys?: ProviderApiKeys
    fallbackProviders?: ModelProvider[]
    maxRetries?: number
  }
): InvokableModel {
  const e = env as unknown as Env
  const route = options?.route ?? resolveRoute(options?.config, options?.stage)
  const fallbackProviders = options?.fallbackProviders ?? DEFAULT_FALLBACK_CHAIN.filter(p => p !== route.provider)
  const maxRetries = options?.maxRetries ?? 2

  const primary = createRawModelSafe(route.provider, route.model, maxTokens, { ...options, apiKeys: options?.apiKeys ?? {} })

  const fallbacks: InvokableModel[] = []
  for (const provider of fallbackProviders) {
    const fb = createRawModelSafe(provider, undefined, maxTokens, { ...options, apiKeys: options?.apiKeys ?? {} })
    if (fb) fallbacks.push(fb)
  }

  if (e.AI) {
    fallbacks.push(createRawCloudflareAiModel(e.AI, CLOUDFLARE_FALLBACK_MODEL, maxTokens))
  }

  if (!primary) {
    if (fallbacks.length === 0) throw new Error(`No working provider available (tried ${route.provider} + ${fallbackProviders.join(', ')})`)
    return attachFallbackChain(fallbacks[0], fallbacks.slice(1), maxRetries)
  }

  return attachFallbackChain(primary, fallbacks, maxRetries)
}

function createRawModelSafe(
  provider: ModelProvider,
  model: string | undefined,
  maxTokens: number,
  options: { config?: RagRuntimeConfig; stage?: string; apiKeys: ProviderApiKeys }
): InvokableModel | null {
  try {
    const resolvedModel = model ?? defaultModelForProvider(provider)
    return createRawModel(maxTokens, { ...options, route: { provider, model: resolvedModel, fallback: true } })
  } catch {
    return null
  }
}

function defaultModelForProvider(provider: ModelProvider): string {
  const defaults: Partial<Record<ModelProvider, string>> = {
    groq: 'openai/gpt-oss-120b',
    openai: 'gpt-4.1-mini',
    google: 'gemini-3.6-flash',
    gemini: 'gemini-3.6-flash',
    openrouter: 'meta-llama/llama-4-maverick:free',
    opencode: 'deepseek-v4-flash',
    nvidia: 'deepseek-ai/deepseek-r1',
    cerebras: 'gpt-oss-120b',
  }
  return defaults[provider] ?? 'deepseek-v4-flash'
}

// [skip-harness] LangChain's withRetry/withFallbacks returns Runnable which has invoke+bindTools
function attachFallbackChain(primary: InvokableModel, fallbacks: InvokableModel[], maxRetries: number): InvokableModel {
  const retryFilter = (error: unknown) => {
    if (error && typeof error === 'object' && 'status' in error) {
      return RETRYABLE_STATUS_CODES.includes((error as { status: number }).status)
    }
    const msg = error instanceof Error ? error.message : String(error)
    return /429|500|502|503|504|rate.limit|timeout|ECONNRESET|ETIMEDOUT/i.test(msg)
  }

  const withRetry = (m: InvokableModel) => {
    if (typeof (m as Record<string, unknown>).withRetry === 'function') {
      return (m as Record<string, unknown>).withRetry.call(m, {
        stopAfterAttempt: maxRetries,
        retryIf: retryFilter,
      }) as InvokableModel
    }
    return m
  }

  const retriedPrimary = withRetry(primary)
  if (fallbacks.length === 0) return retriedPrimary

  const retriedFallbacks = fallbacks.map(withRetry)

  if (typeof (retriedPrimary as Record<string, unknown>).withFallbacks === 'function') {
    return (retriedPrimary as Record<string, unknown>).withFallbacks.call(retriedPrimary, {
      fallbacks: retriedFallbacks,
    }) as InvokableModel
  }

  return retriedPrimary
}

function createRawCloudflareAiModel(ai: NonNullable<Env['AI']>, model: string, maxTokens: number): InvokableModel {
  return {
    async invoke(messages: BaseMessageLike[]): Promise<unknown> {
      const result = await ai.run(model, {
        messages: toCloudflareMessages(messages),
        max_tokens: maxTokens,
      })
      return new AIMessage(extractCloudflareText(result))
    },
  } as InvokableModel
}

function createRawOpenAiCompatibleModel(model: string, apiKey: string | undefined, maxTokens: number, baseURL: string): InvokableModel {
  if (!apiKey) throw new Error(`API key is missing for OpenAI-compatible provider at ${baseURL}`)
  const fields: OpenAIConstructorFields = { apiKey, maxTokens, configuration: { baseURL } }
  return new ChatOpenAI(model, asOpenAIFields(fields)) as unknown as InvokableModel
}

function createOpenAiCompatibleModel(model: string, apiKey: string | undefined, maxTokens: number, baseURL: string): ChatModel {
  if (!apiKey) throw new Error(`API key is missing for OpenAI-compatible provider at ${baseURL}`)
  const fields: OpenAIConstructorFields = { apiKey, maxTokens, configuration: { baseURL } }
  return adapt(new ChatOpenAI(model, asOpenAIFields(fields)) as unknown as InvokableModel)
}

function createCloudflareAiModel(ai: NonNullable<Env['AI']>, model: string, maxTokens: number): ChatModel {
  return {
    async invoke(messages: BaseMessageLike[]): Promise<ChatModelResponse> {
      const result = await ai.run(model, {
        messages: toCloudflareMessages(messages),
        max_tokens: maxTokens,
      })
      return new AIMessage(extractCloudflareText(result)) as unknown as ChatModelResponse
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
