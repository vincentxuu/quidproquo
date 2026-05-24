import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineSyscall } from '../../agent-os/tools/define'

export async function getPostDetailMarkdown(slug: string, db = (env as unknown as Env).DB): Promise<string> {
  const post = await db.prepare(
    'SELECT title, content, description, created_at FROM posts WHERE slug = ?'
  ).bind(slug).first<{ title: string; content: string; description: string; created_at: string }>()

  if (!post) return `Post "${slug}" not found.`
  return `# ${post.title}\n\n${post.content}`
}

export const getPostDetail = tool(
  async ({ slug }: { slug: string }): Promise<string> => getPostDetailMarkdown(slug),
  {
    name: 'get_post_detail',
    description: 'Retrieve the full content of a specific blog post by its slug. Use when you need the complete text of an article.',
    schema: z.object({
      slug: z.string().describe('Post slug, e.g. "ai/2024-01-15-rag-intro"'),
    }),
  }
)

export const postGetDetailSyscall = defineSyscall<{ slug: string }, { markdown: string; found: boolean }>({
  name: 'post.get-detail',
  description: 'Retrieve the full Markdown content of a specific blog post by slug.',
  inputSchema: {
    type: 'object',
    required: ['slug'],
    properties: {
      slug: { type: 'string', pattern: '^[a-z0-9-/]+$' },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['markdown', 'found'],
    properties: {
      markdown: { type: 'string' },
      found: { type: 'boolean' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  async handler(_ctx, input) {
    const markdown = await getPostDetailMarkdown(input.slug)
    return { markdown, found: !markdown.startsWith(`Post "${input.slug}" not found.`) }
  },
})
