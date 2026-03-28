import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import type { SessionFormInputs, LikedDrill, SessionPlan, Drill } from '@/types/plan'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ── Zod schemas ──────────────────────────────────────────────────────────────

export const DrillSchema = z.object({
  name: z.string(),
  phase: z.enum(['Warm-up', 'Technical', 'Progressive', 'Game-based', 'Cool-down']),
  duration: z.number(),
  players_needed: z.number(),
  diagram_type: z.enum([
    'serve_receive', 'hitting_lines', 'pepper_pairs', 'wash_3v3',
    'defensive_positioning', 'transition_play', 'setting_patterns',
    'blocking_footwork', 'free_ball_handling', 'game_scenario', 'none',
  ]),
  diagram_config: z.object({
    formation: z.string(),
    notes: z.string(),
  }),
  setup: z.string(),
  instructions: z.array(z.string()),
  coaching_points: z.array(z.string()),
  progression: z.string(),
  equipment: z.array(z.string()),
})

export const SessionPlanSchema = z.object({
  title: z.string(),
  overview: z.string(),
  total_duration: z.number(),
  player_count: z.number(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
  focus: z.string(),
  timeline: z.array(z.object({
    phase: z.string(),
    label: z.string(),
    duration: z.number(),
    colour: z.enum(['amber', 'navy', 'orange', 'teal', 'green']),
  })),
  drills: z.array(DrillSchema),
  session_notes: z.string(),
})

// ── Prompts ──────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert volleyball coaching assistant with deep knowledge of grassroots and club-level volleyball in the UK. You help volunteer coaches plan structured, effective training sessions tailored to their squad.

You always use British English spelling and Volleyball England terminology.

You understand volleyball deeply: rotations, libero rules, serve receive systems (W-formation, U-shape), attacking patterns (5-1, 6-2, 4-2), defensive systems (perimeter, rotational), and age-appropriate coaching principles.

When generating a session plan, you prioritise:
- Maximising touches on the ball for every player
- Progressive skill development (simple → complex → game-like)
- Realistic timing — volunteer coaches run tight sessions
- Practical drills that work with the exact number of players given
- Clear, actionable instructions a non-expert coach can follow

You always respond with valid JSON only. No markdown, no explanation, no preamble. No code fences.`

function buildLikedDrillsSection(likedDrills: LikedDrill[]): string {
  if (!likedDrills.length) return ''
  return `
This coach has previously rated the following drills positively. Where appropriate, incorporate elements from these drills or similar patterns into the new session:

${likedDrills.map(d => `- ${d.drill_name} (${d.drill_type})`).join('\n')}

Do not copy these drills verbatim — use them as inspiration for the coach's preferences.
`
}

export function buildGeneratePrompt(
  inputs: SessionFormInputs,
  likedDrills: LikedDrill[] = [],
): string {
  return `Generate a complete volleyball training session plan based on the following coach request:

Coach's session description: "${inputs.description}"

Structured parameters:
- Players available: ${inputs.players}
- Session duration: ${inputs.duration} minutes
- Skill level: ${inputs.level}

Analyse the coach's description carefully to determine the primary focus, specific goals, and any constraints mentioned (e.g. tournament prep, missing players, specific weaknesses). Use all of this to build the most tailored session possible.

For the "focus" field in your JSON response, write a concise label derived from the coach's description (e.g. "Serve receive under pressure" rather than just "Passing").
${buildLikedDrillsSection(likedDrills)}
Respond with a single valid JSON object matching this exact schema:

{
  "title": "string",
  "overview": "string — 2-3 sentence summary",
  "total_duration": ${inputs.duration},
  "player_count": ${inputs.players},
  "level": "${inputs.level}",
  "focus": "string — concise label for the session focus",
  "timeline": [
    {
      "phase": "Warm-up | Technical | Progressive | Game-based | Cool-down",
      "label": "string",
      "duration": number,
      "colour": "amber | navy | orange | teal | green"
    }
  ],
  "drills": [
    {
      "name": "string",
      "phase": "Warm-up | Technical | Progressive | Game-based | Cool-down",
      "duration": number,
      "players_needed": number,
      "diagram_type": "serve_receive | hitting_lines | pepper_pairs | wash_3v3 | defensive_positioning | transition_play | setting_patterns | blocking_footwork | free_ball_handling | game_scenario | none",
      "diagram_config": { "formation": "string", "notes": "string" },
      "setup": "string",
      "instructions": ["string"],
      "coaching_points": ["string"],
      "progression": "string",
      "equipment": ["string"]
    }
  ],
  "session_notes": "string"
}

Rules:
- Include exactly 5-7 drills covering the full session duration
- First drill must always be a volleyball-specific warm-up (not running laps)
- Last drill must always be a game-based activity or cool-down reflection
- All drill durations must add up to exactly ${inputs.duration} minutes
- Every drill must work for exactly ${inputs.players} players
- Match complexity strictly to ${inputs.level} level
- Colour mapping: Warm-up = amber, Technical = navy, Progressive = navy, Game-based = orange, Cool-down = teal`
}

export function buildRegenerateDrillPrompt(
  drillName: string,
  phase: string,
  duration: number,
  players: number,
  level: string,
  focus: string,
  otherDrillNames: string[],
): string {
  return `Replace this volleyball drill: "${drillName}"

Session context:
- Phase: ${phase}
- Duration: ${duration} minutes
- Players: ${players}
- Level: ${level}
- Focus: ${focus}
- Other drills already in this session: ${otherDrillNames.join(', ')}

Generate ONE replacement drill that fits the same phase and duration, works for ${players} players, and is different from the drills listed above.

Respond with a single drill JSON object matching the drill schema. JSON only, no markdown.`
}

export function buildSwapDrillPrompt(
  drillName: string,
  phase: string,
  duration: number,
  players: number,
  level: string,
  focus: string,
): string {
  return `Suggest 3 alternative drills to replace: "${drillName}"

Context: ${players} players, ${level} level, focus ${focus}, phase ${phase}, duration ${duration} minutes.

Return a JSON array of exactly 3 drill objects matching the drill schema. JSON only, no markdown.`
}

// ── Single-drill functions ────────────────────────────────────────────────────

export async function regenerateDrill(
  plan: SessionPlan,
  drillIndex: number,
): Promise<Drill> {
  const drill = plan.drills[drillIndex]
  const otherNames = plan.drills.filter((_, i) => i !== drillIndex).map(d => d.name)
  const prompt = buildRegenerateDrillPrompt(
    drill.name,
    drill.phase,
    drill.duration,
    plan.player_count,
    plan.level,
    plan.focus,
    otherNames,
  )

  let response: string
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })
    const content = message.content[0]
    if (content.type !== 'text') throw new Error('generation_failed')
    response = content.text
  } catch (err) {
    console.error('Claude regenerate error:', err)
    throw new Error('generation_failed')
  }

  try {
    const cleaned = response.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const result = DrillSchema.safeParse(JSON.parse(cleaned))
    if (!result.success) throw new Error('generation_failed')
    return result.data
  } catch {
    throw new Error('generation_failed')
  }
}

export async function swapDrill(
  plan: SessionPlan,
  drillIndex: number,
): Promise<Drill[]> {
  const drill = plan.drills[drillIndex]
  const prompt = buildSwapDrillPrompt(
    drill.name,
    drill.phase,
    drill.duration,
    plan.player_count,
    plan.level,
    plan.focus,
  )

  let response: string
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })
    const content = message.content[0]
    if (content.type !== 'text') throw new Error('generation_failed')
    response = content.text
  } catch (err) {
    console.error('Claude swap error:', err)
    throw new Error('generation_failed')
  }

  try {
    const cleaned = response.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const result = z.array(DrillSchema).safeParse(JSON.parse(cleaned))
    if (!result.success) throw new Error('generation_failed')
    return result.data
  } catch {
    throw new Error('generation_failed')
  }
}

// ── Main generation function ─────────────────────────────────────────────────

export async function generateSessionPlan(
  inputs: SessionFormInputs,
  likedDrills: LikedDrill[] = [],
): Promise<SessionPlan> {
  const prompt = buildGeneratePrompt(inputs, likedDrills)

  let response: string

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')
    response = content.text
  } catch (err) {
    console.error('Claude API error:', err)
    throw new Error('generation_failed')
  }

  // Parse and validate — retry once on failure
  let parsed: unknown

  try {
    const cleaned = response.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    console.error('JSON parse failed on first attempt, retrying...')
    try {
      const retryMessage = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: prompt },
          { role: 'assistant', content: response },
          { role: 'user', content: 'Your response was not valid JSON. Please respond with only the JSON object, no markdown, no explanation.' },
        ],
      })
      const retryContent = retryMessage.content[0]
      if (retryContent.type !== 'text') throw new Error('generation_failed')
      const cleaned = retryContent.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      throw new Error('generation_failed')
    }
  }

  const result = SessionPlanSchema.safeParse(parsed)
  if (!result.success) {
    console.error('Schema validation failed:', result.error)
    throw new Error('generation_failed')
  }

  return result.data
}
