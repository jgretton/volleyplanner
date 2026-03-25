import type { DiagramType, DiagramConfig } from '@/types/plan'

// ─── Colour palette (hardcoded — SVGs may be exported outside CSS context) ──

const C = {
  server:   '#185FA5',
  passer:   '#D85A30',
  setter:   '#16A34A',
  attacker: '#7F77DD',
  defender: '#1D9E75',
  coach:    '#94A3B8',
  ball:     '#185FA5',
  movement: '#F5620F',
  pass:     '#D85A30',
}

// ─── Primitive helpers ───────────────────────────────────────────────────────

function baseCourt(): string {
  return `
    <rect x="20" y="20" width="360" height="440" rx="3" fill="#F0F4F8" stroke="#94A3B8" stroke-width="1"/>
    <line x1="20" y1="240" x2="380" y2="240" stroke="#0B1F3A" stroke-width="2.5"/>
    <line x1="20" y1="147" x2="380" y2="147" stroke="#B0BEC5" stroke-width="0.8" stroke-dasharray="5 4"/>
    <line x1="20" y1="333" x2="380" y2="333" stroke="#B0BEC5" stroke-width="0.8" stroke-dasharray="5 4"/>
    <text x="200" y="236" text-anchor="middle" fill="#64748B" font-size="9" font-family="Inter,sans-serif" font-weight="500">NET</text>
  `
}

function playerCircle(cx: number, cy: number, label: string, colour: string): string {
  return `
    <circle cx="${cx}" cy="${cy}" r="13" fill="${colour}"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" fill="white" font-size="10" font-weight="700" font-family="Inter,sans-serif">${label}</text>
  `
}

function arrow(
  x1: number, y1: number,
  x2: number, y2: number,
  colour: string,
  dashed = false,
): string {
  const id  = `arr-${colour.replace('#', '')}-${x1}-${y1}-${x2}-${y2}`
  const dash = dashed ? 'stroke-dasharray="6 4"' : ''
  return `
    <defs>
      <marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="${colour}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colour}" stroke-width="1.5" ${dash} marker-end="url(#${id})"/>
  `
}

// Semantic arrow wrappers
const ballLine  = (x1: number, y1: number, x2: number, y2: number) => arrow(x1, y1, x2, y2, C.ball,     true)
const moveLine  = (x1: number, y1: number, x2: number, y2: number) => arrow(x1, y1, x2, y2, C.movement, false)
const passLine  = (x1: number, y1: number, x2: number, y2: number) => arrow(x1, y1, x2, y2, C.pass,     false)

function targetZone(x: number, y: number, w: number, h: number): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${C.setter}" stroke-width="1" stroke-dasharray="4 3" opacity="0.7"/>`
}

function label(x: number, y: number, text: string): string {
  return `<text x="${x}" y="${y}" fill="#64748B" font-size="9" font-family="Inter,sans-serif">${text}</text>`
}

function wrapSvg(content: string): string {
  return `<svg viewBox="0 0 400 500" width="100%" xmlns="http://www.w3.org/2000/svg">${content}</svg>`
}

// ─── Diagram templates ───────────────────────────────────────────────────────

// SERVE RECEIVE
// Server far side. W-formation: 4 passers across back court.
// Setter runs to target at pos 2/3. Pass arrows from each passer to setter.
function serveReceive(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(200, 68, 'S', C.server)}
    ${ballLine(200, 81, 200, 228)}
    ${playerCircle(80, 395, 'P1', C.passer)}
    ${playerCircle(155, 415, 'P2', C.passer)}
    ${playerCircle(245, 415, 'P3', C.passer)}
    ${playerCircle(320, 395, 'P4', C.passer)}
    ${playerCircle(315, 272, 'Se', C.setter)}
    ${targetZone(295, 255, 38, 28)}
    ${passLine(80, 382, 300, 270)}
    ${passLine(155, 402, 302, 272)}
    ${passLine(245, 402, 306, 274)}
    ${passLine(320, 382, 320, 283)}
    ${playerCircle(100, 268, 'OH', C.attacker)}
    ${playerCircle(200, 262, 'MB', C.attacker)}
    ${label(30, 440, 'W-formation serve receive')}
  `)
}

// HITTING LINES
// Queue of attackers at pos 4 (left side). Setter at pos 2/3.
// Attacker runs approach, receives set, attacks across/line.
function hittingLines(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(90, 435, 'A3', C.attacker)}
    ${playerCircle(90, 408, 'A2', C.attacker)}
    ${playerCircle(90, 380, 'A1', C.attacker)}
    ${playerCircle(310, 278, 'Se', C.setter)}
    ${playerCircle(110, 268, 'Bl', C.defender)}
    ${moveLine(90, 367, 90, 292)}
    ${ballLine(296, 272, 125, 268)}
    ${ballLine(90, 255, 90, 60)}
    ${label(100, 460, 'Position 4 hitting lines')}
    ${label(185, 295, 'Set')}
  `)
}

// PEPPER PAIRS
// 3 pairs spread across court (both sides of net).
// Ball passes back and forth between partners.
function pepperPairs(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(110, 175, 'P1', C.passer)}
    ${playerCircle(110, 325, 'P2', C.passer)}
    ${ballLine(110, 188, 110, 312)}
    ${ballLine(110, 312, 110, 188)}
    ${playerCircle(200, 170, 'P3', C.passer)}
    ${playerCircle(200, 330, 'P4', C.passer)}
    ${ballLine(200, 183, 200, 317)}
    ${ballLine(200, 317, 200, 183)}
    ${playerCircle(290, 175, 'P5', C.passer)}
    ${playerCircle(290, 325, 'P6', C.passer)}
    ${ballLine(290, 188, 290, 312)}
    ${ballLine(290, 312, 290, 188)}
    ${label(100, 470, 'Pairs work: bump-set-spike or pass-set')}
  `)
}

// WASH / 3v3
// 3 attackers one side, 3 defenders other side.
// Ball goes over net — play it out.
function wash3v3(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(115, 148, 'A1', C.attacker)}
    ${playerCircle(200, 138, 'A2', C.attacker)}
    ${playerCircle(285, 148, 'A3', C.attacker)}
    ${playerCircle(115, 332, 'B1', C.passer)}
    ${playerCircle(200, 345, 'B2', C.passer)}
    ${playerCircle(285, 332, 'B3', C.passer)}
    ${ballLine(200, 226, 200, 254)}
    ${label(80, 470, '3v3 wash — winner stays, loser rotates')}
  `)
}

// DEFENSIVE POSITIONING (system defence)
// Attacker hitting from far side. Full 6-player defensive system near side.
// Perimeter defence: two blockers at net, four defenders in court.
function defensivePositioning(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(200, 115, 'At', C.attacker)}
    ${ballLine(200, 128, 200, 226)}
    ${playerCircle(150, 262, 'B1', C.defender)}
    ${playerCircle(250, 262, 'B2', C.defender)}
    ${playerCircle(95, 310, 'D1', C.defender)}
    ${playerCircle(305, 310, 'D2', C.defender)}
    ${playerCircle(155, 390, 'D3', C.defender)}
    ${playerCircle(245, 390, 'D4', C.defender)}
    <line x1="75" y1="290" x2="325" y2="290" stroke="${C.defender}" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.4"/>
    <line x1="75" y1="370" x2="325" y2="370" stroke="${C.defender}" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.4"/>
    ${label(50, 470, 'Perimeter D: blockers high, defenders wide')}
  `)
}

// TRANSITION PLAY
// Shows full sequence: attack → block/dig → set → counterattack.
// Numbered steps annotate the flow.
function transitionPlay(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(200, 115, 'At', C.attacker)}
    ${playerCircle(155, 262, 'B1', C.defender)}
    ${playerCircle(245, 262, 'B2', C.defender)}
    ${ballLine(200, 128, 175, 228)}
    ${playerCircle(130, 340, 'D1', C.defender)}
    ${playerCircle(200, 360, 'D2', C.defender)}
    ${playerCircle(305, 340, 'D3', C.defender)}
    ${playerCircle(315, 278, 'Se', C.setter)}
    ${passLine(200, 347, 308, 284)}
    ${ballLine(308, 265, 115, 262)}
    ${playerCircle(115, 262, 'OH', C.attacker)}
    ${label(28, 310, '1. Block')}
    ${label(28, 330, '2. Dig')}
    ${label(28, 350, '3. Set')}
    ${label(28, 370, '4. Attack')}
  `)
}

// SETTING PATTERNS
// Setter at pos 2. Three options: outside (pos 4), quick (pos 3), back (opposite).
// Labelled ball lines show each option.
function settingPatterns(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(310, 272, 'Se', C.setter)}
    ${playerCircle(95, 262, 'OH', C.attacker)}
    ${playerCircle(200, 256, 'MB', C.attacker)}
    ${playerCircle(315, 400, 'Op', C.attacker)}
    ${ballLine(295, 268, 210, 260)}
    ${ballLine(295, 265, 110, 260)}
    ${ballLine(312, 285, 315, 387)}
    ${label(50, 250, 'Outside')}
    ${label(185, 244, 'Quick')}
    ${label(322, 340, 'Back')}
    ${label(70, 470, 'Setter options: outside / quick / back set')}
  `)
}

// BLOCKING FOOTWORK
// Blocker starts at middle. Shows slide steps left and right to block positions.
// Arc paths illustrate the movement pattern.
function blockingFootwork(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(200, 115, 'At', C.attacker)}
    ${ballLine(200, 128, 200, 226)}
    ${playerCircle(200, 262, 'B', C.defender)}
    ${moveLine(213, 258, 280, 252)}
    ${moveLine(187, 258, 120, 252)}
    <path d="M 200 252 Q 240 238 280 252" fill="none" stroke="${C.movement}" stroke-width="1" stroke-dasharray="3 3"/>
    <path d="M 200 252 Q 160 238 120 252" fill="none" stroke="${C.movement}" stroke-width="1" stroke-dasharray="3 3"/>
    ${playerCircle(280, 252, 'B', C.defender)}
    ${playerCircle(120, 252, 'B', C.defender)}
    ${label(50, 470, 'Slide step laterally — stay square to attacker')}
  `)
}

// FREE BALL HANDLING
// Coach feeds from far side. Passers receive, setter sets, attacker hits.
function freeBallHandling(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(200, 68, 'C', C.coach)}
    ${ballLine(200, 81, 175, 226)}
    ${playerCircle(115, 345, 'P1', C.passer)}
    ${playerCircle(200, 365, 'P2', C.passer)}
    ${playerCircle(285, 345, 'P3', C.passer)}
    ${playerCircle(315, 278, 'Se', C.setter)}
    ${targetZone(295, 260, 38, 28)}
    ${passLine(200, 352, 308, 282)}
    ${ballLine(308, 265, 130, 262)}
    ${playerCircle(130, 262, 'OH', C.attacker)}
    ${label(55, 470, 'Free ball: receive → set → attack')}
  `)
}

// GAME SCENARIO (6v6)
// Full teams both sides. Realistic rotational positions with positions named.
// Ball in play from back row.
function gameScenario(_config: DiagramConfig): string {
  return wrapSvg(`
    ${baseCourt()}
    ${playerCircle(95, 152, 'OH', C.attacker)}
    ${playerCircle(200, 143, 'MB', C.attacker)}
    ${playerCircle(305, 152, 'Op', C.attacker)}
    ${playerCircle(95, 85, 'OH', C.passer)}
    ${playerCircle(200, 72, 'Se', C.setter)}
    ${playerCircle(305, 85, 'MB', C.passer)}
    ${playerCircle(95, 328, 'OH', C.passer)}
    ${playerCircle(200, 338, 'Lb', C.defender)}
    ${playerCircle(305, 328, 'Op', C.passer)}
    ${playerCircle(95, 410, 'MB', C.passer)}
    ${playerCircle(200, 425, 'Se', C.setter)}
    ${playerCircle(305, 410, 'OH', C.passer)}
    ${ballLine(95, 397, 95, 254)}
  `)
}

// ─── Public API ──────────────────────────────────────────────────────────────

const diagrams: Record<DiagramType, (config: DiagramConfig) => string> = {
  serve_receive:         serveReceive,
  hitting_lines:         hittingLines,
  pepper_pairs:          pepperPairs,
  wash_3v3:              wash3v3,
  defensive_positioning: defensivePositioning,
  transition_play:       transitionPlay,
  setting_patterns:      settingPatterns,
  blocking_footwork:     blockingFootwork,
  free_ball_handling:    freeBallHandling,
  game_scenario:         gameScenario,
  none:                  () => '',
}

export function getDiagramSvg(type: DiagramType, config: DiagramConfig): string {
  return diagrams[type]?.(config) ?? ''
}
