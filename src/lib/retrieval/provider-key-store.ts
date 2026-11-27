import { env as workerEnv } from 'cloudflare:workers'
import type { ProviderApiKeys } from './model'
import { PROVIDER_KEY_PREFIX } from '@/lib/config/settings-keys'
import { getSettings } from '@/lib/db/settings-store'
export { PROVIDER_KEY_PREFIX }

export interface ProviderSecretField {
  provider: string
  envKey: string
  label: string
  required: boolean
  sensitive: boolean
}

export const PROVIDER_SECRET_FIELDS: ProviderSecretField[] = [
  { provider: 'openai', envKey: 'OPENAI_API_KEY', label: 'OPENAI_API_KEY', required: false, sensitive: true },
  { provider: 'google', envKey: 'GOOGLE_API_KEY', label: 'GOOGLE_API_KEY', required: false, sensitive: true },
  { provider: 'gemini', envKey: 'GEMINI_API_KEY', label: 'GEMINI_API_KEY', required: false, sensitive: true },
  { provider: 'gemini', envKey: 'GOOGLE_API_KEY', label: 'GOOGLE_API_KEY', required: false, sensitive: true },
  { provider: 'anthropic', envKey: 'ANTHROPIC_API_KEY', label: 'ANTHROPIC_API_KEY', required: false, sensitive: true },
  { provider: 'openrouter', envKey: 'OPENROUTER_API_KEY', label: 'OPENROUTER_API_KEY', required: false, sensitive: true },
  { provider: 'opencode', envKey: 'OPENCODE_API_KEY', label: 'OPENCODE_API_KEY', required: false, sensitive: true },
  { provider: 'nvidia', envKey: 'NVIDIA_API_KEY', label: 'NVIDIA_API_KEY', required: false, sensitive: true },
  { provider: 'cloudflare', envKey: 'CLOUDFLARE_API_TOKEN', label: 'CLOUDFLARE_API_TOKEN', required: false, sensitive: true },
  { provider: 'cloudflare', envKey: 'CLOUDFLARE_ACCOUNT_ID', label: 'CLOUDFLARE_ACCOUNT_ID', required: false, sensitive: false },
  { provider: 'search', envKey: 'JINA_API_KEY', label: 'JINA_API_KEY', required: false, sensitive: true },
  { provider: 'search', envKey: 'JINA_SEARCH_API_KEY', label: 'JINA_SEARCH_API_KEY', required: false, sensitive: true },
  { provider: 'tavily', envKey: 'TAVILY_API_KEY', label: 'TAVILY_API_KEY', required: false, sensitive: true },
  { provider: 'firecrawl', envKey: 'FIRECRAWL_API_KEY', label: 'FIRECRAWL_API_KEY', required: false, sensitive: true },
  { provider: 'exa', envKey: 'EXA_API_KEY', label: 'EXA_API_KEY', required: false, sensitive: true },
  { provider: 'linkup', envKey: 'LINKUP_API_KEY', label: 'LINKUP_API_KEY', required: false, sensitive: true },
  { provider: 'brave', envKey: 'BRAVE_SEARCH_API_KEY', label: 'BRAVE_SEARCH_API_KEY', required: false, sensitive: true },
  { provider: 'brave', envKey: 'BRAVE_API_KEY', label: 'BRAVE_API_KEY', required: false, sensitive: true },
  { provider: 'bocha', envKey: 'BOCHA_API_KEY', label: 'BOCHA_API_KEY', required: false, sensitive: true },
  { provider: 'brightdata', envKey: 'BRIGHT_DATA_API_KEY', label: 'BRIGHT_DATA_API_KEY', required: false, sensitive: true },
  { provider: 'brightdata', envKey: 'BRIGHTDATA_API_KEY', label: 'BRIGHTDATA_API_KEY', required: false, sensitive: true },
  { provider: 'serper', envKey: 'SERPER_API_KEY', label: 'SERPER_API_KEY', required: false, sensitive: true },
  { provider: 'serpapi', envKey: 'SERPAPI_API_KEY', label: 'SERPAPI_API_KEY', required: false, sensitive: true },
]

export const UNIQUE_PROVIDER_KEYS = Array.from(new Set(PROVIDER_SECRET_FIELDS.map((item) => item.envKey)))

export function isWhitelistedProviderKey(value: string): boolean {
  return UNIQUE_PROVIDER_KEYS.includes(value)
}

type RawEnv = Record<string, string | undefined>

/** Deployed secrets whose name differs from the admin key: used when the admin key's env var is unset. */
const ENV_KEY_ALIASES: Record<string, string> = {
  OPENCODE_API_KEY: 'OPENCODE_ZEN_API_KEY',
}

export function getCurrentProviderKeyValues(rawEnv: RawEnv = workerEnv as unknown as RawEnv): ProviderApiKeys {
  const values: ProviderApiKeys = {}

  for (const key of UNIQUE_PROVIDER_KEYS) {
    const alias = ENV_KEY_ALIASES[key]
    const value = rawEnv[key] || (alias ? rawEnv[alias] : undefined)
    if (value) {
      values[key] = value
    }
  }

  return values
}

function normalizeProviderApiKeys(values: ProviderApiKeys): ProviderApiKeys {
  const normalized: ProviderApiKeys = { ...values }

  if (values.OPENAI_API_KEY && !values.openai) normalized.openai = values.OPENAI_API_KEY
  if (values.GOOGLE_API_KEY) {
    if (!values.google) normalized.google = values.GOOGLE_API_KEY
    if (!values.gemini) normalized.gemini = values.GOOGLE_API_KEY
  }
  if (values.GEMINI_API_KEY) {
    if (!values.GOOGLE_API_KEY) normalized.GOOGLE_API_KEY = values.GEMINI_API_KEY
    if (!values.google) normalized.google = values.GEMINI_API_KEY
    if (!values.gemini) normalized.gemini = values.GEMINI_API_KEY
  }
  if (values.ANTHROPIC_API_KEY && !values.anthropic) normalized.anthropic = values.ANTHROPIC_API_KEY
  if (values.OPENROUTER_API_KEY && !values.openrouter) normalized.openrouter = values.OPENROUTER_API_KEY
  if (values.NVIDIA_API_KEY && !values.nvidia) normalized.nvidia = values.NVIDIA_API_KEY
  if (!values.JINA_SEARCH_API_KEY && values.JINA_API_KEY) normalized.JINA_SEARCH_API_KEY = values.JINA_API_KEY

  return normalized
}

export async function loadProviderKeyOverrides(db?: D1Database | null): Promise<ProviderApiKeys> {
  if (!db) return {}

  try {
    const keys = UNIQUE_PROVIDER_KEYS.map((key) => `${PROVIDER_KEY_PREFIX}${key}`)
    if (keys.length === 0) return {}
    const settingsMap = await getSettings(db, keys)

    const mapped: ProviderApiKeys = {}
    for (const [key, value] of settingsMap) {
      const envKey = key.replace(PROVIDER_KEY_PREFIX, '')
      if (envKey && value) {
        mapped[envKey] = value
      }
    }
    return mapped
  } catch {
    return {}
  }
}

export async function resolveProviderApiKeys(db?: D1Database | null): Promise<ProviderApiKeys> {
  const envValues = getCurrentProviderKeyValues()
  const saved = await loadProviderKeyOverrides(db)
  const merged: ProviderApiKeys = {}

  for (const key of UNIQUE_PROVIDER_KEYS) {
    if (saved[key]) {
      merged[key] = saved[key]
      continue
    }

    if (envValues[key]) {
      merged[key] = envValues[key]
    }
  }

  return normalizeProviderApiKeys(merged)
}
