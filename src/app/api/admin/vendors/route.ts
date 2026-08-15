import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  const vendors = await db.vendor.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(vendors)
}

// POST is admin-only with strict allowlist
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const v = await db.vendor.create({
      data: {
        name: String(body.name || '').slice(0, 200),
        type: ['Hotel', 'Homestay', 'Driver', 'Guide', 'Photographer', 'Cab'].includes(body.type) ? body.type : 'Hotel',
        category: ['Budget', 'Standard', 'Premium', 'Luxury'].includes(body.category) ? body.category : 'Standard',
        location: body.location ? String(body.location).slice(0, 200) : '',
        phone: body.phone ? String(body.phone).slice(0, 50) : '',
        email: body.email ? String(body.email).slice(0, 200) : null,
        rating: Math.min(5, Math.max(0, Number(body.rating) || 4.5)),
        pricePerDay: body.pricePerDay ? Number(body.pricePerDay) : null,
        notes: body.notes ? String(body.notes).slice(0, 2000) : null,
        active: body.active !== false,
      },
    })
    return NextResponse.json(v, { status: 201 })
  } catch (err) {
    console.error('Create vendor error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
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
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: any = {}
    const allowedStringFields = ['name', 'location', 'phone', 'email', 'notes']
    for (const f of allowedStringFields) {
      if (typeof rest[f] === 'string') data[f] = rest[f]
    }
    if (['Hotel', 'Homestay', 'Driver', 'Guide', 'Photographer', 'Cab'].includes(rest.type)) data.type = rest.type
    if (['Budget', 'Standard', 'Premium', 'Luxury'].includes(rest.category)) data.category = rest.category
    if (rest.rating !== undefined && !isNaN(Number(rest.rating))) data.rating = Math.min(5, Math.max(0, Number(rest.rating)))
    if (rest.pricePerDay !== undefined && !isNaN(Number(rest.pricePerDay))) data.pricePerDay = Number(rest.pricePerDay)
    if (typeof rest.active === 'boolean') data.active = rest.active

    const v = await db.vendor.update({ where: { id: String(id) }, data })
    return NextResponse.json(v)
  } catch (err) {
    console.error('Update vendor error:', err)
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
    await db.vendor.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete vendor error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
