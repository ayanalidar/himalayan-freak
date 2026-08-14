import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns PII)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    return NextResponse.json(customers)
  } catch (err) {
    console.error('Fetch customers error:', err)
    return NextResponse.json([])
  }
}

// POST is admin-only (customers are created internally, not by public)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { name, email, phone, city, state, type, tags, notes } = body
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    const customer = await db.customer.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).toLowerCase().slice(0, 200),
        phone: String(phone).slice(0, 50),
        city: city ? String(city).slice(0, 200) : '',
        state: state ? String(state).slice(0, 200) : '',
        type: type ? String(type).slice(0, 50) : 'Individual',
        tags: tags ? JSON.stringify(tags).slice(0, 2000) : null,
        notes: notes ? String(notes).slice(0, 2000) : '',
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (err) {
    console.error('Create customer error:', err)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

// PATCH is admin-only with strict allowlist
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { id, name, email, phone, city, state, type, tags, notes, totalTrips, totalSpent } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: any = {}
    if (typeof name === 'string') data.name = name.slice(0, 200)
    if (typeof email === 'string') data.email = email.toLowerCase().slice(0, 200)
    if (typeof phone === 'string') data.phone = phone.slice(0, 50)
    if (typeof city === 'string') data.city = city.slice(0, 200)
    if (typeof state === 'string') data.state = state.slice(0, 200)
    if (typeof type === 'string') data.type = type.slice(0, 50)
    if (typeof tags === 'string') data.tags = tags.slice(0, 2000)
    if (typeof notes === 'string') data.notes = notes.slice(0, 2000)
    if (typeof totalTrips === 'number') data.totalTrips = totalTrips
    if (typeof totalSpent === 'number') data.totalSpent = totalSpent

    const customer = await db.customer.update({
      where: { id: String(id) },
      data,
    })
    return NextResponse.json(customer)
  } catch (err) {
    console.error('Update customer error:', err)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
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

    await db.customer.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete customer error:', err)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
