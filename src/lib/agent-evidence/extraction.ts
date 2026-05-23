import type { EvidenceBackends, ExcerptRecord, SourceRecord } from './storage/types'
import type { EvidenceStore } from './store'
import type { SourceReputation } from './reputation'
import { generateCandidates } from './extraction/candidates'
import { claimHash } from './extraction/hash'
import { dedupCandidates } from './extraction/dedup'

/**
 * v1 claim extractor — noun/verb-phrase candidate generation.
 * Pipeline: sentence split → POS-tag-free chunking via punctuation +
 * capitalization + connective patterns → score via D4 formula →
 * dedup per (flow_run_id, claim_hash) via FTS index.
 */
export class ClaimExtractor {
  constructor(
    private readonly store: EvidenceStore,
    private readonly reputation: SourceReputation,
    private readonly backends: EvidenceBackends,
  ) {}

  async extractFromSource(
    source: SourceRecord,
    excerpts: ExcerptRecord[],
    ctx: { flowRunId: string; flowStepRunId?: string; agentRunId?: string; agentId?: string },
  ): Promise<{ claimsInserted: number; citationsInserted: number; deduped: number }> {
    let claimsInserted = 0
    let citationsInserted = 0
    let deduped = 0

    const domain = new URL(source.url).hostname.replace(/^www\./, '')
    const reputation = await this.reputation.getScore(domain)
    const freshnessScore = source.freshnessScore ?? 0.5

    for (const excerpt of excerpts) {
      const candidates = generateCandidates(excerpt.text)
      const surviving = await dedupCandidates(candidates, ctx.flowRunId, this.backends.claimFts)
      deduped += candidates.length - surviving.length

      for (const candidate of surviving) {
        const hash = await claimHash(candidate.text)
        const confidence = Math.min(
          1,
          Math.max(
            0,
            0.5 * freshnessScore + 0.3 * reputation + 0.2 * 0.5, // agentSelfRated defaults to 0.5
          ),
        )

        const claimId = await this.store.storeClaim({
          claimText: candidate.text,
          claimHash: hash,
          flowRunId: ctx.flowRunId,
          flowStepRunId: ctx.flowStepRunId,
          agentRunId: ctx.agentRunId,
          agentId: ctx.agentId,
          confidence,
        })
        claimsInserted++

        const provenanceChain = JSON.stringify({
          flowRunId: ctx.flowRunId,
          flowStepRunId: ctx.flowStepRunId,
          agentRunId: ctx.agentRunId,
          sourceId: source.sourceId,
          excerptId: excerpt.excerptId,
        })
        await this.store.storeCitation({
          claimId,
          excerptId: excerpt.excerptId,
          relation: 'supports',
          provenanceChainJson: provenanceChain,
        })
        citationsInserted++
      }
    }

    return { claimsInserted, citationsInserted, deduped }
  }
}
