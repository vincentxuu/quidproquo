import { describe, expect, it } from 'vitest'
import type { CostModel } from './cost'

describe('CostModel', () => {
  it('supports token pricing variants', () => {
    const cost: CostModel = { kind: 'token', inputPerKToken: 0.001, outputPerKToken: 0.002 }
    expect(cost.kind).toBe('token')
    expect(cost.inputPerKToken).toBe(0.001)
  })
})
