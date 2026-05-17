import { env } from 'cloudflare:workers'
import { initialState, type PipelineCallbacks } from '../../state'
import { runEmbedPipeline } from '../../../embed/pipeline'
import { runManualQuery } from './query'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import type { RagLifecycleEngine } from '../contract'
import { buildManualNativeTrace } from './trace'
import type { Env } from '@/lib/config/env'

interface IndexProfile {
  sourceFilters?: Array<'posts' | 'docs'>
  limit?: number
  offset?: number
}

function normalizeIndexProfile(input?: RagLifecycleInput['indexProfile']): Required<IndexProfile> {
  return {
    sourceFilters: input?.sourceFilters ?? ['posts', 'docs'],
    limit: input?.limit ?? 80,
    offset: input?.offset ?? 0,
  }
}

function emitManualIndexEvent(
  events: Array<{ stage: string; at: string; duration_ms: number; metadata?: Record<string, unknown> }>,
  stage: string,
  startedAt: number,
  metadata?: Record<string, unknown>,
) {
  events.push({
    stage,
    at: new Date(startedAt).toISOString(),
    duration_ms: Math.max(0, Date.now() - startedAt),
    metadata,
  })
}

async function countTableRows(table: 'post_chunks' | 'doc_chunks', db: D1Database): Promise<number> {
  const row = await db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).first<{ count: number }>()
  return Number(row?.count ?? 0)
}

export async function runManualIndex(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<RagLifecycleOutput> {
  const cfg = normalizeIndexProfile(input.indexProfile)
  const stageEvents: Array<{ stage: string; at: string; duration_ms: number; metadata?: Record<string, unknown> }> = []
  const started = Date.now()
  const db = (env as unknown as Env).DB

  const initialPosts = await countTableRows('post_chunks', db)
  const initialDocs = await countTableRows('doc_chunks', db)
  emitManualIndexEvent(stageEvents, 'discover_changed_content', Date.now(), {
    post_chunks: initialPosts,
    doc_chunks: initialDocs,
  })

  callbacks.onStep('Index:discover')
  callbacks.onStep('Index:load_source_profiles')

  const beforeAt = Date.now()
  const sources = (cfg.sourceFilters.length > 0
    ? Array.from(new Set(cfg.sourceFilters))
    : ['posts', 'docs']) as Array<'posts' | 'docs'>
  const result = await runEmbedPipeline(sources, cfg.offset, cfg.limit)
  emitManualIndexEvent(stageEvents, 'chunk_batch', beforeAt, {
    sourceFilters: sources,
    offset: cfg.offset,
    limit: cfg.limit,
  })

  emitManualIndexEvent(stageEvents, 'contextualize_chunk', beforeAt, {
    postChunks: initialPosts,
    docChunks: initialDocs,
    sources: result.map((item) => item.source),
    totalVectors: result.reduce((sum, item) => sum + item.vectors, 0),
  })
  callbacks.onStep('Index:chunk')
  callbacks.onStep('Index:embed')
  callbacks.onStep('Index:upsert')

  emitManualIndexEvent(stageEvents, 'upsert_vectorize', beforeAt, {
    hasMore: result.some((entry) => entry.hasMore),
    errors: result.flatMap((entry) => entry.errors ?? []),
  })

  emitManualIndexEvent(stageEvents, 'persist_chunk_rows', beforeAt, {
    sourceFilters: result.map((entry) => entry.source),
    sourceVectorCounts: Object.fromEntries(result.map((entry) => [entry.source, entry.vectors])),
  })

  const finalPosts = await countTableRows('post_chunks', db)
  const finalDocs = await countTableRows('doc_chunks', db)
  callbacks.onStep('Index:finalize')

  emitManualIndexEvent(stageEvents, 'emit_index_metrics', Date.now(), {
    changedPostChunks: Math.max(finalPosts - initialPosts, 0),
    changedDocChunks: Math.max(finalDocs - initialDocs, 0),
    totalVectors: result.reduce((sum, item) => sum + item.vectors, 0),
    errors: result.flatMap((entry) => entry.errors ?? []).length,
    elapsedMs: Date.now() - started,
  })

  const state = {
    ...initialState(),
    thread_id: input.threadId ?? crypto.randomUUID(),
    config: input.config,
    final_response: `Index completed with ${result.length} source groups and ${result.reduce((sum, item) => sum + item.vectors, 0)} vectors upserted.`,
    messages: [],
    trace_steps: [],
  }

  return {
    ...state,
    model_usage: result.map((indexEntry) => ({
      stage: 'indexing',
      provider: input.config.defaultProvider,
      model: input.config.defaultModel,
      fallback: false,
      metadata: {
        source: indexEntry.source,
        vectors: indexEntry.vectors,
        hasMore: indexEntry.hasMore,
      },
    })),
    native_trace: buildManualNativeTrace(state, stageEvents),
  }
}

export const manualEngine: RagLifecycleEngine = {
  name: 'manual',
  query: runManualQuery,
  index: runManualIndex,
}
