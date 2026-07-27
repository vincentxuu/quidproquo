import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { site } from '../../site.config'
import { getPublishedPosts } from '../utils/posts'

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts()

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/posts/${post.id}`,
      author: site.author,
      categories: [...post.data.tags],
    })),
    customData: `<language>${site.lang}</language>`,
  })
}
