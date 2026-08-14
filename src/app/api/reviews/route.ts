import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const destinationId = searchParams.get('destinationId')
  const approved = searchParams.get('approved') === 'true'
  const where: any = {}
  if (destinationId) where.destinationId = destinationId
  if (approved) where.approved = true

  const reviews = await db.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const body = await req.json()
    const r = await db.review.create({
      data: {
        userId: (session.user as any).id,
        destinationId: body.destinationId || null,
        packageSlug: body.packageSlug || null,
        rating: Number(body.rating) || 5,
        title: body.title || '',
        body: body.body || '',
        approved: false,
      },
    })
    return NextResponse.json(r, { status: 201 })
  } catch (err) {
    console.error('Create review error:', err)
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
    const { id, approved } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const r = await db.review.update({ where: { id: String(id) }, data: { approved } })
    return NextResponse.json(r)
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
