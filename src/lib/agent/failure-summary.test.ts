import { describe, expect, it } from 'vitest'
import { summarizeFailure } from './failure-summary'

// Samples are real run errors recorded in production.
describe('summarizeFailure', () => {
  it('reports a rate limit with the models settings link', () => {
    const s = summarizeFailure('Session failed: model error: [GoogleGenerativeAI Error]: Error fetching from https://x: [429 Too Many Requests] You exceeded your current quota')
    expect(s.category).toBe('model_quota')
    expect(s.action.href).toBe('/admin/settings/models')
  })

  it('classifies by the primary provider and notes that fallbacks failed too', () => {
    const s = summarizeFailure('Session failed: model error: all providers failed: gemini:gemini-4: [429 Too Many Requests] quota | nvidia:nvidia/nemotron-3-ultra-550b-a55b: 402 Add usage credits | openrouter:x: 401 User not found')
    expect(s.category).toBe('model_quota')
    expect(s.message).toContain('備援模型')
  })

  it('separates out-of-credit and invalid keys', () => {
    expect(summarizeFailure('model error: 402 Add usage credits').category).toBe('model_credit')
    expect(summarizeFailure('model error: 401 User not found').category).toBe('model_auth')
  })

  it('treats container problems as sandbox failures', () => {
    expect(summarizeFailure('Session failed: SandboxError: Container is starting. Please retry in a moment.').category).toBe('sandbox')
    expect(summarizeFailure('Session failed: workspace status failed: fatal: not a git repository').category).toBe('sandbox')
  })

  it('points push failures at the GitHub settings', () => {
    const s = summarizeFailure('Session failed: auto-save push failed: remote: Permission to a/b.git denied to app.')
    expect(s.category).toBe('github')
    expect(s.action.href).toBe('/admin/settings/github')
  })

  it('falls back to the first line, or says nothing was recorded', () => {
    expect(summarizeFailure('Session failed: something odd\nstack').message).toBe('something odd')
    expect(summarizeFailure(null).message).toBe('沒有記錄失敗原因')
    expect(summarizeFailure('Session complete').message).toBe('沒有記錄失敗原因')
  })
})
