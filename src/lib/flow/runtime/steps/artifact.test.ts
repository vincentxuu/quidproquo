import { describe, it, expect } from 'vitest'
import { artifactExecutor } from './artifact'
import { createFlowState } from '../state'

const state = createFlowState('run-1')
const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/artifact', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const result = await artifactExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('returns a non-empty artifactId and location URI', async () => {
    const result = await artifactExecutor(
      { id: 's', type: 'artifact', artifactType: 'markdown_report' },
      ctx,
      state,
    )
    expect(result.status).toBe('done')
    expect(typeof result.outputs.artifactId).toBe('string')
    expect((result.outputs.artifactId as string).length).toBeGreaterThan(0)
    expect((result.outputs.location as string)).toMatch(/^artifact:\/\/run-1\//)
  })

  it('embeds the artifactType in the kind field', async () => {
    const result = await artifactExecutor(
      { id: 's', type: 'artifact', artifactType: 'json_report' },
      ctx,
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.kind).toBe('json_report')
  })

  it('generates unique artifactIds per call', async () => {
    const r1 = await artifactExecutor({ id: 's', type: 'artifact', artifactType: 'markdown_report' }, ctx, state)
    const r2 = await artifactExecutor({ id: 's', type: 'artifact', artifactType: 'markdown_report' }, ctx, state)
    expect(r1.outputs.artifactId).not.toBe(r2.outputs.artifactId)
  })
})
