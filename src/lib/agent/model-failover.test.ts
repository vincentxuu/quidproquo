import { describe, expect, it } from 'vitest'
import { classifyModelError, nextFailoverStep, routeFailureLabel } from './model-failover'

function httpError(status: number, message = `${status} error`): Error {
  return Object.assign(new Error(message), { status })
}

describe('classifyModelError', () => {
  it('treats quota, rate limit, unpaid and rejected keys as key errors', () => {
    expect(classifyModelError(httpError(401))).toBe('key')
    expect(classifyModelError(httpError(402))).toBe('key')
    expect(classifyModelError(httpError(429))).toBe('key')
    expect(classifyModelError(new Error('[429 Too Many Requests] You exceeded your current quota'))).toBe('key')
    expect(classifyModelError(new Error('Rate limit reached for requests'))).toBe('key')
    expect(classifyModelError(new Error('401 User not found / Unauthorized'))).toBe('key')
  })

  it('treats overload, timeouts and the free prompt cap as provider errors', () => {
    expect(classifyModelError(httpError(503))).toBe('provider')
    expect(classifyModelError(httpError(408))).toBe('provider')
    expect(classifyModelError(Object.assign(new Error('413'), { status: 413, code: 'free_prompt_too_large' }))).toBe('provider')
    expect(classifyModelError(new Error('413 {"error":"free_prompt_too_large"}'))).toBe('provider')
    expect(classifyModelError(new Error('The model is overloaded'))).toBe('provider')
    expect(classifyModelError(new Error('Model call timed out after 45000ms'))).toBe('provider')
  })

  it('treats other rejections as request errors', () => {
    expect(classifyModelError(httpError(400, '400 invalid tool schema'))).toBe('request')
    expect(classifyModelError(new Error('API key is missing for OpenAI-compatible provider'))).toBe('request')
  })
})

describe('nextFailoverStep', () => {
  it('tries the next key of the same provider on a key error', () => {
    expect(nextFailoverStep('key', { keyIndex: 0, keyCount: 3, isStartRoute: true })).toBe('next-key')
    expect(nextFailoverStep('key', { keyIndex: 1, keyCount: 3, isStartRoute: false })).toBe('next-key')
  })

  it('moves to the next route once every key of the provider failed', () => {
    expect(nextFailoverStep('key', { keyIndex: 2, keyCount: 3, isStartRoute: true })).toBe('next-route')
    expect(nextFailoverStep('key', { keyIndex: 0, keyCount: 1, isStartRoute: true })).toBe('next-route')
  })

  it('moves to the next route on a provider error without trying other keys', () => {
    expect(nextFailoverStep('provider', { keyIndex: 0, keyCount: 3, isStartRoute: true })).toBe('next-route')
  })

  it('surfaces a request error on the starting route and skips past it on a fallback route', () => {
    expect(nextFailoverStep('request', { keyIndex: 0, keyCount: 2, isStartRoute: true })).toBe('throw')
    expect(nextFailoverStep('request', { keyIndex: 0, keyCount: 2, isStartRoute: false })).toBe('next-route')
  })
})

describe('routeFailureLabel', () => {
  it('marks keys after the first with their number', () => {
    expect(routeFailureLabel('runcrate', 'openai/gpt-oss-120b', 0)).toBe('runcrate:openai/gpt-oss-120b')
    expect(routeFailureLabel('runcrate', 'openai/gpt-oss-120b', 1)).toBe('runcrate#2:openai/gpt-oss-120b')
  })
})
