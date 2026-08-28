import type { AgentRunEventRecord, AgentRunRecord, EventLogBackend } from './storage/types'
import { defaultPrune, type ContextMessage } from './context-pruner'

export interface RunContext {
  runId: string
  input: unknown
  messages: ContextMessage[]
  stepOutputs: Record<string, unknown>
  currentStep?: string
  beginStep(stepId: string): Promise<void>
  endStep(stepId: string, output: unknown): Promise<void>
  emit(kind: string, payload: unknown): Promise<void>
  prune(maxTokens: number): Promise<void>
}

export function createRunContext(run: AgentRunRecord, events: EventLogBackend): RunContext {
  const context: RunContext = {
    runId: run.runId,
    input: run.input,
    messages: [],
    stepOutputs: {},
    async beginStep(stepId: string) {
      const previous = context.currentStep
      context.currentStep = stepId
      await context.emit('step', { phase: 'begin', previous })
    },
    async endStep(stepId: string, output: unknown) {
      context.stepOutputs[stepId] = output
      await context.emit('step', { phase: 'end', output })
    },
    async emit(kind: string, payload: unknown) {
      await events.record({
        runId: run.runId,
        kind,
        stepId: context.currentStep,
        payload,
        at: Date.now(),
      })
    },
    async prune(maxTokens: number) {
      const pruned = defaultPrune(context.messages, maxTokens)
      if (pruned.dropped > 0) {
        context.messages = pruned.messages
        await context.emit('context_pruned', { dropped: pruned.dropped, summaryLength: pruned.summary.length })
      }
    },
  }
  return context
}

export async function replayContext(runId: string, events: EventLogBackend): Promise<{ events: AgentRunEventRecord[]; stepOutputs: Record<string, unknown> }> {
  const rows = await events.listForRun(runId, { limit: 500 })
  const stepOutputs: Record<string, unknown> = {}
  for (const event of rows) {
    if (event.kind === 'step' && isEndStepPayload(event.payload) && event.stepId) {
      stepOutputs[event.stepId] = event.payload.output
    }
  }
  return { events: rows, stepOutputs }
}

function isEndStepPayload(payload: unknown): payload is { phase: 'end'; output: unknown } {
  return typeof payload === 'object' && payload !== null && (payload as { phase?: unknown }).phase === 'end'
}
