import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

// zh-TW post id: "category/YYYY-MM-DD-slug"
// en post id:    "category/YYYY-MM-DD-slug-en"
export function getTranslation(postId: string, allPosts: Post[]): Post | null {
  const counterpartId = postId.endsWith('-en')
    ? postId.slice(0, -3)
    : `${postId}-en`;
  return allPosts.find(p => p.id === counterpartId) ?? null;
}
