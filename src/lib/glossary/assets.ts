import { createHash } from 'node:crypto'
import { DEFAULT_GLOSSARY_TERMS } from './terms'
import { normalizeGlossaryTerms, resolveGlossaryForLang } from './entries'

// Build once per locale, not once per prerendered article. This module is server-only.
const sharedEntries = normalizeGlossaryTerms(DEFAULT_GLOSSARY_TERMS)
export const SHARED_GLOSSARY_ASSETS = (['zh-TW', 'en'] as const).map(lang => {
  const body = JSON.stringify(resolveGlossaryForLang(sharedEntries, lang))
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 20)
  const name = `${lang}-${hash}`
  return { lang, name, body, url: `/glossary/${name}.json` }
})

export function getSharedGlossaryAsset(lang: string) {
  return SHARED_GLOSSARY_ASSETS.find(asset => asset.lang === lang) ?? SHARED_GLOSSARY_ASSETS[0]
}
