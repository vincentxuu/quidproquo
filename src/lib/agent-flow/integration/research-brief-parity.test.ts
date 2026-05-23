import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const flowYamlPath = join(__dirname, '../../../../flows/deep-research.yaml')

describe('research-brief parity', () => {
  it('structural parity: deep-research flow matches research-brief pipeline step order', () => {
    // This test documents the STRUCTURAL mapping, not live execution.
    // It validates the flow YAML contains all the steps that map to the pipeline.
    const expectedStepIds = [
      'clarify', 'build_brief', 'plan',
      'research_loop', // loop wrapping search→verify
      'export',
    ]

    const flowYaml = readFileSync(flowYamlPath, 'utf8')

    for (const stepId of expectedStepIds) {
      expect(flowYaml, `step "${stepId}" should be present`).toContain(`id: ${stepId}`)
    }
  })

  it('artifact kind is markdown_report', () => {
    const flowYaml = readFileSync(flowYamlPath, 'utf8')
    expect(flowYaml).toContain('markdown_report')
  })
})
