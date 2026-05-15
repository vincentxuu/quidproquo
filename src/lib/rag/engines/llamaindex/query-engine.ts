import { HumanMessage } from '@langchain/core/messages'
import type { SearchResult } from '../../state'
import { runLlamaIndexRetriever } from './retriever'
import { searchExternalTools } from '../../tools/external-search'
import { shouldDegrade, shouldRetry } from '../../agents/critic-routing'
import { plannerNode } from '../../agents/planner'
import { normalizeResultsNode } from '../../agents/normalize-results'
import { writerNode } from '../../agents/writer'
import { validationNode } from '../../agents/validation'
import { criticNode } from '../../agents/critic'
import { fallbackNode } from '../../agents/fallback'
import { relatedPostsNode } from '../../agents/related-posts'
import { initialState, type GraphState, type PipelineCallbacks, type RagRuntimeConfig } from '../../state'
import type { ProviderApiKeys } from '../../model'

export interface LlamaIndexNativeTraceEvent {
  stage: string
  at: string
  duration_ms: number
  metadata?: Record<string, unknown>
}

function summarizeSources(results: SearchResult[]): {
  chunks_found: number
  source_breakdown: Record<string, number>
} {
  const sourceBreakdown: Record<string, number> = {}
  for (const result of results) {
    sourceBreakdown[result.type] = (sourceBreakdown[result.type] ?? 0) + 1
  }
  return {
    chunks_found: results.length,
    source_breakdown: sourceBreakdown,
  }
}

function tokenDelta(previous: GraphState['token_usage'], next: GraphState['token_usage'] | undefined): GraphState['token_usage'] | undefined {
  if (!next) return undefined
  return {
    input: Math.max(0, next.input - previous.input),
    output: Math.max(0, next.output - previous.output),
  }
}

function mergeUniqueSearchResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  return results.filter((result) => {
    if (!result.chunk_id) return false
    if (seen.has(result.chunk_id)) return false
    seen.add(result.chunk_id)
    return true
  })
}

function buildIterationSummary(state: Pick<GraphState, 'token_usage' | 'trace_steps'>): string {
  return `${state.trace_steps.length} steps | tokens ${state.token_usage.input + state.token_usage.output}`
}

export async function runLlamaIndexQueryEngine(
  input: {
    message: string
    traceId: string
    threadId?: string
    conversationSummary?: string
    config: RagRuntimeConfig
    providerApiKeys?: ProviderApiKeys
  },
  callbacks: PipelineCallbacks
): Promise<{
  state: GraphState
  nativeTraceEvents: LlamaIndexNativeTraceEvent[]
}> {
  let state: GraphState = {
    ...initialState(),
    thread_id: input.threadId ?? crypto.randomUUID(),
    conversation_summary: input.conversationSummary,
    config: input.config,
    messages: [new HumanMessage(input.message)],
    langfuse_trace_id: input.traceId,
  }
  const started = Date.now()
  const nativeTraceEvents: LlamaIndexNativeTraceEvent[] = []

  const runStep = async (stage: string, handler: () => Promise<Partial<GraphState>>, extra?: Record<string, unknown>) => {
    const previousTokens = state.token_usage
    const startedAt = Date.now()
    const update = await handler()
    state = {
      ...state,
      ...update,
      trace_steps: [
        ...state.trace_steps,
        {
          stage,
          started_at: new Date(startedAt).toISOString(),
          duration_ms: Math.max(0, Date.now() - startedAt),
          input_summary: input.message.slice(0, 240),
          output_summary: buildIterationSummary({ ...state, ...update }),
          tokens: tokenDelta(previousTokens, update.token_usage),
          metadata: {
            ...extra,
            stage,
          },
        },
      ],
    }
    nativeTraceEvents.push({
      stage,
      at: new Date(startedAt).toISOString(),
      duration_ms: Math.max(0, Date.now() - startedAt),
      metadata: extra,
    })
    return update
  }

  const webSearchResults = state.config.searchToolsEnabled
    ? await searchExternalTools({
      query: input.message,
      limit: state.config.searchToolMaxResults,
      timeoutMs: state.config.searchToolTimeoutMs,
      providers: state.config.searchToolProviders,
      apiKeys: input.providerApiKeys,
    }).catch(() => [] as SearchResult[])
    : []

  callbacks.onStep('Planner')
  const plan = await runStep('planner', () => plannerNode(state, { apiKeys: input.providerApiKeys }), { stage: 'planner' })
  if (plan.plan?.needs_clarification || plan.plan?.intent === 'off-topic') {
    return {
      state,
      nativeTraceEvents: [...nativeTraceEvents, {
        stage: 'llamaindex_query_finalize',
        at: new Date().toISOString(),
        duration_ms: Math.max(0, Date.now() - started),
        metadata: { halted: 'off-topic' },
      }],
    }
  }

  for (let iteration = 0; iteration < 3; iteration += 1) {
    const queryStarted = Date.now()
    const { results, metrics, nativeTrace } = await runLlamaIndexRetriever(input.message, {
      topK: 8,
      shortCircuit: state.config.bm25ShortCircuitEnabled,
      providerApiKeys: input.providerApiKeys,
    })
    const mergedResults = mergeUniqueSearchResults(results.concat(webSearchResults))
    state = {
      ...state,
      search_results: mergedResults,
      retrieval_metrics: [metrics, ...(state.retrieval_metrics ?? [])],
      trace_steps: [
        ...state.trace_steps,
        {
          stage: 'llamaindex_retriever',
          started_at: new Date(queryStarted).toISOString(),
          duration_ms: Math.max(0, Date.now() - queryStarted),
          input_summary: input.message.slice(0, 240),
          output_summary: `Retrieved ${results.length} chunks`,
          metadata: {
            summary: summarizeSources(results),
          },
        },
      ],
    }
    nativeTraceEvents.push(...nativeTrace.map((event) => ({
      ...event,
      stage: `retriever:${event.stage}`,
      duration_ms: event.duration_ms ?? 0,
    })))
    callbacks.onStep('Retriever', summarizeSources(results))

    await runStep('normalize_results', () => normalizeResultsNode(state), { summary: summarizeSources(results) })
    callbacks.onStep('Normalize')

    const written = await runStep('writer', () => writerNode(state, { apiKeys: input.providerApiKeys }))
    callbacks.onStep('Writer')
    if (written.final_response) {
      callbacks.onToken(written.final_response)
    }

    const validated = await runStep('deterministic_validation', () => validationNode(state))
    callbacks.onStep('Validation')

    if (!validated.validation?.passed) {
      if (!shouldRetry(state)) {
        break
      }
      if (iteration < 2) {
        continue
      }
    }

    if (!state.config.criticEnabled) {
      break
    }

    await runStep('critic', () => criticNode(state, { apiKeys: input.providerApiKeys }))
    callbacks.onStep('Critic')

    if (!shouldRetry(state)) {
      break
    }
    if (iteration === 2 && shouldDegrade(state)) {
      break
    }
  }

  if (shouldDegrade(state)) {
    await runStep('fallback', () => fallbackNode(state))
    callbacks.onStep('Fallback')
  }

  await runStep('related', () => relatedPostsNode(state))
  callbacks.onStep('Related')
  callbacks.onRelated(state.related_posts)

  nativeTraceEvents.push({
    stage: 'llamaindex_query_finalize',
    at: new Date().toISOString(),
    duration_ms: Math.max(0, Date.now() - started),
    metadata: {
      iterationCount: state.iteration,
      stageCount: state.trace_steps.length,
    },
  })

  return { state, nativeTraceEvents }
}
