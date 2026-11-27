// src/utils/seriesNav.ts
import { isPublishedPost, type Post } from './content';
import { getSeriesSlug } from './series';
import type { PostIndex } from './post-index';

export interface SeriesMembership {
  name: string;
  order: number;
}

export interface SeriesNav {
  name: string;
  current: number;
  total: number;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

/**
 * Every series this post belongs to: the primary one first, then any extras.
 * Frontmatter keeps them in two fields so the card badge has an unambiguous
 * primary, but for navigation and listings they rank equally.
 */
export function getPostSeries(post: Post): SeriesMembership[] {
  const memberships: SeriesMembership[] = [];
  if (post.data.series) memberships.push(post.data.series);
  for (const extra of post.data.additionalSeries ?? []) {
    if (!memberships.some(m => m.name === extra.name)) memberships.push(extra);
  }
  return memberships;
}

function navFor(post: Post, allPosts: Post[], membership: SeriesMembership, index?: PostIndex): SeriesNav {
  const { name, order } = membership;
  // 依 slug 比對：同一個系列在 frontmatter 可能寫成中文或英文名稱。
  const slug = getSeriesSlug(name);
  const inSeries = (m: SeriesMembership) => getSeriesSlug(m.name) === slug;
  const candidates = index
    ? (index.bySeries.get(`${post.data.lang}|${slug}`) ?? []).filter(p => isPublishedPost(p))
    : allPosts.filter(p => isPublishedPost(p) && p.data.lang === post.data.lang
      && getPostSeries(p).some(inSeries));
  const seriesPosts = candidates
    .map(p => {
      const memberships = index?.membershipsByPostId.get(p.id) ?? getPostSeries(p);
      return { post: p, order: memberships.find(inSeries)!.order };
    })
    .sort((a, b) => a.order - b.order);
  const prevPost = seriesPosts.find(p => p.order === order - 1)?.post;
  const nextPost = seriesPosts.find(p => p.order === order + 1)?.post;
  return {
    name,
    current: order,
    total: seriesPosts.length,
    prev: prevPost ? { slug: prevPost.id, title: prevPost.data.title } : undefined,
    next: nextPost ? { slug: nextPost.id, title: nextPost.data.title } : undefined,
  };
}

/**
 * Navigation data for each series the post belongs to. Empty when it belongs to none.
 */
export function getSeriesNavs(post: Post, allPosts: Post[], index?: PostIndex): SeriesNav[] {
  const memberships = index?.membershipsByPostId.get(post.id) ?? getPostSeries(post);
  return memberships.map(membership => navFor(post, allPosts, membership, index));
}

/**
 * Returns series navigation data if the post belongs to a series.
 * Returns undefined if post has no series frontmatter.
 */
export function getSeriesNav(post: Post, allPosts: Post[]): SeriesNav | undefined {
  return getSeriesNavs(post, allPosts)[0];
}
