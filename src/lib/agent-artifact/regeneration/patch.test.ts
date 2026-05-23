import { describe, expect, it } from 'vitest'
import type { ExtractedSection } from '../registry/types'
import { patchSections } from './patch'

function section(key: string, body: string): ExtractedSection {
  return { sectionKey: key, bodyText: body }
}

describe('patchSections', () => {
  it('replaces only the section whose stepRunId matches the target', () => {
    const original = [section('a', 'A'), section('b', 'B'), section('c', 'C')]
    const stepIds = ['step-1', 'step-2', 'step-3']
    const regenerated = [section('b2', 'B-regen')]

    const patched = patchSections(original, regenerated, 'step-2', stepIds)

    expect(patched).toEqual([section('a', 'A'), section('b2', 'B-regen'), section('c', 'C')])
  })

  it('preserves order and leaves non-target sections untouched', () => {
    const original = [section('a', 'A'), section('b', 'B'), section('c', 'C')]
    const stepIds = ['step-1', 'step-1', 'step-1']
    const regenerated = [section('x', 'X'), section('y', 'Y'), section('z', 'Z')]

    const patched = patchSections(original, regenerated, 'step-1', stepIds)

    expect(patched.map((s) => s.bodyText)).toEqual(['X', 'Y', 'Z'])
  })

  it('swaps two matching sections in order when regenerated provides two', () => {
    const original = [section('a', 'A'), section('b', 'B'), section('c', 'C')]
    const stepIds = ['step-1', 'step-2', 'step-2']
    const regenerated = [section('b2', 'B2'), section('c2', 'C2')]

    const patched = patchSections(original, regenerated, 'step-2', stepIds)

    expect(patched).toEqual([section('a', 'A'), section('b2', 'B2'), section('c2', 'C2')])
  })

  it('truncates surplus matching sections when regenerated provides fewer', () => {
    const original = [section('a', 'A'), section('b', 'B'), section('c', 'C')]
    const stepIds = ['step-1', 'step-2', 'step-2']
    const regenerated = [section('b2', 'B2')]

    const patched = patchSections(original, regenerated, 'step-2', stepIds)

    expect(patched).toEqual([section('a', 'A'), section('b2', 'B2')])
  })

  it('is a no-op pass-through when no original section matches the target', () => {
    const original = [section('a', 'A'), section('b', 'B')]
    const stepIds = ['step-1', 'step-2']
    const regenerated = [section('x', 'X')]

    const patched = patchSections(original, regenerated, 'step-99', stepIds)

    expect(patched).toEqual(original)
  })

  it('treats a null original stepRunId as a non-match', () => {
    const original = [section('a', 'A'), section('b', 'B')]
    const stepIds = [null, 'step-2']
    const regenerated = [section('b2', 'B2')]

    const patched = patchSections(original, regenerated, 'step-2', stepIds)

    expect(patched).toEqual([section('a', 'A'), section('b2', 'B2')])
  })
})
