import { describe, expect, it } from 'vitest'
import { nextCronTime, nextRoutineRunAt, parseCron } from './cron-schedule'

const at = (iso: string) => new Date(iso)
const next = (cron: string, from: string) => {
  const t = nextCronTime(cron, at(from))
  return t === null ? null : new Date(t).toISOString()
}

describe('parseCron', () => {
  it.each(['* * * * *', '*/15 * * * *', '0 9 * * 1-5', '0 */2 * * *', '5,35 8-18/2 1,15 * 0,7', '0 0 1 1 *'])('accepts %s', (expr) => {
    expect(parseCron(expr)).not.toBeNull()
  })

  it.each(['', '* * * *', '60 * * * *', '* 24 * * *', '* * 0 * *', '* * * 13 *', '* * * * 8', '5-1 * * * *', '*/0 * * * *', 'a * * * *', '1- * * * *'])('rejects %j', (expr) => {
    expect(parseCron(expr)).toBeNull()
  })
})

describe('nextCronTime (UTC)', () => {
  it('handles steps', () => {
    expect(next('*/15 * * * *', '2026-11-26T10:07:30Z')).toBe('2026-11-26T10:15:00.000Z')
    expect(next('0 */2 * * *', '2026-11-26T11:00:00Z')).toBe('2026-11-26T12:00:00.000Z')
  })

  it('is strictly after the reference time', () => {
    expect(next('0 9 * * *', '2026-11-26T09:00:00Z')).toBe('2026-11-27T09:00:00.000Z')
  })

  it('handles weekday ranges across a weekend', () => {
    // 2026-11-27 is a Friday
    expect(next('0 9 * * 1-5', '2026-11-27T10:00:00Z')).toBe('2026-11-30T09:00:00.000Z')
  })

  it('treats day-of-week 7 as Sunday', () => {
    expect(next('0 0 * * 7', '2026-11-26T00:00:00Z')).toBe('2026-11-29T00:00:00.000Z')
  })

  it('matches either day field when both are restricted', () => {
    // 1st of the month or any Monday; 2026-11-30 is a Monday
    expect(next('0 0 1 * 1', '2026-11-26T00:00:00Z')).toBe('2026-11-30T00:00:00.000Z')
  })

  it('rolls over months and years', () => {
    expect(next('0 0 1 1 *', '2026-11-26T00:00:00Z')).toBe('2027-01-01T00:00:00.000Z')
    expect(next('0 0 29 2 *', '2026-11-26T00:00:00Z')).toBe('2028-02-29T00:00:00.000Z')
  })

  it('returns null for invalid or impossible expressions', () => {
    expect(next('bad', '2026-11-26T00:00:00Z')).toBeNull()
    expect(next('0 0 31 2 *', '2026-11-26T00:00:00Z')).toBeNull()
  })
})

describe('nextRoutineRunAt', () => {
  it('adds the stagger to the next slot', () => {
    const t = nextRoutineRunAt('0 9 * * *', 120, at('2026-11-26T08:00:00Z'))
    expect(t).toBe(at('2026-11-26T09:02:00Z').getTime())
  })
})
