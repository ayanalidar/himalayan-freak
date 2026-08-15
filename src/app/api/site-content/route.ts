import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeParse } from '@/lib/safe'

// Public GET - returns all site content (or filtered by ?page=)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page')

  const where: any = {}
  if (page) where.page = page

  try {
    const contents = await db.siteContent.findMany({ where })
    // Transform to a nested object: { [page]: { [section]: data } }
    const result: Record<string, Record<string, any>> = {}
    for (const c of contents) {
      if (!result[c.page]) result[c.page] = {}
      result[c.page][c.section] = safeParse(c.data, {})
    }
    return NextResponse.json(result)
  } catch (err) {
    console.error('Fetch site content error:', err)
    return NextResponse.json({})
  }
}
