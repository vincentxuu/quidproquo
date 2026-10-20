import type { GlossaryEntry } from './terms'
import { mergeGlossaryEntries } from './entries'

export const GLOSSARY_LOAD_TIMEOUT_MS = 5_000

/** Fail closed to article terms; callers can retry on focus/online without a rejected promise. */
export async function loadGlossaryEntries(
  url: string | undefined,
  overrides: GlossaryEntry[],
  fetcher: typeof fetch = fetch,
): Promise<{ entries: GlossaryEntry[]; sharedLoaded: boolean }> {
  const controller = new AbortController()
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    if (!url) throw new Error('Missing shared glossary URL')
    // Bound both the response and body read, even if a fetch implementation ignores abort.
    const deadline = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        reject(new Error('Shared glossary timed out'))
        controller.abort()
      }, GLOSSARY_LOAD_TIMEOUT_MS)
    })
    const request = (async () => {
      const response = await fetcher(url, { signal: controller.signal })
      if (!response.ok) throw new Error('Shared glossary unavailable')
      const shared: unknown = await response.json()
      if (!Array.isArray(shared) || !shared.every(entry => entry && typeof entry.term === 'string')) {
        throw new Error('Invalid shared glossary')
      }
      return shared as GlossaryEntry[]
    })()
    const shared = await Promise.race([request, deadline])
    return { entries: mergeGlossaryEntries(shared, overrides), sharedLoaded: true }
  } catch {
    return { entries: mergeGlossaryEntries([], overrides), sharedLoaded: false }
  } finally {
    clearTimeout(timeout)
  }
}
