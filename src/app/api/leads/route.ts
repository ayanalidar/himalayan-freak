import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      destination,
      travelDate,
      pax,
      budget,
      source,
      status,
      notes,
      assignedTo,
    } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        destination: destination || '',
        travelDate: travelDate || '',
        pax: Number(pax) || 1,
        budget: budget || '',
        source: source || 'Website',
        status: status || 'New',
        notes: notes || '',
        assignedTo: assignedTo || null,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error('Create lead error:', err)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, assignedTo, notes, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const lead = await db.lead.update({
      where: { id: String(id) },
      data: {
        ...(status && { status }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(notes !== undefined && { notes }),
        ...rest,
      },
    })

    return NextResponse.json(lead)
  } catch (err) {
    console.error('Update lead error:', err)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
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
