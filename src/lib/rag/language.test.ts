import { describe, expect, it } from 'vitest'
import { normalizeAnswerLanguage } from './language'

describe('normalizeAnswerLanguage', () => {
  it('converts Simplified Chinese into Taiwan Traditional Chinese', () => {
    expect(normalizeAnswerLanguage('这个软件使用鼠标操作，并缓存网络数据。', 'zh-TW'))
      .toBe('這個軟體使用滑鼠操作，並快取網路資料。')
  })

  it('leaves English responses unchanged', () => {
    const answer = 'This software uses a cache.'
    expect(normalizeAnswerLanguage(answer, 'en')).toBe(answer)
  })

  it('converts link labels but preserves source URLs', () => {
    const answer = '[查看文章](https://example.com/软件?查询=缓存)'
    expect(normalizeAnswerLanguage(answer, 'zh-TW'))
      .toBe('[檢視文章](https://example.com/软件?查询=缓存)')
  })

  it('preserves fenced and inline code', () => {
    const answer = '运行 `软件缓存`：\n```ts\nconst 缓存 = "数据"\n```\n这样更稳定。'
    expect(normalizeAnswerLanguage(answer, 'zh-TW')).toBe(
      '執行 `软件缓存`：\n```ts\nconst 缓存 = "数据"\n```\n這樣更穩定。'
    )
  })
})
