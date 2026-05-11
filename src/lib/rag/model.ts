import { ChatGroq } from '@langchain/groq'
import { env } from 'cloudflare:workers'

type Env = {
  GROQ_API_KEY?: string
}

// Active provider: groq (llama-3.3-70b-versatile)
// To switch providers, add the relevant @langchain/* package and update this file.
export function createModel(maxTokens = 512) {
  const e = env as unknown as Env
  return new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    apiKey: e.GROQ_API_KEY,
    maxTokens,
  })
}
