import { env } from 'cloudflare:workers'

interface CacheEnv {
  DB: D1Database
  AI: Ai
}

export interface SemanticCacheHit {
  response: string
  confidence: number
  similarity: number
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let magA = 0
  let magB = 0

  const length = Math.min(a.length, b.length)
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }

  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

async function embedQuery(query: string): Promise<number[]> {
  const { AI } = env as unknown as CacheEnv
  const result = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] }) as { data: number[][] }
  return result.data[0]
}

export async function lookupSemanticCache(query: string, threshold: number): Promise<SemanticCacheHit | null> {
  const { DB } = env as unknown as CacheEnv
  const queryVector = await embedQuery(query)
  const rows = await DB.prepare(
    'SELECT id, response, confidence, query_vector FROM semantic_cache ORDER BY updated_at DESC LIMIT 25'
  ).all<{ id: string; response: string; confidence: number; query_vector: string }>()

  let best: SemanticCacheHit | null = null
  let bestId: string | null = null

  for (const row of rows.results) {
    let cachedVector: number[]
    try {
      cachedVector = JSON.parse(row.query_vector) as number[]
    } catch {
      continue
    }

    const similarity = cosineSimilarity(queryVector, cachedVector)
    if (similarity < threshold) continue
    if (!best || similarity > best.similarity) {
      best = {
        response: row.response,
        confidence: row.confidence ?? 0,
        similarity,
      }
      bestId = row.id
    }
  }

  if (bestId) {
    await DB.prepare(
      'UPDATE semantic_cache SET hit_count = hit_count + 1, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(bestId).run().catch(() => {})
  }

  return best
}

export async function storeSemanticCache(query: string, response: string, confidence: number): Promise<void> {
  const { DB } = env as unknown as CacheEnv
  const queryVector = await embedQuery(query)
  const id = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(query))
  const cacheId = Array.from(new Uint8Array(id)).map(byte => byte.toString(16).padStart(2, '0')).join('').slice(0, 32)
  await DB.prepare(
    `INSERT INTO semantic_cache (id, query, response, query_vector, confidence, hit_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       response = excluded.response,
       query_vector = excluded.query_vector,
       confidence = excluded.confidence,
       updated_at = datetime('now')`
  )
    .bind(cacheId, query, response, JSON.stringify(queryVector), confidence)
    .run()
}
