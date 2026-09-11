const TABLE = 'admin_settings'

export interface SettingRow {
  key: string
  value: string
  updated_at: string | null
}

function isMissingTable(error: unknown): boolean {
  return error instanceof Error && /no such table|does not exist/i.test(error.message)
}

export async function ensureSettingsTable(db: D1Database): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run()
}

export async function getSetting(
  db: D1Database,
  key: string,
): Promise<{ value: string; updated_at: string | null } | undefined> {
  try {
    const row = await db.prepare(`SELECT value, updated_at FROM ${TABLE} WHERE key = ?`)
      .bind(key)
      .first<{ value: string; updated_at: string | null }>()
    return row ?? undefined
  } catch (error) {
    if (isMissingTable(error)) return undefined
    throw error
  }
}

export async function setSetting(
  db: D1Database,
  key: string,
  value: string,
): Promise<void> {
  await ensureSettingsTable(db)
  await db.prepare(`
    INSERT INTO ${TABLE} (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).bind(key, value).run()
}

export async function getSettings(
  db: D1Database,
  keys: readonly string[],
): Promise<Map<string, string>> {
  const rows = await getSettingRows(db, keys)
  return new Map(rows.map((row) => [row.key, row.value]))
}

export async function getSettingRows(
  db: D1Database,
  keys: readonly string[],
): Promise<SettingRow[]> {
  if (keys.length === 0) return []
  try {
    const placeholders = keys.map(() => '?').join(', ')
    const rows = await db.prepare(`SELECT key, value, updated_at FROM ${TABLE} WHERE key IN (${placeholders})`)
      .bind(...keys)
      .all<SettingRow>()
    return rows.results ?? []
  } catch (error) {
    if (isMissingTable(error)) return []
    throw error
  }
}

export async function deleteSetting(
  db: D1Database,
  key: string,
): Promise<void> {
  await db.prepare(`DELETE FROM ${TABLE} WHERE key = ?`).bind(key).run()
}

export async function listSettings(
  db: D1Database,
  prefix?: string,
): Promise<SettingRow[]> {
  try {
    const sql = prefix
      ? `SELECT key, value, updated_at FROM ${TABLE} WHERE key LIKE ? ORDER BY key`
      : `SELECT key, value, updated_at FROM ${TABLE} ORDER BY key`
    const statement = db.prepare(sql)
    const rows = prefix
      ? await statement.bind(`${prefix}%`).all<SettingRow>()
      : await statement.all<SettingRow>()
    return rows.results ?? []
  } catch (error) {
    if (isMissingTable(error)) return []
    throw error
  }
}

export async function putSetting<T>(
  db: D1Database,
  key: string,
  value: T,
): Promise<void> {
  await setSetting(db, key, JSON.stringify(value))
}

export async function getJsonSetting<T>(
  db: D1Database,
  key: string,
): Promise<T | undefined> {
  const row = await getSetting(db, key)
  if (!row) return undefined
  return JSON.parse(row.value) as T
}
