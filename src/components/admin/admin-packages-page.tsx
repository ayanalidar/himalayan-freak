'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  Loader2,
  Star,
  Plane,
  Clock,
  IndianRupee,
  ArrowLeft,
  X,
  Plus as PlusIcon,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
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
import { cn } from '@/lib/utils'
import { ImageUpload } from '@/components/image-upload'

interface PackageData {
  id?: string
  slug: string
  title: string
  region: string
  duration: number
  nights: number
  price: number
  description: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; description: string }[]
  heroImage: string
  rating: number
  featured: boolean
  isCustom?: boolean
}

const regions = ['Kashmir', 'Jammu', 'Ladakh', 'Himachal', 'Uttarakhand', 'Multi-Region']

const emptyPkg: PackageData = {
  slug: '',
  title: '',
  region: 'Kashmir',
  duration: 5,
  nights: 4,
  price: 20000,
  description: '',
  highlights: [],
  inclusions: [],
  exclusions: [],
  itinerary: [],
  heroImage: '',
  rating: 4.6,
  featured: false,
}

export function AdminPackagesPage() {
  const { navigate } = useApp()
  const { session, status } = useAuth()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<PackageData | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    if (session?.user?.role !== 'admin') {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [adminRes, pubRes] = await Promise.all([
        fetch('/api/admin/packages'),
        fetch('/api/packages'),
      ])
      const safeJson = async (r: Response, fallback: any) => {
        if (!r.ok) return fallback
        try { return await r.json() } catch { return fallback }
      }
      const adminList = await safeJson(adminRes, [])
      const pubList = await safeJson(pubRes, [])
      const adminSlugs = new Set(adminList.map((p: PackageData) => p.slug))
      const merged = [...adminList, ...pubList.filter((p: PackageData) => !adminSlugs.has(p.slug))]
      setPackages(merged)
    } catch {
      toast.error('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }, [session])

  // Auth guard - redirect non-admins
  useEffect(() => {
    if (status === 'unauthenticated') {
      navigate('login')
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      toast.error('Admin access only')
      navigate('dashboard')
    }
  }, [status, session, navigate])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.region.toLowerCase().includes(search.toLowerCase())
  )

  const startNew = () => {
    setEditing({ ...emptyPkg })
    setIsNew(true)
  }

  const onSave = async () => {
    if (!editing) return
    if (!editing.slug || !editing.title) {
      toast.error('Slug and title are required')
      return
    }
    setSaving(true)
    try {
      // If no DB id (seed data being edited for the first time), CREATE instead of PATCH
      const isNewRecord = isNew || !editing.id
      const method = isNewRecord ? 'POST' : 'PATCH'
      const body: any = { ...editing }
      if (!isNewRecord && editing.id) body.id = editing.id
      const res = await fetch('/api/admin/packages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }
      toast.success(isNewRecord ? 'Package saved!' : 'Package updated!')
      setEditing(null)
      refresh()
    } catch (err) {
      toast.error('Save failed', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/packages?id=${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Package deleted')
      setDeleteId(null)
      refresh()
    } catch {
      toast.error('Delete failed')
    }
  }

  const updateItinerary = (idx: number, field: 'title' | 'description', value: string) => {
    if (!editing) return
    const newItin = [...editing.itinerary]
    newItin[idx] = { ...newItin[idx], [field]: value }
    setEditing({ ...editing, itinerary: newItin })
  }

  const addItineraryDay = () => {
    if (!editing) return
    const newDay = (editing.itinerary.length || 0) + 1
    setEditing({
      ...editing,
      itinerary: [...editing.itinerary, { day: newDay, title: '', description: '' }],
    })
  }

  const removeItineraryDay = (idx: number) => {
    if (!editing) return
    const newItin = editing.itinerary.filter((_, i) => i !== idx)
      .map((d, i) => ({ ...d, day: i + 1 }))
    setEditing({ ...editing, itinerary: newItin })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <button onClick={() => navigate('crm')} className="mb-1 flex items-center gap-1.5 text-xs text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to CRM
            </button>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Manage Packages</h1>
            <p className="text-sm text-white/70">Edit existing packages, add new ones, or update itineraries & pricing.</p>
          </div>
          <Button onClick={startNew} className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <Plus className="h-4 w-4" /> New package
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug + i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              >
                <Card className="overflow-hidden p-0 ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/40">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative aspect-video w-full sm:h-32 sm:w-48 sm:shrink-0">
                      <img
                        src={p.heroImage || 'https://placehold.co/400x300?text=No+Image'}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                      {p.featured && (
                        <Badge className="absolute left-2 top-2 bg-amber-500 text-white">★ Featured</Badge>
                      )}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-base font-bold">{p.title}</h3>
                            <Badge variant="outline" className="text-[10px]">{p.region}</Badge>
                            {p.isCustom && (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                                Edited
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {p.duration}D / {p.nights}N
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> {p.price.toLocaleString('en-IN')}/pax
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {p.rating?.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Plane className="h-3 w-3" /> {p.itinerary?.length || 0} days
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing({ ...p }); setIsNew(false) }} aria-label="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {p.id && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-rose-500 hover:text-rose-600"
                              onClick={() => setDeleteId(p.id!)}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-sm text-muted-foreground">No packages match your search.</p>
              </Card>
            )}
          </div>
        )}
      </div>

      {editing && (
        <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isNew ? 'Add new package' : `Edit ${editing.title}`}</DialogTitle>
              <DialogDescription>
                Edit package details below. Upload images directly or paste URLs.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <ImageUpload
                value={editing.heroImage}
                onChange={(url) => setEditing({ ...editing, heroImage: url })}
                subfolder="packages"
                label="Hero image"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="kashmir-dreams-5d"
                    disabled={!isNew}
                  />
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <Label>Region</Label>
                  <Select value={editing.region} onValueChange={(v) => setEditing({ ...editing, region: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input type="number" min={1} max={30} value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Nights</Label>
                  <Input type="number" min={0} max={29} value={editing.nights} onChange={(e) => setEditing({ ...editing, nights: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Rating</Label>
                  <Input type="number" step="0.1" min={0} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Price (Rs.)</Label>
                  <Input type="number" min={0} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </div>
                <div className="flex items-end justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <Label className="cursor-pointer">Featured package</Label>
                    <p className="text-xs text-muted-foreground">Show on home page</p>
                  </div>
                  <Switch checked={editing.featured} onCheckedChange={(c) => setEditing({ ...editing, featured: c })} />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>

              <div>
                <Label>Highlights (one per line)</Label>
                <Textarea
                  rows={4}
                  value={editing.highlights.join('\n')}
                  onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Night on a Dal Lake houseboat&#10;Gulmarg Gondola to 3,979m"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Inclusions (one per line)</Label>
                  <Textarea
                    rows={5}
                    value={editing.inclusions.join('\n')}
                    onChange={(e) => setEditing({ ...editing, inclusions: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="4 nights stay&#10;Daily breakfast & dinner"
                  />
                </div>
                <div>
                  <Label>Exclusions (one per line)</Label>
                  <Textarea
                    rows={5}
                    value={editing.exclusions.join('\n')}
                    onChange={(e) => setEditing({ ...editing, exclusions: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Airfare&#10;Lunches & beverages"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Day-by-day itinerary</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItineraryDay} className="gap-1.5">
                    <PlusIcon className="h-3.5 w-3.5" /> Add day
                  </Button>
                </div>
                <div className="space-y-2">
                  {editing.itinerary.map((d, idx) => (
                    <div key={idx} className="flex gap-2 rounded-lg border border-border/60 p-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          D{d.day}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItineraryDay(idx)}
                          className="mt-2 text-rose-500 hover:text-rose-600"
                          aria-label="Remove day"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Input
                          placeholder={`Day ${d.day} title`}
                          value={d.title}
                          onChange={(e) => updateItinerary(idx, 'title', e.target.value)}
                          className="h-9"
                        />
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          value={d.description}
                          onChange={(e) => updateItinerary(idx, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  {editing.itinerary.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      No itinerary days added yet. Click &quot;Add day&quot; above.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onSave} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isNew ? 'Create package' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete package?</DialogTitle>
            <DialogDescription>
              This will permanently delete this package from the database. Static seed packages cannot be deleted (only edited).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button variant="destructive" onClick={onDelete} className="gap-1.5">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
