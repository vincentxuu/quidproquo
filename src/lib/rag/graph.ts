import { StateGraph, MemorySaver, END } from '@langchain/langgraph'
import { StateAnnotation } from './state'
import { plannerNode } from './agents/planner'
import { researchNode } from './agents/research'
import { normalizeResultsNode } from './agents/normalize-results'
import { writerNode } from './agents/writer'
import { criticNode } from './agents/critic'
import { shouldRetry } from './agents/critic-routing'
import { relatedPostsNode } from './agents/related-posts'
import type { GraphState } from './state'

export function buildGraph() {
  const graph = new StateGraph(StateAnnotation)

  graph
    .addNode('planner', plannerNode)
    .addNode('research', researchNode)
    .addNode('normalize_results', normalizeResultsNode)
    .addNode('writer', writerNode)
    .addNode('critic', criticNode)
    .addNode('related', relatedPostsNode)

  graph.setEntryPoint('planner')

  graph.addConditionalEdges('planner', (state: GraphState) =>
    state.plan.needs_clarification || state.plan.intent === 'off-topic' ? END : 'research'
  )

  graph.addEdge('research', 'normalize_results')
  graph.addEdge('normalize_results', 'writer')
  graph.addEdge('writer', 'critic')

  graph.addConditionalEdges('critic', (state: GraphState) =>
    shouldRetry(state.critique, state.iteration) ? 'research' : 'related'
  )

  graph.addEdge('related', END)

  return graph.compile({ checkpointer: new MemorySaver() })
}

let _graph: ReturnType<typeof buildGraph> | null = null
export function getGraph() {
  if (!_graph) _graph = buildGraph()
  return _graph
}
