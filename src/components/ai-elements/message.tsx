import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type * as React from 'react'

import { cn } from '@/lib/utils'

type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  from: 'user' | 'assistant' | 'system'
}

export function Message({ from, className, ...props }: MessageProps) {
  return (
    <article
      data-from={from}
      className={cn(
        'group/message flex w-full gap-3 border-b border-[var(--admin-border)] px-4 py-3 last:border-b-0',
        from === 'user' && 'bg-[var(--admin-color-info-soft)]',
        from === 'system' && 'bg-[var(--admin-color-surface-subtle)]',
        className,
      )}
      {...props}
    />
  )
}

export function MessageLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-1 text-xs font-semibold text-[var(--admin-text-muted)]', className)}
      {...props}
    />
  )
}

export function MessageContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-w-0 flex-1 text-sm leading-6 text-[var(--admin-text)]', className)} {...props} />
}

export function MessageResponse({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('space-y-2 whitespace-pre-wrap break-words text-[var(--admin-text)]', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: props => <a className="text-[var(--admin-accent)] underline underline-offset-2" {...props} />,
          code: props => <code className="break-words rounded bg-[var(--admin-color-surface-subtle)] px-1 py-0.5 text-xs" {...props} />,
          pre: props => (
            <pre
              className="my-3 max-h-80 overflow-auto rounded-[var(--admin-radius-sm)] bg-[var(--admin-color-surface-subtle)] p-3 text-xs leading-5 whitespace-pre-wrap"
              {...props}
            />
          ),
          ul: props => <ul className="my-2 list-disc pl-5" {...props} />,
          ol: props => <ol className="my-2 list-decimal pl-5" {...props} />,
          h1: props => <h3 className="mt-3 text-base font-semibold" {...props} />,
          h2: props => <h3 className="mt-3 text-base font-semibold" {...props} />,
          h3: props => <h4 className="mt-3 text-sm font-semibold" {...props} />,
          p: props => <p className="my-2" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
