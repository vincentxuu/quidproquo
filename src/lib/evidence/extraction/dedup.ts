import type { ClaimFtsBackend } from '../storage/types'
import type { Candidate } from './candidates'
import { claimHash } from './hash'

const DEFAULT_SIMILARITY_THRESHOLD = 0.8

export async function dedupCandidates(
  candidates: Candidate[],
  flowRunId: string,
  fts: ClaimFtsBackend,
  _threshold = DEFAULT_SIMILARITY_THRESHOLD,
): Promise<Candidate[]> {
  const kept: Candidate[] = []
  const seenHashes = new Set<string>()

  for (const candidate of candidates) {
    const hash = await claimHash(candidate.text)
    if (seenHashes.has(hash)) continue // exact dedup within this batch

    // FTS dedup: check if similar claim already exists in this flow run.
    // FTS5 BM25 rank is negative — more negative means a better match.
    // Any FTS match is treated as a near-duplicate (conservative v1 heuristic).
    const matches = await fts.search(candidate.text, flowRunId, 3)
    const isDuplicate = matches.some((m) => m.score < 0)

    if (!isDuplicate) {
      seenHashes.add(hash)
      kept.push(candidate)
    }
  }

  return kept
}
