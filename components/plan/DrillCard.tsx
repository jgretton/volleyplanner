'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, RefreshCw, ArrowLeftRight, Loader2, Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DrillDiagram } from './DrillDiagram'
import { cn } from '@/lib/utils'
import type { Drill } from '@/types/plan'

const phaseLeftBorder: Record<string, string> = {
  'Warm-up':     'border-l-amber-500',
  'Technical':   'border-l-blue-500',
  'Progressive': 'border-l-blue-400',
  'Game-based':  'border-l-orange',
  'Cool-down':   'border-l-teal-500',
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

interface DrillCardProps {
  drill: Drill
  index: number
  isPro?: boolean
  planId?: string
  initialFeedback?: 'liked' | 'disliked' | null
  regenerating?: boolean
  onRegenerate?: (index: number) => void
  onSwap?: (index: number) => void
}

export function DrillCard({ drill, index, isPro, planId, initialFeedback, regenerating, onRegenerate, onSwap }: DrillCardProps) {
  const storageKey = `vp_drill_notes_${encodeURIComponent(drill.name)}`
  const [notes, setNotes] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem(storageKey) ?? ''
  })
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(initialFeedback ?? null)
  const [saved, setSaved] = useState(false)

  function handleNotesChange(value: string) {
    setNotes(value)
    localStorage.setItem(storageKey, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleFeedback(value: 'liked' | 'disliked') {
    const next = feedback === value ? null : value
    setFeedback(next)

    if (!planId) return

    try {
      await fetch('/api/drill-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          drill_index: index,
          drill_name: drill.name,
          drill_type: drill.phase,
          feedback: next,
        }),
      })
    } catch {
      // Silently fail — UI state already updated
    }
  }

  const borderColour = phaseLeftBorder[drill.phase] ?? 'border-l-vp-border'
  const hasDiagram   = drill.diagram_type !== 'none'

  const actionButtons = (
    <>
      {isPro && (
        <>
          <button
            onClick={() => handleFeedback('liked')}
            title="Liked it"
            className={cn(
              'w-11 h-11 rounded-md border flex items-center justify-center transition-colors duration-150',
              feedback === 'liked'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'border-vp-border text-vp-muted hover:text-green-400 hover:border-green-500/30'
            )}
            aria-label="Rate drill positively"
          >
            <ThumbsUp size={15} />
          </button>
          <button
            onClick={() => handleFeedback('disliked')}
            title="Not for us"
            className={cn(
              'w-11 h-11 rounded-md border flex items-center justify-center transition-colors duration-150',
              feedback === 'disliked'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'border-vp-border text-vp-muted hover:text-red-400 hover:border-red-500/30'
            )}
            aria-label="Rate drill negatively"
          >
            <ThumbsDown size={15} />
          </button>
          {(onRegenerate || onSwap) && (
            <div className="w-px h-4 bg-vp-border mx-0.5" />
          )}
        </>
      )}

      {onRegenerate ? (
        <button
          onClick={() => !regenerating && onRegenerate(index)}
          disabled={regenerating}
          title="Regenerate drill"
          className="w-11 h-11 rounded-md border border-vp-border text-vp-muted hover:border-vp-muted hover:text-vp-text flex items-center justify-center transition-colors duration-150 disabled:opacity-50"
          aria-label="Regenerate drill"
        >
          {regenerating
            ? <Loader2 size={12} className="animate-spin text-orange" />
            : <RefreshCw size={15} />
          }
        </button>
      ) : !isPro && planId ? (
        <div title="Pro feature — regenerate this drill" className="relative w-11 h-11 rounded-md border border-vp-border text-vp-muted/30 flex items-center justify-center cursor-default">
          <RefreshCw size={15} />
          <Lock size={7} className="absolute bottom-0.5 right-0.5 text-vp-muted/50" />
        </div>
      ) : null}

      {onSwap ? (
        <button
          onClick={() => !regenerating && onSwap(index)}
          disabled={regenerating}
          title="Choose an alternative drill"
          className="w-11 h-11 rounded-md border border-vp-border text-vp-muted hover:border-vp-muted hover:text-vp-text flex items-center justify-center transition-colors duration-150 disabled:opacity-50"
          aria-label="Choose an alternative drill"
        >
          <ArrowLeftRight size={15} />
        </button>
      ) : !isPro && planId ? (
        <div title="Pro feature — swap for an alternative drill" className="relative w-11 h-11 rounded-md border border-vp-border text-vp-muted/30 flex items-center justify-center cursor-default">
          <ArrowLeftRight size={15} />
          <Lock size={7} className="absolute bottom-0.5 right-0.5 text-vp-muted/50" />
        </div>
      ) : null}
    </>
  )

  return (
    <Card className={`border-l-4 ${borderColour} overflow-hidden print-drill-card`}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className={cn('px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-vp-border', phaseHeaderBg[drill.phase])}>

        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="font-display font-bold uppercase text-xl text-vp-text leading-tight tracking-tight">
            {drill.name}
          </h3>
          {/* Buttons — desktop: beside title */}
          <div className="hidden md:flex items-center gap-1 shrink-0 print:hidden">
            {actionButtons}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
          <Badge>{drill.duration} min</Badge>
          {drill.players_needed > 0 && <Badge>{drill.players_needed} players</Badge>}
        </div>

        {/* Buttons — mobile: own row below badges */}
        <div className="flex md:hidden items-center gap-1 mt-3 print:hidden">
          {actionButtons}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className={hasDiagram ? 'flex flex-col md:flex-row print-drill-body' : 'print-drill-body'}>

        {/* Left column — diagram + equipment */}
        {hasDiagram && (
          <div className="md:w-64 shrink-0 p-6 md:p-8 border-b md:border-b-0 md:border-r border-vp-border flex flex-col gap-5 print-diagram-col">
            <div className="relative rounded-lg overflow-hidden border border-vp-border group">
              <DrillDiagram
                type={drill.diagram_type}
                config={drill.diagram_config}
                className="w-full"
                expandable
              />
            </div>

            {drill.diagram_config.formation && (
              <p className="text-xs text-vp-muted text-center -mt-2 leading-snug">
                {drill.diagram_config.formation}
              </p>
            )}

            {drill.equipment.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">
                  Equipment
                </p>
                <ul className="space-y-1">
                  {drill.equipment.map((item, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm text-vp-text">
                      <span className="shrink-0 w-1 h-1 rounded-full bg-vp-muted/50 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Right column — instructional content */}
        <div className="flex-1 min-w-0 p-6 md:p-8 space-y-6">

          {/* Setup */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">
              Setup
            </h4>
            <p className="text-sm text-vp-muted leading-relaxed">{drill.setup}</p>
          </div>

          {/* Equipment — no diagram case */}
          {!hasDiagram && drill.equipment.length > 0 && (
            <div className="border-t border-vp-border pt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">
                Equipment
              </p>
              <ul className="space-y-1">
                {drill.equipment.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start text-sm text-vp-text">
                    <span className="shrink-0 w-1 h-1 rounded-full bg-vp-muted/50 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions — primary content */}
          <div className="border-t border-vp-border pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-vp-text mb-4">
              Instructions
            </h4>
            <ol className="space-y-3.5">
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
          <div className="border-t border-vp-border pt-6">
            <h4 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">
              Coaching points
            </h4>
            <ul className="space-y-3">
              {drill.coaching_points.map((point, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange/60 mt-2" />
                  <span className="text-sm text-vp-text leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progression — phase-accented */}
          <div className="border-t border-vp-border pt-6">
            <div className={cn(
              'bg-vp-surface-2 border border-vp-border border-l-4 rounded-lg px-4 py-3.5',
              phaseProgressionBorder[drill.phase] ?? 'border-l-orange'
            )}>
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1.5">
                Progression
              </p>
              <p className="text-sm text-vp-text leading-relaxed">{drill.progression}</p>
            </div>
          </div>

          {/* Coach notes */}
          <div className="border-t border-vp-border pt-6">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted">
                Your notes
              </p>
              {saved && (
                <span className="text-xs text-green-400/70 transition-opacity">Saved</span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={e => handleNotesChange(e.target.value)}
              rows={2}
              className="w-full bg-vp-surface-2 border border-vp-border rounded-md px-3 py-2.5 text-[16px] leading-relaxed text-vp-text placeholder:text-vp-muted/40 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/20 transition-colors resize-none print:hidden"
              placeholder="Add your own notes for this drill..."
            />
          </div>

        </div>
      </div>
    </Card>
  )
}
