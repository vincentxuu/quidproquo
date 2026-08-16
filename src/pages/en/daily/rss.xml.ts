export const prerender = true;

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getDailyPosts } from '../../../utils/content';

export async function GET(context: APIContext) {
  const posts = await getDailyPosts('en');
  return rss({
    title: 'quidproquo — Daily Digest',
    description: 'Daily AI Agent ecosystem watch: papers, open source, models, security, frameworks, tools, funding, pricing.',
    site: context.site ?? 'https://quidproquo.cc',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.tldr ?? post.data.description,
      link: `/posts/${post.id}/`,
      customData: '<author>xiaoxu</author>',
    })),
    customData: '<language>en</language>',
  });
}
