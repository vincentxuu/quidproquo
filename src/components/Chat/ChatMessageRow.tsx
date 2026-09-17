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
import { BookOpen, Brain, FileSearch, Pen, ShieldCheck, TriangleAlert } from 'lucide-react'
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
  const normalizedContent = useMemo(
    () => (msg.content ? normalizeMarkdownInput(msg.content) : ''),
    [msg.content],
  )

  return (
    <Message from={msg.role} className="max-w-full">
      <MessageContent>
        {typeof msg.confidence === 'number' && msg.role === 'assistant' && (
          <span className="text-xs text-muted-foreground">{formatConfidence(msg.confidence)}</span>
        )}
        {msg.steps && msg.steps.length > 0 && (
          <ChatChainOfThought steps={msg.steps} streaming={msg.streaming} />
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

interface AgentStep {
  agent: string
  status: 'started' | 'completed'
  chunks_found?: number
  sources_found?: number
  evidence_chunks?: number
}

const stepMeta: Record<string, { label: string; icon: typeof Brain }> = {
  Planner: { label: '分析問題', icon: Brain },
  Research: { label: '搜尋文章', icon: FileSearch },
  Writer: { label: '生成回應', icon: Pen },
  Validation: { label: '格式驗證', icon: ShieldCheck },
  Critic: { label: '品質檢查', icon: BookOpen },
  Fallback: { label: '降級輸出', icon: TriangleAlert },
}

function ChatChainOfThought({ steps, streaming }: { steps: AgentStep[]; streaming?: boolean }) {
  const hasActiveStep = steps.some((s) => s.status === 'started')
  return (
    <ChainOfThought defaultOpen={hasActiveStep || Boolean(streaming)} className="mb-1">
      <ChainOfThoughtHeader>思考過程</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {steps.map((s, i) => {
          const meta = stepMeta[s.agent] ?? { label: s.agent, icon: Brain }
          const isLast = i === steps.length - 1
          const status = s.status === 'completed' ? 'complete' : isLast && streaming ? 'active' : 'pending'
          const description =
            s.sources_found !== undefined
              ? `找到 ${s.sources_found} 篇相關文章`
              : s.chunks_found !== undefined
                ? `${s.chunks_found} 個相關段落`
                : undefined

          return (
            <ChainOfThoughtStep
              key={`${s.agent}:${i}`}
              icon={meta.icon}
              label={meta.label}
              description={description}
              status={status}
            >
              {s.sources_found !== undefined && s.sources_found > 0 && (
                <ChainOfThoughtSearchResults>
                  <ChainOfThoughtSearchResult>{s.sources_found} 篇</ChainOfThoughtSearchResult>
                  {s.evidence_chunks !== undefined && (
                    <ChainOfThoughtSearchResult>{s.evidence_chunks} 段引用</ChainOfThoughtSearchResult>
                  )}
                </ChainOfThoughtSearchResults>
              )}
            </ChainOfThoughtStep>
          )
        })}
      </ChainOfThoughtContent>
    </ChainOfThought>
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
