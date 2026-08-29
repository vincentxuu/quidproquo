import { ChevronRight } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Reasoning({ className, ...props }: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <details
      className={cn(
        'group/reasoning my-2 overflow-hidden rounded-[var(--admin-radius-sm)] border border-dashed border-[var(--admin-border)]',
        className,
      )}
      {...props}
    />
  )
}

export function ReasoningTrigger({ children = 'Thinking' }: { children?: React.ReactNode }) {
  return (
    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--admin-text-muted)] [&::-webkit-details-marker]:hidden">
      <ChevronRight className="size-3 transition-transform group-open/reasoning:rotate-90" />
      {children}
    </summary>
  )
}

export function ReasoningContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-3 pb-3 text-sm leading-6 text-[var(--admin-text-muted)]', className)} {...props} />
}
