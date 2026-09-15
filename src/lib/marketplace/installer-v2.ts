import type { LoadedPlugin } from './types'
import { createHash } from './hash'

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export interface InstallResult {
  pluginVersionId: string
  skillCount: number
  mcpServerCount: number
  enablementCount: number
}

export async function installAgentPlugin(
  db: D1Database,
  r2: R2Bucket | undefined,
  plugin: LoadedPlugin,
  subjectType: string,
  subjectId: string,
): Promise<InstallResult> {
  const now = Math.floor(Date.now() / 1000)
  const pluginId = `plugin_${plugin.manifest.name}`
  const pluginVersionId = genId('pluginver')

  // 1. Plugin version record
  await db.prepare(`
    INSERT OR REPLACE INTO plugin_version (id, plugin_id, version, manifest, source_type, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    pluginVersionId,
    pluginId,
    1,
    JSON.stringify(plugin.manifest),
    plugin.sourcePath.startsWith('http') ? 'registry' : 'local',
    now,
  ).run()

  // 2. Plugin install record
  const installId = genId('install')
  await db.prepare(`
    INSERT INTO plugin_install (id, subject_type, subject_id, plugin_version_id, installed_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(installId, subjectType, subjectId, pluginVersionId, now).run()

  let skillCount = 0
  let mcpServerCount = 0
  let enablementCount = 0

  // 3. Install skills → skill + skill_version + skill_file + enablement
  for (const loadedSkill of plugin.skills) {
    const skillId = genId('skill')
    const versionId = genId('skillver')
    const contentHash = await createHash(loadedSkill.content)

    // Write body to R2 if available
    let bodyR2Key: string | null = null
    if (r2) {
      bodyR2Key = `skills/${contentHash}.md`
      await r2.put(bodyR2Key, loadedSkill.content)
    }

    await db.prepare(`
      INSERT OR IGNORE INTO skill (id, slug, display_name, scope, source, latest_version_id, created_at)
      VALUES (?, ?, ?, 'personal', 'marketplace', ?, ?)
    `).bind(skillId, loadedSkill.name, loadedSkill.name, versionId, now).run()

    // If skill already exists, get its id and update latest_version_id
    const existing = await db.prepare('SELECT id FROM skill WHERE slug = ?').bind(loadedSkill.name).first<{ id: string }>()
    const effectiveSkillId = existing?.id ?? skillId

    await db.prepare(`
      INSERT INTO skill_version (id, skill_id, version, name, description, body, body_r2_key, content_hash, status, published_at, created_at)
      VALUES (?, ?, 1, ?, ?, ?, ?, ?, 'published', ?, ?)
    `).bind(
      versionId, effectiveSkillId,
      loadedSkill.name, loadedSkill.description,
      bodyR2Key ? '' : loadedSkill.content,
      bodyR2Key,
      contentHash,
      now, now,
    ).run()

    await db.prepare('UPDATE skill SET latest_version_id = ? WHERE id = ?')
      .bind(versionId, effectiveSkillId).run()

    // Upload attached files to R2
    for (const file of loadedSkill.files) {
      const fileHash = await createHash(file.content)
      const blobKey = `skill-files/${fileHash}`
      if (r2) await r2.put(blobKey, file.content)
      const fileId = genId('sf')
      await db.prepare(`
        INSERT OR IGNORE INTO skill_file (id, version_id, path, blob_key, size_bytes, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(fileId, versionId, file.path, blobKey, file.content.length, now).run()
    }

    // Enablement
    await db.prepare(`
      INSERT OR REPLACE INTO enablement (subject_type, subject_id, component_type, component_id, source_plugin_id, enabled, created_at)
      VALUES (?, ?, 'skill', ?, ?, 1, ?)
    `).bind(subjectType, subjectId, effectiveSkillId, pluginId, now).run()

    skillCount++
    enablementCount++
  }

  // 4. Install MCP servers → mcp_server_v2 + enablement
  if (plugin.mcpConfig) {
    for (const [serverName, serverConfig] of Object.entries(plugin.mcpConfig.mcpServers)) {
      const serverId = genId('mcp')
      const qualifiedName = `${plugin.manifest.name}.${serverName}`

      await db.prepare(`
        INSERT OR IGNORE INTO mcp_server_v2 (id, name, transport, url, enabled, created_at)
        VALUES (?, ?, ?, ?, 1, ?)
      `).bind(
        serverId,
        qualifiedName,
        serverConfig.type,
        serverConfig.url ?? null,
        now,
      ).run()

      const existing = await db.prepare('SELECT id FROM mcp_server_v2 WHERE name = ?').bind(qualifiedName).first<{ id: string }>()
      const effectiveServerId = existing?.id ?? serverId

      await db.prepare(`
        INSERT OR REPLACE INTO enablement (subject_type, subject_id, component_type, component_id, source_plugin_id, enabled, created_at)
        VALUES (?, ?, 'tool', ?, ?, 1, ?)
      `).bind(subjectType, subjectId, effectiveServerId, pluginId, now).run()

      mcpServerCount++
      enablementCount++
    }
  }

  return { pluginVersionId, skillCount, mcpServerCount, enablementCount }
}

export async function uninstallAgentPlugin(
  db: D1Database,
  pluginId: string,
  subjectType: string,
  subjectId: string,
): Promise<void> {
  // Remove all enablements sourced from this plugin
  await db.prepare(`
    DELETE FROM enablement
    WHERE subject_type = ? AND subject_id = ? AND source_plugin_id = ?
  `).bind(subjectType, subjectId, pluginId).run()

  // Remove install record
  await db.prepare(`
    DELETE FROM plugin_install
    WHERE subject_type = ? AND subject_id = ?
    AND plugin_version_id IN (SELECT id FROM plugin_version WHERE plugin_id = ?)
  `).bind(subjectType, subjectId, pluginId).run()
}
