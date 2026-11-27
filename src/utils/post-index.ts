// Built once per build (or once per rendering worker) from the already
// published, date-sorted post list. The post page used to scan all ~7,600
// posts in getStaticPaths-driven frontmatter for every one of those posts
// (related posts, series nav, prev/next, translation), which dominated build
// time. All indices preserve the input order so tie-breaks stay identical.

import type { Post } from './content';
import { getPostSeries, type SeriesMembership } from './seriesNav';
import { getSeriesSlug } from './series';

export interface PostIndex {
  byLang: Map<string, Post[]>;
  byId: Map<string, Post>;
  indexByIdByLang: Map<string, Map<string, number>>;
  bySeries: Map<string, Post[]>;
  membershipsByPostId: Map<string, SeriesMembership[]>;
  seriesSlugsByPostId: Map<string, string[]>;
}

export function createPostIndex(posts: Post[]): PostIndex {
  const byLang = new Map<string, Post[]>();
  const byId = new Map<string, Post>();
  const bySeries = new Map<string, Post[]>();
  const membershipsByPostId = new Map<string, SeriesMembership[]>();
  const seriesSlugsByPostId = new Map<string, string[]>();

  for (const post of posts) {
    const lang = post.data.lang;
    byId.set(post.id, post);

    let langPosts = byLang.get(lang);
    if (!langPosts) {
      langPosts = [];
      byLang.set(lang, langPosts);
    }
    langPosts.push(post);

    const memberships = getPostSeries(post);
    const slugs = memberships.map(m => getSeriesSlug(m.name));
    membershipsByPostId.set(post.id, memberships);
    seriesSlugsByPostId.set(post.id, slugs);
    for (const slug of slugs) {
      const key = `${lang}|${slug}`;
      let seriesPosts = bySeries.get(key);
      if (!seriesPosts) {
        seriesPosts = [];
        bySeries.set(key, seriesPosts);
      }
      seriesPosts.push(post);
    }
  }

  const indexByIdByLang = new Map<string, Map<string, number>>();
  for (const [lang, langPosts] of byLang) {
    indexByIdByLang.set(lang, new Map(langPosts.map((post, index) => [post.id, index])));
  }

  return {
    byLang,
    byId,
    indexByIdByLang,
    bySeries,
    membershipsByPostId,
    seriesSlugsByPostId,
  };
}
