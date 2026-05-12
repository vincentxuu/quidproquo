import { describe, expect, it } from 'vitest'
import { getArtifactKey } from './artifacts'

describe('translation artifact keys', () => {
  it('places stage outputs under the job id', () => {
    expect(getArtifactKey('job-1', 'translator')).toBe('translations/job-1/translator.md')
    expect(getArtifactKey('job-1', 'native_checker')).toBe('translations/job-1/native_checker.md')
  })
})
