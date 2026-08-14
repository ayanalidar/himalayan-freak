import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET is admin-only (returns PII: amounts, payment status, customer notes)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    return NextResponse.json(bookings)
  } catch (err) {
    console.error('Fetch bookings error:', err)
    return NextResponse.json([])
  }
}
