import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VolleyPlanner — AI Volleyball Session Planner',
  description: 'Generate complete volleyball training session plans in seconds. Court diagrams, drill instructions, and timing — all tailored to your squad.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <head>
      </head>
      <body className="bg-vp-bg text-vp-text min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-vp-surface-2)',
              border: '1px solid var(--color-vp-border)',
              color: 'var(--color-vp-text)',
            },
          }}
        />
      </body>
    </html>
  )
}
