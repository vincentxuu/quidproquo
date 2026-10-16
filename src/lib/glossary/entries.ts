import type { GlossaryEntry } from './terms'

export function normalizeGlossaryTerms(entries: GlossaryEntry[]): GlossaryEntry[] {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    const key = entry.term.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function resolveGlossaryForLang(entries: GlossaryEntry[], lang: string): GlossaryEntry[] {
  if (lang !== 'en') return entries
  return entries.map((entry) => ({
    ...entry,
    definition: entry.definition_en ?? entry.definition,
    advanced: entry.advanced_en ?? entry.advanced,
    context: entry.context_en ?? entry.context,
    links: entry.links_en ?? entry.links,
  }))
}

/** Keep article entries first, including when aliases overlap shared terms. */
export function mergeGlossaryEntries(shared: GlossaryEntry[], overrides: GlossaryEntry[]): GlossaryEntry[] {
  return normalizeGlossaryTerms([...overrides, ...shared])
}
