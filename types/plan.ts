export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed'

export type DrillPhase = 'Warm-up' | 'Technical' | 'Progressive' | 'Game-based' | 'Cool-down'

export type DiagramType =
  | 'serve_receive'
  | 'hitting_lines'
  | 'pepper_pairs'
  | 'wash_3v3'
  | 'defensive_positioning'
  | 'transition_play'
  | 'setting_patterns'
  | 'blocking_footwork'
  | 'free_ball_handling'
  | 'game_scenario'
  | 'none'

export interface TimelineBlock {
  phase: string
  label: string
  duration: number
  colour: 'amber' | 'navy' | 'orange' | 'teal' | 'green'
}

export interface DiagramConfig {
  formation: string
  notes: string
}

export interface Drill {
  name: string
  phase: DrillPhase
  duration: number
  players_needed: number
  diagram_type: DiagramType
  diagram_config: DiagramConfig
  setup: string
  instructions: string[]
  coaching_points: string[]
  progression: string
  equipment: string[]
}

export interface SessionPlan {
  title: string
  overview: string
  total_duration: number
  player_count: number
  level: SkillLevel
  focus: string
  timeline: TimelineBlock[]
  drills: Drill[]
  session_notes: string
}

export interface SessionFormInputs {
  players: number
  duration: number
  level: SkillLevel
  description: string
}

export interface LikedDrill {
  drill_name: string
  drill_type: DiagramType
}
