// Cloudflare Workflows entrypoint for agent-flow durable execution.
// Each flow step becomes a Workflow step.do() with built-in retries + checkpoint.

// @ts-ignore — cloudflare:workers types are runtime-only
import { WorkflowEntrypoint } from 'cloudflare:workers'
import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers'
import type { Env } from '../lib/config/env'

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
  tools?: string[]
  branches?: ParsedStep[]
  merge?: string
  [key: string]: unknown
}

interface ProviderConfig {
  baseUrl: string
  envKey: string
}

const PROVIDERS: Record<string, ProviderConfig> = {
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', envKey: 'OPENROUTER_API_KEY' },
  opencode: { baseUrl: 'https://opencode.ai/zen/v1', envKey: 'OPENCODE_API_KEY' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', envKey: 'GROQ_API_KEY' },
  openai: { baseUrl: 'https://api.openai.com/v1', envKey: 'OPENAI_API_KEY' },
}

function parseModelSpec(spec: string): { provider: string; model: string } {
  const slash = spec.indexOf('/')
  if (slash === -1) return { provider: spec, model: '' }
  const provider = spec.slice(0, slash)
  if (PROVIDERS[provider]) return { provider, model: spec.slice(slash + 1) }
  return { provider: 'openrouter', model: spec }
}

async function callLlm(
  env: Record<string, string>,
  modelSpec: string,
  prompt: string,
  maxTokens: number,
): Promise<{ content: string; model: string; tokens?: unknown }> {
  const { provider, model } = parseModelSpec(modelSpec)
  const config = PROVIDERS[provider]
  if (!config) throw new Error(`Unknown provider: ${provider}. Use format: provider/model (e.g. openrouter/qwen/qwen3.8-27b)`)
  if (!model) throw new Error(`No model specified. Use format: provider/model (e.g. openrouter/qwen/qwen3.8-27b)`)

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
        { role: 'system', content: 'You are a research assistant. Return structured JSON when asked.' },
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
  return {
    content: data.choices?.[0]?.message?.content ?? '',
    model: data.model,
    tokens: data.usage,
  }
}

const STEP_RETRY = {
  limit: 3,
  delay: '5 seconds' as const,
  backoff: 'exponential' as const,
}

export class AgentFlowWorkflow extends WorkflowEntrypoint<Env, FlowWorkflowParams> {
  async run(event: WorkflowEvent<FlowWorkflowParams>, step: WorkflowStep): Promise<void> {
    const { flowId, flowRunId, input, model: modelOverride } = event.payload
    const db = this.env.DB
    const envRecord = this.env as unknown as Record<string, string>

    // Step 1: Load flow definition from D1
    const flowDef = await step.do('load-definition', { retries: STEP_RETRY }, async () => {
      const row = await db
        .prepare('SELECT definition_yaml FROM flow_definitions WHERE flow_id=? LIMIT 1')
        .bind(flowId)
        .first<{ definition_yaml: string }>()
      if (!row) throw new Error(`Flow ${flowId} not found`)

      const { parse } = await import('yaml')
      return parse(row.definition_yaml) as {
        steps: Record<string, ParsedStep>
        edges: Array<{ from: string; to: string }>
      }
    })

    // Step 2: Mark running
    await step.do('mark-running', { retries: STEP_RETRY }, async () => {
      await db.prepare(
        `UPDATE flow_runs SET status='running', updated_at=? WHERE flow_run_id=?`
      ).bind(Date.now(), flowRunId).run()
    })

    // Step 3: Build execution order from edges (topological sort)
    const steps = Object.entries(flowDef.steps).map(([id, cfg]) => ({
      ...cfg,
      id,
      type: cfg.kind ?? cfg.type,
    })) as ParsedStep[]

    const edges = flowDef.edges ?? []
    const ordered = topoSort(steps, edges)

    // Step 4: Execute each step
    const stepResults: Record<string, unknown> = {}
    const startedAt = Date.now()

    for (const s of ordered) {
      const result = await step.do(`step:${s.id}`, {
        retries: STEP_RETRY,
        timeout: '2 minutes',
      }, async () => {
        return executeFlowStep(s, envRecord, input, stepResults, modelOverride)
      })
      stepResults[s.id] = result

      // Write step result to D1
      await step.do(`record:${s.id}`, { retries: STEP_RETRY }, async () => {
        const now = Date.now()
        await db.prepare(
          `INSERT INTO flow_step_runs (step_run_id, flow_run_id, step_id, step_order, step_type, status, outputs_json, started_at, finished_at, latency_ms, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 'done', ?, ?, ?, ?, ?, ?)`
        ).bind(
          crypto.randomUUID(), flowRunId, s.id, ordered.indexOf(s), s.type,
          JSON.stringify(result), startedAt, now, now - startedAt, now, now,
        ).run()
      })
    }

    // Step 5: Mark done
    await step.do('mark-done', { retries: STEP_RETRY }, async () => {
      const now = Date.now()
      await db.prepare(
        `UPDATE flow_runs SET status='done', output_json=?, finished_at=?, latency_ms=?, updated_at=? WHERE flow_run_id=?`
      ).bind(JSON.stringify(stepResults), now, now - startedAt, now, flowRunId).run()
    })
  }
}

function buildContext(prevResults: Record<string, unknown>): string {
  const parts: string[] = []
  for (const [stepId, result] of Object.entries(prevResults)) {
    if (!result || typeof result !== 'object') continue
    const r = result as Record<string, unknown>
    if (r.branches) {
      const branches = r.branches as Array<Record<string, unknown>>
      const contents = branches
        .filter(b => b.content)
        .map(b => `[${b.id}]\n${String(b.content).slice(0, 1500)}`)
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
  _input: Record<string, unknown>,
  prevResults: Record<string, unknown>,
  modelOverride?: string,
): Promise<unknown> {
  if (s.type === 'parallel' && s.branches) {
    const results = []
    for (const branch of s.branches) {
      if (branch.type === 'agent' && branch.prompt && (branch.model || modelOverride)) {
        try {
          const r = await callLlm(env, modelOverride ?? branch.model!, branch.prompt, branch.maxTokens ?? 2000)
          results.push({ id: branch.id, ...r })
        } catch (err) {
          results.push({ id: branch.id, error: String(err) })
        }
      } else {
        results.push({ id: branch.id, stubbed: true })
      }
    }
    return { branches: results }
  }

  if (s.type === 'agent' && s.prompt && (s.model || modelOverride)) {
    const context = buildContext(prevResults)
    const prompt = context ? `${s.prompt}\n${context}` : s.prompt
    return callLlm(env, modelOverride ?? s.model!, prompt, s.maxTokens ?? 2000)
  }

  if (s.type === 'tool_group') {
    return { stubbed: true, tools: s.tools ?? [] }
  }

  if (s.type === 'artifact') {
    return { artifactId: crypto.randomUUID() }
  }

  return { stubbed: true, stepType: s.type }
}

function topoSort(
  steps: ParsedStep[],
  edges: Array<{ from: string; to: string }>,
): ParsedStep[] {
  const stepMap = new Map(steps.map(s => [s.id, s]))
  const inDegree = new Map<string, number>()
  const adj = new Map<string, string[]>()

  for (const s of steps) {
    inDegree.set(s.id, 0)
    adj.set(s.id, [])
  }
  for (const e of edges) {
    adj.get(e.from)?.push(e.to)
    inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1)
  }

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
