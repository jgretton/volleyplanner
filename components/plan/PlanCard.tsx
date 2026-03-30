'use client'

import Link from 'next/link'
import { Trash2, Heart, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SavedPlan } from '@/types/plan'

const LEVEL_CONFIG: Record<string, { label: string; colour: string; borderClass: string }> = {
  beginner:     { label: 'Beginner',     colour: '#F59E0B', borderClass: 'border-l-amber-500'  },
  intermediate: { label: 'Intermediate', colour: '#3B82F6', borderClass: 'border-l-blue-500'   },
  advanced:     { label: 'Advanced',     colour: '#FF5820', borderClass: 'border-l-orange'      },
  mixed:        { label: 'Mixed',        colour: '#1D9E75', borderClass: 'border-l-teal-500'    },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

interface PlanCardProps {
  plan: Pick<SavedPlan, 'id' | 'title' | 'input_data' | 'liked' | 'created_at'>
  onDelete: (id: string) => void
  onToggleLiked: (id: string, liked: boolean) => void
  deleting?: boolean
}

export function PlanCard({ plan, onDelete, onToggleLiked, deleting }: PlanCardProps) {
  const { id, title, input_data, liked, created_at } = plan
  const level = LEVEL_CONFIG[input_data.level] ?? { label: input_data.level, colour: '#7B90A6', borderClass: 'border-l-vp-border' }

  return (
    <div className={cn(
      'relative bg-vp-surface border border-vp-border border-l-4 rounded-xl transition-all duration-200 group overflow-hidden',
      'hover:border-vp-muted hover:border-l-4',
      level.borderClass,
      deleting && 'opacity-40 pointer-events-none'
    )}>

      {/* Whole-card link */}
      <Link href={`/plan/${id}`} className="absolute inset-0 rounded-xl z-0" aria-label={`View plan: ${title}`} />

      {/* Card content */}
      <div className="relative z-10 flex flex-col pointer-events-none">

        {/* Body */}
        <div className="p-5 flex flex-col gap-3 flex-1">

          {/* Top row — level indicator + actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-vp-muted">{level.label}</span>
            </div>

            <div className="flex items-center gap-1 pointer-events-auto">
              <button
                onClick={e => { e.preventDefault(); onToggleLiked(id, !liked) }}
                aria-label={liked ? 'Unlike plan' : 'Like plan'}
                className="p-1.5 rounded-md transition-colors duration-150 text-vp-muted/50 hover:text-orange"
              >
                <Heart size={13} className={cn(liked && 'fill-orange text-orange')} />
              </button>

              <button
                onClick={e => { e.preventDefault(); onDelete(id) }}
                aria-label="Delete plan"
                className="p-1.5 rounded-md text-vp-muted/50 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold uppercase text-xl text-vp-text leading-[0.95] tracking-tight group-hover:text-white transition-colors">
            {title}
          </h3>

          {/* Meta */}
          <p className="text-xs text-vp-muted/50">
            {input_data.duration} min · {input_data.players} players
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-vp-border flex items-center justify-between">
          <span className="text-xs text-vp-muted/50">{formatDate(created_at)}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-orange opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            View <ArrowRight size={11} />
          </span>
        </div>

      </div>
    </div>
  )
}
