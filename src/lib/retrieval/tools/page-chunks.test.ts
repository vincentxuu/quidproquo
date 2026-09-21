import { describe, expect, it } from 'vitest'
import type { SearchResult } from '../state'
import { isSubstantiveChunk, pinPageResults, refersToPage, selectPageChunks } from './page-chunks'

// 補到超過實質內容門檻，模擬真實段落長度
const PAD = '。這一段補上足夠的說明文字，讓它的長度像真實文章裡的一個段落，而不是只剩一行標題或一個語言切換的橫幅連結'

function chunk(index: number, content: string, pad = true) {
  return { chunk_id: `c${index}`, chunk_index: index, content: pad ? content + PAD : content }
}

function result(chunkId: string, slug: string, score: number): SearchResult {
  return {
    claim: chunkId,
    evidence_excerpt: chunkId,
    source_url: `https://quidproquo.cc/posts/${slug}`,
    chunk_id: chunkId,
    date: '2026-09-01',
    relevance_score: score,
    images: [],
    links: [],
    type: 'post',
    slug,
    title: slug,
  }
}

describe('refersToPage', () => {
  it('detects questions about the post being read', () => {
    expect(refersToPage('這篇的重點是什麼？')).toBe(true)
    expect(refersToPage('文中的 HyDE 是什麼意思')).toBe(true)
    expect(refersToPage('What is the main point of this article?')).toBe(true)
    expect(refersToPage('Explain the section on rerankers in the post')).toBe(true)
  })

  it('leaves site-wide questions alone', () => {
    expect(refersToPage('有哪些 RAG 文章？')).toBe(false)
    expect(refersToPage('推薦我讀 PageIndex 的文章')).toBe(false)
    expect(refersToPage('Which posts cover LangGraph?')).toBe(false)
  })
})

describe('selectPageChunks', () => {
  const rows = [
    chunk(0, '本文介紹檢索增強生成的整體流程'),
    chunk(1, '第一步是切塊與建立索引'),
    chunk(2, 'HyDE 先讓模型寫一段假想答案再拿去檢索'),
    chunk(3, 'reranker 用 cross-encoder 重新排序候選'),
    chunk(4, '成本與延遲的取捨'),
    chunk(5, '結論與延伸閱讀'),
  ]

  it('takes the opening chunks in order when the question has nothing to match', () => {
    expect(selectPageChunks(rows, '這篇的重點是什麼？', 3).map(row => row.chunk_index)).toEqual([0, 1, 2])
  })

  it('prefers overlapping chunks but always keeps the intro', () => {
    expect(selectPageChunks(rows, '文中的 HyDE 是什麼', 3).map(row => row.chunk_index)).toEqual([0, 2])
  })

  it('matches Chinese terms without whitespace segmentation', () => {
    expect(selectPageChunks(rows, '這篇怎麼看成本取捨', 2).map(row => row.chunk_index)).toEqual([0, 4])
  })

  it('returns everything when the post is short', () => {
    expect(selectPageChunks(rows.slice(0, 2), '這篇的重點', 4)).toHaveLength(2)
  })
})

describe('substantive chunk filter', () => {
  it('drops language banners and bare headings seen in real posts', () => {
    expect(isSubstantiveChunk('> 🌏 [English version](/en/posts/ai/2026-09-03-table-serialization-rag-en) of this post is available for readers who prefer English')).toBe(false)
    expect(isSubstantiveChunk('## 五種主要格式')).toBe(false)
    expect(isSubstantiveChunk('RAG pipeline 處理表格時，格式選錯會讓 embedding 偏掉。' + PAD)).toBe(true)
  })

  it('skips them when picking the opening chunks', () => {
    const rows = [
      chunk(0, '> 🌏 [English version](/en/posts/ai/x-en)', false),
      chunk(1, '問題：格式選錯，embedding 就偏了'),
      chunk(2, '## 五種主要格式', false),
      chunk(3, 'Markdown Table 的優缺點'),
      chunk(4, 'JSON 序列化的優缺點'),
    ]
    expect(selectPageChunks(rows, '這篇的重點是什麼？', 2).map(row => row.chunk_index)).toEqual([1, 3])
  })

  it('falls back to whatever exists when nothing is substantive', () => {
    const rows = [chunk(0, '## 標題一', false), chunk(1, '## 標題二', false)]
    expect(selectPageChunks(rows, '這篇的重點', 4)).toHaveLength(2)
  })
})

describe('pinPageResults', () => {
  it('moves chunks of the current post to the front and keeps the rest in order', () => {
    const ordered = [result('a1', 'ai/other', 0.95), result('p1', 'ai/current', 0.85), result('b1', 'ai/third', 0.8), result('p2', 'ai/current', 0.85)]
    expect(pinPageResults(ordered, 'ai/current').map(item => item.chunk_id)).toEqual(['p1', 'p2', 'a1', 'b1'])
  })

  it('is a no-op when the current post is absent', () => {
    const ordered = [result('a1', 'ai/other', 0.9)]
    expect(pinPageResults(ordered, 'ai/current')).toBe(ordered)
  })
})
