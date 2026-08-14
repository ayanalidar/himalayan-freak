import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { destinations as seedDestinations } from '@/lib/data'

// Merge static seed data + DB-edited records
// DB records override by slug if present
export async function GET() {
  let dbDestinations: any[] = []
  try {
    dbDestinations = await db.destination.findMany()
  } catch {
    // DB might not have any rows yet - fall back to seed only
  }

  const dbSlugs = new Set(dbDestinations.map((d) => d.slug))
  const seedOnly = seedDestinations
    .filter((d) => !dbSlugs.has(d.slug))
    .map((d) => ({ ...d, isCustom: false }))

  const dbMapped = dbDestinations.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    state: d.state,
    elevation: d.elevation,
    latitude: d.latitude,
    longitude: d.longitude,
    tagline: d.tagline,
    description: d.description,
    bestTime: d.bestTime,
    duration: d.duration,
    difficulty: d.difficulty,
    rating: d.rating,
    heroImage: d.heroImage,
    gallery: JSON.parse(d.gallery || '[]'),
    attractions: JSON.parse(d.attractions || '[]'),
    activities: JSON.parse(d.activities || '[]'),
    howToReach: d.howToReach,
    featured: d.featured,
    isCustom: true,
  }))

  // DB-first so admin edits show first
  return NextResponse.json([...dbMapped, ...seedOnly])
}
