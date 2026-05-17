import { describe, expect, it } from 'vitest'
import type { Env } from './env'

describe('Env', () => {
  it('allows reserved agent-os bindings to be absent', () => {
    const env = {} as Env
    expect(env.AGENT_QUEUE).toBeUndefined()
    expect(env.R2_AGENT_MEMORY).toBeUndefined()
  })
})
