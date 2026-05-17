import type { BaseMessageLike } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../../rag/model'
import type { RagRuntimeConfig } from '../../rag/state'
import { defineSyscall } from '../../agent-os/tools/define'

export interface ModelInvokeInput {
  config: RagRuntimeConfig
  stage: string
  messages: BaseMessageLike[]
  maxTokens?: number
  apiKeys?: ProviderApiKeys
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
    return invokeModel(input.config, input.stage, input.messages, input.maxTokens, input.apiKeys)
  },
})
