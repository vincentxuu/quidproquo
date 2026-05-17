import { env } from 'cloudflare:workers'
import type { LlamaDocument } from './documents'
import type { Env } from '@/lib/config/env'

interface VectorizeMetadata {
  [key: string]: VectorizeMetadataValue
}

type VectorizeMetadataValue = string | number | boolean | null | VectorizeMetadata | VectorizeMetadataValue[]

export interface VectorizeDocument {
  id: string
  values: number[]
  metadata: VectorizeMetadata
}

export interface LlamaVectorMatch {
  chunk_id: string
  score: number
  metadata: VectorizeMetadata
}

function parseTextForEmbedding(documents: LlamaDocument[]): string[] {
  return documents.map((doc) => `${doc.metadata.type}:${doc.id}\n${doc.text}`.trim())
}

export async function embedDocumentVectors(documents: LlamaDocument[]): Promise<VectorizeDocument[]> {
  const { AI } = env as unknown as Env
  if (documents.length === 0) return []
  const texts = parseTextForEmbedding(documents)
  const result = await AI.run('@cf/baai/bge-large-en-v1.5', { text: texts }) as { data: number[][] }
  const vectors = result.data ?? []

  return documents.map((doc, index) => ({
    id: doc.id,
    values: vectors[index] ?? [],
    metadata: {
      ...doc.metadata,
      chunk_id: doc.id,
    },
  }))
}

export async function upsertVectors(vectors: VectorizeDocument[]): Promise<void> {
  const { VECTORIZE_INDEX } = env as unknown as Env
  if (vectors.length === 0) return
  const vectorizeVectors: VectorizeVector[] = vectors.map((item) => ({
    id: item.id,
    values: item.values,
    metadata: item.metadata as Record<string, VectorizeVectorMetadata>,
  }))
  const ids = vectorizeVectors.map((entry) => entry.id)
  await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {})
  await VECTORIZE_INDEX.upsert(vectorizeVectors)
}

export async function queryVectorIndex(queryVector: number[], topK = 8): Promise<LlamaVectorMatch[]> {
  const { VECTORIZE_INDEX } = env as unknown as Env
  const raw = await VECTORIZE_INDEX.query(queryVector, {
    topK,
    returnMetadata: 'all',
  })

  return raw.matches.map((match) => ({
    chunk_id: String((match.metadata ?? {}).chunk_id ?? match.id),
    score: match.score ?? 0,
    metadata: (match.metadata ?? {}) as VectorizeMetadata,
  }))
}
