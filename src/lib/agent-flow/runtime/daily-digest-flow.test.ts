import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadFlow } from '../dsl/load'
import { tryValidateFlowSchema, detectEdgeCycles } from '../dsl/validate'

const yamlSource = readFileSync(
  join(process.cwd(), 'flows/pipelines/daily-digest.yaml'),
  'utf-8',
)

describe('daily-digest flow YAML', () => {
  it('parses without error', () => {
    const raw = loadFlow(yamlSource, 'yaml')
    expect(raw).toBeDefined()
    expect((raw as Record<string, unknown>).id).toBe('daily-digest')
  })

  it('passes schema validation', () => {
    const raw = loadFlow(yamlSource, 'yaml')
    const errors = tryValidateFlowSchema(raw)
    expect(errors).toEqual([])
  })

  it('has no edge cycles', () => {
    const raw = loadFlow(yamlSource, 'yaml') as Record<string, unknown>
    const edges = (raw.edges as Array<{ from: string; to: string }>) ?? []
    const cycles = detectEdgeCycles(edges)
    expect(cycles).toEqual([])
  })

  it('defines the expected 6 top-level steps', () => {
    const raw = loadFlow(yamlSource, 'yaml') as Record<string, unknown>
    const steps = raw.steps as Record<string, unknown>
    const stepIds = Object.keys(steps)
    expect(stepIds).toContain('stage1-parallel')
    expect(stepIds).toContain('synthesise-signals')
    expect(stepIds).toContain('assemble-report')
    expect(stepIds).toContain('quality-check')
    expect(stepIds).toContain('write-draft')
    expect(stepIds).toContain('digest-report')
  })

  it('stage1-parallel has 9 branches', () => {
    const raw = loadFlow(yamlSource, 'yaml') as Record<string, unknown>
    const steps = raw.steps as Record<string, Record<string, unknown>>
    const parallel = steps['stage1-parallel']
    const branches = parallel.branches as unknown[]
    expect(branches).toHaveLength(9)
  })

  it('edges form a linear chain from stage1 to report', () => {
    const raw = loadFlow(yamlSource, 'yaml') as Record<string, unknown>
    const edges = raw.edges as Array<{ from: string; to: string }>
    expect(edges).toHaveLength(5)
    expect(edges[0]).toEqual({ from: 'stage1-parallel', to: 'synthesise-signals' })
    expect(edges[4]).toEqual({ from: 'write-draft', to: 'digest-report' })
  })
})

describe('daily-digest flow runtime smoke', () => {
  it('compiles the flow definition', async () => {
    const { compile } = await import('./compile')
    const { validateFlowSchema } = await import('../dsl/validate')

    const raw = loadFlow(yamlSource, 'yaml')
    const definition = validateFlowSchema(raw)
    const edges = definition.edges.map((e) => ({ from: e.from, to: e.to }))
    const graph = compile(definition, edges)

    expect(graph.entryStepId).toBe('stage1-parallel')
    expect(graph.terminalStepIds).toContain('digest-report')
    expect(graph.nodes.size).toBe(6)
  })

  it('runs through the stub path without DB', async () => {
    await import('./steps/index')
    const { runFlowInWorker } = await import('./run')
    const { validateFlowSchema } = await import('../dsl/validate')

    const raw = loadFlow(yamlSource, 'yaml')
    const definition = validateFlowSchema(raw)
    const edges = definition.edges.map((e) => ({ from: e.from, to: e.to }))

    const result = await runFlowInWorker({
      flowRunId: 'daily-digest-smoke-001',
      definition,
      edges,
      input: { date: '2026-08-25', language: 'zh-TW' },
    })

    expect(result.status).toBe('done')
    expect(Object.keys(result.stepResults)).toContain('stage1-parallel')
    expect(Object.keys(result.stepResults)).toContain('digest-report')
  })
})
