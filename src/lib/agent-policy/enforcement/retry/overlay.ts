import type { RetryPolicy } from '../../schema/body'

export function overlayRetry(
  stepRetryConfig: RetryPolicy | undefined,
  policyRetry: RetryPolicy | undefined,
): RetryPolicy | undefined {
  if (!policyRetry) return stepRetryConfig
  return { ...stepRetryConfig, ...policyRetry }
}
