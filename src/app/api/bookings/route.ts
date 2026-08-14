import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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
