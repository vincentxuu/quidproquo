import { ChatAnthropic } from '@langchain/anthropic'
import { env } from 'cloudflare:workers'

export function createAnthropicModel(maxTokens = 512) {
  const apiKey = (env as unknown as { ANTHROPIC_API_KEY: string }).ANTHROPIC_API_KEY
  return new ChatAnthropic({ model: 'claude-sonnet-4-6', apiKey, maxTokens })
}
