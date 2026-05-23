import { register } from '../../registry'
import type { ProviderDefinition } from '../../types'

const LLM_PROVIDERS: ProviderDefinition[] = [
  {
    providerId: 'llm.openai',
    category: 'llm',
    displayName: 'OpenAI',
    capabilityJson: {
      maxContextTokens: 128000,
      supportsStreaming: true,
      supportsTools: true,
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    },
    costModelJson: { kind: 'token', inputPer1MUsd: 2.5, outputPer1MUsd: 10.0 },
    outboundDomains: ['api.openai.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'llm.anthropic',
    category: 'llm',
    displayName: 'Anthropic',
    capabilityJson: {
      maxContextTokens: 200000,
      supportsStreaming: true,
      supportsTools: true,
      models: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    },
    costModelJson: { kind: 'token', inputPer1MUsd: 3.0, outputPer1MUsd: 15.0 },
    outboundDomains: ['api.anthropic.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'llm.gemini',
    category: 'llm',
    displayName: 'Google Gemini',
    capabilityJson: {
      maxContextTokens: 1000000,
      supportsStreaming: true,
      supportsTools: true,
      models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    },
    costModelJson: { kind: 'token', inputPer1MUsd: 0.075, outputPer1MUsd: 0.3 },
    outboundDomains: ['generativelanguage.googleapis.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'llm.groq',
    category: 'llm',
    displayName: 'Groq',
    capabilityJson: {
      maxContextTokens: 32768,
      supportsStreaming: true,
      supportsTools: true,
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    },
    costModelJson: { kind: 'token', inputPer1MUsd: 0.59, outputPer1MUsd: 0.79 },
    outboundDomains: ['api.groq.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'llm.openrouter',
    category: 'llm',
    displayName: 'OpenRouter',
    capabilityJson: {
      maxContextTokens: 200000,
      supportsStreaming: true,
      supportsTools: true,
      models: ['openrouter/auto'],
    },
    costModelJson: { kind: 'token', inputPer1MUsd: 1.0, outputPer1MUsd: 3.0 },
    outboundDomains: ['openrouter.ai'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
]

export function registerDefaultLlmProviders(): void {
  for (const provider of LLM_PROVIDERS) {
    register(provider)
  }
}
