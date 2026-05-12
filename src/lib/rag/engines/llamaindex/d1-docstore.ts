import { env } from 'cloudflare:workers'

interface Env {
  DB: D1Database
}

export interface LlamaDocStoreRecord {
  chunk_id: string
  text: string
  metadata: Record<string, unknown>
}

interface D1DocStoreRow {
  chunk_id: string
  text: string
  metadata_json: string
}

function safeParseMetadata(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, unknown>
    }
  } catch {
    // keep going with empty metadata
  }
  return {}
}

export class LlamaIndexD1DocStore {
  async getMetadata(chunkIds: string[]): Promise<LlamaDocStoreRecord[]> {
    if (chunkIds.length === 0) return []

    const { DB } = env as unknown as Env
    const placeholders = chunkIds.map(() => '?').join(',')
    const rows = await Promise.all([
      DB.prepare(
        `SELECT
          pc.id AS chunk_id,
          COALESCE(pc.sentence_window, pc.content) AS text,
          json_object(
            'type', 'post',
            'slug', p.slug,
            'title', p.title,
            'lang', p.lang,
            'updatedAt', substr(p.created_at, 1, 10),
            'source', 'posts/' || p.slug
          ) AS metadata_json
        FROM post_chunks pc
        JOIN posts p ON p.id = pc.post_id
        WHERE pc.id IN (${placeholders})`
      ).bind(...chunkIds).all<D1DocStoreRow>(),

      DB.prepare(
        `SELECT
          dc.id AS chunk_id,
          COALESCE(dc.sentence_window, dc.content) AS text,
          json_object(
            'type', 'doc',
            'sourceUrl', dc.source_url,
            'sourceName', dc.source_name,
            'updatedAt', substr(dc.updated_at, 1, 10),
            'source', dc.source_name
          ) AS metadata_json
        FROM doc_chunks dc
        WHERE dc.id IN (${placeholders})`
      ).bind(...chunkIds).all<D1DocStoreRow>(),
    ])

    const byId = new Map<string, LlamaDocStoreRecord>()
    for (const row of [...rows[0].results, ...rows[1].results]) {
      const metadata = safeParseMetadata(row.metadata_json)
      byId.set(row.chunk_id, {
        chunk_id: row.chunk_id,
        text: row.text,
        metadata,
      })
    }

    const loaded = chunkIds
      .filter((id) => byId.has(id))
      .map((id) => {
        const row = byId.get(id)!
        return {
          chunk_id: row.chunk_id,
          text: row.text,
          metadata: row.metadata,
        }
      })

    return loaded
  }

  async putMetadata(records: LlamaDocStoreRecord[]): Promise<void> {
    if (records.length === 0) return

    // Keep API-compatible no-op for now to avoid hard dependency on a dedicated
    // LlamaIndex docstore table in the current Workers schema.
    return
  }
}
