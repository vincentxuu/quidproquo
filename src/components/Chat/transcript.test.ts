import { describe, expect, it } from 'vitest'
import type { Message } from './types'
import {
  MAX_STORED_MESSAGES,
  TRANSCRIPT_STORAGE_KEY,
  clearTranscript,
  parseTranscript,
  readTranscript,
  serializeTranscript,
  toRequestHistory,
  toStoredMessages,
  trimTranscript,
  writeTranscript,
  type TranscriptStorage,
} from './transcript'
import { MAX_RECENT_TURNS, MAX_TURN_CHARS } from '@/lib/conversation/recent-turns'

const WELCOME_ID = 'welcome'

const welcome: Message = { id: WELCOME_ID, role: 'assistant', content: '嗨，想找什麼？' }

function question(id: string, content = `問題 ${id}`): Message {
  return { id, role: 'user', content }
}

function answer(id: string, content = `答案 ${id}`): Message {
  return { id, role: 'assistant', content }
}

/** 記憶體版 storage，順便可以模擬無痕模式（丟例外）。 */
function memoryStorage(seed: string | null = null, options?: { throwOnWrite?: boolean }): TranscriptStorage {
  const store = new Map<string, string>()
  if (seed !== null) store.set(TRANSCRIPT_STORAGE_KEY, seed)
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      if (options?.throwOnWrite) throw new Error('QuotaExceededError')
      store.set(key, value)
    },
    removeItem: (key) => void store.delete(key),
  }
}

function rawStored(threadId: string, messages: Message[]): string {
  return JSON.stringify({ threadId, messages })
}

describe('serializeTranscript', () => {
  it('round-trips a conversation without the welcome message', () => {
    const raw = serializeTranscript('t1', [welcome, question('q1'), answer('a1')], WELCOME_ID)
    expect(raw).not.toBeNull()
    expect(parseTranscript(raw, 't1')).toEqual([question('q1'), answer('a1')])
  })

  it('is null when there is nothing worth storing', () => {
    expect(serializeTranscript('t1', [welcome], WELCOME_ID)).toBeNull()
  })

  it('drops messages that would come back as empty bubbles', () => {
    const streaming: Message = { id: 'a1', role: 'assistant', content: '', streaming: true }
    const raw = serializeTranscript('t1', [welcome, question('q1'), streaming], WELCOME_ID)
    expect(parseTranscript(raw, 't1')).toEqual([question('q1')])
  })

  it('keeps a stopped answer that already has text, without the streaming flag', () => {
    const stopped: Message = { id: 'a1', role: 'assistant', content: '講到一半', streaming: true }
    const raw = serializeTranscript('t1', [welcome, question('q1'), stopped], WELCOME_ID)
    expect(parseTranscript(raw, 't1')).toEqual([question('q1'), answer('a1', '講到一半')])
  })
})

describe('parseTranscript', () => {
  it('rejects a transcript from another thread', () => {
    const raw = rawStored('old-thread', [question('q1')])
    expect(parseTranscript(raw, 'new-thread')).toBeNull()
  })

  it('rejects malformed JSON and wrong shapes instead of throwing', () => {
    expect(parseTranscript('{ not json', 't1')).toBeNull()
    expect(parseTranscript('null', 't1')).toBeNull()
    expect(parseTranscript('"string"', 't1')).toBeNull()
    expect(parseTranscript(JSON.stringify({ threadId: 't1' }), 't1')).toBeNull()
    expect(parseTranscript(null, 't1')).toBeNull()
  })

  it('skips items that are not well-formed messages', () => {
    const raw = JSON.stringify({
      threadId: 't1',
      messages: [question('q1'), { id: 'x' }, { id: 'y', role: 'system', content: 'hi' }, 42],
    })
    expect(parseTranscript(raw, 't1')).toEqual([question('q1')])
  })

  it('returns null when nothing usable is left', () => {
    expect(parseTranscript(rawStored('t1', [{ id: 'a1', role: 'assistant', content: '' }]), 't1')).toBeNull()
  })
})

describe('trimTranscript', () => {
  it('caps the number of stored messages', () => {
    const many = Array.from({ length: MAX_STORED_MESSAGES + 10 }, (_, i) =>
      i % 2 === 0 ? question(`q${i}`) : answer(`a${i}`)
    )
    const trimmed = trimTranscript(many)
    expect(trimmed).toHaveLength(MAX_STORED_MESSAGES)
    expect(trimmed[0].role).toBe('user')
    expect(trimmed[0].id).toBe(`q${many.length - MAX_STORED_MESSAGES}`)
  })

  it('never starts with an answer', () => {
    const trimmed = trimTranscript([answer('a0'), question('q1'), answer('a1')])
    expect(trimmed.map((m) => m.id)).toEqual(['q1', 'a1'])
  })

  it('drops whole turns when the serialized size exceeds the limit', () => {
    const bulky = Array.from({ length: 6 }, (_, i) => [
      question(`q${i}`, 'x'.repeat(12_000)),
      answer(`a${i}`, 'y'.repeat(12_000)),
    ]).flat()
    const trimmed = trimTranscript(bulky)
    expect(trimmed.length).toBeLessThan(bulky.length)
    expect(trimmed[0].role).toBe('user')
    expect(JSON.stringify(trimmed).length).toBeLessThanOrEqual(64 * 1024)
  })

  it('always keeps the last turn, even if that turn alone is over the limit', () => {
    const huge = [question('q1', 'x'.repeat(40_000)), answer('a1', 'y'.repeat(40_000))]
    expect(trimTranscript(huge)).toHaveLength(2)
  })
})

describe('storage wrappers', () => {
  it('writes and reads back through storage', () => {
    const storage = memoryStorage()
    writeTranscript(storage, 't1', [welcome, question('q1'), answer('a1')], WELCOME_ID)
    expect(readTranscript(storage, 't1')).toEqual([question('q1'), answer('a1')])
  })

  it('clears the stored transcript when only the welcome is left', () => {
    const storage = memoryStorage(rawStored('t1', [question('q1')]))
    writeTranscript(storage, 't1', [welcome], WELCOME_ID)
    expect(storage.getItem(TRANSCRIPT_STORAGE_KEY)).toBeNull()
  })

  it('survives storage that throws (private mode / quota)', () => {
    const storage = memoryStorage(null, { throwOnWrite: true })
    expect(() => writeTranscript(storage, 't1', [welcome, question('q1')], WELCOME_ID)).not.toThrow()
    expect(() => clearTranscript(storage)).not.toThrow()
    expect(readTranscript(storage, 't1')).toBeNull()
  })

  it('is a no-op without storage (SSR)', () => {
    expect(() => writeTranscript(undefined, 't1', [welcome, question('q1')], WELCOME_ID)).not.toThrow()
    expect(() => clearTranscript(undefined)).not.toThrow()
    expect(readTranscript(undefined, 't1')).toBeNull()
  })

  it('clearTranscript removes the stored conversation', () => {
    const storage = memoryStorage(rawStored('t1', [question('q1')]))
    clearTranscript(storage)
    expect(storage.getItem(TRANSCRIPT_STORAGE_KEY)).toBeNull()
  })
})

describe('toStoredMessages', () => {
  it('leaves an ordinary conversation untouched', () => {
    expect(toStoredMessages([welcome, question('q1'), answer('a1')], WELCOME_ID)).toEqual([
      question('q1'),
      answer('a1'),
    ])
  })
})

describe('toRequestHistory', () => {
  it('sends the most recent turns and leaves the welcome out', () => {
    const messages = [welcome, question('q1'), answer('a1'), question('q2'), answer('a2')]
    expect(toRequestHistory(messages, WELCOME_ID)).toEqual([
      { role: 'user', content: '問題 q1' },
      { role: 'assistant', content: '答案 a1' },
      { role: 'user', content: '問題 q2' },
      { role: 'assistant', content: '答案 a2' },
    ])
  })

  it('keeps only the last N turns', () => {
    const messages = [
      welcome,
      question('q1'),
      answer('a1'),
      question('q2'),
      answer('a2'),
      question('q3'),
      answer('a3'),
      question('q4'),
      answer('a4'),
    ]
    const history = toRequestHistory(messages, WELCOME_ID)
    expect(history).toHaveLength(MAX_RECENT_TURNS)
    expect(history[0]).toEqual({ role: 'user', content: '問題 q2' })
  })

  it('skips failed turns and empty answers', () => {
    const failed: Message = { id: 'a1', role: 'assistant', content: '連線中斷', error: true }
    const empty: Message = { id: 'a2', role: 'assistant', content: '   ' }
    const messages = [welcome, question('q1'), failed, question('q2'), empty, question('q3')]
    expect(toRequestHistory(messages, WELCOME_ID)).toEqual([
      { role: 'user', content: '問題 q1' },
      { role: 'user', content: '問題 q2' },
      { role: 'user', content: '問題 q3' },
    ])
  })

  it('truncates long turns so one verbose answer cannot blow the budget', () => {
    const messages = [welcome, question('q1'), answer('a1', 'z'.repeat(5_000))]
    const history = toRequestHistory(messages, WELCOME_ID)
    expect(history[1].content).toHaveLength(MAX_TURN_CHARS)
  })
})
