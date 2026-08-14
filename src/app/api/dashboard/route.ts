import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const [leads, customers, trips, bookings, vendors, tasks] = await Promise.all([
    db.lead.findMany(),
    db.customer.findMany(),
    db.customTrip.findMany(),
    db.booking.findMany(),
    db.vendor.findMany(),
    db.task.findMany(),
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

  const bySource = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1
    return acc
  }, {})

  // Vendor type breakdown
  const vendorsByType = vendors.reduce<Record<string, number>>((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1
    return acc
  }, {})

  // Task stats
  const openTasks = tasks.filter((t) => t.status !== 'Done').length
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()
  ).length

  // Lead score distribution
  const highValueLeads = leads.filter((l) => l.score >= 70).length
  const avgLeadScore = leads.length > 0
    ? Math.round(leads.reduce((s, l) => s + (l.score || 0), 0) / leads.length)
    : 0

  // Conversion rate
  const conversionRate = leads.length > 0
    ? Math.round((leads.filter((l) => l.status === 'Won').length / leads.length) * 100)
    : 0

  // Revenue forecast (next 3 months based on confirmed bookings)
  const now = new Date()
  const threeMonthsAhead = new Date(now.getFullYear(), now.getMonth() + 3, 1)
  const forecast = bookings
    .filter((b) => {
      const bd = new Date(b.startDate)
      return bd >= now && bd <= threeMonthsAhead && b.status !== 'Cancelled'
    })
    .reduce((sum, b) => sum + b.amount, 0)

  // Monthly trend (6 months)
  const months: { month: string; revenue: number; leads: number; bookings: number }[] = []
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
      bookings: monthBookings.length,
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
      vendors: vendors.length,
      openTasks,
      overdueTasks,
      highValueLeads,
      avgLeadScore,
      conversionRate,
      forecast,
    },
    leadsByStage,
    bySource,
    vendorsByType,
    months,
    recentLeads: leads.slice(0, 6),
    recentTrips: trips.slice(0, 6),
    upcomingTasks: tasks.filter((t) => t.status !== 'Done').slice(0, 6),
  })
}
