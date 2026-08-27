export const SUPPORTED_PROVIDERS = [
  'groq',
  'openai',
  'google',
  'anthropic',
  'gemini',
  'cloudflare',
  'nvidia',
  'cerebras',
  'openrouter',
  'opencode',
  'ollama_cloud',
  'ollama',
] as const

export type RagProvider = (typeof SUPPORTED_PROVIDERS)[number]
