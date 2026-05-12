import { useState, useRef, useEffect } from 'react'
import { MessageList, type Message } from './MessageList'
import { MessageInput } from './MessageInput'
import { QuotaIndicator } from './QuotaIndicator'

const DAILY_LIMIT = 5
const SUGGESTED_QUESTIONS = [
  '你寫過哪些 AI agent 相關文章？',
  '幫我找 RAG 成本優化的文章',
  '這個部落格有哪些 Cloudflare 踩坑？',
]

export function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: '你好！我可以回答關於這個部落格的問題。試著問我「你寫過哪些 AI 相關的文章？」',
  }])
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const threadId = useRef(
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('chat_thread_id') ?? crypto.randomUUID())
      : crypto.randomUUID()
  )
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chat_thread_id', threadId.current)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        border: '1px solid #e4e4e7',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 18px 45px rgba(24, 24, 27, 0.08)',
      }

  return (
    <div style={containerStyle}>
      {!embedded && (
        <div style={{ padding: '0.95rem 1rem', borderBottom: '1px solid #e4e4e7', background: '#fff' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#18181b' }}>Ask AI</div>
          <div style={{ marginTop: '0.2rem', fontSize: '0.84rem', lineHeight: 1.45, color: '#52525b' }}>
            搜尋這個部落格的文章脈絡、技術筆記與延伸閱讀。
          </div>
        </div>
      )}
      <MessageList messages={messages} />
      <div ref={bottomRef} />
      {messages.length === 1 && !loading && (
        <div style={styles.suggestions}>
          {SUGGESTED_QUESTIONS.map((question) => (
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
      )}
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
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    padding: '0.75rem 1rem 0',
    borderTop: '1px solid #e4e4e7',
    background: '#fff',
  },
  suggestionButton: {
    padding: '0.45rem 0.65rem',
    borderRadius: 8,
    border: '1px solid #d4d4d8',
    background: '#fafafa',
    color: '#27272a',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '0.84rem',
    lineHeight: 1.35,
    textAlign: 'left' as const,
  },
}
