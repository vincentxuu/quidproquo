import type { ProviderBackends } from './storage/types'
import { get as getProvider } from './registry'
import { getHealth } from './health'
import { chooseWithWeights } from './routing-loadbalance'
import type { Flags } from '../config/flags'

export interface FallbackPolicy {
  order: string[]
  minSuccessRate?: number
}

export interface FallbackRouteOpts {
  category: string
  input: unknown
  policy: FallbackPolicy
  backends: ProviderBackends
  dispatch: (providerId: string, input: unknown) => Promise<unknown>
  flags?: Flags
}

// Errors that allow trying the next provider
const FALLBACK_ELIGIBLE_CODES = new Set([
  'PROVIDER_UNHEALTHY',
  'PROVIDER_RATE_LIMITED',
  'CREDENTIAL_NOT_FOUND',
  'CREDENTIAL_EXPIRED',
  'FETCH_NETWORK_ERROR',
])

const LATENCY_BASELINE_MS = 100

export async function routeWithFallback(opts: FallbackRouteOpts): Promise<unknown> {
  const { policy, backends, dispatch, flags } = opts
  const minSuccessRate = policy.minSuccessRate ?? 80

  // Build candidate list: filter by health
  const healthMap = new Map<string, { successRatePct: number | null; p50LatencyMs: number | null }>()
  const candidates: string[] = []
  for (const providerId of policy.order) {
    try {
      const h = await getHealth({ providerId, backends })
      healthMap.set(providerId, { successRatePct: h.successRatePct, p50LatencyMs: h.p50LatencyMs })
      if (h.sampleSize === 0) {
        // No health data yet — allow
        candidates.push(providerId)
        continue
      }
      if (typeof h.successRatePct === 'number' && h.successRatePct < minSuccessRate) {
        continue
      }
      candidates.push(providerId)
    } catch {
      // Cannot read health — allow optimistically
      candidates.push(providerId)
    }
  }

  // Load-balance: when flag is on and ≥2 healthy candidates exist, pick first via weights
  if (flags?.providers.routing.loadBalance && candidates.length >= 2) {
    const weighted = candidates.map((providerId) => {
      const def = getProvider(providerId)
      const health = healthMap.get(providerId)
      const costProxy =
        typeof (def?.costModelJson as Record<string, unknown>)?.inputPer1MUsd === 'number'
          ? ((def!.costModelJson as Record<string, unknown>).inputPer1MUsd as number)
          : 1.0
      const successRate =
        health?.successRatePct !== null && health?.successRatePct !== undefined
          ? health.successRatePct / 100
          : 1.0
      const observedP50Ms =
        health?.p50LatencyMs !== null && health?.p50LatencyMs !== undefined
          ? health.p50LatencyMs
          : LATENCY_BASELINE_MS
      return {
        providerId,
        costProxy: costProxy > 0 ? costProxy : 1.0,
        successRate,
        observedP50Ms: observedP50Ms > 0 ? observedP50Ms : LATENCY_BASELINE_MS,
        latencyBaselineMs: LATENCY_BASELINE_MS,
      }
    })
    const chosen = chooseWithWeights(weighted)
    if (chosen) {
      // Reorder so load-balanced pick is tried first
      const rest = candidates.filter((id) => id !== chosen)
      candidates.length = 0
      candidates.push(chosen, ...rest)
    }
  }

  const errors: Array<{ providerId: string; error: unknown }> = []

  for (const providerId of candidates) {
    try {
      return await dispatch(providerId, opts.input)
    } catch (err) {
      const code = (err as Record<string, unknown>)?.code as string | undefined
      if (FALLBACK_ELIGIBLE_CODES.has(code ?? '')) {
        errors.push({ providerId, error: err })
        continue
      }
      // Non-fallback error — surface immediately
      throw err
    }
  }

  // All candidates exhausted
  const allFailed = new Error(`All providers failed for category '${opts.category}'`)
  ;(allFailed as unknown as Record<string, unknown>).code = 'ALL_PROVIDERS_FAILED'
  ;(allFailed as unknown as Record<string, unknown>).errors = errors
  throw allFailed
}
