'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { DrillModal } from './DrillModal'
import { TimelineBar } from './TimelineBar'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionPlan, Drill } from '@/types/plan'

const phaseLeftBorder: Record<string, string> = {
  'Warm-up':     'border-l-amber-500',
  'Technical':   'border-l-blue-500',
  'Progressive': 'border-l-blue-400',
  'Game-based':  'border-l-orange',
  'Cool-down':   'border-l-teal-500',
}

interface CompactViewProps {
  plan: SessionPlan
}

export function CompactView({ plan }: CompactViewProps) {
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null)

  return (
    <div className="space-y-4">

      {/* Compact overview */}
      <Card className="p-4">
        <h1 className="text-base font-semibold text-vp-text mb-3 leading-tight">{plan.title}</h1>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge>{plan.player_count} players</Badge>
          <Badge>{plan.total_duration} min</Badge>
          <Badge>{plan.level}</Badge>
        </div>
        <TimelineBar timeline={plan.timeline} totalDuration={plan.total_duration} />
      </Card>

      {/* Drill list */}
      <div className="space-y-2">
        {plan.drills.map((drill, i) => {
          const border = phaseLeftBorder[drill.phase] ?? 'border-l-vp-border'
          return (
            <button
              key={i}
              onClick={() => setActiveDrill(drill)}
              className={cn(
                'w-full text-left bg-vp-surface border border-vp-border border-l-4 rounded-xl px-4 py-4',
                'flex items-center justify-between',
                'hover:bg-vp-surface-2 transition-colors duration-150 active:scale-[0.99]',
                border
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-vp-text text-sm truncate">{drill.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <span className="text-sm text-vp-muted tabular-nums">{drill.duration} min</span>
                <ChevronRight size={14} className="text-vp-muted" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Session notes */}
      {plan.session_notes && (
        <Card className="p-4 bg-vp-surface-2">
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1.5">
            Session notes
          </p>
          <p className="text-sm text-vp-text leading-relaxed">{plan.session_notes}</p>
        </Card>
      )}

      {/* Drill modal */}
      {activeDrill && (
        <DrillModal
          drill={activeDrill}
          onClose={() => setActiveDrill(null)}
        />
      )}

    </div>
  )
}
