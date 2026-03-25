'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initial = (user.email ?? '?')[0].toUpperCase()

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Account menu"
        className={cn(
          'w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold transition-colors duration-150',
          open
            ? 'bg-orange/10 border-orange text-orange'
            : 'bg-vp-surface-2 border-vp-border text-vp-muted hover:border-orange/50 hover:text-vp-text'
        )}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-vp-surface-2 border border-vp-border rounded-xl overflow-hidden z-50">
          {/* Email */}
          <div className="px-4 py-3 border-b border-vp-border">
            <p className="text-xs text-vp-muted truncate">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1.5 flex flex-col gap-0.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-vp-muted hover:bg-vp-border hover:text-vp-text transition-colors duration-150"
            >
              <LayoutDashboard size={14} />
              My plans
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-vp-muted hover:bg-vp-border hover:text-vp-text transition-colors duration-150 w-full text-left"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-vp-bg border-b border-vp-border sticky top-0 z-50">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          <Link href="/" className="flex items-center">
            <span className="text-base font-semibold text-vp-text tracking-tight">
              Volley<span className="text-orange">Planner</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
              How it works
            </Link>
            <Link href="#pricing" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
              Pricing
            </Link>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link href="/signin" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
                Sign in
              </Link>
            )}
            <Link
              href="#plan-form"
              className="bg-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
            >
              Try free
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link href="/signin" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
                Sign in
              </Link>
            )}
            <Link
              href="#plan-form"
              className="bg-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange/90 transition-colors"
            >
              Try free
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}
