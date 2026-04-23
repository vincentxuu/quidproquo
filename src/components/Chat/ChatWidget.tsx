import { useState, useRef, useEffect } from 'react'
import { MessageList, type Message } from './MessageList'
import { MessageInput } from './MessageInput'
import { QuotaIndicator } from './QuotaIndicator'

const DAILY_LIMIT = 5

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: '你好！我可以回答關於這個部落格的問題。試著問我「你寫過哪些 AI 相關的文章？」',
  }])
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState(DAILY_LIMIT)
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', maxWidth: 800, margin: '0 auto', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 600 }}>
        Ask AI
      </div>
      <MessageList messages={messages} />
      <div ref={bottomRef} />
      <div style={{ padding: '0.5rem 1rem 0' }}>
        <QuotaIndicator remaining={remaining} limit={DAILY_LIMIT} />
      </div>
      <MessageInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}
