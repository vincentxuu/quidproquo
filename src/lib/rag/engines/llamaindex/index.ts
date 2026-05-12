import { env } from 'cloudflare:workers'
import type { RagLifecycleEngine, RagLifecycleInput, RagLifecycleOutput } from '../contract'
import { runLlamaIndexQuery } from './query'
import { runLlamaIndexIngestion } from './ingestion'
import type { GraphState, PipelineCallbacks } from '../../state'
import { initialState } from '../../state'
import { buildLlamaIndexNativeTrace } from './trace'

interface Env {
  DB: D1Database
}

interface IndexProfile {
  sourceFilters?: Array<'posts' | 'docs'>
  offset?: number
  limit?: number
}

function normalizeIndexProfile(input?: {
  sourceFilters?: Array<'posts' | 'docs'>
  offset?: number
  limit?: number
}): Required<IndexProfile> {
  return {
    sourceFilters: input?.sourceFilters?.length ? input.sourceFilters : ['posts', 'docs'],
    offset: input?.offset ?? 0,
    limit: input?.limit ?? 240,
  }
}

async function countSourceRows(db: D1Database, source: 'posts' | 'docs'): Promise<number> {
  if (source === 'posts') {
    const row = await db.prepare('SELECT COUNT(*) as count FROM post_chunks').first<{ count: number }>()
    return Number(row?.count ?? 0)
  }
  const row = await db.prepare('SELECT COUNT(*) as count FROM doc_chunks').first<{ count: number }>()
  return Number(row?.count ?? 0)
}

async function runLlamaIndexIndex(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<Pick<RagLifecycleOutput, 'native_trace' | 'search_results' | 'model_usage' | 'token_usage' | 'trace_steps' | 'config'>> {
  const cfg = normalizeIndexProfile(input.indexProfile)
  const { DB } = env as unknown as Env
  const startedAt = Date.now()
  const db = DB
  const events: Array<{ stage: string; at: string; duration_ms: number; metadata?: Record<string, unknown> }> = []

  callbacks.onStep('Index:discover_changed_content')
  const discoverAt = Date.now()
  const beforePosts = db ? await countSourceRows(db, 'posts') : 0
  const beforeDocs = db ? await countSourceRows(db, 'docs') : 0
  events.push({
    stage: 'discover_changed_content',
    at: new Date(discoverAt).toISOString(),
    duration_ms: Math.max(0, Date.now() - discoverAt),
    metadata: { offset: cfg.offset, limit: cfg.limit, sourceFilters: cfg.sourceFilters },
  })

  callbacks.onStep('Index:chunk')
  const chunkAt = Date.now()
  const result = await runLlamaIndexIngestion(cfg.sourceFilters as Array<'posts' | 'docs' | 'custom'>, cfg.offset, cfg.limit)
  events.push({
    stage: 'chunk',
    at: new Date(chunkAt).toISOString(),
    duration_ms: Math.max(0, Date.now() - chunkAt),
    metadata: { documents: result.documents, vectors: result.vectors },
  })

  callbacks.onStep('Index:upsert')
  events.push({
    stage: 'upsert',
    at: new Date(Date.now()).toISOString(),
    duration_ms: Math.max(0, Date.now() - startedAt),
    metadata: {
      errors: result.errors,
      errorCount: result.errors.length,
      sourceFilters: cfg.sourceFilters,
    },
  })

  callbacks.onStep('Index:emit_metrics')
  events.push({
    stage: 'emit_index_metrics',
    at: new Date(Date.now()).toISOString(),
    duration_ms: Math.max(0, Date.now() - startedAt),
    metadata: {
      documents: result.documents,
      vectors: result.vectors,
      sourceFilters: cfg.sourceFilters,
    },
  })

  const afterPosts = db ? await countSourceRows(db, 'posts') : beforePosts
  const afterDocs = db ? await countSourceRows(db, 'docs') : beforeDocs

  const state: GraphState = {
    ...initialState(),
    thread_id: input.threadId ?? crypto.randomUUID(),
    config: input.config,
    final_response: `LlamaIndex index completed: ${result.vectors} vectors from ${result.documents} documents`,
    trace_steps: [],
    messages: [],
    search_results: [],
    model_usage: [
      {
        stage: 'llamaindex_index',
        provider: input.config.defaultProvider,
        model: input.config.defaultModel,
        fallback: false,
      },
    ],
  }
  const nativeTrace = buildLlamaIndexNativeTrace(state, events.map((event) => ({
    stage: event.stage,
    at: event.at,
    duration_ms: event.duration_ms,
    metadata: {
      ...event.metadata,
      indexBeforePosts: beforePosts,
      indexBeforeDocs: beforeDocs,
      indexAfterPosts: afterPosts,
      indexAfterDocs: afterDocs,
    },
  })))

  return {
    config: state.config,
    native_trace: nativeTrace,
    search_results: [],
    model_usage: state.model_usage,
    token_usage: state.token_usage,
    trace_steps: state.trace_steps,
  }
}

export const llamaIndexEngine: RagLifecycleEngine = {
  name: 'llamaindex',
  query: runLlamaIndexQuery,
  index: runLlamaIndexIndex,
  evalCase: runLlamaIndexQuery,
}
