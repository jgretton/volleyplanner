import type { TimelineBlock } from '@/types/plan'

// 'navy' from Claude maps to blue (Technical/Progressive phases)
const colourClasses: Record<string, string> = {
  amber:  'bg-amber-500',
  navy:   'bg-blue-500',
  orange: 'bg-orange',
  teal:   'bg-teal-500',
  green:  'bg-blue-400',
}

interface TimelineBarProps {
  timeline: TimelineBlock[]
  totalDuration: number
}

export function TimelineBar({ timeline, totalDuration }: TimelineBarProps) {
  return (
    <div className="w-full">
      <div className="flex h-8 rounded-lg overflow-hidden gap-px">
        {timeline.map((block, i) => {
          const widthPct = (block.duration / totalDuration) * 100
          const isWide   = widthPct > 12
          return (
            <div
              key={i}
              className={`${colourClasses[block.colour] ?? 'bg-vp-surface-2'} flex items-center justify-center relative group`}
              style={{ width: `${widthPct}%` }}
              title={`${block.label} — ${block.duration} min`}
            >
              {isWide && (
                <span className="text-white text-xs font-medium truncate px-2 select-none">
                  {block.label}
                </span>
              )}
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-vp-surface-2 border border-vp-border text-vp-text text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {block.label} — {block.duration} min
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between mt-2 text-xs text-vp-muted">
        <span>0 min</span>
        {totalDuration >= 60 && <span>{Math.floor(totalDuration / 2)} min</span>}
        <span>{totalDuration} min</span>
      </div>
    </div>
  )
}
