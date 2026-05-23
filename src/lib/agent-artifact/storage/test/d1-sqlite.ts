/**
 * Minimal in-memory D1-compatible shim for unit tests.
 *
 * Reads migration SQL files (passed as relative paths from repo root), parses CREATE TABLE
 * statements to build a simple column schema, then handles INSERT OR REPLACE, INSERT OR IGNORE,
 * INSERT, UPDATE, SELECT *, and DELETE statements via Maps keyed by primary key.
 *
 * Only supports the subset of SQL actually used by the D1 backend classes.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type Row = Record<string, unknown>

interface TableStore {
  columns: string[]
  pkCol: string
  rows: Map<string, Row>
}

function parseTables(sql: string): Map<string, TableStore> {
  const tables = new Map<string, TableStore>()
  const tableRegex = /CREATE TABLE IF NOT EXISTS (\w+)\s*\(([^;]+?)\);/gs
  let match: RegExpExecArray | null
  while ((match = tableRegex.exec(sql)) !== null) {
    const name = match[1]
    const body = match[2]
    const lines = body.split('\n').map((l) => l.trim()).filter(Boolean)
    const columns: string[] = []
    let pkCol = 'id'
    for (const line of lines) {
      const colMatch = line.match(/^(\w+)\s+\w+/)
      if (!colMatch) continue
      const col = colMatch[1]
      if (col === 'PRIMARY' || col === 'UNIQUE' || col === 'CREATE' || col === 'FOREIGN') continue
      columns.push(col)
      if (/PRIMARY KEY/.test(line)) pkCol = col
    }
    tables.set(name, { columns, pkCol, rows: new Map() })
  }
  return tables
}

function colsToRow(cols: string[], values: unknown[]): Row {
  const row: Row = {}
  for (let i = 0; i < cols.length; i++) {
    row[cols[i]] = values[i] ?? null
  }
  return row
}

function matchRows(rows: Map<string, Row>, where: string, bindings: unknown[]): Row[] {
  // Very simple WHERE parser: supports `col = ?` (possibly AND-chained)
  const clauses = where.split(/\bAND\b/i).map((c) => c.trim())
  const conditions: Array<{ col: string; value: unknown }> = []
  let bindIndex = 0
  for (const clause of clauses) {
    const m = clause.match(/(\w+)\s*(?:IS\s+)?=\s*\?/i) || clause.match(/(\w+)\s+IS\s+\?/i)
    if (m) {
      conditions.push({ col: m[1], value: bindings[bindIndex++] })
    }
  }
  return [...rows.values()].filter((row) =>
    conditions.every((c) => {
      const val = row[c.col]
      // SQLite IS treats NULL == NULL
      if (c.value === null || c.value === undefined) return val === null || val === undefined
      return val === c.value
    }),
  )
}

function pkValue(row: Row, pkCol: string): string {
  return String(row[pkCol])
}

function makeStmt(
  tables: Map<string, TableStore>,
  sql: string,
): { bind: (...args: unknown[]) => { run(): Promise<unknown>; first<T = Row>(): Promise<T | null>; all<T = Row>(): Promise<{ results: T[] }> } } {
  const normalSql = sql.replace(/\s+/g, ' ').trim()

  return {
    bind(...bindings: unknown[]) {
      return {
        async run() {
          // INSERT OR REPLACE / INSERT OR IGNORE / INSERT
          const insertMatch = normalSql.match(/^INSERT(?:\s+OR\s+(IGNORE|REPLACE))?\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i)
          if (insertMatch) {
            const conflict = insertMatch[1]?.toUpperCase()
            const tableName = insertMatch[2]
            const colsRaw = insertMatch[3].split(',').map((c) => c.trim())
            const table = tables.get(tableName)
            if (!table) return { success: true }
            const row = colsToRow(colsRaw, bindings)
            const pk = pkValue(row, table.pkCol)
            if (conflict === 'IGNORE' && table.rows.has(pk)) return { success: true }
            if (conflict === 'REPLACE') {
              table.rows.set(pk, row)
            } else {
              table.rows.set(pk, row)
            }
            return { success: true }
          }

          // UPDATE
          const updateMatch = normalSql.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/i)
          if (updateMatch) {
            const tableName = updateMatch[1]
            const setClause = updateMatch[2]
            const whereClause = updateMatch[3]
            const table = tables.get(tableName)
            if (!table) return { success: true }

            const setCols: string[] = []
            let m: RegExpExecArray | null
            const setRe = /(\w+)\s*=\s*\?/g
            while ((m = setRe.exec(setClause)) !== null) setCols.push(m[1])

            const setCount = setCols.length
            const setValues = bindings.slice(0, setCount)
            const whereValues = bindings.slice(setCount)

            const matched = matchRows(table.rows, whereClause, whereValues)
            for (const row of matched) {
              const pk = pkValue(row, table.pkCol)
              const updated = { ...row }
              for (let i = 0; i < setCols.length; i++) updated[setCols[i]] = setValues[i]
              table.rows.set(pk, updated)
            }
            return { success: true }
          }

          // DELETE
          const deleteMatch = normalSql.match(/^DELETE FROM\s+(\w+)\s+WHERE\s+(.+)$/i)
          if (deleteMatch) {
            const tableName = deleteMatch[1]
            const whereClause = deleteMatch[2]
            const table = tables.get(tableName)
            if (!table) return { success: true }
            const matched = matchRows(table.rows, whereClause, bindings)
            for (const row of matched) table.rows.delete(pkValue(row, table.pkCol))
            return { success: true }
          }

          return { success: true }
        },

        async first<T = Row>(): Promise<T | null> {
          const selectMatch = normalSql.match(/^SELECT\s+.+?\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY.+)?(?:\s+LIMIT.+)?$/i)
          if (selectMatch) {
            const tableName = selectMatch[1]
            const whereClause = selectMatch[2]
            const table = tables.get(tableName)
            if (!table) return null
            const rows = whereClause ? matchRows(table.rows, whereClause, bindings) : [...table.rows.values()]
            return (rows[0] as T) ?? null
          }
          return null
        },

        async all<T = Row>(): Promise<{ results: T[] }> {
          const selectMatch = normalSql.match(/^SELECT\s+.+?\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(\w+)\s+(ASC|DESC))?(?:\s+LIMIT\s+(\d+))?$/i)
          if (selectMatch) {
            const tableName = selectMatch[1]
            const whereClause = selectMatch[2]
            const orderCol = selectMatch[3]
            const orderDir = selectMatch[4]?.toUpperCase()
            const limitN = selectMatch[5] ? Number(selectMatch[5]) : undefined
            const table = tables.get(tableName)
            if (!table) return { results: [] }
            let rows = whereClause ? matchRows(table.rows, whereClause, bindings) : [...table.rows.values()]
            if (orderCol) {
              rows = rows.sort((a, b) => {
                const av = a[orderCol]
                const bv = b[orderCol]
                if (typeof av === 'number' && typeof bv === 'number') {
                  return orderDir === 'DESC' ? bv - av : av - bv
                }
                return orderDir === 'DESC'
                  ? String(bv).localeCompare(String(av))
                  : String(av).localeCompare(String(bv))
              })
            }
            if (limitN !== undefined) rows = rows.slice(0, limitN)
            return { results: rows as T[] }
          }
          return { results: [] }
        },
      }
    },
  }
}

/**
 * Creates a D1Database-compatible shim backed by in-memory Maps, seeded by running the
 * provided migration SQL files (relative paths from the repository root).
 */
export function createTestD1(migrationPaths: string[]): D1Database {
  const tables = new Map<string, TableStore>()

  for (const filePath of migrationPaths) {
    const sql = readFileSync(resolve(filePath), 'utf8')
    for (const [name, store] of parseTables(sql)) {
      if (!tables.has(name)) tables.set(name, store)
    }
  }

  const db = {
    prepare(sql: string) {
      return makeStmt(tables, sql)
    },
    async batch(statements: ReturnType<typeof makeStmt>[]) {
      return Promise.all(statements.map((s) => (s as unknown as { run(): Promise<unknown> }).run()))
    },
    async exec(sql: string) {
      const stmts = sql.split(';').map((s) => s.trim()).filter(Boolean)
      for (const stmt of stmts) {
        await db.prepare(stmt).bind().run()
      }
      return { count: stmts.length, duration: 0 }
    },
  } as unknown as D1Database

  return db
}
