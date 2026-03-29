import type { Metadata } from 'next'
import { SessionForm } from '@/components/plan/SessionForm'

export const metadata: Metadata = {
  title: 'New Session Plan',
  robots: { index: false },
}

export default function NewPlanPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">
          New session
        </p>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl text-vp-text leading-[0.92] tracking-tight mb-4">
          Build your plan
        </h1>
        <p className="text-vp-muted text-sm leading-relaxed">
          Describe your session and we'll generate a complete plan with court diagrams, drills, and coaching points.
        </p>
      </div>
      <SessionForm />
    </div>
  )
}
