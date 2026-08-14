import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: any = { ...rest }
    if (rest.duration !== undefined) data.duration = Number(rest.duration)
    if (rest.nights !== undefined) data.nights = Number(rest.nights)
    if (rest.price !== undefined) data.price = Number(rest.price)
    if (rest.rating !== undefined) data.rating = Number(rest.rating)
    if (rest.featured !== undefined) data.featured = Boolean(rest.featured)
    if (Array.isArray(rest.highlights)) data.highlights = JSON.stringify(rest.highlights)
    if (Array.isArray(rest.inclusions)) data.inclusions = JSON.stringify(rest.inclusions)
    if (Array.isArray(rest.exclusions)) data.exclusions = JSON.stringify(rest.exclusions)
    if (Array.isArray(rest.itinerary)) data.itinerary = JSON.stringify(rest.itinerary)

    const pkg = await db.package.update({ where: { id: String(id) }, data })
    return NextResponse.json(pkg)
  } catch (err) {
    console.error('Update package error:', err)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
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

    await db.package.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete package error:', err)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
