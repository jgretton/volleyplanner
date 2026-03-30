'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { DrillModal } from './DrillModal'
import { TimelineBar } from './TimelineBar'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionPlan } from '@/types/plan'

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const activeDrill = activeIndex !== null ? plan.drills[activeIndex] : null

  function openDrill(index: number) { setActiveIndex(index) }
  function closeDrill() { setActiveIndex(null) }

  function goPrev() {
    setActiveIndex(i => (i !== null && i > 0 ? i - 1 : i))
  }

  function goNext() {
    setActiveIndex(i => (i !== null && i < plan.drills.length - 1 ? i + 1 : i))
  }

  return (
    <div className="space-y-4">

      {/* Compact overview */}
      <Card className="p-4">
        <h1 className="font-display font-bold uppercase text-xl leading-[0.95] tracking-tight text-vp-text mb-3">
          {plan.title}
        </h1>
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
              onClick={() => openDrill(i)}
              className={cn(
                'w-full text-left bg-vp-surface border border-vp-border border-l-4 rounded-xl px-4 py-4',
                'flex items-center gap-4',
                'hover:bg-vp-surface-2 transition-colors duration-150 active:scale-[0.99]',
                border
              )}
            >
              {/* Drill number */}
              <span className="shrink-0 font-display font-bold text-lg leading-none text-vp-muted/40 tabular-nums w-6 text-right">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Name + phase */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-vp-text text-sm truncate">{drill.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="phase" phase={drill.phase}>{drill.phase}</Badge>
                </div>
              </div>

              {/* Duration + chevron */}
              <div className="flex items-center gap-2.5 ml-1 shrink-0">
                <span className="text-sm text-vp-muted tabular-nums">{drill.duration} min</span>
                <ChevronRight size={14} className="text-vp-muted/50" />
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
      {activeDrill && activeIndex !== null && (
        <DrillModal
          drill={activeDrill}
          drillIndex={activeIndex}
          totalDrills={plan.drills.length}
          onClose={closeDrill}
          onPrev={activeIndex > 0 ? goPrev : undefined}
          onNext={activeIndex < plan.drills.length - 1 ? goNext : undefined}
        />
      )}

    </div>
  )
}
