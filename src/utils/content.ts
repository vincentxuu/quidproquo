import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export function isPublishedAt(date: Date, now = new Date()): boolean {
  return date.getTime() <= now.getTime();
}

export function isPublishedPostData(
  data: Pick<Post['data'], 'date' | 'draft'>,
  now = new Date()
): boolean {
  return !data.draft && isPublishedAt(data.date, now);
}

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
