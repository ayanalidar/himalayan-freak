import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const tasks = await db.task.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { lead: true, assignee: true },
  })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const body = await req.json()
    const t = await db.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        dueDate: body.dueDate || null,
        priority: body.priority || 'Medium',
        status: body.status || 'Pending',
        assigneeId: body.assigneeId || session.user.id,
        leadId: body.leadId || null,
        customerId: body.customerId || null,
      },
    })
    return NextResponse.json(t, { status: 201 })
  } catch (err) {
    console.error('Create task error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const t = await db.task.update({ where: { id: String(id) }, data: rest })
    return NextResponse.json(t)
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await db.task.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
