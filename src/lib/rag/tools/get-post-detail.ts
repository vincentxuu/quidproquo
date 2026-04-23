import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { env } from 'cloudflare:workers'

interface Env { DB: D1Database }

export const getPostDetail = tool(
  async ({ slug }): Promise<string> => {
    const { DB } = env as unknown as Env
    const post = await DB.prepare(
      'SELECT title, content, description, created_at FROM posts WHERE slug = ?'
    ).bind(slug).first<{ title: string; content: string; description: string; created_at: string }>()

    if (!post) return `Post "${slug}" not found.`
    return `# ${post.title}\n\n${post.content}`
  },
  {
    name: 'get_post_detail',
    description: 'Retrieve the full content of a specific blog post by its slug. Use when you need the complete text of an article.',
    schema: z.object({
      slug: z.string().describe('Post slug, e.g. "ai/2024-01-15-rag-intro"'),
    }),
  }
)
