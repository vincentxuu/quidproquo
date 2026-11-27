import { describe, expect, it } from 'vitest'
import {
  buildProviderKeyLists,
  getCurrentProviderKeyValues,
  parseProviderSecretName,
  providerKeyList,
  withProviderKey,
} from './provider-key-store'

// Fake key values only.
describe('parseProviderSecretName', () => {
  it('accepts known secrets as key 1 and #2..#10 of multi-key secrets', () => {
    expect(parseProviderSecretName('RUNCRATE_API_KEY')).toEqual({ name: 'RUNCRATE_API_KEY', slot: 1 })
    expect(parseProviderSecretName('RUNCRATE_API_KEY#2')).toEqual({ name: 'RUNCRATE_API_KEY', slot: 2 })
    expect(parseProviderSecretName('GEMINI_API_KEY#10')).toEqual({ name: 'GEMINI_API_KEY', slot: 10 })
    expect(parseProviderSecretName('TAVILY_API_KEY')).toEqual({ name: 'TAVILY_API_KEY', slot: 1 })
  })

  it('rejects unknown names, out-of-range or non-canonical numbers, and single-key secrets', () => {
    for (const name of ['UNKNOWN_KEY', 'UNKNOWN_KEY#2', 'RUNCRATE_API_KEY#1', 'RUNCRATE_API_KEY#11', 'RUNCRATE_API_KEY#02',
      'RUNCRATE_API_KEY#2.5', 'RUNCRATE_API_KEY#', 'RUNCRATE_API_KEY#2#3', 'runcrate_api_key#2',
      'TAVILY_API_KEY#2', 'CLOUDFLARE_API_TOKEN#2', '']) {
      expect(parseProviderSecretName(name)).toBeNull()
    }
  })
})

describe('buildProviderKeyLists', () => {
  it('orders saved keys by slot and appends a different env key last', () => {
    const lists = buildProviderKeyLists(
      { RUNCRATE_API_KEY: { 3: 'rc-3', 1: 'rc-1', 2: 'rc-2' } },
      { RUNCRATE_API_KEY: 'rc-env' },
    )
    expect(lists.RUNCRATE_API_KEY).toEqual(['rc-1', 'rc-2', 'rc-3', 'rc-env'])
  })

  it('does not repeat an env key that is already saved', () => {
    const lists = buildProviderKeyLists({ ZAI_API_KEY: { 1: 'z-1', 2: 'z-env' } }, { ZAI_API_KEY: 'z-env' })
    expect(lists.ZAI_API_KEY).toEqual(['z-1', 'z-env'])
  })

  it('keeps the env key alone when nothing is saved', () => {
    expect(buildProviderKeyLists({}, { NVIDIA_API_KEY: 'nv-env' }).NVIDIA_API_KEY).toEqual(['nv-env'])
    expect(buildProviderKeyLists({}, {}).NVIDIA_API_KEY).toBeUndefined()
  })

  it('lets a saved value replace the env var for single-key secrets, as before', () => {
    const lists = buildProviderKeyLists({ TAVILY_API_KEY: { 1: 't-saved' } }, { TAVILY_API_KEY: 't-env' })
    expect(lists.TAVILY_API_KEY).toEqual(['t-saved'])
  })
})

describe('getCurrentProviderKeyValues', () => {
  it('still reads the deployed OPENCODE_ZEN_API_KEY for OPENCODE_API_KEY', () => {
    expect(getCurrentProviderKeyValues({ OPENCODE_ZEN_API_KEY: 'oc-env' }).OPENCODE_API_KEY).toBe('oc-env')
  })
})

describe('providerKeyList and withProviderKey', () => {
  it('lists Gemini keys from GOOGLE_API_KEY before GEMINI_API_KEY without duplicates', () => {
    const lists = { GOOGLE_API_KEY: ['g-1', 'g-2'], GEMINI_API_KEY: ['g-2', 'gm-1'] }
    expect(providerKeyList(lists, 'gemini')).toEqual(['g-1', 'g-2', 'gm-1'])
    expect(providerKeyList(lists, 'cloudflare')).toEqual([])
  })

  it('points every field the provider reads at the chosen key', () => {
    const base = { runcrate: 'rc-1', RUNCRATE_API_KEY: 'rc-1', ZAI_API_KEY: 'z-1' }
    expect(withProviderKey(base, 'runcrate', 'rc-2')).toEqual({ runcrate: 'rc-2', RUNCRATE_API_KEY: 'rc-2', ZAI_API_KEY: 'z-1' })
    const gemini = withProviderKey({ google: 'g-1' }, 'gemini', 'g-2')
    expect([gemini.google, gemini.gemini, gemini.GOOGLE_API_KEY, gemini.GEMINI_API_KEY]).toEqual(['g-2', 'g-2', 'g-2', 'g-2'])
    expect(withProviderKey(base, 'cloudflare', 'x')).toBe(base)
  })
})
