import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json([])
  const userId = (session.user as any).id
  const saved = await db.savedDestination.findMany({
    where: { userId },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(saved)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const body = await req.json()
    const existing = await db.savedDestination.findFirst({
      where: { userId: (session.user as any).id, destinationId: body.destinationId },
    })
    if (existing) {
      await db.savedDestination.delete({ where: { id: existing.id } })
      return NextResponse.json({ ok: true, saved: false })
    }
    const s = await db.savedDestination.create({
      data: {
        userId: (session.user as any).id,
        destinationId: body.destinationId,
        notes: body.notes || null,
      },
    })
    return NextResponse.json({ ok: true, saved: true, id: s.id })
  } catch (err) {
    console.error('Save destination error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
