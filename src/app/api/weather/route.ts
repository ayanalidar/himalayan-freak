import { NextRequest, NextResponse } from 'next/server'
import { generateMockWeather } from '@/lib/data'

// Mock weather API - accepts lat/lon/elevation and returns a deterministic forecast
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat') || '34')
  const lon = Number(searchParams.get('lon') || '74')
  const elevation = Number(searchParams.get('elevation') || '1500')

  const weather = generateMockWeather(lat, lon, elevation)
  return NextResponse.json(weather)
}
