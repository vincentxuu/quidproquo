// Turns a failed run's raw error into what the admin needs: what went wrong, in plain
// words, and what to do next. Raw errors stay on the session page.

export type FailureCategory =
  | 'model_quota'
  | 'model_auth'
  | 'model_credit'
  | 'model_unavailable'
  | 'sandbox'
  | 'github'
  | 'unknown'

export interface FailureAction {
  label: string
  href?: string
}

export interface FailureSummary {
  category: FailureCategory
  message: string
  action: FailureAction
}

const MODELS_SETTINGS = '/admin/settings/models'
const GITHUB_SETTINGS = '/admin/settings/github'

const RETRY: FailureAction = { label: '稍後重跑；持續發生再看 session 紀錄' }

const RULES: Array<{ test: RegExp; summary: FailureSummary }> = [
  {
    test: /\b429\b|too many requests|quota|rate.?limit/i,
    summary: { category: 'model_quota', message: '模型額度用完或被限流', action: { label: '等額度重置，或到模型設定換供應商', href: MODELS_SETTINGS } },
  },
  {
    test: /\b402\b|usage credits|insufficient (credit|balance)|billing/i,
    summary: { category: 'model_credit', message: '模型帳號沒有額度', action: { label: '到供應商加值，或到模型設定換供應商', href: MODELS_SETTINGS } },
  },
  {
    test: /\b401\b|unauthori[sz]ed|invalid api key|user not found|api key is missing/i,
    summary: { category: 'model_auth', message: '模型 API key 失效或沒設定', action: { label: '到模型設定更新 key', href: MODELS_SETTINGS } },
  },
  {
    test: /^model error:.*(\b50[0-4]\b|overloaded|unavailable|timeout)/i,
    summary: { category: 'model_unavailable', message: '模型服務暫時無法使用', action: RETRY },
  },
  {
    test: /sandboxerror|container|not a git repository/i,
    summary: { category: 'sandbox', message: '執行環境沒有正常啟動或中途重置', action: RETRY },
  },
  {
    test: /clone failed|push failed|permission to .+ denied|github api|could not read from remote/i,
    summary: { category: 'github', message: '存取 GitHub repo 失敗', action: { label: '檢查 GitHub App 的安裝與權限', href: GITHUB_SETTINGS } },
  },
]

/** The error text without the wrappers the runner adds around it. */
function stripPrefixes(raw: string): string {
  return raw.replace(/^session failed:\s*/i, '').trim()
}

export function summarizeFailure(raw: string | null | undefined): FailureSummary {
  const text = stripPrefixes(raw ?? '')
  // With fallbacks, the first provider's error is the one that explains the outage.
  const primary = text.replace(/^model error: all providers failed:\s*/i, 'model error: ').split(' | ')[0]
  for (const rule of RULES) {
    if (rule.test.test(primary)) {
      const summary = { ...rule.summary }
      if (/all providers failed/i.test(text)) summary.message += '，備援模型也都無法回應'
      return summary
    }
  }
  const firstLine = text.split('\n')[0].trim()
  return {
    category: 'unknown',
    message: firstLine && !/^session complete$/i.test(firstLine) ? truncate(firstLine, 120) : '沒有記錄失敗原因',
    action: { label: '打開 session 看完整紀錄' },
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s
}

/** Summaries of each failed session's last result event, keyed by session id. */
export async function loadFailureSummaries(db: D1Database, sessionIds: string[]): Promise<Map<string, FailureSummary>> {
  const summaries = new Map<string, FailureSummary>()
  if (sessionIds.length === 0) return summaries
  const placeholders = sessionIds.map(() => '?').join(', ')
  const rows = await db
    .prepare(
      `SELECT s.id AS session_id,
              (SELECT json_extract(e.payload_json, '$.content') FROM agent_events e
                WHERE e.session_id = s.id AND e.type = 'result'
                ORDER BY e.seq DESC LIMIT 1) AS raw_error
       FROM agent_sessions s
       WHERE s.id IN (${placeholders})`,
    )
    .bind(...sessionIds)
    .all<{ session_id: string; raw_error: string | null }>()
  for (const row of rows.results ?? []) summaries.set(row.session_id, summarizeFailure(row.raw_error))
  return summaries
}
