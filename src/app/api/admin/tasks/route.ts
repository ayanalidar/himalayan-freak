import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns all tasks with lead info)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const tasks = await db.task.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { lead: true, assignee: { select: { id: true, name: true, email: true } } },
    })
    return NextResponse.json(tasks)
  } catch (err) {
    console.error('Fetch tasks error:', err)
    return NextResponse.json([])
  }
}

// POST is admin-only (tasks are CRM-internal)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const t = await db.task.create({
      data: {
        title: String(body.title || '').slice(0, 500),
        description: body.description ? String(body.description).slice(0, 2000) : null,
        dueDate: body.dueDate ? String(body.dueDate).slice(0, 50) : null,
        priority: ['Low', 'Medium', 'High', 'Urgent'].includes(body.priority) ? body.priority : 'Medium',
        status: ['Pending', 'InProgress', 'Done'].includes(body.status) ? body.status : 'Pending',
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

// PATCH is admin-only with strict allowlist
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const { id, title, description, dueDate, priority, status, assigneeId, leadId, customerId } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const data: any = {}
    if (typeof title === 'string') data.title = title.slice(0, 500)
    if (typeof description === 'string') data.description = description.slice(0, 2000)
    if (typeof dueDate === 'string') data.dueDate = dueDate.slice(0, 50)
    if (typeof priority === 'string' && ['Low', 'Medium', 'High', 'Urgent'].includes(priority)) data.priority = priority
    if (typeof status === 'string' && ['Pending', 'InProgress', 'Done'].includes(status)) data.status = status
    if (typeof assigneeId === 'string') data.assigneeId = assigneeId
    if (typeof leadId === 'string') data.leadId = leadId
    if (typeof customerId === 'string') data.customerId = customerId

    const t = await db.task.update({ where: { id: String(id) }, data })
    return NextResponse.json(t)
  } catch (err) {
    console.error('Update task error:', err)
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
    await db.task.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete task error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
