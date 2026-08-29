import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Conversation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex max-h-[70vh] min-h-80 flex-col overflow-hidden rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)]',
        className,
      )}
      {...props}
    />
  )
}

export const ConversationContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex-1 overflow-y-auto p-4', className)} {...props} />,
)
ConversationContent.displayName = 'ConversationContent'
