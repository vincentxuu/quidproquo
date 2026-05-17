import { env } from 'cloudflare:workers'
import type { PipelineCallbacks } from '../../state'
import { runEmbedPipeline } from '../../../embed/pipeline'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import type { NativeTrace } from '../../state'
import type { Env } from '@/lib/config/env'

interface StageEvent {
  stage: string
  at: string
  duration_ms: number
  metadata?: Record<string, unknown>
}

function emitGraphIndexEvent(
  events: StageEvent[],
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

async function countSourceRows(db: D1Database, source: 'posts' | 'docs'): Promise<number> {
  if (source === 'posts') {
    const row = await db.prepare('SELECT COUNT(*) as count FROM post_chunks').first<{ count: number }>()
    return Number(row?.count ?? 0)
  }
  const row = await db.prepare('SELECT COUNT(*) as count FROM doc_chunks').first<{ count: number }>()
  return Number(row?.count ?? 0)
}

export async function runLangGraphIndex(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<Pick<RagLifecycleOutput, 'search_results' | 'config' | 'native_trace' | 'model_usage' | 'token_usage' | 'trace_steps'>> {
  const db = (env as unknown as Env).DB
  const started = Date.now()
  const events: StageEvent[] = []
  const sources = (input.indexProfile?.sourceFilters ?? ['posts', 'docs']).filter(Boolean).filter((value): value is 'posts' | 'docs' => value === 'posts' || value === 'docs')

  callbacks.onStep('Index:discover_changed_content')
  const discoverAt = Date.now()
  const beforePosts = await countSourceRows(db, 'posts')
  const beforeDocs = await countSourceRows(db, 'docs')
  emitGraphIndexEvent(events, 'discover_changed_content', discoverAt, {
    sourceFilters: sources,
    postRows: beforePosts,
    docRows: beforeDocs,
  })

  callbacks.onStep('Index:chunk')
  const chunkAt = Date.now()
  emitGraphIndexEvent(events, 'chunk', chunkAt, {
    strategy: 'graph_based_chunking',
    sourceFilters: sources,
  })

  callbacks.onStep('Index:contextualize')
  const embedAt = Date.now()
  const embedResult = await runEmbedPipeline(sources, input.indexProfile?.offset ?? 0, input.indexProfile?.limit ?? 80)
  callbacks.onStep('Index:upsert')
  emitGraphIndexEvent(events, 'embed_batch', embedAt, {
    sourceResults: embedResult.map((entry) => ({ source: entry.source, vectors: entry.vectors, hasMore: entry.hasMore })),
    errorCount: embedResult.reduce((sum, item) => sum + (item.errors?.length ?? 0), 0),
  })

  callbacks.onStep('Index:upsert_vectorize')
  emitGraphIndexEvent(events, 'upsert_vectorize', embedAt, {
    vectorized: embedResult.reduce((sum, entry) => sum + entry.vectors, 0),
  })

  callbacks.onStep('Index:persist_rows')
  const afterPosts = await countSourceRows(db, 'posts')
  const afterDocs = await countSourceRows(db, 'docs')
  emitGraphIndexEvent(events, 'persist_chunk_rows', Date.now(), {
    rowsAdded: {
      posts: Math.max(afterPosts - beforePosts, 0),
      docs: Math.max(afterDocs - beforeDocs, 0),
    },
  })

  emitGraphIndexEvent(events, 'emit_index_metrics', Date.now(), {
    totalRowsIndexed: embedResult.reduce((sum, entry) => sum + entry.vectors, 0),
    elapsedMs: Date.now() - started,
  })

  callbacks.onStep('Index:emit_metrics')

  const nativeTrace: NativeTrace = {
    engine: 'langgraph',
    version: '0.2.0',
    events,
    metadata: {
      sources,
      rowState: {
        beforePosts,
        beforeDocs,
        afterPosts,
        afterDocs,
      },
      graphAware: true,
      elapsedMs: Date.now() - started,
    },
  }

  return {
    config: input.config,
    native_trace: nativeTrace,
    search_results: [],
    trace_steps: [],
    model_usage: [
      ...embedResult.flatMap((entry) =>
        entry.errors.map(() => ({
          stage: 'langgraph_index',
          provider: input.config.defaultProvider,
          model: input.config.defaultModel,
          fallback: false,
        }))
      ),
      {
        stage: 'langgraph_index',
        provider: input.config.defaultProvider,
        model: input.config.defaultModel,
        fallback: false,
      },
    ],
    token_usage: { input: 0, output: 0 },
  }
}
