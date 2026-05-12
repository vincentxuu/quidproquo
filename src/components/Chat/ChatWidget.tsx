import { useState, useRef, useEffect } from 'react'
import { MessageList, type Message } from './MessageList'
import { MessageInput } from './MessageInput'
import { QuotaIndicator } from './QuotaIndicator'

const DAILY_LIMIT = 5
const SUGGESTIONS_PER_PAGE = 3
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

export function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: '你好！我可以回答關於這個部落格的問題。',
  }])
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [suggestionPage, setSuggestionPage] = useState(0)
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

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, thread_id: threadId.current }),
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
          } else if (eventType === 'agent_step') {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, steps: [...(m.steps ?? []), data] } : m
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
    } finally {
      setLoading(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      ))
    }
  }

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
      {!embedded && (
        <div style={{ padding: '0.95rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--brand-900)' }}>Ask AI</div>
          <div style={{ marginTop: '0.2rem', fontSize: '0.84rem', lineHeight: 1.45, color: 'var(--text-secondary)' }}>
            搜尋這個部落格的文章脈絡、技術筆記與延伸閱讀。
          </div>
        </div>
      )}
      {messages.length === 1 && !loading && (
        <div style={styles.suggestionPanel}>
          <div style={styles.suggestionHeader}>
            <span style={styles.suggestionTitle}>可以這樣問</span>
            <button
              type="button"
              onClick={() => setSuggestionPage(page => page + 1)}
              style={styles.refreshButton}
              aria-label="換一組預設問題"
            >
              換題目
            </button>
          </div>
          <div style={styles.suggestions}>
            {visibleSuggestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void sendMessage(question)}
                style={styles.suggestionButton}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      <MessageList messages={messages} />
      {remaining !== null && (
        <div style={{ padding: '0.5rem 1rem 0' }}>
          <QuotaIndicator remaining={remaining} limit={DAILY_LIMIT} />
        </div>
      )}
      <MessageInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}

const styles = {
  suggestionPanel: {
    padding: '0.65rem 1rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-card)',
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginBottom: '0.45rem',
  },
  suggestionTitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  refreshButton: {
    padding: '0.28rem 0.5rem',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg-page)',
    color: 'var(--brand-700)',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '0.76rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.45rem',
  },
  suggestionButton: {
    padding: '0.38rem 0.55rem',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--brand-50)',
    color: 'var(--brand-700)',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '0.8rem',
    lineHeight: 1.35,
    textAlign: 'left' as const,
  },
}
