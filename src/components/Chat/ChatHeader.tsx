import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Message } from './types'
import { useChatLocale } from './locale'
import {
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'

interface ChatHeaderProps {
  title?: string
  subtitle?: string
  /** Show a status badge — e.g. "streaming", "idle" */
  status?: 'idle' | 'streaming'
  /** Allow caller to override the entire action slot */
  actions?: React.ReactNode
  /** Collapse / expand controls for floating mode */
  onExpandToggle?: () => void
  isExpanded?: boolean
  onClose?: () => void
  embedded?: boolean
  className?: string
  /** Extra controls shown in the primary row */
  extraActions?: React.ReactNode
}

export function ChatHeader({
  title,
  subtitle,
  status,
  actions,
  onExpandToggle,
  isExpanded,
  onClose,
  embedded = false,
  className,
  extraActions,
}: ChatHeaderProps) {
  const { t } = useChatLocale()
  const showStatus = status === 'streaming'
  const resolvedTitle = title ?? t('chat.title')
  const resolvedSubtitle = subtitle ?? t('chat.header.subtitle')

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-3 border-b px-3.5 py-2.5 sm:px-4',
        'transition-colors',
        className
      )}
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
    >
      {/* Left: Title & Status */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-500)] text-white">
          <SparkleIcon className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 style={{ margin: 0 }} className="truncate text-sm leading-5 font-semibold text-primary">{resolvedTitle}</h2>
            {showStatus && (
              <span role="status" className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums"
                style={{
                  borderColor: 'var(--brand-200)',
                  color: 'var(--brand-700)',
                  background: 'var(--brand-50)',
                }}>
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: 'var(--brand-500)' }} />
                  <span className="relative inline-flex size-1.5 rounded-full" style={{ background: 'var(--brand-500)' }} />
                </span>
                {t('chat.status.replying')}
              </span>
            )}
          </div>
          {resolvedSubtitle && (
            <p style={{ margin: 0 }} className="truncate text-[11px] leading-4 text-muted-foreground">{resolvedSubtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {extraActions}
        {actions ?? (
          <HeaderActions
            onExpandToggle={onExpandToggle}
            isExpanded={isExpanded}
            onClose={onClose}
            embedded={embedded}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface HeaderActionsProps {
  onExpandToggle?: () => void
  isExpanded?: boolean
  onClose?: () => void
  embedded?: boolean
}

function HeaderActions({ onExpandToggle, isExpanded, onClose, embedded }: HeaderActionsProps) {
  const { t } = useChatLocale()
  const expandLabel = isExpanded ? t('chat.action.collapse') : t('chat.action.expand')
  return (
    <>
      {!embedded && onExpandToggle && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7 chat-icon-btn"
                onClick={onExpandToggle}
                aria-label={expandLabel}
              >
                {isExpanded ? <MinimizeIcon className="size-4" /> : <MaximizeIcon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{expandLabel}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {onClose && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7 chat-icon-btn"
                onClick={onClose}
                aria-label={t('chat.action.close')}
              >
                <CloseIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t('chat.action.close')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

interface ChatHeaderToolbarProps {
  messages: Message[]
  onNewChat: () => void
  onCopyConversation?: () => void
  onDownloadConversation?: () => void
  className?: string
}

export function ChatHeaderToolbar({
  messages,
  onNewChat,
  onCopyConversation,
  onDownloadConversation,
  className,
}: ChatHeaderToolbarProps) {
  const hasMessages = messages.length > 1
  const { t } = useChatLocale()
  const you = t('chat.transcript.you')

  const handleCopy = useCallback(() => {
    const text = messages
      .map(m => `${m.role === 'user' ? you : 'AI'}: ${m.content}`)
      .join('\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
    onCopyConversation?.()
  }, [messages, onCopyConversation, you])

  const handleDownload = useCallback(() => {
    const text = messages
      .map(m => `## ${m.role === 'user' ? you : 'AI'}\n\n${m.content}`)
      .join('\n\n') + '\n'
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chat-${new Date().toISOString().slice(0, 10)}.md`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    onDownloadConversation?.()
  }, [messages, onDownloadConversation, you])

  // 空對話沒有東西可新開、複製或清除，整組隱藏（比照 DocSearch）
  if (!hasMessages) return null

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 chat-icon-btn"
              onClick={onNewChat}
              aria-label={t('chat.action.new')}
            >
              <PlusIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t('chat.action.new')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 次要與破壞性動作收進 ⋯ */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 chat-icon-btn"
            aria-label={t('chat.action.more')}
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopy}>
            <CopyIcon className="mr-2 size-4" />
            {t('chat.action.copy')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <DownloadIcon className="mr-2 size-4" />
            {t('chat.action.download')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onNewChat}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2Icon className="mr-2 size-4" />
            {t('chat.action.clear')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Inline icons (thin stroke, close to the original lucide aesthetic) */

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}
