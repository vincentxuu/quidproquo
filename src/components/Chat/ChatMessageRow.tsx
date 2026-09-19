import { type CSSProperties, type ReactNode, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ActivityLine } from './Activity'
import { useChatLocale } from './locale'
import type { Message as ChatMessage } from './types'

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

interface NormalizedLink {
  title: string
  url: string
  description?: string
}

export function ChatMessageRow({ message: msg }: { message: ChatMessage }) {
  const isAssistant = msg.role === 'assistant'
  const { t } = useChatLocale()

  return (
    <div
      key={msg.id}
      className={isAssistant ? 'assistant-message' : 'user-message'}
      style={{
        ...styles.message,
        ...(isAssistant ? styles.assistantMessage : styles.userMessage),
      }}
    >
      {isAssistant && <Avatar role="assistant" />}
      <div style={isAssistant ? styles.assistantPanel : styles.userBubble}>
        {isAssistant && (
          <ActivityLine steps={msg.steps} streaming={msg.streaming === true} hasContent={Boolean(msg.content)} />
        )}
        <div className="message-content" style={styles.content}>
          {msg.content ? <MarkdownContent content={msg.content} role={msg.role} /> : null}
          {msg.sources && msg.sources.length > 0 && <LinkSection label={t('chat.sources')} links={msg.sources} />}
          {msg.related && msg.related.length > 0 && <LinkSection label={t('chat.related')} links={msg.related} />}
        </div>
      </div>
      {!isAssistant && <Avatar role="user" />}
      <style>{`
        .message-content p:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  )
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  const src = role === 'user'
    ? 'https://api.dicebear.com/9.x/thumbs/svg?seed=quidproquo-reader&backgroundColor=d1e8d1&shapeColor=2d4a2d'
    : 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=quidproquo-ask-ai&backgroundColor=e8f5e8&textureChance=0'
  const alt = role === 'user' ? 'You' : 'Ask AI'

  return <img src={src} alt={alt} style={styles.avatar} loading="lazy" referrerPolicy="no-referrer" />
}

interface LinkFallbacks {
  source: string
  post: string
}

function MarkdownContent({ content, role }: { content: string; role: 'user' | 'assistant' }) {
  const { t } = useChatLocale()
  const fallbacks = useMemo<LinkFallbacks>(() => ({ source: t('chat.link.source'), post: t('chat.link.post') }), [t])
  const normalized = useMemo(() => normalizeMarkdownInput(content, fallbacks), [content, fallbacks])
  const linkColor = role === 'user' ? 'var(--brand-100)' : 'var(--brand-500)'

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        p: ({ children }) => <p style={styles.paragraph}>{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ ...styles.link, color: linkColor }}>
            {formatLinkChildren(href, children, fallbacks)}
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

const styles: Record<string, CSSProperties> = {
  avatar: {
    width: '2rem',
    height: '2rem',
    flex: '0 0 2rem',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
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

function normalizeMarkdownInput(content: string, fallbacks: LinkFallbacks): string {
  return compactBareUrls(htmlFragmentsToMarkdown(decodeHtmlEntities(content)), fallbacks).trim()
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

function compactBareUrls(input: string, fallbacks: LinkFallbacks): string {
  return input.replace(/(^|[\s(])((?:https?:\/\/|\/posts\/)[^\s<>)\]]+)/g, (match, prefix, url, offset, fullText) => {
    if (prefix === '(' && fullText[offset - 1] === ']') return match
    const trailing = String(url).match(/[.,;:!?]+$/)?.[0] ?? ''
    const cleanUrl = String(url).slice(0, String(url).length - trailing.length)
    if (!cleanUrl) return match
    return `${prefix}[${linkTextFromUrl(cleanUrl, fallbacks)}](${cleanUrl})${trailing}`
  })
}

function formatLinkChildren(href: string | undefined, children: ReactNode, fallbacks: LinkFallbacks): ReactNode {
  const text = reactText(children).trim()
  if (!href || !isUrlLike(text)) return children

  return linkTextFromUrl(href, fallbacks)
}

function reactText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactText).join('')
  return ''
}

function isUrlLike(value: string): boolean {
  return /^(https?:\/\/|\/posts\/)/.test(value)
}

function linkTextFromUrl(value: string, fallbacks: LinkFallbacks): string {
  try {
    const url = value.startsWith('/posts/') ? new URL(value, 'https://quidproquo.cc') : new URL(value)
    const postSlug = url.pathname.match(/\/posts\/(?:[^/]+\/)?([^/]+)\/?$/)?.[1]
    if (postSlug) return slugToTitle(postSlug, fallbacks.post)
    return url.hostname.replace(/^www\./, '')
  } catch {
    return fallbacks.source
  }
}

function slugToTitle(slug: string, fallback: string): string {
  return slug
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .split('-')
    .filter(Boolean)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(' ') || fallback
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

