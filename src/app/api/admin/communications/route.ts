import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const leadId = searchParams.get('leadId')
  const where: any = {}
  if (leadId) where.leadId = leadId
  const comms = await db.communication.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: true, lead: true },
  })
  return NextResponse.json(comms)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const body = await req.json()
    const c = await db.communication.create({
      data: {
        type: body.type || 'Call',
        direction: body.direction || 'Outbound',
        subject: body.subject || '',
        notes: body.notes || null,
        userId: session.user.id,
        leadId: body.leadId || null,
        customerId: body.customerId || null,
        duration: body.duration ? Number(body.duration) : null,
      },
    })
    return NextResponse.json(c, { status: 201 })
  } catch (err) {
    console.error('Create comm error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await db.communication.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
