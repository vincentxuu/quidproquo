import type { SourceRecord } from '../../storage/types'

export async function check(
  sources: SourceRecord[],
  threshold: number,
): Promise<{ passed: boolean; observed: number; threshold: number }> {
  return { passed: sources.length >= threshold, observed: sources.length, threshold }
}
