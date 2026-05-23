import type { BaseMessageLike } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../../rag/model'
import type { RagRuntimeConfig } from '../../rag/state'
import { defineSyscall } from '../../agent-os/tools/define'
import type { Flags } from '../../config/flags'
import { listByCategory } from '../../agent-providers/registry'
import { routeWithFallback } from '../../agent-providers/routing-fallback'
import { createInMemoryProviderBackends } from '../../agent-providers/storage/test/in-memory'

export interface ModelInvokeInput {
  config: RagRuntimeConfig
  stage: string
  messages: BaseMessageLike[]
  maxTokens?: number
  apiKeys?: ProviderApiKeys
  flags?: Flags
}

export const modelInvokeSyscall = defineSyscall<ModelInvokeInput, Awaited<ReturnType<typeof invokeModel>>>({
  name: 'model.invoke',
  description: 'Invoke the configured chat model for an agent stage.',
  inputSchema: {
    type: 'object',
    required: ['config', 'stage', 'messages'],
    properties: {
      config: { type: 'object', additionalProperties: true },
      stage: { type: 'string' },
      messages: { type: 'array', items: { type: 'object', additionalProperties: true } },
      maxTokens: { type: 'number' },
      apiKeys: { type: 'object', additionalProperties: { type: 'string' } },
      flags: { type: 'object', additionalProperties: true },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['response', 'route'],
    properties: {
      response: { type: 'object', additionalProperties: true },
      route: { type: 'object', additionalProperties: true },
      tokens: { type: 'object', additionalProperties: true },
    },
  },
  costModel: { kind: 'token', inputPerKToken: 0, outputPerKToken: 0 },
  async handler(_ctx, input) {
    const { config, stage, messages, maxTokens, apiKeys, flags } = input

    // Route through providers registry when enabled and at least one LLM provider flag is on
    if (
      flags?.providers?.enabled &&
      (flags.providers.llm.openai ||
        flags.providers.llm.groq ||
        flags.providers.llm.anthropic ||
        flags.providers.llm.gemini ||
        flags.providers.llm.openrouter)
    ) {
      const registeredLlmProviders = listByCategory('llm').filter((p) => p.isEnabled)
      if (registeredLlmProviders.length > 0) {
        try {
          const backends = createInMemoryProviderBackends()
          const result = await routeWithFallback({
            category: 'llm',
            input: { config, stage, messages, maxTokens, apiKeys },
            policy: { order: registeredLlmProviders.map((p) => p.providerId) },
            backends,
            dispatch: async (_providerId, inp) => {
              const i = inp as ModelInvokeInput
              return invokeModel(i.config, i.stage, i.messages, i.maxTokens, i.apiKeys)
            },
            flags,
          })
          return result as Awaited<ReturnType<typeof invokeModel>>
        } catch (e) {
          // Fall through to legacy path on routing failure
          console.warn('[model-invoke] providers routing failed, falling back to legacy:', e)
        }
      }
    }

    return invokeModel(config, stage, messages, maxTokens, apiKeys)
  },
})
