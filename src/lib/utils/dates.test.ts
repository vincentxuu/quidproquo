import { afterEach, describe, expect, it, vi } from 'vitest'
import { nowIso, nowMs, secondsUntilMidnight, toIsoDate, toIsoDay } from './dates'

describe('date utilities', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns current milliseconds', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-16T03:14:00.000Z'))
    expect(nowMs()).toBe(1778901240000)
  })

  it('formats ISO strings and days', () => {
    const date = new Date('2026-05-16T03:14:00.000Z')
    expect(nowIso).toBeDefined()
    expect(toIsoDate(date)).toBe('2026-05-16T03:14:00.000Z')
    expect(toIsoDay(date)).toBe('2026-05-16')
    expect(toIsoDay(0)).toBe('1970-01-01')
  })

  it('computes seconds until UTC midnight', () => {
    expect(secondsUntilMidnight(new Date('2026-05-16T23:59:00.000Z'))).toBe(60)
  })
})
