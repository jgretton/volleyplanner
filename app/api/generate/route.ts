import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { generateSessionPlan } from '@/lib/claude'
import type { LikedDrill } from '@/types/plan'

const RequestSchema = z.object({
  players:     z.number().min(1).max(100),
  duration:    z.number(),
  level:       z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
  description: z.string().min(1),
  userId:      z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', code: 'invalid_input' },
        { status: 400 }
      )
    }

    const inputs = parsed.data
    let likedDrills: LikedDrill[] = []

    // Check usage limits for identified users
    if (inputs.userId) {
      const supabase = await createClient()
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_pro, plans_used_this_month, plans_reset_at')
        .eq('id', inputs.userId)
        .single()

      if (error || !profile) {
        return NextResponse.json(
          { error: 'User not found', code: 'unauthorized' },
          { status: 401 }
        )
      }

      // Reset monthly count if needed
      if (new Date(profile.plans_reset_at) <= new Date()) {
        await supabase
          .from('profiles')
          .update({
            plans_used_this_month: 0,
            plans_reset_at: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ).toISOString(),
          })
          .eq('id', inputs.userId)
        profile.plans_used_this_month = 0
      }

      // Enforce free tier limit
      if (!profile.is_pro && profile.plans_used_this_month >= 3) {
        return NextResponse.json(
          {
            error: 'Monthly plan limit reached. Upgrade to Pro for unlimited plans.',
            code: 'limit_reached',
          },
          { status: 402 }
        )
      }

      // Fetch liked drills for Pro personalisation
      if (profile.is_pro) {
        const { data: feedback } = await supabase
          .from('drill_feedback')
          .select('drill_name, drill_type')
          .eq('user_id', inputs.userId)
          .eq('feedback', 'liked')
          .limit(10)

        if (feedback) {
          likedDrills = feedback.map(f => ({
            drill_name: f.drill_name,
            drill_type: f.drill_type,
          }))
        }
      }
    }

    // Generate
    const plan = await generateSessionPlan(inputs, likedDrills)

    // Save and increment for logged-in users
    if (inputs.userId) {
      const supabase = await createClient()

      const { error: saveError } = await supabase.from('plans').insert({
        user_id:    inputs.userId,
        title:      plan.title,
        input_data: inputs,
        plan_data:  plan,
      })
      if (saveError) console.error('Plan save error:', saveError.message)

      await supabase.rpc('increment_plans_used', { user_id: inputs.userId })
    }

    return NextResponse.json({ data: plan })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Generate route error:', message)

    if (message === 'generation_failed') {
      return NextResponse.json(
        {
          error: "We couldn't generate your plan right now. Please try again.",
          code: 'generation_failed',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.', code: 'server_error' },
      { status: 500 }
    )
  }
}
