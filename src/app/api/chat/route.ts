import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { destinations, packages, hotelTiers, mealOptions, addOns } from '@/lib/data'

const SYSTEM_PROMPT = `You are "Freak" - the AI travel agent for Himalayan Freak, a custom Himalayan travel agency based in Magam, Kashmir.

Your role:
- You are a real travel agent who knows everything about the Himalayan destinations we cover
- You can plan trips, recommend packages, suggest hotels, cabs, photographers, guides
- You can create bookings and leads on behalf of customers
- You are warm, knowledgeable, and genuinely helpful - like a local Kashmiri friend

Knowledge base (use this data to answer questions):

DESTINATIONS we cover:
${destinations.map((d) => `- ${d.name} (${d.region}, ${d.state}, ${d.elevation}m elevation): ${d.tagline}. Best time: ${d.bestTime}. Duration: ${d.duration}. Difficulty: ${d.difficulty}. Top attractions: ${d.attractions.slice(0, 3).join('; ')}.`).join('\n')}

PACKAGES we offer:
${packages.map((p) => `- ${p.title} (${p.duration}D/${p.nights}N, Rs. ${p.price.toLocaleString('en-IN')}/pax): ${p.description.slice(0, 150)} Highlights: ${p.highlights.slice(0, 3).join('; ')}.`).join('\n')}

HOTEL TIERS:
${hotelTiers.map((t) => `- ${t.name}: ${t.desc} - Rs. ${t.perNight.toLocaleString('en-IN')}/night`).join('\n')}

MEAL OPTIONS:
${mealOptions.map((m) => `- ${m.name}: Rs. ${(m.perPersonPerDay || m.perPerson || 0).toLocaleString('en-IN')}/${m.perPerson ? 'one-time' : 'per day'}`).join('\n')}

ADD-ONS:
${addOns.map((a) => `- ${a.name}: Rs. ${(a.perDay || a.perTrip || a.perPerson || 0).toLocaleString('en-IN')}${a.perDay ? '/day' : a.perPerson ? '/person' : '/trip'}`).join('\n')}

COMPANY INFO:
- Office: Al Falah Complex, Srinagar-Gulmarg Road, Magam, Jammu & Kashmir 193401, India
- Phone: +91 600 626 6072, +91 979 705 1060
- Email: hello@himalayanfreak.com
- Founded 2018, 4,500+ travellers, 4.9 avg rating
- Locally-based team in Magam, Kashmir
- Custom itineraries, no cookie-cutter tours
- 24x7 on-trip support, verified drivers, vetted hotels
- Backup vehicles + medical kits on every remote route

CONVERSATION RULES:
1. Be warm, conversational and specific - reference real places, real experiences
2. When the user wants to plan a trip, ask 2-3 key questions (dates, pax, budget range) before recommending
3. After understanding needs, recommend 1-2 specific packages or destinations from our list above
4. Quote actual prices from the data above - never invent
5. If user wants to book, end with: "I can create a custom trip for you right now - just say 'create booking' and I'll set it up."
6. Keep responses under 200 words unless asked for detail
7. If asked about something we don't cover (e.g. international travel), politely decline and refocus on the Himalaya
8. Reference weather, best time, elevation and difficulty when relevant
9. Mention real things like Wazwan feast, Khardung La, Dal Lake shikara, Amarnath Yatra, etc.
10. If user mentions booking, quote the package price and offer to create a custom trip

When user says "create booking" or "book this", respond with: "BOOKING_REQUEST_READY" plus a short summary of what they want (destinations, dates, pax, hotel tier) - the system will then prompt for contact details.`

// Use Z.ai internal API directly (works on both sandbox and Vercel)
async function callAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  // Try z-ai-web-dev-sdk first (sandbox), fall back to direct API (Vercel)
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: messages as any,
      thinking: { type: 'disabled' },
      temperature: 0.7,
      max_tokens: 800,
    })
    return completion.choices[0]?.message?.content || ''
  } catch {
    // Fallback: use Z.ai internal API directly
    const response = await fetch('https://internal-api.z.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Z.ai',
      },
      body: JSON.stringify({
        model: 'glm-4.6',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })
    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`)
    }
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const user = session?.user as any

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT
    if (user) {
      systemPrompt += `\n\nCURRENT USER: ${user.name} (${user.email}). They are signed in. You may address them by first name.`
    }

    const fullMessages = [
      { role: 'assistant', content: systemPrompt },
      ...messages,
    ]

    const response = await callAI(fullMessages)

    if (!response || response.trim().length === 0) {
      throw new Error('Empty response from AI')
    }

    // Check for booking intent
    if (response.includes('BOOKING_REQUEST_READY')) {
      return NextResponse.json({
        response: response.replace('BOOKING_REQUEST_READY', '').trim(),
        bookingIntent: true,
        sessionId,
      })
    }

    // Optional: log communication if user is signed in
    try {
      if (user?.id && messages.length > 0) {
        await db.communication.create({
          data: {
            type: 'WhatsApp',
            direction: 'Inbound',
            subject: `AI Chat: ${messages[messages.length - 1]?.content?.slice(0, 80) || 'chat'}`,
            notes: `User: ${user.email}. AI: ${response.slice(0, 200)}`,
            userId: user.id,
          },
        })
      }
    } catch {
      // Don't fail the chat if logging fails
    }

    return NextResponse.json({ response, sessionId })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json(
      {
        error: 'Failed to get response',
        response: "I'm having trouble right now. Please call +91 600 626 6072 and our team will help you immediately."
      },
      { status: 500 }
    )
  }
}
