import { env as workerEnv } from 'cloudflare:workers'
import type { ProviderApiKeys } from './model'

export interface ProviderSecretField {
  provider: string
  envKey: string
  label: string
  required: boolean
  sensitive: boolean
}

export const PROVIDER_KEY_PREFIX = 'provider_key:'

export const PROVIDER_SECRET_FIELDS: ProviderSecretField[] = [
  { provider: 'groq', envKey: 'GROQ_API_KEY', label: 'GROQ_API_KEY', required: false, sensitive: true },
  { provider: 'openai', envKey: 'OPENAI_API_KEY', label: 'OPENAI_API_KEY', required: false, sensitive: true },
  { provider: 'google', envKey: 'GOOGLE_API_KEY', label: 'GOOGLE_API_KEY', required: false, sensitive: true },
  { provider: 'gemini', envKey: 'GOOGLE_API_KEY', label: 'GOOGLE_API_KEY', required: false, sensitive: true },
  { provider: 'anthropic', envKey: 'ANTHROPIC_API_KEY', label: 'ANTHROPIC_API_KEY', required: false, sensitive: true },
  { provider: 'openrouter', envKey: 'OPENROUTER_API_KEY', label: 'OPENROUTER_API_KEY', required: false, sensitive: true },
  { provider: 'nvidia', envKey: 'NVIDIA_API_KEY', label: 'NVIDIA_API_KEY', required: false, sensitive: true },
  { provider: 'cerebras', envKey: 'CEREBRAS_API_KEY', label: 'CEREBRAS_API_KEY', required: false, sensitive: true },
  { provider: 'cloudflare', envKey: 'CLOUDFLARE_API_TOKEN', label: 'CLOUDFLARE_API_TOKEN', required: false, sensitive: true },
  { provider: 'cloudflare', envKey: 'CLOUDFLARE_ACCOUNT_ID', label: 'CLOUDFLARE_ACCOUNT_ID', required: false, sensitive: false },
  { provider: 'ollama_cloud', envKey: 'OLLAMA_API_KEY', label: 'OLLAMA_API_KEY', required: false, sensitive: true },
  { provider: 'ollama', envKey: 'OLLAMA_API_BASE', label: 'OLLAMA_API_BASE', required: false, sensitive: false },
  { provider: 'ollama', envKey: 'OLLAMA_HOST', label: 'OLLAMA_HOST', required: false, sensitive: false },
  { provider: 'ollama', envKey: 'OLLAMA_URL', label: 'OLLAMA_URL', required: false, sensitive: false },
  { provider: 'search', envKey: 'JINA_API_KEY', label: 'JINA_API_KEY', required: false, sensitive: true },
  { provider: 'search', envKey: 'JINA_SEARCH_API_KEY', label: 'JINA_SEARCH_API_KEY', required: false, sensitive: true },
]

export const UNIQUE_PROVIDER_KEYS = Array.from(new Set(PROVIDER_SECRET_FIELDS.map((item) => item.envKey)))

export function isWhitelistedProviderKey(value: string): boolean {
  return UNIQUE_PROVIDER_KEYS.includes(value)
}

type RawEnv = Record<string, string | undefined>

export function getCurrentProviderKeyValues(rawEnv: RawEnv = workerEnv as unknown as RawEnv): ProviderApiKeys {
  const values: ProviderApiKeys = {}

  for (const key of UNIQUE_PROVIDER_KEYS) {
    const value = rawEnv[key]
    if (value) {
      values[key] = value
    }
  }

  return values
}

function normalizeProviderApiKeys(values: ProviderApiKeys): ProviderApiKeys {
  const normalized: ProviderApiKeys = { ...values }

  if (values.GROQ_API_KEY && !values.groq) normalized.groq = values.GROQ_API_KEY
  if (values.OPENAI_API_KEY && !values.openai) normalized.openai = values.OPENAI_API_KEY
  if (values.GOOGLE_API_KEY) {
    if (!values.google) normalized.google = values.GOOGLE_API_KEY
    if (!values.gemini) normalized.gemini = values.GOOGLE_API_KEY
  }
  if (values.ANTHROPIC_API_KEY && !values.anthropic) normalized.anthropic = values.ANTHROPIC_API_KEY
  if (values.OPENROUTER_API_KEY && !values.openrouter) normalized.openrouter = values.OPENROUTER_API_KEY
  if (values.NVIDIA_API_KEY && !values.nvidia) normalized.nvidia = values.NVIDIA_API_KEY
  if (values.CEREBRAS_API_KEY && !values.cerebras) normalized.cerebras = values.CEREBRAS_API_KEY
  if (values.OLLAMA_API_KEY && !values.ollama) normalized.ollama = values.OLLAMA_API_KEY
  if (values.OLLAMA_API_KEY && !values.ollama_cloud) normalized.ollama_cloud = values.OLLAMA_API_KEY
  if (!values.JINA_SEARCH_API_KEY && values.JINA_API_KEY) normalized.JINA_SEARCH_API_KEY = values.JINA_API_KEY

  return normalized
}

export async function loadProviderKeyOverrides(db?: D1Database | null): Promise<ProviderApiKeys> {
  if (!db) return {}

  try {
    const keys = UNIQUE_PROVIDER_KEYS.map((key) => `${PROVIDER_KEY_PREFIX}${key}`)
    if (keys.length === 0) return {}
    const rows = await db.prepare(`SELECT key, value FROM settings WHERE key IN (${keys.map(() => '?').join(',')})`)
      .bind(...keys)
      .all<{ key: string; value: string }>()

    const mapped: ProviderApiKeys = {}
    for (const row of rows.results || []) {
      const envKey = row.key.replace(PROVIDER_KEY_PREFIX, '')
      if (envKey && row.value) {
        mapped[envKey] = row.value
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
