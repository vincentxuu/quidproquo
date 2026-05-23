export interface RetryPolicy {
  maxAttempts: number
  backoffMs: number
}

export interface PolicyRetryConfig {
  max_attempts?: number
  backoff?: 'exponential' | 'fixed' | 'linear'
  backoff_base_ms?: number
  on_exhaustion?: 'fail' | 'skip' | 'fallback'
  fallback_provider?: string
}

export interface ResolvedRetryPolicy extends RetryPolicy {
  onExhaustion?: string
  fallbackProvider?: string
}

export function overlayRetryFromPolicy(
  base: RetryPolicy,
  policy?: PolicyRetryConfig,
): ResolvedRetryPolicy {
  if (!policy) return base
  return {
    ...base,
    maxAttempts: policy.max_attempts ?? base.maxAttempts,
    backoffMs: policy.backoff_base_ms ?? base.backoffMs,
    onExhaustion: policy.on_exhaustion,
    fallbackProvider: policy.fallback_provider,
  }
}

export async function withRetry<T>(fn: () => Promise<T>, policy: ResolvedRetryPolicy): Promise<T | { skipped: true }> {
  let lastError: unknown
  for (let attempt = 0; attempt < policy.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < policy.maxAttempts - 1) {
        const delay = Math.min(policy.backoffMs * Math.pow(2, attempt), 60000)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  // All attempts exhausted — apply on_exhaustion policy
  if (policy.onExhaustion === 'skip') {
    return { skipped: true }
  }

  if (policy.fallbackProvider) {
    // TODO: route final attempt through fallbackProvider via agent-providers routing
  }

  // Default: on_exhaustion === 'fail' — rethrow last error
  throw lastError
}
