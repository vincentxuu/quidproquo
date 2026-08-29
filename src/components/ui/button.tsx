import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--admin-radius-sm)] border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(47,111,70,0.32)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)]',
        outline: 'border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] hover:bg-[var(--admin-muted)]',
        ghost: 'border-transparent bg-transparent text-[var(--admin-text-muted)] hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)]',
        danger: 'border-[var(--admin-color-danger-soft)] bg-[var(--admin-surface)] text-[var(--admin-danger)] hover:bg-[var(--admin-color-danger-soft)]',
      },
      size: {
        sm: 'min-h-9 px-3 py-1.5 text-xs',
        md: 'px-3.5 py-2',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
