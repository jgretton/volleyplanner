# VolleyPlanner — Test Prompt

Use this file to test the Claude prompt without burning API credits.

**How to use:**
1. Go to claude.ai and create a new Project
2. Open Project Settings → paste the **System Prompt** section into the Instructions field
3. Start a new conversation in the project
4. Paste one of the **User Prompts** below into the chat
5. Evaluate the JSON output against the criteria at the bottom of this file

---

## SYSTEM PROMPT

```
You are an expert volleyball coaching assistant helping coaches plan effective training sessions. You serve coaches at all levels — from first-time recreational volunteers to experienced club coaches. You use internationally recognised volleyball terminology (FIVB standard): libero, setter, outside hitter, opposite, middle blocker, serve receive, rally point scoring.

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

You always respond with valid JSON only. No markdown, no explanation, no preamble. No code fences.
```

---

## TEST CASE 1 — Mixed level, 14 players, 75 min, serve receive focus

```
Generate a complete volleyball training session plan for the following coach request:

Coach's description: "Focus on serve receive and getting the ball to the setter cleanly. We have a mix of newer and experienced players and we struggle to run any kind of system."

Session parameters:
- Players available: 14
- Session duration: 75 minutes
- Skill level: mixed

---

## Player management

You have 14 players. Design every drill as a flow drill where players rotate through defined roles. For each drill reason through: how many players are on court and in what roles, who is serving or feeding, who is queuing and for which role, what is the exact rotation trigger, and what is the full rotation path.

Make intelligent decisions about on-court count based on the drill's purpose. Skill drills should maximise individual touches through rotation. Tactical and game-based drills should use the number the scenario requires — a 6v6 scenario needs 12 on court simultaneously, with remaining players rotating in on a defined schedule.

---

## Session arc

Build the session in this order. All drill durations must sum to exactly 75 minutes.

- Warm-up: ~15% of total time (~11 min)
- Technical: ~30% (~23 min)
- Progressive: ~25% (~19 min)
- Game-based: ~25% (~19 min)
- Cool-down: ~5% (~4 min)

---

## Level: mixed

Mixed: the group includes players with less than 1 year of experience alongside players with several years at local league level. Design drills using role differentiation and constraint modification within the same drill — do not create separate activity tracks. Put experienced players in decision-making roles (setter, attacker, blocker). Put beginners in high-repetition roles (passer, server). Modify constraints by ability: beginners serve underarm or from inside the service line; advanced players serve full distance overarm. Beginners may get a second-chance ball where appropriate.

---

Respond with a single valid JSON object matching this exact schema:

{
  "title": "string",
  "overview": "string — 2–3 sentences on the session focus and approach",
  "total_duration": 75,
  "player_count": 14,
  "level": "mixed",
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
- All drill durations must sum to exactly 75 minutes
- Every drill must account for all 14 players through the flow/rotation system
- Maximum 3 coaching points per drill — specific not generic
- Colour mapping: Warm-up = amber, Technical = navy, Progressive = navy, Game-based = orange, Cool-down = teal
```

---

## TEST CASE 2 — Beginner, 8 players, 60 min, basic skills

```
Generate a complete volleyball training session plan for the following coach request:

Coach's description: "First few sessions with a brand new group. Most have never played before. Want to introduce passing and get them comfortable with the ball."

Session parameters:
- Players available: 8
- Session duration: 60 minutes
- Skill level: beginner

---

## Player management

You have 8 players. Design every drill as a flow drill where players rotate through defined roles. For each drill reason through: how many players are on court and in what roles, who is serving or feeding, who is queuing and for which role, what is the exact rotation trigger, and what is the full rotation path.

Make intelligent decisions about on-court count based on the drill's purpose. Skill drills should maximise individual touches through rotation. Tactical and game-based drills should use the number the scenario requires — a 6v6 scenario needs 12 on court simultaneously, with remaining players rotating in on a defined schedule.

---

## Session arc

Build the session in this order. All drill durations must sum to exactly 60 minutes.

- Warm-up: ~15% of total time (~9 min)
- Technical: ~30% (~18 min)
- Progressive: ~25% (~15 min)
- Game-based: ~25% (~15 min)
- Cool-down: ~5% (~3 min)

---

## Level: beginner

Beginner: players have less than 1 year of experience. Prioritise basic contact quality — forearm pass, underarm or standing float serve, setting to a target. Use blocked practice predominantly. Drills must be forgiving — success should be achievable. No rotational systems or complex positioning. No assumed volleyball knowledge in instructions.

---

Respond with a single valid JSON object matching this exact schema:

{
  "title": "string",
  "overview": "string — 2–3 sentences on the session focus and approach",
  "total_duration": 60,
  "player_count": 8,
  "level": "beginner",
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
- All drill durations must sum to exactly 60 minutes
- Every drill must account for all 8 players through the flow/rotation system
- Maximum 3 coaching points per drill — specific not generic
- Colour mapping: Warm-up = amber, Technical = navy, Progressive = navy, Game-based = orange, Cool-down = teal
```

---

## TEST CASE 3 — Intermediate, 20 players, 90 min, attacking focus

```
Generate a complete volleyball training session plan for the following coach request:

Coach's description: "Working on attacking from position 4. Players know the basics but approach footwork is inconsistent and they're not timing the set well. Big squad tonight."

Session parameters:
- Players available: 20
- Session duration: 90 minutes
- Skill level: intermediate

---

## Player management

You have 20 players. Design every drill as a flow drill where players rotate through defined roles. For each drill reason through: how many players are on court and in what roles, who is serving or feeding, who is queuing and for which role, what is the exact rotation trigger, and what is the full rotation path.

Make intelligent decisions about on-court count based on the drill's purpose. Skill drills should maximise individual touches through rotation. Tactical and game-based drills should use the number the scenario requires — a 6v6 scenario needs 12 on court simultaneously, with remaining players rotating in on a defined schedule.

---

## Session arc

Build the session in this order. All drill durations must sum to exactly 90 minutes.

- Warm-up: ~15% of total time (~14 min)
- Technical: ~30% (~27 min)
- Progressive: ~25% (~23 min)
- Game-based: ~25% (~23 min)
- Cool-down: ~5% (~5 min)

---

## Level: intermediate

Intermediate: players understand the basics and are building consistency. Introduce serve-receive formations, approach footwork for attacking, and positional awareness. Mix blocked and variable practice. Include competition elements in drills.

---

Respond with a single valid JSON object matching this exact schema:

{
  "title": "string",
  "overview": "string — 2–3 sentences on the session focus and approach",
  "total_duration": 90,
  "player_count": 20,
  "level": "intermediate",
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
- All drill durations must sum to exactly 90 minutes
- Every drill must account for all 20 players through the flow/rotation system
- Maximum 3 coaching points per drill — specific not generic
- Colour mapping: Warm-up = amber, Technical = navy, Progressive = navy, Game-based = orange, Cool-down = teal
```

---

## What to evaluate in the output

For each test, check:

**Rotation logic**
- Does `rotation_pattern` describe a real, followable path?
- Does `on_court_count` make sense for the drill type?
- Could you actually run this with that many people?

**Instructions**
- Are they short and spatial — could you read this on your phone on court?
- Is it clear where everyone starts?
- Is the rotation trigger explicit?

**Coaching points**
- Are there 3 or fewer per drill?
- Are they specific (not "communicate!" or "stay low!")?
- Are they technically correct for volleyball?

**Session arc**
- Do the phases flow logically warm-up → technical → progressive → game-based?
- Do durations add up to the total?
- Does the warm-up actually relate to the session focus?

**Mixed level (Test Case 1)**
- Are beginners and experienced players in the same drills?
- Are roles differentiated by ability?
- Is there constraint modification (serve distance, second-chance ball)?
