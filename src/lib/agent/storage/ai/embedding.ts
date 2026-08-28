import type { EmbeddingBackend } from '../types'
import { embedTexts } from '../../../retrieval/embedding'

export class WorkersAiEmbeddingBackend implements EmbeddingBackend {
  constructor(private readonly ai: Ai) {}

  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return []
    return embedTexts(this.ai, texts)
  }
}
