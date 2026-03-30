import { SessionForm } from "@/components/plan/SessionForm";
import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { BentoGrid } from "./_components/BentoGrid";
import { PhoneMockup } from "./_components/PhoneMockup";
import { PlanShowcase } from "./_components/PlanShowcase";
import { Testimonials } from "./_components/Testimonials";

export const metadata: Metadata = {
	title: "VolleyPlanner — AI Volleyball Session Planner",
	description:
		"Plan your next volleyball training session in under a minute. Describe your squad, your focus, and how long you have — VolleyPlanner generates a complete session plan with court diagrams, drills, and timings.",
	alternates: {
		canonical: "https://volleyplanner.co.uk",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebApplication",
			"@id": "https://volleyplanner.co.uk/#app",
			name: "VolleyPlanner",
			url: "https://volleyplanner.co.uk",
			description:
				"AI-powered volleyball session planner for coaches. Generates complete session plans with court diagrams, drill instructions, and timings.",
			applicationCategory: "SportsApplication",
			operatingSystem: "Web",
			offers: [
				{
					"@type": "Offer",
					name: "Free",
					price: "0",
					priceCurrency: "GBP",
					description: "3 session plans per month",
				},
				{
					"@type": "Offer",
					name: "Pro",
					price: "6",
					priceCurrency: "GBP",
					description:
						"Unlimited session plans, saved history, regenerate drills, PDF export",
					billingIncrement: "P1M",
				},
			],
			featureList: [
				"AI-generated volleyball session plans",
				"Court diagrams for every drill",
				"Volleyball-specific terminology",
				"Mobile-optimised session view",
				"Print-ready layout",
				"Regenerate individual drills",
			],
			audience: {
				"@type": "Audience",
				audienceType: "Volleyball coaches",
			},
		},
		{
			"@type": "Organization",
			"@id": "https://volleyplanner.co.uk/#org",
			name: "VolleyPlanner",
			url: "https://volleyplanner.co.uk",
		},
		{
			"@type": "WebSite",
			"@id": "https://volleyplanner.co.uk/#website",
			url: "https://volleyplanner.co.uk",
			name: "VolleyPlanner",
			publisher: { "@id": "https://volleyplanner.co.uk/#org" },
			potentialAction: {
				"@type": "SearchAction",
				target: "https://volleyplanner.co.uk/?description={search_term_string}",
				"query-input": "required name=search_term_string",
			},
		},
		{
			"@type": "FAQPage",
			"@id": "https://volleyplanner.co.uk/#faq",
			mainEntity: [
				{
					"@type": "Question",
					name: "Do I need an account to use VolleyPlanner?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "You need a free account to generate plans. Sign-up takes seconds and uses a magic link - no password needed. Free accounts get 3 plans per month.",
					},
				},
				{
					"@type": "Question",
					name: "How long does it take to generate a session plan?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Most plans are ready in under a minute. The AI generates a complete structured session with 6-8 drills, court diagrams, coaching points, and timings.",
					},
				},
				{
					"@type": "Question",
					name: "Can I use it on my phone during training?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes - VolleyPlanner has a dedicated session view built for mobile. Tap any drill to see full instructions and the court diagram. It works once loaded, so no signal is needed in the sports hall.",
					},
				},
				{
					"@type": "Question",
					name: "Is VolleyPlanner suitable for beginners and youth teams?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes. When you describe your session, include the skill level of your players. The AI adapts the drills, language, and progressions to suit beginners, intermediates, or more advanced squads.",
					},
				},
				{
					"@type": "Question",
					name: "Can I regenerate or change individual drills?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Pro users can regenerate any drill with one click or choose from 3 alternatives. Free users can regenerate the whole plan if they have plans remaining that month.",
					},
				},
				{
					"@type": "Question",
					name: "What does VolleyPlanner Pro include?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Pro (£6/month) includes unlimited plans, saved plan history, regenerate or swap individual drills, coach notes per drill, PDF export, and the ability to share a plan via link.",
					},
				},
			],
		},
	],
};

function CourtLines() {
	return (
		<svg
			className="absolute inset-0 w-full h-full pointer-events-none select-none"
			viewBox="0 0 1400 600"
			fill="none"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		>
			<rect
				x="200"
				y="80"
				width="1000"
				height="440"
				stroke="white"
				strokeWidth="1"
				opacity="0.06"
			/>
			<line
				x1="700"
				y1="80"
				x2="700"
				y2="520"
				stroke="white"
				strokeWidth="1.5"
				opacity="0.08"
			/>
			<line
				x1="478"
				y1="80"
				x2="478"
				y2="520"
				stroke="white"
				strokeWidth="0.75"
				strokeDasharray="8 5"
				opacity="0.05"
			/>
			<line
				x1="922"
				y1="80"
				x2="922"
				y2="520"
				stroke="white"
				strokeWidth="0.75"
				strokeDasharray="8 5"
				opacity="0.05"
			/>
		</svg>
	);
}

export default function HomePage() {
	return (
		<div className="bg-vp-bg">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* ── Hero ─────────────────────────────────────────────────────────── */}
			<section
				id="plan-form"
				className="relative overflow-hidden border-b border-vp-border"
			>
				<CourtLines />

				<div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-48">
					{/* Headline — centred */}
					<div className="text-center mb-20 animate-fade-up">
						<p className="text-xs font-medium uppercase tracking-widest text-orange mb-8">
							AI Volleyball Session Planner
						</p>
						<h1 className="font-display font-bold uppercase leading-[0.92] tracking-tight text-vp-text mb-10">
							<span className="block text-[clamp(1rem,11vw,6rem)]">
								Your next session.
							</span>
							<span className="block text-[clamp(1rem,11vw,6rem)] text-orange">
								Ready.
							</span>
						</h1>
						<p className="text-vp-muted text-base leading-relaxed max-w-2xl mx-auto">
							Describe what you want to work on, how many players you&apos;ve
							got, and how long you&apos;ve got. VolleyPlanner puts together a
							full session plan with drills, diagrams, coaching points, and
							timings in under a minute.
						</p>
					</div>

					{/* Form */}
					<div className="animate-fade-up-1">
						<SessionForm />
					</div>

					{/* Trust marks */}
					<div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 animate-fade-up-2">
						{[
							"Free to start, no card required",
							"Built by a volleyball coach",
							"Mobile-ready for courtside use",
						].map((item) => (
							<span
								key={item}
								className="flex items-center gap-1.5 text-xs text-vp-muted/50"
							>
								<Check size={11} className="text-orange/60 shrink-0" />
								{item}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* ── Problem ──────────────────────────────────────────────────────── */}
			<section className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
						<div>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
								Sound
								<br />
								familiar?
							</h2>
						</div>

						<div className="space-y-8">
							{[
								"It's 10pm the night before training and you're still writing your session plan.",
								"You've googled the same passing drill three times this month.",
								"You get to the hall and realise you haven't thought about what comes after the warm-up.",
								"You're doing all of this unpaid, after a full day of work.",
							].map((item, i) => (
								<div key={i} className="flex gap-5 items-start group">
									<span className="font-display font-bold text-lg text-orange/60 shrink-0 mt-0.5 tabular-nums">
										{String(i + 1).padStart(2, "0")}
									</span>
									<p className="text-vp-muted text-base leading-relaxed group-hover:text-vp-text transition-colors duration-200">
										{item}
									</p>
								</div>
							))}
							<div className="py-6 border-t border-b border-vp-border">
								<p className="text-vp-text font-medium text-lg leading-snug">
									VolleyPlanner handles the planning.
									<br />
									<span className="text-orange">You handle the coaching.</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Plan showcase ─────────────────────────────────────────────────── */}
			<section id="showcase" className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start mb-12">
						<div>
							<p className="text-xs font-medium uppercase tracking-widest text-orange mb-4">
								Real output
							</p>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
								This is what
								<br />
								you get
							</h2>
						</div>
						<p className="text-vp-muted text-base leading-relaxed lg:mt-2">
							A full session with 6-8 drills. A court diagram for each one.
							Coaching points you can say out loud. A timeline so you know
							exactly how long everything takes. Equipment lists so you&apos;re
							not raiding the kit bag mid-session. Below is a real example,
							generated in 47 seconds.
						</p>
					</div>

					<PlanShowcase />
				</div>
			</section>

			{/* ── How it works ─────────────────────────────────────────────────── */}
			<section id="how-it-works" className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
						<div>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
								How it
								<br />
								works
							</h2>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
							{[
								{
									n: "01",
									title: "Tell it what you're working on",
									body: "Write what you're working on — serve receive, attacking, game play, pre-season fitness. Add your player count, their level, and how long you have. The more context you give, the more the plan fits your actual squad.",
								},
								{
									n: "02",
									title: "Your plan is ready",
									body: "In under a minute you get a full session: 6–8 drills, a court diagram for each one, coaching points, timings, and an equipment list. A beginners' club night looks nothing like tournament prep — the AI knows the difference.",
								},
								{
									n: "03",
									title: "Take it to training",
									body: "Open it on your phone at the side of the court, or print it before you leave. Tap any drill to see the full diagram and instructions. You're not scrambling for ideas mid-session. You've got a plan.",
								},
							].map((item) => (
								<div key={item.n}>
									<p className="font-display font-bold text-5xl text-vp-muted/30 mb-4 leading-none">
										{item.n}
									</p>
									<h3 className="text-vp-text font-semibold text-sm mb-2">
										{item.title}
									</h3>
									<p className="text-vp-muted text-sm leading-relaxed">
										{item.body}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── Mobile showcase ───────────────────────────────────────────────── */}
			<section className="border-b border-vp-border overflow-hidden">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
						{/* Phone mockup */}
						<div className="flex justify-center lg:justify-end order-2 lg:order-1">
							<PhoneMockup />
						</div>

						{/* Copy */}
						<div className="order-1 lg:order-2">
							<p className="text-xs font-medium uppercase tracking-widest text-orange mb-4">
								Session view
							</p>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)] mb-6">
								Built for the
								<br />
								sports hall,
								<br />
								not a desk
							</h2>
							<p className="text-vp-muted text-base leading-relaxed mb-6">
								The session view is designed for your phone at the side of the
								court. Tap any drill to see the full instructions and court
								diagram. No zooming, no scrolling through pages of text
								mid-warm-up.
							</p>
							<ul className="space-y-3">
								{[
									"Compact drill list with all 6-8 drills visible at once",
									"Tap to expand full instructions and court diagram",
									"Phase colour coding so you know where you are at a glance",
									"Works offline once loaded, no signal needed in the sports hall",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-3 text-sm text-vp-muted"
									>
										<Check
											size={13}
											className="text-orange/70 shrink-0 mt-0.5"
										/>
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* ── Feature bento ─────────────────────────────────────────────────── */}
			<section className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start mb-12">
						<div>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
								Made for
								<br />
								volleyball
								<br />
								coaches
							</h2>
							<p className="text-vp-muted mt-4 text-sm leading-relaxed">
								I coach and referee at a volleyball club. Planning sessions is
								the bit I find hardest to make time for. That&apos;s why I built
								this.
							</p>
						</div>
						<p className="text-vp-muted text-base leading-relaxed lg:mt-2">
							Everything is designed around how you actually coach, not how a
							tech company thinks you coach. Volleyball terminology, diagrams
							you can brief from, and a mobile view that works when you&apos;re
							standing in a sports hall with 12 players staring at you.
						</p>
					</div>

					<BentoGrid />
				</div>
			</section>

			{/* ── Testimonials ─────────────────────────────────────────────────── */}
			<section className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start mb-12">
						<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
							What coaches
							<br />
							say
						</h2>
						<p className="text-vp-muted text-base leading-relaxed lg:mt-2">
							Coaches at clubs, universities, and academies use VolleyPlanner —
							from first-time sessions to tournament prep.
						</p>
					</div>

					<Testimonials />
				</div>
			</section>

			{/* ── FAQ ──────────────────────────────────────────────────────────── */}
			<section id="faq" className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
						<div>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
								Questions
							</h2>
						</div>

						<dl className="space-y-8">
							{[
								{
									q: "Do I need an account to get started?",
									a: "You need a free account to generate plans. Sign-up takes seconds and uses a magic link, no password needed. Free accounts get 3 plans per month.",
								},
								{
									q: "How long does it take to generate a plan?",
									a: "Most plans are ready in under a minute. You get a complete structured session with 6-8 drills, court diagrams, coaching points, and timings.",
								},
								{
									q: "Can I use it on my phone during training?",
									a: "Yes. VolleyPlanner has a dedicated session view built for mobile. Tap any drill to see the full instructions and court diagram. It works once loaded, so no signal is needed in the sports hall.",
								},
								{
									q: "Is it suitable for beginners and youth teams?",
									a: "Yes. When you describe your session, include the skill level of your players. The AI adapts the drills, language, and progressions to suit beginners, intermediates, or more advanced squads.",
								},
								{
									q: "Can I change individual drills?",
									a: "Pro users can regenerate any drill with one click or choose from 3 alternatives. Free users can run the whole plan again if they have plans remaining that month.",
								},
								{
									q: "What does Pro include?",
									a: "Pro (£6/month) includes unlimited plans, saved plan history, regenerate or swap individual drills, coach notes per drill, PDF export, and the ability to share a plan via link.",
								},
							].map(({ q, a }) => (
								<div
									key={q}
									className="border-b border-vp-border pb-8 last:border-0 last:pb-0"
								>
									<dt className="text-vp-text font-medium text-base mb-2">
										{q}
									</dt>
									<dd className="text-vp-muted text-sm leading-relaxed">{a}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			{/* ── Pricing ──────────────────────────────────────────────────────── */}
			<section id="pricing" className="border-b border-vp-border">
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
						<div>
							<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
								Two plans.
								<br />
								No surprises.
							</h2>
							<p className="text-vp-muted mt-4 text-sm leading-relaxed max-w-xs">
								Start for free. Upgrade if you need more.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Free */}
							<div className="border border-vp-border rounded-xl p-7 bg-vp-surface">
								<p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-5">
									Free
								</p>
								<div className="mb-4">
									<span className="font-display font-bold text-4xl text-vp-text">
										£0
									</span>
									<span className="text-sm text-vp-muted ml-2">/ month</span>
								</div>
								<p className="text-sm text-vp-muted mb-5">
									3 plans a month. Free account, no password needed.
								</p>
								<ul className="space-y-2.5 text-sm mb-7">
									{[
										"AI-generated session plans",
										"Court diagrams",
										"Mobile session view",
										"Print layout",
									].map((f) => (
										<li
											key={f}
											className="flex items-center gap-3 text-vp-muted"
										>
											<Check size={12} className="text-orange shrink-0 mt-px" />
											{f}
										</li>
									))}
								</ul>
								<a
									href="#plan-form"
									className="block text-center border border-vp-border text-vp-text px-5 py-2.5 rounded-md text-sm font-medium hover:border-vp-muted transition-colors"
								>
									Get started free
								</a>
							</div>

							{/* Pro */}
							<div className="border border-orange/30 rounded-xl p-7 bg-vp-surface relative">
								<div className="absolute top-0 right-6 -translate-y-1/2 bg-orange text-white text-xs font-semibold px-3 py-1 rounded-full">
									Most popular
								</div>
								<p className="text-xs font-medium uppercase tracking-widest text-orange mb-5">
									Pro
								</p>
								<div className="mb-4">
									<span className="font-display font-bold text-4xl text-vp-text">
										£6
									</span>
									<span className="text-sm text-vp-muted ml-2">/ month</span>
								</div>
								<p className="text-sm text-vp-muted mb-5">
									Unlimited plans, full session history, PDF export.
								</p>
								<ul className="space-y-2.5 text-sm mb-7">
									{[
										"Everything in Free",
										"Unlimited plans",
										"Save and revisit plans",
										"Regenerate or swap individual drills",
										"Coach notes per drill",
										"PDF export",
										"Share plan via link",
									].map((f) => (
										<li
											key={f}
											className="flex items-center gap-3 text-vp-muted"
										>
											<Check size={12} className="text-orange shrink-0 mt-px" />
											{f}
										</li>
									))}
								</ul>
								<a
									href="#plan-form"
									className="block text-center bg-orange text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-orange/90 transition-colors"
								>
									Start free, upgrade anytime
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Final CTA ────────────────────────────────────────────────────── */}
			<section>
				<div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-40 text-center">
					<p className="text-xs font-medium uppercase tracking-widest text-orange mb-8">
						Ready?
					</p>
					<h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.92] text-[clamp(2.4rem,8vw,7rem)] mb-8">
						Walk into training
						<br className="hidden sm:block" /> with a plan.
						<br className="hidden sm:block" /> Every time.
					</h2>
					<p className="text-vp-muted text-lg mb-12 max-w-lg mx-auto leading-relaxed">
						Describe your session. Ready in under a minute.
					</p>
					<a
						href="#plan-form"
						className="inline-flex items-center gap-2 bg-orange text-white px-10 py-4 rounded-md text-base font-semibold hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
					>
						Plan tonight&apos;s session <ArrowRight size={18} />
					</a>
					<p className="text-vp-muted/50 text-sm mt-5">
						Free account · No card required
					</p>
				</div>
			</section>
		</div>
	);
}
