'use client'

import { X, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Drill } from '@/types/plan'

interface SwapModalProps {
  loading: boolean
  options: Drill[] | null
  error: string | null
  onSelect: (drill: Drill) => void
  onClose: () => void
}

export function SwapModal({ loading, options, error, onSelect, onClose }: SwapModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-lg bg-vp-surface border border-vp-border rounded-xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-vp-border">
          <div>
            <h2 className="text-sm font-semibold text-vp-text">Swap drill</h2>
            <p className="text-xs text-vp-muted mt-0.5">Choose a replacement for this drill</p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-md text-vp-muted hover:text-vp-text hover:bg-vp-surface-2 transition-colors duration-150"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 size={20} className="animate-spin text-orange" />
              <p className="text-sm text-vp-muted">Finding alternatives...</p>
            </div>
          )}

          {error && !loading && (
            <div className="py-8 text-center">
              <p className="text-sm text-vp-muted">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 text-xs text-orange hover:text-orange/80 transition-colors"
              >
                Close and try again
              </button>
            </div>
          )}

          {options && !loading && (
            <div className="space-y-3">
              {options.map((drill, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(drill)}
                  className="w-full text-left bg-vp-surface-2 border border-vp-border hover:border-orange/40 hover:bg-orange/5 rounded-lg p-4 transition-all duration-150 group"
                >
                  <p className="text-sm font-medium text-vp-text group-hover:text-white leading-snug mb-2">
                    {drill.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
                    <Badge>{drill.duration} min</Badge>
                    {drill.players_needed > 0 && <Badge>{drill.players_needed} players</Badge>}
                  </div>
                  {drill.setup && (
                    <p className="text-xs text-vp-muted mt-2 leading-relaxed line-clamp-2">
                      {drill.setup}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
