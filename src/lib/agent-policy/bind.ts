import type { PolicyBindingBackend, PolicyDefinitionBackend } from './storage/types'
import { PolicyInheritance } from './inheritance'
import type { Flags } from '../config/flags'

export async function bindPolicyToFlowRun(
  flowRunId: number,
  opts: { flowDefId?: number; agentId?: string },
  backends: { definitions: PolicyDefinitionBackend; bindings: PolicyBindingBackend },
  flags: Flags,
): Promise<number | null> {
  if (!flags.agentPolicy?.enabled) return null
  try {
    const inheritance = new PolicyInheritance(backends.definitions, backends.bindings)
    const { effective, sourceChain } = await inheritance.resolve({ flowRunId, flowDefId: opts.flowDefId, agentId: opts.agentId })
    if (sourceChain.length === 0) return null
    return backends.bindings.insert({
      policyId: 0, // resolved from chain
      scope: 'run',
      flowRunId,
      frozenEffective: effective,
    })
  } catch {
    return null
  }
}
