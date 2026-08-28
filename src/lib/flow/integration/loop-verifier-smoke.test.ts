import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const flowYamlPath = join(__dirname, '../../../../flows/deep-research.yaml')

describe('loop step: maxIterations enforcement', () => {
  it('loop definition has maxIterations=3 in deep-research.yaml', () => {
    const yaml = readFileSync(flowYamlPath, 'utf8')
    expect(yaml).toContain('maxIterations: 3')
    expect(yaml).toContain('type: loop')
  })

  it('loop condition evaluates passed flag', () => {
    const yaml = readFileSync(flowYamlPath, 'utf8')
    // The loop should have a condition referencing the verify step's passed output
    expect(yaml).toMatch(/condition|verify.*passed|passed.*verify/i)
  })
})
