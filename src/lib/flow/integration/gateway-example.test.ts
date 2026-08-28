import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { loadFlow } from '../dsl/load'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtureYamlPath = join(__dirname, '../../../../openspec/changes/agent-flow/fixtures/deep-research.example.yaml')

describe('gateway example regression', () => {
  it('parses deep-research.example.yaml without errors', () => {
    const yaml = readFileSync(fixtureYamlPath, 'utf8')
    expect(() => loadFlow(yaml, 'yaml')).not.toThrow()
  })

  it('parsed flow has expected id and name', () => {
    const yaml = readFileSync(fixtureYamlPath, 'utf8')
    const flow = loadFlow(yaml, 'yaml') as Record<string, unknown>
    expect(flow.id).toBe('deep-research')
    expect(flow.name).toBe('Deep Research')
    expect(flow.version).toBe(1)
  })

  it('parsed flow has 5 top-level steps', () => {
    const yaml = readFileSync(fixtureYamlPath, 'utf8')
    const flow = loadFlow(yaml, 'yaml') as Record<string, unknown>
    const steps = flow.steps as unknown[]
    // clarify, build_brief, plan, research_loop, export
    expect(steps).toHaveLength(5)
  })

  it('parsed flow has 4 edges', () => {
    const yaml = readFileSync(fixtureYamlPath, 'utf8')
    const flow = loadFlow(yaml, 'yaml') as Record<string, unknown>
    const edges = flow.edges as unknown[]
    // clarify→build_brief, build_brief→plan, plan→research_loop, research_loop→export
    expect(edges).toHaveLength(4)
  })

  it('contains a loop step with maxIterations', () => {
    const yaml = readFileSync(fixtureYamlPath, 'utf8')
    const flow = loadFlow(yaml, 'yaml') as Record<string, unknown>
    const steps = flow.steps as Array<Record<string, unknown>>
    const loopStep = steps.find((s) => s.type === 'loop')
    expect(loopStep).toBeDefined()
    expect(loopStep?.maxIterations).toBe(3)
  })

  it('contains 2 artifact bindings', () => {
    const yaml = readFileSync(fixtureYamlPath, 'utf8')
    const flow = loadFlow(yaml, 'yaml') as Record<string, unknown>
    const artifacts = flow.artifacts as unknown[]
    expect(artifacts).toHaveLength(2)
  })
})
