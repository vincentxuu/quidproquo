// Cloudflare Workflows entrypoint for agent-flow durable execution.
// Each flow step becomes a Workflow step.do() with built-in retries + checkpoint.

// @ts-ignore — cloudflare:workers types are runtime-only
import { WorkflowEntrypoint } from 'cloudflare:workers'
import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers'
import type { Env } from '../lib/config/env'

const PROVIDER_KEY_PREFIX = 'provider_key:'
const PROVIDER_ENV_KEYS = [
  'GROQ_API_KEY', 'OPENAI_API_KEY', 'OPENROUTER_API_KEY', 'NVIDIA_API_KEY',
  'CEREBRAS_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY',
  'OPENCODE_ZEN_API_KEY', 'OLLAMA_API_KEY', 'OLLAMA_CLOUD_API_KEY',
  'TAVILY_API_KEY', 'EXA_API_KEY', 'JINA_API_KEY', 'JINA_SEARCH_API_KEY',
  'FIRECRAWL_API_KEY', 'LINKUP_API_KEY', 'BRAVE_SEARCH_API_KEY', 'SERPER_API_KEY',
]

interface FlowWorkflowParams {
  flowId: string
  flowRunId: string
  input: Record<string, unknown>
  model?: string
}

interface ParsedStep {
  id: string
  type: string
  prompt?: string
  model?: string
  maxTokens?: number
  search?: boolean | string
  tools?: string[]
  branches?: ParsedStep[]
  merge?: string
  [key: string]: unknown
}

// ── LLM Providers ──────────────────────────────────────────────────────────

interface ProviderConfig {
  baseUrl: string
  envKey: string
}

const LLM_PROVIDERS: Record<string, ProviderConfig> = {
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', envKey: 'OPENROUTER_API_KEY' },
  opencode: { baseUrl: 'https://opencode.ai/zen/v1', envKey: 'OPENCODE_ZEN_API_KEY' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', envKey: 'GROQ_API_KEY' },
  openai: { baseUrl: 'https://api.openai.com/v1', envKey: 'OPENAI_API_KEY' },
  nvidia: { baseUrl: 'https://integrate.api.nvidia.com/v1', envKey: 'NVIDIA_API_KEY' },
  cerebras: { baseUrl: 'https://api.cerebras.ai/v1', envKey: 'CEREBRAS_API_KEY' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1', envKey: 'ANTHROPIC_API_KEY' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', envKey: 'GEMINI_API_KEY' },
}

function parseModelSpec(spec: string): { provider: string; model: string } {
  const slash = spec.indexOf('/')
  if (slash === -1) return { provider: spec, model: '' }
  const provider = spec.slice(0, slash)
  if (LLM_PROVIDERS[provider]) return { provider, model: spec.slice(slash + 1) }
  return { provider: 'openrouter', model: spec }
}

async function callLlm(
  env: Record<string, string>,
  modelSpec: string,
  prompt: string,
  maxTokens: number,
  systemPrompt = 'You are a research assistant. Return structured JSON when asked.',
): Promise<{ content: string; model: string; tokens?: unknown }> {
  const { provider, model } = parseModelSpec(modelSpec)
  const config = LLM_PROVIDERS[provider]
  if (!config) throw new Error(`Unknown LLM provider: ${provider}. Available: ${Object.keys(LLM_PROVIDERS).join(', ')}`)
  if (!model) throw new Error(`No model specified. Use: provider/model (e.g. openrouter/qwen/qwen3.8-27b)`)

  const apiKey = env[config.envKey]
  if (!apiKey) throw new Error(`${config.envKey} not set`)

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`LLM ${res.status}: ${body.slice(0, 500)}`)
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>
    model: string
    usage?: unknown
  }
  const raw = data.choices?.[0]?.message?.content ?? ''
  const { normalizeAnswerLanguage } = await import('../lib/rag/language')
  return {
    content: normalizeAnswerLanguage(raw, 'zh-TW'),
    model: data.model,
    tokens: data.usage,
  }
}

// ── Search Providers ───────────────────────────────────────────────────────

interface SearchConfig {
  envKey: string
  search: (apiKey: string, query: string, maxResults: number) => Promise<SearchResult[]>
}

interface SearchResult {
  title: string
  url: string
  snippet: string
  provider: string
}

const SEARCH_PROVIDERS: Record<string, SearchConfig> = {
  tavily: {
    envKey: 'TAVILY_API_KEY',
    search: async (apiKey, query, maxResults) => {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ query, max_results: maxResults }),
      })
      if (!res.ok) throw new Error(`Tavily ${res.status}`)
      const data = await res.json() as { results: Array<{ title: string; url: string; content: string }> }
      return (data.results ?? []).map(r => ({ title: r.title, url: r.url, snippet: r.content, provider: 'tavily' }))
    },
  },
  exa: {
    envKey: 'EXA_API_KEY',
    search: async (apiKey, query, maxResults) => {
      const res = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ query, num_results: maxResults, use_autoprompt: true }),
      })
      if (!res.ok) throw new Error(`Exa ${res.status}`)
      const data = await res.json() as { results: Array<{ title: string; url: string; text?: string }> }
      return (data.results ?? []).map(r => ({ title: r.title, url: r.url, snippet: r.text ?? '', provider: 'exa' }))
    },
  },
  jina: {
    envKey: 'JINA_API_KEY',
    search: async (apiKey, query, maxResults) => {
      const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json', 'X-Max-Results': String(maxResults) },
      })
      if (!res.ok) throw new Error(`Jina ${res.status}`)
      const data = await res.json() as { data: Array<{ title: string; url: string; description: string }> }
      return (data.data ?? []).map(r => ({ title: r.title, url: r.url, snippet: r.description, provider: 'jina' }))
    },
  },
}

async function callSearch(env: Record<string, string>, query: string, maxResults = 5, preferProvider?: string): Promise<SearchResult[]> {
  const tryOrder = preferProvider && SEARCH_PROVIDERS[preferProvider]
    ? [preferProvider, ...Object.keys(SEARCH_PROVIDERS).filter(k => k !== preferProvider)]
    : Object.keys(SEARCH_PROVIDERS)

  for (const id of tryOrder) {
    const config = SEARCH_PROVIDERS[id]
    const apiKey = env[config.envKey]
    if (!apiKey) continue
    try {
      return await config.search(apiKey, query, maxResults)
    } catch {
      continue
    }
  }
  return []
}

function formatSearchResults(results: SearchResult[]): string {
  if (!results.length) return ''
  return results.map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.snippet}`).join('\n\n')
}

// ── Workflow ───────────────────────────────────────────────────────────────

const STEP_RETRY = {
  limit: 3,
  delay: '5 seconds' as const,
  backoff: 'exponential' as const,
}

export class AgentFlowWorkflow extends WorkflowEntrypoint<Env, FlowWorkflowParams> {
  async run(event: WorkflowEvent<FlowWorkflowParams>, step: WorkflowStep): Promise<void> {
    const { flowId, flowRunId, input, model: modelOverride } = event.payload
    const db = this.env.DB

    const apiKeys = await step.do('resolve-keys', { retries: STEP_RETRY }, async () => {
      const envRecord = this.env as unknown as Record<string, string>
      const merged: Record<string, string> = {}
      for (const key of PROVIDER_ENV_KEYS) {
        if (envRecord[key]) merged[key] = envRecord[key]
      }
      try {
        const dbKeys = PROVIDER_ENV_KEYS.map(k => `${PROVIDER_KEY_PREFIX}${k}`)
        const rows = await db.prepare(
          `SELECT key, value FROM settings WHERE key IN (${dbKeys.map(() => '?').join(',')})`
        ).bind(...dbKeys).all<{ key: string; value: string }>()
        for (const row of rows.results || []) {
          const envKey = row.key.replace(PROVIDER_KEY_PREFIX, '')
          if (envKey && row.value) merged[envKey] = row.value
        }
      } catch { /* D1 settings table may not exist */ }
      return merged
    })

    const envRecord = apiKeys as Record<string, string>

    const flowDef = await step.do('load-definition', { retries: STEP_RETRY }, async () => {
      const row = await db
        .prepare('SELECT definition_yaml FROM flow_definitions WHERE flow_id=? LIMIT 1')
        .bind(flowId)
        .first<{ definition_yaml: string }>()
      if (!row) throw new Error(`Flow ${flowId} not found`)
      const { parse } = await import('yaml')
      return parse(row.definition_yaml)
    }) as { steps: Record<string, ParsedStep>; edges: Array<{ from: string; to: string }> }

    await step.do('mark-running', { retries: STEP_RETRY }, async () => {
      await db.prepare(`UPDATE flow_runs SET status='running', updated_at=? WHERE flow_run_id=?`).bind(Date.now(), flowRunId).run()
    })

    const steps = Object.entries(flowDef.steps).map(([id, cfg]) => ({
      ...cfg, id, type: cfg.kind ?? cfg.type,
    })) as ParsedStep[]
    const ordered = topoSort(steps, flowDef.edges ?? [])

    const stepResults: Record<string, unknown> = {}
    const startedAt = Date.now()

    for (const s of ordered) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- executeFlowStep returns unknown; Serializable<unknown> is unsatisfiable
      const result = await (step as any).do(`step:${s.id}`, {
        retries: STEP_RETRY,
        timeout: '3 minutes',
      }, async () => {
        return executeFlowStep(s, envRecord, input, stepResults, modelOverride)
      })
      stepResults[s.id] = result

      await step.do(`record:${s.id}`, { retries: STEP_RETRY }, async () => {
        const now = Date.now()
        await db.prepare(
          `INSERT INTO flow_step_runs (step_run_id, flow_run_id, step_id, step_order, step_type, status, outputs_json, started_at, finished_at, latency_ms, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 'done', ?, ?, ?, ?, ?, ?)`
        ).bind(crypto.randomUUID(), flowRunId, s.id, ordered.indexOf(s), s.type, JSON.stringify(result), startedAt, now, now - startedAt, now, now).run()
      })
    }

    await step.do('mark-done', { retries: STEP_RETRY }, async () => {
      const now = Date.now()
      await db.prepare(
        `UPDATE flow_runs SET status='done', output_json=?, finished_at=?, latency_ms=?, updated_at=? WHERE flow_run_id=?`
      ).bind(JSON.stringify(stepResults), now, now - startedAt, now, flowRunId).run()
    })
  }
}

// ── Step execution ─────────────────────────────────────────────────────────

function buildContext(prevResults: Record<string, unknown>): string {
  const parts: string[] = []
  for (const [stepId, result] of Object.entries(prevResults)) {
    if (!result || typeof result !== 'object') continue
    const r = result as Record<string, unknown>
    if (r.branches) {
      const branches = r.branches as Array<Record<string, unknown>>
      const contents = branches.filter(b => b.content).map(b => `[${b.id}]\n${String(b.content).slice(0, 1500)}`)
      if (contents.length) parts.push(`## ${stepId}\n${contents.join('\n\n')}`)
    } else if (r.content) {
      parts.push(`## ${stepId}\n${String(r.content).slice(0, 2000)}`)
    }
  }
  return parts.length ? `\n\n--- Previous step results ---\n${parts.join('\n\n')}` : ''
}

async function executeFlowStep(
  s: ParsedStep,
  env: Record<string, string>,
  input: Record<string, unknown>,
  prevResults: Record<string, unknown>,
  modelOverride?: string,
): Promise<unknown> {
  if (s.type === 'parallel' && s.branches) {
    const results = []
    for (let i = 0; i < s.branches.length; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 4000))
      const branch = s.branches[i]
      if (branch.type === 'agent' && branch.prompt && (branch.model || modelOverride)) {
        try {
          let searchContext = ''
          if (branch.search) {
            const provider = typeof branch.search === 'string' ? branch.search : undefined
            const searchResults = await callSearch(env, branch.prompt.slice(0, 200), 5, provider)
            searchContext = formatSearchResults(searchResults)
          }
          const prompt = searchContext ? `${branch.prompt}\n\n--- Web search results ---\n${searchContext}` : branch.prompt
          const r = await callLlm(env, modelOverride ?? branch.model!, prompt, branch.maxTokens ?? 2000)
          const isEmpty = !r.content || r.content.trim() === '' || r.content.trim() === '[]' || r.content.trim() === '{}'
            || r.content.trim() === '```json\n[]\n```' || r.content.trim() === '```json\n{}\n```'
          results.push({ id: branch.id, status: isEmpty ? 'empty' : 'ok', ...r })
        } catch (err) {
          results.push({ id: branch.id, status: 'error', error: String(err) })
        }
      } else {
        results.push({ id: branch.id, stubbed: true })
      }
    }
    return { branches: results }
  }

  if (s.type === 'agent' && s.prompt && (s.model || modelOverride)) {
    const context = buildContext(prevResults)
    let searchContext = ''
    if (s.search) {
      const provider = typeof s.search === 'string' ? s.search : undefined
      const searchResults = await callSearch(env, s.prompt.slice(0, 200), 5, provider)
      searchContext = formatSearchResults(searchResults)
    }
    const parts = [s.prompt, context, searchContext ? `\n--- Web search results ---\n${searchContext}` : ''].filter(Boolean)
    return callLlm(env, modelOverride ?? s.model!, parts.join('\n'), s.maxTokens ?? 2000)
  }

  if (s.type === 'tool_group') return { stubbed: true, tools: s.tools ?? [] }
  if (s.type === 'artifact') return { artifactId: crypto.randomUUID() }
  return { stubbed: true, stepType: s.type }
}

// ── DAG helpers ────────────────────────────────────────────────────────────

function topoSort(steps: ParsedStep[], edges: Array<{ from: string; to: string }>): ParsedStep[] {
  const stepMap = new Map(steps.map(s => [s.id, s]))
  const inDegree = new Map<string, number>()
  const adj = new Map<string, string[]>()
  for (const s of steps) { inDegree.set(s.id, 0); adj.set(s.id, []) }
  for (const e of edges) { adj.get(e.from)?.push(e.to); inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1) }
  const queue = steps.filter(s => (inDegree.get(s.id) ?? 0) === 0).map(s => s.id)
  const result: ParsedStep[] = []
  while (queue.length > 0) {
    const id = queue.shift()!
    const s = stepMap.get(id)
    if (s) result.push(s)
    for (const next of adj.get(id) ?? []) {
      const deg = (inDegree.get(next) ?? 1) - 1
      inDegree.set(next, deg)
      if (deg === 0) queue.push(next)
    }
  }
  return result
}
