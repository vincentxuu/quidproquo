import { describe, expect, it, vi } from 'vitest'
import { ChatGroq } from '@langchain/groq'
import { MAX_REASONING_CHARS, extractReasoningText, createModel } from './model'
import type { ChatModelResponse } from './model'

function makeResponse(extra: Record<string, unknown>, content: ChatModelResponse['content'] = ''): ChatModelResponse {
  return { content, ...extra } as unknown as ChatModelResponse
}

describe('extractReasoningText', () => {
  it('reads Groq reasoning_content from additional_kwargs', () => {
    const response = makeResponse({
      additional_kwargs: { reasoning_content: '先想想使用者要什麼…' },
    })
    expect(extractReasoningText(response)).toBe('先想想使用者要什麼…')
  })

  it('reads reasoning blocks from array content', () => {
    const response = makeResponse({}, [
      { type: 'reasoning', text: 'hypothesis one' },
      { type: 'text', text: 'final answer' },
    ])
    expect(extractReasoningText(response)).toBe('hypothesis one')
  })

  it('returns empty when no reasoning is present', () => {
    expect(extractReasoningText(makeResponse({}))).toBe('')
    expect(extractReasoningText(makeResponse({ additional_kwargs: {} }, 'answer'))).toBe('')
    expect(extractReasoningText(makeResponse({}, [{ type: 'text', text: 'answer' }]))).toBe('')
  })

  it('truncates overly long reasoning', () => {
    const long = 'x'.repeat(MAX_REASONING_CHARS + 100)
    const response = makeResponse({ additional_kwargs: { reasoning_content: long } })
    const result = extractReasoningText(response)
    expect(result.length).toBeLessThanOrEqual(MAX_REASONING_CHARS + 1)
    expect(result.endsWith('…')).toBe(true)
  })
})


describe('createModel cancellation', () => {
  it('forwards the caller abort signal through the adapter to the provider', async () => {
    const spy = vi.spyOn(ChatGroq.prototype, 'invoke').mockResolvedValue({ content: 'result' } as never)
    try {
      const controller = new AbortController()
      const model = createModel(4000, { apiKeys: { groq: 'test-key' } })
      await model.invoke(['hello'], { signal: controller.signal })
      expect(spy).toHaveBeenCalledWith(['hello'], { signal: controller.signal })
    } finally { spy.mockRestore() }
  })
})
