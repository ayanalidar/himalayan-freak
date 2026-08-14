import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public GET - returns active team members ordered by display order
export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(team)
  } catch (err) {
    console.error('Fetch team error:', err)
    return NextResponse.json([])
  }
}
