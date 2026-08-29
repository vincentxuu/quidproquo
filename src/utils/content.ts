import { getCollection, type CollectionEntry } from 'astro:content';
export { isPublishedAt, isPublishedPostData } from './publishing';
import { isPublishedAt, isPublishedPostData } from './publishing';

export type Post = CollectionEntry<'posts'>;

export function isPublishedPost(post: Post, now = new Date()): boolean {
  return isPublishedPostData(post.data, now);
}

export function sortPostsByDateDesc(posts: Post[]): Post[] {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function sortPostsByPinnedAndDateDesc(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export async function getPublishedPosts(lang?: Post['data']['lang'], now = new Date()): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    isPublishedPostData(data, now) && (!lang || data.lang === lang)
  );
  return sortPostsByDateDesc(posts);
}

export async function getDailyPosts(lang?: Post['data']['lang'], now = new Date()): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    isPublishedPostData(data, now) && data.category === 'daily' && (!lang || data.lang === lang)
  );
  return sortPostsByDateDesc(posts);
}

export async function getNonDailyPublishedPosts(lang?: Post['data']['lang'], now = new Date()): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    isPublishedPostData(data, now) && data.category !== 'daily' && (!lang || data.lang === lang)
  );
  return sortPostsByDateDesc(posts);
}
