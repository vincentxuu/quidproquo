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
        'group/message flex w-full gap-3 py-2',
        from === 'user' && 'justify-end',
        from === 'assistant' && 'justify-start',
        from === 'system' && 'justify-center py-1',
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
  return (
    <div
      className={cn(
        'min-w-0 max-w-[min(760px,100%)] rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--admin-text)] shadow-[0_1px_2px_rgba(31,59,41,0.04)]',
        'group-data-[from=user]/message:max-w-[min(680px,86%)] group-data-[from=user]/message:border-[var(--brand-200)] group-data-[from=user]/message:bg-[var(--brand-50)]',
        'group-data-[from=system]/message:max-w-[min(760px,100%)] group-data-[from=system]/message:border-transparent group-data-[from=system]/message:bg-transparent group-data-[from=system]/message:px-0 group-data-[from=system]/message:py-1 group-data-[from=system]/message:shadow-none',
        className,
      )}
      {...props}
    />
  )
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
          h1: props => <h3 className="mt-3 text-base font-semibold first:mt-0" {...props} />,
          h2: props => <h3 className="mt-3 text-base font-semibold first:mt-0" {...props} />,
          h3: props => <h4 className="mt-3 text-sm font-semibold first:mt-0" {...props} />,
          p: props => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
