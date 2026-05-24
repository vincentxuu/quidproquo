import type { D1Database } from '@cloudflare/workers-types'

export async function getTableColumns(db: D1Database, tableName: string): Promise<Set<string>> {
  const result = await db.prepare(`PRAGMA table_info(${tableName})`).all<{ name: string }>()
  return new Set((result.results ?? []).map((column) => column.name))
}

export function columnExpr(columns: Set<string>, column: string, fallback: string, alias?: string): string {
  const expr = columns.has(column) ? column : fallback
  return alias ? `${expr} AS ${alias}` : expr
}
