import { describe, it, expect } from 'vitest'
import { buildGraph, withCriticFallback, withWriterFallback } from './graph'
import { initialState, type GraphState } from '../retrieval/state'

describe('graph', () => {
  it('compiles without throwing', () => {
    expect(() => buildGraph()).not.toThrow()
  })
})

describe('node fallbacks', () => {
  const boom = async () => { throw new Error('429 Rate limit reached\nstack line') }
  const base = { ...initialState(), draft: 'validated draft', iteration: 1 } as GraphState

  it('writer retry failure keeps the previous draft instead of aborting', async () => {
    const update = await withWriterFallback(boom)(base)
    expect(update).toEqual({ iteration: 2, final_response: 'validated draft' })
  })

  it('writer failure on the first draft still throws', async () => {
    await expect(withWriterFallback(boom)({ ...base, iteration: 0, draft: '' })).rejects.toThrow('429')
  })

  it('critic failure yields a passing critique with the reason in gaps', async () => {
    const update = await withCriticFallback(boom)(base)
    expect(update.critique?.confidence).toBe(0.6)
    expect(update.critique?.drift_detected).toBe(false)
    expect(update.critique?.gaps).toEqual(['critic unavailable: 429 Rate limit reached'])
  })
})
