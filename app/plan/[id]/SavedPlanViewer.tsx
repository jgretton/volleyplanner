'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { PlanView } from '@/components/plan/PlanView'
import { CompactView } from '@/components/plan/CompactView'
import { ViewToggle } from '@/components/plan/ViewToggle'
import type { SessionPlan } from '@/types/plan'

interface SavedPlanViewerProps {
  plan: SessionPlan
  planId: string
  isPro: boolean
  drillFeedback: Record<number, 'liked' | 'disliked'>
}

export function SavedPlanViewer({ plan, planId, isPro, drillFeedback }: SavedPlanViewerProps) {
  const [view, setView] = useState<'full' | 'session'>(() => {
    if (typeof window === 'undefined') return 'full'
    return window.innerWidth < 768 ? 'session' : 'full'
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-vp-muted hover:text-vp-text transition-colors duration-150"
        >
          <ArrowLeft size={14} />
          My plans
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm text-vp-muted hover:text-vp-text border border-vp-border px-3 py-1.5 rounded-md transition-colors duration-150"
        >
          <Printer size={13} />
          Print
        </button>
      </div>

      {/* View toggle */}
      <div className="mb-6">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === 'full'
        ? <PlanView plan={plan} isPro={isPro} planId={planId} drillFeedback={drillFeedback} />
        : <CompactView plan={plan} />
      }
    </div>
  )
}
