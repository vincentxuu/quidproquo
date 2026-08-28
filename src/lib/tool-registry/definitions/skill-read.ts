import { defineSyscall } from '../../agent/tools/define'
import { getEnv } from '../../config/env'

export interface SkillReadInput {
  name: string
}

export const skillReadSyscall = defineSyscall<SkillReadInput, { name: string; description: string; content: string } | null>({
  name: 'skill.read',
  description: 'Read a project skill (SKILL.md) by name. Returns frontmatter + body.',
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
      const env = getEnv() as unknown as { DB?: D1Database }
      if (!env.DB) return { name, description: `skill ${name}`, content: `# ${name}\nstub (no DB)` }
      const row = await env.DB.prepare('SELECT description, content FROM user_skills WHERE name = ?')
        .bind(name)
        .first<{ description: string; content: string }>()
      if (!row) return null
      return { name, description: row.description, content: row.content }
    } catch {
      return { name, description: `skill ${name}`, content: `# ${name}\nstub` }
    }
  },
})
