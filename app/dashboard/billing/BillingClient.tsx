'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CreditCard, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface BillingClientProps {
  email: string
  profile: {
    is_pro: boolean
    stripe_customer_id: string | null
    stripe_subscription_id: string | null
    subscription_status: string | null
    plans_used_this_month: number
    plans_reset_at: string
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null

  const config: Record<string, { label: string; icon: typeof CheckCircle2; colour: string }> = {
    active:             { label: 'Active',             icon: CheckCircle2, colour: 'text-green-400' },
    trialing:           { label: 'Trial',              icon: Clock,        colour: 'text-amber-400' },
    past_due:           { label: 'Payment overdue',    icon: AlertCircle,  colour: 'text-orange'    },
    canceled:           { label: 'Cancelled',          icon: AlertCircle,  colour: 'text-vp-muted'  },
    unpaid:             { label: 'Unpaid',             icon: AlertCircle,  colour: 'text-red-400'   },
    incomplete:         { label: 'Incomplete',         icon: AlertCircle,  colour: 'text-amber-400' },
    incomplete_expired: { label: 'Expired',            icon: AlertCircle,  colour: 'text-vp-muted'  },
  }

  const c = config[status] ?? { label: status, icon: CheckCircle2, colour: 'text-vp-muted' }
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.colour}`}>
      <Icon size={13} />
      {c.label}
    </span>
  )
}

export function BillingClient({ email, profile }: BillingClientProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleManageBilling() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const json = await res.json()

      if (!res.ok || !json.data?.url) {
        setError('Could not open billing portal. Please try again.')
        return
      }

      window.location.href = json.data.url
    } catch {
      setError('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const resetDate = formatDate(profile.plans_reset_at)
  const hasStripe = !!profile.stripe_customer_id

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-vp-muted hover:text-vp-text transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={12} />
          Back to dashboard
        </Link>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl text-vp-text leading-[0.92] tracking-tight">
          Billing
        </h1>
      </div>

      {/* Current plan card */}
      <div className="bg-vp-surface border border-vp-border rounded-xl p-6 mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">Current plan</p>

        <div className="flex items-start justify-between gap-4">
          <div>
            {profile.is_pro ? (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display font-bold uppercase text-2xl text-vp-text tracking-tight leading-none">
                    VolleyPlanner Pro
                  </span>
                  <StatusBadge status={profile.subscription_status} />
                </div>
                <p className="text-sm text-vp-muted">
                  £6 / month · unlimited plans · full session history
                </p>
              </>
            ) : (
              <>
                <span className="font-display font-bold uppercase text-2xl text-vp-text tracking-tight leading-none block mb-1">
                  Free
                </span>
                <p className="text-sm text-vp-muted">
                  {profile.plans_used_this_month} of 3 plans used · resets {resetDate}
                </p>
              </>
            )}
          </div>

          {profile.is_pro && (
            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange/10 text-orange border border-orange/20">
              Pro
            </span>
          )}
        </div>
      </div>

      {/* Billing management card */}
      {profile.is_pro && (
        <div className="bg-vp-surface border border-vp-border rounded-xl p-6 mb-4">
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">Manage subscription</p>

          <p className="text-sm text-vp-muted mb-5 leading-relaxed">
            Update your payment method, download invoices, or cancel your subscription, all via Stripe.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManageBilling}
              disabled={loading || !hasStripe}
              className="flex items-center gap-2 bg-orange text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <CreditCard size={14} />
              {loading ? 'Opening…' : 'Manage billing'}
              {!loading && <ExternalLink size={12} className="opacity-60" />}
            </button>

            {!hasStripe && (
              <p className="text-xs text-vp-muted/60">
                No billing account linked yet.
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 mt-3">{error}</p>
          )}

          <p className="text-xs text-vp-muted/50 mt-4">
            You&apos;ll be taken to Stripe&apos;s secure billing portal and returned here when you&apos;re done.
          </p>
        </div>
      )}

      {/* Account details card */}
      <div className="bg-vp-surface border border-vp-border rounded-xl p-6 mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">Account details</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-vp-muted">Email</span>
          <span className="text-sm text-vp-text">{email}</span>
        </div>
      </div>

      {/* Upgrade card — free users only */}
      {!profile.is_pro && (
        <div className="bg-vp-surface border border-orange/20 rounded-xl p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-orange mb-3">VolleyPlanner Pro</p>
          <h2 className="font-display font-bold uppercase text-2xl text-vp-text leading-[0.92] tracking-tight mb-2">
            More than 3 sessions a month?
          </h2>
          <p className="text-sm text-vp-muted mb-5">
            £6/month — unlimited plans, full session history, PDF export, regenerate any drill.
          </p>
          <button className="flex items-center gap-2 bg-orange text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]">
            Upgrade to Pro
          </button>
          <p className="text-xs text-vp-muted/50 mt-3">Cancel any time.</p>
        </div>
      )}

    </div>
  )
}
