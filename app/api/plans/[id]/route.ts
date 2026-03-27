import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const PatchSchema = z.object({
  liked: z.boolean(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = PatchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', code: 'invalid_input' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised', code: 'unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('plans')
      .update({ liked: parsed.data.liked })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Patch plan error:', error.message)
      return NextResponse.json({ error: 'Failed to update plan', code: 'server_error' }, { status: 500 })
    }

    return NextResponse.json({ data: { liked: parsed.data.liked } })

  } catch (err) {
    console.error('Patch plan route error:', err)
    return NextResponse.json({ error: 'Something went wrong', code: 'server_error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorised', code: 'unauthorized' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete plan error:', error.message)
      return NextResponse.json(
        { error: 'Failed to delete plan', code: 'server_error' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: { deleted: true } })

  } catch (err) {
    console.error('Delete plan route error:', err)
    return NextResponse.json(
      { error: 'Something went wrong', code: 'server_error' },
      { status: 500 }
    )
  }
}
