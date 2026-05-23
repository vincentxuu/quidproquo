import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { yamlToDag, flowDefinitionToDag } from './yaml-to-dag'
import { dagToYaml } from './dag-to-yaml'
import { loadFlow } from './load'
import { validateFlowSchema } from './validate'

const FIXTURE_DIR = resolve('flows/pipelines')

const FIXTURES = ['content-ops', 'freshness-review', 'translation']

describe('yaml-to-dag round-trip', () => {
  for (const name of FIXTURES) {
    it(`converts ${name} to DAG with valid positions`, () => {
      const yaml = readFileSync(resolve(FIXTURE_DIR, `${name}.yaml`), 'utf8')
      const dag = yamlToDag(yaml)

      expect(dag.nodes.length).toBeGreaterThan(0)
      expect(dag.edges.length).toBeGreaterThanOrEqual(0)

      for (const node of dag.nodes) {
        expect(Number.isFinite(node.position.x)).toBe(true)
        expect(Number.isFinite(node.position.y)).toBe(true)
        expect(node.data.stepId).toBe(node.id)
        expect(node.data.stepType).toBe(node.type)
      }
    })

    it(`round-trips ${name}: dag -> yaml -> validateFlowSchema produces equivalent definition`, () => {
      const originalYaml = readFileSync(resolve(FIXTURE_DIR, `${name}.yaml`), 'utf8')
      const originalRaw = loadFlow(originalYaml, 'yaml')
      const originalDef = validateFlowSchema(originalRaw)

      const dag = flowDefinitionToDag(originalDef)

      const roundTrippedYaml = dagToYaml(dag.nodes, dag.edges, {
        id: originalDef.id,
        name: originalDef.name,
        version: originalDef.version,
        description: originalDef.description,
        inputs: originalDef.inputs,
        artifacts: originalDef.artifacts,
        artifactBindings: originalDef.artifactBindings,
        durable: originalDef.durable,
        retry: originalDef.retry,
        timeout: originalDef.timeout,
      })

      const roundTrippedRaw = loadFlow(roundTrippedYaml, 'yaml')
      const roundTrippedDef = validateFlowSchema(roundTrippedRaw)

      // Structural equality: same step ids in same order
      expect(roundTrippedDef.steps.map(s => s.id)).toEqual(originalDef.steps.map(s => s.id))

      // Same step types
      expect(roundTrippedDef.steps.map(s => s.type)).toEqual(originalDef.steps.map(s => s.type))

      // Same edges
      const originalEdges = originalDef.edges.map(e => `${e.from}->${e.to}`)
      const roundTrippedEdges = roundTrippedDef.edges.map(e => `${e.from}->${e.to}`)
      expect(roundTrippedEdges).toEqual(originalEdges)

      // Top-level metadata preserved
      expect(roundTrippedDef.id).toBe(originalDef.id)
      expect(roundTrippedDef.name).toBe(originalDef.name)
      expect(roundTrippedDef.version).toBe(originalDef.version)
    })
  }

  it('converts deep-research.yaml to DAG with correct node count', () => {
    const yaml = readFileSync(resolve('flows/deep-research.yaml'), 'utf8')
    const dag = yamlToDag(yaml)

    // deep-research.yaml has: clarify, build_brief, plan, research_loop, export = 5 top-level steps
    expect(dag.nodes.length).toBeGreaterThanOrEqual(5)

    for (const node of dag.nodes) {
      expect(Number.isFinite(node.position.x)).toBe(true)
      expect(Number.isFinite(node.position.y)).toBe(true)
    }
  })
})
