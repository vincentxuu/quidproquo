import type { ConflictRecord, EvidenceBackends } from './storage/types'
import type { EvidenceStore } from './store'
import type { Flags } from '../config/flags'

interface PolicyApprovalGates {
  requestGate(args: {
    runId: string
    stepId: string
    mode: string
    syscallName: string
    input: unknown
    kernel: unknown
    ttlSeconds: number
  }): Promise<{ decision: 'approve' | 'reject' }>
}
import { detectNumericContradiction } from './conflict/rules/numeric'
import { detectNegationContradiction } from './conflict/rules/negation'

export interface ConflictDetectorDeps {
  flags?: Flags
  policyBinding?: { getByFlowRun: (runId: string) => Promise<{ frozenEffective?: { human?: unknown } | null } | null> }
  gates?: PolicyApprovalGates
}

export class ConflictDetector {
  constructor(
    private readonly store: EvidenceStore,
    private readonly backends: EvidenceBackends,
    private readonly conflictDeps?: ConflictDetectorDeps,
  ) {}

  async detect(flowRunId: string): Promise<ConflictRecord[]> {
    const claims = await this.backends.claims.listForFlowRun(flowRunId)
    const detected: ConflictRecord[] = []
    const seen = new Set<string>()

    for (let i = 0; i < claims.length; i++) {
      for (let j = i + 1; j < claims.length; j++) {
        const a = claims[i]
        const b = claims[j]
        const lo = Math.min(a.claimId, b.claimId)
        const hi = Math.max(a.claimId, b.claimId)
        const pairKey = `${lo}-${hi}`
        if (seen.has(pairKey)) continue
        seen.add(pairKey)

        const numericResult = detectNumericContradiction(a.claimText, b.claimText)
        if (numericResult.contradicts) {
          const conflictId = await this.backends.conflicts.insert({
            claimAId: a.claimId,
            claimBId: b.claimId,
            confidenceDelta: Math.abs(a.confidence - b.confidence),
            detectedBy: 'rule:numeric',
            status: 'pending',
          })
          detected.push({
            conflictId,
            claimAId: a.claimId,
            claimBId: b.claimId,
            confidenceDelta: numericResult.delta ?? 0,
            detectedBy: 'rule:numeric',
            status: 'pending',
            approvalId: null,
            resolvedBy: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          continue
        }

        const negationResult = detectNegationContradiction(a.claimText, b.claimText)
        if (negationResult.contradicts) {
          const conflictId = await this.backends.conflicts.insert({
            claimAId: a.claimId,
            claimBId: b.claimId,
            confidenceDelta: Math.abs(a.confidence - b.confidence),
            detectedBy: 'rule:negation',
            status: 'pending',
          })
          detected.push({
            conflictId,
            claimAId: a.claimId,
            claimBId: b.claimId,
            confidenceDelta: 0,
            detectedBy: 'rule:negation',
            status: 'pending',
            approvalId: null,
            resolvedBy: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
        }
      }
    }

    return detected
  }

  async proposeReviewApproval(conflict: ConflictRecord, kernel?: unknown): Promise<string | null> {
    // humanGates routing: when flag is on and gates are configured, route through PolicyApprovalGates
    if (this.conflictDeps?.flags?.agentPolicy?.humanGates && this.conflictDeps?.gates) {
      try {
        const flowRunId = String(conflict.claimAId)
        // Only route through gates when a human policy is bound to the flow run
        let hasHumanPolicy = true
        if (this.conflictDeps.policyBinding) {
          const binding = await this.conflictDeps.policyBinding.getByFlowRun(flowRunId)
          hasHumanPolicy = binding?.frozenEffective?.human !== undefined
        }

        if (hasHumanPolicy) {
          const result = await this.conflictDeps.gates.requestGate({
            runId: flowRunId,
            stepId: `conflict:${conflict.conflictId}`,
            mode: 'per_step',
            syscallName: 'evidence_conflict_review',
            input: { conflictId: conflict.conflictId, claimAId: conflict.claimAId, claimBId: conflict.claimBId },
            kernel,
            ttlSeconds: 86400,
          })
          // Map gate decision to a synthetic approvalId so callers can track resolution
          const syntheticId = result.decision === 'approve'
            ? `gate:approved:${conflict.conflictId}`
            : `gate:rejected:${conflict.conflictId}`
          await this.backends.conflicts.updateApprovalId(conflict.conflictId, syntheticId)
          return syntheticId
        }
      } catch {
        // Fall through to direct kernel path
      }
    }

    // Original Phase 5.3.1 behavior: direct kernel.access.requestApproval
    const kernelAccess = (kernel as { access?: { requestApproval?: (args: unknown) => Promise<string> } } | undefined)
      ?.access
    if (!kernelAccess?.requestApproval) return null

    try {
      const approvalId = await kernelAccess.requestApproval({
        // ConflictRecord has no flowRunId field; use claimAId as a stable run context fallback
        runId: String(conflict.claimAId),
        reason: 'evidence_conflict',
        context: {
          conflictId: conflict.conflictId,
          claimAId: conflict.claimAId,
          claimBId: conflict.claimBId,
          kind: conflict.detectedBy,
        },
        ttlSeconds: 86400,
      })

      // Persist approval_id back onto the conflict row via ConflictStoreBackend.updateApprovalId
      // TODO(5.3.2): wire the approval resolution listener to flip conflict status
      await this.backends.conflicts.updateApprovalId(conflict.conflictId, approvalId)

      return approvalId
    } catch {
      return null
    }
  }
}
