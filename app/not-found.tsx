import Link from 'next/link'

function CourtLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1400 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect x="200" y="80" width="1000" height="440" stroke="white" strokeWidth="1" opacity="0.06" />
      <line x1="700" y1="80" x2="700" y2="520" stroke="white" strokeWidth="1.5" opacity="0.08" />
      <line x1="478" y1="80" x2="478" y2="520" stroke="white" strokeWidth="0.75" strokeDasharray="8 5" opacity="0.05" />
      <line x1="922" y1="80" x2="922" y2="520" stroke="white" strokeWidth="0.75" strokeDasharray="8 5" opacity="0.05" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <CourtLines />

      <div className="relative text-center px-4">
        <p className="text-xs font-medium uppercase tracking-widest text-orange mb-6">
          404 — Page not found
        </p>
        <h1 className="font-display font-bold uppercase leading-[0.92] tracking-tight text-vp-text mb-8">
          <span className="block text-[clamp(3rem,12vw,8rem)]">Out of</span>
          <span className="block text-[clamp(3rem,12vw,8rem)] text-orange">bounds.</span>
        </h1>
        <p className="text-vp-muted text-base max-w-md mx-auto mb-10 leading-relaxed">
          This page doesn&apos;t exist. It may have been moved, deleted, or you may have followed a broken link.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-orange text-white px-6 py-3.5 rounded-md font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
          >
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="border border-vp-border text-vp-text px-5 py-3.5 rounded-md font-medium hover:border-vp-muted transition-colors"
          >
            My plans
          </Link>
        </div>
      </div>
    </div>
  )
}
