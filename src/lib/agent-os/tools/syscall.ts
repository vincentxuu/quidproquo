import { SyscallInputInvalid, SyscallLimitExceeded, SyscallNotFound } from '../errors'
import type { AgentOsBackends } from '../storage'
import type { AgentProcessRecord, AgentRunRecord } from '../storage/types'
import { irreversibleSyscalls } from './irreversible'
import type { AnySyscallDefinition, CostModel, SyscallContext, SyscallDefinition } from './types'

const syscalls = new Map<string, AnySyscallDefinition>()

export function registerSyscall(definition: AnySyscallDefinition): void {
  syscalls.set(definition.name, definition)
}

export function getSyscall(name: string): AnySyscallDefinition | undefined {
  return syscalls.get(name)
}

export function listSyscalls(): AnySyscallDefinition[] {
  return [...syscalls.values()]
}

export function clearSyscalls(): void {
  syscalls.clear()
}

export function createSyscallHelper(options: {
  backends: AgentOsBackends
  getRun: (runId: string) => Promise<AgentRunRecord | null>
  getProcess: (agentId: string) => Promise<AgentProcessRecord | null>
  checkSyscall: (agentId: string, syscall: string) => Promise<void>
  checkOutboundDomain: (agentId: string, url: string) => Promise<void>
  requestApproval: (input: { runId: string; reason: string; context: unknown; ttlSeconds?: number }) => Promise<string>
}) {
  return async function syscall<TOut = unknown>(ctx: SyscallContext, name: string, input: unknown): Promise<TOut> {
    const definition = syscalls.get(name)
    if (!definition) {
      await deny(options.backends, ctx, 'unknown_syscall', { syscall: name })
      throw new SyscallNotFound(name)
    }
    try {
      await options.checkSyscall(ctx.agentId, name)
    } catch (error) {
      await deny(options.backends, ctx, 'syscall_not_granted', { syscall: name })
      throw error
    }
    const run = await options.getRun(ctx.runId)
    if (!run) throw new Error(`Run not found: ${ctx.runId}`)
    const process = await options.getProcess(ctx.agentId)
    const limit = process?.toolCallLimit ?? 0
    if (run.totalToolCalls >= limit) {
      await deny(options.backends, ctx, 'tool_call_limit', { syscall: name })
      throw new SyscallLimitExceeded(limit)
    }
    validateInput(definition, input)
    for (const url of findUrls(input)) {
      try {
        await options.checkOutboundDomain(ctx.agentId, url)
      } catch (error) {
        await deny(options.backends, ctx, 'outbound_domain_not_granted', { syscall: name, url })
        throw error
      }
    }
    if (definition.requiresApproval || irreversibleSyscalls.has(name)) {
      await options.requestApproval({ runId: ctx.runId, reason: `irreversible: ${name}`, context: input })
    }
    const startedAt = Date.now()
    try {
      const output = await definition.handler(ctx, input)
      const latencyMs = Math.max(0, Date.now() - startedAt)
      const cost = estimateCost(definition.costModel, input, output)
      await options.backends.events.recordWithRunCounters(
        { runId: ctx.runId, kind: 'syscall', payload: { syscall: name }, at: startedAt },
        {
          runId: ctx.runId,
          syscallName: name,
          input,
          output,
          tokensIn: cost.tokensIn,
          tokensOut: cost.tokensOut,
          costUsd: cost.costUsd,
          latencyMs,
          startedAt,
        },
        { tokens: cost.tokensIn + cost.tokensOut, costUsd: cost.costUsd, toolCalls: 1 },
      )
      return output as TOut
    } catch (error) {
      const latencyMs = Math.max(0, Date.now() - startedAt)
      await options.backends.events.recordWithRunCounters(
        { runId: ctx.runId, kind: 'syscall', payload: { syscall: name, error: error instanceof Error ? error.message : String(error) }, at: startedAt },
        {
          runId: ctx.runId,
          syscallName: name,
          input,
          error: error instanceof Error ? error.message : String(error),
          latencyMs,
          startedAt,
        },
        { tokens: 0, costUsd: 0, toolCalls: 1 },
      )
      throw error
    }
  }
}

async function deny(backends: AgentOsBackends, ctx: SyscallContext, reason: string, payload: Record<string, unknown>): Promise<void> {
  await backends.events.record({
    runId: ctx.runId,
    kind: 'denied',
    payload: { reason, ...payload },
    at: Date.now(),
  })
}

function validateInput(definition: SyscallDefinition, input: unknown): void {
  const schema = definition.inputSchema
  if (schema.type === 'object' && (typeof input !== 'object' || input === null || Array.isArray(input))) {
    throw new SyscallInputInvalid(`${definition.name} expects object input`)
  }
  const required = Array.isArray(schema.required) ? schema.required : []
  for (const key of required) {
    if (!(key in (input as Record<string, unknown>))) {
      throw new SyscallInputInvalid(`${definition.name} missing required field: ${String(key)}`)
    }
  }
}

function findUrls(value: unknown): string[] {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) return [value]
  if (!value || typeof value !== 'object') return []
  if (Array.isArray(value)) return value.flatMap(findUrls)
  return Object.entries(value).flatMap(([key, child]) => key === 'url' && typeof child === 'string' ? [child] : findUrls(child))
}

function estimateCost(costModel: CostModel | undefined, _input: unknown, output: unknown): { tokensIn: number; tokensOut: number; costUsd: number } {
  const tokens = extractTokens(output)
  if (!costModel || costModel.kind === 'free') return { ...tokens, costUsd: 0 }
  if (costModel.kind === 'request') return { ...tokens, costUsd: costModel.perCallUsd }
  if (costModel.kind === 'token') {
    return {
      ...tokens,
      costUsd: (tokens.tokensIn / 1000) * costModel.inputPerKToken + (tokens.tokensOut / 1000) * costModel.outputPerKToken,
    }
  }
  return { ...tokens, costUsd: 0 }
}

function extractTokens(output: unknown): { tokensIn: number; tokensOut: number } {
  if (!output || typeof output !== 'object') return { tokensIn: 0, tokensOut: 0 }
  const record = output as Record<string, unknown>
  const tokens = record.tokens as Record<string, unknown> | undefined
  return {
    tokensIn: Number(tokens?.input ?? record.tokens_in ?? 0),
    tokensOut: Number(tokens?.output ?? record.tokens_out ?? 0),
  }
}
