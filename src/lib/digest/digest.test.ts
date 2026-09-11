import { describe, it, expect, vi, afterEach } from 'vitest'
import { isSignificantRelease, todayTaipei, buildFrontmatter } from './framework'
import { weekStartDate, weekDates } from './weekly'

vi.mock('cloudflare:workers', () => ({
  env: {
    DB: { prepare: vi.fn() },
  },
}))

function makeRelease(overrides: Record<string, unknown> = {}) {
  return {
    tag_name: 'v1.5.0',
    name: 'v1.5.0',
    body: '',
    html_url: 'https://github.com/example/repo/releases/tag/v1.5.0',
    published_at: '2026-09-10T12:00:00Z',
    prerelease: false,
    draft: false,
    ...overrides,
  }
}

describe('isSignificantRelease', () => {
  it('rejects prerelease', () => {
    expect(isSignificantRelease(makeRelease({ prerelease: true }))).toBe(false)
  })

  it('rejects draft', () => {
    expect(isSignificantRelease(makeRelease({ draft: true }))).toBe(false)
  })

  it('rejects alpha/beta/rc tags', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.5.0-alpha.1' }))).toBe(false)
    expect(isSignificantRelease(makeRelease({ tag_name: 'v2.0.0-beta' }))).toBe(false)
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.0.0-rc.3' }))).toBe(false)
    expect(isSignificantRelease(makeRelease({ tag_name: '3.0.0-preview' }))).toBe(false)
  })

  it('accepts major version (X.0.0 where X > 0)', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: 'v2.0.0' }))).toBe(true)
    expect(isSignificantRelease(makeRelease({ tag_name: '3.0.0' }))).toBe(true)
  })

  it('does not treat 0.X.0 as major', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: '0.5.0', body: 'bug fix only' }))).toBe(false)
  })

  it('accepts releases with breaking changes in body', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.2.3', body: 'BREAKING CHANGE: removed foo' }))).toBe(true)
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.2.3', body: 'breaking: new API' }))).toBe(true)
  })

  it('accepts releases with new features in body', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.3.0', body: 'Added new feature for streaming' }))).toBe(true)
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.4.0', body: 'Introduces new API endpoint' }))).toBe(true)
  })

  it('rejects patch-only releases', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.2.3', body: 'Fixed a typo in README' }))).toBe(false)
  })

  it('accepts patch with feat keyword in body', () => {
    expect(isSignificantRelease(makeRelease({ tag_name: 'v1.2.3', body: 'feat: added new module' }))).toBe(true)
  })
})

describe('todayTaipei', () => {
  it('returns YYYY-MM-DD format', () => {
    const result = todayTaipei()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('buildFrontmatter', () => {
  it('produces valid frontmatter with correct fields', () => {
    const release = {
      repo: 'langchain-ai/langgraph',
      release: makeRelease({ tag_name: 'v1.5.0', name: 'LangGraph 1.5.0' }),
      stars: 38000,
      previousTag: 'v1.4.2',
    }
    const fm = buildFrontmatter(release, '2026-09-12', 5)
    expect(fm).toContain('title: "框架更新｜langgraph v1.5.0"')
    expect(fm).toContain('date: 2026-09-12')
    expect(fm).toContain('category: daily')
    expect(fm).toContain('tags: [ai-agent, framework, daily, langgraph]')
    expect(fm).toContain('lang: zh-TW')
    expect(fm).toContain('order: 5')
    expect(fm).toContain('name: "AI Framework Changelog"')
    expect(fm).toMatch(/^---/)
    expect(fm).toMatch(/---$/)
  })

  it('uses tag as description fallback when name is empty', () => {
    const release = {
      repo: 'org/tool',
      release: makeRelease({ tag_name: 'v2.0.0', name: '' }),
      stars: 100,
      previousTag: null,
    }
    const fm = buildFrontmatter(release, '2026-09-12', 1)
    expect(fm).toContain('description: "tool v2.0.0 release"')
  })
})

describe('weekStartDate', () => {
  it('computes start of week from a given date string', () => {
    const result = weekStartDate('2026-09-11')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result < '2026-09-11').toBe(true)
  })

  it('returns a date before the input', () => {
    const result = weekStartDate('2026-09-04')
    expect(result < '2026-09-04').toBe(true)
  })
})

describe('weekDates', () => {
  it('returns a contiguous ascending date range', () => {
    const dates = weekDates('2026-09-07', '2026-09-11')
    expect(dates.length).toBeGreaterThanOrEqual(1)
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] > dates[i - 1]).toBe(true)
    }
    expect(dates.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true)
  })

  it('returns at least one date for same start/end', () => {
    const dates = weekDates('2026-09-12', '2026-09-12')
    expect(dates.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Friday guard', () => {
  let dateSpy: ReturnType<typeof vi.spyOn>

  afterEach(() => {
    dateSpy?.mockRestore()
  })

  it('weekly agent skips on non-Friday', async () => {
    dateSpy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(
      function (_locale?: unknown, options?: unknown) {
        const opts = options as Intl.DateTimeFormatOptions | undefined
        if (opts?.weekday === 'long') return 'Wednesday'
        if (_locale === 'sv-SE') return '2026-09-10'
        return '2026-09-10'
      }
    )
    const { weeklyDigestAgent } = await import('./weekly')
    const result = await weeklyDigestAgent.run(
      {},
      {
        syscallContext: {},
        syscall: vi.fn(),
      } as unknown as Parameters<typeof weeklyDigestAgent.run>[1]
    )
    expect((result as unknown as Record<string, unknown>).skipped).toBe(true)
    expect((result as unknown as Record<string, unknown>).reason).toContain('not Friday')
  })

  it('region agent skips on non-Friday', async () => {
    dateSpy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(
      function (_locale?: unknown, options?: unknown) {
        const opts = options as Intl.DateTimeFormatOptions | undefined
        if (opts?.weekday === 'long') return 'Tuesday'
        if (_locale === 'sv-SE') return '2026-09-09'
        return '2026-09-09'
      }
    )
    const { regionDigestAgent } = await import('./region')
    const result = await regionDigestAgent.run(
      {},
      {
        syscallContext: {},
        syscall: vi.fn(),
      } as unknown as Parameters<typeof regionDigestAgent.run>[1]
    )
    expect((result as unknown as Record<string, unknown>).skipped).toBe(true)
    expect((result as unknown as Record<string, unknown>).reason).toContain('not Friday')
  })
})
