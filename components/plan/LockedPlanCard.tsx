import { Lock } from 'lucide-react'

export function LockedPlanCard() {
  return (
    <div className="relative bg-vp-surface border border-vp-border rounded-xl p-5 flex flex-col gap-5 overflow-hidden select-none">

      {/* Ghost content — matches current PlanCard layout */}
      <div className="blur-sm opacity-30 flex flex-col gap-5 pointer-events-none">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-vp-muted/50" />
            <div className="h-3 bg-vp-muted/30 rounded w-20" />
          </div>
          <div className="w-5 h-5 rounded bg-vp-muted/20" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-vp-muted/30 rounded w-full" />
          <div className="h-5 bg-vp-muted/20 rounded w-3/4" />
        </div>
        {/* Meta */}
        <div className="h-3 bg-vp-muted/20 rounded w-48 -mt-2" />
        {/* Button */}
        <div className="h-9 bg-vp-muted/20 rounded-md w-full" />
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-vp-surface/70 backdrop-blur-[2px]">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-vp-surface-2 border border-vp-border">
          <Lock size={15} className="text-vp-muted" />
        </div>
        <div className="text-center px-4">
          <p className="text-xs font-medium text-vp-text mb-1">Your full session history</p>
          <p className="text-xs text-vp-muted">Save every plan, revisit any time.</p>
        </div>
        <button className="text-xs font-medium text-orange border border-orange/30 bg-orange/10 hover:bg-orange hover:text-white px-4 py-2 rounded-md transition-all duration-150">
          Upgrade to Pro
        </button>
      </div>

    </div>
  )
}
