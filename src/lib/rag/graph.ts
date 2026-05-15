import { StateGraph, END } from '@langchain/langgraph'
import { HumanMessage } from '@langchain/core/messages'
import { initialState } from './state'
import type { GraphState, RagRuntimeConfig } from './state'
import { plannerNode } from './agents/planner'
import { researchNode } from './agents/research'
import { normalizeResultsNode } from './agents/normalize-results'
import { writerNode } from './agents/writer'
import { validationNode } from './agents/validation'
import { criticNode } from './agents/critic'
import { shouldRetry, shouldDegrade } from './agents/critic-routing'
import { relatedPostsNode } from './agents/related-posts'
import { fallbackNode } from './agents/fallback'
import type { BaseMessage } from '@langchain/core/messages'
import type { PipelineCallbacks } from './state'
import type { ProviderApiKeys } from './model'

export function buildGraph(options?: { providerApiKeys?: ProviderApiKeys }) {
  const graph = new StateGraph<GraphState>({
    channels: {
      messages: { reducer: (a: BaseMessage[], b: BaseMessage[]) => [...a, ...b], default: () => [] },
      thread_id: { default: () => crypto.randomUUID() },
      language: { default: () => 'zh-TW' },
      conversation_summary: { default: () => undefined },
      config: { default: () => initialState().config },
      plan: { default: () => ({ intent: 'factual' as const, complexity: 'medium' as const, needs_clarification: false, subtasks: [], specialists: [] }) },
      needs_web_search: { default: () => false },
      search_results: { default: () => [] },
      retrieval_metrics: { reducer: (a: GraphState['retrieval_metrics'], b: GraphState['retrieval_metrics']) => [...a, ...b], default: () => [] },
      coverage_gaps: { default: () => [] },
      diagram: { default: () => undefined },
      draft: { default: () => '' },
      validation: { default: () => ({ passed: true, errors: [] }) },
      critique: { default: () => ({ confidence: 1, answer_relevance: 1, intent_alignment: 1, drift_detected: false, ungrounded_claims: [], gaps: [] }) },
      iteration: { default: () => 0 },
      related_posts: { default: () => [] },
      final_response: { default: () => '' },
      langfuse_trace_id: { default: () => '' },
      token_usage: { default: () => ({ input: 0, output: 0 }) },
      trace_steps: { default: () => [] },
      model_usage: { default: () => [] },
    },
  } as any) as any

  graph
    .addNode('planner', (state: GraphState) => plannerNode(state, { apiKeys: options?.providerApiKeys }))
    .addNode('research', (state: GraphState) => researchNode(state, { apiKeys: options?.providerApiKeys }))
    .addNode('normalize_results', normalizeResultsNode)
    .addNode('writer', (state: GraphState) => writerNode(state, { apiKeys: options?.providerApiKeys }))
    .addNode('deterministic_validation', validationNode)
    .addNode('critic', (state: GraphState) => criticNode(state, { apiKeys: options?.providerApiKeys }))
    .addNode('fallback', fallbackNode)
    .addNode('related', relatedPostsNode)

  graph.setEntryPoint('planner')

  graph.addConditionalEdges('planner', (state: GraphState) =>
    state.plan.needs_clarification || state.plan.intent === 'off-topic' ? END : 'research'
  )

  graph.addEdge('research', 'normalize_results')
  graph.addEdge('normalize_results', 'writer')
  graph.addEdge('writer', 'deterministic_validation')

  graph.addConditionalEdges('critic', (state: GraphState) =>
    shouldRetry(state) ? 'research' : shouldDegrade(state) ? 'fallback' : 'related'
  )

  graph.addConditionalEdges('deterministic_validation', (state: GraphState) =>
    !state.validation.passed
      ? shouldRetry(state) ? 'research' : 'fallback'
      : state.config.criticEnabled ? 'critic' : 'related'
  )

  graph.addEdge('fallback', 'related')
  graph.addEdge('related', END)

  return graph.compile()
}

const compiledGraph = buildGraph()

export async function runPipeline(
  input: {
    message: string
    traceId: string
    threadId?: string
    conversationSummary?: string
    config?: RagRuntimeConfig
  },
  callbacks: PipelineCallbacks,
  options?: {
    providerApiKeys?: ProviderApiKeys
  }
): Promise<GraphState> {
  const initState: Partial<GraphState> = {
    ...initialState(),
    thread_id: input.threadId ?? crypto.randomUUID(),
    conversation_summary: input.conversationSummary,
    config: input.config ?? initialState().config,
    messages: [new HumanMessage(input.message)],
    langfuse_trace_id: input.traceId,
  }

  let finalState: GraphState = initState as GraphState
  const pipelineStartedAt = Date.now()
  const graph = options?.providerApiKeys ? buildGraph(options) : compiledGraph
  const graphStream = graph.stream(initState, { streamMode: 'updates' })

  for await (const chunk of await graphStream) {
    const nodeName = Object.keys(chunk)[0]
    const update = chunk[nodeName] as Partial<GraphState>
    const finishedAt = Date.now()
    const previousStepEnd = finalState.trace_steps.at(-1)?.started_at
      ? new Date(finalState.trace_steps.at(-1)!.started_at).getTime() + finalState.trace_steps.at(-1)!.duration_ms
      : pipelineStartedAt
    const nodeSummary = summarizeNodeUpdate(nodeName, update)
    const traceStep = {
      stage: nodeName,
      started_at: new Date(previousStepEnd).toISOString(),
      duration_ms: Math.max(0, finishedAt - previousStepEnd),
      input_summary: input.message.slice(0, 240),
      output_summary: nodeSummary,
      tokens: tokenDelta(finalState.token_usage, update.token_usage),
      retry: (update.iteration ?? finalState.iteration) > finalState.iteration + 1,
      metadata: buildNodeMetadata(update),
    }

    if (nodeName === 'planner') {
      callbacks.onStep('Planner')
    } else if (nodeName === 'research') {
      callbacks.onStep('Research', { chunks_found: (update.search_results ?? []).length })
    } else if (nodeName === 'writer') {
      callbacks.onStep('Writer')
      if (update.final_response) callbacks.onToken(update.final_response)
    } else if (nodeName === 'deterministic_validation') {
      callbacks.onStep('Validation')
    } else if (nodeName === 'critic') {
      callbacks.onStep('Critic')
    } else if (nodeName === 'fallback') {
      callbacks.onStep('Fallback')
    } else if (nodeName === 'related') {
      const posts = update.related_posts ?? []
      if (posts.length > 0) callbacks.onRelated(posts)
    }

    finalState = {
      ...finalState,
      ...update,
      trace_steps: [...(finalState.trace_steps ?? []), traceStep],
    }
  }

  return finalState
}

function summarizeNodeUpdate(nodeName: string, update: Partial<GraphState>): string {
  if (nodeName === 'planner') return `${update.plan?.intent ?? 'unknown'} / ${update.plan?.complexity ?? 'unknown'}`
  if (nodeName === 'research') return `${update.search_results?.length ?? 0} results`
  if (nodeName === 'normalize_results') return `${update.search_results?.length ?? 0} normalized; web=${update.needs_web_search ? 'yes' : 'no'}`
  if (nodeName === 'writer') return `${update.final_response?.length ?? 0} chars`
  if (nodeName === 'deterministic_validation') return update.validation?.passed ? 'passed' : `failed: ${update.validation?.errors.join('; ')}`
  if (nodeName === 'critic') return `confidence=${update.critique?.confidence ?? 'n/a'} relevance=${update.critique?.answer_relevance ?? 'n/a'}`
  if (nodeName === 'related') return `${update.related_posts?.length ?? 0} posts`
  return 'completed'
}

function buildNodeMetadata(update: Partial<GraphState>): Record<string, unknown> {
  const retrieval = summarizeRetrievalMetrics(update.retrieval_metrics ?? [])
  return {
    intent: update.plan?.intent,
    complexity: update.plan?.complexity,
    chunks_found: update.search_results?.length,
    retrieval,
    validation_errors: update.validation?.errors,
    confidence: update.critique?.confidence,
    answer_relevance: update.critique?.answer_relevance,
  }
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
