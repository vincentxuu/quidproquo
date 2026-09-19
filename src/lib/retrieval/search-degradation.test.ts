import { describe, expect, it } from 'vitest'
import { assessSearchDegradation, needsKeywordFallback, type DegradationSourceRun } from './search-degradation'

function run(overrides: Partial<DegradationSourceRun> & { id: string }): DegradationSourceRun {
  return { enabled: true, visible: true, shadow: false, resultCount: 0, ...overrides }
}

describe('assessSearchDegradation', () => {
  it('is clean when every user-facing source answered', () => {
    expect(assessSearchDegradation([
      run({ id: 'd1Keyword', resultCount: 20 }),
      run({ id: 'vectorizeSemantic', resultCount: 8 }),
    ])).toEqual({ degraded: false, sources: [] })
  })

  it('reports timeouts, errors and partial answers from user-facing sources', () => {
    expect(assessSearchDegradation([
      run({ id: 'd1Keyword', timeout: true, error: 'search source timed out' }),
      run({ id: 'vectorizeSemantic', resultCount: 3, partial: true }),
      run({ id: 'cloudflareAiSearch', error: 'boom' }),
    ])).toEqual({
      degraded: true,
      sources: [
        { id: 'd1Keyword', reason: 'timeout' },
        { id: 'vectorizeSemantic', reason: 'partial' },
        { id: 'cloudflareAiSearch', reason: 'error' },
      ],
    })
  })

  it('ignores shadow, hidden and disabled sources', () => {
    expect(assessSearchDegradation([
      run({ id: 'd1Keyword', resultCount: 5 }),
      run({ id: 'cloudflareAiSearch', shadow: true, timeout: true }),
      run({ id: 'vectorizeSemantic', visible: false, error: 'x' }),
    ]).degraded).toBe(false)
  })
})

describe('needsKeywordFallback', () => {
  it('retries when the keyword source timed out and nothing else produced results', () => {
    expect(needsKeywordFallback([
      run({ id: 'd1Keyword', timeout: true }),
      run({ id: 'vectorizeSemantic', timeout: true }),
    ])).toBe(true)
  })

  it('retries when the keyword source never ran', () => {
    expect(needsKeywordFallback([run({ id: 'vectorizeSemantic', timeout: true })])).toBe(true)
  })

  it('does not retry a keyword source that answered with genuinely zero hits', () => {
    expect(needsKeywordFallback([
      run({ id: 'd1Keyword', resultCount: 0 }),
      run({ id: 'vectorizeSemantic', timeout: true }),
    ])).toBe(false)
  })

  it('does not retry when another user-facing source already has results', () => {
    expect(needsKeywordFallback([
      run({ id: 'd1Keyword', timeout: true }),
      run({ id: 'vectorizeSemantic', resultCount: 4 }),
    ])).toBe(false)
  })
})
