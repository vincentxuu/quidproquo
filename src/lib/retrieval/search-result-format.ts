const DEFAULT_EXCERPT_LENGTH = 220

export function formatSearchExcerpt(input: string, maxLength = DEFAULT_EXCERPT_LENGTH): string {
  const cleaned = input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[>\-*+]\s+/gm, '')
    .replace(/[|┌┐└┘├┤┬┴┼─│]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= maxLength) return cleaned

  const clipped = cleaned.slice(0, maxLength).trimEnd()
  const lastSentence = Math.max(
    clipped.lastIndexOf('。'),
    clipped.lastIndexOf('！'),
    clipped.lastIndexOf('？'),
    clipped.lastIndexOf('. '),
    clipped.lastIndexOf('! '),
    clipped.lastIndexOf('? ')
  )

  if (lastSentence >= Math.floor(maxLength * 0.55)) {
    return clipped.slice(0, lastSentence + 1).trim()
  }

  return `${clipped.replace(/[，,、:：;；-]\s*$/, '')}...`
}

export function dedupeSearchResultsByUrl<T extends { source_url: string; relevance_score: number }>(items: T[]): T[] {
  const byUrl = new Map<string, T>()

  for (const item of items) {
    const existing = byUrl.get(item.source_url)
    if (!existing || item.relevance_score > existing.relevance_score) {
      byUrl.set(item.source_url, item)
    }
  }

  return [...byUrl.values()]
}
