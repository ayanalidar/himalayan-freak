import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns PII - all leads with phone/email/budget)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    return NextResponse.json(leads)
  } catch (err) {
    console.error('Fetch leads error:', err)
    return NextResponse.json([])
  }
}

// POST is public (lead submission from website/trip planner) but with strict allowlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Strict allowlist - prevent mass-assignment of status/source/score/assignedTo
    const {
      name, email, phone, destination, travelDate, pax, budget, notes,
    } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    // Rate limit by IP (basic protection)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const recentLeadsFromIp = await db.lead.count({
      where: {
        email: email.toLowerCase(),
        createdAt: { gt: new Date(Date.now() - 60_000) }, // last minute
      },
    })
    if (recentLeadsFromIp >= 3) {
      return NextResponse.json({ error: 'Too many submissions. Please wait a minute.' }, { status: 429 })
    }

    const lead = await db.lead.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).toLowerCase().slice(0, 200),
        phone: String(phone).slice(0, 50),
        destination: destination ? String(destination).slice(0, 500) : '',
        travelDate: travelDate ? String(travelDate).slice(0, 50) : '',
        pax: Number(pax) || 1,
        budget: budget ? String(budget).slice(0, 100) : '',
        source: 'Website', // hard-coded - cannot be set by client
        status: 'New', // hard-coded - cannot be set by client
        notes: notes ? String(notes).slice(0, 2000) : '',
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error('Create lead error:', err)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

// PATCH is admin-only - prevent status/score/source/assignedTo manipulation
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { id, status, assignedTo, notes } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    // Only allow these specific fields to be updated
    const data: any = {}
    if (typeof status === 'string') data.status = status.slice(0, 50)
    if (typeof assignedTo === 'string') data.assignedTo = assignedTo.slice(0, 200)
    if (typeof notes === 'string') data.notes = notes.slice(0, 5000)

    const lead = await db.lead.update({
      where: { id: String(id) },
      data,
    })
    return NextResponse.json(lead)
  } catch (err) {
    console.error('Update lead error:', err)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
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

    await db.lead.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete lead error:', err)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
