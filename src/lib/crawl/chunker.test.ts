import { describe, expect, it } from 'vitest'
import { chunkMarkdown } from './chunker'
import { MAX_CHUNK_CHARS } from './config'

describe('chunkMarkdown oversized paragraph guard', () => {
  it('splits a giant table paragraph (no blank lines) into bounded chunks', () => {
    // 模擬無空行的長 markdown 表格：每一 row 很短但整體遠超 MAX_CHUNK_CHARS
    const table = ['| 路線 | 難度 | 備註 |', '| --- | --- | --- |']
      .concat(
        Array.from({ length: 200 }, (_, i) => `| Route ${i} | 5.10a | 多段花崗岩路線，資料來源於社群路線表。 |`),
      ).join('\n')
    const markdown = `## 路線表\n\n${table}`

    const chunks = chunkMarkdown(markdown, 'test-source', '測試')

    expect(chunks.length).toBeGreaterThan(1)
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeLessThanOrEqual(MAX_CHUNK_CHARS)
    }
    // 表格內容不應被丟掉
    expect(chunks.some(c => c.content.includes('Route 199'))).toBe(true)
  })

  it('hard-slices a single line longer than the limit', () => {
    const giantLine = 'x'.repeat(MAX_CHUNK_CHARS * 3)
    const markdown = `## 練習\n\n${giantLine}`

    const chunks = chunkMarkdown(markdown, 'test-source', '測試')

    expect(chunks.length).toBe(4)
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeLessThanOrEqual(MAX_CHUNK_CHARS)
    }
    // 標題單獨成 chunk，且全部內容保留
    expect(chunks[0].content).toBe('## 練習')
    expect(chunks.slice(1).map(c => c.content).join('')).toBe(giantLine)
  })

  it('keeps normal heading-based chunking ids stable for short sections', () => {
    const markdown = '## 第一節\n\n短內容。\n\n## 第二節\n\n另一段。'

    const chunks = chunkMarkdown(markdown, 'test-source', '測試')

    expect(chunks.map(c => c.chunk_index)).toEqual([0, 1])
  })
})
