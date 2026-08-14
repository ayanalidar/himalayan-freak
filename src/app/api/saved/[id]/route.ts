import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  try {
    const item = await db.savedDestination.findUnique({ where: { id: params.id } })
    if (!item || item.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    await db.savedDestination.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
