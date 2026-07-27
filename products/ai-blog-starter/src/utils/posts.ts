import { getCollection, type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>

/**
 * 拿到所有「該公開」的文章，最新的排前面。
 * 會自動排除：草稿（draft: true）、還沒到發布日期的文章。
 *
 * 想排程發文的話，把日期填成未來的某一天就好，時間到重新建置就會出現。
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = Date.now()
  const posts = await getCollection('posts', ({ data }) => !data.draft)
  return posts
    .filter((p) => p.data.date.getTime() <= now)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

/** 拿到所有用過的標籤，依使用次數排序 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts()
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

/** 把日期格式化成 2026-01-31 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
