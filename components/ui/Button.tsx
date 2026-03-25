import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-vp-surface text-vp-text hover:bg-vp-surface-2 border border-vp-border': variant === 'primary',
            'bg-orange text-white hover:bg-orange/90 active:scale-[0.98]': variant === 'accent',
            'text-vp-muted hover:text-vp-text': variant === 'ghost',
            'border border-vp-border text-vp-text hover:border-vp-text/50': variant === 'outline',
          },
          {
            'px-3 py-1.5 text-xs rounded': size === 'sm',
            'px-5 py-2.5 text-sm rounded-md': size === 'md',
            'px-6 py-3.5 text-base rounded-md': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
