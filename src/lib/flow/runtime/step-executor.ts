import type { FlowStep } from '../dsl/ast'
import type { FlowState } from './state'

export interface StepContext {
  flowRunId: string
  stepRunId: string
  db?: unknown // D1Database - optional for unit tests
  kernel?: unknown // agent-os kernel - optional for unit tests
}

export interface StepResult {
  outputs: Record<string, unknown>
  status: 'done' | 'failed'
  errorJson?: Record<string, unknown>
}

export type StepExecutor = (step: FlowStep, ctx: StepContext, state: FlowState) => Promise<StepResult>

// Dispatch table keyed by step.type
const executors = new Map<string, StepExecutor>()

export function registerStepExecutor(type: string, executor: StepExecutor): void {
  executors.set(type, executor)
}

export async function executeStep(step: FlowStep, ctx: StepContext, state: FlowState): Promise<StepResult> {
  const executor = executors.get(step.type)
  if (!executor) {
    return { outputs: {}, status: 'failed', errorJson: { kind: 'unknown_step_type', type: step.type } }
  }
  return executor(step, ctx, state)
}
