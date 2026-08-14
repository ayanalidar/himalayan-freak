import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns all team members including inactive)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  const team = await db.teamMember.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json(team)
}

// POST is admin-only
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const member = await db.teamMember.create({
      data: {
        name: String(body.name || '').slice(0, 200),
        role: String(body.role || '').slice(0, 200),
        bio: String(body.bio || '').slice(0, 2000),
        avatar: body.avatar ? String(body.avatar).slice(0, 500) : '',
        order: Number(body.order) || 0,
        active: body.active !== false,
      },
    })
    return NextResponse.json(member, { status: 201 })
  } catch (err) {
    console.error('Create team member error:', err)
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
    if (typeof rest.name === 'string') data.name = rest.name.slice(0, 200)
    if (typeof rest.role === 'string') data.role = rest.role.slice(0, 200)
    if (typeof rest.bio === 'string') data.bio = rest.bio.slice(0, 2000)
    if (typeof rest.avatar === 'string') data.avatar = rest.avatar.slice(0, 500)
    if (rest.order !== undefined && !isNaN(Number(rest.order))) data.order = Number(rest.order)
    if (typeof rest.active === 'boolean') data.active = rest.active

    const member = await db.teamMember.update({ where: { id: String(id) }, data })
    return NextResponse.json(member)
  } catch (err) {
    console.error('Update team member error:', err)
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
    await db.teamMember.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete team member error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
