import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

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

    // Strict allowlist of updatable fields
    const data: any = {}
    const allowedStringFields = ['slug', 'title', 'region', 'description', 'heroImage']
    for (const f of allowedStringFields) {
      if (typeof rest[f] === 'string') data[f] = rest[f]
    }
    if (rest.duration !== undefined && !isNaN(Number(rest.duration))) data.duration = Number(rest.duration)
    if (rest.nights !== undefined && !isNaN(Number(rest.nights))) data.nights = Number(rest.nights)
    if (rest.price !== undefined && !isNaN(Number(rest.price))) data.price = Number(rest.price)
    if (rest.rating !== undefined && !isNaN(Number(rest.rating))) data.rating = Math.min(5, Math.max(0, Number(rest.rating)))
    if (typeof rest.featured === 'boolean') data.featured = rest.featured
    if (Array.isArray(rest.highlights)) data.highlights = JSON.stringify(rest.highlights.filter((h: any) => typeof h === 'string'))
    if (Array.isArray(rest.inclusions)) data.inclusions = JSON.stringify(rest.inclusions.filter((i: any) => typeof i === 'string'))
    if (Array.isArray(rest.exclusions)) data.exclusions = JSON.stringify(rest.exclusions.filter((e: any) => typeof e === 'string'))
    if (Array.isArray(rest.itinerary)) data.itinerary = JSON.stringify(rest.itinerary)

    const pkg = await db.package.update({ where: { id: String(id) }, data })
    return NextResponse.json(pkg)
  } catch (err) {
    console.error('Update package error:', err)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
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
    await db.package.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete package error:', err)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
