import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const FeedbackSchema = z.object({
  plan_id:    z.string().uuid(),
  drill_index: z.number().int().min(0),
  drill_name: z.string().min(1),
  drill_type: z.string().min(1),
  feedback:   z.enum(['liked', 'disliked']).nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = FeedbackSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', code: 'invalid_input' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised', code: 'unauthorized' }, { status: 401 })
    }

    const { plan_id, drill_index, drill_name, drill_type, feedback } = parsed.data

    // Remove existing feedback for this drill first
    await supabase
      .from('drill_feedback')
      .delete()
      .eq('user_id', user.id)
      .eq('plan_id', plan_id)
      .eq('drill_index', drill_index)

    // Insert new feedback unless toggled off
    if (feedback !== null) {
      const { error } = await supabase
        .from('drill_feedback')
        .insert({ plan_id, user_id: user.id, drill_index, drill_name, drill_type, feedback })

      if (error) {
        console.error('Drill feedback insert error:', error.message)
        return NextResponse.json({ error: 'Failed to save feedback', code: 'server_error' }, { status: 500 })
      }
    }

    return NextResponse.json({ data: { feedback } })

  } catch (err) {
    console.error('Drill feedback route error:', err)
    return NextResponse.json({ error: 'Something went wrong', code: 'server_error' }, { status: 500 })
  }
}
