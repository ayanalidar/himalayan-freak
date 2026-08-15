import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      organizerName,
      organizerEmail,
      organizerPhone,
      organization,
      organizationType,
      destinations,
      startDate,
      duration,
      pax,
      budgetPerPerson,
      budgetTotal,
      roomSharing,
      mealPreference,
      specialMeals,
      photographer,
      guide,
      medical,
      pickupRequired,
      roomMates,
      notes,
    } = body

    if (!organizerName || !organizerEmail || !organizerPhone) {
      return NextResponse.json({ error: 'Organizer details required' }, { status: 400 })
    }
    if (!destinations || destinations.length === 0) {
      return NextResponse.json({ error: 'At least one destination required' }, { status: 400 })
    }
    if (!pax || pax < 10) {
      return NextResponse.json({ error: 'Minimum 10 travellers required for group booking' }, { status: 400 })
    }

    const refCode = 'GB' + Math.random().toString(36).slice(2, 8).toUpperCase()

    // Create a Lead for the group booking
    const lead = await db.lead.create({
      data: {
        name: organizerName,
        email: organizerEmail,
        phone: organizerPhone,
        destination: destinations.join(', '),
        travelDate: startDate || '',
        pax: Number(pax),
        budget: `~₹${Number(budgetTotal).toLocaleString('en-IN')} (${Number(budgetPerPerson).toLocaleString('en-IN')}/pax)`,
        source: 'Group Booking',
        status: 'New',
        notes: `GROUP BOOKING - Ref ${refCode}
Organization: ${organization || 'Personal'}
Group type: ${organizationType}
Duration: ${duration}D
Room sharing: ${roomSharing}
Meals: ${mealPreference} | Special: ${specialMeals || 'None'}
Add-ons: ${[
          photographer ? 'Photographer' : '',
          guide ? 'Guide' : '',
          medical ? 'Medical' : '',
          pickupRequired ? 'Airport pickup' : '',
        ].filter(Boolean).join(', ') || 'None'}
Roster: ${roomMates?.length || 0} of ${pax} travellers added
Notes: ${notes || 'None'}`,
      },
    })

    return NextResponse.json({
      refCode,
      leadId: lead.id,
      message: 'Group booking submitted successfully',
    })
  } catch (err) {
    console.error('Group booking error:', err)
    return NextResponse.json({ error: 'Failed to submit group booking' }, { status: 500 })
  }
}
