'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PlanView } from '@/components/plan/PlanView'
import { PlanSkeleton } from '@/components/plan/PlanSkeleton'
import { CompactView } from '@/components/plan/CompactView'
import { ViewToggle } from '@/components/plan/ViewToggle'
import { AlertTriangle, ClipboardX, Loader2, Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { SessionPlan, SkillLevel } from '@/types/plan'

function PlanPageContent() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const [plan, setPlan]     = useState<SessionPlan | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed]   = useState(false)
  const [view, setView] = useState<'full' | 'session'>(() => {
    if (typeof window === 'undefined') return 'full'
    return window.innerWidth < 768 ? 'session' : 'full'
  })

  useEffect(() => {
    // After magic link auth the callback redirects here with no params.
    // Restore the pending plan URL from sessionStorage and navigate to it.
    const redirect = sessionStorage.getItem('vp_redirect_after_auth')
    if (redirect) {
      sessionStorage.removeItem('vp_redirect_after_auth')
      if (redirect.startsWith('/') && !redirect.includes('://')) {
        router.replace(redirect)
        return
      }
    }

    // Check auth state to conditionally show the save banner
    createClient().auth.getUser().then(({ data }) => {
      setIsAuthed(!!data.user)
    })

    async function generatePlan() {
      const players     = parseInt(searchParams.get('players')  ?? '10')
      const duration    = parseInt(searchParams.get('duration') ?? '90')
      const level       = (searchParams.get('level') ?? 'intermediate') as SkillLevel
      const description = searchParams.get('description') ?? ''

      if (!description) {
        // Signed in directly (no pending plan) — send them home
        router.replace('/')
        return
      }

      try {
        const response = await fetch('/api/generate', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ players, duration, level, description }),
        })

        const json = await response.json()

        if (!response.ok) {
          if (json.code === 'limit_reached') {
            setError('limit_reached')
          } else {
            setError(json.error ?? "We couldn't generate your plan right now. Please try again.")
          }
          return
        }

        setPlan(json.data)
      } catch {
        setError('Something went wrong. Please check your connection and try again.')
      } finally {
        setIsLoading(false)
      }
    }

    generatePlan()
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="flex items-center justify-center gap-2 text-sm text-vp-muted mb-8">
          <Loader2 size={14} className="animate-spin text-orange" />
          Building your session plan...
        </p>
        <PlanSkeleton />
      </div>
    )
  }

  if (error === 'limit_reached') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <ClipboardX size={48} className="text-vp-muted mx-auto mb-6" />
        <h2 className="font-display font-bold uppercase text-3xl text-vp-text mb-3">
          Monthly limit reached
        </h2>
        <p className="text-vp-muted mb-8 leading-relaxed">
          You&apos;ve used your 3 free plans this month. Upgrade to Pro for unlimited plans - just £6/month.
        </p>
        <Button variant="accent" size="lg">Upgrade to Pro</Button>
        <p className="text-xs text-vp-muted/50 mt-4">Plans reset on the 1st of each month.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <AlertTriangle size={48} className="text-orange mx-auto mb-6" />
        <h2 className="font-display font-bold uppercase text-3xl text-vp-text mb-3">
          Something went wrong
        </h2>
        <p className="text-vp-muted mb-8">{error}</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back and try again
        </Button>
      </div>
    )
  }

  if (!plan) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Save prompt — soft nudge for unauthenticated users */}
      {!isAuthed && (
        <div className="bg-vp-surface border border-vp-border rounded-xl px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-vp-muted">
            Sign in to save this plan and access it later. Free account - no password needed.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-orange hover:text-orange/80"
            onClick={() => {
              sessionStorage.setItem('vp_redirect_after_auth', window.location.pathname + window.location.search)
              router.push('/signin')
            }}
          >
            Sign in with email →
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <ViewToggle view={view} onChange={setView} />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm text-vp-muted hover:text-vp-text border border-vp-border px-3 py-1.5 rounded-md transition-colors duration-150"
        >
          <Printer size={13} />
          Print
        </button>
      </div>

      {view === 'full' ? (
        <PlanView plan={plan} />
      ) : (
        <CompactView plan={plan} />
      )}

    </div>
  )
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PlanSkeleton />
        </div>
      }
    >
      <PlanPageContent />
    </Suspense>
  )
}
