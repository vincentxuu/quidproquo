export const SUGGESTIONS_PER_PAGE = 4

// 在文章頁：前幾題問眼前這篇，剩下的格子留給全站題；「換題目」只輪替全站那幾格。
// 沒有文章題時與原本行為相同（四格全是全站題）。
export function buildVisibleSuggestions(pageQuestions: readonly string[], sitePool: readonly string[], page: number): string[] {
  const fromPage = pageQuestions.slice(0, SUGGESTIONS_PER_PAGE - 1)
  const siteSlots = SUGGESTIONS_PER_PAGE - fromPage.length
  if (sitePool.length === 0) return [...fromPage]
  const fromSite = Array.from({ length: siteSlots }, (_, index) => sitePool[(page * siteSlots + index) % sitePool.length])
  return [...fromPage, ...fromSite]
}
