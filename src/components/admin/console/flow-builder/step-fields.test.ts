import { describe, it, expect } from 'vitest'
import { fieldsForStepType, STEP_GROUPS, STEP_TOOLTIPS, ALL_STEP_TYPES } from './step-fields'

describe('step-fields', () => {
  it('covers all 9 step types in STEP_GROUPS', () => {
    const allFromGroups = STEP_GROUPS.flatMap(g => g.steps)
    expect(allFromGroups.sort()).toEqual([...ALL_STEP_TYPES].sort())
  })

  it('provides tooltip for every step type', () => {
    for (const type of ALL_STEP_TYPES) {
      expect(STEP_TOOLTIPS[type]).toBeTruthy()
    }
  })

  it('returns field definitions for every step type', () => {
    for (const type of ALL_STEP_TYPES) {
      const fields = fieldsForStepType(type)
      expect(fields.length).toBeGreaterThan(0)
      for (const f of fields) {
        expect(f.key).toBeTruthy()
        expect(f.label).toBeTruthy()
      }
    }
  })
})
