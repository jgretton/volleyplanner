import { ArrowRight } from 'lucide-react'

const DRILLS = [
  { phase: 'Warm-up',     colour: 'bg-amber-500', name: 'Dynamic movement & ball work',      dur: '12m' },
  { phase: 'Technical',   colour: 'bg-blue-500',  name: 'Serve receive positioning patterns', dur: '22m' },
  { phase: 'Progressive', colour: 'bg-blue-400',  name: '3-person passing circuit',           dur: '25m' },
  { phase: 'Game',        colour: 'bg-orange',     name: 'Cooperative rally scoring game',     dur: '22m' },
  { phase: 'Cool-down',   colour: 'bg-teal-500',   name: 'Team stretch & session review',      dur: '9m'  },
]

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* Phone shell */}
      <div className="bg-[#1A1A1A] rounded-[44px] p-2.5 shadow-2xl border border-white/10 ring-1 ring-white/5">
        {/* Screen */}
        <div className="bg-vp-bg rounded-[36px] overflow-hidden" style={{ height: '540px' }}>

          {/* Status bar */}
          <div className="flex justify-between items-center px-5 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-vp-text/80">9:41</span>
            <div className="w-20 h-5 bg-[#1A1A1A] rounded-full" />
            <div className="flex items-center gap-1 opacity-70">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" className="text-vp-text">
                <rect x="0" y="3" width="3" height="7" rx="0.5" opacity="0.4" />
                <rect x="4.5" y="2" width="3" height="8" rx="0.5" opacity="0.6" />
                <rect x="9" y="0.5" width="3" height="9.5" rx="0.5" opacity="0.8" />
                <rect x="13.5" y="0" width="2.5" height="10" rx="0.5" />
              </svg>
            </div>
          </div>

          {/* App content */}
          <div className="px-4 pt-2 pb-4 h-full overflow-hidden">

            {/* Header */}
            <div className="mb-3">
              <p className="text-[9px] font-medium uppercase tracking-widest text-orange">Session view</p>
              <h3 className="text-vp-text font-bold text-sm leading-tight mt-0.5">
                Passing &amp; Serve Receive
              </h3>
              <p className="text-vp-muted text-[10px] mt-0.5">90 min · 10 players · Intermediate</p>
            </div>

            {/* Timeline bar */}
            <div className="flex rounded overflow-hidden h-1 mb-3 gap-px">
              <div className="bg-amber-500 w-[13%]" />
              <div className="bg-blue-500 w-[24%]" />
              <div className="bg-blue-400 w-[27%]" />
              <div className="bg-orange w-[24%]" />
              <div className="bg-teal-500 w-[10%]" />
            </div>

            {/* Drill list */}
            <div className="space-y-1.5">
              {DRILLS.map((drill, i) => (
                <div
                  key={i}
                  className="bg-vp-surface border border-vp-border rounded-lg px-3 py-2.5 flex items-center gap-2.5"
                >
                  <div className={`w-0.5 h-7 rounded-full shrink-0 ${drill.colour}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-vp-text text-[11px] font-medium truncate">{drill.name}</p>
                    <p className="text-vp-muted text-[9px] mt-0.5">{drill.phase} · {drill.dur}</p>
                  </div>
                  <ArrowRight size={9} className="text-vp-muted/40 shrink-0" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Glow effect underneath */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-10 bg-orange/20 blur-2xl rounded-full pointer-events-none" />
    </div>
  )
}
