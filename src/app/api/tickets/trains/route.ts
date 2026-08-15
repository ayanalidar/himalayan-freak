import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { searchRailwayTrains, isRailwayApiConfigured } from '@/lib/realtime-tickets'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = searchParams.get('origin') || ''
  const dest = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''

  // 1. Try real-time RailwayAPI if configured
  if (isRailwayApiConfigured() && origin && dest) {
    const realTrains = await searchRailwayTrains(origin, dest, date)
    if (realTrains && realTrains.length > 0) {
      return NextResponse.json({
        source: 'railwayapi-live',
        trains: realTrains,
        configured: true,
      })
    }
  }

  // 2. Fall back to seeded real-train data
  const where: any = {}
  if (origin) {
    where.OR = [
      { origin: { contains: origin } },
      { originCode: { contains: origin.toUpperCase() } },
    ]
  }
  if (dest) {
    const destFilter = {
      OR: [
        { destination: { contains: dest } },
        { destCode: { contains: dest.toUpperCase() } },
      ]
    }
    where.AND = where.AND ? [...where.AND, destFilter] : [destFilter]
  }

  const trains = await db.trainTicket.findMany({ where })
  const day = date ? new Date(date).getDay() : new Date().getDay()

  const decorated = trains
    .map((t) => {
      const runsOn: number[] = JSON.parse(t.runsOn)
      const runsToday = runsOn.includes(day)
      const classes = JSON.parse(t.classes).map((c: any) => ({
        ...c,
        available: c.available,
      }))
      const dateOffset = date ? Math.floor((new Date(date).getTime() - Date.now()) / 86400000) : 0
      const variation = 1 + (Math.max(0, dateOffset) % 5) * 0.03
      const adjustedClasses = classes.map((c: any) => ({
        ...c,
        price: Math.round(c.price * variation),
      }))
      return {
        ...t,
        classes: adjustedClasses,
        runsOn,
        runsToday,
        dateLabel: date || new Date().toISOString().slice(0, 10),
        source: 'seeded',
      }
    })
    .filter((t) => t.runsToday || date === '')

  return NextResponse.json({
    source: isRailwayApiConfigured() ? 'railwayapi-fallback' : 'seeded',
    trains: decorated,
    configured: isRailwayApiConfigured(),
  })
}
