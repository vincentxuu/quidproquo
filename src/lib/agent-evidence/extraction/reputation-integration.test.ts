import { describe, it, expect, beforeEach } from 'vitest'
import { SourceReputation } from '../reputation'
import { InMemoryReputationBackend } from '../storage/test/in-memory'
import type { EvidenceBackends } from '../storage/types'

// D4 confidence formula (mirrors extraction.ts ClaimExtractor.extractFromSource):
// confidence = 0.5 * freshnessScore + 0.3 * reputation + 0.2 * agentSelfRated
// agentSelfRated defaults to 0.5; freshnessScore fixed to 1.0 for simplicity
function computeConfidence(reputation: number, freshnessScore = 1.0, agentSelfRated = 0.5): number {
  return Math.min(1, Math.max(0, 0.5 * freshnessScore + 0.3 * reputation + 0.2 * agentSelfRated))
}

describe('Reputation → confidence integration', () => {
  const domain = 'example.com'
  let reputationBackend: InMemoryReputationBackend
  let reputation: SourceReputation

  beforeEach(() => {
    reputationBackend = new InMemoryReputationBackend()
    const backends = { reputation: reputationBackend } as unknown as EvidenceBackends
    reputation = new SourceReputation(backends)
  })

  it('approving an artifact raises confidence for claims from that domain', async () => {
    // Step 1: baseline confidence (unknown domain → reputation = 0.5)
    const baselineReputation = await reputation.getScore(domain)
    expect(baselineReputation).toBe(0.5)
    const baselineConfidence = computeConfidence(baselineReputation)

    // Step 2: five approvals → reputation rises by 5 * 0.05 = 0.25
    for (let i = 0; i < 5; i++) {
      await reputation.updateFromSignal(domain, 'approve', 1)
    }
    const afterApproveReputation = await reputation.getScore(domain)
    // 0.5 + 0.25 = 0.75
    expect(afterApproveReputation).toBeCloseTo(0.75, 5)
    const afterApproveConfidence = computeConfidence(afterApproveReputation)
    expect(afterApproveConfidence).toBeGreaterThan(baselineConfidence)

    // Step 3: twenty rejections → reputation drops by 20 * 0.05 = 1.0, clamped to 0
    for (let i = 0; i < 20; i++) {
      await reputation.updateFromSignal(domain, 'reject', 1)
    }
    const afterRejectReputation = await reputation.getScore(domain)
    // 0.75 - 1.0 = -0.25, clamped to 0
    expect(afterRejectReputation).toBe(0)
    const afterRejectConfidence = computeConfidence(afterRejectReputation)
    expect(afterRejectConfidence).toBeLessThan(baselineConfidence)
  })

  it('unknown domain returns baseline reputation of 0.5', async () => {
    const score = await reputation.getScore('unknown-domain.example')
    expect(score).toBe(0.5)
  })

  it('confidence delta matches expected reputation weight', async () => {
    // The reputation weight is 0.3 per D4 formula
    // +5 approvals = +0.25 reputation → +0.25 * 0.3 = +0.075 confidence
    const before = computeConfidence(await reputation.getScore(domain))

    for (let i = 0; i < 5; i++) {
      await reputation.updateFromSignal(domain, 'approve', 1)
    }

    const after = computeConfidence(await reputation.getScore(domain))
    expect(after - before).toBeCloseTo(0.25 * 0.3, 5)
  })
})
