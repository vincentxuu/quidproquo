import { describe, expect, it } from 'vitest'
import {
  applyStepEvent,
  pendingActivity,
  stepMeta,
  summarizeActivity,
  visibleSteps,
} from './steps-reducer'
import type { Step, StepEvent } from './types'

function run(events: StepEvent[]): Step[] {
  return events.reduce<Step[]>((acc, ev) => applyStepEvent(acc, ev), [])
}

/** 一次正常問答，伺服器實際會送的事件序列（含 manual 引擎 reasoning 先於 step 的情況）。 */
const NORMAL_RUN: StepEvent[] = [
  { id: 'Planner', kind: 'thinking', label: '分析問題', status: 'complete', reasoning: '使用者想要入門路線' },
  { id: 'Planner', kind: 'thinking', label: '分析問題', status: 'complete', duration_ms: 1200, output: { intent: 'recommendation', keywords: ['AI agent', '入門'] } },
  { id: 'Research', kind: 'tool', label: '檢索站內文章', status: 'complete', duration_ms: 900, input: { keywords: ['AI agent', '入門'] }, output: { count: 6 } },
  { id: 'Research', kind: 'tool', label: '檢索站內文章', status: 'complete', output: { count: 6, results: [{ title: 'A', url: '/posts/a' }] } },
  { id: 'Writer', kind: 'thinking', label: '整理答案', status: 'complete', duration_ms: 4000 },
  { id: 'Validation', kind: 'check', label: '驗證答案', status: 'complete', duration_ms: 10, output: { passed: true } },
  { id: 'Critic', kind: 'thinking', label: '評估品質', status: 'complete', duration_ms: 1500 },
  { id: 'Related', kind: 'tool', label: '推薦相關文章', status: 'complete', output: { count: 3, results: [] } },
]

describe('applyStepEvent', () => {
  it('upserts by id so each stage appears once', () => {
    const steps = run(NORMAL_RUN)
    expect(steps.map((s) => s.id)).toEqual(['Planner', 'Research', 'Writer', 'Validation', 'Critic', 'Related'])
  })

  it('merges partial updates (reasoning before step, results after step)', () => {
    const steps = run(NORMAL_RUN)
    const planner = steps[0]
    expect(planner.reasoning).toBe('使用者想要入門路線')
    expect(planner.duration_ms).toBe(1200)
    expect(planner.output?.keywords).toEqual(['AI agent', '入門'])
    const research = steps[1]
    expect(research.output?.count).toBe(6)
    expect(research.output?.results).toHaveLength(1)
    expect(research.input?.keywords).toEqual(['AI agent', '入門'])
  })

  it('fills label from the shared table when the event omits it', () => {
    const steps = run([{ id: 'Research:1', status: 'complete' }])
    expect(steps[0].label).toBe('檢索站內文章')
  })

  it('keeps retries as separate rows and counts unique posts across them', () => {
    const a = { title: 'A', url: '/posts/a' }
    const b = { title: 'B', url: '/posts/b' }
    const c = { title: 'C', url: '/posts/c' }
    const steps = run([
      { id: 'Research', kind: 'tool', status: 'complete', output: { count: 2, results: [a, b] } },
      { id: 'Research:1', kind: 'tool', status: 'complete', output: { count: 2, results: [b, c] } },
    ])
    expect(steps).toHaveLength(2)
    expect(summarizeActivity(steps)).toBe('檢索了 3 篇文章')
    // 沒有結果清單時退回加總
    const blind = run([
      { id: 'Research', kind: 'tool', status: 'complete', output: { count: 2 } },
      { id: 'Research:1', kind: 'tool', status: 'complete', output: { count: 5 } },
    ])
    expect(summarizeActivity(blind)).toBe('檢索了 7 篇文章')
  })
})

describe('pendingActivity', () => {
  it('starts with 思考中', () => {
    expect(pendingActivity([])).toEqual({ type: 'word', text: '思考中' })
  })

  it('shows the search tool line with keywords right after Planner completes', () => {
    const steps = run(NORMAL_RUN.slice(0, 2))
    expect(pendingActivity(steps)).toEqual({ type: 'tool', label: '檢索站內文章', keywords: ['AI agent', '入門'] })
  })

  it('moves to 整理中 after Research', () => {
    const steps = run(NORMAL_RUN.slice(0, 4))
    expect(pendingActivity(steps)).toEqual({ type: 'word', text: '整理中' })
  })
})

describe('summarizeActivity', () => {
  it('builds the past-tense line with counts', () => {
    expect(summarizeActivity(run(NORMAL_RUN))).toBe('檢索了 6 篇文章、推薦 3 篇延伸閱讀')
  })

  it('handles zero results', () => {
    const steps = run([{ id: 'Research', kind: 'tool', status: 'complete', output: { count: 0 } }])
    expect(summarizeActivity(steps)).toBe('沒有找到相關文章')
  })

  it('prefers fallback wording', () => {
    const steps = run([
      { id: 'Research', kind: 'tool', status: 'complete', output: { count: 1 } },
      { id: 'Fallback', kind: 'check', status: 'complete' },
    ])
    expect(summarizeActivity(steps)).toBe('找不到足夠來源，改用備援回答')
  })

  it('reports errors', () => {
    const steps = run([{ id: 'error', kind: 'check', label: '發生錯誤', status: 'error' }])
    expect(summarizeActivity(steps)).toBe('中途發生錯誤')
  })

  it('sums multiple searches and counts full reads (agent engine)', () => {
    const steps = run([
      { id: 'Research', kind: 'tool', status: 'complete', input: { query: 'RAG 成本' }, output: { count: 4 } },
      { id: 'Research:1', kind: 'tool', status: 'complete', input: { query: 'RAG cost cache' }, output: { count: 2 } },
      { id: 'ReadPost', kind: 'tool', status: 'complete', input: { slug: 'ai/rag-cost' }, output: { count: 1, results: [{ title: 'RAG 成本優化', url: '/posts/ai/rag-cost' }] } },
      { id: 'ReadPost:1', kind: 'tool', status: 'complete', input: { slug: 'ai/missing' }, output: { count: 0 } },
      { id: 'Related', kind: 'tool', status: 'complete', output: { count: 3 } },
    ])
    expect(summarizeActivity(steps)).toBe('檢索了 6 篇文章、讀了 1 篇全文、推薦 3 篇延伸閱讀')
    expect(summarizeActivity(steps, 'en')).toBe('Searched 6 posts, read 1 in full, suggested 3 related posts')
    expect(visibleSteps(steps).map((s) => s.id)).toEqual(['Research', 'Research:1', 'ReadPost', 'ReadPost:1', 'Related'])
  })

  it('speaks English when asked', () => {
    expect(summarizeActivity(run(NORMAL_RUN), 'en')).toBe('Searched 6 posts, suggested 3 related posts')
    expect(pendingActivity([], 'en')).toEqual({ type: 'word', text: 'Thinking' })
    expect(pendingActivity(run(NORMAL_RUN.slice(0, 2)), 'en')).toEqual({ type: 'tool', label: 'Search posts', keywords: ['AI agent', '入門'] })
    expect(stepMeta(run(NORMAL_RUN)[0], 'en')).toBe('Thought for 1.2s')
  })

  it('returns empty when there is nothing worth saying', () => {
    const steps = run([{ id: 'Planner', kind: 'thinking', status: 'complete' }])
    expect(summarizeActivity(steps)).toBe('')
  })
})

describe('visibleSteps / stepMeta', () => {
  it('hides internal checks and reasoning-less thinking', () => {
    const steps = run(NORMAL_RUN)
    expect(visibleSteps(steps).map((s) => s.id)).toEqual(['Planner', 'Research', 'Related'])
  })

  it('formats meta per kind', () => {
    const steps = run(NORMAL_RUN)
    expect(stepMeta(steps[0])).toBe('思考 1.2 秒')
    expect(stepMeta(steps[1])).toBe('6 篇')
    expect(stepMeta(steps[3])).toBe('')
  })
})
