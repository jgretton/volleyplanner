'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

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

export default function SignInPage() {
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)

    const supabase = createClient()
    // Always fire the request but never reveal whether the email exists
    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    })

    setIsLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
        <CourtLines />
        <div className="relative max-w-sm w-full text-center">

          <div className="w-14 h-14 rounded-full bg-orange/10 border border-orange/20 flex items-center justify-center mx-auto mb-6">
            <Mail size={24} className="text-orange" />
          </div>

          <h1 className="font-display font-bold uppercase text-4xl text-vp-text mb-3">
            Check your inbox
          </h1>
          <p className="text-vp-muted leading-relaxed mb-8">
            We&apos;ve sent a sign-in link to{' '}
            <span className="text-vp-text">{email}</span>.
            Click it to continue - it expires in 1 hour.
          </p>
          <p className="text-xs text-vp-muted/50">
            Can&apos;t find it? Check your spam folder.
          </p>

        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      <CourtLines />
      <div className="relative max-w-sm w-full">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-vp-muted hover:text-vp-text transition-colors duration-150 py-2 mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <h1 className="font-display font-bold uppercase text-4xl text-vp-text mb-2">
          Sign in
        </h1>
        <p className="text-vp-muted mb-8">
          No password needed - we&apos;ll email you a sign-in link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-widest text-vp-muted mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onInput={e => setEmail((e.target as HTMLInputElement).value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full bg-vp-surface-2 border border-vp-border rounded-md px-4 py-3 text-base text-vp-text placeholder:text-vp-muted/40 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/20 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-orange text-white px-6 py-3 rounded-md font-medium hover:bg-orange/90 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send sign-in link'}
          </button>
        </form>

        <p className="text-xs text-vp-muted/50 text-center mt-6">
          New here? Signing in creates your free account automatically.
        </p>

      </div>
    </div>
  )
}
