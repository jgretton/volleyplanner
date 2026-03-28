import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { swapDrill, SessionPlanSchema } from '@/lib/claude'

const RequestSchema = z.object({
  drill_index: z.number().int().min(0),
  plan: SessionPlanSchema,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to swap drills.', code: 'unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single()

    if (!profile?.is_pro) {
      return NextResponse.json(
        { error: 'Swapping drills is a Pro feature.', code: 'unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request.', code: 'invalid_input' },
        { status: 400 }
      )
    }

    const options = await swapDrill(parsed.data.plan, parsed.data.drill_index)

    return NextResponse.json({ data: options })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Swap drill error:', message)
    return NextResponse.json(
      { error: "We couldn't fetch alternatives right now. Please try again.", code: 'generation_failed' },
      { status: 500 }
    )
  }
}
