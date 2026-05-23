import type { Env } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'
import { loadFlow } from '@/lib/agent-flow/dsl/load'
import { nowMs } from '@/lib/utils/dates'

const bundledFlowModules = import.meta.glob('../../../flows/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

type ProviderSeed = {
  id: string
  category: 'llm' | 'search' | 'reader' | 'knowledge' | 'action'
  name: string
  enabled: (env: Env) => boolean
  capabilities?: Record<string, unknown>
  costModel?: Record<string, unknown>
  outboundDomains?: string[]
}

const PROVIDER_SEEDS: ProviderSeed[] = [
  {
    id: 'openai',
    category: 'llm',
    name: 'OpenAI',
    enabled: (env) => readFlags(env).providers.llm.openai,
    capabilities: { chat: true, structuredOutput: true },
    outboundDomains: ['api.openai.com'],
  },
  {
    id: 'anthropic',
    category: 'llm',
    name: 'Anthropic',
    enabled: (env) => readFlags(env).providers.llm.anthropic,
    capabilities: { chat: true },
    outboundDomains: ['api.anthropic.com'],
  },
  {
    id: 'gemini',
    category: 'llm',
    name: 'Google Gemini',
    enabled: (env) => readFlags(env).providers.llm.gemini,
    capabilities: { chat: true, structuredOutput: true },
    outboundDomains: ['generativelanguage.googleapis.com'],
  },
  {
    id: 'groq',
    category: 'llm',
    name: 'Groq',
    enabled: (env) => readFlags(env).providers.llm.groq,
    capabilities: { chat: true },
    outboundDomains: ['api.groq.com'],
  },
  {
    id: 'openrouter',
    category: 'llm',
    name: 'OpenRouter',
    enabled: (env) => readFlags(env).providers.llm.openrouter,
    capabilities: { chat: true, routing: true },
    outboundDomains: ['openrouter.ai'],
  },
  {
    id: 'tavily',
    category: 'search',
    name: 'Tavily Search',
    enabled: (env) => readFlags(env).providers.search.tavily,
    capabilities: { search: true },
    outboundDomains: ['api.tavily.com'],
  },
  {
    id: 'exa',
    category: 'search',
    name: 'Exa Search',
    enabled: (env) => readFlags(env).providers.search.exa,
    capabilities: { search: true },
    outboundDomains: ['api.exa.ai'],
  },
  {
    id: 'jina-search',
    category: 'search',
    name: 'Jina Search',
    enabled: (env) => readFlags(env).providers.search.jina,
    capabilities: { search: true },
    outboundDomains: ['s.jina.ai'],
  },
  {
    id: 'jina-reader',
    category: 'reader',
    name: 'Jina Reader',
    enabled: (env) => readFlags(env).providers.reader.jinaReader,
    capabilities: { readUrl: true },
    outboundDomains: ['r.jina.ai'],
  },
  {
    id: 'direct-fetch',
    category: 'reader',
    name: 'Direct Fetch',
    enabled: (env) => readFlags(env).providers.reader.directFetch,
    capabilities: { readUrl: true },
  },
  {
    id: 'vectorize',
    category: 'knowledge',
    name: 'Cloudflare Vectorize',
    enabled: () => true,
    capabilities: { retrieval: true },
  },
  {
    id: 'workers-ai',
    category: 'llm',
    name: 'Cloudflare Workers AI',
    enabled: () => true,
    capabilities: { chat: true, embeddings: true },
  },
]

let bootstrapped = false

export async function ensureConsoleBootstrap(env: Env): Promise<void> {
  if (bootstrapped) return
  bootstrapped = true

  await Promise.all([
    ensureProviderDefinitions(env).catch(() => undefined),
    ensureBundledFlows(env).catch(() => undefined),
  ])
}

async function ensureProviderDefinitions(env: Env): Promise<void> {
  const db = env.DB
  const table = await db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'provider_definitions' LIMIT 1`)
    .first<{ name: string }>()
  if (!table) return

  const count = await db
    .prepare(`SELECT COUNT(*) AS total FROM provider_definitions`)
    .first<{ total: number }>()

  const shouldInsertAll = (count?.total ?? 0) === 0
  const now = nowMs()

  for (const seed of PROVIDER_SEEDS) {
    const enabled = seed.enabled(env) ? 1 : 0
    const existing = shouldInsertAll
      ? null
      : await db
          .prepare(`SELECT provider_id FROM provider_definitions WHERE provider_id = ? LIMIT 1`)
          .bind(seed.id)
          .first<{ provider_id: string }>()

    if (existing) {
      await db
        .prepare(`UPDATE provider_definitions SET is_enabled = ?, updated_at = ? WHERE provider_id = ?`)
        .bind(enabled, now, seed.id)
        .run()
      continue
    }

    await db
      .prepare(
        `INSERT INTO provider_definitions
         (provider_id, category, display_name, capability_json, cost_model_json, outbound_domains_json, is_enabled, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        seed.id,
        seed.category,
        seed.name,
        JSON.stringify(seed.capabilities ?? {}),
        JSON.stringify(seed.costModel ?? {}),
        JSON.stringify(seed.outboundDomains ?? []),
        enabled,
        now,
        now,
      )
      .run()
  }
}

async function ensureBundledFlows(env: Env): Promise<void> {
  const db = env.DB
  const table = await db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'flow_definitions' LIMIT 1`)
    .first<{ name: string }>()
  if (!table) return

  const now = nowMs()
  for (const yamlSource of Object.values(bundledFlowModules)) {
    const raw = loadFlow(yamlSource, 'yaml') as Record<string, unknown>
    const flowId = typeof raw.id === 'string' ? raw.id : ''
    if (!flowId) continue

    const existing = await db
      .prepare(`SELECT flow_id FROM flow_definitions WHERE flow_id = ? LIMIT 1`)
      .bind(flowId)
      .first<{ flow_id: string }>()
    if (existing) continue

    const version = typeof raw.version === 'number' ? raw.version : 1
    await db.batch([
      db
        .prepare(
          `INSERT INTO flow_definitions
           (flow_id, display_name, description, current_version, definition_yaml, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          flowId,
          typeof raw.name === 'string' ? raw.name : flowId,
          typeof raw.description === 'string' ? raw.description : null,
          version,
          yamlSource,
          now,
          now,
        ),
      db
        .prepare(
          `INSERT OR IGNORE INTO flow_versions
           (flow_id, version, definition_yaml, compiled_json, published_at, published_by)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(flowId, version, yamlSource, JSON.stringify(raw), now, 'bundle'),
    ])
  }
}
