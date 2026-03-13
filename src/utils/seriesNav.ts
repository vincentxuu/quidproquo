// src/utils/seriesNav.ts
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export interface SeriesNav {
  name: string;
  current: number;
  total: number;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

/**
 * Returns series navigation data if the post belongs to a series.
 * Returns undefined if post has no series frontmatter.
 */
export function getSeriesNav(post: Post, allPosts: Post[]): SeriesNav | undefined {
  if (!post.data.series) return undefined;
  const { name, order } = post.data.series;
  const seriesPosts = allPosts
    .filter(p => p.data.series?.name === name)
    .sort((a, b) => a.data.series!.order - b.data.series!.order);
  const total = seriesPosts.length;
  const prevPost = seriesPosts.find(p => p.data.series!.order === order - 1);
  const nextPost = seriesPosts.find(p => p.data.series!.order === order + 1);
  return {
    name,
    current: order,
    total,
    prev: prevPost ? { slug: prevPost.id, title: prevPost.data.title } : undefined,
    next: nextPost ? { slug: nextPost.id, title: nextPost.data.title } : undefined,
  };
}
