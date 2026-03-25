'use client'

import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'full' | 'session'
  onChange: (view: 'full' | 'session') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex bg-vp-surface-2 border border-vp-border rounded-md p-1">
      <button
        onClick={() => onChange('full')}
        className={cn(
          'px-4 py-1.5 rounded text-sm font-medium transition-all duration-150',
          view === 'full'
            ? 'bg-vp-bg text-vp-text border border-vp-border'
            : 'text-vp-muted hover:text-vp-text'
        )}
      >
        Full view
      </button>
      <button
        onClick={() => onChange('session')}
        className={cn(
          'px-4 py-1.5 rounded text-sm font-medium transition-all duration-150',
          view === 'session'
            ? 'bg-vp-bg text-vp-text border border-vp-border'
            : 'text-vp-muted hover:text-vp-text'
        )}
      >
        Session view
      </button>
    </div>
  )
}
