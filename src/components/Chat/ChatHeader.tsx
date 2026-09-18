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
import {
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SquareIcon,
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
  title = 'Ask AI',
  subtitle = '部落格文章搜尋與問答助手',
  status,
  actions,
  onExpandToggle,
  isExpanded,
  onClose,
  embedded = false,
  className,
  extraActions,
}: ChatHeaderProps) {
  const showStatus = status === 'streaming'

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
            <h2 className="truncate text-sm font-semibold text-primary">{title}</h2>
            {showStatus && (
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums"
                style={{
                  borderColor: 'var(--brand-200)',
                  color: 'var(--brand-700)',
                  background: 'var(--brand-50)',
                }}>
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: 'var(--brand-500)' }} />
                  <span className="relative inline-flex size-1.5 rounded-full" style={{ background: 'var(--brand-500)' }} />
                </span>
                回覆中…
              </span>
            )}
          </div>
          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
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
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={onExpandToggle}
                aria-label={isExpanded ? '縮小' : '展開'}
              >
                {isExpanded ? <MinimizeIcon className="size-4" /> : <MaximizeIcon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{isExpanded ? '縮小' : '展開'}</TooltipContent>
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
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={onClose}
                aria-label="關閉"
              >
                <CloseIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">關閉</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

interface ChatHeaderToolbarProps {
  messages: Message[]
  loading: boolean
  streaming: boolean
  onNewChat: () => void
  onStop?: () => void
  onCopyConversation?: () => void
  onDownloadConversation?: () => void
  className?: string
}

export function ChatHeaderToolbar({
  messages,
  streaming,
  onNewChat,
  onStop,
  onCopyConversation,
  onDownloadConversation,
  className,
}: ChatHeaderToolbarProps) {
  const hasMessages = messages.length > 1

  const handleCopy = useCallback(() => {
    const text = messages
      .map(m => `${m.role === 'user' ? '你' : 'AI'}：${m.content}`)
      .join('\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
    onCopyConversation?.()
  }, [messages, onCopyConversation])

  const handleDownload = useCallback(() => {
    const text = messages
      .map(m => `## ${m.role === 'user' ? '你' : 'AI'}\n\n${m.content}`)
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
  }, [messages, onDownloadConversation])

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Stop generation (only while streaming) */}
      {streaming && onStop && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={onStop}
                aria-label="停止生成"
              >
                <SquareIcon className="size-3.5 fill-current" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">停止生成</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Dropdown for management actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="更多選項"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onNewChat}>
            <PlusIcon className="mr-2 size-4" />
            新對話
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopy} disabled={!hasMessages}>
            <CopyIcon className="mr-2 size-4" />
            複製全文
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} disabled={!hasMessages}>
            <DownloadIcon className="mr-2 size-4" />
            下載 Markdown
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onNewChat}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            disabled={!hasMessages}
          >
            <Trash2Icon className="mr-2 size-4" />
            清除對話
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
