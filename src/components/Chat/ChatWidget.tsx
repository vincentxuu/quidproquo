import { useState, useRef, useEffect } from 'react'
import type { Message, Step } from './types'
import { ChatThread } from './ChatThread'
import { QuotaIndicator } from './QuotaIndicator'
import { ChatHeader, ChatHeaderToolbar } from './ChatHeader'
import { Suggestion } from '@/components/ai-elements/suggestion'

const DAILY_LIMIT = 5
const SUGGESTIONS_PER_PAGE = 4
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

interface PendingMessage {
  id: number;
  text: string;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '你好！我可以回答關於這個部落格的問題。',
}

export function ChatWidget({
  embedded = false,
  pendingMessage,
  onClose,
  onExpandToggle,
  isExpanded,
}: {
  embedded?: boolean
  pendingMessage?: PendingMessage
  onClose?: () => void
  onExpandToggle?: () => void
  isExpanded?: boolean
}) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [suggestionPage, setSuggestionPage] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
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
    setMessages([WELCOME_MESSAGE])
    setRemaining(null)
    setSuggestionPage(0)
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
        body: JSON.stringify({ message: text, thread_id: threadId.current }),
        signal: controller.signal,
      })

      if (!resp.ok) {
        const err = await resp.json() as { message?: string }
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: err.message ?? '發生錯誤，請稍後再試', streaming: false } : m
        ))
        return
      }

      const reader = resp.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

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
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, content: m.content + (data.text ?? '') } : m
            ))
          } else if (eventType === 'step_start') {
            const d = data as { label: string; description?: string; status: string }
            const status = d.status === 'pending' ? 'pending' : d.status === 'active' ? 'active' : 'complete'
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, steps: [...(m.steps ?? []), { label: d.label, description: d.description, status }] as Step[] } : m
            ))
          } else if (eventType === 'step_complete') {
            const d = data as { label: string; description?: string; status: string; duration_ms?: number }
            setMessages(prev => prev.map(m => {
              const steps = (m.steps ?? []).map(s => s.label === d.label ? { ...s, status: 'complete' as const, description: d.description ?? s.description } : s)
              return m.id === assistantId ? { ...m, steps } : m
            }))
          } else if (eventType === 'tool_call') {
            const d = data as { tool: string; label: string; args?: unknown }
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, steps: [...(m.steps ?? []), { label: d.label, description: `呼叫工具 ${d.tool}`, status: 'active' as const, tool: d.tool }] as Step[] } : m
            ))
          } else if (eventType === 'tool_result') {
            const d = data as { tool: string; label: string; count?: number; results?: { title: string; url: string; type?: string }[] }
            setMessages(prev => prev.map(m => {
              const steps = (m.steps ?? []).map(s => s.tool === d.tool && s.status === 'active' ? { ...s, status: 'complete' as const, results: d.results } : s)
              return m.id === assistantId ? { ...m, steps } : m
            }))
          } else if (eventType === 'agent_step') {
            const d = data as { agent: string; status: string; extra?: Record<string, unknown> }
            const labelMap: Record<string, string> = {
              Planner: '分析問題',
              Research: '檢索站內文章',
              Writer: '整理答案',
              Validation: '驗證答案',
              Critic: '評估品質',
              Fallback: '備援回答',
              Related: '推薦相關文章',
            }
            const descMap: Record<string, string> = {
              Planner: '理解問題並決定搜尋方向',
              Research: '搜尋站內文章與混合檢索',
              Writer: '根據來源整理最終回答',
              Validation: '檢查引用與事實一致',
              Critic: '評估信心與相關性',
              Fallback: '使用備援策略產生回答',
              Related: '列出相關文章推薦',
            }
            const label = labelMap[d.agent] ?? d.agent
            const description = descMap[d.agent]
            const status = d.status === 'completed' ? 'complete' as const : 'active' as const
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, steps: [...(m.steps ?? []), { label, description, status, tool: d.agent }] as Step[] } : m
            ))
          } else if (eventType === 'sources') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, sources: data } : m
            ))
          } else if (eventType === 'related') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, related: data } : m
            ))
          } else if (eventType === 'reasoning') {
            const d = data as { stage: string; text: string }
            if (!d.text) return
            setMessages(prev => prev.map(m => {
              if (m.id !== assistantId) return m
              const existing = (m.reasoning ?? []).filter(r => r.stage !== d.stage)
              return { ...m, reasoning: [...existing, { stage: d.stage, text: d.text }] }
            }))
          } else if (eventType === 'done') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, streaming: false, confidence: data.confidence } : m
            ))
            if (typeof data.remaining === 'number') setRemaining(data.remaining)
          } else if (eventType === 'error') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, content: data.message ?? '發生錯誤', streaming: false } : m
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
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content || '已停止生成', streaming: false } : m
        ))
      } else {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content || '發生錯誤，請稍後再試', streaming: false } : m
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
  const visibleSuggestions = Array.from({ length: SUGGESTIONS_PER_PAGE }, (_, index) => {
    const questionIndex = (suggestionPage * SUGGESTIONS_PER_PAGE + index) % SUGGESTED_QUESTIONS.length
    return SUGGESTED_QUESTIONS[questionIndex]
  })

  return (
    <div style={containerStyle}>
      <ChatHeader
        status={loading ? 'streaming' : 'idle'}
        subtitle="搜尋這個部落格的文章脈絡、技術筆記與延伸閱讀。"
        onExpandToggle={onExpandToggle}
        isExpanded={isExpanded}
        onClose={onClose}
        extraActions={
          <ChatHeaderToolbar
            messages={messages}
            loading={loading}
            streaming={loading}
            onNewChat={handleNewChat}
            onStop={handleStop}
          />
        }
      />
      {messages.length === 1 && !loading && (
        <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>可以這樣問</span>
            <button
              type="button"
              onClick={() => setSuggestionPage(page => page + 1)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-colors hover:bg-accent"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="換一組預設問題"
            >
              <RefreshCwIcon className="size-3.5" />
              換題目
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {visibleSuggestions.map((question) => (
              <Suggestion
                key={question}
                suggestion={question}
                onClick={(q) => void sendMessage(q)}
                className="chat-suggestion h-auto justify-start whitespace-normal text-left text-xs leading-relaxed"
                style={{
                  background: 'var(--brand-100)',
                  color: 'var(--brand-700)',
                  borderColor: 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>
      )}
      {remaining !== null && (
        <div style={{ padding: '0.5rem 1rem 0' }}>
          <QuotaIndicator remaining={remaining} limit={DAILY_LIMIT} />
        </div>
      )}
      <ChatThread messages={messages} loading={loading} onSend={sendMessage} />
    </div>
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

