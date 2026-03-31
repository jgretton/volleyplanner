"use client";

import { CompactView } from "@/components/plan/CompactView";
import { PlanView } from "@/components/plan/PlanView";
import { SwapModal } from "@/components/plan/SwapModal";
import { ViewToggle } from "@/components/plan/ViewToggle";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import type { Drill, SessionPlan } from "@/types/plan";
import { Printer } from "lucide-react";
import { useCallback, useState } from "react";

const MOCK_PLAN: SessionPlan = {
	title: "Clean platform, find the setter",
	overview:
		"A 75-minute mixed-ability session focused on serve receive and delivering the ball cleanly to the setter. The session uses role differentiation so experienced players occupy setter and attacker roles while beginners build passing volume through high-repetition flow drills. Constraint modifications — underarm serving and reduced serving distance for newer players — keep the drill pressure appropriate across the group throughout.",
	total_duration: 75,
	player_count: 14,
	level: "mixed",
	focus: "Serve receive and setter delivery",
	timeline: [
		{
			phase: "Warm-up",
			label: "Pass and move activation",
			duration: 11,
			colour: "amber",
		},
		{
			phase: "Technical",
			label: "Platform mechanics — blocked passing",
			duration: 12,
			colour: "navy",
		},
		{
			phase: "Technical",
			label: "Target passing to setter zone",
			duration: 11,
			colour: "navy",
		},
		{
			phase: "Progressive",
			label: "Serve receive triangle",
			duration: 10,
			colour: "navy",
		},
		{
			phase: "Progressive",
			label: "System building — pass-set-catch",
			duration: 9,
			colour: "navy",
		},
		{
			phase: "Game-based",
			label: "Wash drill — earn the point",
			duration: 18,
			colour: "orange",
		},
		{
			phase: "Cool-down",
			label: "Reflection and cool-down",
			duration: 4,
			colour: "teal",
		},
	],
	drills: [
		{
			name: "Pass and move activation",
			phase: "Warm-up",
			duration: 11,
			players_needed: 14,
			on_court_count: 14,
			rotation_pattern:
				"7 pairs spread across both halves of court. Partners pass continuously. On coach's whistle, one partner steps left one position and finds a new partner. Continuous — no queue.",
			diagram_type: "pepper_pairs",
			diagram_config: {
				formation: "7 pairs distributed across full court",
				notes:
					"Partners face each other 4–5m apart. Lateral shuffle on whistle to new partner.",
			},
			setup:
				"Split all 14 players into 7 pairs. Spread pairs across the full court — both halves. Partners stand 4–5 metres apart facing each other, one ball per pair.",
			instructions: [
				"Player A tosses the ball underarm to player B — medium height, straight at the body.",
				"Player B passes back using a forearm platform, aiming to return it to player A's hands.",
				"Both players shuffle their feet to stay facing each other between contacts.",
				"On the coach's whistle, the player without the ball steps one position to the left and joins a new partner.",
				"Continue for 4 minutes at a steady rhythm, then increase toss distance to 5–6 metres for the final 4 minutes.",
				"Final 3 minutes: player A tosses slightly off-centre — left or right — so player B must move feet before passing.",
			],
			coaching_points: [
				"Feet to the ball first — move before you reach. The platform follows the feet.",
				"Contact between the wrist and elbow, not on the hands. Arms stay straight and still through contact.",
				"Both feet stay on the ground at contact — no jumping into the pass.",
			],
			progression:
				"Player A calls 'left' or 'right' just before tossing, forcing player B to move laterally before passing.",
			equipment: ["7 volleyballs"],
		},
		{
			name: "Platform mechanics — blocked passing",
			phase: "Technical",
			duration: 12,
			players_needed: 14,
			on_court_count: 6,
			rotation_pattern:
				"3 feeders stand at the net in zones 2, 3, and 4. 3 passers stand at positions 1, 6, and 5 (back row). Remaining 8 players split into two queues behind positions 1 and 5. Feeder tosses to passer. Passer passes to zone 3 target cone/setter spot. Rotation trigger: after each pass, passer joins the back of the opposite queue (position 1 passer joins position 5 queue and vice versa). Queue front steps on court. Feeders rotate out every 3 minutes — feeder joins the passer queue, passer from zone 6 becomes feeder at zone 3, zone 2 and 4 feeders stay for 3 minutes each.",
			diagram_type: "serve_receive",
			diagram_config: {
				formation:
					"3 passers in back row positions 1, 5, 6. 3 feeders at net zones 2, 3, 4. 2 queues behind positions 1 and 5.",
				notes:
					"All passes aimed at zone 3 setter target. Feeders deliver controlled down-balls.",
			},
			setup:
				"Place a cone or marker at zone 3 as the setter target. Three feeders stand on the attack line side of the net in zones 2, 3, and 4, each with a ball. Three passers stand in back-row positions 1, 6, and 5. Eight remaining players split into two equal queues behind positions 1 and 5 outside the court.",
			instructions: [
				"Feeder at zone 3 initiates — tosses or rolls a down-ball to position 6 passer.",
				"Feeder at zone 2 tosses simultaneously to position 1 passer.",
				"Feeder at zone 4 tosses simultaneously to position 5 passer.",
				"Each passer passes the ball, aiming to land it on or near the zone 3 cone.",
				"After passing, the position 1 passer exits and joins the queue behind position 5. The position 5 passer exits and joins the queue behind position 1. Position 6 passer stays for one additional rep then joins either queue.",
				"Next players in queue step onto court immediately.",
				"Feeders collect balls and reset — target is one ball in the air per feeder every 20–25 seconds.",
			],
			coaching_points: [
				"Platform angled toward the zone 3 target at 45 degrees — point the platform, not the body.",
				"Beat the ball — arrive at the passing spot before the ball does, then be still.",
				"Short, early steps are better than one big lunge. Get the feet set before the arms form the platform.",
			],
			progression:
				"Feeders begin serving underarm from the service line instead of tossing — passers now read a travelling ball rather than a toss.",
			equipment: ["6–8 volleyballs", "1 cone for zone 3 target"],
		},
		{
			name: "Target passing to setter zone",
			phase: "Technical",
			duration: 11,
			players_needed: 14,
			on_court_count: 8,
			rotation_pattern:
				"One designated setter (experienced player) stands in zone 3. Three passers in back row (positions 1, 5, 6). One server on the service line (beginners serve underarm from 5m; experienced serve overarm from full distance). Four remaining players split between a server queue and a passer queue at the side of the court. Rotation trigger: after each completed pass-to-setter sequence — server becomes back-row passer at position 1, position 1 passer shifts to position 6, position 6 to position 5, position 5 exits and joins the server queue. Setter rotates out every 4 minutes — setter joins server queue, most experienced available player from queue takes setter role.",
			diagram_type: "serve_receive",
			diagram_config: {
				formation:
					"Setter zone 3, passers positions 1/5/6, server at service line, queues at sideline",
				notes:
					"Beginners serve from inside service line underarm. Experienced serve full distance overarm.",
			},
			setup:
				"Experienced player stands as setter in zone 3. Three passers occupy back-row positions 1, 6, and 5. One server stands at the service line. Remaining 6 players form a server queue (3 players) and a passer queue (3 players) at the side of the court. Beginners are placed in the serving and passing queues first.",
			instructions: [
				"Server serves to the back row — beginners serve underarm from 5 metres inside the service line, experienced players serve overarm from full distance.",
				"The three back-row passers communicate — the player whose zone the ball enters calls 'mine' and passes.",
				"Passer aims the ball to zone 3. Setter catches or sets the ball depending on ability of the group.",
				"If the pass is poor, the setter catches and holds the ball up — coach gives one coaching cue before play resets.",
				"Rotation trigger: once the setter catches or sets, the server becomes the new position 1 passer, position 1 shifts to 6, position 6 shifts to 5, position 5 exits to server queue.",
				"Setter stays in role for 4 minutes then rotates out — experienced player from queue takes over.",
			],
			coaching_points: [
				"Passers call the ball early and loudly — communication is a skill, train it like a technical skill.",
				"Setter: show the window — hands shaped above the forehead before the ball arrives, not after.",
				"Passer: read the server's toss before the ball crosses the net — early reading gives more time to move.",
			],
			progression:
				"Setter now sets rather than catches — outside hitter (experienced player) stands in zone 4 as a target for the set. Passer-setter-hitter sequence runs as a three-touch unit.",
			equipment: ["6–8 volleyballs"],
		},
		{
			name: "Serve receive triangle",
			phase: "Progressive",
			duration: 10,
			players_needed: 14,
			on_court_count: 6,
			rotation_pattern:
				"Two groups of 7 run simultaneously on opposite halves of the court. Within each group: 1 setter (zone 3), 2 passers (positions 1 and 5), 1 server (service line opposite), 3 players in a combined server-passer queue at the side. Rotation trigger: after the setter catches or sets the ball — server becomes a back-row passer (position 1 or 5, wherever the gap is), the passer who did not contact the ball exits to the queue, queue front becomes the new server. Setter stays for 5 minutes, then rotates.",
			diagram_type: "serve_receive",
			diagram_config: {
				formation:
					"Two half-court groups running simultaneously. Each: setter zone 3, two passers, server, queue.",
				notes:
					"Beginners serve underarm or from inside the line. One ball per group in play at a time.",
			},
			setup:
				"Divide the 14 players into two groups of 7. Each group operates on one half of the court. Within each group assign one experienced player as setter at zone 3, two passers at positions 1 and 5, one server at the service line. Three players queue at the sideline. Beginners go in passing and serving roles.",
			instructions: [
				"Server serves — beginners underarm from inside the line, experienced overarm full distance.",
				"Two passers cover the back row together. They must communicate vocally before contacting the ball.",
				"Passer delivers to the setter in zone 3.",
				"Setter sets or catches — if setting, deliver to zone 4 where an attacker can shadow the approach (no full attack yet, just an approach and reach).",
				"Rotation trigger: after the ball is dead — server steps on as new passer, passer who passed exits to queue, queue front steps up as server.",
				"Coach circulates between the two groups every 2 minutes.",
			],
			coaching_points: [
				"Two passers must split the court clearly — agree zones before the serve, not after.",
				"Feet to the ball first — the passer who calls 'mine' commits fully. No half-measures.",
				"Setter: soft to fast — absorb the ball with the fingers then extend legs and arms to the target together.",
			],
			progression:
				"Server calls out a zone — 'left' or 'right' — before serving, so passers must adjust their positioning before the ball is hit.",
			equipment: ["7 volleyballs (one per group plus spares)"],
		},
		{
			name: "Pass-set-catch — system building",
			phase: "Progressive",
			duration: 9,
			players_needed: 14,
			on_court_count: 9,
			rotation_pattern:
				"Full back row of 3 passers (positions 1, 6, 5). One setter at zone 3. Two target hitters at zones 2 and 4 (experienced players — they catch, not attack). Three servers on the service line. Five remaining players in a server queue at the back. Rotation trigger: after setter delivers to zone 2 or 4 and the hitter catches — server becomes passer at position 1, position 1 shifts to 6, position 6 shifts to 5, position 5 exits to server queue. Setter stays fixed. Zone 2 and 4 targets stay fixed for this drill.",
			diagram_type: "setting_patterns",
			diagram_config: {
				formation:
					"Full back row 3 passers, setter zone 3, targets zones 2 and 4, 3 servers at service line",
				notes:
					"Setter must choose zone 2 or zone 4 target based on pass quality. High pass = zone 4. Tight pass = zone 2.",
			},
			setup:
				"Full back row in positions 1, 6, and 5. Experienced setter at zone 3. Experienced players stand as targets (catchers) at zones 2 and 4 — they do not attack, they catch and return the ball. Three servers stand at the service line. Five players queue behind the service line.",
			instructions: [
				"Server serves into the back row — beginners underarm from inside the line.",
				"Back row communicates and passes to zone 3.",
				"Setter receives and sets to either zone 2 or zone 4 — the setter chooses based on where the pass came from.",
				"Target catcher holds the ball up to confirm the set reached them, then rolls it to the server queue.",
				"Coach calls 'good system' when all three touches were clean — passers and setter acknowledge the sequence out loud.",
				"Rotation trigger: after ball is caught — server becomes position 1 passer, rest of back row shuffles, position 5 exits to server queue.",
				"Run for 9 minutes. Rotate setter at the 5-minute mark.",
			],
			coaching_points: [
				"Setter: read the pass trajectory before it arrives — a tight, high pass to zone 3 means time to set anywhere. A wide or low pass means go early to zone 2.",
				"Back row: talk before the serve crosses the net, not as it lands. 'Yours left', 'mine right' — specific not generic.",
				"The system only works when every touch is intentional — passer aims at zone 3, not just 'up'.",
			],
			progression:
				"Targets at zones 2 and 4 now perform a full attacking approach and swing — setter must judge the set height and location to match the hitter's timing.",
			equipment: ["8–10 volleyballs"],
		},
		{
			name: "Wash drill — earn the point",
			phase: "Game-based",
			duration: 18,
			players_needed: 14,
			on_court_count: 12,
			rotation_pattern:
				"Two teams of 6 on court — full 6v6. Two players off court act as next-in substitutes, one per team, waiting at the end line. Substitution rule: after every 3 rallies (one wash cycle), the two off-court players rotate in. Each team's off-court player swaps with the player currently in position 1 (server/right back). Off-court players rotate in on a clockwise cycle. Beginners start in back-row passing positions; experienced players start at setter, outside hitter, and opposite.",
			diagram_type: "game_scenario",
			diagram_config: {
				formation:
					"6v6 full court. 1 sub per team waiting at end line. Beginners in back row, experienced in front row and setter.",
				notes:
					"Wash scoring: team must win two consecutive rallies to score a point. One wash cycle = serve rally + free ball rally.",
			},
			setup:
				"Two teams of 6 on full court — assign positions so experienced players are setter, outside hitter (zone 4), and opposite (zone 2). Beginners occupy positions 1, 5, and 6. Two remaining players (one per team) wait at their team's end line. Coach or a spare player acts as a neutral free-ball feeder standing off court at mid-court.",
			instructions: [
				"Rally 1: team A serves to team B. Normal rally play. Winning team scores one wash token (use a cone or marker).",
				"Rally 2 (free ball): coach feeds a free ball over the net to the team that won rally 1. If they win this rally too, they score a POINT. If they lose, no point is awarded — wash is reset.",
				"If team B wins rally 1, coach feeds the free ball to team B for rally 2.",
				"Target: first team to 5 points wins the game. Teams play best of 3 games.",
				"Beginners on the serving team serve underarm or from inside the service line — no penalty, this is their constraint.",
				"After every 3 rallies, pause — substitute players rotate in from the end line, swapping with position 1.",
				"Coach names one focus after each point: 'Did the ball reach the setter clean? Yes or no.'",
			],
			coaching_points: [
				"Serve receive: the passer's job ends when the ball lands in zone 3 — focus entirely on platform angle and foot position, not on watching where it goes.",
				"Setter: call for the ball as soon as the pass leaves the passer's platform — early communication helps the front row time their approach.",
				"Free ball rally is a system test — treat it like a gift: pass, set, attack. No excuses on a free ball.",
			],
			progression:
				"Remove the free ball — both rallies are live serve scenarios. Team must win two live serve rallies consecutively to score a point.",
			equipment: [
				"3–4 volleyballs",
				"2–4 cones for wash tokens or score markers",
			],
		},
		{
			name: "Cool-down and session reflection",
			phase: "Cool-down",
			duration: 4,
			players_needed: 14,
			on_court_count: 14,
			rotation_pattern:
				"No rotation. All players together in a loose circle at mid-court.",
			diagram_type: "none",
			diagram_config: {
				formation: "Circle at mid-court",
				notes:
					"Light dynamic movement followed by guided reflection questions.",
			},
			setup:
				"All 14 players form a circle at the centre of the court. No balls in hand.",
			instructions: [
				"Players walk slowly in a circle for 60 seconds — forward, then reverse.",
				"Arm circles, gentle shoulder rolls, wrist shakes — 60 seconds.",
				"Coach asks: 'What was the one thing that made a good pass today?' — take 3–4 answers.",
				"Coach asks: 'When did we actually run a system — serve, pass, set — in sequence?' — take 2–3 answers.",
				"Coach closes: name one specific thing the team will practise again next session.",
			],
			coaching_points: [
				"Reinforce the platform cue players used best today — name it specifically so it sticks.",
				"Acknowledge any moment a beginner executed a clean pass to the setter — individual progress matters in a mixed group.",
				"Frame the next session's goal so players leave with a forward focus, not just a review.",
			],
			progression: "N/A — cool-down is fixed.",
			equipment: [],
		},
	],
	session_notes:
		"Across all drills, enforce the mixed-ability constraints consistently: beginners serve underarm or from inside the service line throughout — do not let this slip in the game-based drill under competitive pressure. Experienced players should be in setter, attacker, and target roles in every drill except the warm-up. If the group struggles with the pass-set-catch drill, strip the attacker targets out and return to the setter catching the ball until the passing is reliable enough to set from. The wash drill is deliberately simple in structure — the coaching conversation during play is where the session focus is reinforced, so move around the court and name specific passes and sets rather than giving general encouragement.",
};

export default function TestPlanPage() {
	const [view, setView] = useState<"full" | "session">(() => {
		if (typeof window === "undefined") return "full";
		return window.innerWidth < 768 ? "session" : "full";
	});
	const [plan, setPlan] = useState<SessionPlan>(MOCK_PLAN);
	const [swapIndex, setSwapIndex] = useState<number | null>(null);
	const [swapOptions, setSwapOptions] = useState<Drill[] | null>(null);
	const [swapLoading, setSwapLoading] = useState(false);
	const [swapError, setSwapError] = useState<string | null>(null);

	const handleSwapOpen = useCallback(
		async (index: number) => {
			setSwapIndex(index);
			setSwapOptions(null);
			setSwapError(null);
			setSwapLoading(true);
			try {
				const res = await fetch("/api/drill/swap", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ drill_index: index, plan }),
				});
				const json = await res.json();
				if (!res.ok) {
					setSwapError(
						json.error ?? "Couldn't fetch alternatives. Please try again.",
					);
					return;
				}
				setSwapOptions(json.data);
			} catch {
				setSwapError("Something went wrong. Please try again.");
			} finally {
				setSwapLoading(false);
			}
		},
		[plan],
	);

	const handleSwapSelect = useCallback(
		(drill: Drill) => {
			if (swapIndex === null) return;
			setPlan((prev) => {
				const drills = [...prev.drills];
				drills[swapIndex] = drill;
				return { ...prev, drills };
			});
			setSwapIndex(null);
			setSwapOptions(null);
		},
		[swapIndex],
	);

	const handleSwapClose = useCallback(() => {
		setSwapIndex(null);
		setSwapOptions(null);
		setSwapError(null);
	}, []);

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Dev banner */}
			<div className="bg-orange/10 border border-orange/20 rounded-xl px-5 py-3 mb-8 flex items-center justify-between gap-3">
				<p className="text-sm text-orange font-medium">
					Test plan — mock data, Pro features enabled
				</p>
				<a
					href="/"
					className="text-xs text-orange/70 hover:text-orange transition-colors"
				>
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

			{view === "full" ? (
				<PlanView plan={plan} isPro={true} onSwap={handleSwapOpen} />
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

			<ScrollToTop />
		</div>
	);
}
