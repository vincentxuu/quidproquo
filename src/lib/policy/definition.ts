import type { PolicyDefinitionBackend } from './storage/types'
import type { PolicyBody } from './schema/body'
import { validatePolicyBody } from './schema/validate'
import { PolicyDefinitionInvalid, PolicyNotImplemented } from './errors'

export class PolicyDefinitionRegistry {
  constructor(private readonly backend: PolicyDefinitionBackend) {}

  async register(opts: { policyKey: string; label: string; body: PolicyBody; createdBy?: string }): Promise<number> {
    const { valid, errors } = validatePolicyBody(opts.body)
    if (!valid) throw new PolicyDefinitionInvalid(errors)
    return this.backend.insert({ policyKey: opts.policyKey, version: 1, label: opts.label, body: opts.body, createdBy: opts.createdBy })
  }

  async getByKey(policyKey: string, version?: number): Promise<unknown> {
    return this.backend.getByKey(policyKey, version)
  }

  async list(filters?: { archived?: boolean }): Promise<unknown[]> {
    return this.backend.list(filters)
  }

  async archive(policyKey: string): Promise<void> {
    return this.backend.archive(policyKey)
  }

  async bumpVersion(policyKey: string, newBody: PolicyBody): Promise<number> {
    const { valid, errors } = validatePolicyBody(newBody)
    if (!valid) throw new PolicyDefinitionInvalid(errors)
    return this.backend.bumpVersion(policyKey, newBody)
  }
}

// Keep PolicyNotImplemented importable from this module for callers
export { PolicyNotImplemented }
