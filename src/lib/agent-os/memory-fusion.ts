export interface RankedItem<T> {
  item: T
  id: string
  importance?: number
  writtenAt?: number
}

export function fuseRRF<T>(lists: Array<Array<RankedItem<T>>>, options: { k?: number; limit?: number } = {}): T[] {
  const k = options.k ?? 60
  const scores = new Map<string, { score: number; entry: RankedItem<T> }>()
  for (const list of lists) {
    list.forEach((entry, index) => {
      const current = scores.get(entry.id)
      const score = 1 / (k + index + 1)
      if (current) {
        current.score += score
        if ((entry.importance ?? 0) > (current.entry.importance ?? 0)) current.entry = entry
      } else {
        scores.set(entry.id, { score, entry })
      }
    })
  }
  return [...scores.values()]
    .sort((a, b) => (
      b.score - a.score
      || (b.entry.importance ?? 0) - (a.entry.importance ?? 0)
      || (b.entry.writtenAt ?? 0) - (a.entry.writtenAt ?? 0)
    ))
    .slice(0, options.limit)
    .map((scored) => scored.entry.item)
}
