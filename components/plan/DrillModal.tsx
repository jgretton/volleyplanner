'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Drawer } from 'vaul'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { DrillDiagram } from './DrillDiagram'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Drill } from '@/types/plan'

const phaseTopBorder: Record<string, string> = {
  'Warm-up':     'border-t-amber-500',
  'Technical':   'border-t-blue-500',
  'Progressive': 'border-t-blue-400',
  'Game-based':  'border-t-orange',
  'Cool-down':   'border-t-teal-500',
}

const phaseHeaderBg: Record<string, string> = {
  'Warm-up':     'bg-amber-500/[0.06]',
  'Technical':   'bg-blue-500/[0.06]',
  'Progressive': 'bg-blue-400/[0.06]',
  'Game-based':  'bg-orange/[0.06]',
  'Cool-down':   'bg-teal-500/[0.06]',
}

const phaseProgressionBorder: Record<string, string> = {
  'Warm-up':     'border-l-amber-500',
  'Technical':   'border-l-blue-500',
  'Progressive': 'border-l-blue-400',
  'Game-based':  'border-l-orange',
  'Cool-down':   'border-l-teal-500',
}

interface DrillModalProps {
  drill: Drill
  drillIndex: number
  totalDrills: number
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

function DrillModalInner({ drill, drillIndex, totalDrills, onClose, onPrev, onNext }: DrillModalProps) {
  const hasDiagram        = drill.diagram_type !== 'none'
  const headerBg          = phaseHeaderBg[drill.phase]          ?? ''
  const progressionBorder = phaseProgressionBorder[drill.phase] ?? 'border-l-orange'

  // Arrow key navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onPrev, onNext])

  return (
    <>
      {/* ── Header — sticky, never scrolls ─────────────────────── */}
      <div className={cn('shrink-0 px-5 pt-4 pb-5 border-b border-vp-border', headerBg)}>

        {/* Nav row */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-medium uppercase tracking-widest text-vp-muted">
            Drill {drillIndex + 1} of {totalDrills}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              aria-label="Previous drill"
              className="w-8 h-8 flex items-center justify-center rounded-md text-vp-muted hover:text-vp-text hover:bg-vp-surface-2 transition-colors duration-150 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              aria-label="Next drill"
              className="w-8 h-8 flex items-center justify-center rounded-md text-vp-muted hover:text-vp-text hover:bg-vp-surface-2 transition-colors duration-150 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <div className="w-px h-4 bg-vp-border mx-1" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-md text-vp-muted hover:text-vp-text hover:bg-vp-surface-2 transition-colors duration-150"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Drill name */}
        <h2 className="font-display font-bold uppercase text-2xl leading-[0.92] tracking-tight text-vp-text mb-3">
          {drill.name}
        </h2>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
          <Badge>{drill.duration} min</Badge>
          {drill.players_needed > 0 && <Badge>{drill.players_needed} players</Badge>}
        </div>
      </div>

      {/* ── Body — scrollable ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-5 space-y-5">

        {/* Diagram + equipment — setup context grouped together */}
        <div className="space-y-3">
          {hasDiagram && (
            <div>
              <div className="rounded-lg overflow-hidden border border-vp-border">
                <DrillDiagram
                  type={drill.diagram_type}
                  config={drill.diagram_config}
                  className="w-full max-w-[300px] mx-auto block"
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

          {drill.equipment.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">Equipment</p>
              <div className="flex flex-wrap gap-2">
                {drill.equipment.map((item, i) => (
                  <span key={i} className="text-xs bg-vp-surface-2 border border-vp-border text-vp-muted px-2.5 py-1 rounded-md">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Setup */}
        <div className="border-t border-vp-border pt-5">
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">Setup</p>
          <p className="text-sm text-vp-muted leading-relaxed">{drill.setup}</p>
        </div>

        {/* Instructions */}
        <div className="border-t border-vp-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-vp-text mb-3">Instructions</p>
          <ol className="space-y-3">
            {drill.instructions.map((instruction, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="shrink-0 w-5 h-5 rounded-full bg-orange/15 text-orange text-xs font-bold flex items-center justify-center mt-0.5 leading-none">
                  {i + 1}
                </span>
                <span className="text-sm text-vp-text leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Coaching points */}
        <div className="border-t border-vp-border pt-5">
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">Coaching points</p>
          <ul className="space-y-2.5">
            {drill.coaching_points.map((point, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange/60 mt-[7px]" />
                <span className="text-sm text-vp-text leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progression */}
        <div className="border-t border-vp-border pt-5 pb-2">
          <div className={cn(
            'bg-vp-surface-2 border border-vp-border border-l-4 rounded-lg px-4 py-3.5',
            progressionBorder
          )}>
            <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1.5">Progression</p>
            <p className="text-sm text-vp-text leading-relaxed">{drill.progression}</p>
          </div>
        </div>

      </div>
    </>
  )
}

export function DrillModal(props: DrillModalProps) {
  const { drill, onClose } = props
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const topBorder = phaseTopBorder[drill.phase] ?? 'border-t-vp-border'

  // Mobile — Vaul bottom drawer
  if (isMobile) {
    return (
      <Drawer.Root open onOpenChange={open => { if (!open) onClose() }}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/75 z-50" />
          <Drawer.Content
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-vp-surface border-t-[3px] rounded-t-2xl max-h-[92dvh] focus:outline-none',
              topBorder
            )}
            aria-describedby={undefined}
          >
            <Drawer.Title className="sr-only">{drill.name}</Drawer.Title>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-0 shrink-0">
              <div className="w-9 h-[3px] bg-vp-border rounded-full" />
            </div>
            <DrillModalInner {...props} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  // Desktop — Radix Dialog
  return (
    <Dialog.Root open onOpenChange={open => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-vp-surface border border-vp-border border-t-[3px] rounded-2xl max-h-[90vh] flex flex-col shadow-2xl focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200',
            topBorder
          )}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{drill.name}</Dialog.Title>
          <DrillModalInner {...props} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
