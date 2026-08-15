'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  X,
  Home,
  Building,
  Map,
  Package,
  Compass,
  Plane,
  Users,
  FileText,
  Settings,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { useApp } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/image-upload'
import { clearContentCache } from '@/lib/use-site-content'

// Define all editable pages and their sections
const PAGE_DEFINITIONS: Record<string, { label: string; icon: any; sections: { id: string; label: string; fields: { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'long-text' }[] }[] }> = {
  home: {
    label: 'Home Page',
    icon: Home,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Main title (line 1)', type: 'text' },
          { key: 'titleHighlight', label: 'Title highlight (line 2, colored)', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'stats',
        label: 'Stats Strip',
        fields: [
          { key: 'stat1Icon', label: 'Stat 1 icon', type: 'text' },
          { key: 'stat1Label', label: 'Stat 1 label', type: 'text' },
          { key: 'stat2Icon', label: 'Stat 2 icon', type: 'text' },
          { key: 'stat2Label', label: 'Stat 2 label', type: 'text' },
          { key: 'stat3Icon', label: 'Stat 3 icon', type: 'text' },
          { key: 'stat3Label', label: 'Stat 3 label', type: 'text' },
          { key: 'stat4Icon', label: 'Stat 4 icon', type: 'text' },
          { key: 'stat4Label', label: 'Stat 4 label', type: 'text' },
        ],
      },
      {
        id: 'story',
        label: 'Story Section',
        fields: [
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'image1', label: 'Image 1 (Dal Lake)', type: 'image' },
          { key: 'image2', label: 'Image 2 (Gulmarg)', type: 'image' },
          { key: 'image3', label: 'Image 3 (Ladakh)', type: 'image' },
          { key: 'image4', label: 'Image 4 (Pangong)', type: 'image' },
        ],
      },
      {
        id: 'cta',
        label: 'Trip Planner CTA',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'testimonials',
        label: 'Testimonials Heading',
        fields: [
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
        ],
      },
      {
        id: 'finalCta',
        label: 'Final CTA',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  company: {
    label: 'Company Page',
    icon: Building,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        id: 'mission',
        label: 'Mission',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body1', label: 'Paragraph 1', type: 'textarea' },
          { key: 'body2', label: 'Paragraph 2', type: 'textarea' },
        ],
      },
      {
        id: 'vision',
        label: 'Vision',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body1', label: 'Paragraph 1', type: 'textarea' },
          { key: 'body2', label: 'Paragraph 2', type: 'textarea' },
        ],
      },
    ],
  },
  destinations: {
    label: 'Destinations Page',
    icon: Map,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  packages: {
    label: 'Packages Page',
    icon: Package,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  'trip-planner': {
    label: 'Trip Planner Page',
    icon: Compass,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  tickets: {
    label: 'Tickets Page',
    icon: Plane,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  'group-booking': {
    label: 'Group Booking Page',
    icon: Users,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'image', label: 'Hero background image', type: 'image' },
          { key: 'badge', label: 'Badge text', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  login: {
    label: 'Login Page',
    icon: Settings,
    sections: [
      {
        id: 'hero',
        label: 'Background',
        fields: [
          { key: 'image', label: 'Background image', type: 'image' },
        ],
      },
    ],
  },
  signup: {
    label: 'Signup Page',
    icon: Settings,
    sections: [
      {
        id: 'hero',
        label: 'Background',
        fields: [
          { key: 'image', label: 'Background image', type: 'image' },
        ],
      },
    ],
  },
}

export function AdminPagesPage() {
  const { navigate } = useApp()
  const { session, status } = useAuth()
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [contentMap, setContentMap] = useState<Record<string, Record<string, any>>>({})

  const refresh = useCallback(async () => {
    if (session?.user?.role !== 'admin') return
    try {
      const res = await fetch('/api/site-content')
      const data = await res.json()
      setContentMap(data)
    } catch {}
  }, [session])

  useEffect(() => {
    if (status === 'unauthenticated') navigate('login')
    else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      toast.error('Admin access only')
      navigate('dashboard')
    }
  }, [status, session, navigate])

  useEffect(() => { refresh() }, [refresh])

  const onEditSection = (page: string, section: string) => {
    const existing = contentMap[page]?.[section] || {}
    setEditData(existing)
    setEditingSection(`${page}:${section}`)
  }

  const onSave = async () => {
    if (!editingSection) return
    const [page, section] = editingSection.split(':')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, data: editData }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Content saved!')
      clearContentCache()
      setEditingSection(null)
      refresh()
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const pageEntries = Object.entries(PAGE_DEFINITIONS)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <button onClick={() => navigate('crm')} className="mb-1 flex items-center gap-1.5 text-xs text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to CRM
            </button>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Manage Pages</h1>
            <p className="text-sm text-white/70">Edit hero images, text, and content for every page on your site.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {!selectedPage ? (
          /* Page selection grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageEntries.map(([pageId, def], i) => {
              const Icon = def.icon
              const hasContent = contentMap[pageId] && Object.keys(contentMap[pageId]).length > 0
              return (
                <motion.div
                  key={pageId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card
                    className="cursor-pointer p-5 ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/40"
                    onClick={() => setSelectedPage(pageId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      {hasContent && (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                          Edited
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold">{def.label}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {def.sections.length} section{def.sections.length > 1 ? 's' : ''} editable
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Section list for selected page */
          <div>
            <button
              onClick={() => setSelectedPage(null)}
              className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> All pages
            </button>
            <h2 className="font-display text-xl font-bold mb-4">
              {PAGE_DEFINITIONS[selectedPage].label}
            </h2>
            <div className="space-y-3">
              {PAGE_DEFINITIONS[selectedPage].sections.map((section) => {
                const hasContent = contentMap[selectedPage]?.[section.id]
                return (
                  <Card key={section.id} className="flex items-center justify-between p-4 ring-1 ring-border/40">
                    <div>
                      <h3 className="font-medium text-sm">{section.label}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {section.fields.length} field{section.fields.length > 1 ? 's' : ''} -{' '}
                        {section.fields.filter(f => f.type === 'image').length} image{section.fields.filter(f => f.type === 'image').length !== 1 ? 's' : ''}
                      </p>
                      {hasContent && (
                        <Badge variant="outline" className="mt-1 text-[10px] bg-emerald-500/10 text-emerald-600">
                          Edited
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditSection(selectedPage, section.id)}
                      className="gap-1.5"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Section editor dialog */}
      {editingSection && (
        <Dialog open onOpenChange={(o) => !o && setEditingSection(null)}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Edit: {PAGE_DEFINITIONS[editingSection.split(':')[0]]?.sections.find(s => s.id === editingSection.split(':')[1])?.label}
              </DialogTitle>
              <DialogDescription>
                Upload images or paste URLs. Changes appear immediately on the live site.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {PAGE_DEFINITIONS[editingSection.split(':')[0]]?.sections
                .find(s => s.id === editingSection.split(':')[1])
                ?.fields.map((field) => (
                  <div key={field.key}>
                    {field.type === 'image' ? (
                      <ImageUpload
                        value={editData[field.key] || ''}
                        onChange={(url) => setEditData({ ...editData, [field.key]: url })}
                        subfolder={`pages/${selectedPage}`}
                        label={field.label}
                      />
                    ) : field.type === 'textarea' || field.type === 'long-text' ? (
                      <div>
                        <Label>{field.label}</Label>
                        <Textarea
                          rows={3}
                          value={editData[field.key] || ''}
                          onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label>{field.label}</Label>
                        <Input
                          value={editData[field.key] || ''}
                          onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onSave} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
