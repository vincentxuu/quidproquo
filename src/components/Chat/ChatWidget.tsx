import { useState, useRef, useEffect, useMemo } from 'react'
import type { Message, StepEvent } from './types'
import { applyStepEvent } from './steps-reducer'
import { ChatThread } from './ChatThread'
import { QuotaIndicator } from './QuotaIndicator'
import { ChatHeader, ChatHeaderToolbar } from './ChatHeader'
import { Suggestion } from '@/components/ai-elements/suggestion'
import { chatT, SUGGESTED_QUESTIONS_EN } from '@/i18n/chat'
import { buildVisibleSuggestions } from './suggestions'
import { defaultLang, type Lang } from '@/i18n/ui'
import { ChatLocaleProvider } from './locale'

const DAILY_LIMIT = 5
const SUGGESTED_QUESTIONS = [
  '你寫過哪些 AI agent 相關文章？',
  '幫我找 RAG 成本優化的文章',
  '這個部落格有哪些 Cloudflare 踩坑？',
  '推薦我 AI agent 入門閱讀路線',
  '有哪些 RAG 失敗模式相關文章？',
  '幫我找 prompt engineering 的文章',
  '有哪些 context engineering 文章？',
  '這個部落格寫過哪些 Claude Code 文章？',
  '有沒有 Cloudflare Workers AI 的筆記？',
  '幫我找 MCP 相關文章',
  '推薦 AI code review 相關文章',
  '有哪些本地 LLM 或 Ollama 文章？',
  '幫我找向量資料庫比較的文章',
  '有哪些 LangGraph 或 agent orchestration 文章？',
  '幫我整理 RAG evaluation 相關文章',
  '有哪些 AI observability 文章？',
  '推薦我 Cloudflare D1 相關踩坑',
  '幫我找 coding agent CLI 比較文章',
  '有哪些產品設計相關文章？',
  '這個部落格有哪些學習路線可以讀？',
  '幫我找 hybrid search、BM25、RRF 相關文章',
  '有哪些 chunking strategy 相關文章？',
  '推薦我讀 GraphRAG 和 knowledge graph 文章',
  '有哪些 agent memory system 文章？',
  '幫我找 harness engineering 相關文章',
  '這裡有沒有 Langfuse 或 tracing 的文章？',
  '有哪些 OpenAI Codex 相關文章？',
  '幫我找 Gemini CLI、opencode、Cursor 相關文章',
  '推薦我讀 MCP、CLI、API 工具介面比較',
  '有哪些 Cloudflare KV、R2、Workers、D1 文章？',
  '幫我找 Docker、Nginx、502 踩坑文章',
  '有哪些部落格 SEO、AEO、GEO 文章？',
  '推薦我產品建構者或 AI native team 的文章',
  '有哪些 daodao 或 nobodyclimb 產品文章？',
  '幫我找旅行保險相關文章',
  '有哪些 prompt caching 或 context window 文章？',
  '幫我找多模型 routing 相關文章',
  '有哪些 AI browser agent 文章？',
  '推薦我讀 PageIndex 或 vectorless RAG 文章',
  '有哪些知識管理與內容管線文章？',
]

/** 讀者正在看的文章，build 時由文章頁帶入。slug 是 D1 slug（檔案路徑），不是路由 id。 */
export interface ChatPage {
  slug: string
  title: string
  /** 這篇 frontmatter 的第一個 glossary 詞，用來產生「解釋〈詞〉」建議問題 */
  term?: string
}

interface PendingMessage {
  id: number;
  text: string;
}

const WELCOME_ID = 'welcome'
const PAGE_CONTEXT_FLAG_KEY = 'chat_page_context_enabled'

// 文章頁是靜態頁，flag 只能在執行期問伺服器；同一個分頁問一次就好。
function usePageContextFlag(wanted: boolean): boolean {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    if (!wanted) return
    const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(PAGE_CONTEXT_FLAG_KEY) : null
    if (stored !== null) {
      setEnabled(stored === '1')
      return
    }
    let cancelled = false
    fetch('/api/chat/config')
      .then(resp => (resp.ok ? resp.json() : { pageContext: false }) as Promise<{ pageContext?: boolean }>)
      .then(config => {
        if (cancelled) return
        const on = config.pageContext === true
        setEnabled(on)
        try { sessionStorage.setItem(PAGE_CONTEXT_FLAG_KEY, on ? '1' : '0') } catch { /* private mode */ }
      })
      .catch(() => { /* 問不到就當沒開，行為與現在相同 */ })
    return () => { cancelled = true }
  }, [wanted])
  return enabled
}

export function ChatWidget({
  embedded = false,
  pendingMessage,
  onClose,
  onExpandToggle,
  isExpanded,
  lang = defaultLang,
  page,
}: {
  embedded?: boolean
  pendingMessage?: PendingMessage
  onClose?: () => void
  onExpandToggle?: () => void
  isExpanded?: boolean
  lang?: Lang
  page?: ChatPage
}) {
  const t = useMemo(() => chatT(lang), [lang])
  const welcome = useMemo<Message>(() => ({ id: WELCOME_ID, role: 'assistant', content: t('chat.welcome') }), [t])
  const suggestionPool = lang === 'en' ? SUGGESTED_QUESTIONS_EN : SUGGESTED_QUESTIONS
  const [messages, setMessages] = useState<Message[]>(() => [welcome])
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [suggestionPage, setSuggestionPage] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const pageContextEnabled = usePageContextFlag(Boolean(page))
  // 讀者按掉 chip 後這個對話就回到全站模式；開新對話時 chip 重新出現
  const [pageDismissed, setPageDismissed] = useState(false)
  const activePage = page && pageContextEnabled && !pageDismissed ? page : undefined
  const threadId = useRef(
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('chat_thread_id') ?? crypto.randomUUID())
      : crypto.randomUUID()
  )

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chat_thread_id', threadId.current)
    }
  }, [])

  const handleNewChat = () => {
    abortRef.current?.abort()
    abortRef.current = null
    const nextId = crypto.randomUUID()
    threadId.current = nextId
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chat_thread_id', nextId)
    }
    setMessages([welcome])
    setRemaining(null)
    setSuggestionPage(0)
    setPageDismissed(false)
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  const sendMessage = async (text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantId = crypto.randomUUID()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      steps: [],
      streaming: true,
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setLoading(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          thread_id: threadId.current,
          ...(activePage ? { page_context: { slug: activePage.slug } } : {}),
        }),
        signal: controller.signal,
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({})) as { error?: string; message?: string }
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: err.message ?? t('chat.error.generic'), streaming: false, error: err.error !== 'rate_limit' }
            : m
        ))
        return
      }

      const reader = resp.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      // 伺服器正常收尾一定會送 done 或 error；兩者都沒有就是連線中途斷掉
      //（prod 遇過 Worker exceededMemory 被砍，串流乾淨關閉但一個字都沒有）。
      let terminated = false
      let gotText = false

      const processBlock = (block: string) => {
        const lines = block.split('\n')
        let eventType = 'token'
        let dataStr = ''
        for (const line of lines) {
          if (line.startsWith('event:')) eventType = line.slice(6).trim()
          else if (line.startsWith('data:')) dataStr = line.slice(5).trim()
        }
        if (!dataStr) return
        try {
          const data = JSON.parse(dataStr)
          if (eventType === 'token') {
            if (data.text) gotText = true
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, content: m.content + (data.text ?? '') } : m
            ))
          } else if (eventType === 'step') {
            const ev = data as StepEvent
            if (!ev || typeof ev.id !== 'string') return
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, steps: applyStepEvent(m.steps, ev) } : m
            ))
          } else if (eventType === 'sources') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, sources: data } : m
            ))
          } else if (eventType === 'related') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, related: data } : m
            ))
          } else if (eventType === 'done') {
            terminated = true
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, streaming: false } : m
            ))
            if (typeof data.remaining === 'number') setRemaining(data.remaining)
          } else if (eventType === 'error') {
            terminated = true
            // 伺服器的 message 可能夾整段 stack trace，氣泡只給第一行，全文放進展開的步驟
            const detail = typeof data.message === 'string' ? data.message : ''
            const headline = detail.split('\n')[0].trim().slice(0, 200) || t('chat.error.short')
            const errorStep: StepEvent = { id: 'error', kind: 'check', label: t('chat.error.short'), status: 'error', reasoning: detail || undefined }
            setMessages(prev => prev.map(m =>
              m.id === assistantId
                ? { ...m, content: headline, streaming: false, error: true, steps: applyStepEvent(m.steps, errorStep) }
                : m
            ))
          }
        } catch { /* skip malformed */ }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const blocks = buffer.split('\n\n')
        buffer = blocks.pop() ?? ''
        for (const block of blocks) {
          if (block.trim()) processBlock(block)
        }
      }
      if (buffer.trim()) processBlock(buffer)
      if (!terminated && !gotText) {
        const errorStep: StepEvent = { id: 'error', kind: 'check', label: t('chat.error.short'), status: 'error', reasoning: t('chat.error.disconnected') }
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: t('chat.error.disconnected'), streaming: false, error: true, steps: applyStepEvent(m.steps, errorStep) }
            : m
        ))
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content || t('chat.stopped'), streaming: false } : m
        ))
      } else {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content || t('chat.error.generic'), streaming: false, error: true } : m
        ))
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null
      setLoading(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      ))
    }
  }

  // 重試：拿掉失敗的那組問答，用同一句重送（伺服器照常計次）
  const handleRetry = (assistantId: string) => {
    if (loading) return
    const index = messages.findIndex(m => m.id === assistantId)
    const question = index > 0 ? messages[index - 1] : undefined
    if (!question || question.role !== 'user') return
    setMessages(prev => prev.filter(m => m.id !== assistantId && m.id !== question.id))
    void sendMessage(question.content)
  }

  useEffect(() => {
    if (pendingMessage) void sendMessage(pendingMessage.text)
  }, [pendingMessage?.id])

  const containerStyle = embedded
    ? { display: 'flex', flexDirection: 'column' as const, flex: 1, overflow: 'hidden' }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        height: 'min(82vh, 760px)',
        minHeight: 'min(560px, calc(100vh - 7rem))',
        maxWidth: 860,
        margin: '0 auto',
        border: '1px solid var(--border)',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-floating)',
      }
  // 在文章頁：前三題問眼前這篇（套模板，不呼叫 LLM），最後一題留給全站；「換題目」只換全站那題
  const pageQuestions = activePage
    ? [
        t('chat.page.q.summary'),
        activePage.term ? t('chat.page.q.term', { term: activePage.term }) : t('chat.page.q.audience'),
        t('chat.page.q.related'),
      ]
    : []
  const visibleSuggestions = buildVisibleSuggestions(pageQuestions, suggestionPool, suggestionPage)

  // 建議問題貼在輸入框正上方、直列（窄面板慣例），開始對話就收起
  const suggestions = messages.length === 1 && !loading ? (
    <div className="px-4 pt-2 pb-3" style={{ background: 'var(--bg-subtle)' }}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{t('chat.suggestions.title')}</span>
        <button
          type="button"
          onClick={() => setSuggestionPage(page => page + 1)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-2 py-1 text-sm font-bold transition-colors hover:bg-accent"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={t('chat.suggestions.refreshAria')}
        >
          <RefreshCwIcon className="size-3.5" />
          {t('chat.suggestions.refresh')}
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {visibleSuggestions.map((question) => (
          <Suggestion
            key={question}
            suggestion={question}
            onClick={(q) => void sendMessage(q)}
            className="chat-suggestion h-auto justify-start whitespace-normal text-left text-sm leading-relaxed"
          />
        ))}
      </div>
    </div>
  ) : null

  // chip 整段對話都留著（不只空狀態），讀者隨時看得到 AI 以哪篇為脈絡、也隨時能拿掉
  const pageChip = activePage ? (
    <div className="flex items-center gap-1.5 px-4 pt-2 pb-1 text-sm" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
      <span className="shrink-0 font-bold">{t('chat.page.chip')}</span>
      <span className="min-w-0 truncate" title={activePage.title}>{activePage.title}</span>
      <button
        type="button"
        onClick={() => setPageDismissed(true)}
        className="ml-auto inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent leading-none transition-colors hover:bg-accent"
        style={{ color: 'var(--text-secondary)' }}
        aria-label={t('chat.page.remove')}
        title={t('chat.page.remove')}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  ) : null

  return (
    <ChatLocaleProvider lang={lang} pageSlug={activePage?.slug}>
    <div style={containerStyle}>
      <ChatHeader
        status={loading ? 'streaming' : 'idle'}
        subtitle={t('chat.widget.subtitle')}
        onExpandToggle={onExpandToggle}
        isExpanded={isExpanded}
        onClose={onClose}
        extraActions={
          <ChatHeaderToolbar
            messages={messages}
            onNewChat={handleNewChat}
          />
        }
      />
      <ChatThread
        messages={messages}
        loading={loading}
        onSend={sendMessage}
        onStop={handleStop}
        onRetry={handleRetry}
        beforeComposer={<>{suggestions}{pageChip}</>}
        footerNote={
          <>
            <span>{t('chat.disclaimer')}</span>
            {remaining !== null && (
              <div className="ml-auto w-40 shrink-0">
                <QuotaIndicator remaining={remaining} limit={DAILY_LIMIT} />
              </div>
            )}
          </>
        }
      />
    </div>
    </ChatLocaleProvider>
  )
}

function RefreshCwIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

