/**
 * 最近幾輪對話（滑動視窗）。
 *
 * 逐字稿存在讀者瀏覽器（`src/components/Chat/transcript.ts`），送出時帶上最近幾輪，
 * 伺服器只做三件事：驗證、裁切、渲染成 prompt 用的純文字。
 * 這裡的內容一律視為**不可信輸入**：長度、則數、角色都重新檢查，不直接進 prompt。
 */

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

/** 最多收幾則（6 則 = 3 組問答）。 */
export const MAX_RECENT_TURNS = 6

/**
 * 每則最多幾個字。舊答案只留開頭就夠了——需要的是「前面在講什麼」，
 * 不是全文重播；全文由檢索與 checkpoint 摘要負責。同時這也是注入預算的閥門
 * （不超過 context window 的 70%，優先保留最近的問答對）。
 */
export const MAX_TURN_CHARS = 400

/** 角色與內容都合法才收；空字串、非字串、畸形項目直接跳過，不讓整個請求失敗。 */
export function parseRecentTurns(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return []
  const turns: ChatTurn[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const { role, content } = item as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string') continue
    const trimmed = content.trim()
    if (!trimmed) continue
    turns.push({ role, content: trimmed.slice(0, MAX_TURN_CHARS) })
  }
  // 超出上限時丟最舊的，保留離現在最近的那幾輪
  return turns.slice(-MAX_RECENT_TURNS)
}

/** 給 prompt 用的文字；沒有內容時回 undefined，讓呼叫端保持原本的 prompt。 */
export function renderRecentTurns(turns: ChatTurn[]): string | undefined {
  if (turns.length === 0) return undefined
  return turns
    .map((turn) => `${turn.role === 'user' ? 'Reader' : 'Assistant'}: ${turn.content}`)
    .join('\n\n')
}

/**
 * 語意快取依最近的對話分流：同樣一句「那正2呢？」在不同上下文裡是不同的問題，
 * 共用快取會回錯答案。做法與 `pageCacheNamespace` 相同（對內容取雜湊）。
 */
export async function recentTurnsCacheNamespace(
  base: string | undefined,
  turns: ChatTurn[],
): Promise<string | undefined> {
  if (turns.length === 0) return base
  const text = renderRecentTurns(turns) ?? ''
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  const hash = Array.from(new Uint8Array(digest).slice(0, 6), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return base ? `${base}-ctx${hash}` : `ctx${hash}`
}
