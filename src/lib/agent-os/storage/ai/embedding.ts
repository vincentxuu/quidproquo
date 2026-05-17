import type { EmbeddingBackend } from '../types'

const DEFAULT_EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5'

export class WorkersAiEmbeddingBackend implements EmbeddingBackend {
  constructor(
    private readonly ai: Ai,
    private readonly model = DEFAULT_EMBEDDING_MODEL,
  ) {}

  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return []
    const result = await this.ai.run(this.model, { text: texts }) as { data?: number[][] }
    return result.data ?? []
  }
}
