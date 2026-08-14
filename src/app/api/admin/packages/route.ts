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
  const pkgs = await db.package.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(pkgs)
}

// POST is admin-only with strict allowlist
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: 'slug, title required' }, { status: 400 })
    }
    const pkg = await db.package.create({
      data: {
        slug: String(body.slug).slice(0, 100),
        title: String(body.title).slice(0, 200),
        region: body.region ? String(body.region).slice(0, 50) : 'Kashmir',
        duration: Number(body.duration) || 5,
        nights: Number(body.nights) || 4,
        price: Number(body.price) || 0,
        description: body.description ? String(body.description).slice(0, 5000) : '',
        highlights: JSON.stringify(Array.isArray(body.highlights) ? body.highlights.filter((h: any) => typeof h === 'string') : []),
        inclusions: JSON.stringify(Array.isArray(body.inclusions) ? body.inclusions.filter((i: any) => typeof i === 'string') : []),
        exclusions: JSON.stringify(Array.isArray(body.exclusions) ? body.exclusions.filter((e: any) => typeof e === 'string') : []),
        itinerary: JSON.stringify(Array.isArray(body.itinerary) ? body.itinerary : []),
        heroImage: body.heroImage ? String(body.heroImage).slice(0, 500) : '',
        rating: Math.min(5, Math.max(0, Number(body.rating) || 4.6)),
        featured: Boolean(body.featured),
      },
    })
    return NextResponse.json(pkg, { status: 201 })
  } catch (err) {
    console.error('Create package error:', err)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
