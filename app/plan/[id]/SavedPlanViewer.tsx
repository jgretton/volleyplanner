'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { PlanView } from '@/components/plan/PlanView'
import { CompactView } from '@/components/plan/CompactView'
import { ViewToggle } from '@/components/plan/ViewToggle'
import { SwapModal } from '@/components/plan/SwapModal'
import type { SessionPlan, Drill } from '@/types/plan'

interface SavedPlanViewerProps {
  plan: SessionPlan
  planId: string
  isPro: boolean
  drillFeedback: Record<number, 'liked' | 'disliked'>
}

export function SavedPlanViewer({ plan: initialPlan, planId, isPro, drillFeedback }: SavedPlanViewerProps) {
  const [view, setView] = useState<'full' | 'session'>(() => {
    if (typeof window === 'undefined') return 'full'
    return window.innerWidth < 768 ? 'session' : 'full'
  })
  const [plan, setPlan] = useState<SessionPlan>(initialPlan)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)
  const [swapIndex, setSwapIndex] = useState<number | null>(null)
  const [swapOptions, setSwapOptions] = useState<Drill[] | null>(null)
  const [swapLoading, setSwapLoading] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)

  const handleRegenerate = useCallback(async (index: number) => {
    setRegeneratingIndex(index)
    try {
      const res = await fetch('/api/drill/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drill_index: index, plan }),
      })
      const json = await res.json()
      if (!res.ok) return
      setPlan(prev => {
        const drills = [...prev.drills]
        drills[index] = json.data
        return { ...prev, drills }
      })
    } catch {
      // Silently fail — user can retry
    } finally {
      setRegeneratingIndex(null)
    }
  }, [plan])

  const handleSwapOpen = useCallback(async (index: number) => {
    setSwapIndex(index)
    setSwapOptions(null)
    setSwapError(null)
    setSwapLoading(true)
    try {
      const res = await fetch('/api/drill/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drill_index: index, plan }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSwapError(json.error ?? "Couldn't fetch alternatives. Please try again.")
        return
      }
      setSwapOptions(json.data)
    } catch {
      setSwapError('Something went wrong. Please try again.')
    } finally {
      setSwapLoading(false)
    }
  }, [plan])

  const handleSwapSelect = useCallback((drill: Drill) => {
    if (swapIndex === null) return
    setPlan(prev => {
      const drills = [...prev.drills]
      drills[swapIndex] = drill
      return { ...prev, drills }
    })
    setSwapIndex(null)
    setSwapOptions(null)
  }, [swapIndex])

  const handleSwapClose = useCallback(() => {
    setSwapIndex(null)
    setSwapOptions(null)
    setSwapError(null)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top bar */}
      <div className="print:hidden flex items-center justify-between mb-6">
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
      <div className="print:hidden mb-6">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Always render PlanView for print — hide CompactView in print */}
      <div className={view === 'full' ? '' : 'hidden print:block'}>
        <PlanView
          plan={plan}
          isPro={isPro}
          planId={planId}
          drillFeedback={drillFeedback}
          regeneratingIndex={regeneratingIndex}
          onRegenerate={isPro ? handleRegenerate : undefined}
          onSwap={isPro ? handleSwapOpen : undefined}
        />
      </div>
      {view === 'session' && (
        <div className="print:hidden">
          <CompactView plan={plan} />
        </div>
      )}

      {/* Swap modal */}
      {swapIndex !== null && (
        <SwapModal
          loading={swapLoading}
          options={swapOptions}
          error={swapError}
          onSelect={handleSwapSelect}
          onClose={handleSwapClose}
        />
      )}
    </div>
  )
}
