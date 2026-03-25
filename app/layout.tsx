import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
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
        {/* DEV ONLY: catch JS errors before React mounts — remove before launch */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.onerror = function(msg, src, line, col, err) {
            var d = document.createElement('div');
            d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#c00;color:#fff;font:12px monospace;padding:8px;z-index:9999;white-space:pre-wrap;max-height:40vh;overflow:auto';
            d.textContent = 'JS ERROR: ' + msg + '\\n' + src + ':' + line;
            document.body && document.body.appendChild(d);
          };
          window.onunhandledrejection = function(e) {
            var d = document.createElement('div');
            d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#900;color:#fff;font:12px monospace;padding:8px;z-index:9999;white-space:pre-wrap;max-height:40vh;overflow:auto';
            d.textContent = 'UNHANDLED PROMISE: ' + (e.reason && (e.reason.message || e.reason));
            document.body && document.body.appendChild(d);
          };
        `}} />
      </head>
      <body className="bg-vp-bg text-vp-text min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
