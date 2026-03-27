'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus, ArrowRight, RefreshCw, FileText, BookOpen, Shuffle, Search, X, ThumbsUp, AlertTriangle } from 'lucide-react'
import { PlanCard } from '@/components/plan/PlanCard'
import { LockedPlanCard } from '@/components/plan/LockedPlanCard'
import { NewPlanModal } from '@/components/plan/NewPlanModal'
import type { SavedPlan } from '@/types/plan'
import type { LikedDrill } from './page'

interface Profile {
  is_pro: boolean
  subscription_status: string | null
  plans_used_this_month: number
  plans_reset_at: string
}

interface DashboardPlansProps {
  plans: Pick<SavedPlan, 'id' | 'title' | 'input_data' | 'liked' | 'created_at'>[]
  profile: Profile
  likedDrills: LikedDrill[]
}

function formatResetDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const FREE_LIMIT = 3

const PRO_BENEFITS = [
  { icon: BookOpen,  text: 'Unlimited plans every month' },
  { icon: RefreshCw, text: 'Regenerate or swap any drill on the fly' },
  { icon: FileText,  text: 'Export to PDF and share with your squad' },
  { icon: Shuffle,   text: 'Full session history — never lose a plan' },
]

function formatLastSession(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  return `${Math.floor(days / 7)} weeks ago`
}

export function DashboardPlans({ plans: initialPlans, profile, likedDrills }: DashboardPlansProps) {
  const [plans, setPlans] = useState(initialPlans)
  const [filter, setFilter] = useState<'all' | 'liked'>('all')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const used = profile.plans_used_this_month
  const usedPct = Math.min((used / FREE_LIMIT) * 100, 100)
  const resetDate = formatResetDate(profile.plans_reset_at)

  const likedCount = plans.filter(p => p.liked).length
  const lastSession = plans.length > 0 ? formatLastSession(plans[0].created_at) : null

  async function handleDelete(id: string) {
    setDeleteTarget(null)
    setDeleting(id)
    try {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPlans(prev => prev.filter(p => p.id !== id))
        toast.success('Plan deleted')
      } else {
        toast.error('Could not delete plan. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please check your connection.')
    } finally {
      setDeleting(null)
    }
  }

  async function handleToggleLiked(id: string, liked: boolean) {
    // Optimistic update
    setPlans(prev => prev.map(p => p.id === id ? { ...p, liked } : p))
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked }),
      })
      if (!res.ok) {
        // Revert on failure
        setPlans(prev => prev.map(p => p.id === id ? { ...p, liked: !liked } : p))
        toast.error('Could not update plan.')
      }
    } catch {
      setPlans(prev => prev.map(p => p.id === id ? { ...p, liked: !liked } : p))
      toast.error('Something went wrong.')
    }
  }

  const visiblePlans = useMemo(() => {
    let result = filter === 'liked' ? plans.filter(p => p.liked) : plans
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q))
    }
    return result
  }, [plans, filter, search])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <NewPlanModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-vp-surface border border-vp-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display font-bold uppercase text-xl text-vp-text leading-tight tracking-tight mb-2">
              Delete this plan?
            </h3>
            <p className="text-sm text-vp-muted mb-6">
              This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-vp-border text-vp-muted px-4 py-2.5 rounded-md text-sm font-medium hover:border-vp-muted hover:text-vp-text transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">Dashboard</p>
          <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl text-vp-text leading-[0.92] tracking-tight">
            My plans
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-orange text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
        >
          <Plus size={15} />
          New plan
        </button>
      </div>

      {/* Billing warning — only when payment needs attention */}
      {profile.is_pro && (profile.subscription_status === 'past_due' || profile.subscription_status === 'unpaid') && (
        <div className="mb-6 flex items-start gap-3 bg-orange/5 border border-orange/30 rounded-xl px-4 py-3.5">
          <AlertTriangle size={14} className="text-orange shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-vp-text">Payment issue with your subscription</p>
            <p className="text-xs text-vp-muted mt-0.5">
              {profile.subscription_status === 'past_due'
                ? 'Your last payment failed. Update your payment method to keep Pro access.'
                : 'Your subscription is unpaid. Please update your billing details.'}
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 text-xs font-medium text-orange hover:text-orange/80 transition-colors whitespace-nowrap"
          >
            Fix now →
          </Link>
        </div>
      )}

      {/* Free tier usage bar */}
      {!profile.is_pro && (
        <div className="bg-vp-surface border border-vp-border rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-vp-text">
              {used} of {FREE_LIMIT} plans used this month
            </span>
            <span className="text-xs text-vp-muted">
              Resets {resetDate}
            </span>
          </div>
          <div className="h-1.5 bg-vp-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${usedPct}%`,
                backgroundColor: usedPct >= 100 ? '#FF5820' : usedPct >= 66 ? '#F59E0B' : '#16A34A',
              }}
            />
          </div>
          <p className="text-xs text-vp-muted/60 mt-3">
            Your most recent plan is always saved here.
          </p>
          {used >= FREE_LIMIT && (
            <p className="text-xs text-orange mt-1">
              You've used all your free plans this month.
            </p>
          )}
        </div>
      )}

      {/* Pro: stats strip + search + filter */}
      {profile.is_pro && (
        <div className="mb-6 space-y-4">
          {/* Stats strip */}
          {plans.length > 0 && (
            <div className="flex items-center gap-6 px-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl text-vp-text leading-none tracking-tight">{plans.length}</span>
                <span className="text-xs text-vp-muted">plan{plans.length !== 1 ? 's' : ''} saved</span>
              </div>
              <div className="w-px h-5 bg-vp-border" />
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl text-vp-text leading-none tracking-tight">{likedCount}</span>
                <span className="text-xs text-vp-muted">liked</span>
              </div>
              {lastSession && (
                <>
                  <div className="w-px h-5 bg-vp-border" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-vp-muted">Last session</span>
                    <span className="text-xs font-medium text-vp-text">{lastSession}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Search + filter row */}
          {plans.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-vp-muted/50 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search plans…"
                  className="w-full bg-vp-surface-2 border border-vp-border rounded-md pl-8 pr-8 py-2 text-xs text-vp-text placeholder:text-vp-muted/40 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/20 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-vp-muted/50 hover:text-vp-muted transition-colors"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 bg-vp-surface-2 border border-vp-border rounded-lg p-1 ml-auto">
                {(['all', 'liked'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={
                      filter === f
                        ? 'px-3 py-1 rounded-md text-xs font-medium bg-vp-border text-vp-text transition-colors'
                        : 'px-3 py-1 rounded-md text-xs font-medium text-vp-muted hover:text-vp-text transition-colors'
                    }
                  >
                    {f === 'all' ? 'All' : '♥ Liked'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plans */}
      {visiblePlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onDelete={setDeleteTarget}
              onToggleLiked={handleToggleLiked}
              deleting={deleting === plan.id}
            />
          ))}
          {!profile.is_pro && <LockedPlanCard />}
        </div>
      ) : (
        <>
          {/* No search results */}
          {search.trim() && (
            <div className="bg-vp-surface border border-vp-border rounded-xl px-6 py-12 text-center">
              <p className="text-vp-muted text-sm mb-3">No plans match &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => setSearch('')}
                className="text-xs text-orange hover:text-orange/80 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          {/* No liked plans */}
          {!search.trim() && filter === 'liked' && (
            <div className="bg-vp-surface border border-vp-border rounded-xl px-6 py-12 text-center">
              <p className="text-vp-muted text-sm">You haven&apos;t liked any plans yet.</p>
              <p className="text-vp-muted/60 text-xs mt-1">Hit the ♥ on any plan to save it here.</p>
            </div>
          )}

          {/* Pro empty state — no plans at all */}
          {!search.trim() && filter === 'all' && profile.is_pro && (
            <div className="bg-vp-surface border border-vp-border rounded-xl px-6 py-16 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-orange mb-4">Ready when you are</p>
              <h2 className="font-display font-bold uppercase text-3xl text-vp-text leading-[0.92] tracking-tight mb-3">
                Your first plan<br />is one click away
              </h2>
              <p className="text-sm text-vp-muted mb-6 max-w-xs mx-auto">
                Every plan you generate is saved here — full history, any time.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 bg-orange text-white px-5 py-3 rounded-md text-sm font-semibold hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
              >
                <Plus size={15} />
                Generate your first plan
              </button>
            </div>
          )}

          {/* Free empty state */}
          {!search.trim() && filter === 'all' && !profile.is_pro && (
            <div className="bg-vp-surface border border-vp-border rounded-xl px-6 py-16 text-center">
              <p className="text-vp-muted text-sm mb-4">
                No plans yet. Generate your first session plan to get started.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 bg-orange text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
              >
                <Plus size={15} />
                Generate a plan
              </button>
            </div>
          )}
        </>
      )}

      {/* Liked drills — Pro only */}
      {profile.is_pro && likedDrills.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp size={13} className="text-green-400" />
            <p className="text-xs font-medium uppercase tracking-widest text-vp-muted">Drills you&apos;ve rated</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {likedDrills.map(drill => (
              <Link
                key={drill.id}
                href={`/plan/${drill.plan_id}`}
                className="bg-vp-surface border border-vp-border rounded-xl p-4 flex flex-col gap-2 hover:border-vp-muted transition-colors duration-150 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-vp-text leading-snug group-hover:text-white transition-colors">
                    {drill.drill_name}
                  </span>
                  <ThumbsUp size={11} className="text-green-400 shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-vp-muted/60">{drill.drill_type}</span>
                  <span className="text-vp-muted/30 text-xs">·</span>
                  <span className="text-xs text-vp-muted/60 truncate">{drill.plan_title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pro upsell — free users only */}
      {!profile.is_pro && (
        <div className="mt-6 relative rounded-xl overflow-hidden border border-orange/20 bg-linear-to-br from-vp-surface via-vp-surface to-orange/5">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-orange/40 to-transparent" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

              {/* Left — copy */}
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-orange mb-3">
                  VolleyPlanner Pro
                </p>
                <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl text-vp-text leading-[0.92] tracking-tight mb-4">
                  Coach without limits
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                  {PRO_BENEFITS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2.5 text-sm text-vp-muted">
                      <Icon size={13} className="text-orange shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — CTA */}
              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                <div className="text-right mb-1">
                  <span className="font-display font-bold uppercase text-3xl text-vp-text tracking-tight">£6</span>
                  <span className="text-sm text-vp-muted">/month</span>
                </div>
                <button className="flex items-center gap-2 bg-orange text-white px-5 py-3 rounded-md text-sm font-semibold hover:bg-orange/90 transition-all duration-150 active:scale-[0.98] whitespace-nowrap">
                  Upgrade to Pro <ArrowRight size={14} />
                </button>
                <p className="text-xs text-vp-muted/60">Cancel any time.</p>
              </div>

            </div>
          </div>
        </div>
      )}


    </div>
  )
}
