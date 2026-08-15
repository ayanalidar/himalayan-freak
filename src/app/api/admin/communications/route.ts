import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns all communications with PII)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const leadId = searchParams.get('leadId')
    const where: any = {}
    if (leadId) where.leadId = leadId

    // Use select to NEVER expose passwordHash
    const comms = await db.communication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true } },
        lead: { select: { id: true, name: true, email: true, phone: true } },
      },
    })
    return NextResponse.json(comms)
  } catch (err) {
    console.error('Fetch comms error:', err)
    return NextResponse.json([])
  }
}

// POST is admin-only (CRM-internal logging)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const c = await db.communication.create({
      data: {
        type: ['Call', 'Email', 'WhatsApp', 'SMS', 'Meeting'].includes(body.type) ? body.type : 'Call',
        direction: ['Inbound', 'Outbound'].includes(body.direction) ? body.direction : 'Outbound',
        subject: String(body.subject || '').slice(0, 500),
        notes: body.notes ? String(body.notes).slice(0, 5000) : null,
        userId: (session.user as any).id,
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

// DELETE is admin-only
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
    console.error('Delete comm error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
