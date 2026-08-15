// Real-time flight & train data integration layer
//
// AMDEUS (Flights):
//   1. Sign up at https://developers.amadeus.com
//   2. Get API_KEY and API_SECRET
//   3. Add to .env: AMADEUS_API_KEY=xxx, AMADEUS_API_SECRET=xxx
//
// IRCTC / RAILWAY (Trains):
//   IRCTC doesn't offer public APIs. Use RailwayAPI.com or IRCTC partner APIs.
//   1. Sign up at https://railwayapi.com (or similar)
//   2. Add to .env: RAILWAY_API_KEY=xxx
//
// When env vars are absent, we fall back to the seeded real data in the DB
// (which itself contains real flight numbers, train numbers, schedules and fares).

const AMADEUS_BASE = 'https://test.api.amadeus.com'
const RAILWAY_BASE = 'https://api.railwayapi.com/v2'

// --- Amadeus Token Cache ---
let amadeusToken: { token: string; expiresAt: number } | null = null

async function getAmadeusToken(): Promise<string | null> {
  const apiKey = process.env.AMADEUS_API_KEY
  const apiSecret = process.env.AMADEUS_API_SECRET
  if (!apiKey || !apiSecret) return null

  if (amadeusToken && amadeusToken.expiresAt > Date.now() + 60000) {
    return amadeusToken.token
  }

  try {
    const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    amadeusToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
    }
    return amadeusToken.token
  } catch {
    return null
  }
}

export interface RealFlightResult {
  airline: string
  flightNo: string
  origin: string
  originCode: string
  destination: string
  destCode: string
  departTime: string
  arriveTime: string
  duration: string
  stops: number
  price: number
  cabin: string
  available: number
  aircraft: string | null
  source: 'amadeus' | 'seeded'
}

export interface RealTrainResult {
  trainNo: string
  trainName: string
  origin: string
  originCode: string
  destination: string
  destCode: string
  departTime: string
  arriveTime: string
  duration: string
  classes: { code: string; name: string; price: number; available: number }[]
  runsOn: number[]
  source: 'railwayapi' | 'seeded'
}

// --- Amadeus Real Flight Search ---
export async function searchAmadeusFlights(
  originCode: string,
  destCode: string,
  date: string,
  adults: number = 1
): Promise<RealFlightResult[] | null> {
  const token = await getAmadeusToken()
  if (!token) return null

  try {
    const url = new URL(`${AMADEUS_BASE}/v2/shopping/flight-offers`)
    url.searchParams.set('originLocationCode', originCode.toUpperCase())
    url.searchParams.set('destinationLocationCode', destCode.toUpperCase())
    url.searchParams.set('departureDate', date)
    url.searchParams.set('adults', String(adults))
    url.searchParams.set('max', '20')
    url.searchParams.set('currencyCode', 'INR')

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 }, // cache 5min
    })
    if (!res.ok) return null
    const data = await res.json()

    const carriers: Record<string, string> = {}
    if (data.dictionaries?.carriers) {
      for (const [code, name] of Object.entries(data.dictionaries.carriers)) {
        carriers[code] = name as string
      }
    }
    const aircraft: Record<string, string> = {}
    if (data.dictionaries?.aircraft) {
      for (const [code, name] of Object.entries(data.dictionaries.aircraft)) {
        aircraft[code] = name as string
      }
    }

    return (data.data || []).map((offer: any): RealFlightResult => {
      const seg = offer.itineraries?.[0]?.segments?.[0]
      const lastSeg = offer.itineraries?.[0]?.segments?.slice(-1)[0]
      const allSegs = offer.itineraries?.[0]?.segments || []
      return {
        airline: carriers[seg?.carrierCode] || seg?.carrierCode || 'Unknown',
        flightNo: `${seg?.carrierCode || ''} ${seg?.number || ''}`.trim(),
        origin: seg?.departure?.iataCode || '',
        originCode: seg?.departure?.iataCode || '',
        destination: lastSeg?.arrival?.iataCode || '',
        destCode: lastSeg?.arrival?.iataCode || '',
        departTime: seg?.departure?.at?.slice(11, 16) || '',
        arriveTime: lastSeg?.arrival?.at?.slice(11, 16) || '',
        duration: offer.itineraries?.[0]?.duration?.replace('PT', '').toLowerCase() || '',
        stops: Math.max(0, allSegs.length - 1),
        price: Number(offer.price?.total || 0),
        cabin: offer.travelerPricings?.[0]?.fareOption || 'Economy',
        available: offer.numberOfBookableSeats || 9,
        aircraft: aircraft[seg?.aircraft?.code] || seg?.aircraft?.code || null,
        source: 'amadeus',
      }
    })
  } catch {
    return null
  }
}

// --- RailwayAPI Real Train Search ---
export async function searchRailwayTrains(
  originCode: string,
  destCode: string,
  date: string
): Promise<RealTrainResult[] | null> {
  const apiKey = process.env.RAILWAY_API_KEY
  if (!apiKey) return null

  try {
    // RailwayAPI v2 - trains between stations
    const url = `${RAILWAY_BASE}/between-stations/apikey/${apiKey}/from/${originCode}/to/${destCode}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()

    if (!data.trains) return null
    const day = new Date(date).getDay()

    return data.trains
      .filter((t: any) => t.days?.includes(day.toString()))
      .map((t: any): RealTrainResult => ({
        trainNo: t.number,
        trainName: t.name,
        origin: t.from_station?.name || '',
        originCode: t.from_station?.code || '',
        destination: t.to_station?.name || '',
        destCode: t.to_station?.code || '',
        departTime: t.src_departure_time || '',
        arriveTime: t.dest_arrival_time || '',
        duration: t.travel_time || '',
        classes: (t.classes || []).map((c: any) => ({
          code: c.code,
          name: c.name || c.code,
          price: 0, // RailwayAPI returns fares separately
          available: 50, // Availability check is separate API
        })),
        runsOn: [0, 1, 2, 3, 4, 5, 6], // Will be refined
        source: 'railwayapi',
      }))
  } catch {
    return null
  }
}

// Helper: check if real-time APIs are configured
export function isAmadeusConfigured(): boolean {
  return Boolean(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET)
}

export function isRailwayApiConfigured(): boolean {
  return Boolean(process.env.RAILWAY_API_KEY)
}
