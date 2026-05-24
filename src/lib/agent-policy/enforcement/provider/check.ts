import type { ProviderPolicy } from '../../schema/body'
import { matchesRegion } from './region-matcher'

export type DenialReason = 'not_in_allowlist' | 'in_denylist' | 'region_mismatch' | 'residency_mismatch'

export interface ProviderCheckResult {
  allowed: boolean
  reason?: DenialReason
}

export interface ProviderInfo {
  id: string
  region?: string
  dataResidency?: string
}

export function checkProvider(
  requested: ProviderInfo,
  policy: ProviderPolicy | undefined,
): ProviderCheckResult {
  if (!policy) return { allowed: true }

  // 1. Denylist check first
  if (policy.denylist?.includes(requested.id)) {
    return { allowed: false, reason: 'in_denylist' }
  }

  // 2. Allowlist check
  if (policy.allowlist && !policy.allowlist.includes(requested.id)) {
    return { allowed: false, reason: 'not_in_allowlist' }
  }

  // 3. Region check
  if (policy.region && requested.region) {
    if (!matchesRegion(requested.region, policy.region)) {
      return { allowed: false, reason: 'region_mismatch' }
    }
  }

  // 4. Data residency check
  if (policy.data_residency && policy.data_residency !== 'any' && requested.dataResidency) {
    if (requested.dataResidency !== policy.data_residency) {
      return { allowed: false, reason: 'residency_mismatch' }
    }
  }

  return { allowed: true }
}
