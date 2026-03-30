import { ThumbsUp, ThumbsDown, RefreshCw, ArrowLeftRight, Lock } from 'lucide-react'
import { ServeReceiveDiagram } from './ServeReceiveDiagram'

const TIMELINE = [
  { label: 'Warm-up',     colour: 'bg-amber-500', pct: '13%', dur: '12m' },
  { label: 'Technical',   colour: 'bg-blue-500',  pct: '24%', dur: '22m' },
  { label: 'Progressive', colour: 'bg-blue-400',  pct: '27%', dur: '25m' },
  { label: 'Game',        colour: 'bg-orange',     pct: '24%', dur: '22m' },
  { label: 'Cool-down',   colour: 'bg-teal-500',   pct: '10%', dur: '9m'  },
]

const INSTRUCTIONS = [
  'Server stands at position 1 and serves to the receiving team.',
  'Receiving players hold the W formation — no shuffling until ball is in the air.',
  'The designated passer calls "mine" and passes to the setter target zone at position 2/3.',
  'Setter collects and sets back to a target player; rotate after 5 successful receptions.',
]

const COACHING_POINTS = [
  'Passers should read the server\'s shoulder angle before moving.',
  'Call "mine" early and loudly — communication is non-negotiable.',
  'Platform angle: aim for the setter target, not just "up".',
  'If the pass is off-target, setter must communicate and adjust.',
]

export function PlanShowcase() {
  return (
    <div className="bg-vp-surface border border-vp-border rounded-xl overflow-hidden">

      {/* Plan header */}
      <div className="px-6 sm:px-8 py-6 border-b border-vp-border">
        <p className="text-xs font-medium uppercase tracking-widest text-orange mb-1">Generated plan</p>
        <h3 className="font-display font-bold uppercase text-2xl text-vp-text leading-tight tracking-tight">
          Passing &amp; Serve Receive
        </h3>
        <p className="text-sm text-vp-muted mt-1">90 min · 10 players · Intermediate</p>
      </div>

      {/* Timeline */}
      <div className="px-6 sm:px-8 py-5 border-b border-vp-border">
        <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">Session timeline</p>
        <div className="flex rounded overflow-hidden h-2 gap-px mb-3">
          {TIMELINE.map(p => (
            <div key={p.label} className={`${p.colour}`} style={{ width: p.pct }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {TIMELINE.map(p => (
            <div key={p.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${p.colour} shrink-0`} />
              <span className="text-xs text-vp-muted">{p.label} · {p.dur}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured drill card */}
      <div className="border-l-4 border-l-blue-500">

        {/* Drill header — matches DrillCard design */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-vp-border bg-blue-500/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2.5">
            <h4 className="font-display font-bold uppercase text-xl text-vp-text leading-tight tracking-tight">
              Serve Receive Positioning Patterns
            </h4>
            {/* Pro action buttons — locked, but interactive on hover */}
            <div className="flex items-center gap-1 shrink-0">
              <button title="Rate drill — Pro feature" className="relative w-11 h-11 rounded-md border border-vp-border text-vp-muted/60 flex items-center justify-center hover:border-green-500/30 hover:text-green-400/50 hover:bg-green-500/5 transition-colors duration-150 cursor-not-allowed">
                <ThumbsUp size={18} />
                <Lock size={10} className="absolute bottom-1 right-1 text-vp-muted/70" />
              </button>
              <button title="Rate drill — Pro feature" className="relative w-11 h-11 rounded-md border border-vp-border text-vp-muted/60 flex items-center justify-center hover:border-red-500/30 hover:text-red-400/50 hover:bg-red-500/5 transition-colors duration-150 cursor-not-allowed">
                <ThumbsDown size={18} />
                <Lock size={10} className="absolute bottom-1 right-1 text-vp-muted/70" />
              </button>
              <div className="w-px h-5 bg-vp-border mx-0.5" />
              <button title="Regenerate drill — Pro feature" className="relative w-11 h-11 rounded-md border border-vp-border text-vp-muted/60 flex items-center justify-center hover:border-vp-muted hover:text-vp-muted/70 hover:bg-vp-surface-2 transition-colors duration-150 cursor-not-allowed">
                <RefreshCw size={18} />
                <Lock size={10} className="absolute bottom-1 right-1 text-vp-muted/70" />
              </button>
              <button title="Swap for alternative drill — Pro feature" className="relative w-11 h-11 rounded-md border border-vp-border text-vp-muted/60 flex items-center justify-center hover:border-vp-muted hover:text-vp-muted/70 hover:bg-vp-surface-2 transition-colors duration-150 cursor-not-allowed">
                <ArrowLeftRight size={18} />
                <Lock size={10} className="absolute bottom-1 right-1 text-vp-muted/70" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Technical
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vp-surface-2 text-vp-muted border border-vp-border">
              22 min
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vp-surface-2 text-vp-muted border border-vp-border">
              6 passers
            </span>
          </div>
        </div>

        {/* Drill body — diagram + content */}
        <div className="flex flex-col md:flex-row">

          {/* Diagram column */}
          <div className="md:w-56 shrink-0 p-5 border-b md:border-b-0 md:border-r border-vp-border">
            <div className="rounded-lg overflow-hidden border border-vp-border bg-white">
              <ServeReceiveDiagram />
            </div>
            <p className="text-xs text-vp-muted text-center mt-2 leading-snug">W formation · serve receive</p>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">Equipment</p>
              {['Volleyballs (6)', 'Ball cart'].map(item => (
                <div key={item} className="flex gap-2 items-center text-xs text-vp-text">
                  <span className="w-1 h-1 rounded-full bg-vp-muted/50 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions + coaching points */}
          <div className="flex-1 p-5 sm:p-6 space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-2">Setup</p>
              <p className="text-sm text-vp-muted leading-relaxed">
                Receiving team takes up W formation on one side of the net. One server at position 1. Setter positioned at target zone near position 2/3. Remaining players rotate through receiving positions.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">Instructions</p>
              <ol className="space-y-2.5">
                {INSTRUCTIONS.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-orange/15 text-orange text-xs font-bold flex items-center justify-center mt-0.5 leading-none">
                      {i + 1}
                    </span>
                    <span className="text-sm text-vp-text leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-vp-border pt-5">
              <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-3">Coaching points</p>
              <ul className="space-y-2">
                {COACHING_POINTS.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange/60 mt-2" />
                    <span className="text-sm text-vp-text leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-vp-border pt-5">
              <div className="bg-vp-surface-2 border border-vp-border border-l-4 border-l-blue-500 rounded-lg px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1">Progression</p>
                <p className="text-sm text-vp-text leading-relaxed">
                  Add a second server to vary serve direction and speed. Introduce a block on the setter&apos;s side to increase decision-making pressure on the passer.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer hint */}
      <div className="px-6 sm:px-8 py-4 bg-vp-surface-2 border-t border-vp-border text-center">
        <span className="text-xs text-vp-muted/60">+ 5 more drills in the full plan — game-based, cool-down, and progressions included</span>
      </div>

    </div>
  )
}
