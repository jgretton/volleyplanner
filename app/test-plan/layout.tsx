import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Plan',
  robots: { index: false },
}

export default function TestPlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
