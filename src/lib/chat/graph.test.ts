import { describe, it, expect } from 'vitest'
import { buildGraph } from './graph'

describe('graph', () => {
  it('compiles without throwing', () => {
    expect(() => buildGraph()).not.toThrow()
  })
})
