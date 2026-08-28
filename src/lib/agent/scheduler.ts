import { nowMs } from '../utils/dates'
import { AgentCancelled } from './errors'
import { createRunContext } from './context'
import { createMemoryAPI } from './memory'
import type { AgentDefinition } from './access'
import type { AgentOsBackends } from './storage'
import type { AgentRunTrigger } from './storage/types'
import type { SyscallContext } from './tools/types'

export interface DispatchRunInput {
  agentId: string
  trigger: AgentRunTrigger
  input: unknown
  runtimeOptions?: unknown
  parentRunId?: string
  userId?: string
  sessionId?: string
}

export class ConcurrencyExceededError extends Error {
  constructor(agentId: string) {
    super(`Concurrency exceeded for agent: ${agentId}`)
    this.name = 'ConcurrencyExceededError'
  }
}

export function createScheduler(options: {
  backends: AgentOsBackends
  registry: Map<string, AgentDefinition<any, any>>
  syscall: (ctx: SyscallContext, name: string, input: unknown) => Promise<unknown>
}) {
  return {
    async dispatchRun(input: DispatchRunInput): Promise<{ runId: string }> {
      const definition = options.registry.get(input.agentId)
      if (!definition) throw new Error(`Unknown agent: ${input.agentId}`)
      const process = await options.backends.processes.get(input.agentId)
      if (!process) throw new Error(`Agent process not registered: ${input.agentId}`)
      const active = await options.backends.runs.countActive(input.agentId)
      if (active >= process.maxConcurrent) throw new ConcurrencyExceededError(input.agentId)
      const runId = crypto.randomUUID()
      const startedAt = nowMs()
      await options.backends.runs.create({
        runId,
        agentId: input.agentId,
        agentVersion: definition.version,
        status: 'pending',
        trigger: input.trigger,
        parentRunId: input.parentRunId,
        input: input.input,
        cancelSignal: false,
        startedAt,
        totalTokens: 0,
        totalCostUsd: 0,
        totalToolCalls: 0,
      })
      await options.backends.runs.transition(runId, 'running')
      await options.backends.events.record({ runId, kind: 'started', payload: { trigger: input.trigger }, at: startedAt })
      const run = await options.backends.runs.get(runId)
      if (!run) throw new Error(`Run not found after insert: ${runId}`)
      const context = createRunContext(run, options.backends.events)
      const controller = new AbortController()
      const timeout = setTimeout(() => {
        void options.backends.cancelSignals.signal(runId)
        void options.backends.runs.markCancelRequested(runId)
        controller.abort('timeout')
      }, process.timeoutSeconds * 1000)
      try {
        if (await options.backends.cancelSignals.isSignaled(runId)) {
          throw new AgentCancelled(runId)
        }
        const scope = {
          orgId: '1',
          userId: input.userId ?? (input.trigger === 'manual' ? 'admin' : 'system'),
          agentId: input.agentId,
          sessionId: input.sessionId ?? runId,
        }
        const syscallContext: SyscallContext = {
          runId,
          agentId: input.agentId,
          scope,
          signal: controller.signal,
          memory: createMemoryAPI({
            backends: options.backends,
            currentScope: scope,
            agentId: input.agentId,
            emit: context.emit,
          }),
          emit: context.emit,
        }
        const output = await definition.run(input.input, {
          context,
          syscallContext,
          syscall: options.syscall,
          runtimeOptions: input.runtimeOptions,
        })
        await options.backends.runs.transition(runId, 'done', { output, finishedAt: nowMs() })
        await options.backends.events.record({ runId, kind: 'finished', payload: { status: 'done' }, at: nowMs() })
      } catch (error) {
        const reason = controller.signal.aborted ? 'timeout' : error instanceof AgentCancelled ? 'cancelled' : 'failed'
        await options.backends.runs.transition(runId, reason === 'cancelled' ? 'cancelled' : 'failed', {
          error: error instanceof Error ? { message: error.message, stack: error.stack, reason } : { message: String(error), reason },
          finishedAt: nowMs(),
        })
        await options.backends.events.record({ runId, kind: reason === 'cancelled' ? 'cancelled' : 'failed', payload: { reason }, at: nowMs() })
      } finally {
        clearTimeout(timeout)
      }
      return { runId }
    },
  }
}

export async function dispatchFromCron(scheduler: ReturnType<typeof createScheduler>, agentId: string, input: unknown): Promise<{ runId: string }> {
  return scheduler.dispatchRun({ agentId, trigger: 'cron', input, userId: 'system' })
}

export async function dispatchFromQueue(scheduler: ReturnType<typeof createScheduler>, message: { agentId: string; input?: unknown; parentRunId?: string }): Promise<{ runId: string }> {
  return scheduler.dispatchRun({ agentId: message.agentId, trigger: 'queue', input: message.input ?? {}, parentRunId: message.parentRunId, userId: 'system' })
}
