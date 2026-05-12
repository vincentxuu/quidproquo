import { describe, expect, it } from 'vitest'
import { shouldSubmitMessage } from './keyboard'

describe('shouldSubmitMessage', () => {
  it('submits on Enter', () => {
    expect(shouldSubmitMessage({ key: 'Enter', shiftKey: false })).toBe(true)
  })

  it('does not submit when composing text with an IME', () => {
    expect(shouldSubmitMessage({
      key: 'Enter',
      shiftKey: false,
      nativeEvent: { isComposing: true },
    })).toBe(false)
  })

  it('does not submit on Safari composition key events', () => {
    expect(shouldSubmitMessage({ key: 'Enter', shiftKey: false, keyCode: 229 })).toBe(false)
  })

  it('does not submit on Shift+Enter', () => {
    expect(shouldSubmitMessage({ key: 'Enter', shiftKey: true })).toBe(false)
  })
})
