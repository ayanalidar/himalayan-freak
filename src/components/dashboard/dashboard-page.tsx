'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  LayoutDashboard,
  Plane,
  Heart,
  CalendarCheck,
  FileText,
  Star,
  Clock,
  IndianRupee,
  Sparkles,
  Loader2,
  Users,
  MapPin,
  Trash2,
  Compass,
  LogIn,
  Edit,
  Save,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApp } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

type Dashboard = {
  user: { name: string; email: string; phone?: string; image?: string | null }
  stats: {
    totalBookings: number
    upcomingTrips: number
    customTrips: number
    savedDestinations: number
    reviews: number
    documents: number
    totalSpent: number
  }
  bookings: any[]
  customTrips: any[]
  savedDestinations: any[]
  reviews: any[]
  documents: any[]
}

export function DashboardPage() {
  const { session, status } = useAuth()
  const { navigate } = useApp()
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profile, setProfile] = useState({ name: '', phone: '', city: '', state: '' })

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/user')
      if (!res.ok) throw new Error('Failed')
      const d = await res.json()
      setData(d)
      setProfile({
        name: d.user?.name || '',
        phone: (d.user as any)?.phone || '',
        city: (d.user as any)?.city || '',
        state: (d.user as any)?.state || '',
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') refresh()
    else if (status === 'unauthenticated') setLoading(false)
  }, [status, refresh])

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center ring-1 ring-border/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">Please sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personal dashboard is available after you sign in. Save destinations, build trips, view bookings & documents.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button onClick={() => navigate('login')} className="gap-1.5">
              <LogIn className="h-4 w-4" /> Sign in
            </Button>
            <Button variant="outline" onClick={() => navigate('signup')}>
              Sign up
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const initials = data.user?.name
    ? data.user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  const onSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Profile updated!')
      setEditingProfile(false)
      refresh()
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const removeSaved = async (id: string) => {
    try {
      await fetch('/api/saved', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast.success('Removed from saved')
      refresh()
    } catch {
      toast.error('Failed to remove')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-amber-400/40">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 font-display text-xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-display text-3xl font-bold text-white">
                  Hi, {data.user?.name?.split(' ')[0] || 'Traveller'}!
                </h1>
                <p className="text-sm text-white/70">{data.user?.email}</p>
                {(data.user as any)?.role === 'admin' && (
                  <Badge className="mt-1 bg-amber-500/20 text-amber-300">Admin access</Badge>
                )}
              </div>
            </div>
            <Button onClick={() => navigate('trip-planner')} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <Sparkles className="h-4 w-4" /> Plan a new trip
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard icon={CalendarCheck} label="Bookings" value={data.stats.totalBookings.toString()} />
          <StatCard icon={Clock} label="Upcoming trips" value={data.stats.upcomingTrips.toString()} />
          <StatCard icon={Heart} label="Saved destinations" value={data.stats.savedDestinations.toString()} />
          <StatCard icon={IndianRupee} label="Total spent" value={`₹${data.stats.totalSpent.toLocaleString('en-IN')}`} />
        </div>

        <Tabs defaultValue="trips">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 bg-muted p-1">
            <TabsTrigger value="trips" className="flex-1 gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5" /> My Bookings
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex-1 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Saved Itineraries
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 gap-1.5">
              <Heart className="h-3.5 w-3.5" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex-1 gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Documents
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 gap-1.5">
              <Star className="h-3.5 w-3.5" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 gap-1.5">
              <Edit className="h-3.5 w-3.5" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* BOOKINGS */}
          <TabsContent value="trips">
            <Card className="overflow-hidden ring-1 ring-border/40">
              {data.bookings.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No bookings yet"
                  desc="Build a trip with our Trip Planner and your booking will appear here."
                  cta="Plan a trip"
                  onClick={() => navigate('trip-planner')}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ref</TableHead>
                      <TableHead>Trip</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className="text-right">Pax</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell><span className="font-mono text-xs">{b.refCode}</span></TableCell>
                        <TableCell className="font-medium">{b.tripName}</TableCell>
                        <TableCell className="text-xs">{b.startDate} → {b.endDate}</TableCell>
                        <TableCell className="text-right">{b.pax}</TableCell>
                        <TableCell className="text-right font-medium">₹{b.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{b.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* SAVED ITINERARIES (custom trips) */}
          <TabsContent value="custom">
            <Card className="p-6 ring-1 ring-border/40">
              {data.customTrips.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No saved itineraries"
                  desc="Use the Trip Planner to design a custom journey — your drafts will appear here."
                  cta="Open Trip Planner"
                  onClick={() => navigate('trip-planner')}
                />
              ) : (
                <div className="space-y-3">
                  {data.customTrips.map((t) => (
                    <div key={t.id} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{t.name}</span>
                            <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {t.startDate} · {t.duration}D · {t.pax} pax
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {JSON.parse(t.destinations || '[]').slice(0, 4).map((d: string) => (
                              <Badge key={d} variant="outline" className="text-[10px] gap-1">
                                <MapPin className="h-2.5 w-2.5" /> {d}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-lg font-bold text-primary">
                            ₹{t.estimatedPrice.toLocaleString('en-IN')}
                          </div>
                          <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={() => navigate('trip-planner')}>
                            <Compass className="h-3 w-3" /> Refine
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* SAVED DESTINATIONS */}
          <TabsContent value="saved">
            <Card className="p-6 ring-1 ring-border/40">
              {data.savedDestinations.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="Your wishlist is empty"
                  desc="Save destinations you want to visit — they appear here for quick access."
                  cta="Browse destinations"
                  onClick={() => navigate('destinations')}
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {data.savedDestinations.map((s) => (
                    <div
                      key={s.id}
                      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:shadow-md"
                    >
                      {s.destination && (
                        <>
                          <div className="relative aspect-video">
                            <img
                              src={s.destination.heroImage}
                              alt={s.destination.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-2 left-3 right-3">
                              <div className="font-display text-base font-bold text-white">{s.destination.name}</div>
                              <div className="text-[10px] text-white/80">{s.destination.state}</div>
                            </div>
                            <button
                              onClick={() => removeSaved(s.id)}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-rose-500"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full gap-1.5"
                              onClick={() => {
                                useApp.getState().openDestination(s.destination.slug)
                              }}
                            >
                              View details <MapPin className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* DOCUMENTS */}
          <TabsContent value="documents">
            <Card className="p-6 ring-1 ring-border/40">
              {data.documents.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No documents yet"
                  desc="Itineraries, vouchers, tickets and invoices will appear here once you book a trip."
                  cta="Plan a trip"
                  onClick={() => navigate('trip-planner')}
                />
              ) : (
                <div className="space-y-2">
                  {data.documents.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.type}</div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{d.status}</Badge>
                      <Button size="sm" variant="ghost" className="gap-1.5">Download</Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews">
            <Card className="p-6 ring-1 ring-border/40">
              {data.reviews.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title="No reviews yet"
                  desc="Visit a destination or package you've been to and share your experience."
                  cta="Browse destinations"
                  onClick={() => navigate('destinations')}
                />
              ) : (
                <div className="space-y-3">
                  {data.reviews.map((r) => (
                    <div key={r.id} className="rounded-lg border border-border/60 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={i < r.rating ? 'h-3.5 w-3.5 fill-amber-400 text-amber-400' : 'h-3.5 w-3.5 text-muted'}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {r.approved ? 'Published' : 'Pending approval'}
                        </Badge>
                      </div>
                      <div className="mt-2 font-medium text-sm">{r.title}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile">
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Your profile</h2>
                  <p className="text-sm text-muted-foreground">Update your details — we use these to plan better trips for you.</p>
                </div>
                {!editingProfile && (
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditingProfile(true)}>
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                )}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Full name</Label>
                  <Input
                    value={profile.name}
                    disabled={!editingProfile}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</Label>
                  <Input value={data.user.email || ''} disabled className="mt-1.5 bg-muted/40" />
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</Label>
                  <Input
                    value={profile.phone}
                    disabled={!editingProfile}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">City</Label>
                  <Input
                    value={profile.city}
                    disabled={!editingProfile}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">State</Label>
                  <Input
                    value={profile.state}
                    disabled={!editingProfile}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
              {editingProfile && (
                <div className="mt-6 flex gap-2">
                  <Button onClick={onSaveProfile} className="gap-1.5">
                    <Save className="h-4 w-4" /> Save changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProfile(false)} className="gap-1.5">
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="p-5 ring-1 ring-border/40">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </Card>
  )
}

function EmptyState({ icon: Icon, title, desc, cta, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; cta: string; onClick: () => void }) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{desc}</p>
      <Button className="mt-4 gap-1.5" onClick={onClick}>
        {cta}
      </Button>
    </div>
  )
}
