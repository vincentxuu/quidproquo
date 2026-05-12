import type { NativeTrace } from '../../state'
import type { GraphState } from '../../state'

export function buildLangGraphNativeTrace(state: Pick<GraphState, 'trace_steps'>): NativeTrace {
  const hasGraphEdges = state.trace_steps.length > 1
  return {
    engine: 'langgraph',
    version: '0.1.0',
    events: state.trace_steps.map((step) => ({
      stage: step.stage,
      at: step.started_at,
      duration_ms: step.duration_ms,
      metadata: step.metadata,
    })),
    metadata: {
      stage_count: state.trace_steps.length,
      has_graph_updates: hasGraphEdges,
      normalized_graph_events: state.trace_steps.map((step) => step.stage),
    },
  }
}
