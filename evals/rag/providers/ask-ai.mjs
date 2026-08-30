import { randomUUID } from 'node:crypto'
import { findFixtureCase, loadRagDataset } from '../adapters/golden-dataset.mjs'

const DEFAULT_BASE_URL = 'http://127.0.0.1:4321'
const DEFAULT_TIMEOUT_MS = 60_000

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function numberOrUndefined(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export class AskAiSseAccumulator {
  constructor() {
    this.buffer = ''
    this.answer = ''
    this.sources = []
    this.related = []
    this.agentSteps = []
    this.done = {}
    this.error = null
  }

  push(chunk) {
    this.buffer += String(chunk ?? '')
    const normalized = this.buffer.replace(/\r\n/g, '\n')
    const blocks = normalized.split('\n\n')
    this.buffer = blocks.pop() ?? ''
    for (const block of blocks) this.#processBlock(block)
  }

  finish() {
    if (this.buffer.trim()) this.#processBlock(this.buffer.replace(/\r\n/g, '\n'))
    this.buffer = ''
    return this.result()
  }

  result() {
    return {
      answer: this.answer,
      sources: this.sources,
      related: this.related,
      agentSteps: this.agentSteps,
      done: this.done,
      error: this.error,
    }
  }

  #processBlock(block) {
    if (!block.trim()) return
    let eventType = 'token'
    const dataLines = []
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) eventType = line.slice(6).trim()
      if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
    }
    if (dataLines.length === 0) return

    let data
    try {
      data = JSON.parse(dataLines.join('\n'))
    } catch (error) {
      throw new Error(`Invalid Ask AI SSE JSON for event "${eventType}": ${error instanceof Error ? error.message : String(error)}`)
    }

    if (eventType === 'token') this.answer += String(asObject(data).text ?? '')
    else if (eventType === 'sources') this.sources = asArray(data)
    else if (eventType === 'related') this.related = asArray(data)
    else if (eventType === 'agent_step') this.agentSteps.push(asObject(data))
    else if (eventType === 'done') this.done = asObject(data)
    else if (eventType === 'error') this.error = asObject(data)
  }
}

export function parseAskAiSseChunks(chunks) {
  const parser = new AskAiSseAccumulator()
  for (const chunk of chunks) parser.push(chunk)
  return parser.finish()
}

function normalizeSources(value) {
  return asArray(value).map((source) => {
    if (typeof source === 'string') return { url: source }
    const item = asObject(source)
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      url: String(item.url ?? item.source_url ?? ''),
      slug: typeof item.slug === 'string' ? item.slug : undefined,
    }
  }).filter((source) => source.url || source.slug)
}

function buildMetadata(result, extras = {}) {
  const done = asObject(result.done)
  const usage = asObject(done.usage)
  const sources = normalizeSources(result.sources)
  const sourceLocators = sources.map((source) => source.slug || source.url).filter(Boolean)
  return {
    sources,
    sourceLocators,
    uniqueSourceCount: new Set(sourceLocators).size,
    related: asArray(result.related),
    agentSteps: asArray(result.agentSteps),
    confidence: numberOrUndefined(done.confidence),
    usage,
    threadId: typeof done.thread_id === 'string' ? done.thread_id : undefined,
    cached: done.cached === true,
    error: result.error ?? null,
    ...extras,
  }
}

export default class AskAiProvider {
  constructor(options = {}) {
    this.providerId = options.id || 'ask-ai-sse'
    this.config = asObject(options.config)
  }

  id() {
    return this.providerId
  }

  async callApi(prompt, context = {}) {
    const query = String(context.vars?.query ?? prompt ?? '').trim()
    if (!query) return { error: 'Ask AI query is empty' }

    const fixturePath = this.config.fixturePath || process.env.RAG_PROMPTFOO_FIXTURE_PATH
    if (fixturePath) {
      try {
        const dataset = loadRagDataset(fixturePath, { fixture: true })
        const caseId = String(context.vars?.caseId ?? '').trim()
        const fixture = findFixtureCase(dataset, { id: caseId, query })
        if (!fixture) throw new Error(`No Promptfoo fixture found for case: ${caseId || query}`)
        const result = {
          answer: fixture.candidate_answer,
          sources: fixture.candidate_sources,
          related: [],
          agentSteps: [],
          done: {
            usage: {},
            thread_id: `fixture:${fixture.id}`,
            cached: false,
          },
          error: null,
        }
        return {
          output: result.answer,
          metadata: buildMetadata(result, {
            fixture: true,
            evidenceKind: dataset.evidence_kind,
            datasetId: dataset.dataset_id,
            schemaVersion: dataset.schema_version,
            sourceDatasetId: dataset.source_dataset_id,
            fixtureId: fixture.id,
            latencyMs: 0,
            query,
          }),
        }
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) }
      }
    }

    const baseUrl = String(this.config.baseUrl || process.env.RAG_EVAL_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
    const cookie = String(this.config.cookie || process.env.RAG_EVAL_COOKIE || '')
    const pipelineEngine = context.vars?.pipelineEngine || this.config.pipelineEngine || process.env.RAG_ENGINE
    const timeoutMs = Number(this.config.timeoutMs || process.env.RAG_PROMPTFOO_TIMEOUT_MS || DEFAULT_TIMEOUT_MS)
    const startedAt = Date.now()

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify({
          message: query,
          thread_id: randomUUID(),
          traceScope: 'eval',
          ...(pipelineEngine ? { pipelineEngine } : {}),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (!response.ok || !response.body) {
        const body = await response.text().catch(() => '')
        return { error: `Ask AI returned HTTP ${response.status}${body ? `: ${body.slice(0, 300)}` : ''}` }
      }

      const parser = new AskAiSseAccumulator()
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        parser.push(decoder.decode(value, { stream: true }))
      }
      parser.push(decoder.decode())
      const result = parser.finish()
      const latencyMs = Date.now() - startedAt
      if (result.error) {
        return { error: String(result.error.message ?? result.error.type ?? 'Ask AI emitted an SSE error') }
      }

      const metadata = buildMetadata(result, {
        fixture: false,
        evidenceKind: 'live-output',
        latencyMs,
        query,
        pipelineEngine: pipelineEngine || 'default',
      })
      const usage = asObject(result.done).usage
      return {
        output: result.answer,
        metadata,
        tokenUsage: {
          prompt: numberOrUndefined(asObject(usage).input),
          completion: numberOrUndefined(asObject(usage).output),
          total: (numberOrUndefined(asObject(usage).input) ?? 0) + (numberOrUndefined(asObject(usage).output) ?? 0),
        },
      }
    } catch (error) {
      return { error: `Ask AI request failed: ${error instanceof Error ? error.message : String(error)}` }
    }
  }
}
