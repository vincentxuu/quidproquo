import type { ToolDefinition } from '../../tools/types'
import type { AnySyscallDefinition, SyscallDefinition } from './types'

export function defineSyscall<TIn = unknown, TOut = unknown>(definition: SyscallDefinition<TIn, TOut>): SyscallDefinition<TIn, TOut> {
  return definition
}

export function syscallToToolDefinition(definition: AnySyscallDefinition): ToolDefinition {
  return {
    name: definition.name,
    description: definition.description,
    inputSchema: definition.inputSchema,
    outputSchema: definition.outputSchema,
    cost: definition.costModel ?? { kind: 'free' },
    outboundDomains: definition.outboundDomains,
    requiresApproval: definition.requiresApproval,
  }
}
