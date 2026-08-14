import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Public GET for approved reviews - NEVER include passwordHash
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const destinationId = searchParams.get('destinationId')
    const approvedOnly = searchParams.get('approved') === 'true'

    const where: any = {}
    if (destinationId) where.destinationId = destinationId
    if (approvedOnly) where.approved = true

    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      // Only expose safe fields - NEVER passwordHash
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    })
    return NextResponse.json(reviews)
  } catch (err) {
    console.error('Fetch reviews error:', err)
    return NextResponse.json([])
  }
}

// POST is auth-required (any logged-in user can submit a review)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const body = await req.json()
    const r = await db.review.create({
      data: {
        userId: (session.user as any).id,
        destinationId: body.destinationId || null,
        packageSlug: body.packageSlug ? String(body.packageSlug).slice(0, 100) : null,
        rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
        title: String(body.title || '').slice(0, 200),
        body: String(body.body || '').slice(0, 5000),
        approved: false, // requires admin approval
      },
    })
    return NextResponse.json(r, { status: 201 })
  } catch (err) {
    console.error('Create review error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// PATCH is admin-only (for approving/rejecting reviews)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { id, approved } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const r = await db.review.update({
      where: { id: String(id) },
      data: { approved: Boolean(approved) },
    })
    return NextResponse.json(r)
  } catch (err) {
    console.error('Update review error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
