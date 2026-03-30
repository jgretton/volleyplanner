'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { DrillDiagram } from './DrillDiagram'
import { Badge } from '@/components/ui/Badge'
import type { Drill } from '@/types/plan'

interface DrillModalProps {
  drill: Drill
  onClose: () => void
}

export function DrillModal({ drill, onClose }: DrillModalProps) {
  // Prevent body scroll while open, compensating for scrollbar width to avoid layout shift
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-vp-surface border border-vp-border w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto">

        {/* Handle bar (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-vp-surface-2 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-vp-border">
          <div>
            <h2 className="text-base font-semibold text-vp-text leading-tight">{drill.name}</h2>
            <div className="flex gap-2 mt-1.5">
              <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
              <Badge>{drill.duration} min</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 flex items-center justify-center shrink-0 rounded-md text-vp-muted hover:text-vp-text hover:bg-vp-surface-2 transition-colors duration-150 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">

          {/* Diagram first — most useful courtside */}
          {drill.diagram_type !== 'none' && (
            <div>
              <div className="rounded-lg overflow-hidden border border-vp-border">
                <DrillDiagram
                  type={drill.diagram_type}
                  config={drill.diagram_config}
                  className="w-full max-w-[280px] mx-auto block"
                  expandable
                />
              </div>
              {drill.diagram_config.formation && (
                <p className="text-xs text-vp-muted text-center mt-1.5">
                  {drill.diagram_config.formation}
                </p>
              )}
            </div>
          )}

          {/* Setup */}
          <p className="text-sm text-vp-muted leading-relaxed">{drill.setup}</p>

          {/* Instructions */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">
              Instructions
            </h3>
            <ol className="space-y-2">
              {drill.instructions.map((instruction, i) => (
                <li key={i} className="text-sm text-vp-text flex gap-2.5 leading-relaxed">
                  <span className="text-orange font-semibold shrink-0 tabular-nums">{i + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Coaching points */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">
              Coaching points
            </h3>
            <ul className="space-y-2">
              {drill.coaching_points.map((point, i) => (
                <li key={i} className="text-sm text-vp-text flex gap-2.5 leading-relaxed">
                  <span className="text-orange shrink-0 mt-2 w-1 h-1 rounded-full bg-orange/60 block" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progression */}
          <div className="bg-vp-surface-2 border border-vp-border rounded-lg px-4 py-3">
            <p className="text-sm text-vp-text">
              <span className="text-xs font-medium uppercase tracking-widest text-vp-muted">
                Progression:{' '}
              </span>
              {drill.progression}
            </p>
          </div>

          {/* Equipment */}
          {drill.equipment.length > 0 && (
            <p className="text-xs text-vp-muted">
              <span className="font-medium">Equipment: </span>
              {drill.equipment.join(', ')}
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
