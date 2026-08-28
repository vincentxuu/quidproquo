import type { ClaimRecord, CitationRecord } from '../../storage/types'

export async function check(
  claims: ClaimRecord[],
  citations: CitationRecord[],
): Promise<{ passed: boolean; message?: string; observed?: number }> {
  if (claims.length === 0) return { passed: false, message: 'no claims extracted', observed: 0 }
  const citedClaimIds = new Set(citations.map(c => c.claimId))
  const uncited = claims.filter(c => !citedClaimIds.has(c.claimId))
  const passed = uncited.length === 0
  return {
    passed,
    message: passed ? undefined : `${uncited.length} claims have no citation`,
    observed: claims.length - uncited.length,
  }
}
