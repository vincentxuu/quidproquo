import { env } from 'cloudflare:workers'
import type { Env } from '../../config/env'
import type { SearchResult } from '../state'

export const PAGE_CHUNK_LIMIT = 4
// 保證候選的分數：高過弱檢索門檻，但不蓋過全站檢索裡真正精準命中的 chunk
const PAGE_CHUNK_SCORE = 0.85

const REFERS_TO_PAGE_ZH = /這篇|這一篇|本篇|本文|此文|這篇文章|這段|這一段|文中|文章裡|文章中|上面提到|上面寫|這裡提到|這裡說/
const REFERS_TO_PAGE_EN = /\b(this|the current|the above)\s+(post|article|page|piece|section|paragraph|part)\b|\bin the (post|article)\b|\bthis one\b/i

// 讀者的問題是不是在講「眼前這篇」。只有是的時候才偏置檢索，
// 全站型的問題（「有哪些 RAG 文章」）即使帶著文章脈絡也不受影響。
export function refersToPage(query: string): boolean {
  return REFERS_TO_PAGE_ZH.test(query) || REFERS_TO_PAGE_EN.test(query)
}

function tokenize(text: string): string[] {
  const words = (text.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []).map(token => token.toLowerCase())
  // 中文沒有空白分詞，整句會黏成一個 token；補上相鄰兩字的 bigram 才比得出重疊
  const bigrams = words.flatMap(word => (/\p{Script=Han}/u.test(word)
    ? Array.from({ length: Math.max(0, word.length - 1) }, (_, i) => word.slice(i, i + 2))
    : []))
  return [...words, ...bigrams]
}

type ChunkRow = { chunk_id: string; chunk_index: number; content: string }

const MIN_SUBSTANTIVE_LENGTH = 60

// 真實資料裡，文章開頭常是「🌏 English version」語言切換橫幅，章節之間也有只剩標題的段落
//（「## 五種主要格式」九個字）。這些當證據沒有內容，先濾掉。
export function isSubstantiveChunk(content: string): boolean {
  const text = content.trim()
  if (text.length < MIN_SUBSTANTIVE_LENGTH) return false
  return !/^>\s*🌏/u.test(text)
}

// 「這篇的重點」這種問題本身沒有可比對的詞，就照文章順序取開頭幾段；
// 有具體的詞（「文中的 HyDE 是什麼」）就取重疊最多的段落，並固定保留開頭第一段當脈絡。
export function selectPageChunks<T extends ChunkRow>(allRows: T[], query: string, limit = PAGE_CHUNK_LIMIT): T[] {
  const substantive = allRows.filter(row => isSubstantiveChunk(row.content))
  const rows = substantive.length > 0 ? substantive : allRows
  if (rows.length <= limit) return [...rows].sort((a, b) => a.chunk_index - b.chunk_index)
  const queryTokens = new Set(tokenize(query.replace(REFERS_TO_PAGE_ZH, ' ').replace(REFERS_TO_PAGE_EN, ' ')))
  const scored = rows.map(row => ({
    row,
    overlap: new Set(tokenize(row.content).filter(token => queryTokens.has(token))).size,
  }))
  const ordered = [...rows].sort((a, b) => a.chunk_index - b.chunk_index)
  if (scored.every(item => item.overlap === 0)) return ordered.slice(0, limit)

  const intro = ordered[0]
  const best = scored
    .filter(item => item.overlap > 0 && item.row !== intro)
    .sort((a, b) => b.overlap - a.overlap || a.row.chunk_index - b.row.chunk_index)
    .slice(0, limit - 1)
    .map(item => item.row)
  return [intro, ...best].sort((a, b) => a.chunk_index - b.chunk_index)
}

export async function fetchPageChunks(input: { slug: string; query: string; limit?: number }): Promise<SearchResult[]> {
  const { DB } = env as unknown as Env
  const { results } = await DB.prepare(
    `SELECT
      pc.id AS chunk_id,
      pc.chunk_index,
      COALESCE(pc.sentence_window, pc.content) AS content,
      p.slug,
      p.title,
      p.description,
      p.tldr,
      substr(p.created_at, 1, 10) AS date
    FROM post_chunks pc
    JOIN posts p ON p.id = pc.post_id
    WHERE p.slug = ?
    ORDER BY pc.chunk_index ASC
    LIMIT 200`
  ).bind(input.slug).all<ChunkRow & { slug: string; title: string; description: string | null; tldr: string | null; date: string }>()

  const rows = results ?? []
  const limit = input.limit ?? PAGE_CHUNK_LIMIT
  // 作者自己寫的 tldr／description 是「這篇的重點」最好的證據，有的話排第一，段落少取一段
  const overview = rows[0] ? buildOverview(rows[0]) : null
  const chunks = selectPageChunks(rows, input.query, overview ? limit - 1 : limit)

  return [...(overview ? [overview] : []), ...chunks].map(row => {
    const content = String(row.content ?? '')
    return {
      claim: content.split(/[.。]/)[0] ?? content.slice(0, 100),
      evidence_excerpt: content,
      source_url: `https://quidproquo.cc/posts/${row.slug}`,
      chunk_id: row.chunk_id,
      date: row.date,
      relevance_score: PAGE_CHUNK_SCORE,
      images: [],
      links: [],
      type: 'post' as const,
      slug: row.slug,
      title: row.title,
    }
  })
}

function buildOverview<T extends { slug: string; title: string; description: string | null; tldr: string | null }>(row: T): (T & ChunkRow) | null {
  const parts = [row.tldr, row.description].map(part => part?.trim()).filter((part): part is string => Boolean(part))
  const unique = parts.filter((part, index) => parts.indexOf(part) === index)
  if (unique.length === 0) return null
  return { ...row, chunk_id: `${row.slug}::overview`, chunk_index: -1, content: `${row.title}\n\n${unique.join('\n\n')}` }
}

// 排序、rerank、MMR 之後再把目前文章的段落提到最前面：writer 只取前 N 筆，
// 不置頂的話保證候選可能被擠到 N 之外，等於沒有偏置。其餘結果的相對順序不動。
export function pinPageResults(results: SearchResult[], slug: string, keep = PAGE_CHUNK_LIMIT): SearchResult[] {
  const fromPage = results.filter(result => result.slug === slug).slice(0, keep)
  if (fromPage.length === 0) return results
  const pinned = new Set(fromPage.map(result => result.chunk_id))
  return [...fromPage, ...results.filter(result => !pinned.has(result.chunk_id))]
}
