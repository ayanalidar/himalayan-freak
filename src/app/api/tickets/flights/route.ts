import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { searchAmadeusFlights, isAmadeusConfigured } from '@/lib/realtime-tickets'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = searchParams.get('origin') || ''
  const dest = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''
  const pax = Number(searchParams.get('pax') || 1)

  // 1. Try real-time Amadeus if configured
  if (isAmadeusConfigured() && origin && dest && date) {
    // Origin/Dest can be city or airport code - Amadeus needs IATA codes
    // For demo, we pass the value through; user should enter IATA codes when using Amadeus
    const realFlights = await searchAmadeusFlights(origin, dest, date, pax)
    if (realFlights && realFlights.length > 0) {
      return NextResponse.json({
        source: 'amadeus-live',
        flights: realFlights,
        configured: true,
      })
    }
  }

  // 2. Fall back to seeded real-airline data in DB
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

  const flights = await db.airTicket.findMany({ where })

  // Vary price by date for "real-feeling" dynamics
  const dayOffset = date ? Math.floor((new Date(date).getTime() - Date.now()) / 86400000) : 0
  const seasonalMul = 1 + (Math.max(0, dayOffset) % 7) * 0.04
  const decorated = flights.map((f) => ({
    ...f,
    finalPrice: Math.round(f.price * seasonalMul),
    dateLabel: date || new Date().toISOString().slice(0, 10),
    source: 'seeded',
  }))

  return NextResponse.json({
    source: isAmadeusConfigured() ? 'amadeus-fallback' : 'seeded',
    flights: decorated,
    configured: isAmadeusConfigured(),
  })
}
