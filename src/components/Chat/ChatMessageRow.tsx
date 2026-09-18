import { useMemo } from 'react'
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
} from '@/components/ai-elements/chain-of-thought'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import { Sources, SourcesTrigger, SourcesContent, Source } from '@/components/ai-elements/sources'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { Brain, FileSearch } from 'lucide-react'
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

interface StepDisplay {
  label: string
  description?: string
  status: 'pending' | 'active' | 'complete'
  tool?: string
  results?: { title: string; url: string; slug?: string; type?: string }[]
}

export function ChatMessageRow({ message: msg }: { message: ChatMessage }) {
  const normalizedContent = useMemo(
    () => (msg.content ? normalizeMarkdownInput(msg.content) : ''),
    [msg.content],
  )

  // 轉換 steps 為前端可用格式
  const displaySteps = useMemo<StepDisplay[]>(() => {
    if (!msg.steps || msg.steps.length === 0) return []
    return msg.steps.map((s) => {
      // 轉換狀態：from legacy 'started'/'completed' to 'active'/'complete'
      const statusMap: Record<string, StepDisplay['status']> = {
        started: 'active',
        completed: 'complete',
        active: 'active',
        complete: 'complete',
        pending: 'pending',
      }
      const status = statusMap[s.status] || 'active'
      
      return {
        label: s.label || '處理中',
        description: s.description,
        status,
        tool: (s as any).tool,
        results: (s as any).results,
      }
    })
  }, [msg.steps])

  return (
    <Message from={msg.role} className="max-w-full">
      <MessageContent>
        {typeof msg.confidence === 'number' && msg.role === 'assistant' && (
          <span className="text-xs text-muted-foreground">{formatConfidence(msg.confidence)}</span>
        )}
        {displaySteps.length > 0 && (
          <ChainOfThought defaultOpen={displaySteps.some(s => s.status === 'active')} className="mb-1">
            <ChainOfThoughtHeader>思考過程</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              {displaySteps.map((s, i) => {
                const searchResults = s.results && s.results.length > 0 ? (
                  <ChainOfThoughtSearchResults>
                    {s.results.map(r => (
                      <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="inline-flex">
                        <ChainOfThoughtSearchResult>{r.title}</ChainOfThoughtSearchResult>
                      </a>
                    ))}
                  </ChainOfThoughtSearchResults>
                ) : null
                return (
                  <ChainOfThoughtStep
                    key={`${s.label}:${i}`}
                    icon={s.tool === 'search_posts' ? FileSearch : Brain}
                    label={s.label}
                    description={s.description}
                    status={s.status}
                  >
                    {searchResults}
                  </ChainOfThoughtStep>
                )
              })}
            </ChainOfThoughtContent>
          </ChainOfThought>
        )}
        {normalizedContent && <MessageResponse>{normalizedContent}</MessageResponse>}
        {msg.streaming && (
          <Shimmer as="span" className="text-sm text-muted-foreground" duration={1.5}>
            {msg.content ? '...' : '思考中...'}
          </Shimmer>
        )}
        {msg.sources && msg.sources.length > 0 && (
          <ChatSources label="參考來源" links={msg.sources} />
        )}
        {msg.related && msg.related.length > 0 && (
          <ChatSources label="延伸閱讀" links={msg.related} />
        )}
      </MessageContent>
    </Message>
  )
}

function ChatSources({ label, links }: { label: string; links: LinkLike[] }) {
  const normalizedLinks = normalizeLinks(links)
  if (normalizedLinks.length === 0) return null

  return (
    <div className="mt-3 border-t border-border pt-2">
      <Sources defaultOpen>
        <SourcesTrigger count={normalizedLinks.length}>
          <span className="text-xs font-medium text-muted-foreground">{label}（{normalizedLinks.length}）</span>
        </SourcesTrigger>
        <SourcesContent>
          {normalizedLinks.map((link) => (
            <Source key={`${link.url}:${link.title}`} href={link.url} title={link.title} />
          ))}
        </SourcesContent>
      </Sources>
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
