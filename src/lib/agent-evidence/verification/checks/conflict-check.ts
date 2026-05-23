import type { ConflictRecord } from '../../storage/types'

export async function check(
  conflicts: ConflictRecord[],
): Promise<{ passed: boolean; observed: number }> {
  const unresolvedCount = conflicts.filter(c => c.status === 'pending').length
  return { passed: unresolvedCount === 0, observed: unresolvedCount }
}
