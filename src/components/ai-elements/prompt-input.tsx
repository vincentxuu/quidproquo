import type * as React from 'react'

import { cn } from '@/lib/utils'

export function PromptInput({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className={cn(
        'mt-3 flex items-end gap-2 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-2',
        className,
      )}
      {...props}
    />
  )
}

export function PromptInputTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-14 flex-1 resize-y rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[rgba(47,111,70,0.18)]',
        className,
      )}
      {...props}
    />
  )
}

export function PromptInputFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-2', className)} {...props} />
}
