import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { db } from '@/lib/db'
import { destinations, packages, hotelTiers, mealOptions, addOns } from '@/lib/data'

// Helper: convert "#hex" to rgb()
function hexToRgb(hex: string) {
  const m = hex.replace('#', '').match(/.{2}/g)
  if (!m) return rgb(0.2, 0.2, 0.2)
  return rgb(
    parseInt(m[0], 16) / 255,
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255
  )
}

// Color palette (Himalayan Freak brand)
const COLORS = {
  saffron: hexToRgb('#f59e0b'),
  darkSlate: hexToRgb('#1e293b'),
  slate: hexToRgb('#475569'),
  lightBg: hexToRgb('#f8fafc'),
  amber: hexToRgb('#fbbf24'),
  white: rgb(1, 1, 1),
  border: hexToRgb('#e2e8f0'),
  emerald: hexToRgb('#10b981'),
  rose: hexToRgb('#f43f5e'),
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      tripId,
      // Or direct trip data
      name,
      email,
      phone,
      destinationSlugs = [],
      startDate,
      duration,
      pax,
      hotelTier,
      meals = [],
      addOnIds = [],
      estimatedPrice,
      refCode,
    } = body

    let tripData: any = body

    // If tripId provided, fetch from DB
    if (tripId) {
      const trip = await db.customTrip.findUnique({ where: { id: tripId } })
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
      }
      tripData = {
        name: trip.name,
        email: trip.email,
        phone: trip.phone,
        destinationSlugs: JSON.parse(trip.destinations || '[]'),
        startDate: trip.startDate,
        duration: trip.duration,
        pax: trip.pax,
        hotelTier: trip.hotelTier,
        meals: JSON.parse(trip.meals || '[]'),
        addOnIds: JSON.parse(trip.addOns || '[]'),
        estimatedPrice: trip.estimatedPrice,
        refCode: 'HF' + trip.id.slice(-6).toUpperCase(),
      }
    }

    // Build PDF
    const pdfDoc = await PDFDocument.create()
    pdfDoc.setTitle(`Himalayan Freak Itinerary - ${tripData.refCode || tripData.name}`)
    pdfDoc.setAuthor('Himalayan Freak')
    pdfDoc.setSubject('Custom Travel Itinerary')
    pdfDoc.setCreator('Himalayan Freak Trip Planner')
    pdfDoc.setProducer('Himalayan Freak')

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

    // A4 page
    const PAGE_W = 595.28
    const PAGE_H = 841.89
    const MARGIN = 50

    // === COVER PAGE ===
    const cover = pdfDoc.addPage([PAGE_W, PAGE_H])
    // Background gradient effect (simulated with rectangles)
    cover.drawRectangle({
      x: 0, y: 0, width: PAGE_W, height: PAGE_H,
      color: COLORS.darkSlate,
    })
    cover.drawRectangle({
      x: 0, y: 0, width: PAGE_W, height: PAGE_H * 0.3,
      color: COLORS.saffron,
      opacity: 0.3,
    })

    // Brand header
    cover.drawText('HIMALAYAN FREAK', {
      x: MARGIN, y: PAGE_H - 80,
      size: 24, font: fontBold, color: COLORS.amber,
    })
    cover.drawText('Custom Himalayan Journeys', {
      x: MARGIN, y: PAGE_H - 100,
      size: 10, font: fontOblique, color: COLORS.white,
    })

    // Title block
    cover.drawText('YOUR CUSTOM', {
      x: MARGIN, y: PAGE_H * 0.55,
      size: 42, font: fontBold, color: COLORS.white,
    })
    cover.drawText('HIMALAYAN', {
      x: MARGIN, y: PAGE_H * 0.55 - 50,
      size: 42, font: fontBold, color: COLORS.amber,
    })
    cover.drawText('ITINERARY', {
      x: MARGIN, y: PAGE_H * 0.55 - 100,
      size: 42, font: fontBold, color: COLORS.white,
    })

    // Ref code box
    cover.drawRectangle({
      x: MARGIN, y: 200, width: 200, height: 50,
      color: COLORS.saffron,
    })
    cover.drawText('REF:', {
      x: MARGIN + 12, y: 232,
      size: 10, font: font, color: COLORS.darkSlate,
    })
    cover.drawText(tripData.refCode || 'HF-PREVIEW', {
      x: MARGIN + 12, y: 215,
      size: 16, font: fontBold, color: COLORS.darkSlate,
    })

    // Traveller details
    cover.drawText('Prepared for', {
      x: MARGIN, y: 160, size: 10, font: font, color: COLORS.white, opacity: 0.7,
    })
    cover.drawText(tripData.name || 'Traveller', {
      x: MARGIN, y: 142, size: 18, font: fontBold, color: COLORS.white,
    })
    cover.drawText(`${tripData.email || ''}  |  ${tripData.phone || ''}`, {
      x: MARGIN, y: 124, size: 9, font: font, color: COLORS.white, opacity: 0.7,
    })

    // Dates
    const start = tripData.startDate ? new Date(tripData.startDate) : null
    const end = start ? new Date(start.getTime() + (tripData.duration - 1) * 86400000) : null
    cover.drawText(
      `${start ? start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}  →  ${end ? end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}  ·  ${tripData.duration || 5}D / ${Math.max(0, (tripData.duration || 5) - 1)}N  ·  ${tripData.pax || 2} pax`,
      {
        x: MARGIN, y: 100, size: 10, font: font, color: COLORS.white, opacity: 0.9,
      }
    )

    // Footer attribution
    cover.drawText('Made & maintained by GuardianX', {
      x: MARGIN, y: 40, size: 9, font: fontOblique, color: COLORS.amber,
    })
    cover.drawText('himalayanfreak.com  |  +91 600 626 6072  |  Magam, Kashmir 193401', {
      x: MARGIN, y: 24, size: 8, font: font, color: COLORS.white, opacity: 0.5,
    })

    // === PAGE 2: TRAVELLER & DESTINATIONS ===
    const p2 = pdfDoc.addPage([PAGE_W, PAGE_H])
    p2.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: COLORS.white })

    drawHeader(p2, font, fontBold, 'Trip Overview', MARGIN, PAGE_H - 70)

    let y = PAGE_H - 110

    // Quick facts box
    p2.drawRectangle({
      x: MARGIN, y: y - 80, width: PAGE_W - 2 * MARGIN, height: 80,
      color: COLORS.lightBg,
    })
    const facts = [
      ['Traveller', tripData.name || '-'],
      ['Dates', start && end ? `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'TBD'],
      ['Duration', `${tripData.duration || 5}D / ${Math.max(0, (tripData.duration || 5) - 1)}N`],
      ['Travellers', `${tripData.pax || 2} pax`],
      ['Hotel tier', hotelTiers.find((t) => t.id === tripData.hotelTier)?.name || 'Standard'],
      ['Start date', tripData.startDate || 'TBD'],
    ]
    let fx = MARGIN + 15
    let fy = y - 20
    facts.forEach(([k, v], i) => {
      if (i === 3) { fx = PAGE_W / 2; fy = y - 20 }
      p2.drawText(k.toUpperCase(), { x: fx, y: fy, size: 8, font: font, color: COLORS.slate })
      p2.drawText(String(v), { x: fx, y: fy - 14, size: 11, font: fontBold, color: COLORS.darkSlate })
      fy -= 38
    })

    y -= 110

    // Destinations section
    p2.drawText('Destinations on this trip', {
      x: MARGIN, y, size: 14, font: fontBold, color: COLORS.darkSlate,
    })
    p2.drawRectangle({ x: MARGIN, y: y - 6, width: 30, height: 2, color: COLORS.saffron })
    y -= 25

    const destSlugs: string[] = tripData.destinationSlugs || []
    const destObjs = destSlugs
      .map((s: string) => destinations.find((d) => d.slug === s))
      .filter(Boolean)

    if (destObjs.length === 0) {
      p2.drawText('No destinations selected yet.', { x: MARGIN, y, size: 10, font: fontOblique, color: COLORS.slate })
      y -= 20
    } else {
      destObjs.forEach((d: any, i: number) => {
        if (y < 130) return
        p2.drawRectangle({ x: MARGIN, y: y - 35, width: PAGE_W - 2 * MARGIN, height: 40, color: COLORS.lightBg })
        p2.drawText(`${i + 1}. ${d.name}`, {
          x: MARGIN + 12, y: y - 12, size: 12, font: fontBold, color: COLORS.darkSlate,
        })
        p2.drawText(`${d.tagline}  ·  ${d.elevation}m  ·  ${d.state}`, {
          x: MARGIN + 12, y: y - 26, size: 9, font: font, color: COLORS.slate,
        })
        // Right side: duration + difficulty
        const txt = `${d.duration}  ·  ${d.difficulty}`
        const tw = font.widthOfTextAtSize(txt, 9)
        p2.drawText(txt, {
          x: PAGE_W - MARGIN - 12 - tw, y: y - 12, size: 9, font: font, color: COLORS.slate,
        })
        p2.drawText(`★ ${d.rating.toFixed(1)}`, {
          x: PAGE_W - MARGIN - 12 - 18, y: y - 26, size: 9, font: fontBold, color: COLORS.amber,
        })
        y -= 50
      })
    }

    // === PAGE 3+: PER-DESTINATION DETAILS ===
    destObjs.forEach((d: any, idx: number) => {
      const dp = pdfDoc.addPage([PAGE_W, PAGE_H])
      dp.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: COLORS.white })

      drawHeader(dp, font, fontBold, `${idx + 1}. ${d.name}`, MARGIN, PAGE_H - 70)

      let dy = PAGE_H - 110
      // Tagline + key facts
      dp.drawText(d.tagline, { x: MARGIN, y: dy, size: 11, font: fontOblique, color: COLORS.saffron })
      dy -= 25

      dp.drawRectangle({ x: MARGIN, y: dy - 60, width: PAGE_W - 2 * MARGIN, height: 60, color: COLORS.lightBg })
      const destFacts = [
        ['Region', d.region],
        ['State', d.state],
        ['Elevation', `${d.elevation.toLocaleString()} m`],
        ['Best time', d.bestTime.split('(')[0].slice(0, 30)],
      ]
      let dfx = MARGIN + 15
      destFacts.forEach(([k, v]) => {
        dp.drawText(k.toUpperCase(), { x: dfx, y: dy - 18, size: 8, font: font, color: COLORS.slate })
        const txt = String(v)
        const truncated = txt.length > 22 ? txt.slice(0, 22) + '…' : txt
        dp.drawText(truncated, { x: dfx, y: dy - 32, size: 10, font: fontBold, color: COLORS.darkSlate })
        dfx += (PAGE_W - 2 * MARGIN) / 4
      })
      dy -= 80

      // Description
      dp.drawText('About', { x: MARGIN, y: dy, size: 12, font: fontBold, color: COLORS.darkSlate })
      dy -= 18
      const descLines = wrapText(d.description, 95, font, 10)
      descLines.slice(0, 10).forEach((line: string) => {
        if (dy < 120) return
        dp.drawText(line, { x: MARGIN, y: dy, size: 10, font: font, color: COLORS.slate, lineHeight: 14 })
        dy -= 14
      })
      dy -= 10

      // Attractions (max 5)
      if (d.attractions && d.attractions.length > 0 && dy > 200) {
        dp.drawText('Top attractions', { x: MARGIN, y: dy, size: 12, font: fontBold, color: COLORS.darkSlate })
        dy -= 18
        d.attractions.slice(0, 5).forEach((a: string, i: number) => {
          if (dy < 130) return
          dp.drawText(`•`, { x: MARGIN, y: dy, size: 10, font: fontBold, color: COLORS.saffron })
          const lines = wrapText(a, 90, font, 10)
          lines.forEach((line: string, li: number) => {
            dp.drawText(line, { x: MARGIN + 14, y: dy, size: 10, font: font, color: COLORS.slate })
            if (li < lines.length - 1) dy -= 13
          })
          dy -= 18
        })
      }

      // How to reach
      if (d.howToReach && dy > 130) {
        dy -= 10
        dp.drawText('How to reach', { x: MARGIN, y: dy, size: 12, font: fontBold, color: COLORS.darkSlate })
        dy -= 18
        const htrLines = wrapText(d.howToReach, 95, font, 9)
        htrLines.slice(0, 4).forEach((line: string) => {
          if (dy < 110) return
          dp.drawText(line, { x: MARGIN, y: dy, size: 9, font: font, color: COLORS.slate })
          dy -= 12
        })
      }

      drawFooter(dp, font, fontOblique, idx + 3)
    })

    // === FINAL PAGE: SUMMARY & INCLUSIONS ===
    const summary = pdfDoc.addPage([PAGE_W, PAGE_H])
    summary.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: COLORS.white })

    drawHeader(summary, font, fontBold, 'Trip Summary & Cost', MARGIN, PAGE_H - 70)

    let sy = PAGE_H - 110

    // Hotel tier
    const hotel = hotelTiers.find((t) => t.id === tripData.hotelTier)
    if (hotel) {
      summary.drawText('Accommodation', { x: MARGIN, y: sy, size: 12, font: fontBold, color: COLORS.darkSlate })
      sy -= 18
      summary.drawText(`${hotel.name}: ${hotel.desc}`, { x: MARGIN, y: sy, size: 10, font: font, color: COLORS.slate })
      sy -= 14
      summary.drawText(`₹${hotel.perNight.toLocaleString('en-IN')} per night · twin share`, {
        x: MARGIN, y: sy, size: 9, font: fontOblique, color: COLORS.slate,
      })
      sy -= 30
    }

    // Meals
    if (tripData.meals && tripData.meals.length > 0) {
      summary.drawText('Meals included', { x: MARGIN, y: sy, size: 12, font: fontBold, color: COLORS.darkSlate })
      sy -= 18
      tripData.meals.forEach((mId: string) => {
        const meal = mealOptions.find((x) => x.id === mId)
        if (!meal) return
        const price = meal.perPersonPerDay || meal.perPerson || 0
        const unit = meal.perPerson ? 'one-time' : 'per day'
        summary.drawText(`•  ${meal.name}  -  ₹${price.toLocaleString('en-IN')} / person / ${unit}`, {
          x: MARGIN, y: sy, size: 10, font: font, color: COLORS.slate,
        })
        sy -= 16
      })
      sy -= 15
    }

    // Add-ons
    if (tripData.addOnIds && tripData.addOnIds.length > 0) {
      summary.drawText('Add-ons', { x: MARGIN, y: sy, size: 12, font: fontBold, color: COLORS.darkSlate })
      sy -= 18
      tripData.addOnIds.forEach((aId: string) => {
        const a = addOns.find((x) => x.id === aId)
        if (!a) return
        const price = a.perDay || a.perTrip || a.perPerson || 0
        const unit = a.perDay ? '/ day' : a.perPerson ? '/ person' : '/ trip'
        summary.drawText(`•  ${a.name}  -  ₹${price.toLocaleString('en-IN')}${unit}`, {
          x: MARGIN, y: sy, size: 10, font: font, color: COLORS.slate,
        })
        sy -= 16
      })
      sy -= 15
    }

    // Total cost box
    sy -= 20
    summary.drawRectangle({ x: MARGIN, y: sy - 80, width: PAGE_W - 2 * MARGIN, height: 80, color: COLORS.darkSlate })
    summary.drawText('ESTIMATED TOTAL', {
      x: MARGIN + 18, y: sy - 22, size: 9, font: font, color: COLORS.amber,
    })
    const totalStr = `₹${Number(tripData.estimatedPrice || 0).toLocaleString('en-IN')}`
    summary.drawText(totalStr, {
      x: MARGIN + 18, y: sy - 50, size: 28, font: fontBold, color: COLORS.white,
    })
    const perPax = Math.round(Number(tripData.estimatedPrice || 0) / Math.max(1, tripData.pax || 1))
    summary.drawText(`≈ ₹${perPax.toLocaleString('en-IN')} per person`, {
      x: MARGIN + 18, y: sy - 68, size: 10, font: font, color: COLORS.white, opacity: 0.8,
    })

    // Right side note
    summary.drawText('Final quote confirmed', {
      x: PAGE_W - MARGIN - 180, y: sy - 22, size: 9, font: font, color: COLORS.amber,
    })
    summary.drawText('after a 30-min call.', {
      x: PAGE_W - MARGIN - 180, y: sy - 35, size: 9, font: font, color: COLORS.white, opacity: 0.8,
    })
    summary.drawText('No deposit required.', {
      x: PAGE_W - MARGIN - 180, y: sy - 50, size: 9, font: fontBold, color: COLORS.white,
    })

    sy -= 110

    // Contact
    summary.drawText('Get in touch', { x: MARGIN, y: sy, size: 12, font: fontBold, color: COLORS.darkSlate })
    sy -= 18
    const contactLines = [
      'Himalayan Freak',
      'Al Falah Complex, Srinagar-Gulmarg Road,',
      'Magam, Jammu & Kashmir 193401, India',
      '+91 600 626 6072  |  +91 979 705 1060',
      'hello@himalayanfreak.com',
    ]
    contactLines.forEach((line) => {
      summary.drawText(line, { x: MARGIN, y: sy, size: 9, font: font, color: COLORS.slate })
      sy -= 13
    })

    drawFooter(summary, font, fontOblique, pdfDoc.getPageCount())

    // Save and return
    const pdfBytes = await pdfDoc.save()
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="itinerary-${tripData.refCode || 'preview'}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

// Helper: wrap text to width
function wrapText(text: string, maxChars: number, font: any, size: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? current + ' ' + word : word
    if (font.widthOfTextAtSize(test, size) > (maxChars * size * 0.5)) {
      if (current) lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawHeader(page: any, font: any, fontBold: any, title: string, x: number, y: number) {
  page.drawText('HIMALAYAN FREAK', { x, y, size: 9, font: fontBold, color: COLORS.saffron })
  page.drawText('Custom Itinerary', { x, y: y - 13, size: 8, font: font, color: COLORS.slate })
  page.drawText(title, { x, y: y - 35, size: 22, font: fontBold, color: COLORS.darkSlate })
  page.drawRectangle({ x, y: y - 48, width: 40, height: 3, color: COLORS.saffron })
}

function drawFooter(page: any, font: any, fontOblique: any, pageNum: number) {
  const PAGE_W = 595.28
  page.drawText('Himalayan Freak  ·  himalayanfreak.com  ·  +91 600 626 6072', {
    x: 50, y: 30, size: 8, font: font, color: COLORS.slate,
  })
  page.drawText('Made & maintained by GuardianX', {
    x: 50, y: 18, size: 8, font: fontOblique, color: COLORS.saffron,
  })
  page.drawText(`Page ${pageNum}`, {
    x: PAGE_W - 90, y: 30, size: 8, font: font, color: COLORS.slate,
  })
}
