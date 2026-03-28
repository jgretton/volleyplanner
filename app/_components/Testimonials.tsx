const QUOTES = [
  {
    body: "I used to spend an hour the night before training writing session plans on the back of an envelope. Now I do it in the car park before I go in. The court diagrams are brilliant — I can brief the squad in 30 seconds and get on with it.",
    name: 'Jamie Townsend',
    role: 'Head Coach',
    club: 'Brighton Volleyball Club',
    initial: 'J',
  },
  {
    body: "Running three training sessions a week as a student is intense. VolleyPlanner means I actually turn up with a proper structured plan instead of winging it. My team have definitely noticed the difference — the sessions flow so much better now.",
    name: 'Priya Sharma',
    role: 'Club Captain',
    club: 'UCL Volleyball',
    initial: 'P',
  },
  {
    body: "I've been coaching grassroots volleyball for six years and this is the first tool that actually understands how we train at club level. It uses the right terminology, the right drill structure. Doesn't feel like it was built for football and bolted onto volleyball.",
    name: 'Mark Calloway',
    role: 'Volunteer Coach',
    club: 'Sheffield Hallam VC',
    initial: 'M',
  },
]

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {QUOTES.map((q) => (
        <div key={q.name} className="bg-vp-surface border border-vp-border rounded-xl p-6 flex flex-col gap-5">
          {/* Quote */}
          <p className="text-sm text-vp-muted leading-relaxed flex-1">
            &ldquo;{q.body}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t border-vp-border">
            <div className="w-8 h-8 rounded-full bg-vp-surface-2 border border-vp-border flex items-center justify-center text-xs font-semibold text-vp-muted shrink-0">
              {q.initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-vp-text truncate">{q.name}</p>
              <p className="text-xs text-vp-muted truncate">{q.role} · {q.club}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
