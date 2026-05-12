import type { NativeTrace } from '../../state'
import type { GraphState } from '../../state'

export interface LlamaIndexNativeTraceEvent {
  stage: string
  at: string
  duration_ms: number
  metadata?: Record<string, unknown>
}

export function buildLlamaIndexNativeTrace(
  state: Pick<GraphState, 'trace_steps'>,
  nativeEvents: LlamaIndexNativeTraceEvent[] = [],
): NativeTrace {
  const events = nativeEvents.length > 0
    ? nativeEvents
    : state.trace_steps.map((step) => ({
      stage: step.stage,
      at: step.started_at,
      duration_ms: step.duration_ms,
      metadata: {
        ...step.metadata,
        engine: 'llamaindex-steps',
      },
    }))

  return {
    engine: 'llamaindex',
    version: '0.1.0',
    events,
    metadata: {
      note: nativeEvents.length > 0
        ? 'Native trace emitted by llamaindex retriever/query flow'
        : 'Placeholder-native trace from normalized trace steps',
      stage_count: events.length,
    },
  }
}
