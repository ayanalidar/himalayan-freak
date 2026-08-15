'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  subfolder?: string
  label?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  subfolder = 'destinations',
  label = 'Image',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('subfolder', subfolder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      onChange(data.url)
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Upload failed', {
        description: err instanceof Error ? err.message : 'Please try again or use a URL instead.',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onUrlSubmit = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    setUrlInput('')
    setShowUrlInput(false)
    toast.success('Image URL set')
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
      )}

      {/* Preview */}
      {value ? (
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                'https://placehold.co/400x300/e2e8f0/475569?text=Broken+Image'
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-2">
            <span className="truncate text-xs text-white/90">{value}</span>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-7 w-7 shrink-0"
              onClick={() => onChange('')}
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {/* Upload buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          Upload file
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="gap-1.5"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Paste URL
        </Button>
      </div>

      {/* URL input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            placeholder="https://images.unsplash.com/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="h-9"
          />
          <Button type="button" size="sm" onClick={onUrlSubmit} className="h-9">
            Set
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={onFileSelect}
        className="hidden"
      />
      <p className="text-[10px] text-muted-foreground">
        Upload JPEG/PNG/WebP (max 5 MB) or paste any image URL below. On Vercel production, file uploads require Vercel Blob - URL paste always works.
      </p>
    </div>
  )
}

// Reusable component for multiple image URLs (gallery)
interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  subfolder?: string
  label?: string
}

export function MultiImageUpload({
  values,
  onChange,
  subfolder = 'gallery',
  label = 'Gallery images',
}: MultiImageUploadProps) {
  const addUrl = (url: string) => {
    if (url) onChange([...values, url])
  }
  const removeUrl = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {values.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
          >
            <img
              src={url}
              alt={`Gallery ${idx + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://placehold.co/400x300/e2e8f0/475569?text=Broken'
              }}
            />
            <button
              type="button"
              onClick={() => removeUrl(idx)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-rose-600"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <ImageUpload
          value=""
          onChange={addUrl}
          subfolder={subfolder}
          label=""
          className="aspect-video [&>div:first-child]:hidden [&>div:nth-child(2)]:hidden"
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        Click &quot;Upload file&quot; below to add images to the gallery.
      </p>
    </div>
  )
}
