import type { NativeTrace } from '../../state'
import type { GraphState } from '../../state'

interface ManualNativeEvent {
  stage: string
  at: string
  duration_ms: number
  metadata?: Record<string, unknown>
}

export function buildManualNativeTrace(
  state: Pick<GraphState, 'trace_steps'> & { thread_id?: string },
  engineEvents?: ManualNativeEvent[]
): NativeTrace {
  const engine: NativeTrace['engine'] = 'manual'
  const events = engineEvents?.length
    ? engineEvents
    : state.trace_steps.map((step) => ({
        stage: step.stage,
        at: step.started_at,
        duration_ms: step.duration_ms,
        metadata: step.metadata,
      }))

  return {
    engine,
    version: '0.1.0',
    events,
    metadata: {
      stage_count: events.length,
      has_tokens: state.trace_steps.some((step) => Boolean(step.tokens?.output || step.tokens?.input)),
      engine_thread_id: state.thread_id,
    },
  }
}
