import { describe, expect, it } from 'vitest'
import { toAgentSteps } from './steps-adapter'
import type { Step } from './types'

function makeStep(overrides: Partial<Step> & { label: string }): Step {
  return { status: 'active', ...overrides }
}

describe('toAgentSteps', () => {
  it('returns empty for missing steps', () => {
    expect(toAgentSteps(undefined)).toEqual([])
    expect(toAgentSteps([])).toEqual([])
  })

  it('dedupes repeated labels keeping first order and latest status', () => {
    const steps = [
      makeStep({ label: '分析問題', status: 'pending' }),
      makeStep({ label: '規劃檢索策略', status: 'active' }),
      makeStep({ label: '規劃檢索策略', status: 'active' }),
      makeStep({ label: '分析問題', status: 'complete' }),
      makeStep({ label: '檢索站內文章', status: 'active' }),
    ]

    expect(toAgentSteps(steps)).toEqual([
      { agent: '分析問題', status: 'completed' },
      { agent: '規劃檢索策略', status: 'started' },
      { agent: '檢索站內文章', status: 'started' },
    ])
  })

  it('carries result counts as sources_found', () => {
    const steps = [
      makeStep({
        label: '檢索站內文章',
        status: 'complete',
        tool: 'search_posts',
        results: [
          { title: 'A', url: 'https://example.com/a' },
          { title: 'B', url: 'https://example.com/b' },
        ],
      }),
    ]

    expect(toAgentSteps(steps)).toEqual([
      { agent: '檢索站內文章', status: 'completed', sources_found: 2 },
    ])
  })
})
