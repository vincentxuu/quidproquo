import { describe, it, expect, beforeEach } from 'vitest'

describe('search provider definitions', () => {
  beforeEach(async () => {
    const { clear } = await import('../../registry')
    clear()
  })

  it('tavily provider has required fields', async () => {
    const { registerDefaultSearchProviders } = await import('./register-defaults')
    const { listByCategory } = await import('../../registry')

    registerDefaultSearchProviders()
    const providers = listByCategory('search')
    const tavily = providers.find((p) => p.providerId === 'search.tavily')

    expect(tavily).toBeDefined()
    expect(tavily?.capabilityJson).toBeDefined()
    expect(tavily?.outboundDomains?.length).toBeGreaterThan(0)
  })

  it('exa provider has required fields', async () => {
    const { registerDefaultSearchProviders } = await import('./register-defaults')
    const { listByCategory } = await import('../../registry')

    registerDefaultSearchProviders()
    const providers = listByCategory('search')
    const exa = providers.find((p) => p.providerId === 'search.exa')

    expect(exa).toBeDefined()
    expect(exa?.capabilityJson).toBeDefined()
    expect(exa?.outboundDomains?.length).toBeGreaterThan(0)
  })

  it('all search providers have outboundDomains', async () => {
    const { registerDefaultSearchProviders } = await import('./register-defaults')
    const { listByCategory } = await import('../../registry')

    registerDefaultSearchProviders()
    const providers = listByCategory('search')
    for (const p of providers) {
      expect(p.outboundDomains?.length).toBeGreaterThan(0)
    }
  })
})
