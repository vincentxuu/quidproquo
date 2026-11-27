import { env as workerEnv } from 'cloudflare:workers'
import type { ProviderApiKeys } from './model'
import { PROVIDER_KEY_PREFIX } from '@/lib/config/settings-keys'
import { getSettings, listSettings } from '@/lib/db/settings-store'
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
  { provider: 'runcrate', envKey: 'RUNCRATE_API_KEY', label: 'RUNCRATE_API_KEY', required: false, sensitive: true },
  { provider: 'zai', envKey: 'ZAI_API_KEY', label: 'ZAI_API_KEY', required: false, sensitive: true },
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
  if (values.RUNCRATE_API_KEY && !values.runcrate) normalized.runcrate = values.RUNCRATE_API_KEY
  if (values.ZAI_API_KEY && !values.zai) normalized.zai = values.ZAI_API_KEY
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

// ── Multiple keys per LLM provider ──
// Key 1 is the existing `provider_key:<NAME>` row; extra keys are `provider_key:<NAME>#2` … `#10`.
// The env var, when set and different from every saved key, is tried last.

export const MAX_PROVIDER_KEYS = 10

/** Secret names each LLM provider reads its API key from, in the order model.ts prefers them. */
export const PROVIDER_KEY_NAMES: Record<string, readonly string[]> = {
  openai: ['OPENAI_API_KEY'],
  google: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
  gemini: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
  anthropic: ['ANTHROPIC_API_KEY'],
  openrouter: ['OPENROUTER_API_KEY'],
  opencode: ['OPENCODE_API_KEY'],
  nvidia: ['NVIDIA_API_KEY'],
  runcrate: ['RUNCRATE_API_KEY'],
  zai: ['ZAI_API_KEY'],
}

/** Secrets that may hold more than one key. Cloudflare's token is paired with one account id, so it stays single. */
export const MULTI_KEY_SECRET_NAMES: ReadonlySet<string> = new Set(Object.values(PROVIDER_KEY_NAMES).flat())

/** Ordered keys per secret name; index 0 is the key `apiKeys.<NAME>` resolves to. */
export type ProviderApiKeyLists = Record<string, string[]>

/**
 * Parses an admin secret name: `<NAME>` is key 1 of a known secret, `<NAME>#<n>` (n = 2..10) an
 * extra key of a multi-key secret. Anything else is rejected.
 */
export function parseProviderSecretName(value: string): { name: string; slot: number } | null {
  if (isWhitelistedProviderKey(value)) return { name: value, slot: 1 }
  const match = /^([A-Z0-9_]+)#([2-9]|10)$/.exec(value)
  if (!match || !MULTI_KEY_SECRET_NAMES.has(match[1])) return null
  return { name: match[1], slot: Number(match[2]) }
}

export function providerSecretName(name: string, slot: number): string {
  return slot === 1 ? name : `${name}#${slot}`
}

/** Saved admin keys by secret name and slot (1-based). */
export type ProviderKeySlots = Record<string, Record<number, string>>

export async function loadProviderKeySlots(db?: D1Database | null): Promise<ProviderKeySlots> {
  if (!db) return {}
  try {
    const rows = await listSettings(db, PROVIDER_KEY_PREFIX)
    const slots: ProviderKeySlots = {}
    for (const row of rows) {
      if (!row.key.startsWith(PROVIDER_KEY_PREFIX) || !row.value) continue
      const parsed = parseProviderSecretName(row.key.slice(PROVIDER_KEY_PREFIX.length))
      if (!parsed) continue
      ;(slots[parsed.name] ??= {})[parsed.slot] = row.value
    }
    return slots
  } catch {
    return {}
  }
}

/** Saved keys in slot order, then the env value when it is not already among them. */
export function buildProviderKeyLists(saved: ProviderKeySlots, envValues: ProviderApiKeys): ProviderApiKeyLists {
  const lists: ProviderApiKeyLists = {}
  for (const name of UNIQUE_PROVIDER_KEYS) {
    const slots = saved[name] ?? {}
    const ordered = Object.keys(slots).map(Number).sort((a, b) => a - b).map((slot) => slots[slot])
    const keys = MULTI_KEY_SECRET_NAMES.has(name) ? ordered : ordered.slice(0, 1)
    const envValue = envValues[name]
    // A single-key secret keeps the old rule: a saved value replaces the env var.
    if (envValue && !keys.includes(envValue) && (keys.length === 0 || MULTI_KEY_SECRET_NAMES.has(name))) keys.push(envValue)
    const unique = Array.from(new Set(keys))
    if (unique.length > 0) lists[name] = unique
  }
  return lists
}

/** Every key a provider can be called with, in try order. Empty for providers without an API key (Workers AI). */
export function providerKeyList(lists: ProviderApiKeyLists, provider: string): string[] {
  const names = PROVIDER_KEY_NAMES[provider] ?? []
  return Array.from(new Set(names.flatMap((name) => lists[name] ?? [])))
}

/** `apiKeys` with every field the provider's client reads set to `key`. */
export function withProviderKey(apiKeys: ProviderApiKeys, provider: string, key: string): ProviderApiKeys {
  const names = PROVIDER_KEY_NAMES[provider]
  if (!names) return apiKeys
  const next: ProviderApiKeys = { ...apiKeys, [provider]: key }
  for (const name of names) next[name] = key
  if (provider === 'google' || provider === 'gemini') {
    next.google = key
    next.gemini = key
  }
  return next
}

export async function resolveProviderKeySets(db?: D1Database | null): Promise<{ apiKeys: ProviderApiKeys; keyLists: ProviderApiKeyLists }> {
  const keyLists = buildProviderKeyLists(await loadProviderKeySlots(db), getCurrentProviderKeyValues())
  const first: ProviderApiKeys = {}
  for (const [name, keys] of Object.entries(keyLists)) first[name] = keys[0]
  return { apiKeys: normalizeProviderApiKeys(first), keyLists }
}

/** Key 1 of each secret (saved value first, env var otherwise). */
export async function resolveProviderApiKeys(db?: D1Database | null): Promise<ProviderApiKeys> {
  return (await resolveProviderKeySets(db)).apiKeys
}
