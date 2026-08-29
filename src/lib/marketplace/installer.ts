import type { PluginManifest } from './types'
import { fetchSkillContent } from './fetcher'

export async function installPlugin(
  db: D1Database,
  manifest: PluginManifest,
  sourceUrl: string,
  sourceId: string,
): Promise<{ pluginId: string; skillCount: number; mcpCount: number }> {
  const pluginId = `plugin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const now = Math.floor(Date.now() / 1000)

  await db
    .prepare(
      `INSERT INTO plugins (id, name, description, version, author, source_url, skills, mcp_servers, installed_at, manifest_url, marketplace_source_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      pluginId,
      manifest.name,
      manifest.description ?? null,
      manifest.version,
      manifest.author ?? null,
      sourceUrl,
      JSON.stringify(manifest.skills?.map((s) => s.name) ?? []),
      JSON.stringify(manifest.mcp_servers?.map((s) => s.name) ?? []),
      now,
      `${sourceUrl}/manifest.json`,
      sourceId,
    )
    .run()

  let skillCount = 0
  if (manifest.skills) {
    for (const skill of manifest.skills) {
      const content = await fetchSkillContent(sourceUrl, skill.file).catch(() => '')
      const skillId = `skill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await db
        .prepare(
          `INSERT OR IGNORE INTO user_skills (id, name, description, content, source, version, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'imported', 1, ?, ?)`,
        )
        .bind(skillId, skill.name, skill.description ?? '', content, now, now)
        .run()
      skillCount++
    }
  }

  let mcpCount = 0
  if (manifest.mcp_servers) {
    for (const server of manifest.mcp_servers) {
      const serverId = `mcp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await db
        .prepare(
          `INSERT OR IGNORE INTO mcp_servers (id, name, description, type, url, command, enabled, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        )
        .bind(
          serverId,
          server.name,
          server.description ?? null,
          server.type,
          server.url ?? null,
          server.command ?? null,
          now,
        )
        .run()
      mcpCount++
    }
  }

  return { pluginId, skillCount, mcpCount }
}

export async function uninstallPlugin(db: D1Database, pluginId: string): Promise<void> {
  const plugin = await db.prepare('SELECT skills, mcp_servers FROM plugins WHERE id = ?').bind(pluginId).first()
  if (!plugin) return

  const skillNames: string[] = JSON.parse((plugin.skills as string) || '[]')
  const mcpNames: string[] = JSON.parse((plugin.mcp_servers as string) || '[]')

  for (const name of skillNames) {
    await db.prepare("DELETE FROM user_skills WHERE name = ? AND source = 'imported'").bind(name).run()
  }
  for (const name of mcpNames) {
    await db.prepare('DELETE FROM mcp_servers WHERE name = ?').bind(name).run()
  }
  await db.prepare('DELETE FROM plugins WHERE id = ?').bind(pluginId).run()
}
