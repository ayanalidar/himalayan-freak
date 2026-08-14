import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const pkgs = await db.package.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(pkgs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const {
      slug, title, region, duration, nights, price, description,
      highlights, inclusions, exclusions, itinerary, heroImage, rating, featured,
    } = body
    if (!slug || !title) return NextResponse.json({ error: 'slug, title required' }, { status: 400 })

    const pkg = await db.package.create({
      data: {
        slug,
        title,
        region: region || 'Kashmir',
        duration: Number(duration) || 5,
        nights: Number(nights) || 4,
        price: Number(price) || 0,
        description: description || '',
        highlights: JSON.stringify(highlights || []),
        inclusions: JSON.stringify(inclusions || []),
        exclusions: JSON.stringify(exclusions || []),
        itinerary: JSON.stringify(itinerary || []),
        heroImage: heroImage || '',
        rating: Number(rating) || 4.6,
        featured: Boolean(featured),
      },
    })
    return NextResponse.json(pkg, { status: 201 })
  } catch (err) {
    console.error('Create package error:', err)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
