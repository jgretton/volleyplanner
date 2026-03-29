import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BillingClient } from './BillingClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Billing',
  robots: { index: false },
}

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/?signin=true')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, stripe_customer_id, stripe_subscription_id, subscription_status, plans_used_this_month, plans_reset_at')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/?signin=true')
  }

  return (
    <BillingClient
      email={user.email ?? ''}
      profile={{
        is_pro:                  profile.is_pro ?? false,
        stripe_customer_id:      profile.stripe_customer_id ?? null,
        stripe_subscription_id:  profile.stripe_subscription_id ?? null,
        subscription_status:     profile.subscription_status ?? null,
        plans_used_this_month:   profile.plans_used_this_month ?? 0,
        plans_reset_at:          profile.plans_reset_at ?? new Date().toISOString(),
      }}
    />
  )
}
