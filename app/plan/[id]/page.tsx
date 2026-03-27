import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SavedPlanViewer } from './SavedPlanViewer'
import type { SessionPlan } from '@/types/plan'

export default async function SavedPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [{ data: plan, error }, { data: profile }, { data: feedbackRows }] = await Promise.all([
    supabase
      .from('plans')
      .select('plan_data, title')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single(),
    supabase
      .from('drill_feedback')
      .select('drill_index, feedback')
      .eq('user_id', user.id)
      .eq('plan_id', id),
  ])

  if (error || !plan) notFound()

  const drillFeedback: Record<number, 'liked' | 'disliked'> = {}
  for (const row of feedbackRows ?? []) {
    if (row.feedback === 'liked' || row.feedback === 'disliked') {
      drillFeedback[row.drill_index] = row.feedback
    }
  }

  return (
    <SavedPlanViewer
      plan={plan.plan_data as SessionPlan}
      planId={id}
      isPro={profile?.is_pro ?? false}
      drillFeedback={drillFeedback}
    />
  )
}
