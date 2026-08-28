interface PostContext {
  type: 'post'
  title?: string
  category?: string
  date?: string
}

interface DocContext {
  type: 'doc' | 'custom'
  sourceName?: string
  sourceUrl?: string
}

type ChunkContext = PostContext | DocContext

export function buildContextualChunk(content: string, ctx: ChunkContext): string {
  let prefix = ''

  if (ctx.type === 'post') {
    const parts = ['This chunk is from a blog post']
    if (ctx.title) parts.push(`titled "${ctx.title}"`)
    if (ctx.category) parts.push(`in category "${ctx.category}"`)
    if (ctx.date) parts.push(`published ${ctx.date}`)
    prefix = parts.join(', ') + '. '
  } else {
    const parts = ['This chunk is from external documentation']
    if (ctx.sourceName) parts.push(`"${ctx.sourceName}"`)
    if (ctx.sourceUrl) parts.push(`(${ctx.sourceUrl})`)
    prefix = parts.join(' ') + '. '
  }

  return prefix + content
}
