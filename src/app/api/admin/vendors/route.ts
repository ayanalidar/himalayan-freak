import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const vendors = await db.vendor.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(vendors)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const v = await db.vendor.create({
      data: {
        name: body.name,
        type: body.type || 'Hotel',
        category: body.category || 'Standard',
        location: body.location || '',
        phone: body.phone || '',
        email: body.email || null,
        rating: Number(body.rating) || 4.5,
        pricePerDay: body.pricePerDay ? Number(body.pricePerDay) : null,
        notes: body.notes || null,
        active: body.active !== false,
      },
    })
    return NextResponse.json(v, { status: 201 })
  } catch (err) {
    console.error('Create vendor error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const v = await db.vendor.update({ where: { id: String(id) }, data: rest })
    return NextResponse.json(v)
  } catch (err) {
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
    await db.vendor.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
