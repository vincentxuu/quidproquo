import { defineSyscall } from '../../agent/tools/define'
import { getEnv } from '../../config/env'

export interface SkillListFilesInput {
  skill: string
}

export interface SkillReadFileInput {
  skill: string
  path: string
}

interface FileRow {
  path: string
  blob_key: string
  size_bytes: number | null
}

export const skillListFilesSyscall = defineSyscall<SkillListFilesInput, { files: { path: string; size: number | null }[] }>({
  name: 'skill.list_files',
  description: 'List attached files for a skill (scripts, templates, references).',
  inputSchema: {
    type: 'object',
    required: ['skill'],
    properties: { skill: { type: 'string' } },
  },
  outputSchema: {
    type: 'object',
    properties: { files: { type: 'array', items: { type: 'object' } } },
  },
  async handler(_ctx, input) {
    const env = getEnv() as unknown as { DB?: D1Database }
    if (!env.DB) return { files: [] }

    const rows = await env.DB.prepare(`
      SELECT sf.path, sf.size_bytes
      FROM skill_file sf
      JOIN skill_version sv ON sv.id = sf.version_id
      JOIN skill s ON s.latest_version_id = sv.id
      WHERE s.slug = ?
    `).bind(input.skill).all<{ path: string; size_bytes: number | null }>()

    return { files: (rows.results ?? []).map(r => ({ path: r.path, size: r.size_bytes })) }
  },
})

export const skillReadFileSyscall = defineSyscall<SkillReadFileInput, { content: string } | null>({
  name: 'skill.read_file',
  description: 'Read an attached file from a skill by relative path. Returns text content.',
  inputSchema: {
    type: 'object',
    required: ['skill', 'path'],
    properties: {
      skill: { type: 'string' },
      path: { type: 'string' },
    },
  },
  outputSchema: {
    type: 'object',
    properties: { content: { type: 'string' } },
  },
  async handler(_ctx, input) {
    const env = getEnv() as unknown as { DB?: D1Database; R2_AGENT_ARTIFACT?: R2Bucket }
    if (!env.DB) return null

    const row = await env.DB.prepare(`
      SELECT sf.blob_key
      FROM skill_file sf
      JOIN skill_version sv ON sv.id = sf.version_id
      JOIN skill s ON s.latest_version_id = sv.id
      WHERE s.slug = ? AND sf.path = ?
    `).bind(input.skill, input.path).first<FileRow>()

    if (!row) return null
    if (!env.R2_AGENT_ARTIFACT) return null

    const obj = await env.R2_AGENT_ARTIFACT.get(row.blob_key)
    if (!obj) return null

    return { content: await obj.text() }
  },
})
