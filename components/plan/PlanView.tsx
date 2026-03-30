import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TimelineBar } from './TimelineBar'
import { DrillCard } from './DrillCard'
import type { SessionPlan } from '@/types/plan'

interface PlanViewProps {
  plan: SessionPlan
  isPro?: boolean
  planId?: string
  drillFeedback?: Record<number, 'liked' | 'disliked'>
  regeneratingIndex?: number | null
  onRegenerate?: (index: number) => void
  onSwap?: (index: number) => void
}

export function PlanView({ plan, isPro, planId, drillFeedback, regeneratingIndex, onRegenerate, onSwap }: PlanViewProps) {
  return (
    <div className="space-y-6">

      {/* Overview */}
      <Card className="p-6 print-overview">
        <h1 className="font-display font-bold uppercase tracking-tight text-vp-text text-4xl leading-[0.95] mb-4">
          {plan.title}
        </h1>
        <p className="text-vp-text/70 text-sm leading-relaxed mb-6">{plan.overview}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge>{plan.player_count} players</Badge>
          <Badge>{plan.total_duration} min</Badge>
          <Badge>{plan.level}</Badge>
          <Badge>{plan.focus}</Badge>
        </div>

        <div className="print-timeline">
          <TimelineBar timeline={plan.timeline} totalDuration={plan.total_duration} />
        </div>
      </Card>

      {/* Drills */}
      {plan.drills.map((drill, i) => (
        <DrillCard
          key={i}
          drill={drill}
          index={i}
          isPro={isPro}
          planId={planId}
          initialFeedback={drillFeedback?.[i] ?? null}
          regenerating={regeneratingIndex === i}
          onRegenerate={onRegenerate}
          onSwap={onSwap}
        />
      ))}

      {/* Session notes */}
      {plan.session_notes && (
        <Card className="p-6 bg-vp-surface-2 print-session-notes">
          <h2 className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">
            Session notes
          </h2>
          <p className="text-sm text-vp-text leading-relaxed">{plan.session_notes}</p>
        </Card>
      )}

    </div>
  )
}
