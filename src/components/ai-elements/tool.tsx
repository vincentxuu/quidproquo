import { ChevronRight } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

type ToolProps = React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  state?: 'pending' | 'success' | 'error'
}

export function Tool({ state = 'pending', className, ...props }: ToolProps) {
  return (
    <details
      className={cn(
        'group/tool my-1 overflow-hidden rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)]',
        state === 'success' && 'border-l-4 border-l-[var(--admin-success)]',
        state === 'error' && 'border-l-4 border-l-[var(--admin-danger)]',
        className,
      )}
      {...props}
    />
  )
}

export function ToolHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <summary className={cn('flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm [&::-webkit-details-marker]:hidden', className)}>
      <ChevronRight className="size-3 shrink-0 transition-transform group-open/tool:rotate-90" />
      {children}
    </summary>
  )
}

export function ToolContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-3 px-3 pb-3', className)} {...props} />
}

export function ToolCode({ children, tone = 'default' }: { children: string; tone?: 'default' | 'error' }) {
  return (
    <pre
      className={cn(
        'max-h-80 overflow-auto rounded-[var(--admin-radius-sm)] bg-[var(--admin-color-surface-subtle)] p-3 text-xs leading-5 whitespace-pre-wrap break-all',
        tone === 'error' && 'text-[var(--admin-danger)]',
      )}
    >
      {children}
    </pre>
  )
}
