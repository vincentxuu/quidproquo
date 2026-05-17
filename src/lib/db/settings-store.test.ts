import { describe, expect, it, vi } from 'vitest'
import {
  deleteSetting,
  ensureSettingsTable,
  getJsonSetting,
  getSetting,
  getSettings,
  listSettings,
  putSetting,
  setSetting,
} from './settings-store'

function makeDb(initial: Record<string, string> = {}) {
  const rows = new Map(Object.entries(initial).map(([key, value]) => [key, { value, updated_at: null as string | null }]))
  const db = {
    prepare: vi.fn((sql: string) => ({
      bind: (...args: unknown[]) => ({
        run: vi.fn(async () => {
          if (/INSERT INTO/.test(sql)) rows.set(String(args[0]), { value: String(args[1]), updated_at: 'now' })
          if (/DELETE FROM/.test(sql)) rows.delete(String(args[0]))
          return { success: true }
        }),
        first: vi.fn(async () => {
          const row = rows.get(String(args[0]))
          return row ? { value: row.value, updated_at: row.updated_at } : null
        }),
        all: vi.fn(async () => {
          const keys = args.map(String)
          return {
            results: [...rows.entries()]
              .filter(([key]) => keys.includes(key))
              .map(([key, row]) => ({ key, value: row.value, updated_at: row.updated_at })),
          }
        }),
      }),
      run: vi.fn(async () => ({ success: true })),
      all: vi.fn(async () => ({
        results: [...rows.entries()].map(([key, row]) => ({ key, value: row.value, updated_at: row.updated_at })),
      })),
    })),
  }
  return db as unknown as D1Database & { prepare: ReturnType<typeof vi.fn> }
}

describe('settings store', () => {
  it('ensures the settings table idempotently', async () => {
    const db = makeDb()
    await ensureSettingsTable(db)
    await ensureSettingsTable(db)
    await ensureSettingsTable(db)
    expect(db.prepare).toHaveBeenCalledTimes(3)
  })

  it('sets and gets raw string settings', async () => {
    const db = makeDb()
    await setSetting(db, 'k', 'v')
    await expect(getSetting(db, 'k')).resolves.toEqual({ value: 'v', updated_at: 'now' })
  })

  it('gets multiple settings in one D1 query', async () => {
    const db = makeDb({ k1: 'a', k2: 'b' })
    const result = await getSettings(db, ['k1', 'k2', 'k3'])
    expect(result).toEqual(new Map([['k1', 'a'], ['k2', 'b']]))
    expect(db.prepare).toHaveBeenCalledTimes(1)
  })

  it('deletes settings', async () => {
    const db = makeDb({ k: 'v' })
    await deleteSetting(db, 'k')
    await expect(getSetting(db, 'k')).resolves.toBeUndefined()
  })

  it('lists settings', async () => {
    const db = makeDb({ a: '1', b: '2' })
    await expect(listSettings(db)).resolves.toHaveLength(2)
  })

  it('stores JSON through compatibility helpers', async () => {
    const db = makeDb()
    await putSetting(db, 'json', { a: 1 })
    await expect(getJsonSetting<{ a: number }>(db, 'json')).resolves.toEqual({ a: 1 })
  })
})
