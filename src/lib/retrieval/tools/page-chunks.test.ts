import { describe, expect, it } from 'vitest'
import type { SearchResult } from '../state'
import { pinPageResults, refersToPage, selectPageChunks } from './page-chunks'

function chunk(index: number, content: string) {
  return { chunk_id: `c${index}`, chunk_index: index, content }
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
