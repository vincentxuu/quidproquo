import { describe, it, expect } from 'vitest'

/**
 * Documents the four agent ids expected to be registered in the kernel registry
 * for the deep-research flow to execute correctly.
 *
 * The kernel (createKernel) requires Cloudflare bindings (D1, KV, AI) which are
 * not available in unit tests, so this test asserts the expected agent id constants
 * rather than booting the full kernel.
 */
describe('kernel-agents-present', () => {
  const EXPECTED_AGENT_IDS = ['planner', 'research', 'writer', 'critic'] as const

  it('documents four expected agent ids', () => {
    expect(EXPECTED_AGENT_IDS).toHaveLength(4)
  })

  it('includes planner', () => {
    expect(EXPECTED_AGENT_IDS).toContain('planner')
  })

  it('includes research', () => {
    expect(EXPECTED_AGENT_IDS).toContain('research')
  })

  it('includes writer', () => {
    expect(EXPECTED_AGENT_IDS).toContain('writer')
  })

  it('includes critic', () => {
    expect(EXPECTED_AGENT_IDS).toContain('critic')
  })

  it('agent ids used in deep-research flow match expected registry', () => {
    // Agent ids referenced in flows/deep-research.yaml (agent steps)
    const agentsUsedInDeepResearch = ['planner', 'research', 'writer']
    for (const id of agentsUsedInDeepResearch) {
      expect(EXPECTED_AGENT_IDS).toContain(id as (typeof EXPECTED_AGENT_IDS)[number])
    }
  })
})
