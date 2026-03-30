import { Zap, Smartphone, Printer, BookOpen } from 'lucide-react'

function CourtMiniDiagram() {
  return (
    <svg viewBox="0 0 200 250" className="w-full h-full opacity-90" aria-hidden="true">
      <rect x="10" y="10" width="180" height="230" fill="#F0F4F8" stroke="#94A3B8" strokeWidth="1" />
      <line x1="10" y1="120" x2="190" y2="120" stroke="#0B1F3A" strokeWidth="1.5" />
      <line x1="10" y1="74" x2="190" y2="74" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="4 3" />
      <line x1="10" y1="166" x2="190" y2="166" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="4 3" />
      {/* Players */}
      <circle cx="50"  cy="210" r="10" fill="#D85A30" /><text x="50"  y="214" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">P</text>
      <circle cx="100" cy="195" r="10" fill="#D85A30" /><text x="100" y="199" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">P</text>
      <circle cx="150" cy="210" r="10" fill="#D85A30" /><text x="150" y="214" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">P</text>
      <circle cx="155" cy="138" r="10" fill="#16A34A" /><text x="155" y="142" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">S</text>
      <circle cx="100" cy="30"  r="10" fill="#185FA5" /><text x="100" y="34"  textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">SV</text>
      <path d="M100 40 C90 80 80 105 58 184" fill="none" stroke="#185FA5" strokeWidth="1" strokeDasharray="4 3" />
      <path d="M58 174 Q100 155 145 138" fill="none" stroke="#D85A30" strokeWidth="1" />
      <polygon points="141,132 150,136 143,143" fill="#D85A30" />
    </svg>
  )
}

function TimelinePreview() {
  const segments = [
    { colour: 'bg-amber-500', w: '13%', label: 'Warm-up' },
    { colour: 'bg-blue-500',  w: '24%', label: 'Technical' },
    { colour: 'bg-blue-400',  w: '27%', label: 'Progressive' },
    { colour: 'bg-orange',    w: '24%', label: 'Game' },
    { colour: 'bg-teal-500',  w: '10%', label: 'Cool-down' },
  ]
  return (
    <div className="w-full">
      <div className="flex rounded overflow-hidden h-3 gap-px mb-4">
        {segments.map(s => <div key={s.label} className={`${s.colour}`} style={{ width: s.w }} />)}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${s.colour}`} />
            <span className="text-xs text-vp-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-vp-border rounded-xl overflow-hidden border border-vp-border">

      {/* Cell 1 — Court diagrams (tall, spans 2 rows on lg) */}
      <div className="bg-vp-surface p-6 sm:row-span-2 flex flex-col">
        <p className="text-xs font-medium uppercase tracking-widest text-orange mb-1">Diagrams</p>
        <h3 className="text-vp-text font-semibold text-sm mb-4">
          Court diagram for every drill
        </h3>
        <div className="flex-1 rounded-lg overflow-hidden border border-vp-border bg-white min-h-[180px]">
          <CourtMiniDiagram />
        </div>
        <p className="text-xs text-vp-muted mt-3 leading-relaxed">
          Player positions, movement arrows, and ball trajectories — clear enough to brief your squad in 30 seconds.
        </p>
      </div>

      {/* Cell 2 — Speed */}
      <div className="bg-vp-surface p-6 flex flex-col gap-3">
        <div className="w-9 h-9 rounded-lg bg-vp-surface-2 border border-vp-border flex items-center justify-center">
          <Zap size={16} className="text-vp-muted" />
        </div>
        <h3 className="text-vp-text font-semibold text-sm">Ready in under 60 seconds</h3>
        <p className="text-xs text-vp-muted leading-relaxed">
          Describe your session and the AI builds a complete structured plan while you get the bibs out.
        </p>
        <div className="mt-auto pt-3 border-t border-vp-border">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-3xl text-vp-text leading-none tracking-tight">~45s</span>
            <span className="text-xs text-vp-muted">average generation time</span>
          </div>
        </div>
      </div>

      {/* Cell 3 — Mobile */}
      <div className="bg-vp-surface p-6 flex flex-col gap-3">
        <div className="w-9 h-9 rounded-lg bg-vp-surface-2 border border-vp-border flex items-center justify-center">
          <Smartphone size={16} className="text-vp-muted" />
        </div>
        <h3 className="text-vp-text font-semibold text-sm">Built for the sports hall</h3>
        <p className="text-xs text-vp-muted leading-relaxed">
          The session view is designed for your phone. Tap a drill to expand it — no zooming, no squinting.
        </p>
      </div>

      {/* Cell 4 — Timeline (wide) */}
      <div className="bg-vp-surface p-6 lg:col-span-2 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1">Session timeline</p>
          <h3 className="text-vp-text font-semibold text-sm">Know exactly how long everything takes</h3>
        </div>
        <TimelinePreview />
        <p className="text-xs text-vp-muted leading-relaxed">
          Every session comes with a colour-coded timeline. Warm-up, technical, progressive, game-based, and cool-down phases — timed and balanced automatically.
        </p>
      </div>

      {/* Cell 5 — VE Terminology */}
      <div className="bg-vp-surface p-6 flex flex-col gap-3">
        <div className="w-9 h-9 rounded-lg bg-vp-surface-2 border border-vp-border flex items-center justify-center">
          <BookOpen size={16} className="text-vp-muted" />
        </div>
        <h3 className="text-vp-text font-semibold text-sm">Volleyball terminology, done right</h3>
        <p className="text-xs text-vp-muted leading-relaxed">
          Libero, serve receive, rally point scoring, 5-1 rotation — it speaks the same language you do.
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {['Libero', 'Setter', 'Serve receive', 'Outside hitter', '5-1 rotation'].map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-vp-surface-2 border border-vp-border text-vp-muted">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Cell 6 — Print */}
      <div className="bg-vp-surface p-6 flex flex-col gap-3">
        <div className="w-9 h-9 rounded-lg bg-vp-surface-2 border border-vp-border flex items-center justify-center">
          <Printer size={16} className="text-vp-muted" />
        </div>
        <h3 className="text-vp-text font-semibold text-sm">Print it, share it, use it</h3>
        <p className="text-xs text-vp-muted leading-relaxed">
          Clean print layout with diagrams. Or keep it on your phone. Works both ways.
        </p>
      </div>

    </div>
  )
}
