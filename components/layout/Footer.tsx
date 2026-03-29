import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-vp-border bg-vp-bg">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">

          <div>
            <span className="text-base font-semibold text-vp-text tracking-tight">
              Volley<span className="text-orange">Planner</span>
            </span>
            <p className="mt-3 text-sm text-vp-muted leading-relaxed max-w-xs">
              AI-powered session planning for volleyball coaches.
              Free to try, no card required.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">Product</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="#how-it-works" className="text-vp-muted hover:text-orange transition-colors duration-150">How it works</Link>
              <Link href="#pricing" className="text-vp-muted hover:text-orange transition-colors duration-150">Pricing</Link>
              <Link href="/dashboard" className="text-vp-muted hover:text-orange transition-colors duration-150">Sign in</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-vp-muted mb-4">Legal</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/privacy" className="text-vp-muted hover:text-orange transition-colors duration-150">Privacy</Link>
              <Link href="/terms" className="text-vp-muted hover:text-orange transition-colors duration-150">Terms</Link>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-vp-border text-xs text-vp-muted">
          © {new Date().getFullYear()} VolleyPlanner. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
