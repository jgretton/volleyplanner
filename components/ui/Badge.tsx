import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'phase'
  phase?: string
  className?: string
}

const phaseColours: Record<string, string> = {
  'Warm-up':    'bg-amber-500/15 text-amber-400',
  'Technical':  'bg-blue-500/15 text-blue-400',
  'Progressive':'bg-blue-400/15 text-blue-300',
  'Game-based': 'bg-orange/15 text-orange',
  'Cool-down':  'bg-teal-500/15 text-teal-400',
}

export function Badge({ children, variant = 'default', phase, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-vp-surface-2 text-vp-muted',
        variant === 'phase' && phase && phaseColours[phase],
        className
      )}
    >
      {children}
    </span>
  )
}
