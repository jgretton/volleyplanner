'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LayoutDashboard, CreditCard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  is_pro: boolean
}

function UserMenu({ user, profile }: { user: User; profile: UserProfile | null }) {
  const initial = (user.email ?? '?')[0].toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Account menu"
          className={cn(
            'w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold transition-colors duration-150 outline-none',
            'bg-vp-surface-2 border-vp-border text-vp-muted',
            'hover:border-orange/50 hover:text-vp-text',
            'data-[state=open]:bg-orange/10 data-[state=open]:border-orange data-[state=open]:text-orange'
          )}
        >
          {initial}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 bg-vp-surface-2 border border-vp-border rounded-xl overflow-hidden shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {/* Identity */}
          <div className="px-4 py-3 border-b border-vp-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vp-border flex items-center justify-center text-xs font-semibold text-vp-text shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-vp-text truncate">{user.email}</p>
                </div>
                {profile?.is_pro && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange/10 text-orange border border-orange/20 mt-1">
                    Pro
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-1.5 border-b border-vp-border">
            <DropdownMenu.Item asChild>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-vp-muted hover:bg-vp-border hover:text-vp-text transition-colors duration-150 outline-none cursor-pointer"
              >
                <LayoutDashboard size={14} />
                My plans
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-vp-muted hover:bg-vp-border hover:text-vp-text transition-colors duration-150 outline-none cursor-pointer"
              >
                <CreditCard size={14} />
                Billing
              </Link>
            </DropdownMenu.Item>
          </div>

          {/* Sign out */}
          <div className="p-1.5">
            <DropdownMenu.Item
              onSelect={handleSignOut}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-vp-muted hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150 outline-none cursor-pointer"
            >
              <LogOut size={14} />
              Sign out
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function loadUserAndProfile(userId: string) {
      const { data } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', userId)
        .single()
      setProfile(data)
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) loadUserAndProfile(data.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserAndProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-vp-bg border-b border-vp-border sticky top-0 z-50">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          <Link href={user ? '/dashboard' : '/'} className="flex items-center">
            <span className="font-display font-bold uppercase text-xl tracking-tight text-vp-text leading-none">
              Volley<span className="text-orange">Planner</span>
            </span>
          </Link>

          {user ? (
            /* Authenticated — product nav only */
            <UserMenu user={user} profile={profile} />
          ) : (
            /* Unauthenticated — marketing nav */
            <>
              <div className="hidden md:flex items-center gap-8">
                <Link href="#how-it-works" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
                  How it works
                </Link>
                <Link href="#pricing" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
                  Pricing
                </Link>
                <Link href="/signin" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
                  Sign in
                </Link>
                <Link
                  href="#plan-form"
                  className="bg-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98]"
                >
                  Try free
                </Link>
              </div>

              {/* Mobile — unauthenticated */}
              <div className="md:hidden flex items-center gap-3">
                <Link href="/signin" className="text-sm text-vp-muted hover:text-vp-text transition-colors duration-150">
                  Sign in
                </Link>
                <Link
                  href="#plan-form"
                  className="bg-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange/90 transition-colors"
                >
                  Try free
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}
