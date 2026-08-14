import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    return NextResponse.json(customers)
  } catch (err) {
    console.error('Fetch customers error:', err)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, city, state, type, tags, notes } = body
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    const customer = await db.customer.create({
      data: {
        name,
        email,
        phone,
        city: city || '',
        state: state || '',
        type: type || 'Individual',
        tags: tags ? JSON.stringify(tags) : null,
        notes: notes || '',
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (err) {
    console.error('Create customer error:', err)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const customer = await db.customer.update({
      where: { id: String(id) },
      data: rest,
    })
    return NextResponse.json(customer)
  } catch (err) {
    console.error('Update customer error:', err)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await db.customer.delete({ where: { id: String(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete customer error:', err)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
