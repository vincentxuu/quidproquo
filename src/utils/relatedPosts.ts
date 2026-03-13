// src/utils/relatedPosts.ts
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

/**
 * Returns up to `max` posts related to the given post by tag overlap.
 * Sorted by tag overlap count (desc), then date (desc).
 * Returns empty array if post has no tags.
 */
export function getRelatedPosts(post: Post, allPosts: Post[], max = 3): Post[] {
  if (!post.data.tags || post.data.tags.length === 0) return [];
  const tagSet = new Set(post.data.tags);
  return allPosts
    .filter(p => p.id !== post.id && p.data.lang === post.data.lang)
    .map(p => ({
      post: p,
      overlap: p.data.tags.filter(t => tagSet.has(t)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, max)
    .map(({ post: p }) => p);
}
