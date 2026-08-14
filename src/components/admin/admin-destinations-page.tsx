'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Star,
  Mountain,
  MapPin,
  Image as ImageIcon,
  ChevronRight,
  ArrowLeft,
  Calendar,
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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Destination = {
  id?: string
  slug: string
  name: string
  region: string
  state: string
  elevation: number
  latitude: number
  longitude: number
  tagline: string
  description: string
  bestTime: string
  duration: string
  difficulty: string
  rating: number
  heroImage: string
  gallery: string[]
  attractions: string[]
  activities: string[]
  howToReach: string
  featured: boolean
  isCustom?: boolean
}

const regions = ['Kashmir', 'Jammu', 'Ladakh', 'Himachal', 'Uttarakhand']
const difficulties = ['Easy', 'Moderate', 'Challenging']

export function AdminDestinationsPage() {
  const { navigate } = useApp()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Destination | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/destinations')
      // Admin endpoint may return only DB-edited ones; also fetch the full public list
      const [adminRes, pubRes] = await Promise.all([
        fetch('/api/admin/destinations'),
        fetch('/api/destinations'),
      ])
      const adminList = await adminRes.json()
      const pubList = await pubRes.json()
      // Merge: prefer admin (DB) records, then add public ones not in DB
      const adminSlugs = new Set(adminList.map((d: Destination) => d.slug))
      const merged = [...adminList, ...pubList.filter((d: Destination) => !adminSlugs.has(d.slug))]
      setDestinations(merged)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.region.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase())
  )

  const startNew = () => {
    setEditing({
      slug: '',
      name: '',
      region: 'Kashmir',
      state: 'Jammu & Kashmir',
      elevation: 1500,
      latitude: 34.0,
      longitude: 74.5,
      tagline: '',
      description: '',
      bestTime: '',
      duration: '2-3 days',
      difficulty: 'Easy',
      rating: 4.5,
      heroImage: '',
      gallery: [],
      attractions: [],
      activities: [],
      howToReach: '',
      featured: false,
    })
    setIsNew(true)
  }

  const onEdit = (d: Destination) => {
    setEditing({ ...d })
    setIsNew(false)
  }

  const onSave = async () => {
    if (!editing) return
    if (!editing.slug || !editing.name) {
      toast.error('Slug and name are required')
      return
    }
    try {
      const method = isNew ? 'POST' : 'PATCH'
      const body: any = { ...editing }
      if (!isNew && editing.id) body.id = editing.id
      const res = await fetch('/api/admin/destinations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(isNew ? 'Destination created!' : 'Destination updated!')
      setEditing(null)
      refresh()
    } catch {
      toast.error('Save failed')
    }
  }

  const onDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/destinations?id=${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Destination deleted')
      setDeleteId(null)
      refresh()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <button onClick={() => navigate('crm')} className="mb-1 flex items-center gap-1.5 text-xs text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to CRM
            </button>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Manage Destinations</h1>
            <p className="text-sm text-white/70">Edit existing destinations, add new ones, or upload new images.</p>
          </div>
          <Button onClick={startNew} className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <Plus className="h-4 w-4" /> New destination
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((d, i) => (
              <motion.div
                key={d.slug + i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              >
                <Card className="overflow-hidden p-0 ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/40">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative aspect-video w-full sm:h-32 sm:w-48 sm:shrink-0">
                      <img
                        src={d.heroImage || 'https://placehold.co/400x300?text=No+Image'}
                        alt={d.name}
                        className="h-full w-full object-cover"
                      />
                      {d.featured && (
                        <Badge className="absolute left-2 top-2 bg-amber-500 text-white">★ Featured</Badge>
                      )}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-base font-bold">{d.name}</h3>
                            <Badge variant="outline" className="text-[10px]">{d.region}</Badge>
                            {d.isCustom && (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                                Edited
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{d.tagline}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mountain className="h-3 w-3" /> {d.elevation?.toLocaleString()}m
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {d.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {d.rating?.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {d.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(d)} aria-label="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {d.id && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-rose-500 hover:text-rose-600"
                              onClick={() => setDeleteId(d.id!)}
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
                <p className="text-sm text-muted-foreground">No destinations match your search.</p>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      {editing && (
        <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isNew ? 'Add new destination' : `Edit ${editing.name}`}</DialogTitle>
              <DialogDescription>
                Edit fields below. Image URLs can be any public image link (Unsplash, your CDN, etc.).
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Image preview */}
              {editing.heroImage && (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img src={editing.heroImage} alt="Preview" className="h-full w-full object-cover" />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => setEditing({ ...editing, heroImage: '' })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="srinagar"
                    disabled={!isNew}
                  />
                </div>
                <div>
                  <Label>Name *</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
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
                  <Label>State</Label>
                  <Input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select value={editing.difficulty} onValueChange={(v) => setEditing({ ...editing, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {difficulties.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <Label>Elevation (m)</Label>
                  <Input type="number" value={editing.elevation} onChange={(e) => setEditing({ ...editing, elevation: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input type="number" step="0.0001" value={editing.latitude} onChange={(e) => setEditing({ ...editing, latitude: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input type="number" step="0.0001" value={editing.longitude} onChange={(e) => setEditing({ ...editing, longitude: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Rating</Label>
                  <Input type="number" step="0.1" min={0} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <Label>Tagline</Label>
                <Input value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} placeholder="The Venice of the East" />
              </div>

              <div>
                <Label>Hero image URL</Label>
                <Input value={editing.heroImage} onChange={(e) => setEditing({ ...editing, heroImage: e.target.value })} placeholder="https://images.unsplash.com/..." />
                <p className="mt-1 text-xs text-muted-foreground">Paste any public image URL. Use Unsplash, your CDN, or upload to /public and reference as /your-image.jpg.</p>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Best time to visit</Label>
                  <Input value={editing.bestTime} onChange={(e) => setEditing({ ...editing, bestTime: e.target.value })} />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="3-4 days" />
                </div>
              </div>

              <div>
                <Label>How to reach</Label>
                <Textarea rows={3} value={editing.howToReach} onChange={(e) => setEditing({ ...editing, howToReach: e.target.value })} />
              </div>

              {/* Gallery URLs */}
              <div>
                <Label>Gallery image URLs (one per line)</Label>
                <Textarea
                  rows={4}
                  value={editing.gallery.join('\n')}
                  onChange={(e) => setEditing({ ...editing, gallery: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="https://...&#10;https://..."
                />
              </div>

              {/* Attractions (array) */}
              <div>
                <Label>Top attractions (one per line)</Label>
                <Textarea
                  rows={4}
                  value={editing.attractions.join('\n')}
                  onChange={(e) => setEditing({ ...editing, attractions: e.target.value.split('\n').filter(Boolean) })}
                />
              </div>

              {/* Activities */}
              <div>
                <Label>Activities (one per line)</Label>
                <Textarea
                  rows={4}
                  value={editing.activities.join('\n')}
                  onChange={(e) => setEditing({ ...editing, activities: e.target.value.split('\n').filter(Boolean) })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <div>
                  <Label className="cursor-pointer">Featured destination</Label>
                  <p className="text-xs text-muted-foreground">Show on the home page&apos;s featured grid</p>
                </div>
                <Switch checked={editing.featured} onCheckedChange={(c) => setEditing({ ...editing, featured: c })} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onSave} className="gap-1.5">
                <Save className="h-4 w-4" /> {isNew ? 'Create destination' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete destination?</DialogTitle>
            <DialogDescription>
              This will permanently delete this destination from the database. Static seed destinations cannot be deleted (only edited).
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
