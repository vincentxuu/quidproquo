import type { LlamaDocument } from './documents'
import { loadDocuments } from './documents'
import { LlamaIndexD1DocStore } from './d1-docstore'
import { embedDocumentVectors, upsertVectors } from './vectorize-store'

export interface LlamaIndexIngestionResult {
  documents: number
  vectors: number
  errors: string[]
  offset: number
  limit: number
}

const MAX_BATCH = 80

function chunk<T>(items: T[], size: number): Array<T[]> {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size))
}

export async function runLlamaIndexIngestion(
  sources: Array<'posts' | 'docs' | 'custom'> = ['posts', 'docs'],
  offset = 0,
  limit = 240
): Promise<LlamaIndexIngestionResult> {
  const docstore = new LlamaIndexD1DocStore()
  const docs: LlamaDocument[] = await loadDocuments({ sources, offset, limit: Math.max(limit, 1) })
  const errors: string[] = []
  let totalVectors = 0
  for (const docsChunk of chunk(docs, MAX_BATCH)) {
    try {
      const vectors = await embedDocumentVectors(docsChunk)
      await upsertVectors(vectors)
      await docstore.putMetadata(docsChunk.map((doc) => ({
        chunk_id: doc.id,
        text: doc.text,
        metadata: doc.metadata,
      })))
      totalVectors += vectors.length
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown'
      errors.push(`Batch failed: ${message}`)
    }
  }

  return {
    documents: docs.length,
    vectors: totalVectors,
    errors,
    offset,
    limit,
  }
}
