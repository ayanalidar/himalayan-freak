import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir, readFile } from 'fs/promises'
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

    // Generate safe unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ALLOWED_MIME.has(file.type) ? ext.slice(0, 5) : 'jpg'
    const randomName = randomBytes(16).toString('hex')
    const filename = `${randomName}.${safeExt}`

    const buffer = Buffer.from(await file.arrayBuffer())

    // Try Vercel Blob first (if configured)
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

        // If the store is private, give a specific error
        if (errMsg.includes('private')) {
          return NextResponse.json({
            error: 'Your Vercel Blob store is set to "Private" access. Please create a new Blob store with "Public" access at https://vercel.com/dashboard/stores and update BLOB_READ_WRITE_TOKEN. Alternatively, use "Paste URL" to add images by URL.',
            hint: 'Private stores require authenticated URLs which cannot be used in <img> tags. Create a Public store instead.',
          }, { status: 500 })
        }
        // Fall through to local storage for other errors
      }
    }

    // Fallback: local file storage (works in sandbox dev, NOT in Vercel production)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeSub)
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)
      const publicUrl = `/uploads/${safeSub}/${filename}`

      return NextResponse.json({
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
        provider: 'local',
      })
    } catch (writeErr) {
      console.error('Local file upload failed:', writeErr)
      // Last resort: return error with clear instructions
      return NextResponse.json({
        error: 'File upload not supported on this server. Please use "Paste URL" instead - paste any public image URL (e.g. from Unsplash) and click Set.',
        hint: 'For production file uploads, configure Vercel Blob by setting BLOB_READ_WRITE_TOKEN env var.',
      }, { status: 500 })
    }
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// GET endpoint - returns upload configuration info
export async function GET() {
  return NextResponse.json({
    provider: process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'local-or-url',
    maxFileSize: MAX_SIZE,
    allowedTypes: Array.from(ALLOWED_MIME),
    note: process.env.BLOB_READ_WRITE_TOKEN
      ? 'Vercel Blob configured - file uploads work in production.'
      : 'For production file uploads, set BLOB_READ_WRITE_TOKEN. URL paste always works.',
  })
}
