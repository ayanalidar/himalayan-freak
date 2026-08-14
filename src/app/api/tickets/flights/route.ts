import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const origin = searchParams.get('origin') || ''
  const dest = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''

  // Origin/Dest can be city name or airport code
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
  const seasonalMul = 1 + (Math.max(0, dayOffset) % 7) * 0.04 // up to +24%
  const decorated = flights.map((f) => ({
    ...f,
    finalPrice: Math.round(f.price * seasonalMul),
    dateLabel: date || new Date().toISOString().slice(0, 10),
  }))
  return NextResponse.json(decorated)
}
