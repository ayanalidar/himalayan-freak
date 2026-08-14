import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'

// Allowed MIME types for images
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Auth required' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const subfolder = (formData.get('subfolder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate MIME type
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, AVIF.` },
        { status: 400 }
      )
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_SIZE / 1024 / 1024} MB.` },
        { status: 400 }
      )
    }

    // Sanitize subfolder - only allow letters/numbers/dashes
    const safeSub = String(subfolder).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 50) || 'general'

    // Create directory if missing
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeSub)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate safe unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ALLOWED_MIME.has(file.type) ? ext.slice(0, 5) : 'jpg'
    const randomName = randomBytes(16).toString('hex')
    const filename = `${randomName}.${safeExt}`

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return public URL (relative path, works on both sandbox and Vercel)
    const publicUrl = `/uploads/${safeSub}/${filename}`

    return NextResponse.json({
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
