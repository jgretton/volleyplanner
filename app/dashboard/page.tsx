import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardPlans } from './DashboardPlans'
import type { Metadata } from 'next'
import type { SavedPlan } from '@/types/plan'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Plans',
  robots: { index: false },
}

export interface LikedDrill {
  id: string
  drill_name: string
  drill_type: string
  plan_id: string
  plan_title: string
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/?signin=true')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, subscription_status, plans_used_this_month, plans_reset_at')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/?signin=true')
  }

  // Pro users see full history; free users see most recent plan only
  const plansQuery = supabase
    .from('plans')
    .select('id, title, input_data, liked, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const [{ data: plans }, { data: feedbackRows }] = await Promise.all([
    profile.is_pro ? plansQuery : plansQuery.limit(1),
    profile.is_pro
      ? supabase
          .from('drill_feedback')
          .select('id, drill_name, drill_type, plan_id')
          .eq('user_id', user.id)
          .eq('feedback', 'liked')
          .order('created_at', { ascending: false })
          .limit(12)
      : Promise.resolve({ data: [] }),
  ])

  // Attach plan titles to liked drills
  let likedDrills: LikedDrill[] = []
  if (feedbackRows && feedbackRows.length > 0) {
    const planIds = [...new Set(feedbackRows.map(r => r.plan_id))]
    const { data: planTitles } = await supabase
      .from('plans')
      .select('id, title')
      .in('id', planIds)

    const titleMap = Object.fromEntries((planTitles ?? []).map(p => [p.id, p.title]))
    likedDrills = feedbackRows.map(r => ({
      id: r.id,
      drill_name: r.drill_name,
      drill_type: r.drill_type,
      plan_id: r.plan_id,
      plan_title: titleMap[r.plan_id] ?? 'Unknown plan',
    }))
  }

  return (
    <DashboardPlans
      plans={(plans ?? []) as Pick<SavedPlan, 'id' | 'title' | 'input_data' | 'liked' | 'created_at'>[]}
      profile={{
        is_pro:                profile.is_pro ?? false,
        subscription_status:   profile.subscription_status ?? null,
        plans_used_this_month: profile.plans_used_this_month ?? 0,
        plans_reset_at:        profile.plans_reset_at ?? new Date().toISOString(),
      }}
      likedDrills={likedDrills}
    />
  )
}
