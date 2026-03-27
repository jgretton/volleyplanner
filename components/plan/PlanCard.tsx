'use client'

import Link from 'next/link'
import { Trash2, ArrowRight, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SavedPlan } from '@/types/plan'

const LEVEL_CONFIG: Record<string, { label: string; colour: string }> = {
  beginner:     { label: 'Beginner',     colour: '#F59E0B' },
  intermediate: { label: 'Intermediate', colour: '#3B82F6' },
  advanced:     { label: 'Advanced',     colour: '#FF5820' },
  mixed:        { label: 'Mixed',        colour: '#1D9E75' },
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
  const level = LEVEL_CONFIG[input_data.level] ?? { label: input_data.level, colour: '#7B90A6' }

  return (
    <div className={cn(
      'bg-vp-surface border border-vp-border rounded-xl p-5 flex flex-col gap-5 transition-opacity duration-200',
      deleting && 'opacity-40 pointer-events-none'
    )}>

      {/* Top row — level indicator + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: level.colour }}
          />
          <span className="text-xs font-medium text-vp-muted">{level.label}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Heart toggle */}
          <button
            onClick={() => onToggleLiked(id, !liked)}
            aria-label={liked ? 'Unlike plan' : 'Like plan'}
            className="p-1.5 rounded-md transition-colors duration-150 text-vp-muted/50 hover:text-orange"
          >
            <Heart size={13} className={cn(liked && 'fill-orange text-orange')} />
          </button>

          <button
            onClick={() => onDelete(id)}
            aria-label="Delete plan"
            className="p-1.5 rounded-md text-vp-muted/50 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold uppercase text-xl text-vp-text leading-[0.95] tracking-tight">
        {title}
      </h3>

      {/* Meta */}
      <p className="text-xs text-vp-muted/70 leading-relaxed -mt-2">
        {input_data.duration} min · {input_data.players} players · {formatDate(created_at)}
      </p>

      {/* View button */}
      <Link
        href={`/plan/${id}`}
        className="flex items-center justify-center gap-2 w-full bg-orange/10 border border-orange/20 text-orange px-4 py-2.5 rounded-md text-xs font-semibold hover:bg-orange hover:text-white transition-all duration-150"
      >
        View plan <ArrowRight size={12} />
      </Link>

    </div>
  )
}
