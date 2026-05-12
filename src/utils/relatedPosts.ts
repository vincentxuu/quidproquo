// src/utils/relatedPosts.ts
import { isPublishedPost, type Post } from './content';

/**
 * Returns up to `max` posts related to the given post using the Phase 1C mix:
 * 40% tag overlap + 30% category + 20% temporal proximity + 10% same series.
 */
export function getRelatedPosts(post: Post, allPosts: Post[], max = 3): Post[] {
  return allPosts
    .filter(p => p.id !== post.id && p.data.lang === post.data.lang && isPublishedPost(p))
    .map(p => ({ post: p, score: getRelatedPostScore(post, p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, max)
    .map(({ post: p }) => p);
}

export function getRelatedPostScore(post: Post, candidate: Post): number {
  const tags = post.data.tags ?? [];
  const candidateTags = candidate.data.tags ?? [];
  const tagScore = getJaccardScore(tags, candidateTags);
  const categoryScore = post.data.category === candidate.data.category ? 1 : 0;
  const recencyScore = getRecencyScore(post.data.date, candidate.data.date);
  const seriesScore = post.data.series?.name && post.data.series.name === candidate.data.series?.name ? 1 : 0;

  return tagScore * 0.4 + categoryScore * 0.3 + recencyScore * 0.2 + seriesScore * 0.1;
}

function getJaccardScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const left = new Set(a);
  const right = new Set(b);
  const union = new Set([...left, ...right]);
  let intersection = 0;

  for (const tag of left) {
    if (right.has(tag)) intersection += 1;
  }

  return union.size > 0 ? intersection / union.size : 0;
}

function getRecencyScore(a: Date, b: Date): number {
  const days = Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - days / 365);
}
