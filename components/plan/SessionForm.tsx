'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Loader2, ChevronDown, ArrowRight, ArrowUpRight, Users, Clock, Signal } from 'lucide-react'
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
    text: 'Working on serve receive — players keep shanking under pressure and we have a tournament this weekend.',
    duration: 90, players: 12, level: 'intermediate',
  },
  {
    label: 'Game play · Beginners',
    text: 'A few sessions in. Want to focus on basic game play, rotations, and getting lots of touches on the ball.',
    duration: 60, players: 8, level: 'beginner',
  },
  {
    label: 'Attacking · Advanced',
    text: 'Sharp attacking from positions 4 and 2, transition from defence to attack, and blocking reads.',
    duration: 90, players: 10, level: 'advanced',
  },
  {
    label: 'Pre-season fitness',
    text: 'Pre-season — fitness and conditioning with the ball, movement patterns, and team cohesion.',
    duration: 75, players: 14, level: 'mixed',
  },
]

type ActivePopover = 'duration' | 'players' | 'level' | null

function ParamPopover({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="absolute bottom-full left-0 mb-2 bg-vp-surface-2 border border-vp-border rounded-xl p-1.5 flex flex-col gap-0.5 shadow-xl z-40 min-w-32">
      {children}
    </div>
  )
}

function ParamOption({
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
        'px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors',
        selected
          ? 'bg-orange/10 text-orange'
          : 'text-vp-muted hover:bg-vp-border hover:text-vp-text'
      )}
    >
      {label}
    </button>
  )
}

export function SessionForm({
  hideSubmit = false,
  formId = 'plan-form',
}: {
  hideSubmit?: boolean
  formId?: string
}) {
  const router = useRouter()
  const textareaRef  = useRef<HTMLTextAreaElement>(null)
  const customInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading]               = useState(false)
  const [descError, setDescError]               = useState(false)
  const [activePopover, setActivePopover]       = useState<ActivePopover>(null)
  const [customMode, setCustomMode]             = useState<'players' | 'duration' | null>(null)
  const [customValue, setCustomValue]           = useState('')
  const [activeQuickStart, setActiveQuickStart] = useState<string | null>(null)
  const [description, setDescription]           = useState('')
  const [form, setForm]                         = useState<Omit<SessionFormInputs, 'description'>>({
    players:  10,
    duration: 90,
    level:    'intermediate',
  })

  const durationLabel = DURATION_OPTIONS.find(o => o.value === form.duration)?.label ?? `${form.duration} min`
  const levelLabel    = LEVEL_OPTIONS.find(o => o.value === form.level)?.label ?? 'Intermediate'
  const playersLabel  = `${form.players} players`

  function closePopover() {
    setActivePopover(null)
    setCustomMode(null)
    setCustomValue('')
  }

  function openCustomMode(field: 'players' | 'duration') {
    setCustomMode(field)
    setCustomValue('')
    setTimeout(() => customInputRef.current?.focus(), 50)
  }

  function confirmCustom() {
    const n = parseInt(customValue, 10)
    if (!n || n < 1) return
    if (customMode === 'players') setForm(f => ({ ...f, players: n }))
    if (customMode === 'duration') setForm(f => ({ ...f, duration: n }))
    closePopover()
  }

  // Close popover on outside click
  useEffect(() => {
    if (!activePopover) return
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-popover-root]')) closePopover()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [activePopover])

  function handleQuickStart(qs: typeof QUICK_STARTS[number]) {
    setDescription(qs.text)
    setForm({ players: qs.players, duration: qs.duration, level: qs.level })
    setDescError(false)
    setActiveQuickStart(qs.label)
    textareaRef.current?.focus()
  }

  function handleDescriptionChange(value: string) {
    setDescription(value)
    setDescError(false)
    setActiveQuickStart(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      setDescError(true)
      textareaRef.current?.focus()
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

  // Submit on Cmd/Ctrl+Enter
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} id={formId} className="w-full">

      {/* ── Main input card ──────────────────────────────────────────── */}
      <div className={cn(
        'relative rounded-2xl transition-all duration-200',
        'shadow-[0_0_0_1px_rgba(255,88,32,0.2),0_0_60px_rgba(255,88,32,0.08)]',
        descError && 'shadow-[0_0_0_1px_rgba(248,113,113,0.4),0_0_30px_rgba(248,113,113,0.06)]'
      )}>
        <div className="bg-vp-surface rounded-2xl">

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={5}
            value={description}
            onChange={e => handleDescriptionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your session — what do you want to work on, and what's the context?"
            className="w-full bg-transparent px-5 pt-5 pb-3 text-[16px] text-vp-text placeholder:text-vp-muted/30 focus:outline-none resize-none leading-relaxed"
          />

          {/* Footer toolbar */}
          <div className="px-4 pb-4 flex items-center gap-3">

            {/* Parameters — read as a sentence, each word clickable */}
            <div className="flex items-center gap-0 flex-1 min-w-0">

              {/* Players */}
              <div className="relative" data-popover-root>
                <button
                  type="button"
                  onClick={() => setActivePopover(p => p === 'players' ? null : 'players')}
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium pr-2 py-1.5 transition-colors duration-150 rounded-md',
                    activePopover === 'players' ? 'text-orange' : 'text-vp-muted hover:text-vp-text'
                  )}
                >
                  <Users size={11} className="shrink-0" />
                  {playersLabel}
                  <ChevronDown size={10} className="opacity-50 mt-px" />
                </button>
                <ParamPopover open={activePopover === 'players'}>
                  {customMode === 'players' ? (
                    <div className="px-2 py-1.5 flex items-center gap-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={100}
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); confirmCustom() } if (e.key === 'Escape') closePopover() }}
                        placeholder="e.g. 24"
                        className="w-20 bg-vp-border/50 border border-vp-border rounded-md px-2 py-1.5 text-[16px] leading-tight text-vp-text placeholder:text-vp-muted/40 focus:outline-none focus:border-orange/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={confirmCustom}
                        className="w-6 h-6 rounded-md bg-orange/10 text-orange hover:bg-orange hover:text-white flex items-center justify-center transition-colors shrink-0"
                      >
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {PLAYERS_OPTIONS.map(opt => (
                        <ParamOption
                          key={opt.value}
                          label={`${opt.label} players`}
                          selected={form.players === opt.value}
                          onClick={() => { setForm(f => ({ ...f, players: opt.value })); closePopover() }}
                        />
                      ))}
                      <div className="h-px bg-vp-border mx-1.5 my-0.5" />
                      <ParamOption label="Custom…" selected={false} onClick={() => openCustomMode('players')} />
                    </>
                  )}
                </ParamPopover>
              </div>

              <span className="text-vp-muted/20 text-xs select-none">·</span>

              {/* Duration */}
              <div className="relative" data-popover-root>
                <button
                  type="button"
                  onClick={() => setActivePopover(p => p === 'duration' ? null : 'duration')}
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium px-2 py-1.5 transition-colors duration-150 rounded-md',
                    activePopover === 'duration' ? 'text-orange' : 'text-vp-muted hover:text-vp-text'
                  )}
                >
                  <Clock size={11} className="shrink-0" />
                  {durationLabel}
                  <ChevronDown size={10} className="opacity-50 mt-px" />
                </button>
                <ParamPopover open={activePopover === 'duration'}>
                  {customMode === 'duration' ? (
                    <div className="px-2 py-1.5 flex items-center gap-2">
                      <input
                        ref={customMode === 'duration' ? customInputRef : undefined}
                        type="number"
                        min={1}
                        max={300}
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); confirmCustom() } if (e.key === 'Escape') closePopover() }}
                        placeholder="e.g. 30"
                        className="w-20 bg-vp-border/50 border border-vp-border rounded-md px-2 py-1.5 text-[16px] leading-tight text-vp-text placeholder:text-vp-muted/40 focus:outline-none focus:border-orange/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={confirmCustom}
                        className="w-6 h-6 rounded-md bg-orange/10 text-orange hover:bg-orange hover:text-white flex items-center justify-center transition-colors shrink-0"
                      >
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {DURATION_OPTIONS.map(opt => (
                        <ParamOption
                          key={opt.value}
                          label={opt.label}
                          selected={form.duration === opt.value}
                          onClick={() => { setForm(f => ({ ...f, duration: opt.value })); closePopover() }}
                        />
                      ))}
                      <div className="h-px bg-vp-border mx-1.5 my-0.5" />
                      <ParamOption label="Custom…" selected={false} onClick={() => openCustomMode('duration')} />
                    </>
                  )}
                </ParamPopover>
              </div>

              <span className="text-vp-muted/20 text-xs select-none">·</span>

              {/* Level */}
              <div className="relative" data-popover-root>
                <button
                  type="button"
                  onClick={() => setActivePopover(p => p === 'level' ? null : 'level')}
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium pl-2 py-1.5 transition-colors duration-150 rounded-md',
                    activePopover === 'level'
                      ? 'text-orange'
                      : 'text-vp-muted hover:text-vp-text'
                  )}
                >
                  <Signal size={11} className="shrink-0" />
                  {levelLabel}
                  <ChevronDown size={10} className="opacity-50 mt-px" />
                </button>
                <ParamPopover open={activePopover === 'level'}>
                  {LEVEL_OPTIONS.map(opt => (
                    <ParamOption
                      key={opt.value}
                      label={opt.label}
                      selected={form.level === opt.value}
                      onClick={() => { setForm(f => ({ ...f, level: opt.value })); closePopover() }}
                    />
                  ))}
                </ParamPopover>
              </div>
            </div>

            {/* Submit icon button */}
            {!hideSubmit && (
              <button
                type="submit"
                disabled={isLoading}
                aria-label="Generate plan"
                className={cn(
                  'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150',
                  'bg-orange text-white hover:bg-orange/90 active:scale-95',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  !description.trim() && 'opacity-40'
                )}
              >
                {isLoading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <ArrowUp size={16} />
                }
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Error */}
      {descError && (
        <p className="mt-2 text-xs text-red-400/80 px-1">
          Describe what you want to work on — the more detail, the better the plan.
        </p>
      )}

      {/* ── Quick-starts ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mt-4">
        {QUICK_STARTS.map(qs => (
          <button
            key={qs.label}
            type="button"
            onClick={() => handleQuickStart(qs)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150',
              activeQuickStart === qs.label
                ? 'border-orange/40 bg-orange/10 text-orange'
                : 'border-vp-border text-vp-muted/60 hover:border-vp-muted hover:text-vp-text bg-transparent'
            )}
          >
            {qs.label}
            <ArrowUpRight size={13} className="opacity-70 shrink-0" />
          </button>
        ))}
      </div>

    </form>
  )
}
