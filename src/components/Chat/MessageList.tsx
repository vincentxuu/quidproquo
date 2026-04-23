import { AgentSteps } from './AgentSteps'

interface Source { title: string; url: string; slug?: string }
interface RelatedPost { title: string; slug: string }

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  steps?: { agent: string; status: 'started' | 'completed'; chunks_found?: number }[]
  sources?: Source[]
  related?: RelatedPost[]
  confidence?: number
  streaming?: boolean
}

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', flex: 1, overflowY: 'auto' }}>
      {messages.map(msg => (
        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
          <div style={{
            maxWidth: '80%',
            background: msg.role === 'user' ? '#333' : '#f5f5f5',
            color: msg.role === 'user' ? 'white' : '#111',
            padding: '0.75rem 1rem',
            borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          }}>
            {msg.steps && <AgentSteps steps={msg.steps} />}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.content}</div>
            {msg.streaming && <span style={{ opacity: 0.5 }}>▋</span>}
            {msg.sources && msg.sources.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                📎 {msg.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener" style={{ marginRight: '0.5rem', color: '#555' }}>{s.title}</a>
                ))}
              </div>
            )}
            {msg.related && msg.related.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                📚 延伸閱讀：{msg.related.map((r, i) => (
                  <a key={i} href={`/posts/${r.slug}`} style={{ marginRight: '0.5rem', color: '#555' }}>{r.title}</a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
