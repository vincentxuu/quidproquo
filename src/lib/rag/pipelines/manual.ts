import { HumanMessage } from '@langchain/core/messages'
import { initialState } from '../state'
import type { GraphState, PipelineCallbacks, RagRuntimeConfig } from '../state'
import { plannerNode } from '../agents/planner'
import { researchNode } from '../agents/research'
import { normalizeResultsNode } from '../agents/normalize-results'
import { writerNode } from '../agents/writer'
import { validationNode } from '../agents/validation'
import { criticNode } from '../agents/critic'
import { relatedPostsNode } from '../agents/related-posts'
import { fallbackNode } from '../agents/fallback'
import { shouldDegrade, shouldRetry } from '../agents/critic-routing'

export async function runManualPipeline(
  input: {
    message: string
    traceId: string
    threadId?: string
    conversationSummary?: string
    config?: RagRuntimeConfig
  },
  callbacks: PipelineCallbacks,
  engine: RagRuntimeConfig['pipelineEngine'] = 'manual'
): Promise<GraphState> {
  let state: GraphState = {
    ...initialState(),
    thread_id: input.threadId ?? crypto.randomUUID(),
    conversation_summary: input.conversationSummary,
    config: input.config ?? initialState().config,
    messages: [new HumanMessage(input.message)],
    langfuse_trace_id: input.traceId,
  }

  const runStep = async (stage: string, fn: (state: GraphState) => Promise<Partial<GraphState>>) => {
    const started = Date.now()
    const previousTokens = state.token_usage
    const update = await fn(state)
    state = {
      ...state,
      ...update,
      trace_steps: [
        ...state.trace_steps,
        {
          stage,
          started_at: new Date(started).toISOString(),
          duration_ms: Date.now() - started,
          input_summary: input.message.slice(0, 240),
          output_summary: summarize(stage, update),
          tokens: tokenDelta(previousTokens, update.token_usage),
          metadata: { engine, retrieval: summarizeRetrievalMetrics(update.retrieval_metrics ?? []) },
        },
      ],
    }
    return update
  }

  await runStep('planner', plannerNode)
  callbacks.onStep('Planner')
  if (state.plan.needs_clarification || state.plan.intent === 'off-topic') return state

  for (let i = 0; i < 3; i += 1) {
    const research = await runStep('research', researchNode)
    callbacks.onStep('Research', { chunks_found: research.search_results?.length ?? state.search_results.length })
    await runStep('normalize_results', normalizeResultsNode)
    await runStep('writer', writerNode)
    callbacks.onStep('Writer')
    callbacks.onToken(state.final_response)
    await runStep('deterministic_validation', validationNode)
    callbacks.onStep('Validation')
    if (!state.validation.passed && shouldRetry(state)) continue
    if (!state.config.criticEnabled) break
    await runStep('critic', criticNode)
    callbacks.onStep('Critic')
    if (!shouldRetry(state)) break
  }

  if (shouldDegrade(state)) {
    await runStep('fallback', fallbackNode)
    callbacks.onStep('Fallback')
  }
  await runStep('related', relatedPostsNode)
  callbacks.onRelated(state.related_posts)
  return state
}

function summarizeRetrievalMetrics(metrics: GraphState['retrieval_metrics']): Record<string, unknown> | undefined {
  if (metrics.length === 0) return undefined
  const shortCircuits = metrics.filter(metric => metric.skipped_vector)
  const vectorRuns = metrics.filter(metric => metric.vector_ms != null)
  const averageVectorMs = vectorRuns.length > 0
    ? Math.round(vectorRuns.reduce((sum, metric) => sum + (metric.vector_ms ?? 0), 0) / vectorRuns.length)
    : null

  return {
    searches: metrics.length,
    bm25_short_circuits: shortCircuits.length,
    bm25_short_circuit_hit_rate: shortCircuits.length / metrics.length,
    average_bm25_ms: Math.round(metrics.reduce((sum, metric) => sum + metric.bm25_ms, 0) / metrics.length),
    average_vector_ms: averageVectorMs,
    estimated_latency_saved_ms: averageVectorMs == null ? null : shortCircuits.length * averageVectorMs,
    details: metrics,
  }
}

function summarize(stage: string, update: Partial<GraphState>): string {
  if (stage === 'planner') return `${update.plan?.intent ?? 'unknown'} / ${update.plan?.complexity ?? 'unknown'}`
  if (stage === 'research') return `${update.search_results?.length ?? 0} results`
  if (stage === 'writer') return `${update.final_response?.length ?? 0} chars`
  if (stage === 'critic') return `confidence=${update.critique?.confidence ?? 'n/a'}`
  return 'completed'
}

function tokenDelta(
  previous: GraphState['token_usage'],
  next: GraphState['token_usage'] | undefined
): GraphState['token_usage'] | undefined {
  if (!next) return undefined
  return {
    input: Math.max(0, next.input - previous.input),
    output: Math.max(0, next.output - previous.output),
  }
}
