import type { ProviderCategory, ProviderDefinition, CredentialResolution } from './types'
import type { ProviderBackends } from './storage/types'
import type { Flags } from '../config/flags'
import type { KVStore } from './routing-ratelimit'
import { get } from './registry'
import { ProviderNotFound } from './errors'
import { routeWithFallback } from './routing-fallback'
import { checkRateLimit } from './routing-ratelimit'

export class PolicyProviderNotAllowed extends Error {
  name = 'PolicyProviderNotAllowed'
  constructor(providerId: string) {
    super(`Provider not allowed by policy: ${providerId}`)
  }
}

export interface RoutePolicy {
  allowlist?: string[]
  fallback_chain?: string[]
  rateLimits?: Record<string, { perMinute?: number; perDay?: number }>
}

export async function route(opts: {
  category: ProviderCategory
  providerId: string
  backends: ProviderBackends
  credential: CredentialResolution
  flags?: Flags
  policy?: RoutePolicy
  kv?: KVStore
  dispatch?: (providerId: string, input: unknown) => Promise<unknown>
  input?: unknown
}): Promise<{ provider: ProviderDefinition; credential: CredentialResolution }> {
  const { providerId, credential, flags, policy, backends, kv, dispatch, input } = opts

  // Policy allowlist check
  if (policy?.allowlist && policy.allowlist.length > 0) {
    if (!policy.allowlist.includes(providerId)) {
      throw new PolicyProviderNotAllowed(providerId)
    }
  }

  // Fallback routing: when flag is on and a fallback_chain is provided
  if (flags?.providers.routing.fallback && policy?.fallback_chain && policy.fallback_chain.length > 0 && dispatch) {
    await routeWithFallback({
      category: opts.category,
      input: input ?? null,
      policy: { order: policy.fallback_chain },
      backends,
      dispatch,
    })
  }

  // Rate-limit check before dispatch
  if (flags?.providers.routing.rateLimits && policy?.rateLimits?.[providerId] && kv) {
    await checkRateLimit({
      providerId,
      policy: policy.rateLimits[providerId],
      kv,
    })
  }

  const provider = get(providerId)
  if (!provider) {
    throw new ProviderNotFound(providerId)
  }

  return { provider, credential }
}
