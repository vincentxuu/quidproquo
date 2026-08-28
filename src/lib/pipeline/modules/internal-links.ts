import type { CloudPost } from './content-posts'
import { runContentOps } from './content-ops'

export interface InternalLinkSuggestionItem {
  target_slug: string
  target_title: string
  target_category: string | null
  anchor_text: string
  insert_after_heading: string | null
  score: number
  reason: string
}

export interface InternalLinkSuggestionsReport {
  generated_at: string
  pipeline: 'internal-links'
  target_post: {
    slug: string
    title: string
    lang: string
    category: string
  }
  opportunities: InternalLinkSuggestionItem[]
}

export function runInternalLinkSuggestions(posts: CloudPost[], targetSlug: string): InternalLinkSuggestionsReport {
  const postMap = new Map(posts.map((post) => [post.slug, post]))
  const targetPost = postMap.get(targetSlug)
  if (!targetPost) {
    throw new Error(`Source post not found: ${targetSlug}`)
  }

  const headings = extractHeadings(targetPost.content)
  const opsReport = runContentOps(posts)
  const targetOps = opsReport.posts.find((item) => item.slug === targetSlug)
  const opportunities = (targetOps?.seo?.internal_link_opportunities ?? []).map((item, index) => {
    const candidate = postMap.get(item.slug)
    const sharedTags = candidate ? overlapCount(targetPost.tags, candidate.tags) : 0
    const anchorAfter = headings[index % Math.max(headings.length, 1)]
    const title = candidate?.title || item.title
    return {
      target_slug: item.slug,
      target_title: title,
      target_category: candidate?.category ?? null,
      anchor_text: item.title,
      insert_after_heading: anchorAfter ? anchorAfter.title : null,
      score: item.score,
      reason: `${item.score.toFixed(3)} score from content + tag + recency signals, ${sharedTags} shared tag(s).`,
    }
  })

  return {
    generated_at: new Date().toISOString(),
    pipeline: 'internal-links',
    target_post: {
      slug: targetPost.slug,
      title: targetPost.title,
      lang: targetPost.lang,
      category: targetPost.category,
    },
    opportunities,
  }
}

function extractHeadings(content: string): { level: number; title: string }[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      return {
        level: match ? match[1].length : 2,
        title: match ? match[2].trim() : line,
      }
    })
}

function overlapCount(left: string[], right: string[]): number {
  const rightSet = new Set(right)
  return left.filter((tag) => rightSet.has(tag)).length
}
