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

export function buildGraph() {
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
    },
  })

  graph
    .addNode('planner', plannerNode)
    .addNode('research', researchNode)
    .addNode('normalize_results', normalizeResultsNode)
    .addNode('writer', writerNode)
    .addNode('deterministic_validation', validationNode)
    .addNode('critic', criticNode)
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

export interface PipelineCallbacks {
  onStep: (agent: string, extra?: Record<string, unknown>) => void
  onToken: (text: string) => void
  onRelated: (posts: { title: string; slug: string; description: string }[]) => void
}

export async function runPipeline(
  input: {
    message: string
    traceId: string
    threadId?: string
    conversationSummary?: string
    config?: RagRuntimeConfig
  },
  callbacks: PipelineCallbacks
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

  const graphStream = compiledGraph.stream(initState, { streamMode: 'updates' })

  for await (const chunk of await graphStream) {
    const nodeName = Object.keys(chunk)[0]
    const update = chunk[nodeName] as Partial<GraphState>

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

    if (update) finalState = { ...finalState, ...update }
  }

  return finalState
}
