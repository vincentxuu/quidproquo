import type { StepExecutor, StepResult } from '../step-executor'
import { registerStepExecutor, executeStep } from '../step-executor'

interface BranchOutcome {
  index: number
  result: StepResult | null
  error: unknown
}

const parallelExecutor: StepExecutor = async (step, ctx, state) => {
  if (step.type !== 'parallel') {
    return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }
  }

  const branches = ((step as Record<string, unknown>).branches as unknown[]) ?? []
  const merge = ((step as Record<string, unknown>).merge as string) ?? 'all'

  const branchPromises = branches.map((branch, i) =>
    executeStep(branch as Parameters<StepExecutor>[0], ctx, state)
      .then((result): BranchOutcome => ({ index: i, result, error: null }))
      .catch((err: unknown): BranchOutcome => ({ index: i, result: null, error: err }))
  )

  let branchResults: BranchOutcome[]

  if (merge === 'race') {
    // First to resolve (success OR failure)
    const first = await Promise.race(branchPromises)
    branchResults = [first]
  } else if (merge === 'firstSuccess') {
    // Wait for all, then pick the first successful one
    const all = await Promise.all(branchPromises)
    const first = all.find(r => r.result?.status === 'done')
    branchResults = first ? [first] : all
  } else {
    // 'all' — wait for every branch
    branchResults = await Promise.all(branchPromises)
  }

  const anyFailed = branchResults.some(r => !r.result || r.result.status !== 'done')

  return {
    outputs: {
      branches: branchResults.map(r => r.result?.outputs ?? {}),
      merged: branchResults.reduce(
        (acc, r) => ({ ...acc, ...(r.result?.outputs ?? {}) }),
        {} as Record<string, unknown>
      ),
    },
    status: anyFailed && merge === 'all' ? 'failed' : 'done',
    errorJson: anyFailed && merge === 'all' ? { kind: 'parallel_branch_failed' } : undefined,
  }
}

registerStepExecutor('parallel', parallelExecutor)
export { parallelExecutor }
