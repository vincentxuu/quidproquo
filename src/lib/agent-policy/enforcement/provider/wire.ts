import type { ProviderPolicy } from '../../schema/categories/provider'
import { checkProvider, type ProviderInfo } from './check'

export interface ProviderEnforcementWire {
  checkBeforeDispatch(providerId: string, providerInfo?: Partial<ProviderInfo>): { allowed: boolean; fallbackId?: string }
}

export function wireProviderEnforcement(
  policy: ProviderPolicy | undefined,
): ProviderEnforcementWire {
  return {
    checkBeforeDispatch(providerId: string, providerInfo?: Partial<ProviderInfo>): { allowed: boolean; fallbackId?: string } {
      if (!policy) return { allowed: true }

      const info: ProviderInfo = { id: providerId, ...providerInfo }
      const result = checkProvider(info, policy)

      if (result.allowed) return { allowed: true }

      // Walk fallback chain
      for (const fallbackId of policy.fallback_chain ?? []) {
        const fallbackResult = checkProvider({ id: fallbackId }, policy)
        if (fallbackResult.allowed) return { allowed: true, fallbackId }
      }

      return { allowed: false }
    },
  }
}
