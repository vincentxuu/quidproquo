import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// ─────────────────────────────────────────────────────────────
//  文章的欄位規則。
//  只有五個欄位，其中兩個是必填。刻意保持簡單。
// ─────────────────────────────────────────────────────────────

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    /** 必填：文章標題 */
    title: z.string().min(1, '標題不能是空的'),

    /** 必填：發布日期，格式 YYYY-MM-DD */
    date: z.coerce.date(),

    /** 選填：一兩句話的摘要，會顯示在列表和搜尋結果 */
    description: z.string().optional(),

    /** 選填：標籤，例如 [咖啡, 旅行] */
    tags: z.array(z.string()).default([]),

    /** 選填：設成 true 就不會公開，可以放草稿 */
    draft: z.boolean().default(false),
  }),
})

export const collections = { posts }
