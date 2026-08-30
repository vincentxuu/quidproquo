import { describe, expect, it } from 'vitest'
import { ChatRequestPolicyError, resolveChatRequestPolicy } from './request-policy'

describe('chat request policy', () => {
  it('allows an authenticated admin evaluation to bypass semantic cache', () => {
    expect(resolveChatRequestPolicy({
      requestedTraceScope: 'eval',
      requestedCacheMode: 'bypass',
      isAdmin: true,
    })).toEqual({
      traceScope: 'eval',
      cacheMode: 'bypass',
      bypassSemanticCache: true,
    })
  })

  it('rejects a public cache-bypass request', () => {
    expect(() => resolveChatRequestPolicy({
      requestedTraceScope: 'eval',
      requestedCacheMode: 'bypass',
      isAdmin: false,
    })).toThrow(ChatRequestPolicyError)
  })

  it('does not let a public request impersonate an eval or admin trace', () => {
    expect(resolveChatRequestPolicy({ requestedTraceScope: 'eval', isAdmin: false }).traceScope).toBe('production')
    expect(resolveChatRequestPolicy({ requestedTraceScope: 'admin', isAdmin: false }).traceScope).toBe('production')
  })

  it('keeps normal admin chat cacheable unless bypass is explicit', () => {
    expect(resolveChatRequestPolicy({ isAdmin: true })).toEqual({
      traceScope: 'admin',
      cacheMode: 'default',
      bypassSemanticCache: false,
    })
  })
})
