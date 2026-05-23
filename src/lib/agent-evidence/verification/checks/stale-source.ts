import type { SourceRecord } from '../../storage/types'

export async function check(
  sources: SourceRecord[],
  maxAgeDays: number,
): Promise<{ passed: boolean; observed: number; threshold: number }> {
  const cutoff = Date.now() - maxAgeDays * 86_400_000
  const stale = sources.filter(s => s.retrievedAt < cutoff)
  return { passed: stale.length === 0, observed: stale.length, threshold: maxAgeDays }
}
