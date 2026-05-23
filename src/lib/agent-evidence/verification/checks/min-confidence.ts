import type { ClaimRecord } from '../../storage/types'

export async function check(
  claims: ClaimRecord[],
  threshold: number,
): Promise<{ passed: boolean; observed: number; threshold: number }> {
  if (claims.length === 0) return { passed: true, observed: 1, threshold }
  const avgConfidence = claims.reduce((sum, c) => sum + c.confidence, 0) / claims.length
  return { passed: avgConfidence >= threshold, observed: avgConfidence, threshold }
}
