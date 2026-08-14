import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { packages as seedPackages } from '@/lib/data'
import { safeParse } from '@/lib/safe'

export async function GET() {
  let dbPackages: any[] = []
  try {
    dbPackages = await db.package.findMany()
  } catch {
    // DB might not have any rows yet
  }

  const dbSlugs = new Set(dbPackages.map((p) => p.slug))
  const seedOnly = seedPackages
    .filter((p) => !dbSlugs.has(p.slug))
    .map((p) => ({ ...p, isCustom: false }))

  const dbMapped = dbPackages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    region: p.region,
    duration: p.duration,
    nights: p.nights,
    price: p.price,
    description: p.description,
    highlights: safeParse<string[]>(p.highlights, []),
    inclusions: safeParse<string[]>(p.inclusions, []),
    exclusions: safeParse<string[]>(p.exclusions, []),
    itinerary: safeParse<any[]>(p.itinerary, []),
    heroImage: p.heroImage,
    rating: p.rating,
    featured: p.featured,
    isCustom: true,
  }))

  return NextResponse.json([...dbMapped, ...seedOnly])
}
