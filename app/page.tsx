import { Check, ArrowRight } from 'lucide-react'
import { SessionForm } from '@/components/plan/SessionForm'

/* ── Volleyball court line background ───────────────────────────────── */
function CourtLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1400 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Court boundary */}
      <rect x="200" y="80" width="1000" height="440" stroke="white" strokeWidth="1" opacity="0.06" />
      {/* Net line */}
      <line x1="700" y1="80" x2="700" y2="520" stroke="white" strokeWidth="1.5" opacity="0.08" />
      {/* Attack lines */}
      <line x1="478" y1="80" x2="478" y2="520" stroke="white" strokeWidth="0.75" strokeDasharray="8 5" opacity="0.05" />
      <line x1="922" y1="80" x2="922" y2="520" stroke="white" strokeWidth="0.75" strokeDasharray="8 5" opacity="0.05" />
      {/* Zone dividers — very faint */}
      <line x1="200" y1="300" x2="478" y2="300" stroke="white" strokeWidth="0.5" opacity="0.03" />
      <line x1="922" y1="300" x2="1200" y2="300" stroke="white" strokeWidth="0.5" opacity="0.03" />
    </svg>
  )
}

/* ── Plan output mockup ──────────────────────────────────────────────── */
function PlanMockup() {
  const drills = [
    { phase: 'Warm-up',     colour: 'bg-amber-500', name: 'Dynamic Movement & Ball Familiarisation', meta: '12 min · All players'    },
    { phase: 'Technical',   colour: 'bg-blue-500',  name: 'Serve Receive Positioning Patterns',      meta: '22 min · 6 passers'      },
    { phase: 'Progressive', colour: 'bg-blue-400',  name: '3-Person Passing Circuit with Setter',    meta: '25 min · Groups of 3'    },
  ]

  return (
    <div className="bg-vp-surface border border-vp-border rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-vp-border">
        <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-1">Session Plan</p>
        <h3 className="text-vp-text font-semibold text-lg">Passing &amp; Serve Receive</h3>
        <p className="text-vp-muted text-sm mt-0.5">90 min · 10 players · Intermediate</p>
      </div>

      {/* Timeline bar */}
      <div className="px-6 py-4 border-b border-vp-border">
        <p className="text-xs text-vp-muted mb-2 uppercase tracking-widest">Session timeline</p>
        <div className="flex rounded overflow-hidden h-1.5 gap-px">
          <div className="bg-amber-500 w-[14%]" />
          <div className="bg-blue-500 w-[24%]" />
          <div className="bg-blue-400 w-[28%]" />
          <div className="bg-orange w-[24%]" />
          <div className="bg-teal-500 w-[10%]" />
        </div>
        <div className="flex gap-4 mt-2.5 flex-wrap">
          {[
            { label: 'Warm-up',    colour: 'bg-amber-500', dur: '12m' },
            { label: 'Technical',  colour: 'bg-blue-500',  dur: '22m' },
            { label: 'Progressive',colour: 'bg-blue-400',  dur: '25m' },
            { label: 'Game',       colour: 'bg-orange',    dur: '22m' },
            { label: 'Cool-down',  colour: 'bg-teal-500',  dur: '9m'  },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${p.colour} flex-shrink-0`} />
              <span className="text-xs text-vp-muted">{p.label} {p.dur}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drill list */}
      <div className="divide-y divide-vp-border">
        {drills.map(drill => (
          <div key={drill.name} className="px-6 py-4 flex items-center gap-4">
            <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${drill.colour}`} />
            <div className="flex-1 min-w-0">
              <p className="text-vp-text text-sm font-medium truncate">{drill.name}</p>
              <p className="text-vp-muted text-xs mt-0.5">{drill.meta}</p>
            </div>
          </div>
        ))}
        <div className="px-6 py-3 text-center">
          <span className="text-xs text-vp-muted/60">+ 4 more drills in full plan</span>
        </div>
      </div>

    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-vp-bg">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-vp-border">
        <CourtLines />
        <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-48">

          {/* Headline — centred */}
          <div className="text-center mb-20 animate-fade-up">
            <p className="text-xs font-medium uppercase tracking-widest text-orange mb-8">
              Volleyball Session Planner
            </p>
            <h1 className="font-display font-bold uppercase leading-[0.92] tracking-tight text-vp-text mb-10">
              <span className="block text-[clamp(1rem,11vw,6rem)]">Your next session.</span>
              <span className="block text-[clamp(1rem,11vw,6rem)] text-orange">Ready.</span>
            </h1>
            <p className="text-vp-muted text-base leading-relaxed max-w-2xl mx-auto">
              Describe what you want to work on, how many players you&apos;ve got, and how long you&apos;ve got.
              VolleyPlanner puts together a full session plan - drills, diagrams, coaching points, timings - in under a minute.
            </p>
          </div>

          {/* Form — full section width */}
          <div>
            <div className="bg-vp-surface border border-vp-border rounded-xl p-6 sm:p-8">
              <SessionForm />
            </div>
          </div>

          {/* Trust marks */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 animate-fade-up-1">
            {[
              'Drills, diagrams & timing',
              'Volleyball England terminology',
              'Mobile-ready for courtside use',
            ].map(item => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-vp-muted/50">
                <Check size={11} className="text-orange/60 flex-shrink-0" />
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
                Sound<br />familiar?
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
                  <span className="font-display font-bold text-lg text-orange/60 flex-shrink-0 mt-0.5 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-vp-muted text-base leading-relaxed group-hover:text-vp-text transition-colors duration-200">
                    {item}
                  </p>
                </div>
              ))}
              <div className="py-6 border-t border-b border-vp-border">
                <p className="text-vp-text font-medium text-lg leading-snug">
                  VolleyPlanner handles the planning.<br />
                  <span className="text-orange">You handle the coaching.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <section className="border-b border-vp-border">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-orange mb-4">Output</p>
              <h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
                What you<br />get
              </h2>
              <p className="text-vp-muted mt-6 leading-relaxed text-sm max-w-sm">
                A full session with 6–8 drills, a court diagram for each one, coaching points that actually make sense,
                and a timeline so you know exactly how long everything takes. Equipment lists too - useful when
                you&apos;re raiding the kit bag five minutes before people arrive.
              </p>
            </div>

            <PlanMockup />

          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-vp-border">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">

            <div>
              <h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
                How it<br />works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {[
                {
                  n: '01',
                  title: 'Tell it what you\'re working on',
                  body: 'Describe your session. Be as specific as you like - the more detail you give it, the better the plan.',
                },
                {
                  n: '02',
                  title: 'Plan is generated',
                  body: 'VolleyPlanner uses AI to build a structured session around your squad, level, and focus. It takes about 60 seconds.',
                },
                {
                  n: '03',
                  title: 'Coach with confidence',
                  body: 'View it on your phone courtside or print it out. Every drill has a diagram and clear instructions your players can follow.',
                },
              ].map(item => (
                <div key={item.n}>
                  <p className="font-display font-bold text-5xl text-vp-border mb-4 leading-none">{item.n}</p>
                  <h3 className="text-vp-text font-semibold mb-2 text-sm">{item.title}</h3>
                  <p className="text-vp-muted text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Made for grassroots ──────────────────────────────────────────── */}
      <section className="border-b border-vp-border">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-orange mb-4">Built for you</p>
              <h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
                Made for<br />grassroots<br />coaches
              </h2>
              <p className="text-vp-muted mt-4 text-sm leading-relaxed">
                I coach and referee at a grassroots club. Planning sessions is the bit I find hardest to make time for.
                That&apos;s why I built this.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-vp-border rounded-xl overflow-hidden border border-vp-border">
              {[
                {
                  title: 'Volleyball England terminology',
                  body: 'Serve receive, libero, rally point scoring, rotation - it uses the same language you do, not generic sports jargon.',
                },
                {
                  title: 'Understands your level',
                  body: "There's a difference between a beginner session where people are still learning to pass, and an intermediate club running tournament prep. It knows the difference.",
                },
                {
                  title: 'Designed for mobile',
                  body: 'Built to be used on a phone, in the sports hall, during warm-up. Not just at a desk the night before.',
                },
                {
                  title: 'Diagrams you can actually brief from',
                  body: 'Every drill has a court diagram. Clear enough to show your squad in 30 seconds and get on with it.',
                },
              ].map(f => (
                <div key={f.title} className="bg-vp-surface p-8">
                  <h3 className="text-vp-text font-semibold mb-3 text-sm">{f.title}</h3>
                  <p className="text-vp-muted text-sm leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-b border-vp-border">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">

            <div>
              <h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.95] text-[clamp(2.5rem,5vw,3.5rem)]">
                Simple<br />pricing
              </h2>
              <p className="text-vp-muted mt-4 text-sm leading-relaxed max-w-xs">
                Start for free. Upgrade if you need more.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Free */}
              <div className="border border-vp-border rounded-xl p-7 bg-vp-surface">
                <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-5">Free</p>
                <div className="mb-4">
                  <span className="font-display font-bold text-4xl text-vp-text">£0</span>
                  <span className="text-sm text-vp-muted ml-2">/ month</span>
                </div>
                <p className="text-sm text-vp-muted mb-5">3 plans a month. Free account, no password needed.</p>
                <ul className="space-y-2.5 text-sm mb-7">
                  {['AI-generated session plans', 'Court diagrams', 'Mobile session view', 'Print layout'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-vp-muted">
                      <Check size={12} className="text-orange flex-shrink-0 mt-px" />
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
                <p className="text-xs font-medium uppercase tracking-widest text-orange mb-5">Pro</p>
                <div className="mb-4">
                  <span className="font-display font-bold text-4xl text-vp-text">£6</span>
                  <span className="text-sm text-vp-muted ml-2">/ month</span>
                </div>
                <p className="text-sm text-vp-muted mb-5">Unlimited plans, saved history and more.</p>
                <ul className="space-y-2.5 text-sm mb-7">
                  {[
                    'Everything in Free',
                    'Unlimited plans',
                    'Save & revisit plans',
                    'Regenerate or swap individual drills',
                    'Coach notes per drill',
                    'PDF export',
                    'Share plan via link',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-vp-muted">
                      <Check size={12} className="text-orange flex-shrink-0 mt-px" />
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
          <p className="text-xs font-medium uppercase tracking-widest text-orange mb-8">Ready?</p>
          <h2 className="font-display font-bold uppercase tracking-tight text-vp-text leading-[0.92] text-[clamp(2.4rem,8vw,7rem)] mb-8">
            Good coaching shouldn&apos;t need a good memory.
          </h2>
          <p className="text-vp-muted text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Describe your session. We&apos;ll remember the rest.
          </p>
          <a
            href="#plan-form"
            className="inline-flex items-center gap-2 bg-orange text-white px-10 py-4 rounded-md text-base font-semibold hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
          >
            Plan tonight&apos;s session <ArrowRight size={18} />
          </a>
          <p className="text-vp-muted/50 text-sm mt-5">Free to use · No account needed</p>
        </div>
      </section>

    </div>
  )
}
