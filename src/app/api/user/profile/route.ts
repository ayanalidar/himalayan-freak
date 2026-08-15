import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  const userId = (session.user as any).id
  try {
    const body = await req.json()
    const updated = await db.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        phone: body.phone,
        city: body.city,
        state: body.state,
      },
    })
    return NextResponse.json({ ok: true, name: updated.name })
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
