export const SUPPORTED_PROVIDERS = [
  'openai',
  'google',
  'anthropic',
  'gemini',
  'cloudflare',
  'nvidia',
  'openrouter',
  'opencode',
] as const

export type RagProvider = (typeof SUPPORTED_PROVIDERS)[number]
