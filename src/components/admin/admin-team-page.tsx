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
  ArrowLeft,
  X,
  GripVertical,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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

interface TeamMember {
  id?: string
  name: string
  role: string
  bio: string
  avatar: string
  order: number
  active: boolean
}

const emptyMember: TeamMember = {
  name: '',
  role: '',
  bio: '',
  avatar: '',
  order: 0,
  active: true,
}

export function AdminTeamPage() {
  const { navigate } = useApp()
  const { session, status } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<TeamMember | null>(null)
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
      const res = await fetch('/api/admin/team')
      const safeJson = async (r: Response, fallback: any) => {
        if (!r.ok) return fallback
        try { return await r.json() } catch { return fallback }
      }
      const data = await safeJson(res, [])
      setMembers(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }, [session])

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

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  )

  const startNew = () => {
    setEditing({ ...emptyMember, order: members.length + 1 })
    setIsNew(true)
  }

  const onSave = async () => {
    if (!editing) return
    if (!editing.name || !editing.role) {
      toast.error('Name and role are required')
      return
    }
    setSaving(true)
    try {
      const method = isNew ? 'POST' : 'PATCH'
      const body: any = { ...editing }
      if (!isNew && editing.id) body.id = editing.id
      const res = await fetch('/api/admin/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(isNew ? 'Team member added!' : 'Team member updated!')
      setEditing(null)
      refresh()
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/team?id=${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Team member deleted')
      setDeleteId(null)
      refresh()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <button onClick={() => navigate('crm')} className="mb-1 flex items-center gap-1.5 text-xs text-white/60 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to CRM
            </button>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Manage Team</h1>
            <p className="text-sm text-white/70">Edit team members shown on the Company page. Upload photos or use URL.</p>
          </div>
          <Button onClick={startNew} className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <Plus className="h-4 w-4" /> New member
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 font-display text-lg font-semibold">No team members found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click &quot;New member&quot; to add your first team member.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id || i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              >
                <Card className="overflow-hidden p-0 ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/40">
                  <div className="flex items-center gap-4 p-4">
                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-xl font-display font-bold text-primary overflow-hidden">
                      {m.avatar && m.avatar.startsWith('http') ? (
                        <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                      ) : m.avatar ? (
                        m.avatar.charAt(0).toUpperCase()
                      ) : (
                        m.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold">{m.name}</h3>
                        <Badge variant="outline" className="text-[10px]">{m.role}</Badge>
                        {!m.active && (
                          <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600">Inactive</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">Order: {m.order}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.bio}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing({ ...m }); setIsNew(false) }} aria-label="Edit">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {m.id && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-rose-500 hover:text-rose-600"
                          onClick={() => setDeleteId(m.id!)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isNew ? 'Add team member' : `Edit ${editing.name}`}</DialogTitle>
              <DialogDescription>
                Edit team member details. Upload a photo or paste a URL.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <ImageUpload
                value={editing.avatar}
                onChange={(url) => setEditing({ ...editing, avatar: url })}
                subfolder="team"
                label="Photo"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="e.g. Syed Shamshul Razvi"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Role / Title *</Label>
                  <Input
                    value={editing.role}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    placeholder="e.g. Founder & CEO"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  rows={4}
                  value={editing.bio}
                  onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  placeholder="Short bio - experience, languages, specialties..."
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Display order</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Lower numbers appear first on the Company page.</p>
                </div>
                <div className="flex items-end justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <Label className="cursor-pointer">Active</Label>
                    <p className="text-xs text-muted-foreground">Show on Company page</p>
                  </div>
                  <Switch checked={editing.active} onCheckedChange={(c) => setEditing({ ...editing, active: c })} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onSave} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isNew ? 'Add member' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete team member?</DialogTitle>
            <DialogDescription>
              This will permanently remove this team member from the database.
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
