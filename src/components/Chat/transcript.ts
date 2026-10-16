import type { Message } from './types'
import { MAX_RECENT_TURNS, MAX_TURN_CHARS, type ChatTurn } from '@/lib/conversation/recent-turns'

/**
 * 逐字稿只存在讀者自己的瀏覽器（localStorage），不上傳、不進 D1。
 * 「新對話」是使用者手上的清除控制項（見 ChatWidget.handleNewChat）。
 */
export const TRANSCRIPT_STORAGE_KEY = 'chat_transcript_v1'

/** 單一對話的存檔上限：超過就從最舊的問答組開始丟。 */
export const MAX_STORED_MESSAGES = 40
export const MAX_STORED_CHARS = 64 * 1024

export interface StoredTranscript {
  threadId: string
  messages: Message[]
}

/** 只用得到這三個方法；無痕模式、配額用完時由呼叫端吞掉例外。 */
export interface TranscriptStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

/**
 * 存檔前先清掉還原後會壞掉的東西：
 * - welcome 是 i18n 字串，換語言／換頁要重新產生，不進存檔
 * - 沒有內容的回答還原後是空泡泡（串流中被重整、被中止）
 * - `streaming` 旗標不存；中止但已有內容的那一輪留著（使用者看過它）
 */
export function toStoredMessages(messages: Message[], welcomeId: string): Message[] {
  return messages
    .filter((message) => message.id !== welcomeId)
    .filter((message) => message.role === 'user' || message.content.trim() !== '')
    .map(withoutStreaming)
}

/** 存檔不留 `streaming`：還原後每一則都是已經結束的訊息。 */
function withoutStreaming(message: Message): Message {
  if (message.streaming === undefined) return message
  const { streaming: _streaming, ...rest } = message
  return rest
}

/** 一次丟一整組問答，避免還原後第一則是沒有問題的答案。 */
function dropLeadingAnswers(messages: Message[]): Message[] {
  const firstQuestion = messages.findIndex((message) => message.role === 'user')
  return firstQuestion > 0 ? messages.slice(firstQuestion) : messages
}

export function trimTranscript(messages: Message[]): Message[] {
  let trimmed = dropLeadingAnswers(messages.slice(-MAX_STORED_MESSAGES))
  while (trimmed.length > 2 && JSON.stringify(trimmed).length > MAX_STORED_CHARS) {
    trimmed = dropLeadingAnswers(trimmed.slice(2))
  }
  return trimmed
}

/** 沒有東西好存時回 null，呼叫端據此刪掉舊存檔（不是留著上次的內容）。 */
export function serializeTranscript(threadId: string, messages: Message[], welcomeId: string): string | null {
  const trimmed = trimTranscript(toStoredMessages(messages, welcomeId))
  if (trimmed.length === 0) return null
  return JSON.stringify({ threadId, messages: trimmed } satisfies StoredTranscript)
}

function isStoredMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string'
  )
}

/**
 * 讀回存檔。threadId 不符（使用者按過新對話）、形狀不對、JSON 壞掉，
 * 一律回 null 讓呼叫端維持現況，不讓壞資料把 widget 弄壞。
 */
export function parseTranscript(raw: string | null | undefined, threadId: string): Message[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<StoredTranscript> | null
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.threadId !== threadId) return null
    if (!Array.isArray(parsed.messages)) return null
    const messages = parsed.messages
      .filter(isStoredMessage)
      .filter((message) => message.role === 'user' || message.content.trim() !== '')
      .map(withoutStreaming)
    return messages.length > 0 ? messages : null
  } catch {
    return null
  }
}

/** SSR 時沒有 localStorage；某些隱私模式連存取 `localStorage` 都會丟例外。 */
export function browserStorage(): TranscriptStorage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    return undefined
  }
}

export function readTranscript(storage: TranscriptStorage | undefined, threadId: string): Message[] | null {
  if (!storage) return null
  try {
    return parseTranscript(storage.getItem(TRANSCRIPT_STORAGE_KEY), threadId)
  } catch {
    return null
  }
}

export function writeTranscript(
  storage: TranscriptStorage | undefined,
  threadId: string,
  messages: Message[],
  welcomeId: string,
): void {
  if (!storage) return
  try {
    const raw = serializeTranscript(threadId, messages, welcomeId)
    if (raw) storage.setItem(TRANSCRIPT_STORAGE_KEY, raw)
    else storage.removeItem(TRANSCRIPT_STORAGE_KEY)
  } catch {
    // 無痕模式、配額用完：維持現況（這次不存），不讓 widget 壞掉
  }
}

export function clearTranscript(storage: TranscriptStorage | undefined): void {
  if (!storage) return
  try {
    storage.removeItem(TRANSCRIPT_STORAGE_KEY)
  } catch {
    // 同上
  }
}

/**
 * 送給伺服器的最近幾輪。失敗的那一輪不送（錯誤訊息對上下文沒有價值），
 * 上限與伺服器端共用同一組常數（`src/lib/conversation/recent-turns.ts`）。
 */
export function toRequestHistory(messages: Message[], welcomeId: string, limit = MAX_RECENT_TURNS): ChatTurn[] {
  return messages
    .filter((message) => message.id !== welcomeId && !message.error && message.content.trim() !== '')
    .slice(-limit)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_TURN_CHARS),
    }))
}
