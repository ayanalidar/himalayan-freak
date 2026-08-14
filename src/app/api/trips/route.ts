import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      destinations,
      startDate,
      duration,
      pax,
      hotelTier,
      meals,
      addOns,
      estimatedPrice,
    } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    const refCode = 'HF' + Math.random().toString(36).slice(2, 8).toUpperCase()

    const trip = await db.customTrip.create({
      data: {
        name,
        email,
        phone,
        destinations: JSON.stringify(destinations || []),
        startDate: startDate || '',
        duration: Number(duration) || 5,
        pax: Number(pax) || 2,
        hotelTier: hotelTier || 'standard',
        meals: JSON.stringify(meals || []),
        addOns: JSON.stringify(addOns || []),
        estimatedPrice: Number(estimatedPrice) || 0,
        status: 'Submitted',
        notes: 'Submitted via Trip Planner',
      },
    })

    // Also create a Lead so it shows up in CRM pipeline
    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        destination: Array.isArray(destinations) ? destinations.join(', ') : '',
        travelDate: startDate || '',
        pax: Number(pax) || 2,
        budget: `~₹${Number(estimatedPrice || 0).toLocaleString('en-IN')}`,
        source: 'Trip Planner',
        status: 'New',
        notes: `Auto-created from Trip Planner. Ref: ${refCode}. Duration: ${duration}D, Hotel: ${hotelTier}.`,
      },
    })

    return NextResponse.json({
      refCode,
      tripId: trip.id,
      leadId: lead.id,
      message: 'Trip submitted successfully',
    })
  } catch (err) {
    console.error('Trip submission error:', err)
    return NextResponse.json(
      { error: 'Failed to submit trip. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const trips = await db.customTrip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json(trips)
  } catch (err) {
    console.error('Fetch trips error:', err)
    return NextResponse.json([], { status: 200 })
  }
}
