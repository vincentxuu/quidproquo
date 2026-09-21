import { describe, expect, it } from 'vitest'
import { buildVisibleSuggestions } from './suggestions'

const pool = ['s0', 's1', 's2', 's3', 's4', 's5']

describe('buildVisibleSuggestions', () => {
  it('fills all four slots from the site pool when there is no post', () => {
    expect(buildVisibleSuggestions([], pool, 0)).toEqual(['s0', 's1', 's2', 's3'])
    expect(buildVisibleSuggestions([], pool, 1)).toEqual(['s4', 's5', 's0', 's1'])
  })

  it('puts post questions first and keeps one site-wide slot', () => {
    expect(buildVisibleSuggestions(['p0', 'p1', 'p2'], pool, 0)).toEqual(['p0', 'p1', 'p2', 's0'])
  })

  it('shuffles only the site-wide slot', () => {
    expect(buildVisibleSuggestions(['p0', 'p1', 'p2'], pool, 1)).toEqual(['p0', 'p1', 'p2', 's1'])
    expect(buildVisibleSuggestions(['p0', 'p1', 'p2'], pool, 6)).toEqual(['p0', 'p1', 'p2', 's0'])
  })

  it('never lets post questions crowd out the site-wide slot', () => {
    expect(buildVisibleSuggestions(['p0', 'p1', 'p2', 'p3', 'p4'], pool, 0)).toEqual(['p0', 'p1', 'p2', 's0'])
  })
})
