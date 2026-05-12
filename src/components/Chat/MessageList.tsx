import { useEffect, useMemo, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AgentSteps } from './AgentSteps'

type LinkLike =
  | string
  | {
      title?: unknown
      label?: unknown
      url?: unknown
      source_url?: unknown
      slug?: unknown
      description?: unknown
    }

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  steps?: { agent: string; status: 'started' | 'completed'; chunks_found?: number }[]
  sources?: LinkLike[]
  related?: LinkLike[]
  confidence?: number
  streaming?: boolean
}

interface NormalizedLink {
  title: string
  url: string
  description?: string
}

export function MessageList({ messages }: { messages: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <div className="message-container" style={styles.container}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={msg.role === 'user' ? 'user-message' : 'assistant-message'}
          style={{
            ...styles.message,
            ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
          }}
        >
          {msg.steps && <AgentSteps steps={msg.steps} />}
          <div className="message-content" style={styles.content}>
            {msg.content ? <MarkdownContent content={msg.content} role={msg.role} /> : null}
            {msg.streaming && <span className="streaming-indicator">▋</span>}
            {msg.sources && msg.sources.length > 0 && <LinkSection icon="📎" links={msg.sources} />}
            {msg.related && msg.related.length > 0 && <LinkSection label="延伸閱讀" links={msg.related} />}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}

function MarkdownContent({ content, role }: { content: string; role: 'user' | 'assistant' }) {
  const normalized = useMemo(() => normalizeMarkdownInput(content), [content])
  const linkColor = role === 'user' ? '#1d4ed8' : '#2563eb'

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        p: ({ children }) => <p style={styles.paragraph}>{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ ...styles.link, color: linkColor }}>
            {children}
          </a>
        ),
        ul: ({ children }) => <ul style={styles.list}>{children}</ul>,
        ol: ({ children }) => <ol style={styles.list}>{children}</ol>,
        li: ({ children }) => <li style={styles.listItem}>{children}</li>,
        strong: ({ children }) => <strong style={styles.strong}>{children}</strong>,
        h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
        h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
        h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
        code: ({ children, className }) => {
          const isBlock = Boolean(className)
          return (
            <code style={isBlock ? styles.codeBlock : styles.inlineCode} className={className}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => <pre style={styles.pre}>{children}</pre>,
      }}
    >
      {normalized}
    </ReactMarkdown>
  )
}

function LinkSection({ icon, label, links }: { icon?: string; label?: string; links: LinkLike[] }) {
  const normalizedLinks = normalizeLinks(links)
  if (normalizedLinks.length === 0) return null

  return (
    <div className="sources-container" style={styles.linkSection}>
      <span style={styles.sectionLabel}>{icon ?? label}</span>
      <div style={styles.linkList}>
        {normalizedLinks.map((link) => (
          <a key={`${link.url}:${link.title}`} href={link.url} target="_blank" rel="noopener noreferrer" style={styles.linkChip}>
            <span>{link.title}</span>
            {link.description && <small style={styles.linkDescription}>{link.description}</small>}
          </a>
        ))}
      </div>
    </div>
  )
}

function normalizeMarkdownInput(content: string): string {
  return htmlFragmentsToMarkdown(decodeHtmlEntities(content)).trim()
}

function htmlFragmentsToMarkdown(input: string): string {
  return input
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href, text) => {
      const label = stripTags(String(text)).trim() || String(href)
      return `[${label}](${href})`
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<\/?(ul|ol)\b[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div)\b[^>]*>/gi, '\n\n')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
}

function stripTags(value: string): string {
  return decodeHtmlEntities(value).replace(/<\/?[^>]+>/g, '')
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function normalizeLinks(items: LinkLike[]): NormalizedLink[] {
  return items
    .map((item) => {
      if (typeof item === 'string') return linkFromString(item)
      if (!item || typeof item !== 'object') return null

      const url = stringValue(item.url) || stringValue(item.source_url) || slugToPostUrl(stringValue(item.slug))
      if (!url) return null

      return {
        title: stringValue(item.title) || stringValue(item.label) || url,
        url,
        description: stringValue(item.description),
      }
    })
    .filter((link): link is NormalizedLink => Boolean(link))
}

function linkFromString(value: string): NormalizedLink | null {
  const markdownLink = value.match(/\[([^\]]+)\]\(([^)]+)\)/)
  if (markdownLink) return { title: markdownLink[1], url: markdownLink[2] }

  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//.test(trimmed) || trimmed.startsWith('/')) return { title: trimmed, url: trimmed }

  return { title: trimmed, url: `#` }
}

function slugToPostUrl(slug: string): string {
  if (!slug) return ''
  return slug.startsWith('/posts/') ? slug : `/posts/${slug}`
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

const styles = {
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto' as const,
    padding: '0.875rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  message: {
    maxWidth: '100%',
    minWidth: 0,
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '88%',
  },
  assistantMessage: {
    alignSelf: 'stretch',
  },
  content: {
    minWidth: 0,
    color: 'var(--text-primary, #222)',
    fontSize: '0.95rem',
    lineHeight: 1.65,
    overflowWrap: 'anywhere' as const,
    wordBreak: 'break-word' as const,
  },
  paragraph: {
    margin: '0 0 0.75rem',
    lineHeight: 1.65,
    overflowWrap: 'anywhere' as const,
  },
  list: {
    margin: '0 0 0.85rem',
    paddingLeft: '1.25rem',
  },
  listItem: {
    margin: '0.2rem 0',
  },
  strong: {
    fontWeight: 700,
  },
  link: {
    textDecoration: 'underline',
    textUnderlineOffset: '0.18em',
  },
  h1: {
    fontSize: '1.12rem',
    lineHeight: 1.4,
    margin: '0 0 0.65rem',
  },
  h2: {
    fontSize: '1.05rem',
    lineHeight: 1.45,
    margin: '0.85rem 0 0.5rem',
  },
  h3: {
    fontSize: '1rem',
    lineHeight: 1.45,
    margin: '0.75rem 0 0.45rem',
  },
  pre: {
    margin: '0 0 0.85rem',
    maxWidth: '100%',
    overflowX: 'auto' as const,
    borderRadius: 8,
    background: '#1f2937',
  },
  codeBlock: {
    display: 'block',
    padding: '0.85rem',
    color: '#f9fafb',
    fontSize: '0.82rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    whiteSpace: 'pre' as const,
  },
  inlineCode: {
    padding: '0.12rem 0.3rem',
    borderRadius: 4,
    background: '#f1f5f9',
    fontSize: '0.9em',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  linkSection: {
    marginTop: '0.75rem',
    padding: '0.65rem 0.75rem',
    borderRadius: 8,
    background: 'rgba(0, 0, 0, 0.035)',
    display: 'flex',
    gap: '0.55rem',
    alignItems: 'flex-start',
    minWidth: 0,
    maxWidth: '100%',
  },
  sectionLabel: {
    flexShrink: 0,
    fontWeight: 700,
  },
  linkList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.45rem',
    minWidth: 0,
    maxWidth: '100%',
  },
  linkChip: {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    color: 'var(--text-primary, #222)',
    textDecoration: 'none',
    fontWeight: 600,
    overflowWrap: 'anywhere' as const,
  },
  linkDescription: {
    display: 'block',
    marginTop: '0.1rem',
    color: 'var(--text-secondary, #666)',
    fontWeight: 400,
  },
}
