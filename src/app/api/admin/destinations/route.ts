import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (E-3 fix - was missing auth check)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  const destinations = await db.destination.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(destinations)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const {
      slug, name, region, state, elevation, latitude, longitude,
      tagline, description, bestTime, duration, difficulty, rating,
      heroImage, gallery, attractions, activities, howToReach, featured,
    } = body

    if (!slug || !name || !region) {
      return NextResponse.json({ error: 'slug, name, region required' }, { status: 400 })
    }

    const dest = await db.destination.create({
      data: {
        slug,
        name,
        region,
        state: state || '',
        elevation: Number(elevation) || 0,
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
        tagline: tagline || '',
        description: description || '',
        bestTime: bestTime || '',
        duration: duration || '',
        difficulty: difficulty || 'Easy',
        rating: Number(rating) || 4.5,
        heroImage: heroImage || '',
        gallery: JSON.stringify(gallery || []),
        attractions: JSON.stringify(attractions || []),
        activities: JSON.stringify(activities || []),
        howToReach: howToReach || '',
        featured: Boolean(featured),
      },
    })
    return NextResponse.json(dest, { status: 201 })
  } catch (err) {
    console.error('Create destination error:', err)
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 })
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

    // Strict allowlist of updatable fields (prevents mass-assignment)
    const data: any = {}
    const allowedStringFields = ['slug', 'name', 'region', 'state', 'tagline', 'description', 'bestTime', 'duration', 'difficulty', 'heroImage', 'howToReach']
    for (const f of allowedStringFields) {
      if (typeof rest[f] === 'string') data[f] = rest[f]
    }
    if (rest.elevation !== undefined && !isNaN(Number(rest.elevation))) data.elevation = Number(rest.elevation)
    if (rest.latitude !== undefined && !isNaN(Number(rest.latitude))) data.latitude = Number(rest.latitude)
    if (rest.longitude !== undefined && !isNaN(Number(rest.longitude))) data.longitude = Number(rest.longitude)
    if (rest.rating !== undefined && !isNaN(Number(rest.rating))) data.rating = Math.min(5, Math.max(0, Number(rest.rating)))
    if (typeof rest.featured === 'boolean') data.featured = rest.featured
    if (Array.isArray(rest.gallery)) data.gallery = JSON.stringify(rest.gallery.filter((g: any) => typeof g === 'string'))
    if (Array.isArray(rest.attractions)) data.attractions = JSON.stringify(rest.attractions.filter((a: any) => typeof a === 'string'))
    if (Array.isArray(rest.activities)) data.activities = JSON.stringify(rest.activities.filter((a: any) => typeof a === 'string'))

    const dest = await db.destination.update({ where: { id: String(id) }, data })
    return NextResponse.json(dest)
  } catch (err) {
    console.error('Update destination error:', err)
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

// DELETE is admin-only (moved here from [id]/route.ts - E-2 fix)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await db.destination.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete destination error:', err)
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 })
  }
}
