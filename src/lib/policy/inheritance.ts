import type { PolicyBindingBackend, PolicyDefinitionBackend, PolicyBindingRow } from './storage/types'
import type { PolicyBody } from './schema/body'
import { PolicyInheritanceCycle } from './errors'

export interface BindingSource { scope: string; policyKey: string; version: number }
export interface ResolveResult { effective: PolicyBody; sourceChain: BindingSource[] }

export class PolicyInheritance {
  constructor(
    private readonly definitions: PolicyDefinitionBackend,
    private readonly bindings: PolicyBindingBackend,
  ) {}

  async resolve(opts: { flowRunId?: number; flowDefId?: number; agentId?: string }): Promise<ResolveResult> {
    const effective: PolicyBody = {}
    const sourceChain: BindingSource[] = []
    const seenKeys = new Set<string>()

    // Resolution order: global → agent → flow_definition → run
    const scopes: Array<() => Promise<PolicyBindingRow[]>> = [
      () => this.bindings.listGlobal(),
      () => opts.agentId ? this.bindings.listByAgent(opts.agentId) : Promise.resolve([]),
      () => opts.flowDefId ? this.bindings.listByFlowDefinition(opts.flowDefId) : Promise.resolve([]),
      () => opts.flowRunId ? this.bindings.getByFlowRun(opts.flowRunId).then(r => r ? [r] : []) : Promise.resolve([]),
    ]

    for (const fetchScope of scopes) {
      const rows = await fetchScope()
      for (const row of rows) {
        // Use frozenEffective if available, otherwise look up definition by policyId via listing all
        let body: PolicyBody
        let policyKey: string
        let version: number

        if (row.frozenEffective) {
          body = row.frozenEffective
          // We still need key/version for the chain; do a best-effort lookup
          const allDefs = await this.definitions.list({ archived: true })
          const def = allDefs.find(d => (d as { policyId: number }).policyId === row.policyId)
          if (!def) continue
          const typedDef = def as { policyKey: string; version: number; body: PolicyBody }
          policyKey = typedDef.policyKey
          version = typedDef.version
        } else {
          const allDefs = await this.definitions.list({ archived: true })
          const def = allDefs.find(d => (d as { policyId: number }).policyId === row.policyId)
          if (!def) continue
          const typedDef = def as { policyKey: string; version: number; body: PolicyBody }
          policyKey = typedDef.policyKey
          version = typedDef.version
          body = typedDef.body
        }

        if (seenKeys.has(policyKey)) throw new PolicyInheritanceCycle()
        seenKeys.add(policyKey)
        Object.assign(effective, body)
        sourceChain.push({ scope: row.scope, policyKey, version })
      }
    }
    return { effective, sourceChain }
  }
}
