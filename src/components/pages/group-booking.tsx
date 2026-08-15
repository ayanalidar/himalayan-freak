'use client'

import { useState } from 'react'
import { useSectionContent } from '@/lib/use-site-content'
import { motion } from 'framer-motion'
import {
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  IndianRupee,
  Sparkles,
  Briefcase,
  Heart,
  Utensils,
  Send,
  CheckCircle2,
  Info,
  Building2,
  Plane,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApp } from '@/lib/store'
import { destinations } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface RoomMate {
  name: string
  email: string
  phone: string
  diet: string
  emergencyContact: string
}

export function GroupBookingPage() {
  const { navigate } = useApp()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [refCode, setRefCode] = useState('')
  const heroBg = useSectionContent("group-booking", "hero", {
    image: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=2400&q=80",
    badge: "For 10+ travellers",
    title: "Group Booking Portal",
    description: "Planning a trip for 10 or more travellers? Get dedicated support, custom pricing, room-sharing roster, and a single point of contact from quote to departure.",
  })
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    // Organizer
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    organization: '',
    organizationType: 'Family',
    // Trip
    destinations: [] as string[],
    startDate: '',
    duration: 7,
    pax: 12,
    // Budget
    budgetPerPerson: 25000,
    budgetTotal: 300000,
    // Logistics
    roomSharing: 'Double',
    pickupRequired: true,
    mealPreference: 'Veg & Non-veg',
    specialMeals: '',
    // Add-ons
    addOns: [] as string[],
    photographer: false,
    guide: true,
    medical: true,
    // Notes
    notes: '',
    // Roommate roster
    roomMates: [] as RoomMate[],
  })

  const toggleDestination = (slug: string) => {
    setForm((f) => ({
      ...f,
      destinations: f.destinations.includes(slug)
        ? f.destinations.filter((d) => d !== slug)
        : [...f.destinations, slug],
    }))
  }

  const addRoomMate = () => {
    setForm((f) => ({
      ...f,
      roomMates: [...f.roomMates, { name: '', email: '', phone: '', diet: '', emergencyContact: '' }],
    }))
  }

  const updateRoomMate = (idx: number, field: keyof RoomMate, value: string) => {
    setForm((f) => ({
      ...f,
      roomMates: f.roomMates.map((rm, i) => i === idx ? { ...rm, [field]: value } : rm),
    }))
  }

  const onSubmit = async () => {
    if (!form.organizerName || !form.organizerEmail || !form.organizerPhone) {
      toast.error('Organizer details required')
      return
    }
    if (form.destinations.length === 0) {
      toast.error('Please select at least one destination')
      return
    }
    if (form.pax < 10) {
      toast.error('Group bookings require minimum 10 travellers')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/group-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setRefCode(data.refCode)
      setSuccess(true)
      toast.success('Group booking submitted!', {
        description: `Ref: ${data.refCode}. Our team will contact you within 24 hours.`,
      })
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center ring-1 ring-border/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Group booking received!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your group enquiry has been logged. Our team will reach out within 24 hours with a custom quote.
            </p>
            <div className="mt-5 rounded-xl bg-muted/40 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your reference code</div>
              <div className="mt-1 font-mono text-lg font-bold text-primary">{refCode}</div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate('home')}>
                Back to home
              </Button>
              <Button className="flex-1" onClick={() => navigate('dashboard')}>
                My dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={heroBg.image}
            alt="Group travel"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-amber-900/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 backdrop-blur">
              <Users className="mr-1.5 h-3 w-3" /> For 10+ travellers
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl text-balance">
              Group Booking Portal
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
              Planning a trip for 10 or more travellers? Get dedicated support, custom pricing,
              room-sharing roster, and a single point of contact from quote to departure.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl">
              {[
                { icon: IndianRupee, label: 'Group discount', value: 'Up to 18%' },
                { icon: Users, label: 'Dedicated manager', value: '1-on-1' },
                { icon: Briefcase, label: 'Corporate OK', value: 'GST invoice' },
                { icon: Heart, label: 'Senior-friendly', value: 'Wheelchair' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <s.icon className="h-4 w-4 text-amber-300" />
                  <div className="mt-1.5 text-[10px] uppercase tracking-wide text-white/60">{s.label}</div>
                  <div className="text-sm font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="mb-8 overflow-x-auto scrollbar-hidden">
          <div className="flex min-w-max items-center gap-2">
            {[
              { n: 1, label: 'Organizer' },
              { n: 2, label: 'Trip Details' },
              { n: 3, label: 'Logistics' },
              { n: 4, label: 'Roster' },
              { n: 5, label: 'Review' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <button
                  onClick={() => step >= s.n && setStep(s.n)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                    step === s.n ? 'bg-primary text-primary-foreground shadow' :
                    step > s.n ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <span className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    step === s.n ? 'bg-white/20' : step > s.n ? 'bg-primary text-primary-foreground' : 'bg-background'
                  )}>
                    {step > s.n ? <CheckCircle2 className="h-3 w-3" /> : s.n}
                  </span>
                  {s.label}
                </button>
                {i < 4 && <div className="h-0.5 w-6 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* STEP 1: ORGANIZER */}
          {step === 1 && (
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Organizer details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The main point of contact for this group. We will communicate trip updates, payments & itinerary changes via this person.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name *</Label>
                  <Input value={form.organizerName} onChange={(e) => setForm({ ...form, organizerName: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={form.organizerEmail} onChange={(e) => setForm({ ...form, organizerEmail: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Phone / WhatsApp *</Label>
                  <Input value={form.organizerPhone} onChange={(e) => setForm({ ...form, organizerPhone: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Organization (optional)</Label>
                  <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Company / Family name" className="mt-1.5" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Group type</Label>
                  <Select value={form.organizationType} onValueChange={(v) => setForm({ ...form, organizationType: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Family', 'Friends', 'Corporate', 'School / College', 'Religious Group', 'Travel Club', 'Wedding Party', 'Other'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* STEP 2: TRIP DETAILS */}
          {step === 2 && (
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Trip details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell us where you want to go and when.</p>

              <div className="mt-6">
                <Label>Destinations</Label>
                <p className="mt-1 text-xs text-muted-foreground">Select one or many - we&apos;ll connect them by road/flight.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {destinations.slice(0, 12).map((d) => {
                    const selected = form.destinations.includes(d.slug)
                    return (
                      <button
                        key={d.slug}
                        onClick={() => toggleDestination(d.slug)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all',
                          selected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40'
                        )}
                      >
                        <img src={d.heroImage} alt={d.name} className="h-10 w-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{d.name}</div>
                          <div className="text-[10px] text-muted-foreground">{d.region} · {d.duration}</div>
                        </div>
                        {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Start date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input type="number" min={2} max={30} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Number of travellers</Label>
                  <Input type="number" min={10} max={200} value={form.pax} onChange={(e) => setForm({ ...form, pax: Number(e.target.value) })} className="mt-1.5" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Minimum 10 for group rates</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Budget per person (₹)</Label>
                  <Input type="number" value={form.budgetPerPerson} onChange={(e) => {
                    const bpp = Number(e.target.value)
                    setForm({ ...form, budgetPerPerson: bpp, budgetTotal: bpp * form.pax })
                  }} className="mt-1.5" />
                </div>
                <div>
                  <Label>Total budget (₹)</Label>
                  <Input value={`₹${form.budgetTotal.toLocaleString('en-IN')}`} disabled className="mt-1.5 bg-muted/40" />
                </div>
              </div>
            </Card>
          )}

          {/* STEP 3: LOGISTICS */}
          {step === 3 && (
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Logistics & preferences</h2>
              <p className="mt-1 text-sm text-muted-foreground">Room sharing, meals and add-ons for the group.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Room sharing preference</Label>
                  <Select value={form.roomSharing} onValueChange={(v) => setForm({ ...form, roomSharing: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Single', 'Double', 'Triple', 'Family Suite', 'Mixed'].map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Meal preference</Label>
                  <Select value={form.mealPreference} onValueChange={(v) => setForm({ ...form, mealPreference: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Veg only', 'Veg & Non-veg', 'Jain meals', 'Halal only', 'Custom'].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label>Special meal requirements / allergies</Label>
                <Textarea
                  rows={2}
                  value={form.specialMeals}
                  onChange={(e) => setForm({ ...form, specialMeals: e.target.value })}
                  placeholder="e.g. 3 gluten-free, 2 Jain, 1 peanut allergy"
                  className="mt-1.5"
                />
              </div>

              <Separator className="my-6" />

              <Label>Add-ons for the group</Label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { id: 'photographer', label: 'Professional photographer', icon: Sparkles },
                  { id: 'guide', label: 'Local guide at each destination', icon: MapPin },
                  { id: 'medical', label: 'Medical kit + oxygen + nurse', icon: Heart },
                  { id: 'pickupRequired', label: 'Airport pickup & drop (all pax)', icon: Plane },
                ].map((opt) => {
                  const checked = (form as any)[opt.id]
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setForm({ ...form, [opt.id]: !checked } as any)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                        checked ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <opt.icon className="h-4 w-4 text-primary" />
                      <span className="flex-1">{opt.label}</span>
                      {checked && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6">
                <Label>Additional notes</Label>
                <Textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special requests - birthdays, accessibility, religious considerations, etc."
                  className="mt-1.5"
                />
              </div>
            </Card>
          )}

          {/* STEP 4: ROSTER */}
          {step === 4 && (
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold">Traveller roster</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add traveller details for room allocation, permits & emergency contacts.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addRoomMate} className="gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Add traveller
                </Button>
              </div>

              {form.roomMates.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-border/60 p-8 text-center">
                  <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-3 font-display text-base font-semibold">No travellers added yet</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional but recommended - you can also share the roster later via WhatsApp.
                  </p>
                  <Button className="mt-4 gap-1.5" onClick={addRoomMate}>
                    <Users className="h-3.5 w-3.5" /> Add first traveller
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {form.roomMates.map((rm, idx) => (
                    <div key={idx} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Traveller {idx + 1}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-rose-500"
                          onClick={() => setForm({ ...form, roomMates: form.roomMates.filter((_, i) => i !== idx) })}
                        >
                          ×
                        </Button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <Input placeholder="Name" value={rm.name} onChange={(e) => updateRoomMate(idx, 'name', e.target.value)} />
                        <Input placeholder="Email" value={rm.email} onChange={(e) => updateRoomMate(idx, 'email', e.target.value)} />
                        <Input placeholder="Phone" value={rm.phone} onChange={(e) => updateRoomMate(idx, 'phone', e.target.value)} />
                        <Input placeholder="Diet / allergy" value={rm.diet} onChange={(e) => updateRoomMate(idx, 'diet', e.target.value)} />
                        <Input placeholder="Emergency contact" value={rm.emergencyContact} onChange={(e) => updateRoomMate(idx, 'emergencyContact', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                <Info className="h-4 w-4 shrink-0" />
                <span>{form.roomMates.length} of {form.pax} travellers added. Remaining can be shared later.</span>
              </div>
            </Card>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <Card className="p-6 ring-1 ring-border/40 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Review & submit</h2>
              <p className="mt-1 text-sm text-muted-foreground">Quick summary of your group booking request.</p>

              <div className="mt-6 space-y-3">
                <ReviewRow icon={User} label="Organizer" value={`${form.organizerName} · ${form.organizerEmail} · ${form.organizerPhone}`} />
                <ReviewRow icon={Building2} label="Organization" value={form.organization || 'Personal'} />
                <ReviewRow icon={Users} label="Group type & size" value={`${form.organizationType} · ${form.pax} travellers`} />
                <ReviewRow icon={MapPin} label="Destinations" value={form.destinations.length > 0 ? form.destinations.join(', ') : 'None selected'} />
                <ReviewRow icon={Calendar} label="Trip dates" value={`${form.startDate || 'TBD'} · ${form.duration}D`} />
                <ReviewRow icon={IndianRupee} label="Budget" value={`₹${form.budgetPerPerson.toLocaleString('en-IN')}/pax · Total ₹${form.budgetTotal.toLocaleString('en-IN')}`} />
                <ReviewRow icon={Utensils} label="Meals" value={form.mealPreference} />
                <ReviewRow icon={Briefcase} label="Room sharing" value={form.roomSharing} />
                <ReviewRow icon={Users} label="Roster" value={`${form.roomMates.length} travellers added`} />
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated group cost</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-primary">
                    ₹{(form.budgetPerPerson * form.pax * 0.85).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted-foreground">after ~15% group discount</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Final quote shared within 24 hours after our team reviews your request.
                </p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Nav buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            ← Back
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)}>Continue →</Button>
          ) : (
            <Button onClick={onSubmit} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit group booking
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  )
}
