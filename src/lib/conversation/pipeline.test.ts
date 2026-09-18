import { describe, expect, it, vi } from 'vitest'
import { initialState, type PipelineCallbacks } from '../retrieval/state'
import { resolveRagEngine } from './engines/registry'
import { runPipeline } from './pipeline'

vi.mock('./engines/registry', () => ({
  resolveRagEngine: vi.fn(),
}))

describe('conversation pipeline output', () => {
  it.each(['manual', 'langgraph'] as const)(
    'emits only the normalized final response for %s',
    async pipelineEngine => {
      const state = initialState()
      const onToken = vi.fn()
      const onStep = vi.fn()
      const onRelated = vi.fn()
      vi.mocked(resolveRagEngine).mockReturnValue({
        name: pipelineEngine,
        query: vi.fn(async (_input, callbacks) => {
          callbacks.onStep('Writer')
          callbacks.onToken('draft-1')
          callbacks.onToken('draft-2')
          callbacks.onRelated([{ title: 'Course', slug: 'course', description: 'Course article' }])
          return { ...state, final_response: 'accepted-final' }
        }),
      })

      await runPipeline({
        message: '有哪些課程文章',
        traceId: 'trace-1',
        config: { ...state.config, pipelineEngine },
      }, { onToken, onStep, onRelated } satisfies PipelineCallbacks)

      expect(onToken).toHaveBeenCalledTimes(1)
      expect(onToken).toHaveBeenCalledWith('accepted-final')
      expect(onStep).toHaveBeenCalledWith('Writer')
      expect(onRelated).toHaveBeenCalledTimes(1)
    }
  )

  it('replaces an empty final response with a retry-safe fallback message', async () => {
    const state = initialState()
    const onToken = vi.fn()
    vi.mocked(resolveRagEngine).mockReturnValue({
      name: 'manual',
      query: vi.fn(async () => ({ ...state, final_response: '' })),
    })

    await runPipeline({ message: 'test', traceId: 'trace-2', config: state.config }, {
      onToken,
      onStep: vi.fn(),
      onRelated: vi.fn(),
    })

    expect(onToken).toHaveBeenCalledTimes(1)
    expect(onToken).toHaveBeenCalledWith('抱歉，這次沒能產生回答，請再試一次或換個問法。')
  })

  it('answers off-topic early exits with a scope message instead of silence', async () => {
    const state = {
      ...initialState(),
      plan: { ...initialState().plan, intent: 'off-topic' as const },
    }
    const onToken = vi.fn()
    vi.mocked(resolveRagEngine).mockReturnValue({
      name: 'langgraph',
      query: vi.fn(async () => ({ ...state, final_response: '' })),
    })

    await runPipeline({ message: '今天天氣如何', traceId: 'trace-3', config: state.config }, {
      onToken,
      onStep: vi.fn(),
      onRelated: vi.fn(),
    })

    expect(onToken).toHaveBeenCalledTimes(1)
    expect(onToken).toHaveBeenCalledWith(
      '這個問題跟這個部落格的內容不太相關，我只能回答跟站內文章有關的問題。換個問法試試？'
    )
  })
})
