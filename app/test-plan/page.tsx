'use client'

import { useState, useCallback } from 'react'
import { PlanView } from '@/components/plan/PlanView'
import { CompactView } from '@/components/plan/CompactView'
import { ViewToggle } from '@/components/plan/ViewToggle'
import { SwapModal } from '@/components/plan/SwapModal'
import { Printer } from 'lucide-react'
import type { SessionPlan, Drill } from '@/types/plan'

const MOCK_PLAN: SessionPlan = {
  title: 'Intermediate Serve Receive Session',
  overview: 'A structured 90-minute session focusing on serve receive under pressure. Players will work through individual platform mechanics, team W-formation patterns, and competitive game-based scenarios that replicate tournament pressure.',
  total_duration: 90,
  player_count: 12,
  level: 'intermediate',
  focus: 'Serve receive',
  timeline: [
    { phase: 'Warm-up',     label: 'Warm-up',     duration: 15, colour: 'amber' },
    { phase: 'Technical',   label: 'Technical',   duration: 20, colour: 'navy'  },
    { phase: 'Progressive', label: 'Progressive', duration: 25, colour: 'green' },
    { phase: 'Game-based',  label: 'Game-based',  duration: 25, colour: 'orange'},
    { phase: 'Cool-down',   label: 'Cool-down',   duration: 5,  colour: 'teal'  },
  ],
  drills: [
    {
      name: 'Dynamic Movement Warm-up',
      phase: 'Warm-up',
      duration: 10,
      players_needed: 12,
      diagram_type: 'none',
      diagram_config: { formation: '', notes: '' },
      setup: 'Players spread out across the court with space to move freely. Coach leads from the centre.',
      instructions: [
        'Jog the perimeter of the court twice at a steady pace.',
        'Side-shuffle along the attack lines, facing the net throughout.',
        'High knees along the back line, arms driving for rhythm.',
        'Reverse lunge with a trunk rotation on each step across the court.',
        'Finish with 10 arm circles each direction and wrist rolls.',
      ],
      coaching_points: [
        'Keep movements controlled — this is preparation, not a race.',
        'Remind players to breathe rhythmically from the start.',
        'Watch for players cutting corners on the lunge rotation.',
      ],
      progression: 'Add a reactive component: coach calls "change" mid-shuffle and players reverse direction.',
      equipment: [],
    },
    {
      name: 'Pepper Pairs — Platform Focus',
      phase: 'Warm-up',
      duration: 5,
      players_needed: 12,
      diagram_type: 'pepper_pairs',
      diagram_config: { formation: '6 pairs across the court', notes: '' },
      setup: 'Split into 6 pairs, spread across both sides of the court. Each pair has one ball.',
      instructions: [
        'Partner A tosses underarm to partner B who passes back to their hands.',
        'Focus on flat platform, contact below the waist, passing through the ball.',
        'After 10 reps, switch roles.',
        'Progress to a continuous sequence: pass-set-pass without stopping.',
      ],
      coaching_points: [
        'Platform angle is everything — arms tilted slightly forward, not straight up.',
        'Watch for players swinging their arms — the platform should be a firm shelf.',
        'Encourage quiet, controlled contact rather than power.',
      ],
      progression: 'Pairs attempt 20 consecutive passes without a break. Coach tracks the highest count.',
      equipment: ['1 ball per pair'],
    },
    {
      name: 'Serve Receive — Platform Mechanics',
      phase: 'Technical',
      duration: 20,
      players_needed: 12,
      diagram_type: 'serve_receive',
      diagram_config: { formation: 'W-formation, 4 passers + setter', notes: '' },
      setup: 'One server at position 1 on the far side. Four passers in W-formation near side. Setter at position 2/3. Remaining players queue to rotate in as servers.',
      instructions: [
        'Server delivers a float serve from position 1. Mix depth and angle.',
        'Passers call the ball early — loud and clear, no hesitation.',
        'Passer uses a controlled platform pass to target the setter\'s zone.',
        'Setter catches the ball, gives feedback on the quality of the pass, then returns it.',
        'Rotate: passer becomes server, server joins the queue, next player steps in.',
      ],
      coaching_points: [
        'Call the ball before it crosses the net — decision-making speed is the goal.',
        'Feet first: players must move to the ball before they set their platform.',
        'The setter\'s job is to give instant pass quality feedback ("good", "tight", "long").',
        'Watch for players over-reaching — take the extra step instead.',
      ],
      progression: 'Server starts serving more aggressively: topspin serves, varied pace. Passers must now adjust platform angle on the move.',
      equipment: ['6 balls', 'Serving targets (optional)'],
    },
    {
      name: '3-Passer Rotation Under Pressure',
      phase: 'Progressive',
      duration: 15,
      players_needed: 12,
      diagram_type: 'serve_receive',
      diagram_config: { formation: '3 passers + setter, two servers alternating', notes: '' },
      setup: 'Reduce to 3 passers in a simplified system. Two servers on far side alternate serves quickly. Setter and one attacker complete the system.',
      instructions: [
        'First server delivers immediately — no pause between serves.',
        'Second server is ready as the ball is received, serving 2-3 seconds after.',
        'Passers must communicate and cover zones between them.',
        'Setter sets to the attacker who catches and returns the ball to a server.',
        'Rotate one passer out every 8 serves, bringing in a fresh player.',
      ],
      coaching_points: [
        'The goal is composure under a faster tempo — not perfect passes, but controlled ones.',
        'Passers should be in their ready position before the server makes contact.',
        'Listen for communication breakdown — silence means players are guessing.',
      ],
      progression: 'Remove one passer so only 2 are covering the back court. Forces more movement and sharper decision-making.',
      equipment: ['8 balls', 'Ball cart'],
    },
    {
      name: 'Free Ball Into Attack',
      phase: 'Progressive',
      duration: 10,
      players_needed: 12,
      diagram_type: 'free_ball_handling',
      diagram_config: { formation: '3 passers + setter + 2 attackers', notes: '' },
      setup: 'Coach stands on a box or at the net on the far side with a supply of balls. Full 6 near side: 3 back-row passers, setter, two front-row attackers.',
      instructions: [
        'Coach tosses or pushes a free ball over the net — height and direction vary.',
        'Back-row player calls and passes to setter\'s zone.',
        'Setter sets to either outside hitter or middle — their choice.',
        'Attacker hits into the open court on the far side (no blockers).',
        'Coach immediately feeds the next ball. Keep the tempo high.',
      ],
      coaching_points: [
        'Free ball is an opportunity — players should be transitioning forward aggressively.',
        'Setter communicates with attackers before the ball is passed to them.',
        'Encourage attackers to read the block (even imaginary) and adjust their shot.',
      ],
      progression: 'Add one or two blockers on the far side to give attackers something real to work against.',
      equipment: ['12 balls', 'Ball cart'],
    },
    {
      name: 'Serve Receive Wash — Competitive Scrimmage',
      phase: 'Game-based',
      duration: 25,
      players_needed: 12,
      diagram_type: 'game_scenario',
      diagram_config: { formation: '6v6 full court', notes: '' },
      setup: '6v6 full court. One team serves, the other receives. Rally point scoring with a focus on serve receive efficiency. Each rotation has 5 serves before teams rotate.',
      instructions: [
        'Serving team attempts to disrupt the receiving team\'s system.',
        'Receiving team earns 2 points for a perfect pass (setter calls "perfect"), 1 point for an OK pass.',
        'Serving team earns 1 point for an ace or forced error.',
        'After 5 serves, teams rotate. After a full rotation cycle, teams switch sides.',
        'Coach tracks scores and announces standings after each rotation.',
      ],
      coaching_points: [
        'This is where technique meets pressure — focus on composure, not perfection.',
        'Recognise players who are leading communication and praise it publicly.',
        'Watch for players reverting to old habits when it\'s tight — this is the key coaching moment.',
        'Encourage the serving team to target specific passers, not just the middle.',
      ],
      progression: 'Award bonus points for a sideout on the first ball — rewards clean system play end-to-end.',
      equipment: ['6 balls', 'Scoreboard or whiteboard'],
    },
    {
      name: 'Cool-down and Debrief',
      phase: 'Cool-down',
      duration: 5,
      players_needed: 12,
      diagram_type: 'none',
      diagram_config: { formation: '', notes: '' },
      setup: 'Players gather at the net. Light static stretching — quads, hamstrings, hip flexors, shoulder cross-stretch.',
      instructions: [
        'Hold each stretch for 20-30 seconds. No bouncing.',
        'Coach leads a 2-minute group debrief: one thing we did well, one thing to work on.',
        'Players share one personal takeaway before heading off.',
      ],
      coaching_points: [
        'Keep the debrief positive and specific — "your passing platform angle improved" beats "good job".',
        'Set a clear focus for the next session so players leave with purpose.',
      ],
      progression: 'Consistent cool-down routine builds the habit — same structure every session.',
      equipment: [],
    },
  ],
  session_notes: 'Players have a tournament on Saturday. Prioritise confidence in the system over perfection. If energy is low in the progressive phase, cut the 3-passer drill short and spend more time on the scrimmage. Key players to watch: any who have been struggling with shanks under pressure — use the scrimmage to put them in high-pressure serving situations.',
}

export default function TestPlanPage() {
  const [view, setView] = useState<'full' | 'session'>(() => {
    if (typeof window === 'undefined') return 'full'
    return window.innerWidth < 768 ? 'session' : 'full'
  })
  const [plan, setPlan] = useState<SessionPlan>(MOCK_PLAN)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)
  const [swapIndex, setSwapIndex]     = useState<number | null>(null)
  const [swapOptions, setSwapOptions] = useState<Drill[] | null>(null)
  const [swapLoading, setSwapLoading] = useState(false)
  const [swapError, setSwapError]     = useState<string | null>(null)

  const handleRegenerate = useCallback(async (index: number) => {
    setRegeneratingIndex(index)
    try {
      const res = await fetch('/api/drill/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drill_index: index, plan }),
      })
      const json = await res.json()
      if (!res.ok) return
      setPlan(prev => {
        const drills = [...prev.drills]
        drills[index] = json.data
        return { ...prev, drills }
      })
    } catch {
      // Silently fail
    } finally {
      setRegeneratingIndex(null)
    }
  }, [plan])

  const handleSwapOpen = useCallback(async (index: number) => {
    setSwapIndex(index)
    setSwapOptions(null)
    setSwapError(null)
    setSwapLoading(true)
    try {
      const res = await fetch('/api/drill/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drill_index: index, plan }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSwapError(json.error ?? "Couldn't fetch alternatives. Please try again.")
        return
      }
      setSwapOptions(json.data)
    } catch {
      setSwapError('Something went wrong. Please try again.')
    } finally {
      setSwapLoading(false)
    }
  }, [plan])

  const handleSwapSelect = useCallback((drill: Drill) => {
    if (swapIndex === null) return
    setPlan(prev => {
      const drills = [...prev.drills]
      drills[swapIndex] = drill
      return { ...prev, drills }
    })
    setSwapIndex(null)
    setSwapOptions(null)
  }, [swapIndex])

  const handleSwapClose = useCallback(() => {
    setSwapIndex(null)
    setSwapOptions(null)
    setSwapError(null)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Dev banner */}
      <div className="bg-orange/10 border border-orange/20 rounded-xl px-5 py-3 mb-8 flex items-center justify-between gap-3">
        <p className="text-sm text-orange font-medium">Test plan — mock data, Pro features enabled</p>
        <a href="/" className="text-xs text-orange/70 hover:text-orange transition-colors">
          Back to home
        </a>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <ViewToggle view={view} onChange={setView} />
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm text-vp-muted hover:text-vp-text border border-vp-border px-3 py-1.5 rounded-md transition-colors duration-150"
        >
          <Printer size={13} />
          Print
        </button>
      </div>

      {view === 'full' ? (
        <PlanView
          plan={plan}
          isPro={true}
          regeneratingIndex={regeneratingIndex}
          onRegenerate={handleRegenerate}
          onSwap={handleSwapOpen}
        />
      ) : (
        <CompactView plan={plan} />
      )}

      {swapIndex !== null && (
        <SwapModal
          loading={swapLoading}
          options={swapOptions}
          error={swapError}
          onSelect={handleSwapSelect}
          onClose={handleSwapClose}
        />
      )}

    </div>
  )
}
