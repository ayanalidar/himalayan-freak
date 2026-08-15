import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns raw records)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  const contents = await db.siteContent.findMany({ orderBy: { page: 'asc' } })
  return NextResponse.json(contents)
}

// PUT is admin-only - upserts a page+section's data
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const { page, section, data } = await req.json()
    if (!page || !section) {
      return NextResponse.json({ error: 'page and section required' }, { status: 400 })
    }

    const jsonData = typeof data === 'string' ? data : JSON.stringify(data)

    const content = await db.siteContent.upsert({
      where: { page_section: { page: String(page), section: String(section) } },
      update: { data: jsonData },
      create: { page: String(page), section: String(section), data: jsonData },
    })

    return NextResponse.json(content)
  } catch (err) {
    console.error('Update site content error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
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
    await db.siteContent.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
