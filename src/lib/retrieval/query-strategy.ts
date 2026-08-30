import type { Plan } from './state'

const RECOMMENDATION_FILLER = [
  '幫我找',
  '推薦我',
  '有哪些',
  '有哪',
  '哪些',
  '文章',
  '找文',
  '關於',
  '列出',
  '幫我',
  '請問',
]

export function buildRecommendationSearchQuery(query: string, plan: Pick<Plan, 'search_keywords'>): string {
  const keywordQuery = (plan.search_keywords ?? []).join(' ').trim()
  const source = keywordQuery || query
  let cleaned = source

  for (const filler of RECOMMENDATION_FILLER) {
    cleaned = cleaned.replaceAll(filler, ' ')
  }

  cleaned = cleaned
    .replace(/[，。！？、,.!?;；:：]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned || source.trim() || query.trim()
}

export function isBroadArticleCatalogQuery(query: string): boolean {
  const normalized = query.replace(/\s+/g, '')
  return (
    /(?:有哪些|列出|全部|清單).*(?:文章|導讀|系列)/u.test(normalized) ||
    /(?:文章|導讀|系列).*(?:有哪些|列出|全部|清單)/u.test(normalized)
  )
}
