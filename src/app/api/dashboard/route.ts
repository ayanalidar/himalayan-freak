import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [leads, customers, trips, bookings] = await Promise.all([
      db.lead.findMany(),
      db.customer.findMany(),
      db.customTrip.findMany(),
      db.booking.findMany(),
    ])

    const leadsByStage = leads.reduce<Record<string, number>>((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1
      return acc
    }, {})

    const revenueWon = bookings
      .filter((b) => b.status === 'Completed' || b.status === 'Confirmed')
      .reduce((sum, b) => sum + b.amount, 0)

    const pipelineValue = leads
      .filter((l) => l.status !== 'Won' && l.status !== 'Lost')
      .reduce((sum, l) => {
        const m = l.budget?.match(/₹([\d,]+)/)
        return sum + (m ? Number(m[1].replace(/,/g, '')) : 0)
      }, 0)

    // Source breakdown
    const bySource = leads.reduce<Record<string, number>>((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1
      return acc
    }, {})

    // Last 6 months bookings trend
    const now = new Date()
    const months: { month: string; revenue: number; leads: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short' })
      const monthBookings = bookings.filter((b) => {
        const bd = new Date(b.createdAt)
        return bd >= d && bd < next
      })
      const monthLeads = leads.filter((l) => {
        const ld = new Date(l.createdAt)
        return ld >= d && ld < next
      })
      months.push({
        month: monthLabel,
        revenue: monthBookings.reduce((s, b) => s + b.amount, 0),
        leads: monthLeads.length,
      })
    }

    return NextResponse.json({
      totals: {
        leads: leads.length,
        customers: customers.length,
        trips: trips.length,
        bookings: bookings.length,
        revenueWon,
        pipelineValue,
        wonLeads: leads.filter((l) => l.status === 'Won').length,
        activeTrips: bookings.filter(
          (b) => b.status === 'Confirmed' || b.status === 'InProgress'
        ).length,
      },
      leadsByStage,
      bySource,
      months,
      recentLeads: leads.slice(0, 6),
      recentTrips: trips.slice(0, 6),
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return NextResponse.json({
      totals: {
        leads: 0,
        customers: 0,
        trips: 0,
        bookings: 0,
        revenueWon: 0,
        pipelineValue: 0,
        wonLeads: 0,
        activeTrips: 0,
      },
      leadsByStage: {},
      bySource: {},
      months: [],
      recentLeads: [],
      recentTrips: [],
    })
  }
}
