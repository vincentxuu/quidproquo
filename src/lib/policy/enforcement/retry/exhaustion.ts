import type { RetryPolicy } from '../../schema/body'

export interface ExhaustionResult { continue: boolean }

export function handleExhaustion(
  opts: { flowRunId: string; stepRunId: string; error: unknown; policyRetry: RetryPolicy | undefined },
): ExhaustionResult {
  if (opts.policyRetry?.on_exhaustion === 'skip') return { continue: true }
  return { continue: false }
}
