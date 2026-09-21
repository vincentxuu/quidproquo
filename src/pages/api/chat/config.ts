export const prerender = false

import type { APIRoute } from 'astro'
import { loadRagSettings } from '@/lib/retrieval/settings'

// 文章頁是 prerender 的靜態頁，渲染時讀不到 D1，所以 chat widget 在第一次展開時
// 才來問有哪些前端功能開著。只回布林值，不外洩其他 RAG 設定。
export const GET: APIRoute = async () => {
  try {
    const config = await loadRagSettings()
    return Response.json(
      { pageContext: config.pageContextEnabled },
      { headers: { 'Cache-Control': 'public, max-age=60' } },
    )
  } catch (error) {
    console.error('[chat/config] settings lookup failed', error)
    return Response.json({ pageContext: false }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
