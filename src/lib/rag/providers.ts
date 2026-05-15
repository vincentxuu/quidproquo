export const SUPPORTED_RAG_PROVIDERS = [
  'groq',
  'openai',
  'google',
  'anthropic',
  'gemini',
  'cloudflare',
  'nvidia',
  'cerebras',
  'openrouter',
  'ollama_cloud',
  'ollama',
] as const

export type RagProvider = (typeof SUPPORTED_RAG_PROVIDERS)[number]
