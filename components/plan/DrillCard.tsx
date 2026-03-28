'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, RefreshCw, ArrowLeftRight, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DrillDiagram } from './DrillDiagram'
import type { Drill } from '@/types/plan'

const phaseLeftBorder: Record<string, string> = {
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

  function handleNotesChange(value: string) {
    setNotes(value)
    localStorage.setItem(storageKey, value)
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

  const borderColour  = phaseLeftBorder[drill.phase] ?? 'border-l-vp-border'
  const hasDiagram    = drill.diagram_type !== 'none'

  return (
    <Card className={`border-l-4 ${borderColour} overflow-hidden print-drill-card`}>

      {/* ── Full-width header ──────────────────────────────────────────── */}
      <div className="px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-vp-border">
        <h3 className="text-lg font-semibold text-vp-text mb-2.5 leading-snug">
          {drill.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
          <Badge>{drill.duration} min</Badge>
          {drill.players_needed > 0 && <Badge>{drill.players_needed} players</Badge>}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className={hasDiagram ? 'flex flex-col md:flex-row print-drill-body' : 'print-drill-body'}>

        {/* Left column — diagram + equipment (only when diagram present) */}
        {hasDiagram && (
          <div className="md:w-64 shrink-0 p-6 md:p-8 border-b md:border-b-0 md:border-r border-vp-border flex flex-col gap-5 print-diagram-col">

            {/* Diagram */}
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

            {/* Equipment lives under the diagram — need it before you start */}
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

        {/* Right column — all instructional content */}
        <div className="flex-1 min-w-0 p-6 md:p-8 space-y-6">

          {/* Setup */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">
              Setup
            </h4>
            <p className="text-sm text-vp-muted leading-relaxed">{drill.setup}</p>
          </div>

          {/* Instructions */}
          <div className="border-t border-vp-border pt-6">
            <h4 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">
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

          {/* Progression */}
          <div className="border-t border-vp-border pt-6">
            <div className="bg-vp-surface-2 border border-vp-border rounded-lg px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1.5">
                Progression
              </p>
              <p className="text-sm text-vp-text leading-relaxed">{drill.progression}</p>
            </div>
          </div>

          {/* Equipment — no diagram case only */}
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

          {/* Coach notes */}
          <div className="border-t border-vp-border pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-vp-muted block mb-2.5">
              Your notes
            </p>
            {notes ? (
              <p className="text-sm text-vp-text leading-relaxed">{notes}</p>
            ) : (
              <textarea
                value={notes}
                onChange={e => handleNotesChange(e.target.value)}
                rows={2}
                className="w-full bg-vp-surface-2 border border-vp-border rounded-md px-3 py-2.5 text-base text-vp-text placeholder:text-vp-muted/40 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/20 transition-colors resize-none print:hidden"
                placeholder="Add your own notes for this drill..."
              />
            )}
          </div>

          {/* Feedback */}
          {isPro ? (
            <div className="flex items-center gap-2 print:hidden">
              <span className="text-xs text-vp-muted/50 mr-1">Rate this drill</span>
              <button
                onClick={() => handleFeedback('liked')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors ${
                  feedback === 'liked'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'border-vp-border text-vp-muted hover:text-green-400 hover:border-green-500/30'
                }`}
                aria-label="Rate drill positively"
              >
                <ThumbsUp size={12} /> Liked it
              </button>
              <button
                onClick={() => handleFeedback('disliked')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors ${
                  feedback === 'disliked'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'border-vp-border text-vp-muted hover:text-red-400 hover:border-red-500/30'
                }`}
                aria-label="Rate drill negatively"
              >
                <ThumbsDown size={12} /> Not for us
              </button>
            </div>
          ) : (
            <p className="text-xs text-vp-muted/50 print:hidden">
              Rate drills on <span className="text-orange">Pro</span>
            </p>
          )}

        </div>
      </div>

      {/* ── Pro actions ────────────────────────────────────────────────── */}
      {(onRegenerate || onSwap) && (
        <div className="border-t border-vp-border grid grid-cols-2 divide-x divide-vp-border print:hidden">
          {onRegenerate && (
            <button
              onClick={() => !regenerating && onRegenerate(index)}
              disabled={regenerating}
              className="flex items-start gap-3 px-5 py-4 hover:bg-vp-surface-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed group text-left"
            >
              <div className="w-7 h-7 rounded-md bg-vp-surface-2 group-hover:bg-vp-border border border-vp-border flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                {regenerating
                  ? <Loader2 size={13} className="animate-spin text-orange" />
                  : <RefreshCw size={13} className="text-vp-muted group-hover:text-vp-text transition-colors" />
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-vp-text leading-snug">
                  {regenerating ? 'Regenerating…' : 'Regenerate drill'}
                </p>
                <p className="text-xs text-vp-muted mt-0.5 leading-relaxed">
                  Replace this drill with a fresh alternative for the same phase and duration.
                </p>
              </div>
            </button>
          )}
          {onSwap && (
            <button
              onClick={() => !regenerating && onSwap(index)}
              disabled={regenerating}
              className="flex items-start gap-3 px-5 py-4 hover:bg-vp-surface-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed group text-left"
            >
              <div className="w-7 h-7 rounded-md bg-vp-surface-2 group-hover:bg-vp-border border border-vp-border flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                <ArrowLeftRight size={13} className="text-vp-muted group-hover:text-vp-text transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-vp-text leading-snug">Choose an alternative</p>
                <p className="text-xs text-vp-muted mt-0.5 leading-relaxed">
                  See 3 different drills and pick the one that best suits your squad.
                </p>
              </div>
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
