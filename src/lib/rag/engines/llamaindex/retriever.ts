import { env } from 'cloudflare:workers'
import type { SearchResult } from '../../state'
import type { SearchMetrics } from '../../tools/hybrid-search'
import { searchBlogPosts } from '../../tools/search-posts'
import { searchDocs } from '../../tools/search-docs'
import { queryVectorIndex } from './vectorize-store'
import { loadDocuments } from './documents'
import { LlamaIndexD1DocStore } from './d1-docstore'
import type { LlamaDocument } from './documents'
import type { NativeTrace } from '../../state'
import type { ProviderApiKeys } from '../../model'

export interface LlamaIndexRetrieverCase {
  source: 'vector' | 'bm25'
  sourceResult: SearchResult[]
}

export interface LlamaIndexRetrievalResult {
  results: SearchResult[]
  metrics: SearchMetrics
  nativeTrace: NativeTrace['events']
}

interface Env {
  AI: Ai
}

function toSearchResult(doc: LlamaDocument): SearchResult {
  const metadata = doc.metadata
  return {
    claim: doc.text.split(/[。.\n]/)[0]?.slice(0, 180) ?? doc.text.slice(0, 180),
    evidence_excerpt: doc.text,
    source_url: String(metadata.sourceUrl || metadata.source || ''),
    chunk_id: doc.id,
    date: String(metadata.updatedAt || ''),
    relevance_score: 0,
    images: [],
    links: [],
    type: (metadata.type === 'post' ? 'post' : 'doc') as 'post' | 'doc',
    slug: metadata.slug ? String(metadata.slug) : undefined,
    title: metadata.title ? String(metadata.title) : undefined,
  }
}

function collectUnique<T>(values: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const value of values) {
    const key = JSON.stringify(value)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(value)
  }
  return out
}

export async function runLlamaIndexRetriever(
  query: string,
  options: {
    topK?: number
    shortCircuit?: boolean
    sourceName?: string
    providerApiKeys?: ProviderApiKeys
  } = {}
): Promise<LlamaIndexRetrievalResult> {
  const topK = options.topK ?? 8
  const shortCircuit = options.shortCircuit ?? true
  const nativeEvents: NativeTrace['events'] = []
  const started = Date.now()

  const bm25Started = Date.now()
  const bm25Posts = await searchBlogPosts({ query, limit: topK, shortCircuit })
  const bm25Docs = await searchDocs({ query, source_name: options.sourceName, limit: topK, shortCircuit })
  const bm25Ms = Date.now() - bm25Started

  nativeEvents.push({
    stage: 'bm25_retrieval',
    at: new Date(Date.now()).toISOString(),
    duration_ms: Math.max(0, Date.now() - started),
    metadata: {
      postCount: bm25Posts.length,
      docCount: bm25Docs.length,
      shortCircuit,
    },
  })

  const { AI } = env as unknown as Env
  const embeddedAt = Date.now()
  const embedded = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] }) as { data: number[][] }
  const vectorMatches = embedded?.data?.[0]?.length
    ? await queryVectorIndex(embedded.data[0], topK)
    : []
  const vectorMs = Math.max(0, Date.now() - embeddedAt)
  const docstore = new LlamaIndexD1DocStore()
  const metadataRows = await docstore.getMetadata(vectorMatches.map((match) => match.chunk_id))
  const byChunkId = new Map(metadataRows.map((record) => [record.chunk_id, record] as const))

  const vectorDocs = vectorMatches
    .map((match) => {
    const doc = byChunkId.get(match.chunk_id)
    if (!doc) return undefined
    const baseDoc: LlamaDocument = {
      id: match.chunk_id,
      text: doc.text,
      metadata: doc.metadata as LlamaDocument['metadata'],
    }
    const vectorDoc: LlamaDocument = {
      ...baseDoc,
      metadata: {
        ...baseDoc.metadata,
        type: baseDoc.metadata.type ?? 'doc',
      },
    }
    return {
      ...vectorDoc,
      relevance_score: match.score,
    }
  })
    .filter((item): item is LlamaDocument & { relevance_score: number } => Boolean(item))
  const scoredVectorDocs = vectorDocs.map((entry) => ({ ...entry }))

  nativeEvents.push({
    stage: 'vector_retrieval',
    at: new Date().toISOString(),
    duration_ms: vectorMs,
    metadata: {
      matchCount: vectorMatches.length,
      uniqueMatchCount: vectorDocs.length,
    },
  })

  const combined = collectUnique([
    ...bm25Posts,
    ...bm25Docs,
      ...scoredVectorDocs.map((entry) => {
        const doc: LlamaDocument = {
          id: entry.id,
          text: entry.text,
          metadata: entry.metadata as LlamaDocument['metadata'],
        }
        return toSearchResult(doc)
      }),
  ] as SearchResult[])

  const allResults = combined.slice(0, topK)

  const metrics: SearchMetrics = {
    source: bm25Docs.length > bm25Posts.length ? 'docs' : 'posts',
    query_kind: 'general',
    bm25_results: bm25Posts.length + bm25Docs.length,
    vector_results: vectorMatches.length,
    result_count: allResults.length,
    bm25_ms: bm25Ms,
    vector_ms: vectorMatches.length > 0 ? vectorMs : null,
    total_ms: Math.max(1, Date.now() - started),
    skipped_vector: false,
    short_circuit_threshold: topK,
    estimated_latency_saved_ms: 0,
  }

  const missingChunkIds = vectorMatches
    .map((match) => match.chunk_id)
    .filter((chunkId) => !byChunkId.has(chunkId))
    .slice(0, 6)

  if (missingChunkIds.length > 0) {
    const fallbackDocs = await loadDocuments({ sources: ['posts', 'docs'], limit: missingChunkIds.length * 2 })
    for (const doc of fallbackDocs) {
      if (missingChunkIds.includes(doc.id)) {
        allResults.push(toSearchResult(doc))
      }
    }
  }

  return {
    results: allResults.slice(0, topK),
    metrics,
    nativeTrace: nativeEvents,
  }
}
