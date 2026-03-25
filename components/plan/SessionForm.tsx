'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { SessionFormInputs, SkillLevel } from '@/types/plan'

const DURATION_OPTIONS = [
  { label: '45 min', value: 45  },
  { label: '60 min', value: 60  },
  { label: '75 min', value: 75  },
  { label: '90 min', value: 90  },
  { label: '2 hrs',  value: 120 },
]

const PLAYERS_OPTIONS = [
  { label: '4',  value: 4  },
  { label: '6',  value: 6  },
  { label: '8',  value: 8  },
  { label: '10', value: 10 },
  { label: '12', value: 12 },
  { label: '14', value: 14 },
  { label: '16', value: 16 },
]

const LEVEL_OPTIONS = [
  { label: 'Beginner',     value: 'beginner'     as SkillLevel },
  { label: 'Intermediate', value: 'intermediate' as SkillLevel },
  { label: 'Advanced',     value: 'advanced'     as SkillLevel },
  { label: 'Mixed',        value: 'mixed'        as SkillLevel },
]

const QUICK_STARTS: Array<{
  label: string
  text: string
  duration: number
  players: number
  level: SkillLevel
}> = [
  {
    label: 'Serve receive · Intermediate',
    text: '12 players, 90 minutes, intermediate level. Working on serve receive - players keep shanking under pressure and we have a tournament this weekend.',
    duration: 90, players: 12, level: 'intermediate',
  },
  {
    label: 'Game play · Beginners',
    text: '8 players, 60 minutes, beginner level. A few sessions in - want to focus on basic game play, rotations, and getting lots of touches on the ball.',
    duration: 60, players: 8, level: 'beginner',
  },
  {
    label: 'Attacking · Advanced',
    text: '10 players, 90 minutes, advanced club. Sharp attacking from positions 4 and 2, transition from defence to attack, and blocking reads.',
    duration: 90, players: 10, level: 'advanced',
  },
  {
    label: 'Pre-season fitness',
    text: '14 players, 75 minutes, mixed ability. Pre-season session - fitness and conditioning with the ball, movement patterns, and team cohesion.',
    duration: 75, players: 14, level: 'mixed',
  },
]

type ActivePopover = 'duration' | 'players' | 'level' | null

// Shared pill button used in the toolbar
function Pill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-150 whitespace-nowrap',
        active
          ? 'border-orange/50 text-orange bg-orange/5'
          : 'border-vp-border text-vp-muted hover:border-vp-muted hover:text-vp-text'
      )}
    >
      {label}
      <ChevronDown size={12} />
    </button>
  )
}

// Shared dropdown panel
function Popover({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-full left-0 mb-2 bg-vp-surface-2 border border-vp-border rounded-lg p-1.5 flex flex-col gap-0.5 shadow-lg z-30 min-w-[110px]">
      {children}
    </div>
  )
}

function PopoverItem({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-md text-xs font-medium text-left transition-colors',
        selected
          ? 'bg-orange/10 text-orange'
          : 'text-vp-muted hover:bg-vp-border hover:text-vp-text'
      )}
    >
      {label}
    </button>
  )
}

export function SessionForm() {
  const router = useRouter()
  const [isLoading, setIsLoading]     = useState(false)
  const [descError, setDescError]     = useState(false)
  const [activePopover, setActivePopover] = useState<ActivePopover>(null)

  const [description, setDescription] = useState('')
  const [form, setForm] = useState<Omit<SessionFormInputs, 'description'>>({
    players:  10,
    duration: 90,
    level:    'intermediate',
  })

  const durationLabel = DURATION_OPTIONS.find(o => o.value === form.duration)?.label ?? '90 min'
  const playersLabel  = `${form.players} players`
  const levelLabel    = LEVEL_OPTIONS.find(o => o.value === form.level)?.label ?? 'Intermediate'

  function togglePopover(name: ActivePopover) {
    setActivePopover(prev => prev === name ? null : name)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      setDescError(true)
      return
    }
    setDescError(false)
    setIsLoading(true)

    const params = new URLSearchParams({
      players:     String(form.players),
      duration:    String(form.duration),
      level:       form.level,
      description,
    })
    const planPath = `/plan?${params.toString()}`

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      sessionStorage.setItem('vp_redirect_after_auth', planPath)
      router.push('/signin')
      return
    }

    router.push(planPath)
  }

  return (
    <form onSubmit={handleSubmit} id="plan-form" className="w-full">

      {/* Click-away overlay */}
      {activePopover && (
        <div className="fixed inset-0 z-20" onClick={() => setActivePopover(null)} />
      )}

      {/* ── Input card ───────────────────────────────────────────────── */}
      <div className={cn('relative rounded-xl shadow-[0_0_80px_rgba(255,88,32,0.1)]')}>
        <div className={cn(
          'bg-vp-surface border rounded-xl overflow-visible transition-colors duration-200',
          descError ? 'border-red-400/40' : 'border-orange/30'
        )}>

          {/* Textarea */}
          <textarea
            rows={4}
            value={description}
            onChange={e => { setDescription(e.target.value); setDescError(false) }}
            placeholder={'e.g. "12 players tonight, intermediate level. Working on serve receive - they keep shanking under pressure and we have a tournament on Saturday."'}
            className="w-full bg-transparent px-5 pt-5 pb-3 text-base sm:text-sm text-vp-text placeholder:text-vp-muted/35 focus:outline-none resize-none leading-relaxed"
          />

          {/* ── Bottom toolbar ──────────────────────────────────────── */}
          <div className="border-t border-vp-border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Controls row */}
            <div className="flex items-center gap-2 flex-wrap">

              {/* Duration */}
              <div className="relative z-20">
                <Pill
                  label={durationLabel}
                  active={activePopover === 'duration'}
                  onClick={() => togglePopover('duration')}
                />
                {activePopover === 'duration' && (
                  <Popover>
                    {DURATION_OPTIONS.map(opt => (
                      <PopoverItem
                        key={opt.value}
                        label={opt.label}
                        selected={form.duration === opt.value}
                        onClick={() => { setForm(f => ({ ...f, duration: opt.value })); setActivePopover(null) }}
                      />
                    ))}
                  </Popover>
                )}
              </div>

              {/* Players */}
              <div className="relative z-20">
                <Pill
                  label={playersLabel}
                  active={activePopover === 'players'}
                  onClick={() => togglePopover('players')}
                />
                {activePopover === 'players' && (
                  <Popover>
                    {PLAYERS_OPTIONS.map(opt => (
                      <PopoverItem
                        key={opt.value}
                        label={`${opt.label} players`}
                        selected={form.players === opt.value}
                        onClick={() => { setForm(f => ({ ...f, players: opt.value })); setActivePopover(null) }}
                      />
                    ))}
                  </Popover>
                )}
              </div>

              {/* Level */}
              <div className="relative z-20">
                <Pill
                  label={levelLabel}
                  active={activePopover === 'level'}
                  onClick={() => togglePopover('level')}
                />
                {activePopover === 'level' && (
                  <Popover>
                    {LEVEL_OPTIONS.map(opt => (
                      <PopoverItem
                        key={opt.value}
                        label={opt.label}
                        selected={form.level === opt.value}
                        onClick={() => { setForm(f => ({ ...f, level: opt.value })); setActivePopover(null) }}
                      />
                    ))}
                  </Popover>
                )}
              </div>

            </div>

            {/* Spacer (desktop only) */}
            <div className="hidden sm:block flex-1" />

            {/* Submit — full width on mobile, auto on desktop */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-orange/90 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? <><Loader2 size={16} className="animate-spin" /> Generating...</>
                : <><ArrowRight size={16} /> Generate plan</>
              }
            </button>

          </div>
        </div>
      </div>

      {/* Error */}
      {descError && (
        <p className="mt-2 text-xs text-red-400">
          Please describe your session - the more detail you give, the better your plan.
        </p>
      )}

      {/* Quick-start chips */}
      <div className="flex flex-wrap gap-2 mt-4">
        {QUICK_STARTS.map(qs => (
          <button
            key={qs.label}
            type="button"
            onClick={() => {
              setDescription(qs.text)
              setForm(f => ({ ...f, duration: qs.duration, players: qs.players, level: qs.level }))
              setDescError(false)
            }}
            className="px-3.5 py-1.5 rounded-full border border-vp-border text-xs text-vp-muted hover:border-vp-muted hover:text-vp-text transition-all duration-150"
          >
            {qs.label}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-vp-muted/50 mt-5">
        Free account · No password needed
      </p>

    </form>
  )
}
