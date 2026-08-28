import { afterEach, describe, expect, it } from 'vitest'
import { clear, get, list, register, ToolRegistrationError, validateAllowlist } from './registry'
import type { ToolDefinition } from './types'

const baseTool: ToolDefinition = {
  name: 'demo',
  description: 'Demo tool',
  inputSchema: { type: 'object' },
  cost: { kind: 'free' },
}

describe('tools registry', () => {
  afterEach(() => clear())

  it('registers and retrieves a definition', () => {
    register(baseTool)
    expect(get('demo')).toBe(baseTool)
    expect(list()).toEqual([baseTool])
  })

  it('rejects duplicate names without mutating state', () => {
    register(baseTool)
    expect(() => register({ ...baseTool })).toThrow(ToolRegistrationError)
    expect(list()).toEqual([baseTool])
  })

  it('clears registry state', () => {
    register(baseTool)
    clear()
    expect(list()).toEqual([])
  })

  it('validates allowlists', () => {
    register(baseTool)
    expect(validateAllowlist(['demo', 'missing'])).toEqual({ ok: false, missing: ['missing'] })
  })
})
