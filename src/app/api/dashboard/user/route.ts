import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  }
  const userId = (session.user as any).id

  const [bookings, customTrips, savedDestinations, reviews, documents] = await Promise.all([
    db.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    db.customTrip.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    db.savedDestination.findMany({
      where: { userId },
      include: { destination: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.review.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    db.document.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
  ])

  const totalSpent = bookings.reduce((s, b) => s + b.amount, 0)
  const upcomingTrips = bookings.filter(
    (b) => b.status === 'Confirmed' && new Date(b.startDate) > new Date()
  )

  return NextResponse.json({
    user: session.user,
    stats: {
      totalBookings: bookings.length,
      upcomingTrips: upcomingTrips.length,
      customTrips: customTrips.length,
      savedDestinations: savedDestinations.length,
      reviews: reviews.length,
      documents: documents.length,
      totalSpent,
    },
    bookings,
    customTrips,
    savedDestinations,
    reviews,
    documents,
  })
}
