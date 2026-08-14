import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, chatHistory } = await req.json()
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'name, email, phone required' }, { status: 400 })
    }

    const refCode = 'AI' + Math.random().toString(36).slice(2, 8).toUpperCase()

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        destination: 'To be extracted from chat',
        source: 'AI Chatbot',
        status: 'New',
        notes: `AI-generated booking request. Ref: ${refCode}. Chat history:\n${(chatHistory || '').slice(0, 1500)}`,
      },
    })

    return NextResponse.json({
      refCode,
      leadId: lead.id,
      message: 'Booking request created from AI chat',
    })
  } catch (err) {
    console.error('AI booking error:', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
