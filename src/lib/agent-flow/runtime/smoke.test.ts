import { describe, it, expect } from 'vitest'
import { flowCancelKey, isCancelled, cancelFlow } from './cancel'
import { withRetry } from './retry'
import { compile } from './compile'
import { createFlowState, setState, getState } from './state'
import { executeStep, registerStepExecutor } from './step-executor'

// ── cancel ────────────────────────────────────────────────────────────────────

describe('agent-flow/runtime/cancel', () => {
  it('cancel key format', () => {
    expect(flowCancelKey('run-123')).toBe('flow:cancel:run-123')
  })

  it('isCancelled returns false when key is absent', async () => {
    const store = { get: async () => null, put: async () => {} }
    expect(await isCancelled('run-abc', store)).toBe(false)
  })

  it('isCancelled returns true after cancelFlow', async () => {
    const kv = new Map<string, string>()
    const store = {
      get: async (k: string) => kv.get(k) ?? null,
      put: async (k: string, v: string) => { kv.set(k, v) },
    }
    await cancelFlow('run-abc', store)
    expect(await isCancelled('run-abc', store)).toBe(true)
  })
})

// ── retry ─────────────────────────────────────────────────────────────────────

describe('agent-flow/runtime/retry', () => {
  it('succeeds on first attempt', async () => {
    let calls = 0
    const result = await withRetry(async () => { calls++; return 'ok' }, { maxAttempts: 3, backoffMs: 1 })
    expect(result).toBe('ok')
    expect(calls).toBe(1)
  })

  it('succeeds on second attempt', async () => {
    let calls = 0
    const result = await withRetry(async () => {
      calls++
      if (calls < 2) throw new Error('fail')
      return 'ok'
    }, { maxAttempts: 3, backoffMs: 1 })
    expect(result).toBe('ok')
    expect(calls).toBe(2)
  })

  it('exhausts attempts and throws last error', async () => {
    await expect(
      withRetry(async () => { throw new Error('always fail') }, { maxAttempts: 2, backoffMs: 1 }),
    ).rejects.toThrow('always fail')
  })
})

// ── compile ───────────────────────────────────────────────────────────────────

describe('agent-flow/runtime/compile', () => {
  const makeStep = (id: string) => ({ id, type: 'agent' })

  it('compiles a linear 3-step flow', () => {
    const def = {
      id: 'test', name: 'Test', version: 1,
      inputs: [], steps: [makeStep('a'), makeStep('b'), makeStep('c')], edges: [],
    }
    const edges = [
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
    ]
    const graph = compile(def, edges)
    expect(graph.entryStepId).toBe('a')
    expect(graph.terminalStepIds).toEqual(['c'])
    expect(graph.nodes.size).toBe(3)
    expect(graph.adjacency.get('a')!.map(e => e.to)).toEqual(['b'])
  })

  it('throws when there are no steps', () => {
    const def = { id: 'empty', name: 'Empty', version: 1, inputs: [], steps: [], edges: [] }
    expect(() => compile(def, [])).toThrow('flow has no steps')
  })

  it('throws when multiple entry steps exist', () => {
    const def = {
      id: 'bad', name: 'Bad', version: 1,
      inputs: [], steps: [makeStep('a'), makeStep('b')], edges: [],
    }
    expect(() => compile(def, [])).toThrow('expected exactly 1 entry step')
  })
})

// ── state ─────────────────────────────────────────────────────────────────────

describe('agent-flow/runtime/state', () => {
  it('createFlowState initialises with empty data', () => {
    const s = createFlowState('run-001')
    expect(s.flowRunId).toBe('run-001')
    expect(s.data).toEqual({})
  })

  it('setState / getState round-trips', () => {
    const s = createFlowState('run-002')
    setState(s, 'foo', { bar: 42 })
    expect(getState(s, 'foo')).toEqual({ bar: 42 })
  })

  it('getState returns undefined for missing key', () => {
    const s = createFlowState('run-003')
    expect(getState(s, 'missing')).toBeUndefined()
  })
})

// ── step-executor dispatch table ──────────────────────────────────────────────

describe('agent-flow/runtime/step-executor', () => {
  // Import all step modules to trigger their registerStepExecutor() side-effects
  it('has executors for all declared step types after importing steps index', async () => {
    await import('./steps/index')

    const expectedTypes = [
      'agent', 'tool_group', 'transform', 'verifier',
      'artifact', 'human_approval', 'parallel', 'loop', 'sub_flow',
    ]

    const state = createFlowState('probe')
    const ctx = { flowRunId: 'probe', stepRunId: 'probe-step' }

    // Per-type minimal step shapes to avoid executor-internal crashes
    const stepShapes: Record<string, Record<string, unknown>> = {
      transform: { expression: 'static-value' },
    }

    for (const type of expectedTypes) {
      const step = { id: `s-${type}`, type, ...(stepShapes[type] ?? {}) }
      const result = await executeStep(step, ctx, state)
      // Must NOT return unknown_step_type — executor must exist for this type
      expect(result.errorJson?.kind).not.toBe('unknown_step_type')
    }
  })

  it('returns unknown_step_type for unregistered step type', async () => {
    const state = createFlowState('probe2')
    const ctx = { flowRunId: 'probe2', stepRunId: 'probe2-step' }
    const result = await executeStep({ id: 'x', type: '__nonexistent__' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('unknown_step_type')
  })
})

// ── runFlowInWorker integration (no DB) ───────────────────────────────────────

describe('agent-flow/runtime/runFlowInWorker', () => {
  it('runs a 2-step transform flow end-to-end without DB', async () => {
    const { runFlowInWorker } = await import('./run')

    const definition = {
      id: 'smoke-flow',
      name: 'Smoke Flow',
      version: 1,
      inputs: [],
      steps: [
        { id: 'step1', type: 'transform', expression: 'hello' },
        { id: 'step2', type: 'transform', expression: 'world' },
      ],
      edges: [{ from: 'step1', to: 'step2' }],
    }
    const edges = [{ from: 'step1', to: 'step2' }]

    const result = await runFlowInWorker({
      flowRunId: 'smoke-run-001',
      definition,
      edges,
      input: {},
    })

    expect(result.status).toBe('done')
    expect(result.stepResults).toHaveProperty('step1')
    expect(result.stepResults).toHaveProperty('step2')
  })

  it('runs an agent step flow without real kernel (stub path)', async () => {
    const { runFlowInWorker } = await import('./run')

    const definition = {
      id: 'agent-smoke',
      name: 'Agent Smoke',
      version: 1,
      inputs: [],
      steps: [{ id: 'call_agent', type: 'agent', agent: 'planner' }],
      edges: [],
    }

    const result = await runFlowInWorker({
      flowRunId: 'agent-smoke-001',
      definition,
      edges: [],
      input: {},
      kernel: undefined, // no kernel — stub path
    })

    expect(result.status).toBe('done')
    const stepResult = result.stepResults['call_agent'] as { outputs: Record<string, unknown> }
    expect(stepResult.outputs.stubbed).toBe(true)
  })
})
