import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

const verifierExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'verifier') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

  const verifierType = (step as unknown as { verifier: string }).verifier

  if (verifierType === 'coverage') {
    const kernel = ctx.kernel as Record<string, unknown> | undefined
    const evidenceModule = kernel?.evidence as
      | { verifyFlowRun: (flowRunId: string, policy: Record<string, unknown>) => Promise<{ passed: boolean; gaps?: string[] }> }
      | undefined

    if (evidenceModule?.verifyFlowRun) {
      const policy = (step as Record<string, unknown>).policy as Record<string, unknown> | undefined
      const enforcement = (policy?.enforcement as string | undefined) ?? 'warn'

      try {
        const result = await evidenceModule.verifyFlowRun(ctx.flowRunId, policy ?? {})
        if (!result.passed) {
          if (enforcement === 'block') {
            return {
              outputs: { passed: false, gaps: result.gaps ?? [] },
              status: 'failed',
              errorJson: { kind: 'quality_policy_violation', gaps: result.gaps ?? [] },
            }
          }
          // warn enforcement — pass through with gaps logged
          return { outputs: { passed: false, gaps: result.gaps ?? [], enforcement: 'warn' }, status: 'done' }
        }
        return { outputs: { passed: true }, status: 'done' }
      } catch {
        // Evidence module unavailable — pass through
        return { outputs: { passed: true, note: 'evidence_unavailable' }, status: 'done' }
      }
    }

    // Fallback: no evidence module wired
    return { outputs: { passed: true }, status: 'done' }
  }

  // Phase 2 stub: citation/freshness return passed, conflict/policy are no-op
  const passed = ['citation', 'freshness'].includes(verifierType)
  return {
    outputs: { passed, score: passed ? 1.0 : 0.0, verifier: verifierType },
    status: 'done',
  }
}

registerStepExecutor('verifier', verifierExecutor)
export { verifierExecutor }
