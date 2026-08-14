import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, city, state } = await req.json()
    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Name, valid email and password (min 6 chars) required' },
        { status: 400 }
      )
    }
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        city: city || null,
        state: state || null,
        role: 'user',
      },
    })
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 })
  }
}
