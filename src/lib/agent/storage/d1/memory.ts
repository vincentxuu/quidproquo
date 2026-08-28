import type { MemoryBackend, MemoryRecord, MemorySearchOptions } from '../types'
import { encodeJson, memoryFromRow } from './utils'

export class D1MemoryBackend implements MemoryBackend {
  constructor(private readonly db: D1Database) {}

  async insert(item: MemoryRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO agent_memory_items (
        item_id, scope_key, memory_type, body_text, body_json, entities_json,
        vector_id, importance, written_at, expires_at, last_read_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      item.itemId,
      item.scopeKey,
      item.memoryType,
      item.bodyText,
      item.bodyJson === undefined ? null : encodeJson(item.bodyJson),
      item.entities === undefined ? null : encodeJson(item.entities),
      item.vectorId ?? null,
      item.importance ?? 0,
      item.writtenAt,
      item.expiresAt ?? null,
      item.lastReadAt ?? null,
    ).run()
  }

  async get(itemId: string): Promise<MemoryRecord | null> {
    const row = await this.db.prepare('SELECT * FROM agent_memory_items WHERE item_id = ?').bind(itemId).first<Record<string, unknown>>()
    return row ? memoryFromRow(row) : null
  }

  async searchKeyword(options: MemorySearchOptions): Promise<MemoryRecord[]> {
    const result = await this.db.prepare(`
      SELECT m.* FROM agent_memory_fts f
      JOIN agent_memory_items m ON m.rowid = f.rowid
      WHERE agent_memory_fts MATCH ? AND m.scope_key LIKE ? AND m.memory_type = ?
      ORDER BY rank
      LIMIT ?
    `).bind(options.query ?? '', options.scopeKey, options.memoryType, options.limit).all<Record<string, unknown>>()
    return (result.results ?? []).map(memoryFromRow)
  }

  async searchEntities(options: MemorySearchOptions): Promise<MemoryRecord[]> {
    const entities = options.entities ?? []
    if (entities.length === 0) return []
    const clauses = entities.map(() => 'entities_json LIKE ?').join(' OR ')
    const result = await this.db.prepare(`
      SELECT * FROM agent_memory_items
      WHERE scope_key LIKE ? AND memory_type = ? AND (${clauses})
      ORDER BY importance DESC, written_at DESC
      LIMIT ?
    `).bind(
      options.scopeKey,
      options.memoryType,
      ...entities.map((entity) => `%${entity}%`),
      options.limit,
    ).all<Record<string, unknown>>()
    return (result.results ?? []).map(memoryFromRow)
  }

  async touch(itemIds: string[], at: number): Promise<void> {
    if (itemIds.length === 0) return
    await this.db.batch(itemIds.map((itemId) => (
      this.db.prepare('UPDATE agent_memory_items SET last_read_at = ? WHERE item_id = ?').bind(at, itemId)
    )))
  }
}
