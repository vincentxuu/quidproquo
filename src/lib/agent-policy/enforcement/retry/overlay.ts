import type { RetryPolicy } from '../../schema/categories/retry'

export function overlayRetry(
  stepRetryConfig: RetryPolicy | undefined,
  policyRetry: RetryPolicy | undefined,
): RetryPolicy | undefined {
  if (!policyRetry) return stepRetryConfig
  return { ...stepRetryConfig, ...policyRetry }
}
