import { createHash } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_GLOSSARY_TERMS, type GlossaryEntry } from './terms'
import { mergeGlossaryEntries, normalizeGlossaryTerms, resolveGlossaryForLang } from './entries'
import { getSharedGlossaryAsset, SHARED_GLOSSARY_ASSETS } from './assets'
import { GLOSSARY_LOAD_TIMEOUT_MS, loadGlossaryEntries } from './client'

const overrides: GlossaryEntry[] = [
  { term: ' rag ', aliases: ['Article RAG', 'embedding'], definition: 'article zh', definition_en: 'article en' },
  { term: 'RAG', definition: 'duplicate must lose' },
  { term: 'Custom', definition: 'Chinese fallback', links: [] },
  { term: '  ', definition: 'empty must disappear' },
]

describe('shared glossary delivery', () => {
  it.each(['zh-TW', 'en'])('preserves the previous combined normalization and locale semantics for %s', lang => {
    const shared = JSON.parse(getSharedGlossaryAsset(lang).body)
    const inline = resolveGlossaryForLang(normalizeGlossaryTerms(overrides), lang)
    const actual = mergeGlossaryEntries(shared, inline)
    const previous = resolveGlossaryForLang(normalizeGlossaryTerms([...overrides, ...DEFAULT_GLOSSARY_TERMS]), lang)
    expect(actual).toEqual(previous)
    expect(actual.filter(entry => entry.term.trim().toLowerCase() === 'rag')).toHaveLength(1)
    // Alias lookup uses the first matching entry, so custom aliases must beat shared terms.
    expect(actual.find(entry => entry.term.toLowerCase() === 'embedding' || entry.aliases?.includes('embedding'))).toBe(inline[0])
    expect(actual.find(entry => entry.term === 'Custom')?.definition).toBe('Chinese fallback')
  })

  it('uses the hash of the exact emitted locale content in the immutable URL', () => {
    for (const asset of SHARED_GLOSSARY_ASSETS) {
      const hash = createHash('sha256').update(asset.body).digest('hex').slice(0, 20)
      expect(asset.url).toBe(`/glossary/${asset.lang}-${hash}.json`)
      expect(JSON.parse(asset.body)).toEqual(resolveGlossaryForLang(normalizeGlossaryTerms(DEFAULT_GLOSSARY_TERMS), asset.lang))
    }
    expect(getSharedGlossaryAsset('en').url).not.toBe(getSharedGlossaryAsset('zh-TW').url)
    expect(getSharedGlossaryAsset('unsupported').lang).toBe('zh-TW')
  })

  it('fetches locale shared entries and keeps custom terms first', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(getSharedGlossaryAsset('en').body))
    const inline = resolveGlossaryForLang(normalizeGlossaryTerms(overrides), 'en')
    const result = await loadGlossaryEntries('/glossary/example.json', inline, fetcher)
    expect(result.sharedLoaded).toBe(true)
    expect(result.entries[0].definition).toBe('article en')
    expect(fetcher).toHaveBeenCalledWith('/glossary/example.json', { signal: expect.any(AbortSignal) })
  })

  it.each(['network', 'http', 'json', 'shape'])('keeps custom terms usable after a %s failure and allows a successful retry', async failure => {
    const fetcher = vi.fn<typeof fetch>()
    if (failure === 'network') fetcher.mockRejectedValueOnce(new Error('offline'))
    if (failure === 'http') fetcher.mockResolvedValueOnce(new Response('', { status: 503 }))
    if (failure === 'json') fetcher.mockResolvedValueOnce(new Response('invalid json'))
    if (failure === 'shape') fetcher.mockResolvedValueOnce(Response.json({ entries: [] }))
    fetcher.mockResolvedValueOnce(new Response(getSharedGlossaryAsset('en').body))
    const failed = await loadGlossaryEntries('/glossary/example.json', overrides, fetcher)
    expect(failed.sharedLoaded).toBe(false)
    expect(failed.entries).toEqual(normalizeGlossaryTerms(overrides))
    const retried = await loadGlossaryEntries('/glossary/example.json', overrides, fetcher)
    expect(retried.sharedLoaded).toBe(true)
    expect(retried.entries.length).toBeGreaterThan(failed.entries.length)
  })

  it.each(['fetch', 'body'])('bounds a never-resolving %s and permits retry without leaking timers', async phase => {
    vi.useFakeTimers()
    try {
      const fetcher = vi.fn<typeof fetch>()
      if (phase === 'fetch') fetcher.mockImplementationOnce(() => new Promise<Response>(() => {}))
      else fetcher.mockResolvedValueOnce({ ok: true, json: () => new Promise(() => {}) } as Response)
      fetcher.mockResolvedValueOnce(new Response(getSharedGlossaryAsset('en').body))
      const pending = loadGlossaryEntries('/glossary/example.json', overrides, fetcher)
      await vi.advanceTimersByTimeAsync(GLOSSARY_LOAD_TIMEOUT_MS)
      const failed = await pending
      expect(failed.sharedLoaded).toBe(false)
      expect(failed.entries).toEqual(normalizeGlossaryTerms(overrides))
      expect(fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true)
      expect(vi.getTimerCount()).toBe(0)
      const retried = await loadGlossaryEntries('/glossary/example.json', overrides, fetcher)
      expect(retried.sharedLoaded).toBe(true)
      expect(retried.entries.length).toBeGreaterThan(failed.entries.length)
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

})
