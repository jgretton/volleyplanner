'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

  const monthlyPrice = annual ? '$5' : '$6'
  const billingNote = annual ? 'Billed annually as $60' : 'Billed monthly'

  return (
    <section id="pricing" className="border-b border-vp-border">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">

          {/* Left — heading */}
          <div>
            <h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
              Two plans.
              <br />
              No surprises.
            </h2>
            <p className="text-vp-muted mt-4 text-sm leading-relaxed max-w-xs">
              Start for free. Upgrade if you need more.
            </p>
          </div>

          {/* Right — toggle + cards */}
          <div>
            {/* Billing toggle — centered above cards */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-vp-surface-2 border border-vp-border">
                <button
                  onClick={() => setAnnual(false)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                    !annual
                      ? 'bg-vp-surface text-vp-text border border-vp-border'
                      : 'text-vp-muted hover:text-vp-text'
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2',
                    annual
                      ? 'bg-vp-surface text-vp-text border border-vp-border'
                      : 'text-vp-muted hover:text-vp-text'
                  )}
                >
                  Annual
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-orange bg-orange/10 px-1.5 py-0.5 rounded">
                    2 months free
                  </span>
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free */}
              <div className="border border-vp-border rounded-xl p-7 bg-vp-surface">
                <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-5">
                  Free
                </p>
                <div className="mb-4">
                  <span className="font-display font-bold text-4xl text-vp-text">$0</span>
                  <span className="text-sm text-vp-muted ml-2">/ month</span>
                </div>
                <p className="text-sm text-vp-muted mb-5">
                  3 plans a month. Free account, no password needed.
                </p>
                <ul className="space-y-2.5 text-sm mb-7">
                  {[
                    'AI-generated session plans',
                    'Court diagrams',
                    'Mobile session view',
                    'Print layout',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-vp-muted">
                      <Check size={12} className="text-orange shrink-0 mt-px" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#plan-form"
                  className="block text-center border border-vp-border text-vp-text px-5 py-2.5 rounded-md text-sm font-medium hover:border-vp-muted transition-colors"
                >
                  Get started free
                </a>
              </div>

              {/* Pro */}
              <div className="border border-orange/30 rounded-xl p-7 bg-vp-surface relative">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-orange text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
                <p className="text-xs font-medium uppercase tracking-widest text-orange mb-5">
                  Pro
                </p>
                <div className="mb-1">
                  <span className="font-display font-bold text-4xl text-vp-text">
                    {monthlyPrice}
                  </span>
                  <span className="text-sm text-vp-muted ml-2">/ month</span>
                </div>
                <p className="text-xs text-vp-muted/60 mb-4">{billingNote}</p>
                <p className="text-sm text-vp-muted mb-5">
                  Unlimited plans, full session history, PDF export.
                </p>
                <ul className="space-y-2.5 text-sm mb-7">
                  {[
                    'Everything in Free',
                    'Unlimited plans',
                    'Save and revisit plans',
                    'Swap individual drills for alternatives',
                    'Coach notes per drill',
                    'PDF export',
                    'Share plan via link',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-vp-muted">
                      <Check size={12} className="text-orange shrink-0 mt-px" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#plan-form"
                  className="block text-center bg-orange text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-orange/90 transition-colors"
                >
                  Start free, upgrade anytime
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
