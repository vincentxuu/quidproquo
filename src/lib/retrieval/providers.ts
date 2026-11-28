export const SUPPORTED_PROVIDERS = [
  'openai',
  'google',
  'anthropic',
  'gemini',
  'cloudflare',
  'nvidia',
  'openrouter',
  'opencode',
  'runcrate',
  'zai',
] as const

export type RagProvider = (typeof SUPPORTED_PROVIDERS)[number]
