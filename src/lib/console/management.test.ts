import { describe, expect, it } from 'vitest'
import {
  mapFlowRows,
  mapPolicyAssignments,
  mapPolicyDetail,
  mapPolicyRows,
  mapProviderRows,
} from './management'

describe('mapFlowRows', () => {
  it('maps flow definitions to display rows with fallbacks', () => {
    const rows = mapFlowRows({
      flows: [
        { id: 'deep-research', name: 'Deep Research', version: 3, description: 'x' },
        { id: 'bare' },
      ],
    })
    expect(rows).toEqual([
      { id: 'deep-research', name: 'Deep Research', version: 3, description: 'x' },
      { id: 'bare', name: 'bare', version: 1, description: '' },
    ])
  })

  it('returns [] for malformed input', () => {
    expect(mapFlowRows(null)).toEqual([])
    expect(mapFlowRows({})).toEqual([])
    expect(mapFlowRows({ flows: 'nope' })).toEqual([])
  })
})

describe('mapProviderRows', () => {
  it('merges registry rows with health status by provider id', () => {
    const rows = mapProviderRows(
      { providers: [{ id: 'openai', category: 'model', displayName: 'OpenAI', version: '2', isEnabled: true }] },
      { health: [{ providerId: 'openai', status: 'degraded' }] },
    )
    expect(rows).toEqual([
      { id: 'openai', category: 'model', displayName: 'OpenAI', version: '2', enabled: true, status: 'degraded' },
    ])
  })

  it('defaults status to unknown and enabled to true', () => {
    const rows = mapProviderRows({ providers: [{ id: 'exa', category: 'search' }] }, null)
    expect(rows[0]).toMatchObject({ id: 'exa', enabled: true, status: 'unknown', displayName: 'exa' })
  })
})

describe('mapPolicyRows', () => {
  it('maps policy records and reads category from body', () => {
    const rows = mapPolicyRows({
      policies: [{ policyKey: 'budget-default', label: 'Budget', version: 2, body: { category: 'budget' }, updatedAt: 100 }],
    })
    expect(rows).toEqual([
      { policyKey: 'budget-default', label: 'Budget', version: 2, category: 'budget', updatedAt: 100 },
    ])
  })

  it('falls back to em dash category and key-as-label', () => {
    const rows = mapPolicyRows({ policies: [{ policyKey: 'k', version: 1, body: {} }] })
    expect(rows[0]).toMatchObject({ policyKey: 'k', label: 'k', category: '—' })
  })
})

describe('mapPolicyDetail', () => {
  it('maps a policy record and pretty-prints its body', () => {
    const detail = mapPolicyDetail({
      policy: { policyKey: 'budget', label: 'Budget', version: 2, body: { category: 'budget', maxUsd: 5 }, createdAt: 1, updatedAt: 2 },
    })
    expect(detail).toMatchObject({ policyKey: 'budget', label: 'Budget', version: 2, category: 'budget' })
    expect(detail?.body).toContain('"maxUsd": 5')
  })

  it('returns null for missing policy', () => {
    expect(mapPolicyDetail(null)).toBeNull()
    expect(mapPolicyDetail({})).toBeNull()
  })
})

describe('mapPolicyAssignments', () => {
  it('resolves the binding target by scope precedence', () => {
    const rows = mapPolicyAssignments({
      bindings: [
        { bindingId: 1, scope: 'flow_definition', flowDefinitionId: 'deep-research' },
        { bindingId: 2, scope: 'global' },
        { bindingId: 3, scope: 'agent', agentId: 'researcher' },
      ],
    })
    expect(rows).toEqual([
      { bindingId: 1, scope: 'flow_definition', target: 'deep-research' },
      { bindingId: 2, scope: 'global', target: '(all)' },
      { bindingId: 3, scope: 'agent', target: 'researcher' },
    ])
  })
})
