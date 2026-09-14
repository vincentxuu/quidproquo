import { defineSyscall } from '../../agent/tools/define'
import { getEnv } from '../../config/env'

export interface SkillReadInput {
  name: string
}

interface SkillVersionRow {
  name: string
  description: string
  body: string | null
  body_r2_key: string | null
  version_id: string
}

export const skillReadSyscall = defineSyscall<SkillReadInput, { name: string; description: string; content: string } | null>({
  name: 'skill.read',
  description: 'Read a skill by name. Returns the published version body.',
  inputSchema: {
    type: 'object',
    required: ['name'],
    properties: { name: { type: 'string' } },
  },
  outputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      content: { type: 'string' },
    },
  },
  async handler(_ctx, input) {
    const { name } = input
    try {
      const env = getEnv() as unknown as { DB?: D1Database; R2_AGENT_ARTIFACT?: R2Bucket }
      if (!env.DB) return { name, description: `skill ${name}`, content: `# ${name}\nstub (no DB)` }

      // Try new schema first (skill + skill_version)
      const row = await env.DB.prepare(`
        SELECT sv.name, sv.description, sv.body, sv.body_r2_key, sv.id AS version_id
        FROM skill s
        JOIN skill_version sv ON sv.id = s.latest_version_id
        WHERE s.slug = ? AND sv.status = 'published'
      `).bind(name).first<SkillVersionRow>()

      if (row) {
        let content = row.body ?? ''
        if (row.body_r2_key && env.R2_AGENT_ARTIFACT) {
          const obj = await env.R2_AGENT_ARTIFACT.get(row.body_r2_key)
          if (obj) content = await obj.text()
        }
        return { name: row.name, description: row.description, content }
      }

      // Fallback: legacy user_skills table
      const legacy = await env.DB.prepare('SELECT description, content, r2_key FROM user_skills WHERE name = ?')
        .bind(name)
        .first<{ description: string; content: string; r2_key: string | null }>()
      if (!legacy) return null

      if (legacy.r2_key && env.R2_AGENT_ARTIFACT) {
        const obj = await env.R2_AGENT_ARTIFACT.get(legacy.r2_key)
        if (obj) return { name, description: legacy.description, content: await obj.text() }
      }
      return { name, description: legacy.description, content: legacy.content }
    } catch {
      return { name, description: `skill ${name}`, content: `# ${name}\nstub` }
    }
  },
})
