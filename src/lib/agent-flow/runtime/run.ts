import type { D1Database } from '@cloudflare/workers-types'
import type { FlowDefinition } from '../dsl/ast'
import type { ValidatedEdge } from '../dsl/edges'
import { compile } from './compile'
import { createFlowState } from './state'
import { executeStep } from './step-executor'
import { beginStep, endStep } from './step-runs'
import { nowMs } from '@/lib/utils/dates'
import { bindPolicyToFlowRun } from '../../agent-policy/bind'
import type { PolicyBindingBackend, PolicyDefinitionBackend } from '../../agent-policy/storage/types'
import type { Flags } from '../../config/flags'
import { BudgetTracker } from '../../agent-policy/enforcement/budget/tracker'
import { checkBudget } from '../../agent-policy/enforcement/budget/check-db'
import type { ArtifactRegistry } from '../../agent-artifact/registry'
import type { ArtifactVersioning } from '../../agent-artifact/versioning'
import { runArtifactStep } from '../../agent-artifact/flow-step'

export interface RunFlowInWorkerOptions {
  flowRunId: string
  definition: FlowDefinition
  edges: ValidatedEdge[]
  input: Record<string, unknown>
  enforcement?: unknown
  flags?: Flags
  evidence?: unknown
  // Phase 3: filled in by API handler; undefined in Phase 2 (guard prevents call)
  flowId?: number
  agentId?: string
  db?: D1Database
  kernel?: unknown
  policyBackends?: { definitions: PolicyDefinitionBackend; bindings: PolicyBindingBackend }
  artifactDeps?: { registry: ArtifactRegistry; versioning: ArtifactVersioning }
}

export interface FlowRunResult {
  status: 'done' | 'failed' | 'cancelled'
  output?: unknown
  error?: unknown
  stepResults: Record<string, unknown>
}

export async function runFlowInWorker(opts: RunFlowInWorkerOptions): Promise<FlowRunResult> {
  const graph = compile(opts.definition, opts.edges)
  const state = createFlowState(opts.flowRunId)
  const stepResults: Record<string, unknown> = {}

  // Evidence listener — attach to kernel when per-flow opt-in and global flag are both enabled
  if (opts.definition.evidence?.enabled && opts.flags?.agentEvidence?.enabled && opts.kernel) {
    const ev = opts.evidence as { attachToKernel?: (kernel: unknown, flowRunId: string) => void } | undefined
    ev?.attachToKernel?.(opts.kernel, opts.flowRunId)
  }

  // Policy binding — non-fatal side-effect, gated by feature flag
  if (opts.flags?.agentPolicy?.enabled && opts.policyBackends && opts.flags) {
    try {
      await bindPolicyToFlowRun(
        Number(opts.flowRunId),
        { flowDefId: opts.flowId, agentId: opts.agentId },
        opts.policyBackends,
        opts.flags,
      )
    } catch (err) {
      // Non-fatal: log + continue unpoliced
      console.error('[policy-bind]', err)
    }
  }

  // Budget tracker — instantiated once per flow run, checked after each step
  const budgetTracker = new BudgetTracker()

  // BFS execution: process steps in topological order
  const queue = [graph.entryStepId]
  const completed = new Set<string>()
  let stepOrder = 0

  while (queue.length > 0) {
    const stepId = queue.shift()!
    if (completed.has(stepId)) continue

    const node = graph.nodes.get(stepId)!
    // All predecessors must be complete before executing this step
    if (node.predecessors.some((p) => !completed.has(p))) {
      queue.push(stepId) // re-enqueue, wait for predecessors
      continue
    }

    const step = node.step
    const currentOrder = stepOrder++
    const startedAt = nowMs()

    // Lifecycle: begin step row (only when db is available)
    let stepRunId: string | undefined
    if (opts.db) {
      stepRunId = await beginStep(opts.db, {
        flowRunId: opts.flowRunId,
        stepId: step.id,
        stepOrder: currentOrder,
        kind: step.type,
      })
    }

    const ctx = {
      flowRunId: opts.flowRunId,
      stepRunId: stepRunId ?? crypto.randomUUID(),
      db: opts.db,
      kernel: opts.kernel,
    }

    try {
      const result = await executeStep(step, ctx, state)
      stepResults[stepId] = result

      // Lifecycle: end step as done
      if (opts.db && stepRunId) {
        await endStep(opts.db, stepRunId, {
          status: result.status,
          outputsJson: JSON.stringify(result.outputs),
          errorJson: result.errorJson ? JSON.stringify(result.errorJson) : undefined,
          startedAt,
        })
      }

      if (result.status === 'failed') {
        return { status: 'failed', error: result.errorJson, stepResults }
      }

      completed.add(stepId)

      // Artifact wiring — non-fatal, gated by flag and artifactDeps availability
      if (opts.flags?.agentArtifact?.enabled && opts.artifactDeps && opts.definition.artifacts) {
        for (const artifactDecl of opts.definition.artifacts) {
          const decl = artifactDecl as { kind?: string; step?: string }
          if (decl.step === stepId) {
            try {
              await runArtifactStep(
                {
                  flowId: String(opts.definition.id),
                  kind: decl.kind ?? stepId,
                  payload: result.outputs,
                  flowRunId: opts.flowRunId,
                  flowStepRunId: stepRunId,
                },
                opts.artifactDeps,
                opts.flags,
              )
            } catch { /* non-fatal */ }
          }
        }
      }

      // Budget enforcement: check after each completed step
      if (opts.flags?.agentPolicy?.enabled && opts.flags?.agentPolicy?.budgetEnforce && opts.policyBackends) {
        try {
          const binding = await opts.policyBackends.bindings.getByFlowRun(Number(opts.flowRunId))
          if (binding?.frozenEffective?.budget) {
            budgetTracker.recordIteration()
            budgetTracker.tickRuntime()
            const { breached, ruleKey, observed, limit } = budgetTracker.check(binding.frozenEffective.budget)
            if (breached) {
              const errorJson = JSON.stringify({ kind: 'budget_exceeded', ruleKey, observed, limit })
              if (opts.db) {
                await opts.db.prepare(
                  `UPDATE flow_runs SET status='failed', error_json=?, finished_at=? WHERE flow_run_id=?`
                ).bind(errorJson, Date.now(), opts.flowRunId).run()
              }
              return { status: 'failed', error: { kind: 'budget_exceeded', ruleKey, observed, limit }, stepResults }
            }
          }

          // DB cost check: query actual accumulated cost_usd from agent_tool_calls
          if (opts.db) {
            const dbBudgetResult = await checkBudget(opts.flowRunId, {
              db: opts.db,
              bindings: opts.policyBackends.bindings,
            })
            if (!dbBudgetResult.passed) {
              const errorJson = JSON.stringify({ kind: 'budget_exceeded', ...dbBudgetResult })
              await opts.db.prepare(
                `UPDATE flow_runs SET status='failed', error_json=?, finished_at=? WHERE flow_run_id=?`
              ).bind(errorJson, Date.now(), opts.flowRunId).run()
              return { status: 'failed', error: { kind: 'budget_exceeded', ...dbBudgetResult }, stepResults }
            }
          }
        } catch (budgetErr) {
          // Non-fatal: log and continue unpoliced
          console.error('[budget-enforce]', budgetErr)
        }
      }

      // Enqueue successors
      const edges = graph.adjacency.get(stepId) ?? []
      for (const edge of edges) {
        if (!completed.has(edge.to)) queue.push(edge.to)
      }
    } catch (err) {
      // Lifecycle: end step as failed on unexpected exception
      if (opts.db && stepRunId) {
        await endStep(opts.db, stepRunId, {
          status: 'failed',
          errorJson: JSON.stringify({ kind: 'executor_exception', message: String(err) }),
          startedAt,
        })
      }
      return { status: 'failed', error: err, stepResults }
    }
  }

  // Implicit evidence verifier — runs when flow has evidence.enabled but no explicit verifier:policy step
  if (
    opts.definition.evidence?.enabled &&
    opts.flags?.agentEvidence?.enabled &&
    opts.evidence
  ) {
    const hasExplicitPolicyVerifier = opts.definition.steps.some(
      (s) => s.type === 'verifier' && (s as Record<string, unknown>).verifier === 'policy',
    )
    if (!hasExplicitPolicyVerifier) {
      const ev = opts.evidence as {
        verification?: { verifyFlowRun?: (flowRunId: string, policy: Record<string, unknown>) => Promise<{ passed: boolean; gaps?: string[] }> }
      }
      if (ev.verification?.verifyFlowRun) {
        try {
          const policy = (opts.definition.evidence.policy ?? {}) as Record<string, unknown>
          const enforcement = (policy.enforcement as string | undefined) ?? 'warn'
          const result = await ev.verification.verifyFlowRun(opts.flowRunId, policy)
          stepResults['__implicit_evidence_verifier__'] = result
          if (!result.passed && enforcement === 'block') {
            return {
              status: 'failed',
              error: { kind: 'quality_policy_violation', gaps: result.gaps ?? [] },
              stepResults,
            }
          }
        } catch {
          // Non-fatal: evidence verification errors must not fail the flow run
        }
      }
    }
  }

  return { status: 'done', stepResults }
}

export async function runFlow(
  opts: RunFlowInWorkerOptions & { env?: Record<string, unknown> },
): Promise<FlowRunResult> {
  const useDurable =
    opts.definition?.durable === true ||
    opts.flags?.agentFlow?.durableExecution === true

  if (useDurable && opts.env) {
    const { runFlowDurable } = await import('../durable')
    await runFlowDurable(opts.env, {
      flowId: String(opts.definition?.id ?? opts.flowRunId),
      input: opts.input ?? {},
    })
    return { status: 'done', stepResults: {} }
  }

  return runFlowInWorker(opts)
}
