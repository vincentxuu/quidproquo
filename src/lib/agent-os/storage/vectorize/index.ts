import type { VectorBackend, VectorMatch } from '../types'

export class VectorizeBackend implements VectorBackend {
  constructor(private readonly index: VectorizeIndex | undefined) {}

  async upsert(items: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void> {
    if (!this.index || items.length === 0) return
    await this.index.upsert(items.map((item) => ({
      id: item.id,
      values: item.values,
      metadata: item.metadata as Record<string, VectorizeVectorMetadata> | undefined,
    })))
  }

  async query(values: number[], options: { topK: number; namespace?: string; filter?: Record<string, unknown> }): Promise<VectorMatch[]> {
    if (!this.index) return []
    const result = await this.index.query(values, {
      topK: options.topK,
      namespace: options.namespace,
      filter: options.filter as VectorizeVectorMetadataFilter | undefined,
      returnMetadata: 'all',
    })
    return (result.matches ?? []).map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata as Record<string, unknown> | undefined,
    }))
  }
}
