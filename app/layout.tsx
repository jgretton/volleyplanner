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
  title: {
    default: 'VolleyPlanner - AI Volleyball Session Planner',
    template: '%s | VolleyPlanner',
  },
  description: 'Generate complete volleyball training session plans in seconds. Court diagrams, drill instructions, and timings tailored to your squad.',
  metadataBase: new URL('https://volleyplanner.co.uk'),
  keywords: [
    'volleyball session planner',
    'volleyball coaching',
    'volleyball drills',
    'volleyball training plans',
    'volleyball practice plan',
    'AI session planner',
    'volleyball coach app',
    'volleyball session plan template',
    'volleyball training session',
    'volleyball training drills',
  ],
  authors: [{ name: 'VolleyPlanner' }],
  creator: 'VolleyPlanner',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://volleyplanner.co.uk',
    siteName: 'VolleyPlanner',
    title: 'VolleyPlanner - AI Volleyball Session Planner',
    description: 'Generate complete volleyball training session plans in seconds. Court diagrams, drill instructions, and timings tailored to your squad.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VolleyPlanner - AI Volleyball Session Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VolleyPlanner - AI Volleyball Session Planner',
    description: 'Generate complete volleyball training session plans in seconds. Court diagrams, drills, and timings for your squad.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://volleyplanner.co.uk',
  },
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
      <body className="bg-vp-bg text-vp-text min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
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
