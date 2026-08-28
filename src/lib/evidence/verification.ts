import type { EvidenceBackends } from './storage/types'
import type { EvidenceStore } from './store'
import { check as checkCitationRequired } from './verification/checks/citation-required'
import { check as checkMinSources } from './verification/checks/min-sources'
import { check as checkStaleSources } from './verification/checks/stale-source'
import { check as checkConflicts } from './verification/checks/conflict-check'
import { check as checkMinConfidence } from './verification/checks/min-confidence'
import type { CheckResult, QualityPolicy, VerificationResult } from './verification/types'

export type { CheckResult, QualityPolicy, VerificationResult }

export class EvidenceVerifier {
  constructor(
    private readonly store: EvidenceStore,
    private readonly backends: EvidenceBackends,
  ) {}

  async verifyFlowRun(flowRunId: string, policy: QualityPolicy | undefined): Promise<VerificationResult> {
    if (!policy) {
      return { passed: true, checks: [], gaps: [] }
    }

    const bundle = await this.store.getFlowRunBundle(flowRunId)
    const checks: CheckResult[] = []
    const gaps: string[] = []

    if (policy.citation_required) {
      const r = await checkCitationRequired(bundle.claims, bundle.citations)
      const passed = r.passed
      checks.push({ rule: 'citation_required', passed, message: r.message, observed: r.observed })
      if (!passed) gaps.push('citation_required')
    }

    if (policy.min_sources !== undefined) {
      const r = await checkMinSources(bundle.sources, policy.min_sources)
      checks.push({ rule: 'min_sources', passed: r.passed, observed: r.observed, threshold: r.threshold })
      if (!r.passed) gaps.push('min_sources')
    }

    if (policy.stale_source_max_days !== undefined) {
      const r = await checkStaleSources(bundle.sources, policy.stale_source_max_days)
      checks.push({ rule: 'stale_source', passed: r.passed, observed: r.observed, threshold: r.threshold })
      if (!r.passed) gaps.push('stale_source')
    }

    if (policy.conflict_check) {
      const r = await checkConflicts(bundle.conflicts)
      checks.push({ rule: 'conflict_check', passed: r.passed, observed: r.observed })
      if (!r.passed) gaps.push('conflict_check')
    }

    if (policy.min_confidence !== undefined) {
      const r = await checkMinConfidence(bundle.claims, policy.min_confidence)
      checks.push({ rule: 'min_confidence', passed: r.passed, observed: r.observed, threshold: r.threshold })
      if (!r.passed) gaps.push('min_confidence')
    }

    const passed = gaps.length === 0
    let verificationId: number | undefined

    try {
      verificationId = await this.backends.verifications.insert({
        flowRunId,
        policyJson: JSON.stringify(policy),
        passed,
        checksJson: JSON.stringify(checks),
        gapsJson: JSON.stringify(gaps),
        performedAt: Date.now(),
      })
    } catch {
      // Verification storage failure should not block the result
    }

    return { passed, checks, gaps, verificationId }
  }
}
