import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const MAX_SIZE = 5 * 1024 * 1024

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

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, AVIF.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_SIZE / 1024 / 1024} MB.` },
        { status: 400 }
      )
    }

    const safeSub = String(subfolder).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 50) || 'general'
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ALLOWED_MIME.has(file.type) ? ext.slice(0, 5) : 'jpg'
    const randomName = randomBytes(16).toString('hex')
    const filename = `${randomName}.${safeExt}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // Try Vercel Blob first
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`${safeSub}/${filename}`, buffer, {
          access: 'public',
          contentType: file.type,
          addRandomSuffix: false,
        })
        return NextResponse.json({
          url: blob.url,
          filename,
          size: file.size,
          type: file.type,
          provider: 'vercel-blob',
        })
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        console.error('Vercel Blob upload failed:', errMsg)
        if (errMsg.includes('private')) {
          return NextResponse.json({
            error: 'Blob store is private. Create a public store or use URL paste.',
          }, { status: 500 })
        }
      }
    }

    // Fallback: local storage (sandbox dev only)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeSub)
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      await writeFile(path.join(uploadDir, filename), buffer)
      return NextResponse.json({
        url: `/uploads/${safeSub}/${filename}`,
        filename,
        size: file.size,
        type: file.type,
        provider: 'local',
      })
    } catch (writeErr) {
      console.error('Local upload failed:', writeErr)
      return NextResponse.json({
        error: 'Upload not supported. Use "Paste URL" instead.',
      }, { status: 500 })
    }
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    provider: process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'local-or-url',
    maxFileSize: MAX_SIZE,
    allowedTypes: Array.from(ALLOWED_MIME),
  })
}
