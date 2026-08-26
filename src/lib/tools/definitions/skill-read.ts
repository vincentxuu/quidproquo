import { defineSyscall } from '../../agent-os/tools/define'

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
  async handler(ctx, input) {
    // ctx.backends is not typed here; fall back to D1 via env injection — keep minimal for now
    // Real impl will query D1 user_skills in handler via syscall context
    const { name } = input
    // stub: frontend will seed via build-time glob; runtime lookup placeholder
    void ctx
    return { name, description: `skill ${name}`, content: `# ${name}\nstub` }
  },
})
