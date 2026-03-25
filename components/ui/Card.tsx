import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-vp-surface border border-vp-border rounded-xl', className)}
      {...props}
    >
      {children}
    </div>
  )
}
