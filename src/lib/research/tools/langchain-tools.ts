import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { searchBlogPosts } from '../../rag/tools/search-posts'
import { searchDocs } from '../../rag/tools/search-docs'

export const searchBlogPostsTool = new DynamicStructuredTool({
  name: 'search_blog_posts',
  description: 'Search the blog for posts matching a query. Returns matching chunks with titles, slugs, and relevance scores.',
  schema: z.object({
    query: z.string().describe('Search query'),
  }),
  async func(input) {
    const results = await searchBlogPosts({ query: input.query })
    return JSON.stringify(results)
  },
})

export const searchDocsTool = new DynamicStructuredTool({
  name: 'search_docs',
  description: 'Search technical documentation (Cloudflare, Astro, Workers) for relevant content.',
  schema: z.object({
    query: z.string().describe('Search query'),
  }),
  async func(input) {
    const results = await searchDocs({ query: input.query })
    return JSON.stringify(results)
  },
})
