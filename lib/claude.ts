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
  on_court_count: z.number(),
  rotation_pattern: z.string(),
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

const SYSTEM_PROMPT = `You are an expert volleyball coaching assistant helping coaches plan effective training sessions. You serve coaches at all levels — from first-time recreational volunteers to experienced club coaches. You use internationally recognised volleyball terminology (FIVB standard): libero, setter, outside hitter, opposite, middle blocker, serve receive, rally point scoring.

## Coaching pedagogy

You follow modern volleyball coaching principles:

- Teaching Games for Understanding (TGfU): teach the game by playing modified versions of it, not by drilling isolated technique first. Drills have a game purpose, not just a skill purpose.
- Constraints-led coaching: use modifications to space, player count, scoring, or rules to create the desired learning outcome — rather than just instructing players what to do.
- Blocked to random sequencing: early in a session use blocked practice (predictable, repetitive, coach-initiated) for skill acquisition. Progress toward random, variable, game-like practice for retention and transfer to competition.

## Session arc

Every session follows this progression. Each phase has a specific purpose:

- Warm-up: volleyball-specific movement activation mirroring the motor patterns of the session focus. Not generic jogging or static stretching. Includes dynamic movement, ball familiarisation, and progressive intensity.
- Technical: blocked practice. Predictable entry, high repetitions, coach can give targeted feedback. Players learn or reinforce the movement pattern.
- Progressive: semi-opposed. More decision-making. Skill performed in a small group or against light opposition. Bridges technical work and game play.
- Game-based: competitive, game-realistic, scoring element. Random and variable — the skill is tested under pressure in a match-like context.
- Cool-down: brief reflection, light movement, session review.

## Flow drill design

You never assume all players are on court simultaneously unless the drill requires it. You design flow drills — rotational structures where players cycle through defined roles.

Roles can include: passer, setter, attacker, blocker, server, libero, and feeder. A feeder is a coach or designated off-court player who initiates a ball (toss, throw, or controlled hit) to simulate a specific game scenario such as a down ball, free ball, or attack. Use the feeder role when a drill requires a controlled entry point that live serving or rally play would not reliably produce at sufficient frequency.

On-court count is determined by the drill's purpose:
- Skill-based drills: fewer players on court, flow rotation maximises individual touches per player.
- Tactical and game-based drills: use the number the scenario actually requires. A 6v6 game scenario needs 12 players on court simultaneously and that is correct. Remaining players sub in on a defined rotation.

Every drill must specify: who is on court and in what role, who is serving or feeding, who is queuing and for which role, the exact rotation trigger (what event causes movement), and the full rotation path.

No player should wait more than 45 seconds between active touches.

## Instruction format

Instructions are read by a coach standing on court, often on a mobile phone. Write short, spatial, and visual instructions:

- Setup: where everyone starts. Use role names and court positions (positions 1–6, attack line, service line, zones 2/3/4).
- Sequence: numbered steps. One action per step. Maximum two short sentences per step.
- Rotation: explicit trigger and full path. Example: "When the setter catches the ball — setter joins the server queue on the far side, server becomes the next passer, passer moves to setter position."

## Coaching points

Maximum 3 coaching points per drill. Each must be specific and actionable — not generic.

Correct technical cues to use when relevant:
- Forearm pass: "feet to the ball first — move before you reach", "platform angled toward target at 45°", "contact between wrist and elbow — not on the hands", "both feet stay on the ground at contact"
- Setting: "show the window — hands shaped above forehead before the ball arrives", "beat the ball — feet arrive first", "soft to fast — absorb with fingers then extend legs and arms to target together"
- Attack approach: "slow first step, aggressive last two", "drive into the ground on the last two steps — convert forward speed into height", "bow and arrow at the top — hitting arm back, non-hitting arm points at the ball"
- Float serve: "toss to the hitting shoulder, slightly in front of the body", "contact the heel of the hand on the centre-back of the ball", "lock the wrist — no snap"
- Blocking: "read the setter before you move", "hands over the net — press forward not up", "land balanced and immediately reset"

## Mixed ability groups

For mixed level sessions: use role differentiation and constraint modification within the same drill. Do not design separate tracks.
- Experienced players take decision-making roles: setter, attacker, blocker
- Beginners take high-repetition forgiving roles: passer, server
- Constraints: beginners serve underarm or from inside the service line; advanced serve full distance overarm
- Scoring: beginners may get a second-chance ball; advanced players do not

## Output

You always respond with valid JSON only. No markdown, no explanation, no preamble. No code fences.`

// ── Level guidance ────────────────────────────────────────────────────────────

function buildLevelGuidance(level: string): string {
  switch (level) {
    case 'beginner':
      return `Beginner: players have less than 1 year of experience. Prioritise basic contact quality — forearm pass, underarm or standing float serve, setting to a target. Use blocked practice predominantly. Drills must be forgiving — success should be achievable. No rotational systems or complex positioning. No assumed volleyball knowledge in instructions.`
    case 'intermediate':
      return `Intermediate: players understand the basics and are building consistency. Introduce serve-receive formations, approach footwork for attacking, and positional awareness. Mix blocked and variable practice. Include competition elements in drills.`
    case 'advanced':
      return `Advanced: players have solid fundamentals. Focus on system play, transition, tactical pressure, and game realism. Use random and game-like practice throughout. Drills must include competition, scoring, and consequence for errors. Expect players to self-organise between repetitions.`
    case 'mixed':
      return `Mixed: the group includes players with less than 1 year of experience alongside players with several years at local league level. Design drills using role differentiation and constraint modification within the same drill — do not create separate activity tracks. Put experienced players in decision-making roles (setter, attacker, blocker). Put beginners in high-repetition roles (passer, server). Modify constraints by ability: beginners serve underarm or from inside the service line; advanced players serve full distance overarm. Beginners may get a second-chance ball where appropriate.`
    default:
      return ''
  }
}

function buildLikedDrillsSection(likedDrills: LikedDrill[]): string {
  if (!likedDrills.length) return ''
  return `
This coach has previously rated the following drills positively. Where appropriate, incorporate similar patterns or structures into the new session:

${likedDrills.map(d => `- ${d.drill_name} (${d.drill_type})`).join('\n')}

Do not copy these drills verbatim — use them as inspiration for the coach's preferences.
`
}

export function buildGeneratePrompt(
  inputs: SessionFormInputs,
  likedDrills: LikedDrill[] = [],
): string {
  return `Generate a complete volleyball training session plan for the following coach request:

Coach's description: "${inputs.description}"

Session parameters:
- Players available: ${inputs.players}
- Session duration: ${inputs.duration} minutes
- Skill level: ${inputs.level}

---

## Player management

You have ${inputs.players} players. Design every drill as a flow drill where players rotate through defined roles. For each drill reason through: how many players are on court and in what roles, who is serving or feeding, who is queuing and for which role, what is the exact rotation trigger, and what is the full rotation path.

Make intelligent decisions about on-court count based on the drill's purpose. Skill drills should maximise individual touches through rotation. Tactical and game-based drills should use the number the scenario requires — a 6v6 scenario needs 12 on court simultaneously, with remaining players rotating in on a defined schedule.

---

## Session arc

Build the session in this order. All drill durations must sum to exactly ${inputs.duration} minutes.

- Warm-up: ~15% of total time
- Technical: ~30%
- Progressive: ~25%
- Game-based: ~25%
- Cool-down: ~5%

For sessions of 45 minutes or less: compress cool-down to 2–3 minutes and merge the technical and progressive phases.

---

## Level: ${inputs.level}

${buildLevelGuidance(inputs.level)}

---
${buildLikedDrillsSection(likedDrills)}
Respond with a single valid JSON object matching this exact schema:

{
  "title": "string",
  "overview": "string — 2–3 sentences on the session focus and approach",
  "total_duration": ${inputs.duration},
  "player_count": ${inputs.players},
  "level": "${inputs.level}",
  "focus": "string — concise label derived from the coach's description e.g. 'Serve receive under pressure'",
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
      "on_court_count": number,
      "rotation_pattern": "string — explicit rotation path e.g. 'Passer → setter position → server queue → passer queue', or 'Full 6v6 — substitution after each rally' for game scenarios",
      "diagram_type": "serve_receive | hitting_lines | pepper_pairs | wash_3v3 | defensive_positioning | transition_play | setting_patterns | blocking_footwork | free_ball_handling | game_scenario | none",
      "diagram_config": { "formation": "string", "notes": "string" },
      "setup": "string — spatial description of starting positions using court zones and role names",
      "instructions": ["string — one action per step, short imperative sentence"],
      "coaching_points": ["string — maximum 3, specific and technically correct, not generic"],
      "progression": "string — one concrete way to increase difficulty once players succeed",
      "equipment": ["string"]
    }
  ],
  "session_notes": "string"
}

Rules:
- 5–7 drills covering the full session arc
- First drill must be a volleyball-specific warm-up
- Last drill must be game-based or a cool-down reflection
- All drill durations must sum to exactly ${inputs.duration} minutes
- Every drill must account for all ${inputs.players} players through the flow/rotation system
- Maximum 3 coaching points per drill — specific not generic
- Colour mapping: Warm-up = amber, Technical = navy, Progressive = navy, Game-based = orange, Cool-down = teal`
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

Context: ${players} players, ${level} level, session focus: ${focus}, phase: ${phase}, duration: ${duration} minutes.

Apply the same flow drill principles: each alternative must specify on_court_count and rotation_pattern. Design for ${players} players with appropriate rotation.

Return a JSON array of exactly 3 drill objects matching the drill schema. JSON only, no markdown.`
}

// ── Single-drill functions ────────────────────────────────────────────────────

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
    const result = z.array(DrillSchema).safeParse(extractJson(response))
    if (!result.success) throw new Error('generation_failed')
    return result.data
  } catch {
    throw new Error('generation_failed')
  }
}

// ── JSON extraction helper ───────────────────────────────────────────────────

function extractJson(text: string): unknown {
  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in response')
  }
  return JSON.parse(text.slice(start, end + 1))
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
      model: 'claude-sonnet-4-6',
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

  let parsed: unknown

  try {
    parsed = extractJson(response)
  } catch {
    console.error('JSON extraction failed on first attempt, retrying...')
    try {
      const retryMessage = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: prompt },
          { role: 'assistant', content: response },
          { role: 'user', content: 'Your response was not valid JSON. Respond with only the raw JSON object — no markdown, no code fences, no explanation.' },
        ],
      })
      const retryContent = retryMessage.content[0]
      if (retryContent.type !== 'text') throw new Error('generation_failed')
      parsed = extractJson(retryContent.text)
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
