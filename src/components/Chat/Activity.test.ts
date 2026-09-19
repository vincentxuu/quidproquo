import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ActivityLine } from './Activity'
import type { Step } from './types'

const DONE: Step[] = [
  { id: 'Planner', kind: 'thinking', label: '分析問題', status: 'complete', duration_ms: 1200, reasoning: '想要入門路線', output: { keywords: ['AI agent', '入門'] } },
  { id: 'Research', kind: 'tool', label: '檢索站內文章', status: 'complete', input: { keywords: ['AI agent', '入門'] }, output: { count: 6, results: [] } },
  { id: 'Validation', kind: 'check', label: '驗證答案', status: 'complete', output: { passed: true } },
  { id: 'Related', kind: 'tool', label: '推薦相關文章', status: 'complete', output: { count: 3, results: [] } },
]

describe('ActivityLine', () => {
  it('shows the original thinking indicator before any step', () => {
    const html = renderToStaticMarkup(createElement(ActivityLine, { steps: [], streaming: true, hasContent: false }))
    expect(html).toContain('chat-thinking-orbit')
    expect(html).toContain('思考中')
  })

  it('switches to 檢索中 with keywords once Planner is done', () => {
    const html = renderToStaticMarkup(createElement(ActivityLine, { steps: DONE.slice(0, 1), streaming: true, hasContent: false }))
    expect(html).toContain('檢索中')
    expect(html).toContain('「AI agent、入門」')
  })

  it('collapses to a single past-tense line when done', () => {
    const html = renderToStaticMarkup(createElement(ActivityLine, { steps: DONE, streaming: false, hasContent: true }))
    expect(html).toContain('檢索了 6 篇文章、推薦 3 篇延伸閱讀')
    expect(html).toContain('aria-expanded="false"')
    expect(html).not.toContain('chat-activity-list')
    expect(html).not.toContain('驗證答案')
  })

  it('renders nothing when there is nothing to report', () => {
    const html = renderToStaticMarkup(createElement(ActivityLine, { steps: [], streaming: false, hasContent: true }))
    expect(html).toBe('')
  })
})
