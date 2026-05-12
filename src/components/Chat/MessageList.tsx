import { type CSSProperties, type ReactNode, useMemo } from 'react'
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
  return (
    <div className="message-container chat-message-list" style={styles.container}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={msg.role === 'user' ? 'user-message' : 'assistant-message'}
          style={{
            ...styles.message,
            ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
          }}
        >
          {msg.role === 'assistant' && <Avatar role={msg.role} />}
          <div style={msg.role === 'user' ? styles.userBubble : styles.assistantPanel}>
            {typeof msg.confidence === 'number' && msg.role === 'assistant' ? (
              <div style={styles.messageHeader}>
                <span style={styles.confidence}>{formatConfidence(msg.confidence)}</span>
              </div>
            ) : null}
            {msg.steps && <AgentSteps steps={msg.steps} />}
            <div className="message-content" style={styles.content}>
              {msg.content ? <MarkdownContent content={msg.content} role={msg.role} /> : null}
              {msg.streaming && <ThinkingIndicator compact={Boolean(msg.content)} />}
              {msg.sources && msg.sources.length > 0 && <LinkSection label="參考來源" links={msg.sources} />}
              {msg.related && msg.related.length > 0 && <LinkSection label="延伸閱讀" links={msg.related} />}
            </div>
          </div>
          {msg.role === 'user' && <Avatar role={msg.role} />}
        </div>
      ))}
      <style>{`
        .chat-thinking {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          min-height: 2rem;
          padding: 0.45rem 0.65rem;
          border-radius: 8px;
          background: color-mix(in srgb, var(--brand-50) 74%, var(--bg-card));
          color: var(--text-secondary);
          overflow: hidden;
        }

        .chat-thinking::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 45%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
          animation: chat-thinking-shine 1.45s ease-in-out infinite;
          transform: translateX(-120%);
        }

        .chat-thinking-orbit {
          position: relative;
          z-index: 1;
          width: 1rem;
          height: 1rem;
          flex: 0 0 1rem;
          border: 2px solid color-mix(in srgb, var(--brand-500) 28%, transparent);
          border-top-color: var(--brand-500);
          border-radius: 50%;
          animation: chat-thinking-orbit 1s linear infinite;
        }

        .chat-thinking-orbit::after {
          content: "";
          position: absolute;
          inset: 0.18rem;
          border-radius: 50%;
          background: color-mix(in srgb, var(--brand-500) 16%, transparent);
          animation: chat-thinking-pulse 1.2s ease-in-out infinite;
        }

        .chat-thinking-orbit-dot {
          position: absolute;
          top: -0.16rem;
          left: 50%;
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 50%;
          background: var(--brand-500);
          box-shadow: 0 0 0 0.18rem color-mix(in srgb, var(--brand-500) 14%, transparent);
          transform: translateX(-50%);
        }

        .chat-thinking-label {
          position: relative;
          z-index: 1;
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1;
        }

        .chat-thinking-dots {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.24rem;
        }

        .chat-thinking-dot {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: var(--brand-500);
          animation: chat-thinking-bounce 0.9s ease-in-out infinite;
        }

        .chat-thinking-dot:nth-child(2) {
          animation-delay: 0.13s;
        }

        .chat-thinking-dot:nth-child(3) {
          animation-delay: 0.26s;
        }

        .chat-thinking-compact {
          min-height: auto;
          margin-left: 0.25rem;
          padding: 0;
          vertical-align: baseline;
          background: transparent;
        }

        .chat-thinking-compact::before,
        .chat-thinking-compact .chat-thinking-orbit,
        .chat-thinking-compact .chat-thinking-label {
          display: none;
        }

        .chat-thinking-compact .chat-thinking-dot {
          width: 0.32rem;
          height: 0.32rem;
          opacity: 0.85;
        }

        @keyframes chat-thinking-bounce {
          0%, 80%, 100% { transform: translateY(0) scale(0.78); opacity: 0.45; }
          40% { transform: translateY(-0.26rem) scale(1); opacity: 1; }
        }

        @keyframes chat-thinking-orbit {
          to { transform: rotate(360deg); }
        }

        @keyframes chat-thinking-pulse {
          0%, 100% { transform: scale(0.75); opacity: 0.45; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }

        @keyframes chat-thinking-shine {
          0% { transform: translateX(-120%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(240%); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .chat-thinking::before,
          .chat-thinking-orbit,
          .chat-thinking-orbit::after,
          .chat-thinking-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

function ThinkingIndicator({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? 'chat-thinking chat-thinking-compact' : 'chat-thinking'} aria-label="正在產生回覆">
      <span className="chat-thinking-orbit" aria-hidden="true">
        <span className="chat-thinking-orbit-dot" />
      </span>
      <span className="chat-thinking-label">思考中</span>
      <span className="chat-thinking-dots" aria-hidden="true">
        <span className="chat-thinking-dot" />
        <span className="chat-thinking-dot" />
        <span className="chat-thinking-dot" />
      </span>
    </span>
  )
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  const src = role === 'user'
    ? 'https://api.dicebear.com/9.x/thumbs/svg?seed=quidproquo-reader&backgroundColor=d1e8d1&shapeColor=2d4a2d'
    : 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=quidproquo-ask-ai&backgroundColor=e8f5e8&textureChance=0'
  const alt = role === 'user' ? '你的頭像' : 'Ask AI 頭像'

  return <img src={src} alt={alt} style={styles.avatar} loading="lazy" referrerPolicy="no-referrer" />
}

function MarkdownContent({ content, role }: { content: string; role: 'user' | 'assistant' }) {
  const normalized = useMemo(() => normalizeMarkdownInput(content), [content])
  const linkColor = role === 'user' ? 'var(--brand-100)' : 'var(--brand-500)'

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        p: ({ children }) => <p style={styles.paragraph}>{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ ...styles.link, color: linkColor }}>
            {formatLinkChildren(href, children)}
          </a>
        ),
        ul: ({ children }) => <ul style={styles.list}>{children}</ul>,
        ol: ({ children }) => <ol style={styles.list}>{children}</ol>,
        li: ({ children }) => <li style={styles.listItem}>{children}</li>,
        strong: ({ children }) => <strong style={styles.strong}>{children}</strong>,
        em: ({ children }) => <em style={styles.emphasis}>{children}</em>,
        blockquote: ({ children }) => <blockquote style={styles.blockquote}>{children}</blockquote>,
        h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
        h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
        h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
        table: ({ children }) => (
          <div style={styles.tableScroller}>
            <table style={styles.table}>{children}</table>
          </div>
        ),
        th: ({ children }) => <th style={styles.tableHeader}>{children}</th>,
        td: ({ children }) => <td style={styles.tableCell}>{children}</td>,
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

function LinkSection({ label, links }: { label: string; links: LinkLike[] }) {
  const normalizedLinks = normalizeLinks(links)
  if (normalizedLinks.length === 0) return null

  return (
    <div className="sources-container" style={styles.linkSection}>
      <div style={styles.sectionLabel}>{label}</div>
      <div style={styles.linkList}>
        {normalizedLinks.map((link, index) => (
          <a key={`${link.url}:${link.title}`} href={link.url} target="_blank" rel="noopener noreferrer" style={styles.linkCard}>
            <span style={styles.linkIndex}>{String(index + 1).padStart(2, '0')}</span>
            <span style={styles.linkBody}>
              <span style={styles.linkTitle}>{link.title}</span>
              {link.description && <small style={styles.linkDescription}>{link.description}</small>}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

function normalizeMarkdownInput(content: string): string {
  return compactBareUrls(htmlFragmentsToMarkdown(decodeHtmlEntities(content))).trim()
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

function compactBareUrls(input: string): string {
  return input.replace(/(^|[\s(])((?:https?:\/\/|\/posts\/)[^\s<>)\]]+)/g, (match, prefix, url, offset, fullText) => {
    if (prefix === '(' && fullText[offset - 1] === ']') return match
    const trailing = String(url).match(/[.,;:!?]+$/)?.[0] ?? ''
    const cleanUrl = String(url).slice(0, String(url).length - trailing.length)
    if (!cleanUrl) return match
    return `${prefix}[${linkTextFromUrl(cleanUrl)}](${cleanUrl})${trailing}`
  })
}

function formatLinkChildren(href: string | undefined, children: ReactNode): ReactNode {
  const text = reactText(children).trim()
  if (!href || !isUrlLike(text)) return children

  return linkTextFromUrl(href)
}

function reactText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactText).join('')
  return ''
}

function isUrlLike(value: string): boolean {
  return /^(https?:\/\/|\/posts\/)/.test(value)
}

function linkTextFromUrl(value: string): string {
  const fallback = '查看來源'

  try {
    const url = value.startsWith('/posts/') ? new URL(value, 'https://quidproquo.cc') : new URL(value)
    const postSlug = url.pathname.match(/\/posts\/(?:[^/]+\/)?([^/]+)\/?$/)?.[1]
    if (postSlug) return slugToTitle(postSlug)
    return url.hostname.replace(/^www\./, '')
  } catch {
    return fallback
  }
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .split('-')
    .filter(Boolean)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(' ') || '查看文章'
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

function formatConfidence(confidence: number): string {
  const normalized = confidence <= 1 ? confidence * 100 : confidence
  return `${Math.round(normalized)}% confidence`
}

const styles: Record<string, CSSProperties> = {
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto' as const,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    background: 'var(--bg-subtle)',
  },
  message: {
    maxWidth: '100%',
    minWidth: 0,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
  },
  userMessage: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    width: 'min(100%, 82%)',
  },
  assistantMessage: {
    alignSelf: 'stretch',
  },
  avatar: {
    width: '2rem',
    height: '2rem',
    flex: '0 0 2rem',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
  },
  userBubble: {
    minWidth: 0,
    padding: '0.75rem 0.875rem',
    borderRadius: 8,
    background: 'var(--brand-900)',
    color: 'var(--bg-page)',
    boxShadow: 'var(--shadow-card-hover)',
  },
  assistantPanel: {
    minWidth: 0,
    flex: 1,
    padding: '0.95rem 1rem',
    borderRadius: 8,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-card-hover)',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginBottom: '0.35rem',
  },
  confidence: {
    flexShrink: 0,
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  content: {
    minWidth: 0,
    color: 'inherit',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    overflowWrap: 'anywhere' as const,
    wordBreak: 'break-word' as const,
  },
  paragraph: {
    margin: '0 0 0.85rem',
    lineHeight: 1.7,
    overflowWrap: 'anywhere' as const,
  },
  list: {
    margin: '0 0 0.9rem',
    paddingLeft: '1.35rem',
  },
  listItem: {
    margin: '0.28rem 0',
    paddingLeft: '0.1rem',
  },
  strong: {
    fontWeight: 700,
  },
  emphasis: {
    color: 'inherit',
  },
  link: {
    textDecoration: 'underline',
    textUnderlineOffset: '0.18em',
    fontWeight: 600,
  },
  h1: {
    fontSize: '1.16rem',
    lineHeight: 1.4,
    margin: '0 0 0.7rem',
  },
  h2: {
    fontSize: '1.08rem',
    lineHeight: 1.45,
    margin: '1rem 0 0.55rem',
  },
  h3: {
    fontSize: '1rem',
    lineHeight: 1.45,
    margin: '0.75rem 0 0.45rem',
  },
  blockquote: {
    margin: '0 0 0.9rem',
    padding: '0.05rem 0 0.05rem 0.85rem',
    borderLeft: '3px solid var(--brand-300)',
    color: 'var(--text-secondary)',
  },
  pre: {
    margin: '0 0 0.9rem',
    maxWidth: '100%',
    overflowX: 'auto' as const,
    borderRadius: 8,
    background: 'var(--bg-code)',
    border: '1px solid var(--border)',
  },
  codeBlock: {
    display: 'block',
    padding: '0.9rem',
    color: '#f8fafc',
    fontSize: '0.82rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    whiteSpace: 'pre' as const,
  },
  inlineCode: {
    padding: '0.12rem 0.3rem',
    borderRadius: 4,
    background: 'var(--brand-50)',
    color: 'var(--brand-700)',
    fontSize: '0.9em',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  tableScroller: {
    maxWidth: '100%',
    overflowX: 'auto',
    margin: '0 0 0.95rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.88rem',
    lineHeight: 1.55,
  },
  tableHeader: {
    padding: '0.55rem 0.65rem',
    textAlign: 'left',
    background: 'var(--bg-subtle)',
    borderBottom: '1px solid var(--border)',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  tableCell: {
    padding: '0.55rem 0.65rem',
    borderTop: '1px solid var(--border)',
    verticalAlign: 'top',
  },
  linkSection: {
    marginTop: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border)',
  },
  sectionLabel: {
    marginBottom: '0.55rem',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    lineHeight: 1.2,
    fontWeight: 700,
  },
  linkList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.5rem',
    minWidth: 0,
    maxWidth: '100%',
  },
  linkCard: {
    display: 'grid',
    gridTemplateColumns: '2rem minmax(0, 1fr)',
    gap: '0.55rem',
    minWidth: 0,
    maxWidth: '100%',
    padding: '0.65rem',
    borderRadius: 8,
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    overflowWrap: 'anywhere' as const,
  },
  linkIndex: {
    color: 'var(--text-muted)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '0.76rem',
    lineHeight: 1.45,
  },
  linkBody: {
    minWidth: 0,
  },
  linkTitle: {
    display: 'block',
    color: 'var(--brand-900)',
    fontWeight: 700,
    lineHeight: 1.45,
  },
  linkDescription: {
    display: 'block',
    marginTop: '0.2rem',
    color: 'var(--text-secondary)',
    fontWeight: 400,
    lineHeight: 1.45,
  },
}
