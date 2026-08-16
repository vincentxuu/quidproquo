export const prerender = true;

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getDailyPosts } from '../../utils/content';

export async function GET(context: APIContext) {
  const posts = await getDailyPosts('zh-TW');
  return rss({
    title: 'quidproquo — Daily Digest',
    description: 'AI Agent 生態系每日觀測：論文、開源、模型、安全、框架、工具、資金、定價。',
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
