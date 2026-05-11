// src/pages/rss.xml.ts
export const prerender = true;

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/content';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts('zh-TW');
  return rss({
    title: 'quidproquo',
    description: '技術、攀岩、衝浪、咖啡，以及其他一切。',
    site: context.site ?? 'https://quidproquo.cc',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.tldr ?? post.data.description,
      link: `/posts/${post.id}/`,
      customData: '<author>xiaoxu</author>',
    })),
    customData: '<language>zh-TW</language>',
  });
}
