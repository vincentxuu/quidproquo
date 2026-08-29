import { fetchManifest } from './fetcher'

export interface UpdateCheck {
  pluginId: string
  pluginName: string
  currentVersion: string
  latestVersion: string
  hasUpdate: boolean
}

export async function checkUpdates(db: D1Database): Promise<UpdateCheck[]> {
  const plugins = await db
    .prepare('SELECT id, name, version, source_url FROM plugins WHERE source_url IS NOT NULL')
    .all()

  const results: UpdateCheck[] = []

  for (const row of plugins.results) {
    const sourceUrl = row.source_url as string
    const currentVersion = (row.version as string) || '0.0.0'
    try {
      const manifest = await fetchManifest(sourceUrl)
      const hasUpdate = manifest.version !== currentVersion
      if (hasUpdate) {
        await db
          .prepare('UPDATE plugins SET update_available = 1, last_checked_at = ? WHERE id = ?')
          .bind(Math.floor(Date.now() / 1000), row.id as string)
          .run()
      } else {
        await db
          .prepare('UPDATE plugins SET update_available = 0, last_checked_at = ? WHERE id = ?')
          .bind(Math.floor(Date.now() / 1000), row.id as string)
          .run()
      }
      results.push({
        pluginId: row.id as string,
        pluginName: (row.name as string) || manifest.name,
        currentVersion,
        latestVersion: manifest.version,
        hasUpdate,
      })
    } catch {
      results.push({
        pluginId: row.id as string,
        pluginName: (row.name as string) || 'unknown',
        currentVersion,
        latestVersion: 'unknown',
        hasUpdate: false,
      })
    }
  }

  return results
}
